import { NextRequest, NextResponse } from 'next/server'
import { render } from '@react-email/render'
import AlaskaNewsletterEmail from '@/emails/AlaskaNewsletterEmail'

/**
 * GET /api/newsletter/alaska-preview
 * Preview the Alaska newsletter email template
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subscriberName = searchParams.get('name') || 'Beer Enthusiast'
    const weekNumber = parseInt(searchParams.get('week') || '2')

    console.log(`[PREVIEW] Generating Alaska newsletter preview for: ${subscriberName}`)

    // Sample Alaska beer data for preview
    const sampleBeerReviews = [
      {
        beer_name: 'Alaskan Amber',
        brewery_name: 'Alaskan Brewing Company',
        rating: 5,
        beer_style: 'Amber Ale',
        abv: 5.3,
        day_of_week: 1,
        image_url: '/images/Beer images/Alaska/Alaskan Amber.png',
        review_content: 'Deep amber with copper highlights, crystal clear with creamy off-white head. Rich caramel malt sweetness with floral Saaz hop character and subtle bread notes.'
      },
      {
        beer_name: 'Sockeye Red IPA',
        brewery_name: 'Midnight Sun Brewing',
        rating: 5,
        beer_style: 'Red IPA',
        abv: 5.7,
        day_of_week: 2,
        image_url: '/images/Beer images/Alaska/Sockeye-Red.png',
        review_content: 'Deep amber-red with copper highlights, hazy with persistent off-white head. Explosive citrus and pine with grapefruit, orange peel, and resinous hop character.'
      }
    ]

    // Render the email template
    const emailHtml = await render(
      AlaskaNewsletterEmail({
        subscriberName,
        weekNumber,
        beerReviews: sampleBeerReviews,
        previewMode: true
      })
    )

    // Return HTML for browser preview
    return new NextResponse(emailHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })

  } catch (error) {
    console.error('Error generating Alaska newsletter preview:', error)
    
    // Return a simple HTML error page
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Alaska Newsletter Preview Error</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .error { background: #fee; border: 1px solid #fcc; padding: 20px; border-radius: 8px; }
            .error h1 { color: #c33; margin: 0 0 10px; }
            .code { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>Preview Generation Error</h1>
            <p>Failed to generate Alaska newsletter preview</p>
            <div class="code">${error instanceof Error ? error.message : 'Unknown error'}</div>
          </div>
        </body>
      </html>
    `
    
    return new NextResponse(errorHtml, {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

/**
 * POST /api/newsletter/alaska-preview
 * Preview with custom data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      subscriberName = 'Beer Enthusiast',
      weekNumber = 2,
      beerReviews = [],
      customContent 
    } = body

    console.log(`[PREVIEW] Generating custom Alaska newsletter preview`)

    const emailHtml = await render(
      AlaskaNewsletterEmail({
        subscriberName,
        weekNumber,
        beerReviews,
        previewMode: true
      })
    )

    return new NextResponse(emailHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })

  } catch (error) {
    console.error('Error generating custom Alaska newsletter preview:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate preview',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}