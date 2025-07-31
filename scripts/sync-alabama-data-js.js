#!/usr/bin/env node

/**
 * Script to sync Alabama beer data from stateProgress.ts to Supabase database
 * This corrects the Alabama data with 7 beers from 7 unique breweries
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

// Alabama beer data (copied from stateProgress.ts)
const alabamaBeerData = [
  {
    id: 'al-01',
    name: 'Good People IPA',
    brewery: 'Good People Brewing Company',
    style: 'American IPA',
    abv: 6.8,
    ibu: 55,
    description: "Alabama's #1 selling IPA for the last 10 years, this flagship brew showcases American hop character with citrus and pine notes.",
    tastingNotes: 'Bright citrus aroma with grapefruit and orange peel, balanced malt backbone, clean bitter finish with subtle pine resin.',
    rating: 4,
    dayOfWeek: 1,
    imageUrl: '/images/Beer images/Alabama/Good People IPA.png'
  },
  {
    id: 'al-02',
    name: 'Ghost Train',
    brewery: 'Yellowhammer Brewing',
    style: 'German-Style Hefeweizen',
    abv: 4.8,
    ibu: 15,
    description: "Huntsville's signature wheat beer, this traditional German-style hefeweizen showcases authentic Bavarian brewing techniques.",
    tastingNotes: 'Cloudy golden appearance, banana and clove aromas from German yeast, smooth wheat mouthfeel, refreshing and authentic.',
    rating: 4,
    dayOfWeek: 2,
    imageUrl: '/images/Beer images/Alabama/Ghost-Train-Yellowhammer.png'
  },
  {
    id: 'al-03',
    name: 'Cahaba Oka Uba IPA',
    brewery: 'Cahaba Brewing Company',
    style: 'American IPA',
    abv: 7.0,
    ibu: 61,
    description: 'Named after the indigenous word for Cahaba River meaning "the Water Above," this earthy IPA is dry-hopped for complexity.',
    tastingNotes: 'Orange-red hue, earthy hop character with citrus notes, malty backbone, balanced bitterness with noble hop finish.',
    rating: 4,
    dayOfWeek: 3,
    imageUrl: '/images/Beer images/Alabama/Cahaba Oka Uba IPA.png'
  },
  {
    id: 'al-04',
    name: 'TrimTab Paradise Now',
    brewery: 'TrimTab Brewing Company',
    style: 'Berliner Weisse (Fruited)',
    abv: 4.2,
    ibu: 8,
    description: "A tropical passionfruit and raspberry Berliner Weisse that showcases Birmingham's innovative brewing scene.",
    tastingNotes: 'Bright pink color, tropical fruit aroma, tart and refreshing with passionfruit and raspberry sweetness, crisp finish.',
    rating: 4.5,
    dayOfWeek: 4,
    imageUrl: '/images/Beer images/Alabama/TrimTab Paradise now.png'
  },
  {
    id: 'al-05',
    name: "Avondale Miss Fancy's Tripel",
    brewery: 'Avondale Brewing Company',
    style: 'Belgian Tripel',
    abv: 9.2,
    ibu: 28,
    description: "A classic Belgian-style tripel brewed in Birmingham's historic Avondale district with traditional techniques.",
    tastingNotes: 'Golden color, spicy phenolic aroma, fruity esters, warming alcohol, dry finish with Belgian yeast character.',
    rating: 4,
    dayOfWeek: 5,
    imageUrl: "/images/Beer images/Alabama/Avondale Miss Fancy's Triple.png"
  },
  {
    id: 'al-06',
    name: 'Snake Handler',
    brewery: 'Back Forty Beer Company',
    style: 'Double IPA',
    abv: 9.2,
    ibu: 99,
    description: 'Gadsden-based brewery\'s flagship DIPA, this bold beer showcases aggressive American hop character with Southern attitude.',
    tastingNotes: 'Golden copper color, intense citrus and pine hop aroma, full-bodied with substantial malt backbone, lingering bitter finish.',
    rating: 4.5,
    dayOfWeek: 6,
    imageUrl: '/images/Beer images/Alabama/Snake-Handler-Back-Forty.png'
  },
  {
    id: 'al-07',
    name: 'Darker Subject Matter',
    brewery: 'Monday Night Brewing (Birmingham Social Club)',
    style: 'Imperial Stout',
    abv: 13.9,
    ibu: 45,
    description: "A bold, high-gravity imperial stout from the Atlanta-based brewery's Birmingham location, showcasing intense roasted complexity.",
    tastingNotes: 'Pitch black with dense tan head, intense coffee and dark chocolate aroma, full-bodied with bourbon barrel character, warming finish with roasted bitterness.',
    rating: 4.5,
    dayOfWeek: 7,
    imageUrl: '/images/Beer images/Alabama/Monday Night Brewing Imperial Stout.png'
  }
]

async function syncAlabamaData() {
  try {
    console.log('🍺 Starting Alabama beer data sync...')
    console.log(`📊 Found ${alabamaBeerData.length} Alabama beers to sync`)

    // Step 1: Delete existing Alabama beer reviews
    console.log('🗑️ Deleting existing Alabama beer reviews...')
    const { error: deleteError } = await supabase
      .from('beer_reviews')
      .delete()
      .eq('state_code', 'AL')

    if (deleteError) {
      throw new Error(`Error deleting existing Alabama data: ${deleteError.message}`)
    }

    console.log('✅ Successfully deleted existing Alabama beer reviews')

    // Step 2: Prepare new Alabama beer review data
    const alabamaBeerReviews = alabamaBeerData.map(beer => ({
      brewery_name: beer.brewery,
      beer_name: beer.name,
      beer_style: beer.style,
      abv: beer.abv,
      ibu: beer.ibu,
      rating: Math.round(beer.rating), // Convert decimal ratings to integers
      tasting_notes: beer.tastingNotes,
      description: beer.description,
      day_of_week: beer.dayOfWeek,
      state_code: 'AL',
      state_name: 'Alabama',
      week_number: 1,
      image_url: beer.imageUrl
    }))

    // Verify we have 7 beers from 7 different breweries
    const uniqueBreweries = new Set(alabamaBeerReviews.map(beer => beer.brewery_name))
    console.log(`📋 Verification: ${alabamaBeerReviews.length} beers from ${uniqueBreweries.size} unique breweries`)
    
    if (alabamaBeerReviews.length !== 7) {
      throw new Error(`Expected 7 beers, but found ${alabamaBeerReviews.length}`)
    }
    
    if (uniqueBreweries.size !== 7) {
      throw new Error(`Expected 7 unique breweries, but found ${uniqueBreweries.size}`)
    }

    // Step 3: Insert new Alabama beer reviews
    console.log('📝 Inserting corrected Alabama beer reviews...')
    const { data: insertedData, error: insertError } = await supabase
      .from('beer_reviews')
      .insert(alabamaBeerReviews)
      .select()

    if (insertError) {
      throw new Error(`Error inserting Alabama beer reviews: ${insertError.message}`)
    }

    console.log(`✅ Successfully inserted ${insertedData?.length || 0} Alabama beer reviews`)

    return {
      success: true,
      message: `Successfully synced Alabama data: ${insertedData?.length || 0} beers from ${uniqueBreweries.size} unique breweries`,
      data: {
        beersInserted: insertedData?.length || 0,
        uniqueBreweries: uniqueBreweries.size,
        breweries: Array.from(uniqueBreweries)
      }
    }

  } catch (error) {
    console.error('❌ Error syncing Alabama data:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

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

    if (!data) {
      return {
        success: false,
        message: 'No Alabama data found in database'
      }
    }

    const uniqueBreweries = new Set(data.map(beer => beer.brewery_name))
    
    console.log('📊 Current Alabama Database State:')
    console.log(`  Total beers: ${data.length}`)
    console.log(`  Unique breweries: ${uniqueBreweries.size}`)
    console.log('  Beer details:')
    data.forEach(beer => {
      console.log(`    Day ${beer.day_of_week}: ${beer.beer_name} (${beer.brewery_name}) - ${beer.beer_style} ${beer.abv}% ABV`)
    })

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

    return {
      success: data.length === 7 && uniqueBreweries.size === 7 && missingBreweries.length === 0,
      data: {
        totalBeers: data.length,
        uniqueBreweries: uniqueBreweries.size,
        expectedBreweries: 7,
        missingBreweries,
        extraBreweries,
        beers: data.map(beer => ({
          day: beer.day_of_week,
          name: beer.beer_name,
          brewery: beer.brewery_name,
          style: beer.beer_style,
          abv: beer.abv,
          rating: beer.rating
        }))
      },
      message: data.length === 7 && uniqueBreweries.size === 7 && missingBreweries.length === 0 
        ? 'Alabama data is correct'
        : `Alabama data needs correction: ${data.length}/7 beers, ${uniqueBreweries.size}/7 breweries${missingBreweries.length > 0 ? `, missing: ${missingBreweries.join(', ')}` : ''}${extraBreweries.length > 0 ? `, extra: ${extraBreweries.join(', ')}` : ''}`
    }

  } catch (error) {
    console.error('❌ Error verifying Alabama data:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

async function main() {
  console.log('🚀 Alabama Beer Data Sync Script')
  console.log('================================')
  
  try {
    // First, verify current state
    console.log('\n1. Verifying current Alabama data...')
    const verificationResult = await verifyAlabamaData()
    
    if (verificationResult.success) {
      console.log('✅ Alabama data is already correct!')  
      console.log('📊 Current state:', verificationResult.message)
      if (verificationResult.data) {
        console.log(`   - ${verificationResult.data.totalBeers} beers from ${verificationResult.data.uniqueBreweries} breweries`)
      }
      return
    } else {
      console.log('⚠️ Alabama data needs correction:', verificationResult.message)
      if (verificationResult.data) {
        console.log(`   - Current: ${verificationResult.data.totalBeers} beers from ${verificationResult.data.uniqueBreweries} breweries`)
        if (verificationResult.data.missingBreweries?.length > 0) {
          console.log(`   - Missing breweries: ${verificationResult.data.missingBreweries.join(', ')}`)
        }
        if (verificationResult.data.extraBreweries?.length > 0) {
          console.log(`   - Extra breweries: ${verificationResult.data.extraBreweries.join(', ')}`)
        }
      }
    }
    
    // Perform the sync
    console.log('\n2. Syncing Alabama data...')
    const syncResult = await syncAlabamaData()
    
    if (syncResult.success) {
      console.log('✅ Sync completed successfully!')
      console.log('📊 Results:', syncResult.message)
      
      if (syncResult.data) {
        console.log('\n📋 Alabama Beer Data Summary:')
        console.log(`   - Beers inserted: ${syncResult.data.beersInserted}`)
        console.log(`   - Unique breweries: ${syncResult.data.uniqueBreweries}`)
        console.log('\n🍺 Brewery List:')
        syncResult.data.breweries.forEach((brewery, index) => {
          console.log(`   ${index + 1}. ${brewery}`)
        })
      }
      
      // Final verification
      console.log('\n3. Final verification...')
      const finalVerification = await verifyAlabamaData()
      
      if (finalVerification.success) {
        console.log('✅ Final verification passed! Alabama data is now correct.')
        if (finalVerification.data) {
          console.log('\n📅 Daily Schedule:')
          finalVerification.data.beers.forEach(beer => {
            console.log(`   Day ${beer.day}: ${beer.name} (${beer.brewery}) - ${beer.style} ${beer.abv}% ABV`)
          })
        }
      } else {
        console.error('❌ Final verification failed:', finalVerification.message)
        process.exit(1)
      }
      
    } else {
      console.error('❌ Sync failed:', syncResult.error)
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error.message)
    process.exit(1)
  }
  
  console.log('\n🎉 Alabama beer data sync completed successfully!')
}

// Run the script
main().catch(error => {
  console.error('❌ Unhandled error:', error)
  process.exit(1)
})