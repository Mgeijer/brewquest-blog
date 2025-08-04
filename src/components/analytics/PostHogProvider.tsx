'use client'

import { createContext, useContext, useEffect, ReactNode, Suspense, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import AnalyticsErrorBoundary from './AnalyticsErrorBoundary'
import { 
  initPostHog, 
  posthog, 
  trackPageView, 
  trackSessionStart,
  trackPerformance,
  PerformanceEvent 
} from '@/lib/analytics/posthog'

interface PostHogContextType {
  posthog: typeof posthog
  trackPageView: typeof trackPageView
  trackSessionStart: typeof trackSessionStart
  isLoaded: boolean
}

const PostHogContext = createContext<PostHogContextType | null>(null)

export const usePostHog = () => {
  const context = useContext(PostHogContext)
  if (!context) {
    throw new Error('usePostHog must be used within a PostHogProvider')
  }
  return context
}

interface PostHogProviderProps {
  children: ReactNode
}

// Component that handles search params with proper Suspense boundary
function PostHogPageTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      
      // Determine page type and properties
      let pageProperties: Record<string, any> = {
        page_type: 'unknown',
        page_path: pathname
      }

      if (pathname === '/') {
        pageProperties.page_type = 'homepage'
      } else if (pathname.startsWith('/states/')) {
        pageProperties.page_type = 'state_page'
        const stateMatch = pathname.match(/^\/states\/([^\/]+)/)
        if (stateMatch) {
          pageProperties.state_code = stateMatch[1].toUpperCase()
          pageProperties.state_name = stateMatch[1]
        }
      } else if (pathname.startsWith('/beers/')) {
        pageProperties.page_type = 'beer_page'
        const beerMatch = pathname.match(/^\/beers\/([^\/]+)/)
        if (beerMatch) {
          pageProperties.beer_id = beerMatch[1]
        }
      } else if (pathname.startsWith('/blog/')) {
        pageProperties.page_type = 'blog_page'
        const blogMatch = pathname.match(/^\/blog\/([^\/]+)/)
        if (blogMatch) {
          pageProperties.blog_slug = blogMatch[1]
        }
      } else if (pathname === '/about') {
        pageProperties.page_type = 'about_page'
      } else if (pathname === '/newsletter') {
        pageProperties.page_type = 'newsletter_page'
      }

      trackPageView(pathname, pageProperties)
    }
  }, [pathname, searchParams])

  return null
}

export default function PostHogProvider({ children }: PostHogProviderProps) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Initialize PostHog
    initPostHog()

    // Track session start on first load
    if (typeof window !== 'undefined' && !sessionStorage.getItem('session_tracked')) {
      trackSessionStart()
      sessionStorage.setItem('session_tracked', 'true')
    }

    // Set up performance monitoring
    let performanceTimer: NodeJS.Timeout
    let loadHandler: (() => void) | undefined
    let cleanupPerformance: (() => void) | undefined
    
    if (typeof window !== 'undefined' && 'performance' in window) {
      const measurePerformance = () => {
        try {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          const paintEntries = performance.getEntriesByType('paint')
          const layoutShiftEntries = performance.getEntriesByType('layout-shift')
          
          if (navigation) {
            const perfData: PerformanceEvent = {
              page: pathname,
              load_time: navigation.loadEventEnd - navigation.loadEventStart,
              time_to_interactive: navigation.domInteractive - navigation.navigationStart,
              largest_contentful_paint: 0,
              cumulative_layout_shift: 0,
              first_input_delay: 0
            }

            // Get LCP
            const lcpEntry = paintEntries.find(entry => entry.name === 'largest-contentful-paint')
            if (lcpEntry) {
              perfData.largest_contentful_paint = lcpEntry.startTime
            }

            // Calculate CLS
            if (layoutShiftEntries.length > 0) {
              perfData.cumulative_layout_shift = layoutShiftEntries.reduce(
                (sum: number, entry: any) => sum + entry.value, 
                0
              )
            }

            trackPerformance(perfData)
          }
        } catch (error) {
          console.warn('Performance measurement failed:', error)
        }
      }

      // Measure performance after page load
      loadHandler = () => {
        performanceTimer = setTimeout(measurePerformance, 1000)
      }
      
      if (document.readyState === 'complete') {
        performanceTimer = setTimeout(measurePerformance, 1000)
      } else {
        window.addEventListener('load', loadHandler)
      }
      
      // Setup cleanup function
      cleanupPerformance = () => {
        clearTimeout(performanceTimer)
        if (loadHandler) {
          window.removeEventListener('load', loadHandler)
        }
      }
    }

    // Set up error tracking
    const handleError = (event: ErrorEvent) => {
      if (typeof window !== 'undefined' && posthog.__loaded) {
        posthog.capture('client_error', {
          error_message: event.message,
          error_filename: event.filename,
          error_lineno: event.lineno,
          error_colno: event.colno,
          $current_url: window.location.href
        })
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (typeof window !== 'undefined' && posthog.__loaded) {
        posthog.capture('unhandled_promise_rejection', {
          error_reason: event.reason?.toString(),
          $current_url: window.location.href
        })
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      // Clean up performance timers and listeners
      if (cleanupPerformance) {
        cleanupPerformance()
      }
    }
  }, [])

  // Page tracking is now handled by PostHogPageTracker component with Suspense

  const contextValue: PostHogContextType = {
    posthog,
    trackPageView,
    trackSessionStart,
    isLoaded: typeof window !== 'undefined' && posthog.__loaded
  }

  return (
    <AnalyticsErrorBoundary>
      <PostHogContext.Provider value={contextValue}>
        <Suspense fallback={null}>
          <PostHogPageTracker />
        </Suspense>
        {children}
      </PostHogContext.Provider>
    </AnalyticsErrorBoundary>
  )
}

// Hook for tracking component-specific events
export const useAnalytics = () => {
  const { posthog, isLoaded } = usePostHog()

  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    if (isLoaded && posthog) {
      try {
        posthog.capture(eventName, {
          ...properties,
          $current_url: typeof window !== 'undefined' ? window.location.href : undefined,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Failed to track event:', eventName, error)
      }
    }
  }, [isLoaded, posthog])

  const trackClick = useCallback((elementName: string, properties?: Record<string, any>) => {
    trackEvent('element_clicked', {
      element_name: elementName,
      ...properties
    })
  }, [trackEvent])

  const trackFormSubmit = useCallback((formName: string, success: boolean, properties?: Record<string, any>) => {
    trackEvent('form_submitted', {
      form_name: formName,
      success,
      ...properties
    })
  }, [trackEvent])

  const trackSearch = useCallback((query: string, results_count?: number, properties?: Record<string, any>) => {
    trackEvent('search_performed', {
      search_query: query,
      results_count,
      ...properties
    })
  }, [trackEvent])

  const trackContentEngagement = useCallback((contentType: string, action: string, properties?: Record<string, any>) => {
    trackEvent('content_engagement', {
      content_type: contentType,
      engagement_action: action,
      ...properties
    })
  }, [trackEvent])

  return {
    trackEvent,
    trackClick,
    trackFormSubmit,
    trackSearch,
    trackContentEngagement,
    isLoaded
  }
}