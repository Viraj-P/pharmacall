export type UserRole = 'pharmacist' | 'admin' | 'super_admin'
export type CallStatus = 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled'
export type CallType = 'delivery_scheduling' | 'medication_change' | 'shipment_feedback' | 'general_inquiry'

export interface Organization {
  id: string
  name: string
  slug: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  role: UserRole
  organization_id: string
  profile: Record<string, any>
  last_login: string | null
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  organization_id: string
  encrypted_phone: string
  encrypted_name?: string
  encrypted_dob?: string
  patient_id_hash: string
  medications: any[]
  preferences: Record<string, any>
  created_at: string
  updated_at: string
}

export interface VoiceCall {
  id: string
  organization_id: string
  patient_id: string
  pharmacist_id: string | null
  external_call_id?: string
  call_type: CallType
  status: CallStatus
  scheduled_at?: string
  started_at?: string
  completed_at?: string
  duration_seconds?: number
  recording_url?: string
  transcript?: string
  structured_data: Record<string, any>
  ai_insights: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CallLog {
  id: string
  call_id: string
  organization_id: string
  event_type: string
  event_data: Record<string, any>
  created_at: string
}

export interface EmailNotification {
  id: string
  organization_id: string
  user_id: string
  call_id: string
  email_type: string
  status: string
  sent_at?: string
  error_message?: string
  created_at: string
}

// Voice provider types
export interface VoiceProviderConfig {
  provider: 'retell' | 'vapi' | 'twilio'
  api_key: string
  webhook_url: string
  settings: Record<string, any>
}

export interface CallInitiationRequest {
  patient_id: string
  call_type: CallType
  scheduled_at?: string
  custom_prompt?: string
}

export interface CallWebhookPayload {
  call_id: string
  status: CallStatus
  transcript?: string
  recording_url?: string
  structured_data?: Record<string, any>
  ai_insights?: Record<string, any>
  duration_seconds?: number
}

// UI Component types
export interface DashboardStats {
  total_calls: number
  completed_calls: number
  pending_calls: number
  success_rate: number
  avg_duration: number
}

export interface PatientWithCalls extends Patient {
  recent_calls: VoiceCall[]
  call_count: number
}