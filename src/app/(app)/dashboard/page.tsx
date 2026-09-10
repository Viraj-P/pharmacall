import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentCalls } from '@/components/dashboard/recent-calls'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default async function DashboardPage() {
  // Demo user data - in production this would come from requireAuth()
  const user = {
    id: 'demo-user-123',
    email: 'demo@pharmacall.com',
    role: 'pharmacist',
    organization_id: 'demo-org-123',
    organization_name: 'Demo Pharmacy'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.email}</p>
        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800">
          <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
          Demo Mode - All features functional
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCalls />
        <QuickActions />
      </div>
    </div>
  )
}