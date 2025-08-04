-- Arizona Week 3 Migration Verification Queries
-- Run these in your Supabase SQL Editor to verify the migration was successful

-- =============================================================================
-- VERIFICATION STEP 1: Check Arizona Breweries
-- =============================================================================
SELECT 
  name,
  location,
  founded,
  website
FROM breweries 
WHERE location LIKE '%Arizona%'
ORDER BY founded;

-- Expected: 7 Arizona breweries
-- Four Peaks (1996), Oak Creek (1995), SanTan (2007), Dragoon (2012), Historic (2012), Arizona Wilderness (2013), Mother Road (2013)

-- =============================================================================
-- VERIFICATION STEP 2: Check Arizona Beers
-- =============================================================================
SELECT 
  br.name as brewery,
  b.name as beer,
  b.style,
  b.abv
FROM beers b 
JOIN breweries br ON b.brewery_id = br.id 
WHERE br.location LIKE '%Arizona%'
ORDER BY br.name;

-- Expected: 7 Arizona beers
-- Four Peaks Kilt Lifter, Arizona Wilderness Refuge IPA, Historic Piehole Porter, etc.

-- =============================================================================
-- VERIFICATION STEP 3: Check Arizona Beer Reviews (Week 3)
-- =============================================================================
SELECT 
  br.name as brewery,
  b.name as beer,
  rv.day_of_week,
  rv.review_date,
  rv.rating,
  LEFT(rv.review_text, 100) as review_preview
FROM beer_reviews rv
JOIN beers b ON rv.beer_id = b.id
JOIN breweries br ON b.brewery_id = br.id
WHERE rv.state = 'Arizona' AND rv.week_number = 3
ORDER BY rv.day_of_week;

-- Expected: 7 reviews, one for each day of Week 3 (August 11-17, 2025)

-- =============================================================================
-- VERIFICATION STEP 4: Check State Progress for Arizona Week 3
-- =============================================================================
SELECT 
  state_name,
  week_number,
  status,
  start_date,
  completion_date,
  breweries_featured,
  beers_reviewed,
  progress_percentage
FROM state_progress 
WHERE state_name = 'Arizona' AND week_number = 3;

-- Expected: 1 record showing Arizona Week 3 as ready_for_publication

-- =============================================================================
-- COMPREHENSIVE COUNT VERIFICATION
-- =============================================================================
SELECT 
  'Arizona Breweries' as category,
  COUNT(*) as count
FROM breweries 
WHERE location LIKE '%Arizona%'

UNION ALL

SELECT 
  'Arizona Beers' as category,
  COUNT(*) as count
FROM beers b 
JOIN breweries br ON b.brewery_id = br.id 
WHERE br.location LIKE '%Arizona%'

UNION ALL

SELECT 
  'Arizona Week 3 Reviews' as category,
  COUNT(*) as count
FROM beer_reviews 
WHERE state = 'Arizona' AND week_number = 3

UNION ALL

SELECT 
  'Arizona Week 3 State Progress' as category,
  COUNT(*) as count
FROM state_progress 
WHERE state_name = 'Arizona' AND week_number = 3;

-- Expected totals: 7, 7, 7, 1

-- =============================================================================
-- CONTENT VERIFICATION: Show Complete Arizona Week 3 Schedule
-- =============================================================================
SELECT 
  rv.day_of_week,
  CASE rv.day_of_week
    WHEN 1 THEN 'Monday'
    WHEN 2 THEN 'Tuesday' 
    WHEN 3 THEN 'Wednesday'
    WHEN 4 THEN 'Thursday'
    WHEN 5 THEN 'Friday'
    WHEN 6 THEN 'Saturday'
    WHEN 7 THEN 'Sunday'
  END as day_name,
  rv.review_date,
  br.name as brewery,
  b.name as beer,
  b.style,
  b.abv,
  rv.rating
FROM beer_reviews rv
JOIN beers b ON rv.beer_id = b.id
JOIN breweries br ON b.brewery_id = br.id
WHERE rv.state = 'Arizona' AND rv.week_number = 3
ORDER BY rv.day_of_week;

-- Expected: 7 days of reviews from August 11-17, 2025