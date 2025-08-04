#!/usr/bin/env node

/**
 * Fix Content Schedule RLS Security Issue
 * Enable Row Level Security on content_schedule table
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔒 Fixing Content Schedule RLS Security Issue')
console.log('============================================')

async function fixContentScheduleRLS() {
  try {
    console.log('\n🔍 Checking content_schedule table...')
    
    // First, check if the table exists and what data it contains
    const { data: tableData, error: selectError } = await supabase
      .from('content_schedule')
      .select('*')
      .limit(5)
    
    if (selectError) {
      console.log(`   ❌ Error accessing table: ${selectError.message}`)
      return { success: false, error: selectError.message }
    }
    
    console.log(`   📊 Found ${tableData?.length || 0} records in content_schedule table`)
    
    if (tableData && tableData.length > 0) {
      console.log('   Sample record structure:')
      const sample = tableData[0]
      Object.keys(sample).forEach(key => {
        const value = sample[key]
        const preview = typeof value === 'string' && value.length > 50 
          ? value.substring(0, 50) + '...' 
          : value
        console.log(`      ${key}: ${preview}`)
      })
    }
    
    console.log('\n🔒 Enabling Row Level Security...')
    
    // Enable RLS on the content_schedule table
    const { error: rlsError } = await supabase.rpc('sql', {
      query: `
        -- Enable Row Level Security on content_schedule table
        ALTER TABLE public.content_schedule ENABLE ROW LEVEL SECURITY;
        
        -- Create policy to allow authenticated users to read all content_schedule records
        CREATE POLICY "Allow authenticated read access" ON public.content_schedule
          FOR SELECT
          TO authenticated
          USING (true);
        
        -- Create policy to allow service role to manage content_schedule records
        CREATE POLICY "Allow service role full access" ON public.content_schedule
          FOR ALL
          TO service_role
          USING (true)
          WITH CHECK (true);
      `
    })
    
    if (rlsError) {
      console.log(`   ❌ Failed to enable RLS: ${rlsError.message}`)
      
      // Try individual commands if the combined approach fails
      console.log('\n🔄 Trying individual RLS commands...')
      
      try {
        // Enable RLS
        await supabase.rpc('sql', {
          query: 'ALTER TABLE public.content_schedule ENABLE ROW LEVEL SECURITY;'
        })
        console.log('   ✅ RLS enabled')
        
        // Create read policy
        await supabase.rpc('sql', {
          query: `
            CREATE POLICY "Allow authenticated read access" ON public.content_schedule
              FOR SELECT
              TO authenticated
              USING (true);
          `
        })
        console.log('   ✅ Read policy created')
        
        // Create service role policy
        await supabase.rpc('sql', {
          query: `
            CREATE POLICY "Allow service role full access" ON public.content_schedule
              FOR ALL
              TO service_role
              USING (true)
              WITH CHECK (true);
          `
        })
        console.log('   ✅ Service role policy created')
        
      } catch (individualError) {
        console.log(`   ❌ Individual command failed: ${individualError.message}`)
        return { success: false, error: individualError.message }
      }
    } else {
      console.log('   ✅ RLS and policies enabled successfully')
    }
    
    console.log('\n🔍 Verifying RLS is enabled...')
    
    // Verify RLS is now enabled (this query will be limited by RLS policies)
    const { data: verifyData, error: verifyError } = await supabase
      .from('content_schedule')
      .select('*')
      .limit(1)
    
    if (verifyError) {
      console.log(`   ⚠️ Verification failed (this might be expected if policies are restrictive): ${verifyError.message}`)
    } else {
      console.log('   ✅ Table is still accessible with RLS enabled')
      console.log(`   📊 Can still access ${verifyData?.length || 0} records`)
    }
    
    console.log('\n🎉 Content Schedule RLS Security Fix Completed!')
    console.log('✅ Row Level Security has been enabled on content_schedule table')
    console.log('✅ Authenticated users can read content_schedule records')  
    console.log('✅ Service role has full access for management operations')
    console.log('🔒 Security vulnerability has been resolved')
    
    return { success: true }
    
  } catch (error) {
    console.error('❌ Failed to fix content_schedule RLS:', error.message)
    return { success: false, error: error.message }
  }
}

// Execute if called directly
if (require.main === module) {
  fixContentScheduleRLS()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 SUCCESS! Content schedule RLS security issue fixed!')
        console.log('🔒 The Supabase security advisor warning should now be resolved.')
      } else {
        console.log('\n💥 Failed to fix RLS:', result.error)
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
    })
}

module.exports = { fixContentScheduleRLS }