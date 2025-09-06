import { requireAuth } from '@/lib/auth'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentCalls } from '@/components/dashboard/recent-calls'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default async function DashboardPage() {
  const user = await requireAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.email}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your voice automation today.
        </p>
      </div>

      <DashboardStats />
      
      <div className="grid gap-6 md:grid-cols-2">
        <RecentCalls />
        <QuickActions />
      </div>
    </div>
  )
}