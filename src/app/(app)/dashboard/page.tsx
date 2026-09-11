import { getCurrentUser } from '@/lib/auth'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentCalls } from '@/components/dashboard/recent-calls'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { CallAnalytics } from '@/components/dashboard/call-analytics'
import { AiInsights } from '@/components/dashboard/ai-insights'
import { TodaysSchedule } from '@/components/dashboard/todays-schedule'

export default async function DashboardPage() {
  let user = null
  try { user = await getCurrentUser() } catch {}
  const displayEmail = user?.email || 'demo@pharmacall.com'
  const isDemo = !user

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {displayEmail}</p>
        {isDemo && (
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
            Demo Mode
          </div>
        )}
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CallAnalytics />
        <AiInsights />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentCalls />
        <TodaysSchedule />
        <QuickActions />
      </div>
    </div>
  )
}