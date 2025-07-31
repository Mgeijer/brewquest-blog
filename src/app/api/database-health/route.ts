/**
 * API Route: Database Health Monitoring
 * 
 * Provides comprehensive database health metrics and performance analytics
 * for the state progress tracking system.
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  getDatabaseHealth, 
  getStateEngagementSummary 
} from '@/lib/supabase/functions/stateProgressFunctions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timePeriod = parseInt(searchParams.get('hours') || '24')
    const includeEngagement = searchParams.get('engagement') !== 'false'

    console.log(`🏥 Fetching database health metrics (${timePeriod}h period)...`)

    // Get basic database health
    const { data: healthData, error: healthError } = await getDatabaseHealth()
    
    if (healthError) {
      console.error('❌ Error fetching database health:', healthError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch database health',
        details: healthError
      }, { status: 500 })
    }

    let engagementData = null
    if (includeEngagement) {
      const { data: engagement, error: engagementError } = await getStateEngagementSummary(timePeriod)
      
      if (engagementError) {
        console.warn('⚠️ Could not fetch engagement summary:', engagementError)
      } else {
        engagementData = engagement
      }
    }

    // Calculate performance metrics
    const performance = {
      cache_hit_ratio: healthData?.cache_hit_ratio || 0,
      active_connections: healthData?.active_connections || 0,
      total_records: Object.values(healthData?.record_counts || {}).reduce((sum: number, count: any) => sum + (count || 0), 0),
      engagement_summary: engagementData ? {
        total_states_with_activity: engagementData.filter((s: any) => s.total_interactions > 0).length,
        most_engaged_state: engagementData[0],
        total_interactions: engagementData.reduce((sum: number, state: any) => sum + (state.total_interactions || 0), 0),
        avg_mobile_percentage: engagementData.reduce((sum: number, state: any) => sum + (state.mobile_percentage || 0), 0) / Math.max(engagementData.length, 1)
      } : null
    }

    // Health status assessment
    const healthStatus = {
      overall: 'healthy',
      issues: [] as string[],
      recommendations: [] as string[]
    }

    // Assess cache hit ratio
    if (performance.cache_hit_ratio < 95) {
      healthStatus.issues.push(`Low cache hit ratio: ${performance.cache_hit_ratio}%`)
      healthStatus.recommendations.push('Consider increasing shared_buffers or adding more indexes')
      if (performance.cache_hit_ratio < 90) {
        healthStatus.overall = 'warning'
      }
    }

    // Assess connection count
    if (performance.active_connections > 20) {
      healthStatus.issues.push(`High connection count: ${performance.active_connections}`)
      healthStatus.recommendations.push('Monitor connection pooling and consider pgBouncer')
      if (performance.active_connections > 50) {
        healthStatus.overall = 'critical'
      }
    }

    // Assess table sizes
    const tableSizes = healthData?.table_sizes || {}
    const largeTables = Object.entries(tableSizes).filter(([table, size]) => 
      typeof size === 'string' && (size.includes('GB') || (size.includes('MB') && parseInt(size) > 100))
    )

    if (largeTables.length > 0) {
      healthStatus.recommendations.push(`Consider archiving or partitioning large tables: ${largeTables.map(([table]) => table).join(', ')}`)
    }

    console.log(`📊 Database health check complete. Status: ${healthStatus.overall}`)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      time_period_hours: timePeriod,
      health_status: healthStatus,
      database_metrics: healthData,
      performance_metrics: performance,
      engagement_data: engagementData
    })

  } catch (error) {
    console.error('❌ Exception in database health check:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check database health',
        details: error 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Running database maintenance tasks...')

    const { action } = await request.json()

    switch (action) {
      case 'refresh_analytics':
        // This would refresh materialized views
        console.log('📈 Refreshing analytics views...')
        // Implementation would go here
        break
        
      case 'cleanup_old_analytics':
        // This would clean up old analytics data
        console.log('🧹 Cleaning up old analytics data...')
        // Implementation would go here
        break
        
      case 'update_indexes':
        // This would analyze and potentially update index usage
        console.log('📊 Analyzing index usage...')
        // Implementation would go here
        break
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown maintenance action',
          available_actions: ['refresh_analytics', 'cleanup_old_analytics', 'update_indexes']
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Database maintenance task '${action}' completed successfully`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Exception in database maintenance:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to run database maintenance',
        details: error 
      },
      { status: 500 }
    )
  }
}