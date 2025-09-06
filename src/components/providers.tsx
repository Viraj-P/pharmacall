'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthUser } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        // Get user profile with organization info
        const { data: profile } = await supabase
          .from('users')
          .select(`
            id,
            role,
            organization_id,
            organizations!inner(name)
          `)
          .eq('id', authUser.id)
          .single()

        if (profile) {
          setUser({
            id: authUser.id,
            email: authUser.email!,
            role: profile.role as any,
            organization_id: profile.organization_id,
            organization_name: profile.organizations.name
          })
        }
      }
      
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select(`
              id,
              role,
              organization_id,
              organizations!inner(name)
            `)
            .eq('id', session.user.id)
            .single()

          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              role: profile.role as any,
              organization_id: profile.organization_id,
              organization_name: profile.organizations.name
            })
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
