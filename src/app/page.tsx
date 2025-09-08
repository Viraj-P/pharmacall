import Link from "next/link";
import { ArrowRight, CheckCircle, Shield, Clock, DollarSign, Phone, MessageSquare, FileText, CreditCard, LifeBuoy } from "lucide-react";

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}>
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                background: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  borderRadius: '50%',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '0.25rem',
                    height: '0.25rem',
                    background: 'white',
                    borderRadius: '50%'
                  }}></div>
                </div>
              </div>
            </div>
            <span style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              PharmaCall
            </span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <a href="#features" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>Features</a>
            <a href="#testimonials" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>Testimonials</a>
            <a href="#faq" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>FAQ</a>
            <Link href="/auth/login" style={{
              padding: '0.5rem 1rem',
              border: '1px solid #3b82f6',
              borderRadius: '0.375rem',
              color: '#3b82f6',
              backgroundColor: 'white',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'background-color 0.2s, color 0.2s'
            }}>
              Login
            </Link>
            <Link href="/auth/login" style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '500',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'opacity 0.2s'
            }}>
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        minHeight: 'calc(100vh - 4rem)', // Adjust for header height
        background: 'linear-gradient(180deg, #e0f2fe 0%, #ffffff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          {/* Left Content */}
          <div style={{ textAlign: 'left', padding: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: '#e0f2fe',
              color: '#2563eb',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '1.5rem'
            }}>
              <CheckCircle style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              Trusted by thousands of pharmacies just like yours
            </div>
            <h1 style={{
              fontSize: '3.75rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1.5rem',
              lineHeight: '1.2'
            }}>
              Medication management, <span style={{ color: '#3b82f6' }}>covered by insurance</span>
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#4b5563',
              marginBottom: '2.5rem',
              lineHeight: '1.6'
            }}>
              Expert psychiatric care to help you feel better, faster – right from home.
            </p>
            <Link href="/auth/login" style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.125rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              transition: 'opacity 0.2s'
            }}>
              Book now
              <ArrowRight style={{ width: '1.25rem', height: '1.25rem', marginLeft: '0.75rem' }} />
            </Link>
          </div>

          {/* Right Image Placeholder */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '400px',
            background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 100%)',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              width: '3rem',
              height: '3rem',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Phone style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1rem',
              width: '3rem',
              height: '3rem',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageSquare style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
            <div style={{
              width: '200px',
              height: '200px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <LifeBuoy style={{ width: '3rem', height: '3rem', color: '#6366f1' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ backgroundColor: 'white', padding: '4rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>120M+</div>
            <div style={{ fontSize: '1.125rem', color: '#4b5563' }}>individuals are covered by insurance</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>99.9%</div>
            <div style={{ fontSize: '1.125rem', color: '#4b5563' }}>HIPAA compliance rate</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>24/7</div>
            <div style={{ fontSize: '1.125rem', color: '#4b5563' }}>voice agent availability</div>
          </div>
        </div>
      </section>

      {/* Conditions We Support Section */}
      <section id="features" style={{ backgroundColor: '#f8fafc', padding: '6rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: '#e0f2fe',
            color: '#2563eb',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '1rem'
          }}>
            <CheckCircle style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
            Comprehensive Care
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            Compassionate care tailored to <span style={{ fontStyle: 'italic', color: '#3b82f6' }}>you.</span>
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#4b5563', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
            Our AI providers are equipped to help with most pharmacy-related conditions through telehealth. Common ones include:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {/* Feature Card 1 */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', textAlign: 'left' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Phone style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Delivery Scheduling</h3>
              <p style={{ color: '#4b5563', fontSize: '0.9375rem' }}>Automated reminders and confirmations for medication deliveries, reducing missed appointments.</p>
            </div>

            {/* Feature Card 2 */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', textAlign: 'left' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <FileText style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Medication Changes</h3>
              <p style={{ color: '#4b5563', fontSize: '0.9375rem' }}>AI agents assist with dosage adjustments, prescription modifications, and patient education.</p>
            </div>

            {/* Feature Card 3 */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', textAlign: 'left' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Shield style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Side Effect Management</h3>
              <p style={{ color: '#4b5563', fontSize: '0.9375rem' }}>Provide guidance on managing medication side effects and when to contact a pharmacist.</p>
            </div>

            {/* Feature Card 4 */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', textAlign: 'left' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Clock style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Refill Reminders</h3>
              <p style={{ color: '#4b5563', fontSize: '0.9375rem' }}>Automated calls and messages for prescription renewals, improving adherence.</p>
            </div>

            {/* Feature Card 5 */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', textAlign: 'left' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <CreditCard style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Insurance & Coverage</h3>
              <p style={{ color: '#4b5563', fontSize: '0.9375rem' }}>Assistance with prior authorizations, copay questions, and coverage verification.</p>
            </div>

            {/* Feature Card 6 */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', textAlign: 'left' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <LifeBuoy style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Emergency Support</h3>
              <p style={{ color: '#4b5563', fontSize: '0.9375rem' }}>AI can triage urgent medication needs and escalate to a pharmacist for critical situations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={{ backgroundColor: 'white', padding: '6rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            Real stories of hope and healing from our patients.
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#4b5563', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
            We're honored to support thousands on their journeys. Here's what some have shared:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Testimonial Card 1 */}
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', textAlign: 'left' }}>
              <p style={{ fontStyle: 'italic', color: '#4b5563', marginBottom: '1.5rem' }}>
                "PharmaCall has been a godsend and changed my pharmacy operations for the better. They really listened to our needs and are consistently trying to understand more what's going on and tries to help us through it."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 'bold' }}>MG</div>
                <div>
                  <div style={{ fontWeight: '600', color: '#111827' }}>Maria G. (42)</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Austin, TX</div>
                </div>
              </div>
            </div>

            {/* Testimonial Card 2 */}
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', textAlign: 'left' }}>
              <p style={{ fontStyle: 'italic', color: '#4b5563', marginBottom: '1.5rem' }}>
                "I am so THANKFUL to God that I was referred to PharmaCall! Nina has been a GOD send angel for me. I have struggled the last 6 yrs with medication. She was the only one that was open to revisit the diagnosis. We didn't start from the ground up but I am finally feeling like a functioning human."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 'bold' }}>AR</div>
                <div>
                  <div style={{ fontWeight: '600', color: '#111827' }}>Anthony R. (36)</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Houston, TX</div>
                </div>
              </div>
            </div>

            {/* Testimonial Card 3 */}
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', textAlign: 'left' }}>
              <p style={{ fontStyle: 'italic', color: '#4b5563', marginBottom: '1.5rem' }}>
                "This service helped me more than I could ever let you know!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 'bold' }}>JK</div>
                <div>
                  <div style={{ fontWeight: '600', color: '#111827' }}>Jasmine K. (29)</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Austin, TX</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)', padding: '6rem 1.5rem', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Ready for Your Next Step?</h2>
          <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2.5rem' }}>
            We're here to support you, whenever you're ready.
          </p>
          <Link href="/auth/login" style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            backgroundColor: 'white',
            color: '#3b82f6',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1.125rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'opacity 0.2s'
          }}>
            Book now
            <ArrowRight style={{ width: '1.25rem', height: '1.25rem', marginLeft: '0.75rem' }} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1f2937', color: 'white', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '1rem',
                    height: '1rem',
                    background: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                      borderRadius: '50%',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '0.125rem',
                        height: '0.125rem',
                        background: 'white',
                        borderRadius: '50%'
                      }}></div>
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>PharmaCall</span>
              </div>
              <p style={{ color: '#9ca3af' }}>
                AI-powered voice automation for specialty pharmacies.
              </p>
            </div>
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Product</h3>
              <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af' }}>
                <li style={{ marginBottom: '0.5rem' }}>Features</li>
                <li style={{ marginBottom: '0.5rem' }}>Dashboard</li>
                <li style={{ marginBottom: '0.5rem' }}>Security</li>
                <li style={{ marginBottom: '0.5rem' }}>Pricing</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Support</h3>
              <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af' }}>
                <li style={{ marginBottom: '0.5rem' }}>Documentation</li>
                <li style={{ marginBottom: '0.5rem' }}>Help Center</li>
                <li style={{ marginBottom: '0.5rem' }}>Contact Us</li>
                <li style={{ marginBottom: '0.5rem' }}>Status</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Legal</h3>
              <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af' }}>
                <li style={{ marginBottom: '0.5rem' }}>Privacy Policy</li>
                <li style={{ marginBottom: '0.5rem' }}>Terms of Service</li>
                <li style={{ marginBottom: '0.5rem' }}>HIPAA Compliance</li>
                <li style={{ marginBottom: '0.5rem' }}>Security</li>
              </ul>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid #374151',
            paddingTop: '2rem',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <p>&copy; 2024 PharmaCall. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}