import { getCurrentUser } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Bell, Phone, Building2, Clock, Volume2 } from 'lucide-react'

export default async function SettingsPage() {
  let user = null
  try { user = await getCurrentUser() } catch {}
  const isDemo = !user

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your pharmacy and AI voice agent preferences</p>
        {isDemo && (
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
            Demo Mode — Changes are not saved
          </div>
        )}
      </div>

      {/* Pharmacy Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4 text-teal-600" />
            Pharmacy Information
          </CardTitle>
          <CardDescription>Your pharmacy details used for patient communications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pharmacy-name">Pharmacy Name</Label>
              <Input id="pharmacy-name" defaultValue="CureWell Specialty Pharmacy" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pharmacy-phone">Phone Number</Label>
              <Input id="pharmacy-phone" defaultValue="(555) 100-2000" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pharmacy-npi">NPI Number</Label>
              <Input id="pharmacy-npi" defaultValue="1234567890" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pharmacy-timezone">Timezone</Label>
              <Input id="pharmacy-timezone" defaultValue="America/New_York (EST)" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pharmacy-address">Address</Label>
            <Input id="pharmacy-address" defaultValue="123 Medical Center Dr, Suite 200, New York, NY 10001" />
          </div>
        </CardContent>
      </Card>

      {/* AI Voice Agent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Volume2 className="h-4 w-4 text-teal-600" />
            AI Voice Agent
          </CardTitle>
          <CardDescription>Configure how the AI agent interacts with patients</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Voice Style</Label>
              <div className="flex gap-2">
                <Badge variant="default" className="bg-teal-600 cursor-pointer">Professional</Badge>
                <Badge variant="outline" className="cursor-pointer">Warm</Badge>
                <Badge variant="outline" className="cursor-pointer">Concise</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <div className="flex gap-2">
                <Badge variant="default" className="bg-teal-600 cursor-pointer">English</Badge>
                <Badge variant="outline" className="cursor-pointer">Spanish</Badge>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="greeting">Opening Greeting</Label>
            <Input id="greeting" defaultValue="Good [morning/afternoon], this is CureWell Pharmacy calling regarding your prescription." />
            <p className="text-xs text-gray-400">The AI will adapt [morning/afternoon] based on time of day</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-duration">Max Call Duration</Label>
              <Input id="max-duration" defaultValue="10 minutes" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="escalation">Escalation Threshold</Label>
              <Input id="escalation" defaultValue="2 failed attempts" />
              <p className="text-xs text-gray-400">Transfers to pharmacist after this many retries</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-teal-600" />
            Call Hours
          </CardTitle>
          <CardDescription>When the AI agent is allowed to make outbound calls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { day: 'Monday - Friday', hours: '8:00 AM - 8:00 PM', active: true },
              { day: 'Saturday', hours: '9:00 AM - 5:00 PM', active: true },
              { day: 'Sunday', hours: 'No calls', active: false },
            ].map(({ day, hours, active }) => (
              <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm font-medium text-gray-900">{day}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${active ? 'text-gray-600' : 'text-gray-400'}`}>{hours}</span>
                  <div className={`w-8 h-4 rounded-full relative ${active ? 'bg-teal-600' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${active ? 'left-4' : 'left-0.5'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-teal-600" />
            Notifications
          </CardTitle>
          <CardDescription>Choose what alerts you receive</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Call completed', desc: 'After each AI call finishes', active: true },
              { label: 'Escalation alerts', desc: 'When a call is transferred to a pharmacist', active: true },
              { label: 'Failed calls', desc: 'When a call cannot be completed', active: true },
              { label: 'Daily summary', desc: 'End-of-day report with all call metrics', active: false },
              { label: 'Weekly analytics', desc: 'Weekly trend report with insights', active: true },
            ].map(({ label, desc, active }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <span className="text-sm font-medium text-gray-900">{label}</span>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <div className={`w-8 h-4 rounded-full relative cursor-pointer ${active ? 'bg-teal-600' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${active ? 'left-4' : 'left-0.5'}`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-teal-600" />
            Compliance & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">HIPAA Compliant</p>
                <p className="text-xs text-green-600">All calls encrypted end-to-end. BAA on file.</p>
              </div>
            </div>
            <Badge className="bg-green-600">Active</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
              <p className="font-medium text-gray-900">Data Retention</p>
              <p className="text-gray-500">90 days (configurable)</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
              <p className="font-medium text-gray-900">Encryption</p>
              <p className="text-gray-500">AES-256 at rest, TLS 1.3 in transit</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
              <p className="font-medium text-gray-900">Audit Logging</p>
              <p className="text-gray-500">All actions logged with timestamps</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
              <p className="font-medium text-gray-900">SOC 2 Type II</p>
              <p className="text-gray-500">Infrastructure certified</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
      </div>
    </div>
  )
}
