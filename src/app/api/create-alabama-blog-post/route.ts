import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getBeerReviewsByState } from '@/lib/utils/populateBeerDatabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key for database operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    console.log('🔍 Checking for existing Alabama blog post...')
    
    // Check if Alabama blog post already exists
    const { data: existingPost, error: checkError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', 'alabama-craft-beer-journey')
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking for existing blog post:', checkError)
      return NextResponse.json({
        success: false,
        error: checkError.message,
        message: 'Failed to check for existing blog post'
      }, { status: 500 })
    }

    if (existingPost) {
      return NextResponse.json({
        success: true,
        message: 'Alabama blog post already exists',
        existingPost: {
          id: existingPost.id,
          title: existingPost.title,
          slug: existingPost.slug,
          state: existingPost.state,
          week_number: existingPost.week_number,
          published_at: existingPost.published_at,
          created_at: existingPost.created_at
        }
      })
    }

    // Get Alabama beer reviews for content generation
    const alabamaBeers = await getBeerReviewsByState('AL')
    
    return NextResponse.json({
      success: true,
      message: 'No existing Alabama blog post found',
      alabamaBeers: alabamaBeers.length,
      beersPreview: alabamaBeers.map(beer => ({
        beer_name: beer.beer_name,
        brewery_name: beer.brewery_name,
        beer_style: beer.beer_style,
        rating: beer.rating,
        day_of_week: beer.day_of_week
      }))
    })

  } catch (error) {
    console.error('❌ Error checking Alabama blog post:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to check Alabama blog post status'
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    console.log('📝 Creating Alabama craft beer blog post...')

    // Check if post already exists
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', 'alabama-craft-beer-journey')
      .single()

    if (existingPost) {
      return NextResponse.json({
        success: false,
        message: 'Alabama blog post already exists',
        postId: existingPost.id
      }, { status: 409 })
    }

    // Get Alabama beer reviews
    const alabamaBeers = await getBeerReviewsByState('AL')
    
    if (alabamaBeers.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No Alabama beer reviews found. Please populate beer reviews first.'
      }, { status: 400 })
    }

    // Calculate estimated read time (approximately 200 words per minute)
    const wordsInPost = 1800 // Estimated based on comprehensive blog post
    const readTime = Math.ceil(wordsInPost / 200)

    // Create comprehensive blog post content
    const blogPostContent = generateAlabamaBlogPostContent(alabamaBeers)
    
    // Create the blog post
    const { data: newPost, error } = await supabase
      .from('blog_posts')
      .insert({
        title: 'Alabama Craft Beer Journey: Discovering the Heart of Dixie\'s Brewing Scene',
        slug: 'alabama-craft-beer-journey',
        excerpt: 'Join Hop Harrison as we explore Alabama\'s emerging craft beer scene, from Birmingham\'s innovative breweries to the state\'s most beloved IPAs, blonde ales, and imperial stouts.',
        content: blogPostContent,
        featured_image_url: '/images/states/alabama-hero.jpg',
        state: 'Alabama',
        week_number: 1,
        read_time: readTime,
        published_at: new Date().toISOString(),
        seo_meta_description: 'Explore Alabama\'s craft beer scene with detailed reviews of 7 exceptional beers from Good People Brewing, Cahaba, TrimTab, Avondale, and Monday Night. Birmingham\'s best craft breweries.',
        seo_keywords: ['Alabama craft beer', 'Birmingham breweries', 'Good People IPA', 'Cahaba Blonde', 'TrimTab Paradise Now', 'Avondale Brewing', 'Monday Night Fu Manbrew', 'Alabama breweries', 'craft beer reviews', 'southeast beer'],
        view_count: 0,
        is_featured: true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating blog post:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        message: 'Failed to create Alabama blog post'
      }, { status: 500 })
    }

    console.log(`✅ Successfully created Alabama blog post with ID: ${newPost.id}`)

    // Update beer reviews to link them to the blog post
    const { error: linkError } = await supabase
      .from('beer_reviews')
      .update({ blog_post_id: newPost.id })
      .ilike('unique_feature', 'AL:%')

    if (linkError) {
      console.warn('Warning: Could not link beer reviews to blog post:', linkError)
    } else {
      console.log('✅ Successfully linked Alabama beer reviews to blog post')
    }

    return NextResponse.json({
      success: true,
      message: 'Alabama blog post created successfully',
      blogPost: {
        id: newPost.id,
        title: newPost.title,
        slug: newPost.slug,
        excerpt: newPost.excerpt,
        state: newPost.state,
        week_number: newPost.week_number,
        published_at: newPost.published_at,
        read_time: newPost.read_time,
        linkedBeers: alabamaBeers.length
      }
    })

  } catch (error) {
    console.error('❌ Error creating Alabama blog post:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to create Alabama blog post'
    }, { status: 500 })
  }
}

function generateAlabamaBlogPostContent(alabamaBeers: any[]): string {
  // Sort beers by day of week for proper ordering
  const sortedBeers = alabamaBeers.sort((a, b) => (a.day_of_week || 0) - (b.day_of_week || 0))

  return `# Alabama Craft Beer Journey: Discovering the Heart of Dixie's Brewing Scene

*Week 1 of my 50-state craft beer journey brings me to Alabama, where Southern hospitality meets innovative brewing. Join me as I explore the emerging craft beer landscape of the Heart of Dixie.*

## Welcome to Alabama's Craft Beer Renaissance

When most people think of Alabama, craft beer might not be the first thing that comes to mind. But after spending a week exploring the state's brewing scene, I can confidently say that Alabama is experiencing a genuine craft beer renaissance. From the bustling brewery districts of Birmingham to the innovative flavors emerging from places like TrimTab and Avondale, Alabama's craft beer story is one of Southern creativity and authentic flavors.

The state's brewing scene centers around Birmingham, which has emerged as the unofficial craft beer capital of Alabama. Here, breweries like Good People, Cahaba, and TrimTab are crafting beers that honor both traditional styles and push creative boundaries. What strikes me most about Alabama's craft beer scene is how it reflects the state's character: welcoming, authentic, and deeply rooted in community.

## My Week in Alabama Beer

Over seven days, I had the privilege of sampling seven exceptional beers that showcase the diversity and quality of Alabama's craft brewing. Each beer tells a story—not just of the brewery that created it, but of Alabama's brewing culture as a whole.

### Day 1: Good People IPA - The Alabama Classic

**Good People Brewing Company | American IPA | 6.8% ABV | 55 IBU**

${sortedBeers[0]?.tasting_notes || 'Bright citrus aroma with grapefruit and orange peel, balanced malt backbone, clean bitter finish with subtle pine resin.'}

Starting my Alabama journey with Good People IPA felt like the right choice. This has been Alabama's #1 selling IPA for the last decade, and after tasting it, I understand why. Good People Brewing, founded in Birmingham in 2008, has become synonymous with quality craft beer in Alabama.

The IPA showcases classic American hop character without overwhelming the palate. There's a beautiful balance here—enough hop presence to satisfy IPA lovers, but approachable enough for those new to craft beer. ${sortedBeers[0]?.brewery_story || "The brewery's commitment to community is evident in every aspect of their operation, from their welcoming taproom to their involvement in local events."}

*Rating: ${sortedBeers[0]?.rating || 4}/5*

### Day 2: Cahaba Blonde - Birmingham's Most Notorious

**Cahaba Brewing Company | American Blonde Ale | 5.25% ABV | 23 IBU**

${sortedBeers[1]?.tasting_notes || 'Light-bodied with European malt character, clean finish, subtle hop presence, refreshing and sessionable.'}

Cahaba Brewing bills their Blonde as "Birmingham's Most Notorious," and spending an afternoon at their taproom, I can see why. This beer embodies the laid-back, approachable nature of Alabama craft beer culture. ${sortedBeers[1]?.brewery_story || "Named after the Cahaba River that flows through Birmingham, this beer captures the essence of Alabama summer days."}

What I love about this blonde ale is its versatility. It's the perfect beer for Alabama's warm climate, light enough for hot summer days but with enough character to keep things interesting. The European malt character adds a subtle complexity that elevates it above typical light beers.

*Rating: ${sortedBeers[1]?.rating || 3.5}/5*

### Day 3: Cahaba Oka Uba IPA - Indigenous Inspiration

**Cahaba Brewing Company | American IPA | 7.0% ABV | 61 IBU**

${sortedBeers[2]?.tasting_notes || 'Orange-red hue, earthy hop character with citrus notes, malty backbone, balanced bitterness with noble hop finish.'}

The name "Oka Uba" comes from the indigenous word for Cahaba River, meaning "the Water Above." This IPA represents a deeper dive into Cahaba's brewing capabilities, showcasing their ability to craft more complex, hop-forward beers.

${sortedBeers[2]?.brewery_story || "This earthy IPA is dry-hopped for complexity, creating layers of flavor that unfold with each sip."} The orange-red hue immediately catches your attention, and the aroma promises complexity that the taste delivers on. There's an earthiness here that you don't find in many IPAs, complemented by bright citrus notes that keep it refreshing.

*Rating: ${sortedBeers[2]?.rating || 4}/5*

### Day 4: TrimTab Paradise Now - Tropical Innovation

**TrimTab Brewing Company | Berliner Weisse (Fruited) | 4.2% ABV | 8 IBU**

${sortedBeers[3]?.tasting_notes || 'Bright pink color, tropical fruit aroma, tart and refreshing with passionfruit and raspberry sweetness, crisp finish.'}

TrimTab Brewing represents the innovative side of Alabama's craft beer scene, and Paradise Now is a perfect example of their creative approach. ${sortedBeers[3]?.brewery_story || "This tropical passionfruit and raspberry Berliner Weisse showcases Birmingham's innovative brewing scene."} 

The bright pink color immediately signals that this isn't your traditional German Berliner Weisse, but that's exactly the point. TrimTab has taken a classic sour style and infused it with tropical flavors that work beautifully in Alabama's climate. The tartness is balanced perfectly with fruit sweetness, creating a beer that's both refreshing and complex.

*Rating: ${sortedBeers[3]?.rating || 4.5}/5*

### Day 5: Avondale Miss Fancy's Tripel - Belgian Tradition Meets Alabama

**Avondale Brewing Company | Belgian Tripel | 9.2% ABV | 28 IBU**

${sortedBeers[4]?.tasting_notes || 'Golden color, spicy phenolic aroma, fruity esters, warming alcohol, dry finish with Belgian yeast character.'}

Avondale Brewing, located in Birmingham's historic Avondale district, brings Belgian brewing tradition to Alabama with Miss Fancy's Tripel. ${sortedBeers[4]?.brewery_story || "This classic Belgian-style tripel is brewed with traditional techniques that honor the style's heritage."}

The 9.2% ABV makes this a sipper, but the complexity rewards your patience. The Belgian yeast character shines through with classic phenolic spiciness and fruity esters. Despite the high alcohol content, it maintains the dry finish that makes Belgian tripels so food-friendly. This is sophisticated brewing that shows Alabama can compete with the best Belgian-style brewers anywhere.

*Rating: ${sortedBeers[4]?.rating || 4}/5*

### Day 6: Cahaba Irish Stout - Dark and Smooth

**Cahaba Brewing Company | Irish Dry Stout | 4.1% ABV | 35 IBU**

${sortedBeers[5]?.tasting_notes || 'Dark color with tan head, roasted coffee and chocolate aromas, smooth mouthfeel, dry finish with subtle sweetness.'}

Returning to Cahaba for their take on an Irish stout, I found a beer that demonstrates the brewery's range. ${sortedBeers[5]?.brewery_story || "This classic take on Irish stout features roasted barley character and subtle fruitiness from Irish yeast."}

The 4.1% ABV makes this incredibly sessionable, while the roasted character provides the depth you want in a stout. The smooth mouthfeel and dry finish make it surprisingly refreshing, even in Alabama's warm climate. It's a testament to the brewery's skill that they can make a stout work so well in the South.

*Rating: ${sortedBeers[5]?.rating || 3.5}/5*

### Day 7: Monday Night Fu Manbrew - Imperial Excellence

**Monday Night Brewing (Birmingham Social Club) | Imperial Stout | 9.5% ABV | 45 IBU**

${sortedBeers[6]?.tasting_notes || 'Black color, coffee and dark chocolate aroma, full-bodied with vanilla notes, warming finish with roasted bitterness.'}

Closing out my Alabama week with Monday Night's Fu Manbrew felt appropriately epic. ${sortedBeers[6]?.brewery_story || "This rich imperial stout from the Atlanta-based brewery's Birmingham location showcases complex roasted flavors."} While Monday Night is based in Atlanta, their Birmingham Social Club location has become an integral part of the local scene.

At 9.5% ABV, this is a serious beer for serious beer lovers. The complexity is remarkable—layers of coffee, dark chocolate, and vanilla create a dessert-like experience. The warming finish reminds you of the alcohol content, but it's so well-integrated that it never feels harsh or overwhelming.

*Rating: ${sortedBeers[6]?.rating || 4.5}/5*

## Alabama's Brewing Landscape: More Than Just Beer

What impressed me most about Alabama's craft beer scene wasn't just the quality of the beer (though that was certainly impressive), but the sense of community surrounding it. Birmingham's breweries feel like gathering places, where locals come not just to drink great beer, but to connect with their neighbors.

The breweries I visited all shared a commitment to their local communities. Good People sponsors numerous local events and charities. Cahaba has become synonymous with Birmingham's outdoor culture, with their beers accompanying everything from river floats to hiking adventures. TrimTab pushes creative boundaries while remaining rooted in their Birmingham neighborhood. Avondale honors both their historic district and brewing traditions.

### By the Numbers: Alabama's Brewing Scene

- **Total Breweries**: Approximately 45 active breweries statewide
- **Brewery Density**: 0.9 breweries per 100,000 people
- **Primary Brewing Region**: Birmingham metropolitan area
- **Fastest Growing Styles**: IPAs, Sour Beers, and Belgian-inspired ales
- **Local Favorites**: Good People IPA dominates sales across the state

## The Flavors of Alabama

If I had to characterize Alabama's craft beer scene in a few words, I'd say it's approachable, community-focused, and increasingly innovative. The brewers I met understand that their role extends beyond just making great beer—they're creating gathering spaces and building community connections.

The flavor profiles trending in Alabama reflect both the climate and culture. Lighter, more refreshing styles like blonde ales and Berliner weisses work well in the Southern heat, while the growing appreciation for complex styles like Belgian tripels and imperial stouts shows an increasingly sophisticated palate among Alabama beer drinkers.

## Food Pairing Recommendations

Alabama's beer scene pairs beautifully with the state's incredible food culture:

- **Good People IPA** with Alabama barbecue—the hop bitterness cuts through rich, smoky flavors
- **Cahaba Blonde** with fried catfish or chicken—light enough not to overwhelm delicate flavors
- **TrimTab Paradise Now** with key lime pie or fresh fruit—the tartness complements dessert beautifully
- **Miss Fancy's Tripel** with aged cheeses or rich desserts—the complexity matches sophisticated flavors
- **Fu Manbrew** with chocolate desserts or as a dessert itself

## Looking Ahead: Alabama's Brewing Future

Alabama's craft beer scene is poised for continued growth. The state's favorable business climate, growing population of young professionals, and increasing tourism are all contributing to expanded interest in craft beer. Birmingham, in particular, is becoming a destination for beer tourism.

I'm excited to see how Alabama's brewing scene develops over the next few years. With such a strong foundation already in place, and brewers who clearly understand both quality and community, the future looks bright for Alabama craft beer.

## Week 1 Wrap-Up: Alabama Sets a High Bar

As I prepare to head to Alaska for Week 2 of my journey, I'm reflecting on what an excellent start Alabama provided. The combination of quality beer, welcoming breweries, and genuine community spirit sets a high bar for the remaining 49 states.

Alabama proved that great craft beer can flourish anywhere there are passionate brewers and supportive communities. The Heart of Dixie has won a permanent place in my heart, and I'm already planning my return trip to explore even more of what Alabama's brewers have to offer.

**Week 1 Summary**:
- **States Visited**: 1 (Alabama)
- **Beers Reviewed**: 7
- **Breweries Visited**: 5
- **Average Rating**: 4.0/5
- **Standout Beer**: TrimTab Paradise Now (4.5/5)
- **Best Discovery**: The incredible sense of community in Birmingham's brewing scene

---

*Next week, I'm heading north to Alaska for Week 2 of my 50-state craft beer journey. Follow along as I explore the Last Frontier's brewing scene and discover how brewers work with glacier water and midnight sun conditions.*

*Have you tried any of these Alabama beers? What should I look for when I get to Alaska? Let me know in the comments below!*

---

**About the Author**: Hop Harrison is a craft beer enthusiast embarking on a 50-state journey to discover America's best breweries and beers. Follow the complete journey at BrewQuest Chronicles.

*Drink responsibly. All beers were sampled in appropriate quantities over multiple days.*`
}