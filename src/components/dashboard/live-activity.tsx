'use client'

import { Phone } from 'lucide-react'

export function LiveActivity() {
  return (
    <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg bg-gradient-to-r from-teal-50 to-transparent border border-teal-100">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
        <span className="text-sm font-semibold text-teal-800">Live</span>
      </div>

      <div className="h-4 w-px bg-teal-200" />

      <div className="flex items-center gap-1.5 text-sm text-teal-700">
        <Phone className="h-3.5 w-3.5" />
        <span className="font-medium">3 calls active</span>
      </div>

      <div className="h-4 w-px bg-teal-200" />

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-700">
          1 in progress
        </span>
        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
          2 ringing
        </span>
      </div>
    </div>
  )
}
