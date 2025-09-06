import { CallInitiationRequest, VoiceCall } from '@/types'

export interface RetellConfig {
  api_key: string
  agent_id: string
  webhook_url: string
}

export interface RetellCallRequest {
  from_number: string
  to_number: string
  agent_id: string
  webhook_url: string
  metadata?: Record<string, any>
}

export interface RetellCallResponse {
  call_id: string
  status: string
}

export class RetellVoiceAgent {
  private config: RetellConfig
  private baseUrl = 'https://api.retellai.com'

  constructor(config: RetellConfig) {
    this.config = config
  }

  async initiateCall(
    patientPhone: string,
    pharmacistPhone: string,
    callData: CallInitiationRequest,
    callRecord: VoiceCall
  ): Promise<RetellCallResponse> {
    const request: RetellCallRequest = {
      from_number: pharmacistPhone,
      to_number: patientPhone,
      agent_id: this.config.agent_id,
      webhook_url: this.config.webhook_url,
      metadata: {
        call_id: callRecord.id,
        organization_id: callRecord.organization_id,
        patient_id: callRecord.patient_id,
        call_type: callData.call_type,
        custom_prompt: callData.custom_prompt,
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/create-phone-call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Retell API error: ${error}`)
      }

      const result = await response.json()
      return {
        call_id: result.call_id,
        status: result.status || 'initiated'
      }
    } catch (error) {
      console.error('Failed to initiate Retell call:', error)
      throw error
    }
  }

  async getCallStatus(callId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/get-call/${callId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.api_key}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to get call status: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to get call status:', error)
      throw error
    }
  }

  async endCall(callId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/end-call/${callId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.api_key}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to end call: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to end call:', error)
      throw error
    }
  }
}
