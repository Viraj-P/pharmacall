import { CallInitiationRequest, VoiceCall } from '@/types'

export interface VapiConfig {
  api_key: string
  assistant_id: string
  webhook_url: string
}

export interface VapiCallRequest {
  phoneNumberId: string
  customer: {
    number: string
  }
  assistantId: string
  customerId?: string
  metadata?: Record<string, any>
}

export interface VapiCallResponse {
  id: string
  status: string
}

export class VapiVoiceAgent {
  private config: VapiConfig
  private baseUrl = 'https://api.vapi.ai'

  constructor(config: VapiConfig) {
    this.config = config
  }

  async initiateCall(
    patientPhone: string,
    callData: CallInitiationRequest,
    callRecord: VoiceCall
  ): Promise<VapiCallResponse> {
    const request: VapiCallRequest = {
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID!, // Your Vapi phone number ID
      customer: {
        number: patientPhone,
      },
      assistantId: this.config.assistant_id,
      customerId: callRecord.patient_id,
      metadata: {
        call_id: callRecord.id,
        organization_id: callRecord.organization_id,
        patient_id: callRecord.patient_id,
        call_type: callData.call_type,
        custom_prompt: callData.custom_prompt,
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Vapi API error: ${error}`)
      }

      const result = await response.json()
      return {
        id: result.id,
        status: result.status || 'queued'
      }
    } catch (error) {
      console.error('Failed to initiate Vapi call:', error)
      throw error
    }
  }

  async getCallStatus(callId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/call/${callId}`, {
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
      const response = await fetch(`${this.baseUrl}/call/${callId}/end`, {
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
