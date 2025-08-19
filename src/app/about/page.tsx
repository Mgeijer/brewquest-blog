import AITransparencyDisclosure from '@/components/about/AITransparencyDisclosure'
import CommunityEngagement from '@/components/about/CommunityEngagement'
import InteractiveMapSectionWrapper from '@/components/about/InteractiveMapSectionWrapper'
import StoryTimeline from '@/components/about/StoryTimeline'
import { getJourneyProgress, getAllStatesData, getCurrentState } from '@/lib/data/stateProgress'
import { MapPin, TrendingUp } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Hop Harrison | AI-Powered Beer Journey Across America',
  description: 'Meet Hop Harrison and learn about the AI-powered beer journey across all 50 states. Discover how we combine artificial intelligence with genuine passion to explore America\'s craft beer scene.',
  keywords: ['craft beer', 'AI beer journey', 'Hop Harrison', 'brewery exploration', 'beer stories', 'artificial intelligence', 'interactive map', 'beer analytics'],
  openGraph: {
    title: 'About Hop Harrison | AI-Powered Beer Journey',
    description: 'Discover how AI technology and genuine passion combine to explore America\'s craft beer landscape. Track our journey with an interactive map.',
    type: 'website',
    images: [
      {
        url: '/images/hop-harrison-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Hop Harrison Beer Journey Interactive Map',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Hop Harrison | AI-Powered Beer Journey',
    description: 'Follow the AI-powered journey across America\'s craft beer landscape with our interactive map.',
    images: ['/images/hop-harrison-hero.jpg'],
  },
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  const progress = getJourneyProgress()
  const stateProgressData = getAllStatesData()
  const currentState = getCurrentState()

  return (
    <div className="min-h-screen bg-beer-cream">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Hop Harrison",
            "description": "Learn about the AI-powered beer journey across America's craft beer landscape",
            "url": "https://hopharrison.com/about",
            "mainEntity": {
              "@type": "Person",
              "name": "Hop Harrison",
              "description": "AI-powered beer explorer documenting America's craft beer scene",
              "sameAs": ["https://hopharrison.com"]
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://hopharrison.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "About",
                  "item": "https://hopharrison.com/about"
                }
              ]
            }
          })
        }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-beer-amber via-beer-gold to-beer-brown text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                <MapPin className="w-6 h-6 text-beer-cream" />
                <span className="text-beer-cream/90 font-medium">
                  Currently exploring: Week {currentState?.weekNumber || 1} of 50
                </span>
                <TrendingUp className="w-4 h-4 text-beer-cream/70" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                A Beer Journey Powered by{' '}
                <span className="text-beer-cream">Passion</span>{' '}
                and{' '}
                <span className="text-beer-cream">AI</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-beer-cream/90 mb-8 leading-relaxed">
                When life keeps you from your dream trip, technology helps you explore anyway
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 border border-white/20">
                <p className="text-lg text-beer-cream/95 leading-relaxed">
                  <strong>Ever dream of traveling to all 50 states to discover America's best craft beer?</strong> I did too. 
                  When life made that journey impossible, I found another way. Meet my AI beer buddy—a passionate 
                  researcher and storyteller who's embarking on this adventure for me, one state at a time.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/blog"
                  className="bg-white text-beer-dark hover:bg-beer-cream font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg"
                >
                  Read the Stories
                </Link>
                <Link 
                  href="/states"
                  className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-lg transition-colors inline-block text-center"
                >
                  Follow the Journey
                </Link>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="w-full h-full bg-beer-dark/30 rounded-xl flex items-center justify-center relative overflow-hidden">
                  {/* Hop Harrison Image */}
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/HopHarrison Profile Pic.png"
                      alt="Hop Harrison with craft beer and US map"
                      fill
                      className="object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-beer-dark/60 to-transparent rounded-xl" />
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-beer-dark text-center">
                      <div className="font-bold text-lg">{progress.completed}/50 States</div>
                      <div className="text-sm opacity-70">{progress.percentage}% Complete</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-beer-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-beer-dark mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A 4-step process that combines AI research power with human passion and oversight
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-beer-amber rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-beer-dark mb-4">Research</h3>
              <p className="text-gray-600 leading-relaxed">
                My AI beer buddy researches each state's craft beer scene, identifying the most interesting 
                breweries and unique beers through comprehensive data analysis.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-beer-amber rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-beer-dark mb-4">Discover</h3>
              <p className="text-gray-600 leading-relaxed">
                Deep dive into brewery histories, brewing techniques, and the passionate people behind 
                each operation to uncover the stories worth telling.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-beer-amber rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-beer-dark mb-4">Create</h3>
              <p className="text-gray-600 leading-relaxed">
                Craft engaging stories about the people and passion behind each pint, focusing on what 
                makes each brewery special and their impact on local communities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-beer-amber rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-bold text-beer-dark mb-4">Verify</h3>
              <p className="text-gray-600 leading-relaxed">
                Human review ensures accuracy and authenticity, maintaining the genuine spirit of craft 
                brewing while celebrating the community that makes it special.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-beer-dark mb-6">
                The Story Behind
                <span className="block text-beer-amber">The Journey</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  <strong>Full transparency:</strong> While I can't physically visit every brewery, my AI companion 
                  does the heavy lifting on research, discovery, and storytelling. Every brewery featured is real, 
                  every beer is carefully selected, and every story is worth telling.
                </p>
                <p>
                  Think of it as having the world's most dedicated beer researcher who never gets tired and always 
                  finds the hidden gems. This AI-powered approach lets me explore and share America's incredible 
                  craft beer stories in a way that wouldn't otherwise be possible.
                </p>
                <p>
                  It's about discovery, learning, and sharing authentic brewery stories while being completely 
                  transparent about how we make it happen. The passion is real, the research is thorough, 
                  and the stories celebrate the amazing people behind America's craft beer renaissance.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="/images/HopHarrison Half Body.png"
                alt="Hop Harrison exploring breweries"
                width={500}
                height={600}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-beer-amber text-white p-6 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">AI + Passion</div>
                <div className="text-sm">Perfect Research</div>
                <div className="text-sm">Authentic Stories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Journey Map Section */}
      <InteractiveMapSectionWrapper stateData={stateProgressData} />

      {/* AI Transparency Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AITransparencyDisclosure />
        </div>
      </section>

      {/* Story Timeline */}
      <section className="py-20 bg-beer-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StoryTimeline />
        </div>
      </section>

      {/* Community Engagement */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CommunityEngagement />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-beer-amber to-beer-gold text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join the AI-Powered Beer Journey?
          </h2>
          <p className="text-xl text-beer-cream/90 mb-8 max-w-2xl mx-auto">
            Follow along as we discover America's best craft beer stories, one state at a time. 
            Honest research, authentic passion, and the world's most dedicated beer-loving AI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/blog"
              className="bg-white text-beer-dark hover:bg-beer-cream font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg"
            >
              Read the Stories
            </Link>
            <Link 
              href="/states"
              className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              Follow the Journey
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-beer-cream/80 text-sm max-w-3xl mx-auto">
              <strong>Complete transparency:</strong> This journey is powered by artificial intelligence and driven by genuine passion for craft beer. 
              Every brewery featured is real, every story is researched for accuracy, and every recommendation celebrates 
              the incredible people behind America's craft beer renaissance.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
} 