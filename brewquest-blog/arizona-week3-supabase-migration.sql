-- Arizona Week 3 Supabase Migration Script
-- BrewQuest Chronicles - Population of Arizona brewery, beer, and review data
-- Generated: 2025-08-02

-- =============================================================================
-- STEP 1: Insert Arizona Breweries
-- =============================================================================

-- Four Peaks Brewing Company
INSERT INTO breweries (id, name, location, founded, description, website, image_url)
VALUES (
  gen_random_uuid(),
  'Four Peaks Brewing Company',
  'Tempe, Arizona',
  1996,
  'Arizona''s brewing pioneer, Four Peaks opened in 1996 as the state''s first major craft brewery near ASU campus. Located in the shadow of Tempe Butte, they became Arizona''s craft beer university, paving the way for 100+ breweries statewide.',
  'https://fourpeaks.com',
  '/images/breweries/four-peaks-brewing.jpg'
)
ON CONFLICT (name, location) DO NOTHING;

-- Arizona Wilderness Brewing Company
INSERT INTO breweries (id, name, location, founded, description, website, image_url)
VALUES (
  gen_random_uuid(),
  'Arizona Wilderness Brewing Company',
  'Gilbert, Arizona',
  2013,
  'Born in a founder''s garage and evolved into Arizona''s most environmentally conscious brewery. Uses 100% Arizona-grown Sinagua Malt and supports water conservation - every pint helps offset 50+ gallons for Arizona''s waterways.',
  'https://azwbeer.com',
  '/images/breweries/arizona-wilderness-brewing.jpg'
)
ON CONFLICT (name, location) DO NOTHING;

-- Historic Brewing Company
INSERT INTO breweries (id, name, location, founded, description, website, image_url)
VALUES (
  gen_random_uuid(),
  'Historic Brewing Company',
  'Flagstaff, Arizona',
  2012,
  'From the pines of Flagstaff at 7,000 feet elevation comes Arizona''s most creative dessert beer innovation. Their Piehole Porter became so popular it''s now found in nearly every Phoenix bar.',
  'https://historicbrewing.com',
  '/images/breweries/historic-brewing.jpg'
)
ON CONFLICT (name, location) DO NOTHING;

-- Dragoon Brewing Company
INSERT INTO breweries (id, name, location, founded, description, website, image_url)
VALUES (
  gen_random_uuid(),
  'Dragoon Brewing Company',
  'Tucson, Arizona',
  2012,
  'Embodies Tucson''s rebellious spirit with only four year-round beers, focusing on quality over quantity. Their uncompromising approach reflects the Old Pueblo''s independent character.',
  'https://dragoonbrewing.com',
  '/images/breweries/dragoon-brewing.jpg'
)
ON CONFLICT (name, location) DO NOTHING;

-- SanTan Brewing Company
INSERT INTO breweries (id, name, location, founded, description, website, image_url)
VALUES (
  gen_random_uuid(),
  'SanTan Brewing Company',
  'Chandler, Arizona',
  2007,
  'With playful naming and bold flavors, SanTan represents Arizona''s fun-loving approach to craft beer. Their irreverent marketing proves Arizona brewing doesn''t take itself too seriously.',
  'https://santanbrewing.com',
  '/images/breweries/santan-brewing.jpg'
)
ON CONFLICT (name, location) DO NOTHING;

-- Oak Creek Brewery
INSERT INTO breweries (id, name, location, founded, description, website, image_url)
VALUES (
  gen_random_uuid(),
  'Oak Creek Brewery',
  'Sedona, Arizona',
  1995,
  'From Sedona''s stunning Tlaquepaque arts community, Arizona''s oldest microbrewery connects craft beer to the state''s natural beauty. Every pint comes with million-dollar red rock views.',
  'https://oakcreekbrew.com',
  '/images/breweries/oak-creek-brewery.jpg'
)
ON CONFLICT (name, location) DO NOTHING;

-- Mother Road Brewing Company
INSERT INTO breweries (id, name, location, founded, description, website, image_url)
VALUES (
  gen_random_uuid(),
  'Mother Road Brewing Company',
  'Flagstaff, Arizona',
  2013,
  'Named for Historic Route 66, this award-winning brewery celebrates Arizona''s role in American adventure culture. From Flagstaff''s high country, they capture the spirit of westward exploration.',
  'https://motherroadbeer.com',
  '/images/breweries/mother-road-brewing.jpg'
)
ON CONFLICT (name, location) DO NOTHING;

-- =============================================================================
-- STEP 2: Insert Arizona Beers
-- =============================================================================

-- Four Peaks Kilt Lifter
INSERT INTO beers (id, brewery_id, name, style, abv, ibu, description, image_url)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM breweries WHERE name = 'Four Peaks Brewing Company' AND location = 'Tempe, Arizona'),
  'Kilt Lifter',
  'Scottish-Style Ale',
  6.0,
  NULL,
  'Rich amber color with caramel malt sweetness and subtle hop balance. A warming Scottish ale that paradoxically refreshes in 115°F heat. Smooth, approachable, and perfectly crafted for Arizona''s climate.',
  '/images/Beer images/Arizona/Four Peaks Kilt Lifter.jpg'
)
ON CONFLICT (brewery_id, name) DO NOTHING;

-- Arizona Wilderness Refuge IPA
INSERT INTO beers (id, brewery_id, name, style, abv, ibu, description, image_url)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM breweries WHERE name = 'Arizona Wilderness Brewing Company' AND location = 'Gilbert, Arizona'),
  'Refuge IPA',
  'American IPA',
  6.8,
  NULL,
  'Uses 100% Arizona-grown Sinagua Malt creating unique terroir. Bright citrus and pine hop character balanced by locally-grown malt sweetness. Supports water conservation efforts.',
  '/images/Beer images/Arizona/Arizona Wilderness Refuge IPA.jpg'
)
ON CONFLICT (brewery_id, name) DO NOTHING;

-- Historic Piehole Porter
INSERT INTO beers (id, brewery_id, name, style, abv, ibu, description, image_url)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM breweries WHERE name = 'Historic Brewing Company' AND location = 'Flagstaff, Arizona'),
  'Piehole Porter',
  'Porter',
  5.5,
  NULL,
  'Rich, dark porter base enhanced with natural cherry and vanilla flavoring. Smooth, creamy texture with chocolate malt backbone. It''s like drinking a slice of cherry pie.',
  '/images/Beer images/Arizona/Historic Piehole Porter.jpg'
)
ON CONFLICT (brewery_id, name) DO NOTHING;

-- Dragoon IPA
INSERT INTO beers (id, brewery_id, name, style, abv, ibu, description, image_url)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM breweries WHERE name = 'Dragoon Brewing Company' AND location = 'Tucson, Arizona'),
  'Dragoon IPA',
  'West Coast IPA',
  7.3,
  NULL,
  'Bold, aggressive hop character with fruity, floral, and citrus aromas. Clean malt backbone supports intense hop bitterness. A bracing, uncompromising West Coast beauty.',
  '/images/Beer images/Arizona/Dragoon IPA.jpg'
)
ON CONFLICT (brewery_id, name) DO NOTHING;

-- SanTan Devil's Ale
INSERT INTO beers (id, brewery_id, name, style, abv, ibu, description, image_url)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM breweries WHERE name = 'SanTan Brewing Company' AND location = 'Chandler, Arizona'),
  'Devil''s Ale',
  'American Pale Ale',
  5.5,
  NULL,
  'Golden amber color with pronounced hop aroma. Pine and citrus flavors from Cascade, Centennial, and Simcoe hops. Sinfully crisp finish perfect for desert heat.',
  '/images/Beer images/Arizona/SanTan Devils Ale.jpg'
)
ON CONFLICT (brewery_id, name) DO NOTHING;

-- Oak Creek Nut Brown Ale
INSERT INTO beers (id, brewery_id, name, style, abv, ibu, description, image_url)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM breweries WHERE name = 'Oak Creek Brewery' AND location = 'Sedona, Arizona'),
  'Nut Brown Ale',
  'English Brown Ale',
  5.5,
  NULL,
  'Rich brown color that mirrors Sedona''s iconic sandstone formations. Nutty, caramel malt flavors with subtle hop balance. Perfect for contemplating red rock vistas.',
  '/images/Beer images/Arizona/Oak Creek Nut Brown Ale.jpg'
)
ON CONFLICT (brewery_id, name) DO NOTHING;

-- Mother Road Tower Station IPA
INSERT INTO beers (id, brewery_id, name, style, abv, ibu, description, image_url)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM breweries WHERE name = 'Mother Road Brewing Company' AND location = 'Flagstaff, Arizona'),
  'Tower Station IPA',
  'American IPA',
  6.8,
  NULL,
  'Citrus and pine hop characteristics that evoke Arizona''s high-desert landscape. Clean, refreshing finish perfect for road trip adventures. Embodies the freedom of the open road.',
  '/images/Beer images/Arizona/Mother Road Tower Station IPA.jpg'
)
ON CONFLICT (brewery_id, name) DO NOTHING;

-- =============================================================================
-- STEP 3: Insert Arizona Beer Reviews
-- =============================================================================

-- Four Peaks Kilt Lifter Review (Monday, Day 1)
INSERT INTO beer_reviews (id, beer_id, author, rating, review_text, review_date, featured_image_url, day_of_week, week_number, state)
VALUES (
  gen_random_uuid(),
  (SELECT b.id FROM beers b JOIN breweries br ON b.brewery_id = br.id WHERE b.name = 'Kilt Lifter' AND br.name = 'Four Peaks Brewing Company'),
  'Hop Harrison',
  4.2,
  'WEEK 3 BEGINS: ARIZONA''S DESERT BREWING REVOLUTION!

Day 1: Four Peaks Kilt Lifter Scottish-Style Ale (6.0% ABV)

From the shadow of Tempe Butte comes Arizona''s brewing pioneer! Four Peaks opened in 1996 as the state''s first major craft brewery, and their Kilt Lifter remains the beer that introduced countless Arizonans to craft brewing.

🏴󠁧󠁢󠁳󠁣󠁴󠁿 SCOTTISH SOUL IN THE DESERT:
Rich amber color with caramel malt sweetness and subtle hop balance. A warming Scottish ale that paradoxically refreshes in 115°F heat. Smooth, approachable, and perfectly crafted for Arizona''s climate.

🌵 THE ARIZONA DIFFERENCE:
• Sonoran Desert brewing challenges create unique opportunities
• Extreme heat demands perfectly balanced, refreshing beers
• Elevated brewing (1,100+ feet) affects fermentation  
• Year-round outdoor drinking culture
• Water conservation leadership in arid climate

🍺 TEMPE BUTTE LEGACY:
Located near ASU campus, Four Peaks became Arizona''s craft beer university. Their success paved the way for 100+ breweries statewide. From one taproom to state icon - this is Arizona''s craft beer foundation.

Scottish tradition meets Southwestern innovation - this is where Arizona''s craft beer story begins.',
  '2025-08-11',
  '/images/Beer images/Arizona/Four Peaks Kilt Lifter.jpg',
  1,
  3,
  'Arizona'
)
ON CONFLICT (beer_id, author, review_date) DO NOTHING;

-- Arizona Wilderness Refuge IPA Review (Tuesday, Day 2)
INSERT INTO beer_reviews (id, beer_id, author, rating, review_text, review_date, featured_image_url, day_of_week, week_number, state)
VALUES (
  gen_random_uuid(),
  (SELECT b.id FROM beers b JOIN breweries br ON b.brewery_id = br.id WHERE b.name = 'Refuge IPA' AND br.name = 'Arizona Wilderness Brewing Company'),
  'Hop Harrison',
  4.4,
  'Day 2: Arizona Wilderness Refuge IPA - Sustainability Meets Flavor!

Arizona Wilderness Brewing Co. (Gilbert, 2013)
Refuge IPA - 6.8% ABV, American IPA

Born in a founder''s garage and evolved into Arizona''s most environmentally conscious brewery. Refuge IPA uses 100% Arizona-grown Sinagua Malt and supports water conservation - every pint helps offset 50+ gallons for Arizona''s waterways.

💧 DESERT WATER WARRIORS:
Arizona Wilderness proves desert brewing can be sustainable. Their water conservation partnerships and local ingredient sourcing create a beer that tastes like Arizona while protecting Arizona''s future.

🌾 SINAGUA MALT SHOWCASE:
Using malt grown right here in Arizona creates a unique terroir - this IPA tastes like the high desert. Bright citrus and pine hop character balanced by locally-grown malt sweetness.

🏜️ ENVIRONMENTAL BREWING:
• Partners with Billy Goat Hop Farms (Arizona-grown hops)
• 100% Sinagua Malt from Arizona grain
• Water conservation offsetting program
• Desert ecosystem protection advocacy
• Carbon-neutral brewing goals

From garage startup to environmental leader - this is modern Arizona craft brewing at its most innovative and responsible.',
  '2025-08-12',
  '/images/Beer images/Arizona/Arizona Wilderness Refuge IPA.jpg',
  2,
  3,
  'Arizona'
)
ON CONFLICT (beer_id, author, review_date) DO NOTHING;

-- Historic Piehole Porter Review (Wednesday, Day 3)
INSERT INTO beer_reviews (id, beer_id, author, rating, review_text, review_date, featured_image_url, day_of_week, week_number, state)
VALUES (
  gen_random_uuid(),
  (SELECT b.id FROM beers b JOIN breweries br ON b.brewery_id = br.id WHERE b.name = 'Piehole Porter' AND br.name = 'Historic Brewing Company'),
  'Hop Harrison',
  4.3,
  'Day 3: Historic''s Piehole Porter - Dessert Innovation from Flagstaff!

Historic Brewing Company (Flagstaff, 2012)
Piehole Porter with Cherry & Vanilla - 5.5% ABV

From the pines of Flagstaff comes Arizona''s most beloved dessert beer! This legendary porter became so popular it''s now found in nearly every Phoenix bar. Natural cherry and vanilla create a liquid cherry pie experience.

🥧 DESSERT BEER MASTERY:
Rich, dark porter base enhanced with natural cherry and vanilla flavoring. Smooth, creamy texture with chocolate malt backbone. It''s like drinking a slice of cherry pie - seriously!

🏔️ FLAGSTAFF''S HIGH-ALTITUDE BREWING:
At 7,000 feet elevation, Flagstaff''s brewers face unique challenges and opportunities. The cooler mountain climate allows for rich, warming styles that contrast beautifully with the Valley''s heat.

🍒 CREATIVE ARIZONA SPIRIT:
Historic Brewing embodies Arizona''s willingness to break boundaries. While other states stick to traditional styles, Arizona brewers fearlessly create memorable, unconventional beers that capture hearts and palates.

This porter proves Arizona craft beer isn''t afraid to be fun, bold, and completely unforgettable.',
  '2025-08-13',
  '/images/Beer images/Arizona/Historic Piehole Porter.jpg',
  3,
  3,
  'Arizona'
)
ON CONFLICT (beer_id, author, review_date) DO NOTHING;

-- Dragoon IPA Review (Thursday, Day 4)
INSERT INTO beer_reviews (id, beer_id, author, rating, review_text, review_date, featured_image_url, day_of_week, week_number, state)
VALUES (
  gen_random_uuid(),
  (SELECT b.id FROM beers b JOIN breweries br ON b.brewery_id = br.id WHERE b.name = 'Dragoon IPA' AND br.name = 'Dragoon Brewing Company'),
  'Hop Harrison',
  4.5,
  'Day 4: Dragoon IPA - Tucson''s Uncompromising West Coast Classic!

Dragoon Brewing Company (Tucson, 2012)
Dragoon IPA - 7.3% ABV, West Coast IPA

In the Old Pueblo, Dragoon embodies Tucson''s rebellious spirit. They brew only four year-round beers, focusing on quality over quantity. Their IPA is a bracing, uncompromising West Coast beauty that refuses to follow trends.

🐎 CAVALRY STRENGTH BREWING:
Bold, aggressive hop character with fruity, floral, and citrus aromas. Clean malt backbone supports intense hop bitterness. This isn''t a gentle introduction to IPA - it''s a statement of brewing confidence.

🌵 TUCSON''S INDEPENDENT SPIRIT:
Dragoon represents Southern Arizona''s alternative culture. While Phoenix chases growth, Tucson values authenticity. This brewery''s limited lineup and uncompromising approach reflects the Old Pueblo''s independent character.

🍺 QUALITY OVER QUANTITY PHILOSOPHY:
Four year-round beers. That''s it. No constant releases, no gimmicks - just perfected recipes executed flawlessly. Dragoon IPA proves that sometimes the best approach is focusing on what you do best.

This is West Coast IPA as it should be - bold, beautiful, and unafraid to challenge your palate.',
  '2025-08-14',
  '/images/Beer images/Arizona/Dragoon IPA.jpg',
  4,
  3,
  'Arizona'
)
ON CONFLICT (beer_id, author, review_date) DO NOTHING;

-- SanTan Devil's Ale Review (Friday, Day 5)
INSERT INTO beer_reviews (id, beer_id, author, rating, review_text, review_date, featured_image_url, day_of_week, week_number, state)
VALUES (
  gen_random_uuid(),
  (SELECT b.id FROM beers b JOIN breweries br ON b.brewery_id = br.id WHERE b.name = 'Devil''s Ale' AND br.name = 'SanTan Brewing Company'),
  'Hop Harrison',
  4.1,
  'Day 5: SanTan''s Devil''s Ale - Sinfully Crisp Southwestern Style!

SanTan Brewing Company (Chandler, 2007)
Devil''s Ale - American Pale Ale, 5.5% ABV

With a devilish grin and Arizona attitude, this "sinfully crisp" pale ale embodies the playful irreverence that makes Arizona craft beer memorable. Cascade, Centennial, and Simcoe hops create pine and citrus flavors perfect for desert heat.

😈 SINFULLY GOOD BREWING:
Golden amber color with pronounced hop aroma. Pine and citrus flavors from carefully selected hop varieties. Clean, crisp finish that refreshes in 115°F heat while maintaining bold American pale ale character.

🌵 SOUTHWEST ATTITUDE:
SanTan''s playful naming and bold flavors represent Arizona''s fun-loving approach to craft beer. From "Devil''s Ale" to their irreverent marketing, they prove Arizona brewing doesn''t take itself too seriously.

🍺 DESERT-PERFECT BALANCE:
Hop intensity balanced for drinkability in extreme heat. Strong enough for flavor enthusiasts, refreshing enough for poolside sipping. This is how you craft beer for the Sonoran Desert lifestyle.

Friday night in Arizona starts with a Devil''s Ale - sinfully crisp and absolutely essential.',
  '2025-08-15',
  '/images/Beer images/Arizona/SanTan Devils Ale.jpg',
  5,
  3,
  'Arizona'
)
ON CONFLICT (beer_id, author, review_date) DO NOTHING;

-- Oak Creek Nut Brown Ale Review (Saturday, Day 6)
INSERT INTO beer_reviews (id, beer_id, author, rating, review_text, review_date, featured_image_url, day_of_week, week_number, state)
VALUES (
  gen_random_uuid(),
  (SELECT b.id FROM beers b JOIN breweries br ON b.brewery_id = br.id WHERE b.name = 'Nut Brown Ale' AND br.name = 'Oak Creek Brewery'),
  'Hop Harrison',
  4.0,
  'Day 6: Oak Creek Nut Brown Ale - Sedona''s Red Rock Beauty!

Oak Creek Brewery (Sedona, 1995)
Nut Brown Ale - 5.5% ABV, English Brown Ale

From Sedona''s stunning Tlaquepaque arts community comes this award-winning brown ale that captures the earthy, rich tones of red rock country. As Sedona''s oldest microbrewery, Oak Creek connects craft beer to Arizona''s natural beauty.

🏔️ RED ROCK BREWING:
Rich brown color that mirrors Sedona''s iconic sandstone formations. Nutty, caramel malt flavors with subtle hop balance. Smooth, approachable character perfect for contemplating Sedona''s breathtaking vistas.

🎨 TLAQUEPAQUE TRADITION:
Located in Sedona''s premier arts and shopping village, Oak Creek Brewery makes beer part of the complete Sedona cultural experience. This is where Arizona''s natural beauty meets craft brewing artistry.

🌄 SEDONA''S BREWING PIONEER:
Operating since 1995, Oak Creek represents the connection between Arizona''s tourism industry and craft beer culture. Their brown ale has welcomed countless visitors to Arizona''s brewing scene.

This is Arizona brewing at its most scenic - where every pint comes with a million-dollar view.',
  '2025-08-16',
  '/images/Beer images/Arizona/Oak Creek Nut Brown Ale.jpg',
  6,
  3,
  'Arizona'
)
ON CONFLICT (beer_id, author, review_date) DO NOTHING;

-- Mother Road Tower Station IPA Review (Sunday, Day 7)
INSERT INTO beer_reviews (id, beer_id, author, rating, review_text, review_date, featured_image_url, day_of_week, week_number, state)
VALUES (
  gen_random_uuid(),
  (SELECT b.id FROM beers b JOIN breweries br ON b.brewery_id = br.id WHERE b.name = 'Tower Station IPA' AND br.name = 'Mother Road Brewing Company'),
  'Hop Harrison',
  4.3,
  'Day 7 FINALE: Mother Road''s Tower Station IPA - Route 66 Adventure Beer!

Mother Road Brewing Company (Flagstaff, 2013)
Tower Station IPA - 6.8% ABV, American IPA

Named for Historic Route 66 (the "Mother Road"), this award-winning IPA celebrates Arizona''s role in American adventure culture. From Flagstaff''s high country, it captures the spirit of westward exploration and endless horizons.

🛣️ ROUTE 66 HERITAGE:
Citrus and pine hop characteristics that evoke Arizona''s high-desert landscape. Clean, refreshing finish perfect for road trip adventures. This IPA embodies the freedom and excitement of the open road.

🏔️ FLAGSTAFF''S HIGH-COUNTRY BREWING:
At 7,000 feet elevation, Mother Road creates beers that work from mountain adventures to desert destinations. The cooler climate allows for complex hop character that stays refreshing in any Arizona climate.

🗺️ GATEWAY TO ADVENTURE:
Arizona has always been America''s adventure crossroads - from Route 66 travelers to modern outdoor enthusiasts. Tower Station IPA continues this tradition, fueling explorations across the Grand Canyon State.

WEEK 3 COMPLETE! From Four Peaks'' pioneering Scottish ale to Mother Road''s adventure IPA, Arizona has shown that desert brewing creates some of America''s most innovative and refreshing craft beers.',
  '2025-08-17',
  '/images/Beer images/Arizona/Mother Road Tower Station IPA.jpg',
  7,
  3,
  'Arizona'
)
ON CONFLICT (beer_id, author, review_date) DO NOTHING;

-- =============================================================================
-- STEP 4: Update State Progress for Arizona Week 3
-- =============================================================================

INSERT INTO state_progress (id, state_name, week_number, status, start_date, completion_date, breweries_featured, beers_reviewed, progress_percentage, featured_image_url, hero_description)
VALUES (
  gen_random_uuid(),
  'Arizona',
  3,
  'ready_for_publication',
  '2025-08-11',
  '2025-08-17',
  7,
  7,
  100,
  '/images/State Images/Arizona.png',
  'Desert Brewing Revolution: From Sonoran innovation to mountain mastery, Arizona''s 100+ breweries prove that extreme environments create extraordinary beers.'
)
ON CONFLICT (state_name, week_number) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  breweries_featured = EXCLUDED.breweries_featured,
  beers_reviewed = EXCLUDED.beers_reviewed,
  progress_percentage = EXCLUDED.progress_percentage,
  featured_image_url = EXCLUDED.featured_image_url,
  hero_description = EXCLUDED.hero_description;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Verify Arizona breweries were inserted
SELECT COUNT(*) as arizona_breweries_count 
FROM breweries 
WHERE location LIKE '%Arizona%';

-- Verify Arizona beers were inserted
SELECT COUNT(*) as arizona_beers_count 
FROM beers b 
JOIN breweries br ON b.brewery_id = br.id 
WHERE br.location LIKE '%Arizona%';

-- Verify Arizona reviews were inserted
SELECT COUNT(*) as arizona_reviews_count 
FROM beer_reviews 
WHERE state = 'Arizona' AND week_number = 3;

-- Show complete Arizona Week 3 data
SELECT 
  br.name as brewery,
  br.location,
  b.name as beer,
  b.style,
  b.abv,
  rv.day_of_week,
  rv.review_date
FROM beer_reviews rv
JOIN beers b ON rv.beer_id = b.id
JOIN breweries br ON b.brewery_id = br.id
WHERE rv.state = 'Arizona' AND rv.week_number = 3
ORDER BY rv.day_of_week;

-- =============================================================================
-- COMPLETION MESSAGE
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Arizona Week 3 migration completed successfully!';
  RAISE NOTICE 'Data populated: 7 breweries, 7 beers, 7 reviews, 1 state progress record';
  RAISE NOTICE 'Content ready for publication August 11-17, 2025';
END $$;