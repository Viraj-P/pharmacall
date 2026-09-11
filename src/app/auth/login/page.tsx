'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Shield, Users, Phone, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] font-sans">
      <div className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Back to Home */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-teal-600 transition-colors hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="grid min-h-[calc(100vh-10rem)] items-center gap-16 lg:grid-cols-2">
          {/* Left Side - Login Form */}
          <div>
            <Card className="overflow-hidden rounded-2xl border-0 shadow-2xl shadow-black/10">
              <CardHeader className="bg-[#0c1220] px-8 pb-8 pt-10 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600/20 backdrop-blur-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                    <div className="h-4 w-4 rounded-full bg-teal-600"></div>
                  </div>
                </div>
                <CardTitle className="mb-2 font-serif text-3xl font-bold text-[#f0ece6]">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-lg text-[#f0ece6]/70">
                  Sign in to your PharmCall account
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8">
                <form onSubmit={handleLogin} className="mb-8">
                  <div className="mb-6">
                    <Label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="pharmacist@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-base transition-colors focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  <div className="mb-6">
                    <Label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-base transition-colors focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-teal-600 py-3 text-base font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700 hover:shadow-teal-700/25"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="pt-6 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-sm text-gray-500">
                        Or continue without account
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="inline-flex w-full items-center justify-center rounded-xl border-2 border-teal-600 bg-white py-3 text-base font-semibold text-teal-600 shadow-sm transition-all hover:bg-teal-50 hover:shadow-md"
                  >
                    Try Demo Dashboard
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Features & Info */}
          <div className="p-4 lg:p-8">
            <div className="mb-10">
              <h2 className="mb-4 font-serif text-4xl leading-tight tracking-tight text-[#1c1c1e] lg:text-5xl">
                AI-Powered Pharmacy
                <span className="text-teal-600"> Voice Automation</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-[#6b7280]">
                Transform your pharmacy operations with intelligent voice agents
                that handle patient calls, medication management, and delivery
                scheduling 24/7.
              </p>
            </div>

            {/* Features Grid */}
            <div className="mb-10 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-black/[0.04] bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-1 text-base font-semibold text-[#1c1c1e]">
                  Voice AI Calls
                </h3>
                <p className="text-sm leading-relaxed text-[#6b7280]">
                  Natural conversations with patients for medication management
                </p>
              </div>

              <div className="rounded-xl border border-black/[0.04] bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-1 text-base font-semibold text-[#1c1c1e]">
                  HIPAA Compliant
                </h3>
                <p className="text-sm leading-relaxed text-[#6b7280]">
                  Enterprise-grade security for patient data protection
                </p>
              </div>

              <div className="rounded-xl border border-black/[0.04] bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-1 text-base font-semibold text-[#1c1c1e]">
                  Multi-Tenant
                </h3>
                <p className="text-sm leading-relaxed text-[#6b7280]">
                  Support for multiple pharmacy locations and teams
                </p>
              </div>

              <div className="rounded-xl border border-black/[0.04] bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-1 text-base font-semibold text-[#1c1c1e]">
                  24/7 Available
                </h3>
                <p className="text-sm leading-relaxed text-[#6b7280]">
                  Round-the-clock patient support and medication management
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-black/[0.04] bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-center text-lg font-semibold text-[#1c1c1e]">
                Trusted by Pharmacies Nationwide
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="mb-1 text-3xl font-bold tracking-tight text-teal-600">
                    500+
                  </div>
                  <div className="text-sm text-[#6b7280]">Active Pharmacies</div>
                </div>
                <div>
                  <div className="mb-1 text-3xl font-bold tracking-tight text-teal-600">
                    99.9%
                  </div>
                  <div className="text-sm text-[#6b7280]">Uptime</div>
                </div>
                <div>
                  <div className="mb-1 text-3xl font-bold tracking-tight text-teal-600">
                    1M+
                  </div>
                  <div className="text-sm text-[#6b7280]">Calls Handled</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
