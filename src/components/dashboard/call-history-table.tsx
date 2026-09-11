'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Phone, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp,
  MessageSquare, FileText, AlertTriangle, Search, Filter, Download,
} from 'lucide-react'

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

const ALL_CALLS: Call[] = [
  {
    id: 'call_001',
    patient_phone: '(555) 123-4567',
    call_type: 'delivery_scheduling',
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    duration_seconds: 180,
    detail: {
      transcript_excerpt: "Agent: Good afternoon, I'm calling from CureWell Pharmacy regarding your Humira delivery. We have your next shipment ready. Would Tuesday between 2-5 PM work for you?\nPatient: Tuesday works great. Can you also confirm my copay amount?\nAgent: Absolutely. Your copay for this cycle is $35 after insurance.",
      ai_summary: "Patient confirmed Tuesday 2-5 PM delivery window for Humira shipment. Copay of $35 confirmed.",
      action_items: ["Schedule delivery for Tuesday 2-5 PM", "Confirm insurance copay of $35 in billing system"],
      sentiment: 'positive',
    },
  },
  {
    id: 'call_002',
    patient_phone: '(555) 234-5678',
    call_type: 'medication_change',
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    duration_seconds: 240,
    detail: {
      transcript_excerpt: "Agent: I'm calling about your recent prescription change from Metoprolol 25mg to 50mg. Your doctor submitted the new dosage yesterday.\nPatient: Yes, my cardiologist said to switch. Are there any side effects I should watch for?",
      ai_summary: "Patient acknowledged dosage change for Metoprolol (25mg to 50mg). Expressed concern about side effects. Escalated to pharmacist.",
      action_items: ["Pharmacist follow-up: clinical consult on Metoprolol 50mg", "Flag for 7-day follow-up call"],
      sentiment: 'needs_attention',
    },
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
    detail: {
      transcript_excerpt: "Agent: We're following up on your recent medication shipment delivered last Thursday.\nPatient: Everything arrived on time and in good condition. Very happy with the service.",
      ai_summary: "Patient confirmed satisfactory delivery experience. Cold chain packaging intact. No issues.",
      action_items: ["Log positive delivery feedback"],
      sentiment: 'positive',
    },
  },
  {
    id: 'call_005',
    patient_phone: '(555) 567-8901',
    call_type: 'delivery_scheduling',
    status: 'failed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'call_006',
    patient_phone: '(555) 678-9012',
    call_type: 'refill_reminder',
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    duration_seconds: 95,
    detail: {
      transcript_excerpt: "Agent: This is a courtesy call from CureWell Pharmacy. Your prescription for Lisinopril 10mg is due for refill in 5 days.\nPatient: Oh, thank you for the reminder. Yes, please go ahead and refill it.\nAgent: Done. It will be ready for pickup tomorrow after 2 PM.",
      ai_summary: "Patient approved automatic refill for Lisinopril 10mg. Prescription will be ready for pickup tomorrow after 2 PM.",
      action_items: ["Process refill for Lisinopril 10mg", "Mark ready for pickup by 2 PM tomorrow"],
      sentiment: 'positive',
    },
  },
  {
    id: 'call_007',
    patient_phone: '(555) 789-0123',
    call_type: 'side_effect_check',
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    duration_seconds: 310,
    detail: {
      transcript_excerpt: "Agent: We're calling to check in on your first week with Atorvastatin. How have you been feeling?\nPatient: I've been having some muscle aches, especially in my legs. Is that normal?\nAgent: Muscle discomfort can occur with statins. I'm going to connect you with our pharmacist for a clinical assessment.",
      ai_summary: "Patient reported muscle aches in legs after one week on Atorvastatin. Potential myalgia side effect. Escalated to pharmacist for clinical assessment and possible CK level recommendation.",
      action_items: ["Urgent: Pharmacist clinical review for statin myalgia", "Recommend CK level blood test to prescriber", "Schedule follow-up call in 3 days"],
      sentiment: 'needs_attention',
    },
  },
  {
    id: 'call_008',
    patient_phone: '(555) 890-1234',
    call_type: 'delivery_scheduling',
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    duration_seconds: 145,
    detail: {
      transcript_excerpt: "Agent: Your Dupixent shipment is ready for delivery. What day works best this week?\nPatient: Thursday morning would be ideal, before noon if possible.\nAgent: I have Thursday 9 AM to 12 PM available. Does that work?",
      ai_summary: "Scheduled Dupixent delivery for Thursday 9 AM - 12 PM. Patient confirmed availability.",
      action_items: ["Schedule delivery for Thursday 9 AM - 12 PM"],
      sentiment: 'positive',
    },
  },
]

const FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Failed', value: 'failed' },
]

export function CallHistoryTable() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCalls = ALL_CALLS.filter(call => {
    if (statusFilter !== 'all' && call.status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        call.patient_phone.includes(q) ||
        call.call_type.replace('_', ' ').toLowerCase().includes(q) ||
        call.detail?.ai_summary.toLowerCase().includes(q)
      )
    }
    return true
  })

  const formatCallType = (type: string) =>
    type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--'
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) return `${Math.floor(diffMs / (1000 * 60))}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />
      case 'in_progress': return <Phone className="h-4 w-4 text-teal-600 animate-pulse" />
      default: return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      failed: 'destructive',
      in_progress: 'secondary',
    } as const
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.replace(/_/g, ' ')}
      </Badge>
    )
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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by phone, call type, or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                statusFilter === opt.value
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count + export */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {filteredCalls.length} call{filteredCalls.length !== 1 ? 's' : ''}
          {statusFilter !== 'all' && ` (${statusFilter.replace('_', ' ')})`}
        </p>
        <button
          onClick={() => {
            const header = 'Call ID,Phone,Type,Status,Date,Duration,Summary\n'
            const rows = filteredCalls.map(c => {
              const summary = c.detail?.ai_summary?.replace(/"/g, '""') || ''
              return `"${c.id}","${c.patient_phone}","${formatCallType(c.call_type)}","${c.status}","${new Date(c.created_at).toISOString()}","${formatDuration(c.duration_seconds)}","${summary}"`
            }).join('\n')
            const blob = new Blob([header + rows], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `pharmacall-history-${new Date().toISOString().split('T')[0]}.csv`
            a.click()
            URL.revokeObjectURL(url)
          }}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-teal-600 transition-colors cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      {/* Call list */}
      <Card>
        <CardContent className="p-0">
          {filteredCalls.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              No calls match your filters
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredCalls.map((call) => {
                const isExpanded = expandedId === call.id
                const hasDetail = !!call.detail

                return (
                  <div key={call.id}>
                    <button
                      onClick={() => hasDetail && setExpandedId(isExpanded ? null : call.id)}
                      className={`w-full flex items-center justify-between px-5 py-4 transition-colors text-left ${
                        hasDetail ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default'
                      } ${isExpanded ? 'bg-gray-50' : ''}`}
                    >
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(call.status)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {call.patient_phone}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatCallType(call.call_type)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <div className="text-xs text-gray-500">
                            {formatDuration(call.duration_seconds)}
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(call.status)}
                          <div className="text-xs text-gray-400 mt-1">
                            {formatDate(call.created_at)}
                          </div>
                        </div>
                        {hasDetail && (
                          isExpanded
                            ? <ChevronUp className="h-4 w-4 text-gray-400" />
                            : <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && call.detail && (
                      <div className="px-5 pb-5 pt-1 ml-9 space-y-3">
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

                        <div className="rounded-md border border-teal-100 bg-teal-50/50 p-3">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <FileText className="h-3.5 w-3.5 text-teal-600" />
                            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wide">AI Summary</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{call.detail.ai_summary}</p>
                        </div>

                        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <MessageSquare className="h-3.5 w-3.5 text-gray-500" />
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Transcript</span>
                          </div>
                          <pre className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap font-sans">{call.detail.transcript_excerpt}</pre>
                        </div>

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
    </div>
  )
}
