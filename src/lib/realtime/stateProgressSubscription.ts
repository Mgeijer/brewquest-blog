/**
 * Real-time State Progress Subscription Management
 * 
 * Comprehensive real-time subscription system for live state progress tracking
 * with performance optimization, error handling, and connection management.
 * 
 * Features:
 * - Multi-subscription management (state progress, milestones, analytics)
 * - Connection state tracking and retry logic
 * - Performance optimization with rate limiting and debouncing
 * - Memory leak prevention and automatic cleanup
 * - Event filtering and selective updates
 * - Comprehensive error handling and logging
 */

import { supabase } from '../supabase/client'
import { 
  StateProgress, 
  JourneyMilestone, 
  StateAnalytics 
} from '../supabase/functions/stateProgressFunctions'
import { type RealtimeChannel, type RealtimePostgresChangesPayload } from '@supabase/supabase-js'

// ==================================================
// Type Definitions
// ==================================================

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error'

export type SubscriptionType = 'state_progress' | 'milestones' | 'analytics' | 'all'

export interface RealtimeConfig {
  // Connection settings
  autoReconnect: boolean
  maxReconnectAttempts: number
  reconnectDelay: number
  heartbeatInterval: number
  
  // Performance settings
  rateLimitMs: number
  debounceMs: number
  batchUpdates: boolean
  maxBatchSize: number
  
  // Filtering
  enabledSubscriptions: SubscriptionType[]
  stateFilter?: string[]
  eventFilter?: string[]
  
  // Debug and monitoring
  enableLogging: boolean
  enableMetrics: boolean
}

export interface SubscriptionMetrics {
  connectTime: number
  lastEvent: number
  eventsReceived: number
  errorsCount: number
  reconnectCount: number
  averageLatency: number
}

export interface RealtimeEvent {
  type: 'state_progress' | 'milestone' | 'analytics' | 'connection'
  eventType: 'INSERT' | 'UPDATE' | 'DELETE' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR'
  data: any
  timestamp: number
  latency?: number
  source: string
}

export interface StateProgressUpdate {
  old: StateProgress | null
  new: StateProgress | null
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  stateCode: string
  timestamp: string
}

export interface MilestoneUpdate {
  old: JourneyMilestone | null
  new: JourneyMilestone | null
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  milestoneType: string
  timestamp: string
}

// Event handlers
export type StateProgressHandler = (update: StateProgressUpdate) => void
export type MilestoneHandler = (update: MilestoneUpdate) => void
export type AnalyticsHandler = (event: StateAnalytics) => void
export type ConnectionHandler = (state: ConnectionState, error?: Error) => void
export type ErrorHandler = (error: Error, context: string) => void

// ==================================================
// Default Configuration
// ==================================================

const DEFAULT_CONFIG: RealtimeConfig = {
  // Connection settings
  autoReconnect: true,
  maxReconnectAttempts: 5,
  reconnectDelay: 1000, // Start with 1 second
  heartbeatInterval: 30000, // 30 seconds
  
  // Performance settings
  rateLimitMs: 100, // Minimum 100ms between events
  debounceMs: 250, // Debounce rapid updates
  batchUpdates: true,
  maxBatchSize: 10,
  
  // Filtering
  enabledSubscriptions: ['all'],
  
  // Debug and monitoring
  enableLogging: process.env.NODE_ENV === 'development',
  enableMetrics: true
}

// ==================================================
// State Progress Subscription Manager
// ==================================================

export class StateProgressSubscriptionManager {
  private config: RealtimeConfig
  private channels: Map<string, RealtimeChannel> = new Map()
  private handlers: Map<string, Set<Function>> = new Map()
  private connectionState: ConnectionState = 'disconnected'
  private metrics: SubscriptionMetrics
  private reconnectAttempts = 0
  private reconnectTimer?: NodeJS.Timeout
  private heartbeatTimer?: NodeJS.Timeout
  private eventQueue: RealtimeEvent[] = []
  private processingQueue = false
  private rateLimitMap = new Map<string, number>()
  private isDestroyed = false

  constructor(config?: Partial<RealtimeConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.metrics = {
      connectTime: 0,
      lastEvent: 0,
      eventsReceived: 0,
      errorsCount: 0,
      reconnectCount: 0,
      averageLatency: 0
    }

    // Initialize subscriptions based on config
    this.initializeSubscriptions()
  }

  // ==================================================
  // Public API
  // ==================================================

  /**
   * Subscribe to state progress changes
   */
  public onStateProgressChange(handler: StateProgressHandler): () => void {
    return this.addHandler('state_progress', handler)
  }

  /**
   * Subscribe to milestone changes
   */
  public onMilestoneChange(handler: MilestoneHandler): () => void {
    return this.addHandler('milestones', handler)
  }

  /**
   * Subscribe to analytics events
   */
  public onAnalyticsEvent(handler: AnalyticsHandler): () => void {
    return this.addHandler('analytics', handler)
  }

  /**
   * Subscribe to connection state changes
   */
  public onConnectionChange(handler: ConnectionHandler): () => void {
    return this.addHandler('connection', handler)
  }

  /**
   * Subscribe to error events
   */
  public onError(handler: ErrorHandler): () => void {
    return this.addHandler('error', handler)
  }

  /**
   * Get current connection state
   */
  public getConnectionState(): ConnectionState {
    return this.connectionState
  }

  /**
   * Get subscription metrics
   */
  public getMetrics(): SubscriptionMetrics {
    return { ...this.metrics }
  }

  /**
   * Force reconnection
   */
  public async reconnect(): Promise<void> {
    if (this.isDestroyed) return

    this.log('Forcing reconnection...')
    await this.disconnect()
    await this.connect()
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<RealtimeConfig>): void {
    const oldConfig = { ...this.config }
    this.config = { ...this.config, ...newConfig }
    
    // Reinitialize if subscription types changed
    if (JSON.stringify(oldConfig.enabledSubscriptions) !== JSON.stringify(this.config.enabledSubscriptions)) {
      this.initializeSubscriptions()
    }
  }

  /**
   * Clean up and destroy manager
   */
  public async destroy(): Promise<void> {
    if (this.isDestroyed) return

    this.log('Destroying subscription manager...')
    this.isDestroyed = true
    
    // Clear timers
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
    }

    // Disconnect all channels
    await this.disconnect()
    
    // Clear handlers
    this.handlers.clear()
    this.channels.clear()
    this.eventQueue = []
    
    this.log('Subscription manager destroyed')
  }

  // ==================================================
  // Private Methods - Initialization
  // ==================================================

  private async initializeSubscriptions(): Promise<void> {
    if (this.isDestroyed) return

    // Disconnect existing channels
    await this.disconnect()

    // Create new channels based on configuration
    const subscriptions = this.config.enabledSubscriptions.includes('all') 
      ? ['state_progress', 'milestones', 'analytics'] as const
      : this.config.enabledSubscriptions.filter(s => s !== 'all') as ('state_progress' | 'milestones' | 'analytics')[]

    for (const subscription of subscriptions) {
      this.createChannel(subscription)
    }

    // Connect to all channels
    await this.connect()
  }

  private createChannel(type: 'state_progress' | 'milestones' | 'analytics'): void {
    const channelConfig = this.getChannelConfig(type)
    const channel = supabase.channel(channelConfig.name, {
      config: {
        presence: { key: `${type}_subscriber_${Date.now()}` }
      }
    })

    // Configure postgres changes listener
    channel.on('postgres_changes', channelConfig.filter, (payload) => {
      this.handleDatabaseChange(type, payload)
    })

    // Configure broadcast listener for admin updates
    channel.on('broadcast', { event: 'state_updated' }, (payload) => {
      this.handleBroadcastEvent(type, payload)
    })

    // Configure presence listeners
    channel.on('presence', { event: 'sync' }, () => {
      this.log(`Presence sync for ${type}`)
    })

    // Store channel
    this.channels.set(type, channel)
    this.log(`Created channel for ${type}`)
  }

  private getChannelConfig(type: 'state_progress' | 'milestones' | 'analytics') {
    const configs = {
      state_progress: {
        name: 'state-progress-realtime',
        filter: {
          event: '*',
          schema: 'public',
          table: 'state_progress'
        }
      },
      milestones: {
        name: 'milestones-realtime',
        filter: {
          event: '*',
          schema: 'public',
          table: 'journey_milestones'
        }
      },
      analytics: {
        name: 'analytics-realtime',
        filter: {
          event: 'INSERT',
          schema: 'public',
          table: 'state_analytics'
        }
      }
    }

    return configs[type]
  }

  // ==================================================
  // Private Methods - Connection Management
  // ==================================================

  private async connect(): Promise<void> {
    if (this.isDestroyed || this.connectionState === 'connected') return

    this.setConnectionState('connecting')
    this.log('Connecting to real-time subscriptions...')

    try {
      // Subscribe to all channels
      const subscribePromises = Array.from(this.channels.values()).map(channel => 
        channel.subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            this.log(`Channel subscribed successfully`)
          } else if (status === 'CHANNEL_ERROR') {
            this.handleError(new Error(`Channel subscription error: ${err?.message}`), 'channel_subscribe')
          } else if (status === 'TIMED_OUT') {
            this.handleError(new Error('Channel subscription timed out'), 'channel_timeout')
          } else if (status === 'CLOSED') {
            this.log('Channel closed')
            this.handleDisconnection()
          }
        })
      )

      await Promise.all(subscribePromises)

      // All channels connected successfully
      this.setConnectionState('connected')
      this.metrics.connectTime = Date.now()
      this.reconnectAttempts = 0
      
      // Start heartbeat
      this.startHeartbeat()
      
      this.log('Successfully connected to all real-time subscriptions')

    } catch (error) {
      this.handleError(error as Error, 'connection')
      await this.handleConnectionFailure()
    }
  }

  private async disconnect(): Promise<void> {
    this.log('Disconnecting from real-time subscriptions...')
    
    // Stop heartbeat
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = undefined
    }

    // Unsubscribe from all channels
    const unsubscribePromises = Array.from(this.channels.values()).map(channel => 
      channel.unsubscribe()
    )

    await Promise.all(unsubscribePromises)
    
    this.setConnectionState('disconnected')
    this.log('Disconnected from all real-time subscriptions')
  }

  private async handleConnectionFailure(): Promise<void> {
    this.setConnectionState('error')
    
    if (!this.config.autoReconnect || this.isDestroyed) {
      this.log('Auto-reconnect disabled or manager destroyed, not attempting reconnection')
      return
    }

    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.log(`Max reconnection attempts (${this.config.maxReconnectAttempts}) reached`)
      this.handleError(new Error('Max reconnection attempts reached'), 'max_reconnect_attempts')
      return
    }

    // Exponential backoff with jitter
    const delay = Math.min(
      this.config.reconnectDelay * Math.pow(2, this.reconnectAttempts) + Math.random() * 1000,
      30000 // Max 30 seconds
    )

    this.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.config.maxReconnectAttempts})`)
    
    this.reconnectTimer = setTimeout(async () => {
      if (this.isDestroyed) return
      
      this.reconnectAttempts++
      this.metrics.reconnectCount++
      
      try {
        await this.connect()
      } catch (error) {
        this.log(`Reconnection attempt ${this.reconnectAttempts} failed:`, error)
        await this.handleConnectionFailure()
      }
    }, delay)
  }

  private handleDisconnection(): void {
    if (this.connectionState !== 'disconnected') {
      this.setConnectionState('disconnected')
      this.log('Connection lost, attempting to reconnect...')
      this.handleConnectionFailure()
    }
  }

  private startHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
    }

    this.heartbeatTimer = setInterval(() => {
      if (this.isDestroyed) return

      // Send heartbeat through one of the channels
      const channel = this.channels.values().next().value
      if (channel) {
        channel.send({
          type: 'broadcast',
          event: 'heartbeat',
          payload: { timestamp: Date.now() }
        }).catch((error) => {
          this.log('Heartbeat failed:', error)
          this.handleDisconnection()
        })
      }
    }, this.config.heartbeatInterval)
  }

  // ==================================================
  // Private Methods - Event Handling
  // ==================================================

  private handleDatabaseChange(
    type: 'state_progress' | 'milestones' | 'analytics',
    payload: RealtimePostgresChangesPayload<any>
  ): void {
    if (this.isDestroyed) return

    const event: RealtimeEvent = {
      type,
      eventType: payload.eventType,
      data: payload,
      timestamp: Date.now(),
      source: 'database'
    }

    this.queueEvent(event)
  }

  private handleBroadcastEvent(
    type: 'state_progress' | 'milestones' | 'analytics',
    payload: any
  ): void {
    if (this.isDestroyed) return

    const event: RealtimeEvent = {
      type,
      eventType: 'UPDATE',
      data: payload,
      timestamp: Date.now(),
      source: 'broadcast'
    }

    this.queueEvent(event)
  }

  private queueEvent(event: RealtimeEvent): void {
    // Apply rate limiting
    const key = `${event.type}_${event.eventType}`
    const lastEventTime = this.rateLimitMap.get(key) || 0
    const now = Date.now()

    if (now - lastEventTime < this.config.rateLimitMs) {
      this.log(`Rate limiting event: ${key}`)
      return
    }

    this.rateLimitMap.set(key, now)
    this.eventQueue.push(event)
    this.metrics.eventsReceived++
    this.metrics.lastEvent = now

    // Process queue
    this.processEventQueue()
  }

  private async processEventQueue(): Promise<void> {
    if (this.processingQueue || this.isDestroyed) return

    this.processingQueue = true

    try {
      // Process events in batches or individually based on config
      if (this.config.batchUpdates && this.eventQueue.length > 1) {
        await this.processBatchedEvents()
      } else {
        await this.processIndividualEvents()
      }
    } catch (error) {
      this.handleError(error as Error, 'event_processing')
    } finally {
      this.processingQueue = false
      
      // If more events were queued while processing, process them
      if (this.eventQueue.length > 0) {
        setTimeout(() => this.processEventQueue(), this.config.debounceMs)
      }
    }
  }

  private async processBatchedEvents(): Promise<void> {
    const batch = this.eventQueue.splice(0, this.config.maxBatchSize)
    
    // Group events by type
    const groupedEvents = batch.reduce((groups, event) => {
      if (!groups[event.type]) groups[event.type] = []
      groups[event.type].push(event)
      return groups
    }, {} as Record<string, RealtimeEvent[]>)

    // Process each group
    for (const [type, events] of Object.entries(groupedEvents)) {
      await this.processEventGroup(type as any, events)
    }
  }

  private async processIndividualEvents(): Promise<void> {
    const event = this.eventQueue.shift()
    if (!event) return

    await this.processEvent(event)
  }

  private async processEventGroup(type: string, events: RealtimeEvent[]): Promise<void> {
    // For batched processing, we might want to merge similar events
    // For now, process each event individually
    for (const event of events) {
      await this.processEvent(event)
    }
  }

  private async processEvent(event: RealtimeEvent): Promise<void> {
    try {
      switch (event.type) {
        case 'state_progress':
          await this.processStateProgressEvent(event)
          break
        case 'milestones':
          await this.processMilestoneEvent(event)
          break
        case 'analytics':
          await this.processAnalyticsEvent(event)
          break
      }
    } catch (error) {
      this.handleError(error as Error, `process_${event.type}_event`)
    }
  }

  private async processStateProgressEvent(event: RealtimeEvent): Promise<void> {
    const payload = event.data
    
    // Apply state filtering if configured
    if (this.config.stateFilter && payload.new?.state_code) {
      if (!this.config.stateFilter.includes(payload.new.state_code)) {
        return
      }
    }

    const update: StateProgressUpdate = {
      old: payload.old,
      new: payload.new,
      eventType: event.eventType as any,
      stateCode: payload.new?.state_code || payload.old?.state_code || 'unknown',
      timestamp: new Date().toISOString()
    }

    this.notifyHandlers('state_progress', update)
  }

  private async processMilestoneEvent(event: RealtimeEvent): Promise<void> {
    const payload = event.data

    const update: MilestoneUpdate = {
      old: payload.old,
      new: payload.new,
      eventType: event.eventType as any,
      milestoneType: payload.new?.milestone_type || payload.old?.milestone_type || 'unknown',
      timestamp: new Date().toISOString()
    }

    this.notifyHandlers('milestones', update)
  }

  private async processAnalyticsEvent(event: RealtimeEvent): Promise<void> {
    const payload = event.data
    
    if (payload.new) {
      this.notifyHandlers('analytics', payload.new)
    }
  }

  // ==================================================
  // Private Methods - Handler Management
  // ==================================================

  private addHandler(type: string, handler: Function): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }
    
    this.handlers.get(type)!.add(handler)
    this.log(`Added ${type} handler`)

    // Return unsubscribe function
    return () => {
      const handlerSet = this.handlers.get(type)
      if (handlerSet) {
        handlerSet.delete(handler)
        this.log(`Removed ${type} handler`)
      }
    }
  }

  private notifyHandlers(type: string, data: any): void {
    const handlerSet = this.handlers.get(type)
    if (!handlerSet) return

    for (const handler of handlerSet) {
      try {
        handler(data)
      } catch (error) {
        this.handleError(error as Error, `handler_${type}`)
      }
    }
  }

  // ==================================================
  // Private Methods - Utilities
  // ==================================================

  private setConnectionState(state: ConnectionState): void {
    if (this.connectionState === state) return

    const previousState = this.connectionState
    this.connectionState = state
    
    this.log(`Connection state changed: ${previousState} -> ${state}`)
    this.notifyHandlers('connection', state)
  }

  private handleError(error: Error, context: string): void {
    this.metrics.errorsCount++
    
    const errorMessage = `Real-time error in ${context}: ${error.message}`
    this.log(errorMessage, error)
    
    this.notifyHandlers('error', error, context)
  }

  private log(message: string, ...args: any[]): void {
    if (this.config.enableLogging) {
      console.log(`[StateProgressSubscription] ${message}`, ...args)
    }
  }
}

// ==================================================
// Singleton Instance
// ==================================================

let subscriptionManagerInstance: StateProgressSubscriptionManager | null = null

/**
 * Get or create singleton subscription manager instance
 */
export function getSubscriptionManager(config?: Partial<RealtimeConfig>): StateProgressSubscriptionManager {
  if (!subscriptionManagerInstance) {
    subscriptionManagerInstance = new StateProgressSubscriptionManager(config)
  } else if (config) {
    subscriptionManagerInstance.updateConfig(config)
  }
  
  return subscriptionManagerInstance
}

/**
 * Destroy singleton instance
 */
export async function destroySubscriptionManager(): Promise<void> {
  if (subscriptionManagerInstance) {
    await subscriptionManagerInstance.destroy()
    subscriptionManagerInstance = null
  }
}

// ==================================================
// Utility Functions
// ==================================================

/**
 * Create a debounced version of a real-time handler
 */
export function debounceHandler<T extends (...args: any[]) => any>(
  handler: T,
  delayMs: number
): T {
  let timeoutId: NodeJS.Timeout
  
  return ((...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => handler(...args), delayMs)
  }) as T
}

/**
 * Create a throttled version of a real-time handler
 */
export function throttleHandler<T extends (...args: any[]) => any>(
  handler: T,
  limitMs: number
): T {
  let lastCall = 0
  
  return ((...args: any[]) => {
    const now = Date.now()
    if (now - lastCall >= limitMs) {
      lastCall = now
      handler(...args)
    }
  }) as T
}

/**
 * Filter events by state codes
 */
export function createStateFilter(stateCodes: string[]) {
  return (update: StateProgressUpdate): boolean => {
    return stateCodes.includes(update.stateCode)
  }
}

/**
 * Filter milestones by type
 */
export function createMilestoneFilter(milestoneTypes: string[]) {
  return (update: MilestoneUpdate): boolean => {
    return milestoneTypes.includes(update.milestoneType)
  }
}