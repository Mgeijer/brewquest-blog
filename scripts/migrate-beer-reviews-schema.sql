-- Migration script to update beer_reviews table schema
-- This adds the missing fields needed for the BrewQuest Chronicles blog

-- Add missing columns to beer_reviews table
ALTER TABLE beer_reviews 
ADD COLUMN IF NOT EXISTS state_code VARCHAR(2),
ADD COLUMN IF NOT EXISTS state_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS week_number INTEGER,
ADD COLUMN IF NOT EXISTS ibu INTEGER,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_code ON beer_reviews(state_code);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_week_number ON beer_reviews(week_number);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_day_of_week ON beer_reviews(day_of_week);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_week ON beer_reviews(state_code, week_number);

-- Add constraints for data integrity
ALTER TABLE beer_reviews 
ADD CONSTRAINT IF NOT EXISTS chk_week_number CHECK (week_number >= 1 AND week_number <= 50);

ALTER TABLE beer_reviews 
ADD CONSTRAINT IF NOT EXISTS chk_day_of_week CHECK (day_of_week >= 1 AND day_of_week <= 7);

ALTER TABLE beer_reviews 
ADD CONSTRAINT IF NOT EXISTS chk_rating CHECK (rating >= 0 AND rating <= 5);

-- Update trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_beer_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_beer_reviews_updated_at ON beer_reviews;
CREATE TRIGGER trigger_beer_reviews_updated_at
    BEFORE UPDATE ON beer_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_beer_reviews_updated_at();

-- Comment for documentation
COMMENT ON TABLE beer_reviews IS 'Stores craft beer reviews for the 50-state BrewQuest Chronicles blog journey';
COMMENT ON COLUMN beer_reviews.state_code IS 'Two-letter state abbreviation (AL, AK, etc.)';
COMMENT ON COLUMN beer_reviews.week_number IS 'Week number in the 50-state journey (1-50)';
COMMENT ON COLUMN beer_reviews.day_of_week IS 'Day of the week for content scheduling (1-7)';
COMMENT ON COLUMN beer_reviews.ibu IS 'International Bitterness Units';
COMMENT ON COLUMN beer_reviews.description IS 'Detailed beer description and brewery context';
COMMENT ON COLUMN beer_reviews.updated_at IS 'Timestamp of last update, automatically maintained';