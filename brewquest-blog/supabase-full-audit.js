#!/usr/bin/env node

/**
 * Complete Supabase Database Audit
 * Checks all tables and identifies missing data
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔍 BrewQuest Chronicles - Complete Database Audit')
console.log('================================================')

async function auditAllTables() {
  const tables = [
    'beer_reviews',
    'state_progress', 
    'blog_posts',
    'brewery_features',
    'social_posts',
    'state_analytics',
    'newsletter_subscribers'
  ]
  
  const audit = {}
  
  for (const table of tables) {
    try {
      console.log(`\n📊 Auditing table: ${table}`)
      
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(5)
      
      if (error) {
        console.log(`   ❌ Error: ${error.message}`)
        audit[table] = { exists: false, error: error.message }
      } else {
        console.log(`   ✅ Table exists with ${count} total records`)
        audit[table] = { 
          exists: true, 
          count: count, 
          sampleData: data,
          columns: data.length > 0 ? Object.keys(data[0]) : []
        }
        
        if (data.length > 0) {
          console.log(`   📝 Columns (${audit[table].columns.length}):`, audit[table].columns.join(', '))
          
          // Show sample data
          console.log(`   📋 Sample record:`)
          const sample = data[0]
          Object.keys(sample).forEach(key => {
            const value = sample[key]
            const preview = typeof value === 'string' && value.length > 50 
              ? value.substring(0, 50) + '...' 
              : value
            console.log(`      ${key}: ${preview}`)
          })
        }
      }
    } catch (e) {
      console.log(`   ❌ Exception: ${e.message}`)
      audit[table] = { exists: false, error: e.message }
    }
  }
  
  return audit
}

async function checkBeerReviewsLocation() {
  console.log('\n🏢 Checking brewery_location in beer_reviews...')
  
  try {
    const { data } = await supabase
      .from('beer_reviews')
      .select('state_name, brewery_name, brewery_location')
      .order('state_name')
    
    const locationStats = {
      withLocation: data.filter(r => r.brewery_location).length,
      withoutLocation: data.filter(r => !r.brewery_location).length,
      total: data.length
    }
    
    console.log(`   📍 Records with location: ${locationStats.withLocation}`)
    console.log(`   ❌ Records missing location: ${locationStats.withoutLocation}`)
    console.log(`   📊 Total records: ${locationStats.total}`)
    
    // Group by state
    const byState = data.reduce((acc, record) => {
      const state = record.state_name
      if (!acc[state]) acc[state] = { withLocation: 0, withoutLocation: 0 }
      if (record.brewery_location) {
        acc[state].withLocation++
      } else {
        acc[state].withoutLocation++
      }
      return acc
    }, {})
    
    console.log('\n   📍 By State:')
    Object.keys(byState).forEach(state => {
      const stats = byState[state]
      console.log(`      ${state}: ${stats.withLocation} with location, ${stats.withoutLocation} missing`)
    })
    
    return { locationStats, byState, missingLocationRecords: data.filter(r => !r.brewery_location) }
    
  } catch (error) {
    console.error('Error checking brewery locations:', error.message)
    return null
  }
}

async function checkBreweryFeatures() {
  console.log('\n🏭 Checking brewery_features table...')
  
  try {
    const { data, error } = await supabase
      .from('brewery_features')
      .select('*')
    
    if (error) {
      console.log(`   ❌ Error accessing brewery_features: ${error.message}`)
      return null
    }
    
    console.log(`   📊 Total brewery_features records: ${data.length}`)
    
    if (data.length > 0) {
      const websiteStats = {
        withWebsite: data.filter(b => b.website).length,
        withoutWebsite: data.filter(b => !b.website).length
      }
      
      const socialStats = {
        withInstagram: data.filter(b => b.instagram).length,
        withTwitter: data.filter(b => b.twitter).length,
        withFacebook: data.filter(b => b.facebook).length
      }
      
      console.log(`   🌐 Records with website: ${websiteStats.withWebsite}`)
      console.log(`   ❌ Records missing website: ${websiteStats.withoutWebsite}`)
      console.log(`   📱 Social media coverage:`)
      console.log(`      Instagram: ${socialStats.withInstagram}`)
      console.log(`      Twitter: ${socialStats.withTwitter}`)
      console.log(`      Facebook: ${socialStats.withFacebook}`)
      
      return { data, websiteStats, socialStats }
    }
    
    return { data: [], websiteStats: null, socialStats: null }
    
  } catch (error) {
    console.error('Error checking brewery features:', error.message)
    return null
  }
}

async function runCompleteAudit() {
  try {
    console.log('Starting complete database audit...\n')
    
    // Audit all tables
    const tableAudit = await auditAllTables()
    
    // Check brewery location data
    const locationAudit = await checkBeerReviewsLocation()
    
    // Check brewery features
    const breweryAudit = await checkBreweryFeatures()
    
    // Summary report
    console.log('\n' + '='.repeat(60))
    console.log('📋 AUDIT SUMMARY REPORT')
    console.log('='.repeat(60))
    
    console.log('\n🗂️ Table Status:')
    Object.keys(tableAudit).forEach(table => {
      const status = tableAudit[table].exists ? '✅' : '❌'
      const count = tableAudit[table].count || 0
      console.log(`   ${status} ${table}: ${count} records`)
    })
    
    console.log('\n🎯 Critical Issues Found:')
    
    // Missing tables
    const missingTables = Object.keys(tableAudit).filter(t => !tableAudit[t].exists)
    if (missingTables.length > 0) {
      console.log(`   ❌ Missing tables: ${missingTables.join(', ')}`)
    }
    
    // Empty tables
    const emptyTables = Object.keys(tableAudit).filter(t => 
      tableAudit[t].exists && tableAudit[t].count === 0
    )
    if (emptyTables.length > 0) {
      console.log(`   📭 Empty tables: ${emptyTables.join(', ')}`)
    }
    
    // Location data issues
    if (locationAudit && locationAudit.locationStats.withoutLocation > 0) {
      console.log(`   📍 Missing brewery locations: ${locationAudit.locationStats.withoutLocation} records`)
    }
    
    // Website data issues
    if (breweryAudit && breweryAudit.websiteStats && breweryAudit.websiteStats.withoutWebsite > 0) {
      console.log(`   🌐 Missing brewery websites: ${breweryAudit.websiteStats.withoutWebsite} records`)
    }
    
    console.log('\n🔧 Next Actions Needed:')
    console.log('   1. Populate missing tables (blog_posts, brewery_features, etc.)')
    console.log('   2. Add brewery_location to Alabama and Alaska beer_reviews')
    console.log('   3. Collect and populate brewery websites and social media')
    console.log('   4. Create state_analytics entries for all states')
    console.log('   5. Consider social_posts table structure needs')
    
    return {
      tableAudit,
      locationAudit,
      breweryAudit,
      summary: {
        missingTables,
        emptyTables,
        criticalIssues: missingTables.length + emptyTables.length + 
          (locationAudit?.locationStats.withoutLocation || 0)
      }
    }
    
  } catch (error) {
    console.error('❌ Audit failed:', error.message)
    return null
  }
}

// Execute audit
if (require.main === module) {
  runCompleteAudit()
    .then(result => {
      if (result) {
        console.log(`\n🎯 Audit completed. Found ${result.summary.criticalIssues} critical issues to address.`)
      }
    })
    .catch(error => {
      console.error('💥 Audit failed:', error)
    })
}

module.exports = { runCompleteAudit }