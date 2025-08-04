#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkBreweryFeaturesSchema() {
  try {
    console.log('🔍 Checking brewery_features table schema...')
    
    // Get a sample record to see the exact structure
    const { data, error } = await supabase
      .from('brewery_features')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Error:', error.message)
      return
    }
    
    if (data && data.length > 0) {
      console.log('\n📊 Sample brewery_features record:')
      const sample = data[0]
      Object.keys(sample).forEach(key => {
        const value = sample[key]
        const type = typeof value
        const preview = typeof value === 'string' && value.length > 50 
          ? value.substring(0, 50) + '...' 
          : value
        console.log(`   ${key}: ${preview} (${type})`)
      })
      
      console.log('\n🔍 Field types analysis:')
      Object.keys(sample).forEach(key => {
        const value = sample[key]
        if (typeof value === 'string' && value.includes(',')) {
          console.log(`   ${key}: Contains commas - likely comma-separated string, not array`)
        }
      })
    }
    
  } catch (error) {
    console.error('Error checking schema:', error.message)
  }
}

checkBreweryFeaturesSchema()