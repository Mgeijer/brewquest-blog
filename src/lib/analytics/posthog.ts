import posthog from 'posthog-js'

let isInitializing = false

export const initPostHog = () => {
  if (typeof window !== 'undefined' && !posthog.__loaded && !isInitializing) {
    isInitializing = true
    
    // Validate API key before initialization
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      console.warn('PostHog API key not found. Analytics will be disabled.')
      isInitializing = false
      return false
    }

    try {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        loaded: (posthog) => {
          isInitializing = false
          if (process.env.NODE_ENV === 'development') console.log('PostHog loaded successfully')
        },
        on_request_error: (error) => {
          console.warn('PostHog request error:', error)
          isInitializing = false
        },
      capture_pageview: false, // We'll manually capture pageviews
      capture_pageleave: true,
      autocapture: true,
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: false,
        maskInputOptions: {
          password: true,
          email: true
        }
      },
      bootstrap: {
        distinctID: undefined, // Will be set when user is identified
        isIdentifiedID: false
      },
      persistence: 'localStorage+cookie',
      cross_subdomain_cookie: false,
        secure_cookie: process.env.NODE_ENV === 'production',
        debug: process.env.NODE_ENV === 'development'
      })
      return true
    } catch (error) {
      console.error('Failed to initialize PostHog:', error)
      isInitializing = false
      return false
    }
  }
  return posthog.__loaded || false
}

export { posthog }

// Custom event types for better TypeScript support
export interface BeerInteractionEvent {
  beer_name: string
  brewery_name: string
  state: string
  week_number: number
  day_of_week: number
  abv: number
  style: string
  rating?: number
}

export interface StateInteractionEvent {
  state_name: string
  state_code: string
  week_number: number
  total_breweries: number
  interaction_type: 'view' | 'explore' | 'navigate'
}

export interface NewsletterEvent {
  email?: string
  source: 'homepage' | 'blog' | 'state_page' | 'beer_page'
  success: boolean
  error_message?: string
}

export interface MapInteractionEvent {
  state_clicked: string
  state_status: 'completed' | 'current' | 'upcoming'
  interaction_type: 'hover' | 'click' | 'zoom'
  viewport_size: {
    width: number
    height: number
  }
}

export interface PerformanceEvent {
  page: string
  load_time: number
  time_to_interactive: number
  largest_contentful_paint: number
  cumulative_layout_shift: number
  first_input_delay: number
}

// Utility function to check if PostHog is ready
const isPostHogReady = (): boolean => {
  return typeof window !== 'undefined' && posthog.__loaded && !isInitializing
}

// Safe tracking wrapper with validation
const safeTrack = (eventName: string, properties: Record<string, any>, required: string[] = []) => {
  if (!isPostHogReady()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`PostHog not ready for event: ${eventName}`)
    }
    return false
  }

  // Validate required properties
  for (const prop of required) {
    if (!properties[prop]) {
      console.warn(`Missing required property "${prop}" for event "${eventName}"`)
      return false
    }
  }

  try {
    posthog.capture(eventName, {
      ...properties,
      $current_url: window.location.href,
      $timestamp: new Date().toISOString()
    })
    return true
  } catch (error) {
    console.error(`Failed to track event "${eventName}":`, error)
    return false
  }
}

// Beer-specific tracking functions
export const trackBeerView = (beerData: BeerInteractionEvent) => {
  return safeTrack('beer_viewed', beerData, ['beer_name', 'brewery_name'])
}

export const trackBeerRating = (beerData: BeerInteractionEvent & { user_rating: number }) => {
  return safeTrack('beer_rated', beerData, ['beer_name', 'brewery_name', 'user_rating'])
}

export const trackStateExploration = (stateData: StateInteractionEvent) => {
  return safeTrack('state_explored', stateData, ['state_name', 'state_code'])
}

export const trackNewsletterSignup = (newsletterData: NewsletterEvent) => {
  const trackingData = {
    ...newsletterData,
    // Don't track email in event data for privacy
    email: undefined
  }
  
  const result = safeTrack('newsletter_signup', trackingData, ['source', 'success'])
  
  // Set user properties if signup was successful and PostHog is ready
  if (result && newsletterData.success && newsletterData.email && isPostHogReady()) {
    try {
      posthog.people.set({
        email: newsletterData.email,
        newsletter_subscriber: true,
        subscription_source: newsletterData.source,
        subscription_date: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to set user properties:', error)
    }
  }
  
  return result
}

export const trackMapInteraction = (mapData: MapInteractionEvent) => {
  return safeTrack('map_interaction', mapData, ['state_clicked', 'interaction_type'])
}

export const trackPerformance = (perfData: PerformanceEvent) => {
  return safeTrack('page_performance', perfData, ['page', 'load_time'])
}

// User identification helpers
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (!isPostHogReady()) return false
  
  try {
    posthog.identify(userId, properties)
    return true
  } catch (error) {
    console.error('Failed to identify user:', error)
    return false
  }
}

export const setUserProperties = (properties: Record<string, any>) => {
  if (!isPostHogReady()) return false
  
  try {
    posthog.people.set(properties)
    return true
  } catch (error) {
    console.error('Failed to set user properties:', error)
    return false
  }
}

// Page tracking
export const trackPageView = (pageName?: string, properties?: Record<string, any>) => {
  return safeTrack('$pageview', {
    $host: typeof window !== 'undefined' ? window.location.host : undefined,
    $pathname: typeof window !== 'undefined' ? window.location.pathname : undefined,
    page_name: pageName,
    ...properties
  })
}

// Session and engagement tracking
export const trackSessionStart = () => {
  if (!isPostHogReady()) return false
  
  return safeTrack('session_start', {
    referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    screen_resolution: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : undefined,
    viewport_size: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : undefined,
    timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined
  })
}

export const trackError = (error: Error, context?: Record<string, any>) => {
  return safeTrack('error_occurred', {
    error_message: error.message,
    error_stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Don't send stack trace in production
    error_name: error.name,
    ...context
  })
}

// Feature flag helpers
export const getFeatureFlag = (key: string): boolean | string => {
  if (!isPostHogReady()) return false
  
  try {
    return posthog.getFeatureFlag(key)
  } catch (error) {
    console.error('Failed to get feature flag:', error)
    return false
  }
}

export const isFeatureEnabled = (key: string): boolean => {
  if (!isPostHogReady()) return false
  
  try {
    return posthog.isFeatureEnabled(key)
  } catch (error) {
    console.error('Failed to check feature flag:', error)
    return false
  }
}