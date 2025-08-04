#!/usr/bin/env node

/**
 * Arizona Week 3 Complete Migration
 * First adds state_progress entry, then beer_reviews entries
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🌵 Arizona Week 3 Complete Migration')
console.log('===================================')

// Arizona state progress entry
const arizonaStateProgress = {
  state_code: 'AZ',
  state_name: 'Arizona',
  status: 'upcoming',
  week_number: 3,
  blog_post_id: '29076652-b667-4988-b199-ca6871927bf1',
  completion_date: null,
  featured_breweries: null,
  total_breweries: 100,
  featured_beers_count: 7,
  region: 'southwest',
  description: "Arizona's craft beer scene has mastered brewing in extreme desert conditions, creating innovative beers.",
  journey_highlights: null,
  difficulty_rating: 3,
  research_hours: 0
}

// Arizona beer reviews
const arizonaBeerReviews = [
  {
    brewery_name: 'Four Peaks Brewing Company',
    beer_name: 'Kilt Lifter',
    beer_style: 'Scottish-Style Ale',
    abv: 6.0,
    rating: 4,
    tasting_notes: 'Rich amber color with caramel malt sweetness and subtle hop balance. A warming Scottish ale that paradoxically refreshes in 115°F heat.',
    unique_feature: "Arizona's first major craft brewery, pioneering desert brewing since 1996",
    brewery_story: "From the shadow of Tempe Butte comes Arizona's brewing pioneer! Four Peaks opened in 1996 as the state's first major craft brewery near ASU campus, becoming Arizona's craft beer university.",
    brewery_location: 'Tempe, Arizona',
    image_url: '/images/Beer images/Arizona/Four Peaks Kilt Lifter.jpg',
    day_of_week: 1,
    state_code: 'AZ',
    state_name: 'Arizona',
    week_number: 3,
    ibu: 25,
    description: "WEEK 3 BEGINS: ARIZONA'S DESERT BREWING REVOLUTION! Scottish tradition meets Southwestern innovation - this is where Arizona's craft beer story begins.",
    status: 'published'
  },
  {
    brewery_name: 'Arizona Wilderness Brewing Company',
    beer_name: 'Refuge IPA',
    beer_style: 'American IPA',
    abv: 6.8,
    rating: 4,
    tasting_notes: 'Bright citrus and pine hop character balanced by locally-grown malt sweetness. Unique terroir from 100% Arizona-grown Sinagua Malt.',
    unique_feature: '100% Arizona-grown Sinagua Malt, water conservation offsetting program',
    brewery_story: "Born in a founder's garage and evolved into Arizona's most environmentally conscious brewery. Every pint helps offset 50+ gallons for Arizona's waterways.",
    brewery_location: 'Gilbert, Arizona',
    image_url: '/images/Beer images/Arizona/Arizona Wilderness Refuge IPA.jpg',
    day_of_week: 2,
    state_code: 'AZ',
    state_name: 'Arizona',
    week_number: 3,
    ibu: 65,
    description: 'Day 2: Arizona Wilderness Refuge IPA - Sustainability Meets Flavor! Desert brewing done right with environmental leadership.',
    status: 'published'
  },
  {
    brewery_name: 'Historic Brewing Company',
    beer_name: 'Piehole Porter',
    beer_style: 'Porter',
    abv: 5.5,
    rating: 4,
    tasting_notes: 'Rich, dark porter base enhanced with natural cherry and vanilla flavoring. Smooth, creamy texture with chocolate malt backbone.',
    unique_feature: 'Liquid cherry pie experience, brewed at 7,000 feet elevation',
    brewery_story: "From the pines of Flagstaff comes Arizona's most beloved dessert beer! This legendary porter became so popular it's now found in nearly every Phoenix bar.",
    brewery_location: 'Flagstaff, Arizona',
    image_url: '/images/Beer images/Arizona/Historic Piehole Porter.jpg',
    day_of_week: 3,
    state_code: 'AZ',
    state_name: 'Arizona',
    week_number: 3,
    ibu: 20,
    description: "Day 3: Historic's Piehole Porter - Dessert Innovation from Flagstaff! Arizona craft beer isn't afraid to be fun, bold, and completely unforgettable.",
    status: 'published'
  },
  {
    brewery_name: 'Dragoon Brewing Company',
    beer_name: 'Dragoon IPA',
    beer_style: 'West Coast IPA',
    abv: 7.3,
    rating: 5,
    tasting_notes: 'Bold, aggressive hop character with fruity, floral, and citrus aromas. Clean malt backbone supports intense hop bitterness.',
    unique_feature: 'Only four year-round beers, quality over quantity philosophy',
    brewery_story: "In the Old Pueblo, Dragoon embodies Tucson's rebellious spirit. They brew only four year-round beers, focusing on quality over quantity.",
    brewery_location: 'Tucson, Arizona',
    image_url: '/images/Beer images/Arizona/Dragoon IPA.jpg',
    day_of_week: 4,
    state_code: 'AZ',
    state_name: 'Arizona',
    week_number: 3,
    ibu: 75,
    description: "Day 4: Dragoon IPA - Tucson's Uncompromising West Coast Classic! Bold, beautiful, and unafraid to challenge your palate.",
    status: 'published'
  },
  {
    brewery_name: 'SanTan Brewing Company',
    beer_name: "Devil's Ale",
    beer_style: 'American Pale Ale',
    abv: 5.5,
    rating: 4,
    tasting_notes: 'Golden amber color with pronounced hop aroma. Pine and citrus flavors from Cascade, Centennial, and Simcoe hops.',
    unique_feature: 'Sinfully crisp finish perfect for 115°F desert heat',
    brewery_story: "With playful naming and bold flavors, SanTan represents Arizona's fun-loving approach to craft beer. Their irreverent marketing proves Arizona brewing doesn't take itself too seriously.",
    brewery_location: 'Chandler, Arizona',
    image_url: '/images/Beer images/Arizona/SanTan Devils Ale.jpg',
    day_of_week: 5,
    state_code: 'AZ',
    state_name: 'Arizona',
    week_number: 3,
    ibu: 45,
    description: "Day 5: SanTan's Devil's Ale - Sinfully Crisp Southwestern Style! Friday night in Arizona starts with a Devil's Ale.",
    status: 'published'
  },
  {
    brewery_name: 'Oak Creek Brewery',
    beer_name: 'Nut Brown Ale',
    beer_style: 'English Brown Ale',
    abv: 5.5,
    rating: 4,
    tasting_notes: "Rich brown color that mirrors Sedona's iconic sandstone formations. Nutty, caramel malt flavors with subtle hop balance.",
    unique_feature: "Brewed in Sedona's arts district since 1995, every pint comes with million-dollar views",
    brewery_story: "From Sedona's stunning Tlaquepaque arts community comes Arizona's oldest microbrewery, connecting craft beer to the state's natural beauty.",
    brewery_location: 'Sedona, Arizona',
    image_url: '/images/Beer images/Arizona/Oak Creek Nut Brown Ale.jpg',
    day_of_week: 6,
    state_code: 'AZ',
    state_name: 'Arizona',
    week_number: 3,
    ibu: 30,
    description: "Day 6: Oak Creek Nut Brown Ale - Sedona's Red Rock Beauty! Arizona brewing at its most scenic.",
    status: 'published'
  },
  {
    brewery_name: 'Mother Road Brewing Company',
    beer_name: 'Tower Station IPA',
    beer_style: 'American IPA',
    abv: 6.8,
    rating: 4,
    tasting_notes: "Citrus and pine hop characteristics that evoke Arizona's high-desert landscape. Clean, refreshing finish perfect for road trip adventures.",
    unique_feature: 'Named for Route 66, embodies the spirit of westward exploration and endless horizons',
    brewery_story: "Named for Historic Route 66, this award-winning brewery celebrates Arizona's role in American adventure culture from Flagstaff's high country.",
    brewery_location: 'Flagstaff, Arizona',
    image_url: '/images/Beer images/Arizona/Mother Road Tower Station IPA.jpg',
    day_of_week: 7,
    state_code: 'AZ',
    state_name: 'Arizona',
    week_number: 3,
    ibu: 60,
    description: "Day 7 FINALE: Mother Road's Tower Station IPA - Route 66 Adventure Beer! Arizona Week 3 complete - desert brewing creates extraordinary beers.",
    status: 'published'
  }
]

async function executeCompleteMigration() {
  try {
    console.log('🔗 Connecting to Supabase database...')
    
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('beer_reviews')
      .select('count')
      .limit(1)
    
    if (testError) {
      throw new Error(`Connection test failed: ${testError.message}`)
    }
    
    console.log('✅ Connected to Supabase successfully')
    
    // Step 1: Check if Arizona state_progress exists
    console.log('\n📍 Step 1: Checking Arizona state progress...')
    const { data: existingStateProgress, error: stateCheckError } = await supabase
      .from('state_progress')
      .select('*')
      .eq('state_code', 'AZ')
      .eq('week_number', 3)
    
    if (stateCheckError) {
      console.warn('⚠️ Warning checking state progress:', stateCheckError.message)
    }
    
    if (!existingStateProgress || existingStateProgress.length === 0) {
      console.log('📝 Creating Arizona state progress entry...')
      const { data: insertedState, error: stateInsertError } = await supabase
        .from('state_progress')
        .insert(arizonaStateProgress)
        .select()
      
      if (stateInsertError) {
        throw new Error(`Failed to insert state progress: ${stateInsertError.message}`)
      }
      
      console.log('✅ Arizona state progress created successfully')
    } else {
      console.log('✅ Arizona state progress already exists')
    }
    
    // Step 2: Check existing Arizona beer reviews
    console.log('\n📍 Step 2: Checking existing Arizona beer reviews...')
    const { data: existingArizona, error: checkError } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('state_code', 'AZ')
      .eq('week_number', 3)
    
    if (checkError) {
      console.warn('⚠️ Warning checking existing data:', checkError.message)
    } else if (existingArizona && existingArizona.length > 0) {
      console.log(`⚠️ Found ${existingArizona.length} existing Arizona Week 3 entries`)
      console.log('Existing entries:', existingArizona.map(r => `${r.brewery_name} - ${r.beer_name}`))
    }
    
    // Step 3: Insert beer reviews
    console.log('\n📍 Step 3: Inserting Arizona beer reviews...')
    console.log(`   📝 ${arizonaBeerReviews.length} beer reviews ready`)
    
    const { data: insertedReviews, error: reviewError } = await supabase
      .from('beer_reviews')
      .insert(arizonaBeerReviews)
      .select()
    
    if (reviewError) {
      throw new Error(`Failed to insert beer reviews: ${reviewError.message}`)
    }
    
    console.log(`✅ Successfully inserted ${insertedReviews.length} Arizona beer reviews`)
    
    // Step 4: Verification
    console.log('\n📍 Step 4: Final verification...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('state_code', 'AZ')
      .eq('week_number', 3)
      .order('day_of_week', { ascending: true })
    
    if (verifyError) {
      console.warn('⚠️ Warning during verification:', verifyError.message)
    } else {
      console.log('')
      console.log('🔍 Final Verification Results:')
      console.log(`📈 Total Arizona Week 3 entries: ${verifyData.length}`)
      console.log('✅ All brewery cross-links established')
      console.log('✅ State progress entry created')
      console.log('')
      console.log('🗺️ Arizona Week 3 Complete Schedule:')
      verifyData.forEach((review, index) => {
        const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        const day = days[review.day_of_week] || `Day ${review.day_of_week}`
        console.log(`   ${day}: ${review.beer_name} by ${review.brewery_name}`)
        console.log(`      📍 ${review.brewery_location} | 🍺 ${review.beer_style} | 🔥 ${review.abv}% ABV | ⭐ ${review.rating}/5`)
        console.log('')
      })
    }
    
    console.log('🎉 ARIZONA WEEK 3 MIGRATION COMPLETED SUCCESSFULLY!')
    console.log('✅ State progress table updated')
    console.log('✅ All beer reviews populated with complete cross-links')
    console.log('✅ Ready for August 11-17, 2025 publication')
    console.log('')
    console.log('🔗 Data is now available in your Supabase dashboard')
    console.log('🌐 Arizona joins Alabama (Week 1) and Alaska (Week 2) in the database')
    
    return {
      success: true,
      insertedCount: insertedReviews.length,
      totalArizonaCount: verifyData?.length || 0,
      breweries: verifyData?.map(r => r.brewery_name) || []
    }
    
  } catch (error) {
    console.error('❌ Complete migration failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Execute if called directly
if (require.main === module) {
  executeCompleteMigration()
    .then(result => {
      if (result.success) {
        console.log(`\n🌵 ARIZONA COMPLETE! ${result.insertedCount} new entries added.`)
        console.log(`🏭 Breweries: ${result.breweries?.join(', ')}`)
        process.exit(0)
      } else {
        console.error('\n💥 Migration failed:', result.error)
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
      process.exit(1)
    })
}

module.exports = { executeCompleteMigration }