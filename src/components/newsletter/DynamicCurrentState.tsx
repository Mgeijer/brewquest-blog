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
    const fetchCurrentState = async () => {
      try {
        // First try to get from API
        const response = await fetch('/api/states/progress')
        if (response.ok) {
          const data = await response.json()
          const current = data.states?.find((state: any) => state.status === 'current')
          
          if (current) {
            setCurrentState({
              code: current.state_code,
              name: current.state_name,
              weekNumber: current.week_number,
              status: current.status
            })
          } else {
            // Fallback to local data
            const localState = getCurrentState()
            if (localState) {
              setCurrentState({
                code: localState.code,
                name: localState.name,
                weekNumber: localState.weekNumber,
                status: localState.status
              })
            }
          }
        } else {
          // API failed, use local data
          const localState = getCurrentState()
          if (localState) {
            setCurrentState({
              code: localState.code,
              name: localState.name,
              weekNumber: localState.weekNumber,
              status: localState.status
            })
          }
        }
      } catch (error) {
        console.error('Error fetching current state:', error)
        // Fallback to local data
        const localState = getCurrentState()
        if (localState) {
          setCurrentState({
            code: localState.code,
            name: localState.name,
            weekNumber: localState.weekNumber,
            status: localState.status
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentState()
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