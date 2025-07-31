import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function finalStateCheck() {
  console.log('🔍 FINAL STATE CHECK - Are all 50 states populated?')
  console.log('=' .repeat(60))

  try {
    // Get all states from state_progress
    const { data: states, error } = await supabase
      .from('state_progress')
      .select('state_code, state_name, status, week_number')
      .order('week_number')

    if (error) {
      console.log(`❌ Error: ${error.message}`)
      return
    }

    console.log(`Total states found: ${states?.length || 0}`)
    
    if (states && states.length > 0) {
      console.log('\nAll states in database:')
      states.forEach(state => {
        const statusIcon = state.status === 'current' ? '🔸' : 
                          state.status === 'completed' ? '✅' : '⏳'
        console.log(`${statusIcon} Week ${state.week_number}: ${state.state_name} (${state.state_code}) - ${state.status}`)
      })

      // Check if we have all 50 states
      if (states.length === 50) {
        console.log('\n✅ All 50 states are populated in the database!')
      } else {
        console.log(`\n⚠️  Missing states: Expected 50, found ${states.length}`)
      }

      // Status breakdown
      const statusCounts = {}
      states.forEach(state => {
        const status = state.status || 'unknown'
        if (!statusCounts[status]) statusCounts[status] = 0
        statusCounts[status]++
      })

      console.log('\nStatus breakdown:')
      Object.entries(statusCounts).forEach(([status, count]) => {
        const icon = status === 'current' ? '🔸' : 
                    status === 'completed' ? '✅' : 
                    status === 'upcoming' ? '⏳' : '❓'
        console.log(`${icon} ${status}: ${count} states`)
      })

    } else {
      console.log('❌ No states found in database')
    }

  } catch (err) {
    console.log(`❌ Error: ${err.message}`)
  }
}

finalStateCheck()