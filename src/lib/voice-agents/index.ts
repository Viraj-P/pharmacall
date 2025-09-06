import { RetellVoiceAgent, RetellConfig } from './retell'
import { VapiVoiceAgent, VapiConfig } from './vapi'
import { TwilioVoiceAgent, TwilioConfig } from './twilio'
import { CallInitiationRequest, VoiceCall, VoiceProviderConfig } from '@/types'

export type VoiceProvider = 'retell' | 'vapi' | 'twilio'

export interface VoiceAgent {
  initiateCall(
    patientPhone: string,
    pharmacistPhone: string,
    callData: CallInitiationRequest,
    callRecord: VoiceCall
  ): Promise<{ call_id: string; status: string }>
  
  getCallStatus(callId: string): Promise<any>
  endCall(callId: string): Promise<void>
}

export class VoiceAgentFactory {
  static createAgent(config: VoiceProviderConfig): VoiceAgent {
    switch (config.provider) {
      case 'retell':
        return new RetellVoiceAgent({
          api_key: config.api_key,
          agent_id: config.settings.agent_id,
          webhook_url: config.webhook_url,
        })
      
      case 'vapi':
        return new VapiVoiceAgent({
          api_key: config.api_key,
          assistant_id: config.settings.assistant_id,
          webhook_url: config.webhook_url,
        })
      
      case 'twilio':
        return new TwilioVoiceAgent({
          account_sid: config.api_key,
          auth_token: config.settings.auth_token,
          phone_number: config.settings.phone_number,
          webhook_url: config.webhook_url,
        })
      
      default:
        throw new Error(`Unsupported voice provider: ${config.provider}`)
    }
  }
}

// Default configuration - in production, this would come from environment variables or database
export const getDefaultVoiceConfig = (): VoiceProviderConfig => {
  const provider = (process.env.VOICE_PROVIDER as VoiceProvider) || 'retell'
  
  switch (provider) {
    case 'retell':
      return {
        provider: 'retell',
        api_key: process.env.RETELL_API_KEY!,
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/webhook`,
        settings: {
          agent_id: process.env.RETELL_AGENT_ID!,
        }
      }
    
    case 'vapi':
      return {
        provider: 'vapi',
        api_key: process.env.VAPI_API_KEY!,
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/webhook`,
        settings: {
          assistant_id: process.env.VAPI_ASSISTANT_ID!,
        }
      }
    
    case 'twilio':
      return {
        provider: 'twilio',
        api_key: process.env.TWILIO_ACCOUNT_SID!,
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/webhook`,
        settings: {
          auth_token: process.env.TWILIO_AUTH_TOKEN!,
          phone_number: process.env.TWILIO_PHONE_NUMBER!,
        }
      }
    
    default:
      throw new Error(`Unsupported voice provider: ${provider}`)
  }
}
