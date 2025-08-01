import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email/resendService'

export async function POST(request: NextRequest) {
  try {
    // Verify this is a valid cron request
    const authHeader = request.headers.get('authorization')
    const cronSecret = authHeader?.replace('Bearer ', '') || ''
    
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid cron secret' },
        { status: 401 }
      )
    }

    console.log('Starting weekly digest send...')
    
    // Send weekly digest using the service
    const results = await emailService.sendWeeklyDigest()

    console.log('Weekly digest complete:', results)

    return NextResponse.json({
      success: true,
      message: 'Weekly digest sent successfully',
      stats: results
    })

  } catch (error) {
    console.error('Weekly digest cron error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for manual trigger (admin only)
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

    const results = await emailService.sendWeeklyDigest()

    return NextResponse.json({
      success: true,
      message: 'Weekly digest sent successfully (manual trigger)',
      stats: results
    })

  } catch (error) {
    console.error('Weekly digest manual trigger error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}