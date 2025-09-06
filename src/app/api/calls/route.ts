import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const callType = searchParams.get('call_type')

    let query = supabase
      .from('voice_calls')
      .select(`
        id,
        call_type,
        status,
        duration_seconds,
        created_at,
        completed_at,
        scheduled_at,
        started_at,
        transcript,
        structured_data,
        ai_insights,
        patients!inner(
          id,
          encrypted_phone,
          patient_id_hash
        )
      `)
      .eq('organization_id', user.organization_id)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (callType) {
      query = query.eq('call_type', callType)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data: calls, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ calls: calls || [] })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    
    const body = await request.json()
    const { patient_id, call_type, scheduled_at, custom_prompt } = body

    // Validate required fields
    if (!patient_id || !call_type) {
      return NextResponse.json(
        { error: 'patient_id and call_type are required' },
        { status: 400 }
      )
    }

    // Verify patient belongs to organization
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('id', patient_id)
      .eq('organization_id', user.organization_id)
      .single()

    if (patientError || !patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    // Create call record
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

    // Log the call creation
    await supabase
      .from('call_logs')
      .insert({
        call_id: call.id,
        organization_id: user.organization_id,
        event_type: 'call_created',
        event_data: {
          pharmacist_id: user.id,
          call_type,
          scheduled_at: call.scheduled_at
        }
      })

    return NextResponse.json({ call })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}