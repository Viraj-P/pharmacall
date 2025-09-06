import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { VoiceAgentFactory, getDefaultVoiceConfig } from '@/lib/voice-agents'
import { CallInitiationRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    
    const body: CallInitiationRequest = await request.json()
    const { patient_id, call_type, scheduled_at, custom_prompt } = body

    // Get patient information
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, encrypted_phone, organization_id')
      .eq('id', patient_id)
      .eq('organization_id', user.organization_id)
      .single()

    if (patientError || !patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    // Get pharmacist phone number (in production, this would be from user profile)
    const pharmacistPhone = process.env.PHARMACIST_PHONE_NUMBER || '+1234567890'

    // Create call record first
    const { data: call, error: callError } = await supabase
      .from('voice_calls')
      .insert({
        organization_id: user.organization_id,
        patient_id,
        pharmacist_id: user.id,
        call_type,
        status: 'scheduled',
        scheduled_at: scheduled_at || new Date().toISOString(),
        structured_data: {
          custom_prompt
        }
      })
      .select()
      .single()

    if (callError) {
      return NextResponse.json({ error: callError.message }, { status: 500 })
    }

    try {
      // Get voice agent configuration
      const voiceConfig = getDefaultVoiceConfig()
      const voiceAgent = VoiceAgentFactory.createAgent(voiceConfig)

      // Initiate the call
      const result = await voiceAgent.initiateCall(
        patient.encrypted_phone, // In production, this would be decrypted
        pharmacistPhone,
        body,
        call
      )

      // Update call with external call ID
      await supabase
        .from('voice_calls')
        .update({
          external_call_id: result.call_id,
          status: 'in_progress'
        })
        .eq('id', call.id)

      // Log the call initiation
      await supabase
        .from('call_logs')
        .insert({
          call_id: call.id,
          organization_id: user.organization_id,
          event_type: 'call_initiated',
          event_data: {
            pharmacist_id: user.id,
            call_type,
            external_call_id: result.call_id,
            voice_provider: voiceConfig.provider
          }
        })

      return NextResponse.json({
        call_id: call.id,
        external_call_id: result.call_id,
        status: result.status
      })
    } catch (voiceError) {
      // Update call status to failed
      await supabase
        .from('voice_calls')
        .update({ status: 'failed' })
        .eq('id', call.id)

      // Log the error
      await supabase
        .from('call_logs')
        .insert({
          call_id: call.id,
          organization_id: user.organization_id,
          event_type: 'call_failed',
          event_data: {
            error: voiceError instanceof Error ? voiceError.message : 'Unknown error'
          }
        })

      return NextResponse.json(
        { error: 'Failed to initiate voice call' },
        { status: 500 }
      )
    }
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
