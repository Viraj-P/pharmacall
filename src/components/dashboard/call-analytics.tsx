'use client'

import { useState } from 'react'
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
  const [hoveredDay, setHoveredDay] = useState<string | null>(null)
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
            const isHovered = hoveredDay === day.label
            const failedCalls = day.calls - day.completed

            return (
              <div
                key={day.label}
                className="flex-1 flex flex-col items-center gap-1 relative group"
                onMouseEnter={() => setHoveredDay(day.label)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <span className={`text-xs font-medium transition-colors ${isHovered ? 'text-teal-600' : 'text-gray-600'}`}>{day.calls}</span>
                <div className="w-full relative cursor-pointer" style={{ height: '120px' }}>
                  {/* Total bar (background) */}
                  <div
                    className={`absolute bottom-0 w-full rounded-t-md transition-all duration-300 ease-out ${isHovered ? 'bg-teal-200' : 'bg-teal-100'}`}
                    style={{ height: `${totalHeight}%` }}
                  />
                  {/* Completed bar (foreground) */}
                  <div
                    className={`absolute bottom-0 w-full rounded-t-md transition-all duration-300 ease-out ${isHovered ? 'bg-teal-600' : 'bg-teal-500'}`}
                    style={{ height: `${completedHeight}%` }}
                  />

                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-10 bg-gray-900 text-white rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                      <div className="font-semibold mb-1">{day.label}</div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                        {day.completed} completed
                      </div>
                      {failedCalls > 0 && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {failedCalls} pending/failed
                        </div>
                      )}
                      <div className="mt-1 text-gray-400">{Math.round((day.completed / day.calls) * 100)}% success</div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
                    </div>
                  )}
                </div>
                <span className={`text-xs transition-colors ${isHovered ? 'text-teal-600 font-medium' : 'text-gray-400'}`}>{day.label}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
