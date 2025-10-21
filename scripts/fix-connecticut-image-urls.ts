/**
 * Fix Connecticut beer image URLs to use correct path
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

async function fixConnecticutImageUrls() {
  console.log('🔧 Fixing Connecticut beer image URLs...\n')

  const { data: beers, error: fetchError } = await supabase
    .from('beer_reviews')
    .select('id, beer_name, image_url')
    .eq('state_code', 'CT')
    .order('day_of_week')

  if (fetchError) {
    console.error('❌ Error fetching beers:', fetchError)
    return
  }

  let fixedCount = 0

  for (const beer of beers || []) {
    if (beer.image_url?.includes('/images/beer-images/')) {
      const correctUrl = beer.image_url.replace('/images/beer-images/', '/images/Beer images/')

      const { error: updateError } = await supabase
        .from('beer_reviews')
        .update({ image_url: correctUrl })
        .eq('id', beer.id)

      if (updateError) {
        console.error(`❌ Failed to update ${beer.beer_name}:`, updateError)
      } else {
        console.log(`✅ Fixed: ${beer.beer_name}`)
        console.log(`   From: ${beer.image_url}`)
        console.log(`   To:   ${correctUrl}\n`)
        fixedCount++
      }
    } else {
      console.log(`✓ Already correct: ${beer.beer_name}`)
    }
  }

  console.log(`\n📊 Fixed ${fixedCount} out of ${beers?.length || 0} Connecticut beers`)
}

fixConnecticutImageUrls()
