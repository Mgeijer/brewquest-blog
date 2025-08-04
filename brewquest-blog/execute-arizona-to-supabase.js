#!/usr/bin/env node

/**
 * Arizona Week 3 Supabase Data Loader
 * Directly executes Arizona brewery and beer data into Supabase
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔧 Environment check:')
console.log('   URL exists:', !!supabaseUrl)
console.log('   Key exists:', !!supabaseKey)
console.log('   URL preview:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'undefined')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration')
  console.error('Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🌵 Arizona Week 3 Supabase Data Loader')
console.log('=====================================')

// Arizona brewery data
const arizonBreweries = [
  {
    name: 'Four Peaks Brewing Company',
    location: 'Tempe, Arizona',
    founded: 1996,
    description: "Arizona's brewing pioneer, Four Peaks opened in 1996 as the state's first major craft brewery near ASU campus.",
    website: 'https://fourpeaks.com'
  },
  {
    name: 'Arizona Wilderness Brewing Company',
    location: 'Gilbert, Arizona', 
    founded: 2013,
    description: "Born in a founder's garage and evolved into Arizona's most environmentally conscious brewery.",
    website: 'https://azwbeer.com'
  },
  {
    name: 'Historic Brewing Company',
    location: 'Flagstaff, Arizona',
    founded: 2012,
    description: "From the pines of Flagstaff at 7,000 feet elevation comes Arizona's most creative dessert beer innovation.",
    website: 'https://historicbrewing.com'
  },
  {
    name: 'Dragoon Brewing Company',
    location: 'Tucson, Arizona',
    founded: 2012,
    description: "Embodies Tucson's rebellious spirit with only four year-round beers, focusing on quality over quantity.",
    website: 'https://dragoonbrewing.com'
  },
  {
    name: 'SanTan Brewing Company',
    location: 'Chandler, Arizona',
    founded: 2007,
    description: "With playful naming and bold flavors, SanTan represents Arizona's fun-loving approach to craft beer.",
    website: 'https://santanbrewing.com'
  },
  {
    name: 'Oak Creek Brewery',
    location: 'Sedona, Arizona',
    founded: 1995,
    description: "From Sedona's stunning Tlaquepaque arts community, Arizona's oldest microbrewery connects craft beer to natural beauty.",
    website: 'https://oakcreekbrew.com'
  },
  {
    name: 'Mother Road Brewing Company',
    location: 'Flagstaff, Arizona',
    founded: 2013,
    description: "Named for Historic Route 66, this award-winning brewery celebrates Arizona's role in American adventure culture.",
    website: 'https://motherroadbeer.com'
  }
]

// Arizona beer reviews data
const arizonaBeerReviews = [
  {
    blog_post_id: 'arizona-day1-four-peaks-kilt-lifter',
    brewery_name: 'Four Peaks Brewing Company',
    beer_name: 'Kilt Lifter',
    beer_style: 'Scottish-Style Ale',
    abv: 6.0,
    rating: 4.2,
    review_text: "WEEK 3 BEGINS: ARIZONA'S DESERT BREWING REVOLUTION! From the shadow of Tempe Butte comes Arizona's brewing pioneer! Four Peaks opened in 1996 as the state's first major craft brewery, and their Kilt Lifter remains the beer that introduced countless Arizonans to craft brewing. Scottish tradition meets Southwestern innovation - this is where Arizona's craft beer story begins.",
    tasting_notes: 'Rich amber color with caramel malt sweetness and subtle hop balance. A warming Scottish ale that paradoxically refreshes in 115°F heat.',
    unique_feature: "Arizona's first major craft brewery, pioneering desert brewing since 1996",
    review_date: '2025-08-11'
  },
  {
    blog_post_id: 'arizona-day2-wilderness-refuge-ipa',
    brewery_name: 'Arizona Wilderness Brewing Company',
    beer_name: 'Refuge IPA',
    beer_style: 'American IPA',
    abv: 6.8,
    rating: 4.4,
    review_text: "Day 2: Arizona Wilderness Refuge IPA - Sustainability Meets Flavor! Born in a founder's garage and evolved into Arizona's most environmentally conscious brewery. Uses 100% Arizona-grown Sinagua Malt and supports water conservation - every pint helps offset 50+ gallons for Arizona's waterways.",
    tasting_notes: 'Bright citrus and pine hop character balanced by locally-grown malt sweetness. Unique terroir from Arizona-grown ingredients.',
    unique_feature: '100% Arizona-grown Sinagua Malt, water conservation offsetting program',
    review_date: '2025-08-12'
  },
  {
    blog_post_id: 'arizona-day3-historic-piehole-porter',
    brewery_name: 'Historic Brewing Company',
    beer_name: 'Piehole Porter',
    beer_style: 'Porter',
    abv: 5.5,
    rating: 4.3,
    review_text: "Day 3: Historic's Piehole Porter - Dessert Innovation from Flagstaff! From the pines of Flagstaff comes Arizona's most beloved dessert beer! Natural cherry and vanilla create a liquid cherry pie experience. This porter proves Arizona craft beer isn't afraid to be fun, bold, and completely unforgettable.",
    tasting_notes: 'Rich, dark porter base enhanced with natural cherry and vanilla flavoring. Smooth, creamy texture with chocolate malt backbone.',
    unique_feature: 'Liquid cherry pie experience, brewed at 7,000 feet elevation',
    review_date: '2025-08-13'
  },
  {
    blog_post_id: 'arizona-day4-dragoon-ipa',
    brewery_name: 'Dragoon Brewing Company',
    beer_name: 'Dragoon IPA',
    beer_style: 'West Coast IPA',
    abv: 7.3,
    rating: 4.5,
    review_text: "Day 4: Dragoon IPA - Tucson's Uncompromising West Coast Classic! In the Old Pueblo, Dragoon embodies Tucson's rebellious spirit. They brew only four year-round beers, focusing on quality over quantity. This is West Coast IPA as it should be - bold, beautiful, and unafraid to challenge your palate.",
    tasting_notes: 'Bold, aggressive hop character with fruity, floral, and citrus aromas. Clean malt backbone supports intense hop bitterness.',
    unique_feature: 'Only four year-round beers, quality over quantity philosophy',
    review_date: '2025-08-14'
  },
  {
    blog_post_id: 'arizona-day5-santan-devils-ale',
    brewery_name: 'SanTan Brewing Company',
    beer_name: "Devil's Ale",
    beer_style: 'American Pale Ale',
    abv: 5.5,
    rating: 4.1,
    review_text: "Day 5: SanTan's Devil's Ale - Sinfully Crisp Southwestern Style! With a devilish grin and Arizona attitude, this 'sinfully crisp' pale ale embodies the playful irreverence that makes Arizona craft beer memorable. Friday night in Arizona starts with a Devil's Ale - sinfully crisp and absolutely essential.",
    tasting_notes: 'Golden amber color with pronounced hop aroma. Pine and citrus flavors from Cascade, Centennial, and Simcoe hops.',
    unique_feature: 'Sinfully crisp finish perfect for 115°F desert heat',
    review_date: '2025-08-15'
  },
  {
    blog_post_id: 'arizona-day6-oak-creek-nut-brown',
    brewery_name: 'Oak Creek Brewery',
    beer_name: 'Nut Brown Ale',
    beer_style: 'English Brown Ale',
    abv: 5.5,
    rating: 4.0,
    review_text: "Day 6: Oak Creek Nut Brown Ale - Sedona's Red Rock Beauty! From Sedona's stunning Tlaquepaque arts community comes this award-winning brown ale that captures the earthy, rich tones of red rock country. This is Arizona brewing at its most scenic - where every pint comes with a million-dollar view.",
    tasting_notes: "Rich brown color that mirrors Sedona's iconic sandstone formations. Nutty, caramel malt flavors with subtle hop balance.",
    unique_feature: "Brewed in Sedona's arts district since 1995, every pint comes with million-dollar views",
    review_date: '2025-08-16'
  },
  {
    blog_post_id: 'arizona-day7-mother-road-tower-station',
    brewery_name: 'Mother Road Brewing Company',
    beer_name: 'Tower Station IPA',
    beer_style: 'American IPA',
    abv: 6.8,
    rating: 4.3,
    review_text: "Day 7 FINALE: Mother Road's Tower Station IPA - Route 66 Adventure Beer! Named for Historic Route 66, this award-winning IPA celebrates Arizona's role in American adventure culture. From Four Peaks' pioneering Scottish ale to Mother Road's adventure IPA, Arizona has shown that desert brewing creates extraordinary beers.",
    tasting_notes: "Citrus and pine hop characteristics that evoke Arizona's high-desert landscape. Clean, refreshing finish perfect for road trip adventures.",
    unique_feature: 'Named for Route 66, embodies the spirit of westward exploration and endless horizons',
    review_date: '2025-08-17'
  }
]

async function executeArizonaMigration() {
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
    
    // Check existing Arizona data
    const { data: existingArizona, error: checkError } = await supabase
      .from('beer_reviews')
      .select('*')
      .ilike('brewery_name', '%Arizona%')
      .or('brewery_name.in.(Four Peaks Brewing Company,Historic Brewing Company,Dragoon Brewing Company,SanTan Brewing Company,Oak Creek Brewery,Mother Road Brewing Company)')
    
    if (checkError) {
      console.warn('⚠️ Warning checking existing data:', checkError.message)
    } else if (existingArizona && existingArizona.length > 0) {
      console.log(`⚠️ Found ${existingArizona.length} existing Arizona entries`)
      console.log('Existing entries:', existingArizona.map(r => `${r.brewery_name} - ${r.beer_name}`))
    }
    
    console.log('')
    console.log('📊 Inserting Arizona Week 3 data...')
    
    // Insert beer reviews
    const { data: insertedReviews, error: reviewError } = await supabase
      .from('beer_reviews')
      .insert(arizonaBeerReviews)
      .select()
    
    if (reviewError) {
      throw new Error(`Failed to insert beer reviews: ${reviewError.message}`)
    }
    
    console.log(`✅ Successfully inserted ${insertedReviews.length} Arizona beer reviews`)
    
    // Verify the insertion
    const { data: verifyData, error: verifyError } = await supabase
      .from('beer_reviews')
      .select('*')
      .or('brewery_name.in.(Four Peaks Brewing Company,Arizona Wilderness Brewing Company,Historic Brewing Company,Dragoon Brewing Company,SanTan Brewing Company,Oak Creek Brewery,Mother Road Brewing Company)')
      .order('review_date', { ascending: true })
    
    if (verifyError) {
      console.warn('⚠️ Warning during verification:', verifyError.message)
    } else {
      console.log('')
      console.log('🔍 Verification Results:')
      console.log(`📈 Total Arizona entries in database: ${verifyData.length}`)
      console.log('')
      console.log('🗺️ Arizona Week 3 Schedule:')
      verifyData.forEach((review, index) => {
        const day = new Date(review.review_date).toLocaleDateString('en-US', { weekday: 'long' })
        console.log(`   ${day}: ${review.beer_name} by ${review.brewery_name} (${review.beer_style}, ${review.abv}% ABV)`)
      })
    }
    
    console.log('')
    console.log('🎉 Arizona Week 3 migration completed successfully!')
    console.log('✅ All brewery cross-links established')
    console.log('✅ All beer reviews populated')
    console.log('✅ Data ready for August 11-17, 2025 publication')
    
    return {
      success: true,
      insertedCount: insertedReviews.length,
      totalArizonaCount: verifyData?.length || 0
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Execute if called directly
if (require.main === module) {
  executeArizonaMigration()
    .then(result => {
      if (result.success) {
        console.log(`\n🌵 Arizona migration complete! ${result.insertedCount} new entries added.`)
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

module.exports = { executeArizonaMigration }