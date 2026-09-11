import { getCurrentUser } from '@/lib/auth'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function NewCallPage() {
  // Allow demo access — don't require auth
  let user = null
  try { user = await getCurrentUser() } catch {}

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Initiate New Call</h1>
        <p className="text-gray-600">Start a new AI-powered voice call with a patient</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Call Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <QuickActions />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-medium">1</div>
            <div>
              <h3 className="font-medium">Enter patient details</h3>
              <p className="text-sm text-gray-600">Provide the patient's phone number and select the call type</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
            <div>
              <h3 className="font-medium">AI agent initiates call</h3>
              <p className="text-sm text-gray-600">Our AI voice agent will call the patient and handle the conversation</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
            <div>
              <h3 className="font-medium">Review results</h3>
              <p className="text-sm text-gray-600">View the call transcript, summary, and any follow-up actions needed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
