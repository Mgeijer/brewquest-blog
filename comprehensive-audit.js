import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function comprehensiveAudit() {
  console.log('🔍 COMPREHENSIVE BREWQUEST DATABASE AUDIT')
  console.log('=' .repeat(70))
  console.log(`Database: ${supabaseUrl}`)
  console.log(`Date: ${new Date().toISOString()}`)
  console.log()

  // 1. Schema vs Reality Comparison
  console.log('📊 1. SCHEMA VALIDATION AGAINST EXPECTED STRUCTURE')
  console.log('-'.repeat(50))

  const expectedTables = {
    'blog_posts': ['title', 'slug', 'state', 'week_number', 'status', 'published_at'],
    'beer_reviews': ['blog_post_id', 'brewery_name', 'beer_name', 'state_code', 'day_of_week'],
    'social_posts': ['platform', 'content', 'scheduled_time', 'status'],
    'state_progress': ['state_code', 'state_name', 'status', 'week_number'],
    'content_schedule': ['content_type', 'state', 'scheduled_date'],
    'analytics_events': ['event_type', 'timestamp', 'metadata']
  }

  for (const [tableName, expectedColumns] of Object.entries(expectedTables)) {
    console.log(`\n${tableName.toUpperCase()}:`)
    
    try {
      // Check if table exists by trying to query it
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)

      if (error) {
        console.log(`  ❌ Table missing or inaccessible: ${error.message}`)
        continue
      }

      console.log(`  ✅ Table exists`)

      // Check expected columns
      if (data && data.length > 0) {
        const actualColumns = Object.keys(data[0])
        console.log(`  📋 Actual columns (${actualColumns.length}): ${actualColumns.join(', ')}`)
        
        console.log(`  🔍 Column validation:`)
        for (const expectedCol of expectedColumns) {
          if (actualColumns.includes(expectedCol)) {
            console.log(`    ✅ ${expectedCol}`)
          } else {
            console.log(`    ❌ MISSING: ${expectedCol}`)
          }
        }
      } else {
        console.log(`  ⚠️  Table exists but is empty - cannot validate columns`)
      }

      // Get row count
      const { count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })

      console.log(`  📊 Row count: ${count || 0}`)

    } catch (err) {
      console.log(`  ❌ Error checking ${tableName}: ${err.message}`)
    }
  }

  // 2. Content Analysis
  console.log('\n\n📚 2. CONTENT ANALYSIS')
  console.log('-'.repeat(50))

  try {
    // Alabama content check
    console.log('\n🌟 ALABAMA WEEK 1 CONTENT AUDIT:')
    
    // Blog post
    const { data: alabamaBlogPost, error: blogError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('state', 'Alabama')
      .single()

    if (blogError) {
      console.log(`❌ Alabama blog post: ${blogError.message}`)
    } else if (alabamaBlogPost) {
      console.log(`✅ Alabama blog post: "${alabamaBlogPost.title}"`)
      console.log(`   Week: ${alabamaBlogPost.week_number}`)
      console.log(`   Status: ${alabamaBlogPost.status || 'undefined'}`)
      console.log(`   Published: ${alabamaBlogPost.published_at ? 'Yes' : 'No'}`)
      console.log(`   Word count: ~${Math.floor(alabamaBlogPost.content.length / 5)} words`)
    }

    // Beer reviews for Alabama
    const { data: alabamaBeers, error: beersError } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('blog_post_id', alabamaBlogPost?.id)
      .order('day_of_week')

    if (beersError) {
      console.log(`❌ Alabama beer reviews: ${beersError.message}`)
    } else if (alabamaBeers) {
      console.log(`✅ Alabama beer reviews: ${alabamaBeers.length} found`)
      
      if (alabamaBeers.length === 7) {
        console.log(`   ✅ Complete 7-day schedule`)
        alabamaBeers.forEach(beer => {
          console.log(`   Day ${beer.day_of_week}: ${beer.brewery_name} - ${beer.beer_name} (${beer.rating}/5)`)
        })
      } else {
        console.log(`   ⚠️  Incomplete: Expected 7, found ${alabamaBeers.length}`)
      }
    }

    // Check for other states
    console.log('\n🗺️  OTHER STATES CONTENT:')
    
    const { data: allStates, error: statesError } = await supabase
      .from('state_progress')
      .select('state_code, state_name, status, week_number')
      .order('week_number')

    if (statesError) {
      console.log(`❌ Error loading states: ${statesError.message}`)
    } else if (allStates) {
      console.log(`✅ Total states in database: ${allStates.length}`)
      
      const statusCounts = {}
      allStates.forEach(state => {
        const status = state.status || 'unknown'
        if (!statusCounts[status]) statusCounts[status] = 0
        statusCounts[status]++
      })

      console.log('\n   Status breakdown:')
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`   - ${status}: ${count} states`)
      })

      console.log('\n   First 10 states:')
      allStates.slice(0, 10).forEach(state => {
        console.log(`   Week ${state.week_number}: ${state.state_name} (${state.state_code}) - ${state.status}`)
      })
    }

  } catch (err) {
    console.log(`❌ Content analysis error: ${err.message}`)
  }

  // 3. Social Media Content Check
  console.log('\n\n📱 3. SOCIAL MEDIA CONTENT ANALYSIS')
  console.log('-'.repeat(50))

  try {
    const { data: socialPosts, error: socialError } = await supabase
      .from('social_posts')
      .select('*')

    if (socialError) {
      console.log(`❌ Social posts error: ${socialError.message}`)
    } else {
      console.log(`📊 Total social posts: ${socialPosts?.length || 0}`)
      
      if (socialPosts && socialPosts.length > 0) {
        // Analyze by platform
        const platformCounts = {}
        const statusCounts = {}
        
        socialPosts.forEach(post => {
          const platform = post.platform || 'unknown'
          const status = post.status || 'unknown'
          
          if (!platformCounts[platform]) platformCounts[platform] = 0
          if (!statusCounts[status]) statusCounts[status] = 0
          
          platformCounts[platform]++
          statusCounts[status]++
        })

        console.log('\n   By platform:')
        Object.entries(platformCounts).forEach(([platform, count]) => {
          console.log(`   - ${platform}: ${count} posts`)
        })

        console.log('\n   By status:')
        Object.entries(statusCounts).forEach(([status, count]) => {
          console.log(`   - ${status}: ${count} posts`)
        })
      } else {
        console.log('⚠️  No social media posts found - content scheduling not set up')
      }
    }
  } catch (err) {
    console.log(`❌ Social media analysis error: ${err.message}`)
  }

  // 4. Database Health Check
  console.log('\n\n💊 4. DATABASE HEALTH CHECK')
  console.log('-'.repeat(50))

  try {
    // Test database functions if they exist
    const healthCheck = await supabase.rpc('get_database_health')
    
    if (healthCheck.data) {
      console.log('✅ Database health function working')
      console.log(`   Health data: ${JSON.stringify(healthCheck.data, null, 2)}`)
    } else if (healthCheck.error) {
      console.log(`⚠️  Database health function issue: ${healthCheck.error.message}`)
    }
  } catch (err) {
    console.log(`⚠️  Database health function not available: ${err.message}`)
  }

  try {
    // Test journey statistics function
    const journeyStats = await supabase.rpc('get_journey_statistics')
    
    if (journeyStats.data) {
      console.log('✅ Journey statistics function working')
      console.log(`   Journey stats: ${JSON.stringify(journeyStats.data, null, 2)}`)
    } else if (journeyStats.error) {
      console.log(`⚠️  Journey statistics issue: ${journeyStats.error.message}`)
    }
  } catch (err) {
    console.log(`⚠️  Journey statistics function not available: ${err.message}`)
  }

  // 5. Missing Components Analysis
  console.log('\n\n🔍 5. MISSING COMPONENTS ANALYSIS')
  console.log('-'.repeat(50))

  const missingComponents = []

  // Check for critical missing tables
  if (!expectedTables.analytics_events) {
    missingComponents.push('analytics_events table for tracking user interactions')
  }

  // Check for missing columns in existing tables
  try {
    const { data: socialData } = await supabase.from('social_posts').select('*').limit(1)
    if (socialData && socialData.length === 0) {
      missingComponents.push('Social media content scheduling and posts')
    }
  } catch (err) {
    // Table doesn't exist or has issues
  }

  try {
    const { data: scheduleData } = await supabase.from('content_schedule').select('*').limit(1)
    if (scheduleData && scheduleData.length === 0) {
      missingComponents.push('Content scheduling automation')
    }
  } catch (err) {
    // Table doesn't exist or has issues
  }

  // Check for Alaska content preparation
  try {
    const { data: alaskaBlog } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('state', 'Alaska')
      .single()

    if (!alaskaBlog) {
      missingComponents.push('Alaska Week 2 content preparation (blog post + 7 beer reviews)')
    }
  } catch (err) {
    missingComponents.push('Alaska Week 2 content preparation (blog post + 7 beer reviews)')
  }

  if (missingComponents.length > 0) {
    console.log('⚠️  Missing components identified:')
    missingComponents.forEach(component => {
      console.log(`   - ${component}`)
    })
  } else {
    console.log('✅ All critical components appear to be in place')
  }

  // 6. Recommendations
  console.log('\n\n🎯 6. RECOMMENDATIONS & NEXT STEPS')
  console.log('-'.repeat(50))

  const recommendations = [
    'Add missing status column to blog_posts table for content workflow',
    'Create analytics_events table for user interaction tracking',
    'Populate social_posts table with Alabama Week 1 content',
    'Set up content_schedule entries for automation',
    'Prepare Alaska Week 2 content (1 blog post + 7 beer reviews)',
    'Implement RLS policies for content management security',
    'Add database triggers for automated status updates',
    'Create materialized views for performance optimization',
    'Set up realtime subscriptions for live updates',
    'Test all database functions and stored procedures'
  ]

  console.log('Priority actions:')
  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`)
  })

  console.log('\n✅ AUDIT COMPLETED')
  console.log('=' .repeat(70))
  console.log(`Report generated: ${new Date().toISOString()}`)
}

comprehensiveAudit()