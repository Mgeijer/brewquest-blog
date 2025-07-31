/**
 * GET /api/states/progress
 * Returns all state progress data with comprehensive filtering and caching
 * 
 * Features:
 * - Configurable response formats (basic, detailed, summary)
 * - Region and status filtering 
 * - Efficient caching with ETags
 * - Performance monitoring
 * - Error tracking
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCachedStateProgress, getProgressStatistics } from '@/lib/supabase/queries/stateQueries'
import { StateProgress } from '@/lib/supabase/functions/stateProgressFunctions'

// Response types for different format options
interface ProgressResponse {
  states: StateProgress[]
  metadata: {
    total_count: number
    filtered_count: number
    cache_hit: boolean
    response_format: string
    generated_at: string
    filters_applied: Record<string, any>
  }
  statistics?: {
    total_states: number
    completed_states: number
    current_states: number
    upcoming_states: number
    completion_percentage: number
    regions_completed: number
  }
}

interface ErrorResponse {
  error: string
  code: string
  timestamp: string
  request_id: string
}

// Cache configuration
const CACHE_DURATION = 300 // 5 minutes in seconds
const STALE_WHILE_REVALIDATE = 600 // 10 minutes

export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID()
  const startTime = Date.now()

  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const status = searchParams.get('status') || undefined
    const region = searchParams.get('region') || undefined
    const weekRangeStart = searchParams.get('week_start')
    const weekRangeEnd = searchParams.get('week_end')
    const format = searchParams.get('format') || 'basic' // basic, detailed, summary
    const includeStats = searchParams.get('include_stats') === 'true'
    
    // Build filters object
    const filters: {
      status?: string
      region?: string
      week_range?: [number, number]
    } = {}
    
    if (status) filters.status = status
    if (region) filters.region = region
    if (weekRangeStart && weekRangeEnd) {
      const start = parseInt(weekRangeStart)
      const end = parseInt(weekRangeEnd)
      if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= 50 && start <= end) {
        filters.week_range = [start, end]
      }
    }

    // Validate format parameter
    const validFormats = ['basic', 'detailed', 'summary']
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        {
          error: 'Invalid format parameter',
          code: 'INVALID_FORMAT',
          timestamp: new Date().toISOString(),
          request_id: requestId
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

    // Get cached state progress data
    const { data: states, error: statesError, fromCache } = await getCachedStateProgress(filters)
    
    if (statesError || !states) {
      console.error('Error fetching state progress:', statesError)
      return NextResponse.json(
        {
          error: 'Failed to fetch state progress data',
          code: 'DATABASE_ERROR',
          timestamp: new Date().toISOString(),
          request_id: requestId
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

    // Get statistics if requested or for detailed/summary formats
    let statistics = undefined
    if (includeStats || format === 'detailed' || format === 'summary') {
      const { data: stats, error: statsError } = await getProgressStatistics()
      if (!statsError && stats) {
        statistics = stats
      }
    }

    // Format response based on requested format
    let responseStates = states
    if (format === 'summary') {
      // For summary format, return minimal state info
      responseStates = states.map(state => ({
        ...state,
        // Remove detailed fields for summary
        description: undefined,
        journey_highlights: undefined,
        featured_breweries: state.featured_breweries.slice(0, 3) // Limit to first 3
      }))
    }

    // Build response
    const response: ProgressResponse = {
      states: responseStates,
      metadata: {
        total_count: states.length,
        filtered_count: states.length,
        cache_hit: fromCache || false,
        response_format: format,
        generated_at: new Date().toISOString(),
        filters_applied: filters
      }
    }

    if (statistics) {
      response.statistics = statistics
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
      'X-Cache-Hit': fromCache ? 'true' : 'false'
    })

    // Add CORS headers for cross-origin requests
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, If-None-Match')

    return NextResponse.json(response, {
      status: 200,
      headers
    })

  } catch (error) {
    console.error('Unexpected error in states/progress API:', error)
    
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, If-None-Match',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  })
}