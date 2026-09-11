'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface DayData {
  label: string
  calls: number
  completed: number
}

const DEMO_ANALYTICS: DayData[] = [
  { label: 'Mon', calls: 24, completed: 22 },
  { label: 'Tue', calls: 31, completed: 28 },
  { label: 'Wed', calls: 28, completed: 26 },
  { label: 'Thu', calls: 35, completed: 33 },
  { label: 'Fri', calls: 42, completed: 39 },
  { label: 'Sat', calls: 18, completed: 17 },
  { label: 'Sun', calls: 12, completed: 11 },
]

export function CallAnalytics() {
  const data = DEMO_ANALYTICS
  const maxCalls = Math.max(...data.map(d => d.calls))
  const totalCalls = data.reduce((sum, d) => sum + d.calls, 0)
  const totalCompleted = data.reduce((sum, d) => sum + d.completed, 0)
  const completionRate = Math.round((totalCompleted / totalCalls) * 100)

  return (
    <Card className="col-span-1 lg:col-span-2 row-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-teal-600" />
            Weekly Call Volume
          </CardTitle>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-teal-500" />
              Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-teal-200" />
              Total
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary stats */}
        <div className="flex gap-6 mb-6">
          <div>
            <div className="text-2xl font-bold text-gray-900">{totalCalls}</div>
            <div className="text-xs text-gray-500">Total calls</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-teal-600">{completionRate}%</div>
            <div className="text-xs text-gray-500">Completion rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{Math.round(totalCalls / 7)}</div>
            <div className="text-xs text-gray-500">Avg. per day</div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-2 h-40">
          {data.map((day) => {
            const totalHeight = (day.calls / maxCalls) * 100
            const completedHeight = (day.completed / maxCalls) * 100

            return (
              <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-gray-600">{day.calls}</span>
                <div className="w-full relative" style={{ height: '120px' }}>
                  {/* Total bar (background) */}
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-teal-100 transition-all duration-500 ease-out"
                    style={{ height: `${totalHeight}%` }}
                  />
                  {/* Completed bar (foreground) */}
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-teal-500 transition-all duration-500 ease-out"
                    style={{ height: `${completedHeight}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{day.label}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
