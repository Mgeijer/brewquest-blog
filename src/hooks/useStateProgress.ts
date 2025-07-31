/**
 * useStateProgress React Hook
 * 
 * Comprehensive React hook for state progress management with real-time updates,
 * optimistic UI updates, error handling, and performance optimization.
 * 
 * Features:
 * - Real-time state progress tracking
 * - Optimistic UI updates with rollback
 * - Comprehensive error handling and retry logic
 * - Performance optimization with caching and debouncing
 * - Milestone notifications and celebrations
 * - Integration with existing API routes
 * - Memory leak prevention and cleanup
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { 
  StateProgress, 
  JourneyMilestone,
  getAllStateProgress,
  getStateProgress,
  updateStateProgress,
  completeState,
  getProgressStatistics
} from '@/lib/supabase/functions/stateProgressFunctions'
import { 
  getSubscriptionManager,
  StateProgressUpdate,
  MilestoneUpdate,
  ConnectionState,
  RealtimeConfig
} from '@/lib/realtime/stateProgressSubscription'

// ==================================================
// Type Definitions
// ==================================================

export interface UseStateProgressOptions {
  // Real-time configuration
  enableRealtime: boolean
  realtimeConfig?: Partial<RealtimeConfig>
  
  // Filtering and selection
  stateCode?: string
  region?: string
  status?: 'upcoming' | 'current' | 'completed'
  
  // Performance optimization
  enableOptimisticUpdates: boolean
  enableCaching: boolean
  cacheTimeout: number
  refetchInterval?: number
  
  // Error handling
  enableRetry: boolean
  maxRetries: number
  retryDelay: number
  
  // Notifications
  enableNotifications: boolean
  notificationFilters?: {
    states?: string[]
    milestoneTypes?: string[]
    celebrationLevels?: ('minor' | 'major' | 'epic')[]
  }
}

export interface StateProgressState {
  // Data
  states: StateProgress[]
  currentState?: StateProgress
  statistics?: any
  milestones: JourneyMilestone[]
  
  // Loading states
  loading: boolean
  refreshing: boolean
  optimisticUpdating: boolean
  
  // Error states
  error: Error | null
  connectionError: Error | null
  retryCount: number
  
  // Real-time state
  connectionState: ConnectionState
  lastUpdated: Date | null
  eventsReceived: number
  
  // Cache state
  cacheHit: boolean
  cacheExpiry: Date | null
}

export interface StateProgressActions {
  // Data fetching
  refresh: () => Promise<void>
  refetchState: (stateCode: string) => Promise<void>
  
  // State updates
  updateState: (stateCode: string, updates: Partial<StateProgress>) => Promise<void>
  completeStateProgress: (stateCode: string, completionData?: any) => Promise<void>
  
  // Real-time management
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  reconnect: () => Promise<void>
  
  // Error handling
  retry: () => Promise<void>
  clearError: () => void
  
  // Cache management
  invalidateCache: () => void
  preloadState: (stateCode: string) => Promise<void>
}

export interface UseStateProgressReturn {
  data: StateProgressState
  actions: StateProgressActions
  utils: {
    getStateByCode: (code: string) => StateProgress | undefined
    getStatesByRegion: (region: string) => StateProgress[]
    getCompletedStates: () => StateProgress[]
    getCurrentWeekState: () => StateProgress | undefined
    getProgressPercentage: () => number
    isStateCompleted: (code: string) => boolean
    getNextState: () => StateProgress | undefined
  }
}

// Default options
const DEFAULT_OPTIONS: UseStateProgressOptions = {
  enableRealtime: true,
  enableOptimisticUpdates: true,
  enableCaching: true,
  cacheTimeout: 300000, // 5 minutes
  enableRetry: true,
  maxRetries: 3,
  retryDelay: 1000,
  enableNotifications: true
}

// ==================================================
// Main Hook Implementation
// ==================================================

export function useStateProgress(options: Partial<UseStateProgressOptions> = {}): UseStateProgressReturn {
  const opts = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options])
  
  // State management
  const [state, setState] = useState<StateProgressState>({
    states: [],
    milestones: [],
    loading: true,
    refreshing: false,
    optimisticUpdating: false,
    error: null,
    connectionError: null,
    retryCount: 0,
    connectionState: 'disconnected',
    lastUpdated: null,
    eventsReceived: 0,
    cacheHit: false,
    cacheExpiry: null
  })

  // Refs for stable references
  const subscriptionManagerRef = useRef(getSubscriptionManager(opts.realtimeConfig))
  const cacheRef = useRef(new Map<string, { data: any; expiry: number }>())
  const optimisticUpdatesRef = useRef(new Map<string, { original: StateProgress; update: Partial<StateProgress> }>())
  const retryTimeoutRef = useRef<NodeJS.Timeout>()
  const isMountedRef = useRef(true)

  // ==================================================
  // Cache Management
  // ==================================================

  const getCacheKey = useCallback((key: string, params?: any): string => {
    return params ? `${key}_${JSON.stringify(params)}` : key
  }, [])

  const getCachedData = useCallback((key: string): any | null => {
    if (!opts.enableCaching) return null
    
    const cached = cacheRef.current.get(key)
    if (!cached) return null
    
    if (Date.now() > cached.expiry) {
      cacheRef.current.delete(key)
      return null
    }
    
    return cached.data
  }, [opts.enableCaching])

  const setCachedData = useCallback((key: string, data: any): void => {
    if (!opts.enableCaching) return
    
    cacheRef.current.set(key, {
      data,
      expiry: Date.now() + opts.cacheTimeout
    })
  }, [opts.enableCaching, opts.cacheTimeout])

  const invalidateCache = useCallback((): void => {
    cacheRef.current.clear()
    setState(prev => ({ ...prev, cacheHit: false, cacheExpiry: null }))
  }, [])

  // ==================================================
  // Data Fetching
  // ==================================================

  const fetchAllStates = useCallback(async (force = false): Promise<StateProgress[]> => {
    const cacheKey = getCacheKey('all_states', { region: opts.region, status: opts.status })
    
    if (!force) {
      const cached = getCachedData(cacheKey)
      if (cached) {
        setState(prev => ({ ...prev, cacheHit: true, cacheExpiry: new Date(Date.now() + opts.cacheTimeout) }))
        return cached
      }
    }

    const filters: any = {}
    if (opts.region) filters.region = opts.region
    if (opts.status) filters.status = opts.status

    const { data, error } = await getAllStateProgress(filters)
    
    if (error) throw error
    if (!data) throw new Error('No data received')

    setCachedData(cacheKey, data)
    return data
  }, [opts.region, opts.status, getCacheKey, getCachedData, setCachedData, opts.cacheTimeout])

  const fetchSingleState = useCallback(async (stateCode: string, force = false): Promise<StateProgress> => {
    const cacheKey = getCacheKey('single_state', stateCode)
    
    if (!force) {
      const cached = getCachedData(cacheKey)
      if (cached) return cached
    }

    const { data, error } = await getStateProgress(stateCode)
    
    if (error) throw error
    if (!data) throw new Error(`No data received for state ${stateCode}`)

    setCachedData(cacheKey, data)
    return data
  }, [getCacheKey, getCachedData, setCachedData])

  const fetchStatistics = useCallback(async (force = false): Promise<any> => {
    const cacheKey = getCacheKey('statistics')
    
    if (!force) {
      const cached = getCachedData(cacheKey)
      if (cached) return cached
    }

    const { data, error } = await getProgressStatistics()
    
    if (error) throw error
    return data
  }, [getCacheKey, getCachedData])

  // ==================================================
  // State Updates
  // ==================================================

  const performOptimisticUpdate = useCallback((stateCode: string, updates: Partial<StateProgress>): void => {
    if (!opts.enableOptimisticUpdates) return

    setState(prev => {
      const states = [...prev.states]
      const stateIndex = states.findIndex(s => s.state_code === stateCode)
      
      if (stateIndex === -1) return prev

      const originalState = states[stateIndex]
      const updatedState = { ...originalState, ...updates }
      
      // Store original for rollback
      optimisticUpdatesRef.current.set(stateCode, { original: originalState, update: updates })
      
      states[stateIndex] = updatedState
      
      return {
        ...prev,
        states,
        optimisticUpdating: true,
        currentState: prev.currentState?.state_code === stateCode ? updatedState : prev.currentState
      }
    })
  }, [opts.enableOptimisticUpdates])

  const rollbackOptimisticUpdate = useCallback((stateCode: string): void => {
    const optimisticUpdate = optimisticUpdatesRef.current.get(stateCode)
    if (!optimisticUpdate) return

    setState(prev => {
      const states = [...prev.states]
      const stateIndex = states.findIndex(s => s.state_code === stateCode)
      
      if (stateIndex === -1) return prev

      states[stateIndex] = optimisticUpdate.original
      
      return {
        ...prev,
        states,
        optimisticUpdating: false,
        currentState: prev.currentState?.state_code === stateCode ? optimisticUpdate.original : prev.currentState
      }
    })

    optimisticUpdatesRef.current.delete(stateCode)
  }, [])

  const commitOptimisticUpdate = useCallback((stateCode: string): void => {
    optimisticUpdatesRef.current.delete(stateCode)
    setState(prev => ({ ...prev, optimisticUpdating: false }))
  }, [])

  // ==================================================
  // Actions Implementation
  // ==================================================

  const refresh = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) return

    setState(prev => ({ ...prev, refreshing: true, error: null }))

    try {
      const [states, statistics] = await Promise.all([
        fetchAllStates(true),
        fetchStatistics(true)
      ])

      if (!isMountedRef.current) return

      setState(prev => ({
        ...prev,
        states,
        statistics,
        refreshing: false,
        loading: false,
        lastUpdated: new Date(),
        retryCount: 0,
        currentState: opts.stateCode ? states.find(s => s.state_code === opts.stateCode) : prev.currentState
      }))

    } catch (error) {
      if (!isMountedRef.current) return

      setState(prev => ({
        ...prev,
        error: error as Error,
        refreshing: false,
        loading: false
      }))
    }
  }, [fetchAllStates, fetchStatistics, opts.stateCode])

  const refetchState = useCallback(async (stateCode: string): Promise<void> => {
    try {
      const stateData = await fetchSingleState(stateCode, true)
      
      if (!isMountedRef.current) return

      setState(prev => {
        const states = [...prev.states]
        const stateIndex = states.findIndex(s => s.state_code === stateCode)
        
        if (stateIndex === -1) {
          states.push(stateData)
        } else {
          states[stateIndex] = stateData
        }
        
        return {
          ...prev,
          states,
          currentState: prev.currentState?.state_code === stateCode ? stateData : prev.currentState
        }
      })

    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }))
    }
  }, [fetchSingleState])

  const updateState = useCallback(async (stateCode: string, updates: Partial<StateProgress>): Promise<void> => {
    // Apply optimistic update
    performOptimisticUpdate(stateCode, updates)

    try {
      const { error } = await updateStateProgress(stateCode, updates)
      
      if (error) {
        rollbackOptimisticUpdate(stateCode)
        throw error
      }

      // Commit optimistic update and refresh from server
      commitOptimisticUpdate(stateCode)
      await refetchState(stateCode)

    } catch (error) {
      rollbackOptimisticUpdate(stateCode)
      setState(prev => ({ ...prev, error: error as Error }))
      throw error
    }
  }, [performOptimisticUpdate, rollbackOptimisticUpdate, commitOptimisticUpdate, refetchState])

  const completeStateProgress = useCallback(async (stateCode: string, completionData?: any): Promise<void> => {
    const optimisticUpdates = {
      status: 'completed' as const,
      completion_date: new Date().toISOString(),
      ...completionData
    }

    performOptimisticUpdate(stateCode, optimisticUpdates)

    try {
      const { error } = await completeState(stateCode, completionData)
      
      if (error) {
        rollbackOptimisticUpdate(stateCode)
        throw error
      }

      commitOptimisticUpdate(stateCode)
      await refetchState(stateCode)

    } catch (error) {
      rollbackOptimisticUpdate(stateCode)
      setState(prev => ({ ...prev, error: error as Error }))
      throw error
    }
  }, [performOptimisticUpdate, rollbackOptimisticUpdate, commitOptimisticUpdate, refetchState])

  const preloadState = useCallback(async (stateCode: string): Promise<void> => {
    try {
      await fetchSingleState(stateCode)
    } catch (error) {
      console.warn(`Failed to preload state ${stateCode}:`, error)
    }
  }, [fetchSingleState])

  const retry = useCallback(async (): Promise<void> => {
    if (state.retryCount >= opts.maxRetries) {
      setState(prev => ({ ...prev, error: new Error('Maximum retry attempts reached') }))
      return
    }

    setState(prev => ({ ...prev, retryCount: prev.retryCount + 1 }))

    const delay = opts.retryDelay * Math.pow(2, state.retryCount)
    
    retryTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        refresh()
      }
    }, delay)
  }, [state.retryCount, opts.maxRetries, opts.retryDelay, refresh])

  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null, connectionError: null, retryCount: 0 }))
  }, [])

  // ==================================================
  // Real-time Event Handlers
  // ==================================================

  const handleStateProgressUpdate = useCallback((update: StateProgressUpdate): void => {
    if (!isMountedRef.current) return

    // Apply notification filters
    if (opts.notificationFilters?.states && !opts.notificationFilters.states.includes(update.stateCode)) {
      return
    }

    setState(prev => {
      const states = [...prev.states]
      const stateIndex = states.findIndex(s => s.state_code === update.stateCode)
      
      if (update.eventType === 'DELETE') {
        if (stateIndex !== -1) {
          states.splice(stateIndex, 1)
        }
      } else if (update.new) {
        if (stateIndex === -1) {
          states.push(update.new)
        } else {
          states[stateIndex] = update.new
        }
      }

      return {
        ...prev,
        states,
        eventsReceived: prev.eventsReceived + 1,
        lastUpdated: new Date(),
        currentState: prev.currentState?.state_code === update.stateCode ? update.new : prev.currentState
      }
    })

    // Invalidate relevant cache entries
    invalidateCache()
  }, [opts.notificationFilters, invalidateCache])

  const handleMilestoneUpdate = useCallback((update: MilestoneUpdate): void => {
    if (!isMountedRef.current) return

    // Apply notification filters
    if (opts.notificationFilters?.milestoneTypes && !opts.notificationFilters.milestoneTypes.includes(update.milestoneType)) {
      return
    }

    setState(prev => {
      let milestones = [...prev.milestones]
      
      if (update.eventType === 'DELETE' && update.old) {
        milestones = milestones.filter(m => m.id !== update.old!.id)
      } else if (update.new) {
        const existingIndex = milestones.findIndex(m => m.id === update.new!.id)
        if (existingIndex === -1) {
          milestones.push(update.new)
        } else {
          milestones[existingIndex] = update.new
        }
      }

      return {
        ...prev,
        milestones,
        eventsReceived: prev.eventsReceived + 1,
        lastUpdated: new Date()
      }
    })
  }, [opts.notificationFilters])

  const handleConnectionChange = useCallback((connectionState: ConnectionState): void => {
    if (!isMountedRef.current) return

    setState(prev => ({ ...prev, connectionState }))

    if (connectionState === 'connected' && prev.connectionState !== 'connected') {
      // Refresh data when reconnected
      refresh()
    }
  }, [refresh])

  const handleRealtimeError = useCallback((error: Error): void => {
    if (!isMountedRef.current) return

    setState(prev => ({ ...prev, connectionError: error }))
  }, [])

  // ==================================================
  // Connection Management
  // ==================================================

  const connect = useCallback(async (): Promise<void> => {
    if (!opts.enableRealtime) return

    const manager = subscriptionManagerRef.current
    
    // Subscribe to events
    const unsubscribeStateProgress = manager.onStateProgressChange(handleStateProgressUpdate)
    const unsubscribeMilestones = manager.onMilestoneChange(handleMilestoneUpdate)
    const unsubscribeConnection = manager.onConnectionChange(handleConnectionChange)
    const unsubscribeError = manager.onError(handleRealtimeError)

    // Store unsubscribe functions for cleanup
    return () => {
      unsubscribeStateProgress()
      unsubscribeMilestones()
      unsubscribeConnection()
      unsubscribeError()
    }
  }, [opts.enableRealtime, handleStateProgressUpdate, handleMilestoneUpdate, handleConnectionChange, handleRealtimeError])

  const disconnect = useCallback(async (): Promise<void> => {
    // Manager handles its own cleanup
  }, [])

  const reconnect = useCallback(async (): Promise<void> => {
    await subscriptionManagerRef.current.reconnect()
  }, [])

  // ==================================================
  // Utility Functions
  // ==================================================

  const utils = useMemo(() => ({
    getStateByCode: (code: string): StateProgress | undefined => {
      return state.states.find(s => s.state_code === code.toUpperCase())
    },

    getStatesByRegion: (region: string): StateProgress[] => {
      return state.states.filter(s => s.region === region)
    },

    getCompletedStates: (): StateProgress[] => {
      return state.states.filter(s => s.status === 'completed')
    },

    getCurrentWeekState: (): StateProgress | undefined => {
      return state.states.find(s => s.status === 'current')
    },

    getProgressPercentage: (): number => {
      const completed = state.states.filter(s => s.status === 'completed').length
      return Math.round((completed / state.states.length) * 100)
    },

    isStateCompleted: (code: string): boolean => {
      const stateData = state.states.find(s => s.state_code === code.toUpperCase())
      return stateData?.status === 'completed'
    },

    getNextState: (): StateProgress | undefined => {
      return state.states.find(s => s.status === 'upcoming')
    }
  }), [state.states])

  // ==================================================
  // Effects
  // ==================================================

  // Initial data fetch
  useEffect(() => {
    refresh()
  }, [refresh])

  // Real-time connection setup
  useEffect(() => {
    let cleanup: (() => void) | undefined

    if (opts.enableRealtime) {
      connect().then(cleanupFn => {
        cleanup = cleanupFn
      })
    }

    return () => {
      if (cleanup) cleanup()
    }
  }, [opts.enableRealtime, connect])

  // Periodic refresh
  useEffect(() => {
    if (!opts.refetchInterval) return

    const interval = setInterval(() => {
      if (!state.refreshing && !state.optimisticUpdating) {
        refresh()
      }
    }, opts.refetchInterval)

    return () => clearInterval(interval)
  }, [opts.refetchInterval, state.refreshing, state.optimisticUpdating, refresh])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  // ==================================================
  // Return Hook Interface
  // ==================================================

  return {
    data: state,
    actions: {
      refresh,
      refetchState,
      updateState,
      completeStateProgress,
      connect,
      disconnect,
      reconnect,
      retry,
      clearError,
      invalidateCache,
      preloadState
    },
    utils
  }
}