import { NextRequest, NextResponse } from 'next/server'

// Mock data - replace with actual database queries
const getCronJobStatus = () => {
  const now = new Date()
  const nextDailyRun = new Date(now)
  nextDailyRun.setHours(20, 0, 0, 0)
  if (nextDailyRun <= now) {
    nextDailyRun.setDate(nextDailyRun.getDate() + 1)
  }

  const nextWeeklyRun = new Date(now)
  nextWeeklyRun.setDate(now.getDate() + (7 - now.getDay()) % 7)
  nextWeeklyRun.setHours(21, 0, 0, 0)
  if (nextWeeklyRun <= now) {
    nextWeeklyRun.setDate(nextWeeklyRun.getDate() + 7)
  }

  return [
    {
      name: 'Daily Beer Publishing',
      path: '/api/cron/daily-publish',
      schedule: '0 20 * * *',
      nextRun: nextDailyRun.toISOString(),
      lastRun: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'active' as const,
      successRate: 95.2,
      lastResult: {
        success: true,
        message: 'Successfully published Good People IPA for Alabama Day 1',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        duration: 1240
      }
    },
    {
      name: 'Weekly State Transition',
      path: '/api/cron/weekly-transition',
      schedule: '0 21 * * 0',
      nextRun: nextWeeklyRun.toISOString(),
      lastRun: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active' as const,
      successRate: 100.0,
      lastResult: {
        success: true,
        message: 'Successfully transitioned from setup to Alabama (Week 1)',
        timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 2150
      }
    }
  ]
}

const getAutomationStats = () => {
  return {
    totalRuns: 28,
    successfulRuns: 27,
    failedRuns: 1,
    averageResponseTime: 1350,
    uptime: 98.7
  }
}

export async function GET(request: NextRequest) {
  try {
    const cronJobs = getCronJobStatus()
    const stats = getAutomationStats()

    return NextResponse.json({
      success: true,
      cronJobs,
      stats
    })
  } catch (error) {
    console.error('Error fetching automation status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch automation status' },
      { status: 500 }
    )
  }
}