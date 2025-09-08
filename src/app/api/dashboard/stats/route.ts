import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    // Get call statistics for the user's organization
    const { data: calls, error } = await supabase
      .from('voice_calls')
      .select('status, duration_seconds')
      .eq('organization_id', user.organization_id)

    if (error) {
      console.error('Error fetching calls:', error)
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }

    const totalCalls = calls?.length || 0
    const completedCalls = calls?.filter(call => call.status === 'completed').length || 0
    const pendingCalls = calls?.filter(call => call.status === 'scheduled' || call.status === 'in_progress').length || 0
    const successRate = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0
    
    const completedCallsWithDuration = calls?.filter(call => call.status === 'completed' && call.duration_seconds)
    const avgDuration = completedCallsWithDuration?.length > 0 
      ? Math.round(completedCallsWithDuration.reduce((sum, call) => sum + (call.duration_seconds || 0), 0) / completedCallsWithDuration.length)
      : 0

    return NextResponse.json({
      total_calls: totalCalls,
      completed_calls: completedCalls,
      pending_calls: pendingCalls,
      success_rate: successRate,
      avg_duration: avgDuration
    })
  } catch (error) {
    console.error('Error in stats API:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
