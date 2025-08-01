import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check if we have admin authentication
    const { password } = await request.json()
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Populate Alabama data
    const alabamaScript = `
      -- Insert Alabama beer reviews
      INSERT INTO beer_reviews (
        brewery_name, beer_name, beer_style, abv, ibu, rating,
        tasting_notes, description, day_of_week, state_code, state_name,
        week_number, image_url, created_at, updated_at
      ) VALUES 
        ('Good People Brewing Company', 'Good People IPA', 'American IPA', 6.8, 55, 4.0,
         'Bright citrus aroma with grapefruit and orange peel, balanced malt backbone.', 
         'Alabama''s #1 selling IPA for the last 10 years.', 1, 'AL', 'Alabama', 1,
         '/images/Beer images/Alabama/Good People IPA.png', NOW(), NOW()),
        ('Yellowhammer Brewing', 'Belgian White', 'Belgian Witbier', 4.8, 15, 4.0,
         'Cloudy golden appearance, coriander and orange peel, smooth wheat mouthfeel.',
         'Traditional Belgian witbier with authentic German techniques.', 2, 'AL', 'Alabama', 1,
         '/images/Beer images/Alabama/Belgian White.YellowHammerpng.png', NOW(), NOW()),
        ('Cahaba Brewing Company', 'Cahaba Oka Uba IPA', 'American IPA', 7.0, 61, 4.0,
         'Orange-red hue, earthy hop character with citrus notes, balanced bitterness.',
         'Named after indigenous Cahaba River word meaning "Water Above".', 3, 'AL', 'Alabama', 1,
         '/images/Beer images/Alabama/Cahaba Oka Uba IPA.png', NOW(), NOW()),
        ('TrimTab Brewing Company', 'TrimTab Paradise Now', 'Berliner Weisse', 4.2, 8, 4.5,
         'Bright pink color, tropical fruit aroma, tart with passionfruit and raspberry.',
         'Innovative sour beer showcasing Birmingham''s experimental scene.', 4, 'AL', 'Alabama', 1,
         '/images/Beer images/Alabama/TrimTab Paradise now.jpg', NOW(), NOW()),
        ('Avondale Brewing Company', 'Miss Fancy''s Tripel', 'Belgian Tripel', 9.2, 28, 4.0,
         'Golden color, spicy phenolic aroma, fruity esters, warming alcohol.',
         'Classic Belgian-style tripel in Birmingham''s historic Avondale district.', 5, 'AL', 'Alabama', 1,
         '/images/Beer images/Alabama/Avondale Miss Fancy''s Triple.png', NOW(), NOW()),
        ('Back Forty Beer Company', 'Snake Handler', 'Double IPA', 9.2, 99, 4.5,
         'Golden copper, intense citrus and pine hop aroma, full-bodied with bitter finish.',
         'Gadsden-based brewery''s flagship DIPA with 99 IBUs of Southern attitude.', 6, 'AL', 'Alabama', 1,
         '/images/Beer images/Alabama/Snake-Handler-Back-Forty.jpg', NOW(), NOW()),
        ('Monday Night Brewing', 'Darker Subject Matter', 'Imperial Stout', 13.9, 45, 4.5,
         'Pitch black, intense coffee and dark chocolate, bourbon barrel character.',
         'Bold imperial stout from Atlanta brewery''s Birmingham location.', 7, 'AL', 'Alabama', 1,
         '/images/Beer images/Alabama/Monday Night Brewing Imperial Stout.png', NOW(), NOW())
      ON CONFLICT DO NOTHING;`

    const { error: alabamaError } = await supabase.rpc('execute_sql', { 
      sql_query: alabamaScript 
    })

    // Populate Alaska data
    const alaskaScript = `
      -- Insert Alaska beer reviews
      INSERT INTO beer_reviews (
        brewery_name, beer_name, beer_style, abv, ibu, rating,
        tasting_notes, description, day_of_week, state_code, state_name,
        week_number, image_url, created_at, updated_at
      ) VALUES 
        ('Alaskan Brewing Company', 'Alaskan Amber', 'American Amber Ale', 5.3, 18, 4.5,
         'Deep amber with copper highlights, rich caramel malt with floral Saaz hops.',
         'Based on Gold Rush-era recipe with traditional Bohemian Saaz hops.', 1, 'AK', 'Alaska', 2,
         '/images/Beer images/Alaska/Alaskan Amber.png', NOW(), NOW()),
        ('Midnight Sun Brewing', 'Sockeye Red IPA', 'Red IPA', 5.7, 70, 4.0,
         'Deep amber-red, explosive citrus and pine with Centennial, Cascade, Simcoe.',
         'Bold Pacific Northwest-style IPA with distinctive red hue.', 2, 'AK', 'Alaska', 2,
         '/images/Beer images/Alaska/Sockeye Red IPA.png', NOW(), NOW()),
        ('King Street Brewing', 'Chocolate Coconut Porter', 'Flavored Porter', 6.0, 35, 4.0,
         'Deep black, rich chocolate and toasted coconut with smooth texture.',
         'Cacao nibs and hand-toasted coconut create tropical undertones.', 3, 'AK', 'Alaska', 2,
         '/images/Beer images/Alaska/Chocolate Coconut Porter.png', NOW(), NOW()),
        ('Cynosure Brewing', 'Belgian Triple', 'Belgian Tripel', 9.7, 25, 4.5,
         'Pale gold, spicy phenolics and fruity esters with smooth honey sweetness.',
         'Deceptively smooth despite 9.7% strength with complex Belgian yeast.', 4, 'AK', 'Alaska', 2,
         '/images/Beer images/Alaska/Belgian Triple.png', NOW(), NOW()),
        ('Resolution Brewing', 'New England IPA', 'New England IPA', 6.2, 45, 4.0,
         'Hazy orange-gold, tropical fruit explosion with mango and pineapple.',
         'Double dry-hopped with Citra, El Dorado, and Mosaic hops.', 5, 'AK', 'Alaska', 2,
         '/images/Beer images/Alaska/New England IPA.png', NOW(), NOW()),
        ('HooDoo Brewing', 'German Kölsch', 'Kölsch', 4.8, 22, 4.0,
         'Pale straw gold, clean malt sweetness with subtle fruit and floral hops.',
         'Authentic German-style Kölsch with traditional techniques in Fairbanks.', 6, 'AK', 'Alaska', 2,
         '/images/Beer images/Alaska/German Kolsch.png', NOW(), NOW()),
        ('Broken Tooth Brewing', 'Pipeline Stout', 'Oatmeal Stout', 5.9, 32, 4.0,
         'Deep black, roasted malt and chocolate with smooth oatmeal texture.',
         'Full-bodied oatmeal stout perfect with their world-famous pizza.', 7, 'AK', 'Alaska', 2,
         '/images/Beer images/Alaska/Pipeline Stout.png', NOW(), NOW())
      ON CONFLICT DO NOTHING;`

    const { error: alaskaError } = await supabase.rpc('execute_sql', { 
      sql_query: alaskaScript 
    })

    if (alabamaError || alaskaError) {
      console.error('Database population error:', alabamaError || alaskaError)
      return NextResponse.json(
        { error: 'Database population failed', details: alabamaError || alaskaError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Database populated successfully',
      populated: {
        alabama_beers: 7,
        alaska_beers: 7,
        total_beers: 14
      }
    })

  } catch (error) {
    console.error('Error populating database:', error)
    return NextResponse.json(
      { error: 'Failed to populate database' },
      { status: 500 }
    )
  }
}