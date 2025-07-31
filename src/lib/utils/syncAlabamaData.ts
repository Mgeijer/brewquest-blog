import { createClient } from '@supabase/supabase-js'
import { stateProgressData, type BeerReview } from '@/lib/data/stateProgress'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key for database operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface DatabaseBeerReview {
  brewery_name: string
  beer_name: string
  beer_style: string
  abv: number
  ibu?: number
  rating: number
  tasting_notes: string
  description: string
  day_of_week: number
  state_code: string
  state_name: string
  week_number: number
  image_url?: string
}

export async function syncAlabamaData() {
  try {
    console.log('🍺 Starting Alabama beer data sync...')
    
    // Get Alabama data from stateProgress.ts
    const alabamaState = stateProgressData.find(state => state.code === 'AL')
    
    if (!alabamaState || !alabamaState.featuredBeers || alabamaState.featuredBeers.length === 0) {
      throw new Error('Alabama state data not found or has no featured beers')
    }

    console.log(`📊 Found ${alabamaState.featuredBeers.length} Alabama beers to sync`)

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
    const alabamaBeerReviews: DatabaseBeerReview[] = alabamaState.featuredBeers.map(beer => ({
      brewery_name: beer.brewery,
      beer_name: beer.name,
      beer_style: beer.style,
      abv: beer.abv,
      ibu: beer.ibu,
      rating: beer.rating,
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

    // Step 4: Verify the inserted data
    console.log('🔍 Verifying inserted data...')
    const { data: verificationData, error: verifyError } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('state_code', 'AL')
      .eq('week_number', 1)
      .order('day_of_week', { ascending: true })

    if (verifyError) {
      throw new Error(`Error verifying inserted data: ${verifyError.message}`)
    }

    if (!verificationData || verificationData.length !== 7) {
      throw new Error(`Verification failed: Expected 7 records, found ${verificationData?.length || 0}`)
    }

    // Log verification details
    console.log('📊 Verification Results:')
    verificationData.forEach((beer, index) => {
      console.log(`  Day ${beer.day_of_week}: ${beer.beer_name} (${beer.brewery_name})`)
    })

    // Verify brewery uniqueness in database
    const dbUniqueBreweries = new Set(verificationData.map(beer => beer.brewery_name))
    if (dbUniqueBreweries.size !== 7) {
      throw new Error(`Database verification failed: Expected 7 unique breweries, found ${dbUniqueBreweries.size}`)
    }

    return {
      success: true,
      message: `Successfully synced Alabama data: ${verificationData.length} beers from ${dbUniqueBreweries.size} unique breweries`,
      data: {
        beersInserted: verificationData.length,
        uniqueBreweries: dbUniqueBreweries.size,
        breweries: Array.from(dbUniqueBreweries),
        beers: verificationData.map(beer => ({
          day: beer.day_of_week,
          name: beer.beer_name,
          brewery: beer.brewery_name,
          style: beer.beer_style,
          abv: beer.abv,
          rating: beer.rating
        }))
      }
    }

  } catch (error) {
    console.error('❌ Error syncing Alabama data:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export async function verifyAlabamaData() {
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
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}