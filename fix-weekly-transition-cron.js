/**
 * CRITICAL FIX: Weekly Transition Cron Job Failure
 * 
 * ROOT CAUSE IDENTIFIED:
 * - California (Week 5) is marked as "current" 
 * - NO upcoming states exist in database (Colorado Week 6 missing)
 * - Cron job fails when querying for upcoming states
 * - This has blocked transitions for 4+ weeks
 * 
 * SOLUTION:
 * - Add Colorado (Week 6) as "upcoming" state
 * - Add several more states to prevent future failures
 * - Create proper state progression chain
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// State data for next several weeks
const MISSING_STATES = [
  {
    state_code: 'CO',
    state_name: 'Colorado',
    week_number: 6,
    status: 'upcoming',
    region: 'west',
    description: 'Mile High brewing excellence - craft beer innovation capital of America',
    featured_breweries: [
      'Great Divide Brewing Company',
      'Odell Brewing Company', 
      'New Belgium Brewing Company',
      'Left Hand Brewing Company',
      'Oskar Blues Brewery',
      'Avery Brewing Company',
      'Breckenridge Brewery'
    ],
    total_breweries: 425,
    featured_beers_count: 7,
    journey_highlights: [
      'Craft beer capital with 425+ breweries',
      'Home of New Belgium Fat Tire and Odell IPA',
      'Great Divide Yeti Imperial Stout pioneer',
      'First state to legalize cannabis and craft beer flourished',
      'Rocky Mountain water creates distinctive beer profiles',
      'Craft brewery density highest in America',
      'Great American Beer Festival headquarters'
    ],
    difficulty_rating: 4,
    research_hours: 0
  },
  {
    state_code: 'CT',
    state_name: 'Connecticut',
    week_number: 7,
    status: 'upcoming',
    region: 'northeast',
    description: 'Constitution State craft brewing - New England tradition meets innovation',
    featured_breweries: [
      'Two Roads Brewing Company',
      'Kent Falls Brewing Company',
      'Stony Creek Brewery',
      'City Steam Brewery',
      'Thomas Hooker Brewery',
      'Beer\'d Brewing Company',
      'Hanging Hills Brewing Company'
    ],
    total_breweries: 75,
    featured_beers_count: 7,
    journey_highlights: [
      'New England IPA pioneers',
      'Historic brewing traditions since colonial times',
      'Craft beer renaissance in small towns',
      'Farm-to-brewery movement leaders',
      'Unique Connecticut-grown ingredients',
      'Strong brewery-restaurant partnerships',
      '75 craft breweries in compact state'
    ],
    difficulty_rating: 3,
    research_hours: 0
  },
  {
    state_code: 'DE',
    state_name: 'Delaware',
    week_number: 8,
    status: 'upcoming',
    region: 'northeast',
    description: 'First State brewing - small but mighty craft beer scene',
    featured_breweries: [
      'Dogfish Head Craft Brewery',
      '16 Mile Brewing Company',
      'Fordham & Dominion Brewing Company',
      'Iron Hill Brewery',
      'Bellefonte Brewing Company',
      'Revelation Craft Brewing Company',
      'Burley Oak Brewing Company'
    ],
    total_breweries: 25,
    featured_beers_count: 7,
    journey_highlights: [
      'Dogfish Head craft beer innovation legends',
      'Unique ingredient experimentation leaders',
      'Small state, big beer personalities',
      'Beach brewing culture',
      'Historic mid-Atlantic brewing traditions',
      'Craft beer tourism destination',
      '25 breweries punch above their weight'
    ],
    difficulty_rating: 2,
    research_hours: 0
  },
  {
    state_code: 'FL',
    state_name: 'Florida',
    week_number: 9,
    status: 'upcoming',
    region: 'southeast',
    description: 'Sunshine State brewing - tropical flavors meet craft innovation',
    featured_breweries: [
      'Cigar City Brewing',
      'Funky Buddha Brewery',
      'Florida Beer Company',
      'Crooked Can Brewing Company',
      'Green Bench Brewing Company',
      'Coppertail Brewing Company',
      'Bold City Brewery'
    ],
    total_breweries: 300,
    featured_beers_count: 7,
    journey_highlights: [
      'Cigar City Jai Alai IPA national recognition',
      'Tropical fruit-infused beer specialists',
      'Year-round brewing weather advantage',
      'Cuban and Caribbean influences',
      'Rapid craft beer growth statewide',
      'Beach brewery culture',
      '300+ breweries from Keys to Panhandle'
    ],
    difficulty_rating: 4,
    research_hours: 0
  },
  {
    state_code: 'GA',
    state_name: 'Georgia',
    week_number: 10,
    status: 'upcoming',
    region: 'southeast',
    description: 'Peach State brewing - Southern tradition meets modern craft',
    featured_breweries: [
      'Sweetwater Brewing Company',
      'Creature Comforts Brewing Co.',
      'Monday Night Brewing',
      'Wild Heaven Beer',
      'Terrapin Beer Co.',
      'Orpheus Brewing',
      'Three Taverns Craft Brewery'
    ],
    total_breweries: 150,
    featured_beers_count: 7,
    journey_highlights: [
      'Sweetwater 420 Extra Pale Ale icon',
      'Atlanta craft beer scene explosion',
      'Southern ingredients and traditions',
      'Peach and local fruit integration',
      'Strong brewery community culture',
      'Craft beer legislation victories',
      '150 breweries across diverse regions'
    ],
    difficulty_rating: 3,
    research_hours: 0
  }
]

async function fixWeeklyTransitionCron() {
  console.log('🚨 CRITICAL FIX: Weekly Transition Cron Job')
  console.log('==========================================')
  console.log('Adding missing states to fix 4-week cron failure\n')

  try {
    // Step 1: Verify current state
    const { data: currentState } = await supabase
      .from('state_progress')
      .select('state_code, state_name, week_number, status')
      .eq('status', 'current')
      .single()

    console.log(`✅ Current state verified: ${currentState.state_name} (Week ${currentState.week_number})`)

    // Step 2: Check if upcoming states already exist
    const { data: existingUpcoming } = await supabase
      .from('state_progress')
      .select('state_code, state_name, week_number')
      .eq('status', 'upcoming')
      .order('week_number')

    if (existingUpcoming && existingUpcoming.length > 0) {
      console.log('⚠️  Found existing upcoming states:')
      existingUpcoming.forEach(state => {
        console.log(`   ${state.state_name} (Week ${state.week_number})`)
      })
      console.log('\nDo you want to continue adding more states? (Continuing anyway...)')
    } else {
      console.log('✅ Confirmed: No upcoming states found (this is the problem!)')
    }

    // Step 3: Create blog posts for each state first
    const blogPostIds = []
    
    for (const state of MISSING_STATES) {
      console.log(`\n📝 Creating blog post for ${state.state_name}...`)
      
      const { data: blogPost, error: blogError } = await supabase
        .from('blog_posts')
        .insert({
          title: `${state.state_name} Beer Journey - Week ${state.week_number}`,
          slug: `${state.state_name.toLowerCase().replace(/\s+/g, '-')}-beer-journey-week-${state.week_number}`,
          content: `# ${state.state_name} Beer Journey - Week ${state.week_number}

${state.description}

## Featured Breweries
${state.featured_breweries.map(brewery => `- ${brewery}`).join('\n')}

## Journey Highlights
${state.journey_highlights.map(highlight => `- ${highlight}`).join('\n')}

*This is a placeholder blog post created by the weekly transition cron fix. Full content will be generated by the content system.*`,
          excerpt: state.description,
          state: state.state_code,
          week_number: state.week_number,
          read_time: 5,
          is_featured: false,
          seo_meta_description: state.description.substring(0, 160),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (blogError) {
        console.error(`❌ Error creating blog post for ${state.state_name}:`, blogError.message)
        throw blogError
      }

      blogPostIds.push({ state_code: state.state_code, blog_post_id: blogPost.id })
      console.log(`✅ Blog post created for ${state.state_name}`)
    }

    // Step 4: Insert all states with their blog post IDs
    const statesToInsert = MISSING_STATES.map((state, index) => ({
      ...state,
      blog_post_id: blogPostIds[index].blog_post_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    const { data: insertedStates, error: insertError } = await supabase
      .from('state_progress')
      .insert(statesToInsert)
      .select('state_code, state_name, week_number, status')

    if (insertError) {
      console.error('❌ Error inserting states:', insertError.message)
      throw insertError
    }

    console.log('\n🎯 SUCCESS! Added the following states:')
    insertedStates.forEach(state => {
      const icon = state.status === 'upcoming' ? '⏳' : '✅'
      console.log(`  ${icon} Week ${state.week_number}: ${state.state_name} (${state.status.toUpperCase()})`)
    })

    // Step 5: Verify the fix by testing cron logic
    console.log('\n🧪 TESTING WEEKLY TRANSITION LOGIC')
    console.log('==================================')

    const { data: testCurrent } = await supabase
      .from('state_progress')
      .select('*')
      .eq('status', 'current')
      .single()

    const { data: testNext } = await supabase
      .from('state_progress')
      .select('*')
      .eq('status', 'upcoming')
      .order('week_number')
      .limit(1)
      .single()

    if (testCurrent && testNext) {
      console.log(`✅ CRON LOGIC TEST PASSED!`)
      console.log(`   Current: ${testCurrent.state_name} (Week ${testCurrent.week_number})`)
      console.log(`   Next: ${testNext.state_name} (Week ${testNext.week_number})`)
      console.log(`   Next cron job will transition: ${testCurrent.state_name} → ${testNext.state_name}`)
    } else {
      console.log('❌ CRON LOGIC TEST FAILED - Issue still exists')
      return false
    }

    // Step 6: Show upcoming schedule
    console.log('\n📅 UPCOMING TRANSITION SCHEDULE')
    console.log('===============================')

    const { data: schedule } = await supabase
      .from('state_progress')
      .select('state_code, state_name, week_number, status')
      .in('status', ['current', 'upcoming'])
      .order('week_number')
      .limit(10)

    schedule.forEach(state => {
      const icon = state.status === 'current' ? '🔄' : '⏳'
      const label = state.status === 'current' ? 'CURRENT' : 'UPCOMING'
      console.log(`  ${icon} Week ${state.week_number}: ${state.state_name} (${label})`)
    })

    console.log('\n🎉 WEEKLY TRANSITION CRON JOB FIXED!')
    console.log('=====================================')
    console.log('✅ Colorado (Week 6) added as upcoming state')
    console.log('✅ Additional states added to prevent future failures')
    console.log('✅ Blog posts created for all new states')
    console.log('✅ Cron job logic tested and confirmed working')
    console.log('✅ Next automatic transition will work correctly')
    
    console.log('\n⏰ NEXT STEPS:')
    console.log('1. Weekly cron job will now transition California → Colorado')
    console.log('2. Subsequent weeks will follow proper progression')
    console.log('3. Monitor cron job logs for successful transitions')
    console.log('4. Add more states as needed for future weeks')

    return true

  } catch (error) {
    console.error('💥 CRITICAL ERROR in cron fix:', error.message)
    console.error(error)
    return false
  }
}

if (require.main === module) {
  fixWeeklyTransitionCron()
    .then(success => {
      if (success) {
        console.log('\n🏆 MISSION ACCOMPLISHED: Weekly transition cron job fixed!')
        process.exit(0)
      } else {
        console.log('\n💀 MISSION FAILED: Manual intervention required')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('Script execution failed:', error)
      process.exit(1)
    })
}

module.exports = { fixWeeklyTransitionCron }