-- ==================================================
-- Restore Alabama Blog Post Link Script
-- ==================================================
-- This script creates a blog post for Alabama and updates the 
-- state_progress and beer_reviews tables with the proper blog_post_id

-- Step 1: Create Alabama blog post if it doesn't exist
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  featured_image_url,
  state,
  week_number,
  read_time,
  published_at,
  seo_meta_description,
  seo_keywords,
  view_count,
  is_featured,
  status,
  created_at,
  updated_at
) VALUES (
  'Alabama: Heart of Dixie Beer Journey Begins',
  'alabama-craft-beer-journey-week-1',
  'Discover Alabama''s emerging craft beer scene as we kick off our 50-state beer journey with 7 exceptional brews from the Heart of Dixie.',
  '# Alabama: Heart of Dixie Beer Journey Begins

Welcome to the beginning of our incredible 50-state beer journey! We''re starting our adventure in Alabama, the Heart of Dixie, where a vibrant craft beer scene is emerging with southern charm and innovative brewing techniques.

## The Alabama Beer Scene

Alabama''s craft beer industry has experienced remarkable growth over the past decade. From Birmingham''s urban brewing scene to Huntsville''s tech-corridor craft culture, the state offers a diverse range of flavors and styles that reflect both southern tradition and modern innovation.

## This Week''s Featured Breweries

We''ve selected 7 exceptional beers from 7 different Alabama breweries, each representing a unique aspect of the state''s brewing culture:

- **Good People Brewing Company** - Birmingham''s flagship brewery
- **Yellowhammer Brewing** - Huntsville''s German-style specialists
- **Cahaba Brewing Company** - Earthy, indigenous-inspired ales
- **TrimTab Brewing Company** - Birmingham''s sour ale innovators
- **Avondale Brewing Company** - Traditional Belgian styles in the South
- **Back Forty Beer Company** - Gadsden''s hop-forward pioneers
- **Monday Night Brewing** - Atlanta-based with Birmingham presence

## Journey Highlights

- Explored Alabama''s flagship IPA tradition
- Discovered authentic German brewing techniques in Huntsville
- Found innovative sour beer scene in Birmingham
- Experienced traditional Belgian styles in the South
- Tasted aggressive hop-forward brewing culture

## What''s Next

Join us next week as we head north to Alaska, where we''ll explore brewing in America''s last frontier with glacier water and midnight sun innovation.

*Follow our journey as we explore all 50 states, one beer at a time!*',
  '/images/State Images/Alabama.png',
  'AL',
  1,
  8,
  NOW(),
  'Discover Alabama''s emerging craft beer scene as we kick off our 50-state beer journey with 7 exceptional brews from Birmingham, Huntsville, and beyond.',
  ARRAY['Alabama craft beer', 'Birmingham breweries', 'Huntsville beer', 'Good People Brewing', 'TrimTab Brewing', 'craft beer journey', 'Alabama beer scene', 'southern brewing'],
  0,
  true,
  'published'
) 
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Step 2: Get the blog post ID for Alabama
DO $$
DECLARE
  alabama_blog_post_id UUID;
BEGIN
  -- Get the Alabama blog post ID
  SELECT id INTO alabama_blog_post_id 
  FROM blog_posts 
  WHERE slug = 'alabama-craft-beer-journey-week-1' OR (state = 'AL' AND week_number = 1)
  LIMIT 1;
  
  IF alabama_blog_post_id IS NULL THEN
    RAISE EXCEPTION 'Could not find Alabama blog post after creation attempt';
  END IF;
  
  -- Step 3: Update state_progress with blog_post_id
  UPDATE state_progress 
  SET 
    blog_post_id = alabama_blog_post_id,
    updated_at = NOW()
  WHERE state_code = 'AL';
  
  -- Step 4: Update all Alabama beer_reviews with blog_post_id
  UPDATE beer_reviews 
  SET 
    blog_post_id = alabama_blog_post_id,
    updated_at = NOW()
  WHERE state_code = 'AL';
  
  -- Step 5: Update journey_milestones with blog_post_id
  UPDATE journey_milestones 
  SET 
    blog_post_id = alabama_blog_post_id
  WHERE state_code = 'AL';
  
  -- Verification and reporting
  RAISE NOTICE 'Alabama blog post restoration complete!';
  RAISE NOTICE 'Blog post ID: %', alabama_blog_post_id;
  RAISE NOTICE 'Updated state_progress: % rows', (SELECT COUNT(*) FROM state_progress WHERE state_code = 'AL' AND blog_post_id = alabama_blog_post_id);
  RAISE NOTICE 'Updated beer_reviews: % rows', (SELECT COUNT(*) FROM beer_reviews WHERE state_code = 'AL' AND blog_post_id = alabama_blog_post_id);
  RAISE NOTICE 'Updated journey_milestones: % rows', (SELECT COUNT(*) FROM journey_milestones WHERE state_code = 'AL' AND blog_post_id = alabama_blog_post_id);
  
END $$;

-- Step 6: Final verification query
SELECT 
  'final_verification' as table_name,
  bp.id as blog_post_id,
  bp.title,
  bp.slug,
  bp.state,
  bp.week_number,
  sp.state_code,
  sp.blog_post_id as state_progress_blog_post_id,
  (SELECT COUNT(*) FROM beer_reviews WHERE blog_post_id = bp.id) as linked_beer_reviews,
  (SELECT COUNT(*) FROM journey_milestones WHERE blog_post_id = bp.id) as linked_milestones
FROM blog_posts bp
LEFT JOIN state_progress sp ON bp.id = sp.blog_post_id
WHERE bp.state = 'AL' OR bp.week_number = 1;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Alabama blog post link restoration complete!';
  RAISE NOTICE 'The blog_post_id field has been restored for:';
  RAISE NOTICE '  - state_progress table';
  RAISE NOTICE '  - beer_reviews table';
  RAISE NOTICE '  - journey_milestones table';
  RAISE NOTICE 'All tables now properly reference the Alabama blog post.';
END $$;