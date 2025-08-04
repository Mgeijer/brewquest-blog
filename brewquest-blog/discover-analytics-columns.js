#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function discoverColumns() {
  try {
    console.log('🔍 Discovering state_analytics table structure...')
    
    // Try inserting with just an ID to see what's required
    const minimalRecord = {}
    
    const { data, error } = await supabase
      .from('state_analytics')
      .insert(minimalRecord)
      .select()
    
    if (error) {
      console.log('Error message:', error.message)
      console.log('Error details:', error.details)
      console.log('Error hint:', error.hint)
    }
    
    // Also try to get schema info differently
    console.log('\n🔍 Trying to describe table structure...')
    
    // Try a select with common column names
    const commonColumns = ['id', 'state_code', 'week_number', 'total_views', 'created_at']
    
    for (const col of commonColumns) {
      try {
        const { data, error } = await supabase
          .from('state_analytics')
          .select(col)
          .limit(1)
        
        if (error) {
          console.log(`   ❌ ${col}: ${error.message}`)
        } else {
          console.log(`   ✅ ${col}: exists`)
        }
      } catch (e) {
        console.log(`   ❌ ${col}: ${e.message}`)
      }
    }
    
  } catch (error) {
    console.error('Discovery failed:', error.message)
  }
}

discoverColumns()