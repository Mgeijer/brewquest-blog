/**
 * Seven Beer Schedule API
 * 
 * API endpoint for managing the 7-beer weekly content schedule:
 * - 1 state post (Monday morning)
 * - 7 beer reviews (Monday afternoon + Tuesday-Sunday mornings)
 * - 28 social media posts (4 platforms × 7 beers)
 */

import { NextRequest, NextResponse } from 'next/server'
import { sevenBeerScheduler } from '@/lib/content-workflow/sevenBeerScheduler'

// ==================================================
// Request/Response Types
// ==================================================

interface CreateWeeklyContentRequest {
  action: 'create_weekly_content'
  stateCode: string
  weekNumber: number
  startDate: string // ISO date string for Monday
  autoGenerate?: boolean
}

interface ValidateWeeklyContentRequest {
  action: 'validate_weekly_content'
  stateCode: string
  weekNumber: number
}

interface GetContentScheduleRequest {
  action: 'get_content_schedule'
  stateCode?: string
  weekNumber?: number
  startDate?: string
  endDate?: string
}

type ApiRequest = CreateWeeklyContentRequest | ValidateWeeklyContentRequest | GetContentScheduleRequest

// ==================================================
// POST Handler - Create/Manage Weekly Content
// ==================================================

export async function POST(request: NextRequest) {
  try {
    const body: ApiRequest = await request.json()

    switch (body.action) {
      case 'create_weekly_content':
        return await handleCreateWeeklyContent(body)
      
      case 'validate_weekly_content':
        return await handleValidateWeeklyContent(body)
      
      default:
        return NextResponse.json(
          { error: 'Invalid action', validActions: ['create_weekly_content', 'validate_weekly_content'] },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Seven Beer Schedule API Error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// ==================================================
// GET Handler - Retrieve Content Schedule
// ==================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stateCode = searchParams.get('stateCode')
    const weekNumber = searchParams.get('weekNumber')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    return await handleGetContentSchedule({
      action: 'get_content_schedule',
      stateCode: stateCode || undefined,
      weekNumber: weekNumber ? parseInt(weekNumber) : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    })
  } catch (error) {
    console.error('Get Content Schedule Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to retrieve content schedule',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// ==================================================
// Action Handlers
// ==================================================

async function handleCreateWeeklyContent(request: CreateWeeklyContentRequest) {
  try {
    // Validate inputs
    if (!request.stateCode || !request.weekNumber || !request.startDate) {
      return NextResponse.json(
        { error: 'Missing required fields: stateCode, weekNumber, startDate' },
        { status: 400 }
      )
    }

    if (!/^[A-Z]{2}$/.test(request.stateCode)) {
      return NextResponse.json(
        { error: 'Invalid state code format. Must be 2 uppercase letters.' },
        { status: 400 }
      )
    }

    if (request.weekNumber < 1 || request.weekNumber > 50) {
      return NextResponse.json(
        { error: 'Invalid week number. Must be between 1 and 50.' },
        { status: 400 }
      )
    }

    const startDate = new Date(request.startDate)
    if (isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid start date format. Use ISO date string.' },
        { status: 400 }
      )
    }

    // Check if Monday
    if (startDate.getDay() !== 1) {
      return NextResponse.json(
        { error: 'Start date must be a Monday.' },
        { status: 400 }
      )
    }

    // Generate weekly content plan
    const weeklyPlan = await sevenBeerScheduler.generateWeeklyPlan(
      request.stateCode,
      request.weekNumber,
      startDate
    )

    // Save to database if autoGenerate is true
    let saveResult = null
    if (request.autoGenerate) {
      saveResult = await sevenBeerScheduler.saveWeeklyPlan(weeklyPlan)
      
      if (!saveResult.success) {
        return NextResponse.json(
          { 
            error: 'Failed to save weekly content plan',
            details: saveResult.error,
            plan: weeklyPlan // Include plan for manual saving
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: `Weekly content plan generated for ${request.stateCode} Week ${request.weekNumber}`,
      stateCode: request.stateCode,
      weekNumber: request.weekNumber,
      contentSummary: {
        statePost: {
          title: weeklyPlan.statePost.title,
          publishDate: weeklyPlan.statePost.publishDate,
          publishTime: weeklyPlan.statePost.publishTime
        },
        beerReviews: weeklyPlan.beerReviews.map(beer => ({
          dayOfWeek: beer.dayOfWeek,
          breweryName: beer.breweryName,
          beerName: beer.beerName,
          publishDate: beer.publishDate,
          publishTime: beer.publishTime
        })),
        socialMediaPosts: weeklyPlan.socialMediaPosts.length,
        totalContent: {
          statePosts: 1,
          beerReviews: 7,
          socialPosts: 28
        }
      },
      ...(saveResult && {
        databaseIds: {
          statePostId: saveResult.statePostId,
          beerReviewIds: saveResult.beerReviewIds,
          socialPostIds: saveResult.socialPostIds
        }
      }),
      fullPlan: request.autoGenerate ? null : weeklyPlan, // Only include if not auto-saved
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Create Weekly Content Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create weekly content',
        message: error instanceof Error ? error.message : 'Unknown error',
        stateCode: request.stateCode,
        weekNumber: request.weekNumber
      },
      { status: 500 }
    )
  }
}

async function handleValidateWeeklyContent(request: ValidateWeeklyContentRequest) {
  try {
    // Validate inputs
    if (!request.stateCode || !request.weekNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: stateCode, weekNumber' },
        { status: 400 }
      )
    }

    const validation = await sevenBeerScheduler.validateWeeklyContent(
      request.stateCode,
      request.weekNumber
    )

    const status = validation.isComplete ? 'complete' : 'incomplete'
    const completionPercentage = Math.round(
      ((validation.hasStatePost ? 1 : 0) + 
       (validation.beerReviewCount / 7) + 
       (validation.socialPostCount / 28)) / 3 * 100
    )

    return NextResponse.json({
      success: true,
      stateCode: request.stateCode,
      weekNumber: request.weekNumber,
      status,
      completionPercentage,
      validation: {
        isComplete: validation.isComplete,
        hasStatePost: validation.hasStatePost,
        beerReviews: {
          count: validation.beerReviewCount,
          required: 7,
          missingDays: validation.missingBeerDays
        },
        socialPosts: {
          count: validation.socialPostCount,
          required: 28,
          missing: 28 - validation.socialPostCount
        }
      },
      issues: validation.issues,
      recommendations: generateRecommendations(validation),
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Validate Weekly Content Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to validate weekly content',
        message: error instanceof Error ? error.message : 'Unknown error',
        stateCode: request.stateCode,
        weekNumber: request.weekNumber
      },
      { status: 500 }
    )
  }
}

async function handleGetContentSchedule(request: GetContentScheduleRequest) {
  try {
    // This would query the database for content schedule
    // Implementation would depend on specific requirements
    
    return NextResponse.json({
      success: true,
      message: 'Content schedule retrieved',
      filters: {
        stateCode: request.stateCode,
        weekNumber: request.weekNumber,
        dateRange: {
          start: request.startDate,
          end: request.endDate
        }
      },
      schedule: [], // Would be populated from database
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Get Content Schedule Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to retrieve content schedule',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// ==================================================
// Helper Functions
// ==================================================

function generateRecommendations(validation: any): string[] {
  const recommendations = []

  if (!validation.hasStatePost) {
    recommendations.push('Create state overview blog post (scheduled for Monday 9:00 AM)')
  }

  if (validation.beerReviewCount < 7) {
    recommendations.push(`Create ${7 - validation.beerReviewCount} additional beer reviews`)
    if (validation.missingBeerDays.length > 0) {
      recommendations.push(`Missing beer reviews for days: ${validation.missingBeerDays.join(', ')}`)
    }
  }

  if (validation.socialPostCount < 28) {
    recommendations.push(`Generate ${28 - validation.socialPostCount} social media posts`)
    recommendations.push('Each beer review should have 4 social posts (Instagram, Twitter, Facebook, LinkedIn)')
  }

  if (recommendations.length === 0) {
    recommendations.push('All content is ready for publishing!')
  }

  return recommendations
}

// Success response for testing
export async function OPTIONS() {
  return NextResponse.json({ 
    message: 'Seven Beer Schedule API',
    endpoints: {
      'POST /': 'Create or validate weekly content',
      'GET /': 'Retrieve content schedule'
    },
    actions: {
      'create_weekly_content': 'Generate complete weekly content plan (1 state post + 7 beer reviews + 28 social posts)',
      'validate_weekly_content': 'Check completeness of weekly content',
      'get_content_schedule': 'Retrieve existing content schedule'
    }
  })
}