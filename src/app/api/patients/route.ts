import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let query = supabase
      .from('patients')
      .select(`
        *,
        voice_calls(
          id,
          call_type,
          status,
          created_at,
          completed_at
        )
      `)
      .eq('organization_id', user.organization_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Note: In a real implementation, you'd need to implement encrypted search
    // For now, we'll do basic filtering on the hash
    if (search) {
      // This is a simplified search - in production, you'd need proper encrypted search
      query = query.ilike('patient_id_hash', `%${search}%`)
    }

    const { data: patients, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Add call statistics to each patient
    const patientsWithStats = patients?.map(patient => ({
      ...patient,
      call_count: patient.voice_calls?.length || 0,
      recent_calls: patient.voice_calls?.slice(0, 5) || []
    }))

    return NextResponse.json({
      patients: patientsWithStats,
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
    
    const body = await request.json()
    const { phone, name, dob, medications, preferences } = body

    // Generate patient hash for lookups
    const patientIdHash = await supabase.rpc('generate_patient_hash', {
      org_id: user.organization_id,
      phone: phone
    })

    if (patientIdHash.error) {
      return NextResponse.json({ error: 'Failed to generate patient hash' }, { status: 500 })
    }

    // Check if patient already exists
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('id')
      .eq('organization_id', user.organization_id)
      .eq('patient_id_hash', patientIdHash.data)
      .single()

    if (existingPatient) {
      return NextResponse.json({ error: 'Patient already exists' }, { status: 409 })
    }

    // Create patient with encrypted data
    const { data: patient, error } = await supabase
      .from('patients')
      .insert({
        organization_id: user.organization_id,
        encrypted_phone: phone, // In production, this should be encrypted
        encrypted_name: name, // In production, this should be encrypted
        encrypted_dob: dob, // In production, this should be encrypted
        patient_id_hash: patientIdHash.data,
        medications: medications || [],
        preferences: preferences || {}
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ patient }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
