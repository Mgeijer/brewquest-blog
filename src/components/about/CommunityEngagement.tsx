'use client'

import { Heart, Mail, MessageCircle, Share2, Star, Users } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function CommunityEngagement() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Successfully subscribed! Thank you for joining.')
        setEmail('')
      } else {
        setMessage(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      setMessage('Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="bg-gradient-to-br from-beer-dark to-beer-brown text-white rounded-xl p-8 lg:p-12">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-beer-amber rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join the Beer Journey</h2>
          <p className="text-beer-cream/80 text-lg max-w-2xl mx-auto">
            Your input makes this AI-powered exploration even better. Help shape the journey 
            and discover amazing breweries together!
          </p>
        </div>

        {/* Engagement Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Share Your Favorites */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
            <div className="w-12 h-12 bg-beer-amber/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-beer-amber" />
            </div>
            <h3 className="font-bold text-lg mb-2">Share Your Favorites</h3>
            <p className="text-beer-cream/70 text-sm mb-4">
              Know an incredible brewery we should feature? Send us your recommendations!
            </p>
            <Link 
              href="/contact?type=brewery" 
              className="text-beer-amber hover:text-beer-gold font-semibold text-sm transition-colors"
            >
              Suggest a Brewery →
            </Link>
          </div>

          {/* Leave Feedback */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
            <div className="w-12 h-12 bg-beer-amber/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-beer-amber" />
            </div>
            <h3 className="font-bold text-lg mb-2">Leave Feedback</h3>
            <p className="text-beer-cream/70 text-sm mb-4">
              Your thoughts help improve our research and storytelling approach.
            </p>
            <Link 
              href="/contact?type=feedback" 
              className="text-beer-amber hover:text-beer-gold font-semibold text-sm transition-colors"
            >
              Share Feedback →
            </Link>
          </div>

          {/* Connect & Share */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-beer-amber/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-6 h-6 text-beer-amber" />
            </div>
            <h3 className="font-bold text-lg mb-2">Connect & Share</h3>
            <p className="text-beer-cream/70 text-sm mb-4">
              Follow the journey and share your own beer adventures with the community.
            </p>
            <Link 
              href="/states"
              className="text-beer-amber hover:text-beer-gold font-semibold text-sm transition-colors"
            >
              Follow Journey →
            </Link>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div id="newsletter" className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-beer-amber" />
            <h3 className="text-xl font-bold">Never Miss a Beer Story</h3>
          </div>
          <p className="text-beer-cream/80 mb-6 max-w-xl mx-auto">
            Get weekly updates delivered straight to your inbox. New state explorations, 
            brewery discoveries, and the best beer stories from across America.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-beer-amber focus:ring-2 focus:ring-beer-amber/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-beer-amber hover:bg-beer-gold text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          
          {message && (
            <p className={`text-xs mt-2 ${message.includes('Successfully') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}
          
          <p className="text-beer-cream/60 text-xs mt-3">
            Join 47+ beer enthusiasts following the journey
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-beer-amber mb-1">47</div>
            <div className="text-beer-cream/70 text-sm">Newsletter Subscribers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-beer-amber mb-1">12</div>
            <div className="text-beer-cream/70 text-sm">Brewery Suggestions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-beer-amber mb-1">28</div>
            <div className="text-beer-cream/70 text-sm">Community Comments</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-beer-amber mb-1">7</div>
            <div className="text-beer-cream/70 text-sm">States Recommended</div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-8 pt-8 border-t border-white/20">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-beer-amber" />
            <span className="text-beer-cream/80 font-medium">Powered by Community</span>
          </div>
          <p className="text-beer-cream/70 text-sm max-w-2xl mx-auto">
            This journey is made possible by beer lovers like you. Every recommendation, 
            every piece of feedback, and every shared story helps create a richer experience 
            for the entire craft beer community.
          </p>
        </div>
      </div>
    </div>
  )
} 