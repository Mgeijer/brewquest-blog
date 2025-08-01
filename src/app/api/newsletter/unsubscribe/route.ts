import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/resend'
import { render } from '@react-email/render'
import UnsubscribeEmail from '@/emails/UnsubscribeEmail'

export async function POST(request: NextRequest) {
  try {
    const { token, email, reason } = await request.json()

    if (!token && !email) {
      return NextResponse.json(
        { error: 'Either unsubscribe token or email is required' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    let query = supabase
      .from('newsletter_subscribers')
      .select('id, email, first_name, is_active')

    if (token) {
      query = query.eq('preferences->unsubscribe_token', token)
    } else {
      query = query.eq('email', email.toLowerCase())
    }

    const { data: subscriber, error: findError } = await query.single()

    if (findError || !subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found or invalid token' },
        { status: 404 }
      )
    }

    if (!subscriber.is_active) {
      return NextResponse.json({
        success: true,
        message: 'You are already unsubscribed from BrewQuest Chronicles.',
        alreadyUnsubscribed: true
      })
    }

    // Update subscriber to inactive
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
        preferences: {
          ...subscriber.preferences,
          unsubscribe_reason: reason || 'No reason provided'
        }
      })
      .eq('id', subscriber.id)

    if (updateError) {
      console.error('Error unsubscribing user:', updateError)
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      )
    }

    // Send unsubscribe confirmation email
    try {
      const unsubscribeEmailHtml = render(UnsubscribeEmail({
        subscriberName: subscriber.first_name || 'Beer Enthusiast'
      }))

      await sendEmail({
        to: subscriber.email,
        subject: 'Unsubscribed from BrewQuest Chronicles',
        html: unsubscribeEmailHtml
      })
    } catch (emailError) {
      console.error('Failed to send unsubscribe confirmation email:', emailError)
      // Don't fail the unsubscribe if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed from BrewQuest Chronicles.',
      email: subscriber.email
    })

  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to show unsubscribe form
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Unsubscribe token is required' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    const { data: subscriber, error } = await supabase
      .from('newsletter_subscribers')
      .select('email, first_name, is_active, subscribed_at')
      .eq('preferences->unsubscribe_token', token)
      .single()

    if (error || !subscriber) {
      return NextResponse.json(
        { error: 'Invalid or expired unsubscribe token' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      subscriber: {
        email: subscriber.email,
        firstName: subscriber.first_name,
        isActive: subscriber.is_active,
        subscribedAt: subscriber.subscribed_at
      },
      token
    })

  } catch (error) {
    console.error('Unsubscribe token validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}