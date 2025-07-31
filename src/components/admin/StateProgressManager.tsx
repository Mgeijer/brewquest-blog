'use client'

/**
 * State Progress Manager Component
 * 
 * Comprehensive interface for managing state progress, brewery data,
 * and journey analytics. Includes overview, grid view, bulk operations,
 * and real-time updates.
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { StateProgress } from '@/lib/supabase/functions/stateProgressFunctions'
import StateStatusUpdater from './StateStatusUpdater'
import JourneyAnalytics from './JourneyAnalytics'
import { useStateProgress } from '@/hooks/useStateProgress'
import { 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Users, 
  BarChart3,
  RefreshCw,
  Filter,
  Search,
  ChevronDown,
  Settings,
  Edit,
  Eye,
  MoreHorizontal
} from 'lucide-react'

// ==================================================
// Type Definitions
// ==================================================

export interface StateProgressManagerProps {
  initialStates: StateProgress[]
  className?: string
}

interface StateOverviewProps {
  states: StateProgress[]
  onRefresh: () => void
  isRefreshing: boolean
}

interface StateGridProps {
  states: StateProgress[]
  onUpdate: (stateCode: string, updates: Partial<StateProgress>) => Promise<void>
  onSelect: (stateCode: string) => void
  selectedStates: string[]
  searchTerm: string
  filterStatus: string
  sortBy: string
}

interface BulkActionsProps {
  selectedStates: string[]
  onBulkUpdate: (updates: any) => Promise<void>
  onClearSelection: () => void
}

interface BulkStateUpdate {
  statesCodes: string[]
  updates: {
    status?: 'upcoming' | 'current' | 'completed'
    description?: string
    featured_breweries?: string[]
    difficulty_rating?: number
  }
  options?: {
    trigger_realtime?: boolean
    send_notifications?: boolean
  }
}

// ==================================================
// State Overview Component
// ==================================================

function StateOverview({ states, onRefresh, isRefreshing }: StateOverviewProps) {
  const stats = useMemo(() => {
    const completed = states.filter(s => s.status === 'completed').length
    const current = states.filter(s => s.status === 'current').length
    const upcoming = states.filter(s => s.status === 'upcoming').length
    const totalBreweries = states.reduce((sum, s) => sum + s.total_breweries, 0)
    const avgRating = states
      .filter(s => s.difficulty_rating)
      .reduce((sum, s) => sum + (s.difficulty_rating || 0), 0) / states.filter(s => s.difficulty_rating).length

    return {
      completed,
      current,
      upcoming,
      totalBreweries,
      avgRating: avgRating || 0,
      progressPercentage: Math.round((completed / states.length) * 100)
    }
  }, [states])

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Journey Overview</h2>
          <p className="text-gray-600">Track progress across all 50 states</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.completed}</div>
          <div className="text-sm font-medium text-green-800">Completed</div>
          <div className="text-xs text-green-600 mt-1">{stats.progressPercentage}% done</div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{stats.current}</div>
          <div className="text-sm font-medium text-blue-800">Current</div>
          <div className="text-xs text-blue-600 mt-1">Active states</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-gray-600 mb-2">{stats.upcoming}</div>
          <div className="text-sm font-medium text-gray-800">Upcoming</div>
          <div className="text-xs text-gray-600 mt-1">Planned states</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalBreweries}</div>
          <div className="text-sm font-medium text-purple-800">Breweries</div>
          <div className="text-xs text-purple-600 mt-1">Total discovered</div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.avgRating.toFixed(1)}</div>
          <div className="text-sm font-medium text-yellow-800">Avg Rating</div>
          <div className="text-xs text-yellow-600 mt-1">Difficulty score</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>{stats.progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${stats.progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ==================================================
// State Grid Component
// ==================================================

function StateGrid({ 
  states, 
  onUpdate, 
  onSelect, 
  selectedStates, 
  searchTerm, 
  filterStatus, 
  sortBy 
}: StateGridProps) {
  const filteredAndSortedStates = useMemo(() => {
    let filtered = states

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(state => 
        state.state_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.state_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (filterStatus && filterStatus !== 'all') {
      filtered = filtered.filter(state => state.status === filterStatus)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.state_name.localeCompare(b.state_name)
        case 'week':
          return a.week_number - b.week_number
        case 'status':
          return a.status.localeCompare(b.status)
        case 'breweries':
          return b.total_breweries - a.total_breweries
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        default:
          return a.week_number - b.week_number
      }
    })

    return filtered
  }, [states, searchTerm, filterStatus, sortBy])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'current':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'upcoming':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleQuickUpdate = async (stateCode: string, newStatus: 'upcoming' | 'current' | 'completed') => {
    try {
      await onUpdate(stateCode, { status: newStatus })
    } catch (error) {
      console.error('Failed to update state:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">State Progress Grid</h3>
        
        {selectedStates.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {selectedStates.length} state{selectedStates.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => onSelect('')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear selection
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
        {filteredAndSortedStates.map((state) => (
          <div
            key={state.state_code}
            className={`border rounded-lg p-4 transition-all hover:shadow-md cursor-pointer ${
              selectedStates.includes(state.state_code) 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelect(state.state_code)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-gray-900">{state.state_code}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(state.status)}`}>
                  {state.status}
                </span>
              </div>
              
              <div className="relative">
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">{state.state_name}</h4>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Week {state.week_number}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{state.total_breweries} breweries</span>
              </div>
              
              {state.difficulty_rating && (
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Difficulty: {state.difficulty_rating}/5</span>
                </div>
              )}
            </div>

            {state.description && (
              <p className="text-xs text-gray-500 mt-3 line-clamp-2">
                {state.description}
              </p>
            )}

            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <div className="flex space-x-1">
                {state.status !== 'upcoming' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleQuickUpdate(state.state_code, 'upcoming')
                    }}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    Reset
                  </button>
                )}
                
                {state.status !== 'current' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleQuickUpdate(state.state_code, 'current')
                    }}
                    className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                  >
                    Current
                  </button>
                )}
                
                {state.status !== 'completed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleQuickUpdate(state.state_code, 'completed')
                    }}
                    className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                  >
                    Complete
                  </button>
                )}
              </div>
              
              <div className="flex space-x-1">
                <button className="text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedStates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500">No states found matching your criteria</p>
        </div>
      )}
    </div>
  )
}

// ==================================================
// Bulk Actions Component
// ==================================================

function BulkActions({ selectedStates, onBulkUpdate, onClearSelection }: BulkActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [bulkStatus, setBulkStatus] = useState<'upcoming' | 'current' | 'completed'>('upcoming')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleBulkStatusUpdate = async () => {
    if (selectedStates.length === 0) return

    setIsUpdating(true)
    try {
      await onBulkUpdate({
        statesCodes: selectedStates,
        updates: { status: bulkStatus },
        options: { trigger_realtime: true, send_notifications: true }
      })
      onClearSelection()
      setIsOpen(false)
    } catch (error) {
      console.error('Bulk update failed:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (selectedStates.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Bulk Actions ({selectedStates.length} selected)
          </h3>
          <p className="text-sm text-gray-600">Apply changes to multiple states at once</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="upcoming">Set to Upcoming</option>
            <option value="current">Set to Current</option>
            <option value="completed">Set to Completed</option>
          </select>

          <button
            onClick={handleBulkStatusUpdate}
            disabled={isUpdating}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Apply Changes'}
          </button>

          <button
            onClick={onClearSelection}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================================================
// Main State Progress Manager
// ==================================================

export default function StateProgressManager({ 
  initialStates, 
  className = '' 
}: StateProgressManagerProps) {
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('week')

  // Use the real-time hook for live updates
  const { data, actions, utils } = useStateProgress({
    enableRealtime: true,
    enableOptimisticUpdates: true,
    enableCaching: true
  })

  // Use hook data if available, otherwise fall back to initial states
  const currentStates = data.states.length > 0 ? data.states : initialStates

  // Handle state selection
  const handleStateSelect = useCallback((stateCode: string) => {
    if (stateCode === '') {
      setSelectedStates([])
      return
    }

    setSelectedStates(prev => 
      prev.includes(stateCode)
        ? prev.filter(code => code !== stateCode)
        : [...prev, stateCode]
    )
  }, [])

  // Handle individual state updates
  const handleStateUpdate = useCallback(async (stateCode: string, updates: Partial<StateProgress>) => {
    try {
      await actions.updateState(stateCode, updates)
    } catch (error) {
      console.error('Failed to update state:', error)
      throw error
    }
  }, [actions])

  // Handle bulk updates
  const handleBulkUpdate = useCallback(async (bulkUpdate: BulkStateUpdate) => {
    try {
      // Since bulkUpdateStates doesn't exist, we'll update each state individually
      const promises = bulkUpdate.statesCodes.map(stateCode => 
        actions.updateState(stateCode, bulkUpdate.updates)
      )
      await Promise.all(promises)
    } catch (error) {
      console.error('Failed to bulk update states:', error)
      throw error
    }
  }, [actions])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Real-time Status Indicator */}
      {data.connectionState !== 'disconnected' && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                data.connectionState === 'connected' ? 'bg-green-500 animate-pulse' :
                data.connectionState === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                'bg-red-500'
              }`} />
              <span className="text-sm font-medium text-gray-700">
                Real-time: {data.connectionState}
              </span>
              {data.lastUpdated && (
                <span className="text-xs text-gray-500">
                  Last update: {data.lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
            
            {data.eventsReceived > 0 && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {data.eventsReceived} events received
              </span>
            )}
          </div>
        </div>
      )}

      {/* State Overview */}
      <StateOverview 
        states={currentStates}
        onRefresh={actions.refresh}
        isRefreshing={data.refreshing}
      />

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="current">Current</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Sort by Week</option>
              <option value="name">Sort by Name</option>
              <option value="status">Sort by Status</option>
              <option value="breweries">Sort by Breweries</option>
              <option value="updated">Sort by Updated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActions 
        selectedStates={selectedStates}
        onBulkUpdate={handleBulkUpdate}
        onClearSelection={() => setSelectedStates([])}
      />

      {/* State Grid */}
      <StateGrid
        states={currentStates}
        onUpdate={handleStateUpdate}
        onSelect={handleStateSelect}
        selectedStates={selectedStates}
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        sortBy={sortBy}
      />

      {/* Journey Analytics */}
      <JourneyAnalytics states={currentStates} />

      {/* State Status Updater */}
      <StateStatusUpdater 
        selectedStates={selectedStates}
        onUpdate={handleStateUpdate}
        onBulkUpdate={handleBulkUpdate}
      />
    </div>
  )
}