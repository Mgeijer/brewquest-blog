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

    const { completedState, newState } = await request.json()

    if (!completedState || !newState) {
      return NextResponse.json(
        { error: 'Both completedState and newState are required' },
        { status: 400 }
      )
    }

    console.log(`Starting state transition email: ${completedState} → ${newState}`)
    
    // Send state transition email using the service
    const results = await emailService.sendStateTransitionEmail(completedState, newState)

    console.log('State transition email complete:', results)

    return NextResponse.json({
      success: true,
      message: `State transition email sent: ${completedState} → ${newState}`,
      stats: results
    })

  } catch (error) {
    console.error('State transition cron error:', error)
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
    const completedState = searchParams.get('completed')
    const newState = searchParams.get('new')
    
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid admin password' },
        { status: 401 }
      )
    }

    if (!completedState || !newState) {
      return NextResponse.json(
        { error: 'Both completed and new state parameters are required' },
        { status: 400 }
      )
    }

    const results = await emailService.sendStateTransitionEmail(completedState, newState)

    return NextResponse.json({
      success: true,
      message: `State transition email sent: ${completedState} → ${newState} (manual trigger)`,
      stats: results
    })

  } catch (error) {
    console.error('State transition manual trigger error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}