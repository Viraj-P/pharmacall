import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CallWebhookPayload } from '@/types'

// Verify webhook signature for security
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // Implementation depends on your voice provider
  // This is a placeholder - implement based on your provider's requirements
  return true
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-signature') || ''
    const body = await request.text()
    
    // Verify webhook signature
    const webhookSecret = process.env.VOICE_WEBHOOK_SECRET
    if (!webhookSecret || !verifyWebhookSignature(body, signature, webhookSecret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload: CallWebhookPayload = JSON.parse(body)
    const supabase = await createClient()

    // Find the call by external_call_id
    const { data: call, error: fetchError } = await supabase
      .from('voice_calls')
      .select('id, organization_id, status')
      .eq('external_call_id', payload.call_id)
      .single()

    if (fetchError || !call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 })
    }

    // Update call with webhook data
    const updateData: any = {
      status: payload.status
    }

    if (payload.transcript) {
      updateData.transcript = payload.transcript
    }

    if (payload.recording_url) {
      updateData.recording_url = payload.recording_url
    }

    if (payload.structured_data) {
      updateData.structured_data = payload.structured_data
    }

    if (payload.ai_insights) {
      updateData.ai_insights = payload.ai_insights
    }

    if (payload.duration_seconds) {
      updateData.duration_seconds = payload.duration_seconds
    }

    // Set timestamps based on status
    if (payload.status === 'in_progress' && !call.status.includes('in_progress')) {
      updateData.started_at = new Date().toISOString()
    }
    if (payload.status === 'completed' && !call.status.includes('completed')) {
      updateData.completed_at = new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .from('voice_calls')
      .update(updateData)
      .eq('id', call.id)

    if (updateError) {
      console.error('Failed to update call:', updateError)
      return NextResponse.json({ error: 'Failed to update call' }, { status: 500 })
    }

    // Log the webhook event
    await supabase
      .from('call_logs')
      .insert({
        call_id: call.id,
        organization_id: call.organization_id,
        event_type: 'webhook_received',
        event_data: {
          provider: 'voice_agent',
          payload: payload
        }
      })

    // Trigger email notifications if call completed
    if (payload.status === 'completed') {
      // Queue email notification
      await supabase
        .from('email_notifications')
        .insert({
          organization_id: call.organization_id,
          call_id: call.id,
          email_type: 'call_completed',
          status: 'pending'
        })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
