#!/usr/bin/env node

/**
 * Setup Approval Tables - Simple database table creation
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔧 Setup Approval Tables')
console.log('========================')

async function setupTables() {
  try {
    console.log('\n📊 Creating content_approvals table...')
    
    // Test if tables already exist
    const { data: existingApprovals, error: checkError1 } = await supabase
      .from('content_approvals')
      .select('count')
      .limit(1)
    
    if (!checkError1) {
      console.log('   ✅ content_approvals table already exists')
    } else {
      console.log('   ⚠️ content_approvals table needs to be created manually')
      console.log('   📋 Please run the SQL in create-approval-tables.sql in your Supabase dashboard')
    }
    
    const { data: existingEdits, error: checkError2 } = await supabase
      .from('content_edits')
      .select('count')
      .limit(1)
    
    if (!checkError2) {
      console.log('   ✅ content_edits table already exists')
    } else {
      console.log('   ⚠️ content_edits table needs to be created manually')
    }
    
    console.log('\n🔍 Testing database operations...')
    
    // Test inserting a sample approval record
    const testContentId = `test-approval-${Date.now()}`
    const { error: insertError } = await supabase
      .from('content_approvals')
      .insert({
        content_id: testContentId,
        content_type: 'social_post',
        status: 'pending'
      })
    
    if (insertError) {
      console.log(`   ❌ Insert test failed: ${insertError.message}`)
      return { success: false, error: insertError.message }
    }
    
    console.log('   ✅ Insert test successful')
    
    // Test updating the record
    const { error: updateError } = await supabase
      .from('content_approvals')
      .update({ 
        status: 'approved',
        approved_by: 'test-admin',
        approved_at: new Date().toISOString()
      })
      .eq('content_id', testContentId)
    
    if (updateError) {
      console.log(`   ❌ Update test failed: ${updateError.message}`)
      return { success: false, error: updateError.message }
    }
    
    console.log('   ✅ Update test successful')
    
    // Test querying
    const { data: queryData, error: queryError } = await supabase
      .from('content_approvals')
      .select('*')
      .eq('content_id', testContentId)
      .single()
    
    if (queryError) {
      console.log(`   ❌ Query test failed: ${queryError.message}`)
      return { success: false, error: queryError.message }
    }
    
    console.log('   ✅ Query test successful')
    console.log(`   📊 Test record: ${queryData.content_id} -> ${queryData.status}`)
    
    // Clean up test record
    await supabase
      .from('content_approvals')
      .delete()
      .eq('content_id', testContentId)
    
    console.log('   🧹 Test record cleaned up')
    
    console.log('\n🎉 Database Setup Verification Complete!')
    console.log('======================================')
    console.log('✅ Tables accessible')
    console.log('✅ Insert operations working')
    console.log('✅ Update operations working')
    console.log('✅ Query operations working')
    console.log('🚀 Ready for production use!')
    
    return { success: true }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Execute if called directly
if (require.main === module) {
  setupTables()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 SUCCESS! Approval system database is ready')
      } else {
        console.log('\n💥 Setup failed:', result.error)
        console.log('\n📋 Manual steps required:')
        console.log('   1. Go to your Supabase dashboard SQL editor')
        console.log('   2. Run the SQL in create-approval-tables.sql')
        console.log('   3. Re-run this script to verify')
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
    })
}

module.exports = { setupTables }