-- ==================================================
-- Populate Alabama Beer Reviews Data
-- ==================================================
-- This script populates the Alabama beer reviews from the local state progress data

-- First, let's insert Alabama beer reviews
INSERT INTO beer_reviews (
  brewery_name,
  beer_name,
  beer_style,
  abv,
  ibu,
  rating,
  tasting_notes,
  description,
  day_of_week,
  state_code,
  state_name,
  week_number,
  image_url,
  created_at,
  updated_at
) VALUES 
  (
    'Good People Brewing Company',
    'Good People IPA',
    'American IPA',
    6.8,
    55,
    4.0,
    'Bright citrus aroma with grapefruit and orange peel, balanced malt backbone, clean bitter finish with subtle pine resin.',
    'Alabama''s #1 selling IPA for the last 10 years, this flagship brew showcases American hop character with citrus and pine notes.',
    1,
    'AL',
    'Alabama',
    1,
    '/images/Beer images/Alabama/Good People IPA.png',
    NOW(),
    NOW()
  ),
  (
    'Yellowhammer Brewing',
    'Ghost Train',
    'German-Style Hefeweizen',
    4.8,
    15,
    4.0,
    'Cloudy golden appearance, banana and clove aromas from German yeast, smooth wheat mouthfeel, refreshing and authentic.',
    'Huntsville''s signature wheat beer, this traditional German-style hefeweizen showcases authentic Bavarian brewing techniques.',
    2,
    'AL',
    'Alabama',
    1,
    '/images/Beer images/Alabama/Ghost-Train-Yellowhammer.png',
    NOW(),
    NOW()
  ),
  (
    'Cahaba Brewing Company',
    'Cahaba Oka Uba IPA',
    'American IPA',
    7.0,
    61,
    4.0,
    'Orange-red hue, earthy hop character with citrus notes, malty backbone, balanced bitterness with noble hop finish.',
    'Named after the indigenous word for Cahaba River meaning "the Water Above," this earthy IPA is dry-hopped for complexity.',
    3,
    'AL',
    'Alabama',
    1,
    '/images/Beer images/Alabama/Cahaba Oka Uba IPA.png',
    NOW(),
    NOW()
  ),
  (
    'TrimTab Brewing Company',
    'TrimTab Paradise Now',
    'Berliner Weisse (Fruited)',
    4.2,
    8,
    4.5,
    'Bright pink color, tropical fruit aroma, tart and refreshing with passionfruit and raspberry sweetness, crisp finish.',
    'A tropical passionfruit and raspberry Berliner Weisse that showcases Birmingham''s innovative brewing scene.',
    4,
    'AL',
    'Alabama',
    1,
    '/images/Beer images/Alabama/TrimTab Paradise now.png',
    NOW(),
    NOW()
  ),
  (
    'Avondale Brewing Company',
    'Avondale Miss Fancy''s Tripel',
    'Belgian Tripel',
    9.2,
    28,
    4.0,
    'Golden color, spicy phenolic aroma, fruity esters, warming alcohol, dry finish with Belgian yeast character.',
    'A classic Belgian-style tripel brewed in Birmingham''s historic Avondale district with traditional techniques.',
    5,
    'AL',
    'Alabama',
    1,
    '/images/Beer images/Alabama/Avondale Miss Fancy''s Triple.png',
    NOW(),
    NOW()
  ),
  (
    'Back Forty Beer Company',
    'Snake Handler',
    'Double IPA',
    9.2,
    99,
    4.5,
    'Golden copper color, intense citrus and pine hop aroma, full-bodied with substantial malt backbone, lingering bitter finish.',
    'Gadsden-based brewery''s flagship DIPA, this bold beer showcases aggressive American hop character with Southern attitude.',
    6,
    'AL',
    'Alabama',
    1,
    '/images/Beer images/Alabama/Snake-Handler-Back-Forty.png',
    NOW(),
    NOW()
  ),
  (
    'Monday Night Brewing (Birmingham Social Club)',
    'Darker Subject Matter',
    'Imperial Stout',
    13.9,
    45,
    4.5,
    'Pitch black with dense tan head, intense coffee and dark chocolate aroma, full-bodied with bourbon barrel character, warming finish with roasted bitterness.',
    'A bold, high-gravity imperial stout from the Atlanta-based brewery''s Birmingham location, showcasing intense roasted complexity.',
    7,
    'AL',
    'Alabama',
    1,
    '/images/Beer images/Alabama/Monday Night Brewing Imperial Stout.png',
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- Update Alabama state progress with featured breweries and beers count
UPDATE state_progress 
SET 
  featured_breweries = ARRAY[
    'Good People Brewing Company',
    'Yellowhammer Brewing', 
    'Cahaba Brewing Company',
    'TrimTab Brewing Company',
    'Avondale Brewing Company',
    'Back Forty Beer Company',
    'Monday Night Brewing'
  ],
  featured_beers_count = 7,
  journey_highlights = ARRAY[
    'Discovered Alabama''s flagship IPA tradition',
    'Explored authentic German brewing techniques in Huntsville',
    'Found innovative sour beer scene in Birmingham',
    'Experienced traditional Belgian styles in the South',
    'Tasted aggressive hop-forward brewing culture'
  ],
  difficulty_rating = 3,
  updated_at = NOW()
WHERE state_code = 'AL';

-- Create some sample brewery features for Alabama
INSERT INTO brewery_features (
  state_code,
  brewery_name,
  brewery_type,
  city,
  address,
  website_url,
  founded_year,
  specialty_styles,
  signature_beers,
  brewery_description,
  why_featured,
  visit_priority,
  social_media,
  awards,
  is_active,
  featured_week,
  created_at,
  updated_at
) VALUES 
  (
    'AL',
    'Good People Brewing Company',
    'microbrewery',
    'Birmingham',
    '114 14th St S, Birmingham, AL 35233',
    'https://goodpeoplebrewing.com',
    2008,
    ARRAY['American IPA', 'Pale Ale', 'Porter'],
    ARRAY['Good People IPA', 'Snake Handler Double IPA', 'Coffee Oatmeal Stout'],
    'Birmingham''s pioneering craft brewery, known for consistent quality and community focus.',
    'Alabama''s most established and respected craft brewery with statewide distribution.',
    1,
    '{"instagram": "@goodpeoplebrewing", "twitter": "@goodpeopleale", "facebook": "goodpeoplebrewing"}',
    ARRAY['Great American Beer Festival Bronze Medal', 'World Beer Cup Bronze Medal'],
    true,
    1,
    NOW(),
    NOW()
  ),
  (
    'AL',
    'TrimTab Brewing Company',
    'microbrewery',
    'Birmingham',
    '2721 5th Ave S, Birmingham, AL 35233',
    'https://trimtabbrewing.com',
    2014,
    ARRAY['Sour Ales', 'IPA', 'Pilsner'],
    ARRAY['Paradise Now', 'Ribbon Cutter', 'Mel''s'],
    'Known for innovative sour ales and creative experimental brewing in Birmingham''s Avondale district.',
    'Leading Alabama''s sour beer revolution with creative and approachable styles.',
    2,
    '{"instagram": "@trimtabbrewing", "facebook": "trimtabbrewing"}',
    ARRAY['Birmingham Magazine Best Brewery'],
    true,
    1,
    NOW(),
    NOW()
  ),
  (
    'AL',
    'Yellowhammer Brewing',
    'microbrewery',
    'Huntsville',
    '2600 Clinton Ave W, Huntsville, AL 35805',
    'https://yellowhammerbrewery.com',
    2013,
    ARRAY['German Hefeweizen', 'IPA', 'Stout'],
    ARRAY['Ghost Train', 'Damnation', 'Monkeynaut IPA'],
    'Huntsville''s premier craft brewery specializing in traditional German styles and American craft favorites.',
    'Authentic German brewing techniques in the heart of Alabama''s tech corridor.',
    3,
    '{"instagram": "@yellowhammerbrewing", "facebook": "yellowhammerbrewing"}',
    ARRAY['Alabama Brewers Guild Awards'],
    true,
    1,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- Create an initial milestone for Alabama
INSERT INTO journey_milestones (
  milestone_type,
  title,
  description,
  state_code,
  week_number,
  milestone_date,
  metric_value,
  metric_unit,
  celebration_level,
  social_media_posted,
  metadata,
  is_public,
  created_at
) VALUES (
  'state_completion',
  'BrewQuest Chronicles Launch - Alabama Complete!',
  'Successfully launched the 50-state beer journey with Alabama''s diverse craft beer scene, featuring 7 exceptional beers from 7 different breweries across the Heart of Dixie.',
  'AL',
  1,
  NOW(),
  7,
  'beers_reviewed',
  'major',
  false,
  jsonb_build_object(
    'beers_featured', 7,
    'breweries_visited', 7,
    'styles_covered', ARRAY['American IPA', 'German Hefeweizen', 'Berliner Weisse', 'Belgian Tripel', 'Double IPA', 'Imperial Stout'],
    'cities_explored', ARRAY['Birmingham', 'Huntsville', 'Gadsden'],
    'launch_week', true
  ),
  true,
  NOW()
) ON CONFLICT DO NOTHING;

-- Add some initial analytics data for demonstration
INSERT INTO state_analytics (
  state_code,
  interaction_type,
  session_id,
  device_type,
  source_page,
  timestamp,
  duration_ms,
  metadata
) VALUES 
  ('AL', 'click', 'demo-session-1', 'desktop', '/states/alabama', NOW() - INTERVAL '2 hours', 5000, '{"first_visit": true}'),
  ('AL', 'hover', 'demo-session-2', 'mobile', '/', NOW() - INTERVAL '1 hour', 2000, '{"mobile_interaction": true}'),
  ('AL', 'tooltip_view', 'demo-session-1', 'desktop', '/interactive-map', NOW() - INTERVAL '30 minutes', 3000, '{"tooltip_content": "alabama_progress"}')
ON CONFLICT DO NOTHING;

-- Refresh the materialized view to include our new data
REFRESH MATERIALIZED VIEW map_interaction_summary;

-- ==================================================
-- Success Message
-- ==================================================

DO $$
BEGIN
  RAISE NOTICE 'Alabama data population complete!';
  RAISE NOTICE '✓ 7 beer reviews inserted for Alabama';
  RAISE NOTICE '✓ 3 brewery features added';  
  RAISE NOTICE '✓ State progress updated with featured breweries';
  RAISE NOTICE '✓ Launch milestone created';
  RAISE NOTICE '✓ Sample analytics data added';
  RAISE NOTICE '✓ Materialized view refreshed';
  RAISE NOTICE 'Alabama is now set as the current state for week 1!';
END $$;