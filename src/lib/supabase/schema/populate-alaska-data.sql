-- ==================================================
-- Populate Alaska Beer Reviews Data
-- ==================================================
-- This script populates the Alaska beer reviews from the corrected 7 unique breweries

-- Insert Alaska beer reviews
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
    'Alaskan Brewing Company',
    'Alaskan Amber',
    'American Amber Ale',
    5.3,
    18,
    4.5,
    'Deep amber with copper highlights, crystal clear with creamy off-white head. Rich caramel malt sweetness with floral Saaz hop character and subtle bread notes.',
    'Based on a genuine Gold Rush-era recipe discovered in historical shipping records, this flagship amber uses traditional Bohemian Saaz hops for perfect balance.',
    1,
    'AK',
    'Alaska',
    2,
    '/images/Beer images/Alaska/Alaskan Amber.png',
    NOW(),
    NOW()
  ),
  (
    'Midnight Sun Brewing',
    'Sockeye Red IPA',
    'Red IPA',
    5.7,
    70,
    4.0,
    'Deep amber-red with copper highlights, hazy with persistent off-white head. Explosive citrus and pine with grapefruit, orange peel, and resinous hop character.',
    'Bold Pacific Northwest-style IPA with distinctive red hue from specialty malts. Aggressively hopped with Centennial, Cascade, and Simcoe varieties.',
    2,
    'AK',
    'Alaska',
    2,
    '/images/Beer images/Alaska/Sockeye Red IPA.png',
    NOW(),
    NOW()
  ),
  (
    'King Street Brewing',
    'Chocolate Coconut Porter',
    'Flavored Porter',
    6.0,
    35,
    4.0,
    'Deep black with ruby highlights, tan head with excellent retention. Rich chocolate, toasted coconut, vanilla, coffee with smooth chocolate and coconut sweetness.',
    'Robust porter infused with cacao nibs and hand-toasted coconut, creating smooth, velvety texture with tropical undertones despite Alaska''s harsh climate.',
    3,
    'AK',
    'Alaska',
    2,
    '/images/Beer images/Alaska/Chocolate Coconut Porter.png',
    NOW(),
    NOW()
  ),
  (
    'Cynosure Brewing',
    'Belgian Triple',
    'Belgian Tripel',
    9.7,
    25,
    4.5,
    'Pale gold with crystal clarity, white foam head with good retention. Spicy phenolics, fruity esters, honey, coriander with smooth honey sweetness and warming alcohol.',
    'Deceptively smooth despite its 9.7% strength, featuring subtle spice and fruit tones with complex Belgian yeast character showcasing Old World techniques.',
    4,
    'AK',
    'Alaska',
    2,
    '/images/Beer images/Alaska/Belgian Triple.png',
    NOW(),
    NOW()
  ),
  (
    'Resolution Brewing',
    'New England IPA',
    'New England IPA',
    6.2,
    45,
    4.0,
    'Hazy orange-gold with minimal head retention. Tropical fruit explosion with mango, pineapple, citrus. Creamy mouthfeel, low bitterness, tropical juice character.',
    'Soft, luscious mouthfeel with Citra, El Dorado, and Mosaic hops creating notes of mango creamsicle and pineapple. Double dry-hopped perfection.',
    5,
    'AK',
    'Alaska',
    2,
    '/images/Beer images/Alaska/New England IPA.png',
    NOW(),
    NOW()
  ),
  (
    'HooDoo Brewing',
    'German Kölsch',
    'Kölsch',
    4.8,
    22,
    4.0,
    'Pale straw gold, crystal clear with white foam head and excellent clarity. Clean malt sweetness with subtle fruit notes, delicate floral hop character.',
    'Authentic German-style Kölsch brewed with traditional techniques in Alaska''s interior. Light, crisp, and refreshing representing Fairbanks brewing excellence.',
    6,
    'AK',
    'Alaska',
    2,
    '/images/Beer images/Alaska/German Kolsch.png',
    NOW(),
    NOW()
  ),
  (
    'Broken Tooth Brewing',
    'Pipeline Stout',
    'Oatmeal Stout',
    5.9,
    32,
    4.0,
    'Deep black with ruby highlights, tan head with excellent retention. Roasted malt, dark chocolate, coffee notes with oatmeal smoothness and creamy texture.',
    'Full-bodied oatmeal stout with smooth, creamy texture. Roasted malt character with chocolate and coffee notes, perfect with their world-famous pizza.',
    7,
    'AK',
    'Alaska',
    2,
    '/images/Beer images/Alaska/Pipeline Stout.png',
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- Update Alaska state progress
UPDATE state_progress 
SET 
  featured_breweries = ARRAY[
    'Alaskan Brewing Company',
    'Midnight Sun Brewing',
    'King Street Brewing',
    'Cynosure Brewing',
    'Resolution Brewing',
    'HooDoo Brewing',
    'Broken Tooth Brewing'
  ],
  featured_beers_count = 7,
  journey_highlights = ARRAY[
    'Discovered Gold Rush-era brewing recipes in Juneau',
    'Explored Pacific Northwest hop culture in Anchorage',
    'Found unique local ingredients: spruce tips and alder smoke',
    'Experienced German brewing techniques in Fairbanks interior',
    'Tasted extreme brewing in harsh frontier conditions'
  ],
  difficulty_rating = 4,
  current_status = 'active',
  updated_at = NOW()
WHERE state_code = 'AK';

-- Create brewery features for Alaska
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
    'AK',
    'Alaskan Brewing Company',
    'microbrewery',
    'Juneau',
    '5429 Shaune Dr, Juneau, AK 99801',
    'https://alaskanbeer.com',
    1986,
    ARRAY['American Amber Ale', 'Smoked Porter', 'IPA'],
    ARRAY['Alaskan Amber', 'Alaskan Smoked Porter', 'WILDNESS English-Style Golden Ale'],
    'Alaska''s first brewery since Prohibition, founded by 28-year-olds using Gold Rush-era recipes discovered in historical records.',
    'Pioneering Alaska craft brewery with authentic historical connection and national distribution to 25 states.',
    1,
    '{"instagram": "@alaskanbeer", "twitter": "@alaskanbeer", "facebook": "alaskanbeer"}',
    ARRAY['European Beer Star Gold Medal (2024)', 'Great American Beer Festival Gold Medal', 'World Beer Cup Gold Medal'],
    true,
    2,
    NOW(),
    NOW()
  ),
  (
    'AK',
    'Midnight Sun Brewing',
    'microbrewery',
    'Anchorage',
    '8111 Dimond Hook Dr, Anchorage, AK 99507',
    'https://midnightsunbrewing.com',
    1995,
    ARRAY['Red IPA', 'Imperial Stout', 'Belgian Tripel'],
    ARRAY['Sockeye Red IPA', 'Berserker Imperial Stout', 'Panty Peeler Belgian Tripel'],
    'Anchorage brewery known for bold, hop-forward beers and experimental barrel-aging program.',
    'Represents Alaska''s bold brewing attitude with aggressive hop character and extreme beers.',
    2,
    '{"instagram": "@midnightsunbrewing", "facebook": "midnightsunbrewing"}',
    ARRAY['Great American Beer Festival Multiple Medals', 'World Beer Cup Awards'],
    true,
    2,
    NOW(),
    NOW()
  ),
  (
    'AK',
    'HooDoo Brewing',
    'microbrewery',
    'Fairbanks',
    '1951 Fox Ave, Fairbanks, AK 99701',
    'https://hoodoobrew.com',
    2012,
    ARRAY['German Kölsch', 'IPA', 'German Lagers'],
    ARRAY['German Kölsch', 'IPA', 'Fairbanks Lager'],
    'Interior Alaska brewery focusing on authentic German brewing techniques and traditional European styles.',
    'Represents Fairbanks brewing scene with authentic German techniques in extreme climate conditions.',
    3,
    '{"instagram": "@hoodoobrew", "facebook": "hoodoobrew"}',
    ARRAY['Alaska Brewers Guild Awards'],
    true,
    2,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- Create Alaska completion milestone
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
  'Alaska Complete - Last Frontier Conquered!',
  'Successfully explored Alaska''s unique craft beer scene featuring 7 beers from 7 different breweries across the Last Frontier, from Gold Rush recipes to modern innovations.',
  'AK',
  2,
  NOW(),
  7,
  'beers_reviewed',
  'major',
  false,
  jsonb_build_object(
    'beers_featured', 7,
    'breweries_visited', 7,
    'styles_covered', ARRAY['American Amber Ale', 'Red IPA', 'Flavored Porter', 'Belgian Tripel', 'New England IPA', 'Kölsch', 'Oatmeal Stout'],
    'cities_explored', ARRAY['Juneau', 'Anchorage', 'Fairbanks'],
    'unique_ingredients', ARRAY['Sitka spruce tips', 'Alder-smoked malt', 'Glacial water'],
    'frontier_brewing', true
  ),
  true,
  NOW()
) ON CONFLICT DO NOTHING;

-- Add Alaska analytics data
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
  ('AK', 'click', 'alaska-session-1', 'desktop', '/states/alaska', NOW() - INTERVAL '1 hour', 8000, '{"week_2": true}'),
  ('AK', 'hover', 'alaska-session-2', 'mobile', '/', NOW() - INTERVAL '30 minutes', 3000, '{"mobile_alaska": true}'),
  ('AK', 'tooltip_view', 'alaska-session-1', 'desktop', '/interactive-map', NOW() - INTERVAL '15 minutes', 4000, '{"tooltip_content": "alaska_progress"}')
ON CONFLICT DO NOTHING;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW map_interaction_summary;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Alaska data population complete!';
  RAISE NOTICE '✓ 7 beer reviews inserted for Alaska (7 unique breweries)';
  RAISE NOTICE '✓ 3 key brewery features added';  
  RAISE NOTICE '✓ State progress updated with featured breweries';
  RAISE NOTICE '✓ Alaska completion milestone created';
  RAISE NOTICE '✓ Sample analytics data added';
  RAISE NOTICE '✓ Materialized view refreshed';
  RAISE NOTICE 'Alaska is now ready as week 2!';
END $$;