-- ===================================================================
-- MIGRATION: UPDATE TO 7-BEER-PER-WEEK SCHEDULE
-- ===================================================================
-- Updates the database schema and content workflow to support:
-- - Monday: State post + Beer review #1
-- - Tuesday-Sunday: Beer reviews #2-7 (6 more beers)
-- - Total: 350 beer reviews (7 per week × 50 weeks)
-- - Social media: 28 posts per week (7 beers × 4 platforms)
-- ===================================================================

BEGIN;

-- Create backup of current data before migration
CREATE TABLE IF NOT EXISTS migration_backup_beer_reviews AS 
SELECT * FROM beer_reviews;

CREATE TABLE IF NOT EXISTS migration_backup_social_posts AS 
SELECT * FROM social_posts;

-- ===================================================================
-- SECTION 1: UPDATE BEER REVIEWS TABLE CONSTRAINTS
-- ===================================================================

-- Remove old constraint that limited day_of_week to 2-7
ALTER TABLE beer_reviews DROP CONSTRAINT IF EXISTS beer_reviews_day_of_week_check;

-- Add new constraint allowing day_of_week 1-7 (Monday through Sunday)
ALTER TABLE beer_reviews ADD CONSTRAINT beer_reviews_day_of_week_check 
CHECK (day_of_week >= 1 AND day_of_week <= 7);

-- Add comment explaining the new schedule
COMMENT ON COLUMN beer_reviews.day_of_week IS 'Day of week: 1=Monday (with state post), 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday, 7=Sunday';

-- ===================================================================
-- SECTION 2: UPDATE EXISTING DATA TO NEW SCHEDULE
-- ===================================================================

-- If there are existing beer reviews with old day_of_week values (2-7),
-- we need to update them to the new schedule (1-7)
-- This assumes the first beer review should be on Monday (day 1)

UPDATE beer_reviews 
SET day_of_week = day_of_week - 1
WHERE day_of_week BETWEEN 2 AND 7;

-- ===================================================================
-- SECTION 3: UPDATE CONTENT VALIDATION FUNCTIONS
-- ===================================================================

-- Update the content validation function to expect 7 beer reviews per week
CREATE OR REPLACE FUNCTION validate_weekly_content_completion(target_week INTEGER)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  beer_review_count INTEGER;
  blog_post_exists BOOLEAN;
  expected_reviews INTEGER := 7; -- Updated from 6 to 7
  social_posts_count INTEGER;
  expected_social_posts INTEGER := 28; -- 7 beers × 4 platforms
BEGIN
  -- Check beer reviews count
  SELECT COUNT(*) INTO beer_review_count
  FROM beer_reviews 
  WHERE week_number = target_week;
  
  -- Check if blog post exists
  SELECT EXISTS(
    SELECT 1 FROM blog_posts 
    WHERE week_number = target_week AND status IN ('published', 'draft')
  ) INTO blog_post_exists;
  
  -- Check social posts count
  SELECT COUNT(*) INTO social_posts_count
  FROM social_posts sp
  JOIN beer_reviews br ON sp.beer_review_id = br.id
  WHERE br.week_number = target_week;
  
  -- Build result
  SELECT jsonb_build_object(
    'week_number', target_week,
    'blog_post_exists', blog_post_exists,
    'beer_reviews', jsonb_build_object(
      'count', beer_review_count,
      'expected', expected_reviews,
      'complete', beer_review_count >= expected_reviews
    ),
    'social_posts', jsonb_build_object(
      'count', social_posts_count,
      'expected', expected_social_posts,
      'complete', social_posts_count >= expected_social_posts
    ),
    'overall_complete', (
      blog_post_exists AND 
      beer_review_count >= expected_reviews AND
      social_posts_count >= expected_social_posts
    ),
    'completion_percentage', ROUND(
      ((CASE WHEN blog_post_exists THEN 1 ELSE 0 END) +
       (LEAST(beer_review_count, expected_reviews)::NUMERIC / expected_reviews) +
       (LEAST(social_posts_count, expected_social_posts)::NUMERIC / expected_social_posts)) / 3 * 100, 2
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- SECTION 4: UPDATE ANALYTICS FUNCTIONS FOR NEW TOTALS
-- ===================================================================

-- Update journey statistics function for new totals
CREATE OR REPLACE FUNCTION get_journey_statistics_v2()
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
  total_expected_reviews INTEGER := 350; -- 50 weeks × 7 reviews
  total_expected_social_posts INTEGER := 1400; -- 350 reviews × 4 platforms
BEGIN
  SELECT jsonb_build_object(
    'total_states', COUNT(*),
    'completed_states', COUNT(*) FILTER (WHERE status = 'completed'),
    'current_week', get_current_journey_week(),
    'total_breweries', SUM(total_breweries),
    'total_research_hours', SUM(research_hours),
    'completion_percentage', ROUND((COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)) * 100, 2),
    'total_blog_posts', (SELECT COUNT(*) FROM blog_posts WHERE status = 'published'),
    'total_beer_reviews', (SELECT COUNT(*) FROM beer_reviews),
    'expected_beer_reviews', total_expected_reviews,
    'beer_review_progress', ROUND((SELECT COUNT(*)::NUMERIC FROM beer_reviews) / total_expected_reviews * 100, 2),
    'total_social_posts', (SELECT COUNT(*) FROM social_posts WHERE status = 'posted'),
    'expected_social_posts', total_expected_social_posts,
    'social_post_progress', ROUND((SELECT COUNT(*)::NUMERIC FROM social_posts WHERE status = 'posted') / total_expected_social_posts * 100, 2),
    'newsletter_subscribers', (SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = true),
    'weekly_schedule', jsonb_build_object(
      'monday', 'State post + Beer review #1',
      'tuesday_sunday', 'Beer reviews #2-7 (6 additional)',
      'total_per_week', jsonb_build_object(
        'state_posts', 1,
        'beer_reviews', 7,
        'social_posts', 28
      )
    ),
    'regions_stats', (
      SELECT jsonb_object_agg(
        region,
        jsonb_build_object(
          'total', COUNT(*),
          'completed', COUNT(*) FILTER (WHERE status = 'completed'),
          'percentage', ROUND((COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)) * 100, 2)
        )
      )
      FROM state_progress 
      GROUP BY region
    )
  ) INTO stats
  FROM state_progress;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- SECTION 5: UPDATE CONTENT PERFORMANCE FUNCTIONS
-- ===================================================================

-- Update content performance function for new metrics
CREATE OR REPLACE FUNCTION get_content_performance_v2(time_period_days INTEGER DEFAULT 30)
RETURNS JSONB AS $$
DECLARE
  performance JSONB;
  weeks_in_period NUMERIC;
BEGIN
  -- Calculate weeks in the time period
  weeks_in_period := time_period_days::NUMERIC / 7;
  
  SELECT jsonb_build_object(
    'blog_performance', (
      SELECT jsonb_build_object(
        'total_posts', COUNT(*),
        'total_views', SUM(view_count),
        'avg_views_per_post', ROUND(AVG(view_count), 2),
        'posts_per_week', ROUND(COUNT(*)::NUMERIC / weeks_in_period, 2),
        'most_viewed_post', (
          SELECT jsonb_build_object('title', title, 'views', view_count, 'state', state)
          FROM blog_posts 
          WHERE status = 'published' 
          ORDER BY view_count DESC 
          LIMIT 1
        )
      )
      FROM blog_posts 
      WHERE status = 'published' 
      AND published_at >= NOW() - (time_period_days || ' days')::INTERVAL
    ),
    'beer_review_performance', (
      SELECT jsonb_build_object(
        'total_reviews', COUNT(*),
        'reviews_per_week', ROUND(COUNT(*)::NUMERIC / weeks_in_period, 2),
        'expected_per_week', 7,
        'avg_rating', ROUND(AVG(rating), 2),
        'top_rated_beer', (
          SELECT jsonb_build_object(
            'beer_name', beer_name,
            'brewery_name', brewery_name,
            'rating', rating,
            'state_code', state_code
          )
          FROM beer_reviews 
          ORDER BY rating DESC, created_at DESC
          LIMIT 1
        ),
        'reviews_by_day', (
          SELECT jsonb_object_agg(
            CASE day_of_week 
              WHEN 1 THEN 'Monday'
              WHEN 2 THEN 'Tuesday'
              WHEN 3 THEN 'Wednesday'
              WHEN 4 THEN 'Thursday'
              WHEN 5 THEN 'Friday'
              WHEN 6 THEN 'Saturday'
              WHEN 7 THEN 'Sunday'
            END,
            COUNT(*)
          )
          FROM beer_reviews
          WHERE created_at >= NOW() - (time_period_days || ' days')::INTERVAL
          GROUP BY day_of_week
          ORDER BY day_of_week
        )
      )
      FROM beer_reviews
      WHERE created_at >= NOW() - (time_period_days || ' days')::INTERVAL
    ),
    'social_performance', (
      SELECT jsonb_build_object(
        'total_posts', COUNT(*),
        'posts_per_week', ROUND(COUNT(*)::NUMERIC / weeks_in_period, 2),
        'expected_per_week', 28,
        'posts_by_platform', (
          SELECT jsonb_object_agg(platform, COUNT(*))
          FROM social_posts 
          WHERE status = 'posted' 
          AND posted_at >= NOW() - (time_period_days || ' days')::INTERVAL
          GROUP BY platform
        ),
        'avg_engagement', (
          SELECT ROUND(AVG(
            COALESCE((engagement_metrics->>'likes')::int, 0) +
            COALESCE((engagement_metrics->>'shares')::int, 0) +
            COALESCE((engagement_metrics->>'comments')::int, 0)
          ), 2)
          FROM social_posts 
          WHERE status = 'posted' 
          AND posted_at >= NOW() - (time_period_days || ' days')::INTERVAL
        )
      )
      FROM social_posts 
      WHERE status = 'posted' 
      AND posted_at >= NOW() - (time_period_days || ' days')::INTERVAL
    ),
    'analytics_summary', (
      SELECT jsonb_build_object(
        'total_page_views', COUNT(*),
        'unique_sessions', COUNT(DISTINCT session_id),
        'avg_time_on_page', ROUND(AVG(time_on_page), 2),
        'mobile_percentage', ROUND(
          100.0 * COUNT(*) FILTER (WHERE device_type = 'mobile') / COUNT(*), 2
        ),
        'top_conversion_events', (
          SELECT jsonb_object_agg(conversion_event, COUNT(*))
          FROM page_analytics 
          WHERE conversion_event IS NOT NULL
          AND timestamp >= NOW() - (time_period_days || ' days')::INTERVAL
          GROUP BY conversion_event
          ORDER BY COUNT(*) DESC
          LIMIT 5
        )
      )
      FROM page_analytics 
      WHERE timestamp >= NOW() - (time_period_days || ' days')::INTERVAL
    ),
    'schedule_summary', jsonb_build_object(
      'current_schedule', 'Monday: State post + Beer #1, Tue-Sun: Beers #2-7',
      'total_content_per_week', jsonb_build_object(
        'state_posts', 1,
        'beer_reviews', 7,
        'social_posts', 28
      ),
      'project_totals', jsonb_build_object(
        'weeks', 50,
        'states', 50,
        'blog_posts', 50,
        'beer_reviews', 350,
        'social_posts', 1400
      )
    )
  ) INTO performance;
  
  RETURN performance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- SECTION 6: UPDATE MATERIALIZED VIEWS
-- ===================================================================

-- Drop and recreate weekly blog performance view with new metrics
DROP MATERIALIZED VIEW IF EXISTS weekly_blog_performance;

CREATE MATERIALIZED VIEW weekly_blog_performance AS
SELECT 
  bp.week_number,
  bp.state,
  bp.title,
  bp.view_count,
  COUNT(pa.id) as analytics_events,
  COUNT(DISTINCT pa.session_id) as unique_sessions,
  AVG(pa.time_on_page) as avg_time_on_page,
  COUNT(pa.id) FILTER (WHERE pa.conversion_event IS NOT NULL) as conversions,
  bp.published_at,
  -- Beer review metrics (now expecting 7 per week)
  (SELECT COUNT(*) FROM beer_reviews br WHERE br.week_number = bp.week_number) as beer_reviews_count,
  7 as expected_beer_reviews,
  ROUND((SELECT COUNT(*)::NUMERIC FROM beer_reviews br WHERE br.week_number = bp.week_number) / 7 * 100, 2) as beer_review_completion,
  -- Social media metrics (now expecting 28 per week)
  (SELECT COUNT(*) FROM social_posts sp 
   JOIN beer_reviews br ON sp.beer_review_id = br.id 
   WHERE br.week_number = bp.week_number) as social_posts_count,
  28 as expected_social_posts,
  ROUND((SELECT COUNT(*)::NUMERIC FROM social_posts sp 
         JOIN beer_reviews br ON sp.beer_review_id = br.id 
         WHERE br.week_number = bp.week_number) / 28 * 100, 2) as social_post_completion
FROM blog_posts bp
LEFT JOIN page_analytics pa ON bp.id = pa.blog_post_id
WHERE bp.status = 'published'
GROUP BY bp.id, bp.week_number, bp.state, bp.title, bp.view_count, bp.published_at
ORDER BY bp.week_number;

-- Create indexes for the updated materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_weekly_blog_performance_week_state_v2
ON weekly_blog_performance(week_number, state);

-- Update social media performance view
DROP MATERIALIZED VIEW IF EXISTS social_media_performance;

CREATE MATERIALIZED VIEW social_media_performance AS
SELECT 
  sp.platform,
  sp.post_type,
  sp.state_code,
  DATE_TRUNC('week', sp.posted_at) as week_starting,
  COUNT(*) as total_posts,
  COUNT(*) FILTER (WHERE sp.status = 'posted') as posted_count,
  AVG((sp.engagement_metrics->>'likes')::int) as avg_likes,
  AVG((sp.engagement_metrics->>'shares')::int) as avg_shares,
  AVG((sp.engagement_metrics->>'comments')::int) as avg_comments,
  MAX(sp.posted_at) as last_post,
  -- Calculate expected posts per week (7 beer reviews per platform)
  7 as expected_posts_per_week_per_platform,
  ROUND(COUNT(*) FILTER (WHERE sp.status = 'posted')::NUMERIC / 7 * 100, 2) as completion_percentage
FROM social_posts sp
WHERE sp.posted_at >= NOW() - INTERVAL '90 days'
GROUP BY sp.platform, sp.post_type, sp.state_code, DATE_TRUNC('week', sp.posted_at);

-- Create indexes for the updated social media performance view
CREATE INDEX IF NOT EXISTS idx_social_media_performance_platform_week 
ON social_media_performance(platform, week_starting);

-- ===================================================================
-- SECTION 7: UPDATE TRIGGER FUNCTIONS
-- ===================================================================

-- Update social post generation trigger to account for 7 beer reviews
CREATE OR REPLACE FUNCTION auto_generate_social_posts()
RETURNS TRIGGER AS $$
DECLARE
  platforms TEXT[] := ARRAY['instagram', 'twitter', 'facebook', 'tiktok'];
  platform TEXT;
  post_content TEXT;
  post_hashtags TEXT[];
BEGIN
  -- Only generate for beer reviews (not state overview posts)
  IF NEW.beer_name IS NOT NULL THEN
    FOREACH platform IN ARRAY platforms
    LOOP
      -- Generate platform-specific content
      post_content := CASE platform
        WHEN 'instagram' THEN 
          '🍺 Day ' || NEW.day_of_week || ' in ' || NEW.state_name || '!' || E'\n\n' ||
          NEW.beer_name || ' by ' || NEW.brewery_name || E'\n' ||
          'Rating: ' || NEW.rating || '/5 stars' || E'\n\n' ||
          NEW.unique_feature
        WHEN 'twitter' THEN
          '🍻 ' || NEW.beer_name || ' by ' || NEW.brewery_name || E'\n' ||
          'Rating: ' || NEW.rating || '/5' || E'\n\n' ||
          LEFT(NEW.unique_feature, 120) || '...'
        WHEN 'facebook' THEN
          'Discovering amazing craft beer in ' || NEW.state_name || '! 🍺' || E'\n\n' ||
          'Today''s feature: ' || NEW.beer_name || ' by ' || NEW.brewery_name || E'\n' ||
          'Rating: ' || NEW.rating || '/5 stars' || E'\n\n' ||
          NEW.unique_feature
        WHEN 'tiktok' THEN
          'Rating ' || NEW.beer_name || ' from ' || NEW.brewery_name || ' ✨' || E'\n' ||
          'Rating: ' || NEW.rating || '/5' || E'\n\n' ||
          NEW.unique_feature
      END;
      
      -- Generate hashtags
      post_hashtags := ARRAY[
        '#CraftBeer', 
        '#' || NEW.state_code || 'Beer', 
        '#BrewQuest', 
        '#HopHarrison',
        '#' || REPLACE(NEW.beer_style, ' ', '')
      ];
      
      -- Insert social post
      INSERT INTO social_posts (
        beer_review_id,
        state_code,
        platform,
        post_type,
        content,
        hashtags,
        status,
        scheduled_time
      ) VALUES (
        NEW.id,
        NEW.state_code,
        platform,
        'beer_review',
        post_content,
        post_hashtags,
        'draft',
        -- Schedule at optimal times based on platform and day
        (NEW.created_at::date + 
         CASE NEW.day_of_week 
           WHEN 1 THEN interval '0 days'  -- Monday
           WHEN 2 THEN interval '1 days'  -- Tuesday
           WHEN 3 THEN interval '2 days'  -- Wednesday
           WHEN 4 THEN interval '3 days'  -- Thursday
           WHEN 5 THEN interval '4 days'  -- Friday
           WHEN 6 THEN interval '5 days'  -- Saturday
           WHEN 7 THEN interval '6 days'  -- Sunday
         END +
         CASE platform
           WHEN 'instagram' THEN interval '11 hours'
           WHEN 'twitter' THEN interval '9 hours'
           WHEN 'facebook' THEN interval '13 hours'
           WHEN 'tiktok' THEN interval '18 hours'
         END)
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to beer_reviews table
DROP TRIGGER IF EXISTS auto_generate_social_posts_trigger ON beer_reviews;
CREATE TRIGGER auto_generate_social_posts_trigger
  AFTER INSERT ON beer_reviews
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_social_posts();

-- ===================================================================
-- SECTION 8: UPDATE COMMENTS AND DOCUMENTATION
-- ===================================================================

COMMENT ON TABLE beer_reviews IS 'Detailed beer reviews: 7 per week (Monday-Sunday), linked to blog posts. Monday beer review publishes alongside state overview post.';

COMMENT ON FUNCTION validate_weekly_content_completion(INTEGER) IS 'Validates weekly content completion: 1 state post + 7 beer reviews + 28 social posts (7×4 platforms)';

COMMENT ON FUNCTION get_journey_statistics_v2() IS 'Returns updated journey statistics for 7-beer-per-week schedule (350 total reviews, 1400 social posts)';

COMMENT ON FUNCTION get_content_performance_v2(INTEGER) IS 'Returns content performance metrics optimized for new publishing schedule';

-- ===================================================================
-- SECTION 9: REFRESH MATERIALIZED VIEWS
-- ===================================================================

-- Refresh all materialized views with new data
REFRESH MATERIALIZED VIEW weekly_blog_performance;
REFRESH MATERIALIZED VIEW social_media_performance;
REFRESH MATERIALIZED VIEW state_engagement_summary;

-- ===================================================================
-- SECTION 10: VALIDATION AND TESTING
-- ===================================================================

-- Test the updated functions
DO $$
DECLARE
  test_stats JSONB;
  test_performance JSONB;
  test_validation JSONB;
BEGIN
  -- Test journey statistics
  SELECT get_journey_statistics_v2() INTO test_stats;
  RAISE NOTICE 'Journey Statistics Test: %', test_stats->>'expected_beer_reviews';
  
  -- Test content performance
  SELECT get_content_performance_v2(7) INTO test_performance;
  RAISE NOTICE 'Content Performance Test: %', test_performance->'schedule_summary'->>'current_schedule';
  
  -- Test content validation for week 1
  SELECT validate_weekly_content_completion(1) INTO test_validation;
  RAISE NOTICE 'Validation Test: Expected reviews = %', test_validation->'beer_reviews'->>'expected';
  
  RAISE NOTICE 'Migration validation completed successfully!';
END;
$$;

-- ===================================================================
-- MIGRATION COMPLETION LOG
-- ===================================================================

-- Log the migration completion
INSERT INTO journey_milestones (
  milestone_type,
  title,
  description,
  milestone_date,
  metric_value,
  metric_unit,
  celebration_level,
  metadata
) VALUES (
  'technical_milestone',
  'Updated to 7-Beer-Per-Week Schedule',
  'Successfully migrated database and content workflow to support Monday state post + beer review, plus 6 additional daily beer reviews (Tuesday-Sunday). Total: 350 beer reviews and 1400 social posts across 50 weeks.',
  NOW(),
  7,
  'beers_per_week',
  'major',
  jsonb_build_object(
    'migration_date', NOW(),
    'previous_schedule', '6 beers per week (Tuesday-Sunday)',
    'new_schedule', '7 beers per week (Monday-Sunday)',
    'total_beer_reviews', 350,
    'total_social_posts', 1400,
    'key_changes', ARRAY[
      'Monday now includes both state post and beer review #1',
      'Beer reviews now span full week (Monday-Sunday)',
      'Social media posts increased to 28 per week',
      'Updated all validation and analytics functions'
    ]
  )
);

COMMIT;

-- Final success message
SELECT 
  'Migration Complete! Database updated for 7-beer-per-week schedule.' as status,
  'Monday: State post + Beer #1, Tuesday-Sunday: Beer reviews #2-7' as new_schedule,
  '350 total beer reviews expected (7 × 50 weeks)' as total_reviews,
  '1400 total social posts expected (350 × 4 platforms)' as total_social_posts;