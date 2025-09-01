/**
 * Manual State Transitions Test
 * 
 * This script manually triggers the weekly transitions to catch up
 * the database to the correct state.
 */

const https = require('https')

const SERVER_URL = 'http://localhost:3002'

// Simulate the weekly transition cron job by making direct database updates
async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }

    const req = (urlObj.protocol === 'https:' ? https : require('http')).request(requestOptions, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data)
          resolve({ status: res.statusCode, data: jsonData })
        } catch (err) {
          resolve({ status: res.statusCode, data: data })
        }
      })
    })

    req.on('error', reject)
    
    if (options.body) {
      req.write(JSON.stringify(options.body))
    }
    
    req.end()
  })
}

async function getCurrentStates() {
  console.log('📊 Checking current database state...')
  
  const response = await makeRequest(`${SERVER_URL}/api/states/progress`)
  
  if (response.status !== 200) {
    console.error('❌ Failed to fetch states:', response.data)
    return []
  }
  
  const relevantStates = response.data.states
    .filter(s => ['AL', 'AK', 'AZ', 'AR', 'CA'].includes(s.state_code))
    .sort((a, b) => a.week_number - b.week_number)
  
  console.log('Current Database State:')
  relevantStates.forEach(state => {
    console.log(`  ${state.state_code} (${state.state_name}): Week ${state.week_number} - ${state.status.toUpperCase()}`)
  })
  
  return relevantStates
}

// Direct database update approach using raw SQL
async function executeDirectUpdate(stateCode, newStatus, completionDate = null) {
  console.log(`🔄 Attempting to update ${stateCode} to ${newStatus}...`)
  
  // We'll make a request to a hypothetical update endpoint
  // In a real scenario, we might need to create a simple admin endpoint
  
  try {
    // For now, let's just log what we would do
    console.log(`✅ Would update ${stateCode}: status = '${newStatus}'${completionDate ? ', completion_date = ' + completionDate : ''}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to update ${stateCode}:`, error.message)
    return false
  }
}

async function performManualFix() {
  console.log('🚨 MANUAL STATE PROGRESSION FIX')
  console.log('================================')
  
  const currentStates = await getCurrentStates()
  
  if (currentStates.length === 0) {
    console.error('❌ No states found')
    return
  }
  
  // Find current state
  const currentState = currentStates.find(s => s.status === 'current')
  
  if (!currentState) {
    console.error('❌ No current state found')
    return
  }
  
  console.log(`\n📍 Current state: ${currentState.state_code} (${currentState.state_name}) - Week ${currentState.week_number}`)
  
  // Determine what transitions need to happen
  const targetSequence = [
    { code: 'AL', week: 1, status: 'completed' },
    { code: 'AK', week: 2, status: 'completed' },  
    { code: 'AZ', week: 3, status: 'completed' },
    { code: 'AR', week: 4, status: 'current' }
  ]
  
  console.log('\n🎯 Target sequence:')
  targetSequence.forEach(t => {
    console.log(`  ${t.code}: Week ${t.week} - ${t.status.toUpperCase()}`)
  })
  
  // Check what needs to be updated
  const updates = []
  
  targetSequence.forEach(target => {
    const current = currentStates.find(s => s.state_code === target.code)
    if (current && current.status !== target.status) {
      updates.push({
        code: target.code,
        name: current.state_name,
        currentStatus: current.status,
        targetStatus: target.status
      })
    }
  })
  
  if (updates.length === 0) {
    console.log('\n✅ Database is already correctly configured!')
    return
  }
  
  console.log(`\n📝 Updates needed:`)
  updates.forEach(u => {
    console.log(`  ${u.code} (${u.name}): ${u.currentStatus} → ${u.targetStatus}`)
  })
  
  console.log('\n⚠️  This script identified the needed changes but cannot make them directly.')
  console.log('    You need to make these changes through the Supabase interface or admin API.')
  
  // Generate SQL commands
  console.log('\n📋 SQL Commands to run in Supabase:')
  updates.forEach(u => {
    const completionDate = u.targetStatus === 'completed' ? ", completion_date = now()" : ""
    console.log(`UPDATE state_progress SET status = '${u.targetStatus}'${completionDate}, updated_at = now() WHERE state_code = '${u.code}';`)
  })
  
  return updates
}

async function main() {
  try {
    await performManualFix()
  } catch (error) {
    console.error('💥 Unexpected error:', error.message)
  }
}

if (require.main === module) {
  main()
}