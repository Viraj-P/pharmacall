'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Phone, 
  Users, 
  Calendar, 
  FileText, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { CallType } from '@/types'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: any
  action: () => void
  variant: 'default' | 'secondary' | 'outline'
  badge?: string
}

export function QuickActions() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleQuickCall = async (callType: CallType) => {
    setLoading(callType)
    try {
      // In a real app, this would open a modal or navigate to a form
      console.log(`Initiating ${callType} call`)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Failed to initiate call:', error)
    } finally {
      setLoading(null)
    }
  }

  const quickActions: QuickAction[] = [
    {
      id: 'new-delivery-call',
      title: 'Schedule Delivery',
      description: 'Call patient to schedule medication delivery',
      icon: Calendar,
      action: () => handleQuickCall('delivery_scheduling'),
      variant: 'default',
      badge: 'Popular'
    },
    {
      id: 'medication-change',
      title: 'Medication Change',
      description: 'Discuss medication modifications with patient',
      icon: AlertCircle,
      action: () => handleQuickCall('medication_change'),
      variant: 'outline'
    },
    {
      id: 'shipment-feedback',
      title: 'Shipment Feedback',
      description: 'Collect feedback on recent medication delivery',
      icon: CheckCircle,
      action: () => handleQuickCall('shipment_feedback'),
      variant: 'outline'
    },
    {
      id: 'general-inquiry',
      title: 'General Inquiry',
      description: 'Handle general patient questions',
      icon: FileText,
      action: () => handleQuickCall('general_inquiry'),
      variant: 'outline'
    }
  ]

  const stats = [
    {
      label: 'Today\'s Calls',
      value: '12',
      icon: Phone,
      color: 'text-blue-600'
    },
    {
      label: 'Active Patients',
      value: '48',
      icon: Users,
      color: 'text-green-600'
    },
    {
      label: 'Pending Follow-ups',
      value: '7',
      icon: Clock,
      color: 'text-yellow-600'
    }
  ]

  return (
    <Card className="hover-lift animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`mx-auto w-8 h-8 rounded-full bg-muted flex items-center justify-center mb-2`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="text-lg font-semibold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Action Buttons */}
        <div className="space-y-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              className="w-full justify-start h-auto p-4"
              onClick={action.action}
              disabled={loading === action.id}
            >
              <div className="flex items-center space-x-3 w-full">
                <action.icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{action.title}</span>
                    {action.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                {loading === action.id && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* Additional Actions */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" size="sm" className="h-8">
              <Users className="h-4 w-4 mr-2" />
              View Patients
            </Button>
            <Button variant="ghost" size="sm" className="h-8">
              <FileText className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}