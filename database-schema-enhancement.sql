-- ===================================================================
-- BREWQUEST CHRONICLES DATABASE SCHEMA ENHANCEMENTS
-- ===================================================================
-- Enhances existing schema to support weekly state posts + daily beer reviews
-- publishing schedule with comprehensive image management

-- ===================================================================
-- SECTION 1: CONTENT STRUCTURE ENHANCEMENTS
-- ===================================================================

-- Add content type distinction to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_type VARCHAR(30) 
  CHECK (content_type IN ('state_overview', 'beer_review', 'brewery_spotlight', 'special_feature')) 
  DEFAULT 'state_overview';

-- Add post scheduling enhancements
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS publish_schedule VARCHAR(20) 
  CHECK (publish_schedule IN ('weekly_monday', 'daily_tuesday', 'daily_wednesday', 'daily_thursday', 'daily_friday', 'daily_saturday', 'daily_sunday')) 
  DEFAULT 'weekly_monday';

-- Add missing beer review fields from analysis
ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS state_code VARCHAR(2) NOT NULL DEFAULT 'AL';
ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS state_name VARCHAR(50) NOT NULL DEFAULT 'Alabama';
ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS week_number INTEGER NOT NULL DEFAULT 1;
ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS ibu INTEGER;
ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS brewery_website TEXT;
ALTER TABLE beer_reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ===================================================================
-- SECTION 2: IMAGE MANAGEMENT SYSTEM
-- ===================================================================

-- Comprehensive Image Storage Table
CREATE TABLE IF NOT EXISTS image_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255),
  file_path TEXT NOT NULL, -- Supabase Storage path
  public_url TEXT NOT NULL, -- CDN URL
  alt_text TEXT,
  caption TEXT,
  image_type VARCHAR(30) NOT NULL CHECK (image_type IN (
    'beer_bottle', 'beer_can', 'beer_glass', 'brewery_exterior', 
    'brewery_interior', 'brewery_logo', 'state_culture', 'hop_harrison',
    'social_media', 'blog_featured', 'blog_inline'
  )),
  content_category VARCHAR(30) NOT NULL CHECK (content_category IN (
    'blog_post', 'beer_review', 'social_media', 'brewery_profile', 
    'state_feature', 'brand_asset', 'stock_photo'
  )),
  state_code VARCHAR(2),
  week_number INTEGER,
  brewery_name VARCHAR(200),
  beer_name VARCHAR(200),
  file_size_bytes INTEGER,
  width_pixels INTEGER,
  height_pixels INTEGER,
  format VARCHAR(10) CHECK (format IN ('jpg', 'jpeg', 'png', 'webp', 'gif')),
  storage_bucket VARCHAR(50) DEFAULT 'brewquest-images',
  is_optimized BOOLEAN DEFAULT FALSE,
  optimization_settings JSONB DEFAULT '{}',
  usage_rights VARCHAR(100), -- License/rights information
  source_attribution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID, -- Admin user who uploaded
  metadata JSONB DEFAULT '{}' -- Additional metadata (camera info, editing notes, etc.)
);

-- Link images to content
CREATE TABLE IF NOT EXISTS content_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_asset_id UUID REFERENCES image_assets(id) ON DELETE CASCADE,
  content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('blog_post', 'beer_review', 'social_post', 'brewery_feature')),
  content_id UUID NOT NULL, -- References the content table
  image_role VARCHAR(30) NOT NULL CHECK (image_role IN (
    'featured_image', 'hero_image', 'gallery_image', 'inline_image', 
    'thumbnail', 'social_media', 'background', 'logo'
  )),
  display_order INTEGER DEFAULT 1,
  is_primary BOOLEAN DEFAULT FALSE,
  crop_settings JSONB DEFAULT '{}', -- For responsive cropping
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- SECTION 3: BREWERY DATA ENHANCEMENTS
-- ===================================================================

-- Ensure brewery websites are captured
ALTER TABLE brewery_features ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE brewery_features ADD COLUMN IF NOT EXISTS booking_url TEXT; -- For tours/reservations
ALTER TABLE brewery_features ADD COLUMN IF NOT EXISTS online_store_url TEXT;

-- Add comprehensive brewery contact information
ALTER TABLE brewery_features ADD COLUMN IF NOT EXISTS contact_info JSONB DEFAULT '{}'; -- Phone, email, hours
ALTER TABLE brewery_features ADD COLUMN IF NOT EXISTS location_coordinates POINT; -- Lat/lng for mapping
ALTER TABLE brewery_features ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

-- ===================================================================
-- SECTION 4: CONTENT WORKFLOW AND SCHEDULING
-- ===================================================================

-- Content Publishing Schedule Table
CREATE TABLE IF NOT EXISTS content_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code VARCHAR(2) NOT NULL,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 50),
  content_type VARCHAR(30) NOT NULL,
  planned_publish_date DATE NOT NULL,
  actual_publish_date DATE,
  status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'ready', 'published', 'delayed')),
  content_id UUID, -- References to actual content when created
  notes TEXT,
  assigned_to UUID, -- Content creator/editor
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(state_code, week_number, content_type)
);

-- Social Media Content Templates
CREATE TABLE IF NOT EXISTS social_media_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name VARCHAR(100) NOT NULL,
  platform VARCHAR(20) NOT NULL,
  post_type VARCHAR(30) NOT NULL,
  template_content TEXT NOT NULL,
  hashtag_sets JSONB DEFAULT '{}', -- Different hashtag combinations
  engagement_hooks TEXT[],
  character_limits JSONB DEFAULT '{}', -- Platform-specific limits
  image_requirements JSONB DEFAULT '{}', -- Size, format requirements
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- SECTION 5: PERFORMANCE INDEXES
-- ===================================================================

-- Enhanced indexes for new fields
CREATE INDEX IF NOT EXISTS idx_blog_posts_content_type ON blog_posts(content_type);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_schedule ON blog_posts(publish_schedule);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_code ON beer_reviews(state_code);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_week_number ON beer_reviews(week_number);
CREATE INDEX IF NOT EXISTS idx_beer_reviews_state_week ON beer_reviews(state_code, week_number);

-- Image asset indexes
CREATE INDEX IF NOT EXISTS idx_image_assets_type ON image_assets(image_type);
CREATE INDEX IF NOT EXISTS idx_image_assets_category ON image_assets(content_category);
CREATE INDEX IF NOT EXISTS idx_image_assets_state_week ON image_assets(state_code, week_number);
CREATE INDEX IF NOT EXISTS idx_image_assets_brewery ON image_assets(brewery_name);

-- Content images indexes
CREATE INDEX IF NOT EXISTS idx_content_images_content ON content_images(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_images_role ON content_images(image_role);
CREATE INDEX IF NOT EXISTS idx_content_images_primary ON content_images(is_primary) WHERE is_primary = TRUE;

-- Content schedule indexes
CREATE INDEX IF NOT EXISTS idx_content_schedule_state_week ON content_schedule(state_code, week_number);
CREATE INDEX IF NOT EXISTS idx_content_schedule_publish_date ON content_schedule(planned_publish_date);
CREATE INDEX IF NOT EXISTS idx_content_schedule_status ON content_schedule(status);

-- ===================================================================
-- SECTION 6: IMAGE MANAGEMENT FUNCTIONS
-- ===================================================================

-- Function to get all images for a beer review
CREATE OR REPLACE FUNCTION get_beer_review_images(review_id UUID)
RETURNS TABLE (
  image_url TEXT,
  alt_text TEXT,
  image_role VARCHAR(30),
  is_primary BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ia.public_url,
    ia.alt_text,
    ci.image_role,
    ci.is_primary
  FROM content_images ci
  JOIN image_assets ia ON ci.image_asset_id = ia.id
  WHERE ci.content_type = 'beer_review' 
    AND ci.content_id = review_id
  ORDER BY ci.display_order, ci.is_primary DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get weekly content overview
CREATE OR REPLACE FUNCTION get_weekly_content_status(target_week INTEGER)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'week_number', target_week,
    'state_info', (
      SELECT jsonb_build_object(
        'state_code', state_code,
        'state_name', state_name,
        'status', status
      )
      FROM state_progress 
      WHERE week_number = target_week
    ),
    'blog_post_status', (
      SELECT jsonb_build_object(
        'exists', COUNT(*) > 0,
        'published', COUNT(*) FILTER (WHERE status = 'published') > 0,
        'title', MAX(title)
      )
      FROM blog_posts 
      WHERE week_number = target_week
    ),
    'beer_reviews', (
      SELECT jsonb_build_object(
        'total_count', COUNT(*),
        'reviews', jsonb_agg(
          jsonb_build_object(
            'day', day_of_week,
            'brewery', brewery_name,
            'beer', beer_name,
            'has_image', image_url IS NOT NULL
          ) ORDER BY day_of_week
        )
      )
      FROM beer_reviews 
      WHERE week_number = target_week
    ),
    'social_posts', (
      SELECT jsonb_build_object(
        'total_scheduled', COUNT(*),
        'by_platform', jsonb_object_agg(platform, platform_count)
      )
      FROM (
        SELECT sp.platform, COUNT(*) as platform_count
        FROM social_posts sp
        JOIN beer_reviews br ON sp.beer_review_id = br.id
        WHERE br.week_number = target_week
        GROUP BY sp.platform
      ) platform_stats
    ),
    'images_summary', (
      SELECT jsonb_build_object(
        'total_images', COUNT(*),
        'by_type', jsonb_object_agg(image_type, type_count)
      )
      FROM (
        SELECT ia.image_type, COUNT(*) as type_count
        FROM image_assets ia
        WHERE ia.week_number = target_week
        GROUP BY ia.image_type
      ) image_stats
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to generate content schedule for a state
CREATE OR REPLACE FUNCTION generate_state_content_schedule(
  target_state_code VARCHAR(2),
  target_week INTEGER,
  start_date DATE
)
RETURNS VOID AS $$
DECLARE
  state_name_val VARCHAR(50);
BEGIN
  -- Get state name
  SELECT state_name INTO state_name_val 
  FROM state_progress 
  WHERE state_code = target_state_code;
  
  -- Insert weekly state overview post
  INSERT INTO content_schedule (
    state_code, week_number, content_type, 
    planned_publish_date, status
  ) VALUES (
    target_state_code, target_week, 'state_overview',
    start_date, 'planned'
  ) ON CONFLICT (state_code, week_number, content_type) DO NOTHING;
  
  -- Insert daily beer review schedule (6 days)
  FOR day_num IN 2..7 LOOP
    INSERT INTO content_schedule (
      state_code, week_number, content_type,
      planned_publish_date, status
    ) VALUES (
      target_state_code, target_week, 'beer_review',
      start_date + (day_num - 1), 'planned'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- SECTION 7: ENHANCED TRIGGERS
-- ===================================================================

-- Trigger for updated_at on beer_reviews
CREATE TRIGGER update_beer_reviews_updated_at 
  BEFORE UPDATE ON beer_reviews 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for updated_at on image_assets
CREATE TRIGGER update_image_assets_updated_at 
  BEFORE UPDATE ON image_assets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- SECTION 8: RLS POLICIES FOR NEW TABLES
-- ===================================================================

-- Enable RLS on new tables
ALTER TABLE image_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_templates ENABLE ROW LEVEL SECURITY;

-- Public read policies for published content images
CREATE POLICY "Public read published content images" ON image_assets
  FOR SELECT USING (
    content_category IN ('blog_post', 'beer_review', 'social_media') 
    OR image_type IN ('brewery_exterior', 'state_culture')
  );

CREATE POLICY "Public read content image links" ON content_images
  FOR SELECT USING (true);

-- Admin policies for content management
CREATE POLICY "Admin full access to image assets" ON image_assets
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'editor')
  );

CREATE POLICY "Admin full access to content images" ON content_images
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'editor')
  );

CREATE POLICY "Admin full access to content schedule" ON content_schedule
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'editor')
  );

-- ===================================================================
-- SECTION 9: SAMPLE DATA FOR TESTING
-- ===================================================================

-- Insert sample content schedule for Alabama (Week 1)
SELECT generate_state_content_schedule('AL', 1, '2024-01-01'::DATE);

-- Insert sample image asset
INSERT INTO image_assets (
  filename, file_path, public_url, alt_text, image_type, content_category,
  state_code, week_number, brewery_name, beer_name, format, file_size_bytes,
  width_pixels, height_pixels, usage_rights
) VALUES (
  'good-people-ipa-bottle.jpg',
  'beer-photos/alabama/good-people-ipa-bottle.jpg',
  'https://storage.supabase.co/v1/object/public/brewquest-images/beer-photos/alabama/good-people-ipa-bottle.jpg',
  'Good People Brewing IPA bottle on wooden table with Alabama brewery background',
  'beer_bottle',
  'beer_review',
  'AL',
  1,
  'Good People Brewing',
  'IPA',
  'jpg',
  245760,
  800,
  1200,
  'Stock photo licensed for commercial use'
) ON CONFLICT (filename) DO NOTHING;

-- ===================================================================
-- COMMENTS AND DOCUMENTATION
-- ===================================================================

COMMENT ON TABLE image_assets IS 'Centralized image storage for all blog content with CDN optimization';
COMMENT ON TABLE content_images IS 'Links images to specific content pieces with role definitions';
COMMENT ON TABLE content_schedule IS 'Manages publishing schedule for state-by-state content workflow';
COMMENT ON TABLE social_media_templates IS 'Reusable templates for consistent social media posting';

COMMENT ON FUNCTION get_beer_review_images(UUID) IS 'Returns all images associated with a specific beer review';
COMMENT ON FUNCTION get_weekly_content_status(INTEGER) IS 'Comprehensive status check for weekly content production';
COMMENT ON FUNCTION generate_state_content_schedule(VARCHAR, INTEGER, DATE) IS 'Creates content schedule for a state week';

-- Final success message
SELECT 'BrewQuest Chronicles Schema Enhancement Complete!' as message,
       'Added image management, content scheduling, and brewery data enhancements' as details;