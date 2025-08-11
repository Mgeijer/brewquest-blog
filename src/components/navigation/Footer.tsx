'use client'

import { Facebook, Instagram, Mail, MapPin, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface CurrentState {
  state_name: string
  week_number: number
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [currentState, setCurrentState] = useState<CurrentState | null>(null)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    const fetchCurrentState = async () => {
      try {
        const response = await fetch('/api/states/progress?include_stats=true')
        const data = await response.json()
        
        const current = data.states?.find((state: any) => state.status === 'current')
        const completed = data.statistics?.completed_states || 0
        
        if (current) {
          setCurrentState({
            state_name: current.state_name,
            week_number: current.week_number
          })
        }
        setCompletedCount(completed)
      } catch (error) {
        console.error('Error fetching current state:', error)
        // Fallback to default values
        setCurrentState({ state_name: 'Alabama', week_number: 1 })
        setCompletedCount(0)
      }
    }

    fetchCurrentState()
  }, [])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || 'Successfully subscribed! Check your email for a welcome message.')
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

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/hopharrison', color: 'hover:text-pink-500' },
    { name: 'Twitter', icon: Twitter, href: 'https://x.com/hop_harrison', color: 'hover:text-blue-400' },
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61578376754732', color: 'hover:text-blue-600' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/hop-harrison-4492a6377/', color: 'hover:text-blue-500' },
  ]

  const navigationLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'States', href: '/states' },
    { name: 'About', href: '/about' },
  ]

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <footer className="bg-beer-dark text-beer-cream">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-beer-amber rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">HH</span>
              </div>
              <h3 className="text-xl font-bold">Hop Harrison</h3>
            </div>
            <p className="text-beer-cream/80 mb-6 text-sm leading-relaxed">
              Join me on an epic 50-state journey exploring the breweries, flavors, and passionate people behind America's craft beer renaissance.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-beer-amber" />
                <span>
                  {currentState ? 
                    `Currently exploring: ${currentState.state_name} (State ${currentState.week_number} of 50)` :
                    'Loading journey progress...'
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-beer-amber" />
                <a href="mailto:hello@hopharrison.com" className="hover:text-beer-amber transition-colors">
                  hello@hopharrison.com
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-beer-cream/80 hover:text-beer-amber transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Content Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog?category=reviews" className="text-beer-cream/80 hover:text-beer-amber transition-colors">
                  Beer Reviews
                </Link>
              </li>
              <li>
                <Link href="/blog?category=breweries" className="text-beer-cream/80 hover:text-beer-amber transition-colors">
                  Brewery Stories
                </Link>
              </li>
              <li>
                <Link href="/blog?featured=true" className="text-beer-cream/80 hover:text-beer-amber transition-colors">
                  Featured Posts
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-beer-cream/80 text-sm mb-4">
              Get updates on my 50-state beer adventures and discover new breweries!
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-beer-brown border border-beer-amber/30 rounded-lg text-beer-cream placeholder-beer-cream/60 focus:outline-none focus:border-beer-amber focus:ring-1 focus:ring-beer-amber text-sm disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-beer-amber hover:bg-beer-gold text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
              {message && (
                <p className={`text-xs ${message.includes('Successfully') ? 'text-green-400' : 'text-red-400'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Social Media & Bottom Bar */}
      <div className="border-t border-beer-brown">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-beer-cream/80">Follow the journey:</span>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-8 h-8 bg-beer-brown hover:bg-beer-amber rounded-full flex items-center justify-center transition-all duration-200 ${social.color}`}
                      aria-label={`Follow on ${social.name}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Copyright & Legal */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-beer-cream/60">
              <div className="flex gap-4">
                {legalLinks.map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href}
                    className="hover:text-beer-amber transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/admin"
                  className="hover:text-beer-amber transition-colors opacity-30 hover:opacity-100"
                  title="Admin Access"
                >
                  Admin
                </Link>
              </div>
              <div className="hidden md:block">|</div>
              <p>© {currentYear} Hop Harrison. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 