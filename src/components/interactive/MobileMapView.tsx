'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { stateProgressData, getStateByCode, getJourneyProgress, type StateData } from '@/lib/data/stateProgress'
import { regions, getRegionForState, getRegionProgress, getRegionSummary } from '@/lib/data/regionData'
import { useMobileDetection, useSwipeGestures, useHapticFeedback, useTouchFriendly } from '@/lib/hooks/useMobileGestures'
import { useSimpleMapAnalytics } from '@/lib/analytics/simpleMapAnalytics'
import { 
  Map, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  MapPin,
  Star,
  Calendar,
  BarChart3,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface MobileMapViewProps {
  className?: string
  onStateSelect?: (state: StateData) => void
  enableNavigation?: boolean
  enableAnalytics?: boolean
}

type ViewMode = 'map' | 'list' | 'region'

export function MobileMapView({ 
  className, 
  onStateSelect, 
  enableNavigation = true,
  enableAnalytics = true 
}: MobileMapViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedState, setSelectedState] = useState<StateData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set())

  // Mobile detection and gestures
  const deviceInfo = useMobileDetection()
  const { triggerHaptic } = useHapticFeedback()
  const { touchState, handleTouchStart, handleTouchEnd } = useTouchFriendly()

  // Analytics
  const {
    trackStateClick,
    trackStateHover,
    trackStateNavigation
  } = useSimpleMapAnalytics()

  // Journey progress
  const journeyProgress = getJourneyProgress()

  // Swipe gestures for navigation
  const { gestureState, handlers } = useSwipeGestures({
    onSwipeLeft: () => {
      if (viewMode === 'list') {
        setViewMode('region')
        triggerHaptic('selection')
      }
    },
    onSwipeRight: () => {
      if (viewMode === 'region') {
        setViewMode('list')
        triggerHaptic('selection')
      }
    },
    onPullToRefresh: () => {
      handleRefresh()
    }
  })

  // Setup touch events
  useEffect(() => {
    const element = document.body
    
    element.addEventListener('touchstart', handlers.onTouchStart)
    element.addEventListener('touchmove', handlers.onTouchMove)
    element.addEventListener('touchend', handlers.onTouchEnd)
    
    return () => {
      element.removeEventListener('touchstart', handlers.onTouchStart)
      element.removeEventListener('touchmove', handlers.onTouchMove)
      element.removeEventListener('touchend', handlers.onTouchEnd)
    }
  }, [handlers])

  // Auto-select appropriate view based on screen size
  useEffect(() => {
    if (deviceInfo.screenSize === 'mobile') {
      setViewMode('list')
    } else if (deviceInfo.screenSize === 'tablet') {
      setViewMode('region')
    }
  }, [deviceInfo.screenSize])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    triggerHaptic('medium')
    
    // Simulate refresh (in real app, would fetch latest data)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsRefreshing(false)
    triggerHaptic('light')
  }, [triggerHaptic])

  const handleStateClick = useCallback((state: StateData) => {
    triggerHaptic('light')
    setSelectedState(state)
    onStateSelect?.(state)

    if (enableAnalytics) {
      trackStateClick(state.code, {
        viewMode,
        deviceType: deviceInfo.screenSize,
        region: getRegionForState(state.code)?.name
      })
    }

    if (enableNavigation) {
      // Navigation would happen here
      trackStateNavigation(state.code, {
        source: 'mobile_view',
        viewMode
      })
    }
  }, [viewMode, deviceInfo.screenSize, enableAnalytics, enableNavigation, onStateSelect, trackStateClick, trackStateNavigation, triggerHaptic])

  const toggleRegionExpansion = useCallback((regionId: string) => {
    setExpandedRegions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(regionId)) {
        newSet.delete(regionId)
      } else {
        newSet.add(regionId)
      }
      return newSet
    })
    triggerHaptic('selection')
  }, [triggerHaptic])

  // Memoized calculations
  const regionSummaries = useMemo(() => {
    return regions.map(region => getRegionSummary(region.id, stateProgressData)).filter(Boolean)
  }, [])

  const filteredStates = useMemo(() => {
    if (selectedRegion) {
      const region = regions.find(r => r.id === selectedRegion)
      return stateProgressData.filter(state => region?.states.includes(state.code))
    }
    return stateProgressData
  }, [selectedRegion])

  const renderProgressBar = (completed: number, total: number) => (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div 
          className="bg-beer-amber h-2 rounded-full transition-all duration-300"
          style={{ width: `${(completed / total) * 100}%` }}
        />
      </div>
      <span className="text-xs text-gray-600 min-w-[3rem]">
        {completed}/{total}
      </span>
    </div>
  )

  const renderStateCard = (state: StateData) => (
    <div
      key={state.code}
      className={cn(
        "bg-white rounded-lg p-4 shadow-sm border border-gray-200",
        "mobile-list-item mobile-touch-feedback mobile-touch-target mobile-card-enter",
        "transform transition-all duration-200",
        touchState.pressedElement === state.code && "scale-95 shadow-lg mobile-haptic-feedback triggered",
        "active:scale-95"
      )}
      onTouchStart={() => handleTouchStart(state.code)}
      onTouchEnd={handleTouchEnd}
      onClick={() => handleStateClick(state)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-beer-dark text-lg">{state.name}</h3>
          <p className="text-sm text-gray-600">Week {state.weekNumber} • {state.region}</p>
        </div>
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          state.status === 'completed' && "bg-green-100 text-green-800",
          state.status === 'current' && "bg-beer-cream text-beer-dark",
          state.status === 'upcoming' && "bg-gray-100 text-gray-600"
        )}>
          {state.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="text-center">
          <div className="text-lg font-bold text-beer-dark">{state.totalBreweries}</div>
          <div className="text-xs text-gray-600">Breweries</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-beer-dark">{state.featuredBeers?.length || 0}</div>
          <div className="text-xs text-gray-600">Featured Beers</div>
        </div>
      </div>

      {state.description && (
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {state.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-3 h-3" />
          {state.capital}
        </div>
        {state.status === 'completed' && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <Star className="w-3 h-3 fill-current" />
            Completed
          </div>
        )}
      </div>
    </div>
  )

  const renderRegionCard = (summary: any) => {
    const isExpanded = expandedRegions.has(summary.region.id)
    const progress = summary.progress

    return (
      <div key={summary.region.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div 
          className="p-4 cursor-pointer"
          onClick={() => toggleRegionExpansion(summary.region.id)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-beer-dark text-lg">{summary.region.name}</h3>
              <p className="text-sm text-gray-600">{summary.region.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm font-medium text-beer-dark">{progress.percentage}%</div>
                <div className="text-xs text-gray-600">Complete</div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>

          {renderProgressBar(progress.completed, progress.total)}

          <div className="grid grid-cols-3 gap-4 mt-3">
            <div className="text-center">
              <div className="text-lg font-bold text-beer-dark">{summary.totalBreweries}</div>
              <div className="text-xs text-gray-600">Breweries</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-beer-dark">{summary.totalBeers}</div>
              <div className="text-xs text-gray-600">Beers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-beer-dark">{progress.total}</div>
              <div className="text-xs text-gray-600">States</div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="space-y-3">
              {progress.states.map(state => (
                <div
                  key={state.code}
                  className="flex items-center justify-between p-2 bg-white rounded border"
                  onClick={() => handleStateClick(state)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      state.status === 'completed' && "bg-green-500",
                      state.status === 'current' && "bg-beer-amber",
                      state.status === 'upcoming' && "bg-gray-300"
                    )} />
                    <div>
                      <div className="font-medium text-sm">{state.name}</div>
                      <div className="text-xs text-gray-600">Week {state.weekNumber}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("w-full mobile-map-container mobile-safe-area", className)}>
      {/* Pull-to-refresh indicator */}
      {gestureState.isPullToRefresh && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-beer-amber text-white text-center py-2 pull-to-refresh active">
          <div className="flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4 pull-to-refresh-spinner" />
            Pull to refresh
          </div>
        </div>
      )}

      {/* Header with view toggles and progress */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="p-4">
          {/* Progress indicator */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-beer-dark">Beer Journey Progress</h2>
              <span className="text-sm text-gray-600">
                {journeyProgress.completed} of {journeyProgress.total} states
              </span>
            </div>
            {renderProgressBar(journeyProgress.completed, journeyProgress.total)}
          </div>

          {/* View mode selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                viewMode === 'list' ? "bg-white text-beer-dark shadow-sm" : "text-gray-600"
              )}
              onClick={() => {
                setViewMode('list')
                triggerHaptic('selection')
              }}
            >
              <List className="w-4 h-4" />
              List
            </button>
            <button
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                viewMode === 'region' ? "bg-white text-beer-dark shadow-sm" : "text-gray-600"
              )}
              onClick={() => {
                setViewMode('region')
                triggerHaptic('selection')
              }}
            >
              <BarChart3 className="w-4 h-4" />
              Regions
            </button>
            {deviceInfo.screenSize !== 'mobile' && (
              <button
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                  viewMode === 'map' ? "bg-white text-beer-dark shadow-sm" : "text-gray-600"
                )}
                onClick={() => {
                  setViewMode('map')
                  triggerHaptic('selection')
                }}
              >
                <Map className="w-4 h-4" />
                Map
              </button>
            )}
          </div>

          {/* Swipe hint for mobile */}
          {deviceInfo.screenSize === 'mobile' && (
            <div className="text-center mt-2">
              <p className="text-xs text-gray-500">
                ← Swipe to switch between List and Regions →
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="min-h-screen bg-beer-cream/30">
        <div className="p-4">
          {viewMode === 'list' && (
            <div className="space-y-4 mobile-list-container">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-beer-dark">All States</h3>
                <div className="text-sm text-gray-600">
                  {filteredStates.length} states
                </div>
              </div>
              {filteredStates.map(renderStateCard)}
            </div>
          )}

          {viewMode === 'region' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-beer-dark">Regions</h3>
                <div className="text-sm text-gray-600">
                  {regions.length} regions
                </div>
              </div>
              {regionSummaries.map(renderRegionCard)}
            </div>
          )}

          {viewMode === 'map' && deviceInfo.screenSize !== 'mobile' && (
            <div className="bg-white rounded-lg p-4 text-center">
              <Map className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-beer-dark mb-2">Interactive Map</h3>
              <p className="text-gray-600 mb-4">
                The full interactive map experience is optimized for larger screens.
              </p>
              <button 
                className="bg-beer-amber text-white px-6 py-2 rounded-lg hover:bg-beer-amber-dark transition-colors"
                onClick={() => setViewMode('region')}
              >
                Explore Regions Instead
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Refreshing overlay */}
      {isRefreshing && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <RotateCcw className="w-5 h-5 animate-spin text-beer-amber" />
            <span className="text-beer-dark">Refreshing...</span>
          </div>
        </div>
      )}
    </div>
  )
}