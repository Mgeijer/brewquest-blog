#!/usr/bin/env node

/**
 * Arkansas Week 4 - Add Missing Data
 * Add brewery_features and beer_reviews (state_progress already exists)
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🍺 Arkansas Week 4 - Add Missing Data')
console.log('===================================')

// Arkansas brewery_features entries (simplified to match Arizona format)
const arkansasBreweryFeatures = [
  {
    state_code: 'AR',
    brewery_name: 'Lost Forty Brewing',
    brewery_type: 'microbrewery',
    city: 'Little Rock',
    website_url: 'https://lostfortybrewing.com',
    founded_year: 2014,
    brewery_description: 'Named after Arkansas\'s "Lost Forty" virgin forest, Lost Forty Brewing combines conservation advocacy with world-class brewing, producing the 2020 GABF Gold Medal winning Day Drinker.',
    why_featured: '2020 GABF Gold Medal winner for Day Drinker Belgian Blonde, Arkansas\'s largest brewery by output, conservation advocacy',
    visit_priority: 1,
    social_media: {
      instagram: 'lostfortybrewing',
      twitter: 'lostfortybrewing',
      facebook: 'LostFortyBrewing'
    },
    featured_week: 4,
    is_active: true
  },
  {
    state_code: 'AR',
    brewery_name: 'Ozark Beer Company',
    brewery_type: 'microbrewery',
    city: 'Rogers',
    website_url: 'https://ozarkbeercompany.com',
    founded_year: 2012,
    brewery_description: 'Rogers brewery known for exceptional quality consistency and innovative brewing, featured in "50 Most Underrated Craft Breweries in the U.S.A." by Paste Magazine.',
    why_featured: 'Named "Best Brewery in Arkansas" by Thrillist, award-winning BDCS barrel-aged stout, extensive media recognition',
    visit_priority: 2,
    social_media: {
      instagram: 'ozarkbeercompany',
      twitter: 'ozarkbeer',
      facebook: 'OzarkBeerCompany'
    },
    featured_week: 4,
    is_active: true
  },
  {
    state_code: 'AR',
    brewery_name: 'Fossil Cove Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Fayetteville',
    website_url: 'https://fossilcovebrewing.com',
    founded_year: 2012,
    brewery_description: 'Named after fossil-laden cove on Beaver Lake (their water source), featuring local artists\' dinosaur-themed can designs with strong community focus.',
    why_featured: 'La Brea Brown is their most popular offering, strong community engagement, unique dinosaur-themed branding',
    visit_priority: 3,
    social_media: {
      instagram: 'fossilcovebrewing',
      twitter: 'fossilcovebeer',
      facebook: 'FossilCoveBrewing'
    },
    featured_week: 4,
    is_active: true
  },
  {
    state_code: 'AR',
    brewery_name: 'Core Brewing & Distilling Company',
    brewery_type: 'microbrewery',
    city: 'Springdale',
    website_url: 'https://coreofarkansas.com',
    founded_year: 2010,
    brewery_description: 'Established Springdale brewery with over a decade of operations, now also produces award-winning Scarlet Letter hard beverages, indicating business growth and diversification.',
    why_featured: 'Over decade of established operations, business diversification into hard beverages, consistent quality brewing',
    visit_priority: 4,
    social_media: {
      instagram: 'corebrewing',
      twitter: 'corebrewing',
      facebook: 'CoreBrewing'
    },
    featured_week: 4,
    is_active: true
  },
  {
    state_code: 'AR',
    brewery_name: 'Diamond Bear Brewing Company',
    brewery_type: 'microbrewery',
    city: 'North Little Rock',
    website_url: 'https://diamondbear.com',
    founded_year: 1993,
    brewery_description: 'Historic Arkansas brewery, first production brewery in Little Rock area in 15+ years when founded, with multiple World Beer Cup and GABF medals.',
    why_featured: 'Arkansas brewing pioneer since 1993, multiple World Beer Cup and GABF medals, historic significance',
    visit_priority: 5,
    social_media: {
      instagram: 'diamondbearbrewing',
      twitter: 'diamondbear',
      facebook: 'DiamondBearBrewing'
    },
    featured_week: 4,
    is_active: true
  },
  {
    state_code: 'AR',
    brewery_name: 'Flyway Brewing Company',
    brewery_type: 'microbrewery',
    city: 'North Little Rock',
    website_url: 'https://flywaybrewing.com',
    founded_year: 2015,
    brewery_description: 'Winner of 2023 Toast of the Town for Best Brewery, Best Brewpub, Best Arkansas Beer, and Best Arkansas IPA, known for exceptional fruit beer integration.',
    why_featured: '2023 Toast of the Town winner (multiple categories), exceptional fruit beer expertise, award-winning quality',
    visit_priority: 6,
    social_media: {
      instagram: 'flywaybrewing',
      twitter: 'flywaybrewing',
      facebook: 'FlywayBrewing'
    },
    featured_week: 4,
    is_active: true
  },
  {
    state_code: 'AR',
    brewery_name: 'Superior Bathhouse Brewery',
    brewery_type: 'microbrewery',
    city: 'Hot Springs',
    website_url: 'https://superiorbbathousebrewery.com',
    founded_year: 2013,
    brewery_description: 'The only brewery located in a U.S. National Park, using 143°F thermal spring water from Hot Springs National Park, located in historic 1922 bathhouse.',
    why_featured: 'Only brewery in U.S. National Park, unique thermal spring water brewing (143°F), historic 1922 bathhouse location',
    visit_priority: 7,
    social_media: {
      instagram: 'superiorbathhouse',
      twitter: 'superiorbath',
      facebook: 'SuperiorBathouseBrewing'
    },
    featured_week: 4,
    is_active: true
  }
]

// Arkansas beer_reviews entries
const arkansasBeerReviews = [
  {
    brewery_name: 'Lost Forty Brewing',
    beer_name: 'Day Drinker Belgian Blonde Ale',
    beer_style: 'Belgian Blonde Ale',
    abv: 4.8,
    rating: 5,
    tasting_notes: 'Light, crisp Belgian blonde with delicate spice notes and smooth finish. Perfect balance of traditional Belgian yeast character with Arkansas refinement.',
    unique_feature: '2020 Great American Beer Festival Gold Medal winner that put Arkansas craft beer on the national map',
    brewery_story: 'Named after Arkansas\'s "Lost Forty" virgin forest, this Little Rock brewery combines conservation advocacy with world-class brewing excellence.',
    brewery_location: 'Little Rock, Arkansas',
    image_url: '/images/Beer images/Arkansas/Lost Forty Day Drinker Belgian Blonde Ale.jpg',
    day_of_week: 1,
    state_code: 'AR',
    state_name: 'Arkansas',
    week_number: 4,
    ibu: 20,
    description: 'GABF Gold Medal Belgian blonde excellence that announced Arkansas\'s arrival on the national craft beer stage',
    status: 'published'
  },
  {
    brewery_name: 'Ozark Beer Company',
    beer_name: 'BDCS (Bourbon Barrel-Aged Double Cream Stout)',
    beer_style: 'Imperial Stout (Barrel-Aged)',
    abv: 10.0,
    rating: 5,
    tasting_notes: 'Rich imperial stout aged in bourbon barrels creates layers of vanilla, caramel, and dark chocolate. Smooth cream character balanced by bourbon warmth.',
    unique_feature: 'Award-winning barrel-aged imperial stout showcasing Arkansas\'s serious barrel-aging expertise using pristine Ozark Mountain water',
    brewery_story: 'Rogers brewery featured in "50 Most Underrated Craft Breweries in the U.S.A." by Paste Magazine, known for exceptional quality consistency.',
    brewery_location: 'Rogers, Arkansas',
    image_url: '/images/Beer images/Arkansas/Ozark BDCS Bourbon Barrel-Aged Double Cream Stout.jpg',
    day_of_week: 2,
    state_code: 'AR',
    state_name: 'Arkansas',
    week_number: 4,
    ibu: 40,
    description: 'Barrel-aged imperial stout excellence demonstrating Arkansas\'s sophisticated brewing techniques',
    status: 'published'
  },
  {
    brewery_name: 'Fossil Cove Brewing Company',
    beer_name: 'La Brea Brown',
    beer_style: 'Brown Ale - Belgian',
    abv: 6.0,
    rating: 4,
    tasting_notes: 'Rich amber-brown color with caramel malt sweetness and subtle Belgian yeast complexity. Smooth, warming character with notes of bread, toffee, and gentle spice.',
    unique_feature: 'Belgian-style brown ale that combines European tradition with Arkansas character, their most popular offering',
    brewery_story: 'Named after fossil-laden cove on Beaver Lake (their water source), featuring local artists\' dinosaur-themed can designs with strong community focus.',
    brewery_location: 'Fayetteville, Arkansas',
    image_url: '/images/Beer images/Arkansas/Fossil Cove La Brea Brown.jpg',
    day_of_week: 3,
    state_code: 'AR',
    state_name: 'Arkansas',
    week_number: 4,
    ibu: 18,
    description: 'Belgian-style brown ale from the Ozarks proving Arkansas understands European brewing traditions',
    status: 'published'
  },
  {
    brewery_name: 'Core Brewing & Distilling Company',
    beer_name: 'Los Santos IPA',
    beer_style: 'American IPA',
    abv: 6.2,
    rating: 4,
    tasting_notes: 'Bright citrus and pine hop character with clean malt backbone. Perfect balance of bitterness and drinkability with fresh, vibrant hop aroma.',
    unique_feature: 'Hop-forward American IPA from over a decade of Springdale brewing expertise, showcasing Northwest Arkansas brewing excellence',
    brewery_story: 'Established brewery with over a decade of operations, now also produces award-winning Scarlet Letter hard beverages, showing business diversification.',
    brewery_location: 'Springdale, Arkansas',
    image_url: '/images/Beer images/Arkansas/Core Los Santos IPA.jpg',
    day_of_week: 4,
    state_code: 'AR',
    state_name: 'Arkansas',
    week_number: 4,
    ibu: 65,
    description: 'Northwest Arkansas hop excellence proving Arkansas can compete with any hop-loving region',
    status: 'published'
  },
  {
    brewery_name: 'Diamond Bear Brewing Company',
    beer_name: 'Presidential IPA',
    beer_style: 'American IPA',
    abv: 6.2,
    rating: 4,
    tasting_notes: 'Bold American IPA with assertive hop character and solid malt foundation. Citrus and pine hop notes with enough bitterness to satisfy serious IPA drinkers.',
    unique_feature: 'Historic Arkansas brewery\'s flagship representing decades of Arkansas craft beer heritage and brewing royalty',
    brewery_story: 'One of Arkansas\'s pioneering breweries since 1993, first production brewery in Little Rock area in 15+ years, with multiple GABF and World Beer Cup medals.',
    brewery_location: 'North Little Rock, Arkansas',
    image_url: '/images/Beer images/Arkansas/Diamond Bear Presidential IPA.jpg',
    day_of_week: 5,
    state_code: 'AR',
    state_name: 'Arkansas',
    week_number: 4,
    ibu: 70,
    description: 'Presidential quality Arkansas IPA representing brewing history and pioneer heritage',
    status: 'published'
  },
  {
    brewery_name: 'Flyway Brewing Company',
    beer_name: 'Bluewing Berry Wheat',
    beer_style: 'Wheat Beer - Fruited (Witbier)',
    abv: 4.9,
    rating: 4,
    tasting_notes: 'Light, refreshing wheat beer enhanced with natural berry flavors. Smooth wheat character provides perfect canvas for Arkansas regional berries.',
    unique_feature: 'Award-winning brewery\'s berry-infused wheat beer showcasing Arkansas fruit flavors with technical mastery',
    brewery_story: 'Winner of 2023 Toast of the Town for Best Brewery, Best Brewpub, Best Arkansas Beer, and Best Arkansas IPA, known for exceptional fruit beer integration.',
    brewery_location: 'North Little Rock, Arkansas',
    image_url: '/images/Beer images/Arkansas/Flyway Bluewing Berry Wheat.jpg',
    day_of_week: 6,
    state_code: 'AR',
    state_name: 'Arkansas',
    week_number: 4,
    ibu: 15,
    description: 'Arkansas berry brewing mastery showing sophisticated fruit beer integration',
    status: 'published'
  },
  {
    brewery_name: 'Superior Bathhouse Brewery',
    beer_name: 'Hitchcock Spring Kölsch',
    beer_style: 'Kölsch',
    abv: 4.9,
    rating: 5,
    tasting_notes: 'Crisp, clean Kölsch brewed with legendary Hot Springs thermal water. Light, refreshing character with subtle fruit notes and perfect carbonation.',
    unique_feature: 'The ONLY brewery in a U.S. National Park using 143°F thermal spring water, creating beer that exists nowhere else in America',
    brewery_story: 'Located in historic 1922 bathhouse in Hot Springs National Park, this brewery combines Arkansas history, German brewing tradition, and thermal spring water.',
    brewery_location: 'Hot Springs, Arkansas',
    image_url: '/images/Beer images/Arkansas/Superior Bathhouse Hitchcock Spring Kölsch.jpg',
    day_of_week: 7,
    state_code: 'AR',
    state_name: 'Arkansas',
    week_number: 4,
    ibu: 20,
    description: 'Thermal spring water Kölsch from America\'s most unique National Park brewery location',
    status: 'published'
  }
]

async function addArkansasMissingData() {
  try {
    console.log('\n🏭 Step 1: Adding Arkansas brewery_features entries...')
    
    const { error: breweryError } = await supabase
      .from('brewery_features')
      .insert(arkansasBreweryFeatures)
    
    if (breweryError) {
      console.log(`   ❌ Brewery features failed: ${breweryError.message}`)
      return { success: false, error: breweryError.message }
    }
    console.log(`   ✅ ${arkansasBreweryFeatures.length} Arkansas brewery features created`)

    console.log('\n🍺 Step 2: Adding Arkansas beer_reviews entries...')
    
    const { error: reviewError } = await supabase
      .from('beer_reviews')
      .insert(arkansasBeerReviews)
    
    if (reviewError) {
      console.log(`   ❌ Beer reviews failed: ${reviewError.message}`)
      return { success: false, error: reviewError.message }
    }
    console.log(`   ✅ ${arkansasBeerReviews.length} Arkansas beer reviews created`)

    console.log('\n🔍 Step 3: Verification...')
    
    const { data: verification } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('state_code', 'AR')
      .eq('week_number', 4)
      .order('day_of_week')
    
    console.log(`   📊 Verified ${verification?.length || 0} Arkansas beer reviews`)
    
    // Check brewery features
    const { data: breweries } = await supabase
      .from('brewery_features')
      .select('brewery_name, website_url')
      .eq('state_code', 'AR')
      .order('visit_priority')
    
    console.log(`   🏭 Verified ${breweries?.length || 0} Arkansas breweries with features`)
    
    console.log('\n🎉 Arkansas Week 4 Data Addition Complete!')
    console.log('======================================')
    console.log('✅ State progress entry already existed')
    console.log('✅ 7 brewery features with websites and social media added')
    console.log('✅ 7 beer reviews (Monday-Sunday) added')
    console.log('🍺 Arkansas Week 4 ready for publication!')
    
    return { success: true, beers: verification?.length || 0, breweries: breweries?.length || 0 }
    
  } catch (error) {
    console.error('❌ Arkansas data addition failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Execute if called directly
if (require.main === module) {
  addArkansasMissingData()
    .then(result => {
      if (result.success) {
        console.log(`\n🎉 SUCCESS! Arkansas Week 4 data addition completed!`)
        console.log(`🍺 ${result.beers} beer reviews created`)
        console.log(`🏭 ${result.breweries} brewery features created`)
        console.log('🔗 All data ready for BrewQuest Chronicles Week 4!')
      } else {
        console.log('\n💥 Data addition failed:', result.error)
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
    })
}

module.exports = { addArkansasMissingData }