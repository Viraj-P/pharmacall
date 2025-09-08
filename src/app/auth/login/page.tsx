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
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
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

  const handleDemoLogin = () => {
    // For demo purposes, redirect directly to dashboard
    router.push('/dashboard')
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #e0e7ff 100%)',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Back to Home */}
        <Link href="/" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          color: '#3b82f6', 
          textDecoration: 'none',
          marginBottom: '2rem',
          fontWeight: '500',
          transition: 'color 0.2s'
        }}>
          <ArrowLeft style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
          Back to Home
        </Link>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '4rem', 
          alignItems: 'center',
          minHeight: 'calc(100vh - 8rem)'
        }}>
          {/* Left Side - Login Form */}
          <div>
            <Card style={{ 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: 'none',
              borderRadius: '1rem',
              overflow: 'hidden'
            }}>
              <CardHeader style={{ 
                textAlign: 'center', 
                padding: '3rem 2rem 2rem 2rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                color: 'white'
              }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    background: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                      borderRadius: '50%'
                    }}></div>
                  </div>
                </div>
                <CardTitle style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}>
                  Welcome Back
                </CardTitle>
                <CardDescription style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1.125rem'
                }}>
                  Sign in to your PharmaCall account
                </CardDescription>
              </CardHeader>
              
              <CardContent style={{ padding: '2rem' }}>
                <form onSubmit={handleLogin} style={{ marginBottom: '2rem' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <Label htmlFor="email" style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="pharmacist@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        padding: '0.875rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        transition: 'all 0.2s',
                        backgroundColor: '#f9fafb'
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <Label htmlFor="password" style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        padding: '0.875rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        transition: 'all 0.2s',
                        backgroundColor: '#f9fafb'
                      }}
                    />
                  </div>

                  {error && (
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#dc2626', 
                      backgroundColor: '#fef2f2', 
                      padding: '0.75rem 1rem', 
                      borderRadius: '0.5rem',
                      marginBottom: '1rem',
                      border: '1px solid #fecaca'
                    }}>
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <a href="#" style={{ 
                    color: '#3b82f6', 
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    Forgot your password?
                  </a>
                </div>

                <div style={{ 
                  borderTop: '1px solid #e5e7eb', 
                  paddingTop: '2rem',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280',
                    marginBottom: '1rem'
                  }}>
                    Want to try the demo?
                  </div>
                  <Button 
                    onClick={handleDemoLogin}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    Try Demo Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Features & Info */}
          <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#111827',
                marginBottom: '1rem',
                lineHeight: '1.2'
              }}>
                AI-Powered Pharmacy
                <span style={{ 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}> Voice Automation</span>
              </h2>
              <p style={{ 
                fontSize: '1.125rem', 
                color: '#6b7280',
                lineHeight: '1.6',
                marginBottom: '2rem'
              }}>
                Transform your pharmacy operations with intelligent voice agents that handle patient calls, medication management, and delivery scheduling 24/7.
              </p>
            </div>

            {/* Features Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '1.5rem',
              marginBottom: '3rem'
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <Phone style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  Voice AI Calls
                </h3>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280',
                  lineHeight: '1.5'
                }}>
                  Natural conversations with patients for medication management
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <Shield style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  HIPAA Compliant
                </h3>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280',
                  lineHeight: '1.5'
                }}>
                  Enterprise-grade security for patient data protection
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <Users style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  Multi-Tenant
                </h3>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280',
                  lineHeight: '1.5'
                }}>
                  Support for multiple pharmacy locations and teams
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  24/7 Available
                </h3>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280',
                  lineHeight: '1.5'
                }}>
                  Round-the-clock patient support and medication management
                </p>
              </div>
            </div>

            {/* Stats */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                Trusted by Pharmacies Nationwide
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '1rem',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: 'bold', 
                    color: '#3b82f6',
                    marginBottom: '0.25rem'
                  }}>
                    500+
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280'
                  }}>
                    Active Pharmacies
                  </div>
                </div>
                <div>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: 'bold', 
                    color: '#10b981',
                    marginBottom: '0.25rem'
                  }}>
                    99.9%
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280'
                  }}>
                    Uptime
                  </div>
                </div>
                <div>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: 'bold', 
                    color: '#8b5cf6',
                    marginBottom: '0.25rem'
                  }}>
                    1M+
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280'
                  }}>
                    Calls Handled
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}