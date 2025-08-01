'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Metadata } from 'next'
import { CheckCircle, AlertCircle, Mail, Heart, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function UnsubscribePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [subscriber, setSubscriber] = useState<any>(null)
  const [error, setError] = useState('')
  const [isUnsubscribing, setIsUnsubscribing] = useState(false)
  const [unsubscribed, setUnsubscribed] = useState(false)
  const [reason, setReason] = useState('')
  const [customReason, setCustomReason] = useState('')

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Invalid unsubscribe link. Please check your email for the correct link.')
      setIsLoading(false)
      return
    }

    validateToken()
  }, [token])

  const validateToken = async () => {
    try {
      const response = await fetch(`/api/newsletter/unsubscribe?token=${token}`)
      const data = await response.json()

      if (response.ok) {
        setSubscriber(data.subscriber)
        if (!data.subscriber.isActive) {
          setUnsubscribed(true)
        }
      } else {
        setError(data.error || 'Invalid or expired unsubscribe token')
      }
    } catch (error) {
      setError('Failed to validate unsubscribe link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnsubscribe = async () => {
    setIsUnsubscribing(true)

    try {
      const finalReason = reason === 'other' ? customReason : reason

      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          reason: finalReason || 'No reason provided'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setUnsubscribed(true)
      } else {
        setError(data.error || 'Failed to unsubscribe. Please try again.')
      }
    } catch (error) {
      setError('Failed to unsubscribe. Please try again.')
    } finally {
      setIsUnsubscribing(false)
    }
  }

  const reasonOptions = [
    { value: 'too_frequent', label: 'Emails are too frequent' },
    { value: 'not_interested', label: 'No longer interested in craft beer content' },
    { value: 'poor_content', label: 'Content quality doesn\'t meet expectations' },
    { value: 'irrelevant', label: 'Content is not relevant to me' },
    { value: 'spam', label: 'Emails feel like spam' },
    { value: 'other', label: 'Other reason' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beer-light via-white to-beer-light/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-beer-amber border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Validating unsubscribe request...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beer-light via-white to-beer-light/50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something Went Wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link 
              href="/contact"
              className="block w-full bg-beer-amber hover:bg-beer-gold text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Contact Support
            </Link>
            <Link 
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (unsubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beer-light via-white to-beer-light/50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">You're Unsubscribed</h1>
          <p className="text-lg text-gray-600 mb-8">
            {subscriber?.isActive === false 
              ? 'You were already unsubscribed from BrewQuest Chronicles.'
              : 'You have been successfully unsubscribed from BrewQuest Chronicles. We\'re sorry to see you go!'
            }
          </p>

          <div className="bg-beer-light/20 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-beer-dark mb-4">Stay Connected</h2>
            <p className="text-gray-600 mb-4">
              Even without email updates, you can still follow Hop Harrison's 50-state beer adventure:
            </p>
            <div className="space-y-2 text-sm">
              <p>🌐 <Link href="/" className="text-beer-amber hover:underline">Visit BrewQuest Chronicles</Link></p>
              <p>🗺️ <Link href="/blog#interactive-map" className="text-beer-amber hover:underline">Track progress on our interactive map</Link></p>
              <p>📱 Follow us on social media for quick updates</p>
            </div>
          </div>

          <div className="space-y-3">
            <Link 
              href="/newsletter"
              className="block w-full bg-beer-amber hover:bg-beer-gold text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Changed Your Mind? Resubscribe
            </Link>
            <Link 
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Back to Homepage
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Thanks for being part of our journey, even if just for a while.<br/>
              <span className="text-beer-amber">🍻 Hop Harrison</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beer-light via-white to-beer-light/50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-beer-amber/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-beer-amber" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">We're Sorry to See You Go</h1>
          <p className="text-lg text-gray-600">
            {subscriber?.firstName ? `Hi ${subscriber.firstName}` : 'Hi there'}, you're about to unsubscribe from BrewQuest Chronicles.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">{subscriber?.email}</p>
              <p className="text-sm text-gray-500">
                Subscribed on {new Date(subscriber?.subscribedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Help Us Improve (Optional)
          </h2>
          <p className="text-gray-600 mb-4">
            Your feedback helps us create better content for other beer enthusiasts. 
            What's the main reason you're unsubscribing?
          </p>
          
          <div className="space-y-3">
            {reasonOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="reason"
                  value={option.value}
                  checked={reason === option.value}
                  onChange={(e) => setReason(e.target.value)}
                  className="mr-3 text-beer-amber focus:ring-beer-amber"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>

          {reason === 'other' && (
            <div className="mt-4">
              <textarea
                placeholder="Please tell us more..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-beer-amber focus:ring-2 focus:ring-beer-amber/20 resize-none"
              />
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">Before You Go...</h3>
              <p className="text-sm text-yellow-700">
                Consider that we only send one email per week (Sundays), packed with quality content 
                about craft beer adventures, brewery stories, and beer reviews. Would you like to stay for just a few more weeks?
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleUnsubscribe}
            disabled={isUnsubscribing}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUnsubscribing ? 'Unsubscribing...' : 'Confirm Unsubscribe'}
          </button>
          
          <Link 
            href="/"
            className="flex-1 bg-beer-amber hover:bg-beer-gold text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
          >
            Keep My Subscription
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Questions? <Link href="/contact" className="text-beer-amber hover:underline">Contact us</Link> and we'll help you out.
          </p>
        </div>
      </div>
    </div>
  )
}