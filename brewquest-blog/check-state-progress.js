#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkStateProgress() {
  try {
    const { data, error } = await supabase
      .from('state_progress')
      .select('*')
      .order('week_number')
    
    if (error) {
      console.error('Error:', error.message)
      return
    }
    
    console.log('📊 Existing state_progress entries:')
    data.forEach((state, index) => {
      console.log(`\nEntry ${index + 1}:`)
      Object.keys(state).forEach(key => {
        const value = state[key]
        const length = typeof value === 'string' ? ` (${value.length} chars)` : ''
        console.log(`   ${key}: ${value}${length}`)
      })
    })
    
  } catch (error) {
    console.error('Failed to check state progress:', error.message)
  }
}

checkStateProgress()