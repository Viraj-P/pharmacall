import { AppHeader } from '@/components/app-header'
import { AppSidebar } from '@/components/app-sidebar'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Demo user data - in production this would come from requireAuth()
  const user = {
    id: 'demo-user-123',
    email: 'demo@pharmacall.com',
    role: 'pharmacist',
    organization_id: 'demo-org-123',
    organization_name: 'Demo Pharmacy'
  }

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