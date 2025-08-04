import { PostHog } from 'posthog-node'

// Server-side PostHog client
export const posthogServer = new PostHog(
  process.env.POSTHOG_API_KEY!,
  {
    host: process.env.POSTHOG_HOST || 'https://app.posthog.com',
    flushAt: 20, // Flush events after 20 events
    flushInterval: 10000, // Flush events every 10 seconds
    requestTimeout: 30000 // 30 second timeout
  }
)

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
  } catch (error) {
    console.error('Failed to track server beer interaction:', error)
  }
}

export const trackServerNewsletterEvent = async (
  eventData: ServerNewsletterEvent,
  distinctId?: string
) => {
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
  } catch (error) {
    console.error('Failed to track server newsletter event:', error)
  }
}

export const trackServerAPICall = async (
  eventData: ServerAPIEvent,
  distinctId?: string
) => {
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
  } catch (error) {
    console.error('Failed to track server API call:', error)
  }
}

export const trackServerContentEvent = async (
  eventData: ServerContentEvent,
  distinctId?: string
) => {
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
  } catch (error) {
    console.error('Failed to track server content event:', error)
  }
}

// Server-side user identification
export const identifyServerUser = async (
  userId: string,
  properties: Record<string, any>
) => {
  try {
    posthogServer.identify({
      distinctId: userId,
      properties: {
        ...properties,
        last_seen: new Date().toISOString(),
        server_identified: true
      }
    })
  } catch (error) {
    console.error('Failed to identify server user:', error)
  }
}

// Graceful shutdown
export const shutdownPostHog = async () => {
  try {
    await posthogServer.shutdown()
  } catch (error) {
    console.error('Failed to shutdown PostHog:', error)
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
  try {
    for (const event of events) {
      posthogServer.capture(event)
    }
  } catch (error) {
    console.error('Failed to batch track events:', error)
  }
}