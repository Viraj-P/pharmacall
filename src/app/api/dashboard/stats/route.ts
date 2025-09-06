import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get call statistics
    const { data: calls, error: callsError } = await supabase
      .from('voice_calls')
      .select('status, duration_seconds, call_type, created_at')
      .eq('organization_id', user.organization_id)
      .gte('created_at', startDate.toISOString())

    if (callsError) {
      return NextResponse.json({ error: callsError.message }, { status: 500 })
    }

    // Calculate statistics
    const totalCalls = calls.length
    const completedCalls = calls.filter(call => call.status === 'completed').length
    const pendingCalls = calls.filter(call => ['scheduled', 'in_progress'].includes(call.status)).length
    const successRate = totalCalls > 0 ? (completedCalls / totalCalls) * 100 : 0
    
    const completedCallsWithDuration = calls.filter(call => 
      call.status === 'completed' && call.duration_seconds
    )
    const avgDuration = completedCallsWithDuration.length > 0 
      ? completedCallsWithDuration.reduce((sum, call) => sum + (call.duration_seconds || 0), 0) / completedCallsWithDuration.length
      : 0

    // Call type distribution
    const callTypeDistribution = calls.reduce((acc, call) => {
      acc[call.call_type] = (acc[call.call_type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Recent calls (last 5)
    const { data: recentCalls, error: recentError } = await supabase
      .from('voice_calls')
      .select(`
        id,
        call_type,
        status,
        duration_seconds,
        created_at,
        completed_at,
        scheduled_at
      `)
      .eq('organization_id', user.organization_id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (recentError) {
      console.error('Error fetching recent calls:', recentError)
    }

    const stats = {
      total_calls: totalCalls,
      completed_calls: completedCalls,
      pending_calls: pendingCalls,
      success_rate: successRate,
      avg_duration: avgDuration,
      call_type_distribution: callTypeDistribution,
      recent_calls: recentCalls || []
    }

    return NextResponse.json({ stats })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}