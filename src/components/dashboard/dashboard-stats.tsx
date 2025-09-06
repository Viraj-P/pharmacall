'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Phone, CheckCircle, Clock, TrendingUp, Activity, Users, Zap } from 'lucide-react'

interface DashboardStatsData {
  total_calls: number
  completed_calls: number
  pending_calls: number
  success_rate: number
  avg_duration: number
  call_type_distribution: Record<string, number>
  recent_calls: any[]
}

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = "default",
  loading = false 
}: {
  title: string
  value: string | number
  subtitle: string
  icon: any
  trend?: { value: number; label: string }
  color?: "default" | "success" | "warning" | "primary"
  loading?: boolean
}) => {
  const colorClasses = {
    default: "text-muted-foreground",
    success: "text-green-600",
    warning: "text-yellow-600", 
    primary: "text-blue-600"
  }

  const bgClasses = {
    default: "bg-muted/50",
    success: "bg-green-50",
    warning: "bg-yellow-50",
    primary: "bg-blue-50"
  }

  if (loading) {
    return (
      <Card className="hover-lift animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-8 w-8 bg-muted animate-pulse rounded-lg" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-8 w-16 bg-muted animate-pulse rounded" />
          <div className="h-3 w-20 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover-lift animate-fade-in group cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${bgClasses[color]} group-hover:scale-110 transition-transform`}>
          <Icon className={`h-4 w-4 ${colorClasses[color]}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{subtitle}</p>
          {trend && (
            <Badge variant={trend.value > 0 ? "default" : "secondary"} className="text-xs">
              {trend.value > 0 ? "+" : ""}{trend.value}% {trend.label}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats?days=30')
        const data = await response.json()
        setStats(data.stats)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (!stats && !loading) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Activity className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
        <p className="text-muted-foreground">Start making calls to see your statistics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Calls"
          value={stats?.total_calls || 0}
          subtitle="Last 30 days"
          icon={Phone}
          color="primary"
          loading={loading}
        />
        
        <StatCard
          title="Completed"
          value={stats?.completed_calls || 0}
          subtitle={`${stats?.success_rate.toFixed(1) || 0}% success rate`}
          icon={CheckCircle}
          color="success"
          loading={loading}
        />
        
        <StatCard
          title="Pending"
          value={stats?.pending_calls || 0}
          subtitle="Scheduled & in progress"
          icon={Clock}
          color="warning"
          loading={loading}
        />
        
        <StatCard
          title="Avg Duration"
          value={stats?.avg_duration ? `${Math.round(stats.avg_duration / 60)}m ${stats.avg_duration % 60}s` : "0m 0s"}
          subtitle="Per call average"
          icon={TrendingUp}
          color="default"
          loading={loading}
        />
      </div>

      {/* Success Rate Progress */}
      {stats && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Success Rate</span>
                <span className="font-medium">{stats.success_rate.toFixed(1)}%</span>
              </div>
              <Progress 
                value={stats.success_rate} 
                className="h-2"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed_calls}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending_calls}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.total_calls - stats.completed_calls - stats.pending_calls}
                </div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
