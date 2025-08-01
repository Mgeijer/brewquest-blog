'use client'

import { useState } from 'react'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

interface NewsletterSignupProps {
  source?: string
  showHeader?: boolean
  className?: string
  variant?: 'default' | 'compact' | 'hero'
  endpoint?: 'signup' | 'subscribe' // Choose which endpoint to use
  showStateSelector?: boolean // Option to hide state selector for simpler form
}

export default function NewsletterSignup({ 
  source = 'newsletter-page',
  showHeader = true,
  className = '',
  variant = 'default',
  endpoint = 'signup',
  showStateSelector = true
}: NewsletterSignupProps) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    stateInterest: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const apiEndpoint = `/api/newsletter/${endpoint}`
      const requestBody = endpoint === 'subscribe' 
        ? { email: formData.email, firstName: formData.firstName || undefined }
        : {
            email: formData.email,
            firstName: formData.firstName || undefined,
            source,
            stateInterest: formData.stateInterest || undefined,
          }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (response.ok) {
        setMessageType('success')
        if (data.alreadySubscribed) {
          setMessage('You\'re already part of the BrewQuest family! Check your email for updates.')
        } else {
          setMessage(`Welcome to BrewQuest Chronicles! Check your email for a welcome message featuring ${data.currentState}.`)
        }
        setFormData({ email: '', firstName: '', stateInterest: '' })
      } else {
        setMessageType('error')
        setMessage(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      setMessageType('error')
      setMessage('Failed to subscribe. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // Variant styles
  const getContainerClass = () => {
    const baseClass = `newsletter-signup ${className}`
    
    switch (variant) {
      case 'compact':
        return `${baseClass} bg-beer-brown/20 rounded-lg p-6 border border-beer-amber/20`
      case 'hero':
        return `${baseClass} bg-gradient-to-br from-beer-dark via-beer-brown to-beer-dark rounded-xl p-8 border border-beer-amber/30 text-beer-cream`
      default:
        return `${baseClass} bg-white rounded-lg p-8 border border-gray-200 shadow-lg`
    }
  }

  const getInputClass = () => {
    switch (variant) {
      case 'hero':
        return 'w-full px-4 py-3 bg-beer-brown border border-beer-amber/30 rounded-lg text-beer-cream placeholder-beer-cream/60 focus:outline-none focus:border-beer-amber focus:ring-2 focus:ring-beer-amber/20'
      default:
        return 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-beer-amber focus:ring-2 focus:ring-beer-amber/20'
    }
  }

  const getButtonClass = () => {
    return 'w-full bg-beer-amber hover:bg-beer-gold text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
  }

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ]

  return (
    <div className={getContainerClass()}>
      {showHeader && (
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mail className={`w-8 h-8 ${variant === 'hero' ? 'text-beer-amber' : 'text-beer-brown'}`} />
            <h2 className={`text-2xl font-bold ${variant === 'hero' ? 'text-beer-cream' : 'text-beer-dark'}`}>
              Join the BrewQuest
            </h2>
          </div>
          <p className={`text-lg ${variant === 'hero' ? 'text-beer-cream/90' : 'text-gray-600'}`}>
            Get weekly updates on Hop Harrison's 50-state craft beer adventure
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${variant === 'hero' ? 'text-beer-cream' : 'text-gray-700'}`}>
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              required
              disabled={isSubmitting}
              className={`${getInputClass()} disabled:opacity-50`}
            />
          </div>

          <div>
            <label htmlFor="firstName" className={`block text-sm font-medium mb-2 ${variant === 'hero' ? 'text-beer-cream' : 'text-gray-700'}`}>
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Your first name"
              disabled={isSubmitting}
              className={`${getInputClass()} disabled:opacity-50`}
            />
          </div>
        </div>

        {showStateSelector && (
          <div>
            <label htmlFor="stateInterest" className={`block text-sm font-medium mb-2 ${variant === 'hero' ? 'text-beer-cream' : 'text-gray-700'}`}>
              Which state's beer scene interests you most?
            </label>
            <select
              id="stateInterest"
              name="stateInterest"
              value={formData.stateInterest}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`${getInputClass()} disabled:opacity-50`}
            >
              <option value="">Select a state (optional)</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={getButtonClass()}
        >
          <Mail className="w-5 h-5" />
          {isSubmitting ? 'Subscribing...' : 'Join BrewQuest Chronicles'}
        </button>

        {message && (
          <div className={`flex items-center gap-2 p-4 rounded-lg ${messageType === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {messageType === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}
      </form>

      <div className={`mt-6 text-xs ${variant === 'hero' ? 'text-beer-cream/70' : 'text-gray-500'} text-center`}>
        <p>
          By subscribing, you agree to receive weekly emails about craft beer adventures. 
          You can unsubscribe at any time. Read our{' '}
          <a href="/privacy" className="underline hover:text-beer-amber">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}