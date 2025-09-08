import { VoiceAgent, CallInitiationRequest, VoiceCall } from '@/types'

export interface RetellConfig {
  api_key: string
  agent_id: string
  webhook_url: string
}

export class RetellVoiceAgent implements VoiceAgent {
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
  ): Promise<{ call_id: string; status: string }> {
    const response = await fetch(`${this.baseUrl}/create-phone-call`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: this.config.agent_id,
        to_number: patientPhone,
        from_number: pharmacistPhone,
        webhook_url: this.config.webhook_url,
        metadata: {
          call_id: callRecord.id,
          organization_id: callRecord.organization_id,
          call_type: callData.call_type,
          custom_prompt: callData.custom_prompt,
        },
        dynamic_variables: [
          {
            name: 'patient_name',
            value: 'Patient', // In production, this would be decrypted
          },
          {
            name: 'call_type',
            value: callData.call_type,
          },
          {
            name: 'pharmacist_name',
            value: 'Pharmacist', // In production, this would come from user profile
          }
        ]
      })
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
  }

  async getCallStatus(callId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/get-call/${callId}`, {
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
    const response = await fetch(`${this.baseUrl}/end-call/${callId}`, {
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
