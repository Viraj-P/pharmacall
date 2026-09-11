import { getCurrentUser } from '@/lib/auth'
import { SettingsForm } from '@/components/dashboard/settings-form'

export default async function SettingsPage() {
  let user = null
  try { user = await getCurrentUser() } catch {}
  const isDemo = !user

  return <SettingsForm isDemo={isDemo} />
}
