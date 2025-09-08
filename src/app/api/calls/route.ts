import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    // Get recent calls for the user's organization
    const { data: calls, error } = await supabase
      .from('voice_calls')
      .select(`
        id,
        patient_id,
        call_type,
        status,
        created_at,
        duration_seconds,
        patients!inner(encrypted_phone)
      `)
      .eq('organization_id', user.organization_id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching calls:', error)
      return NextResponse.json({ error: 'Failed to fetch calls' }, { status: 500 })
    }

    // Format the response
    const formattedCalls = calls?.map(call => ({
      id: call.id,
      patient_phone: call.patients?.encrypted_phone || 'Unknown',
      call_type: call.call_type,
      status: call.status,
      created_at: call.created_at,
      duration_seconds: call.duration_seconds
    })) || []

    return NextResponse.json(formattedCalls)
  } catch (error) {
    console.error('Error in calls API:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
