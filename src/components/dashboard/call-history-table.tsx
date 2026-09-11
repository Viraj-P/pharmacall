'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Phone, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp,
  MessageSquare, FileText, AlertTriangle, Search, Filter, Download,
  User, Bot, ClipboardList, Info, PhoneOff, PhoneIncoming,
} from 'lucide-react'

interface TranscriptMessage {
  speaker: 'ai' | 'patient'
  text: string
  timestamp: string
}

interface CallDetail {
  transcript_excerpt: string
  transcript_messages: TranscriptMessage[]
  ai_summary: string
  action_items: string[]
  sentiment: 'positive' | 'neutral' | 'needs_attention'
  notes?: string
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
      transcript_messages: [
        { speaker: 'ai', text: "Good afternoon, I'm calling from CureWell Pharmacy regarding your Humira delivery. We have your next shipment ready.", timestamp: '0:00' },
        { speaker: 'patient', text: "Oh hi, yes I was expecting this call.", timestamp: '0:12' },
        { speaker: 'ai', text: "Great. We have a few delivery windows available this week. Would Tuesday between 2-5 PM work for you?", timestamp: '0:18' },
        { speaker: 'patient', text: "Tuesday works great. Can you also confirm my copay amount?", timestamp: '0:32' },
        { speaker: 'ai', text: "Absolutely. Let me pull that up. Your copay for this cycle is $35 after insurance. Would you like me to confirm that delivery slot?", timestamp: '0:40' },
        { speaker: 'patient', text: "Yes, please go ahead and book it. Thank you.", timestamp: '1:05' },
        { speaker: 'ai', text: "You're all set for Tuesday 2-5 PM. You'll receive a text confirmation shortly. Is there anything else I can help with?", timestamp: '1:12' },
        { speaker: 'patient', text: "No, that's everything. Thanks!", timestamp: '1:28' },
        { speaker: 'ai', text: "Have a wonderful day. Goodbye!", timestamp: '1:32' },
      ],
      ai_summary: "Patient confirmed Tuesday 2-5 PM delivery window for Humira shipment. Copay of $35 confirmed. Patient was satisfied and call concluded smoothly.",
      action_items: ["Schedule delivery for Tuesday 2-5 PM", "Confirm insurance copay of $35 in billing system", "Send SMS confirmation to patient"],
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
      transcript_messages: [
        { speaker: 'ai', text: "Good afternoon, this is CureWell Pharmacy. I'm calling about your recent prescription change from Metoprolol 25mg to 50mg.", timestamp: '0:00' },
        { speaker: 'patient', text: "Yes, my cardiologist said to switch. When can I pick up the new prescription?", timestamp: '0:15' },
        { speaker: 'ai', text: "Your new prescription is ready now. Before you start, I want to make sure you have all the information you need about the dosage change.", timestamp: '0:24' },
        { speaker: 'patient', text: "Are there any side effects I should watch for with the higher dose?", timestamp: '0:38' },
        { speaker: 'ai', text: "That's an excellent question. Common side effects at the higher dose may include dizziness or fatigue. I'd recommend having our pharmacist discuss this with you in detail.", timestamp: '0:45' },
        { speaker: 'patient', text: "Yes, I'd appreciate that. I've been a bit worried about it.", timestamp: '1:12' },
        { speaker: 'ai', text: "Completely understandable. I'm flagging your file for a pharmacist follow-up call within 24 hours. They can walk you through everything.", timestamp: '1:20' },
        { speaker: 'patient', text: "That would be great, thank you.", timestamp: '1:42' },
        { speaker: 'ai', text: "We'll also schedule a check-in call in 7 days to see how you're adjusting. Is this number the best way to reach you?", timestamp: '1:48' },
        { speaker: 'patient', text: "Yes, this number is fine.", timestamp: '2:05' },
        { speaker: 'ai', text: "Perfect. Take care, and don't hesitate to call us if you have any concerns before then.", timestamp: '2:10' },
      ],
      ai_summary: "Patient acknowledged dosage change for Metoprolol (25mg to 50mg). Expressed concern about potential side effects at higher dose. Patient appeared anxious. Escalated to pharmacist for clinical consult. 7-day follow-up call scheduled.",
      action_items: ["Pharmacist follow-up: clinical consult on Metoprolol 50mg side effects", "Flag for 7-day follow-up call", "Note patient anxiety about dosage change"],
      sentiment: 'needs_attention',
      notes: "Patient expressed noticeable concern about side effects. Recommend pharmacist provide thorough counseling.",
    },
  },
  {
    id: 'call_003',
    patient_phone: '(555) 345-6789',
    call_type: 'general_inquiry',
    status: 'in_progress',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    duration_seconds: undefined,
    detail: {
      transcript_excerpt: "Agent: Good afternoon, CureWell Pharmacy. How can I assist you today?\nPatient: Hi, I need to know if you carry a specific medication. My doctor just prescribed Ozempic.",
      transcript_messages: [
        { speaker: 'ai', text: "Good afternoon, CureWell Pharmacy. How can I assist you today?", timestamp: '0:00' },
        { speaker: 'patient', text: "Hi, I need to know if you carry a specific medication. My doctor just prescribed Ozempic.", timestamp: '0:08' },
        { speaker: 'ai', text: "I'd be happy to help you with that. Let me check our inventory for Ozempic. Can you confirm the dosage your doctor prescribed?", timestamp: '0:18' },
        { speaker: 'patient', text: "It's 0.25mg to start. She said I'd increase the dose later.", timestamp: '0:30' },
        { speaker: 'ai', text: "We do carry Ozempic. For the 0.25mg starter dose, I'll need to verify your insurance coverage. Can you hold for just a moment?", timestamp: '0:38' },
      ],
      ai_summary: "Call in progress. Patient inquiring about Ozempic 0.25mg availability. Insurance verification pending.",
      action_items: ["Verify Ozempic availability in current inventory", "Check patient insurance coverage for GLP-1 medications"],
      sentiment: 'neutral',
    },
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
      transcript_messages: [
        { speaker: 'ai', text: "Good afternoon, this is CureWell Pharmacy. We're following up on your recent medication shipment delivered last Thursday.", timestamp: '0:00' },
        { speaker: 'patient', text: "Everything arrived on time and in good condition. Very happy with the service.", timestamp: '0:14' },
        { speaker: 'ai', text: "That's wonderful to hear. Was the cold chain packaging intact when you received it?", timestamp: '0:22' },
        { speaker: 'patient', text: "Yes, the temperature indicator was still in the safe range. Very professional packaging.", timestamp: '0:30' },
        { speaker: 'ai', text: "Excellent. We take cold chain integrity very seriously. Is there anything we could improve for future deliveries?", timestamp: '0:40' },
        { speaker: 'patient', text: "Honestly, everything was perfect. The driver was very courteous too.", timestamp: '0:52' },
        { speaker: 'ai', text: "Thank you for the kind feedback. We'll make sure to pass that along. Have a great day!", timestamp: '1:00' },
      ],
      ai_summary: "Patient confirmed satisfactory delivery experience. Cold chain packaging intact with temperature indicator in safe range. Patient praised driver courtesy and overall professionalism. No improvement areas identified.",
      action_items: ["Log positive delivery feedback", "Commend delivery driver in internal system"],
      sentiment: 'positive',
    },
  },
  {
    id: 'call_005',
    patient_phone: '(555) 567-8901',
    call_type: 'delivery_scheduling',
    status: 'failed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    duration_seconds: 22,
    detail: {
      transcript_excerpt: "Agent: Good afternoon, I'm calling from CureWell Pharmacy regarding your upcoming delivery...\n[Call disconnected - voicemail not available]",
      transcript_messages: [
        { speaker: 'ai', text: "Good afternoon, I'm calling from CureWell Pharmacy regarding your upcoming medication delivery. Am I speaking with the patient?", timestamp: '0:00' },
      ],
      ai_summary: "Call failed after 22 seconds. Patient did not answer. Voicemail was not available. No message left. Delivery for this patient remains unscheduled.",
      action_items: ["Retry call within 4 hours", "If second attempt fails, send SMS notification", "Flag for manual outreach if no contact within 24 hours"],
      sentiment: 'needs_attention',
      notes: "First contact attempt. No prior failed attempts on file.",
    },
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
      transcript_messages: [
        { speaker: 'ai', text: "Hello, this is a courtesy call from CureWell Pharmacy. Am I speaking with the patient on file?", timestamp: '0:00' },
        { speaker: 'patient', text: "Yes, that's me.", timestamp: '0:10' },
        { speaker: 'ai', text: "I'm calling to let you know your prescription for Lisinopril 10mg is due for refill in 5 days. Would you like us to go ahead and prepare it?", timestamp: '0:14' },
        { speaker: 'patient', text: "Oh, thank you for the reminder. Yes, please go ahead and refill it.", timestamp: '0:28' },
        { speaker: 'ai', text: "I've submitted the refill request. It will be ready for pickup tomorrow after 2 PM. Would you like a text reminder when it's ready?", timestamp: '0:36' },
        { speaker: 'patient', text: "Yes, a text would be great.", timestamp: '0:50' },
        { speaker: 'ai', text: "You're all set. We'll text you when your prescription is ready. Have a great evening!", timestamp: '0:55' },
      ],
      ai_summary: "Patient approved automatic refill for Lisinopril 10mg. Prescription will be ready for pickup tomorrow after 2 PM. Patient opted into SMS notification for pickup readiness.",
      action_items: ["Process refill for Lisinopril 10mg", "Mark ready for pickup by 2 PM tomorrow", "Send SMS when prescription is filled"],
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
      transcript_messages: [
        { speaker: 'ai', text: "Good morning, this is CureWell Pharmacy. We're calling to check in on your first week with Atorvastatin. How have you been feeling?", timestamp: '0:00' },
        { speaker: 'patient', text: "Hi. To be honest, I've been having some muscle aches, especially in my legs.", timestamp: '0:14' },
        { speaker: 'ai', text: "I appreciate you sharing that. Can you describe the muscle aches a bit more? When did they start, and how would you rate the discomfort on a scale of 1 to 10?", timestamp: '0:24' },
        { speaker: 'patient', text: "They started about 3 days ago. I'd say maybe a 5 or 6. It's worse in the morning.", timestamp: '0:40' },
        { speaker: 'ai', text: "Thank you. Muscle discomfort can sometimes occur with statins. Given the timing and severity, I'd like to connect you with our pharmacist for a more thorough clinical assessment.", timestamp: '0:55' },
        { speaker: 'patient', text: "Is it something serious? Should I stop taking it?", timestamp: '1:18' },
        { speaker: 'ai', text: "Please don't stop taking your medication without talking to your doctor or pharmacist first. Our pharmacist will be able to advise you properly. I'm flagging this as a priority consult.", timestamp: '1:25' },
        { speaker: 'patient', text: "Okay, that makes me feel better. When will the pharmacist call?", timestamp: '1:52' },
        { speaker: 'ai', text: "You should hear from our pharmacist within 2 hours. They may also recommend your prescriber order a CK level blood test as a precaution.", timestamp: '2:00' },
        { speaker: 'patient', text: "Alright, I'll keep my phone nearby. Thank you for checking in.", timestamp: '2:30' },
        { speaker: 'ai', text: "Of course. We'll also schedule a follow-up call in 3 days. Take care, and don't hesitate to call us if the discomfort worsens.", timestamp: '2:38' },
      ],
      ai_summary: "Patient reported muscle aches in legs (severity 5-6/10) starting 3 days after beginning Atorvastatin. Symptoms worse in the morning. Potential myalgia side effect. Patient was concerned and asked about stopping medication. Advised not to discontinue without clinical guidance. Escalated to pharmacist for urgent clinical assessment and possible CK level recommendation.",
      action_items: ["Urgent: Pharmacist clinical review for statin myalgia within 2 hours", "Recommend CK level blood test to prescriber", "Schedule follow-up call in 3 days", "Monitor for rhabdomyolysis warning signs"],
      sentiment: 'needs_attention',
      notes: "Patient reported 5-6/10 pain severity, worse in mornings. Started 3 days into Atorvastatin therapy. High priority for pharmacist review.",
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
      transcript_messages: [
        { speaker: 'ai', text: "Good morning, this is CureWell Pharmacy. Your Dupixent shipment is ready for delivery. What day works best this week?", timestamp: '0:00' },
        { speaker: 'patient', text: "Thursday morning would be ideal, before noon if possible.", timestamp: '0:12' },
        { speaker: 'ai', text: "I have Thursday 9 AM to 12 PM available. Does that window work for you?", timestamp: '0:20' },
        { speaker: 'patient', text: "That's perfect. Will it require a signature?", timestamp: '0:30' },
        { speaker: 'ai', text: "Yes, since Dupixent requires cold chain handling, we do need a signature upon delivery. Will someone be available at the delivery address?", timestamp: '0:36' },
        { speaker: 'patient', text: "Yes, I'll be home all morning.", timestamp: '0:52' },
        { speaker: 'ai', text: "Wonderful. You're confirmed for Thursday 9 AM to 12 PM. You'll receive a text with tracking details the day before. Anything else?", timestamp: '0:58' },
        { speaker: 'patient', text: "No, that's all. Thank you!", timestamp: '1:15' },
        { speaker: 'ai', text: "You're welcome. Have a great day!", timestamp: '1:18' },
      ],
      ai_summary: "Scheduled Dupixent delivery for Thursday 9 AM - 12 PM. Patient confirmed availability and will be home for required signature. Cold chain delivery protocols apply.",
      action_items: ["Schedule delivery for Thursday 9 AM - 12 PM", "Ensure cold chain packaging for Dupixent", "Send tracking SMS day before delivery"],
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
                  <div key={call.id} className={isExpanded ? 'ring-1 ring-teal-200 rounded-sm' : ''}>
                    <button
                      onClick={() => hasDetail && setExpandedId(isExpanded ? null : call.id)}
                      className={`w-full flex items-center justify-between px-5 py-4 transition-all duration-200 text-left ${
                        hasDetail ? 'hover:bg-teal-50/40 cursor-pointer' : 'cursor-default'
                      } ${isExpanded ? 'bg-teal-50/30' : ''}`}
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
                      <div className="border-t border-teal-100 bg-gradient-to-b from-slate-50/80 to-white">
                        {/* Detail header bar */}
                        <div className="px-5 pt-4 pb-3 flex flex-wrap items-center gap-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            {call.detail.sentiment === 'needs_attention' ? (
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                            ) : call.detail.sentiment === 'positive' ? (
                              <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                            ) : (
                              <Info className="h-3.5 w-3.5 text-gray-500" />
                            )}
                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getSentimentColor(call.detail.sentiment)}`}>
                              {getSentimentLabel(call.detail.sentiment)}
                            </span>
                          </div>
                          <div className="hidden sm:flex items-center gap-3 ml-auto text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {call.patient_phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(call.duration_seconds)}
                            </span>
                            <span>ID: {call.id}</span>
                          </div>
                        </div>

                        {/* Metadata grid */}
                        <div className="px-5 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-gray-100">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</span>
                            <div className="flex items-center gap-1.5">
                              {getStatusIcon(call.status)}
                              <span className="text-xs font-medium text-gray-700 capitalize">{call.status.replace('_', ' ')}</span>
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Duration</span>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-xs font-medium text-gray-700">{formatDuration(call.duration_seconds)}</span>
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Call Type</span>
                            <div className="flex items-center gap-1.5">
                              {call.status === 'failed' ? (
                                <PhoneOff className="h-3.5 w-3.5 text-gray-400" />
                              ) : (
                                <PhoneIncoming className="h-3.5 w-3.5 text-gray-400" />
                              )}
                              <span className="text-xs font-medium text-gray-700">{formatCallType(call.call_type)}</span>
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Timestamp</span>
                            <div className="text-xs font-medium text-gray-700">
                              {new Date(call.created_at).toLocaleString('en-US', {
                                month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="px-5 py-4 space-y-4">
                          {/* AI Summary */}
                          <div className="rounded-lg border border-teal-200 bg-gradient-to-r from-teal-50 to-teal-50/30 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex h-5 w-5 items-center justify-center rounded bg-teal-600">
                                <FileText className="h-3 w-3 text-white" />
                              </div>
                              <span className="text-xs font-semibold text-teal-800 uppercase tracking-wide">AI Summary</span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{call.detail.ai_summary}</p>
                            {call.detail.notes && (
                              <div className="mt-3 pt-3 border-t border-teal-200/60">
                                <span className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider">Note</span>
                                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{call.detail.notes}</p>
                              </div>
                            )}
                          </div>

                          {/* Transcript - chat bubble style */}
                          <div className="rounded-lg border border-gray-200 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                              <MessageSquare className="h-3.5 w-3.5 text-teal-600" />
                              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Call Transcript</span>
                              {call.status === 'in_progress' && (
                                <span className="ml-auto flex items-center gap-1.5 text-[10px] text-teal-600 font-medium">
                                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                                  Live
                                </span>
                              )}
                              <span className="ml-auto text-[10px] text-gray-400">
                                {call.detail.transcript_messages.length} messages
                              </span>
                            </div>
                            <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
                              {call.detail.transcript_messages.map((msg, i) => (
                                <div key={i} className={`flex gap-2.5 ${msg.speaker === 'patient' ? 'flex-row-reverse' : ''}`}>
                                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold shadow-sm ${
                                    msg.speaker === 'ai'
                                      ? 'bg-gradient-to-br from-teal-500 to-teal-700 text-white'
                                      : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 ring-1 ring-gray-200'
                                  }`}>
                                    {msg.speaker === 'ai' ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                                  </div>
                                  <div className={`max-w-[80%] space-y-0.5 ${msg.speaker === 'patient' ? 'items-end' : ''}`}>
                                    <div className={`rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed shadow-sm ${
                                      msg.speaker === 'ai'
                                        ? 'rounded-tl-sm bg-teal-50 text-teal-900 ring-1 ring-teal-100'
                                        : 'rounded-tr-sm bg-white text-gray-800 ring-1 ring-gray-150'
                                    }`}>
                                      {msg.text}
                                    </div>
                                    <span className={`text-[10px] text-gray-400 px-1 ${msg.speaker === 'patient' ? 'text-right block' : ''}`}>
                                      {msg.timestamp}
                                    </span>
                                  </div>
                                </div>
                              ))}
                              {call.status === 'in_progress' && (
                                <div className="flex gap-2.5">
                                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 shadow-sm">
                                    <Bot className="h-3.5 w-3.5 text-white" />
                                  </div>
                                  <div className="rounded-2xl rounded-tl-sm bg-teal-50 ring-1 ring-teal-100 px-4 py-2.5 shadow-sm">
                                    <div className="flex items-center gap-1">
                                      <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                      <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                      <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Items */}
                          {call.detail.action_items.length > 0 && (
                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex h-5 w-5 items-center justify-center rounded bg-gray-700">
                                  <ClipboardList className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Action Items</span>
                                <span className="ml-auto text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                                  {call.detail.action_items.length} item{call.detail.action_items.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <ul className="space-y-2">
                                {call.detail.action_items.map((item, i) => {
                                  const isUrgent = item.toLowerCase().includes('urgent')
                                  return (
                                    <li key={i} className={`flex items-start gap-2.5 text-sm rounded-md px-3 py-2 ${
                                      isUrgent
                                        ? 'bg-amber-50 border border-amber-200'
                                        : 'bg-gray-50 border border-gray-100'
                                    }`}>
                                      <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                        isUrgent ? 'bg-amber-500' : 'bg-teal-500'
                                      }`} />
                                      <span className={`${isUrgent ? 'text-amber-800 font-medium' : 'text-gray-700'}`}>
                                        {item}
                                      </span>
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>
                          )}
                        </div>
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
