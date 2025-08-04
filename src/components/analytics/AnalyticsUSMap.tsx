'use client'

import { useState, useCallback } from 'react'
import USMapSVG from '@/components/interactive/USMapSVG'
import { trackMapInteraction, trackStateExploration } from '@/lib/analytics/posthog'
import { useAnalytics } from '@/components/analytics/PostHogProvider'

interface StateProgressData {
  [key: string]: {
    status: 'completed' | 'current' | 'upcoming'
    week: number
    name: string
    totalBreweries?: number
  }
}

interface AnalyticsUSMapProps {
  stateProgress: StateProgressData
  onStateClick?: (stateCode: string) => void
  className?: string
  showTooltips?: boolean
}

export default function AnalyticsUSMap({ 
  stateProgress, 
  onStateClick,
  className = '',
  showTooltips = true 
}: AnalyticsUSMapProps) {
  const { trackClick, trackEvent } = useAnalytics()
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const handleStateHover = useCallback((stateCode: string, event: React.MouseEvent) => {
    if (!stateCode || stateCode === hoveredState) return

    setHoveredState(stateCode)
    setTooltipPosition({ x: event.clientX, y: event.clientY })

    const stateData = stateProgress[stateCode]
    if (stateData) {
      // Track map hover interactions
      trackMapInteraction({
        state_clicked: stateCode,
        state_status: stateData.status,
        interaction_type: 'hover',
        viewport_size: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      })

      trackEvent('map_state_hover', {
        state_code: stateCode,
        state_name: stateData.name,
        state_status: stateData.status,
        week_number: stateData.week,
        total_breweries: stateData.totalBreweries
      })
    }
  }, [hoveredState, stateProgress])

  const handleStateLeave = useCallback(() => {
    setHoveredState(null)
  }, [])

  const handleStateClick = useCallback((stateCode: string, event: React.MouseEvent) => {
    if (!stateCode) return

    const stateData = stateProgress[stateCode]
    if (stateData) {
      // Track map click interactions
      trackMapInteraction({
        state_clicked: stateCode,
        state_status: stateData.status,
        interaction_type: 'click',
        viewport_size: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      })

      // Track state exploration
      trackStateExploration({
        state_name: stateData.name,
        state_code: stateCode,
        week_number: stateData.week,
        total_breweries: stateData.totalBreweries || 0,
        interaction_type: 'navigate'
      })

      trackClick('map_state_click', {
        state_code: stateCode,
        state_name: stateData.name,
        state_status: stateData.status,
        week_number: stateData.week,
        click_position: { x: event.clientX, y: event.clientY }
      })
    }

    // Call the original onClick handler
    onStateClick?.(stateCode)
  }, [stateProgress, onStateClick])

  const handleMapZoom = useCallback((zoomLevel: number, center: { x: number, y: number }) => {
    trackEvent('map_zoom', {
      zoom_level: zoomLevel,
      zoom_center: center,
      viewport_size: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
  }, [])

  const getStateClassName = (stateCode: string) => {
    const stateData = stateProgress[stateCode]
    if (!stateData) return 'fill-gray-200 hover:fill-gray-300'

    const baseClasses = 'transition-all duration-200 cursor-pointer'
    const hoverEffect = hoveredState === stateCode ? 'brightness-110 drop-shadow-md' : ''

    switch (stateData.status) {
      case 'completed':
        return `${baseClasses} fill-green-500 hover:fill-green-600 stroke-green-700 stroke-1 ${hoverEffect}`
      case 'current':
        return `${baseClasses} fill-beer-amber hover:fill-beer-gold stroke-beer-dark stroke-2 ${hoverEffect} animate-pulse`
      case 'upcoming':
        return `${baseClasses} fill-gray-300 hover:fill-gray-400 stroke-gray-500 stroke-1 ${hoverEffect}`
      default:
        return `${baseClasses} fill-gray-200 hover:fill-gray-300 ${hoverEffect}`
    }
  }

  return (
    <div className={`analytics-us-map relative ${className}`}>
      <USMapSVG
        onStateHover={handleStateHover}
        onStateLeave={handleStateLeave}
        onStateClick={handleStateClick}
        getStateClassName={getStateClassName}
        className="w-full h-auto"
      />

      {/* Interactive Tooltip */}
      {showTooltips && hoveredState && stateProgress[hoveredState] && (
        <div
          className="fixed z-50 bg-black/90 text-white px-3 py-2 rounded-lg shadow-xl border border-gray-600 pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="text-sm font-semibold">
            {stateProgress[hoveredState].name}
          </div>
          <div className="text-xs text-gray-300">
            Week {stateProgress[hoveredState].week} • {stateProgress[hoveredState].status}
          </div>
          {stateProgress[hoveredState].totalBreweries && (
            <div className="text-xs text-gray-400">
              {stateProgress[hoveredState].totalBreweries} breweries
            </div>
          )}
        </div>
      )}

      {/* Map Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded border border-green-700"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-beer-amber rounded border border-beer-dark animate-pulse"></div>
          <span>Current Week</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded border border-gray-500"></div>
          <span>Upcoming</span>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {Object.values(stateProgress).filter(s => s.status === 'completed').length}
          </div>
          <div className="text-sm text-green-700">States Completed</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-amber-600">
            {Object.values(stateProgress).filter(s => s.status === 'current').length}
          </div>
          <div className="text-sm text-amber-700">Current State</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-600">
            {Object.values(stateProgress).filter(s => s.status === 'upcoming').length}
          </div>
          <div className="text-sm text-gray-700">States Remaining</div>
        </div>
      </div>
    </div>
  )
}

// Hook for tracking map-specific analytics
export const useMapAnalytics = () => {
  const { trackEvent } = useAnalytics()

  const trackMapLoad = (totalStates: number, completedStates: number) => {
    trackEvent('map_loaded', {
      total_states: totalStates,
      completed_states: completedStates,
      completion_percentage: (completedStates / totalStates) * 100,
      viewport_size: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
  }

  const trackMapEngagement = (engagementType: 'scroll_to_map' | 'legend_click' | 'tooltip_view') => {
    trackEvent('map_engagement', {
      engagement_type: engagementType,
      timestamp: new Date().toISOString()
    })
  }

  const trackStateComparison = (state1: string, state2: string) => {
    trackEvent('state_comparison', {
      state_1: state1,
      state_2: state2,
      comparison_timestamp: new Date().toISOString()
    })
  }

  return {
    trackMapLoad,
    trackMapEngagement,
    trackStateComparison
  }
}