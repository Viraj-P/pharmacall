import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const headersList = await headers()
    
    // Verify webhook signature (implement based on your voice provider)
    const signature = headersList.get('x-webhook-signature')
    const webhookSecret = process.env.VOICE_WEBHOOK_SECRET
    
    if (webhookSecret && signature) {
      // Implement signature verification based on your voice provider
      // This is a simplified example - implement proper verification
      const expectedSignature = `sha256=${Buffer.from(JSON.stringify(body)).toString('base64')}`
      if (signature !== expectedSignature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const supabase = await createClient()
    
    // Extract call information from webhook payload
    const { 
      call_id, 
      status, 
      transcript, 
      recording_url, 
      structured_data, 
      ai_insights, 
      duration_seconds,
      metadata 
    } = body

    if (!call_id) {
      return NextResponse.json({ error: 'call_id is required' }, { status: 400 })
    }

    // Find the call record
    const { data: call, error: callError } = await supabase
      .from('voice_calls')
      .select('id, organization_id, status')
      .eq('external_call_id', call_id)
      .single()

    if (callError || !call) {
      console.error('Call not found:', call_id)
      return NextResponse.json({ error: 'Call not found' }, { status: 404 })
    }

    // Update call record
    const updateData: any = {
      status: status || 'completed',
      updated_at: new Date().toISOString()
    }

    if (transcript) {
      updateData.transcript = transcript
    }

    if (recording_url) {
      updateData.recording_url = recording_url
    }

    if (structured_data) {
      updateData.structured_data = structured_data
    }

    if (ai_insights) {
      updateData.ai_insights = ai_insights
    }

    if (duration_seconds) {
      updateData.duration_seconds = duration_seconds
    }

    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    } else if (status === 'in_progress') {
      updateData.started_at = new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .from('voice_calls')
      .update(updateData)
      .eq('id', call.id)

    if (updateError) {
      console.error('Error updating call:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Log the webhook event
    await supabase
      .from('call_logs')
      .insert({
        call_id: call.id,
        organization_id: call.organization_id,
        event_type: 'webhook_received',
        event_data: {
          external_call_id: call_id,
          status,
          has_transcript: !!transcript,
          has_recording: !!recording_url,
          duration_seconds
        }
      })

    // If call is completed, trigger any follow-up actions
    if (status === 'completed') {
      // Send completion notification email
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/process`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'call_completed',
            call_id: call.id,
            organization_id: call.organization_id
          })
        })
      } catch (emailError) {
        console.error('Error sending completion email:', emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}