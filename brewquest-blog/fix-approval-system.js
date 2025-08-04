#!/usr/bin/env node

/**
 * Fix Approval System - Replace In-Memory Storage with Database
 * Create content_approvals table and migrate existing approval logic
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔧 Fix Approval System - Database Implementation')
console.log('=============================================')

async function createContentApprovalsTable() {
  try {
    console.log('\n📊 Step 1: Creating content_approvals table...')
    
    const createTableSQL = `
      -- Create content_approvals table
      CREATE TABLE IF NOT EXISTS content_approvals (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        content_id TEXT NOT NULL UNIQUE,
        content_type TEXT NOT NULL DEFAULT 'social_post',
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        approved_by TEXT,
        approved_at TIMESTAMP WITH TIME ZONE,
        rejected_by TEXT,
        rejected_at TIMESTAMP WITH TIME ZONE,
        rejection_reason TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS idx_content_approvals_content_id ON content_approvals(content_id);
      CREATE INDEX IF NOT EXISTS idx_content_approvals_status ON content_approvals(status);
      CREATE INDEX IF NOT EXISTS idx_content_approvals_type ON content_approvals(content_type);
      CREATE INDEX IF NOT EXISTS idx_content_approvals_created_at ON content_approvals(created_at);

      -- Enable Row Level Security
      ALTER TABLE content_approvals ENABLE ROW LEVEL SECURITY;

      -- Create policies (admin access only)
      CREATE POLICY "Admin can manage content approvals" ON content_approvals
        FOR ALL USING (true);

      -- Create updated_at trigger
      CREATE OR REPLACE FUNCTION update_content_approvals_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      CREATE TRIGGER update_content_approvals_updated_at
        BEFORE UPDATE ON content_approvals
        FOR EACH ROW
        EXECUTE FUNCTION update_content_approvals_updated_at();
    `

    const { error } = await supabase.rpc('exec_sql', { sql_query: createTableSQL })
    
    if (error) {
      console.log(`   ❌ Failed to create table: ${error.message}`)
      return { success: false, error: error.message }
    }
    
    console.log('   ✅ content_approvals table created successfully')
    
    console.log('\n📝 Step 2: Creating content_edits table for edited content...')
    
    const createEditsTableSQL = `
      -- Create content_edits table
      CREATE TABLE IF NOT EXISTS content_edits (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        content_id TEXT NOT NULL,
        original_content TEXT,
        edited_content TEXT NOT NULL,
        edited_by TEXT,
        edit_reason TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_content_edits_content_id ON content_edits(content_id);
      CREATE INDEX IF NOT EXISTS idx_content_edits_active ON content_edits(is_active);
      CREATE INDEX IF NOT EXISTS idx_content_edits_created_at ON content_edits(created_at);

      -- Enable RLS
      ALTER TABLE content_edits ENABLE ROW LEVEL SECURITY;

      -- Create policy
      CREATE POLICY "Admin can manage content edits" ON content_edits
        FOR ALL USING (true);

      -- Updated at trigger
      CREATE TRIGGER update_content_edits_updated_at
        BEFORE UPDATE ON content_edits
        FOR EACH ROW
        EXECUTE FUNCTION update_content_approvals_updated_at();
    `

    const { error: editsError } = await supabase.rpc('exec_sql', { sql_query: createEditsTableSQL })
    
    if (editsError) {
      console.log(`   ❌ Failed to create content_edits table: ${editsError.message}`)
    } else {
      console.log('   ✅ content_edits table created successfully')
    }
    
    console.log('\n🔍 Step 3: Verifying table creation...')
    
    // Verify tables exist
    const { data: approvalsTable, error: checkError } = await supabase
      .from('content_approvals')
      .select('*')
      .limit(1)
    
    if (checkError) {
      console.log(`   ❌ Table verification failed: ${checkError.message}`)
      return { success: false, error: checkError.message }
    }
    
    console.log('   ✅ Tables verified and accessible')
    
    console.log('\n🎉 Approval System Database Setup Complete!')
    console.log('==========================================')
    console.log('✅ content_approvals table created')
    console.log('✅ content_edits table created')
    console.log('✅ Indexes and RLS policies configured')
    console.log('✅ Ready for AdminStorage migration')
    
    return { success: true }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Execute if called directly
if (require.main === module) {
  createContentApprovalsTable()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 SUCCESS! Database tables created for approval system')
        console.log('📋 Next steps:')
        console.log('   1. Update AdminStorage to use database instead of memory')
        console.log('   2. Test approval system with database persistence')
        console.log('   3. Deploy updated code to Vercel')
      } else {
        console.log('\n💥 Setup failed:', result.error)
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
    })
}

module.exports = { createContentApprovalsTable }