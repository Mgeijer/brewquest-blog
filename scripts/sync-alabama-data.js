#!/usr/bin/env node

/**
 * Script to sync Alabama beer data from stateProgress.ts to Supabase database
 * This corrects the Alabama data with 7 beers from 7 unique breweries
 */

const path = require('path')
const { config } = require('dotenv')

// Load environment variables
const projectRoot = path.join(__dirname, '..')
config({ path: path.join(projectRoot, '.env.local') })

// We'll use a dynamic import for the TypeScript module
async function importSyncFunctions() {
  const module = await import('../src/lib/utils/syncAlabamaData.ts')
  return {
    syncAlabamaData: module.syncAlabamaData,
    verifyAlabamaData: module.verifyAlabamaData
  }
}

async function main() {
  console.log('🚀 Alabama Beer Data Sync Script')
  console.log('================================')
  
  try {
    // Import our sync functions
    const { syncAlabamaData, verifyAlabamaData } = await importSyncFunctions()
    
    // First, verify current state
    console.log('\n1. Verifying current Alabama data...')
    const verificationResult = await verifyAlabamaData()
    
    if (verificationResult.success) {
      console.log('✅ Alabama data is already correct!')  
      console.log('📊 Current state:', verificationResult.message)
      if (verificationResult.data) {
        console.log(`   - ${verificationResult.data.totalBeers} beers from ${verificationResult.data.uniqueBreweries} breweries`)
      }
      return
    } else {
      console.log('⚠️ Alabama data needs correction:', verificationResult.message)
      if (verificationResult.data) {
        console.log(`   - Current: ${verificationResult.data.totalBeers} beers from ${verificationResult.data.uniqueBreweries} breweries`)
        if (verificationResult.data.missingBreweries?.length > 0) {
          console.log(`   - Missing breweries: ${verificationResult.data.missingBreweries.join(', ')}`)
        }
        if (verificationResult.data.extraBreweries?.length > 0) {
          console.log(`   - Extra breweries: ${verificationResult.data.extraBreweries.join(', ')}`)
        }
      }
    }
    
    // Perform the sync
    console.log('\n2. Syncing Alabama data...')
    const syncResult = await syncAlabamaData()
    
    if (syncResult.success) {
      console.log('✅ Sync completed successfully!')
      console.log('📊 Results:', syncResult.message)
      
      if (syncResult.data) {
        console.log('\n📋 Alabama Beer Data Summary:')
        console.log(`   - Beers inserted: ${syncResult.data.beersInserted}`)
        console.log(`   - Unique breweries: ${syncResult.data.uniqueBreweries}`)
        console.log('\n🍺 Brewery List:')
        syncResult.data.breweries.forEach((brewery, index) => {
          console.log(`   ${index + 1}. ${brewery}`)
        })
        
        console.log('\n📅 Daily Schedule:')
        syncResult.data.beers.forEach(beer => {
          console.log(`   Day ${beer.day}: ${beer.name} (${beer.brewery}) - ${beer.style} ${beer.abv}% ABV`)
        })
      }
      
      // Final verification
      console.log('\n3. Final verification...')
      const finalVerification = await verifyAlabamaData()
      
      if (finalVerification.success) {
        console.log('✅ Final verification passed! Alabama data is now correct.')
      } else {
        console.error('❌ Final verification failed:', finalVerification.message)
        process.exit(1)
      }
      
    } else {
      console.error('❌ Sync failed:', syncResult.error)
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error.message)
    process.exit(1)
  }
  
  console.log('\n🎉 Alabama beer data sync completed successfully!')
}

// Run the script
main().catch(error => {
  console.error('❌ Unhandled error:', error)
  process.exit(1)
})