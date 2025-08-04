#!/usr/bin/env node

/**
 * Add Arizona Brewery Features - Fixed Version
 * Create brewery_features entries with correct data types
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🏭 Adding Arizona Brewery Features - Fixed Version')
console.log('================================================')

// Arizona brewery features with correct data types
const arizonaBreweryFeatures = [
  {
    state_code: 'AZ',
    brewery_name: 'Four Peaks Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Tempe',
    address: '1340 E 8th St, Tempe, AZ 85281',
    website_url: 'https://fourpeaks.com',
    founded_year: 1996,
    specialty_styles: 'Scottish-Style Ale,American IPA,Pale Ale',
    signature_beers: 'Kilt Lifter,Hop Knot IPA,Peach Ale',
    brewery_description: "Arizona's brewing pioneer, Four Peaks opened in 1996 as the state's first major craft brewery near ASU campus, becoming Arizona's craft beer university.",
    why_featured: "Arizona's first major craft brewery, pioneering desert brewing since 1996 and introducing countless Arizonans to craft beer",
    visit_priority: 1,
    social_media: {
      instagram: 'fourpeaksbrewing',
      twitter: 'fourpeaksbeer',
      facebook: 'FourPeaksBrewing'
    },
    awards: ['Great American Beer Festival medals', 'Arizona Beer Competition winners'],
    taproom_info: 'Original Tempe location with full restaurant, outdoor patio, and brewery tours',
    featured_week: 3,
    is_active: true
  },
  {
    state_code: 'AZ',
    brewery_name: 'Arizona Wilderness Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Gilbert',
    address: '721 N Gilbert Rd, Gilbert, AZ 85234',
    website_url: 'https://azwbeer.com',
    founded_year: 2013,
    specialty_styles: 'American IPA,Sustainable Beer,Local Ingredients',
    signature_beers: 'Refuge IPA,Desert Light Lager,Sinagua Malt Series',
    brewery_description: "Born in a founder's garage and evolved into Arizona's most environmentally conscious brewery, using 100% Arizona-grown Sinagua Malt.",
    why_featured: '100% Arizona-grown Sinagua Malt, water conservation offsetting program, every pint helps offset 50+ gallons for Arizona waterways',
    visit_priority: 2,
    social_media: {
      instagram: 'azwilderness',
      twitter: 'azwilderness',
      facebook: 'ArizonaWilderness'
    },
    awards: ['Sustainability awards', 'Arizona Beer Competition medals'],
    taproom_info: 'Modern taproom with focus on sustainability and local ingredients',
    featured_week: 3,
    is_active: true
  },
  {
    state_code: 'AZ',
    brewery_name: 'Historic Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Flagstaff',
    address: '4366 E Huntington Dr, Flagstaff, AZ 86004',
    website_url: 'https://historicbrewing.com',
    founded_year: 2012,
    specialty_styles: 'Porter,Dessert Beer,High-Altitude Brewing',
    signature_beers: 'Piehole Porter,Flagstaff IPA,Antelope Island Amber',
    brewery_description: "From the pines of Flagstaff at 7,000 feet elevation comes Arizona's most creative dessert beer innovation.",
    why_featured: 'Liquid cherry pie experience, brewed at 7,000 feet elevation, legendary porter found in nearly every Phoenix bar',
    visit_priority: 3,
    social_media: {
      instagram: 'historicbrewing',
      twitter: 'historicbrewing',
      facebook: 'HistoricBrewing'
    },
    awards: ['World Beer Cup medals', 'Great American Beer Festival recognition'],
    taproom_info: 'High-altitude brewing facility with mountain views and creative beer styles',
    featured_week: 3,
    is_active: true
  },
  {
    state_code: 'AZ',
    brewery_name: 'Dragoon Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Tucson',
    address: '1859 W Grant Rd, Tucson, AZ 85745',
    website_url: 'https://dragoonbrewing.com',
    founded_year: 2012,
    specialty_styles: 'West Coast IPA,Quality Over Quantity',
    signature_beers: 'Dragoon IPA,Porch Swing Pale Ale,Stronghold Stout',
    brewery_description: "Embodies Tucson's rebellious spirit with only four year-round beers, focusing on quality over quantity.",
    why_featured: 'Only four year-round beers, quality over quantity philosophy, uncompromising West Coast IPA excellence',
    visit_priority: 4,
    social_media: {
      instagram: 'dragoonbrewing',
      twitter: 'dragoonbrewing',
      facebook: 'DragoonBrewing'
    },
    awards: ['Great American Beer Festival medals', 'World Beer Cup recognition'],
    taproom_info: 'Tucson taproom reflecting Old Pueblo independent spirit with limited, perfected lineup',
    featured_week: 3,
    is_active: true
  },
  {
    state_code: 'AZ',
    brewery_name: 'SanTan Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Chandler',
    address: '8 S San Marcos Pl, Chandler, AZ 85225',
    website_url: 'https://santanbrewing.com',
    founded_year: 2007,
    specialty_styles: 'American Pale Ale,Desert-Perfect Balance',
    signature_beers: "Devil's Ale,Mr. Pineapple,Sex Panther",
    brewery_description: "With playful naming and bold flavors, SanTan represents Arizona's fun-loving approach to craft beer.",
    why_featured: 'Sinfully crisp finish perfect for 115°F desert heat, playful irreverent naming and bold Arizona attitude',
    visit_priority: 5,
    social_media: {
      instagram: 'santanbrewing',
      twitter: 'santanbrewing',
      facebook: 'SanTanBrewing'
    },
    awards: ['Arizona Beer Competition winners', 'Local favorite recognition'],
    taproom_info: 'Fun, irreverent atmosphere with beers perfect for desert climate',
    featured_week: 3,
    is_active: true
  },
  {
    state_code: 'AZ',
    brewery_name: 'Oak Creek Brewery',
    brewery_type: 'microbrewery',
    city: 'Sedona',
    address: '336 AZ-179, Sedona, AZ 86336',
    website_url: 'https://oakcreekbrew.com',
    founded_year: 1995,
    specialty_styles: 'English Brown Ale,Scenic Brewing',
    signature_beers: 'Nut Brown Ale,Red Rock Lager,Verde Valley Wheat',
    brewery_description: "From Sedona's stunning Tlaquepaque arts community, Arizona's oldest microbrewery connects craft beer to natural beauty.",
    why_featured: "Brewed in Sedona's arts district since 1995, every pint comes with million-dollar red rock views",
    visit_priority: 6,
    social_media: {
      instagram: 'oakcreekbrewery',
      twitter: 'oakcreekbrew',
      facebook: 'OakCreekBrewery'
    },
    awards: ['Longevity awards', 'Arizona tourism recognition'],
    taproom_info: 'Located in Tlaquepaque arts village with stunning red rock views and scenic atmosphere',
    featured_week: 3,
    is_active: true
  },
  {
    state_code: 'AZ',
    brewery_name: 'Mother Road Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Flagstaff',
    address: '7 S Mikes Pike, Flagstaff, AZ 86001',
    website_url: 'https://motherroadbeer.com',
    founded_year: 2013,
    specialty_styles: 'American IPA,Route 66 Heritage',
    signature_beers: 'Tower Station IPA,Kolsch 66,Desert Gin Botanical Ale',
    brewery_description: "Named for Historic Route 66, this award-winning brewery celebrates Arizona's role in American adventure culture.",
    why_featured: 'Named for Route 66, embodies the spirit of westward exploration and endless horizons, gateway to adventure brewing',
    visit_priority: 7,
    social_media: {
      instagram: 'motherroadbeer',
      twitter: 'motherroadbeer',
      facebook: 'MotherRoadBeer'
    },
    awards: ['Great American Beer Festival medals', 'Route 66 heritage recognition'],
    taproom_info: 'Flagstaff taproom celebrating Route 66 heritage and American adventure culture',
    featured_week: 3,
    is_active: true
  }
]

async function addArizonaBreweryFeatures() {
  try {
    console.log('\n📝 Adding Arizona brewery features with correct data types...')
    
    for (const brewery of arizonaBreweryFeatures) {
      const { error } = await supabase
        .from('brewery_features')
        .insert(brewery)
      
      if (error) {
        console.log(`   ❌ Failed to add ${brewery.brewery_name}: ${error.message}`)
      } else {
        console.log(`   ✅ Added ${brewery.brewery_name} (${brewery.city}, founded ${brewery.founded_year})`)
      }
    }
    
    console.log('\n🔍 Final verification...')
    
    // Check Arizona brewery features
    const { data: azBreweries } = await supabase
      .from('brewery_features')
      .select('brewery_name, website_url, founded_year, city')
      .eq('state_code', 'AZ')
      .order('founded_year')
    
    console.log(`\n📊 Arizona Brewery Features: ${azBreweries?.length || 0} records`)
    if (azBreweries && azBreweries.length > 0) {
      azBreweries.forEach(brewery => {
        console.log(`   ✅ ${brewery.brewery_name} (${brewery.city}, ${brewery.founded_year})`)
        console.log(`      Website: ${brewery.website_url}`)
      })
    }
    
    // Total count by state
    const { data: allStates } = await supabase
      .from('brewery_features')
      .select('state_code')
    
    const stateCounts = allStates.reduce((acc, brewery) => {
      acc[brewery.state_code] = (acc[brewery.state_code] || 0) + 1
      return acc
    }, {})
    
    console.log('\n📊 Total Brewery Features by State:')
    Object.keys(stateCounts).sort().forEach(state => {
      console.log(`   ${state}: ${stateCounts[state]} breweries`)
    })
    
    console.log('\n✅ Arizona brewery features successfully added!')
    
    return { success: true, added: azBreweries?.length || 0 }
    
  } catch (error) {
    console.error('❌ Failed to add Arizona brewery features:', error.message)
    return { success: false, error: error.message }
  }
}

// Execute if called directly
if (require.main === module) {
  addArizonaBreweryFeatures()
    .then(result => {
      if (result.success) {
        console.log(`\n🎉 Successfully added ${result.added} Arizona brewery features!`)
        console.log('🔗 Arizona breweries now have complete data in brewery_features table.')
      } else {
        console.log('\n💥 Failed to add Arizona brewery features:', result.error)
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
    })
}

module.exports = { addArizonaBreweryFeatures }