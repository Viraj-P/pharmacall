'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Bell, Clock, Volume2, Building2, CheckCircle, Loader2 } from 'lucide-react'

function Toggle({ active, onChange }: { active: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-teal-600' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${active ? 'left-4.5' : 'left-0.5'}`}
        style={{ left: active ? '18px' : '2px' }}
      />
    </button>
  )
}

export function SettingsForm({ isDemo }: { isDemo: boolean }) {
  const [voiceStyle, setVoiceStyle] = useState('professional')
  const [language, setLanguage] = useState('english')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [callHours, setCallHours] = useState({
    weekday: true,
    saturday: true,
    sunday: false,
  })

  const [notifications, setNotifications] = useState({
    completed: true,
    escalation: true,
    failed: true,
    daily: false,
    weekly: true,
  })

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your pharmacy and AI voice agent preferences</p>
        {isDemo && (
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
            Demo Mode — Changes are simulated
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
                {(['professional', 'warm', 'concise'] as const).map(style => (
                  <Badge
                    key={style}
                    variant={voiceStyle === style ? 'default' : 'outline'}
                    className={`cursor-pointer capitalize ${voiceStyle === style ? 'bg-teal-600 hover:bg-teal-700' : 'hover:bg-gray-100'}`}
                    onClick={() => setVoiceStyle(style)}
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <div className="flex gap-2">
                {(['english', 'spanish'] as const).map(lang => (
                  <Badge
                    key={lang}
                    variant={language === lang ? 'default' : 'outline'}
                    className={`cursor-pointer capitalize ${language === lang ? 'bg-teal-600 hover:bg-teal-700' : 'hover:bg-gray-100'}`}
                    onClick={() => setLanguage(lang)}
                  >
                    {lang}
                  </Badge>
                ))}
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
            {([
              { key: 'weekday' as const, day: 'Monday - Friday', hours: '8:00 AM - 8:00 PM' },
              { key: 'saturday' as const, day: 'Saturday', hours: '9:00 AM - 5:00 PM' },
              { key: 'sunday' as const, day: 'Sunday', hours: 'No calls' },
            ]).map(({ key, day, hours }) => (
              <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm font-medium text-gray-900">{day}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${callHours[key] ? 'text-gray-600' : 'text-gray-400'}`}>{hours}</span>
                  <Toggle
                    active={callHours[key]}
                    onChange={() => setCallHours(prev => ({ ...prev, [key]: !prev[key] }))}
                  />
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
            {([
              { key: 'completed' as const, label: 'Call completed', desc: 'After each AI call finishes' },
              { key: 'escalation' as const, label: 'Escalation alerts', desc: 'When a call is transferred to a pharmacist' },
              { key: 'failed' as const, label: 'Failed calls', desc: 'When a call cannot be completed' },
              { key: 'daily' as const, label: 'Daily summary', desc: 'End-of-day report with all call metrics' },
              { key: 'weekly' as const, label: 'Weekly analytics', desc: 'Weekly trend report with insights' },
            ]).map(({ key, label, desc }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <span className="text-sm font-medium text-gray-900">{label}</span>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <Toggle
                  active={notifications[key]}
                  onChange={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                />
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
      <div className="flex items-center justify-end gap-3 pb-8">
        {saved && (
          <div className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            Settings saved
          </div>
        )}
        <Button variant="outline">Cancel</Button>
        <Button
          className="bg-teal-600 hover:bg-teal-700"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  )
}
