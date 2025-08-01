import { ResendEmailService } from '@/lib/email/resendService'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email, firstName, source = 'website', stateInterest } = await request.json()

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Valid email required' }, { status: 400 })
    }

    const emailService = new ResendEmailService()
    
    // Add subscriber to database with additional metadata
    const subscriber = await emailService.addSubscriber(email, firstName, source)
    
    // Send welcome email
    await emailService.sendWelcomeEmail(subscriber)
    
    return Response.json({
      success: true,
      message: 'Welcome to BrewQuest Chronicles! Check your email for a welcome message.',
      subscriberId: subscriber.id
    })

  } catch (error) {
    console.error('Newsletter signup error:', error)
    
    if (error.message?.includes('duplicate') || error.code === '23505') {
      return Response.json({
        success: true,
        message: 'You are already subscribed to BrewQuest Chronicles!',
        alreadySubscribed: true
      }, { status: 200 })
    }
    
    return Response.json({ 
      error: 'Subscription failed. Please try again.' 
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