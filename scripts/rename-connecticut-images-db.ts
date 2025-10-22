/**
 * Update Connecticut image URLs to -v2 versions to bust Vercel CDN cache
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

async function renameConnecticutImages() {
  console.log('🔄 Updating Connecticut image URLs to -v2 versions...\n')

  const { data: beers, error } = await supabase
    .from('beer_reviews')
    .select('id, beer_name, image_url')
    .eq('state_code', 'CT')
    .like('image_url', '%/Connecticut/%')

  if (error) {
    console.error('❌ Error fetching beers:', error)
    return
  }

  for (const beer of beers || []) {
    const newUrl = beer.image_url.replace('.jpg', '-v2.jpg')

    const { error: updateError } = await supabase
      .from('beer_reviews')
      .update({ image_url: newUrl })
      .eq('id', beer.id)

    if (updateError) {
      console.error(`❌ Failed to update ${beer.beer_name}:`, updateError)
    } else {
      console.log(`✅ ${beer.beer_name}`)
      console.log(`   Old: ${beer.image_url}`)
      console.log(`   New: ${newUrl}\n`)
    }
  }

  console.log(`\n✨ Updated ${beers?.length || 0} Connecticut beer images`)
}

renameConnecticutImages()
