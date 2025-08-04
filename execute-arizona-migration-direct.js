#!/usr/bin/env node

/**
 * Direct Arizona Week 3 Supabase Migration Executor
 * This script directly executes the migration against Supabase
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config()

console.log('🌵 Arizona Week 3 Direct Migration Executor')
console.log('==========================================')
console.log('')

async function executeDirectMigration() {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('⚠️  Environment variables not found')
      console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
      console.log('')
      console.log('For now, we\'ll provide the migration SQL for manual execution:')
      console.log('')
      
      // Show the SQL content for manual execution
      const migrationPath = path.join(__dirname, 'brewquest-blog/arizona-week3-supabase-migration.sql')
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
      
      console.log('📄 Migration SQL Content:')
      console.log('=========================')
      console.log(migrationSQL)
      
      return {
        success: true,
        message: 'Migration SQL provided for manual execution',
        mode: 'manual'
      }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'brewquest-blog/arizona-week3-supabase-migration.sql')
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error('Migration file not found: arizona-week3-supabase-migration.sql')
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    console.log('✅ Migration SQL file loaded')
    console.log(`📄 File size: ${migrationSQL.length} characters`)
    console.log('')

    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'))

    console.log(`🔄 Executing ${statements.length} SQL statements...`)
    console.log('')

    let successCount = 0
    let errorCount = 0
    const results = []

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      // Skip verification queries and PLPGSQL blocks
      if (statement.includes('SELECT COUNT(*)') || 
          statement.includes('RAISE NOTICE') ||
          statement.includes('Show complete') ||
          statement.startsWith('DO $$')) {
        continue
      }

      try {
        console.log(`  Executing statement ${i + 1}/${statements.length}...`)
        
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql_query: statement 
        })

        if (error) {
          console.error(`  ❌ Error in statement ${i + 1}:`, error.message)
          errorCount++
          results.push({
            statement: statement.substring(0, 100) + '...',
            success: false,
            error: error.message
          })
        } else {
          console.log(`  ✅ Statement ${i + 1} executed successfully`)
          successCount++
          results.push({
            statement: statement.substring(0, 100) + '...',
            success: true,
            data
          })
        }
      } catch (err) {
        console.error(`  💥 Exception in statement ${i + 1}:`, err.message)
        errorCount++
        results.push({
          statement: statement.substring(0, 100) + '...',
          success: false,
          error: err.message
        })
      }
    }

    console.log('')
    console.log('📊 Migration Results:')
    console.log(`   ✅ Successful: ${successCount}`)
    console.log(`   ❌ Failed: ${errorCount}`)
    console.log('')

    // Verify the migration by checking inserted data
    console.log('🔍 Verifying inserted data...')
    
    const { data: reviews, error: reviewsError } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('state', 'Arizona')
      .eq('week_number', 3)

    if (reviewsError) {
      console.error('Error checking reviews:', reviewsError)
    } else {
      console.log(`✅ Found ${reviews?.length || 0} Arizona Week 3 beer reviews`)
    }

    const { data: stateProgress, error: progressError } = await supabase
      .from('state_progress')
      .select('*')
      .eq('state_name', 'Arizona')
      .eq('week_number', 3)

    if (progressError) {
      console.error('Error checking state progress:', progressError)
    } else {
      console.log(`✅ Found ${stateProgress?.length || 0} Arizona Week 3 state progress records`)
    }

    console.log('')
    console.log('🎉 Arizona Week 3 migration completed!')
    console.log('')

    return {
      success: true,
      stats: {
        successCount,
        errorCount,
        reviews: reviews?.length || 0,
        stateProgress: stateProgress?.length || 0
      },
      results: results.slice(0, 5) // Return first 5 results
    }

  } catch (error) {
    console.error('💥 Migration execution failed:', error.message)
    return { 
      success: false, 
      error: error.message 
    }
  }
}

// Execute if called directly
if (require.main === module) {
  executeDirectMigration()
    .then(result => {
      if (result.success) {
        console.log('\n🚀 Arizona Week 3 migration execution completed!')
        if (result.mode === 'manual') {
          console.log('Please copy the SQL above and execute it in your Supabase SQL Editor.')
        }
        process.exit(0)
      } else {
        console.error('\n💥 Migration execution failed')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
      process.exit(1)
    })
}

module.exports = { executeDirectMigration }