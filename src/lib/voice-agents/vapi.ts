import { VoiceAgent, CallInitiationRequest, VoiceCall } from '@/types'

export interface VapiConfig {
  api_key: string
  assistant_id: string
  webhook_url: string
}

export class VapiVoiceAgent implements VoiceAgent {
  private config: VapiConfig
  private baseUrl = 'https://api.vapi.ai'

  constructor(config: VapiConfig) {
    this.config = config
  }

  async initiateCall(
    patientPhone: string,
    pharmacistPhone: string,
    callData: CallInitiationRequest,
    callRecord: VoiceCall
  ): Promise<{ call_id: string; status: string }> {
    const response = await fetch(`${this.baseUrl}/call`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId: this.config.assistant_id,
        customer: {
          number: patientPhone,
        },
        phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID, // This should be in config
        webhookUrl: this.config.webhook_url,
        metadata: {
          call_id: callRecord.id,
          organization_id: callRecord.organization_id,
          call_type: callData.call_type,
          custom_prompt: callData.custom_prompt,
        },
        assistantOverrides: {
          variableValues: {
            patient_name: 'Patient', // In production, this would be decrypted
            call_type: callData.call_type,
            pharmacist_name: 'Pharmacist', // In production, this would come from user profile
          }
        }
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Vapi API error: ${error}`)
    }

    const result = await response.json()
    return {
      call_id: result.id,
      status: result.status || 'initiated'
    }
  }

  async getCallStatus(callId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/call/${callId}`, {
      headers: {
        'Authorization': `Bearer ${this.config.api_key}`,
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to get call status: ${response.statusText}`)
    }

    return response.json()
  }

  async endCall(callId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/call/${callId}/end`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.api_key}`,
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to end call: ${response.statusText}`)
    }
  }
}