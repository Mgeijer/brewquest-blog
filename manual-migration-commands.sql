-- Add missing columns to beer_reviews table
ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS state_code VARCHAR(2);
ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS state_name VARCHAR(50);
ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS week_number INTEGER;
ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS ibu INTEGER;
ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing Alabama data
UPDATE beer_reviews SET 
            state_code = 'AL',
            state_name = 'Alabama',
            week_number = 1,
            ibu = 55,
            day_of_week = 1,
            description = 'Alabama''s #1 selling IPA for the last 10 years, this flagship brew showcases American hop character with citrus and pine notes.',
            updated_at = NOW()
            WHERE id = 'cef8ecb0-035f-4a19-98db-41514fc3ed35';
UPDATE beer_reviews SET 
            state_code = 'AL',
            state_name = 'Alabama',
            week_number = 1,
            ibu = 23,
            day_of_week = 2,
            description = 'Birmingham''s most notorious brew, this drinkable beer pairs perfectly with Alabama summer days and floating down the Cahaba River.',
            updated_at = NOW()
            WHERE id = 'b405ee88-a3b4-4d0d-8bcb-62f26712b837';
UPDATE beer_reviews SET 
            state_code = 'AL',
            state_name = 'Alabama',
            week_number = 1,
            ibu = 61,
            day_of_week = 3,
            description = 'Named after the indigenous word for Cahaba River meaning "the Water Above," this earthy IPA is dry-hopped for complexity.',
            updated_at = NOW()
            WHERE id = 'a9653d83-516f-42e8-88ee-c3f85439c389';
UPDATE beer_reviews SET 
            state_code = 'AL',
            state_name = 'Alabama',
            week_number = 1,
            ibu = 8,
            day_of_week = 4,
            description = 'A tropical passionfruit and raspberry Berliner Weisse that showcases Birmingham''s innovative brewing scene.',
            updated_at = NOW()
            WHERE id = 'efc82bfe-1831-4518-ba0a-15c957d03abf';
UPDATE beer_reviews SET 
            state_code = 'AL',
            state_name = 'Alabama',
            week_number = 1,
            ibu = 28,
            day_of_week = 5,
            description = 'A classic Belgian-style tripel brewed in Birmingham''s historic Avondale district with traditional techniques.',
            updated_at = NOW()
            WHERE id = 'a86991a4-a00c-4fd1-88b8-3b5d2e9c5571';
UPDATE beer_reviews SET 
            state_code = 'AL',
            state_name = 'Alabama',
            week_number = 1,
            ibu = 35,
            day_of_week = 6,
            description = 'A classic take on Irish stout with roasted barley character and subtle fruitiness from Irish yeast.',
            updated_at = NOW()
            WHERE id = 'af8f0366-b121-4105-b738-4c07195bd390';
UPDATE beer_reviews SET 
            state_code = 'AL',
            state_name = 'Alabama',
            week_number = 1,
            ibu = 45,
            day_of_week = 7,
            description = 'A rich imperial stout from the Atlanta-based brewery''s Birmingham location, showcasing complex roasted flavors.',
            updated_at = NOW()
            WHERE id = '3e917139-2c0a-4eaf-bbfb-d5e6b5a81a02';

-- Create content_schedule table
CREATE TABLE IF NOT EXISTS content_schedule (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        state_code VARCHAR(2) NOT NULL,
        week_number INTEGER NOT NULL,
        content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('state_post', 'beer_review')),
        content_id UUID,
        scheduled_date DATE NOT NULL,
        scheduled_time TIME NOT NULL,
        published_at TIMESTAMP WITH TIME ZONE,
        status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed', 'cancelled')),
        beer_day INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(state_code, week_number, content_type, beer_day)
      );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_week ON beer_reviews(state_code, week_number) WHERE state_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_beer_reviews_week_day ON beer_reviews(state_code, week_number, day_of_week) WHERE state_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_content_schedule_date ON content_schedule(scheduled_date, scheduled_time, status);