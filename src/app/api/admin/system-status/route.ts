import { NextRequest, NextResponse } from 'next/server'

// Mock system status data - replace with actual system checks
const getSystemStatus = () => {
  const now = new Date()
  const tomorrow8pm = new Date(now)
  tomorrow8pm.setDate(tomorrow8pm.getDate() + 1)
  tomorrow8pm.setHours(20, 0, 0, 0)

  const tomorrow9pm = new Date(now)  
  tomorrow9pm.setDate(tomorrow9pm.getDate() + 1)
  tomorrow9pm.setHours(21, 0, 0, 0)

  const dayAfter8pm = new Date(now)
  dayAfter8pm.setDate(dayAfter8pm.getDate() + 2)
  dayAfter8pm.setHours(20, 0, 0, 0)

  return {
    automationEnabled: true,
    emergencyMode: false,
    lastEmergencyAction: {
      action: 'Manual publish - Good People IPA',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      user: 'admin@brewquest.com'
    },
    upcomingPublications: [
      {
        id: 'pub_1',
        title: 'Yellowhammer Belgian White - Alabama Day 2',
        scheduledFor: tomorrow8pm.toISOString(),
        type: 'Daily Beer Feature',
        canOverride: true
      },
      {
        id: 'pub_2', 
        title: 'Cahaba Oka Uba IPA - Alabama Day 3',
        scheduledFor: dayAfter8pm.toISOString(),
        type: 'Daily Beer Feature',
        canOverride: true
      },
      {
        id: 'pub_3',
        title: 'Weekly State Transition - Alaska Launch',
        scheduledFor: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'State Transition',
        canOverride: false
      }
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    const systemStatus = getSystemStatus()

    return NextResponse.json({
      success: true,
      ...systemStatus
    })
  } catch (error) {
    console.error('Error fetching system status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch system status' },
      { status: 500 }
    )
  }
}