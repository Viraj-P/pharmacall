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
      .select('status, duration_seconds, created_at')
      .eq('organization_id', user.organization_id)
      .gte('created_at', startDate.toISOString())

    if (callsError) {
      return NextResponse.json({ error: callsError.message }, { status: 500 })
    }

    // Calculate statistics
    const totalCalls = calls?.length || 0
    const completedCalls = calls?.filter(call => call.status === 'completed').length || 0
    const pendingCalls = calls?.filter(call => ['scheduled', 'in_progress'].includes(call.status)).length || 0
    const successRate = totalCalls > 0 ? (completedCalls / totalCalls) * 100 : 0
    
    const durations = calls?.filter(call => call.duration_seconds).map(call => call.duration_seconds!) || []
    const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0

    // Get recent activity
    const { data: recentCalls, error: recentError } = await supabase
      .from('voice_calls')
      .select(`
        id,
        call_type,
        status,
        created_at,
        patients!inner(
          encrypted_name,
          patient_id_hash
        )
      `)
      .eq('organization_id', user.organization_id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (recentError) {
      return NextResponse.json({ error: recentError.message }, { status: 500 })
    }

    // Get call type distribution
    const callTypeStats = calls?.reduce((acc, call) => {
      acc[call.status] = (acc[call.status] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    const stats = {
      total_calls: totalCalls,
      completed_calls: completedCalls,
      pending_calls: pendingCalls,
      success_rate: Math.round(successRate * 100) / 100,
      avg_duration: Math.round(avgDuration),
      call_type_distribution: callTypeStats,
      recent_calls: recentCalls || []
    }

    return NextResponse.json({ stats })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
