import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { CallInitiationRequest } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const callType = searchParams.get('call_type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let query = supabase
      .from('voice_calls')
      .select(`
        *,
        patients!inner(
          id,
          encrypted_phone,
          encrypted_name,
          patient_id_hash
        ),
        users!voice_calls_pharmacist_id_fkey(
          id,
          email
        )
      `)
      .eq('organization_id', user.organization_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    if (callType) {
      query = query.eq('call_type', callType)
    }

    const { data: calls, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      calls,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    
    const body: CallInitiationRequest = await request.json()
    const { patient_id, call_type, scheduled_at, custom_prompt } = body

    // Verify patient belongs to user's organization
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, organization_id')
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
          scheduled_at: call.scheduled_at
        }
      })

    // TODO: Trigger voice agent API call here
    // This would integrate with Retell/Vapi/Twilio

    return NextResponse.json({ call }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
