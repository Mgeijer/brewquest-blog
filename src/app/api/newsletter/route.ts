import { NextRequest, NextResponse } from 'next/server'

// Redirect old newsletter API calls to the new signup endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward the request to the new signup endpoint
    const signupResponse = await fetch(`${request.nextUrl.origin}/api/newsletter/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        source: 'legacy-api'
      }),
    })

    const data = await signupResponse.json()
    
    // Return response in the old format for backward compatibility
    if (signupResponse.ok) {
      return NextResponse.json(
        { 
          message: data.alreadySubscribed 
            ? 'You are already subscribed to BrewQuest Chronicles!' 
            : 'Successfully subscribed to newsletter!',
          email: body.email 
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: data.error || 'Failed to subscribe. Please try again later.' },
        { status: signupResponse.status }
      )
    }
  } catch (error) {
    console.error('Legacy newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    )
  }
}