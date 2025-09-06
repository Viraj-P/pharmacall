import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { emailService } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get pending email notifications
    const { data: notifications, error } = await supabase
      .from('email_notifications')
      .select(`
        *,
        users!inner(
          id,
          email,
          role,
          organization_id
        ),
        voice_calls!inner(
          id,
          call_type,
          status,
          completed_at,
          duration_seconds,
          transcript,
          structured_data,
          updated_at,
          patients!inner(
            encrypted_name,
            patient_id_hash
          )
        )
      `)
      .eq('status', 'pending')
      .limit(10)

    if (error) {
      console.error('Failed to fetch email notifications:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!notifications || notifications.length === 0) {
      return NextResponse.json({ message: 'No pending notifications' })
    }

    const results = []

    for (const notification of notifications) {
      try {
        const user = notification.users
        const call = notification.voice_calls
        const patientName = call.patients.encrypted_name || undefined

        // Send email based on type
        switch (notification.email_type) {
          case 'call_completed':
            await emailService.sendCallCompletedNotification(user, call, patientName)
            break
          
          case 'call_scheduled':
            await emailService.sendCallScheduledNotification(user, call, patientName)
            break
          
          case 'call_failed':
            await emailService.sendCallFailedNotification(
              user, 
              call, 
              'Call failed to complete', 
              patientName
            )
            break
          
          default:
            console.warn(`Unknown email type: ${notification.email_type}`)
            continue
        }

        // Update notification status
        await supabase
          .from('email_notifications')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', notification.id)

        results.push({
          id: notification.id,
          status: 'sent',
          email_type: notification.email_type
        })

      } catch (emailError) {
        console.error(`Failed to send email for notification ${notification.id}:`, emailError)
        
        // Update notification status to failed
        await supabase
          .from('email_notifications')
          .update({
            status: 'failed',
            error_message: emailError instanceof Error ? emailError.message : 'Unknown error'
          })
          .eq('id', notification.id)

        results.push({
          id: notification.id,
          status: 'failed',
          error: emailError instanceof Error ? emailError.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      processed: results.length,
      results
    })
  } catch (error) {
    console.error('Email processing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
