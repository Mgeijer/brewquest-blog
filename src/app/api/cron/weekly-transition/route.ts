import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Weekly State Transition Cron Job
 * Runs every Sunday at 4 PM EST (16:00 UTC)
 * 
 * FUNCTIONALITY:
 * - Transitions current state to completed
 * - Moves next upcoming state to current
 * - Updates week numbers and scheduling
 * - Sends weekly digest emails to all subscribers
 * - Cleans up old social media posts
 * - Logs analytics and error tracking
 * - Prepares for Monday's content generation
 */
export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron request
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()
    const today = new Date()
    
    console.log(`[CRON] Weekly transition starting`)

    // Get current state (should be completed after this week)
    const { data: currentState, error: currentError } = await supabase
      .from('state_progress')
      .select('*')
      .eq('status', 'current')
      .single()

    if (currentError) {
      console.error('[CRON] No current state found:', currentError)
      return NextResponse.json({ 
        error: 'No current state found',
        details: currentError.message 
      }, { status: 404 })
    }

    // Get next upcoming state (will become current)
    const { data: nextState, error: nextError } = await supabase
      .from('state_progress')
      .select('*')
      .eq('status', 'upcoming')
      .order('week_number')
      .limit(1)
      .single()

    if (nextError) {
      console.error('[CRON] No upcoming state found:', nextError)
      return NextResponse.json({ 
        error: 'No upcoming state found - journey may be complete',
        current_state: currentState.state_name
      }, { status: 404 })
    }

    // Begin transaction-like updates
    const updates = []

    // 1. Mark current state as completed
    const { error: completeError } = await supabase
      .from('state_progress')
      .update({ 
        status: 'completed',
        completion_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', currentState.id)

    if (completeError) {
      console.error('[CRON] Failed to complete current state:', completeError)
      throw new Error(`Failed to complete ${currentState.state_name}: ${completeError.message}`)
    }

    updates.push(`Completed ${currentState.state_name}`)

    // 2. Make next state current
    const { error: activateError } = await supabase
      .from('state_progress')
      .update({ 
        status: 'current',
        start_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', nextState.id)

    if (activateError) {
      console.error('[CRON] Failed to activate next state:', activateError)
      throw new Error(`Failed to activate ${nextState.state_name}: ${activateError.message}`)
    }

    updates.push(`Activated ${nextState.state_name} as current`)

    // 3. Archive old social media posts (older than 2 weeks)
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    const { error: archiveError } = await supabase
      .from('social_posts')
      .update({ 
        status: 'archived',
        updated_at: new Date().toISOString()
      })
      .lt('created_at', twoWeeksAgo.toISOString())
      .neq('status', 'archived')

    if (archiveError) {
      console.error('[CRON] Failed to archive old posts:', archiveError)
    } else {
      updates.push('Archived social posts older than 2 weeks')
    }

    // 4. Update journey progress analytics
    const { data: allStates, error: statsError } = await supabase
      .from('state_progress')
      .select('status')

    if (!statsError && allStates) {
      const completed = allStates.filter(s => s.status === 'completed').length
      const total = allStates.length
      const progressPercentage = Math.round((completed / total) * 100)
      
      updates.push(`Journey progress: ${completed}/${total} states (${progressPercentage}%)`)
    }

    // 5. Log analytics event
    const { error: analyticsError } = await supabase
      .from('analytics_events')
      .insert({
        event_type: 'weekly_transition',
        event_data: {
          from_state: currentState.state_name,
          to_state: nextState.state_name,
          from_week: currentState.week_number,
          to_week: nextState.week_number,
          transition_date: new Date().toISOString(),
          updates_performed: updates
        },
        created_at: new Date().toISOString()
      })

    if (analyticsError) {
      console.error('[CRON] Analytics logging failed:', analyticsError)
    }

    // 6. Check if we have beer reviews for the new current state
    const { data: newStateBeers, error: beersError } = await supabase
      .from('beer_reviews')
      .select('id, beer_name, day_of_week')
      .eq('blog_post_id', nextState.blog_post_id)
      .order('day_of_week')

    let beerReadiness = 'No beer reviews found'
    if (newStateBeers && newStateBeers.length > 0) {
      beerReadiness = `${newStateBeers.length} beer reviews ready`
      updates.push(beerReadiness)
    }

    // 7. Send weekly digest emails for the completed state
    console.log(`[CRON] Sending weekly digest emails for completed state: ${currentState.state_name}`)
    let emailResults = { successful: 0, failed: 0, total: 0 }
    
    try {
      // Import email service only when needed
      const { ResendEmailService } = await import('@/lib/email/resendService')
      const emailService = new ResendEmailService()
      emailResults = await emailService.sendWeeklyDigest()
      updates.push(`Weekly digest emails: ${emailResults.successful}/${emailResults.total} sent successfully`)
      console.log(`[CRON] Weekly digest emails sent: ${emailResults.successful} successful, ${emailResults.failed} failed`)
    } catch (emailError) {
      console.error('[CRON] Failed to send weekly digest emails:', emailError)
      updates.push(`Weekly digest emails failed: ${emailError.message}`)
      
      // Log email error but don't fail the entire transition
      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'weekly_digest_error',
          event_data: {
            error_message: emailError instanceof Error ? emailError.message : 'Unknown email error',
            completed_state: currentState.state_name,
            timestamp: new Date().toISOString()
          },
          created_at: new Date().toISOString()
        })
    }

    console.log(`[CRON] Weekly transition completed: ${currentState.state_name} → ${nextState.state_name}`)

    return NextResponse.json({
      success: true,
      message: 'Weekly transition and digest emails completed successfully',
      data: {
        transition: {
          from: {
            state: currentState.state_name,
            week: currentState.week_number
          },
          to: {
            state: nextState.state_name,
            week: nextState.week_number
          }
        },
        email_results: {
          successful: emailResults.successful,
          failed: emailResults.failed,
          total: emailResults.total
        },
        updates_performed: updates,
        beer_readiness: beerReadiness,
        next_content_generation: 'Monday 2PM EST (generate-social-content)',
        next_daily_publish: 'Monday 3PM EST (daily-publish)'
      }
    })

  } catch (error) {
    console.error('[CRON] Weekly transition error:', error)
    
    // Log critical error for monitoring
    const supabase = createClient()
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'weekly_transition_error',
        event_data: {
          error_message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
          stack_trace: error instanceof Error ? error.stack : null
        },
        created_at: new Date().toISOString()
      })

    return NextResponse.json({
      error: 'Weekly transition failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Also handle POST requests for manual triggering
export async function POST(request: NextRequest) {
  return GET(request)
}