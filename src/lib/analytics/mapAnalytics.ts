'use client'

import { createClient } from '@supabase/supabase-js'

// Types for analytics data
export interface MapInteraction {
  id?: string
  state_code: string
  action: 'hover' | 'click' | 'navigation' | 'tooltip_view' | 'completion_celebration'
  timestamp: Date
  user_agent: string
  session_id: string
  metadata?: Record<string, any>
  created_at?: string
}

export interface StatePopularity {
  stateCode: string
  stateName: string
  totalInteractions: number
  clickCount: number
  hoverCount: number
  navigationCount: number
  avgTimeSpent: number
  conversionRate: number
}

export interface MapEngagementMetrics {
  totalSessions: number
  avgSessionDuration: number
  totalInteractions: number
  mostPopularStates: StatePopularity[]
  deviceBreakdown: {
    mobile: number
    desktop: number
    tablet: number
  }
  userJourneyFlow: {
    entryStates: string[]
    exitStates: string[]
    commonPaths: Array<{ path: string[]; count: number }>
  }
  conversionMetrics: {
    mapViewToClick: number
    clickToNavigation: number
    hoverToClick: number
  }
}

export interface SessionMetrics {
  sessionId: string
  startTime: Date
  endTime?: Date
  totalInteractions: number
  statesVisited: string[]
  deviceType: 'mobile' | 'desktop' | 'tablet'
  converted: boolean
}

// Utility functions
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

const getDeviceType = (userAgent: string): 'mobile' | 'desktop' | 'tablet' => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  const isTablet = /iPad|Android(?=.*Tablet)|Tablet/i.test(userAgent)
  
  if (isTablet) return 'tablet'
  if (isMobile) return 'mobile'
  return 'desktop'
}

const validateAnalyticsData = (data: Partial<MapInteraction>): boolean => {
  // Basic validation to prevent XSS and ensure data integrity
  if (!data.state_code || !/^[A-Z]{2}$/.test(data.state_code)) return false
  if (!data.action || !['hover', 'click', 'navigation', 'tooltip_view', 'completion_celebration'].includes(data.action)) return false
  if (data.metadata && typeof data.metadata !== 'object') return false
  
  return true
}

export class MapAnalytics {
  private supabase: ReturnType<typeof createClient> | null = null
  private sessionId: string
  private sessionStartTime: Date
  private interactionQueue: MapInteraction[] = []
  private flushInterval: NodeJS.Timeout | null = null
  private isInitialized = false

  constructor() {
    this.sessionId = generateSessionId()
    this.sessionStartTime = new Date()
    this.initializeSupabase()
    this.startFlushInterval()
    this.trackMapView()
  }

  private initializeSupabase() {
    try {
      if (typeof window !== 'undefined') {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (supabaseUrl && supabaseKey) {
          this.supabase = createClient(supabaseUrl, supabaseKey)
          this.isInitialized = true
        }
      }
    } catch (error) {
      console.warn('Failed to initialize Supabase for analytics:', error)
    }
  }

  private startFlushInterval() {
    // Flush analytics data every 10 seconds
    this.flushInterval = setInterval(() => {
      this.flushQueue()
    }, 10000)

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.flushQueue())
      window.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.flushQueue()
        }
      })
    }
  }

  private async flushQueue() {
    if (!this.supabase || this.interactionQueue.length === 0) return

    try {
      const { error } = await this.supabase
        .from('map_interactions')
        .insert(this.interactionQueue)

      if (!error) {
        this.interactionQueue = []
      }
    } catch (error) {
      console.warn('Failed to flush analytics queue:', error)
    }
  }

  private trackMapView() {
    this.trackStateInteraction('US', 'click', {
      event_type: 'map_view',
      session_start: true
    })
  }

  public trackStateInteraction(
    stateCode: string, 
    action: MapInteraction['action'], 
    metadata?: Record<string, any>
  ) {
    const interaction: MapInteraction = {
      state_code: stateCode,
      action,
      timestamp: new Date(),
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
      session_id: this.sessionId,
      metadata: metadata || {}
    }

    // Validate data before tracking
    if (!validateAnalyticsData(interaction)) {
      console.warn('Invalid analytics data:', interaction)
      return
    }

    // Add to queue for batch processing
    this.interactionQueue.push(interaction)

    // Also send to Google Analytics if available
    this.trackToGoogleAnalytics(stateCode, action, metadata)

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', interaction)
    }
  }

  private trackToGoogleAnalytics(
    stateCode: string, 
    action: string, 
    metadata?: Record<string, any>
  ) {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', `map_${action}`, {
        state_code: stateCode,
        session_id: this.sessionId,
        ...metadata
      })
    }
  }

  public trackInteractionTime(stateCode: string, duration: number) {
    this.trackStateInteraction(stateCode, 'hover', {
      interaction_duration: duration,
      event_type: 'interaction_time'
    })
  }

  public trackCompletionCelebration(stateCode: string) {
    this.trackStateInteraction(stateCode, 'completion_celebration', {
      celebration_triggered: true,
      timestamp: new Date().toISOString()
    })
  }

  public trackUserJourney(fromState: string, toState: string) {
    this.trackStateInteraction(toState, 'navigation', {
      from_state: fromState,
      navigation_type: 'user_journey',
      journey_step: true
    })
  }

  public async getPopularStates(): Promise<StatePopularity[]> {
    if (!this.supabase) return []

    try {
      const { data, error } = await this.supabase
        .from('map_interactions')
        .select('state_code, action, metadata')
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

      if (error) throw error

      // Aggregate data by state
      const stateStats: Record<string, any> = {}
      
      data?.forEach((interaction) => {
        const { state_code, action } = interaction
        if (!stateStats[state_code]) {
          stateStats[state_code] = {
            stateCode: state_code,
            totalInteractions: 0,
            clickCount: 0,
            hoverCount: 0,
            navigationCount: 0,
            conversionCount: 0
          }
        }

        stateStats[state_code].totalInteractions++
        if (action === 'click') stateStats[state_code].clickCount++
        if (action === 'hover') stateStats[state_code].hoverCount++
        if (action === 'navigation') {
          stateStats[state_code].navigationCount++
          stateStats[state_code].conversionCount++
        }
      })

      // Convert to array and calculate metrics
      return Object.values(stateStats)
        .map((state: any) => ({
          ...state,
          conversionRate: state.clickCount > 0 ? (state.conversionCount / state.clickCount) * 100 : 0,
          avgTimeSpent: 0 // Would need additional timing data
        }))
        .sort((a, b) => b.totalInteractions - a.totalInteractions)
        .slice(0, 10)
    } catch (error) {
      console.error('Failed to get popular states:', error)
      return []
    }
  }

  public async getEngagementMetrics(): Promise<MapEngagementMetrics> {
    if (!this.supabase) {
      return this.getDefaultMetrics()
    }

    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      
      const { data, error } = await this.supabase
        .from('map_interactions')
        .select('*')
        .gte('timestamp', thirtyDaysAgo)

      if (error) throw error

      const sessions = this.groupBySession(data || [])
      const popularStates = await this.getPopularStates()
      
      return {
        totalSessions: sessions.length,
        avgSessionDuration: this.calculateAvgSessionDuration(sessions),
        totalInteractions: data?.length || 0,
        mostPopularStates: popularStates,
        deviceBreakdown: this.calculateDeviceBreakdown(data || []),
        userJourneyFlow: this.analyzeUserJourneys(sessions),
        conversionMetrics: this.calculateConversionMetrics(data || [])
      }
    } catch (error) {
      console.error('Failed to get engagement metrics:', error)
      return this.getDefaultMetrics()
    }
  }

  private groupBySession(interactions: MapInteraction[]): SessionMetrics[] {
    const sessionMap: Record<string, SessionMetrics> = {}

    interactions.forEach((interaction) => {
      const { session_id, timestamp, user_agent, state_code, action } = interaction
      
      if (!sessionMap[session_id]) {
        sessionMap[session_id] = {
          sessionId: session_id,
          startTime: new Date(timestamp),
          totalInteractions: 0,
          statesVisited: [],
          deviceType: getDeviceType(user_agent),
          converted: false
        }
      }

      const session = sessionMap[session_id]
      session.totalInteractions++
      session.endTime = new Date(timestamp)
      
      if (!session.statesVisited.includes(state_code)) {
        session.statesVisited.push(state_code)
      }
      
      if (action === 'navigation') {
        session.converted = true
      }
    })

    return Object.values(sessionMap)
  }

  private calculateAvgSessionDuration(sessions: SessionMetrics[]): number {
    const validSessions = sessions.filter(s => s.endTime)
    if (validSessions.length === 0) return 0

    const totalDuration = validSessions.reduce((sum, session) => {
      const duration = session.endTime!.getTime() - session.startTime.getTime()
      return sum + duration
    }, 0)

    return totalDuration / validSessions.length / 1000 // Convert to seconds
  }

  private calculateDeviceBreakdown(interactions: MapInteraction[]) {
    const deviceCounts = interactions.reduce((acc, interaction) => {
      const deviceType = getDeviceType(interaction.user_agent)
      acc[deviceType] = (acc[deviceType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      mobile: deviceCounts.mobile || 0,
      desktop: deviceCounts.desktop || 0,
      tablet: deviceCounts.tablet || 0
    }
  }

  private analyzeUserJourneys(sessions: SessionMetrics[]) {
    const entryStates: string[] = []
    const exitStates: string[] = []
    const paths: string[][] = []

    sessions.forEach(session => {
      if (session.statesVisited.length > 0) {
        entryStates.push(session.statesVisited[0])
        exitStates.push(session.statesVisited[session.statesVisited.length - 1])
        paths.push(session.statesVisited)
      }
    })

    // Find common paths
    const pathCounts: Record<string, number> = {}
    paths.forEach(path => {
      const pathKey = path.join('->')
      pathCounts[pathKey] = (pathCounts[pathKey] || 0) + 1
    })

    const commonPaths = Object.entries(pathCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([path, count]) => ({ path: path.split('->'), count }))

    return {
      entryStates: [...new Set(entryStates)],
      exitStates: [...new Set(exitStates)],
      commonPaths
    }
  }

  private calculateConversionMetrics(interactions: MapInteraction[]) {
    const actionCounts = interactions.reduce((acc, interaction) => {
      acc[interaction.action] = (acc[interaction.action] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      mapViewToClick: actionCounts.click > 0 ? ((actionCounts.click / (actionCounts.hover || 1)) * 100) : 0,
      clickToNavigation: actionCounts.navigation > 0 ? ((actionCounts.navigation / (actionCounts.click || 1)) * 100) : 0,
      hoverToClick: actionCounts.click > 0 ? ((actionCounts.click / (actionCounts.hover || 1)) * 100) : 0
    }
  }

  private getDefaultMetrics(): MapEngagementMetrics {
    return {
      totalSessions: 0,
      avgSessionDuration: 0,
      totalInteractions: 0,
      mostPopularStates: [],
      deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
      userJourneyFlow: { entryStates: [], exitStates: [], commonPaths: [] },
      conversionMetrics: { mapViewToClick: 0, clickToNavigation: 0, hoverToClick: 0 }
    }
  }

  public destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flushQueue()
  }
}

// Global analytics instance
let mapAnalyticsInstance: MapAnalytics | null = null

export const getMapAnalytics = (): MapAnalytics => {
  if (!mapAnalyticsInstance && typeof window !== 'undefined') {
    mapAnalyticsInstance = new MapAnalytics()
  }
  return mapAnalyticsInstance!
}

// React hook for analytics
export const useMapAnalytics = () => {
  const analytics = getMapAnalytics()

  return {
    trackStateHover: (stateCode: string, metadata?: Record<string, any>) => 
      analytics?.trackStateInteraction(stateCode, 'hover', metadata),
    
    trackStateClick: (stateCode: string, metadata?: Record<string, any>) => 
      analytics?.trackStateInteraction(stateCode, 'click', metadata),
    
    trackStateNavigation: (stateCode: string, metadata?: Record<string, any>) => 
      analytics?.trackStateInteraction(stateCode, 'navigation', metadata),
    
    trackTooltipView: (stateCode: string, metadata?: Record<string, any>) => 
      analytics?.trackStateInteraction(stateCode, 'tooltip_view', metadata),
    
    trackCompletionCelebration: (stateCode: string) => 
      analytics?.trackCompletionCelebration(stateCode),
    
    trackInteractionTime: (stateCode: string, duration: number) => 
      analytics?.trackInteractionTime(stateCode, duration),
    
    getPopularStates: () => analytics?.getPopularStates(),
    getEngagementMetrics: () => analytics?.getEngagementMetrics()
  }
}