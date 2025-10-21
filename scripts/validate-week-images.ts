/**
 * Weekly Image Validation Script
 *
 * Checks if beer images exist for the current week's state
 * Run this before weekly transitions to ensure images are ready
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import { existsSync } from 'fs'
import { join } from 'path'

config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

async function validateWeekImages() {
  console.log('🔍 Validating beer images for current and upcoming weeks...\n')

  // Get current and upcoming states
  const { data: states, error } = await supabase
    .from('state_progress')
    .select('*')
    .in('status', ['current', 'upcoming'])
    .order('week_number')
    .limit(2)

  if (error || !states) {
    console.error('❌ Error fetching states:', error)
    return
  }

  const [currentState, upcomingState] = states

  console.log(`📅 Current Week ${currentState.week_number}: ${currentState.state_name}`)
  await validateStateImages(currentState)

  if (upcomingState) {
    console.log(`\n📅 Next Week ${upcomingState.week_number}: ${upcomingState.state_name}`)
    await validateStateImages(upcomingState)
  }
}

async function validateStateImages(state: any) {
  const { data: beers, error } = await supabase
    .from('beer_reviews')
    .select('beer_name, image_url')
    .eq('blog_post_id', state.blog_post_id)
    .order('day_of_week')

  if (error) {
    console.error(`   ❌ Error fetching beers:`, error)
    return
  }

  if (!beers || beers.length === 0) {
    console.log(`   ⚠️  No beer reviews found in database`)
    console.log(`   📝 Action: Run scripts/add-${state.state_name.toLowerCase()}-beers.ts`)
    return
  }

  console.log(`   Found ${beers.length} beer reviews in database`)

  let missingImages = 0
  let foundImages = 0

  for (const beer of beers) {
    if (!beer.image_url) {
      console.log(`   ⚠️  ${beer.beer_name}: No image URL set`)
      missingImages++
      continue
    }

    // Convert URL to file path
    const imagePath = join(process.cwd(), 'public', beer.image_url)

    if (existsSync(imagePath)) {
      console.log(`   ✅ ${beer.beer_name}`)
      foundImages++
    } else {
      console.log(`   ❌ ${beer.beer_name}: Image missing at ${beer.image_url}`)
      missingImages++
    }
  }

  console.log(`\n   Summary: ${foundImages}/${beers.length} images ready`)

  if (missingImages > 0) {
    console.log(`   ⚠️  ${missingImages} images need to be added to public/images/Beer images/${state.state_name}/`)
  } else {
    console.log(`   🎉 All images ready!`)
  }
}

validateWeekImages()
