'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  TrendingUp,
  Clock,
  ThumbsUp,
  CheckCircle,
  CalendarDays,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------

const DATE_RANGES = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Year to date'] as const

const CALL_VOLUME_TREND = [
  { label: 'Mon', value: 124 },
  { label: 'Tue', value: 156 },
  { label: 'Wed', value: 143 },
  { label: 'Thu', value: 189 },
  { label: 'Fri', value: 201 },
  { label: 'Sat', value: 98 },
  { label: 'Sun', value: 67 },
]

const CALL_OUTCOMES = [
  { label: 'Completed', value: 68, color: '#0d9488' },
  { label: 'Escalated', value: 15, color: '#f59e0b' },
  { label: 'Failed', value: 9, color: '#ef4444' },
  { label: 'Voicemail', value: 8, color: '#8b5cf6' },
]

const TOP_CALL_REASONS = [
  { label: 'Refill Reminders', value: 312 },
  { label: 'Delivery Scheduling', value: 245 },
  { label: 'Side Effects', value: 187 },
  { label: 'Medication Changes', value: 156 },
  { label: 'Insurance Questions', value: 134 },
]

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

// Generate heatmap data: density values from 0-1 for each day/hour
function generateHeatmapData(): number[][] {
  const data: number[][] = []
  for (let day = 0; day < 7; day++) {
    const row: number[] = []
    for (let hour = 0; hour < 24; hour++) {
      let base = 0
      // Higher density during business hours
      if (hour >= 8 && hour <= 18) {
        base = 0.4 + Math.random() * 0.5
      } else if (hour >= 6 && hour <= 20) {
        base = 0.15 + Math.random() * 0.3
      } else {
        base = Math.random() * 0.1
      }
      // Weekends are quieter
      if (day >= 5) {
        base *= 0.4
      }
      // Peak at 10am and 2pm
      if ((hour === 10 || hour === 14) && day < 5) {
        base = 0.85 + Math.random() * 0.15
      }
      row.push(Math.min(1, base))
    }
    data.push(row)
  }
  return data
}

const HEATMAP_DATA = generateHeatmapData()

// ---------------------------------------------------------------------------
// KPI metric cards
// ---------------------------------------------------------------------------

const KPI_METRICS = [
  {
    title: 'Call Volume Trend',
    value: '978',
    change: '+12.3%',
    changeDirection: 'up' as const,
    icon: TrendingUp,
    subtitle: 'calls this period',
  },
  {
    title: 'Avg Call Duration',
    value: '3m 42s',
    change: '-8.1%',
    changeDirection: 'down' as const,
    icon: Clock,
    subtitle: 'per call average',
  },
  {
    title: 'Patient Satisfaction',
    value: '94.2%',
    change: '+2.1pp',
    changeDirection: 'up' as const,
    icon: ThumbsUp,
    subtitle: 'positive feedback',
  },
  {
    title: 'First-Call Resolution',
    value: '87.6%',
    change: '+4.5pp',
    changeDirection: 'up' as const,
    icon: CheckCircle,
    subtitle: 'resolved on first call',
  },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<string>(DATE_RANGES[1])

  const maxCallVolume = Math.max(...CALL_VOLUME_TREND.map((d) => d.value))
  const maxCallReason = Math.max(...TOP_CALL_REASONS.map((r) => r.value))

  // Build conic-gradient string for pie chart
  const totalOutcomes = CALL_OUTCOMES.reduce((sum, o) => sum + o.value, 0)
  let cumulativePercent = 0
  const conicStops = CALL_OUTCOMES.map((outcome) => {
    const start = cumulativePercent
    cumulativePercent += (outcome.value / totalOutcomes) * 100
    return `${outcome.color} ${start}% ${cumulativePercent}%`
  }).join(', ')

  return (
    <div className="space-y-6">
      {/* ----------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">
            In-depth performance metrics and call insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            {DATE_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* KPI Metrics Row                                                   */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_METRICS.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metric.value}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`text-xs font-medium ${
                    metric.changeDirection === 'up'
                      ? 'text-green-600'
                      : 'text-green-600'
                  }`}
                >
                  {metric.change}
                </span>
                <span className="text-xs text-gray-400">{metric.subtitle}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Call Volume Trend + Call Outcome Breakdown                         */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Volume Trend - bar chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              Call Volume Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-48">
              {CALL_VOLUME_TREND.map((day) => {
                const heightPct = (day.value / maxCallVolume) * 100
                return (
                  <div
                    key={day.label}
                    className="flex-1 flex flex-col items-center gap-1.5 group"
                  >
                    <span className="text-xs font-medium text-gray-500 group-hover:text-teal-600 transition-colors">
                      {day.value}
                    </span>
                    <div className="w-full relative" style={{ height: '160px' }}>
                      <div
                        className="absolute bottom-0 w-full rounded-t-md bg-teal-500 group-hover:bg-teal-600 transition-all duration-300"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-teal-600 transition-colors">
                      {day.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Call Outcome Breakdown - pie chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Call Outcome Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              {/* Conic-gradient pie chart */}
              <div className="relative">
                <div
                  className="w-40 h-40 rounded-full"
                  style={{
                    background: `conic-gradient(${conicStops})`,
                  }}
                />
                {/* Inner circle for donut effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">
                      {totalOutcomes}%
                    </span>
                    <span className="text-[10px] text-gray-400">total</span>
                  </div>
                </div>
              </div>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full">
                {CALL_OUTCOMES.map((outcome) => (
                  <div key={outcome.label} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: outcome.color }}
                    />
                    <span className="text-xs text-gray-600">
                      {outcome.label}
                    </span>
                    <span className="text-xs font-semibold text-gray-900 ml-auto">
                      {outcome.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Top Call Reasons + Peak Hours Heatmap                              */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Call Reasons - horizontal bar chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Call Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {TOP_CALL_REASONS.map((reason, idx) => {
                const widthPct = (reason.value / maxCallReason) * 100
                return (
                  <div key={reason.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">
                        {idx + 1}. {reason.label}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {reason.value}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full bg-teal-500 transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Peak Hours Heatmap</CardTitle>
            <p className="text-xs text-gray-400 mt-1">
              Call density by day and hour
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {/* Hour labels */}
              <div className="flex">
                <div className="w-10 shrink-0" />
                <div className="flex-1 grid grid-cols-24 gap-px">
                  {Array.from({ length: 24 }, (_, h) => (
                    <div
                      key={h}
                      className="text-center text-[9px] text-gray-400 leading-tight"
                    >
                      {h % 3 === 0 ? `${h}` : ''}
                    </div>
                  ))}
                </div>
              </div>
              {/* Grid rows */}
              <div className="space-y-px mt-1">
                {DAYS_OF_WEEK.map((day, dayIdx) => (
                  <div key={day} className="flex items-center">
                    <div className="w-10 shrink-0 text-xs text-gray-500 font-medium">
                      {day}
                    </div>
                    <div className="flex-1 grid grid-cols-24 gap-px">
                      {HEATMAP_DATA[dayIdx].map((density, hourIdx) => (
                        <div
                          key={hourIdx}
                          className="aspect-square rounded-sm"
                          style={{
                            backgroundColor: `rgba(13, 148, 136, ${density})`,
                            minWidth: '0',
                          }}
                          title={`${day} ${hourIdx}:00 - Density: ${Math.round(density * 100)}%`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* Intensity legend */}
              <div className="flex items-center justify-end gap-1.5 mt-3">
                <span className="text-[10px] text-gray-400">Low</span>
                {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity) => (
                  <div
                    key={opacity}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor: `rgba(13, 148, 136, ${opacity})`,
                    }}
                  />
                ))}
                <span className="text-[10px] text-gray-400">High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
