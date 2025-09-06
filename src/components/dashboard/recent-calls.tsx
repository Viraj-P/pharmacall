'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Phone, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { VoiceCall, CallStatus, CallType } from '@/types'

interface RecentCallsData {
  calls: VoiceCall[]
  loading: boolean
}

const getStatusIcon = (status: CallStatus) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'in_progress':
      return <Clock className="h-4 w-4 text-blue-600" />
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-600" />
    case 'scheduled':
      return <Calendar className="h-4 w-4 text-yellow-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

const getStatusColor = (status: CallStatus) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'scheduled':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getCallTypeLabel = (type: CallType) => {
  switch (type) {
    case 'delivery_scheduling':
      return 'Delivery Scheduling'
    case 'medication_change':
      return 'Medication Change'
    case 'shipment_feedback':
      return 'Shipment Feedback'
    case 'general_inquiry':
      return 'General Inquiry'
    default:
      return type
  }
}

export function RecentCalls() {
  const [data, setData] = useState<RecentCallsData>({ calls: [], loading: true })

  useEffect(() => {
    const fetchRecentCalls = async () => {
      try {
        const response = await fetch('/api/calls?limit=5')
        const result = await response.json()
        setData({ calls: result.calls || [], loading: false })
      } catch (error) {
        console.error('Failed to fetch recent calls:', error)
        setData({ calls: [], loading: false })
      }
    }

    fetchRecentCalls()
  }, [])

  if (data.loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-32 bg-muted rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-3 w-2/3 bg-muted rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover-lift animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Recent Calls</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.calls.length === 0 ? (
          <div className="text-center py-8">
            <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Recent Calls</h3>
            <p className="text-muted-foreground text-sm">
              Start making calls to see them here
            </p>
          </div>
        ) : (
          data.calls.map((call) => (
            <div
              key={call.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(call.status)}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">
                      {getCallTypeLabel(call.call_type)}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getStatusColor(call.status)}`}
                    >
                      {call.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {call.completed_at 
                      ? formatDistanceToNow(new Date(call.completed_at), { addSuffix: true })
                      : call.scheduled_at 
                        ? `Scheduled ${formatDistanceToNow(new Date(call.scheduled_at), { addSuffix: true })}`
                        : 'Just now'
                    }
                  </p>
                </div>
              </div>
              <div className="text-right">
                {call.duration_seconds && (
                  <p className="text-xs text-muted-foreground">
                    {Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}