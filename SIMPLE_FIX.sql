-- ==================================================
-- Simple Fix for BrewQuest Chronicles Database
-- ==================================================
-- This adds only the missing columns that are causing errors
-- Safe to run on existing database with data

-- Add the missing 'status' column to beer_reviews if it doesn't exist
DO $$
BEGIN
    -- Check if status column exists in beer_reviews
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'beer_reviews' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE beer_reviews ADD COLUMN status VARCHAR(20) DEFAULT 'published';
        RAISE NOTICE 'Added status column to beer_reviews table';
    ELSE
        RAISE NOTICE 'Status column already exists in beer_reviews';
    END IF;
    
    -- Check if state_progress table exists, if not create it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'state_progress'
    ) THEN
        CREATE TABLE state_progress (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            state_code VARCHAR(2) UNIQUE NOT NULL,
            state_name VARCHAR(50) NOT NULL,
            status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'current', 'completed')),
            week_number INTEGER UNIQUE CHECK (week_number >= 1 AND week_number <= 50),
            blog_post_id UUID,
            completion_date TIMESTAMP WITH TIME ZONE,
            featured_breweries TEXT[],
            total_breweries INTEGER DEFAULT 0,
            featured_beers_count INTEGER DEFAULT 0,
            region VARCHAR(20) CHECK (region IN ('northeast', 'southeast', 'midwest', 'southwest', 'west')),
            description TEXT,
            journey_highlights TEXT[],
            difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
            research_hours INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created state_progress table';
        
        -- Insert Alabama as current state
        INSERT INTO state_progress (
            state_code, state_name, status, week_number, region, 
            total_breweries, featured_beers_count, description
        ) VALUES (
            'AL', 'Alabama', 'current', 1, 'southeast',
            45, 7, 'Alabama''s craft beer scene has quietly built one of the South''s most authentic and innovative brewing communities.'
        );
        RAISE NOTICE 'Added Alabama as current state';
        
    ELSE
        RAISE NOTICE 'state_progress table already exists';
    END IF;
    
    -- Enable RLS on tables if not already enabled
    ALTER TABLE beer_reviews ENABLE ROW LEVEL SECURITY;
    
    -- Create a simple read policy if it doesn't exist
    DROP POLICY IF EXISTS "Public read beer reviews" ON beer_reviews;
    CREATE POLICY "Public read beer reviews" ON beer_reviews FOR SELECT USING (true);
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'state_progress') THEN
        ALTER TABLE state_progress ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Public read state progress" ON state_progress;
        CREATE POLICY "Public read state progress" ON state_progress FOR SELECT USING (true);
    END IF;
    
    RAISE NOTICE '======================================';
    RAISE NOTICE 'SIMPLE FIX COMPLETE!';
    RAISE NOTICE '======================================';
    RAISE NOTICE 'Your existing beer_reviews data is preserved';
    RAISE NOTICE 'Missing columns and tables have been added';
    RAISE NOTICE 'Your blog should now work properly';
    RAISE NOTICE '======================================';
    
END $$;