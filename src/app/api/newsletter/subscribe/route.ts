import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email, firstName, source = 'website', stateInterest } = await request.json()

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Valid email required' }, { status: 400 })
    }

    // Import email service only when needed
    const { ResendEmailService } = await import('@/lib/email/resendService')
    const emailService = new ResendEmailService()
    
    // Add subscriber to database with additional metadata
    const subscriber = await emailService.addSubscriber(email, firstName, source)
    
    // Get current state for response message
    const supabase = createClient() 
    const launchDate = new Date('2025-08-05T00:00:00.000Z')
    const now = new Date()
    let currentState = 'Alabama'
    
    if (now >= launchDate) {
      const { data } = await supabase
        .from('state_progress')
        .select('state_name')
        .eq('status', 'current')
        .single()
      currentState = data?.state_name || 'Alabama'
    }
    
    // Send welcome email
    await emailService.sendWelcomeEmail(subscriber)
    
    return Response.json({
      success: true,
      message: 'Welcome to BrewQuest Chronicles! Check your email for a welcome message.',
      subscriberId: subscriber.id,
      currentState
    })

  } catch (error) {
    console.error('Newsletter signup error:', error)
    
    // More detailed error logging for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : null
    
    console.error('Error details:', {
      message: errorMessage,
      code: error.code,
      name: error.name,
      stack: errorStack
    })
    
    if (error.message?.includes('duplicate') || error.code === '23505') {
      return Response.json({
        success: true,
        message: 'You are already subscribed to BrewQuest Chronicles!',
        alreadySubscribed: true
      }, { status: 200 })
    }
    
    // Return more specific error information in development
    return Response.json({ 
      error: 'Subscription failed. Please try again.',
      debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}

// GET endpoint to check subscription status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return Response.json({ error: 'Email parameter is required' }, { status: 400 })
    }

    const supabase = createClient()

    const { data: subscriber, error } = await supabase
      .from('newsletter_subscribers')
      .select('email, is_active, subscribed_at, first_name')
      .eq('email', email.toLowerCase())
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking subscription:', error)
      return Response.json({ error: 'Database error occurred' }, { status: 500 })
    }

    return Response.json({
      subscribed: !!subscriber && subscriber.is_active,
      subscriber: subscriber ? {
        email: subscriber.email,
        firstName: subscriber.first_name,
        subscribedAt: subscriber.subscribed_at,
        isActive: subscriber.is_active
      } : null
    })

  } catch (error) {
    console.error('Subscription check error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}