import * as Sentry from '@sentry/nextjs'
import { AuthUser } from '@/lib/auth'

export interface ComplianceLogEntry {
  event_type: string
  user_id: string
  organization_id: string
  resource_type: 'call' | 'patient' | 'user' | 'organization'
  resource_id: string
  action: string
  metadata?: Record<string, any>
  timestamp: string
}

export class MonitoringService {
  // Log compliance events without PHI
  static logComplianceEvent(entry: ComplianceLogEntry): void {
    // Remove any PHI from metadata
    const sanitizedMetadata = this.sanitizeMetadata(entry.metadata || {})
    
    const sanitizedEntry = {
      ...entry,
      metadata: sanitizedMetadata
    }

    // Log to Sentry as a breadcrumb for compliance tracking
    Sentry.addBreadcrumb({
      category: 'compliance',
      message: `${entry.action} on ${entry.resource_type}`,
      level: 'info',
      data: sanitizedEntry
    })

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Compliance Event:', sanitizedEntry)
    }
  }

  // Log user actions for audit trail
  static logUserAction(
    user: AuthUser,
    action: string,
    resourceType: string,
    resourceId: string,
    metadata?: Record<string, any>
  ): void {
    this.logComplianceEvent({
      event_type: 'user_action',
      user_id: user.id,
      organization_id: user.organization_id,
      resource_type: resourceType as any,
      resource_id: resourceId,
      action,
      metadata: this.sanitizeMetadata(metadata || {}),
      timestamp: new Date().toISOString()
    })
  }

  // Log call events
  static logCallEvent(
    user: AuthUser,
    callId: string,
    action: string,
    metadata?: Record<string, any>
  ): void {
    this.logComplianceEvent({
      event_type: 'call_event',
      user_id: user.id,
      organization_id: user.organization_id,
      resource_type: 'call',
      resource_id: callId,
      action,
      metadata: this.sanitizeMetadata(metadata || {}),
      timestamp: new Date().toISOString()
    })
  }

  // Log patient access events
  static logPatientAccess(
    user: AuthUser,
    patientId: string,
    action: string,
    metadata?: Record<string, any>
  ): void {
    this.logComplianceEvent({
      event_type: 'patient_access',
      user_id: user.id,
      organization_id: user.organization_id,
      resource_type: 'patient',
      resource_id: patientId,
      action,
      metadata: this.sanitizeMetadata(metadata || {}),
      timestamp: new Date().toISOString()
    })
  }

  // Log API errors with context
  static logApiError(
    error: Error,
    context: {
      endpoint: string
      method: string
      user_id?: string
      organization_id?: string
      metadata?: Record<string, any>
    }
  ): void {
    Sentry.withScope((scope) => {
      scope.setTag('error_type', 'api_error')
      scope.setTag('endpoint', context.endpoint)
      scope.setTag('method', context.method)
      
      if (context.user_id) {
        scope.setUser({ id: context.user_id })
      }
      
      if (context.organization_id) {
        scope.setContext('organization', { id: context.organization_id })
      }
      
      if (context.metadata) {
        scope.setContext('api_context', this.sanitizeMetadata(context.metadata))
      }
      
      Sentry.captureException(error)
    })
  }

  // Log voice agent events
  static logVoiceAgentEvent(
    user: AuthUser,
    callId: string,
    provider: string,
    event: string,
    metadata?: Record<string, any>
  ): void {
    this.logComplianceEvent({
      event_type: 'voice_agent_event',
      user_id: user.id,
      organization_id: user.organization_id,
      resource_type: 'call',
      resource_id: callId,
      action: `${provider}_${event}`,
      metadata: this.sanitizeMetadata({
        provider,
        event,
        ...metadata
      }),
      timestamp: new Date().toISOString()
    })
  }

  // Sanitize metadata to remove PHI
  private static sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
    const sanitized = { ...metadata }
    
    // List of keys that might contain PHI
    const phiKeys = [
      'phone', 'name', 'email', 'address', 'ssn', 'dob', 'patient_name',
      'patient_phone', 'encrypted_phone', 'encrypted_name', 'transcript',
      'recording_url', 'patient_id_hash'
    ]
    
    Object.keys(sanitized).forEach(key => {
      const lowerKey = key.toLowerCase()
      if (phiKeys.some(phiKey => lowerKey.includes(phiKey))) {
        sanitized[key] = '[FILTERED]'
      }
      
      // Also filter out any nested objects
      if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeMetadata(sanitized[key])
      }
    })
    
    return sanitized
  }

  // Set user context for Sentry
  static setUserContext(user: AuthUser): void {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      role: user.role,
      organization_id: user.organization_id
    })
  }

  // Clear user context
  static clearUserContext(): void {
    Sentry.setUser(null)
  }
}
