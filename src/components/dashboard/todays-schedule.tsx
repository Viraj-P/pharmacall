'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Phone } from 'lucide-react'

interface ScheduledCall {
  time: string
  patient: string
  type: string
  priority: 'normal' | 'high'
}

const DEMO_SCHEDULE: ScheduledCall[] = [
  { time: '10:00 AM', patient: 'M. Johnson', type: 'Refill Reminder', priority: 'normal' },
  { time: '10:30 AM', patient: 'R. Patel', type: 'Side Effect Check', priority: 'high' },
  { time: '11:15 AM', patient: 'S. Williams', type: 'Delivery Scheduling', priority: 'normal' },
  { time: '1:00 PM', patient: 'K. Chen', type: 'Medication Change', priority: 'high' },
  { time: '2:30 PM', patient: 'A. Garcia', type: 'Refill Reminder', priority: 'normal' },
  { time: '3:45 PM', patient: 'D. Brown', type: 'Shipment Feedback', priority: 'normal' },
]

export function TodaysSchedule() {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            Today&apos;s Schedule
          </CardTitle>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeStr}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {DEMO_SCHEDULE.map((call, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs font-mono text-gray-400 w-16 shrink-0">
                {call.time}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {call.patient}
                  </span>
                  {call.priority === 'high' && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                      Priority
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">{call.type}</span>
              </div>
              <Phone className="h-3.5 w-3.5 text-gray-300 shrink-0" />
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 text-center">
          <span className="text-xs text-gray-400">
            {DEMO_SCHEDULE.length} calls scheduled today
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
