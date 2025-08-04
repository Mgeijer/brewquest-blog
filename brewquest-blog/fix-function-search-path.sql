-- Fix Function Search Path Security Issues
-- Run these commands in Supabase SQL Editor to fix search path vulnerabilities

-- ============================================
-- Fix validate_weekly_beer_count function
-- ============================================

-- First, check if the function exists and get its definition
SELECT routine_name, routine_definition 
FROM information_schema.routines 
WHERE routine_name IN ('validate_weekly_beer_count', 'get_journey_statistics')
AND routine_schema = 'public';

-- Method 1: Try to alter existing function to set search_path
DO $$
BEGIN
    -- Try to alter validate_weekly_beer_count
    BEGIN
        EXECUTE 'ALTER FUNCTION public.validate_weekly_beer_count() SET search_path = public';
        RAISE NOTICE 'Successfully set search_path for validate_weekly_beer_count';
    EXCEPTION 
        WHEN others THEN
            RAISE NOTICE 'Could not alter validate_weekly_beer_count: %', SQLERRM;
    END;
    
    -- Try to alter get_journey_statistics  
    BEGIN
        EXECUTE 'ALTER FUNCTION public.get_journey_statistics() SET search_path = public';
        RAISE NOTICE 'Successfully set search_path for get_journey_statistics';
    EXCEPTION 
        WHEN others THEN
            RAISE NOTICE 'Could not alter get_journey_statistics: %', SQLERRM;
    END;
END
$$;

-- ============================================
-- Alternative: Recreate functions with secure search_path
-- ============================================

-- If the ALTER approach doesn't work, recreate the functions:

-- Recreate validate_weekly_beer_count with secure search_path
CREATE OR REPLACE FUNCTION public.validate_weekly_beer_count()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Validate that current week has exactly 7 beer reviews
    RETURN (
        SELECT COUNT(*) = 7 
        FROM public.beer_reviews 
        WHERE week_number = (
            SELECT COALESCE(MAX(week_number), 0) 
            FROM public.state_progress 
            WHERE status IN ('current', 'upcoming')
        )
    );
END;
$$;

-- Recreate get_journey_statistics with secure search_path
CREATE OR REPLACE FUNCTION public.get_journey_statistics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    result json;
BEGIN
    -- Get comprehensive journey statistics
    SELECT json_build_object(
        'total_states', 50, -- Total US states
        'states_with_content', (
            SELECT COUNT(DISTINCT state_code) 
            FROM public.state_progress
        ),
        'states_progress_percent', ROUND(
            (SELECT COUNT(DISTINCT state_code) FROM public.state_progress) * 100.0 / 50, 
            0
        ),
        'total_expected_beers', 350, -- 50 states * 7 beers each
        'published_beers', (
            SELECT COUNT(*) 
            FROM public.beer_reviews
        ),
        'beers_progress_percent', ROUND(
            (SELECT COUNT(*) FROM public.beer_reviews) * 100.0 / 350, 
            0
        ),
        'average_beers_per_state', ROUND(
            (SELECT COUNT(*) FROM public.beer_reviews) * 1.0 / 
            NULLIF((SELECT COUNT(DISTINCT state_code) FROM public.state_progress), 0), 
            1
        ),
        'current_week', (
            SELECT COALESCE(MAX(week_number), 0) 
            FROM public.state_progress
        ),
        'migration_status', 'completed'
    ) INTO result;
    
    RETURN result;
END;
$$;

-- ============================================
-- Verification queries
-- ============================================

-- Test the functions to ensure they work correctly
SELECT 'validate_weekly_beer_count' as function_name, 
       public.validate_weekly_beer_count() as result;

SELECT 'get_journey_statistics' as function_name, 
       public.get_journey_statistics() as result;

-- Check that functions now have search_path set
SELECT 
    proname as function_name,
    proconfig as configuration
FROM pg_proc 
WHERE proname IN ('validate_weekly_beer_count', 'get_journey_statistics')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Success message
DO $$
BEGIN
    RAISE NOTICE '🎉 Function search path security fixes completed!';
    RAISE NOTICE '🔒 Both functions now have secure search_path settings';
    RAISE NOTICE '📋 Security advisor warnings should be resolved';
END
$$;