/**
 * POST /api/states/analytics
 * Track user interactions with state map and other components
 * 
 * Features:
 * - Rate limiting to prevent abuse
 * - Session-based tracking for better analytics
 * - Bulk interaction tracking for performance
 * - Comprehensive validation and sanitization
 * - Real-time analytics integration
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  trackMapInteraction, 
  bulkTrackInteractions,
  type StateAnalytics 
} from '@/lib/supabase/functions/stateProgressFunctions'
import { 
  getClientIdentifier, 
  checkAnalyticsRateLimit,
  checkSessionRateLimit,
  createRateLimitHeaders,
  trackRateLimitEvent
} from '@/lib/utils/rateLimiting'

// Valid interaction types
const VALID_INTERACTION_TYPES = [
  'hover', 'click', 'navigation', 'tooltip_view', 'mobile_tap'
] as const

// Valid device types
const VALID_DEVICE_TYPES = [
  'desktop', 'mobile', 'tablet', 'unknown'
] as const

// US state codes for validation
const VALID_STATE_CODES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

// Request interfaces
interface SingleAnalyticsRequest {
  state_code: string
  interaction_type: typeof VALID_INTERACTION_TYPES[number]
  session_id?: string
  device_type?: typeof VALID_DEVICE_TYPES[number]
  source_page?: string
  duration_ms?: number
  metadata?: Record<string, any>
}

interface BulkAnalyticsRequest {
  interactions: SingleAnalyticsRequest[]
  session_info?: {
    session_id: string
    user_agent?: string
    device_type?: typeof VALID_DEVICE_TYPES[number]
  }
}

interface AnalyticsResponse {
  success: boolean
  tracked_count: number
  session_id: string
  request_id: string
  timestamp: string
  rate_limit?: {
    remaining: number
    reset_time: number
  }
}

interface ErrorResponse {
  error: string
  code: string
  timestamp: string
  request_id: string
  details?: any
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID()
  const startTime = Date.now()

  try {
    // Get client identifier for rate limiting
    const clientIdentifier = getClientIdentifier(request)
    
    // Parse request body
    let body: SingleAnalyticsRequest | BulkAnalyticsRequest
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

    // Determine if this is a bulk request
    const isBulkRequest = 'interactions' in body
    const interactions = isBulkRequest ? body.interactions : [body as SingleAnalyticsRequest]

    // Validate request structure
    if (isBulkRequest && (!Array.isArray(interactions) || interactions.length === 0)) {
      return NextResponse.json(
        {
          error: 'Bulk request must contain non-empty interactions array',
          code: 'INVALID_BULK_REQUEST',
          timestamp: new Date().toISOString(),
          request_id: requestId
        } as ErrorResponse,
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Limit bulk requests to prevent abuse
    if (interactions.length > 50) {
      return NextResponse.json(
        {
          error: 'Too many interactions in bulk request (max 50)',
          code: 'BULK_LIMIT_EXCEEDED',
          timestamp: new Date().toISOString(),
          request_id: requestId
        } as ErrorResponse,
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Extract session information
    const sessionId = isBulkRequest 
      ? (body as BulkAnalyticsRequest).session_info?.session_id 
      : (body as SingleAnalyticsRequest).session_id

    // Check rate limits (different limits for sessions vs IPs)
    const rateLimitResult = sessionId 
      ? checkSessionRateLimit(clientIdentifier, sessionId)
      : checkAnalyticsRateLimit(clientIdentifier)

    // Track rate limit event
    trackRateLimitEvent(
      clientIdentifier,
      '/api/states/analytics',
      !rateLimitResult.allowed,
      rateLimitResult.totalRequests
    )

    if (!rateLimitResult.allowed) {
      const headers = {
        'Content-Type': 'application/json',
        ...createRateLimitHeaders(rateLimitResult)
      }
      
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          timestamp: new Date().toISOString(),
          request_id: requestId,
          details: {
            retry_after: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
            limit_type: sessionId ? 'session' : 'ip'
          }
        } as ErrorResponse,
        { 
          status: 429,
          headers
        }
      )
    }

    // Validate and sanitize each interaction
    const validInteractions: Omit<StateAnalytics, 'id' | 'timestamp'>[] = []
    const validationErrors: string[] = []

    for (let i = 0; i < interactions.length; i++) {
      const interaction = interactions[i]
      const interactionIndex = `[${i}]`

      // Validate required fields
      if (!interaction.state_code) {
        validationErrors.push(`${interactionIndex} Missing state_code`)
        continue
      }

      if (!interaction.interaction_type) {
        validationErrors.push(`${interactionIndex} Missing interaction_type`)
        continue
      }

      // Validate state code
      const normalizedStateCode = interaction.state_code.toUpperCase()
      if (!VALID_STATE_CODES.includes(normalizedStateCode)) {
        validationErrors.push(`${interactionIndex} Invalid state_code: ${interaction.state_code}`)
        continue
      }

      // Validate interaction type
      if (!VALID_INTERACTION_TYPES.includes(interaction.interaction_type)) {
        validationErrors.push(`${interactionIndex} Invalid interaction_type: ${interaction.interaction_type}`)
        continue
      }

      // Get request metadata
      const userAgent = request.headers.get('user-agent') || 'Unknown'
      const referrer = request.headers.get('referer') || request.headers.get('referrer')
      const forwardedFor = request.headers.get('x-forwarded-for')
      const realIp = request.headers.get('x-real-ip')
      const ipAddress = forwardedFor?.split(',')[0] || realIp || '0.0.0.0'

      // Determine device type (from request or user agent)
      let deviceType = interaction.device_type
      if (!deviceType || !VALID_DEVICE_TYPES.includes(deviceType)) {
        deviceType = userAgent.toLowerCase().includes('mobile') ? 'mobile' :
                    userAgent.toLowerCase().includes('tablet') ? 'tablet' : 'desktop'
      }

      // Generate session ID if not provided
      const finalSessionId = sessionId || 
                            interaction.session_id || 
                            `${ipAddress}-${userAgent}-${new Date().toDateString()}`

      // Sanitize and limit metadata
      let metadata = interaction.metadata
      if (metadata && typeof metadata === 'object') {
        // Limit metadata size and sanitize
        const metadataString = JSON.stringify(metadata)
        if (metadataString.length > 5000) {
          metadata = { error: 'Metadata too large' }
        }
      }

      // Validate duration
      const durationMs = interaction.duration_ms
      if (durationMs !== undefined && (durationMs < 0 || durationMs > 300000)) {
        validationErrors.push(`${interactionIndex} Invalid duration_ms: ${durationMs} (must be 0-300000)`)
        continue
      }

      // Create validated interaction
      validInteractions.push({
        state_code: normalizedStateCode,
        interaction_type: interaction.interaction_type,
        session_id: finalSessionId,
        user_agent: userAgent,
        device_type: deviceType,
        source_page: interaction.source_page || 'unknown',
        duration_ms: durationMs,
        metadata: {
          ...metadata,
          request_id: requestId,
          bulk_request: isBulkRequest,
          client_identifier: clientIdentifier
        },
        ip_address: ipAddress,
        referrer: referrer || undefined
      })
    }

    // Return validation errors if any
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          timestamp: new Date().toISOString(),
          request_id: requestId,
          details: {
            errors: validationErrors,
            valid_interactions: validInteractions.length,
            total_interactions: interactions.length
          }
        } as ErrorResponse,
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Track interactions in database
    let trackingResult
    if (validInteractions.length === 1) {
      trackingResult = await trackMapInteraction(validInteractions[0])
    } else {
      trackingResult = await bulkTrackInteractions(validInteractions)
    }

    if (trackingResult.error) {
      console.error('Failed to track interactions:', trackingResult.error)
      return NextResponse.json(
        {
          error: 'Failed to save analytics data',
          code: 'DATABASE_ERROR',
          timestamp: new Date().toISOString(),
          request_id: requestId
        } as ErrorResponse,
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Build success response
    const response: AnalyticsResponse = {
      success: true,
      tracked_count: validInteractions.length,
      session_id: validInteractions[0]?.session_id || 'unknown',
      request_id: requestId,
      timestamp: new Date().toISOString(),
      rate_limit: {
        remaining: rateLimitResult.remainingRequests,
        reset_time: rateLimitResult.resetTime
      }
    }

    // Set response headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      'X-Response-Time': `${Date.now() - startTime}ms`,
      'X-Tracked-Count': String(validInteractions.length),
      ...createRateLimitHeaders(rateLimitResult)
    })

    // Add CORS headers
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return NextResponse.json(response, {
      status: 200,
      headers
    })

  } catch (error) {
    console.error('Unexpected error in states/analytics API:', error)
    
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  })
}