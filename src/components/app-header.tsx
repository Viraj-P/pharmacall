'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AppHeaderProps {
  user: {
    id: string
    email: string
    role: string
    organization_name: string
  }
}

export function AppHeader({ user }: AppHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // Sign out failed, still redirect
    }
    router.push('/')
  }

  return (
    <header className="bg-[#0c1220] border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Phone className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-[#f0ece6]">
              PharmCall
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Mobile nav links */}
          <nav className="flex md:hidden items-center space-x-1">
            <Link href="/dashboard" className="px-3 py-1.5 text-sm font-medium text-[#f0ece6]/70 hover:text-[#f0ece6] rounded-md hover:bg-white/10 transition-colors">
              Dashboard
            </Link>
            <Link href="/new" className="px-3 py-1.5 text-sm font-medium text-[#f0ece6]/70 hover:text-[#f0ece6] rounded-md hover:bg-white/10 transition-colors">
              New Call
            </Link>
            <Link href="/history" className="px-3 py-1.5 text-sm font-medium text-[#f0ece6]/70 hover:text-[#f0ece6] rounded-md hover:bg-white/10 transition-colors">
              History
            </Link>
            <Link href="/settings" className="px-3 py-1.5 text-sm font-medium text-[#f0ece6]/70 hover:text-[#f0ece6] rounded-md hover:bg-white/10 transition-colors">
              Settings
            </Link>
          </nav>
          <div className="hidden md:block text-sm text-[#f0ece6]/60">
            {user.organization_name}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/10">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-teal-600/20 text-teal-300 text-sm">
                    {user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
