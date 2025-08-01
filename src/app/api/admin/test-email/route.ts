export async function POST(request: Request) {
  try {
    const { adminPassword, emailType, testEmail } = await request.json()
    
    // Verify admin access
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!testEmail || !testEmail.includes('@')) {
      return Response.json({ error: 'Valid test email required' }, { status: 400 })
    }

    // Import and initialize email service only when needed
    const { ResendEmailService } = await import('@/lib/email/resendService')
    const emailService = new ResendEmailService()
    
    switch (emailType) {
      case 'welcome':
        // Create a test subscriber object
        const testSubscriber = {
          id: 'test-id',
          email: testEmail,
          first_name: 'Test User',
          subscribed_at: new Date().toISOString(),
          is_active: true,
          preferences: {
            weekly_digest: true,
            state_updates: true,
            special_announcements: true,
            unsubscribe_token: 'test-token'
          }
        }
        
        await emailService.sendWelcomeEmail(testSubscriber)
        return Response.json({ 
          success: true, 
          message: `Welcome email sent to ${testEmail}` 
        })

      case 'digest':
        const digestResults = await emailService.sendWeeklyDigest()
        return Response.json({ 
          success: true, 
          message: 'Weekly digest sent',
          stats: digestResults
        })

      case 'transition':
        const transitionResults = await emailService.sendStateTransitionEmail('Alabama', 'Alaska')
        return Response.json({ 
          success: true, 
          message: 'State transition email sent',
          stats: transitionResults
        })

      default:
        return Response.json({ error: 'Invalid email type' }, { status: 400 })
    }

  } catch (error) {
    console.error('Test email error:', error)
    return Response.json({ 
      error: 'Failed to send test email: ' + error.message 
    }, { status: 500 })
  }
}

// GET endpoint to show available test options
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminPassword = searchParams.get('admin')
    
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return Response.json({
      message: 'Email testing endpoint',
      availableTypes: [
        {
          type: 'welcome',
          description: 'Send welcome email to test address',
          method: 'POST',
          body: { adminPassword: 'your_admin_password', emailType: 'welcome', testEmail: 'test@example.com' }
        },
        {
          type: 'digest',
          description: 'Send weekly digest to all active subscribers',
          method: 'POST',
          body: { adminPassword: 'your_admin_password', emailType: 'digest' }
        },
        {
          type: 'transition',
          description: 'Send state transition email (Alabama → Alaska)',
          method: 'POST',
          body: { adminPassword: 'your_admin_password', emailType: 'transition' }
        }
      ]
    })

  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}