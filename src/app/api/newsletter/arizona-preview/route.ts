import { NextRequest, NextResponse } from 'next/server'
import { render } from '@react-email/render'
import ArizonaNewsletterEmail from '@/emails/ArizonaNewsletterEmail'

/**
 * GET /api/newsletter/arizona-preview
 * Preview the Arizona newsletter email template using new enhanced design
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subscriberName = searchParams.get('name') || 'Beer Enthusiast'
    const weekNumber = parseInt(searchParams.get('week') || '3')

    console.log(`[PREVIEW] Generating Arizona newsletter preview for: ${subscriberName}`)

    // Render the email template
    const emailHtml = await render(
      ArizonaNewsletterEmail({
        subscriberName,
        weekNumber,
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
    console.error('Error generating Arizona newsletter preview:', error)
    
    // Return a simple HTML error page
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Arizona Newsletter Preview Error</title>
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
            <p>Failed to generate Arizona newsletter preview</p>
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
 * POST /api/newsletter/arizona-preview
 * Preview with custom data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      subscriberName = 'Beer Enthusiast',
      weekNumber = 3
    } = body

    console.log(`[PREVIEW] Generating custom Arizona newsletter preview`)

    const emailHtml = await render(
      ArizonaNewsletterEmail({
        subscriberName,
        weekNumber,
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
    console.error('Error generating custom Arizona newsletter preview:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate preview',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}