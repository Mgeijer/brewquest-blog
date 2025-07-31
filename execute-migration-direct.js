const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeMigrationSteps() {
  console.log('🚀 Starting safe database migration (step by step)...');
  
  try {
    // Step 1: Add missing columns to beer_reviews table
    console.log('📝 Step 1: Adding missing columns to beer_reviews...');
    
    const alterCommands = [
      'ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS state_code VARCHAR(2)',
      'ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS state_name VARCHAR(50)',
      'ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS week_number INTEGER',
      'ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS ibu INTEGER',
      'ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS description TEXT',
      'ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
    ];
    
    for (const command of alterCommands) {
      console.log(`  Executing: ${command}`);
      const { error } = await supabase.rpc('exec_sql', { sql: command });
      if (error) {
        console.log(`  ⚠️  Warning: ${error.message}`);
      } else {
        console.log('  ✅ Success');
      }
    }
    
    // Step 2: Migrate existing Alabama data
    console.log('📝 Step 2: Migrating existing Alabama data...');
    
    // First, let's check what data exists
    const { data: existingData, error: selectError } = await supabase
      .from('beer_reviews')
      .select('id, unique_feature, brewery_story, tasting_notes, state_code')
      .limit(10);
    
    if (selectError) {
      console.error('❌ Error checking existing data:', selectError.message);
    } else {
      console.log(`📊 Found ${existingData.length} existing beer reviews`);
      
      if (existingData.length > 0 && existingData[0].unique_feature) {
        console.log('🔄 Sample unique_feature format:', existingData[0].unique_feature);
        
        // Update records that match the Alabama pattern
        for (const record of existingData) {
          if (record.unique_feature && record.unique_feature.includes(':') && !record.state_code) {
            const parts = record.unique_feature.split(':');
            if (parts.length >= 3 && parts[0] === 'AL') {
              const updateData = {
                state_code: parts[0],
                week_number: parts[1] ? parseInt(parts[1]) : null,
                ibu: parts[2] && /^\d+$/.test(parts[2]) ? parseInt(parts[2]) : null,
                state_name: 'Alabama',
                description: record.brewery_story || record.tasting_notes,
                updated_at: new Date().toISOString()
              };
              
              const { error: updateError } = await supabase
                .from('beer_reviews')
                .update(updateData)
                .eq('id', record.id);
              
              if (updateError) {
                console.log(`  ⚠️  Error updating record ${record.id}:`, updateError.message);
              } else {
                console.log(`  ✅ Updated record ${record.id}`);
              }
            }
          }
        }
      }
    }
    
    // Step 3: Create content_schedule table
    console.log('📝 Step 3: Creating content_schedule table...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS content_schedule (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        state_code VARCHAR(2) NOT NULL,
        week_number INTEGER NOT NULL,
        content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('state_post', 'beer_review')),
        content_id UUID,
        scheduled_date DATE NOT NULL,
        scheduled_time TIME NOT NULL,
        published_at TIMESTAMP WITH TIME ZONE,
        status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed', 'cancelled')),
        beer_day INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(state_code, week_number, content_type, beer_day)
      )
    `;
    
    const { error: tableError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    if (tableError) {
      console.log('  ⚠️  Warning creating content_schedule:', tableError.message);
    } else {
      console.log('  ✅ content_schedule table created');
    }
    
    // Step 4: Add indexes
    console.log('📝 Step 4: Creating indexes...');
    
    const indexCommands = [
      'CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_week ON beer_reviews(state_code, week_number) WHERE state_code IS NOT NULL',
      'CREATE INDEX IF NOT EXISTS idx_beer_reviews_week_day ON beer_reviews(state_code, week_number, day_of_week) WHERE state_code IS NOT NULL'
    ];
    
    for (const command of indexCommands) {
      console.log(`  Executing: ${command}`);
      const { error } = await supabase.rpc('exec_sql', { sql: command });
      if (error) {
        console.log(`  ⚠️  Warning: ${error.message}`);
      } else {
        console.log('  ✅ Success');
      }
    }
    
    console.log('🎉 Migration steps completed!');
    
    // Final verification
    await verifyMigration();
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

async function verifyMigration() {
  console.log('📊 Running verification...');
  
  try {
    // Check beer_reviews table structure and data
    const { data: beerReviews, error: beerError } = await supabase
      .from('beer_reviews')
      .select('*')
      .limit(5);
    
    if (beerError) {
      console.error('❌ Error querying beer_reviews:', beerError.message);
      return;
    }
    
    console.log(`✅ beer_reviews table accessible with ${beerReviews.length} records`);
    
    if (beerReviews.length > 0) {
      const sampleReview = beerReviews[0];
      console.log('📋 Sample beer review columns:', Object.keys(sampleReview));
      
      // Check for migrated data
      const migratedCount = beerReviews.filter(r => r.state_code).length;
      console.log(`📈 Migrated records in sample: ${migratedCount}/${beerReviews.length}`);
      
      if (migratedCount > 0) {
        const migratedRecord = beerReviews.find(r => r.state_code);
        console.log('📋 Sample migrated record:', {
          id: migratedRecord.id,
          state_code: migratedRecord.state_code,
          state_name: migratedRecord.state_name,
          week_number: migratedRecord.week_number,
          ibu: migratedRecord.ibu,
          brewery_name: migratedRecord.brewery_name,
          beer_name: migratedRecord.beer_name
        });
      }
    }
    
    // Check total counts
    const { count: totalCount, error: countError } = await supabase
      .from('beer_reviews')
      .select('*', { count: 'exact', head: true });
    
    if (!countError) {
      console.log(`📊 Total beer reviews: ${totalCount}`);
    }
    
    const { count: migratedCount, error: migratedError } = await supabase
      .from('beer_reviews')
      .select('*', { count: 'exact', head: true })
      .not('state_code', 'is', null);
    
    if (!migratedError) {
      console.log(`📊 Migrated beer reviews: ${migratedCount}`);
      if (totalCount > 0) {
        console.log(`📊 Migration coverage: ${Math.round((migratedCount / totalCount) * 100)}%`);
      }
    }
    
    // Check content_schedule table
    const { data: scheduleData, error: scheduleError } = await supabase
      .from('content_schedule')
      .select('*')
      .limit(1);
    
    if (scheduleError) {
      console.log('⚠️  content_schedule table issue:', scheduleError.message);
    } else {
      console.log('✅ content_schedule table accessible');
    }
    
    console.log('🎯 Verification completed!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

// Run the migration
executeMigrationSteps().then(() => {
  console.log('✨ Migration completed successfully!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Migration failed:', error);
  process.exit(1);
});