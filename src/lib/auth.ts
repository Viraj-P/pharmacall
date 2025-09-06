import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UserRole } from '@/types'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  organization_id: string
  organization_name: string
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  // Get user profile with organization info
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select(`
      id,
      role,
      organization_id,
      organizations!inner(name)
    `)
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return null
  }

  return {
    id: user.id,
    email: user.email!,
    role: profile.role as UserRole,
    organization_id: profile.organization_id,
    organization_name: profile.organizations.name
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  return user
}

export async function requireRole(requiredRole: UserRole): Promise<AuthUser> {
  const user = await requireAuth()
  
  const roleHierarchy = {
    'pharmacist': 1,
    'admin': 2,
    'super_admin': 3
  }
  
  if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
    redirect('/dashboard')
  }
  
  return user
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}