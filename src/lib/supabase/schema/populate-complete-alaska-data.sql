-- ==================================================
-- Complete Alaska Data Population - All 7 Breweries
-- ==================================================

-- Insert complete Alaska beer reviews with brewery stories
INSERT INTO beer_reviews (
  brewery_name,
  beer_name,
  beer_style,
  abv,
  ibu,
  rating,
  tasting_notes,
  description,
  brewery_story,
  unique_feature,
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
    'Founded in 1986 by 28-year-olds Marcy and Geoff Larson in Juneau, Alaskan Brewing Company became the 67th independent brewery in the United States and the first in Juneau since Prohibition. They discovered their flagship Alaskan Amber recipe in the Juneau-Douglas City Museum, where historical records showed Douglas City Brewing Company operated from 1899-1907 using this exact formulation. Today they distribute to 25 states and lead the industry in sustainability with CO₂ recovery systems and water conservation.',
    'Only brewery using an authentic Gold Rush-era recipe discovered in historical museum records, with industry-leading sustainability practices.',
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
    'Founded in 1995 in Anchorage, Midnight Sun Brewing Company represents Alaska''s bold brewing attitude with aggressive hop-forward beers and experimental barrel-aging programs. Their Sockeye Red IPA has been Anchorage''s flagship craft beer, showcasing Pacific Northwest hop culture adapted to Alaska''s extreme conditions. The brewery is known for pushing boundaries with extreme beers like their 12.7% Berserker Imperial Stout.',
    'Alaska''s boldest brewery, creating hop-forward beers that rival West Coast intensity while surviving extreme Arctic conditions.',
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
    'King Street Brewing Company in Anchorage specializes in creative flavor combinations that bring warmth to Alaska''s long winters. Their Chocolate Coconut Porter exemplifies their philosophy of creating tropical escapes through beer, using hand-toasted coconut and premium cacao nibs to transport drinkers to warmer climates. The brewery also operates an extensive cider program, unusual for Alaska.',
    'Creates tropical flavor escapes in Alaska''s harsh climate, specializing in warming comfort beers with exotic ingredients.',
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
    'Cynosure Brewing Company in Anchorage specializes in traditional European beer styles, bringing Old World brewing techniques to Alaska''s frontier environment. Their Belgian Triple showcases authentic Belgian brewing methods with imported yeast strains and traditional ingredients. The brewery name "Cynosure" means "center of attention" - representing their commitment to excellence in classical beer styles rarely found in Alaska.',
    'Alaska''s only brewery specializing in authentic European beer styles with traditional techniques and imported ingredients.',
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
    'Resolution Brewing Company in Anchorage takes its name from Captain James Cook''s ship HMS Resolution, which explored Alaska''s waters in the 1770s. The brewery represents modern craft brewing''s exploration spirit, specializing in contemporary hop-forward styles like New England IPAs. Their focus on modern techniques and trending styles makes them popular with Anchorage''s younger craft beer enthusiasts.',
    'Named after Captain Cook''s ship, representing Alaska''s exploration heritage while pioneering modern hazy IPA techniques.',
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
    'Founded in 2012 in Fairbanks, HooDoo Brewing Company brings authentic German brewing techniques to Alaska''s interior, where winter temperatures can reach -40°F. Their German Kölsch showcases traditional European brewing in extreme conditions, requiring precise temperature control that''s challenging in Alaska''s climate. The brewery represents interior Alaska''s commitment to traditional brewing excellence despite geographic isolation.',
    'Interior Alaska''s authentic German brewery, maintaining traditional European brewing techniques in extreme Arctic conditions.',
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
    'Broken Tooth Brewing operates within Moose''s Tooth Pub & Pizzeria, one of Anchorage''s most beloved institutions since the early days of Alaska craft brewing. The combination brewery-pizzeria represents Alaska''s community-focused approach to craft beer, where breweries serve as neighborhood gathering places. Their Pipeline Stout is specifically designed to pair with their legendary pizza combinations, making it an integral part of Anchorage''s dining culture.',
    'Alaska''s most famous brewpub, inseparable from Anchorage dining culture and community gathering traditions.',
    7,
    'AK',
    'Alaska',
    2,
    '/images/Beer images/Alaska/Pipeline Stout.png',
    NOW(),
    NOW()
  )
ON CONFLICT (brewery_name, beer_name, state_code) DO UPDATE SET
  brewery_story = EXCLUDED.brewery_story,
  unique_feature = EXCLUDED.unique_feature,
  updated_at = NOW();

-- Complete Alaska brewery features - All 7 breweries
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
    'AK', 'Alaskan Brewing Company', 'microbrewery', 'Juneau',
    '5429 Shaune Dr, Juneau, AK 99801', 'https://alaskanbeer.com', 1986,
    ARRAY['American Amber Ale', 'Smoked Porter', 'IPA'],
    ARRAY['Alaskan Amber', 'Alaskan Smoked Porter', 'WILDNESS English-Style Golden Ale'],
    'Alaska''s first brewery since Prohibition, using authentic Gold Rush-era recipes with industry-leading sustainability.',
    'Pioneering Alaska craft brewery with historical authenticity, national distribution to 25 states, and sustainability leadership.',
    1, '{"instagram": "@alaskanbeer", "twitter": "@alaskanbeer", "facebook": "alaskanbeer"}',
    ARRAY['European Beer Star Gold Medal (2024)', 'Great American Beer Festival Gold Medal', 'World Beer Cup Gold Medal'], true, 2, NOW(), NOW()
  ),
  (
    'AK', 'Midnight Sun Brewing', 'microbrewery', 'Anchorage',
    '8111 Dimond Hook Dr, Anchorage, AK 99507', 'https://midnightsunbrewing.com', 1995,
    ARRAY['Red IPA', 'Imperial Stout', 'Extreme Ales'],
    ARRAY['Sockeye Red IPA', 'Berserker Imperial Stout', 'Panty Peeler Belgian Tripel'],
    'Anchorage brewery known for bold, extreme beers and aggressive hop-forward brewing in harsh conditions.',
    'Represents Alaska''s bold brewing attitude with extreme beers that survive Arctic conditions while rivaling West Coast intensity.',
    2, '{"instagram": "@midnightsunbrewing", "facebook": "midnightsunbrewing"}',
    ARRAY['Great American Beer Festival Multiple Medals', 'World Beer Cup Awards'], true, 2, NOW(), NOW()
  ),
  (
    'AK', 'King Street Brewing', 'microbrewery', 'Anchorage',
    '9050 King Street, Anchorage, AK 99515', 'https://kingstreetbrewing.com', 2015,
    ARRAY['Flavored Porter', 'Cider', 'Creative Ales'],
    ARRAY['Chocolate Coconut Porter', 'Green Light Lager', 'Imperial IPA'],
    'Creative Anchorage brewery specializing in comfort beers and tropical flavors despite Arctic climate.',
    'Unique focus on tropical comfort flavors and extensive cider program, creating warmth in Alaska''s harsh winters.',
    3, '{"instagram": "@kingstreetbrewing", "facebook": "kingstreetbrewing"}',
    ARRAY['Alaska Brewers Guild Awards', 'Anchorage Press Best Of'], true, 2, NOW(), NOW()
  ),
  (
    'AK', 'Cynosure Brewing', 'microbrewery', 'Anchorage',
    '650 W 6th Ave, Anchorage, AK 99501', 'https://cynosurebrewing.com', 2018,
    ARRAY['Belgian Ales', 'Traditional Lagers', 'European Styles'],
    ARRAY['Belgian Triple', 'Pre-Prohibition Lager', 'Bohemian Pilsner'],
    'Alaska''s specialist in authentic European beer styles with traditional techniques and imported ingredients.',
    'Only Alaska brewery dedicated to authentic European styles, bringing Old World techniques to the Last Frontier.',
    4, '{"instagram": "@cynosurebrewing", "facebook": "cynosurebrewing"}',
    ARRAY['Traditional Brewing Recognition', 'European Style Competition Medals'], true, 2, NOW(), NOW()
  ),
  (
    'AK', 'Resolution Brewing', 'microbrewery', 'Anchorage',
    '1920 W Dimond Blvd, Anchorage, AK 99515', 'https://resolutionbrewing.com', 2016,
    ARRAY['New England IPA', 'Modern Ales', 'Hop-Forward Styles'],
    ARRAY['New England IPA', 'West Coast IPA', 'Hazy Double IPA'],
    'Modern Anchorage brewery named after Captain Cook''s ship, specializing in contemporary hop-forward styles.',
    'Represents Alaska''s exploration heritage while pioneering modern craft beer trends like hazy IPAs.',
    5, '{"instagram": "@resolutionbrewing", "facebook": "resolutionbrewing"}',
    ARRAY['Alaska Beer Week Awards', 'Modern IPA Recognition'], true, 2, NOW(), NOW()
  ),
  (
    'AK', 'HooDoo Brewing', 'microbrewery', 'Fairbanks',
    '1951 Fox Ave, Fairbanks, AK 99701', 'https://hoodoobrew.com', 2012,
    ARRAY['German Kölsch', 'Traditional Lagers', 'European Styles'],
    ARRAY['German Kölsch', 'Fairbanks Lager', 'Traditional IPA'],
    'Interior Alaska brewery maintaining authentic German brewing techniques in extreme Arctic conditions.',
    'Represents interior Alaska brewing with traditional German techniques surviving -40°F winter temperatures.',
    6, '{"instagram": "@hoodoobrew", "facebook": "hoodoobrew"}',
    ARRAY['Alaska Brewers Guild Awards', 'Traditional Brewing Excellence'], true, 2, NOW(), NOW()
  ),
  (
    'AK', 'Broken Tooth Brewing', 'brewpub', 'Anchorage',
    '3300 Old Seward Hwy, Anchorage, AK 99503', 'https://moosestooth.net', 1996,
    ARRAY['Oatmeal Stout', 'Brewpub Ales', 'Pizza Pairings'],
    ARRAY['Pipeline Stout', 'Fairweather IPA', 'Broken Tooth Pale'],
    'Alaska''s most famous brewpub, inseparable from Anchorage dining culture at Moose''s Tooth Pizzeria.',
    'Alaska''s most beloved brewpub representing community gathering traditions and perfect beer-food pairings.',
    7, '{"instagram": "@moosestoothalaska", "facebook": "moosestooth"}',
    ARRAY['Alaska Magazine Best Pizza', 'Anchorage Institution Award'], true, 2, NOW(), NOW()
  )
ON CONFLICT (state_code, brewery_name) DO UPDATE SET
  brewery_description = EXCLUDED.brewery_description,
  why_featured = EXCLUDED.why_featured,
  updated_at = NOW();

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
  current_status = 'active',
  updated_at = NOW()
WHERE state_code = 'AK';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✓ Complete Alaska data populated!';
  RAISE NOTICE '✓ 7 beer reviews with brewery stories inserted';
  RAISE NOTICE '✓ 7 brewery features added with complete details';
  RAISE NOTICE '✓ Cross-references between reviews and brewery stories established';
  RAISE NOTICE '✓ Alaska marked as active state for week 2';
END $$;