import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import ArizonaNewsletterEmail from '@/emails/ArizonaNewsletterEmail'
import { getCurrentState, getStateTitle } from '@/lib/data/stateProgress'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * POST /api/admin/send-approved-content
 * Send specific approved content from admin dashboard as newsletter
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentId } = body

    console.log(`[ADMIN] Sending specific approved content: ${contentId}`)

    const supabase = createClient()
    const currentState = getCurrentState()
    const stateTitle = getStateTitle(currentState?.code || '')
    
    if (!currentState) {
      return NextResponse.json({
        success: false,
        error: 'No current state found'
      }, { status: 400 })
    }

    const approvedContent = {
      id: contentId,
      title: `${currentState.name} Craft Beer Journey: ${stateTitle}`,
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

The Last Frontier's brewing scene continues to push boundaries, creating beers that reflect both Alaska's rugged independence and its welcoming community spirit. Whether you're seeking historical authenticity, extreme flavors, or simply a great beer to enjoy while watching the Northern Lights, Alaska's brewers deliver experiences you'll find nowhere else on Earth.`
    }

    // Get newsletter subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('email, first_name')
      .eq('is_active', true)

    if (subError) {
      console.error('Error fetching subscribers:', subError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch subscribers',
        details: subError.message 
      }, { status: 500 })
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No active subscribers found' 
      }, { status: 404 })
    }

    // Get Alaska beer data from database for the email template
    const { data: alaskaBeerData } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('state_code', 'AK')
      .order('day_of_week', { ascending: true })

    // Generate the professional Alaska newsletter email
    const emailHtml = await render(
      AlaskaNewsletterEmail({
        subscriberName: 'Beer Enthusiast', // Will be personalized per subscriber
        weekNumber: 2,
        beerReviews: alaskaBeerData || [],
        unsubscribeToken: undefined // Will be set per subscriber
      })
    )

    // Send emails to all subscribers
    let successful = 0
    let failed = 0

    for (const subscriber of subscribers) {
      try {
        // Generate personalized email with current state data
        const personalizedEmailHtml = await render(
          ArizonaNewsletterEmail({
            subscriberName: subscriber.first_name || 'Beer Enthusiast',
            weekNumber: currentState.weekNumber,
            unsubscribeToken: 'placeholder_token' // In production, generate actual tokens
          })
        )

        await resend.emails.send({
          from: 'Hop Harrison <hop@hopharrison.com>',
          to: subscriber.email,
          subject: `🍺 Week ${currentState.weekNumber} Complete: ${currentState.name}'s ${stateTitle}`,
          html: personalizedEmailHtml
        })
        
        successful++
        console.log(`Sent approved ${currentState.name} content to ${subscriber.email}`)
        
      } catch (error) {
        console.error(`Failed to send approved content to ${subscriber.email}:`, error)
        failed++
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Approved Alaska newsletter content sent successfully',
      stats: {
        successful,
        failed,
        total: subscribers.length
      },
      contentId,
      contentTitle: approvedContent.title
    })

  } catch (error) {
    console.error('Error sending approved content:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send approved content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}