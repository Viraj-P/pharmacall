'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, MessageSquare, FileText, AlertTriangle } from 'lucide-react'

interface CallDetail {
  transcript_excerpt: string
  ai_summary: string
  action_items: string[]
  sentiment: 'positive' | 'neutral' | 'needs_attention'
}

interface Call {
  id: string
  patient_phone: string
  call_type: string
  status: string
  created_at: string
  duration_seconds?: number
  detail?: CallDetail
}

const DEMO_DETAILS: Record<string, CallDetail> = {
  call_001: {
    transcript_excerpt: "Agent: Good afternoon, I'm calling from CureWell Pharmacy regarding your Humira delivery. We have your next shipment ready. Would Tuesday between 2-5 PM work for you?\nPatient: Tuesday works great. Can you also confirm my copay amount?\nAgent: Absolutely. Your copay for this cycle is $35 after insurance. I'll schedule the delivery for Tuesday afternoon.",
    ai_summary: "Patient confirmed Tuesday 2-5 PM delivery window for Humira shipment. Copay of $35 confirmed. Patient was cooperative and had no concerns about the medication.",
    action_items: [
      "Schedule delivery for Tuesday 2-5 PM",
      "Confirm insurance copay of $35 in billing system",
    ],
    sentiment: 'positive',
  },
  call_002: {
    transcript_excerpt: "Agent: I'm calling about your recent prescription change from Metoprolol 25mg to 50mg. Your doctor submitted the new dosage yesterday. We have the updated prescription ready.\nPatient: Yes, my cardiologist said to switch. Are there any side effects I should watch for at the higher dose?\nAgent: With the increased dosage, monitor for dizziness or fatigue. If you experience persistent symptoms, contact your cardiologist. I'll transfer you to our pharmacist for a detailed consultation.",
    ai_summary: "Patient acknowledged dosage change for Metoprolol (25mg to 50mg). Expressed concern about side effects. Call escalated to pharmacist for clinical consultation on potential adverse effects at the higher dose.",
    action_items: [
      "Pharmacist follow-up: clinical consult on Metoprolol 50mg side effects",
      "Update prescription record to reflect new dosage",
      "Flag for 7-day follow-up call to check tolerance",
    ],
    sentiment: 'needs_attention',
  },
  call_004: {
    transcript_excerpt: "Agent: We're following up on your recent medication shipment delivered last Thursday. How was the delivery experience?\nPatient: Everything arrived on time and in good condition. The cold packaging was intact. Very happy with the service.\nAgent: Excellent, thank you for the feedback. We'll note that for our records.",
    ai_summary: "Patient confirmed satisfactory delivery experience. Cold chain packaging intact. No issues reported. Positive feedback recorded.",
    action_items: [
      "Log positive delivery feedback in patient record",
    ],
    sentiment: 'positive',
  },
}

export function RecentCalls() {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const DEMO_CALLS: Call[] = [
      {
        id: 'call_001',
        patient_phone: '(555) 123-4567',
        call_type: 'delivery_scheduling',
        status: 'completed',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        duration_seconds: 180,
        detail: DEMO_DETAILS.call_001,
      },
      {
        id: 'call_002',
        patient_phone: '(555) 234-5678',
        call_type: 'medication_change',
        status: 'completed',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        duration_seconds: 240,
        detail: DEMO_DETAILS.call_002,
      },
      {
        id: 'call_003',
        patient_phone: '(555) 345-6789',
        call_type: 'general_inquiry',
        status: 'in_progress',
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: 'call_004',
        patient_phone: '(555) 456-7890',
        call_type: 'shipment_feedback',
        status: 'completed',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        duration_seconds: 120,
        detail: DEMO_DETAILS.call_004,
      },
      {
        id: 'call_005',
        patient_phone: '(555) 567-8901',
        call_type: 'delivery_scheduling',
        status: 'failed',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      }
    ]

    const fetchCalls = async () => {
      try {
        const res = await fetch('/api/calls')
        if (res.ok) {
          const data = await res.json()
          setCalls(data.length > 0 ? data : DEMO_CALLS)
        } else {
          setCalls(DEMO_CALLS)
        }
      } catch {
        setCalls(DEMO_CALLS)
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
        return <Phone className="h-4 w-4 text-teal-600" />
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200'
      case 'needs_attention': return 'text-amber-600 bg-amber-50 border-amber-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Positive'
      case 'needs_attention': return 'Needs Attention'
      default: return 'Neutral'
    }
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
          <div className="space-y-1">
            {calls.map((call) => {
              const isExpanded = expandedId === call.id
              const hasDetail = !!call.detail

              return (
                <div key={call.id}>
                  <button
                    onClick={() => hasDetail && setExpandedId(isExpanded ? null : call.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${
                      hasDetail ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default'
                    } ${isExpanded ? 'bg-gray-50' : ''}`}
                  >
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
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        {getStatusBadge(call.status)}
                        <div className="text-xs text-gray-500 mt-1">
                          {getTimeAgo(call.created_at)}
                        </div>
                      </div>
                      {hasDetail && (
                        isExpanded
                          ? <ChevronUp className="h-4 w-4 text-gray-400" />
                          : <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Detail View */}
                  {isExpanded && call.detail && (
                    <div className="ml-10 mr-3 mb-3 space-y-3 animate-in slide-in-from-top-1 duration-200">
                      {/* Sentiment Badge */}
                      <div className="flex items-center gap-2">
                        {call.detail.sentiment === 'needs_attention' ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                        ) : (
                          <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                        )}
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getSentimentColor(call.detail.sentiment)}`}>
                          {getSentimentLabel(call.detail.sentiment)}
                        </span>
                      </div>

                      {/* AI Summary */}
                      <div className="rounded-md border border-teal-100 bg-teal-50/50 p-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <FileText className="h-3.5 w-3.5 text-teal-600" />
                          <span className="text-xs font-semibold text-teal-700 uppercase tracking-wide">AI Summary</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {call.detail.ai_summary}
                        </p>
                      </div>

                      {/* Transcript Excerpt */}
                      <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <MessageSquare className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Transcript Excerpt</span>
                        </div>
                        <pre className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap font-sans">
                          {call.detail.transcript_excerpt}
                        </pre>
                      </div>

                      {/* Action Items */}
                      {call.detail.action_items.length > 0 && (
                        <div className="rounded-md border border-gray-200 bg-white p-3">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Action Items</span>
                          <ul className="space-y-1.5">
                            {call.detail.action_items.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
