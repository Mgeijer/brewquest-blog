import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function analyzeSchema() {
  console.log('🔍 DETAILED SCHEMA ANALYSIS')
  console.log('=' .repeat(60))

  try {
    // Get detailed schema information for each table
    const tables = ['blog_posts', 'beer_reviews', 'social_posts', 'content_schedule', 'state_progress']
    
    for (const tableName of tables) {
      console.log(`\n📋 ${tableName.toUpperCase()} TABLE STRUCTURE`)
      console.log('-'.repeat(40))
      
      try {
        // Get table columns using information_schema
        const { data: columns, error } = await supabase.rpc('get_table_columns', {
          table_name: tableName
        })

        if (error) {
          // Fallback: try to get sample data to understand structure
          const { data: sampleData, error: sampleError } = await supabase
            .from(tableName)
            .select('*')
            .limit(1)

          if (sampleError) {
            console.log(`❌ Error: ${sampleError.message}`)
          } else if (sampleData && sampleData.length > 0) {
            console.log('Columns detected from sample data:')
            Object.keys(sampleData[0]).forEach(column => {
              const value = sampleData[0][column]
              const type = typeof value
              console.log(`- ${column}: ${type} (value: ${value})`)
            })
          } else {
            console.log('Table exists but is empty')
          }
        } else {
          console.log('Schema columns:')
          columns?.forEach(col => {
            console.log(`- ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`)
          })
        }

        // Get row count
        const { count, error: countError } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })

        if (!countError) {
          console.log(`\nRow count: ${count}`)
        }

      } catch (err) {
        console.log(`❌ Error analyzing ${tableName}: ${err.message}`)
      }
    }

    // Check for missing columns that we expect
    console.log('\n⚠️  MISSING COLUMNS ANALYSIS')
    console.log('-'.repeat(40))

    const expectedColumns = {
      beer_reviews: ['state', 'blog_post_id'],
      social_posts: ['scheduled_for', 'platform', 'status'],
      state_progress: ['order_index', 'state_name', 'state_code', 'status'],
      blog_posts: ['state', 'week_number', 'title', 'status', 'published_at'],
      content_schedule: ['content_type', 'state', 'scheduled_date']
    }

    for (const [table, expectedCols] of Object.entries(expectedColumns)) {
      console.log(`\n${table}:`)
      
      for (const col of expectedCols) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select(col)
            .limit(1)

          if (error && error.message.includes('does not exist')) {
            console.log(`  ❌ Missing: ${col}`)
          } else {
            console.log(`  ✅ Has: ${col}`)
          }
        } catch (err) {
          console.log(`  ❌ Missing: ${col} (${err.message})`)
        }
      }
    }

    // Foreign key relationships check
    console.log('\n🔗 FOREIGN KEY RELATIONSHIPS')
    console.log('-'.repeat(40))

    try {
      // Check if beer_reviews references blog_posts
      const { data: reviewsWithBlogPost, error } = await supabase
        .from('beer_reviews')
        .select(`
          *,
          blog_posts:blog_post_id(title, state)
        `)
        .limit(1)

      if (error) {
        console.log('❌ beer_reviews -> blog_posts relationship issue:', error.message)
      } else {
        console.log('✅ beer_reviews -> blog_posts relationship working')
      }
    } catch (err) {
      console.log('❌ Foreign key check failed:', err.message)
    }

  } catch (error) {
    console.error('❌ Schema analysis failed:', error.message)
  }
}

analyzeSchema()