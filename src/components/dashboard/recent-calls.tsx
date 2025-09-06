'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Phone, Clock, CheckCircle, XCircle, ArrowRight, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Call {
  id: string
  call_type: string
  status: string
  created_at: string
  duration_seconds?: number
  patients: {
    encrypted_name?: string
    patient_id_hash: string
  }
}

const CallItem = ({ call }: { call: Call }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          badge: 'default' as const,
          label: 'Completed'
        }
      case 'in_progress':
        return {
          icon: Clock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          badge: 'secondary' as const,
          label: 'In Progress'
        }
      case 'scheduled':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          badge: 'outline' as const,
          label: 'Scheduled'
        }
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          badge: 'destructive' as const,
          label: 'Failed'
        }
      default:
        return {
          icon: Phone,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          badge: 'outline' as const,
          label: status
        }
    }
  }

  const formatCallType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const config = getStatusConfig(call.status)
  const Icon = config.icon
  const patientName = call.patients.encrypted_name || `Patient ${call.patients.patient_id_hash.slice(0, 8)}`
  const initials = patientName.split(' ').map(n => n[0]).join('').toUpperCase() || 'P'

  return (
    <div className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
      <div className={`p-2 rounded-full ${config.bgColor} group-hover:scale-110 transition-transform`}>
        <Icon className={`h-4 w-4 ${config.color}`} />
      </div>
      
      <Avatar className="h-10 w-10">
        <AvatarImage src="" alt={patientName} />
        <AvatarFallback className="text-xs font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
            {patientName}
          </p>
          <Badge variant={config.badge} className="text-xs">
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted-foreground">
            {formatCallType(call.call_type)}
          </p>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {call.duration_seconds && (
              <span>{formatDuration(call.duration_seconds)}</span>
            )}
            <span>•</span>
            <span>{formatDistanceToNow(new Date(call.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
      
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </div>
  )
}

export function RecentCalls() {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentCalls = async () => {
      try {
        const response = await fetch('/api/calls?limit=5')
        const data = await response.json()
        setCalls(data.calls || [])
      } catch (error) {
        console.error('Failed to fetch recent calls:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentCalls()
  }, [])

  if (loading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Recent Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3">
                <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
                <div className="h-6 bg-muted animate-pulse rounded w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Recent Calls
        </CardTitle>
        <Button variant="outline" size="sm" className="hover-lift">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {calls.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Phone className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Recent Calls</h3>
            <p className="text-muted-foreground mb-4">
              Start by initiating your first call to see activity here
            </p>
            <Button size="sm" className="hover-lift">
              <Phone className="h-4 w-4 mr-2" />
              Make First Call
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {calls.map((call, index) => (
              <div key={call.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CallItem call={call} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
