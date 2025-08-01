import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { password } = await request.json()
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Clear existing data first
    console.log('Clearing existing beer reviews and brewery features...')
    await supabase.from('beer_reviews').delete().in('state_code', ['AL', 'AK'])
    await supabase.from('brewery_features').delete().in('state_code', ['AL', 'AK'])

    // Ensure Alaska state_progress exists
    await supabase.from('state_progress').upsert({
      state_code: 'AK',
      state_name: 'Alaska',
      week_number: 2,
      featured_breweries: [],
      featured_beers_count: 0,
      journey_highlights: [],
      difficulty_rating: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: 'state_code' })

    // Insert Alabama data with brewery stories
    const alabamaBeers = [
      {
        brewery_name: 'Good People Brewing Company',
        beer_name: 'Good People IPA',
        beer_style: 'American IPA',
        abv: 6.8,
        ibu: 55,
        rating: 4,
        tasting_notes: 'Bright citrus aroma with grapefruit and orange peel, balanced malt backbone, clean bitter finish with subtle pine resin.',
        description: 'Alabama\'s #1 selling IPA for the last 10 years, this flagship brew showcases American hop character with citrus and pine notes.',
        brewery_story: 'Founded in 2008 in Birmingham, Good People Brewing became Alabama\'s pioneering craft brewery when founders Jason Malone and Michael Sellers left their corporate jobs to pursue their passion. The name "Good People" reflects Southern hospitality and the belief that beer brings good people together. Starting in a small warehouse, they\'ve grown to become Alabama\'s most distributed craft brewery while maintaining their commitment to quality and community.',
        unique_feature: 'First craft brewery to achieve statewide distribution in Alabama, with their IPA remaining the state\'s #1 selling craft beer for over a decade.',
        day_of_week: 1,
        state_code: 'AL',
        state_name: 'Alabama',
        week_number: 1,
        image_url: '/images/Beer images/Alabama/Good People IPA.png'
      },
      {
        brewery_name: 'Yellowhammer Brewing',
        beer_name: 'Belgian White',
        beer_style: 'Belgian Witbier',
        abv: 4.8,
        ibu: 15,
        rating: 4,
        tasting_notes: 'Cloudy golden appearance, banana and clove aromas from German yeast, smooth wheat mouthfeel, refreshing and authentic.',
        description: 'Traditional Belgian witbier with coriander and orange peel, showcasing authentic European brewing techniques in Huntsville.',
        brewery_story: 'Founded in 2013 in Huntsville\'s historic downtown, Yellowhammer Brewing brought authentic German and Belgian brewing traditions to Alabama\'s tech corridor. Named after Alabama\'s state bird, the brewery was started by Keith and Sarah Tatum, who spent time in Germany learning traditional techniques. Their commitment to European authenticity sets them apart in Alabama\'s craft scene.',
        unique_feature: 'Only Alabama brewery specializing in authentic German and Belgian styles, using traditional ingredients imported from Europe.',
        day_of_week: 2,
        state_code: 'AL',
        state_name: 'Alabama',
        week_number: 1,
        image_url: '/images/Beer images/Alabama/Belgian White.YellowHammerpng.png'
      },
      {
        brewery_name: 'Cahaba Brewing Company',
        beer_name: 'Cahaba Oka Uba IPA',
        beer_style: 'American IPA',
        abv: 7.0,
        ibu: 61,
        rating: 4,
        tasting_notes: 'Orange-red hue, earthy hop character with citrus notes, malty backbone, balanced bitterness with noble hop finish.',
        description: 'Named after the indigenous word for Cahaba River meaning "the Water Above," this earthy IPA is dry-hopped for complexity.',
        brewery_story: 'Founded in 2012 in Birmingham, Cahaba Brewing Company takes its name from the Cahaba River that flows through central Alabama. Founders Eric Meyer and Robby O\'Cain focus on creating beers that reflect Alabama\'s outdoor culture and natural beauty. Their taproom, located near the river, emphasizes sustainability and connection to Alabama\'s waterways.',
        unique_feature: 'First Alabama brewery to focus specifically on outdoor recreation culture, with beers designed for hiking, fishing, and river activities.',
        day_of_week: 3,
        state_code: 'AL',
        state_name: 'Alabama',
        week_number: 1,
        image_url: '/images/Beer images/Alabama/Cahaba Oka Uba IPA.png'
      },
      {
        brewery_name: 'TrimTab Brewing Company',
        beer_name: 'TrimTab Paradise Now',
        beer_style: 'Berliner Weisse (Fruited)',
        abv: 4.2,
        ibu: 8,
        rating: 5,
        tasting_notes: 'Bright pink color, tropical fruit aroma, tart and refreshing with passionfruit and raspberry sweetness, crisp finish.',
        description: 'A tropical passionfruit and raspberry Berliner Weisse that showcases Birmingham\'s innovative brewing scene.',
        brewery_story: 'Founded in 2014 in Birmingham\'s Avondale district by Harris Stewart and Colby Richardson, TrimTab Brewing specializes in innovative sour ales and creative brewing techniques. The name "TrimTab" comes from Buckminster Fuller\'s concept - a small rudder that moves the big rudder on a ship, representing how small changes can create big impacts. They\'ve become Alabama\'s leader in sour beer innovation.',
        unique_feature: 'Alabama\'s first brewery to specialize in sour ales and wild fermentation, pioneering the state\'s experimental brewing scene.',
        day_of_week: 4,
        state_code: 'AL',
        state_name: 'Alabama',
        week_number: 1,
        image_url: '/images/Beer images/Alabama/TrimTab Paradise now.jpg'
      },
      {
        brewery_name: 'Avondale Brewing Company',
        beer_name: 'Miss Fancy\'s Tripel',
        beer_style: 'Belgian Tripel',
        abv: 9.2,
        ibu: 28,
        rating: 4,
        tasting_notes: 'Golden color, spicy phenolic aroma, fruity esters, warming alcohol, dry finish with Belgian yeast character.',
        description: 'A classic Belgian-style tripel brewed in Birmingham\'s historic Avondale district with traditional techniques.',
        brewery_story: 'Founded in 2014 by Coby Lake in Birmingham\'s historic Avondale neighborhood, Avondale Brewing Company operates in a restored early 1900s building that was once part of Avondale Mills. The brewery focuses on Belgian-style ales and barrel-aged beers, with Miss Fancy\'s Tripel named after a local Avondale character. Their commitment to neighborhood revitalization matches their dedication to traditional brewing.',
        unique_feature: 'Located in a restored 1900s mill building, representing Birmingham\'s industrial heritage while specializing in Old World Belgian styles.',
        day_of_week: 5,
        state_code: 'AL',
        state_name: 'Alabama',
        week_number: 1,
        image_url: '/images/Beer images/Alabama/Avondale Miss Fancy\'s Triple.png'
      },
      {
        brewery_name: 'Back Forty Beer Company',
        beer_name: 'Snake Handler',
        beer_style: 'Double IPA',
        abv: 9.2,
        ibu: 99,
        rating: 5,
        tasting_notes: 'Golden copper color, intense citrus and pine hop aroma, full-bodied with substantial malt backbone, lingering bitter finish.',
        description: 'Gadsden-based brewery\'s flagship DIPA, this bold beer showcases aggressive American hop character with Southern attitude.',
        brewery_story: 'Founded in 2009 in Gadsden by Jason Wilson, Back Forty Beer Company takes its name from the "back forty" acres of rural Southern property. The brewery embodies small-town Alabama brewing with bold, unapologetic flavors. Snake Handler, their flagship double IPA, reflects the fearless spirit of rural Alabama - it\'s not for the faint of heart at 99 IBUs and 9.2% ABV.',
        unique_feature: 'Rural Alabama\'s boldest brewery, creating extreme hop-forward beers that rival West Coast brewing intensity.',
        day_of_week: 6,
        state_code: 'AL',
        state_name: 'Alabama',
        week_number: 1,
        image_url: '/images/Beer images/Alabama/Snake-Handler-Back-Forty.jpg'
      },
      {
        brewery_name: 'Monday Night Brewing',
        beer_name: 'Darker Subject Matter',
        beer_style: 'Imperial Stout',
        abv: 13.9,
        ibu: 45,
        rating: 5,
        tasting_notes: 'Pitch black with dense tan head, intense coffee and dark chocolate aroma, full-bodied with bourbon barrel character, warming finish.',
        description: 'A bold, high-gravity imperial stout from the Atlanta-based brewery\'s Birmingham location, showcasing intense roasted complexity.',
        brewery_story: 'Monday Night Brewing opened their Birmingham Social Club location in 2019, expanding from their successful Atlanta base. Founded on the principle that Monday nights should be celebrated, not dreaded, they focus on community gathering and bold beers. Their Birmingham location in the historic Pepper Place district represents the modern wave of Southern brewing expansion.',
        unique_feature: 'Atlanta brewery\'s Birmingham expansion representing the new wave of interstate Southern brewing collaboration.',
        day_of_week: 7,
        state_code: 'AL',
        state_name: 'Alabama',
        week_number: 1,
        image_url: '/images/Beer images/Alabama/Monday Night Brewing Imperial Stout.png'
      }
    ]

    // Insert Alaska data with brewery stories
    const alaskaBeers = [
      {
        brewery_name: 'Alaskan Brewing Company',
        beer_name: 'Alaskan Amber',
        beer_style: 'American Amber Ale',
        abv: 5.3,
        ibu: 18,
        rating: 5,
        tasting_notes: 'Deep amber with copper highlights, crystal clear with creamy off-white head. Rich caramel malt sweetness with floral Saaz hop character and subtle bread notes.',
        description: 'Based on a genuine Gold Rush-era recipe discovered in historical shipping records, this flagship amber uses traditional Bohemian Saaz hops for perfect balance.',
        brewery_story: 'Founded in 1986 by 28-year-olds Marcy and Geoff Larson in Juneau, Alaskan Brewing Company became the 67th independent brewery in the United States and the first in Juneau since Prohibition. They discovered their flagship Alaskan Amber recipe in the Juneau-Douglas City Museum, where historical records showed Douglas City Brewing Company operated from 1899-1907 using this exact formulation. Today they distribute to 25 states and lead the industry in sustainability with CO₂ recovery systems and water conservation.',
        unique_feature: 'Only brewery using an authentic Gold Rush-era recipe discovered in historical museum records, with industry-leading sustainability practices.',
        day_of_week: 1,
        state_code: 'AK',
        state_name: 'Alaska',
        week_number: 2,
        image_url: '/images/Beer images/Alaska/Alaskan Amber.png'
      },
      {
        brewery_name: 'Midnight Sun Brewing',
        beer_name: 'Sockeye Red IPA',
        beer_style: 'Red IPA',
        abv: 5.7,
        ibu: 70,
        rating: 4,
        tasting_notes: 'Deep amber-red with copper highlights, hazy with persistent off-white head. Explosive citrus and pine with grapefruit, orange peel, and resinous hop character.',
        description: 'Bold Pacific Northwest-style IPA with distinctive red hue from specialty malts. Aggressively hopped with Centennial, Cascade, and Simcoe varieties.',
        brewery_story: 'Founded in 1995 in Anchorage, Midnight Sun Brewing Company represents Alaska\'s bold brewing attitude with aggressive hop-forward beers and experimental barrel-aging programs. Their Sockeye Red IPA has been Anchorage\'s flagship craft beer, showcasing Pacific Northwest hop culture adapted to Alaska\'s extreme conditions. The brewery is known for pushing boundaries with extreme beers like their 12.7% Berserker Imperial Stout.',
        unique_feature: 'Alaska\'s boldest brewery, creating hop-forward beers that rival West Coast intensity while surviving extreme Arctic conditions.',
        day_of_week: 2,
        state_code: 'AK',
        state_name: 'Alaska',
        week_number: 2,
        image_url: '/images/Beer images/Alaska/Sockeye Red IPA.png'
      },
      {
        brewery_name: 'King Street Brewing',
        beer_name: 'Chocolate Coconut Porter',
        beer_style: 'Flavored Porter',
        abv: 6.0,
        ibu: 35,
        rating: 4,
        tasting_notes: 'Deep black with ruby highlights, tan head with excellent retention. Rich chocolate, toasted coconut, vanilla, coffee with smooth chocolate and coconut sweetness.',
        description: 'Robust porter infused with cacao nibs and hand-toasted coconut, creating smooth, velvety texture with tropical undertones despite Alaska\'s harsh climate.',
        brewery_story: 'King Street Brewing Company in Anchorage specializes in creative flavor combinations that bring warmth to Alaska\'s long winters. Their Chocolate Coconut Porter exemplifies their philosophy of creating tropical escapes through beer, using hand-toasted coconut and premium cacao nibs to transport drinkers to warmer climates. The brewery also operates an extensive cider program, unusual for Alaska.',
        unique_feature: 'Creates tropical flavor escapes in Alaska\'s harsh climate, specializing in warming comfort beers with exotic ingredients.',
        day_of_week: 3,
        state_code: 'AK',
        state_name: 'Alaska',
        week_number: 2,
        image_url: '/images/Beer images/Alaska/Chocolate Coconut Porter.png'
      },
      {
        brewery_name: 'Cynosure Brewing',
        beer_name: 'Belgian Triple',
        beer_style: 'Belgian Tripel',
        abv: 9.7,
        ibu: 25,
        rating: 5,
        tasting_notes: 'Pale gold with crystal clarity, white foam head with good retention. Spicy phenolics, fruity esters, honey, coriander with smooth honey sweetness and warming alcohol.',
        description: 'Deceptively smooth despite its 9.7% strength, featuring subtle spice and fruit tones with complex Belgian yeast character showcasing Old World techniques.',
        brewery_story: 'Cynosure Brewing Company in Anchorage specializes in traditional European beer styles, bringing Old World brewing techniques to Alaska\'s frontier environment. Their Belgian Triple showcases authentic Belgian brewing methods with imported yeast strains and traditional ingredients. The brewery name "Cynosure" means "center of attention" - representing their commitment to excellence in classical beer styles rarely found in Alaska.',
        unique_feature: 'Alaska\'s only brewery specializing in authentic European beer styles with traditional techniques and imported ingredients.',
        day_of_week: 4,
        state_code: 'AK',
        state_name: 'Alaska',
        week_number: 2,
        image_url: '/images/Beer images/Alaska/Belgian Triple.png'
      },
      {
        brewery_name: 'Resolution Brewing',
        beer_name: 'New England IPA',
        beer_style: 'New England IPA',
        abv: 6.2,
        ibu: 45,
        rating: 4,
        tasting_notes: 'Hazy orange-gold with minimal head retention. Tropical fruit explosion with mango, pineapple, citrus. Creamy mouthfeel, low bitterness, tropical juice character.',
        description: 'Soft, luscious mouthfeel with Citra, El Dorado, and Mosaic hops creating notes of mango creamsicle and pineapple. Double dry-hopped perfection.',
        brewery_story: 'Resolution Brewing Company in Anchorage takes its name from Captain James Cook\'s ship HMS Resolution, which explored Alaska\'s waters in the 1770s. The brewery represents modern craft brewing\'s exploration spirit, specializing in contemporary hop-forward styles like New England IPAs. Their focus on modern techniques and trending styles makes them popular with Anchorage\'s younger craft beer enthusiasts.',
        unique_feature: 'Named after Captain Cook\'s ship, representing Alaska\'s exploration heritage while pioneering modern hazy IPA techniques.',
        day_of_week: 5,
        state_code: 'AK',
        state_name: 'Alaska',
        week_number: 2,
        image_url: '/images/Beer images/Alaska/New England IPA.png'
      },
      {
        brewery_name: 'HooDoo Brewing',
        beer_name: 'German Kölsch',
        beer_style: 'Kölsch',
        abv: 4.8,
        ibu: 22,
        rating: 4,
        tasting_notes: 'Pale straw gold, crystal clear with white foam head and excellent clarity. Clean malt sweetness with subtle fruit notes, delicate floral hop character.',
        description: 'Authentic German-style Kölsch brewed with traditional techniques in Alaska\'s interior. Light, crisp, and refreshing representing Fairbanks brewing excellence.',
        brewery_story: 'Founded in 2012 in Fairbanks, HooDoo Brewing Company brings authentic German brewing techniques to Alaska\'s interior, where winter temperatures can reach -40°F. Their German Kölsch showcases traditional European brewing in extreme conditions, requiring precise temperature control that\'s challenging in Alaska\'s climate. The brewery represents interior Alaska\'s commitment to traditional brewing excellence despite geographic isolation.',
        unique_feature: 'Interior Alaska\'s authentic German brewery, maintaining traditional European brewing techniques in extreme Arctic conditions.',
        day_of_week: 6,
        state_code: 'AK',
        state_name: 'Alaska',
        week_number: 2,
        image_url: '/images/Beer images/Alaska/German Kolsch.png'
      },
      {
        brewery_name: 'Broken Tooth Brewing',
        beer_name: 'Pipeline Stout',
        beer_style: 'Oatmeal Stout',
        abv: 5.9,
        ibu: 32,
        rating: 4,
        tasting_notes: 'Deep black with ruby highlights, tan head with excellent retention. Roasted malt, dark chocolate, coffee notes with oatmeal smoothness and creamy texture.',
        description: 'Full-bodied oatmeal stout with smooth, creamy texture. Roasted malt character with chocolate and coffee notes, perfect with their world-famous pizza.',
        brewery_story: 'Broken Tooth Brewing operates within Moose\'s Tooth Pub & Pizzeria, one of Anchorage\'s most beloved institutions since the early days of Alaska craft brewing. The combination brewery-pizzeria represents Alaska\'s community-focused approach to craft beer, where breweries serve as neighborhood gathering places. Their Pipeline Stout is specifically designed to pair with their legendary pizza combinations, making it an integral part of Anchorage\'s dining culture.',
        unique_feature: 'Alaska\'s most famous brewpub, inseparable from Anchorage dining culture and community gathering traditions.',
        day_of_week: 7,
        state_code: 'AK',
        state_name: 'Alaska',
        week_number: 2,
        image_url: '/images/Beer images/Alaska/Pipeline Stout.png'
      }
    ]

    // Insert beer reviews
    const { data: alabamaInserted, error: alabamaError } = await supabase
      .from('beer_reviews')
      .insert(alabamaBeers.map(beer => ({ ...beer, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })))

    const { data: alaskaInserted, error: alaskaError } = await supabase
      .from('beer_reviews')
      .insert(alaskaBeers.map(beer => ({ ...beer, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })))

    console.log('Beer reviews inserted:', { alabamaInserted, alaskaInserted })

    // Insert brewery features
    const alabamaBreweries = [
      { state_code: 'AL', brewery_name: 'Good People Brewing Company', brewery_type: 'microbrewery', city: 'Birmingham', founded_year: 2008, specialty_styles: ['American IPA', 'Pale Ale', 'Porter'], signature_beers: ['Good People IPA', 'Snake Handler Double IPA', 'Coffee Oatmeal Stout'], brewery_description: 'Alabama\'s pioneering craft brewery, known for consistent quality and statewide distribution.', why_featured: 'First craft brewery to achieve statewide Alabama distribution, flagship IPA remains #1 seller for over 10 years.', visit_priority: 1, is_active: true, featured_week: 1 },
      { state_code: 'AL', brewery_name: 'Yellowhammer Brewing', brewery_type: 'microbrewery', city: 'Huntsville', founded_year: 2013, specialty_styles: ['German Hefeweizen', 'Belgian Witbier', 'German Lagers'], signature_beers: ['Belgian White', 'Ghost Train', 'Monkeynaut IPA'], brewery_description: 'Huntsville\'s premier craft brewery specializing in authentic European brewing traditions.', why_featured: 'Only Alabama brewery specializing in traditional German and Belgian styles with imported ingredients.', visit_priority: 2, is_active: true, featured_week: 1 },
      { state_code: 'AL', brewery_name: 'Cahaba Brewing Company', brewery_type: 'microbrewery', city: 'Birmingham', founded_year: 2012, specialty_styles: ['American IPA', 'Pale Ale', 'Session Ales'], signature_beers: ['Cahaba Oka Uba IPA', 'Cahaba Blonde', 'Riverkeeper Wheat'], brewery_description: 'Birmingham brewery focused on outdoor culture and sustainable brewing practices.', why_featured: 'First Alabama brewery specifically designed for outdoor recreation enthusiasts and river culture.', visit_priority: 3, is_active: true, featured_week: 1 },
      { state_code: 'AL', brewery_name: 'TrimTab Brewing Company', brewery_type: 'microbrewery', city: 'Birmingham', founded_year: 2014, specialty_styles: ['Sour Ales', 'Berliner Weisse', 'Wild Fermentation'], signature_beers: ['Paradise Now', 'Ribbon Cutter', 'Mel\'s Diner Coffee Porter'], brewery_description: 'Alabama\'s leader in sour beer innovation and experimental brewing techniques.', why_featured: 'Pioneered Alabama\'s sour beer movement, first to specialize in wild fermentation and barrel aging.', visit_priority: 4, is_active: true, featured_week: 1 },
      { state_code: 'AL', brewery_name: 'Avondale Brewing Company', brewery_type: 'microbrewery', city: 'Birmingham', founded_year: 2014, specialty_styles: ['Belgian Ales', 'Barrel-Aged Beers', 'Traditional Styles'], signature_beers: ['Miss Fancy\'s Tripel', 'The Vanillionaire', 'Spring Street Saison'], brewery_description: 'Historic Avondale district brewery specializing in Belgian ales and barrel-aged beers.', why_featured: 'Restored 1900s mill building showcasing Birmingham\'s industrial heritage with Old World brewing.', visit_priority: 5, is_active: true, featured_week: 1 },
      { state_code: 'AL', brewery_name: 'Back Forty Beer Company', brewery_type: 'microbrewery', city: 'Gadsden', founded_year: 2009, specialty_styles: ['Double IPA', 'Imperial Stout', 'Hop-Forward Ales'], signature_beers: ['Snake Handler', 'Truck Stop Honey Brown', 'Naked Pig Pale Ale'], brewery_description: 'Rural Alabama brewery known for bold, extreme beers and small-town authenticity.', why_featured: 'Represents rural Alabama brewing with extreme hop-forward beers rivaling West Coast intensity.', visit_priority: 6, is_active: true, featured_week: 1 },
      { state_code: 'AL', brewery_name: 'Monday Night Brewing', brewery_type: 'brewpub', city: 'Birmingham', founded_year: 2019, specialty_styles: ['Imperial Stout', 'IPA', 'Community Ales'], signature_beers: ['Darker Subject Matter', 'Han Brolo', 'Situational Ethics'], brewery_description: 'Atlanta brewery\'s Birmingham expansion bringing interstate Southern brewing collaboration.', why_featured: 'Represents modern Southern brewing expansion and interstate craft beer community building.', visit_priority: 7, is_active: true, featured_week: 1 }
    ]

    const alaskaBreweries = [
      { state_code: 'AK', brewery_name: 'Alaskan Brewing Company', brewery_type: 'microbrewery', city: 'Juneau', founded_year: 1986, specialty_styles: ['American Amber Ale', 'Smoked Porter', 'IPA'], signature_beers: ['Alaskan Amber', 'Alaskan Smoked Porter', 'WILDNESS English-Style Golden Ale'], brewery_description: 'Alaska\'s first brewery since Prohibition, using authentic Gold Rush-era recipes with industry-leading sustainability.', why_featured: 'Pioneering Alaska craft brewery with historical authenticity, national distribution to 25 states, and sustainability leadership.', visit_priority: 1, is_active: true, featured_week: 2 },
      { state_code: 'AK', brewery_name: 'Midnight Sun Brewing', brewery_type: 'microbrewery', city: 'Anchorage', founded_year: 1995, specialty_styles: ['Red IPA', 'Imperial Stout', 'Extreme Ales'], signature_beers: ['Sockeye Red IPA', 'Berserker Imperial Stout', 'Panty Peeler Belgian Tripel'], brewery_description: 'Anchorage brewery known for bold, extreme beers and aggressive hop-forward brewing in harsh conditions.', why_featured: 'Represents Alaska\'s bold brewing attitude with extreme beers that survive Arctic conditions while rivaling West Coast intensity.', visit_priority: 2, is_active: true, featured_week: 2 },
      { state_code: 'AK', brewery_name: 'King Street Brewing', brewery_type: 'microbrewery', city: 'Anchorage', founded_year: 2015, specialty_styles: ['Flavored Porter', 'Cider', 'Creative Ales'], signature_beers: ['Chocolate Coconut Porter', 'Green Light Lager', 'Imperial IPA'], brewery_description: 'Creative Anchorage brewery specializing in comfort beers and tropical flavors despite Arctic climate.', why_featured: 'Unique focus on tropical comfort flavors and extensive cider program, creating warmth in Alaska\'s harsh winters.', visit_priority: 3, is_active: true, featured_week: 2 },
      { state_code: 'AK', brewery_name: 'Cynosure Brewing', brewery_type: 'microbrewery', city: 'Anchorage', founded_year: 2018, specialty_styles: ['Belgian Ales', 'Traditional Lagers', 'European Styles'], signature_beers: ['Belgian Triple', 'Pre-Prohibition Lager', 'Bohemian Pilsner'], brewery_description: 'Alaska\'s specialist in authentic European beer styles with traditional techniques and imported ingredients.', why_featured: 'Only Alaska brewery dedicated to authentic European styles, bringing Old World techniques to the Last Frontier.', visit_priority: 4, is_active: true, featured_week: 2 },
      { state_code: 'AK', brewery_name: 'Resolution Brewing', brewery_type: 'microbrewery', city: 'Anchorage', founded_year: 2016, specialty_styles: ['New England IPA', 'Modern Ales', 'Hop-Forward Styles'], signature_beers: ['New England IPA', 'West Coast IPA', 'Hazy Double IPA'], brewery_description: 'Modern Anchorage brewery named after Captain Cook\'s ship, specializing in contemporary hop-forward styles.', why_featured: 'Represents Alaska\'s exploration heritage while pioneering modern craft beer trends like hazy IPAs.', visit_priority: 5, is_active: true, featured_week: 2 },
      { state_code: 'AK', brewery_name: 'HooDoo Brewing', brewery_type: 'microbrewery', city: 'Fairbanks', founded_year: 2012, specialty_styles: ['German Kölsch', 'Traditional Lagers', 'European Styles'], signature_beers: ['German Kölsch', 'Fairbanks Lager', 'Traditional IPA'], brewery_description: 'Interior Alaska brewery maintaining authentic German brewing techniques in extreme Arctic conditions.', why_featured: 'Represents interior Alaska brewing with traditional German techniques surviving -40°F winter temperatures.', visit_priority: 6, is_active: true, featured_week: 2 },
      { state_code: 'AK', brewery_name: 'Broken Tooth Brewing', brewery_type: 'brewpub', city: 'Anchorage', founded_year: 1996, specialty_styles: ['Oatmeal Stout', 'Brewpub Ales', 'Pizza Pairings'], signature_beers: ['Pipeline Stout', 'Fairweather IPA', 'Broken Tooth Pale'], brewery_description: 'Alaska\'s most famous brewpub, inseparable from Anchorage dining culture at Moose\'s Tooth Pizzeria.', why_featured: 'Alaska\'s most beloved brewpub representing community gathering traditions and perfect beer-food pairings.', visit_priority: 7, is_active: true, featured_week: 2 }
    ]

    const { data: alabamaBreweriesInserted, error: alabamaBreweriesError } = await supabase
      .from('brewery_features')
      .insert(alabamaBreweries.map(brewery => ({ ...brewery, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })))

    const { data: alaskaBreweriesInserted, error: alaskaBreweriesError } = await supabase
      .from('brewery_features')
      .insert(alaskaBreweries.map(brewery => ({ ...brewery, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })))

    console.log('Brewery features inserted:', { alabamaBreweriesInserted, alaskaBreweriesInserted })

    return NextResponse.json({
      success: true,
      message: 'Database fixed successfully with complete cross-referenced data',
      populated: {
        alabama: { beers: 7, breweries: 7, cross_referenced: true },
        alaska: { beers: 7, breweries: 7, cross_referenced: true },
        total_beers: 14,
        total_breweries: 14
      },
      mobile_access: 'http://192.168.1.19:3000',
      errors: [alabamaError, alaskaError, alabamaBreweriesError, alaskaBreweriesError].filter(Boolean)
    })

  } catch (error) {
    console.error('Database fix error:', error)
    return NextResponse.json(
      { error: 'Failed to fix database', details: error.message },
      { status: 500 }
    )
  }
}