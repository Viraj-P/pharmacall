import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    
    const { data: call, error } = await supabase
      .from('voice_calls')
      .select(`
        *,
        patients!inner(
          id,
          encrypted_phone,
          encrypted_name,
          patient_id_hash,
          medications,
          preferences
        ),
        users!voice_calls_pharmacist_id_fkey(
          id,
          email
        ),
        call_logs(
          id,
          event_type,
          event_data,
          created_at
        )
      `)
      .eq('id', params.id)
      .eq('organization_id', user.organization_id)
      .single()

    if (error || !call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 })
    }

    return NextResponse.json({ call })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    
    const body = await request.json()
    const { status, transcript, structured_data, ai_insights, recording_url, duration_seconds } = body

    // Verify call belongs to user's organization
    const { data: existingCall, error: fetchError } = await supabase
      .from('voice_calls')
      .select('id, organization_id, status')
      .eq('id', params.id)
      .eq('organization_id', user.organization_id)
      .single()

    if (fetchError || !existingCall) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 })
    }

    // Update call
    const updateData: any = {}
    if (status) updateData.status = status
    if (transcript) updateData.transcript = transcript
    if (structured_data) updateData.structured_data = structured_data
    if (ai_insights) updateData.ai_insights = ai_insights
    if (recording_url) updateData.recording_url = recording_url
    if (duration_seconds) updateData.duration_seconds = duration_seconds

    // Set timestamps based on status
    if (status === 'in_progress' && !existingCall.status.includes('in_progress')) {
      updateData.started_at = new Date().toISOString()
    }
    if (status === 'completed' && !existingCall.status.includes('completed')) {
      updateData.completed_at = new Date().toISOString()
    }

    const { data: call, error } = await supabase
      .from('voice_calls')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log the update
    await supabase
      .from('call_logs')
      .insert({
        call_id: params.id,
        organization_id: user.organization_id,
        event_type: 'call_updated',
        event_data: {
          updated_by: user.id,
          changes: updateData
        }
      })

    return NextResponse.json({ call })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    
    // Verify call belongs to user's organization
    const { data: existingCall, error: fetchError } = await supabase
      .from('voice_calls')
      .select('id, organization_id, status')
      .eq('id', params.id)
      .eq('organization_id', user.organization_id)
      .single()

    if (fetchError || !existingCall) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 })
    }

    // Only allow deletion of scheduled calls
    if (existingCall.status !== 'scheduled') {
      return NextResponse.json({ error: 'Can only delete scheduled calls' }, { status: 400 })
    }

    const { error } = await supabase
      .from('voice_calls')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Call deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
