/**
 * Emergency Fix Script: Sync Database State Progression
 * 
 * This script manually fixes the state progression in the database to match
 * the expected progression sequence, catching up on missed weekly transitions.
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const TARGET_PROGRESSIONS = [
  { state_code: 'AL', state_name: 'Alabama', week: 1, status: 'completed' },
  { state_code: 'AK', state_name: 'Alaska', week: 2, status: 'completed' },
  { state_code: 'AZ', state_name: 'Arizona', week: 3, status: 'completed' },
  { state_code: 'AR', state_name: 'Arkansas', week: 4, status: 'current' },
  { state_code: 'CA', state_name: 'California', week: 5, status: 'upcoming' }
]

async function getCurrentDatabaseState() {
  console.log('📊 Checking current database state...')
  
  const { data: states, error } = await supabase
    .from('state_progress')
    .select('state_code, state_name, status, week_number')
    .in('state_code', ['AL', 'AK', 'AZ', 'AR', 'CA'])
    .order('week_number')
  
  if (error) {
    console.error('❌ Error fetching states:', error)
    return []
  }
  
  console.log('Current Database State:')
  states.forEach(state => {
    console.log(`  ${state.state_code} (${state.state_name}): Week ${state.week_number} - ${state.status.toUpperCase()}`)
  })
  
  return states
}

async function syncStateProgression() {
  console.log('\n🔧 Starting state progression sync...')
  
  const currentStates = await getCurrentDatabaseState()
  
  if (currentStates.length === 0) {
    console.error('❌ No states found in database')
    return false
  }
  
  // Find discrepancies
  const updates = []
  
  for (const target of TARGET_PROGRESSIONS) {
    const current = currentStates.find(s => s.state_code === target.state_code)
    
    if (!current) {
      console.log(`⚠️  State ${target.state_code} not found in database`)
      continue
    }
    
    if (current.status !== target.status) {
      console.log(`🔄 Need to update ${target.state_code}: ${current.status} → ${target.status}`)
      updates.push({
        state_code: target.state_code,
        current: current.status,
        target: target.status
      })
    }
  }
  
  if (updates.length === 0) {
    console.log('✅ Database is already in sync!')
    return true
  }
  
  // Apply updates
  console.log(`\n🚀 Applying ${updates.length} updates...`)
  
  for (const update of updates) {
    try {
      const updateData = { 
        status: update.target,
        updated_at: new Date().toISOString()
      }
      
      // If completing a state, add completion date
      if (update.target === 'completed' && update.current !== 'completed') {
        updateData.completion_date = new Date().toISOString()
      }
      
      // Note: start_date column doesn't exist in this schema
      
      const { error } = await supabase
        .from('state_progress')
        .update(updateData)
        .eq('state_code', update.state_code)
      
      if (error) {
        console.error(`❌ Failed to update ${update.state_code}:`, error.message)
      } else {
        console.log(`✅ Updated ${update.state_code}: ${update.current} → ${update.target}`)
      }
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (err) {
      console.error(`❌ Exception updating ${update.state_code}:`, err.message)
    }
  }
  
  return true
}

async function verifyResults() {
  console.log('\n🔍 Verifying results...')
  
  const updatedStates = await getCurrentDatabaseState()
  
  let allCorrect = true
  
  for (const target of TARGET_PROGRESSIONS) {
    const current = updatedStates.find(s => s.state_code === target.state_code)
    
    if (!current || current.status !== target.status) {
      console.log(`❌ ${target.state_code} is still incorrect: expected ${target.status}, got ${current?.status || 'not found'}`)
      allCorrect = false
    } else {
      console.log(`✅ ${target.state_code}: ${target.status} (correct)`)
    }
  }
  
  return allCorrect
}

async function logAnalyticsEvent() {
  console.log('\n📈 Logging fix event...')
  
  try {
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: 'manual_state_fix',
        event_data: {
          fix_reason: 'Weekly transition cron job was stuck - database out of sync with local data',
          fixed_by: 'Emergency fix script',
          states_updated: TARGET_PROGRESSIONS.map(t => `${t.state_code}:${t.status}`),
          timestamp: new Date().toISOString(),
          target_state: 'Arkansas (Week 4)',
          next_expected_transition: 'Arkansas → California (Week 5)'
        },
        created_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('❌ Failed to log analytics event:', error.message)
    } else {
      console.log('✅ Analytics event logged')
    }
  } catch (err) {
    console.error('❌ Exception logging analytics:', err.message)
  }
}

async function main() {
  console.log('🚨 EMERGENCY STATE PROGRESSION FIX')
  console.log('=====================================')
  console.log('This script will sync the database to match the expected state progression.')
  console.log('Target: Arkansas (Week 4) as current, with proper sequence leading up to it.\n')
  
  try {
    // Check environment variables
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables')
      console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set')
      return
    }
    
    // Perform the sync
    const success = await syncStateProgression()
    
    if (!success) {
      console.error('\n❌ Sync failed!')
      return
    }
    
    // Verify the results
    const verified = await verifyResults()
    
    if (verified) {
      console.log('\n🎉 SUCCESS: Database state progression has been fixed!')
      console.log('✅ Arkansas is now the current state (Week 4)')
      console.log('✅ Alabama, Alaska, Arizona are completed')
      console.log('✅ California is upcoming (Week 5)')
      
      await logAnalyticsEvent()
      
      console.log('\n📋 Next Steps:')
      console.log('1. The weekly cron job should now work correctly')
      console.log('2. Next transition: Arkansas → California (Week 5)')
      console.log('3. Monitor the cron job logs to ensure it runs successfully')
      
    } else {
      console.log('\n⚠️  Fix partially successful - some states may still need manual correction')
    }
    
  } catch (error) {
    console.error('\n💥 Unexpected error:', error.message)
    console.error('Stack trace:', error.stack)
  }
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { main, syncStateProgression, getCurrentDatabaseState }