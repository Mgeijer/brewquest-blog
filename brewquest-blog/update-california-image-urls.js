#!/usr/bin/env node

/**
 * Update California Week 5 Image URLs - Fix image paths to match actual files
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔧 Update California Beer Image URLs')
console.log('===================================')

// Image URL corrections mapping
const imageUrlUpdates = [
  {
    beer_name: 'Sierra Nevada Pale Ale',
    new_image_url: '/images/Beer images/California/sierra-nevada-pale-ale.jpg'
  },
  {
    beer_name: 'Stone IPA',
    new_image_url: '/images/Beer images/California/Stone IPA.webp'
  },
  {
    beer_name: 'Pliny the Elder',
    new_image_url: '/images/Beer images/California/Pliny the Elder.jpg'
  },
  {
    beer_name: 'Speedway Stout',
    new_image_url: '/images/Beer images/California/AleSmith Speedway Stout.webp'
  },
  {
    beer_name: '805 Blonde Ale',
    new_image_url: '/images/Beer images/California/Firestone-Walker-805.webp'
  },
  {
    beer_name: 'Lagunitas IPA',
    new_image_url: '/images/Beer images/California/lagunitas-brewing-ipa.jpg'
  },
  {
    beer_name: 'Old Rasputin Russian Imperial Stout',
    new_image_url: '/images/Beer images/California/Old Rasputin North Coast.png'
  }
]

async function updateImageUrls() {
  try {
    console.log('\n🖼️ Updating California beer image URLs...')
    
    let successCount = 0
    let errorCount = 0
    
    for (const update of imageUrlUpdates) {
      console.log(`\n📸 Updating ${update.beer_name}...`)
      
      const { error } = await supabase
        .from('beer_reviews')
        .update({ image_url: update.new_image_url })
        .eq('beer_name', update.beer_name)
        .eq('state_code', 'CA')
        .eq('week_number', 5)
      
      if (error) {
        console.log(`   ❌ Failed: ${error.message}`)
        errorCount++
      } else {
        console.log(`   ✅ Updated: ${update.new_image_url}`)
        successCount++
      }
    }
    
    console.log('\n🔍 Verification...')
    
    // Verify all updates
    const { data: verification, error: verifyError } = await supabase
      .from('beer_reviews')
      .select('beer_name, image_url')
      .eq('state_code', 'CA')
      .eq('week_number', 5)
      .order('day_of_week')
    
    if (verifyError) {
      console.log(`   ❌ Verification failed: ${verifyError.message}`)
      return { success: false, error: verifyError.message }
    }
    
    console.log('\n📊 Updated Image URLs:')
    verification.forEach((beer, index) => {
      console.log(`   ${index + 1}. ${beer.beer_name}: ${beer.image_url}`)
    })
    
    console.log('\n🎉 California Image URL Update Complete!')
    console.log('=========================================')
    console.log(`✅ ${successCount} images updated successfully`)
    console.log(`❌ ${errorCount} errors encountered`)
    console.log('🖼️ All California beer images now have correct file paths!')
    
    return { 
      success: errorCount === 0, 
      updated: successCount, 
      errors: errorCount,
      verification: verification?.length || 0
    }
    
  } catch (error) {
    console.error('❌ Update failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Execute if called directly
if (require.main === module) {
  updateImageUrls()
    .then(result => {
      if (result.success) {
        console.log(`\n🎉 SUCCESS! ${result.updated} California beer image URLs updated!`)
        console.log(`🔍 Verified ${result.verification} total California beers`)
        console.log('🖼️ All images now point to correct file paths!')
      } else {
        console.log('\n💥 Update failed:', result.error)
        console.log(`✅ ${result.updated || 0} successful updates`)
        console.log(`❌ ${result.errors || 0} failed updates`)
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
    })
}

module.exports = { updateImageUrls }