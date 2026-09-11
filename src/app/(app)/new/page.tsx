import { getCurrentUser } from '@/lib/auth'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Calendar, FileText, AlertCircle, Clock, Shield } from 'lucide-react'

export default async function NewCallPage() {
  // Allow demo access — don't require auth
  let user = null
  try { user = await getCurrentUser() } catch {}
  const isDemo = !user

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Initiate New Call</h1>
        <p className="text-gray-600">Start a new AI-powered voice call with a patient</p>
        {isDemo && (
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
            Demo Mode
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2">
          <QuickActions />
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          {/* Call Types Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Call Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: Calendar, label: 'Delivery Scheduling', desc: 'Coordinate medication delivery windows with patients' },
                { icon: FileText, label: 'Medication Change', desc: 'Notify patients about dosage or prescription changes' },
                { icon: AlertCircle, label: 'Side Effect Check', desc: 'Follow up on new medications for adverse reactions' },
                { icon: Clock, label: 'Refill Reminder', desc: 'Remind patients when prescriptions are due for refill' },
                { icon: Phone, label: 'General Inquiry', desc: 'Handle general pharmacy questions and requests' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-md bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-3.5 w-3.5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* How it works */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { step: '1', title: 'Configure call', desc: 'Enter phone number, select call type, and add context' },
                { step: '2', title: 'AI initiates', desc: 'Voice agent calls the patient with your instructions' },
                { step: '3', title: 'Review results', desc: 'Get transcript, AI summary, and action items' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs font-semibold shrink-0">{step}</div>
                  <div>
                    <h3 className="text-sm font-medium">{title}</h3>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Compliance note */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-900">HIPAA Compliant</p>
                  <p className="text-xs text-gray-500 mt-1">All calls are encrypted end-to-end. Transcripts are stored in HIPAA-compliant infrastructure. Patient data is never used for AI training.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
