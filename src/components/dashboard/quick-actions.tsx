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

  const [validationError, setValidationError] = useState('')
  const [liveTranscript, setLiveTranscript] = useState<{ speaker: 'ai' | 'patient'; text: string }[]>([])

  const CALL_SCRIPTS: Record<string, { speaker: 'ai' | 'patient'; text: string }[]> = {
    refill_reminder: [
      { speaker: 'ai', text: 'Hi, this is a call from your pharmacy. Am I speaking with the patient?' },
      { speaker: 'patient', text: 'Yes, that\'s me.' },
      { speaker: 'ai', text: 'I\'m calling about your prescription that\'s coming up for a refill. Would you like us to prepare it?' },
      { speaker: 'patient', text: 'Yes, please go ahead.' },
      { speaker: 'ai', text: 'Great, it\'ll be ready for pickup tomorrow after 2 PM. Have a good day!' },
    ],
    delivery_scheduling: [
      { speaker: 'ai', text: 'Hi, this is your pharmacy calling about your upcoming medication delivery.' },
      { speaker: 'patient', text: 'Oh yes, I was expecting your call.' },
      { speaker: 'ai', text: 'We have your prescription ready. Would Thursday or Friday work better for delivery?' },
      { speaker: 'patient', text: 'Thursday afternoon would be perfect.' },
      { speaker: 'ai', text: 'Thursday afternoon it is. You\'ll get a text with the delivery window. Thanks!' },
    ],
    side_effect_check: [
      { speaker: 'ai', text: 'Hi, I\'m calling from your pharmacy to check in on your new medication.' },
      { speaker: 'patient', text: 'Hi, yes. I started it last week.' },
      { speaker: 'ai', text: 'How have you been feeling? Any side effects or concerns?' },
      { speaker: 'patient', text: 'A bit of nausea the first few days, but it\'s better now.' },
      { speaker: 'ai', text: 'That\'s common and usually resolves. If it returns, contact your pharmacist. Take care!' },
    ],
  }

  const handleInitiateCall = async () => {
    if (!phoneNumber || !callType) {
      setValidationError('Please fill in all fields')
      return
    }
    setValidationError('')

    setLoading(true)
    setCallStatus('initiating')
    setLiveTranscript([])

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      const demoCallId = `call_${Date.now()}`
      setCallId(demoCallId)
      setCallStatus('success')
      setLoading(false)

      // Simulate live transcript streaming
      const script = CALL_SCRIPTS[callType] || CALL_SCRIPTS.refill_reminder
      for (let i = 0; i < script.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800))
        setLiveTranscript(prev => [...prev, script[i]])
      }
    } catch {
      setCallStatus('error')
      setLoading(false)
      setTimeout(() => {
        setCallStatus('idle')
      }, 3000)
    }
  }

  const getStatusMessage = () => {
    switch (callStatus) {
      case 'initiating':
        return {
          message: 'Initiating AI voice call...',
          color: 'text-teal-600',
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
          <Phone className="h-5 w-5 text-teal-600" />
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
              <SelectItem value="refill_reminder">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Refill Reminder</span>
                </div>
              </SelectItem>
              <SelectItem value="side_effect_check">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Side Effect Check-in</span>
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

        <div className="space-y-2">
          <Label htmlFor="notes">Patient Context <span className="text-gray-400 font-normal">(optional)</span></Label>
          <textarea
            id="notes"
            placeholder="e.g. Patient recently changed from Metoprolol 25mg to 50mg. Check for side effects."
            rows={3}
            disabled={loading}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
          <p className="text-xs text-gray-400">Context shared with the AI agent before the call</p>
        </div>

        {validationError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-600">{validationError}</span>
          </div>
        )}

        {statusInfo && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            callStatus === 'success' ? 'bg-green-50 border border-green-200' :
            callStatus === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-teal-50 border border-teal-200'
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

        {/* Live Transcript */}
        {callStatus === 'success' && liveTranscript.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-gray-600">Live Transcript</span>
              <span className="text-xs text-gray-400 ml-auto">Call ID: {callId}</span>
            </div>
            <div className="p-3 space-y-2.5 max-h-60 overflow-y-auto">
              {liveTranscript.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.speaker === 'patient' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                    msg.speaker === 'ai' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {msg.speaker === 'ai' ? 'AI' : 'P'}
                  </div>
                  <div className={`max-w-[80%] rounded-xl px-3 py-1.5 text-xs leading-relaxed ${
                    msg.speaker === 'ai'
                      ? 'rounded-tl-sm bg-teal-50 text-teal-900'
                      : 'rounded-tr-sm bg-gray-50 text-gray-800'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-3 py-2 border-t border-gray-100 flex justify-between items-center">
              <span className="text-[10px] text-gray-400">Demo simulation</span>
              <button
                onClick={() => {
                  setPhoneNumber('')
                  setCallType('')
                  setCallStatus('idle')
                  setCallId('')
                  setLiveTranscript([])
                }}
                className="text-xs font-medium text-teal-600 hover:text-teal-700 cursor-pointer"
              >
                New Call
              </button>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Demo Mode:</strong> This simulates a real AI voice call</p>
          <p><strong>Real Implementation:</strong> Would connect to Retell AI and make actual phone calls</p>
        </div>
      </CardContent>
    </Card>
  )
}