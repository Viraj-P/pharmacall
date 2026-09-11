import { getCurrentUser } from '@/lib/auth'
import { PatientDirectory } from '@/components/dashboard/patient-directory'

export default async function PatientsPage() {
  let user = null
  try { user = await getCurrentUser() } catch {}
  const isDemo = !user

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <p className="text-gray-600">Patient directory and adherence tracking</p>
        {isDemo && (
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
            Demo Mode
          </div>
        )}
      </div>

      <PatientDirectory />
    </div>
  )
}
