/**
 * Real-time Map Integration Component
 * 
 * Example integration of real-time progress updates with the existing 
 * interactive map components, demonstrating live state updates and 
 * visual feedback for progress changes.
 * 
 * Features:
 * - Real-time state progress visualization
 * - Live map updates without page refresh
 * - Visual indicators for state changes
 * - Smooth animations for progress updates
 * - Integration with existing map components
 */

'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useStateProgress } from '@/hooks/useStateProgress'
import { ProgressNotification } from './ProgressNotification'
import { StateProgress } from '@/lib/supabase/functions/stateProgressFunctions'

// ==================================================
// Type Definitions
// ==================================================

interface RealtimeMapIntegrationProps {
  // Map configuration
  showProgressNotifications?: boolean
  enableMapAnimations?: boolean
  highlightRecentUpdates?: boolean
  
  // Real-time settings
  enableLiveUpdates?: boolean
  updateAnimationDuration?: number
  
  // Event handlers
  onStateUpdate?: (state: StateProgress) => void
  onProgressChange?: (percentage: number) => void
  
  // Styling
  className?: string
}

interface StateVisualUpdate {
  stateCode: string
  timestamp: Date
  type: 'status_change' | 'progress_update' | 'completion'
  oldValue?: any
  newValue?: any
}

// ==================================================
// Mock Map Component (Replace with actual map)
// ==================================================

const InteractiveMapPreview: React.FC<{
  states: StateProgress[]
  recentUpdates: StateVisualUpdate[]
  onStateClick?: (stateCode: string) => void
}> = ({ states, recentUpdates, onStateClick }) => {
  const getStateColor = useCallback((state: StateProgress) => {
    const isRecentlyUpdated = recentUpdates.some(
      update => update.stateCode === state.state_code &&
      Date.now() - update.timestamp.getTime() < 10000 // 10 seconds
    )

    if (isRecentlyUpdated) {
      return 'bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse'
    }

    switch (state.status) {
      case 'completed':
        return 'bg-green-500'
      case 'current':
        return 'bg-blue-500 animate-pulse'
      case 'upcoming':
        return 'bg-gray-300'
      default:
        return 'bg-gray-200'
    }
  }, [recentUpdates])

  const completedCount = states.filter(s => s.status === 'completed').length
  const currentState = states.find(s => s.status === 'current')
  const progressPercentage = Math.round((completedCount / states.length) * 100)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Live Progress Map</h2>
      
      {/* Progress Overview */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Journey Progress</span>
          <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-gray-600">
          {completedCount} of {states.length} states completed
          {currentState && (
            <span className="ml-2">• Currently in {currentState.state_name}</span>
          )}
        </div>
      </div>

      {/* Simplified Map Grid */}
      <div className="grid grid-cols-10 gap-1 mb-4">
        {states.slice(0, 50).map((state) => (
          <div
            key={state.state_code}
            className={`
              w-8 h-8 rounded cursor-pointer transition-all duration-300 hover:scale-110
              ${getStateColor(state)}
              flex items-center justify-center text-xs font-bold text-white
            `}
            onClick={() => onStateClick?.(state.state_code)}
            title={`${state.state_name} - ${state.status}`}
          >
            {state.state_code}
          </div>
        ))}
      </div>

      {/* Recent Updates Feed */}
      {recentUpdates.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent Updates</h3>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {recentUpdates.slice(-5).reverse().map((update, index) => (
              <div key={index} className="text-xs text-gray-600 flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                <span>
                  {update.stateCode} - {update.type.replace('_', ' ')}
                </span>
                <span className="text-gray-400">
                  {Math.round((Date.now() - update.timestamp.getTime()) / 1000)}s ago
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ==================================================
// State Progress Dashboard
// ==================================================

const ProgressDashboard: React.FC<{
  data: ReturnType<typeof useStateProgress>['data']
  actions: ReturnType<typeof useStateProgress>['actions']
  utils: ReturnType<typeof useStateProgress>['utils']
}> = ({ data, actions, utils }) => {
  const stats = useMemo(() => ({
    completed: utils.getCompletedStates().length,
    current: utils.getCurrentWeekState()?.state_name || 'None',
    percentage: utils.getProgressPercentage(),
    totalStates: data.states.length,
    totalMilestones: data.milestones.length,
    connectionStatus: data.connectionState
  }), [data, utils])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Real-time Dashboard</h2>
      
      {/* Connection Status */}
      <div className="mb-4 p-3 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Connection Status</span>
          <div className={`flex items-center space-x-2 ${
            data.connectionState === 'connected' ? 'text-green-600' :
            data.connectionState === 'connecting' ? 'text-yellow-600' :
            data.connectionState === 'error' ? 'text-red-600' :
            'text-gray-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              data.connectionState === 'connected' ? 'bg-green-500' :
              data.connectionState === 'connecting' ? 'bg-yellow-500 animate-pulse' :
              data.connectionState === 'error' ? 'bg-red-500' :
              'bg-gray-500'
            }`} />
            <span className="text-sm font-medium capitalize">{data.connectionState}</span>
          </div>
        </div>
        {data.connectionState === 'error' && (
          <button
            onClick={actions.reconnect}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Reconnect
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
          <div className="text-xs text-blue-800">Completed</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.percentage}%</div>
          <div className="text-xs text-green-800">Progress</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{data.eventsReceived}</div>
          <div className="text-xs text-purple-800">Live Events</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{stats.totalMilestones}</div>
          <div className="text-xs text-orange-800">Milestones</div>
        </div>
      </div>

      {/* Current State Info */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Current State</h3>
        <div className="text-lg font-bold text-gray-900">{stats.current}</div>
        {data.lastUpdated && (
          <div className="text-xs text-gray-600 mt-1">
            Last updated: {data.lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Error Display */}
      {data.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm font-medium text-red-800">Error</div>
          <div className="text-xs text-red-600 mt-1">{data.error.message}</div>
          <button
            onClick={actions.retry}
            className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}

// ==================================================
// Main Integration Component
// ==================================================

export const RealtimeMapIntegration: React.FC<RealtimeMapIntegrationProps> = ({
  showProgressNotifications = true,
  enableMapAnimations = true,
  highlightRecentUpdates = true,
  enableLiveUpdates = true,
  updateAnimationDuration = 1000,
  onStateUpdate,
  onProgressChange,
  className = ''
}) => {
  const [recentUpdates, setRecentUpdates] = useState<StateVisualUpdate[]>([])
  const [selectedState, setSelectedState] = useState<string | null>(null)

  const { data, actions, utils } = useStateProgress({
    enableRealtime: enableLiveUpdates,
    enableOptimisticUpdates: true,
    enableNotifications: showProgressNotifications,
    enableCaching: true,
    cacheTimeout: 300000, // 5 minutes
    enableRetry: true,
    maxRetries: 3
  })

  // ==================================================
  // Effect Handlers
  // ==================================================

  // Track state updates for visual feedback
  useEffect(() => {
    if (!data.lastUpdated || !highlightRecentUpdates) return

    // Create visual update tracking
    data.states.forEach(state => {
      const update: StateVisualUpdate = {
        stateCode: state.state_code,
        timestamp: new Date(),
        type: 'progress_update',
        newValue: state
      }

      setRecentUpdates(prev => [...prev.slice(-9), update]) // Keep last 10 updates
    })

    // Call external handler
    if (onProgressChange) {
      onProgressChange(utils.getProgressPercentage())
    }

  }, [data.lastUpdated, data.states, highlightRecentUpdates, onProgressChange, utils])

  // Clean up old visual updates
  useEffect(() => {
    const cleanup = setInterval(() => {
      setRecentUpdates(prev => 
        prev.filter(update => Date.now() - update.timestamp.getTime() < 30000) // Keep for 30 seconds
      )
    }, 5000)

    return () => clearInterval(cleanup)
  }, [])

  // Handle individual state updates
  useEffect(() => {
    if (data.states.length > 0 && onStateUpdate) {
      const currentState = utils.getCurrentWeekState()
      if (currentState) {
        onStateUpdate(currentState)
      }
    }
  }, [data.states, onStateUpdate, utils])

  // ==================================================
  // Event Handlers
  // ==================================================

  const handleStateClick = useCallback((stateCode: string) => {
    setSelectedState(stateCode)
    actions.preloadState(stateCode)
  }, [actions])

  const handleRefresh = useCallback(() => {
    actions.refresh()
    setRecentUpdates([])
  }, [actions])

  // ==================================================
  // Render
  // ==================================================

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Loading State */}
      {data.loading && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!data.loading && (
        <>
          {/* Control Panel */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-lg font-semibold text-gray-900">
                Real-time Map Integration Demo
              </h1>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  disabled={data.refreshing}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {data.refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                
                <button
                  onClick={actions.reconnect}
                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Reconnect
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard and Map Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProgressDashboard data={data} actions={actions} utils={utils} />
            <InteractiveMapPreview 
              states={data.states}
              recentUpdates={recentUpdates}
              onStateClick={handleStateClick}
            />
          </div>

          {/* Selected State Details */}
          {selectedState && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                State Details: {selectedState}
              </h3>
              
              {(() => {
                const state = utils.getStateByCode(selectedState)
                if (!state) {
                  return <div className="text-gray-500">State not found</div>
                }
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Status</div>
                      <div className={`font-medium capitalize ${
                        state.status === 'completed' ? 'text-green-600' :
                        state.status === 'current' ? 'text-blue-600' :
                        'text-gray-600'
                      }`}>
                        {state.status}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Week Number</div>
                      <div className="font-medium">{state.week_number}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Featured Breweries</div>
                      <div className="font-medium">{state.featured_breweries.length}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Total Breweries</div>
                      <div className="font-medium">{state.total_breweries}</div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </>
      )}

      {/* Progress Notifications */}
      {showProgressNotifications && (
        <ProgressNotification
          enableToasts={true}
          enableCelebrations={true}
          position="top-right"
          maxNotifications={3}
          theme="auto"
        />
      )}
    </div>
  )
}

export default RealtimeMapIntegration