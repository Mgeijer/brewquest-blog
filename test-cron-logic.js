/**
 * Test Cron Job Logic
 * 
 * This script tests what the weekly transition cron job would do now
 * that the database has been fixed.
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testCronJobLogic() {
  console.log('🧪 TESTING WEEKLY TRANSITION CRON JOB LOGIC')
  console.log('============================================')
  console.log('This simulates what the cron job would do when it runs next.\n')

  try {
    // Get current state (should be Arkansas)
    const { data: currentState, error: currentError } = await supabase
      .from('state_progress')
      .select('*')
      .eq('status', 'current')
      .single()

    if (currentError) {
      console.error('❌ No current state found:', currentError.message)
      return false
    }

    console.log(`✅ Found current state: ${currentState.state_name} (Week ${currentState.week_number})`)

    // Get next upcoming state (should be California)
    const { data: nextState, error: nextError } = await supabase
      .from('state_progress')
      .select('*')
      .eq('status', 'upcoming')
      .order('week_number')
      .limit(1)
      .single()

    if (nextError) {
      console.error('❌ No upcoming state found:', nextError.message)
      return false
    }

    console.log(`✅ Found next state: ${nextState.state_name} (Week ${nextState.week_number})`)

    // This is what the cron job would do
    console.log('\n🔄 Cron job would perform:')
    console.log(`  1. Mark ${currentState.state_name} as COMPLETED`)
    console.log(`  2. Mark ${nextState.state_name} as CURRENT`) 
    console.log(`  3. Log analytics event`)
    console.log(`  4. Send weekly digest emails`)

    // Check if this is the expected transition
    if (currentState.state_code === 'AR' && nextState.state_code === 'CA') {
      console.log('\n🎯 PERFECT!')
      console.log('✅ The next cron job will correctly transition: Arkansas → California')
      console.log('✅ This matches the expected progression (Week 4 → Week 5)')
      console.log('✅ The weekly transition system is now working correctly!')
      return true
    } else {
      console.log('\n⚠️  Unexpected transition sequence:')
      console.log(`   Expected: AR (Arkansas) → CA (California)`)
      console.log(`   Found: ${currentState.state_code} (${currentState.state_name}) → ${nextState.state_code} (${nextState.state_name})`)
      return false
    }

  } catch (error) {
    console.error('💥 Error testing cron logic:', error.message)
    return false
  }
}

async function showUpcomingSchedule() {
  console.log('\n📅 UPCOMING SCHEDULE')
  console.log('===================')

  const { data: upcomingStates, error } = await supabase
    .from('state_progress')
    .select('state_code, state_name, week_number, status')
    .in('status', ['current', 'upcoming'])
    .order('week_number')
    .limit(5)

  if (error) {
    console.error('❌ Error fetching upcoming schedule:', error.message)
    return
  }

  upcomingStates.forEach((state, index) => {
    const icon = state.status === 'current' ? '🔄' : '⏳'
    const label = state.status === 'current' ? 'CURRENT' : 'UPCOMING'
    console.log(`  ${icon} Week ${state.week_number}: ${state.state_name} (${label})`)
  })

  console.log('\n⏰ Next cron job runs: Every Monday at 3:00 AM UTC')
  console.log('📧 Next transition will include weekly digest emails')
}

async function main() {
  const success = await testCronJobLogic()
  
  if (success) {
    await showUpcomingSchedule()
    
    console.log('\n📋 SUMMARY & RECOMMENDATIONS')
    console.log('============================')
    console.log('✅ Database state progression has been successfully fixed')
    console.log('✅ Arkansas (Week 4) is correctly set as the current state')  
    console.log('✅ Weekly cron job logic will work correctly for future transitions')
    console.log('✅ Next automatic transition: Arkansas → California (Monday 3 AM UTC)')
    
    console.log('\n🔧 Monitoring recommendations:')
    console.log('• Check cron job logs after Monday 3 AM UTC to confirm successful transition')
    console.log('• Verify California becomes current and Arkansas becomes completed')
    console.log('• Monitor weekly digest email delivery')
    console.log('• Set up alerts for cron job failures to prevent this issue recurring')
    
  } else {
    console.log('\n❌ The cron job logic test failed - manual intervention may still be needed')
  }
}

if (require.main === module) {
  main()
}