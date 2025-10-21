/**
 * Manual State Transition Script
 * Transitions from Colorado (Week 6) to Connecticut (Week 7)
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function transitionStates() {
  console.log('🔄 Starting manual state transition...')
  console.log('📍 Colorado (Week 6) → Connecticut (Week 7)\n')

  try {
    // First, check all states and their status
    const { data: allStates, error: allError } = await supabase
      .from('state_progress')
      .select('state_code, state_name, status, week_number')
      .in('week_number', [6, 7])
      .order('week_number')

    if (!allError && allStates) {
      console.log('📊 Current Status of Week 6 & 7:')
      allStates.forEach(state => {
        console.log(`   ${state.state_name} (Week ${state.week_number}): ${state.status}`)
      })
      console.log('')
    }

    // 1. Get current state (could be Colorado or already transitioned)
    const { data: currentState, error: currentError } = await supabase
      .from('state_progress')
      .select('*')
      .eq('status', 'current')
      .maybeSingle()

    if (!currentState) {
      // No current state - check if Connecticut is already active or if we need to fix the state
      console.log('⚠️  No current state found. Checking Connecticut...')

      const { data: ctState } = await supabase
        .from('state_progress')
        .select('*')
        .eq('state_code', 'CT')
        .single()

      if (ctState && ctState.status !== 'current') {
        console.log(`🔧 Fixing: Setting Connecticut as current...`)
        const { error: fixError } = await supabase
          .from('state_progress')
          .update({
            status: 'current',
            updated_at: new Date().toISOString()
          })
          .eq('state_code', 'CT')

        if (fixError) {
          console.error('❌ Failed to fix Connecticut status:', fixError)
          return
        }
        console.log('✅ Connecticut is now current!')
        return
      }

      console.error('❌ Could not determine state to transition')
      return
    }

    console.log(`✓ Current state: ${currentState.state_name} (${currentState.state_code}) - Week ${currentState.week_number}`)

    // 2. Get next upcoming state (Connecticut)
    const { data: nextState, error: nextError } = await supabase
      .from('state_progress')
      .select('*')
      .eq('status', 'upcoming')
      .order('week_number')
      .limit(1)
      .single()

    if (nextError || !nextState) {
      console.error('❌ No upcoming state found:', nextError)
      return
    }

    console.log(`✓ Next state: ${nextState.state_name} (${nextState.state_code}) - Week ${nextState.week_number}\n`)

    // 3. Mark current state as completed
    console.log(`⏳ Marking ${currentState.state_name} as completed...`)
    const { error: completeError } = await supabase
      .from('state_progress')
      .update({
        status: 'completed',
        completion_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', currentState.id)

    if (completeError) {
      console.error(`❌ Failed to complete ${currentState.state_name}:`, completeError)
      throw completeError
    }

    console.log(`✅ ${currentState.state_name} marked as completed\n`)

    // 4. Make next state current
    console.log(`⏳ Activating ${nextState.state_name} as current...`)
    const { error: activateError } = await supabase
      .from('state_progress')
      .update({
        status: 'current',
        updated_at: new Date().toISOString()
      })
      .eq('id', nextState.id)

    if (activateError) {
      console.error(`❌ Failed to activate ${nextState.state_name}:`, activateError)
      throw activateError
    }

    console.log(`✅ ${nextState.state_name} activated as current\n`)

    // 5. Log analytics event
    console.log('⏳ Logging transition analytics...')
    const { error: analyticsError } = await supabase
      .from('analytics_events')
      .insert({
        event_type: 'manual_state_transition',
        event_data: {
          from_state: currentState.state_name,
          to_state: nextState.state_name,
          from_week: currentState.week_number,
          to_week: nextState.week_number,
          transition_date: new Date().toISOString(),
          triggered_by: 'manual_script'
        },
        created_at: new Date().toISOString()
      })

    if (analyticsError) {
      console.warn('⚠️  Analytics logging failed (non-critical):', analyticsError.message)
    } else {
      console.log('✅ Analytics logged\n')
    }

    // 6. Verify transition
    console.log('🔍 Verifying transition...')
    const { data: verification, error: verifyError } = await supabase
      .from('state_progress')
      .select('state_code, state_name, status, week_number')
      .in('state_code', [currentState.state_code, nextState.state_code])

    if (!verifyError && verification) {
      console.log('\n📊 Current State Status:')
      verification.forEach(state => {
        console.log(`   ${state.state_name} (${state.state_code}): ${state.status} - Week ${state.week_number}`)
      })
    }

    console.log('\n🎉 State transition completed successfully!')
    console.log(`🚀 ${nextState.state_name} is now the current state (Week ${nextState.week_number})`)

  } catch (error) {
    console.error('\n❌ Fatal error during state transition:', error)
    process.exit(1)
  }
}

transitionStates()
