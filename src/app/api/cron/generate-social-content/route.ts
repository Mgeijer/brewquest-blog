import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Weekly Social Content Generation Cron Job
 * Runs every Monday at 2 PM EST (14:00 UTC)
 * 
 * FUNCTIONALITY:
 * - Generates weekly overview social posts
 * - Creates preview content for the week's 7 beers
 * - Prepares Monday's special double post (weekly + daily)
 * - Updates social media content database
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
    
    console.log(`[CRON] Weekly social content generation starting`)

    // Get current state
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

    // Get all beer reviews for current state
    const { data: weeklyBeers, error: beersError } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('blog_post_id', currentState.blog_post_id)
      .order('day_of_week')

    if (beersError || !weeklyBeers || weeklyBeers.length === 0) {
      console.error('[CRON] No beer reviews found:', beersError)
      return NextResponse.json({ 
        error: 'No beer reviews found for current state',
        state: currentState.state_name 
      }, { status: 404 })
    }

    // Get blog post for current state
    const { data: blogPost, error: blogError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', currentState.blog_post_id)
      .single()

    if (blogError) {
      console.error('[CRON] Blog post not found:', blogError)
    }

    // Generate weekly overview content
    const weeklyContent = {
      instagram: generateWeeklyInstagramPost(currentState, weeklyBeers, blogPost),
      twitter: generateWeeklyTwitterPost(currentState, weeklyBeers, blogPost),
      facebook: generateWeeklyFacebookPost(currentState, weeklyBeers, blogPost),
      linkedin: generateWeeklyLinkedInPost(currentState, weeklyBeers, blogPost)
    }

    // Generate Monday's special content (weekly announcement + first beer)
    const mondaySpecialContent = weeklyBeers.find(beer => beer.day_of_week === 1)
    const mondayContent = mondaySpecialContent ? {
      instagram: generateMondayInstagramPost(currentState, mondaySpecialContent, weeklyBeers),
      twitter: generateMondayTwitterPost(currentState, mondaySpecialContent, weeklyBeers),
      facebook: generateMondayFacebookPost(currentState, mondaySpecialContent, weeklyBeers),
      linkedin: generateMondayLinkedInPost(currentState, mondaySpecialContent, weeklyBeers)
    } : null

    // Prepare social posts for database insertion
    const socialPosts = []

    // Add weekly overview posts
    Object.entries(weeklyContent).forEach(([platform, content]) => {
      socialPosts.push({
        platform,
        content_type: 'weekly_overview',
        title: `Week ${currentState.week_number}: ${currentState.state_name} Craft Beer Journey`,
        content: content,
        scheduled_for: new Date().toISOString(),
        status: 'ready',
        state_week: currentState.week_number,
        created_at: new Date().toISOString()
      })
    })

    // Add Monday special posts if available
    if (mondayContent) {
      Object.entries(mondayContent).forEach(([platform, content]) => {
        socialPosts.push({
          platform,
          content_type: 'monday_special',
          title: `Monday Special: ${currentState.state_name} Week Launch + ${mondaySpecialContent.beer_name}`,
          content: content,
          scheduled_for: new Date().toISOString(),
          status: 'ready',
          beer_review_id: mondaySpecialContent.id,
          state_week: currentState.week_number,
          created_at: new Date().toISOString()
        })
      })
    }

    // Save all social media content to database
    const { data: insertedPosts, error: socialError } = await supabase
      .from('social_posts')
      .insert(socialPosts)
      .select()

    if (socialError) {
      console.error('[CRON] Social media content save failed:', socialError)
      return NextResponse.json({
        error: 'Failed to save social content',
        details: socialError.message
      }, { status: 500 })
    }

    // Log analytics event
    const { error: analyticsError } = await supabase
      .from('analytics_events')
      .insert({
        event_type: 'weekly_social_generation',
        event_data: {
          state: currentState.state_name,
          week: currentState.week_number,
          posts_created: socialPosts.length,
          beer_count: weeklyBeers.length,
          platforms: Object.keys(weeklyContent)
        },
        created_at: new Date().toISOString()
      })

    if (analyticsError) {
      console.error('[CRON] Analytics logging failed:', analyticsError)
    }

    console.log(`[CRON] Weekly social content generated: ${socialPosts.length} posts for ${currentState.state_name}`)

    return NextResponse.json({
      success: true,
      message: 'Weekly social content generated successfully',
      data: {
        state: currentState.state_name,
        week: currentState.week_number,
        posts_created: socialPosts.length,
        beer_count: weeklyBeers.length,
        platforms: Object.keys(weeklyContent),
        monday_special: !!mondayContent
      }
    })

  } catch (error) {
    console.error('[CRON] Weekly social generation error:', error)
    return NextResponse.json({
      error: 'Weekly social generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Weekly Social Media Content Generation Functions
function generateWeeklyInstagramPost(state: any, beers: any[], blogPost?: any): string {
  const breweries = [...new Set(beers.map(beer => beer.brewery_name))]
  
  return `🍺 WEEK ${state.week_number}: Welcome to ${state.state_name}! 🍺

This week we're exploring ${state.state_name}'s incredible craft beer scene with 7 amazing beers from ${breweries.length} exceptional breweries! 🌟

🏭 Featured Breweries:
${breweries.slice(0, 3).map(brewery => `• ${brewery}`).join('\n')}
${breweries.length > 3 ? `+ ${breweries.length - 3} more!` : ''}

🍺 This Week's Beer Lineup:
${beers.slice(0, 4).map(beer => `Day ${beer.day_of_week}: ${beer.beer_name} (${beer.beer_style})`).join('\n')}
${beers.length > 4 ? `+ ${beers.length - 4} more exceptional beers!` : ''}

Join our 50-state craft beer journey! New beer every day, full stories on our blog 📖

Link in bio ⬆️

#${state.state_name.replace(/\s+/g, '')}Beer #CraftBeer #Week${state.week_number} #BrewQuestChronicles #HopHarrison #50StateJourney #AmericanCraftBeer

📍 Currently exploring: ${state.state_name}`
}

function generateWeeklyTwitterPost(state: any, beers: any[], blogPost?: any): string {
  return `🍺 WEEK ${state.week_number}: ${state.state_name} craft beer journey begins!

7 beers, ${[...new Set(beers.map(beer => beer.brewery_name))].length} breweries, endless flavor discoveries 🌟

Starting Monday with ${beers.find(b => b.day_of_week === 1)?.beer_name} from ${beers.find(b => b.day_of_week === 1)?.brewery_name}

Full lineup: www.hopharrison.com

#CraftBeer #${state.state_name.replace(/\s+/g, '')} #Week${state.week_number} #50StateJourney`
}

function generateWeeklyFacebookPost(state: any, beers: any[], blogPost?: any): string {
  const breweries = [...new Set(beers.map(beer => beer.brewery_name))]
  
  return `🍺 WEEK ${state.week_number}: Welcome to ${state.state_name}'s Craft Beer Journey! 🇺🇸

We're kicking off an exciting week exploring ${state.state_name}'s incredible craft beer landscape! Over the next 7 days, we'll be featuring one exceptional beer each day from some of the state's most innovative breweries.

🏭 This Week's Featured Breweries:
${breweries.map(brewery => `• ${brewery}`).join('\n')}

🍺 Your Weekly Beer Preview:
${beers.map(beer => `Day ${beer.day_of_week}: ${beer.beer_name} - ${beer.beer_style} (${beer.abv}% ABV)`).join('\n')}

Each beer tells a story - from the passionate brewers who created it to the local community it serves. We'll dive deep into tasting notes, brewery histories, and what makes each one special.

${blogPost ? `Read our comprehensive ${state.state_name} craft beer guide: www.hopharrison.com` : `Follow along daily for new discoveries: www.hopharrison.com`}

What ${state.state_name} brewery are you most excited to learn about? Drop your predictions in the comments! 👇

#${state.state_name.replace(/\s+/g, '')}Beer #CraftBeer #Week${state.week_number} #BrewQuestChronicles #HopHarrison #50StateJourney #AmericanCraftBeer`
}

function generateWeeklyLinkedInPost(state: any, beers: any[], blogPost?: any): string {
  const breweries = [...new Set(beers.map(beer => beer.brewery_name))]
  
  return `Week ${state.week_number}: ${state.state_name} Craft Beer Industry Spotlight 🍺

This week we're analyzing ${state.state_name}'s craft brewing sector through 7 representative breweries showcasing the state's innovation and market positioning.

**Industry Overview:**
• ${breweries.length} featured breweries representing diverse market segments
• ${beers.length} products spanning ${[...new Set(beers.map(beer => beer.beer_style))].length} different style categories
• Range of ABV from ${Math.min(...beers.map(beer => parseFloat(beer.abv) || 0))}% to ${Math.max(...beers.map(beer => parseFloat(beer.abv) || 0))}%

**Featured Companies:**
${breweries.map(brewery => `• ${brewery}`).join('\n')}

**Key Market Insights:**
This week's analysis will cover local supply chain partnerships, distribution strategies, marketing approaches, and community economic impact.

Each brewery represents different aspects of ${state.state_name}'s craft beer ecosystem - from established market leaders to innovative newcomers driving category growth.

**Business Development Opportunities:**
The craft beer industry's success in ${state.state_name} demonstrates how local businesses can build authentic brands while contributing to regional economic development.

Full industry analysis: www.hopharrison.com

#CraftBeer #${state.state_name.replace(/\s+/g, '')} #SmallBusiness #EconomicDevelopment #LocalBusiness #Innovation #IndustryAnalysis`
}

// Monday Special Content (Week Launch + First Beer)
function generateMondayInstagramPost(state: any, mondayBeer: any, allBeers: any[]): string {
  return `🍺 MONDAY SPECIAL: Week ${state.week_number} Launch + Today's Beer! 🍺

🎉 Welcome to ${state.state_name} Week! 
📅 Day 1 of 7 incredible beer discoveries

TODAY'S FEATURED BEER:
${mondayBeer.beer_name} by ${mondayBeer.brewery_name}
${mondayBeer.beer_style} | ${mondayBeer.abv}% ABV

${mondayBeer.tasting_notes || 'A perfect start to our ' + state.state_name + ' craft beer adventure!'}

🗓️ THIS WEEK'S LINEUP:
${allBeers.slice(0, 3).map(beer => `Day ${beer.day_of_week}: ${beer.beer_name}`).join('\n')}
...and 4 more amazing discoveries!

Double the content on Mondays = Week preview + Daily beer feature! 🎯

Link in bio for full stories ⬆️

#MondaySpecial #${state.state_name.replace(/\s+/g, '')}Beer #Week${state.week_number}Launch #${mondayBeer.beer_style.replace(/\s+/g, '')} #BrewQuestChronicles #HopHarrison

📍 Starting strong in ${state.state_name}!`
}

function generateMondayTwitterPost(state: any, mondayBeer: any, allBeers: any[]): string {
  return `🍺 MONDAY SPECIAL: ${state.state_name} Week Launch!

Week ${state.week_number} starts with ${mondayBeer.beer_name} by ${mondayBeer.brewery_name}

${mondayBeer.beer_style} | ${mondayBeer.abv}% ABV

This week: 7 beers, ${[...new Set(allBeers.map(beer => beer.brewery_name))].length} breweries, endless discoveries 🌟

Full lineup: www.hopharrison.com

#MondaySpecial #CraftBeer #${state.state_name.replace(/\s+/g, '')} #Week${state.week_number}`
}

function generateMondayFacebookPost(state: any, mondayBeer: any, allBeers: any[]): string {
  return `🍺 MONDAY SPECIAL: ${state.state_name} Week Launch + Today's Beer Feature! 🎉

It's Monday, which means double the craft beer content! We're launching Week ${state.week_number} with a full preview of ${state.state_name}'s incredible brewing scene, PLUS featuring today's exceptional beer.

🎯 TODAY'S SPOTLIGHT BEER:
${mondayBeer.beer_name} from ${mondayBeer.brewery_name}
Style: ${mondayBeer.beer_style} | ABV: ${mondayBeer.abv}%

${mondayBeer.tasting_notes || 'This exceptional ' + mondayBeer.beer_style + ' perfectly kicks off our ' + state.state_name + ' adventure!'}

🗓️ THIS WEEK'S COMPLETE LINEUP:
${allBeers.map(beer => `Day ${beer.day_of_week}: ${beer.beer_name} from ${beer.brewery_name} (${beer.beer_style})`).join('\n')}

Every Monday we do this special double feature - giving you both the weekly overview AND the day's featured beer. It's our way of making sure you never miss the excitement of starting a new state!

Ready to discover what makes ${state.state_name}'s craft beer scene special? Follow along all week as we explore each brewery's story, brewing techniques, and community impact.

Full stories and tasting notes: www.hopharrison.com

What ${state.state_name} beer style are you most excited to try? Let us know! 👇

#MondaySpecial #${state.state_name.replace(/\s+/g, '')}Beer #Week${state.week_number}Launch #${mondayBeer.beer_style.replace(/\s+/g, '')} #BrewQuestChronicles #HopHarrison #CraftBeer`
}

function generateMondayLinkedInPost(state: any, mondayBeer: any, allBeers: any[]): string {
  const breweries = [...new Set(allBeers.map(beer => beer.brewery_name))]
  
  return `Monday Market Analysis: ${state.state_name} Craft Beer Industry - Week ${state.week_number} 📊

Starting this week's industry spotlight with ${mondayBeer.brewery_name}'s ${mondayBeer.beer_name}, a ${mondayBeer.beer_style} that exemplifies ${state.state_name}'s brewing innovation.

**Week ${state.week_number} Analysis Framework:**
• ${breweries.length} companies representing diverse market segments
• Product portfolio spanning ${[...new Set(allBeers.map(beer => beer.beer_style))].length} beer categories
• Market positioning from traditional to innovative styles

**Featured Companies This Week:**
${breweries.map(brewery => `• ${brewery}`).join('\n')}

**Monday Spotlight: ${mondayBeer.brewery_name}**
Product: ${mondayBeer.beer_name} (${mondayBeer.beer_style}, ${mondayBeer.abv}% ABV)
${mondayBeer.brewery_story || 'This brewery demonstrates key market trends in ' + state.state_name + '\'s craft beer sector.'}

**Industry Insights:**
Each Monday we launch our weekly state analysis with both macro industry trends and specific company spotlights, providing comprehensive coverage of local business success stories.

This approach demonstrates how craft brewing drives regional economic development through job creation, tourism, and supply chain partnerships.

Complete industry analysis: www.hopharrison.com

#MondayAnalysis #CraftBeer #${state.state_name.replace(/\s+/g, '')} #SmallBusiness #EconomicDevelopment #IndustrySpotlight #LocalBusiness`
}

// Also handle POST requests for manual triggering
export async function POST(request: NextRequest) {
  return GET(request)
}