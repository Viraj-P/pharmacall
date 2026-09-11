'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

export function DashboardTimestamp() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    setTime(
      new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    )
  }, [])

  if (!time) return null

  return (
    <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
      <Clock className="h-3 w-3" />
      Dashboard data refreshed at {time}
    </p>
  )
}
