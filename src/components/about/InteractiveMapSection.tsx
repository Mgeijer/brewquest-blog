'use client'

import React, { Suspense, useState, useEffect } from 'react'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import dynamic from 'next/dynamic'
import { Loader2, AlertTriangle, RotateCcw, Map as MapIcon } from 'lucide-react'
import { useSimpleMapAnalytics } from '@/lib/analytics/simpleMapAnalytics'
import { type StateData } from '@/lib/data/stateProgress'

// Dynamic import of the USMap component directly
const USMap = dynamic(() => import('@/components/interactive/USMap'), {
  ssr: false,
  loading: () => {
    console.log('Dynamic import loading state')
    return <MapLoadingState />
  }
})

interface InteractiveMapSectionProps {
  stateData?: StateData[]
  className?: string
}

function MapLoadingState() {
  return (
    <div className="w-full h-96 bg-beer-cream/30 rounded-2xl border border-beer-malt/20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-beer-malt">
        <Loader2 className="w-8 h-8 animate-spin" />
        <div className="text-center">
          <p className="font-medium">Loading Interactive Map...</p>
          <p className="text-sm opacity-70">Preparing your beer journey visualization</p>
        </div>
      </div>
    </div>
  )
}

function MapErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="w-full h-96 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-center">
      <div className="text-center p-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Map Loading Error</h3>
        <p className="text-red-600 mb-4 max-w-md">
          We're having trouble loading the interactive map. This might be due to a network issue or browser compatibility.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetError}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <MapIcon className="w-4 h-4" />
            Reload Page
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="text-sm text-red-700 cursor-pointer">Error Details (Dev)</summary>
            <pre className="text-xs text-red-600 mt-2 p-2 bg-red-100 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

export default function InteractiveMapSection({ stateData, className }: InteractiveMapSectionProps) {
  const [selectedState, setSelectedState] = useState<StateData | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  
  // Analytics tracking
  const { trackStateClick } = useSimpleMapAnalytics()

  // Debug logging
  React.useEffect(() => {
    console.log('InteractiveMapSection rendered with stateData:', stateData?.length || 0, 'states')
  }, [stateData])

  // Fallback timer to ensure loading overlay doesn't get stuck
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!isMapLoaded) {
        console.log('Fallback timer triggered - forcing map load complete')
        setIsMapLoaded(true)
      }
    }, 5000) // 5 second fallback

    return () => clearTimeout(fallbackTimer)
  }, [])

  // Track section view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Track map section view
              if (typeof window !== 'undefined' && 'gtag' in window) {
                (window as any).gtag('event', 'about_map_section_view', {
                  event_category: 'engagement',
                  event_label: 'interactive_map_section'
                })
              }
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.5 }
      )

      const section = document.getElementById('interactive-map-section')
      if (section) {
        observer.observe(section)
      }

      return () => observer.disconnect()
    }
  }, [])

  const handleStateSelect = (state: StateData) => {
    setSelectedState(state)
    
    // Track state selection in about page context
    trackStateClick(state.code, {
      source: 'about_page',
      section: 'interactive_map',
      stateName: state.name,
      status: state.status
    })

    // Google Analytics tracking
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'about_state_select', {
        event_category: 'interaction',
        event_label: state.code,
        custom_parameter_1: state.name,
        custom_parameter_2: state.status
      })
    }
  }

  const handleMapLoad = () => {
    console.log('handleMapLoad called - setting isMapLoaded to true')
    setIsMapLoaded(true)
    
    // Track successful map load
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'about_map_loaded', {
        event_category: 'performance',
        event_label: 'interactive_map'
      })
    }
  }

  return (
    <section 
      id="interactive-map-section" 
      className={`py-20 bg-beer-cream ${className}`}
      aria-labelledby="map-section-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 id="map-section-title" className="text-4xl font-bold text-beer-dark mb-6">
            Track the Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our progress across America's craft beer landscape. Click on any state to see our discoveries, featured beers, and brewery stories.
          </p>
          
          {/* Progress indicators */}
          <div className="mt-8 flex justify-center">
            <div className="bg-beer-cream/50 rounded-lg p-4 flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-beer-dark">Live</div>
                <div className="text-sm text-gray-600">Updated</div>
              </div>
              <div className="w-px h-8 bg-gray-300" />
              <div className="text-center">
                <div className="text-2xl font-bold text-beer-dark">Interactive</div>
                <div className="text-sm text-gray-600">Experience</div>
              </div>
              <div className="w-px h-8 bg-gray-300" />
              <div className="text-center">
                <div className="text-2xl font-bold text-beer-dark">Real-time</div>
                <div className="text-sm text-gray-600">Analytics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map Container */}
        <div className="relative">
          <ErrorBoundary
            fallback={MapErrorFallback}
            onError={(error, errorInfo) => {
              // Log error for monitoring
              console.error('Map Error Boundary:', error, errorInfo)
              
              // Track error in analytics
              if (typeof window !== 'undefined' && 'gtag' in window) {
                (window as any).gtag('event', 'about_map_error', {
                  event_category: 'error',
                  event_label: error.message,
                  custom_parameter_1: errorInfo.componentStack
                })
              }
            }}
            onReset={() => {
              // Reset state on error boundary reset
              setSelectedState(null)
              setIsMapLoaded(false)
            }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <Suspense fallback={<MapLoadingState />}>
                <USMap 
                  className="w-full max-w-5xl mx-auto"
                  showLegend={true}
                  showProgress={true}
                  enableNavigation={true}
                  enableAnalytics={true}
                  onStateSelect={handleStateSelect}
                  onMapLoad={handleMapLoad}
                />
              </Suspense>
            </div>
          </ErrorBoundary>

          {/* Loading overlay - only show initially */}
          {!isMapLoaded && (
            <div className="absolute inset-0 bg-beer-cream/80 rounded-2xl flex items-center justify-center z-10">
              <div className="bg-white shadow-lg rounded-lg p-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-beer-amber" />
                <span className="text-beer-dark text-sm">Loading interactive map...</span>
              </div>
            </div>
          )}
        </div>

        {/* Map Legend and Instructions */}
        <div className="mt-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Legend */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-beer-dark mb-4">Map Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-beer-amber rounded"></div>
                  <div>
                    <div className="font-medium text-beer-dark">Completed States</div>
                    <div className="text-sm text-gray-600">Full brewery exploration with featured beers</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-beer-cream rounded animate-pulse"></div>
                  <div>
                    <div className="font-medium text-beer-dark">Current Week</div>
                    <div className="text-sm text-gray-600">Research and discovery in progress</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div>
                    <div className="font-medium text-beer-dark">Upcoming States</div>
                    <div className="text-sm text-gray-600">Future exploration destinations</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-beer-cream/50 rounded-lg p-6 border border-beer-malt/20">
              <h3 className="text-lg font-semibold text-beer-dark mb-4">How to Explore</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-beer-amber rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <strong>Click any state</strong> to see detailed information about breweries, featured beers, and our journey progress.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-beer-amber rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <strong>Hover for quick info</strong> on desktop, or tap for details on mobile devices.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-beer-amber rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <strong>View full stories</strong> by clicking through to completed state blog posts.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-beer-amber/10 to-beer-gold/10 rounded-2xl p-8 border border-beer-amber/20">
            <h3 className="text-2xl font-bold text-beer-dark mb-4">
              Follow the Journey in Real-Time
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Each state represents a week of intensive research, discovery, and storytelling about local brewing culture. 
              Watch as we progress through all 50 states, one week at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/blog"
                className="bg-beer-amber text-white px-6 py-3 rounded-lg hover:bg-beer-amber-dark transition-colors font-semibold"
              >
                Read Latest Stories
              </a>
              <a
                href="/analytics"
                className="border border-beer-amber text-beer-amber px-6 py-3 rounded-lg hover:bg-beer-amber hover:text-white transition-colors font-semibold"
              >
                View Journey Analytics
              </a>
            </div>
          </div>
        </div>

        {/* Selected State Preview */}
        {selectedState && (
          <div className="mt-8 bg-beer-dark/5 rounded-lg p-6 border border-beer-malt/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-beer-dark">{selectedState.name}</h4>
                <p className="text-gray-600">Week {selectedState.weekNumber} • {selectedState.region}</p>
              </div>
              <button
                onClick={() => setSelectedState(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Close state details"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-beer-dark">Status</div>
                <div className={`capitalize ${
                  selectedState.status === 'completed' ? 'text-green-600' :
                  selectedState.status === 'current' ? 'text-beer-amber' :
                  'text-gray-500'
                }`}>
                  {selectedState.status}
                </div>
              </div>
              <div>
                <div className="font-medium text-beer-dark">Breweries</div>
                <div className="text-gray-700">{selectedState.totalBreweries || 0}</div>
              </div>
              <div>
                <div className="font-medium text-beer-dark">Featured Beers</div>
                <div className="text-gray-700">{selectedState.featuredBeers?.length || 0}</div>
              </div>
            </div>
            
            {selectedState.description && (
              <p className="mt-4 text-gray-700">{selectedState.description}</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}