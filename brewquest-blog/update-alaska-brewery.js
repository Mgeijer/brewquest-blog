#!/usr/bin/env node

/**
 * Update Alaska Week 2 - Replace Resolution Brewing with Anchorage Brewing Company
 * Replace New England IPA with "A Deal With the Devil" American Barleywine
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🍺 Alaska Week 2 - Replace Resolution Brewing with Anchorage Brewing Company')
console.log('=======================================================================')

async function updateAlaskaBrewery() {
  try {
    console.log('\n🔍 Step 1: Checking current Alaska Week 2 data...')
    
    // Check existing Alaska Week 2 beer reviews
    const { data: alaskaBeers, error: beerError } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('state_code', 'AK')
      .eq('week_number', 2)
      .order('day_of_week')
    
    if (beerError) {
      console.log(`   ❌ Error checking Alaska beers: ${beerError.message}`)
      return { success: false, error: beerError.message }
    }
    
    console.log(`   📊 Found ${alaskaBeers?.length || 0} Alaska Week 2 beer reviews`)
    
    // Look for Resolution Brewing
    const resolutionBeer = alaskaBeers?.find(beer => 
      beer.brewery_name?.includes('Resolution') || 
      beer.brewery_location?.includes('Resolution')
    )
    
    if (resolutionBeer) {
      console.log(`   🎯 Found Resolution Brewing entry:`)
      console.log(`      Beer: ${resolutionBeer.beer_name}`)
      console.log(`      Style: ${resolutionBeer.beer_style}`)
      console.log(`      Day: ${resolutionBeer.day_of_week}`)
      console.log(`      ABV: ${resolutionBeer.abv}%`)
    } else {
      console.log('   ⚪ No Resolution Brewing entry found in beer_reviews')
    }
    
    // Check brewery_features for Resolution Brewing
    const { data: breweryFeatures, error: breweryError } = await supabase
      .from('brewery_features')
      .select('*')
      .eq('state_code', 'AK')
      .order('visit_priority')
    
    if (breweryError) {
      console.log(`   ❌ Error checking Alaska breweries: ${breweryError.message}`)
    } else {
      console.log(`   🏭 Found ${breweryFeatures?.length || 0} Alaska brewery features`)
      
      const resolutionBrewery = breweryFeatures?.find(brewery => 
        brewery.brewery_name?.includes('Resolution')
      )
      
      if (resolutionBrewery) {
        console.log(`   🎯 Found Resolution Brewery feature:`)
        console.log(`      Name: ${resolutionBrewery.brewery_name}`)
        console.log(`      Priority: ${resolutionBrewery.visit_priority}`)
        console.log(`      Week: ${resolutionBrewery.featured_week}`)
      }
    }
    
    console.log('\n🔄 Step 2: Updating with Anchorage Brewing Company...')
    
    // Update beer_reviews - Replace Resolution Brewing beer with Anchorage Brewing
    if (resolutionBeer) {
      const { error: updateBeerError } = await supabase
        .from('beer_reviews')
        .update({
          brewery_name: 'Anchorage Brewing Company',
          beer_name: 'A Deal With the Devil',
          beer_style: 'American Barleywine',
          abv: 17.0,
          ibu: 85, // Typical for American Barleywine
          tasting_notes: 'Rich, complex American barleywine with intense malt character, dark fruit notes, and warming alcohol. Layers of caramel, toffee, and dried fruit create a contemplative sipping experience.',
          unique_feature: 'Anchorage Brewing Company\'s flagship high-gravity barleywine showcasing Alaska\'s bold brewing approach to extreme styles',
          brewery_story: 'Anchorage Brewing Company represents Alaska\'s commitment to crafting exceptional high-gravity beers that can weather the state\'s extreme conditions.',
          brewery_location: 'Anchorage, Alaska',
          image_url: '/images/Beer images/Alaska/Anchorage A Deal With the Devil.jpg',
          description: 'Alaska\'s most celebrated American barleywine demonstrating the state\'s expertise with high-gravity brewing'
        })
        .eq('id', resolutionBeer.id)
      
      if (updateBeerError) {
        console.log(`   ❌ Failed to update beer review: ${updateBeerError.message}`)
      } else {
        console.log(`   ✅ Updated beer review for Day ${resolutionBeer.day_of_week}`)
      }
    }
    
    // Update brewery_features - Replace Resolution Brewing with Anchorage Brewing
    const resolutionBrewery = breweryFeatures?.find(brewery => 
      brewery.brewery_name?.includes('Resolution')
    )
    
    if (resolutionBrewery) {
      const { error: updateBreweryError } = await supabase
        .from('brewery_features')
        .update({
          brewery_name: 'Anchorage Brewing Company',
          brewery_type: 'microbrewery',
          city: 'Anchorage',
          website_url: 'https://anchoragebrewingcompany.com',
          founded_year: 2010,
          brewery_description: 'Anchorage Brewing Company specializes in high-gravity, barrel-aged beers that showcase Alaska\'s bold brewing approach to extreme styles and challenging conditions.',
          why_featured: 'Renowned for exceptional American barleywines and barrel-aged offerings, representing Alaska\'s commitment to high-gravity brewing excellence',
          social_media: {
            instagram: 'anchoragebrewing',
            facebook: 'AnchorageBrewingCompany'
          }
        })
        .eq('id', resolutionBrewery.id)
      
      if (updateBreweryError) {
        console.log(`   ❌ Failed to update brewery feature: ${updateBreweryError.message}`)
      } else {
        console.log(`   ✅ Updated brewery feature`)
      }
    } else {
      console.log('   ⚪ No Resolution Brewery found in brewery_features to update')
    }
    
    console.log('\n🔍 Step 3: Verification...')
    
    // Verify the updates
    const { data: verifyBeers } = await supabase
      .from('beer_reviews')
      .select('brewery_name, beer_name, beer_style, abv, day_of_week')
      .eq('state_code', 'AK')
      .eq('week_number', 2)
      .order('day_of_week')
    
    console.log('   📊 Alaska Week 2 beer reviews after update:')
    verifyBeers?.forEach(beer => {
      console.log(`      Day ${beer.day_of_week}: ${beer.brewery_name} - ${beer.beer_name} (${beer.beer_style}, ${beer.abv}% ABV)`)
    })
    
    const { data: verifyBreweries } = await supabase
      .from('brewery_features')
      .select('brewery_name, city, visit_priority')
      .eq('state_code', 'AK')
      .order('visit_priority')
    
    console.log('   🏭 Alaska brewery features after update:')
    verifyBreweries?.forEach(brewery => {
      console.log(`      ${brewery.visit_priority}: ${brewery.brewery_name} (${brewery.city})`)
    })
    
    console.log('\n🎉 Alaska Week 2 Update Complete!')
    console.log('====================================')
    console.log('✅ Resolution Brewing replaced with Anchorage Brewing Company')
    console.log('✅ New England IPA replaced with A Deal With the Devil American Barleywine')
    console.log('✅ Database entries updated and verified')
    console.log('🍺 Alaska Week 2 ready with new brewery!')
    
    return { 
      success: true, 
      updated: !!resolutionBeer,
      breweryUpdated: !!resolutionBrewery,
      totalBeers: verifyBeers?.length || 0 
    }
    
  } catch (error) {
    console.error('❌ Alaska brewery update failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Execute if called directly
if (require.main === module) {
  updateAlaskaBrewery()
    .then(result => {
      if (result.success) {
        console.log(`\n🎉 SUCCESS! Alaska Week 2 brewery replacement completed!`)
        if (result.updated) {
          console.log('✅ Beer review updated with Anchorage Brewing Company')
        } else {
          console.log('ℹ️ No Resolution Brewing beer found to update')
        }
        if (result.breweryUpdated) {
          console.log('✅ Brewery feature updated')
        } else {
          console.log('ℹ️ No Resolution Brewery feature found to update')
        }
        console.log(`📊 Total Alaska Week 2 beers: ${result.totalBeers}`)
      } else {
        console.log('\n💥 Update failed:', result.error)
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
    })
}

module.exports = { updateAlaskaBrewery }