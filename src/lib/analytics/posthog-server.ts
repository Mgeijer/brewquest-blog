import { PostHog } from 'posthog-node'

// Create PostHog server instance only if API key is available
const createPostHogServer = () => {
  const apiKey = process.env.POSTHOG_API_KEY
  
  if (!apiKey || apiKey === 'your_posthog_personal_api_key') {
    console.warn('PostHog server-side API key not configured. Server-side analytics will be disabled.')
    return null
  }

  try {
    return new PostHog(apiKey, {
      host: process.env.POSTHOG_HOST || 'https://app.posthog.com',
      flushAt: 20, // Flush events after 20 events
      flushInterval: 10000, // Flush events every 10 seconds
      requestTimeout: 30000 // 30 second timeout
    })
  } catch (error) {
    console.error('Failed to initialize PostHog server:', error)
    return null
  }
}

// Server-side PostHog client (may be null if not configured)
export const posthogServer = createPostHogServer()

// Server-side event tracking interfaces
export interface ServerBeerEvent {
  user_id?: string
  session_id?: string
  beer_name: string
  brewery_name: string
  state: string
  week_number: number
  day_of_week: number
  abv: number
  style: string
  action: 'viewed' | 'shared' | 'favorited' | 'rated'
  user_agent?: string
  ip_address?: string
  referrer?: string
}

export interface ServerNewsletterEvent {
  user_id?: string
  session_id?: string
  email_hash?: string // Hashed email for privacy
  source: 'homepage' | 'blog' | 'state_page' | 'beer_page'
  success: boolean
  error_message?: string
  user_agent?: string
  ip_address?: string
}

export interface ServerAPIEvent {
  endpoint: string
  method: string
  response_time: number
  status_code: number
  user_id?: string
  session_id?: string
  error_message?: string
  request_size?: number
  response_size?: number
}

export interface ServerContentEvent {
  content_type: 'beer_review' | 'state_feature' | 'blog_post' | 'social_post'
  content_id: string
  action: 'created' | 'updated' | 'published' | 'approved' | 'rejected'
  admin_user?: string
  content_metadata?: Record<string, any>
}

// Server-side tracking functions
export const trackServerBeerInteraction = async (
  eventData: ServerBeerEvent,
  distinctId?: string
) => {
  if (!posthogServer) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Server-side analytics disabled - would have tracked:', eventData.action)
    }
    return false
  }

  try {
    posthogServer.capture({
      distinctId: distinctId || eventData.user_id || 'anonymous',
      event: `server_beer_${eventData.action}`,
      properties: {
        ...eventData,
        server_timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      }
    })
    return true
  } catch (error) {
    console.error('Failed to track server beer interaction:', error)
    return false
  }
}

export const trackServerNewsletterEvent = async (
  eventData: ServerNewsletterEvent,
  distinctId?: string
) => {
  if (!posthogServer) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Server-side analytics disabled - would have tracked newsletter event')
    }
    return false
  }

  try {
    posthogServer.capture({
      distinctId: distinctId || eventData.user_id || 'anonymous',
      event: 'server_newsletter_signup',
      properties: {
        ...eventData,
        server_timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      }
    })

    // Set user properties for successful signups
    if (eventData.success && eventData.email_hash) {
      posthogServer.identify({
        distinctId: distinctId || eventData.user_id || eventData.email_hash,
        properties: {
          newsletter_subscriber: true,
          subscription_source: eventData.source,
          subscription_date: new Date().toISOString(),
          last_seen: new Date().toISOString()
        }
      })
    }
    return true
  } catch (error) {
    console.error('Failed to track server newsletter event:', error)
    return false
  }
}

export const trackServerAPICall = async (
  eventData: ServerAPIEvent,
  distinctId?: string
) => {
  if (!posthogServer) {
    return false // Silently skip API call tracking if not configured
  }

  try {
    posthogServer.capture({
      distinctId: distinctId || eventData.user_id || 'system',
      event: 'server_api_call',
      properties: {
        ...eventData,
        server_timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      }
    })
    return true
  } catch (error) {
    console.error('Failed to track server API call:', error)
    return false
  }
}

export const trackServerContentEvent = async (
  eventData: ServerContentEvent,
  distinctId?: string
) => {
  if (!posthogServer) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Server-side analytics disabled - would have tracked content event:', eventData.action)
    }
    return false
  }

  try {
    posthogServer.capture({
      distinctId: distinctId || eventData.admin_user || 'system',
      event: `server_content_${eventData.action}`,
      properties: {
        ...eventData,
        server_timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      }
    })
    return true
  } catch (error) {
    console.error('Failed to track server content event:', error)
    return false
  }
}

// Server-side user identification
export const identifyServerUser = async (
  userId: string,
  properties: Record<string, any>
) => {
  if (!posthogServer) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Server-side analytics disabled - would have identified user:', userId)
    }
    return false
  }

  try {
    posthogServer.identify({
      distinctId: userId,
      properties: {
        ...properties,
        last_seen: new Date().toISOString(),
        server_identified: true
      }
    })
    return true
  } catch (error) {
    console.error('Failed to identify server user:', error)
    return false
  }
}

// Graceful shutdown
export const shutdownPostHog = async () => {
  if (!posthogServer) {
    return false
  }

  try {
    await posthogServer.shutdown()
    return true
  } catch (error) {
    console.error('Failed to shutdown PostHog:', error)
    return false
  }
}

// Middleware helper for API tracking
export const withPostHogTracking = (
  handler: Function,
  options: { 
    endpoint: string
    trackSuccess?: boolean
    trackErrors?: boolean
  } = { endpoint: 'unknown', trackSuccess: true, trackErrors: true }
) => {
  return async (req: any, res: any, ...args: any[]) => {
    const startTime = Date.now()
    
    try {
      const result = await handler(req, res, ...args)
      
      if (options.trackSuccess) {
        await trackServerAPICall({
          endpoint: options.endpoint,
          method: req.method || 'GET',
          response_time: Date.now() - startTime,
          status_code: res.status || 200,
          user_agent: req.headers?.['user-agent'],
          ip_address: req.ip || req.connection?.remoteAddress
        })
      }
      
      return result
    } catch (error: any) {
      if (options.trackErrors) {
        await trackServerAPICall({
          endpoint: options.endpoint,
          method: req.method || 'GET',
          response_time: Date.now() - startTime,
          status_code: 500,
          error_message: error.message,
          user_agent: req.headers?.['user-agent'],
          ip_address: req.ip || req.connection?.remoteAddress
        })
      }
      
      throw error
    }
  }
}

// Batch tracking for performance
export const batchTrackEvents = async (events: Array<{
  distinctId: string
  event: string
  properties: Record<string, any>
}>) => {
  if (!posthogServer) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Server-side analytics disabled - would have batch tracked', events.length, 'events')
    }
    return false
  }

  try {
    for (const event of events) {
      posthogServer.capture(event)
    }
    return true
  } catch (error) {
    console.error('Failed to batch track events:', error)
    return false
  }
}