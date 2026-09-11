import "./globals.css"
import { Instrument_Serif, DM_Sans } from "next/font/google"
import { Providers } from "@/components/providers"
import type { Metadata } from "next"

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "PharmCall — AI Voice Automation for Specialty Pharmacies",
  description: "AI-powered phone agents that handle refill calls, delivery scheduling, and patient outreach around the clock — so your pharmacists can focus on clinical care.",
  openGraph: {
    title: "PharmCall — AI Voice Automation for Specialty Pharmacies",
    description: "AI-powered phone agents that handle refill calls, delivery scheduling, and patient outreach around the clock.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PharmCall — AI Voice Automation for Specialty Pharmacies",
    description: "The voice your pharmacy never has to staff.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${dmSans.variable} scroll-smooth`}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
