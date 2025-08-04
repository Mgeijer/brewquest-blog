#!/usr/bin/env node

/**
 * Supabase Security Audit
 * Check for tables without RLS enabled
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔍 Supabase Security Audit')
console.log('=========================')

async function securityAudit() {
  try {
    console.log('\n📊 Checking all public tables for RLS status...')
    
    // Get all tables in public schema and their RLS status
    const { data: tables, error } = await supabase.rpc('sql', {
      query: `
        SELECT 
          schemaname,
          tablename,
          rowsecurity as rls_enabled,
          (SELECT count(*) FROM information_schema.table_privileges 
           WHERE table_schema = schemaname 
           AND table_name = tablename 
           AND grantee = 'anon') as anon_privileges
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename;
      `
    })
    
    if (error) {
      console.log(`   ❌ Error checking tables: ${error.message}`)
      
      // Fallback: check individual tables we know exist
      const knownTables = [
        'beer_reviews', 'state_progress', 'blog_posts', 'brewery_features', 
        'state_analytics', 'newsletter_subscribers', 'social_posts', 'content_schedule'
      ]
      
      console.log('\n📋 Checking known tables individually...')
      
      for (const tableName of knownTables) {
        try {
          const { data, error: tableError } = await supabase
            .from(tableName)
            .select('*', { count: 'exact' })
            .limit(1)
          
          if (tableError) {
            console.log(`   ❌ ${tableName}: Error accessing (${tableError.message})`)
          } else {
            console.log(`   ✅ ${tableName}: Accessible`)
          }
        } catch (err) {
          console.log(`   ❌ ${tableName}: Exception (${err.message})`)
        }
      }
      
      return { success: false, error: error.message }
    }
    
    console.log('\n📋 RLS Status Report:')
    console.log('=====================')
    
    let vulnerableCount = 0
    let secureCount = 0
    
    tables.forEach(table => {
      const status = table.rls_enabled ? '🔒 SECURE' : '⚠️ VULNERABLE'
      const anonAccess = table.anon_privileges > 0 ? ' (ANON ACCESS)' : ''
      
      console.log(`   ${status}: ${table.tablename}${anonAccess}`)
      
      if (table.rls_enabled) {
        secureCount++
      } else {
        vulnerableCount++
      }
    })
    
    console.log('\n📊 Security Summary:')
    console.log(`   🔒 Secure tables (RLS enabled): ${secureCount}`)
    console.log(`   ⚠️ Vulnerable tables (RLS disabled): ${vulnerableCount}`)
    
    if (vulnerableCount > 0) {
      console.log('\n🚨 SECURITY RECOMMENDATIONS:')
      tables.forEach(table => {
        if (!table.rls_enabled) {
          console.log(`   ⚠️ Enable RLS on table: ${table.tablename}`)
          console.log(`      ALTER TABLE public.${table.tablename} ENABLE ROW LEVEL SECURITY;`)
        }
      })
    } else {
      console.log('\n🎉 All public tables have RLS enabled!')
    }
    
    return { 
      success: true, 
      secure: secureCount, 
      vulnerable: vulnerableCount,
      tables: tables
    }
    
  } catch (error) {
    console.error('❌ Security audit failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Execute if called directly
if (require.main === module) {
  securityAudit()
    .then(result => {
      if (result.success) {
        if (result.vulnerable === 0) {
          console.log('\n🎉 SECURITY AUDIT PASSED!')
          console.log('✅ All tables are properly secured with RLS.')
        } else {
          console.log('\n⚠️ SECURITY ISSUES FOUND!')
          console.log(`❌ ${result.vulnerable} tables need RLS enabled.`)
        }
      } else {
        console.log('\n💥 Security audit failed:', result.error)
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
    })
}

module.exports = { securityAudit }