import { requireAuth } from '@/lib/auth'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/app-header'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="pl-64">
        <AppHeader user={user} />
        <main className="container mx-auto py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
