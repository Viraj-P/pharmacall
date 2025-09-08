'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, Clock, CheckCircle, XCircle } from 'lucide-react'

interface Call {
  id: string
  patient_phone: string
  call_type: string
  status: string
  created_at: string
  duration_seconds?: number
}

export function RecentCalls() {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call with demo data
    const fetchCalls = async () => {
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Demo data
        setCalls([
          {
            id: 'call_001',
            patient_phone: '(555) 123-4567',
            call_type: 'delivery_scheduling',
            status: 'completed',
            created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            duration_seconds: 180
          },
          {
            id: 'call_002',
            patient_phone: '(555) 234-5678',
            call_type: 'medication_change',
            status: 'completed',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            duration_seconds: 240
          },
          {
            id: 'call_003',
            patient_phone: '(555) 345-6789',
            call_type: 'general_inquiry',
            status: 'in_progress',
            created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
          },
          {
            id: 'call_004',
            patient_phone: '(555) 456-7890',
            call_type: 'shipment_feedback',
            status: 'completed',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
            duration_seconds: 120
          },
          {
            id: 'call_005',
            patient_phone: '(555) 567-8901',
            call_type: 'delivery_scheduling',
            status: 'failed',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
          }
        ])
      } catch (error) {
        console.error('Failed to fetch calls:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCalls()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'in_progress':
        return <Phone className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      failed: 'destructive',
      in_progress: 'secondary',
      scheduled: 'outline'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const formatCallType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Calls</CardTitle>
      </CardHeader>
      <CardContent>
        {calls.length === 0 ? (
          <div className="text-sm text-gray-500">No calls yet</div>
        ) : (
          <div className="space-y-4">
            {calls.map((call) => (
              <div key={call.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(call.status)}
                  <div>
                    <div className="text-sm font-medium">
                      {call.patient_phone}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatCallType(call.call_type)}
                    </div>
                    {call.duration_seconds && (
                      <div className="text-xs text-gray-400">
                        Duration: {formatDuration(call.duration_seconds)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(call.status)}
                  <div className="text-xs text-gray-500 mt-1">
                    {getTimeAgo(call.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}