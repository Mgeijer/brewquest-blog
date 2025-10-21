/**
 * Check Connecticut beer image URLs in database
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkConnecticutUrls() {
  const { data: beers, error } = await supabase
    .from('beer_reviews')
    .select('beer_name, image_url')
    .eq('state_code', 'CT')
    .order('day_of_week')

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('Connecticut Beer Image URLs:\n')
  beers?.forEach((beer, i) => {
    console.log(`${i + 1}. ${beer.beer_name}`)
    console.log(`   ${beer.image_url}\n`)
  })
}

checkConnecticutUrls()
