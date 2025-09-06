import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Filter out sensitive data on server side
  beforeSend(event) {
    // Remove PHI and sensitive data from server-side errors
    if (event.exception) {
      event.exception.values?.forEach(exception => {
        if (exception.stacktrace) {
          exception.stacktrace.frames?.forEach(frame => {
            // Remove any frames that might contain sensitive data
            if (frame.filename?.includes('patient') || 
                frame.filename?.includes('encrypted') ||
                frame.filename?.includes('supabase')) {
              frame.filename = '[FILTERED]'
            }
          })
        }
      })
    }
    
    // Remove sensitive data from extra context
    if (event.extra) {
      const filteredExtra = { ...event.extra }
      Object.keys(filteredExtra).forEach(key => {
        if (key.toLowerCase().includes('phone') || 
            key.toLowerCase().includes('name') || 
            key.toLowerCase().includes('patient') ||
            key.toLowerCase().includes('encrypted')) {
          filteredExtra[key] = '[FILTERED]'
        }
      })
      event.extra = filteredExtra
    }
    
    return event
  },
  
  // Add user context without PHI
  beforeSendTransaction(event) {
    // Remove any transaction data that might contain sensitive information
    if (event.transaction) {
      // Filter out patient IDs and other sensitive data from transaction names
      event.transaction = event.transaction.replace(/patient_[a-f0-9-]+/gi, 'patient_[FILTERED]')
      event.transaction = event.transaction.replace(/call_[a-f0-9-]+/gi, 'call_[FILTERED]')
    }
    
    return event
  }
})