'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, Send, CheckCircle, AlertCircle, MapPin } from 'lucide-react'

// Loading skeleton component
function ContactFormSkeleton() {
  return (
    <div className="min-h-screen bg-beer-cream">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-beer-amber to-beer-gold text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-beer-cream/20 rounded-full animate-pulse" />
            <div className="h-12 bg-beer-cream/20 rounded w-3/4 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-beer-cream/20 rounded w-1/2 mx-auto animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form Skeleton */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 animate-pulse" />
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                  <div className="h-12 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                  <div className="h-12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                <div className="h-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-12 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Contact Info Skeleton */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-6 animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Contact form component with client-side logic
function ContactForm() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [responseMessage, setResponseMessage] = useState('')

  // Pre-select form type based on URL parameter
  useEffect(() => {
    const type = searchParams.get('type')
    if (type) {
      setFormData(prev => ({
        ...prev,
        type: type
      }))
    }
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For now, just show success message
      setSubmitStatus('success')
      setResponseMessage('Thank you for your message! We\'ll get back to you within 24 hours.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      })
    } catch (error) {
      setSubmitStatus('error')
      setResponseMessage('Sorry, there was an error sending your message. Please try again or email us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactReasons = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'brewery', label: 'Brewery Suggestion' },
    { value: 'feedback', label: 'Website Feedback' },
    { value: 'collaboration', label: 'Collaboration Opportunity' },
    { value: 'press', label: 'Press & Media' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="min-h-screen bg-beer-cream">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-beer-amber to-beer-gold text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-6 text-beer-cream" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-beer-cream/90">
              We'd love to hear from you! Share your thoughts, suggestions, or just say hello.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-beer-dark mb-6 flex items-center gap-3">
              <Send className="w-6 h-6 text-beer-amber" />
              Send us a Message
            </h2>

            {submitStatus !== 'idle' && (
              <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                submitStatus === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitStatus === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm">{responseMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-beer-dark mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beer-amber focus:border-beer-amber disabled:opacity-50"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-beer-dark mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beer-amber focus:border-beer-amber disabled:opacity-50"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-beer-dark mb-2">
                  What can we help you with?
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beer-amber focus:border-beer-amber disabled:opacity-50"
                >
                  {contactReasons.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-beer-dark mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beer-amber focus:border-beer-amber disabled:opacity-50"
                  placeholder="Brief description of your message"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-beer-dark mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beer-amber focus:border-beer-amber disabled:opacity-50 resize-vertical"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-beer-amber hover:bg-beer-gold text-white font-semibold py-4 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-600">
                * Required fields. We typically respond within 24 hours.
              </p>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-beer-dark mb-6">Common Questions</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-beer-dark mb-2">How do you choose which breweries to feature?</h3>
                  <p className="text-gray-700 text-sm">
                    We use AI-powered research to identify breweries with unique stories, quality beers, 
                    and significant community impact. We also welcome suggestions from beer enthusiasts!
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-beer-dark mb-2">Can I suggest a brewery for your journey?</h3>
                  <p className="text-gray-700 text-sm">
                    Absolutely! We love getting recommendations from the beer community. 
                    Use the form to tell us about amazing breweries we should explore.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-beer-dark mb-2">Do you accept guest posts or collaborations?</h3>
                  <p className="text-gray-700 text-sm">
                    We're open to partnerships with breweries, beer industry professionals, 
                    and fellow beer enthusiasts. Reach out with your collaboration ideas!
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-beer-dark mb-2">How often do you publish new content?</h3>
                  <p className="text-gray-700 text-sm">
                    We follow a weekly schedule, exploring one state per week with daily beer features 
                    and brewery spotlights throughout the 50-state journey.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-r from-beer-amber/10 to-beer-gold/10 rounded-xl p-8 border border-beer-amber/20">
              <h2 className="text-2xl font-bold text-beer-dark mb-6">Connect With Us</h2>
              
              <p className="text-gray-700 mb-6">
                Follow our beer journey and join the conversation on social media:
              </p>
              
              <div className="space-y-3">
                <a 
                  href="https://instagram.com/hopharrison"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-beer-amber hover:text-beer-gold transition-colors"
                >
                  <span className="w-8 h-8 bg-beer-amber rounded-full flex items-center justify-center text-white text-sm">📷</span>
                  Follow on Instagram
                </a>
                
                <a 
                  href="https://x.com/hop_harrison"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-beer-amber hover:text-beer-gold transition-colors"
                >
                  <span className="w-8 h-8 bg-beer-amber rounded-full flex items-center justify-center text-white text-sm">🐦</span>
                  Follow on X (Twitter)
                </a>
                
                <a 
                  href="https://www.facebook.com/profile.php?id=61578376754732"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-beer-amber hover:text-beer-gold transition-colors"
                >
                  <span className="w-8 h-8 bg-beer-amber rounded-full flex items-center justify-center text-white text-sm">📘</span>
                  Follow on Facebook
                </a>
                
                <a 
                  href="https://www.linkedin.com/in/hop-harrison-4492a6377/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-beer-amber hover:text-beer-gold transition-colors"
                >
                  <span className="w-8 h-8 bg-beer-amber rounded-full flex items-center justify-center text-white text-sm">💼</span>
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="bg-beer-amber hover:bg-beer-gold text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function ContactPage() {
  return (
    <Suspense fallback={<ContactFormSkeleton />}>
      <ContactForm />
    </Suspense>
  )
}