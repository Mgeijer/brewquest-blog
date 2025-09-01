/**
 * Simulate Weekly Transitions
 * 
 * This script simulates multiple weekly transitions to catch up the database
 * to the correct state progression.
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Use service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function getCurrentState() {
  const { data: currentState, error } = await supabase
    .from('state_progress')
    .select('*')
    .eq('status', 'current')
    .single()

  if (error) {
    console.error('❌ Error fetching current state:', error.message)
    return null
  }
  
  return currentState
}

async function getNextUpcomingState() {
  const { data: nextState, error } = await supabase
    .from('state_progress')
    .select('*')
    .eq('status', 'upcoming')
    .order('week_number')
    .limit(1)
    .single()

  if (error) {
    console.error('❌ Error fetching next state:', error.message)
    return null
  }
  
  return nextState
}

async function performStateTransition(fromState, toState) {
  console.log(`🔄 Transitioning: ${fromState.state_name} (Week ${fromState.week_number}) → ${toState.state_name} (Week ${toState.week_number})`)
  
  try {
    // Mark current state as completed
    const { error: completeError } = await supabase
      .from('state_progress')
      .update({ 
        status: 'completed',
        completion_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', fromState.id)

    if (completeError) {
      console.error('❌ Failed to complete current state:', completeError.message)
      return false
    }

    console.log(`  ✅ Completed: ${fromState.state_name}`)

    // Make next state current
    const { error: activateError } = await supabase
      .from('state_progress')
      .update({ 
        status: 'current',
        updated_at: new Date().toISOString()
      })
      .eq('id', toState.id)

    if (activateError) {
      console.error('❌ Failed to activate next state:', activateError.message)
      return false
    }

    console.log(`  ✅ Activated: ${toState.state_name}`)

    // Log the transition
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'manual_weekly_transition',
        event_data: {
          from_state: fromState.state_name,
          to_state: toState.state_name,
          from_week: fromState.week_number,
          to_week: toState.week_number,
          transition_date: new Date().toISOString(),
          performed_by: 'Manual fix script'
        },
        created_at: new Date().toISOString()
      })

    return true
  } catch (error) {
    console.error('❌ Exception during transition:', error.message)
    return false
  }
}

async function performAllNeededTransitions() {
  console.log('🚀 Starting transition sequence to catch up to Arkansas (Week 4)...\n')
  
  let transitionsPerformed = 0
  const maxTransitions = 5 // Safety limit
  
  while (transitionsPerformed < maxTransitions) {
    const currentState = await getCurrentState()
    
    if (!currentState) {
      console.error('❌ No current state found!')
      break
    }
    
    console.log(`📍 Current state: ${currentState.state_name} (Week ${currentState.week_number})`)
    
    // Check if we've reached Arkansas (the target)
    if (currentState.state_code === 'AR') {
      console.log('🎯 SUCCESS: Arkansas is now the current state!')
      console.log('✅ Database has been caught up to the correct progression.')
      break
    }
    
    const nextState = await getNextUpcomingState()
    
    if (!nextState) {
      console.error('❌ No upcoming state found!')
      break
    }
    
    console.log(`🎯 Next state: ${nextState.state_name} (Week ${nextState.week_number})`)
    
    // Perform the transition
    const success = await performStateTransition(currentState, nextState)
    
    if (!success) {
      console.error('❌ Transition failed!')
      break
    }
    
    transitionsPerformed++
    console.log(`  ✅ Transition ${transitionsPerformed} completed\n`)
    
    // Small delay between transitions
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  return transitionsPerformed
}

async function verifyFinalState() {
  console.log('🔍 Verifying final state...')
  
  const { data: states, error } = await supabase
    .from('state_progress')
    .select('state_code, state_name, status, week_number')
    .in('state_code', ['AL', 'AK', 'AZ', 'AR', 'CA'])
    .order('week_number')

  if (error) {
    console.error('❌ Error verifying states:', error.message)
    return false
  }

  console.log('\nFinal Database State:')
  states.forEach(state => {
    const icon = state.status === 'completed' ? '✅' : state.status === 'current' ? '🔄' : '⏳'
    console.log(`  ${icon} ${state.state_code} (${state.state_name}): Week ${state.week_number} - ${state.status.toUpperCase()}`)
  })
  
  // Check if Arkansas is current
  const arkansasState = states.find(s => s.state_code === 'AR')
  return arkansasState && arkansasState.status === 'current'
}

async function main() {
  console.log('🚨 AUTOMATED STATE TRANSITION CATCH-UP')
  console.log('=====================================')
  console.log('This script will perform the weekly transitions that should have happened automatically.')
  console.log('Target: Make Arkansas (Week 4) the current state.\n')
  
  try {
    // Check environment variables
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables')
      console.error('Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
      return
    }
    
    // Perform all needed transitions
    const transitionsPerformed = await performAllNeededTransitions()
    
    if (transitionsPerformed === 0) {
      console.log('ℹ️  No transitions needed - already up to date')
      return
    }
    
    // Verify the result
    const success = await verifyFinalState()
    
    if (success) {
      console.log('\n🎉 SUCCESS!')
      console.log('✅ Arkansas is now the current state (Week 4)')
      console.log('✅ Database progression is synchronized')
      console.log('✅ Weekly cron job should now work correctly')
      console.log('\n📅 Next automatic transition: Arkansas → California (Week 5)')
    } else {
      console.log('\n⚠️  Partially successful - manual verification needed')
    }
    
  } catch (error) {
    console.error('\n💥 Unexpected error:', error.message)
  }
}

if (require.main === module) {
  main()
}