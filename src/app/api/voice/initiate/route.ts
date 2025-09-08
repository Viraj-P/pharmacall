import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { VoiceAgentFactory, getDefaultVoiceConfig } from '@/lib/voice-agents'

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    const body = await request.json()
    
    const { patient_phone, call_type, custom_prompt } = body

    if (!patient_phone || !call_type) {
      return NextResponse.json(
        { error: 'Patient phone and call type are required' },
        { status: 400 }
      )
    }

    // Create a patient record if it doesn't exist
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('id')
      .eq('organization_id', user.organization_id)
      .eq('encrypted_phone', patient_phone)
      .single()

    let patientId = existingPatient?.id

    if (!patientId) {
      const { data: newPatient, error: patientError } = await supabase
        .from('patients')
        .insert({
          organization_id: user.organization_id,
          encrypted_phone: patient_phone,
          patient_id_hash: `patient_${Date.now()}`,
          medications: [],
          preferences: {}
        })
        .select('id')
        .single()

      if (patientError) {
        console.error('Error creating patient:', patientError)
        return NextResponse.json({ error: 'Failed to create patient record' }, { status: 500 })
      }

      patientId = newPatient.id
    }

    // Create voice call record
    const { data: callRecord, error: callError } = await supabase
      .from('voice_calls')
      .insert({
        organization_id: user.organization_id,
        patient_id: patientId,
        pharmacist_id: user.id,
        call_type,
        status: 'scheduled',
        structured_data: {},
        ai_insights: {}
      })
      .select('id')
      .single()

    if (callError) {
      console.error('Error creating call record:', callError)
      return NextResponse.json({ error: 'Failed to create call record' }, { status: 500 })
    }

    // Initialize voice agent
    const voiceConfig = getDefaultVoiceConfig()
    const voiceAgent = VoiceAgentFactory.createAgent(voiceConfig)

    // For demo purposes, we'll use a placeholder pharmacist phone
    // In production, this would come from the user's profile
    const pharmacistPhone = '+15551234567' // This should be configurable

    try {
      const result = await voiceAgent.initiateCall(
        patient_phone,
        pharmacistPhone,
        {
          patient_id: patientId,
          call_type,
          custom_prompt
        },
        {
          id: callRecord.id,
          organization_id: user.organization_id,
          patient_id: patientId,
          pharmacist_id: user.id,
          call_type,
          status: 'scheduled',
          structured_data: {},
          ai_insights: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      )

      // Update call record with external call ID
      await supabase
        .from('voice_calls')
        .update({
          external_call_id: result.call_id,
          status: 'in_progress'
        })
        .eq('id', callRecord.id)

      return NextResponse.json({
        call_id: result.call_id,
        status: result.status,
        message: 'Call initiated successfully'
      })
    } catch (voiceError) {
      console.error('Error initiating voice call:', voiceError)
      
      // Update call status to failed
      await supabase
        .from('voice_calls')
        .update({ status: 'failed' })
        .eq('id', callRecord.id)

      return NextResponse.json(
        { error: 'Failed to initiate voice call' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in voice initiate API:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
