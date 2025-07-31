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

async function runMigration() {
  try {
    console.log('🚀 Starting safe database migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'database-safe-migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into individual statements (basic approach)
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.trim() === '') {
        continue;
      }
      
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement + ';'
        });
        
        if (error) {
          // Try direct SQL execution as fallback
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('_supabase_sql_exec')
            .insert({ sql: statement + ';' });
          
          if (fallbackError) {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            console.error('Statement:', statement);
            // Continue with other statements
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully (fallback)`);
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (execError) {
        console.error(`❌ Execution error in statement ${i + 1}:`, execError.message);
        console.error('Statement:', statement);
        // Continue with other statements
      }
    }
    
    console.log('🎉 Migration execution completed!');
    console.log('📊 Running verification queries...');
    
    // Verify the migration
    await verifyMigration();
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

async function verifyMigration() {
  try {
    // Check beer_reviews table structure
    const { data: beerReviews, error: beerError } = await supabase
      .from('beer_reviews')
      .select('*')
      .limit(5);
    
    if (beerError) {
      console.error('❌ Error querying beer_reviews:', beerError.message);
    } else {
      console.log(`✅ beer_reviews table accessible with ${beerReviews.length} sample records`);
      
      if (beerReviews.length > 0) {
        const sampleReview = beerReviews[0];
        console.log('📋 Sample beer review columns:', Object.keys(sampleReview));
        
        // Check for new columns
        const newColumns = ['state_code', 'week_number', 'day_of_week', 'ibu', 'description'];
        const presentColumns = newColumns.filter(col => col in sampleReview);
        console.log(`✅ New columns present: ${presentColumns.join(', ')}`);
        
        if (presentColumns.length !== newColumns.length) {
          const missingColumns = newColumns.filter(col => !(col in sampleReview));
          console.log(`⚠️  Missing columns: ${missingColumns.join(', ')}`);
        }
      }
    }
    
    // Check content_schedule table
    const { data: scheduleData, error: scheduleError } = await supabase
      .from('content_schedule')
      .select('*')
      .limit(1);
    
    if (scheduleError) {
      console.log('⚠️  content_schedule table may not exist yet:', scheduleError.message);
    } else {
      console.log('✅ content_schedule table accessible');
    }
    
    // Try to call the new functions
    console.log('🔧 Testing new functions...');
    
    try {
      const { data: statsData, error: statsError } = await supabase.rpc('get_journey_statistics');
      if (statsError) {
        console.log('⚠️  get_journey_statistics function not available:', statsError.message);
      } else {
        console.log('✅ get_journey_statistics function working');
        console.log('📊 Journey stats:', statsData);
      }
    } catch (e) {
      console.log('⚠️  Could not test get_journey_statistics function');
    }
    
    console.log('🎯 Migration verification completed!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

// Run the migration
runMigration().then(() => {
  console.log('✨ All done!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});