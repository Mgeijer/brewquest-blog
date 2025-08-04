#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAllTables() {
  const tables = ['state_progress', 'states', 'breweries', 'beers', 'newsletter_subscribers']
  
  for (const table of tables) {
    try {
      console.log(`\n🔍 Checking table: ${table}`)
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(3)
      
      if (error) {
        console.log(`   ❌ Error or table not accessible: ${error.message}`)
      } else {
        console.log(`   ✅ Table exists with ${data.length} sample records`)
        if (data && data.length > 0) {
          console.log('   📊 Columns:')
          Object.keys(data[0]).forEach(key => {
            console.log(`     - ${key}: ${typeof data[0][key]} (${data[0][key]})`)
          })
        }
      }
    } catch (e) {
      console.log(`   ❌ Exception: ${e.message}`)
    }
  }
}

checkAllTables()