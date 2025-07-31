/**
 * State Progress Query Utilities
 * 
 * Optimized query functions for fetching state progress data,
 * analytics, and related information for the Hop Harrison beer journey.
 */

import { supabase } from '../client'
import {
  type StateProgress,
  type StateAnalytics,
  type BreweryFeature,
  type JourneyMilestone,
  type MapInteractionSummary,
  getAllStateProgress,
  getStateProgress,
  getStateAnalytics,
  getStateBreweries,
  getJourneyMilestones,
  getMapInteractionSummary,
  getProgressStatistics
} from '../functions/stateProgressFunctions'

// ==================================================
// Extended Query Types
// ==================================================

export interface StateWithBreweries extends StateProgress {
  breweries: BreweryFeature[]
  beer_reviews?: any[]
  blog_post?: any
}

export interface RegionProgress {
  region: string
  total_states: number
  completed_states: number
  current_states: number
  upcoming_states: number
  completion_percentage: number
  states: StateProgress[]
}

export interface StateAnalyticsSummary {
  state_code: string
  state_name: string
  total_interactions: number
  unique_visitors: number
  avg_session_duration: number
  most_common_interaction: string
  peak_interaction_hour: number
  mobile_percentage: number
  bounce_rate: number
  last_7_days_growth: number
}

export interface WeeklyProgress {
  week_number: number
  state: StateProgress | null
  milestones: JourneyMilestone[]
  analytics_summary: StateAnalyticsSummary | null
  is_current_week: boolean
  is_completed: boolean
}

// ==================================================
// Enhanced State Queries
// ==================================================

/**
 * Get state progress with detailed brewery and blog information
 */
export async function getStateWithDetails(stateCode: string): Promise<{
  data: StateWithBreweries | null
  error: any
}> {
  try {
    // Get base state progress
    const { data: stateProgress, error: stateError } = await getStateProgress(stateCode)
    
    if (stateError || !stateProgress) {
      return { data: null, error: stateError }
    }

    // Get breweries for this state
    const { data: breweries, error: breweriesError } = await getStateBreweries(stateCode)
    
    if (breweriesError) {
      console.warn(`Could not fetch breweries for ${stateCode}:`, breweriesError)
    }

    // Get beer reviews if blog post exists
    let beerReviews = null
    if (stateProgress.blog_post_id) {
      const { data: reviews, error: reviewsError } = await supabase
        .from('beer_reviews')
        .select('*')
        .eq('blog_post_id', stateProgress.blog_post_id)
        .order('rating', { ascending: false })

      if (reviewsError) {
        console.warn(`Could not fetch beer reviews for ${stateCode}:`, reviewsError)
      } else {
        beerReviews = reviews
      }
    }

    // Get blog post if it exists
    let blogPost = null
    if (stateProgress.blog_post_id) {
      const { data: post, error: postError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', stateProgress.blog_post_id)
        .single()

      if (postError) {
        console.warn(`Could not fetch blog post for ${stateCode}:`, postError)
      } else {
        blogPost = post
      }
    }

    const result: StateWithBreweries = {
      ...stateProgress,
      breweries: breweries || [],
      beer_reviews: beerReviews,
      blog_post: blogPost
    }

    return { data: result, error: null }
  } catch (err) {
    console.error(`Exception in getStateWithDetails for ${stateCode}:`, err)
    return { data: null, error: err }
  }
}

/**
 * Get progress data organized by region
 */
export async function getProgressByRegion(): Promise<{
  data: RegionProgress[] | null
  error: any
}> {
  try {
    const { data: allStates, error } = await getAllStateProgress()
    
    if (error || !allStates) {
      return { data: null, error }
    }

    // Group states by region
    const regionMap = new Map<string, StateProgress[]>()
    
    allStates.forEach(state => {
      if (!regionMap.has(state.region)) {
        regionMap.set(state.region, [])
      }
      regionMap.get(state.region)!.push(state)
    })

    // Calculate regional progress
    const regionProgress: RegionProgress[] = Array.from(regionMap.entries()).map(([region, states]) => {
      const completed = states.filter(s => s.status === 'completed').length
      const current = states.filter(s => s.status === 'current').length
      const upcoming = states.filter(s => s.status === 'upcoming').length
      
      return {
        region,
        total_states: states.length,
        completed_states: completed,
        current_states: current,
        upcoming_states: upcoming,
        completion_percentage: Math.round((completed / states.length) * 100),
        states: states.sort((a, b) => a.week_number - b.week_number)
      }
    })

    // Sort by completion percentage (highest first)
    regionProgress.sort((a, b) => b.completion_percentage - a.completion_percentage)

    return { data: regionProgress, error: null }
  } catch (err) {
    console.error('Exception in getProgressByRegion:', err)
    return { data: null, error: err }
  }
}

/**
 * Get weekly progress timeline
 */
export async function getWeeklyTimeline(startWeek?: number, endWeek?: number): Promise<{
  data: WeeklyProgress[] | null
  error: any
}> {
  try {
    const { data: allStates, error: statesError } = await getAllStateProgress()
    
    if (statesError || !allStates) {
      return { data: null, error: statesError }
    }

    const { data: allMilestones, error: milestonesError } = await getJourneyMilestones({
      is_public: true
    })

    if (milestonesError) {
      console.warn('Could not fetch milestones for timeline:', milestonesError)
    }

    // Determine week range
    const minWeek = startWeek || 1
    const maxWeek = endWeek || 50
    const currentWeek = Math.ceil((Date.now() - new Date('2024-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000))

    const timeline: WeeklyProgress[] = []

    for (let week = minWeek; week <= maxWeek; week++) {
      const state = allStates.find(s => s.week_number === week)
      const weekMilestones = allMilestones?.filter(m => m.week_number === week) || []
      
      let analyticsSummary = null
      if (state) {
        // Get basic analytics summary for the state
        const { data: analytics } = await getStateAnalytics(state.state_code, {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          end: new Date()
        })

        if (analytics && analytics.length > 0) {
          const totalInteractions = analytics.length
          const uniqueSessions = new Set(analytics.map(a => a.session_id).filter(Boolean)).size
          const mobileCount = analytics.filter(a => a.device_type === 'mobile').length
          
          analyticsSummary = {
            state_code: state.state_code,
            state_name: state.state_name,
            total_interactions: totalInteractions,
            unique_visitors: uniqueSessions,
            avg_session_duration: analytics.reduce((sum, a) => sum + (a.duration_ms || 0), 0) / totalInteractions,
            most_common_interaction: analytics.reduce((acc, a) => {
              acc[a.interaction_type] = (acc[a.interaction_type] || 0) + 1
              return acc
            }, {} as Record<string, number>),
            peak_interaction_hour: 12, // Placeholder - would need more complex calculation
            mobile_percentage: Math.round((mobileCount / totalInteractions) * 100),
            bounce_rate: 0, // Placeholder - would need session analysis
            last_7_days_growth: 0 // Placeholder - would need historical comparison
          }
          
          analyticsSummary.most_common_interaction = Object.entries(analyticsSummary.most_common_interaction)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'click'
        }
      }

      timeline.push({
        week_number: week,
        state,
        milestones: weekMilestones,
        analytics_summary: analyticsSummary,
        is_current_week: week === currentWeek,
        is_completed: state?.status === 'completed' || false
      })
    }

    return { data: timeline, error: null }
  } catch (err) {
    console.error('Exception in getWeeklyTimeline:', err)
    return { data: null, error: err }
  }
}

/**
 * Get top performing states by engagement
 */
export async function getTopPerformingStates(limit: number = 10): Promise<{
  data: MapInteractionSummary[] | null
  error: any
}> {
  try {
    const { data: interactionSummary, error } = await getMapInteractionSummary()
    
    if (error || !interactionSummary) {
      return { data: null, error }
    }

    // Sort by total interactions and limit results
    const topStates = interactionSummary
      .sort((a, b) => b.total_interactions - a.total_interactions)
      .slice(0, limit)

    return { data: topStates, error: null }
  } catch (err) {
    console.error('Exception in getTopPerformingStates:', err)
    return { data: null, error: err }
  }
}

/**
 * Get states that need attention (low engagement, no recent updates)
 */
export async function getStatesNeedingAttention(): Promise<{
  data: StateProgress[] | null
  error: any
}> {
  try {
    const { data: allStates, error: statesError } = await getAllStateProgress()
    
    if (statesError || !allStates) {
      return { data: null, error: statesError }
    }

    const { data: interactionSummary, error: analyticsError } = await getMapInteractionSummary()
    
    if (analyticsError) {
      console.warn('Could not fetch analytics for attention analysis:', analyticsError)
    }

    const statesNeedingAttention = allStates.filter(state => {
      // Criteria for needing attention:
      // 1. Completed states with very low engagement
      // 2. States with no recent updates
      // 3. States with missing key information
      
      const interactions = interactionSummary?.find(i => i.state_code === state.state_code)
      const lowEngagement = !interactions || interactions.total_interactions < 5
      
      const staleUpdate = new Date(state.updated_at) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      const missingInfo = !state.description || 
                          state.featured_breweries.length === 0 || 
                          state.total_breweries === 0

      return lowEngagement || staleUpdate || missingInfo
    })

    // Sort by priority (completed states with issues first)
    statesNeedingAttention.sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return -1
      if (b.status === 'completed' && a.status !== 'completed') return 1
      return a.week_number - b.week_number
    })

    return { data: statesNeedingAttention, error: null }
  } catch (err) {
    console.error('Exception in getStatesNeedingAttention:', err)
    return { data: null, error: err }
  }
}

/**
 * Search states by various criteria
 */
export async function searchStates(query: {
  text?: string
  status?: string[]
  regions?: string[]
  hasBreweries?: boolean
  hasBlogPost?: boolean
  weekRange?: [number, number]
}): Promise<{
  data: StateProgress[] | null
  error: any
}> {
  try {
    const { data: allStates, error } = await getAllStateProgress()
    
    if (error || !allStates) {
      return { data: null, error }
    }

    let filteredStates = allStates

    // Text search (state name, description, featured breweries)
    if (query.text) {
      const searchTerm = query.text.toLowerCase()
      filteredStates = filteredStates.filter(state => 
        state.state_name.toLowerCase().includes(searchTerm) ||
        state.description?.toLowerCase().includes(searchTerm) ||
        state.featured_breweries.some(brewery => 
          brewery.toLowerCase().includes(searchTerm)
        )
      )
    }

    // Status filter
    if (query.status && query.status.length > 0) {
      filteredStates = filteredStates.filter(state => 
        query.status!.includes(state.status)
      )
    }

    // Region filter
    if (query.regions && query.regions.length > 0) {
      filteredStates = filteredStates.filter(state => 
        query.regions!.includes(state.region)
      )
    }

    // Has breweries filter
    if (query.hasBreweries !== undefined) {
      filteredStates = filteredStates.filter(state => 
        query.hasBreweries ? state.featured_breweries.length > 0 : state.featured_breweries.length === 0
      )
    }

    // Has blog post filter
    if (query.hasBlogPost !== undefined) {
      filteredStates = filteredStates.filter(state => 
        query.hasBlogPost ? !!state.blog_post_id : !state.blog_post_id
      )
    }

    // Week range filter
    if (query.weekRange) {
      filteredStates = filteredStates.filter(state => 
        state.week_number >= query.weekRange![0] && 
        state.week_number <= query.weekRange![1]
      )
    }

    return { data: filteredStates, error: null }
  } catch (err) {
    console.error('Exception in searchStates:', err)
    return { data: null, error: err }
  }
}

/**
 * Get dashboard summary data
 */
export async function getDashboardSummary(): Promise<{
  data: {
    overview: any
    recentMilestones: JourneyMilestone[]
    topStates: MapInteractionSummary[]
    needsAttention: StateProgress[]
    weeklyGrowth: number[]
  } | null
  error: any
}> {
  try {
    const [
      { data: overview, error: overviewError },
      { data: recentMilestones, error: milestonesError },
      { data: topStates, error: topStatesError },
      { data: needsAttention, error: attentionError }
    ] = await Promise.all([
      getProgressStatistics(),
      getJourneyMilestones({ 
        is_public: true, 
        limit: 5 
      }),
      getTopPerformingStates(5),
      getStatesNeedingAttention()
    ])

    if (overviewError) {
      return { data: null, error: overviewError }
    }

    // Calculate weekly growth (placeholder - would need historical data)
    const weeklyGrowth = Array.from({ length: 12 }, (_, i) => Math.floor(Math.random() * 100))

    const summary = {
      overview: overview || {},
      recentMilestones: recentMilestones || [],
      topStates: topStates || [],
      needsAttention: (needsAttention || []).slice(0, 5),
      weeklyGrowth
    }

    return { data: summary, error: null }
  } catch (err) {
    console.error('Exception in getDashboardSummary:', err)
    return { data: null, error: err }
  }
}


// ==================================================
// Re-export commonly used functions
// ==================================================

export {
  getAllStateProgress,
  getStateProgress,
  getStateAnalytics,
  getStateBreweries,
  getJourneyMilestones,
  getMapInteractionSummary,
  getProgressStatistics
}

// ==================================================
// Cache Management
// ==================================================

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class StateProgressCache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  clear(): void {
    this.cache.clear()
  }

  clearByPattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
}

const stateCache = new StateProgressCache()

// ==================================================
// Cached Query Functions
// ==================================================

/**
 * Get all state progress with caching
 */
export async function getCachedStateProgress(filters?: {
  status?: string
  region?: string
  week_range?: [number, number]
}) {
  const cacheKey = `all_states_${JSON.stringify(filters || {})}`
  const cached = stateCache.get<StateProgress[]>(cacheKey)
  
  if (cached) {
    return { data: cached, error: null, fromCache: true }
  }

  const result = await getAllStateProgress(filters)
  
  if (result.data && !result.error) {
    stateCache.set(cacheKey, result.data, 2 * 60 * 1000) // 2 minutes for filtered results
  }

  return { ...result, fromCache: false }
}

/**
 * Get state with details and caching
 */
export async function getCachedStateWithDetails(stateCode: string) {
  const cacheKey = `state_details_${stateCode.toUpperCase()}`
  const cached = stateCache.get<StateWithBreweries>(cacheKey)
  
  if (cached) {
    return { data: cached, error: null, fromCache: true }
  }

  const result = await getStateWithDetails(stateCode)
  
  if (result.data && !result.error) {
    stateCache.set(cacheKey, result.data, 10 * 60 * 1000) // 10 minutes for detailed state data
  }

  return { ...result, fromCache: false }
}

/**
 * Get dashboard summary with caching
 */
export async function getCachedDashboardSummary() {
  const cacheKey = 'dashboard_summary'
  const cached = stateCache.get(cacheKey)
  
  if (cached) {
    return { data: cached, error: null, fromCache: true }
  }

  const result = await getDashboardSummary()
  
  if (result.data && !result.error) {
    stateCache.set(cacheKey, result.data, 5 * 60 * 1000) // 5 minutes for dashboard
  }

  return { ...result, fromCache: false }
}

/**
 * Invalidate cache when data changes
 */
export function invalidateStateCache(stateCode?: string) {
  if (stateCode) {
    stateCache.clearByPattern(stateCode.toUpperCase())
  } else {
    stateCache.clear()
  }
}

// ==================================================
// Optimized Bulk Operations
// ==================================================

/**
 * Bulk load multiple states with details
 */
export async function bulkLoadStateDetails(stateCodes: string[]): Promise<{
  data: Record<string, StateWithBreweries> | null
  error: any
}> {
  try {
    const results = await Promise.allSettled(
      stateCodes.map(code => getStateWithDetails(code))
    )

    const stateDetails: Record<string, StateWithBreweries> = {}
    const errors: any[] = []

    results.forEach((result, index) => {
      const stateCode = stateCodes[index]
      if (result.status === 'fulfilled' && result.value.data) {
        stateDetails[stateCode] = result.value.data
      } else {
        errors.push({
          stateCode,
          error: result.status === 'rejected' ? result.reason : result.value.error
        })
      }
    })

    return {
      data: Object.keys(stateDetails).length > 0 ? stateDetails : null,
      error: errors.length > 0 ? errors : null
    }
  } catch (err) {
    console.error('Exception in bulkLoadStateDetails:', err)
    return { data: null, error: err }
  }
}

/**
 * Prefetch commonly accessed data
 */
export async function prefetchCommonData() {
  try {
    // Prefetch all states
    const statesPromise = getCachedStateProgress()
    
    // Prefetch dashboard summary
    const dashboardPromise = getCachedDashboardSummary()
    
    // Prefetch top performing states
    const topStatesPromise = getTopPerformingStates(5)
    
    // Prefetch current and recent states
    const currentWeekResult = await getCurrentJourneyWeek()
    const currentWeek = currentWeekResult.data || 1
    
    const currentStatePromise = getCachedStateProgress({
      week_range: [Math.max(1, currentWeek - 2), Math.min(50, currentWeek + 2)]
    })

    const [states, dashboard, topStates, currentStates] = await Promise.allSettled([
      statesPromise,
      dashboardPromise,
      topStatesPromise,
      currentStatePromise
    ])

    return {
      success: true,
      results: {
        states: states.status === 'fulfilled' ? states.value : null,
        dashboard: dashboard.status === 'fulfilled' ? dashboard.value : null,
        topStates: topStates.status === 'fulfilled' ? topStates.value : null,
        currentStates: currentStates.status === 'fulfilled' ? currentStates.value : null
      }
    }
  } catch (err) {
    console.error('Exception in prefetchCommonData:', err)
    return { success: false, error: err }
  }
}