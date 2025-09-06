import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { emailService } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get all active users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role, organization_id')
      .not('email', 'is', null)

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 })
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'No users found' })
    }

    const results = []

    for (const user of users) {
      try {
        // Get yesterday's call statistics for this user's organization
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)
        
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const { data: calls, error: callsError } = await supabase
          .from('voice_calls')
          .select('status, duration_seconds')
          .eq('organization_id', user.organization_id)
          .gte('created_at', yesterday.toISOString())
          .lt('created_at', today.toISOString())

        if (callsError) {
          console.error(`Failed to fetch calls for user ${user.id}:`, callsError)
          continue
        }

        const totalCalls = calls?.length || 0
        const completedCalls = calls?.filter(call => call.status === 'completed').length || 0
        const pendingCalls = calls?.filter(call => ['scheduled', 'in_progress'].includes(call.status)).length || 0
        const successRate = totalCalls > 0 ? (completedCalls / totalCalls) * 100 : 0

        // Only send summary if there were calls
        if (totalCalls > 0) {
          await emailService.sendDailySummary(user as any, {
            totalCalls,
            completedCalls,
            pendingCalls,
            successRate
          })

          results.push({
            user_id: user.id,
            email: user.email,
            total_calls: totalCalls,
            status: 'sent'
          })
        } else {
          results.push({
            user_id: user.id,
            email: user.email,
            total_calls: 0,
            status: 'skipped'
          })
        }

      } catch (emailError) {
        console.error(`Failed to send daily summary for user ${user.id}:`, emailError)
        results.push({
          user_id: user.id,
          email: user.email,
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
    console.error('Daily summary error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
