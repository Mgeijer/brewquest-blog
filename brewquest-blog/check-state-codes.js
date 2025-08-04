#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkStateCodes() {
  try {
    // Check existing state codes in beer_reviews
    const { data: stateData, error: stateError } = await supabase
      .from('beer_reviews')
      .select('state_code, state_name')
      .order('state_code')
    
    if (stateError) {
      console.error('Error checking states:', stateError.message)
      return
    }
    
    const uniqueStates = [...new Set(stateData.map(s => `${s.state_code} - ${s.state_name}`))]
    console.log('🗂️ Existing state codes in beer_reviews:')
    uniqueStates.forEach(state => console.log(`   ${state}`))
    
    // Check if there's a states table or similar
    console.log('\n🔍 Checking for states reference table...')
    
    const { data: statesTable, error: statesError } = await supabase
      .from('states')
      .select('*')
      .limit(5)
    
    if (statesError) {
      console.log('   No states table found or accessible')
    } else {
      console.log('   States table exists with columns:')
      if (statesTable && statesTable.length > 0) {
        Object.keys(statesTable[0]).forEach(key => {
          console.log(`     - ${key}`)
        })
      }
    }
    
  } catch (error) {
    console.error('Failed to check state codes:', error.message)
  }
}

checkStateCodes()