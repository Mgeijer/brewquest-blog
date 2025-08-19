import { Metadata } from 'next'
import NewsletterSignup from '@/components/newsletter/NewsletterSignup'
import { Mail, MapPin, Calendar, Users, Star, Zap } from 'lucide-react'
import DynamicCurrentState from '@/components/newsletter/DynamicCurrentState'
import { getCurrentState, getStateTitle } from '@/lib/data/stateProgress'

export const metadata: Metadata = {
  title: 'Join BrewQuest Chronicles Newsletter | Hop Harrison',
  description: 'Stay updated on Hop Harrison\'s 50-state craft beer adventure. Get weekly brewery stories, beer reviews, and exclusive content delivered to your inbox.',
  openGraph: {
    title: 'Join BrewQuest Chronicles Newsletter',
    description: 'Stay updated on Hop Harrison\'s 50-state craft beer adventure with weekly updates.',
    type: 'website',
  },
}

export default function NewsletterPage() {
  const currentState = getCurrentState()
  const stateTitle = getStateTitle(currentState?.code || '')
  const benefits = [
    {
      icon: Calendar,
      title: 'Weekly Updates',
      description: 'Get fresh content every Sunday with a comprehensive recap of the week\'s beer adventures.'
    },
    {
      icon: Star,
      title: 'Exclusive Reviews',
      description: 'Detailed beer reviews and brewery insights you won\'t find anywhere else.'
    },
    {
      icon: MapPin,
      title: 'State-by-State Journey',
      description: 'Follow along as we explore all 50 states, one week at a time.'
    },
    {
      icon: Users,
      title: 'Community Stories',
      description: 'Meet the passionate brewers and beer enthusiasts shaping America\'s craft scene.'
    },
    {
      icon: Zap,
      title: 'Early Access',
      description: 'Be the first to know about new destinations, special events, and collaboration announcements.'
    },
    {
      icon: Mail,
      title: 'No Spam Promise',
      description: 'Quality over quantity - only valuable content, delivered once per week.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah M.',
      location: 'Denver, CO',
      quote: 'Hop\'s weekly emails are like getting a postcard from a beer-loving friend. I look forward to them every Sunday!'
    },
    {
      name: 'Mike R.',
      location: 'Austin, TX',
      quote: 'The brewery recommendations have been spot-on. I\'ve discovered so many hidden gems through BrewQuest Chronicles.'
    },
    {
      name: 'Jessica L.',
      location: 'Portland, OR',
      quote: 'Love following the journey! The stories behind the breweries are just as interesting as the beer reviews.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-beer-light via-white to-beer-light/50">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-beer-amber/10 text-beer-amber px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Mail className="w-4 h-4" />
              Join 2,500+ Beer Enthusiasts
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-beer-dark mb-6">
              Never Miss a <span className="text-beer-amber">BrewQuest</span> Moment
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join Hop Harrison's epic 50-state craft beer adventure. Get weekly updates, 
              exclusive brewery stories, and insider beer reviews delivered straight to your inbox.
            </p>
          </div>

          {/* Current State Highlight */}
          <DynamicCurrentState />
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <NewsletterSignup 
            source="newsletter-page"
            variant="hero"
            showHeader={false}
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-beer-dark mb-4">
              What You'll Get Every Week
            </h2>
            <p className="text-lg text-gray-600">
              Each Sunday, discover new breweries, taste amazing beers, and meet passionate craft beer makers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 hover:bg-beer-light/20 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-beer-amber/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-beer-amber" />
                    </div>
                    <h3 className="text-lg font-semibold text-beer-dark">
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sample Content Preview */}
      <section className="py-16 px-4 bg-gradient-to-r from-beer-dark to-beer-brown text-beer-cream">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What a Weekly Email Looks Like</h2>
            <p className="text-beer-cream/90 text-lg">
              Here's a preview of the quality content you'll receive every Sunday
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 text-gray-800 shadow-xl">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Mail className="w-4 h-4" />
                From: hop@hopharrison.com
              </div>
              <h3 className="text-xl font-bold text-beer-dark">
                🍺 Week Complete: {currentState?.name || 'Current State'} {stateTitle}
              </h3>
              <p className="text-sm text-gray-500">Sunday, January 7, 2024</p>
            </div>

            <div className="space-y-4 text-sm leading-relaxed">
              <p><strong>Hey Beer Enthusiast!</strong></p>
              
              <p>
                What a week it's been exploring {currentState?.name || 'the current state'}'s craft beer scene! From innovative brewing techniques to unique local ingredients across {currentState?.totalBreweries || 'numerous'} breweries, 
                {currentState?.name || 'this state'} has amazed me with its brewing ingenuity.
              </p>

              <p><strong>🌟 This Week's Standout Beers:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                {currentState?.featuredBeers?.slice(0, 3).map((beer, index) => (
                  <li key={index}>{beer.name} ({beer.rating}/5) - {beer.description.split('.')[0]}</li>
                )) || [
                  <li key="1">Featured Beer 1 (4.0/5) - Flagship offering</li>,
                  <li key="2">Featured Beer 2 (4.5/5) - Innovative brewing</li>,
                  <li key="3">Featured Beer 3 (4.5/5) - Local favorite</li>
                ]}
              </ul>

              <p><strong>🏭 Brewery Spotlight:</strong> {currentState?.featuredBeers?.[0]?.brewery || 'Featured Brewery'}</p>
              <p>
                {currentState?.featuredBeers?.[0]?.brewery || 'This brewery'} represents 
                {currentState?.name || 'the state'}'s craft beer innovation, using local ingredients and traditional techniques to create unique and memorable beers...
              </p>

              <p className="text-center text-gray-500 italic">
                [Continue reading full review and next week's preview...]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-beer-light/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-beer-dark mb-4">
              What Fellow Beer Lovers Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of craft beer enthusiasts following the journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg border border-gray-100"
              >
                <div className="mb-4">
                  <div className="flex text-beer-amber mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                </div>
                <div className="border-t pt-4">
                  <p className="font-semibold text-beer-dark">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-beer-amber to-beer-gold text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Join the Adventure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Don't miss out on America's greatest craft beer journey. 
            Subscribe now and get your first weekly update this Sunday!
          </p>
          
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 max-w-md mx-auto">
            <p className="text-sm mb-4 opacity-90">
              📧 Next email: Sunday at 9 AM EST<br/>
              🍺 Current focus: {currentState?.name || 'Current state'} craft breweries<br/>
              👥 Join 2,500+ subscribers
            </p>
            <a 
              href="#signup"
              className="inline-block bg-white text-beer-amber font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Subscribe Now - It's Free!
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}