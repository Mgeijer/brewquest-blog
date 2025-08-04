'use client'

import { useEffect, useCallback } from 'react'
import { trackBeerView, trackBeerRating, BeerInteractionEvent } from '@/lib/analytics/posthog'
import { useAnalytics } from '@/components/analytics/PostHogProvider'
import AnalyticsErrorBoundary from './AnalyticsErrorBoundary'

interface BeerData {
  id: string
  name: string
  brewery: string
  state: string
  week_number: number
  day_of_week: number
  abv: number
  style: string
  rating?: number
  image_url?: string
  tasting_notes?: string
}

interface BeerAnalyticsProps {
  beer: BeerData
  children: React.ReactNode
  trackOnMount?: boolean
  trackScrollDepth?: boolean
  trackTimeSpent?: boolean
}

export default function BeerAnalytics({ 
  beer, 
  children, 
  trackOnMount = true,
  trackScrollDepth = true,
  trackTimeSpent = true 
}: BeerAnalyticsProps) {
  const { trackEvent, trackContentEngagement } = useAnalytics()

  // Track beer page view on mount
  useEffect(() => {
    if (!trackOnMount) return

    const beerData: BeerInteractionEvent = {
      beer_name: beer.name,
      brewery_name: beer.brewery,
      state: beer.state,
      week_number: beer.week_number,
      day_of_week: beer.day_of_week,
      abv: beer.abv,
      style: beer.style,
      rating: beer.rating
    }

    trackBeerView(beerData)
    
    trackContentEngagement('beer_page', 'view', {
      beer_id: beer.id,
      beer_name: beer.name,
      brewery_name: beer.brewery,
      state: beer.state,
      week_number: beer.week_number,
      has_image: !!beer.image_url,
      has_tasting_notes: !!beer.tasting_notes
    })
  }, [beer, trackOnMount])

  // Track time spent on page
  useEffect(() => {
    if (!trackTimeSpent) return

    const startTime = Date.now()
    let maxScrollDepth = 0

    const handleScroll = () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      )
      maxScrollDepth = Math.max(maxScrollDepth, scrollDepth)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeSpent = Date.now() - startTime
        trackEvent('beer_page_time_spent', {
          beer_id: beer.id,
          beer_name: beer.name,
          brewery_name: beer.brewery,
          state: beer.state,
          time_spent_ms: timeSpent,
          time_spent_seconds: Math.round(timeSpent / 1000),
          max_scroll_depth: maxScrollDepth
        })
      }
    }

    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime
      trackEvent('beer_page_exit', {
        beer_id: beer.id,
        beer_name: beer.name,
        time_spent_ms: timeSpent,
        max_scroll_depth: maxScrollDepth,
        exit_type: 'navigation'
      })
    }

    if (trackScrollDepth) {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      if (trackScrollDepth) {
        window.removeEventListener('scroll', handleScroll)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [beer, trackTimeSpent, trackScrollDepth])

  return (
    <AnalyticsErrorBoundary>
      {children}
    </AnalyticsErrorBoundary>
  )
}

// Beer rating component with analytics
interface BeerRatingProps {
  beer: BeerData
  currentRating?: number
  onRatingChange?: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  readOnly?: boolean
}

export function BeerRating({ 
  beer, 
  currentRating = 0, 
  onRatingChange,
  size = 'md',
  readOnly = false 
}: BeerRatingProps) {
  const { trackEvent } = useAnalytics()

  const handleRatingClick = useCallback((rating: number) => {
    if (readOnly) return

    const beerData: BeerInteractionEvent & { user_rating: number } = {
      beer_name: beer.name,
      brewery_name: beer.brewery,
      state: beer.state,
      week_number: beer.week_number,
      day_of_week: beer.day_of_week,
      abv: beer.abv,
      style: beer.style,
      rating: beer.rating,
      user_rating: rating
    }

    trackBeerRating(beerData)
    
    trackEvent('beer_user_rating', {
      beer_id: beer.id,
      beer_name: beer.name,
      brewery_name: beer.brewery,
      user_rating: rating,
      official_rating: beer.rating,
      rating_difference: beer.rating ? rating - beer.rating : null
    })

    onRatingChange?.(rating)
  }, [beer, onRatingChange, readOnly])

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRatingClick(star)}
          disabled={readOnly}
          className={`${sizeClasses[size]} ${
            readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } transition-transform`}
        >
          <svg
            fill={star <= currentRating ? '#F59E0B' : '#E5E7EB'}
            stroke={star <= currentRating ? '#D97706' : '#9CA3AF'}
            strokeWidth={1}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      ))}
      {!readOnly && (
        <span className="ml-2 text-sm text-gray-600">
          {currentRating > 0 ? `${currentRating}/5` : 'Rate this beer'}
        </span>
      )}
    </div>
  )
}

// Beer sharing component
interface BeerShareProps {
  beer: BeerData
  url?: string
  onShare?: (platform: string) => void
}

export function BeerShare({ beer, url, onShare }: BeerShareProps) {
  const { trackEvent } = useAnalytics()

  const handleShare = useCallback((platform: string) => {
    trackEvent('beer_shared', {
      beer_id: beer.id,
      beer_name: beer.name,
      brewery_name: beer.brewery,
      state: beer.state,
      platform,
      share_url: url || window.location.href
    })

    onShare?.(platform)
  }, [beer, url, onShare])

  const shareUrl = encodeURIComponent(url || window.location.href)
  const shareText = encodeURIComponent(`Check out ${beer.name} by ${beer.brewery} from ${beer.state}!`)

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Share:</span>
      
      <a
        href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleShare('twitter')}
        className="text-blue-500 hover:text-blue-600 transition-colors"
      >
        Twitter
      </a>
      
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleShare('facebook')}
        className="text-blue-600 hover:text-blue-700 transition-colors"
      >
        Facebook
      </a>
      
      <button
        onClick={() => {
          navigator.clipboard.writeText(url || window.location.href)
          handleShare('clipboard')
        }}
        className="text-gray-600 hover:text-gray-700 transition-colors"
      >
        Copy Link
      </button>
    </div>
  )
}

// Hook for beer-specific analytics
export const useBeerAnalytics = () => {
  const { trackEvent } = useAnalytics()

  const trackBeerInteraction = useCallback((action: string, beer: BeerData, properties?: Record<string, any>) => {
    trackEvent(`beer_${action}`, {
      beer_id: beer.id,
      beer_name: beer.name,
      brewery_name: beer.brewery,
      state: beer.state,
      week_number: beer.week_number,
      day_of_week: beer.day_of_week,
      abv: beer.abv,
      style: beer.style,
      ...properties
    })
  }, [trackEvent])

  const trackBeerComparison = useCallback((beer1: BeerData, beer2: BeerData) => {
    trackEvent('beer_comparison', {
      beer1_id: beer1.id,
      beer1_name: beer1.name,
      beer1_brewery: beer1.brewery,
      beer1_state: beer1.state,
      beer2_id: beer2.id,
      beer2_name: beer2.name,
      beer2_brewery: beer2.brewery,
      beer2_state: beer2.state,
      same_state: beer1.state === beer2.state,
      same_brewery: beer1.brewery === beer2.brewery,
      same_style: beer1.style === beer2.style,
      abv_difference: Math.abs(beer1.abv - beer2.abv)
    })
  }, [trackEvent])

  const trackBeerFavorite = useCallback((beer: BeerData, isFavorited: boolean) => {
    trackBeerInteraction(isFavorited ? 'favorited' : 'unfavorited', beer, {
      is_favorited: isFavorited
    })
  }, [trackBeerInteraction])

  return {
    trackBeerInteraction,
    trackBeerComparison,
    trackBeerFavorite
  }
}