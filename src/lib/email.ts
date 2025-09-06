import { Resend } from 'resend'
import { VoiceCall, User } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export class EmailService {
  private from = process.env.EMAIL_FROM || 'noreply@pharmacyvoice.com'

  async sendCallCompletedNotification(
    user: User,
    call: VoiceCall,
    patientName?: string
  ): Promise<void> {
    const template = this.getCallCompletedTemplate(call, patientName)
    
    try {
      await resend.emails.send({
        from: this.from,
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      })
    } catch (error) {
      console.error('Failed to send call completed email:', error)
      throw error
    }
  }

  async sendCallScheduledNotification(
    user: User,
    call: VoiceCall,
    patientName?: string
  ): Promise<void> {
    const template = this.getCallScheduledTemplate(call, patientName)
    
    try {
      await resend.emails.send({
        from: this.from,
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      })
    } catch (error) {
      console.error('Failed to send call scheduled email:', error)
      throw error
    }
  }

  async sendCallFailedNotification(
    user: User,
    call: VoiceCall,
    error: string,
    patientName?: string
  ): Promise<void> {
    const template = this.getCallFailedTemplate(call, error, patientName)
    
    try {
      await resend.emails.send({
        from: this.from,
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      })
    } catch (error) {
      console.error('Failed to send call failed email:', error)
      throw error
    }
  }

  async sendDailySummary(
    user: User,
    stats: {
      totalCalls: number
      completedCalls: number
      pendingCalls: number
      successRate: number
    }
  ): Promise<void> {
    const template = this.getDailySummaryTemplate(stats)
    
    try {
      await resend.emails.send({
        from: this.from,
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      })
    } catch (error) {
      console.error('Failed to send daily summary email:', error)
      throw error
    }
  }

  private getCallCompletedTemplate(call: VoiceCall, patientName?: string): EmailTemplate {
    const displayName = patientName || `Patient ${call.patient_id.slice(0, 8)}`
    const callType = call.call_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    const duration = call.duration_seconds ? `${Math.round(call.duration_seconds / 60)}m ${call.duration_seconds % 60}s` : 'N/A'

    return {
      subject: `Call Completed: ${callType} with ${displayName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Call Completed Successfully</h2>
          <p>Your voice call has been completed successfully.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Call Details</h3>
            <p><strong>Patient:</strong> ${displayName}</p>
            <p><strong>Call Type:</strong> ${callType}</p>
            <p><strong>Duration:</strong> ${duration}</p>
            <p><strong>Completed:</strong> ${new Date(call.completed_at!).toLocaleString()}</p>
          </div>

          ${call.transcript ? `
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Call Transcript</h3>
              <p style="white-space: pre-wrap;">${call.transcript}</p>
            </div>
          ` : ''}

          ${call.structured_data && Object.keys(call.structured_data).length > 0 ? `
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Structured Data</h3>
              <pre style="white-space: pre-wrap;">${JSON.stringify(call.structured_data, null, 2)}</pre>
            </div>
          ` : ''}

          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/calls/${call.id}" 
               style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Full Details
            </a>
          </p>
        </div>
      `,
      text: `
Call Completed Successfully

Your voice call has been completed successfully.

Call Details:
- Patient: ${displayName}
- Call Type: ${callType}
- Duration: ${duration}
- Completed: ${new Date(call.completed_at!).toLocaleString()}

${call.transcript ? `Call Transcript:\n${call.transcript}\n` : ''}

${call.structured_data && Object.keys(call.structured_data).length > 0 ? 
  `Structured Data:\n${JSON.stringify(call.structured_data, null, 2)}\n` : ''}

View full details: ${process.env.NEXT_PUBLIC_APP_URL}/calls/${call.id}
      `
    }
  }

  private getCallScheduledTemplate(call: VoiceCall, patientName?: string): EmailTemplate {
    const displayName = patientName || `Patient ${call.patient_id.slice(0, 8)}`
    const callType = call.call_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    const scheduledTime = new Date(call.scheduled_at!).toLocaleString()

    return {
      subject: `Call Scheduled: ${callType} with ${displayName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Call Scheduled</h2>
          <p>Your voice call has been scheduled successfully.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Call Details</h3>
            <p><strong>Patient:</strong> ${displayName}</p>
            <p><strong>Call Type:</strong> ${callType}</p>
            <p><strong>Scheduled:</strong> ${scheduledTime}</p>
          </div>

          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/calls/${call.id}" 
               style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Call Details
            </a>
          </p>
        </div>
      `,
      text: `
Call Scheduled

Your voice call has been scheduled successfully.

Call Details:
- Patient: ${displayName}
- Call Type: ${callType}
- Scheduled: ${scheduledTime}

View call details: ${process.env.NEXT_PUBLIC_APP_URL}/calls/${call.id}
      `
    }
  }

  private getCallFailedTemplate(call: VoiceCall, error: string, patientName?: string): EmailTemplate {
    const displayName = patientName || `Patient ${call.patient_id.slice(0, 8)}`
    const callType = call.call_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())

    return {
      subject: `Call Failed: ${callType} with ${displayName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Call Failed</h2>
          <p>Unfortunately, your voice call failed to complete.</p>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Call Details</h3>
            <p><strong>Patient:</strong> ${displayName}</p>
            <p><strong>Call Type:</strong> ${callType}</p>
            <p><strong>Error:</strong> ${error}</p>
            <p><strong>Failed:</strong> ${new Date(call.updated_at).toLocaleString()}</p>
          </div>

          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/calls/${call.id}" 
               style="background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Call Details
            </a>
          </p>
        </div>
      `,
      text: `
Call Failed

Unfortunately, your voice call failed to complete.

Call Details:
- Patient: ${displayName}
- Call Type: ${callType}
- Error: ${error}
- Failed: ${new Date(call.updated_at).toLocaleString()}

View call details: ${process.env.NEXT_PUBLIC_APP_URL}/calls/${call.id}
      `
    }
  }

  private getDailySummaryTemplate(stats: {
    totalCalls: number
    completedCalls: number
    pendingCalls: number
    successRate: number
  }): EmailTemplate {
    return {
      subject: `Daily Summary: ${stats.totalCalls} calls processed`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Daily Call Summary</h2>
          <p>Here's your daily summary of voice call activity.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Today's Statistics</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <p style="font-size: 24px; font-weight: bold; color: #3b82f6; margin: 0;">${stats.totalCalls}</p>
                <p style="margin: 0;">Total Calls</p>
              </div>
              <div>
                <p style="font-size: 24px; font-weight: bold; color: #059669; margin: 0;">${stats.completedCalls}</p>
                <p style="margin: 0;">Completed</p>
              </div>
              <div>
                <p style="font-size: 24px; font-weight: bold; color: #f59e0b; margin: 0;">${stats.pendingCalls}</p>
                <p style="margin: 0;">Pending</p>
              </div>
              <div>
                <p style="font-size: 24px; font-weight: bold; color: #8b5cf6; margin: 0;">${stats.successRate.toFixed(1)}%</p>
                <p style="margin: 0;">Success Rate</p>
              </div>
            </div>
          </div>

          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Dashboard
            </a>
          </p>
        </div>
      `,
      text: `
Daily Call Summary

Here's your daily summary of voice call activity.

Today's Statistics:
- Total Calls: ${stats.totalCalls}
- Completed: ${stats.completedCalls}
- Pending: ${stats.pendingCalls}
- Success Rate: ${stats.successRate.toFixed(1)}%

View dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard
      `
    }
  }
}

export const emailService = new EmailService()