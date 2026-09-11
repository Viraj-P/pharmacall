import { AppHeader } from '@/components/app-header'
import { AppSidebar } from '@/components/app-sidebar'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const DEMO_USER = {
  id: 'demo-user-123',
  email: 'demo@pharmacall.com',
  role: 'pharmacist',
  organization_name: 'Demo Pharmacy'
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let authUser = null
  try {
    authUser = await getCurrentUser()
  } catch {
    // Auth not configured or failed — use demo user
  }

  const user = authUser
    ? { id: authUser.id, email: authUser.email, role: authUser.role, organization_name: authUser.organization_name }
    : DEMO_USER

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader user={user} />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}