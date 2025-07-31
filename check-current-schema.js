const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkCurrentSchema() {
  console.log('📊 Checking current database schema...');
  
  try {
    // Check beer_reviews table
    const { data: beerReviews, error: beerError } = await supabase
      .from('beer_reviews')
      .select('*')
      .limit(1);
    
    if (beerError) {
      console.error('❌ Error accessing beer_reviews:', beerError.message);
    } else {
      console.log('✅ beer_reviews table exists');
      if (beerReviews.length > 0) {
        console.log('🔍 Current columns:', Object.keys(beerReviews[0]));
      }
    }
    
    // Check all records
    const { data: allReviews, error: allError } = await supabase
      .from('beer_reviews')
      .select('id, unique_feature, brewery_name, beer_name, created_at');
    
    if (!allError && allReviews) {
      console.log(`📈 Total records: ${allReviews.length}`);
      
      if (allReviews.length > 0) {
        console.log('\n🍺 Current beer reviews:');
        allReviews.forEach((review, index) => {
          console.log(`${index + 1}. ${review.brewery_name} - ${review.beer_name}`);
          console.log(`   ID: ${review.id}`);
          console.log(`   Unique Feature: ${review.unique_feature || 'None'}`);
          console.log(`   Created: ${review.created_at}\n`);
        });
      }
    }
    
    // Check other tables
    const tables = ['blog_posts', 'social_posts', 'content_schedule'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`⚠️  Table '${table}': ${error.message}`);
      } else {
        console.log(`✅ Table '${table}' exists${data.length > 0 ? ` with ${data.length} sample record` : ' (empty)'}`);
        if (data.length > 0) {
          console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
  }
}

checkCurrentSchema().then(() => {
  console.log('✨ Schema check completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Error:', error);
  process.exit(1);
});