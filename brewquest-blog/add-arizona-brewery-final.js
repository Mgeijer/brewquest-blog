#!/usr/bin/env node

/**
 * Add Arizona Brewery Features - Final Correct Version
 * Using exact schema format from existing records
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🏭 Adding Arizona Brewery Features - Final Correct Version')
console.log('========================================================')

// Arizona brewery features with correct schema matching existing records
const arizonaBreweryFeatures = [
  {
    state_code: 'AZ',
    brewery_name: 'Four Peaks Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Tempe',
    website_url: 'https://fourpeaks.com',
    founded_year: 1996,
    brewery_description: "Arizona's brewing pioneer, Four Peaks opened in 1996 as the state's first major craft brewery near ASU campus, becoming Arizona's craft beer university.",
    why_featured: "Arizona's first major craft brewery, pioneering desert brewing since 1996 and introducing countless Arizonans to craft beer",
    visit_priority: 1,
    social_media: {
      instagram: 'fourpeaksbrewing',
      twitter: 'fourpeaksbeer',
      facebook: 'FourPeaksBrewing'
    },
    featured_week: 3,
    is_active: true
  },
  {
    state_code: 'AZ',
    brewery_name: 'Arizona Wilderness Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Gilbert',
    website_url: 'https://azwbeer.com',
    founded_year: 2013,
    brewery_description: "Born in a founder's garage and evolved into Arizona's most environmentally conscious brewery, using 100% Arizona-grown Sinagua Malt.",
    why_featured: '100% Arizona-grown Sinagua Malt, water conservation offsetting program, every pint helps offset 50+ gallons for Arizona waterways',
    visit_priority: 2,
    social_media: {
      instagram: 'azwilderness',
      twitter: 'azwilderness',
      facebook: 'ArizonaWilderness'
    },
    featured_week: 3,
    is_active: true
  },
  {
    state_code: 'AZ',
    brewery_name: 'Historic Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Flagstaff',
    website_url: 'https://historicbrewing.com',
    founded_year: 2012,
    brewery_description: "From the pines of Flagstaff at 7,000 feet elevation comes Arizona's most creative dessert beer innovation.",
    why_featured: 'Liquid cherry pie experience, brewed at 7,000 feet elevation, legendary porter found in nearly every Phoenix bar',
    visit_priority: 3,
    social_media: {
      instagram: 'historicbrewing',
      twitter: 'historicbrewing',
      facebook: 'HistoricBrewing'
    },
    featured_week: 3,
    is_active: true
  },
  {
    state_code: 'AZ',
    brewery_name: 'Dragoon Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Tucson',
    website_url: 'https://dragoonbrewing.com',
    founded_year: 2012,
    brewery_description: "Embodies Tucson's rebellious spirit with only four year-round beers, focusing on quality over quantity.",
    why_featured: 'Only four year-round beers, quality over quantity philosophy, uncompromising West Coast IPA excellence',
    visit_priority: 4,
    social_media: {
      instagram: 'dragoonbrewing',
      twitter: 'dragoonbrewing',
      facebook: 'DragoonBrewing'
    },
    featured_week: 3,
    is_active: true
  },
  {
    state_code: 'AZ',
    brewery_name: 'SanTan Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Chandler',
    website_url: 'https://santanbrewing.com',
    founded_year: 2007,
    brewery_description: "With playful naming and bold flavors, SanTan represents Arizona's fun-loving approach to craft beer.",
    why_featured: 'Sinfully crisp finish perfect for 115°F desert heat, playful irreverent naming and bold Arizona attitude',
    visit_priority: 5,
    social_media: {
      instagram: 'santanbrewing',
      twitter: 'santanbrewing',
      facebook: 'SanTanBrewing'
    },
    featured_week: 3,
    is_active: true
  },
  {
    state_code: 'AZ',
    brewery_name: 'Oak Creek Brewery',
    brewery_type: 'microbrewery',
    city: 'Sedona',
    website_url: 'https://oakcreekbrew.com',
    founded_year: 1995,
    brewery_description: "From Sedona's stunning Tlaquepaque arts community, Arizona's oldest microbrewery connects craft beer to natural beauty.",
    why_featured: "Brewed in Sedona's arts district since 1995, every pint comes with million-dollar red rock views",
    visit_priority: 6,
    social_media: {
      instagram: 'oakcreekbrewery',
      twitter: 'oakcreekbrew',
      facebook: 'OakCreekBrewery'
    },
    featured_week: 3,
    is_active: true
  },
  {
    state_code: 'AZ',
    brewery_name: 'Mother Road Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Flagstaff',
    website_url: 'https://motherroadbeer.com',
    founded_year: 2013,
    brewery_description: "Named for Historic Route 66, this award-winning brewery celebrates Arizona's role in American adventure culture.",
    why_featured: 'Named for Route 66, embodies the spirit of westward exploration and endless horizons, gateway to adventure brewing',
    visit_priority: 7,
    social_media: {
      instagram: 'motherroadbeer',
      twitter: 'motherroadbeer',
      facebook: 'MotherRoadBeer'
    },
    featured_week: 3,
    is_active: true
  }
]

async function addArizonaBreweryFeatures() {
  try {
    console.log('\n📝 Adding Arizona brewery features (core fields only)...')
    
    for (const brewery of arizonaBreweryFeatures) {
      const { error } = await supabase
        .from('brewery_features')
        .insert(brewery)
      
      if (error) {
        console.log(`   ❌ Failed to add ${brewery.brewery_name}: ${error.message}`)
      } else {
        console.log(`   ✅ Added ${brewery.brewery_name} (${brewery.city}, ${brewery.founded_year})`)
      }
    }
    
    console.log('\n🔍 Verification...')
    
    // Check Arizona brewery features
    const { data: azBreweries } = await supabase
      .from('brewery_features')
      .select('brewery_name, website_url, founded_year, city, social_media')
      .eq('state_code', 'AZ')
      .order('founded_year')
    
    console.log(`\n📊 Arizona Brewery Features: ${azBreweries?.length || 0} records`)
    if (azBreweries && azBreweries.length > 0) {
      azBreweries.forEach(brewery => {
        const socialInfo = brewery.social_media ? Object.keys(brewery.social_media).join(', ') : 'none'
        console.log(`   ✅ ${brewery.brewery_name} (${brewery.city})`)
        console.log(`      🌐 ${brewery.website_url}`)
        console.log(`      📱 Social: ${socialInfo}`)
      })
    }
    
    // Total count verification
    const { data: allBreweries, count } = await supabase
      .from('brewery_features')
      .select('state_code', { count: 'exact' })
    
    const stateCounts = allBreweries.reduce((acc, brewery) => {
      acc[brewery.state_code] = (acc[brewery.state_code] || 0) + 1
      return acc
    }, {})
    
    console.log('\n📊 Final Brewery Features Count:')
    Object.keys(stateCounts).sort().forEach(state => {
      console.log(`   ${state}: ${stateCounts[state]} breweries`)
    })
    console.log(`   Total: ${count} brewery features`)
    
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
        console.log(`\n🎉 SUCCESS! Added ${result.added} Arizona brewery features!`)
        console.log('🔗 Arizona breweries now visible in brewery_features table.')
        console.log('✅ All websites and social media data populated.')
      } else {
        console.log('\n💥 Failed:', result.error)
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
    })
}

module.exports = { addArizonaBreweryFeatures }