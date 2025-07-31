#!/usr/bin/env node

/**
 * Script to verify Alabama beer data in Supabase database
 */

const path = require('path')
const { config } = require('dotenv')
const { createClient } = require('@supabase/supabase-js')

// Load environment variables
const projectRoot = path.join(__dirname, '..')
config({ path: path.join(projectRoot, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Use service role key for database operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifyAlabamaData() {
  try {
    console.log('🔍 Verifying Alabama data in database...')

    const { data, error } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('state_code', 'AL')
      .eq('week_number', 1)
      .order('day_of_week', { ascending: true })

    if (error) {
      throw new Error(`Error fetching Alabama data: ${error.message}`)
    }

    console.log('\n📊 Alabama Beer Reviews in Database:')
    console.log('==========================================')

    if (!data || data.length === 0) {
      console.log('❌ No Alabama beer reviews found!')
      return
    }

    const uniqueBreweries = new Set(data.map(beer => beer.brewery_name))
    console.log(`✅ Total beers: ${data.length}`)
    console.log(`✅ Unique breweries: ${uniqueBreweries.size}`)
    console.log(`✅ State code: ${data[0].state_code}`)
    console.log(`✅ Week number: ${data[0].week_number}`)

    console.log('\n📅 Daily Beer Schedule:')
    console.log('========================')
    data.forEach(beer => {
      console.log(`Day ${beer.day_of_week}: ${beer.beer_name}`)
      console.log(`  Brewery: ${beer.brewery_name}`)
      console.log(`  Style: ${beer.beer_style}`)
      console.log(`  ABV: ${beer.abv}%`)
      console.log(`  IBU: ${beer.ibu || 'N/A'}`)
      console.log(`  Rating: ${beer.rating}/5`)
      console.log(`  Image: ${beer.image_url || 'No image'}`)
      console.log('')
    })

    console.log('🍺 Brewery List:')
    console.log('================')
    Array.from(uniqueBreweries).forEach((brewery, index) => {
      console.log(`${index + 1}. ${brewery}`)
    })

    // Verify expected breweries
    const expectedBreweries = [
      'Good People Brewing Company',
      'Yellowhammer Brewing',
      'Cahaba Brewing Company', 
      'TrimTab Brewing Company',
      'Avondale Brewing Company',
      'Back Forty Beer Company',
      'Monday Night Brewing (Birmingham Social Club)'
    ]

    const missingBreweries = expectedBreweries.filter(brewery => !uniqueBreweries.has(brewery))
    const extraBreweries = Array.from(uniqueBreweries).filter(brewery => !expectedBreweries.includes(brewery))

    console.log('\n✅ Verification Results:')
    console.log('========================')
    if (data.length === 7 && uniqueBreweries.size === 7 && missingBreweries.length === 0) {
      console.log('🎉 SUCCESS: Alabama data is perfect!')
      console.log('   - 7 beers ✓')
      console.log('   - 7 unique breweries ✓') 
      console.log('   - All expected breweries present ✓')
      console.log('   - State code is AL ✓')
      console.log('   - Week number is 1 ✓')
    } else {
      console.log('⚠️ Issues found:')
      if (data.length !== 7) console.log(`   - Expected 7 beers, found ${data.length}`)
      if (uniqueBreweries.size !== 7) console.log(`   - Expected 7 breweries, found ${uniqueBreweries.size}`)
      if (missingBreweries.length > 0) console.log(`   - Missing breweries: ${missingBreweries.join(', ')}`)
      if (extraBreweries.length > 0) console.log(`   - Extra breweries: ${extraBreweries.join(', ')}`)
    }

  } catch (error) {
    console.error('❌ Error verifying Alabama data:', error)
  }
}

async function checkDatabaseHealth() {
  try {
    console.log('\n🏥 Database Health Check:')
    console.log('=========================')

    // Check beer_reviews table
    const { data: beerData, error: beerError } = await supabase
      .from('beer_reviews')
      .select('*', { count: 'exact', head: true })

    if (beerError) {
      console.log('❌ Error accessing beer_reviews table:', beerError.message)
    } else {
      console.log(`✅ beer_reviews table accessible (${beerData?.length || 0} records)`)
    }

    // Check state_progress table
    const { data: stateData, error: stateError } = await supabase
      .from('state_progress')
      .select('*', { count: 'exact', head: true })

    if (stateError) {
      console.log('❌ Error accessing state_progress table:', stateError.message)
    } else {
      console.log(`✅ state_progress table accessible (${stateData?.length || 0} records)`)
    }

  } catch (error) {
    console.error('❌ Database health check failed:', error)
  }
}

async function main() {
  console.log('🔬 Database Verification Script')
  console.log('================================')
  
  await checkDatabaseHealth()
  await verifyAlabamaData()
  
  console.log('\n✅ Verification complete!')
}

// Run the script
main().catch(error => {
  console.error('❌ Unhandled error:', error)
  process.exit(1)
})