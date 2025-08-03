#!/usr/bin/env node

/**
 * California Week 5 - Complete Supabase Migration
 * Populate state_progress, brewery_features, and beer_reviews tables
 * Applying all learnings from Alabama, Alaska, Arizona, and Arkansas
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🍺 California Week 5 - Complete Supabase Migration')
console.log('================================================')

// Step 1: California state_progress entry
const californiaStateProgress = {
  state_code: 'CA',
  state_name: 'California',
  status: 'upcoming',
  week_number: 5,
  blog_post_id: require('crypto').randomUUID(),
  completion_date: null,
  featured_breweries: null,
  total_breweries: 900,
  featured_beers_count: 7,
  region: 'west',
  description: "The Golden State's craft brewing revolution leads America with 900+ breweries creating everything from pioneering pale ales to legendary double IPAs.",
  journey_highlights: null,
  difficulty_rating: 5,
  research_hours: 0
}

// Step 2: California brewery_features entries (verified operating businesses)
const californiaBreweryFeatures = [
  {
    state_code: 'CA',
    brewery_name: 'Sierra Nevada Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Chico',
    website_url: 'https://sierranevada.com',
    founded_year: 1980,
    brewery_description: 'Craft brewing pioneer that created the template for American craft beer. Founded by Ken Grossman, Sierra Nevada established the American Pale Ale style and remains the 6th largest brewing company in the United States.',
    why_featured: 'America\'s second-best-selling craft beer, established American Pale Ale template, craft brewing pioneer since 1980',
    visit_priority: 1,
    social_media: {
      instagram: 'sierranevada',
      twitter: 'sierranevada',
      facebook: 'SierraNevada'
    },
    featured_week: 5,
    is_active: true
  },
  {
    state_code: 'CA',
    brewery_name: 'Stone Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Escondido',
    website_url: 'https://stonebrewing.com',
    founded_year: 1996,
    brewery_description: 'Pioneers of the American IPA movement known for aggressive hop flavors and revolutionary brewing attitude. Stone IPA helped launch the hop arms race that defines modern craft brewing.',
    why_featured: 'IPA revolution leaders, aggressive hop pioneers, "Leaders in the Beer Revolution" philosophy',
    visit_priority: 2,
    social_media: {
      instagram: 'stonebrewing',
      twitter: 'stonebrewing',
      facebook: 'StoneBrewingCo'
    },
    featured_week: 5,
    is_active: true
  },
  {
    state_code: 'CA',
    brewery_name: 'Russian River Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Santa Rosa',
    website_url: 'https://www.russianriverbrewing.com',
    founded_year: 1997,
    brewery_description: 'Created one of America\'s first commercial Double IPAs with Pliny the Elder. Multiple GABF and World Beer Cup awards, represents wine country brewing precision applied to hop-forward styles.',
    why_featured: 'Double IPA pioneers, Pliny the Elder legend, multiple GABF/World Beer Cup awards, beer pilgrimage destination',
    visit_priority: 3,
    social_media: {
      instagram: 'russianriverbrewingcompany',
      twitter: 'russianriverbc',
      facebook: 'RussianRiverBrewingCompany'
    },
    featured_week: 5,
    is_active: true
  },
  {
    state_code: 'CA',
    brewery_name: 'AleSmith Brewing Company',
    brewery_type: 'microbrewery',
    city: 'San Diego',
    website_url: 'https://alesmith.com',
    founded_year: 1995,
    brewery_description: 'San Diego brewery known for technical brewing excellence and imperial stout mastery. Multiple GABF medals including gold awards for Speedway Stout.',
    why_featured: 'Multiple GABF medals, imperial stout excellence, Speedway Stout benchmark, San Diego brewing precision',
    visit_priority: 4,
    social_media: {
      instagram: 'alesmithbrewing',
      twitter: 'alesmithbrewing',
      facebook: 'AleSmithBrewing'
    },
    featured_week: 5,
    is_active: true
  },
  {
    state_code: 'CA',
    brewery_name: 'Firestone Walker Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Paso Robles',
    website_url: 'https://www.firestonewalker.com',
    founded_year: 1996,
    brewery_description: 'Central Coast brewery producing California\'s #1 craft beer brand. Represents the pinnacle of Central Coast brewing with wine country precision applied to beer.',
    why_featured: 'California\'s #1 craft beer brand (805), California\'s second-largest craft brewery, Central Coast excellence',
    visit_priority: 5,
    social_media: {
      instagram: 'firestonewalker',
      twitter: 'firestonewalker',
      facebook: 'FirestoneWalker'
    },
    featured_week: 5,
    is_active: true
  },
  {
    state_code: 'CA',
    brewery_name: 'Lagunitas Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Petaluma',
    website_url: 'https://lagunitas.com',
    founded_year: 1993,
    brewery_description: 'Bay Area IPA innovator that helped define West Coast hop character. Created distinctive hop-forward style in the mid-90s, produces nearly 1 million barrels annually.',
    why_featured: 'Bay Area IPA pioneers, West Coast hop character definition, nearly 1M barrels annually production',
    visit_priority: 6,
    social_media: {
      instagram: 'lagunitas',
      twitter: 'lagunitas',
      facebook: 'Lagunitas'
    },
    featured_week: 5,
    is_active: true
  },
  {
    state_code: 'CA',
    brewery_name: 'North Coast Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Fort Bragg',
    website_url: 'https://northcoastbrewing.com',
    founded_year: 1988,
    brewery_description: 'Craft beer pioneer from Northern California\'s rugged coastline. Old Rasputin Russian Imperial Stout became the American benchmark for the style.',
    why_featured: 'Craft beer pioneer since 1988, Old Rasputin imperial stout benchmark, Northern California coastal brewing',
    visit_priority: 7,
    social_media: {
      instagram: 'northcoastbrew',
      twitter: 'northcoastbrew',
      facebook: 'NorthCoastBrewing'
    },
    featured_week: 5,
    is_active: true
  }
]

// Step 3: California beer_reviews entries
const californiaBeerReviews = [
  {
    brewery_name: 'Sierra Nevada Brewing Company',
    beer_name: 'Sierra Nevada Pale Ale',
    beer_style: 'American Pale Ale',
    abv: 5.6,
    rating: 5,
    tasting_notes: 'The craft beer template: citrusy Cascade hops balanced by rich caramel malt. Clean, refreshing, and perfectly balanced - this is the beer that showed America what craft brewing could be.',
    unique_feature: 'Created the American Pale Ale template in 1980, America\'s second-best-selling craft beer that established the craft brewing revolution',
    brewery_story: 'Ken Grossman\'s vision from a Chico homebrew shop became the 6th largest brewing company in America, proving craft beer could scale without compromising quality.',
    brewery_location: 'Chico, California',
    image_url: '/images/Beer images/California/sierra-nevada-pale-ale.jpg',
    day_of_week: 1,
    state_code: 'CA',
    state_name: 'California',
    week_number: 5,
    ibu: 38,
    description: 'The Rosetta Stone of American craft beer - every American pale ale owes its existence to this Chico masterpiece',
    status: 'published'
  },
  {
    brewery_name: 'Stone Brewing Company',
    beer_name: 'Stone IPA',
    beer_style: 'India Pale Ale',
    abv: 6.9,
    rating: 5,
    tasting_notes: 'Aggressive, unapologetic hop character with bold citrus and pine notes. This IPA taught American drinkers that craft beer could be intense, flavorful, and uncompromising.',
    unique_feature: 'Launched the American IPA hop arms race, showed that craft beer could be aggressive and uncompromising with "Arrogant Bastard" attitude',
    brewery_story: 'Stone Brewing\'s revolutionary approach to hop-forward beer helped establish San Diego as America\'s hop innovation capital.',
    brewery_location: 'Escondido, California',
    image_url: '/images/Beer images/California/Stone IPA.webp',
    day_of_week: 2,
    state_code: 'CA',
    state_name: 'California',
    week_number: 5,
    ibu: 71,
    description: 'The IPA that changed everything - San Diego\'s aggressive hop revolution that launched the modern craft beer movement',
    status: 'published'
  },
  {
    brewery_name: 'Russian River Brewing Company',
    beer_name: 'Pliny the Elder',
    beer_style: 'Double/Imperial IPA',
    abv: 8.0,
    rating: 5,
    tasting_notes: 'Legendary balance in a Double IPA: complex hop character with perfect malt backbone. Despite 8% ABV, remains incredibly drinkable and perfectly balanced.',
    unique_feature: 'Created the Double IPA category, consistently rated among world\'s best beers, beer pilgrimage destination from Sonoma wine country',
    brewery_story: 'Russian River applies wine country precision to hop-forward brewing, creating the template every Double IPA tries to achieve.',
    brewery_location: 'Santa Rosa, California',
    image_url: '/images/Beer images/California/Pliny the Elder.jpg',
    day_of_week: 3,
    state_code: 'CA',
    state_name: 'California',
    week_number: 5,
    ibu: 100,
    description: 'Craft beer\'s holy grail - the Double IPA legend that created an entire style category',
    status: 'published'
  },
  {
    brewery_name: 'AleSmith Brewing Company',
    beer_name: 'Speedway Stout',
    beer_style: 'Imperial Coffee Stout',
    abv: 12.0,
    rating: 5,
    tasting_notes: 'Rich imperial stout enhanced with expertly selected coffee beans. Perfect integration of chocolate, coffee, and roasted malt creates layers of complexity at 12% ABV.',
    unique_feature: 'Multiple GABF medals, redefines coffee beer integration, showcases San Diego\'s technical brewing excellence beyond IPAs',
    brewery_story: 'AleSmith demonstrates the technical skill and attention to detail that defines California craft brewing across all styles.',
    brewery_location: 'San Diego, California',
    image_url: '/images/Beer images/California/AleSmith Speedway Stout.webp',
    day_of_week: 4,
    state_code: 'CA',
    state_name: 'California',
    week_number: 5,
    ibu: 65,
    description: 'Imperial coffee stout excellence proving San Diego brewing mastery extends to every style',
    status: 'published'
  },
  {
    brewery_name: 'Firestone Walker Brewing Company',
    beer_name: '805 Blonde Ale',
    beer_style: 'Blonde Ale',
    abv: 4.7,
    rating: 4,
    tasting_notes: 'Light, refreshing, and infinitely drinkable blonde ale. Captures the California lifestyle - easy-drinking, high-quality, perfect for endless sunshine.',
    unique_feature: 'California\'s #1 craft brand, conquered the Golden State market, represents Central Coast wine country brewing precision',
    brewery_story: 'Firestone Walker applies wine-making techniques to brewing, creating sessionable perfection from Paso Robles wine country.',
    brewery_location: 'Paso Robles, California',
    image_url: '/images/Beer images/California/Firestone-Walker-805.webp',
    day_of_week: 5,
    state_code: 'CA',
    state_name: 'California',
    week_number: 5,
    ibu: 16,
    description: 'California lifestyle in a bottle - the Golden State\'s most popular craft beer',
    status: 'published'
  },
  {
    brewery_name: 'Lagunitas Brewing Company',
    beer_name: 'Lagunitas IPA',
    beer_style: 'India Pale Ale',
    abv: 6.2,
    rating: 4,
    tasting_notes: 'Bright, citrusy hop character with Bay Area attitude. Irreverent and creative approach to IPA that helped define West Coast hop character.',
    unique_feature: 'Bay Area IPA pioneers, helped define West Coast IPA style, nearly 1 million barrels annually while maintaining craft integrity',
    brewery_story: 'Lagunitas embodies Northern California\'s irreverent spirit, scaling innovation from Petaluma to nearly 1 million barrels annually.',
    brewery_location: 'Petaluma, California',
    image_url: '/images/Beer images/California/lagunitas-brewing-ipa.jpg',
    day_of_week: 6,
    state_code: 'CA',
    state_name: 'California',
    week_number: 5,
    ibu: 51,
    description: 'Bay Area hop innovation with irreverent attitude that helped define West Coast IPA',
    status: 'published'
  },
  {
    brewery_name: 'North Coast Brewing Company',
    beer_name: 'Old Rasputin Russian Imperial Stout',
    beer_style: 'Russian Imperial Stout',
    abv: 9.0,
    rating: 5,
    tasting_notes: 'Rich, complex imperial stout with perfect balance at 9% ABV. Roasted malt complexity, warming alcohol, and layers of flavor that reveal themselves with every sip.',
    unique_feature: 'American benchmark for Russian Imperial Stouts, craft beer pioneer from Mendocino Coast since 1988',
    brewery_story: 'North Coast Brewing from Fort Bragg\'s rugged coastline has been perfecting this imperial stout recipe since the late 1980s.',
    brewery_location: 'Fort Bragg, California',
    image_url: '/images/Beer images/California/Old Rasputin North Coast.png',
    day_of_week: 7,
    state_code: 'CA',
    state_name: 'California',
    week_number: 5,
    ibu: 75,
    description: 'The Russian Imperial Stout benchmark that set the American standard for the style',
    status: 'published'
  }
]

async function migrateCalifornieData() {
  try {
    console.log('\n🏗️ Step 1: Creating California state_progress entry...')
    
    const { error: stateError } = await supabase
      .from('state_progress')
      .insert(californiaStateProgress)
    
    if (stateError) {
      console.log(`   ❌ State progress failed: ${stateError.message}`)
      return { success: false, error: stateError.message }
    }
    console.log('   ✅ California state_progress entry created')

    console.log('\n🏭 Step 2: Creating California brewery_features entries...')
    
    const { error: breweryError } = await supabase
      .from('brewery_features')
      .insert(californiaBreweryFeatures)
    
    if (breweryError) {
      console.log(`   ❌ Brewery features failed: ${breweryError.message}`)
      return { success: false, error: breweryError.message }
    }
    console.log(`   ✅ ${californiaBreweryFeatures.length} California brewery features created`)

    console.log('\n🍺 Step 3: Creating California beer_reviews entries...')
    
    const { error: reviewError } = await supabase
      .from('beer_reviews')
      .insert(californiaBeerReviews)
    
    if (reviewError) {
      console.log(`   ❌ Beer reviews failed: ${reviewError.message}`)
      return { success: false, error: reviewError.message }
    }
    console.log(`   ✅ ${californiaBeerReviews.length} California beer reviews created`)

    console.log('\n🔍 Step 4: Verification...')
    
    const { data: verification } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('state_code', 'CA')
      .eq('week_number', 5)
      .order('day_of_week')
    
    console.log(`   📊 Verified ${verification?.length || 0} California beer reviews`)
    
    // Check brewery features
    const { data: breweries } = await supabase
      .from('brewery_features')
      .select('brewery_name, website_url')
      .eq('state_code', 'CA')
      .order('visit_priority')
    
    console.log(`   🏭 Verified ${breweries?.length || 0} California breweries with features`)
    
    console.log('\n🎉 California Week 5 Migration Complete!')
    console.log('======================================')
    console.log('✅ State progress entry created')
    console.log('✅ 7 brewery features with websites and social media')
    console.log('✅ 7 beer reviews (Monday-Sunday)')
    console.log('🍺 California Week 5 ready for publication!')
    
    return { success: true, beers: verification?.length || 0, breweries: breweries?.length || 0 }
    
  } catch (error) {
    console.error('❌ California migration failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Execute if called directly
if (require.main === module) {
  migrateCalifornieData()
    .then(result => {
      if (result.success) {
        console.log(`\n🎉 SUCCESS! California Week 5 migration completed!`)
        console.log(`🍺 ${result.beers} beer reviews created`)
        console.log(`🏭 ${result.breweries} brewery features created`)
        console.log('🔗 All data ready for BrewQuest Chronicles Week 5!')
      } else {
        console.log('\n💥 Migration failed:', result.error)
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
    })
}

module.exports = { migrateCalifornieData }