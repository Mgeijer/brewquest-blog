/**
 * API Response and Error Types for State Progress API Routes
 * 
 * Comprehensive TypeScript interfaces for all API endpoints, responses,
 * and error handling in the Hop Harrison beer blog state progress system.
 */

import { 
  StateProgress, 
  StateAnalytics, 
  BreweryFeature, 
  JourneyMilestone 
} from '@/lib/supabase/functions/stateProgressFunctions'
import { StateWithBreweries } from '@/lib/supabase/queries/stateQueries'

// ==================================================
// Base API Response Types
// ==================================================

export interface BaseApiResponse {
  timestamp: string
  request_id: string
}

export interface SuccessResponse<T = any> extends BaseApiResponse {
  success: true
  data: T
  metadata?: Record<string, any>
}

export interface ErrorResponse extends BaseApiResponse {
  success: false
  error: string
  code: string
  details?: any
  state_code?: string
}

export interface PaginatedResponse<T = any> extends BaseApiResponse {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    has_next: boolean
    has_previous: boolean
  }
}

// ==================================================
// Rate Limiting Types
// ==================================================

export interface RateLimitInfo {
  limit: number
  remaining: number
  reset_time: number
  retry_after?: number
}

export interface RateLimitHeaders {
  'X-RateLimit-Limit': string
  'X-RateLimit-Remaining': string
  'X-RateLimit-Reset': string
  'Retry-After'?: string
}

// ==================================================
// States Progress API Types (/api/states/progress)
// ==================================================

export interface StateProgressFilters {
  status?: 'upcoming' | 'current' | 'completed'
  region?: string
  week_start?: number
  week_end?: number
  format?: 'basic' | 'detailed' | 'summary'
  include_stats?: boolean
}

export interface StateProgressMetadata {
  total_count: number
  filtered_count: number
  cache_hit: boolean
  response_format: string
  generated_at: string
  filters_applied: Record<string, any>
}

export interface StateProgressStatistics {
  total_states: number
  completed_states: number
  current_states: number
  upcoming_states: number
  completion_percentage: number
  regions_completed: number
  total_breweries?: number
  total_research_hours?: number
}

export interface StateProgressResponse extends BaseApiResponse {
  states: StateProgress[]
  metadata: StateProgressMetadata
  statistics?: StateProgressStatistics
}

// ==================================================
// State Detail API Types (/api/states/[stateCode])
// ==================================================

export interface StateDetailFilters {
  format?: 'basic' | 'detailed' | 'minimal'
  track_analytics?: boolean
  include_breweries?: boolean
  include_blog_post?: boolean
}

export interface StateDetailMetadata {
  request_time: string
  cache_hit: boolean
  response_format: string
  analytics_tracked: boolean
  request_id: string
}

export interface StateDetailResponse extends BaseApiResponse {
  state: StateWithBreweries
  metadata: StateDetailMetadata
}

// ==================================================
// Analytics API Types (/api/states/analytics)
// ==================================================

export type InteractionType = 'hover' | 'click' | 'navigation' | 'tooltip_view' | 'mobile_tap'
export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'unknown'

export interface AnalyticsInteraction {
  state_code: string
  interaction_type: InteractionType
  session_id?: string
  device_type?: DeviceType
  source_page?: string
  duration_ms?: number
  metadata?: Record<string, any>
}

export interface BulkAnalyticsRequest {
  interactions: AnalyticsInteraction[]
  session_info?: {
    session_id: string
    user_agent?: string
    device_type?: DeviceType
  }
}

export interface AnalyticsResponse extends BaseApiResponse {
  success: boolean
  tracked_count: number
  session_id: string
  rate_limit?: RateLimitInfo
}

export interface AnalyticsValidationError {
  interaction_index: number
  field: string
  message: string
  provided_value?: any
}

export interface AnalyticsErrorResponse extends ErrorResponse {
  details?: {
    errors?: string[]
    validation_errors?: AnalyticsValidationError[]
    valid_interactions?: number
    total_interactions?: number
    retry_after?: number
    limit_type?: 'session' | 'ip'
  }
}

// ==================================================
// Admin Update API Types (/api/admin/states/update)
// ==================================================

export interface BreweryUpdateOperations {
  add?: Omit<BreweryFeature, 'id' | 'created_at' | 'updated_at'>[]
  update?: Array<{ 
    id: string
    updates: Partial<BreweryFeature> 
  }>
  remove?: string[]
}

export interface MilestoneUpdateOperations {
  add?: Omit<JourneyMilestone, 'id' | 'created_at'>[]
}

export interface StateCompletionData {
  blog_post_id?: string
  featured_breweries?: string[]
  total_breweries?: number
  journey_highlights?: string[]
  difficulty_rating?: number
  research_hours?: number
}

export interface StateUpdateOperations {
  state_progress?: Partial<StateProgress>
  breweries?: BreweryUpdateOperations
  milestones?: MilestoneUpdateOperations
  complete_state?: StateCompletionData
}

export interface AdminUpdateRequest {
  state_code: string
  updates: StateUpdateOperations
  trigger_realtime?: boolean
  admin_notes?: string
}

export interface AdminUpdateResults {
  state_progress?: boolean
  breweries?: {
    added: number
    updated: number
    removed: number
  }
  milestones?: {
    added: number
  }
  completed?: boolean
}

export interface AdminUpdateResponse extends BaseApiResponse {
  success: boolean
  state_code: string
  updates_applied: AdminUpdateResults
  cache_invalidated: boolean
  realtime_triggered: boolean
}

export interface AdminAuthInfo {
  authorized: boolean
  user?: {
    id: string
    email?: string
    role?: string
  }
  error?: string
}

// ==================================================
// Real-time Update Types
// ==================================================

export interface RealtimePayload {
  state_code: string
  update_type: string
  timestamp: string
  data: any
}

export interface RealtimeStateUpdate extends RealtimePayload {
  update_type: 'admin_update' | 'state_completion' | 'brewery_added' | 'milestone_created'
  data: {
    updates_applied?: AdminUpdateResults
    admin_user?: string
    admin_notes?: string
  }
}

// ==================================================
// Cache and Performance Types
// ==================================================

export interface CacheMetadata {
  cached: boolean
  cache_key?: string
  ttl?: number
  generated_at: string
}

export interface PerformanceMetrics {
  response_time_ms: number
  database_query_time?: number
  cache_hit?: boolean
  queries_executed?: number
}

export interface ApiPerformanceHeaders {
  'X-Response-Time': string
  'X-Cache-Hit': string
  'X-Request-ID': string
  'ETag'?: string
  'Cache-Control'?: string
}

// ==================================================
// Validation and Error Detail Types
// ==================================================

export interface ValidationError {
  field: string
  message: string
  code: string
  provided_value?: any
}

export interface DetailedErrorResponse extends ErrorResponse {
  details: {
    validation_errors?: ValidationError[]
    field_errors?: Record<string, string[]>
    constraint_violations?: string[]
    database_error?: {
      code: string
      message: string
      details?: string
    }
  }
}

// ==================================================
// Query Parameter Types
// ==================================================

export interface StateProgressQueryParams {
  status?: string
  region?: string
  week_start?: string
  week_end?: string
  format?: string
  include_stats?: string
}

export interface StateDetailQueryParams {
  format?: string
  track_analytics?: string
  include_breweries?: string
  include_blog_post?: string
}

export interface PaginationQueryParams {
  page?: string
  limit?: string
  sort?: string
  order?: 'asc' | 'desc'
}

// ==================================================
// HTTP Header Types
// ==================================================

export interface CorsHeaders {
  'Access-Control-Allow-Origin': string
  'Access-Control-Allow-Methods': string
  'Access-Control-Allow-Headers': string
  'Access-Control-Max-Age'?: string
}

export interface SecurityHeaders {
  'X-Content-Type-Options': string
  'X-Frame-Options': string
  'X-XSS-Protection': string
  'Referrer-Policy': string
}

export interface ApiResponseHeaders extends ApiPerformanceHeaders, RateLimitHeaders, CorsHeaders {
  'Content-Type': string
}

// ==================================================
// Analytics Dashboard Types
// ==================================================

export interface AnalyticsDashboardData {
  summary: {
    total_interactions: number
    unique_sessions: number
    avg_session_duration: number
    top_states: Array<{ state_code: string; count: number }>
  }
  time_series: Array<{
    timestamp: string
    interactions: number
    unique_users: number
  }>
  device_breakdown: Record<DeviceType, number>
  interaction_breakdown: Record<InteractionType, number>
}

export interface StateEngagementMetrics {
  state_code: string
  state_name: string
  total_interactions: number
  unique_visitors: number
  avg_session_duration: number
  bounce_rate: number
  conversion_rate: number
  trending_score: number
}

// ==================================================
// Batch Operation Types
// ==================================================

export interface BatchOperationRequest<T> {
  operations: T[]
  options?: {
    continue_on_error?: boolean
    return_results?: boolean
    validate_only?: boolean
  }
}

export interface BatchOperationResult<T> {
  success: boolean
  total_operations: number
  successful_operations: number
  failed_operations: number
  results?: T[]
  errors?: Array<{
    index: number
    error: string
    code: string
  }>
}

// ==================================================
// Webhook and Integration Types
// ==================================================

export interface WebhookPayload {
  event: string
  timestamp: string
  data: any
  signature?: string
}

export interface StateUpdateWebhook extends WebhookPayload {
  event: 'state.updated' | 'state.completed' | 'brewery.added' | 'milestone.created'
  data: {
    state_code: string
    changes: Record<string, any>
    metadata: Record<string, any>
  }
}

// ==================================================
// Export grouped types for convenience
// ==================================================

export type ApiRequest = 
  | AdminUpdateRequest 
  | BulkAnalyticsRequest 
  | AnalyticsInteraction

export type ApiResponse = 
  | StateProgressResponse 
  | StateDetailResponse 
  | AnalyticsResponse 
  | AdminUpdateResponse
  | ErrorResponse

export type ApiErrorCode = 
  | 'INVALID_STATE_CODE'
  | 'INVALID_FORMAT'
  | 'INVALID_JSON'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'UNAUTHORIZED'
  | 'DATABASE_ERROR'
  | 'INTERNAL_ERROR'
  | 'STATE_NOT_FOUND'
  | 'MISSING_REQUIRED_FIELD'
  | 'BULK_LIMIT_EXCEEDED'
  | 'ADMIN_RATE_LIMIT_EXCEEDED'

// ==================================================
// Type Guards and Utility Types
// ==================================================

export function isErrorResponse(response: any): response is ErrorResponse {
  return response && typeof response === 'object' && 'error' in response && 'code' in response
}

export function isSuccessResponse<T>(response: any): response is SuccessResponse<T> {
  return response && typeof response === 'object' && response.success === true
}

export function isBulkAnalyticsRequest(request: any): request is BulkAnalyticsRequest {
  return request && typeof request === 'object' && 'interactions' in request
}

export function isValidStateCode(code: string): boolean {
  const VALID_STATE_CODES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]
  return VALID_STATE_CODES.includes(code.toUpperCase())
}

export function isValidInteractionType(type: string): type is InteractionType {
  const VALID_TYPES: InteractionType[] = ['hover', 'click', 'navigation', 'tooltip_view', 'mobile_tap']
  return VALID_TYPES.includes(type as InteractionType)
}

export function isValidDeviceType(type: string): type is DeviceType {
  const VALID_TYPES: DeviceType[] = ['desktop', 'mobile', 'tablet', 'unknown']
  return VALID_TYPES.includes(type as DeviceType)
}