"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Lock,
  Clock,
  Phone,
  MessageSquare,
  FileText,
  CreditCard,
  LifeBuoy,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#fafaf8] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#0c1220]/10 bg-[#0c1220]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-semibold tracking-tight text-[#f0ece6]">
              PharmCall
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-[#f0ece6]/70 transition-colors hover:text-[#f0ece6]"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-[#f0ece6]/70 transition-colors hover:text-[#f0ece6]"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-[#f0ece6]/70 transition-colors hover:text-[#f0ece6]"
            >
              FAQ
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-[#f0ece6]/70 transition-colors hover:text-[#f0ece6]"
            >
              Pricing
            </a>
            <Link
              href="/auth/login"
              className="rounded-md border border-[#f0ece6]/20 px-4 py-2 text-sm font-medium text-[#f0ece6]/80 transition-all hover:border-[#f0ece6]/40 hover:text-[#f0ece6]"
            >
              Login
            </Link>
            <Link
              href="/auth/login"
              className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-500"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-[#f0ece6]/70 transition-colors hover:text-[#f0ece6] md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-[#f0ece6]/10 bg-[#0c1220] px-6 pb-6 pt-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#f0ece6]/70 transition-colors hover:text-[#f0ece6]"
              >
                Features
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#f0ece6]/70 transition-colors hover:text-[#f0ece6]"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#f0ece6]/70 transition-colors hover:text-[#f0ece6]"
              >
                FAQ
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#f0ece6]/70 transition-colors hover:text-[#f0ece6]"
              >
                Pricing
              </a>
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/auth/login"
                  className="rounded-md border border-[#f0ece6]/20 px-4 py-2.5 text-center text-sm font-medium text-[#f0ece6]/80 transition-all hover:border-[#f0ece6]/40 hover:text-[#f0ece6]"
                >
                  Login
                </Link>
                <Link
                  href="/auth/login"
                  className="rounded-md bg-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-500"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0c1220]">
        {/* Animated gradient mesh background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-mesh-shift absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-teal-600/10 blur-[120px]" />
          <div
            className="animate-mesh-shift absolute -right-32 top-1/3 h-[400px] w-[400px] rounded-full bg-teal-800/8 blur-[100px]"
            style={{ animationDelay: "-5s" }}
          />
          <div
            className="animate-mesh-shift absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-slate-600/10 blur-[100px]"
            style={{ animationDelay: "-10s" }}
          />
          {/* Grain texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-6 pb-28 pt-24 md:pb-36 md:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-1.5">
              <CheckCircle className="h-4 w-4 text-teal-400" />
              <span className="text-sm font-medium text-teal-300">
                HIPAA-compliant voice automation
              </span>
            </div>

            <h1 className="mb-6 font-serif text-5xl leading-[1.1] tracking-tight text-[#f0ece6] md:text-6xl lg:text-7xl">
              The voice your pharmacy
              <br />
              <span className="text-teal-400">never has to staff</span>
            </h1>

            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-[#f0ece6]/60 md:text-xl">
              AI-powered phone agents that handle refill calls, delivery
              scheduling, and patient outreach around the clock -- so your
              pharmacists can focus on clinical care.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-teal-600/25 transition-all hover:bg-teal-500 hover:shadow-teal-500/30"
              >
                Try Demo Dashboard
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-lg border border-[#f0ece6]/15 px-8 py-3.5 text-base font-medium text-[#f0ece6]/70 transition-all hover:border-[#f0ece6]/30 hover:text-[#f0ece6]"
              >
                See how it works
              </a>
            </div>
          </div>
        </div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#fafaf8] to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="relative z-10 -mt-12 px-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-black/[0.04] bg-white px-6 py-10 shadow-xl shadow-black/[0.03] md:px-12">
          <div className="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0 divide-gray-100">
            <div className="flex flex-col items-center py-6 md:py-0">
              <div className="text-4xl font-bold tracking-tight text-teal-600 md:text-5xl">
                500+
              </div>
              <div className="mt-2 text-sm font-medium text-[#6b7280]">
                Specialty pharmacies served
              </div>
            </div>
            <div className="flex flex-col items-center py-6 md:py-0">
              <div className="text-4xl font-bold tracking-tight text-teal-600 md:text-5xl">
                99.9%
              </div>
              <div className="mt-2 text-sm font-medium text-[#6b7280]">
                Platform uptime
              </div>
            </div>
            <div className="flex flex-col items-center py-6 md:py-0">
              <div className="text-4xl font-bold tracking-tight text-teal-600 md:text-5xl">
                24/7
              </div>
              <div className="mt-2 text-sm font-medium text-[#6b7280]">
                AI availability
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section - Logo Cloud */}
      <section className="bg-[#fafaf8] px-6 py-16">
        <div className="mx-auto max-w-[1200px]">
          <p className="mb-10 text-center text-sm font-medium uppercase tracking-widest text-[#9ca3af]">
            Trusted by leading pharmacies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16">
            {[
              "Memorial Health System",
              "Valley Specialty Rx",
              "CureWell Pharmacy",
              "Pacific Care Group",
              "Ascend Health",
              "Cornerstone Rx",
            ].map((name) => (
              <span
                key={name}
                className="whitespace-nowrap text-lg font-semibold tracking-tight text-[#c0c0c0] md:text-xl"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-t border-black/[0.04] bg-white px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 font-serif text-4xl tracking-tight text-[#1c1c1e]">
              How it works
            </h2>
            <p className="text-lg leading-relaxed text-[#6b7280]">
              From setup to your first automated call in under an hour
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Connect your pharmacy",
                description:
                  "Import your patient list, set call hours, and configure your AI voice agent's personality and clinical protocols.",
              },
              {
                step: "02",
                title: "AI handles the calls",
                description:
                  "PharmCall's voice agent calls patients for refill reminders, delivery scheduling, and medication check-ins — naturally and compliantly.",
              },
              {
                step: "03",
                title: "Review and act",
                description:
                  "Get AI-generated summaries, sentiment analysis, and action items for every call. Escalations route directly to your pharmacists.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="mb-4 block font-serif text-5xl font-medium text-teal-600/20">
                  {item.step}
                </span>
                <h3 className="mb-3 text-lg font-semibold text-[#1c1c1e]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#6b7280]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* See It In Action - Transcript Demo */}
      <section className="bg-[#fafaf8] px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 font-serif text-4xl tracking-tight text-[#1c1c1e]">
              See it in action
            </h2>
            <p className="text-lg leading-relaxed text-[#6b7280]">
              A real conversation between PharmCall&apos;s AI agent and a patient, handling a refill reminder from start to finish.
            </p>
          </div>

          <div className="mx-auto max-w-2xl rounded-2xl border border-black/[0.04] bg-white shadow-xl shadow-black/[0.03] overflow-hidden">
            {/* Transcript header */}
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/80 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#1c1c1e]">Refill Reminder Call</div>
                <div className="text-xs text-[#6b7280]">Duration: 1m 42s &middot; Completed successfully</div>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-medium text-emerald-600">Resolved</span>
              </div>
            </div>

            {/* Transcript body */}
            <div className="space-y-4 px-6 py-6">
              {[
                { speaker: "ai", text: "Hi, this is a call from Valley Specialty Pharmacy. May I speak with Margaret?" },
                { speaker: "patient", text: "Yes, this is Margaret." },
                { speaker: "ai", text: "Great, Margaret. I'm calling about your Atorvastatin 40mg prescription. Our records show it's due for a refill in two days. Would you like us to prepare that for you?" },
                { speaker: "patient", text: "Oh, yes please. Actually, I've been meaning to call about that. Can you also check on my blood pressure medication?" },
                { speaker: "ai", text: "Of course. I see your Lisinopril 10mg was last filled on August 28th and has 8 days remaining. Would you like me to schedule both refills together for pickup?" },
                { speaker: "patient", text: "That would be perfect. Can I pick them up Thursday afternoon?" },
                { speaker: "ai", text: "Both prescriptions will be ready for pickup Thursday after 2 PM. You'll receive a text confirmation when they're prepared. Is there anything else I can help with?" },
                { speaker: "patient", text: "No, that's everything. Thank you!" },
                { speaker: "ai", text: "You're welcome, Margaret. Have a great day." },
              ].map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.speaker === "patient" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    msg.speaker === "ai"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {msg.speaker === "ai" ? "AI" : "MP"}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.speaker === "ai"
                      ? "rounded-tl-md bg-teal-50 text-teal-900"
                      : "rounded-tr-md bg-gray-50 text-gray-800"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Transcript footer - AI summary */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#6b7280] mb-2">AI Summary</div>
              <p className="text-sm text-[#4b5563] leading-relaxed">
                Patient confirmed refill for Atorvastatin 40mg and requested Lisinopril 10mg refill. Both prescriptions scheduled for Thursday pickup after 2 PM. Text confirmation to be sent upon preparation. No clinical concerns raised.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-700">2 refills scheduled</span>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">Thursday pickup</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">No escalation needed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-[#fafaf8] px-6 pb-24 pt-24"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-600/15 bg-teal-50 px-4 py-1.5">
              <CheckCircle className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-700">
                Platform Capabilities
              </span>
            </div>
            <h2 className="mb-4 font-serif text-4xl tracking-tight text-[#1c1c1e] md:text-5xl">
              What we automate
            </h2>
            <p className="text-lg leading-relaxed text-[#6b7280]">
              Purpose-built voice AI for the workflows that consume your
              pharmacy staff's time. Every call handled with clinical
              precision.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature Card 1 */}
            <div className="group rounded-xl border border-black/[0.04] bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-teal-600">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#1c1c1e]">
                Delivery Scheduling
              </h3>
              <p className="text-[15px] leading-relaxed text-[#6b7280]">
                Automated reminders and confirmations for medication
                deliveries, reducing missed appointments and improving
                patient adherence.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="group rounded-xl border border-black/[0.04] bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-teal-600">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#1c1c1e]">
                Medication Changes
              </h3>
              <p className="text-[15px] leading-relaxed text-[#6b7280]">
                AI agents assist with dosage adjustments, prescription
                modifications, and proactive patient education calls.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="group rounded-xl border border-black/[0.04] bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-teal-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#1c1c1e]">
                Side Effect Management
              </h3>
              <p className="text-[15px] leading-relaxed text-[#6b7280]">
                Proactive outreach to assess tolerance, with intelligent
                escalation to a pharmacist for clinical intervention.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="group rounded-xl border border-black/[0.04] bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-teal-600">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#1c1c1e]">
                Refill Reminders
              </h3>
              <p className="text-[15px] leading-relaxed text-[#6b7280]">
                Automated calls and messages for prescription renewals,
                improving adherence rates and reducing lapsed therapies.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="group rounded-xl border border-black/[0.04] bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-teal-600">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#1c1c1e]">
                Insurance & Coverage
              </h3>
              <p className="text-[15px] leading-relaxed text-[#6b7280]">
                Streamlined prior authorizations, copay inquiries, and
                real-time coverage verification without staff involvement.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="group rounded-xl border border-black/[0.04] bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-teal-600">
                <LifeBuoy className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#1c1c1e]">
                Emergency Triage
              </h3>
              <p className="text-[15px] leading-relaxed text-[#6b7280]">
                Intelligent triage for urgent medication needs with
                immediate escalation to on-call pharmacists when required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="border-t border-black/[0.04] bg-white px-6 py-24"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 font-serif text-4xl tracking-tight text-[#1c1c1e] md:text-5xl">
              Trusted by pharmacy leaders
            </h2>
            <p className="text-lg leading-relaxed text-[#6b7280]">
              Hear from the directors and executives who chose PharmCall to
              transform their pharmacy operations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Testimonial Card 1 */}
            <div className="relative rounded-xl border border-black/[0.04] bg-[#fafaf8] p-8">
              <div className="mb-4 font-serif text-5xl leading-none text-teal-600/20">
                &ldquo;
              </div>
              <p className="mb-6 text-[15px] leading-relaxed text-[#4b5563]">
                PharmCall cut our inbound call volume by 60% in the first
                quarter. Our pharmacists finally have time for clinical
                consultations instead of fielding refill requests all day.
                The ROI was immediate.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600/10 text-sm font-semibold text-teal-700">
                  SK
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1c1c1e]">
                    Sarah Kim, PharmD
                  </div>
                  <div className="text-sm text-[#6b7280]">
                    Director of Pharmacy, Memorial Health
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Card 2 */}
            <div className="relative rounded-xl border border-black/[0.04] bg-[#fafaf8] p-8">
              <div className="mb-4 font-serif text-5xl leading-none text-teal-600/20">
                &ldquo;
              </div>
              <p className="mb-6 text-[15px] leading-relaxed text-[#4b5563]">
                We were skeptical about AI handling sensitive patient
                interactions, but the HIPAA compliance and natural
                conversation quality won us over. Patients don't even
                realize they're speaking with an AI agent.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600/10 text-sm font-semibold text-teal-700">
                  RM
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1c1c1e]">
                    Robert Martinez
                  </div>
                  <div className="text-sm text-[#6b7280]">
                    VP of Operations, CureWell Specialty Rx
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Card 3 */}
            <div className="relative rounded-xl border border-black/[0.04] bg-[#fafaf8] p-8">
              <div className="mb-4 font-serif text-5xl leading-none text-teal-600/20">
                &ldquo;
              </div>
              <p className="mb-6 text-[15px] leading-relaxed text-[#4b5563]">
                We onboarded in under two weeks. PharmCall integrated
                directly with our existing dispensing system and the
                after-hours coverage alone saved us two full-time
                headcount. Truly enterprise-grade.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600/10 text-sm font-semibold text-teal-700">
                  LP
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1c1c1e]">
                    Linda Pham, RPh
                  </div>
                  <div className="text-sm text-[#6b7280]">
                    Chief Pharmacy Officer, Ascend Health
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="bg-[#fafaf8] px-6 py-24"
      >
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-serif text-4xl tracking-tight text-[#1c1c1e] md:text-5xl">
              Frequently asked questions
            </h2>
            <p className="text-lg leading-relaxed text-[#6b7280]">
              Everything you need to know about deploying AI voice agents in your pharmacy.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How does PharmCall handle HIPAA compliance?",
                a: "PharmCall is built from the ground up with HIPAA compliance in mind. All patient data is encrypted at rest and in transit, we execute Business Associate Agreements (BAAs) with every client, and our infrastructure is hosted on SOC 2 Type II certified providers. Voice recordings and transcripts are stored in isolated, encrypted storage with strict access controls.",
              },
              {
                q: "Can patients tell they're speaking with an AI?",
                a: "Our voice agents use natural language processing and advanced speech synthesis to create conversations that feel human and empathetic. Most patients report a seamless experience. However, we always disclose that the call is AI-assisted at the beginning, in compliance with transparency regulations. If a patient requests a human pharmacist at any point, the call is immediately escalated.",
              },
              {
                q: "How long does onboarding take?",
                a: "Most pharmacies are fully operational within two weeks. The process includes integrating with your existing dispensing system, configuring call types and workflows, training the AI on your pharmacy's specific protocols, and a supervised pilot period where calls are monitored before going live.",
              },
              {
                q: "What happens when the AI encounters a question it can't answer?",
                a: "PharmCall uses intelligent escalation. When the AI detects a query outside its scope -- such as a clinical question requiring pharmacist judgment, an adverse reaction report, or an emotionally distressed patient -- it immediately routes the call to your on-call pharmacist with full context and transcript so they can pick up seamlessly.",
              },
              {
                q: "Does PharmCall integrate with our existing pharmacy management system?",
                a: "Yes. We support integrations with all major pharmacy dispensing and management platforms including Pioneer Rx, QS/1, Liberty, McKesson, and PioneerRx. Our API also supports custom integrations for proprietary systems. Data flows bidirectionally -- call outcomes update your records automatically.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-black/[0.04] bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between p-6 text-left font-medium text-[#1c1c1e] [&::-webkit-details-marker]:hidden">
                  <span className="text-[15px] pr-4">{item.q}</span>
                  <span className="shrink-0 text-teal-600 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-[15px] leading-relaxed text-[#6b7280]">
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="border-t border-black/[0.04] bg-white px-6 py-24"
      >
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 font-serif text-4xl tracking-tight text-[#1c1c1e] md:text-5xl">
              Simple, transparent pricing
            </h2>
            <p className="text-lg leading-relaxed text-[#6b7280]">
              Pay for the calls you make. No setup fees, no per-seat charges, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Starter */}
            <div className="rounded-2xl border border-black/[0.04] bg-[#fafaf8] p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#1c1c1e] mb-1">Starter</h3>
                <p className="text-sm text-[#6b7280]">For independent pharmacies</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold tracking-tight text-[#1c1c1e]">$299</span>
                <span className="text-sm text-[#6b7280]">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Up to 500 calls/month", "2 call types", "Email support", "Basic analytics dashboard", "HIPAA-compliant storage"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#4b5563]">
                    <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-teal-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/login"
                className="block rounded-lg border border-teal-600 px-6 py-3 text-center text-sm font-semibold text-teal-600 transition-all hover:bg-teal-50"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Professional */}
            <div className="rounded-2xl border-2 border-teal-600 bg-white p-8 flex flex-col relative shadow-xl shadow-teal-600/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#1c1c1e] mb-1">Professional</h3>
                <p className="text-sm text-[#6b7280]">For growing specialty pharmacies</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold tracking-tight text-[#1c1c1e]">$799</span>
                <span className="text-sm text-[#6b7280]">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Up to 2,000 calls/month", "All 6 call types", "Priority support + Slack channel", "Advanced analytics + AI insights", "PMS integration (Pioneer Rx, QS/1)", "Custom voice agent personality"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#4b5563]">
                    <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-teal-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/login"
                className="block rounded-lg bg-teal-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-500"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl border border-black/[0.04] bg-[#fafaf8] p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#1c1c1e] mb-1">Enterprise</h3>
                <p className="text-sm text-[#6b7280]">For pharmacy networks + health systems</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold tracking-tight text-[#1c1c1e]">Custom</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Unlimited calls", "Custom call workflows", "Dedicated success manager", "White-label voice agents", "SOC 2 Type II + BAA", "SLA guarantee (99.99%)", "Multi-location management"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#4b5563]">
                    <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-teal-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/login"
                className="block rounded-lg border border-teal-600 px-6 py-3 text-center text-sm font-semibold text-teal-600 transition-all hover:bg-teal-50"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Security Section */}
      <section className="border-t border-black/[0.04] bg-[#fafaf8] px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 font-serif text-4xl tracking-tight text-[#1c1c1e] md:text-5xl">
              Compliance &amp; Security
            </h2>
            <p className="text-lg leading-relaxed text-[#6b7280]">
              Enterprise-grade safeguards so you can automate with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: "HIPAA Compliant",
                description:
                  "Full administrative, physical, and technical safeguards for protected health information.",
              },
              {
                icon: ShieldCheck,
                title: "SOC 2 Type II",
                description:
                  "Independently audited controls for security, availability, and confidentiality.",
              },
              {
                icon: Lock,
                title: "256-bit Encryption",
                description:
                  "AES-256 encryption for all data at rest and TLS 1.3 for every transmission.",
              },
              {
                icon: CheckCircle,
                title: "BAA Included",
                description:
                  "Business Associate Agreements executed with every client at no additional cost.",
              },
            ].map((badge) => (
              <div
                key={badge.title}
                className="flex flex-col items-center rounded-xl border border-black/[0.04] bg-white p-8 text-center shadow-sm"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-teal-600/10">
                  <badge.icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-[#1c1c1e]">
                  {badge.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#6b7280]">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-[#0c1220] px-6 py-24">
        {/* Subtle mesh for depth */}
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-mesh-shift absolute -right-20 top-0 h-[300px] w-[300px] rounded-full bg-teal-600/10 blur-[100px]" />
          <div
            className="animate-mesh-shift absolute -left-20 bottom-0 h-[250px] w-[250px] rounded-full bg-slate-500/10 blur-[80px]"
            style={{ animationDelay: "-7s" }}
          />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-serif text-4xl tracking-tight text-[#f0ece6] md:text-5xl">
            Ready to automate your pharmacy calls?
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-lg text-[#f0ece6]/60">
            Join 500+ specialty pharmacies that trust PharmCall to handle
            patient communications with precision and care.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-teal-600/25 transition-all hover:bg-teal-500 hover:shadow-teal-500/30"
            >
              Try Demo Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 rounded-lg border border-[#f0ece6]/15 px-8 py-3.5 text-base font-medium text-[#f0ece6]/70 transition-all hover:border-[#f0ece6]/30 hover:text-[#f0ece6]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0f1a] px-6 pb-8 pt-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-semibold text-[#f0ece6]">
                  PharmCall
                </span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-[#f0ece6]/40">
                AI-powered voice automation built exclusively for specialty
                pharmacies.
              </p>
            </div>

            {/* Product column */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#f0ece6]/60">
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#features"
                    className="text-sm text-[#f0ece6]/40 transition-colors hover:text-[#f0ece6]/70"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="text-sm text-[#f0ece6]/40 transition-colors hover:text-[#f0ece6]/70"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-sm text-[#f0ece6]/40 transition-colors hover:text-[#f0ece6]/70"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources column */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#f0ece6]/60">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#testimonials"
                    className="text-sm text-[#f0ece6]/40 transition-colors hover:text-[#f0ece6]/70"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-sm text-[#f0ece6]/40 transition-colors hover:text-[#f0ece6]/70"
                  >
                    HIPAA Compliance
                  </a>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="text-sm text-[#f0ece6]/40 transition-colors hover:text-[#f0ece6]/70"
                  >
                    Contact Sales
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#f0ece6]/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#f0ece6]/30">
              Built by Viraj
            </p>
            <p className="text-sm text-[#f0ece6]/30">
              Powered by Claude AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
