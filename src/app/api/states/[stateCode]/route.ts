/**
 * GET /api/states/[stateCode]
 * Returns detailed state information with comprehensive data and analytics tracking
 * 
 * Features:
 * - Complete state details including breweries and blog posts
 * - Automatic analytics tracking for API usage
 * - Flexible response formats
 * - Performance optimization with caching
 * - Error handling with proper HTTP status codes
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCachedStateWithDetails } from '@/lib/supabase/queries/stateQueries'
import { trackMapInteraction } from '@/lib/supabase/functions/stateProgressFunctions'
import { StateWithBreweries } from '@/lib/supabase/queries/stateQueries'

// US state codes for validation
const VALID_STATE_CODES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

interface DetailedStateResponse {
  state: StateWithBreweries
  metadata: {
    request_time: string
    cache_hit: boolean
    response_format: string
    analytics_tracked: boolean
    request_id: string
  }
}

interface ErrorResponse {
  error: string
  code: string
  timestamp: string
  request_id: string
  state_code?: string
}

// Cache configuration
const CACHE_DURATION = 600 // 10 minutes for detailed state data
const STALE_WHILE_REVALIDATE = 1800 // 30 minutes

export async function GET(
  request: NextRequest,
  { params }: { params: { stateCode: string } }
): Promise<NextResponse> {
  const requestId = crypto.randomUUID()
  const startTime = Date.now()

  try {
    const { stateCode } = params
    const { searchParams } = new URL(request.url)
    
    // Validate and normalize state code
    const normalizedStateCode = stateCode.toUpperCase()
    if (!VALID_STATE_CODES.includes(normalizedStateCode)) {
      return NextResponse.json(
        {
          error: 'Invalid state code',
          code: 'INVALID_STATE_CODE',
          timestamp: new Date().toISOString(),
          request_id: requestId,
          state_code: stateCode
        } as ErrorResponse,
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId
          }
        }
      )
    }

    // Parse query parameters
    const format = searchParams.get('format') || 'detailed'
    const trackAnalytics = searchParams.get('track_analytics') !== 'false' // Default to true
    const includeBreweries = searchParams.get('include_breweries') !== 'false'
    const includeBlogPost = searchParams.get('include_blog_post') !== 'false'
    
    // Validate format
    const validFormats = ['basic', 'detailed', 'minimal']
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        {
          error: 'Invalid format parameter',
          code: 'INVALID_FORMAT',
          timestamp: new Date().toISOString(),
          request_id: requestId,
          state_code: normalizedStateCode
        } as ErrorResponse,
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId
          }
        }
      )
    }

    // Get detailed state data
    const { data: stateData, error: stateError, fromCache } = await getCachedStateWithDetails(normalizedStateCode)
    
    if (stateError) {
      console.error(`Error fetching state details for ${normalizedStateCode}:`, stateError)
      return NextResponse.json(
        {
          error: 'Failed to fetch state details',
          code: 'DATABASE_ERROR',
          timestamp: new Date().toISOString(),
          request_id: requestId,
          state_code: normalizedStateCode
        } as ErrorResponse,
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId
          }
        }
      )
    }

    if (!stateData) {
      return NextResponse.json(
        {
          error: 'State not found',
          code: 'STATE_NOT_FOUND',
          timestamp: new Date().toISOString(),
          request_id: requestId,
          state_code: normalizedStateCode
        } as ErrorResponse,
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId
          }
        }
      )
    }

    // Track analytics if enabled
    let analyticsTracked = false
    if (trackAnalytics) {
      try {
        const userAgent = request.headers.get('user-agent') || 'Unknown'
        const referrer = request.headers.get('referer') || request.headers.get('referrer')
        const forwardedFor = request.headers.get('x-forwarded-for')
        const realIp = request.headers.get('x-real-ip')
        const ipAddress = forwardedFor?.split(',')[0] || realIp || '0.0.0.0'
        
        // Determine device type from user agent
        const deviceType = userAgent.toLowerCase().includes('mobile') ? 'mobile' :
                          userAgent.toLowerCase().includes('tablet') ? 'tablet' : 'desktop'

        // Generate session ID from headers (simplified approach)
        const sessionSeed = `${ipAddress}-${userAgent}-${new Date().toDateString()}`
        const sessionId = Buffer.from(sessionSeed).toString('base64').slice(0, 32)

        await trackMapInteraction({
          state_code: normalizedStateCode,
          interaction_type: 'navigation',
          session_id: sessionId,
          user_agent: userAgent,
          device_type: deviceType as 'desktop' | 'mobile' | 'tablet' | 'unknown',
          source_page: 'api',
          duration_ms: Date.now() - startTime,
          metadata: {
            api_endpoint: `/api/states/${stateCode}`,
            format: format,
            request_id: requestId
          },
          ip_address: ipAddress,
          referrer: referrer || undefined
        })
        
        analyticsTracked = true
      } catch (analyticsError) {
        console.warn(`Failed to track analytics for ${normalizedStateCode}:`, analyticsError)
        // Don't fail the request if analytics tracking fails
      }
    }

    // Format response based on requested format
    let responseState = stateData
    if (format === 'minimal') {
      responseState = {
        ...stateData,
        description: undefined,
        journey_highlights: undefined,
        breweries: includeBreweries ? stateData.breweries.slice(0, 3) : [],
        beer_reviews: undefined,
        blog_post: undefined
      }
    } else if (format === 'basic') {
      responseState = {
        ...stateData,
        breweries: includeBreweries ? stateData.breweries : [],
        beer_reviews: undefined,
        blog_post: includeBlogPost ? stateData.blog_post : undefined
      }
    }

    // Build response
    const response: DetailedStateResponse = {
      state: responseState,
      metadata: {
        request_time: new Date().toISOString(),
        cache_hit: fromCache || false,
        response_format: format,
        analytics_tracked,
        request_id: requestId
      }
    }

    // Generate ETag for caching
    const responseHash = Buffer.from(JSON.stringify(response)).toString('base64')
    const etag = `"${responseHash.slice(0, 16)}"`
    
    // Check if client has current version
    const clientETag = request.headers.get('if-none-match')
    if (clientETag === etag) {
      return new NextResponse(null, { 
        status: 304,
        headers: {
          'ETag': etag,
          'X-Request-ID': requestId,
          'X-Response-Time': `${Date.now() - startTime}ms`
        }
      })
    }

    // Set performance and caching headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      'ETag': etag,
      'Cache-Control': `public, max-age=${CACHE_DURATION}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
      'X-Request-ID': requestId,
      'X-Response-Time': `${Date.now() - startTime}ms`,
      'X-Cache-Hit': fromCache ? 'true' : 'false',
      'X-Analytics-Tracked': analyticsTracked ? 'true' : 'false'
    })

    // Add CORS headers
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, If-None-Match')

    return NextResponse.json(response, {
      status: 200,
      headers
    })

  } catch (error) {
    console.error(`Unexpected error in states/${params.stateCode} API:`, error)
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
        request_id: requestId,
        state_code: params.stateCode
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, If-None-Match',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  })
}