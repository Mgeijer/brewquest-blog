/**
 * PUT /api/admin/states/update
 * Admin-only endpoint for updating state progress with real-time notifications
 * 
 * Features:
 * - Admin authentication with service role key
 * - Comprehensive state updates (progress, breweries, milestones)
 * - Real-time triggers via Supabase subscriptions
 * - Audit trail for all changes
 * - Rate limiting for admin operations
 * - Comprehensive validation and error handling
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { 
  updateStateProgress,
  completeState,
  createJourneyMilestone,
  addBreweryFeature,
  updateBreweryFeature,
  type StateProgress,
  type BreweryFeature,
  type JourneyMilestone
} from '@/lib/supabase/functions/stateProgressFunctions'
import { invalidateStateCache } from '@/lib/supabase/queries/stateQueries'
import { 
  getClientIdentifier, 
  checkAdminRateLimit,
  createRateLimitHeaders 
} from '@/lib/utils/rateLimiting'

// Valid state codes for validation
const VALID_STATE_CODES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

// Request interfaces
interface StateUpdateRequest {
  state_code: string
  updates: {
    state_progress?: Partial<StateProgress>
    breweries?: {
      add?: Omit<BreweryFeature, 'id' | 'created_at' | 'updated_at'>[]
      update?: Array<{ id: string; updates: Partial<BreweryFeature> }>
      remove?: string[]
    }
    milestones?: {
      add?: Omit<JourneyMilestone, 'id' | 'created_at'>[]
    }
    complete_state?: {
      blog_post_id?: string
      featured_breweries?: string[]
      total_breweries?: number
      journey_highlights?: string[]
      difficulty_rating?: number
      research_hours?: number
    }
  }
  trigger_realtime?: boolean
  admin_notes?: string
}

interface AdminUpdateResponse {
  success: boolean
  state_code: string
  updates_applied: {
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
  request_id: string
  timestamp: string
  cache_invalidated: boolean
  realtime_triggered: boolean
}

interface ErrorResponse {
  error: string
  code: string
  timestamp: string
  request_id: string
  state_code?: string
  details?: any
}

/**
 * Verify admin authorization
 */
async function verifyAdminAuth(request: NextRequest): Promise<{
  authorized: boolean
  user?: any
  error?: string
}> {
  try {
    // Check for Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { 
        authorized: false, 
        error: 'Missing or invalid Authorization header' 
      }
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify JWT token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      return { 
        authorized: false, 
        error: 'Invalid authentication token' 
      }
    }

    // Check user role (you can customize this based on your user metadata structure)
    const userRole = user.user_metadata?.role || user.app_metadata?.role
    if (userRole !== 'admin' && userRole !== 'editor') {
      return { 
        authorized: false, 
        error: 'Insufficient permissions (admin or editor role required)' 
      }
    }

    return { authorized: true, user }
  } catch (authError) {
    console.error('Admin auth verification error:', authError)
    return { 
      authorized: false, 
      error: 'Authentication verification failed' 
    }
  }
}

/**
 * Trigger real-time updates via Supabase channel
 */
async function triggerRealtimeUpdate(stateCode: string, updateType: string, data: any): Promise<void> {
  try {
    // Send real-time notification through Supabase
    const channel = supabaseAdmin.channel('state-updates')
    await channel.send({
      type: 'broadcast',
      event: 'state_updated',
      payload: {
        state_code: stateCode,
        update_type: updateType,
        timestamp: new Date().toISOString(),
        data
      }
    })
  } catch (error) {
    console.error('Failed to trigger real-time update:', error)
    // Don't fail the request if real-time fails
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID()
  const startTime = Date.now()

  try {
    // Verify admin authorization
    const authResult = await verifyAdminAuth(request)
    if (!authResult.authorized) {
      return NextResponse.json(
        {
          error: authResult.error || 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
          request_id: requestId
        } as ErrorResponse,
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Check rate limits for admin operations
    const clientIdentifier = getClientIdentifier(request)
    const rateLimitResult = checkAdminRateLimit(clientIdentifier)

    if (!rateLimitResult.allowed) {
      const headers = {
        'Content-Type': 'application/json',
        ...createRateLimitHeaders(rateLimitResult)
      }
      
      return NextResponse.json(
        {
          error: 'Admin rate limit exceeded',
          code: 'ADMIN_RATE_LIMIT_EXCEEDED',
          timestamp: new Date().toISOString(),
          request_id: requestId,
          details: {
            retry_after: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
          }
        } as ErrorResponse,
        { 
          status: 429,
          headers
        }
      )
    }

    // Parse request body
    let body: StateUpdateRequest
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        {
          error: 'Invalid JSON in request body',
          code: 'INVALID_JSON',
          timestamp: new Date().toISOString(),
          request_id: requestId
        } as ErrorResponse,
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate required fields
    if (!body.state_code) {
      return NextResponse.json(
        {
          error: 'Missing state_code',
          code: 'MISSING_STATE_CODE',
          timestamp: new Date().toISOString(),
          request_id: requestId
        } as ErrorResponse,
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate state code
    const normalizedStateCode = body.state_code.toUpperCase()
    if (!VALID_STATE_CODES.includes(normalizedStateCode)) {
      return NextResponse.json(
        {
          error: 'Invalid state code',
          code: 'INVALID_STATE_CODE',
          timestamp: new Date().toISOString(),
          request_id: requestId,
          state_code: body.state_code
        } as ErrorResponse,
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    if (!body.updates) {
      return NextResponse.json(
        {
          error: 'Missing updates object',
          code: 'MISSING_UPDATES',
          timestamp: new Date().toISOString(),
          request_id: requestId,
          state_code: normalizedStateCode
        } as ErrorResponse,
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Track what updates were applied
    const updatesApplied: AdminUpdateResponse['updates_applied'] = {
      breweries: { added: 0, updated: 0, removed: 0 },
      milestones: { added: 0 }
    }

    // Apply state progress updates
    if (body.updates.state_progress) {
      const { error: stateUpdateError } = await updateStateProgress(
        normalizedStateCode, 
        body.updates.state_progress
      )
      
      if (stateUpdateError) {
        console.error('Failed to update state progress:', stateUpdateError)
        return NextResponse.json(
          {
            error: 'Failed to update state progress',
            code: 'STATE_UPDATE_ERROR',
            timestamp: new Date().toISOString(),
            request_id: requestId,
            state_code: normalizedStateCode,
            details: stateUpdateError
          } as ErrorResponse,
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
      
      updatesApplied.state_progress = true
    }

    // Complete state if requested
    if (body.updates.complete_state) {
      const { error: completeError } = await completeState(
        normalizedStateCode,
        body.updates.complete_state
      )
      
      if (completeError) {
        console.error('Failed to complete state:', completeError)
        return NextResponse.json(
          {
            error: 'Failed to complete state',
            code: 'STATE_COMPLETION_ERROR',
            timestamp: new Date().toISOString(),
            request_id: requestId,
            state_code: normalizedStateCode,
            details: completeError
          } as ErrorResponse,
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
      
      updatesApplied.completed = true
    }

    // Handle brewery updates
    if (body.updates.breweries) {
      const breweryUpdates = body.updates.breweries

      // Add new breweries
      if (breweryUpdates.add && breweryUpdates.add.length > 0) {
        for (const brewery of breweryUpdates.add) {
          const { error: addError } = await addBreweryFeature({
            ...brewery,
            state_code: normalizedStateCode
          })
          
          if (!addError) {
            updatesApplied.breweries!.added++
          } else {
            console.error('Failed to add brewery:', addError)
          }
        }
      }

      // Update existing breweries
      if (breweryUpdates.update && breweryUpdates.update.length > 0) {
        for (const update of breweryUpdates.update) {
          const { error: updateError } = await updateBreweryFeature(
            update.id,
            update.updates
          )
          
          if (!updateError) {
            updatesApplied.breweries!.updated++
          } else {
            console.error('Failed to update brewery:', updateError)
          }
        }
      }

      // Remove breweries (soft delete by setting is_active = false)
      if (breweryUpdates.remove && breweryUpdates.remove.length > 0) {
        for (const breweryId of breweryUpdates.remove) {
          const { error: removeError } = await updateBreweryFeature(
            breweryId,
            { is_active: false }
          )
          
          if (!removeError) {
            updatesApplied.breweries!.removed++
          } else {
            console.error('Failed to remove brewery:', removeError)
          }
        }
      }
    }

    // Add milestones
    if (body.updates.milestones?.add && body.updates.milestones.add.length > 0) {
      for (const milestone of body.updates.milestones.add) {
        const { error: milestoneError } = await createJourneyMilestone({
          ...milestone,
          state_code: normalizedStateCode
        })
        
        if (!milestoneError) {
          updatesApplied.milestones!.added++
        } else {
          console.error('Failed to add milestone:', milestoneError)
        }
      }
    }

    // Invalidate cache for the updated state
    invalidateStateCache(normalizedStateCode)

    // Trigger real-time updates if requested
    let realtimeTriggered = false
    if (body.trigger_realtime !== false) { // Default to true
      try {
        await triggerRealtimeUpdate(normalizedStateCode, 'admin_update', {
          updates_applied: updatesApplied,
          admin_user: authResult.user?.email,
          admin_notes: body.admin_notes
        })
        realtimeTriggered = true
      } catch (realtimeError) {
        console.error('Failed to trigger real-time update:', realtimeError)
      }
    }

    // Build success response
    const response: AdminUpdateResponse = {
      success: true,
      state_code: normalizedStateCode,
      updates_applied: updatesApplied,
      request_id: requestId,
      timestamp: new Date().toISOString(),
      cache_invalidated: true,
      realtime_triggered: realtimeTriggered
    }

    // Set response headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      'X-Response-Time': `${Date.now() - startTime}ms`,
      'X-Admin-User': authResult.user?.email || 'unknown',
      ...createRateLimitHeaders(rateLimitResult)
    })

    return NextResponse.json(response, {
      status: 200,
      headers
    })

  } catch (error) {
    console.error('Unexpected error in admin/states/update API:', error)
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
        request_id: requestId
      } as ErrorResponse,
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId,
          'X-Response-Time': `${Date.now() - startTime}ms`
        }
      }
    )
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  })
}