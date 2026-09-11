'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, CheckCircle, Clock, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface DashboardStats {
  total_calls: number
  completed_calls: number
  pending_calls: number
  success_rate: number
  avg_duration: number
}

interface TrendProps {
  value: string
  direction: 'up' | 'down'
  positive?: boolean
}

function Trend({ value, direction, positive = true }: TrendProps) {
  const isGood = (direction === 'up' && positive) || (direction === 'down' && !positive)
  return (
    <div className={`flex items-center gap-0.5 text-xs font-medium ${isGood ? 'text-green-600' : 'text-red-500'}`}>
      {direction === 'up' ? (
        <ArrowUpRight className="h-3.5 w-3.5" />
      ) : (
        <ArrowDownRight className="h-3.5 w-3.5" />
      )}
      <span>{value}</span>
      <span className="text-muted-foreground font-normal ml-1">vs last month</span>
    </div>
  )
}

function Sparkline({ data, color = '#0d9488' }: { data: number[]; color?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80
  const h = 24
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// 7-day sparkline data for each stat
const SPARKLINES = {
  total: [156, 172, 168, 185, 190, 178, 198],
  completed: [148, 165, 160, 178, 182, 171, 189],
  pending: [18, 14, 16, 12, 10, 15, 12],
  success: [93, 94, 94, 95, 96, 95, 95],
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    total_calls: 0,
    completed_calls: 0,
    pending_calls: 0,
    success_rate: 0,
    avg_duration: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        } else {
          setStats({
            total_calls: 1247,
            completed_calls: 1189,
            pending_calls: 12,
            success_rate: 95,
            avg_duration: 4.2
          })
        }
      } catch {
        setStats({
          total_calls: 1247,
          completed_calls: 1189,
          pending_calls: 12,
          success_rate: 95,
          avg_duration: 4.2
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-28"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.total_calls.toLocaleString()}</div>
              <Trend value="12%" direction="up" />
            </div>
            <Sparkline data={SPARKLINES.total} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.completed_calls.toLocaleString()}</div>
              <Trend value="8%" direction="up" />
            </div>
            <Sparkline data={SPARKLINES.completed} color="#16a34a" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.pending_calls}</div>
              <Trend value="20%" direction="down" positive={false} />
            </div>
            <Sparkline data={SPARKLINES.pending} color="#ca8a04" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-teal-600" />
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.success_rate}%</div>
              <Trend value="2pp" direction="up" />
            </div>
            <Sparkline data={SPARKLINES.success} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
