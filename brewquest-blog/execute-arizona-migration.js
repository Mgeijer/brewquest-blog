#!/usr/bin/env node

/**
 * Arizona Week 3 Supabase Migration Executor
 * Executes the SQL migration script to populate Arizona brewery data
 */

const fs = require('fs')
const path = require('path')

// Read the SQL migration file
const migrationPath = path.join(__dirname, 'arizona-week3-supabase-migration.sql')
const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

console.log('🌵 Arizona Week 3 Migration Executor')
console.log('=====================================')
console.log('')

async function executeArizonaMigration() {
  try {
    // Check if we have the SQL file
    if (!fs.existsSync(migrationPath)) {
      throw new Error('Migration SQL file not found')
    }

    console.log('✅ Migration SQL file loaded')
    console.log(`📄 File size: ${migrationSQL.length} characters`)
    console.log('')

    // Count the operations in the SQL
    const breweryInserts = (migrationSQL.match(/INSERT INTO breweries/g) || []).length
    const beerInserts = (migrationSQL.match(/INSERT INTO beers/g) || []).length
    const reviewInserts = (migrationSQL.match(/INSERT INTO beer_reviews/g) || []).length
    const stateProgressInserts = (migrationSQL.match(/INSERT INTO state_progress/g) || []).length

    console.log('📊 Migration Summary:')
    console.log(`   • ${breweryInserts} brewery records`)
    console.log(`   • ${beerInserts} beer records`)
    console.log(`   • ${reviewInserts} beer review records`)
    console.log(`   • ${stateProgressInserts} state progress records`)
    console.log('')

    // For now, we'll just prepare the migration and log instructions
    console.log('🔧 Next Steps:')
    console.log('1. Connect to your Supabase database')
    console.log('2. Execute the migration SQL file')
    console.log('3. Verify the data was inserted correctly')
    console.log('')

    console.log('📝 Supabase SQL Editor Instructions:')
    console.log('1. Open your Supabase project dashboard')
    console.log('2. Go to the SQL Editor')
    console.log('3. Copy and paste the contents of arizona-week3-supabase-migration.sql')
    console.log('4. Click "Run" to execute the migration')
    console.log('')

    console.log('🗺️ Arizona Week 3 Content Summary:')
    console.log('   • Four Peaks Kilt Lifter (Monday)')
    console.log('   • Arizona Wilderness Refuge IPA (Tuesday)')
    console.log('   • Historic Piehole Porter (Wednesday)')
    console.log('   • Dragoon IPA (Thursday)')
    console.log('   • SanTan Devil\'s Ale (Friday)')
    console.log('   • Oak Creek Nut Brown Ale (Saturday)')
    console.log('   • Mother Road Tower Station IPA (Sunday)')
    console.log('')

    console.log('✅ Migration prepared successfully!')
    console.log('🚀 Ready for Supabase database population')

    return {
      success: true,
      breweries: breweryInserts,
      beers: beerInserts,
      reviews: reviewInserts,
      stateProgress: stateProgressInserts
    }

  } catch (error) {
    console.error('❌ Migration preparation failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Execute if called directly
if (require.main === module) {
  executeArizonaMigration()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 Arizona Week 3 migration ready for execution!')
        process.exit(0)
      } else {
        console.error('\n💥 Migration preparation failed')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
      process.exit(1)
    })
}

module.exports = { executeArizonaMigration }