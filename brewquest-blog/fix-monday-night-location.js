#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function fixMondayNightLocation() {
  try {
    console.log('🔧 Fixing Monday Night Brewing location...')
    
    // Monday Night Brewing is actually an Atlanta-based brewery, 
    // but this appears to be in Alabama context, so let's check the data first
    const { data: mondayNightRecords } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('brewery_name', 'Monday Night Brewing')
    
    console.log('Found Monday Night Brewing records:')
    mondayNightRecords.forEach(record => {
      console.log(`   ${record.state_name} - ${record.beer_name} - Location: ${record.brewery_location}`)
    })
    
    // Fix the Alabama Monday Night Brewing location
    const { error } = await supabase
      .from('beer_reviews')
      .update({ brewery_location: 'Birmingham, Alabama' })
      .eq('brewery_name', 'Monday Night Brewing')
      .eq('state_code', 'AL')
    
    if (error) {
      console.log(`❌ Failed to update: ${error.message}`)
    } else {
      console.log('✅ Updated Monday Night Brewing location for Alabama')
    }
    
    // Verify fix
    const { data: verification } = await supabase
      .from('beer_reviews')
      .select('brewery_name, brewery_location, state_name')
      .is('brewery_location', null)
    
    console.log(`\n📍 Remaining records without location: ${verification.length}`)
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

fixMondayNightLocation()