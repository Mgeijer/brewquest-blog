'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { type StateData } from '@/lib/data/stateProgress'

interface StateTooltipProps {
  state: StateData | null
  position: { x: number; y: number } | null
  isVisible: boolean
  containerRef?: React.RefObject<HTMLElement>
  onClose?: () => void
  isMobile?: boolean
}

interface TooltipPosition {
  x: number
  y: number
  placement: 'top' | 'bottom' | 'left' | 'right'
}

export function StateTooltip({ 
  state, 
  position, 
  isVisible, 
  containerRef,
  onClose,
  isMobile = false
}: StateTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [smartPosition, setSmartPosition] = useState<TooltipPosition | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Calculate smart positioning to avoid screen edges
  useEffect(() => {
    if (!position || !isVisible || !tooltipRef.current) {
      setSmartPosition(null)
      return
    }

    const tooltip = tooltipRef.current
    const container = containerRef?.current
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    
    const containerRect = container?.getBoundingClientRect() || {
      left: 0,
      top: 0,
      width: viewport.width,
      height: viewport.height
    }

    // Tooltip dimensions (estimated)
    const tooltipWidth = isMobile ? 280 : 320
    const tooltipHeight = isMobile ? 200 : 160
    const offset = 12

    // Calculate absolute position within viewport
    const absoluteX = containerRect.left + position.x
    const absoluteY = containerRect.top + position.y

    let placement: TooltipPosition['placement'] = 'top'
    let x = absoluteX
    let y = absoluteY - tooltipHeight - offset

    // Check if tooltip goes above viewport
    if (y < 10) {
      placement = 'bottom'
      y = absoluteY + offset
    }

    // Check if tooltip goes beyond right edge
    if (x + tooltipWidth > viewport.width - 10) {
      x = viewport.width - tooltipWidth - 10
    }

    // Check if tooltip goes beyond left edge
    if (x < 10) {
      x = 10
    }

    // For mobile, prefer bottom placement and center horizontally
    if (isMobile) {
      placement = absoluteY < viewport.height / 2 ? 'bottom' : 'top'
      x = Math.max(10, Math.min(viewport.width - tooltipWidth - 10, absoluteX - tooltipWidth / 2))
      y = placement === 'bottom' ? absoluteY + offset : absoluteY - tooltipHeight - offset
    }

    setSmartPosition({ x, y, placement })
  }, [position, isVisible, containerRef, isMobile])

  // Handle animation states
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 200)
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(false)
    }
  }, [isVisible])

  // Handle escape key and outside clicks
  useEffect(() => {
    if (!isVisible) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        onClose?.()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, onClose])

  if (!state || !isVisible || !smartPosition) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-beer-amber'
      case 'current':
        return 'text-beer-cream animate-pulse'
      case 'upcoming':
        return 'text-gray-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )
      case 'current':
        return (
          <svg className="w-4 h-4 text-beer-cream animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'upcoming':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  const formatCompletionDate = (date?: Date) => {
    if (!date) return null
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const getScheduledDate = (weekNumber: number) => {
    // Calculate scheduled date based on week number
    const startDate = new Date('2024-01-01') // Adjust based on actual start date
    const scheduledDate = new Date(startDate)
    scheduledDate.setDate(startDate.getDate() + (weekNumber - 1) * 7)
    return scheduledDate
  }

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className={cn(
        "state-tooltip",
        "bg-beer-dark text-beer-foam rounded-lg shadow-xl border border-beer-malt/20",
        "p-4 max-w-sm pointer-events-auto",
        "transform transition-all duration-200 ease-out",
        isMobile ? "w-70 text-sm" : "w-80",
        isAnimating && "opacity-0 scale-95",
        !isAnimating && isVisible && "opacity-100 scale-100"
      )}
      style={{
        position: 'fixed',
        left: smartPosition.x,
        top: smartPosition.y,
        zIndex: 1000,
        transformOrigin: smartPosition.placement === 'bottom' ? 'top center' : 'bottom center'
      }}
      role="tooltip"
      aria-live="polite"
      aria-label={`Information for ${state.name}`}
    >
      {/* Tooltip Arrow */}
      <div
        className={cn(
          "absolute w-3 h-3 bg-beer-dark border-beer-malt/20",
          "transform rotate-45",
          smartPosition.placement === 'top' && "bottom-[-6px] left-1/2 -translate-x-1/2 border-r border-b",
          smartPosition.placement === 'bottom' && "top-[-6px] left-1/2 -translate-x-1/2 border-l border-t",
          smartPosition.placement === 'left' && "right-[-6px] top-1/2 -translate-y-1/2 border-t border-r",
          smartPosition.placement === 'right' && "left-[-6px] top-1/2 -translate-y-1/2 border-b border-l"
        )}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-beer-cream text-lg leading-tight">
              {state.name}
            </h3>
            {getStatusIcon(state.status)}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-beer-malt">Week {state.weekNumber}</span>
            <span className="text-beer-malt/60">•</span>
            <span className={cn("capitalize font-medium", getStatusColor(state.status))}>
              {state.status}
            </span>
          </div>
        </div>
        
        {/* Close button for mobile */}
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="ml-2 p-1 text-beer-malt hover:text-beer-foam transition-colors"
            aria-label="Close tooltip"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        {/* Breweries Info */}
        <div>
          <div className="text-beer-malt font-medium mb-1">Breweries</div>
          <div className="text-beer-foam">{state.totalBreweries || 0}</div>
          <div className="text-xs text-beer-malt/80">
            {state.breweryDensity} per 100k
          </div>
        </div>

        {/* Featured Beers */}
        <div>
          <div className="text-beer-malt font-medium mb-1">Featured Beers</div>
          <div className="text-beer-foam">{state.featuredBeers?.length || 0}</div>
          <div className="text-xs text-beer-malt/80">
            Daily reviews
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="mb-3 text-sm">
        {state.status === 'completed' && state.completionDate ? (
          <div className="flex items-center gap-2">
            <span className="text-beer-malt">Completed:</span>
            <span className="text-beer-foam font-medium">
              {formatCompletionDate(state.completionDate)}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-beer-malt">Scheduled:</span>
            <span className="text-beer-foam font-medium">
              {formatCompletionDate(getScheduledDate(state.weekNumber))}
            </span>
          </div>
        )}
      </div>

      {/* Featured Beers Preview */}
      {state.featuredBeers && state.featuredBeers.length > 0 && (
        <div className="mb-3">
          <div className="text-beer-malt font-medium mb-2 text-sm">Featured Breweries</div>
          <div className="space-y-1">
            {state.featuredBeers.slice(0, 3).map((beer, index) => (
              <div key={beer.id} className="flex items-center justify-between text-xs">
                <span className="text-beer-foam truncate">{beer.brewery}</span>
                <div className="flex items-center gap-1 ml-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={cn(
                        "w-2.5 h-2.5",
                        i < beer.rating ? "text-beer-amber" : "text-gray-600"
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
            {state.featuredBeers.length > 3 && (
              <div className="text-xs text-beer-malt/80 pt-1">
                +{state.featuredBeers.length - 3} more breweries
              </div>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      {state.description && (
        <div className="mb-3">
          <p className="text-beer-foam text-sm leading-relaxed">
            {state.description}
          </p>
        </div>
      )}

      {/* Call to Action */}
      <div className="pt-2 border-t border-beer-malt/20">
        <div className="flex items-center justify-between">
          <span className="text-beer-malt text-sm">
            {state.status === 'completed' && state.blogPostSlug ? 
              'Click to read journey' : 
              'Click to explore state'
            }
          </span>
          <svg 
            className="w-4 h-4 text-beer-malt" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 8l4 4m0 0l-4 4m4-4H3" 
            />
          </svg>
        </div>
      </div>
    </div>
  )

  // Use portal for better z-index management
  if (typeof window !== 'undefined') {
    return createPortal(tooltipContent, document.body)
  }

  return null
}

// Higher-order component for managing tooltip state
export function useStateTooltip() {
  const [tooltipState, setTooltipState] = useState<{
    state: StateData | null
    position: { x: number; y: number } | null
    isVisible: boolean
  }>({
    state: null,
    position: null,
    isVisible: false
  })

  const showTooltip = (state: StateData, position: { x: number; y: number }) => {
    setTooltipState({
      state,
      position,
      isVisible: true
    })
  }

  const hideTooltip = () => {
    setTooltipState(prev => ({
      ...prev,
      isVisible: false
    }))
    
    // Clear state after animation
    setTimeout(() => {
      setTooltipState({
        state: null,
        position: null,
        isVisible: false
      })
    }, 200)
  }

  const updatePosition = (position: { x: number; y: number }) => {
    setTooltipState(prev => ({
      ...prev,
      position
    }))
  }

  return {
    tooltipState,
    showTooltip,
    hideTooltip,
    updatePosition
  }
}