/**
 * Verify Current State Script
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyState() {
  const { data: allStates } = await supabase
    .from('state_progress')
    .select('state_code, state_name, status, week_number')
    .in('week_number', [6, 7])
    .order('week_number')

  console.log('Current database state:')
  allStates?.forEach(state => {
    console.log(`${state.state_name} (Week ${state.week_number}): ${state.status}`)
  })
}

verifyState()
