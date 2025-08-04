#!/usr/bin/env node

/**
 * Check Supabase beer_reviews table schema
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
  try {
    console.log('🔍 Checking Supabase beer_reviews table schema...')
    
    // Get a sample record to see the structure
    const { data, error } = await supabase
      .from('beer_reviews')
      .select('*')
      .limit(3)
    
    if (error) {
      console.error('Error:', error.message)
      return
    }
    
    if (data && data.length > 0) {
      console.log('\n📊 Sample records:')
      data.forEach((record, index) => {
        console.log(`\nRecord ${index + 1}:`)
        Object.keys(record).forEach(key => {
          console.log(`   ${key}: ${typeof record[key] === 'string' && record[key].length > 50 ? record[key].substring(0, 50) + '...' : record[key]}`)
        })
      })
      
      console.log('\n🗂️ Available columns:')
      Object.keys(data[0]).forEach(key => {
        console.log(`   - ${key}`)
      })
      
    } else {
      console.log('No data found in beer_reviews table')
    }
    
  } catch (error) {
    console.error('Failed to check schema:', error.message)
  }
}

checkSchema()