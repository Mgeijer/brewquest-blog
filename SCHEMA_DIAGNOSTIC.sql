-- ==================================================
-- BrewQuest Chronicles Schema Diagnostic Tool
-- ==================================================
-- Run this FIRST to check your current database schema
-- This will help identify what exists and what needs to be fixed

-- Check if tables exist and their column structures
DO $$
DECLARE
    table_rec RECORD;
    column_rec RECORD;
    table_exists boolean;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'BREWQUEST CHRONICLES SCHEMA DIAGNOSTIC';
    RAISE NOTICE '========================================';
    
    -- Check each expected table
    FOR table_rec IN 
        SELECT unnest(ARRAY['blog_posts', 'beer_reviews', 'state_progress', 'state_analytics', 'brewery_features', 'journey_milestones']) as table_name
    LOOP
        -- Check if table exists
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = table_rec.table_name
        ) INTO table_exists;
        
        IF table_exists THEN
            RAISE NOTICE 'TABLE: % - EXISTS', table_rec.table_name;
            
            -- Show all columns for this table
            FOR column_rec IN
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_schema = 'public' 
                AND table_name = table_rec.table_name
                ORDER BY ordinal_position
            LOOP
                RAISE NOTICE '  └─ %: % (nullable: %, default: %)', 
                    column_rec.column_name, 
                    column_rec.data_type, 
                    column_rec.is_nullable,
                    COALESCE(column_rec.column_default, 'none');
            END LOOP;
            
            RAISE NOTICE '';
        ELSE
            RAISE NOTICE 'TABLE: % - MISSING', table_rec.table_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'CHECKING FOR COMMON ISSUES';
    RAISE NOTICE '========================================';
    
    -- Check specifically for the status column issue
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_posts') THEN
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'blog_posts' 
            AND column_name = 'status'
        ) THEN
            RAISE NOTICE 'ISSUE FOUND: blog_posts table exists but missing "status" column';
        ELSE
            RAISE NOTICE 'OK: blog_posts.status column exists';
        END IF;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'state_progress') THEN
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'state_progress' 
            AND column_name = 'status'
        ) THEN
            RAISE NOTICE 'ISSUE FOUND: state_progress table exists but missing "status" column';
        ELSE
            RAISE NOTICE 'OK: state_progress.status column exists';
        END IF;
    END IF;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'DIAGNOSTIC COMPLETE';
    RAISE NOTICE 'If issues found, run SAFE_DATABASE_MIGRATION.sql';
    RAISE NOTICE '========================================';
END $$;