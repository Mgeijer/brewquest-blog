import { ResendEmailService } from '@/lib/email/resendService'

export async function POST(request: Request) {
  try {
    const { email, firstName } = await request.json()
    
    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Valid email required' }, { status: 400 })
    }
    
    const emailService = new ResendEmailService()
    
    // Add subscriber to database
    const subscriber = await emailService.addSubscriber(email, firstName)
    
    // Send welcome email
    await emailService.sendWelcomeEmail(subscriber)
    
    return Response.json({ 
      success: true, 
      message: 'Welcome email sent! Check your inbox.',
      subscriberId: subscriber.id
    })
    
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    
    if (error.message?.includes('duplicate')) {
      return Response.json({ 
        success: true,
        message: 'You are already subscribed to BrewQuest Chronicles!',
        alreadySubscribed: true
      }, { status: 200 }) // Return 200 for duplicate since it's not really an error
    }
    
    // Check for table not exists error
    if (error.message?.includes('Newsletter subscribers table does not exist')) {
      return Response.json({ 
        error: 'Newsletter system not yet configured. Please contact support.',
        details: 'Database table missing'
      }, { status: 503 })
    }
    
    return Response.json({ 
      error: 'Subscription failed. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}