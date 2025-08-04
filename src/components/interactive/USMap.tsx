'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { USMapSVG } from './USMapSVG'
import { getAllStateProgress, type StateProgress } from '@/lib/supabase/functions/stateProgressFunctions'
import { type StateData } from '@/lib/data/stateProgress'
import { cn } from '@/lib/utils'
import { 
  useAnimationConfig, 
  useProgressAnimation, 
  useTouchRipple, 
  useCelebrationTrigger,
  getAnimatedStateStyle,
  CompletionCelebration 
} from './USMapAnimations'
import { StateTooltip, useStateTooltip } from './StateTooltip'
import { useSimpleMapAnalytics } from '@/lib/analytics/simpleMapAnalytics'
import { trackMapInteraction, trackStateExploration } from '@/lib/analytics/posthog'
import { useAnalytics } from '@/components/analytics/PostHogProvider'

interface USMapProps {
  className?: string
  showLegend?: boolean
  showProgress?: boolean
  onStateSelect?: (state: StateData) => void
  onMapLoad?: () => void
  enableNavigation?: boolean
  enableAnalytics?: boolean
  loadingStates?: string[]
  errorStates?: string[]
  enableTooltips?: boolean
}

// Analytics utility
const trackEvent = (eventName: string, properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // Google Analytics 4
    (window as any).gtag('event', eventName, properties)
  }
  
  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, properties)
  }
}

export default function USMap({ 
  className, 
  showLegend = true, 
  showProgress = true,
  onStateSelect,
  onMapLoad,
  enableNavigation = true,
  enableAnalytics = true,
  loadingStates = [],
  errorStates = [],
  enableTooltips = true
}: USMapProps) {
  const router = useRouter()
  const { trackEvent, trackClick } = useAnalytics()
  const [selectedState, setSelectedState] = useState<StateData | null>(null)
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [focusedState, setFocusedState] = useState<string | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hoverStartTime, setHoverStartTime] = useState<number | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  
  // Supabase state management
  const [stateProgressData, setStateProgressData] = useState<StateData[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [dataError, setDataError] = useState<string | null>(null)

  // Convert Supabase StateProgress to StateData format
  const convertToStateData = (supabaseState: StateProgress): StateData => {
    return {
      code: supabaseState.state_code,
      name: supabaseState.state_name,
      status: supabaseState.status,
      weekNumber: supabaseState.week_number,
      featuredBeers: [], // Will be populated separately if needed
      blogPostSlug: supabaseState.blog_post_id ? `${supabaseState.state_name.toLowerCase().replace(/\s+/g, '-')}-craft-beer-journey` : undefined,
      completionDate: supabaseState.completion_date ? new Date(supabaseState.completion_date) : undefined,
      heroImage: '/images/Craft-Brewery-Landscape.png', // Default hero image
      description: supabaseState.description,
      totalBreweries: supabaseState.total_breweries,
      region: supabaseState.region as 'northeast' | 'southeast' | 'midwest' | 'southwest' | 'west',
      capital: '', // Would need additional data
      population: 0, // Would need additional data
      breweryDensity: 0 // Would need to calculate from totalBreweries and population
    }
  }

  // Load state data from Supabase with fallback
  const loadStateData = useCallback(async () => {
    setIsLoadingData(true)
    setDataError(null)
    
    try {
      console.log('🔄 Loading state data from Supabase...')
      const { data: supabaseStates, error } = await getAllStateProgress()
      
      if (error) {
        console.error('❌ Error loading state data:', error)
        // Fallback to local state data instead of showing error
        console.log('🔄 Falling back to local state data...')
        const { getAllStatesData } = await import('@/lib/data/stateProgress')
        const fallbackStates = getAllStatesData()
        console.log('✅ Loaded', fallbackStates.length, 'states from fallback')
        setStateProgressData(fallbackStates)
        return
      }

      if (supabaseStates && supabaseStates.length > 0) {
        console.log('✅ Loaded', supabaseStates.length, 'states from Supabase')
        const convertedStates = supabaseStates.map(convertToStateData)
        setStateProgressData(convertedStates)
      } else {
        console.warn('⚠️ No state data returned from Supabase, using fallback')
        // Fallback to local state data
        const { getAllStatesData } = await import('@/lib/data/stateProgress')
        const fallbackStates = getAllStatesData()
        console.log('✅ Loaded', fallbackStates.length, 'states from fallback')
        setStateProgressData(fallbackStates)
      }
    } catch (err) {
      console.error('❌ Exception loading state data:', err)
      // Fallback to local state data instead of showing error
      try {
        console.log('🔄 Falling back to local state data...')
        const { getAllStatesData } = await import('@/lib/data/stateProgress')
        const fallbackStates = getAllStatesData()
        console.log('✅ Loaded', fallbackStates.length, 'states from fallback')
        setStateProgressData(fallbackStates)
      } catch (fallbackErr) {
        console.error('❌ Fallback also failed:', fallbackErr)
        setDataError('Failed to load state data')
      }
    } finally {
      setIsLoadingData(false)
    }
  }, [])

  // Helper functions - MOVED HERE to fix initialization order
  const getStateByCode = useCallback((code: string): StateData | undefined => {
    return stateProgressData.find(state => state.code === code)
  }, [stateProgressData])

  const getJourneyProgress = useCallback(() => {
    const completed = stateProgressData.filter(state => state.status === 'completed').length
    const total = 50 // All US states
    const percentage = Math.round((completed / total) * 100)
    
    return { completed, total, percentage }
  }, [stateProgressData])

  // Animation hooks - MOVED HERE to fix initialization order
  const animationConfig = useAnimationConfig()
  const { createRipple, RippleElements } = useTouchRipple()
  const { celebrations, triggerCelebration, completeCelebration } = useCelebrationTrigger()

  // Tooltip management - MOVED HERE to fix initialization order
  const { tooltipState, showTooltip, hideTooltip, updatePosition } = useStateTooltip()
  
  // Analytics tracking - MOVED HERE to fix initialization order
  const {
    trackStateHover,
    trackStateClick,
    trackStateNavigation,
    trackTooltipView,
    trackCompletionCelebration,
    trackInteractionTime
  } = useSimpleMapAnalytics()

  const journeyProgress = getJourneyProgress()
  const animatedProgress = useProgressAnimation(journeyProgress.percentage)

  const handleStateClick = useCallback(async (stateCode: string, event?: React.MouseEvent | React.TouchEvent) => {
    console.log(`🎯 State clicked: ${stateCode}`)
    const state = getStateByCode(stateCode)
    console.log(`📍 State data:`, state)
    console.log(`📊 All states data length:`, stateProgressData.length)
    console.log(`📊 Available state codes:`, stateProgressData.map(s => s.code).slice(0, 10))
    
    if (!state) {
      console.log(`❌ Click blocked - no state data found for ${stateCode}`)
      console.log(`Available states:`, stateProgressData.map(s => `${s.code}: ${s.name}`))
      return
    }
    
    if (isNavigating) {
      console.log(`❌ Click blocked - currently navigating`)
      return
    }

    // Create ripple effect for touch devices
    if (event && animationConfig.enableAnimations) {
      createRipple(event)
    }

    // Trigger celebration if state was just completed
    if (state.status === 'completed' && selectedState?.code !== stateCode) {
      triggerCelebration(stateCode)
      trackCompletionCelebration(stateCode)
    }

    // Track analytics
    if (enableAnalytics) {
      // PostHog analytics
      trackMapInteraction({
        state_clicked: stateCode,
        state_status: state.status,
        interaction_type: 'click',
        viewport_size: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      })

      trackStateExploration({
        state_name: state.name,
        state_code: stateCode,
        week_number: state.weekNumber || 0,
        total_breweries: state.totalBreweries || 0,
        interaction_type: 'navigate'
      })

      trackClick('map_state_click', {
        state_code: stateCode,
        state_name: state.name,
        state_status: state.status,
        week_number: state.weekNumber,
        region: state.region,
        device_type: isMobile ? 'mobile' : 'desktop',
        previous_state: selectedState?.code
      })
      
      // Legacy analytics
      trackStateClick(stateCode, {
        status: state.status,
        stateName: state.name,
        weekNumber: state.weekNumber,
        region: state.region,
        deviceType: isMobile ? 'mobile' : 'desktop',
        previousState: selectedState?.code
      })
      
      // Legacy Google Analytics
      trackEvent('state_map_click', {
        stateCode,
        status: state.status,
        stateName: state.name,
        weekNumber: state.weekNumber,
        region: state.region
      })
    }

    setSelectedState(state)
    onStateSelect?.(state)

    // Navigate based on state status and user preference
    if (enableNavigation && !errorStates.includes(stateCode)) {
      try {
        setIsNavigating(true)
        
        if (state.status === 'completed' && state.blogPostSlug) {
          trackStateNavigation(stateCode, {
            destination: 'blog_post',
            slug: state.blogPostSlug,
            conversionType: 'completed_state'
          })
          await router.push(`/blog/${state.blogPostSlug}`)
        } else {
          trackStateNavigation(stateCode, {
            destination: 'state_page',
            conversionType: 'upcoming_state'
          })
          const targetUrl = `/states/${state.name.toLowerCase().replace(/\s+/g, '-')}`
          console.log(`🚀 Navigating to: ${targetUrl}`)
          await router.push(targetUrl)
        }
      } catch (error) {
        console.error('Navigation error:', error)
        // Fallback: show state details instead
      } finally {
        setIsNavigating(false)
      }
    }
  }, [onStateSelect, enableNavigation, enableAnalytics, isNavigating, errorStates, router, createRipple, animationConfig.enableAnimations, triggerCelebration, selectedState, getStateByCode, stateProgressData, trackStateClick, trackStateNavigation, trackCompletionCelebration, isMobile])

  // Native DOM event handlers as backup - MOVED HERE to fix initialization order
  const handleNativeClick = useCallback((event: Event) => {
    event.preventDefault()
    event.stopPropagation()
    const target = event.target as Element
    const stateCode = target.getAttribute('data-state')
    if (stateCode) {
      console.log('🔥 NATIVE click detected:', stateCode)
      handleStateClick(stateCode, event as any)
    }
  }, [handleStateClick])

  const handleNativeTouch = useCallback((event: TouchEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const target = event.target as Element
    const stateCode = target.getAttribute('data-state')
    if (stateCode) {
      console.log('🔥 NATIVE touch detected:', stateCode)
      handleStateClick(stateCode, event as any)
    }
  }, [handleStateClick])

  // Load state data on component mount
  useEffect(() => {
    loadStateData()
  }, [loadStateData])

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Call onMapLoad when component is ready and setup native event listeners
  useEffect(() => {
    let timer: NodeJS.Timeout
    let retryTimer: NodeJS.Timeout
    const eventListeners: Array<{ element: Element; event: string; handler: EventListener }> = []
    
    const setupEventListeners = () => {
      // Check if the SVG has been rendered by looking for state paths
      const svgElement = mapRef.current?.querySelector('svg')
      const statePaths = svgElement?.querySelectorAll('path[data-state]')
      
      if (statePaths && statePaths.length > 0) {
        console.log('Map SVG rendered with', statePaths.length, 'states')
        
        // Add native DOM event listeners as backup
        statePaths.forEach((path) => {
          const stateCode = path.getAttribute('data-state')
          if (stateCode) {
            // Add listeners and track them for cleanup
            path.addEventListener('click', handleNativeClick, { passive: false })
            path.addEventListener('touchend', handleNativeTouch, { passive: false })
            
            eventListeners.push(
              { element: path, event: 'click', handler: handleNativeClick },
              { element: path, event: 'touchend', handler: handleNativeTouch }
            )
          }
        })
        
        onMapLoad?.()
      } else {
        // Try again after a short delay if SVG isn't ready
        retryTimer = setTimeout(() => {
          console.log('Retrying map load check...')
          setupEventListeners()
        }, 200)
      }
    }
    
    // Ensure the map SVG is fully rendered before calling onMapLoad
    timer = setTimeout(setupEventListeners, 50)
    
    return () => {
      // Clean up timers
      clearTimeout(timer)
      clearTimeout(retryTimer)
      
      // Clean up all event listeners
      eventListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler)
      })
    }
  }, [onMapLoad, handleNativeClick, handleNativeTouch])

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedState) return

      const currentIndex = stateProgressData.findIndex(state => state.code === focusedState)
      let nextIndex = currentIndex

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          nextIndex = (currentIndex + 1) % stateProgressData.length
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          nextIndex = currentIndex === 0 ? stateProgressData.length - 1 : currentIndex - 1
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          handleStateClick(focusedState)
          return
        case 'Escape':
          setFocusedState(null)
          setSelectedState(null)
          return
        default:
          return
      }

      e.preventDefault()
      setFocusedState(stateProgressData[nextIndex].code)
    }

    if (focusedState) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [focusedState, stateProgressData, handleStateClick])

  const handleStateHover = useCallback((stateCode: string | null, event?: React.MouseEvent) => {
    // Track hover end time for previous state
    if (hoveredState && hoveredState !== stateCode && hoverStartTime) {
      const hoverDuration = Date.now() - hoverStartTime
      trackInteractionTime(hoveredState, hoverDuration)
    }

    setHoveredState(stateCode)
    
    if (stateCode && event && enableTooltips) {
      const state = getStateByCode(stateCode)
      if (!state) return

      // Record hover start time
      setHoverStartTime(Date.now())

      const rect = mapRef.current?.getBoundingClientRect()
      if (rect) {
        const position = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        }

        // Show tooltip with state information
        showTooltip(state, position)
        
        // Track tooltip view
        if (enableAnalytics) {
          trackTooltipView(stateCode, {
            positionX: position.x,
            positionY: position.y,
            deviceType: isMobile ? 'mobile' : 'desktop'
          })
        }
      }

      // Track hover analytics
      if (enableAnalytics) {
        trackStateHover(stateCode, {
          status: state.status,
          stateName: state.name,
          region: state.region,
          deviceType: isMobile ? 'mobile' : 'desktop'
        })
        
        // Legacy Google Analytics
        trackEvent('state_map_hover', {
          stateCode,
          status: state.status,
          stateName: state.name
        })
      }
    } else {
      // Track final hover duration if ending hover
      if (hoveredState && hoverStartTime) {
        const hoverDuration = Date.now() - hoverStartTime
        trackInteractionTime(hoveredState, hoverDuration)
      }
      
      // Reset hover tracking
      setHoverStartTime(null)
      
      // Hide tooltip when not hovering
      hideTooltip()
    }
  }, [enableAnalytics, enableTooltips, showTooltip, hideTooltip, hoveredState, hoverStartTime, trackStateHover, trackTooltipView, trackInteractionTime, isMobile, getStateByCode])

  // Update tooltip position on mouse move
  const handleMouseMove = useCallback((stateCode: string | null, event?: React.MouseEvent) => {
    if (stateCode && event && enableTooltips && tooltipState.isVisible) {
      const rect = mapRef.current?.getBoundingClientRect()
      if (rect) {
        const position = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        }
        updatePosition(position)
      }
    }
  }, [enableTooltips, tooltipState.isVisible, updatePosition])

  const handleStateFocus = useCallback((stateCode: string) => {
    setFocusedState(stateCode)
    setHoveredState(stateCode)
    
    // Show tooltip for focused state
    if (enableTooltips) {
      const state = getStateByCode(stateCode)
      if (state) {
        // Position tooltip in center of map for keyboard focus
        const centerPosition = { x: 400, y: 200 } // Approximate center
        showTooltip(state, centerPosition)
      }
    }
  }, [enableTooltips, showTooltip])

  const handleStateBlur = useCallback(() => {
    setFocusedState(null)
    setHoveredState(null)
    hideTooltip()
  }, [hideTooltip])

  const getStateStyle = useCallback((stateCode: string) => {
    const state = getStateByCode(stateCode)
    if (!state) return 'fill-gray-200 hover:fill-gray-300 transition-all duration-300 state-path cursor-pointer stroke-gray-400 stroke-1'

    const isHovered = hoveredState === stateCode
    const isSelected = selectedState?.code === stateCode
    const isFocused = focusedState === stateCode
    const isLoading = loadingStates.includes(stateCode)
    const hasError = errorStates.includes(stateCode)

    // Build style classes based on state status with clean borders
    let baseClasses = 'state-path transition-all duration-300 cursor-pointer stroke-gray-400 stroke-1'
    
    // Status-based colors
    switch (state.status) {
      case 'completed':
        baseClasses += ' fill-amber-500 hover:fill-amber-600'
        break
      case 'current':
        baseClasses += ' fill-yellow-300 hover:fill-yellow-400 animate-pulse'
        break
      case 'upcoming':
      default:
        baseClasses += ' fill-gray-200 hover:fill-gray-300'
        break
    }
    
    // Interactive states
    if (isHovered || isFocused) {
      baseClasses += ' brightness-110'
    }
    
    if (isSelected) {
      baseClasses += ' brightness-125 stroke-gray-600 stroke-2'
    }
    
    if (isLoading) {
      baseClasses += ' opacity-50'
    }
    
    if (hasError) {
      baseClasses += ' fill-red-200 hover:fill-red-300'
    }
    
    return baseClasses
  }, [hoveredState, selectedState, focusedState, loadingStates, errorStates, getStateByCode])

  // Show loading state while data is being fetched
  if (isLoadingData) {
    return (
      <div className={cn('w-full', className)}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beer-amber mx-auto mb-4"></div>
            <p className="text-beer-dark">Loading state data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state if data loading failed
  if (dataError) {
    return (
      <div className={cn('w-full', className)}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-700">Error loading map data: {dataError}</p>
            <button 
              onClick={loadStateData}
              className="mt-4 px-4 py-2 bg-beer-amber text-white rounded-lg hover:bg-beer-gold transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-beer-foam">Journey Progress</h3>
            <span className="text-sm text-beer-malt">
              {journeyProgress.completed} of {journeyProgress.total} states
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={cn(
                "h-3 rounded-full progress-bar",
                animationConfig.enableAnimations ? "progress-bar-fill" : "bg-gradient-to-r from-beer-amber to-beer-cream"
              )}
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-beer-malt">
            {animatedProgress}% Complete
          </div>
        </div>
      )}

      {/* Interactive Map */}
      <div 
        className={cn(
          "relative map-container",
          isNavigating && "map-loading",
          errorStates.length > 0 && "map-error"
        )} 
        ref={mapRef}
        onClick={(e) => {
          console.log('🎯 Container clicked!', e.target)
          console.log('🎯 Event details:', e)
          console.log('🎯 Click position:', { x: e.clientX, y: e.clientY })
          const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY)
          console.log('🎯 Element at position:', elementAtPoint)
          console.log('🎯 Element classes:', elementAtPoint?.className)
          console.log('🎯 Element data-state:', elementAtPoint?.getAttribute('data-state'))
          console.log('🎯 Tooltip state:', tooltipState)
          
          // Try to find a state path element that might be clickable
          if (elementAtPoint) {
            const statePath = elementAtPoint.closest('path[data-state]')
            if (statePath) {
              const stateCode = statePath.getAttribute('data-state')
              console.log('🍺 Found state path element!', stateCode)
              if (stateCode) {
                handleStateClick(stateCode, e)
              }
            }
          }
        }}
      >
        <USMapSVG
          onStateClick={handleStateClick}
          onStateHover={handleStateHover}
          onStateMouseMove={handleMouseMove}
          onStateFocus={handleStateFocus}
          onStateBlur={handleStateBlur}
          getStateStyle={getStateStyle}
          className="w-full h-auto"
          style={{ pointerEvents: 'auto', zIndex: 10, position: 'relative' }}
          role="img"
          aria-label="Interactive map of United States showing craft beer journey progress"
          tabIndex={0}
        />

        {/* Touch Ripple Effects */}
        <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, zIndex: 20 }}>
          <RippleElements />
        </div>

        {/* Celebration Animations */}
        <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, zIndex: 30 }}>
          {celebrations.map(stateCode => (
            <CompletionCelebration
              key={stateCode}
              stateCode={stateCode}
              onComplete={() => completeCelebration(stateCode)}
            />
          ))}
        </div>

        {/* State Information Tooltip */}
        {enableTooltips && (
          <StateTooltip
            state={tooltipState.state}
            position={tooltipState.position}
            isVisible={tooltipState.isVisible}
            containerRef={mapRef as React.RefObject<HTMLElement>}
            onClose={hideTooltip}
            isMobile={isMobile}
          />
        )}


        {/* Loading Overlay */}
        {isNavigating && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 rounded-lg">
            <div className="bg-beer-dark text-beer-foam px-4 py-2 rounded-lg flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-beer-cream"></div>
              <span>Loading...</span>
            </div>
          </div>
        )}

        {/* Accessibility Instructions */}
        <div className="sr-only">
          Use arrow keys to navigate between states, Enter or Space to select, Escape to deselect.
          {selectedState && `Currently selected: ${selectedState.name}, Week ${selectedState.weekNumber}, Status: ${selectedState.status}`}
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-6 flex justify-center">
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded border border-gray-400"></div>
              <span className="text-gray-700">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-300 rounded border border-gray-400 animate-pulse"></div>
              <span className="text-gray-700">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded border border-gray-400"></div>
              <span className="text-gray-700">Upcoming</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected State Details */}
      {selectedState && (
        <div className="mt-6 bg-beer-dark/10 rounded-lg p-4 border border-beer-malt/20">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-bold text-beer-foam">{selectedState.name}</h3>
              <p className="text-beer-malt">Week {selectedState.weekNumber} • {selectedState.region.charAt(0).toUpperCase() + selectedState.region.slice(1)}</p>
            </div>
            <button
              onClick={() => setSelectedState(null)}
              className="text-beer-malt hover:text-beer-foam transition-colors"
              aria-label="Close details"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-beer-cream mb-2">State Info</h4>
              <div className="space-y-1 text-sm text-beer-malt">
                <p><span className="font-medium">Capital:</span> {selectedState.capital}</p>
                <p><span className="font-medium">Population:</span> {selectedState.population?.toLocaleString()}</p>
                <p><span className="font-medium">Status:</span> <span className="capitalize">{selectedState.status}</span></p>
                {selectedState.completionDate && (
                  <p><span className="font-medium">Completed:</span> {selectedState.completionDate.toLocaleDateString()}</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-beer-cream mb-2">Brewing Scene</h4>
              <div className="space-y-1 text-sm text-beer-malt">
                <p><span className="font-medium">Breweries:</span> {selectedState.totalBreweries}</p>
                <p><span className="font-medium">Density:</span> {selectedState.breweryDensity} per 100k</p>
                <p><span className="font-medium">Featured Beers:</span> {selectedState.featuredBeers?.length || 0}</p>
              </div>
            </div>
          </div>

          {selectedState.description && (
            <div className="mt-4">
              <h4 className="font-semibold text-beer-cream mb-2">About the Scene</h4>
              <p className="text-sm text-beer-malt">{selectedState.description}</p>
            </div>
          )}

          {/* Featured Beers Preview */}
          {selectedState.featuredBeers && selectedState.featuredBeers.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-beer-cream mb-2">Featured Beers</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {selectedState.featuredBeers.slice(0, 6).map((beer, index) => (
                  <div key={beer.id} className="bg-beer-dark/20 rounded p-2">
                    <p className="font-medium text-beer-foam text-sm">{beer.name}</p>
                    <p className="text-xs text-beer-malt">{beer.brewery}</p>
                    <p className="text-xs text-beer-malt">{beer.style} • {beer.abv}% ABV</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-beer-malt mr-1">Rating:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${
                              i < beer.rating ? 'text-beer-amber' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedState.featuredBeers.length > 6 && (
                <p className="text-xs text-beer-malt mt-2">
                  +{selectedState.featuredBeers.length - 6} more beers...
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            {selectedState.blogPostSlug && (
              <a
                href={`/blog/${selectedState.blogPostSlug}`}
                className="inline-flex items-center gap-2 bg-beer-amber text-beer-dark px-4 py-2 rounded-lg hover:bg-beer-amber-dark transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Read Full Journey
              </a>
            )}
            {selectedState.status === 'completed' && selectedState.featuredBeers && selectedState.featuredBeers.length > 0 && (
              <button className="inline-flex items-center gap-2 border border-beer-malt text-beer-malt px-4 py-2 rounded-lg hover:bg-beer-malt hover:text-beer-dark transition-colors text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                View Beer Reviews
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}