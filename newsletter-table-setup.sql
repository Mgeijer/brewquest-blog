-- BrewQuest Chronicles Newsletter Subscribers Table Setup
-- Run this SQL in your Supabase SQL Editor

-- Drop existing table if it exists with wrong schema
DROP TABLE IF EXISTS newsletter_subscribers;

-- Create the newsletter_subscribers table with complete schema
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}',
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(100),
    state_interest VARCHAR(2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_is_active ON newsletter_subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON newsletter_subscribers(subscribed_at);

-- Enable Row Level Security (optional - for additional security)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows the service role to manage all records
CREATE POLICY "Service role can manage newsletter subscribers" ON newsletter_subscribers
    FOR ALL USING (auth.role() = 'service_role');

-- Create a policy for public read access if needed (optional)
-- CREATE POLICY "Public can read active subscribers count" ON newsletter_subscribers
--     FOR SELECT USING (is_active = true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_newsletter_subscribers_updated_at
    BEFORE UPDATE ON newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created correctly
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'newsletter_subscribers' 
ORDER BY ordinal_position;