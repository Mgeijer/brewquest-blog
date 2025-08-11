/**
 * State Progress Management Functions
 * 
 * Comprehensive functions for managing state progress, analytics,
 * brewery features, and journey milestones in the Hop Harrison beer journey.
 */

import { supabase } from '../client'
import { type StateData } from '../../data/stateProgress'

// ==================================================
// Type Definitions
// ==================================================

export interface StateProgress {
  id: string
  state_code: string
  state_name: string
  status: 'upcoming' | 'current' | 'completed'
  week_number: number
  blog_post_id?: string
  completion_date?: string
  featured_breweries: string[]
  total_breweries: number
  featured_beers_count: number
  region: string
  description?: string
  journey_highlights: string[]
  difficulty_rating?: number
  research_hours: number
  created_at: string
  updated_at: string
}

export interface StateAnalytics {
  id: string
  state_code: string
  interaction_type: 'hover' | 'click' | 'navigation' | 'tooltip_view' | 'mobile_tap'
  session_id?: string
  user_agent?: string
  device_type: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  source_page?: string
  timestamp: string
  duration_ms?: number
  metadata?: Record<string, any>
  ip_address?: string
  referrer?: string
}

export interface BreweryFeature {
  id: string
  state_code: string
  brewery_name: string
  brewery_type: 'microbrewery' | 'brewpub' | 'large' | 'regional' | 'contract' | 'proprietor'
  city: string
  address?: string
  website_url?: string
  founded_year?: number
  specialty_styles: string[]
  signature_beers: string[]
  brewery_description?: string
  why_featured?: string
  visit_priority: number
  social_media?: Record<string, any>
  awards: string[]
  capacity_barrels?: number
  taproom_info?: Record<string, any>
  is_active: boolean
  featured_week?: number
  created_at: string
  updated_at: string
}

export interface JourneyMilestone {
  id: string
  milestone_type: 'state_completion' | 'region_completion' | 'brewery_milestone' | 
                  'beer_milestone' | 'engagement_milestone' | 'technical_milestone' | 
                  'partnership_milestone' | 'content_milestone'
  title: string
  description: string
  state_code?: string
  week_number?: number
  milestone_date: string
  metric_value?: number
  metric_unit?: string
  celebration_level: 'minor' | 'major' | 'epic'
  social_media_posted: boolean
  blog_post_id?: string
  metadata?: Record<string, any>
  is_public: boolean
  created_at: string
}

export interface MapInteractionSummary {
  state_code: string
  state_name: string
  status: string
  region: string
  total_interactions: number
  total_clicks: number
  total_hovers: number
  unique_sessions: number
  avg_interaction_duration: number
  last_interaction: string
  mobile_interactions: number
  desktop_interactions: number
}

// ==================================================
// State Progress Functions
// ==================================================

/**
 * Get all state progress data with optional filtering
 */
export async function getAllStateProgress(filters?: {
  status?: string
  region?: string
  week_range?: [number, number]
}) {
  try {
    let query = supabase
      .from('state_progress')
      .select('*')
      .order('week_number', { ascending: true })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.region) {
      query = query.eq('region', filters.region)
    }

    if (filters?.week_range) {
      query = query.gte('week_number', filters.week_range[0])
                   .lte('week_number', filters.week_range[1])
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching state progress:', error)
      return { data: null, error }
    }

    return { data: data as StateProgress[], error: null }
  } catch (err) {
    console.error('Exception in getAllStateProgress:', err)
    return { data: null, error: err }
  }
}

/**
 * Get progress for a specific state
 */
export async function getStateProgress(stateCode: string) {
  try {
    const { data, error } = await supabase
      .from('state_progress')
      .select('*')
      .eq('state_code', stateCode.toUpperCase())
      .single()

    if (error) {
      console.error(`Error fetching state progress for ${stateCode}:`, error)
      return { data: null, error }
    }

    return { data: data as StateProgress, error: null }
  } catch (err) {
    console.error(`Exception in getStateProgress for ${stateCode}:`, err)
    return { data: null, error: err }
  }
}

/**
 * Update state progress
 */
export async function updateStateProgress(
  stateCode: string, 
  updates: Partial<StateProgress>
) {
  try {
    const { data, error } = await supabase
      .from('state_progress')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('state_code', stateCode.toUpperCase())
      .select()
      .single()

    if (error) {
      console.error(`Error updating state progress for ${stateCode}:`, error)
      return { data: null, error }
    }

    return { data: data as StateProgress, error: null }
  } catch (err) {
    console.error(`Exception in updateStateProgress for ${stateCode}:`, err)
    return { data: null, error: err }
  }
}

/**
 * Mark state as completed
 */
export async function completeState(stateCode: string, completionData?: {
  blog_post_id?: string
  featured_breweries?: string[]
  total_breweries?: number
  journey_highlights?: string[]
  difficulty_rating?: number
  research_hours?: number
}) {
  try {
    const updates = {
      status: 'completed' as const,
      completion_date: new Date().toISOString(),
      ...completionData
    }

    const result = await updateStateProgress(stateCode, updates)
    
    if (result.error) {
      return result
    }

    // Create completion milestone
    await createJourneyMilestone({
      milestone_type: 'state_completion',
      title: `${result.data?.state_name} Journey Complete!`,
      description: `Successfully completed the craft beer exploration of ${result.data?.state_name}`,
      state_code: stateCode.toUpperCase(),
      week_number: result.data?.week_number,
      celebration_level: 'major',
      social_media_posted: false,
      is_public: true,
      metadata: completionData
    })

    return result
  } catch (err) {
    console.error(`Exception in completeState for ${stateCode}:`, err)
    return { data: null, error: err }
  }
}

/**
 * Get current journey week
 */
export async function getCurrentJourneyWeek() {
  try {
    const { data, error } = await supabase
      .rpc('get_current_journey_week')

    if (error) {
      console.error('Error getting current journey week:', error)
      // Fallback calculation - BrewQuest started August 5, 2025
      const startDate = new Date('2025-08-05')
      const now = new Date()
      const weeksDiff = Math.ceil((now.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
      return { data: Math.max(1, Math.min(50, weeksDiff)), error: null }
    }

    return { data: data as number, error: null }
  } catch (err) {
    console.error('Exception in getCurrentJourneyWeek:', err)
    // Fallback calculation - BrewQuest started August 5, 2025
    const startDate = new Date('2025-08-05')
    const now = new Date()
    const weeksDiff = Math.ceil((now.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
    return { data: Math.max(1, Math.min(50, weeksDiff)), error: err }
  }
}

// ==================================================
// Analytics Functions
// ==================================================

/**
 * Track map interaction
 */
export async function trackMapInteraction(interaction: Omit<StateAnalytics, 'id' | 'timestamp'>) {
  try {
    const { data, error } = await supabase
      .from('state_analytics')
      .insert({
        ...interaction,
        timestamp: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error tracking map interaction:', error)
      return { data: null, error }
    }

    return { data: data as StateAnalytics, error: null }
  } catch (err) {
    console.error('Exception in trackMapInteraction:', err)
    return { data: null, error: err }
  }
}

/**
 * Get interaction analytics for a state
 */
export async function getStateAnalytics(
  stateCode: string, 
  timeRange?: { start: Date; end: Date }
) {
  try {
    let query = supabase
      .from('state_analytics')
      .select('*')
      .eq('state_code', stateCode.toUpperCase())
      .order('timestamp', { ascending: false })

    if (timeRange) {
      query = query.gte('timestamp', timeRange.start.toISOString())
                   .lte('timestamp', timeRange.end.toISOString())
    }

    const { data, error } = await query

    if (error) {
      console.error(`Error fetching analytics for ${stateCode}:`, error)
      return { data: null, error }
    }

    return { data: data as StateAnalytics[], error: null }
  } catch (err) {
    console.error(`Exception in getStateAnalytics for ${stateCode}:`, err)
    return { data: null, error: err }
  }
}

/**
 * Get map interaction summary with caching
 */
export async function getMapInteractionSummary(forceRefresh: boolean = false) {
  try {
    // Only refresh if forced or data is stale (check last refresh time)
    if (forceRefresh) {
      await supabase.rpc('refresh_state_progress_views')
    }

    const { data, error } = await supabase
      .from('map_interaction_summary')
      .select('*')
      .order('total_interactions', { ascending: false })

    if (error) {
      console.error('Error fetching map interaction summary:', error)
      return { data: null, error }
    }

    return { data: data as MapInteractionSummary[], error: null }
  } catch (err) {
    console.error('Exception in getMapInteractionSummary:', err)
    return { data: null, error: err }
  }
}

// ==================================================
// Brewery Features Functions
// ==================================================

/**
 * Get featured breweries for a state
 */
export async function getStateBreweries(stateCode: string) {
  try {
    const { data, error } = await supabase
      .from('brewery_features')
      .select('*')
      .eq('state_code', stateCode.toUpperCase())
      .eq('is_active', true)
      .order('visit_priority', { ascending: true })

    if (error) {
      console.error(`Error fetching breweries for ${stateCode}:`, error)
      return { data: null, error }
    }

    return { data: data as BreweryFeature[], error: null }
  } catch (err) {
    console.error(`Exception in getStateBreweries for ${stateCode}:`, err)
    return { data: null, error: err }
  }
}

/**
 * Add featured brewery to a state
 */
export async function addBreweryFeature(brewery: Omit<BreweryFeature, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('brewery_features')
      .insert(brewery)
      .select()
      .single()

    if (error) {
      console.error('Error adding brewery feature:', error)
      return { data: null, error }
    }

    return { data: data as BreweryFeature, error: null }
  } catch (err) {
    console.error('Exception in addBreweryFeature:', err)
    return { data: null, error: err }
  }
}

/**
 * Update brewery feature
 */
export async function updateBreweryFeature(
  breweryId: string, 
  updates: Partial<BreweryFeature>
) {
  try {
    const { data, error } = await supabase
      .from('brewery_features')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', breweryId)
      .select()
      .single()

    if (error) {
      console.error(`Error updating brewery feature ${breweryId}:`, error)
      return { data: null, error }
    }

    return { data: data as BreweryFeature, error: null }
  } catch (err) {
    console.error(`Exception in updateBreweryFeature for ${breweryId}:`, err)
    return { data: null, error: err }
  }
}

// ==================================================
// Journey Milestones Functions
// ==================================================

/**
 * Create a journey milestone
 */
export async function createJourneyMilestone(
  milestone: Omit<JourneyMilestone, 'id' | 'created_at'>
) {
  try {
    const { data, error } = await supabase
      .from('journey_milestones')
      .insert({
        ...milestone,
        milestone_date: milestone.milestone_date || new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating journey milestone:', error)
      return { data: null, error }
    }

    return { data: data as JourneyMilestone, error: null }
  } catch (err) {
    console.error('Exception in createJourneyMilestone:', err)
    return { data: null, error: err }
  }
}

/**
 * Get journey milestones with optional filtering
 */
export async function getJourneyMilestones(filters?: {
  milestone_type?: string
  celebration_level?: string
  state_code?: string
  is_public?: boolean
  limit?: number
}) {
  try {
    let query = supabase
      .from('journey_milestones')
      .select('*')
      .order('milestone_date', { ascending: false })

    if (filters?.milestone_type) {
      query = query.eq('milestone_type', filters.milestone_type)
    }

    if (filters?.celebration_level) {
      query = query.eq('celebration_level', filters.celebration_level)
    }

    if (filters?.state_code) {
      query = query.eq('state_code', filters.state_code.toUpperCase())
    }

    if (filters?.is_public !== undefined) {
      query = query.eq('is_public', filters.is_public)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching journey milestones:', error)
      return { data: null, error }
    }

    return { data: data as JourneyMilestone[], error: null }
  } catch (err) {
    console.error('Exception in getJourneyMilestones:', err)
    return { data: null, error: err }
  }
}

// ==================================================
// Utility Functions
// ==================================================

/**
 * Convert legacy StateData to StateProgress format
 */
export function convertStateDataToProgress(stateData: StateData): Partial<StateProgress> {
  return {
    state_code: stateData.code,
    state_name: stateData.name,
    status: stateData.status,
    week_number: stateData.weekNumber,
    featured_breweries: stateData.featuredBreweries || [],
    total_breweries: stateData.totalBreweries || 0,
    featured_beers_count: stateData.featuredBeers?.length || 0,
    region: stateData.region,
    description: stateData.description,
    journey_highlights: []
  }
}

/**
 * Get state progress statistics
 */
export async function getProgressStatistics() {
  try {
    const { data: allStates, error } = await getAllStateProgress()
    
    if (error || !allStates) {
      return { data: null, error }
    }

    const stats = {
      total_states: allStates.length,
      completed_states: allStates.filter(s => s.status === 'completed').length,
      current_state: allStates.find(s => s.status === 'current'),
      upcoming_states: allStates.filter(s => s.status === 'upcoming').length,
      total_breweries: allStates.reduce((sum, s) => sum + s.total_breweries, 0),
      total_research_hours: allStates.reduce((sum, s) => sum + s.research_hours, 0),
      regions_completed: [...new Set(
        allStates.filter(s => s.status === 'completed').map(s => s.region)
      )].length,
      completion_percentage: Math.round((allStates.filter(s => s.status === 'completed').length / allStates.length) * 100)
    }

    return { data: stats, error: null }
  } catch (err) {
    console.error('Exception in getProgressStatistics:', err)
    return { data: null, error: err }
  }
}

/**
 * Sync local state data with database
 */
export async function syncStateDataWithDatabase(stateDataArray: StateData[]) {
  try {
    const results = []
    
    for (const stateData of stateDataArray) {
      const progressData = convertStateDataToProgress(stateData)
      
      // Try to update existing record, or insert if not exists
      const { data, error } = await supabase
        .from('state_progress')
        .upsert(progressData, { 
          onConflict: 'state_code',
          ignoreDuplicates: false 
        })
        .select()
        .single()

      if (error) {
        console.error(`Error syncing state ${stateData.code}:`, error)
        results.push({ stateCode: stateData.code, success: false, error })
      } else {
        results.push({ stateCode: stateData.code, success: true, data })
      }
    }

    return { data: results, error: null }
  } catch (err) {
    console.error('Exception in syncStateDataWithDatabase:', err)
    return { data: null, error: err }
  }
}

// ==================================================
// Real-time Subscriptions (Supabase Specialist Recommendations)
// ==================================================

/**
 * Subscribe to state progress changes
 */
export function subscribeToStateChanges(callback: (payload: any) => void) {
  return supabase
    .channel('state-progress-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'state_progress'
    }, callback)
    .subscribe()
}

/**
 * Subscribe to journey milestone changes
 */
export function subscribeToMilestoneChanges(callback: (payload: any) => void) {
  return supabase
    .channel('milestone-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'journey_milestones'
    }, callback)
    .subscribe()
}

/**
 * Subscribe to analytics events (for real-time dashboards)
 */
export function subscribeToAnalyticsEvents(callback: (payload: any) => void) {
  return supabase
    .channel('analytics-events')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'state_analytics'
    }, callback)
    .subscribe()
}

// ==================================================
// Database Health and Monitoring Functions
// ==================================================

/**
 * Get comprehensive database health metrics
 */
export async function getDatabaseHealth() {
  try {
    const { data, error } = await supabase.rpc('get_database_health')

    if (error) {
      console.error('Error fetching database health:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Exception in getDatabaseHealth:', err)
    return { data: null, error: err }
  }
}

/**
 * Get state engagement summary for analytics dashboard
 */
export async function getStateEngagementSummary(timePeriodHours: number = 24) {
  try {
    const { data, error } = await supabase.rpc('get_state_engagement_summary', {
      time_period_hours: timePeriodHours
    })

    if (error) {
      console.error('Error fetching engagement summary:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Exception in getStateEngagementSummary:', err)
    return { data: null, error: err }
  }
}

// ==================================================
// Bulk Operations for Performance
// ==================================================

/**
 * Bulk insert analytics events for better performance
 */
export async function bulkTrackMapInteractions(interactions: Omit<StateAnalytics, 'id' | 'timestamp'>[]) {
  try {
    const timestamp = new Date().toISOString()
    const enrichedInteractions = interactions.map(interaction => ({
      ...interaction,
      timestamp
    }))

    const { data, error } = await supabase
      .from('state_analytics')
      .insert(enrichedInteractions)
      .select()

    if (error) {
      console.error('Error bulk tracking interactions:', error)
      return { data: null, error }
    }

    return { data: data as StateAnalytics[], error: null }
  } catch (err) {
    console.error('Exception in bulkTrackMapInteractions:', err)
    return { data: null, error: err }
  }
}

/**
 * Bulk update brewery features
 */
export async function bulkUpdateBreweryFeatures(updates: Array<{
  id: string
  updates: Partial<BreweryFeature>
}>) {
  try {
    const results = []
    
    for (const update of updates) {
      const result = await updateBreweryFeature(update.id, update.updates)
      results.push(result)
    }

    return { data: results, error: null }
  } catch (err) {
    console.error('Exception in bulkUpdateBreweryFeatures:', err)
    return { data: null, error: err }
  }
}

// ==================================================
// Enhanced Analytics Functions
// ==================================================

/**
 * Get journey statistics from database function
 */
export async function getJourneyStatistics() {
  try {
    const { data, error } = await supabase.rpc('get_journey_statistics')

    if (error) {
      console.error('Error fetching journey statistics:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Exception in getJourneyStatistics:', err)
    return { data: null, error: err }
  }
}

/**
 * Bulk track multiple interactions (for performance)
 */
export async function bulkTrackInteractions(interactions: Omit<StateAnalytics, 'id' | 'timestamp'>[]) {
  try {
    const timestampedInteractions = interactions.map(interaction => ({
      ...interaction,
      timestamp: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('state_analytics')
      .insert(timestampedInteractions)
      .select()

    if (error) {
      console.error('Error bulk tracking interactions:', error)
      return { data: null, error }
    }

    return { data: data as StateAnalytics[], error: null }
  } catch (err) {
    console.error('Exception in bulkTrackInteractions:', err)
    return { data: null, error: err }
  }
}

/**
 * Get analytics summary for dashboard
 */
export async function getAnalyticsSummary(timeRange?: { days: number }) {
  try {
    const days = timeRange?.days || 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('state_analytics')
      .select(`
        state_code,
        interaction_type,
        device_type,
        timestamp,
        duration_ms,
        session_id
      `)
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching analytics summary:', error)
      return { data: null, error }
    }

    // Process the data for summary statistics
    const summary = {
      total_interactions: data.length,
      unique_sessions: new Set(data.map(d => d.session_id).filter(Boolean)).size,
      interactions_by_type: data.reduce((acc, d) => {
        acc[d.interaction_type] = (acc[d.interaction_type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      interactions_by_device: data.reduce((acc, d) => {
        acc[d.device_type] = (acc[d.device_type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      top_states: Object.entries(
        data.reduce((acc, d) => {
          acc[d.state_code] = (acc[d.state_code] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      )
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([state, count]) => ({ state, count })),
      avg_session_duration: data.filter(d => d.duration_ms).length > 0 
        ? data.filter(d => d.duration_ms).reduce((sum, d) => sum + (d.duration_ms || 0), 0) / data.filter(d => d.duration_ms).length
        : 0
    }

    return { data: summary, error: null }
  } catch (err) {
    console.error('Exception in getAnalyticsSummary:', err)
    return { data: null, error: err }
  }
}

/**
 * Get audit trail for a specific record
 */
export async function getAuditTrail(tableName: string, recordId: string) {
  try {
    const { data, error } = await supabase
      .from('state_progress_audit')
      .select(`
        *,
        auth_users:changed_by (
          email,
          raw_user_meta_data
        )
      `)
      .eq('table_name', tableName)
      .eq('record_id', recordId)
      .order('changed_at', { ascending: false })

    if (error) {
      console.error('Error fetching audit trail:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Exception in getAuditTrail:', err)
    return { data: null, error: err }
  }
}