import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/admin/trigger-daily-publish
 * Manually trigger the daily publish cron job (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Create a new request with proper authorization headers for the cron job
    const cronRequest = new Request('https://hopharrison.com/api/cron/daily-publish', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
        'Content-Type': 'application/json'
      }
    })

    // Call the daily publish endpoint
    const response = await fetch(cronRequest)
    const result = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Daily publish triggered successfully',
        result: result
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Daily publish failed',
        details: result
      }, { status: response.status })
    }

  } catch (error) {
    console.error('Error triggering daily publish:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to trigger daily publish',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}