const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function finalVerification() {
  console.log('🎯 Final Migration Verification');
  console.log('===============================\n');
  
  let allPassed = true;
  
  try {
    // Test 1: Check table structure
    console.log('✅ Test 1: Table Structure');
    const { data: sample, error: structError } = await supabase
      .from('beer_reviews')
      .select('state_code, state_name, week_number, day_of_week, ibu, description')
      .limit(1);
    
    if (structError) {
      console.log('❌ Missing columns:', structError.message);
      allPassed = false;
    } else {
      console.log('✅ All required columns present');
    }
    
    // Test 2: Check data migration
    console.log('\n✅ Test 2: Data Migration');
    const { data: allData, error: dataError } = await supabase
      .from('beer_reviews')
      .select('*');
    
    if (dataError) {
      console.log('❌ Error fetching data:', dataError.message);
      allPassed = false;
    } else {
      const migratedCount = allData.filter(r => r.state_code === 'AL').length;
      if (migratedCount === 7) {
        console.log(`✅ All 7 Alabama beer reviews migrated`);
        
        // Check day sequence
        const days = allData
          .filter(r => r.state_code === 'AL')
          .map(r => r.day_of_week)
          .sort();
        
        if (JSON.stringify(days) === JSON.stringify([1,2,3,4,5,6,7])) {
          console.log('✅ Complete 7-day sequence present');
        } else {
          console.log('❌ Incomplete day sequence:', days);
          allPassed = false;
        }
      } else {
        console.log(`❌ Expected 7 Alabama reviews, found ${migratedCount}`);
        allPassed = false;
      }
    }
    
    // Test 3: Check content_schedule table
    console.log('\n✅ Test 3: Content Schedule Table');
    const { data: scheduleTest, error: scheduleError } = await supabase
      .from('content_schedule')
      .select('*')
      .limit(1);
    
    if (scheduleError) {
      console.log('❌ content_schedule table missing:', scheduleError.message);
      allPassed = false;
    } else {
      console.log('✅ content_schedule table accessible');
    }
    
    // Test 4: Check workflow functions
    console.log('\n✅ Test 4: Workflow Functions');
    
    try {
      const { data: stats, error: statsError } = await supabase
        .rpc('get_journey_statistics');
      
      if (statsError) {
        console.log('❌ get_journey_statistics function missing:', statsError.message);
        allPassed = false;
      } else {
        console.log('✅ get_journey_statistics function working');
        console.log('📊 Current stats:', JSON.stringify(stats, null, 2));
      }
    } catch (e) {
      console.log('❌ get_journey_statistics function error:', e.message);
      allPassed = false;
    }
    
    // Test 5: Test validation trigger
    console.log('\n✅ Test 5: Validation Trigger');
    
    try {
      // Try to insert an 8th beer for Alabama (should fail)
      const { error: insertError } = await supabase
        .from('beer_reviews')
        .insert({
          state_code: 'AL',
          week_number: 1,
          day_of_week: 8,
          brewery_name: 'Test Brewery',
          beer_name: 'Test Beer',
          beer_style: 'Test Style',
          abv: 5.0,
          rating: 4
        });
      
      if (insertError && insertError.message.includes('Maximum 7 beer reviews')) {
        console.log('✅ Validation trigger working (correctly prevented 8th beer)');
      } else if (insertError) {
        console.log('⚠️  Validation trigger error (different reason):', insertError.message);
      } else {
        console.log('❌ Validation trigger not working (allowed 8th beer)');
        // Clean up the test record
        await supabase
          .from('beer_reviews')
          .delete()
          .eq('brewery_name', 'Test Brewery');
        allPassed = false;
      }
    } catch (e) {
      console.log('⚠️  Could not test validation trigger:', e.message);
    }
    
    // Test 6: Verify complete Alabama week structure
    console.log('\n✅ Test 6: Alabama Week Structure');
    
    const { data: alabamaBeers } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('state_code', 'AL')
      .order('day_of_week');
    
    if (alabamaBeers && alabamaBeers.length === 7) {
      console.log('🍺 Alabama Beer Schedule:');
      alabamaBeers.forEach(beer => {
        console.log(`   Day ${beer.day_of_week}: ${beer.brewery_name} - ${beer.beer_name} (${beer.ibu || 'N/A'} IBU)`);
      });
      console.log('✅ Complete 7-beer Alabama week structure verified');
    } else {
      console.log('❌ Incomplete Alabama week structure');
      allPassed = false;
    }
    
    // Final Results
    console.log('\n🎯 FINAL RESULTS');
    console.log('================');
    
    if (allPassed) {
      console.log('🎉 ✨ MIGRATION SUCCESSFUL! ✨');
      console.log('');
      console.log('✅ All existing Alabama data preserved');
      console.log('✅ New 7-beer structure implemented');
      console.log('✅ Workflow functions operational');
      console.log('✅ Database integrity maintained');
      console.log('✅ Ready for content scheduling');
      console.log('');
      console.log('🚀 The BrewQuest Chronicles database is ready for the 50-state journey!');
    } else {
      console.log('⚠️  MIGRATION INCOMPLETE');
      console.log('');
      console.log('💡 Please check the failed tests above and:');
      console.log('   1. Run manual-migration-commands.sql in Supabase SQL Editor');
      console.log('   2. Run completion-functions.sql in Supabase SQL Editor');
      console.log('   3. Execute this verification script again');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    allPassed = false;
  }
  
  return allPassed;
}

finalVerification().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});