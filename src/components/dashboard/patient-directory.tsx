'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Users, Search, Phone, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react'

interface Patient {
  id: string
  name: string
  phone: string
  medications: string[]
  lastCall: string
  lastCallType: string
  adherenceScore: number
  adherenceTrend: 'up' | 'down' | 'stable'
  nextScheduled: string | null
  status: 'active' | 'needs_outreach' | 'new'
}

const DEMO_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Margaret Johnson',
    phone: '(555) 234-5678',
    medications: ['Atorvastatin 40mg', 'Lisinopril 10mg'],
    lastCall: '2 days ago',
    lastCallType: 'Refill Reminder',
    adherenceScore: 94,
    adherenceTrend: 'up',
    nextScheduled: 'Thu 2:00 PM',
    status: 'active',
  },
  {
    id: 'p2',
    name: 'Robert Patel',
    phone: '(555) 345-6789',
    medications: ['Metoprolol 50mg', 'Amlodipine 5mg', 'Metformin 500mg'],
    lastCall: '1 day ago',
    lastCallType: 'Side Effect Check-in',
    adherenceScore: 78,
    adherenceTrend: 'down',
    nextScheduled: 'Today 10:30 AM',
    status: 'needs_outreach',
  },
  {
    id: 'p3',
    name: 'Susan Williams',
    phone: '(555) 456-7890',
    medications: ['Humira 40mg'],
    lastCall: '5 days ago',
    lastCallType: 'Delivery Scheduling',
    adherenceScore: 88,
    adherenceTrend: 'stable',
    nextScheduled: 'Mon 11:15 AM',
    status: 'active',
  },
  {
    id: 'p4',
    name: 'Kevin Chen',
    phone: '(555) 567-8901',
    medications: ['Eliquis 5mg', 'Warfarin 2.5mg'],
    lastCall: '3 days ago',
    lastCallType: 'Medication Change',
    adherenceScore: 91,
    adherenceTrend: 'up',
    nextScheduled: 'Today 1:00 PM',
    status: 'active',
  },
  {
    id: 'p5',
    name: 'Ana Garcia',
    phone: '(555) 678-9012',
    medications: ['Ozempic 0.5mg', 'Metformin 1000mg'],
    lastCall: '1 week ago',
    lastCallType: 'Refill Reminder',
    adherenceScore: 65,
    adherenceTrend: 'down',
    nextScheduled: null,
    status: 'needs_outreach',
  },
  {
    id: 'p6',
    name: 'David Brown',
    phone: '(555) 789-0123',
    medications: ['Lantus 100u/mL'],
    lastCall: 'Yesterday',
    lastCallType: 'Shipment Feedback',
    adherenceScore: 96,
    adherenceTrend: 'up',
    nextScheduled: null,
    status: 'active',
  },
  {
    id: 'p7',
    name: 'Lisa Thompson',
    phone: '(555) 890-1234',
    medications: ['Dupixent 300mg', 'Prednisone 10mg'],
    lastCall: 'Never',
    lastCallType: '-',
    adherenceScore: 0,
    adherenceTrend: 'stable',
    nextScheduled: 'Fri 9:00 AM',
    status: 'new',
  },
  {
    id: 'p8',
    name: 'James Wilson',
    phone: '(555) 901-2345',
    medications: ['Revlimid 25mg'],
    lastCall: '4 days ago',
    lastCallType: 'Refill Reminder',
    adherenceScore: 82,
    adherenceTrend: 'stable',
    nextScheduled: null,
    status: 'active',
  },
]

function AdherenceBadge({ score, trend }: { score: number; trend: 'up' | 'down' | 'stable' }) {
  const color = score >= 90 ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
    : score >= 75 ? 'text-amber-700 bg-amber-50 border-amber-200'
    : score > 0 ? 'text-red-700 bg-red-50 border-red-200'
    : 'text-gray-500 bg-gray-50 border-gray-200'

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <div className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${color}`}>
      {score > 0 ? `${score}%` : 'N/A'}
      {score > 0 && <TrendIcon className="h-3 w-3" />}
    </div>
  )
}

function StatusBadge({ status }: { status: Patient['status'] }) {
  const config = {
    active: { label: 'Active', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    needs_outreach: { label: 'Needs Outreach', class: 'bg-amber-50 text-amber-700 border-amber-200' },
    new: { label: 'New Patient', class: 'bg-blue-50 text-blue-700 border-blue-200' },
  }
  const c = config[status]
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${c.class}`}>
      {c.label}
    </span>
  )
}

export function PatientDirectory() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Patient['status']>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = DEMO_PATIENTS.filter((p) => {
    const matchesSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.medications.some(m => m.toLowerCase().includes(search.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: DEMO_PATIENTS.length,
    active: DEMO_PATIENTS.filter(p => p.status === 'active').length,
    needsOutreach: DEMO_PATIENTS.filter(p => p.status === 'needs_outreach').length,
    avgAdherence: Math.round(
      DEMO_PATIENTS.filter(p => p.adherenceScore > 0).reduce((s, p) => s + p.adherenceScore, 0) /
      DEMO_PATIENTS.filter(p => p.adherenceScore > 0).length
    ),
  }

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: stats.total, color: 'text-gray-900' },
          { label: 'Active', value: stats.active, color: 'text-emerald-600' },
          { label: 'Needs Outreach', value: stats.needsOutreach, color: 'text-amber-600' },
          { label: 'Avg. Adherence', value: `${stats.avgAdherence}%`, color: 'text-teal-600' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              Patient Directory
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search name, phone, or medication..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                {(['all', 'active', 'needs_outreach', 'new'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      statusFilter === f
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'needs_outreach' ? 'Outreach' : f === 'new' ? 'New' : 'Active'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[1fr_120px_140px_100px_100px_100px] gap-3 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
            <span>Patient</span>
            <span>Phone</span>
            <span>Last Call</span>
            <span>Adherence</span>
            <span>Status</span>
            <span>Next Call</span>
          </div>

          {/* Patient rows */}
          <div className="divide-y divide-gray-50">
            {filtered.map((patient) => {
              const expanded = expandedId === patient.id
              return (
                <div key={patient.id}>
                  <button
                    onClick={() => setExpandedId(expanded ? null : patient.id)}
                    className="w-full grid grid-cols-1 md:grid-cols-[1fr_120px_140px_100px_100px_100px] gap-3 items-center px-3 py-3 text-left hover:bg-gray-50 transition-colors rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600/10 text-sm font-semibold text-teal-700 shrink-0">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                      {expanded ? <ChevronUp className="h-4 w-4 text-gray-400 md:hidden" /> : <ChevronDown className="h-4 w-4 text-gray-400 md:hidden" />}
                    </div>
                    <span className="text-sm text-gray-600 hidden md:block">{patient.phone}</span>
                    <div className="hidden md:block">
                      <span className="text-sm text-gray-600">{patient.lastCall}</span>
                    </div>
                    <div className="hidden md:block">
                      <AdherenceBadge score={patient.adherenceScore} trend={patient.adherenceTrend} />
                    </div>
                    <div className="hidden md:block">
                      <StatusBadge status={patient.status} />
                    </div>
                    <span className="text-sm text-gray-600 hidden md:block">
                      {patient.nextScheduled || '—'}
                    </span>
                  </button>

                  {expanded && (
                    <div className="px-3 pb-4 ml-12 space-y-3 animate-fade-in">
                      <div className="md:hidden flex flex-wrap gap-2 items-center">
                        <AdherenceBadge score={patient.adherenceScore} trend={patient.adherenceTrend} />
                        <StatusBadge status={patient.status} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-md bg-gray-50 p-3">
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Medications</div>
                          <ul className="space-y-1">
                            {patient.medications.map((m) => (
                              <li key={m} className="text-sm text-gray-700">{m}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-md bg-gray-50 p-3">
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Last Contact</div>
                          <div className="text-sm text-gray-700">{patient.lastCall}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{patient.lastCallType}</div>
                        </div>
                        <div className="rounded-md bg-gray-50 p-3">
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Next Scheduled</div>
                          <div className="text-sm text-gray-700">{patient.nextScheduled || 'None scheduled'}</div>
                          <div className="flex items-center gap-1 mt-1.5">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{patient.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-500">
              No patients match your search.
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <span className="text-xs text-gray-400">
              {filtered.length} of {DEMO_PATIENTS.length} patients
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
