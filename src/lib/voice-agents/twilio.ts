import { CallInitiationRequest, VoiceCall } from '@/types'

export interface TwilioConfig {
  account_sid: string
  auth_token: string
  phone_number: string
  webhook_url: string
}

export interface TwilioCallRequest {
  to: string
  from: string
  url: string
  method?: string
  statusCallback?: string
  statusCallbackEvent?: string[]
  statusCallbackMethod?: string
}

export interface TwilioCallResponse {
  sid: string
  status: string
}

export class TwilioVoiceAgent {
  private config: TwilioConfig
  private baseUrl = 'https://api.twilio.com'

  constructor(config: TwilioConfig) {
    this.config = config
  }

  async initiateCall(
    patientPhone: string,
    callData: CallInitiationRequest,
    callRecord: VoiceCall
  ): Promise<TwilioCallResponse> {
    const request: TwilioCallRequest = {
      to: patientPhone,
      from: this.config.phone_number,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/twilio/connect`,
      method: 'POST',
      statusCallback: this.config.webhook_url,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
    }

    // Add call metadata as URL parameters
    const connectUrl = new URL(request.url)
    connectUrl.searchParams.set('call_id', callRecord.id)
    connectUrl.searchParams.set('organization_id', callRecord.organization_id)
    connectUrl.searchParams.set('patient_id', callRecord.patient_id)
    connectUrl.searchParams.set('call_type', callData.call_type)
    if (callData.custom_prompt) {
      connectUrl.searchParams.set('custom_prompt', callData.custom_prompt)
    }
    request.url = connectUrl.toString()

    try {
      const response = await fetch(
        `${this.baseUrl}/2010-04-01/Accounts/${this.config.account_sid}/Calls.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.config.account_sid}:${this.config.auth_token}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(request as any).toString(),
        }
      )

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Twilio API error: ${error}`)
      }

      const result = await response.json()
      return {
        sid: result.sid,
        status: result.status
      }
    } catch (error) {
      console.error('Failed to initiate Twilio call:', error)
      throw error
    }
  }

  async getCallStatus(callSid: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/2010-04-01/Accounts/${this.config.account_sid}/Calls/${callSid}.json`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.config.account_sid}:${this.config.auth_token}`).toString('base64')}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to get call status: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to get call status:', error)
      throw error
    }
  }

  async endCall(callSid: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/2010-04-01/Accounts/${this.config.account_sid}/Calls/${callSid}.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.config.account_sid}:${this.config.auth_token}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'Status=completed',
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to end call: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to end call:', error)
      throw error
    }
  }
}
