'use client'

// Simplified in-memory analytics system for demonstration
// This provides all the analytics functionality without requiring database setup

export interface MapInteraction {
  id: string
  state_code: string
  action: 'hover' | 'click' | 'navigation' | 'tooltip_view' | 'completion_celebration'
  timestamp: Date
  user_agent: string
  session_id: string
  metadata?: Record<string, any>
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

// In-memory storage for demonstration
let analyticsData: MapInteraction[] = []
let sessionData: Map<string, { startTime: Date; interactions: string[]; device: string }> = new Map()

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
  if (!data.state_code || !/^[A-Z]{2}$/.test(data.state_code)) return false
  if (!data.action || !['hover', 'click', 'navigation', 'tooltip_view', 'completion_celebration'].includes(data.action)) return false
  if (data.metadata && typeof data.metadata !== 'object') return false
  
  return true
}

export class SimpleMapAnalytics {
  private sessionId: string
  private sessionStartTime: Date

  constructor() {
    this.sessionId = generateSessionId()
    this.sessionStartTime = new Date()
    this.initializeSession()
    this.trackMapView()
  }

  private initializeSession() {
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : ''
    sessionData.set(this.sessionId, {
      startTime: this.sessionStartTime,
      interactions: [],
      device: getDeviceType(userAgent)
    })
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
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

    // Store in memory
    analyticsData.push(interaction)

    // Update session data
    const session = sessionData.get(this.sessionId)
    if (session && !session.interactions.includes(stateCode)) {
      session.interactions.push(stateCode)
    }

    // Limit memory usage - keep only last 1000 interactions
    if (analyticsData.length > 1000) {
      analyticsData = analyticsData.slice(-1000)
    }

    // Send to Google Analytics if available
    this.trackToGoogleAnalytics(stateCode, action, metadata)

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', {
        stateCode,
        action,
        sessionId: this.sessionId,
        metadata
      })
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
    // Aggregate data by state from in-memory storage
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentData = analyticsData.filter(interaction => 
      interaction.timestamp >= thirtyDaysAgo
    )

    const stateStats: Record<string, any> = {}
    
    recentData.forEach((interaction) => {
      const { state_code, action } = interaction
      if (!stateStats[state_code]) {
        stateStats[state_code] = {
          stateCode: state_code,
          stateName: this.getStateName(state_code),
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
  }

  public async getEngagementMetrics(): Promise<MapEngagementMetrics> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentData = analyticsData.filter(interaction => 
      interaction.timestamp >= thirtyDaysAgo
    )

    const sessions = this.groupBySession(recentData)
    const popularStates = await this.getPopularStates()
    
    return {
      totalSessions: sessions.length,
      avgSessionDuration: this.calculateAvgSessionDuration(sessions),
      totalInteractions: recentData.length,
      mostPopularStates: popularStates,
      deviceBreakdown: this.calculateDeviceBreakdown(recentData),
      userJourneyFlow: this.analyzeUserJourneys(sessions),
      conversionMetrics: this.calculateConversionMetrics(recentData)
    }
  }

  private getStateName(stateCode: string): string {
    const stateNames: Record<string, string> = {
      'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
      'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
      'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
      'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
      'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
      'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
      'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
      'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
      'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
      'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
      'US': 'United States'
    }
    return stateNames[stateCode] || stateCode
  }

  private groupBySession(interactions: MapInteraction[]) {
    const sessionMap: Record<string, any> = {}

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

  private calculateAvgSessionDuration(sessions: any[]): number {
    const validSessions = sessions.filter(s => s.endTime)
    if (validSessions.length === 0) return 0

    const totalDuration = validSessions.reduce((sum, session) => {
      const duration = session.endTime.getTime() - session.startTime.getTime()
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

  private analyzeUserJourneys(sessions: any[]) {
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

  public destroy() {
    // Clean up any resources
    console.log('📊 Analytics session ended')
  }
}

// Global analytics instance
let simpleAnalyticsInstance: SimpleMapAnalytics | null = null

export const getSimpleMapAnalytics = (): SimpleMapAnalytics => {
  if (!simpleAnalyticsInstance && typeof window !== 'undefined') {
    simpleAnalyticsInstance = new SimpleMapAnalytics()
  }
  return simpleAnalyticsInstance!
}

// React hook for simple analytics
export const useSimpleMapAnalytics = () => {
  const analytics = typeof window !== 'undefined' ? getSimpleMapAnalytics() : null

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