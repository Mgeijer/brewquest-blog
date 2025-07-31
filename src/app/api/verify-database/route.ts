import { NextResponse } from 'next/server'
import { 
  getAllStateProgress,
  getStateProgress,
  getCurrentJourneyWeek,
  getProgressStatistics,
  getStateBreweries,
  getJourneyMilestones,
  getDatabaseHealth,
  getJourneyStatistics
} from '../../../lib/supabase/functions/stateProgressFunctions'

export async function GET() {
  try {
    console.log('🔍 Verifying BrewQuest Chronicles database...')
    
    const verificationResults: Record<string, any> = {}
    const errors: string[] = []

    // Test 1: Get all state progress
    try {
      const { data: allStates, error } = await getAllStateProgress()
      verificationResults.all_states = {
        success: !error,
        count: allStates?.length || 0,
        error: error?.message
      }
      if (error) errors.push(`getAllStateProgress: ${error.message}`)
    } catch (err) {
      verificationResults.all_states = { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
      errors.push(`getAllStateProgress: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }

    // Test 2: Get Alabama state specifically
    try {
      const { data: alabama, error } = await getStateProgress('AL')
      verificationResults.alabama_state = {
        success: !error,
        found: !!alabama,
        status: alabama?.status,
        week_number: alabama?.week_number,
        featured_beers_count: alabama?.featured_beers_count,
        error: error?.message
      }
      if (error) errors.push(`getStateProgress(AL): ${error.message}`)
    } catch (err) {
      verificationResults.alabama_state = { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
      errors.push(`getStateProgress(AL): ${err instanceof Error ? err.message : 'Unknown error'}`)
    }

    // Test 3: Get current journey week
    try {
      const { data: currentWeek, error } = await getCurrentJourneyWeek()
      verificationResults.current_week = {
        success: !error,
        week: currentWeek,
        error: error?.message
      }
      if (error) errors.push(`getCurrentJourneyWeek: ${error.message}`)
    } catch (err) {
      verificationResults.current_week = { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
      errors.push(`getCurrentJourneyWeek: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }

    // Test 4: Get progress statistics
    try {
      const { data: stats, error } = await getProgressStatistics()
      verificationResults.progress_statistics = {
        success: !error,
        stats: stats,
        error: error?.message
      }
      if (error) errors.push(`getProgressStatistics: ${error.message}`)
    } catch (err) {
      verificationResults.progress_statistics = { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
      errors.push(`getProgressStatistics: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }

    // Test 5: Get Alabama breweries
    try {
      const { data: breweries, error } = await getStateBreweries('AL')
      verificationResults.alabama_breweries = {
        success: !error,
        count: breweries?.length || 0,
        breweries: breweries?.map(b => b.brewery_name) || [],
        error: error?.message
      }
      if (error) errors.push(`getStateBreweries(AL): ${error.message}`)
    } catch (err) {
      verificationResults.alabama_breweries = { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
      errors.push(`getStateBreweries(AL): ${err instanceof Error ? err.message : 'Unknown error'}`)
    }

    // Test 6: Get journey milestones
    try {
      const { data: milestones, error } = await getJourneyMilestones({ limit: 5 })
      verificationResults.journey_milestones = {
        success: !error,
        count: milestones?.length || 0,
        recent_milestones: milestones?.map(m => m.title) || [],
        error: error?.message
      }
      if (error) errors.push(`getJourneyMilestones: ${error.message}`)
    } catch (err) {
      verificationResults.journey_milestones = { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
      errors.push(`getJourneyMilestones: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }

    // Test 7: Get database health (may not work if functions aren't fully set up)
    try {
      const { data: health, error } = await getDatabaseHealth()
      verificationResults.database_health = {
        success: !error,
        health: health,
        error: error?.message
      }
      if (error) errors.push(`getDatabaseHealth: ${error.message}`)
    } catch (err) {
      verificationResults.database_health = { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
    }

    // Test 8: Get journey statistics (comprehensive function test)
    try {
      const { data: journeyStats, error } = await getJourneyStatistics()
      verificationResults.journey_statistics = {
        success: !error,
        stats: journeyStats,
        error: error?.message
      }
      if (error) errors.push(`getJourneyStatistics: ${error.message}`)
    } catch (err) {
      verificationResults.journey_statistics = { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
    }

    // Calculate overall success rate
    const totalTests = Object.keys(verificationResults).length
    const successfulTests = Object.values(verificationResults).filter((result: any) => result.success).length
    const successRate = Math.round((successfulTests / totalTests) * 100)

    console.log(`✅ Database verification complete: ${successfulTests}/${totalTests} tests passed (${successRate}%)`)

    return NextResponse.json({
      success: successRate >= 70, // Consider successful if 70% or more tests pass
      success_rate: successRate,
      successful_tests: successfulTests,
      total_tests: totalTests,
      verification_results: verificationResults,
      errors: errors,
      recommendations: generateRecommendations(verificationResults, errors),
      status: successRate >= 90 ? 'excellent' : 
              successRate >= 70 ? 'good' : 
              successRate >= 50 ? 'partial' : 'needs_attention'
    })

  } catch (error) {
    console.error('❌ Database verification failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database verification encountered a critical error'
    }, { status: 500 })
  }
}

function generateRecommendations(results: Record<string, any>, errors: string[]): string[] {
  const recommendations: string[] = []

  // Check for common issues and provide recommendations
  if (!results.all_states?.success) {
    recommendations.push('Run the database setup: POST /api/setup-database')
  }

  if (!results.alabama_state?.success || !results.alabama_state?.found) {
    recommendations.push('Alabama state data is missing - run the database setup')
  }

  if (results.alabama_state?.featured_beers_count === 0) {
    recommendations.push('Alabama beer reviews are missing - run the Alabama data population')
  }

  if (!results.alabama_breweries?.success || results.alabama_breweries?.count === 0) {
    recommendations.push('Alabama brewery features are missing - check brewery data population')
  }

  if (!results.database_health?.success) {
    recommendations.push('Database health functions may need to be created - this is normal for initial setup')
  }

  if (errors.length > 3) {
    recommendations.push('Multiple function errors detected - verify Supabase connection and permissions')
  }

  if (results.progress_statistics?.success && results.progress_statistics?.stats?.total_states !== 50) {
    recommendations.push('Not all 50 states are populated - run complete database setup')
  }

  if (recommendations.length === 0) {
    recommendations.push('Database is working well! Ready for the BrewQuest Chronicles journey.')
  }

  return recommendations
}

export async function POST() {
  return NextResponse.json({
    message: 'Use GET method to verify the database',
    available_endpoints: {
      'GET /api/verify-database': 'Run comprehensive database verification',
      'POST /api/setup-database': 'Set up the complete database schema',
      'GET /api/states/AL': 'Test Alabama state data endpoint'
    }
  })
}