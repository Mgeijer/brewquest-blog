#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAnalyticsSchema() {
  try {
    console.log('🔍 Checking state_analytics table schema...')
    
    // Try to insert a minimal record to see what fields are required
    const testRecord = {
      state_code: 'TEST',
      state_name: 'Test State'
    }
    
    const { data, error } = await supabase
      .from('state_analytics')
      .insert(testRecord)
      .select()
    
    if (error) {
      console.log('❌ Error (this helps us understand the schema):', error.message)
    } else {
      console.log('✅ Test record created:', data)
      
      // Clean up test record
      await supabase
        .from('state_analytics')
        .delete()
        .eq('state_code', 'TEST')
    }
    
    // Try to get existing records to see structure
    const { data: existingRecords } = await supabase
      .from('state_analytics')
      .select('*')
      .limit(1)
    
    if (existingRecords && existingRecords.length > 0) {
      console.log('\n📊 Existing record structure:')
      Object.keys(existingRecords[0]).forEach(key => {
        console.log(`   ${key}: ${typeof existingRecords[0][key]}`)
      })
    } else {
      console.log('\n📭 No existing records in state_analytics')
    }
    
  } catch (error) {
    console.error('Error checking schema:', error.message)
  }
}

checkAnalyticsSchema()