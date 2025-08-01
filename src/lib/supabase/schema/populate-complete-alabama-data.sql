-- ==================================================
-- Complete Alabama Data Population - All 7 Breweries
-- ==================================================

-- Insert complete Alabama beer reviews with brewery stories
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
    'Good People Brewing Company',
    'Good People IPA',
    'American IPA',
    6.8,
    55,
    4.0,
    'Bright citrus aroma with grapefruit and orange peel, balanced malt backbone, clean bitter finish with subtle pine resin.',
    'Alabama''s #1 selling IPA for the last 10 years, this flagship brew showcases American hop character with citrus and pine notes.',
    'Founded in 2008 in Birmingham, Good People Brewing became Alabama''s pioneering craft brewery when founders Jason Malone and Michael Sellers left their corporate jobs to pursue their passion. The name "Good People" reflects Southern hospitality and the belief that beer brings good people together. Starting in a small warehouse, they''ve grown to become Alabama''s most distributed craft brewery while maintaining their commitment to quality and community.',
    'First craft brewery to achieve statewide distribution in Alabama, with their IPA remaining the state''s #1 selling craft beer for over a decade.',
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
    'Belgian White',
    'Belgian Witbier',
    4.8,
    15,
    4.0,
    'Cloudy golden appearance, banana and clove aromas from German yeast, smooth wheat mouthfeel, refreshing and authentic.',
    'Traditional Belgian witbier with coriander and orange peel, showcasing authentic European brewing techniques in Huntsville.',
    'Founded in 2013 in Huntsville''s historic downtown, Yellowhammer Brewing brought authentic German and Belgian brewing traditions to Alabama''s tech corridor. Named after Alabama''s state bird, the brewery was started by Keith and Sarah Tatum, who spent time in Germany learning traditional techniques. Their commitment to European authenticity sets them apart in Alabama''s craft scene.',
    'Only Alabama brewery specializing in authentic German and Belgian styles, using traditional ingredients imported from Europe.',
    2,
    'AL',
    'Alabama',
    1,
    '/images/Beer images/Alabama/Belgian White.YellowHammerpng.png',
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
    'Founded in 2012 in Birmingham, Cahaba Brewing Company takes its name from the Cahaba River that flows through central Alabama. Founders Eric Meyer and Robby O''Cain focus on creating beers that reflect Alabama''s outdoor culture and natural beauty. Their taproom, located near the river, emphasizes sustainability and connection to Alabama''s waterways.',
    'First Alabama brewery to focus specifically on outdoor recreation culture, with beers designed for hiking, fishing, and river activities.',
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
    'Founded in 2014 in Birmingham''s Avondale district by Harris Stewart and Colby Richardson, TrimTab Brewing specializes in innovative sour ales and creative brewing techniques. The name "TrimTab" comes from Buckminster Fuller''s concept - a small rudder that moves the big rudder on a ship, representing how small changes can create big impacts. They''ve become Alabama''s leader in sour beer innovation.',
    'Alabama''s first brewery to specialize in sour ales and wild fermentation, pioneering the state''s experimental brewing scene.',
    4,
    'AL',
    'Alabama',
    1,
    '/images/Beer images/Alabama/TrimTab Paradise now.jpg',
    NOW(),
    NOW()
  ),
  (
    'Avondale Brewing Company',
    'Miss Fancy''s Tripel',
    'Belgian Tripel',
    9.2,
    28,
    4.0,
    'Golden color, spicy phenolic aroma, fruity esters, warming alcohol, dry finish with Belgian yeast character.',
    'A classic Belgian-style tripel brewed in Birmingham''s historic Avondale district with traditional techniques.',
    'Founded in 2014 by Coby Lake in Birmingham''s historic Avondale neighborhood, Avondale Brewing Company operates in a restored early 1900s building that was once part of Avondale Mills. The brewery focuses on Belgian-style ales and barrel-aged beers, with Miss Fancy''s Tripel named after a local Avondale character. Their commitment to neighborhood revitalization matches their dedication to traditional brewing.',
    'Located in a restored 1900s mill building, representing Birmingham''s industrial heritage while specializing in Old World Belgian styles.',
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
    'Founded in 2009 in Gadsden by Jason Wilson, Back Forty Beer Company takes its name from the "back forty" acres of rural Southern property. The brewery embodies small-town Alabama brewing with bold, unapologetic flavors. Snake Handler, their flagship double IPA, reflects the fearless spirit of rural Alabama - it''s not for the faint of heart at 99 IBUs and 9.2% ABV.',
    'Rural Alabama''s boldest brewery, creating extreme hop-forward beers that rival West Coast brewing intensity.',
    6,
    'AL',
    'Alabama',
    1,
    '/images/Beer images/Alabama/Snake-Handler-Back-Forty.jpg',
    NOW(),
    NOW()
  ),
  (
    'Monday Night Brewing',
    'Darker Subject Matter',
    'Imperial Stout',
    13.9,
    45,
    4.5,
    'Pitch black with dense tan head, intense coffee and dark chocolate aroma, full-bodied with bourbon barrel character, warming finish.',
    'A bold, high-gravity imperial stout from the Atlanta-based brewery''s Birmingham location, showcasing intense roasted complexity.',
    'Monday Night Brewing opened their Birmingham Social Club location in 2019, expanding from their successful Atlanta base. Founded on the principle that Monday nights should be celebrated, not dreaded, they focus on community gathering and bold beers. Their Birmingham location in the historic Pepper Place district represents the modern wave of Southern brewing expansion.',
    'Atlanta brewery''s Birmingham expansion representing the new wave of interstate Southern brewing collaboration.',
    7,
    'AL',
    'Alabama',
    1,
    '/images/Beer images/Alabama/Monday Night Brewing Imperial Stout.png',
    NOW(),
    NOW()
  )
ON CONFLICT (brewery_name, beer_name, state_code) DO UPDATE SET
  brewery_story = EXCLUDED.brewery_story,
  unique_feature = EXCLUDED.unique_feature,
  updated_at = NOW();

-- Complete Alabama brewery features - All 7 breweries
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
    'AL', 'Good People Brewing Company', 'microbrewery', 'Birmingham',
    '114 14th St S, Birmingham, AL 35233', 'https://goodpeoplebrewing.com', 2008,
    ARRAY['American IPA', 'Pale Ale', 'Porter'],
    ARRAY['Good People IPA', 'Snake Handler Double IPA', 'Coffee Oatmeal Stout'],
    'Alabama''s pioneering craft brewery, known for consistent quality and statewide distribution.',
    'First craft brewery to achieve statewide Alabama distribution, flagship IPA remains #1 seller for over 10 years.',
    1, '{"instagram": "@goodpeoplebrewing", "twitter": "@goodpeopleale", "facebook": "goodpeoplebrewing"}',
    ARRAY['Great American Beer Festival Bronze Medal', 'World Beer Cup Bronze Medal'], true, 1, NOW(), NOW()
  ),
  (
    'AL', 'Yellowhammer Brewing', 'microbrewery', 'Huntsville',
    '2600 Clinton Ave W, Huntsville, AL 35805', 'https://yellowhammerbrewery.com', 2013,
    ARRAY['German Hefeweizen', 'Belgian Witbier', 'German Lagers'],
    ARRAY['Belgian White', 'Ghost Train', 'Monkeynaut IPA'],
    'Huntsville''s premier craft brewery specializing in authentic European brewing traditions.',
    'Only Alabama brewery specializing in traditional German and Belgian styles with imported ingredients.',
    2, '{"instagram": "@yellowhammerbrewing", "facebook": "yellowhammerbrewing"}',
    ARRAY['Alabama Brewers Guild Awards', 'Huntsville Beer Week Champions'], true, 1, NOW(), NOW()
  ),
  (
    'AL', 'Cahaba Brewing Company', 'microbrewery', 'Birmingham',
    '4500 5th Ave S, Birmingham, AL 35222', 'https://cahababrewing.com', 2012,
    ARRAY['American IPA', 'Pale Ale', 'Session Ales'],
    ARRAY['Cahaba Oka Uba IPA', 'Cahaba Blonde', 'Riverkeeper Wheat'],
    'Birmingham brewery focused on outdoor culture and sustainable brewing practices.',
    'First Alabama brewery specifically designed for outdoor recreation enthusiasts and river culture.',
    3, '{"instagram": "@cahababrewing", "facebook": "cahababrewing"}',
    ARRAY['Birmingham Green Business Certification', 'Alabama Outdoor Industry Awards'], true, 1, NOW(), NOW()
  ),
  (
    'AL', 'TrimTab Brewing Company', 'microbrewery', 'Birmingham',
    '2721 5th Ave S, Birmingham, AL 35233', 'https://trimtabbrewing.com', 2014,
    ARRAY['Sour Ales', 'Berliner Weisse', 'Wild Fermentation'],
    ARRAY['Paradise Now', 'Ribbon Cutter', 'Mel''s Diner Coffee Porter'],
    'Alabama''s leader in sour beer innovation and experimental brewing techniques.',
    'Pioneered Alabama''s sour beer movement, first to specialize in wild fermentation and barrel aging.',
    4, '{"instagram": "@trimtabbrewing", "facebook": "trimtabbrewing"}',
    ARRAY['Birmingham Magazine Best Brewery', 'Good Beer Hunting Recognition'], true, 1, NOW(), NOW()
  ),
  (
    'AL', 'Avondale Brewing Company', 'microbrewery', 'Birmingham',
    '201 41st St S, Birmingham, AL 35222', 'https://avondalebrewing.com', 2014,
    ARRAY['Belgian Ales', 'Barrel-Aged Beers', 'Traditional Styles'],
    ARRAY['Miss Fancy''s Tripel', 'The Vanillionaire', 'Spring Street Saison'],
    'Historic Avondale district brewery specializing in Belgian ales and barrel-aged beers.',
    'Restored 1900s mill building showcasing Birmingham''s industrial heritage with Old World brewing.',
    5, '{"instagram": "@avondalebrewing", "facebook": "avondalebrewing"}',
    ARRAY['Historic Preservation Awards', 'Belgian Beer Challenge Recognition'], true, 1, NOW(), NOW()
  ),
  (
    'AL', 'Back Forty Beer Company', 'microbrewery', 'Gadsden',
    '200 18th St, Gadsden, AL 35901', 'https://backfortybeer.com', 2009,
    ARRAY['Double IPA', 'Imperial Stout', 'Hop-Forward Ales'],
    ARRAY['Snake Handler', 'Truck Stop Honey Brown', 'Naked Pig Pale Ale'],
    'Rural Alabama brewery known for bold, extreme beers and small-town authenticity.',
    'Represents rural Alabama brewing with extreme hop-forward beers rivaling West Coast intensity.',
    6, '{"instagram": "@backfortybeer", "facebook": "backfortybeer"}',
    ARRAY['Alabama Brewers Guild Champion', 'Southeast Regional IPA Awards'], true, 1, NOW(), NOW()
  ),
  (
    'AL', 'Monday Night Brewing', 'brewpub', 'Birmingham',
    '2721 2nd Ave S, Birmingham, AL 35233', 'https://mondaynightbrewing.com/birmingham', 2019,
    ARRAY['Imperial Stout', 'IPA', 'Community Ales'],
    ARRAY['Darker Subject Matter', 'Han Brolo', 'Situational Ethics'],
    'Atlanta brewery''s Birmingham expansion bringing interstate Southern brewing collaboration.',
    'Represents modern Southern brewing expansion and interstate craft beer community building.',
    7, '{"instagram": "@mondaynightbrewing", "facebook": "mondaynightbrewing"}',
    ARRAY['Great American Beer Festival Medals', 'Atlanta Journal Constitution Best Of'], true, 1, NOW(), NOW()
  )
ON CONFLICT (state_code, brewery_name) DO UPDATE SET
  brewery_description = EXCLUDED.brewery_description,
  why_featured = EXCLUDED.why_featured,
  updated_at = NOW();

-- Update Alabama state progress
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
  current_status = 'completed',
  updated_at = NOW()
WHERE state_code = 'AL';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✓ Complete Alabama data populated!';
  RAISE NOTICE '✓ 7 beer reviews with brewery stories inserted';
  RAISE NOTICE '✓ 7 brewery features added with complete details';
  RAISE NOTICE '✓ Cross-references between reviews and brewery stories established';
  RAISE NOTICE '✓ Alabama marked as completed state';
END $$;