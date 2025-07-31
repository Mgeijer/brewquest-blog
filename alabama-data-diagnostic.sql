-- ==================================================
-- Alabama Data Diagnostic Script
-- ==================================================
-- This script checks the current state of Alabama data and identifies
-- if the blog_post_id field was accidentally removed during sync

-- Check current Alabama state progress record
SELECT 
  'state_progress' as table_name,
  state_code,
  state_name,
  status,
  week_number,
  blog_post_id,
  CASE 
    WHEN blog_post_id IS NOT NULL THEN 'HAS blog_post_id'
    ELSE 'MISSING blog_post_id' 
  END as blog_post_status,
  completion_date,
  featured_breweries,
  featured_beers_count,
  created_at,
  updated_at
FROM state_progress 
WHERE state_code = 'AL';

-- Check if there are any blog posts for Alabama
SELECT 
  'blog_posts' as table_name,
  id,
  title,
  slug,
  state,
  week_number,
  status,
  published_at,
  created_at,
  updated_at
FROM blog_posts 
WHERE state = 'AL' OR week_number = 1;

-- Check Alabama beer reviews
SELECT 
  'beer_reviews' as table_name,
  COUNT(*) as total_reviews,
  COUNT(DISTINCT brewery_name) as unique_breweries,
  blog_post_id,
  CASE 
    WHEN blog_post_id IS NOT NULL THEN 'HAS blog_post_id'
    ELSE 'MISSING blog_post_id' 
  END as blog_post_status,
  state_code,
  week_number,
  MIN(created_at) as earliest_created,
  MAX(updated_at) as latest_updated
FROM beer_reviews 
WHERE state_code = 'AL'
GROUP BY blog_post_id, state_code, week_number;

-- Check individual Alabama beer reviews
SELECT 
  'individual_beer_reviews' as table_name,
  day_of_week,
  beer_name,
  brewery_name,
  blog_post_id,
  CASE 
    WHEN blog_post_id IS NOT NULL THEN 'HAS blog_post_id'
    ELSE 'MISSING blog_post_id' 
  END as blog_post_status,
  created_at,
  updated_at
FROM beer_reviews 
WHERE state_code = 'AL'
ORDER BY day_of_week;

-- Check brewery features for Alabama
SELECT 
  'brewery_features' as table_name,
  brewery_name,
  state_code,
  featured_week,
  is_active,
  created_at,
  updated_at
FROM brewery_features 
WHERE state_code = 'AL';

-- Check journey milestones for Alabama
SELECT 
  'journey_milestones' as table_name,
  milestone_type,
  title,
  state_code,
  week_number,
  blog_post_id,
  CASE 
    WHEN blog_post_id IS NOT NULL THEN 'HAS blog_post_id'
    ELSE 'MISSING blog_post_id' 
  END as blog_post_status,
  created_at
FROM journey_milestones 
WHERE state_code = 'AL';

-- Check for foreign key constraints
SELECT 
  'foreign_key_check' as table_name,
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND (tc.table_name IN ('state_progress', 'beer_reviews', 'journey_milestones')
       OR ccu.table_name = 'blog_posts')
  AND tc.table_schema = 'public';

-- Summary analysis
SELECT 
  'summary_analysis' as table_name,
  'Alabama Data Integrity Check' as description,
  CASE 
    WHEN EXISTS (SELECT 1 FROM state_progress WHERE state_code = 'AL' AND blog_post_id IS NOT NULL) 
    THEN 'state_progress HAS blog_post_id' 
    ELSE 'state_progress MISSING blog_post_id' 
  END as state_progress_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM beer_reviews WHERE state_code = 'AL' AND blog_post_id IS NOT NULL) 
    THEN 'beer_reviews HAS blog_post_id' 
    ELSE 'beer_reviews MISSING blog_post_id' 
  END as beer_reviews_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM blog_posts WHERE state = 'AL' OR week_number = 1) 
    THEN 'blog_posts EXISTS for Alabama' 
    ELSE 'blog_posts NOT FOUND for Alabama' 
  END as blog_posts_status,
  (SELECT COUNT(*) FROM beer_reviews WHERE state_code = 'AL') as total_beer_reviews,
  (SELECT COUNT(DISTINCT brewery_name) FROM beer_reviews WHERE state_code = 'AL') as unique_breweries,
  NOW() as check_timestamp;