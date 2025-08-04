import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email/resendService'

/**
 * Manual Weekly Digest Trigger
 * Admin-only endpoint to manually send weekly digest emails
 * Use this when the automated cron job fails or for testing
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminPassword = searchParams.get('admin')
    
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid admin password' },
        { status: 401 }
      )
    }

    console.log('Manual weekly digest trigger started...')
    
    const results = await emailService.sendWeeklyDigest()

    console.log('Manual weekly digest complete:', results)

    return NextResponse.json({
      success: true,
      message: 'Weekly digest sent successfully (manual trigger)',
      stats: {
        successful: results.successful,
        failed: results.failed,
        total: results.total
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Manual weekly digest error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Also handle POST requests
export async function POST(request: NextRequest) {
  return GET(request)
}