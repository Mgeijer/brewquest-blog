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

    // Alabama blog post
    const alabamaBlogPost = {
      title: 'Alabama Craft Beer Journey: Heart of Dixie Brewing Renaissance',
      slug: 'alabama-craft-beer-journey',
      excerpt: 'Discover Alabama\'s emerging craft beer scene, from Birmingham\'s pioneering breweries to Huntsville\'s authentic German traditions. Our 7-day journey through the Heart of Dixie reveals innovative brewers creating world-class beers with Southern hospitality.',
      content: `# Alabama Craft Beer Journey: Heart of Dixie Brewing Renaissance

Alabama's craft beer scene has undergone a remarkable transformation, evolving from a state with restrictive beer laws to a thriving brewing destination that showcases Southern innovation and hospitality. Our seven-day journey through the Heart of Dixie reveals breweries that are not just making exceptional beer, but are actively revitalizing communities and preserving brewing traditions.

## Week 1 Schedule: Seven Days, Seven Outstanding Breweries

### Day 1: Good People Brewing Company - Birmingham
**Featured Beer: Good People IPA (6.8% ABV, 55 IBU)**

Our Alabama journey begins with the state's pioneering craft brewery. Founded in 2008 by Jason Malone and Michael Sellers, Good People Brewing became Alabama's first brewery to achieve statewide distribution. Their flagship IPA remains the state's #1 selling craft beer for over a decade, showcasing American hop character with bright citrus and pine notes.

*Tasting Notes: Bright citrus aroma with grapefruit and orange peel, balanced malt backbone, clean bitter finish with subtle pine resin.*

### Day 2: Yellowhammer Brewing - Huntsville  
**Featured Beer: Belgian White (4.8% ABV, 15 IBU)**

Named after Alabama's state bird, Yellowhammer Brewing brings authentic German and Belgian brewing traditions to Huntsville's tech corridor. Founded by Keith and Sarah Tatum after studying traditional brewing techniques in Germany, they're the only Alabama brewery specializing in authentic European styles with imported ingredients.

*Tasting Notes: Cloudy golden appearance, banana and clove aromas from German yeast, smooth wheat mouthfeel, refreshing and authentic.*

### Day 3: Cahaba Brewing Company - Birmingham
**Featured Beer: Cahaba Oka Uba IPA (7.0% ABV, 61 IBU)**

Taking its name from the Cahaba River (meaning "the Water Above" in indigenous language), this brewery focuses on Alabama's outdoor culture. Founded in 2012 by Eric Meyer and Robby O'Cain, their taproom near the river emphasizes sustainability and connection to Alabama's natural waterways.

*Tasting Notes: Orange-red hue, earthy hop character with citrus notes, malty backbone, balanced bitterness with noble hop finish.*

### Day 4: TrimTab Brewing Company - Birmingham
**Featured Beer: Paradise Now Berliner Weisse (4.2% ABV, 8 IBU)**

Named after Buckminster Fuller's concept of small changes creating big impacts, TrimTab has become Alabama's leader in sour beer innovation. Founded in 2014 by Harris Stewart and Colby Richardson in Birmingham's Avondale district, they specialize in wild fermentation and experimental brewing techniques.

*Tasting Notes: Bright pink color, tropical fruit aroma, tart and refreshing with passionfruit and raspberry sweetness, crisp finish.*

### Day 5: Avondale Brewing Company - Birmingham
**Featured Beer: Miss Fancy's Tripel (9.2% ABV, 28 IBU)**

Operating in a restored early 1900s mill building, Avondale Brewing represents Birmingham's industrial heritage while specializing in Belgian ales and barrel-aged beers. Founded in 2014 by Coby Lake, their commitment to neighborhood revitalization matches their dedication to traditional brewing.

*Tasting Notes: Golden color, spicy phenolic aroma, fruity esters, warming alcohol, dry finish with Belgian yeast character.*

### Day 6: Back Forty Beer Company - Gadsden
**Featured Beer: Snake Handler Double IPA (9.2% ABV, 99 IBU)**

Representing rural Alabama brewing with extreme hop-forward beers, Back Forty was founded in 2009 by Jason Wilson. Their flagship Snake Handler reflects the fearless spirit of rural Alabama - it's not for the faint of heart at 99 IBUs and 9.2% ABV, rivaling West Coast brewing intensity.

*Tasting Notes: Golden copper color, intense citrus and pine hop aroma, full-bodied with substantial malt backbone, lingering bitter finish.*

### Day 7: Monday Night Brewing (Birmingham Social Club) - Birmingham
**Featured Beer: Darker Subject Matter Imperial Stout (13.9% ABV, 45 IBU)**

Representing the modern wave of interstate Southern brewing collaboration, Monday Night opened their Birmingham Social Club location in 2019, expanding from Atlanta. Located in the historic Pepper Place district, they focus on community gathering and bold beers that celebrate Monday nights.

*Tasting Notes: Pitch black with dense tan head, intense coffee and dark chocolate aroma, full-bodied with bourbon barrel character, warming finish.*

## Alabama's Brewing Renaissance

Alabama's transformation from restrictive beer laws to a thriving craft scene represents one of the South's most remarkable brewing stories. From Birmingham's industrial heritage breweries to Huntsville's technical innovation and rural Alabama's bold flavor profiles, the state showcases how Southern hospitality and brewing excellence go hand in hand.

The seven breweries featured represent Alabama's diverse brewing landscape: pioneering statewide distribution, authentic European traditions, outdoor recreation culture, sour beer innovation, historical preservation, rural authenticity, and interstate collaboration. Each tells a unique story of how Alabama is writing its place in American craft beer history.`,
      featured_image_url: '/images/State Images/Alabama.png',
      state: 'AL',
      week_number: 1,
      read_time: 8,
      seo_meta_description: 'Discover Alabama\'s craft beer renaissance through 7 outstanding breweries. From Birmingham\'s pioneers to Huntsville\'s German traditions, explore the Heart of Dixie\'s emerging brewing scene.',
      seo_keywords: ['Alabama craft beer', 'Birmingham breweries', 'Good People Brewing', 'Southern craft beer', 'Alabama beer journey', 'craft beer tourism']
    }

    // Alaska blog post
    const alaskaBlogPost = {
      title: 'Alaska Craft Beer Journey: Last Frontier Brewing Excellence',
      slug: 'alaska-craft-beer-journey', 
      excerpt: 'Explore Alaska\'s unique craft beer scene where brewers overcome extreme conditions to create exceptional beers. From Gold Rush-era recipes to modern hazy IPAs, discover how the Last Frontier\'s breweries blend history, innovation, and Arctic resilience.',
      content: `# Alaska Craft Beer Journey: Last Frontier Brewing Excellence

Alaska's craft beer scene represents one of America's most challenging and rewarding brewing environments. Where winter temperatures can reach -40°F and summer brings midnight sun, brewers have created a unique culture that combines historical authenticity, extreme innovation, and community resilience. Our seven-day journey through the Last Frontier reveals breweries that don't just survive Alaska's conditions - they thrive in them.

## Week 2 Schedule: Seven Days of Arctic Brewing Excellence

### Day 1: Alaskan Brewing Company - Juneau
**Featured Beer: Alaskan Amber (5.3% ABV, 18 IBU)**

Our Alaska journey begins with the state's pioneering brewery, founded in 1986 by Marcy and Geoff Larson. What makes this brewery extraordinary is their flagship beer's authenticity - the recipe was discovered in the Juneau-Douglas City Museum, where historical records showed Douglas City Brewing Company operated from 1899-1907 using this exact formulation.

*Tasting Notes: Deep amber with copper highlights, crystal clear with creamy off-white head. Rich caramel malt sweetness with floral Saaz hop character and subtle bread notes.*

### Day 2: Midnight Sun Brewing - Anchorage
**Featured Beer: Sockeye Red IPA (5.7% ABV, 70 IBU)**

Founded in 1995, Midnight Sun represents Alaska's bold brewing attitude with aggressive hop-forward beers and experimental barrel-aging programs. Their Sockeye Red IPA has been Anchorage's flagship craft beer, showcasing Pacific Northwest hop culture adapted to Alaska's extreme conditions.

*Tasting Notes: Deep amber-red with copper highlights, hazy with persistent off-white head. Explosive citrus and pine with grapefruit, orange peel, and resinous hop character.*

### Day 3: King Street Brewing - Anchorage
**Featured Beer: Chocolate Coconut Porter (6.0% ABV, 35 IBU)**

King Street Brewing specializes in creative flavor combinations that bring warmth to Alaska's long winters. Their Chocolate Coconut Porter exemplifies their philosophy of creating tropical escapes through beer, using hand-toasted coconut and premium cacao nibs to transport drinkers to warmer climates.

*Tasting Notes: Deep black with ruby highlights, tan head with excellent retention. Rich chocolate, toasted coconut, vanilla, coffee with smooth chocolate and coconut sweetness.*

### Day 4: Cynosure Brewing - Anchorage
**Featured Beer: Belgian Triple (9.7% ABV, 25 IBU)**

Cynosure Brewing Company specializes in traditional European beer styles, bringing Old World brewing techniques to Alaska's frontier environment. The brewery name "Cynosure" means "center of attention" - representing their commitment to excellence in classical beer styles rarely found in Alaska.

*Tasting Notes: Pale gold with crystal clarity, white foam head with good retention. Spicy phenolics, fruity esters, honey, coriander with smooth honey sweetness and warming alcohol.*

### Day 5: Resolution Brewing - Anchorage
**Featured Beer: New England IPA (6.2% ABV, 45 IBU)**

Taking its name from Captain James Cook's ship HMS Resolution, which explored Alaska's waters in the 1770s, this brewery represents modern craft brewing's exploration spirit. Their focus on contemporary hop-forward styles like New England IPAs makes them popular with Anchorage's younger craft beer enthusiasts.

*Tasting Notes: Hazy orange-gold with minimal head retention. Tropical fruit explosion with mango, pineapple, citrus. Creamy mouthfeel, low bitterness, tropical juice character.*

### Day 6: HooDoo Brewing - Fairbanks
**Featured Beer: German Kölsch (4.8% ABV, 22 IBU)**

Founded in 2012 in Fairbanks, HooDoo Brewing brings authentic German brewing techniques to Alaska's interior, where winter temperatures can reach -40°F. Their German Kölsch showcases traditional European brewing in extreme conditions, requiring precise temperature control that's challenging in Alaska's climate.

*Tasting Notes: Pale straw gold, crystal clear with white foam head and excellent clarity. Clean malt sweetness with subtle fruit notes, delicate floral hop character.*

### Day 7: Broken Tooth Brewing - Anchorage  
**Featured Beer: Pipeline Stout (5.9% ABV, 32 IBU)**

Operating within Moose's Tooth Pub & Pizzeria, Broken Tooth Brewing represents Alaska's community-focused approach to craft beer, where breweries serve as neighborhood gathering places. Their Pipeline Stout is specifically designed to pair with legendary pizza combinations, making it integral to Anchorage's dining culture.

*Tasting Notes: Deep black with ruby highlights, tan head with excellent retention. Roasted malt, dark chocolate, coffee notes with oatmeal smoothness and creamy texture.*

## The Last Frontier's Brewing Spirit

Alaska's craft beer scene embodies the state's pioneering spirit and resilience. From Juneau's historical authenticity to Anchorage's innovative brewing laboratories and Fairbanks' extreme-condition brewing, Alaska proves that great beer can be made anywhere with enough passion and determination.

These seven breweries represent Alaska's diverse brewing landscape: historical preservation, extreme brewing conditions, tropical comfort creation, European authenticity, modern exploration, traditional German techniques, and community gathering traditions. Each tells a story of how Alaska's brewers don't just adapt to their environment - they harness it to create something uniquely Alaskan.

The Last Frontier's brewing scene continues to push boundaries, creating beers that reflect both Alaska's rugged independence and its welcoming community spirit. Whether you're seeking historical authenticity, extreme flavors, or simply a great beer to enjoy while watching the Northern Lights, Alaska's brewers deliver experiences you'll find nowhere else on Earth.`,
      featured_image_url: '/images/State Images/Alaska.png',
      state: 'AK',
      week_number: 2,
      read_time: 9,
      seo_meta_description: 'Experience Alaska\'s unique craft beer scene where extreme conditions create exceptional beers. From authentic Gold Rush recipes to modern Arctic brewing innovation.',
      seo_keywords: ['Alaska craft beer', 'Alaskan Brewing Company', 'Arctic brewing', 'Last Frontier beer', 'Alaska beer journey', 'extreme brewing conditions']
    }

    // Insert Alabama blog post
    const { data: alabamaPost, error: alabamaError } = await supabase
      .from('blog_posts')
      .upsert(alabamaBlogPost, { 
        onConflict: 'slug',
        ignoreDuplicates: false 
      })
      .select()

    if (alabamaError) {
      console.error('Alabama blog post error:', alabamaError)
      return NextResponse.json(
        { error: 'Failed to create Alabama blog post', details: alabamaError },
        { status: 500 }
      )
    }

    // Insert Alaska blog post  
    const { data: alaskaPost, error: alaskaError } = await supabase
      .from('blog_posts')
      .upsert(alaskaBlogPost, {
        onConflict: 'slug', 
        ignoreDuplicates: false
      })
      .select()

    if (alaskaError) {
      console.error('Alaska blog post error:', alaskaError)
      return NextResponse.json(
        { error: 'Failed to create Alaska blog post', details: alaskaError },
        { status: 500 }
      )
    }

    // Update state_progress to link blog posts
    if (alabamaPost && alabamaPost[0]) {
      await supabase
        .from('state_progress')
        .update({ blog_post_id: alabamaPost[0].id })
        .eq('state_code', 'AL')
    }

    if (alaskaPost && alaskaPost[0]) {
      await supabase
        .from('state_progress')
        .update({ blog_post_id: alaskaPost[0].id })
        .eq('state_code', 'AK')
    }

    return NextResponse.json({
      success: true,
      message: 'Blog posts created successfully for admin preview',
      created: {
        alabama: { 
          title: alabamaBlogPost.title,
          slug: alabamaBlogPost.slug,
          ready_for_preview: true
        },
        alaska: {
          title: alaskaBlogPost.title, 
          slug: alaskaBlogPost.slug,
          ready_for_preview: true
        }
      }
    })

  } catch (error) {
    console.error('Blog post creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create blog posts', details: error.message },
      { status: 500 }
    )
  }
}