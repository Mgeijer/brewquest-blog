import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function auditDatabase() {
  console.log('🔍 BREWQUEST BLOG DATABASE AUDIT REPORT')
  console.log('=' .repeat(60))
  console.log()

  try {
    // 1. Check if tables exist
    console.log('📋 1. DATABASE SCHEMA VALIDATION')
    console.log('-'.repeat(40))
    
    const tableQueries = [
      'blog_posts',
      'beer_reviews', 
      'social_posts',
      'content_schedule',
      'state_progress',
      'analytics_events'
    ]

    const tableResults = {}
    for (const table of tableQueries) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          tableResults[table] = `❌ ERROR: ${error.message}`
        } else {
          tableResults[table] = '✅ EXISTS'
        }
      } catch (err) {
        tableResults[table] = `❌ ERROR: ${err.message}`
      }
    }

    Object.entries(tableResults).forEach(([table, status]) => {
      console.log(`${table}: ${status}`)
    })
    console.log()

    // 2. Check blog posts content
    console.log('📝 2. BLOG POSTS ANALYSIS')
    console.log('-'.repeat(40))
    
    try {
      const { data: blogPosts, error: blogError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('week_number')

      if (blogError) {
        console.log(`❌ Error querying blog_posts: ${blogError.message}`)
      } else {
        console.log(`Total blog posts: ${blogPosts?.length || 0}`)
        
        if (blogPosts && blogPosts.length > 0) {
          console.log('\nBlog Posts by State/Week:')
          blogPosts.forEach(post => {
            console.log(`- Week ${post.week_number}: ${post.state} - "${post.title}"`)
            console.log(`  Status: ${post.status || 'N/A'}, Published: ${post.published_at ? 'Yes' : 'No'}`)
          })
        } else {
          console.log('❌ No blog posts found')
        }
      }
    } catch (err) {
      console.log(`❌ Error checking blog_posts: ${err.message}`)
    }
    console.log()

    // 3. Check beer reviews
    console.log('🍺 3. BEER REVIEWS ANALYSIS')
    console.log('-'.repeat(40))
    
    try {
      const { data: beerReviews, error: beerError } = await supabase
        .from('beer_reviews')
        .select('*')
        .order('day_of_week')

      if (beerError) {
        console.log(`❌ Error querying beer_reviews: ${beerError.message}`)
      } else {
        console.log(`Total beer reviews: ${beerReviews?.length || 0}`)
        
        if (beerReviews && beerReviews.length > 0) {
          // Group by state
          const reviewsByState = {}
          beerReviews.forEach(review => {
            const state = review.state || 'Unknown'
            if (!reviewsByState[state]) {
              reviewsByState[state] = []
            }
            reviewsByState[state].push(review)
          })

          console.log('\nBeer Reviews by State:')
          Object.entries(reviewsByState).forEach(([state, reviews]) => {
            console.log(`- ${state}: ${reviews.length} reviews`)
            reviews.forEach(review => {
              console.log(`  Day ${review.day_of_week}: ${review.brewery_name} - ${review.beer_name}`)
            })
          })
        } else {
          console.log('❌ No beer reviews found')
        }
      }
    } catch (err) {
      console.log(`❌ Error checking beer_reviews: ${err.message}`)
    }
    console.log()

    // 4. Check social posts
    console.log('📱 4. SOCIAL POSTS ANALYSIS')
    console.log('-'.repeat(40))
    
    try {
      const { data: socialPosts, error: socialError } = await supabase
        .from('social_posts')
        .select('*')
        .order('scheduled_for')

      if (socialError) {
        console.log(`❌ Error querying social_posts: ${socialError.message}`)
      } else {
        console.log(`Total social posts: ${socialPosts?.length || 0}`)
        
        if (socialPosts && socialPosts.length > 0) {
          // Group by platform and status
          const postsByPlatform = {}
          const postsByStatus = {}
          
          socialPosts.forEach(post => {
            const platform = post.platform || 'Unknown'
            const status = post.status || 'Unknown'
            
            if (!postsByPlatform[platform]) postsByPlatform[platform] = 0
            if (!postsByStatus[status]) postsByStatus[status] = 0
            
            postsByPlatform[platform]++
            postsByStatus[status]++
          })

          console.log('\nSocial Posts by Platform:')
          Object.entries(postsByPlatform).forEach(([platform, count]) => {
            console.log(`- ${platform}: ${count} posts`)
          })

          console.log('\nSocial Posts by Status:')
          Object.entries(postsByStatus).forEach(([status, count]) => {
            console.log(`- ${status}: ${count} posts`)
          })
        } else {
          console.log('❌ No social posts found')
        }
      }
    } catch (err) {
      console.log(`❌ Error checking social_posts: ${err.message}`)
    }
    console.log()

    // 5. Check state progress
    console.log('📍 5. STATE PROGRESS ANALYSIS')
    console.log('-'.repeat(40))
    
    try {
      const { data: stateProgress, error: stateError } = await supabase
        .from('state_progress')
        .select('*')
        .order('order_index')

      if (stateError) {
        console.log(`❌ Error querying state_progress: ${stateError.message}`)
      } else {
        console.log(`Total states tracked: ${stateProgress?.length || 0}`)
        
        if (stateProgress && stateProgress.length > 0) {
          console.log('\nState Progress Summary:')
          const statusCounts = {}
          stateProgress.forEach(state => {
            const status = state.status || 'unknown'
            if (!statusCounts[status]) statusCounts[status] = 0
            statusCounts[status]++
          })

          Object.entries(statusCounts).forEach(([status, count]) => {
            console.log(`- ${status}: ${count} states`)
          })

          console.log('\nFirst 10 states:')
          stateProgress.slice(0, 10).forEach(state => {
            console.log(`- ${state.state_name} (${state.state_code}): ${state.status}`)
          })
        } else {
          console.log('❌ No state progress data found')
        }
      }
    } catch (err) {
      console.log(`❌ Error checking state_progress: ${err.message}`)
    }
    console.log()

    // 6. Alabama-specific content check
    console.log('🌟 6. ALABAMA CONTENT VERIFICATION')
    console.log('-'.repeat(40))
    
    try {
      // Check Alabama blog post
      const { data: alabamaBlog, error: alabamaBlogError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('state', 'Alabama')
        .single()

      if (alabamaBlogError) {
        console.log(`❌ Alabama blog post error: ${alabamaBlogError.message}`)
      } else if (alabamaBlog) {
        console.log(`✅ Alabama blog post found: "${alabamaBlog.title}"`)
        console.log(`   Week: ${alabamaBlog.week_number}, Status: ${alabamaBlog.status}`)
      } else {
        console.log('❌ No Alabama blog post found')
      }

      // Check Alabama beer reviews
      const { data: alabamaBeers, error: alabamaBeersError } = await supabase
        .from('beer_reviews')
        .select('*')
        .eq('state', 'Alabama')
        .order('day_of_week')

      if (alabamaBeersError) {
        console.log(`❌ Alabama beer reviews error: ${alabamaBeersError.message}`)
      } else if (alabamaBeers) {
        console.log(`✅ Alabama beer reviews found: ${alabamaBeers.length} reviews`)
        alabamaBeers.forEach(beer => {
          console.log(`   Day ${beer.day_of_week}: ${beer.brewery_name} - ${beer.beer_name}`)
        })
      } else {
        console.log('❌ No Alabama beer reviews found')
      }

    } catch (err) {
      console.log(`❌ Error checking Alabama content: ${err.message}`)
    }
    console.log()

    // 7. Content gaps analysis
    console.log('⚠️  7. CONTENT GAPS ANALYSIS')
    console.log('-'.repeat(40))
    
    const gaps = []
    
    // Check if we have the minimum required content
    if (tableResults.blog_posts?.includes('ERROR')) {
      gaps.push('❌ blog_posts table missing or inaccessible')
    }
    if (tableResults.beer_reviews?.includes('ERROR')) {
      gaps.push('❌ beer_reviews table missing or inaccessible')
    }
    if (tableResults.social_posts?.includes('ERROR')) {
      gaps.push('❌ social_posts table missing or inaccessible')
    }
    if (tableResults.state_progress?.includes('ERROR')) {
      gaps.push('❌ state_progress table missing or inaccessible')
    }

    if (gaps.length === 0) {
      console.log('✅ All core tables are accessible')
    } else {
      console.log('Content gaps identified:')
      gaps.forEach(gap => console.log(gap))
    }

    console.log()
    console.log('🎯 8. RECOMMENDATIONS')
    console.log('-'.repeat(40))
    
    const recommendations = []
    
    if (tableResults.blog_posts?.includes('ERROR')) {
      recommendations.push('- Create blog_posts table with proper schema')
    }
    if (tableResults.beer_reviews?.includes('ERROR')) {
      recommendations.push('- Create beer_reviews table with proper schema')
    }
    if (!tableResults.content_schedule?.includes('EXISTS')) {
      recommendations.push('- Consider adding content_schedule table for automation')
    }
    if (!tableResults.analytics_events?.includes('EXISTS')) {
      recommendations.push('- Add analytics_events table for tracking')
    }
    
    recommendations.push('- Verify RLS policies are properly configured')
    recommendations.push('- Test foreign key relationships between tables')
    recommendations.push('- Implement data validation triggers')
    recommendations.push('- Set up automated content scheduling functions')

    if (recommendations.length > 0) {
      console.log('Next steps recommended:')
      recommendations.forEach(rec => console.log(rec))
    }

  } catch (error) {
    console.error('❌ Database audit failed:', error.message)
  }

  console.log()
  console.log('✅ Database audit completed!')
  console.log('=' .repeat(60))
}

// Run the audit
auditDatabase()