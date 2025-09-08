import { VoiceAgent, CallInitiationRequest, VoiceCall } from '@/types'

export interface TwilioConfig {
  account_sid: string
  auth_token: string
  phone_number: string
  webhook_url: string
}

export class TwilioVoiceAgent implements VoiceAgent {
  private config: TwilioConfig
  private baseUrl: string

  constructor(config: TwilioConfig) {
    this.config = config
    this.baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${config.account_sid}`
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.config.account_sid}:${this.config.auth_token}`).toString('base64')
    return `Basic ${credentials}`
  }

  async initiateCall(
    patientPhone: string,
    pharmacistPhone: string,
    callData: CallInitiationRequest,
    callRecord: VoiceCall
  ): Promise<{ call_id: string; status: string }> {
    const twimlUrl = `${this.config.webhook_url}?call_id=${callRecord.id}&organization_id=${callRecord.organization_id}&call_type=${callData.call_type}`
    
    const response = await fetch(`${this.baseUrl}/Calls.json`, {
      method: 'POST',
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: patientPhone,
        From: this.config.phone_number,
        Url: twimlUrl,
        Method: 'POST',
        StatusCallback: this.config.webhook_url,
        StatusCallbackEvent: 'initiated,ringing,answered,completed',
        StatusCallbackMethod: 'POST',
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Twilio API error: ${error}`)
    }

    const result = await response.json()
    return {
      call_id: result.sid,
      status: result.status || 'initiated'
    }
  }

  async getCallStatus(callId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/Calls/${callId}.json`, {
      headers: {
        'Authorization': this.getAuthHeader(),
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to get call status: ${response.statusText}`)
    }

    return response.json()
  }

  async endCall(callId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/Calls/${callId}.json`, {
      method: 'POST',
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        Status: 'completed'
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to end call: ${response.statusText}`)
    }
  }
}
