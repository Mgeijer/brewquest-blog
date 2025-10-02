/**
 * MANUAL TEST: Weekly Transition Cron Job Endpoint
 * 
 * This script tests the actual cron job endpoint to ensure
 * it works correctly with the fixed database state.
 * 
 * WARNING: This will perform an actual transition if run!
 * Only run this if you want to immediately transition from
 * California (Week 5) to Colorado (Week 6).
 */

require('dotenv').config({ path: '.env.local' })

const CRON_SECRET = process.env.CRON_SECRET
const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function testCronEndpoint(performTransition = false) {
  console.log('🧪 TESTING WEEKLY TRANSITION CRON ENDPOINT')
  console.log('==========================================')
  console.log(`API URL: ${API_URL}`)
  console.log(`Perform actual transition: ${performTransition ? 'YES' : 'NO (dry-run)'}`)
  
  if (!CRON_SECRET) {
    console.error('❌ ERROR: CRON_SECRET environment variable not set')
    return false
  }

  if (!performTransition) {
    console.log('\n⚠️  DRY RUN MODE')
    console.log('This is a dry run - no actual transition will be performed.')
    console.log('Set performTransition=true to execute the actual transition.')
    console.log('\nTo perform the actual transition, run:')
    console.log('node test-cron-endpoint.js --execute')
    return true
  }

  console.log('\n🚨 EXECUTING ACTUAL TRANSITION')
  console.log('This will transition California → Colorado')
  
  try {
    const response = await fetch(`${API_URL}/api/cron/weekly-transition`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json'
      }
    })

    const result = await response.json()

    if (response.ok) {
      console.log('\n✅ CRON JOB EXECUTED SUCCESSFULLY!')
      console.log('================================')
      console.log(JSON.stringify(result, null, 2))
      
      console.log('\n📊 TRANSITION SUMMARY:')
      if (result.data && result.data.transition) {
        console.log(`   FROM: ${result.data.transition.from.state} (Week ${result.data.transition.from.week})`)
        console.log(`   TO: ${result.data.transition.to.state} (Week ${result.data.transition.to.week})`)
      }
      
      if (result.data && result.data.email_results) {
        console.log(`   EMAIL DIGEST: ${result.data.email_results.successful}/${result.data.email_results.total} sent`)
      }

      if (result.data && result.data.updates_performed) {
        console.log('\n📝 UPDATES PERFORMED:')
        result.data.updates_performed.forEach((update, index) => {
          console.log(`   ${index + 1}. ${update}`)
        })
      }

      return true
    } else {
      console.error('\n❌ CRON JOB FAILED!')
      console.error('==================')
      console.error(`Status: ${response.status}`)
      console.error(`Error: ${result.error}`)
      if (result.details) {
        console.error(`Details: ${result.details}`)
      }
      return false
    }

  } catch (error) {
    console.error('\n💥 NETWORK ERROR:', error.message)
    console.error('Is the development server running?')
    console.error('Try: npm run dev')
    return false
  }
}

// Check command line arguments
const performTransition = process.argv.includes('--execute') || process.argv.includes('--run')

if (require.main === module) {
  testCronEndpoint(performTransition)
    .then(success => {
      if (success) {
        console.log('\n🏆 TEST COMPLETED')
        process.exit(0)
      } else {
        console.log('\n💀 TEST FAILED')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('Script execution failed:', error)
      process.exit(1)
    })
}