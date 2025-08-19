'use client'

import React, { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { getCurrentState } from '@/lib/data/stateProgress'

interface StateData {
  code: string
  name: string
  weekNumber: number
  status: string
}

export default function DynamicCurrentState() {
  const [currentState, setCurrentState] = useState<StateData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCurrentState = () => {
      try {
        // Use local data as primary source for consistency
        const localState = getCurrentState()
        if (localState) {
          setCurrentState({
            code: localState.code,
            name: localState.name,
            weekNumber: localState.weekNumber,
            status: localState.status
          })
        }
      } catch (error) {
        console.error('Error loading current state:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCurrentState()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg border border-beer-amber/20 mb-12 max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
          <div className="h-6 bg-gray-300 rounded w-24 mb-2 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!currentState) {
    // Fallback content
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg border border-beer-amber/20 mb-12 max-w-md mx-auto">
        <div className="flex items-center justify-center gap-3 mb-3">
          <MapPin className="w-5 h-5 text-beer-amber" />
          <span className="font-semibold text-beer-dark">Currently Exploring</span>
        </div>
        <div className="text-2xl font-bold text-beer-amber mb-2">Loading...</div>
        <div className="text-sm text-gray-600">Journey in Progress</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-beer-amber/20 mb-12 max-w-md mx-auto">
      <div className="flex items-center justify-center gap-3 mb-3">
        <MapPin className="w-5 h-5 text-beer-amber" />
        <span className="font-semibold text-beer-dark">Currently Exploring</span>
      </div>
      <div className="text-2xl font-bold text-beer-amber mb-2">{currentState.name}</div>
      <div className="text-sm text-gray-600">State {currentState.weekNumber} of 50 • Week {currentState.weekNumber}</div>
    </div>
  )
}