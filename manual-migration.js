const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function manualMigration() {
  console.log('🚀 Starting manual migration for Alabama data...');
  
  try {
    // Step 1: Get all existing beer reviews
    console.log('📝 Step 1: Fetching existing beer reviews...');
    
    const { data: allReviews, error: fetchError } = await supabase
      .from('beer_reviews')
      .select('*');
    
    if (fetchError) {
      throw new Error(`Failed to fetch reviews: ${fetchError.message}`);
    }
    
    console.log(`📊 Found ${allReviews.length} beer reviews to process`);
    
    // Step 2: Process each review and extract metadata
    console.log('📝 Step 2: Processing and updating records...');
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const review of allReviews) {
      try {
        if (review.unique_feature && review.unique_feature.includes(':')) {
          const parts = review.unique_feature.split(':');
          
          if (parts.length >= 4 && parts[0] === 'AL') {
            // Parse the encoded data: AL:week:ibu:sequence
            const state_code = parts[0];
            const week_number = parseInt(parts[1]) || 1;
            const ibu = parseInt(parts[2]) || null;
            const sequence = parts[3]; // al-01, al-02, etc.
            
            // Extract day number from sequence (al-01 = day 1, al-02 = day 2, etc.)
            const dayMatch = sequence.match(/al-(\d+)/);
            const day_of_week = dayMatch ? parseInt(dayMatch[1]) : null;
            
            // Prepare update data
            const updateData = {
              state_code,
              state_name: 'Alabama',
              week_number,
              ibu,
              day_of_week,
              description: review.brewery_story || review.tasting_notes || `${review.beer_name} from ${review.brewery_name}`,
              updated_at: new Date().toISOString()
            };
            
            console.log(`  🔄 Updating ${review.brewery_name} - ${review.beer_name}:`);
            console.log(`     State: ${state_code}, Week: ${week_number}, Day: ${day_of_week}, IBU: ${ibu}`);
            
            // Since we can't alter the table structure via the API, let's try to update what we can
            // We'll need to manually add the columns via the Supabase dashboard first
            
            // For now, let's just verify the data extraction is working
            console.log(`     ✅ Parsed: ${JSON.stringify(updateData, null, 2)}`);
            updatedCount++;
          } else {
            console.log(`  ⚠️  Skipping record with unexpected format: ${review.unique_feature}`);
          }
        } else {
          console.log(`  ⚠️  Skipping record without unique_feature: ${review.brewery_name} - ${review.beer_name}`);
        }
      } catch (error) {
        console.error(`  ❌ Error processing ${review.brewery_name} - ${review.beer_name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Processing Summary:`);
    console.log(`   ✅ Successfully processed: ${updatedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📋 Total records: ${allReviews.length}`);
    
    // Step 3: Generate the SQL commands that need to be run manually
    console.log('\n📝 Step 3: Generating SQL commands for manual execution...');
    
    const sqlCommands = [
      '-- Add missing columns to beer_reviews table',
      'ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS state_code VARCHAR(2);',
      'ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS state_name VARCHAR(50);',
      'ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS week_number INTEGER;',
      'ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS ibu INTEGER;',
      'ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS description TEXT;',
      'ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();',
      '',
      '-- Update existing Alabama data',
    ];
    
    // Generate update statements for each record
    for (const review of allReviews) {
      if (review.unique_feature && review.unique_feature.includes(':')) {
        const parts = review.unique_feature.split(':');
        
        if (parts.length >= 4 && parts[0] === 'AL') {
          const state_code = parts[0];
          const week_number = parseInt(parts[1]) || 1;
          const ibu = parseInt(parts[2]) || null;
          const sequence = parts[3];
          const dayMatch = sequence.match(/al-(\d+)/);
          const day_of_week = dayMatch ? parseInt(dayMatch[1]) : null;
          const description = (review.brewery_story || review.tasting_notes || `${review.beer_name} from ${review.brewery_name}`).replace(/'/g, "''");
          
          const updateSQL = `UPDATE beer_reviews SET 
            state_code = '${state_code}',
            state_name = 'Alabama',
            week_number = ${week_number},
            ibu = ${ibu || 'NULL'},
            day_of_week = ${day_of_week || 'NULL'},
            description = '${description}',
            updated_at = NOW()
            WHERE id = '${review.id}';`;
          
          sqlCommands.push(updateSQL);
        }
      }
    }
    
    // Add additional table and function creation
    sqlCommands.push(
      '',
      '-- Create content_schedule table',
      `CREATE TABLE IF NOT EXISTS content_schedule (
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
      );`,
      '',
      '-- Create indexes',
      'CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_week ON beer_reviews(state_code, week_number) WHERE state_code IS NOT NULL;',
      'CREATE INDEX IF NOT EXISTS idx_beer_reviews_week_day ON beer_reviews(state_code, week_number, day_of_week) WHERE state_code IS NOT NULL;',
      'CREATE INDEX IF NOT EXISTS idx_content_schedule_date ON content_schedule(scheduled_date, scheduled_time, status);'
    );
    
    // Write SQL file
    const fs = require('fs');
    const sqlContent = sqlCommands.join('\n');
    fs.writeFileSync('manual-migration-commands.sql', sqlContent);
    
    console.log('\n✅ Generated manual-migration-commands.sql file');
    console.log('📋 You can now run these commands in the Supabase SQL editor:');
    console.log('   1. Go to your Supabase project dashboard');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Copy and paste the contents of manual-migration-commands.sql');
    console.log('   4. Execute the SQL commands');
    
    return { updatedCount, errorCount, totalRecords: allReviews.length };
    
  } catch (error) {
    console.error('❌ Manual migration failed:', error.message);
    throw error;
  }
}

// Step 4: After manual SQL execution, verify the results
async function verifyAfterManualMigration() {
  console.log('\n🔍 Verification after manual migration...');
  
  try {
    // Check if new columns exist by trying to select them
    const { data: testData, error: testError } = await supabase
      .from('beer_reviews')
      .select('id, state_code, state_name, week_number, day_of_week, ibu, description')
      .limit(3);
    
    if (testError) {
      console.log('⚠️  New columns not yet available:', testError.message);
      console.log('💡 Please run the SQL commands in manual-migration-commands.sql first');
    } else {
      console.log('✅ New columns are available!');
      console.log('📊 Sample migrated data:', testData);
      
      // Count migrated vs total
      const { count: totalCount } = await supabase
        .from('beer_reviews')
        .select('*', { count: 'exact', head: true });
      
      const { count: migratedCount } = await supabase
        .from('beer_reviews')
        .select('*', { count: 'exact', head: true })
        .not('state_code', 'is', null);
      
      console.log(`📈 Migration progress: ${migratedCount}/${totalCount} records (${Math.round((migratedCount/totalCount)*100)}%)`);
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

async function main() {
  try {
    const result = await manualMigration();
    console.log('\n🎉 Manual migration preparation completed!');
    console.log(`📊 Results: ${result.updatedCount} records ready for migration`);
    
    // Try verification (will likely fail until manual SQL is run)
    await verifyAfterManualMigration();
    
  } catch (error) {
    console.error('💥 Process failed:', error);
    process.exit(1);
  }
}

main();