'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, TrendingUp, Clock, AlertTriangle } from 'lucide-react'

interface Insight {
  label: string
  value: string
  detail: string
  type: 'info' | 'warning' | 'positive'
}

const DEMO_INSIGHTS: Insight[] = [
  {
    label: 'Top Patient Concern',
    value: 'Side Effects',
    detail: '23% of calls this week involved side effect questions — up from 15% last week',
    type: 'warning',
  },
  {
    label: 'Busiest Window',
    value: '10 AM – 12 PM',
    detail: '38% of daily call volume concentrates in this 2-hour window',
    type: 'info',
  },
  {
    label: 'Refill Compliance',
    value: '91% accepted',
    detail: 'Patients accepted 91% of AI-initiated refill reminders this month',
    type: 'positive',
  },
  {
    label: 'Escalation Rate',
    value: '8.2%',
    detail: 'Down from 11% last month — AI is resolving more calls independently',
    type: 'positive',
  },
]

function InsightIcon({ type }: { type: Insight['type'] }) {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />
    case 'positive':
      return <TrendingUp className="h-4 w-4 text-green-600" />
    default:
      return <Clock className="h-4 w-4 text-teal-600" />
  }
}

function insightAccent(type: Insight['type']) {
  switch (type) {
    case 'warning':
      return 'border-l-amber-400 bg-amber-50/40'
    case 'positive':
      return 'border-l-green-400 bg-green-50/40'
    default:
      return 'border-l-teal-400 bg-teal-50/40'
  }
}

export function AiInsights() {
  const [mountedAt] = useState(() => Date.now())
  const [minutesAgo, setMinutesAgo] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutesAgo(Math.floor((Date.now() - mountedAt) / 60000))
    }, 30000)
    return () => clearInterval(interval)
  }, [mountedAt])

  const lastUpdatedLabel = minutesAgo < 1 ? 'just now' : `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-teal-600" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {DEMO_INSIGHTS.map((insight) => (
          <div
            key={insight.label}
            className={`rounded-lg border-l-[3px] p-3 transition-shadow duration-200 cursor-default hover:shadow-md hover:scale-[1.01] ${insightAccent(insight.type)}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-500">{insight.label}</span>
              <InsightIcon type={insight.type} />
            </div>
            <div className="text-base font-semibold text-gray-900 mb-0.5">{insight.value}</div>
            <p className="text-xs text-gray-500 leading-relaxed">{insight.detail}</p>
          </div>
        ))}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Last updated: {lastUpdatedLabel}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
