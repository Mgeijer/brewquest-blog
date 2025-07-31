# BrewQuest Chronicles Database Troubleshooting Guide

## Common Error: "column 'status' does not exist"

This error occurs when there are existing tables in your database that don't match the expected schema. Here's how to fix it:

### Step 1: Diagnose the Issue

Run the diagnostic script first to see what's in your current database:

```sql
-- Copy and paste the contents of SCHEMA_DIAGNOSTIC.sql into your Supabase SQL Editor
```

This will show you:
- Which tables exist
- What columns each table has
- Which columns are missing

### Step 2: Safe Migration

If the diagnostic shows missing columns or schema mismatches, run:

```sql
-- Copy and paste the contents of SAFE_DATABASE_MIGRATION.sql into your Supabase SQL Editor
```

This script will:
- ✅ Safely add missing columns without losing data
- ✅ Create tables that don't exist
- ✅ Apply constraints and indexes
- ✅ Set up Row Level Security policies
- ✅ Handle all edge cases

### Step 3: Run the Main Setup

After the migration completes successfully, you can run:

```sql
-- Copy and paste the contents of MANUAL_DATABASE_SETUP.sql into your Supabase SQL Editor
```

The updated setup script now includes a pre-flight check that will warn you if there are still schema issues.

## Alternative: Fresh Start

If you prefer a completely fresh database (THIS WILL DELETE ALL DATA):

```sql
-- WARNING: This will delete ALL data in these tables
DROP TABLE IF EXISTS journey_milestones CASCADE;
DROP TABLE IF EXISTS brewery_features CASCADE;
DROP TABLE IF EXISTS state_analytics CASCADE;
DROP TABLE IF EXISTS beer_reviews CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS state_progress CASCADE;

-- Then run MANUAL_DATABASE_SETUP.sql
```

## Common Issues and Solutions

### Issue: "relation already exists"
**Solution**: This is normal with `CREATE TABLE IF NOT EXISTS`. The script will continue.

### Issue: "column already exists"
**Solution**: Use the SAFE_DATABASE_MIGRATION.sql script which checks before adding columns.

### Issue: "constraint violation"
**Solution**: The migration script handles this by adding default values for NOT NULL constraints.

### Issue: "foreign key constraint fails"
**Solution**: The migration script creates tables in the correct order to handle dependencies.

## Verification Steps

After running the scripts, verify everything worked:

```sql
-- Check that all tables exist with correct columns
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('blog_posts', 'beer_reviews', 'state_progress', 'state_analytics', 'brewery_features', 'journey_milestones')
ORDER BY table_name, ordinal_position;

-- Check that sample data was inserted
SELECT state_code, state_name, status FROM state_progress WHERE state_code = 'AL';
SELECT count(*) as beer_count FROM beer_reviews WHERE state_code = 'AL';
```

## Files Summary

1. **SCHEMA_DIAGNOSTIC.sql** - Checks your current database structure
2. **SAFE_DATABASE_MIGRATION.sql** - Safely upgrades existing schemas
3. **MANUAL_DATABASE_SETUP.sql** - Main setup with sample data (updated with pre-flight checks)
4. **DATABASE_TROUBLESHOOTING.md** - This guide

## Still Having Issues?

If you continue to have problems:

1. Make sure you're running the scripts in your Supabase project's SQL Editor
2. Check that you have the necessary permissions
3. Try the "Fresh Start" approach if data loss is acceptable
4. Verify your Supabase project is active and not paused

The migration scripts are designed to be idempotent - you can run them multiple times safely.