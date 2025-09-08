'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Phone, Calendar, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export function QuickActions() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [callType, setCallType] = useState('')
  const [loading, setLoading] = useState(false)
  const [callStatus, setCallStatus] = useState<'idle' | 'initiating' | 'success' | 'error'>('idle')
  const [callId, setCallId] = useState('')

  const handleInitiateCall = async () => {
    if (!phoneNumber || !callType) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    setCallStatus('initiating')
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate a demo call ID
      const demoCallId = `call_${Date.now()}`
      setCallId(demoCallId)
      
      // Simulate successful call initiation
      setCallStatus('success')
      
      // Reset form after success
      setTimeout(() => {
        setPhoneNumber('')
        setCallType('')
        setCallStatus('idle')
        setCallId('')
      }, 3000)
      
    } catch (error) {
      setCallStatus('error')
      setTimeout(() => {
        setCallStatus('idle')
      }, 3000)
    } finally {
      setLoading(false)
    }
  }

  const getStatusMessage = () => {
    switch (callStatus) {
      case 'initiating':
        return {
          message: 'Initiating AI voice call...',
          color: 'text-blue-600',
          icon: <Loader2 className="h-4 w-4 animate-spin" />
        }
      case 'success':
        return {
          message: `Call initiated successfully! Call ID: ${callId}`,
          color: 'text-green-600',
          icon: <CheckCircle className="h-4 w-4" />
        }
      case 'error':
        return {
          message: 'Failed to initiate call. Please try again.',
          color: 'text-red-600',
          icon: <AlertCircle className="h-4 w-4" />
        }
      default:
        return null
    }
  }

  const statusInfo = getStatusMessage()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-blue-600" />
          Initiate AI Voice Call
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Patient Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="call-type">Call Type</Label>
          <Select value={callType} onValueChange={setCallType} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="Select call type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delivery_scheduling">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Delivery Scheduling</span>
                </div>
              </SelectItem>
              <SelectItem value="medication_change">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Medication Change</span>
                </div>
              </SelectItem>
              <SelectItem value="shipment_feedback">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Shipment Feedback</span>
                </div>
              </SelectItem>
              <SelectItem value="general_inquiry">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>General Inquiry</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {statusInfo && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            callStatus === 'success' ? 'bg-green-50 border border-green-200' :
            callStatus === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            {statusInfo.icon}
            <span className={`text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.message}
            </span>
          </div>
        )}

        <Button 
          onClick={handleInitiateCall} 
          disabled={loading || !phoneNumber || !callType}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Initiating Call...
            </>
          ) : (
            <>
              <Phone className="h-4 w-4 mr-2" />
              Initiate AI Call
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Demo Mode:</strong> This simulates a real AI voice call</p>
          <p><strong>Real Implementation:</strong> Would connect to Retell AI and make actual phone calls</p>
        </div>
      </CardContent>
    </Card>
  )
}