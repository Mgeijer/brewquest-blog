'use client'

import { Metadata } from 'next'
import { MobileMapView } from '@/components/interactive/MobileMapView'
import { useState } from 'react'
import { type StateData } from '@/lib/data/stateProgress'

export default function MobileMapPage() {
  const [selectedState, setSelectedState] = useState<StateData | null>(null)

  const handleStateSelect = (state: StateData) => {
    setSelectedState(state)
    console.log('Selected state:', state.name)
  }

  return (
    <div className="min-h-screen bg-beer-cream">
      {/* Mobile-optimized header */}
      <div className="bg-gradient-to-r from-beer-amber to-beer-gold text-white p-4">
        <h1 className="text-xl font-bold">Beer Journey Map</h1>
        <p className="text-sm opacity-90">Mobile Experience</p>
      </div>

      {/* Mobile map view */}
      <MobileMapView
        onStateSelect={handleStateSelect}
        enableNavigation={true}
        enableAnalytics={true}
      />

      {/* Selected state details (mobile-optimized) */}
      {selectedState && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-beer-dark">{selectedState.name}</h3>
              <p className="text-sm text-gray-600">Week {selectedState.weekNumber}</p>
            </div>
            <button
              onClick={() => setSelectedState(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}