'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useMobileDetection } from '@/lib/hooks/useMobileGestures'
import { type StateData } from '@/lib/data/stateProgress'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

// Dynamic imports for better performance
const USMap = dynamic(() => import('./USMap'), {
  loading: () => <MapLoadingState />,
  ssr: false
})

const MobileMapView = dynamic(() => import('./MobileMapView').then(mod => ({ default: mod.MobileMapView })), {
  loading: () => <MapLoadingState />,
  ssr: false
})

interface ResponsiveMapContainerProps {
  className?: string
  showLegend?: boolean
  showProgress?: boolean
  onStateSelect?: (state: StateData) => void
  enableNavigation?: boolean
  enableAnalytics?: boolean
  enableTooltips?: boolean
  loadingStates?: string[]
  errorStates?: string[]
  forceView?: 'desktop' | 'mobile' | 'auto'
}

function MapLoadingState() {
  return (
    <div className="w-full h-96 bg-beer-cream/30 rounded-2xl border border-beer-malt/20 flex items-center justify-center">
      <div className="flex items-center gap-3 text-beer-malt">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Loading interactive map...</span>
      </div>
    </div>
  )
}

export default function ResponsiveMapContainer({
  className,
  showLegend = true,
  showProgress = true,
  onStateSelect,
  enableNavigation = true,
  enableAnalytics = true,
  enableTooltips = true,
  loadingStates = [],
  errorStates = [],
  forceView = 'auto'
}: ResponsiveMapContainerProps) {
  const deviceInfo = useMobileDetection()
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Determine which view to show based on device and force settings
  useEffect(() => {
    let newViewMode: 'desktop' | 'mobile' = 'desktop'

    if (forceView !== 'auto') {
      newViewMode = forceView
    } else {
      // Auto-detect based on device capabilities
      if (deviceInfo.screenSize === 'mobile') {
        newViewMode = 'mobile'
      } else if (deviceInfo.screenSize === 'tablet') {
        // For tablets, prefer mobile view if portrait, desktop if landscape
        newViewMode = deviceInfo.orientation === 'portrait' ? 'mobile' : 'desktop'
      } else {
        newViewMode = 'desktop'
      }
    }

    if (newViewMode !== viewMode) {
      setIsTransitioning(true)
      setTimeout(() => {
        setViewMode(newViewMode)
        setIsTransitioning(false)
      }, 150) // Short transition
    }
  }, [deviceInfo, forceView, viewMode])

  // Performance optimization: Only render one view at a time
  const renderContent = () => {
    if (isTransitioning) {
      return <MapLoadingState />
    }

    if (viewMode === 'mobile') {
      return (
        <MobileMapView
          className={className}
          onStateSelect={onStateSelect}
          enableNavigation={enableNavigation}
          enableAnalytics={enableAnalytics}
        />
      )
    }

    return (
      <div className={cn("w-full", className)}>
        <USMap
          className="w-full"
          showLegend={showLegend}
          showProgress={showProgress}
          onStateSelect={onStateSelect}
          enableNavigation={enableNavigation}
          enableAnalytics={enableAnalytics}
          enableTooltips={enableTooltips}
          loadingStates={loadingStates}
          errorStates={errorStates}
        />
      </div>
    )
  }

  return (
    <div className={cn("w-full transition-all duration-300", className)}>
      {/* View mode indicator for debugging/testing (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-2 text-xs text-gray-500 text-center">
          {viewMode} view • {deviceInfo.screenSize} • {deviceInfo.orientation}
        </div>
      )}
      
      {renderContent()}
    </div>
  )
}

// Custom hook for responsive map behavior
export function useResponsiveMap() {
  const deviceInfo = useMobileDetection()
  const [preferredView, setPreferredView] = useState<'desktop' | 'mobile' | 'auto'>('auto')

  const shouldUseMobileView = (forceView?: 'desktop' | 'mobile' | 'auto') => {
    const view = forceView || preferredView
    
    if (view === 'mobile') return true
    if (view === 'desktop') return false
    
    // Auto-detect
    return deviceInfo.screenSize === 'mobile' || 
           (deviceInfo.screenSize === 'tablet' && deviceInfo.orientation === 'portrait')
  }

  const getOptimalMapSize = () => {
    if (deviceInfo.screenSize === 'mobile') {
      return { width: '100%', height: 'auto', maxWidth: '640px' }
    } else if (deviceInfo.screenSize === 'tablet') {
      return { width: '100%', height: 'auto', maxWidth: '768px' }
    }
    return { width: '100%', height: 'auto', maxWidth: '1024px' }
  }

  return {
    deviceInfo,
    preferredView,
    setPreferredView,
    shouldUseMobileView,
    getOptimalMapSize
  }
}