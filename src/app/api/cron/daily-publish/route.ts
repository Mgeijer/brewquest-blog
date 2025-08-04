import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Daily Content Publishing Cron Job
 * Runs every day at 3 PM EST (15:00 UTC)
 * 
 * FUNCTIONALITY:
 * - Publishes today's beer review if available
 * - Updates state progress tracking
 * - Generates analytics data
 * - Triggers social media content generation
 */
export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron request (Vercel adds this header)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()
    const today = new Date()
    const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay() // Convert Sunday to 7
    
    console.log(`[CRON] Daily publish starting for day ${dayOfWeek}`)

    // Get current state (should be the active week)
    const { data: currentState, error: stateError } = await supabase
      .from('state_progress')
      .select('*')
      .eq('status', 'current')
      .single()

    if (stateError || !currentState) {
      console.error('[CRON] No current state found:', stateError)
      return NextResponse.json({ 
        error: 'No current state found',
        details: stateError?.message 
      }, { status: 404 })
    }

    // Get today's beer review for the current state
    const { data: todaysBeer, error: beerError } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('blog_post_id', currentState.blog_post_id)
      .eq('day_of_week', dayOfWeek)
      .single()

    if (beerError) {
      console.log(`[CRON] No beer review for day ${dayOfWeek}:`, beerError.message)
      
      // Still send newsletter on Monday even if no beer review
      let emailResults = { successful: 0, failed: 0, total: 0 }
      if (dayOfWeek === 1) { // Monday - send weekly newsletter
        console.log(`[CRON] Sending weekly newsletter for current week: ${currentState.state_name}`)
        
        try {
          const { ResendEmailService } = await import('@/lib/email/resendService')
          const emailService = new ResendEmailService()
          emailResults = await emailService.sendWeeklyNewsletter(currentState)
          console.log(`[CRON] Weekly newsletter sent: ${emailResults.successful} successful, ${emailResults.failed} failed`)
        } catch (emailError) {
          console.error('[CRON] Failed to send weekly newsletter:', emailError)
          
          await supabase
            .from('analytics_events')
            .insert({
              event_type: 'weekly_newsletter_error',
              event_data: {
                error_message: emailError instanceof Error ? emailError.message : 'Unknown email error',
                current_state: currentState.state_name,
                week_number: currentState.week_number,
                timestamp: new Date().toISOString()
              },
              created_at: new Date().toISOString()
            })
        }
      }
      
      return NextResponse.json({ 
        message: `No beer review scheduled for day ${dayOfWeek}${dayOfWeek === 1 ? ' - Newsletter sent' : ''}`,
        state: currentState.state_name,
        week: currentState.week_number,
        newsletter_results: dayOfWeek === 1 ? {
          successful: emailResults.successful,
          failed: emailResults.failed,
          total: emailResults.total
        } : null
      })
    }

    // Update beer review to published status (if it has a status field)
    const { error: updateError } = await supabase
      .from('beer_reviews')
      .update({ 
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', todaysBeer.id)

    if (updateError) {
      console.error('[CRON] Error updating beer review:', updateError)
    }

    // Log analytics event
    const { error: analyticsError } = await supabase
      .from('analytics_events')
      .insert({
        event_type: 'daily_publish',
        event_data: {
          state: currentState.state_name,
          week: currentState.week_number,
          day_of_week: dayOfWeek,
          beer_id: todaysBeer.id,
          beer_name: todaysBeer.beer_name,
          brewery: todaysBeer.brewery_name
        },
        created_at: new Date().toISOString()
      })

    if (analyticsError) {
      console.error('[CRON] Analytics logging failed:', analyticsError)
    }

    // Generate social media content for today's beer
    const socialMediaContent = {
      instagram: generateInstagramPost(todaysBeer, currentState),
      twitter: generateTwitterPost(todaysBeer, currentState),
      facebook: generateFacebookPost(todaysBeer, currentState),
      linkedin: generateLinkedInPost(todaysBeer, currentState)
    }

    // Save social media content to database
    const socialPosts = Object.entries(socialMediaContent).map(([platform, content]) => ({
      platform,
      content_type: 'daily_beer',
      title: `${todaysBeer.beer_name} - ${todaysBeer.brewery_name}`,
      content: content,
      scheduled_for: new Date().toISOString(),
      status: 'ready',
      beer_review_id: todaysBeer.id,
      state_week: currentState.week_number,
      created_at: new Date().toISOString()
    }))

    const { error: socialError } = await supabase
      .from('social_posts')
      .insert(socialPosts)

    if (socialError) {
      console.error('[CRON] Social media content save failed:', socialError)
    }

    // Send weekly newsletter on Monday for the current week
    let emailResults = { successful: 0, failed: 0, total: 0 }
    if (dayOfWeek === 1) { // Monday - send weekly newsletter
      console.log(`[CRON] Sending weekly newsletter for current week: ${currentState.state_name}`)
      
      try {
        // Import and use email service for weekly newsletter
        const { ResendEmailService } = await import('@/lib/email/resendService')
        const emailService = new ResendEmailService()
        emailResults = await emailService.sendWeeklyNewsletter(currentState)
        console.log(`[CRON] Weekly newsletter sent: ${emailResults.successful} successful, ${emailResults.failed} failed`)
      } catch (emailError) {
        console.error('[CRON] Failed to send weekly newsletter:', emailError)
        
        // Log email error for monitoring
        await supabase
          .from('analytics_events')
          .insert({
            event_type: 'weekly_newsletter_error',
            event_data: {
              error_message: emailError instanceof Error ? emailError.message : 'Unknown email error',
              current_state: currentState.state_name,
              week_number: currentState.week_number,
              timestamp: new Date().toISOString()
            },
            created_at: new Date().toISOString()
          })
      }
    }

    console.log(`[CRON] Daily publish completed successfully for ${todaysBeer.beer_name}`)

    return NextResponse.json({
      success: true,
      message: 'Daily content published successfully',
      data: {
        state: currentState.state_name,
        week: currentState.week_number,
        day: dayOfWeek,
        beer: {
          name: todaysBeer.beer_name,
          brewery: todaysBeer.brewery_name,
          style: todaysBeer.beer_style,
          abv: todaysBeer.abv
        },
        social_posts_created: Object.keys(socialMediaContent).length,
        newsletter_results: dayOfWeek === 1 ? {
          successful: emailResults.successful,
          failed: emailResults.failed,
          total: emailResults.total
        } : null
      }
    })

  } catch (error) {
    console.error('[CRON] Daily publish error:', error)
    return NextResponse.json({
      error: 'Daily publish failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Social Media Content Generation Functions
function generateInstagramPost(beer: any, state: any): string {
  return `🍺 Day ${beer.day_of_week} in ${state.state_name}: ${beer.beer_name} 🍺

From ${beer.brewery_name} comes this exceptional ${beer.beer_style} at ${beer.abv}% ABV!

${beer.tasting_notes || 'A perfect example of ' + state.state_name + ' craft brewing excellence.'}

Join our 50-state beer journey! Link in bio ⬆️

#${state.state_name.replace(/\s+/g, '')}Beer #CraftBeer #${beer.beer_style.replace(/\s+/g, '')} #BrewQuestChronicles #HopHarrison #Week${state.week_number} #Day${beer.day_of_week}

📍 ${beer.brewery_name}, ${state.state_name}`
}

function generateTwitterPost(beer: any, state: any): string {
  return `🍺 Day ${beer.day_of_week} in ${state.state_name}:

${beer.beer_name} by ${beer.brewery_name}
${beer.beer_style} | ${beer.abv}% ABV

${beer.tasting_notes ? beer.tasting_notes.substring(0, 80) + '...' : 'Exceptional ' + state.state_name + ' craft brewing!'}

Full review: www.hopharrison.com

#CraftBeer #${state.state_name.replace(/\s+/g, '')} #Week${state.week_number}`
}

function generateFacebookPost(beer: any, state: any): string {
  return `🍺 Day ${beer.day_of_week} of our ${state.state_name} craft beer journey!

Today we're featuring ${beer.beer_name} from ${beer.brewery_name} - a fantastic ${beer.beer_style} at ${beer.abv}% ABV.

${beer.tasting_notes || 'This beer perfectly represents the craft brewing excellence we\'re discovering in ' + state.state_name + '.'}

${beer.unique_feature ? '\n🌟 What makes it special: ' + beer.unique_feature : ''}

Join us as we explore all 50 states, one beer at a time! Each week brings seven new discoveries from America's incredible craft brewing landscape.

Read the full review and brewery story: www.hopharrison.com

What's your favorite ${state.state_name} brewery? Let us know in the comments! 👇

#CraftBeer #${state.state_name.replace(/\s+/g, '')}Beer #${beer.beer_style.replace(/\s+/g, '')} #BrewQuestChronicles #HopHarrison #AmericanCraftBeer`
}

function generateLinkedInPost(beer: any, state: any): string {
  return `Craft Beer Industry Spotlight: ${state.state_name} Week ${state.week_number}, Day ${beer.day_of_week}

Today's featured brewery: ${beer.brewery_name}
Beer: ${beer.beer_name} (${beer.beer_style}, ${beer.abv}% ABV)

${beer.brewery_story || 'This brewery represents the innovation and quality driving ' + state.state_name + '\'s craft beer industry growth.'}

The craft beer sector continues to demonstrate how local businesses can build authentic brands, create jobs, and contribute to regional economic development. ${state.state_name}'s brewing industry showcases this trend perfectly.

Industry insights: www.hopharrison.com

#CraftBeer #SmallBusiness #EconomicDevelopment #${state.state_name.replace(/\s+/g, '')} #LocalBusiness #Innovation`
}

// Also handle POST requests for manual triggering
export async function POST(request: NextRequest) {
  return GET(request)
}