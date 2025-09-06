export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          🏥 Pharmacy Voice Automation
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          AI-powered voice call automation for specialty pharmacies
        </p>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">✨ Features</h2>
            <ul className="text-left space-y-2 text-gray-600">
              <li>✅ HIPAA Compliant & PHI Secure</li>
              <li>✅ Multi-tenant Architecture</li>
              <li>✅ Voice Agent Integration (Retell, Vapi, Twilio)</li>
              <li>✅ Real-time Dashboard & Analytics</li>
              <li>✅ Email Notifications with Resend</li>
              <li>✅ Sentry Monitoring & Error Tracking</li>
              <li>✅ Modern UI/UX with Tailwind CSS</li>
            </ul>
          </div>
          <div className="bg-blue-600 text-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">🚀 Ready to Deploy!</h3>
            <p>Your Pharmacy Voice Automation app is ready for production</p>
          </div>
        </div>
      </div>
    </div>
  );
}