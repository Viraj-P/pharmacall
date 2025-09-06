import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  replaysOnErrorSampleRate: 1.0,
  
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,
  
  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Filter out sensitive data
  beforeSend(event) {
    // Remove PHI and sensitive data
    if (event.exception) {
      event.exception.values?.forEach(exception => {
        if (exception.stacktrace) {
          exception.stacktrace.frames?.forEach(frame => {
            // Remove any frames that might contain sensitive data
            if (frame.filename?.includes('patient') || frame.filename?.includes('encrypted')) {
              frame.filename = '[FILTERED]'
            }
          })
        }
      })
    }
    
    // Remove sensitive data from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
        if (breadcrumb.data) {
          // Remove any data that might contain PHI
          const filteredData = { ...breadcrumb.data }
          Object.keys(filteredData).forEach(key => {
            if (key.toLowerCase().includes('phone') || 
                key.toLowerCase().includes('name') || 
                key.toLowerCase().includes('patient')) {
              filteredData[key] = '[FILTERED]'
            }
          })
          breadcrumb.data = filteredData
        }
        return breadcrumb
      })
    }
    
    return event
  },
  
  // Add user context without PHI
  beforeSendTransaction(event) {
    // Remove any transaction data that might contain sensitive information
    if (event.transaction) {
      // Filter out patient IDs and other sensitive data from transaction names
      event.transaction = event.transaction.replace(/patient_[a-f0-9-]+/gi, 'patient_[FILTERED]')
    }
    
    return event
  }
})