import { createClient } from '@supabase/supabase-js'
import { stateProgressData, type BeerReview, type StateData } from '@/lib/data/stateProgress'
import { randomUUID } from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key for database operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface DatabaseBeerReview {
  id: string
  beer_name: string
  brewery_name: string
  beer_style: string
  abv: number | null
  rating: number | null
  tasting_notes: string | null
  day_of_week: number | null
  image_url?: string | null
  created_at?: string
  // Use existing schema fields to store our extended data
  blog_post_id?: string | null
  unique_feature?: string | null // Will store state_code:week_number:ibu for retrieval
  brewery_story?: string | null // Will store our rich description
  brewery_location?: string | null // Will store state_name
}

export async function populateBeerReviews() {
  try {
    console.log('🍺 Starting beer review database population...')
    
    const beerReviews: DatabaseBeerReview[] = []
    
    // Extract all beer reviews from state data
    stateProgressData.forEach(state => {
      if (state.featuredBeers && state.featuredBeers.length > 0) {
        state.featuredBeers.forEach(beer => {
          // Create metadata string for retrieval/filtering
          const metadata = `${state.code}:${state.weekNumber}:${beer.ibu || 0}:${beer.id}`
          
          beerReviews.push({
            id: randomUUID(), // Generate proper UUID for database
            beer_name: beer.name,
            brewery_name: beer.brewery,
            beer_style: beer.style,
            abv: beer.abv,
            rating: Math.round(beer.rating), // Round to integer for database
            tasting_notes: beer.tastingNotes,
            day_of_week: beer.dayOfWeek,
            image_url: beer.imageUrl || null,
            created_at: new Date().toISOString(),
            // Map additional data to existing fields
            blog_post_id: null, // Can be linked later to blog posts
            unique_feature: metadata, // Store state_code:week_number:ibu for queries
            brewery_story: beer.description, // Store rich description in brewery_story
            brewery_location: state.name // Store state name in location field
          })
        })
      }
    })

    console.log(`📊 Found ${beerReviews.length} beer reviews to insert`)

    if (beerReviews.length === 0) {
      console.log('⚠️ No beer reviews found to populate')
      return { success: false, message: 'No beer reviews found' }
    }

    // Insert beer reviews into database
    const { data, error } = await supabase
      .from('beer_reviews')
      .upsert(beerReviews, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select()

    if (error) {
      console.error('❌ Error inserting beer reviews:', error)
      return { success: false, error: error.message }
    }

    console.log(`✅ Successfully populated ${data?.length || beerReviews.length} beer reviews`)
    
    return { 
      success: true, 
      message: `Successfully populated ${data?.length || beerReviews.length} beer reviews`,
      data: data
    }
    
  } catch (error) {
    console.error('❌ Unexpected error populating beer reviews:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export async function getBeerReviewsByState(stateCode: string): Promise<DatabaseBeerReview[]> {
  try {
    const { data, error } = await supabase
      .from('beer_reviews')
      .select('*')
      .ilike('unique_feature', `${stateCode}:%`) // Search for state code in metadata
      .order('day_of_week', { ascending: true })

    if (error) {
      console.error('Error fetching beer reviews:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching beer reviews:', error)
    return []
  }
}

export async function getBeerReviewsByWeek(weekNumber: number): Promise<DatabaseBeerReview[]> {
  try {
    const { data, error } = await supabase
      .from('beer_reviews')
      .select('*')
      .ilike('unique_feature', `%:${weekNumber}:%`) // Search for week number in metadata
      .order('day_of_week', { ascending: true })

    if (error) {
      console.error('Error fetching beer reviews by week:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching beer reviews by week:', error)
    return []
  }
}

export async function getAllBeerReviews(): Promise<DatabaseBeerReview[]> {
  try {
    const { data, error } = await supabase
      .from('beer_reviews')
      .select('*')
      .order('day_of_week', { ascending: true }) // Can't order by week_number directly anymore
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching all beer reviews:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching all beer reviews:', error)
    return []
  }
}

export async function clearBeerReviews(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🗑️ Clearing all beer reviews from database...')
    
    const { error } = await supabase
      .from('beer_reviews')
      .delete()
      .not('id', 'is', null) // Delete all records

    if (error) {
      console.error('❌ Error clearing beer reviews:', error)
      return { success: false, message: error.message }
    }

    console.log('✅ Successfully cleared all beer reviews')
    return { success: true, message: 'Successfully cleared all beer reviews' }
    
  } catch (error) {
    console.error('❌ Unexpected error clearing beer reviews:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Utility function to sync state progress data with database
export async function syncStateProgressWithDatabase() {
  try {
    console.log('🔄 Syncing state progress data with database...')
    
    // First clear existing data
    await clearBeerReviews()
    
    // Then populate with current data
    const result = await populateBeerReviews()
    
    return result
    
  } catch (error) {
    console.error('❌ Error syncing state progress with database:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}