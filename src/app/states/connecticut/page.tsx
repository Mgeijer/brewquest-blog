'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Star, ExternalLink, ArrowLeft, Loader2 } from 'lucide-react'
import BeerReviewCard from '@/components/blog/BeerReviewCard'
import { supabase } from '@/lib/supabase/client'

interface BeerReview {
  id: string
  beer_name: string
  brewery_name: string
  beer_style: string
  abv: number
  ibu?: number
  rating: number
  tasting_notes: string
  image_url?: string
  unique_feature: string
  day_of_week: number
  created_at: Date
  blog_post_id: string
}

interface StateProgress {
  id: string
  state_code: string
  state_name: string
  status: 'upcoming' | 'current' | 'completed'
  week_number: number
  blog_post_id?: string
  region: string
  description?: string
  total_breweries: number
}

export default function ConnecticutWeeklyPage() {
  const [currentDay, setCurrentDay] = useState(1)
  const [connecticutState, setConnecticutState] = useState<StateProgress | null>(null)
  const [beerReviews, setBeerReviews] = useState<BeerReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchConnecticutData() {
      try {
        // Fetch Connecticut state data from database
        const { data: stateData, error: stateError } = await supabase
          .from('state_progress')
          .select('*')
          .eq('state_code', 'CT')
          .single()

        if (stateError) throw stateError
        setConnecticutState(stateData)

        // Fetch beer reviews for Connecticut
        if (stateData?.blog_post_id) {
          const { data: beers, error: beersError } = await supabase
            .from('beer_reviews')
            .select('*')
            .eq('blog_post_id', stateData.blog_post_id)
            .order('day_of_week', { ascending: true })

          if (!beersError && beers) {
            setBeerReviews(beers)
          }
        }

        // Set current day based on state status
        if (stateData?.status === 'current') {
          const today = new Date()
          const dayOfWeek = today.getDay()
          const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek
          setCurrentDay(adjustedDay)
        } else if (stateData?.status === 'completed') {
          setCurrentDay(7)
        }
      } catch (error) {
        console.error('Error fetching Connecticut data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConnecticutData()
  }, [])

  const getBreweryWebsite = (breweryName: string): string | null => {
    const breweryWebsites: Record<string, string> = {
      'Two Roads Brewing Company': 'https://tworoadsbrewing.com',
      'New England Brewing Company': 'https://newenglandbrewing.com',
      'Thimble Island Brewing Company': 'https://thimbleislandbrewery.com',
      'Thomas Hooker Brewing Company': 'https://hookerbeer.com',
      'Back East Brewing Company': 'https://backeastbrewing.com',
      'City Steam Brewery': 'https://citysteambrewerycafe.com',
      'Firefly Hollow Brewing Company': 'https://fireflyhollow.com'
    }
    return breweryWebsites[breweryName] || null
  }

  const getBreweryDescription = (breweryName: string): string => {
    const breweryDescriptions: Record<string, string> = {
      'Two Roads Brewing Company': 'Founded in 2012 in Stratford by four friends with deep beer industry experience, Two Roads operates out of a historic 1911 US Baird factory building. Their Worker\'s Comp Saison showcases their commitment to authentic farmhouse-style brewing.',
      'New England Brewing Company': 'One of Connecticut\'s pioneering craft breweries, founded in Woodbridge. Known for innovative hop-forward beers and traditional New England brewing styles.',
      'Thimble Island Brewing Company': 'Named after the Thimble Islands off the Connecticut coast, this Branford brewery blends coastal influence with New England brewing traditions.',
      'Thomas Hooker Brewing Company': 'Named after Connecticut\'s founder, this Hartford-area brewery honors the state\'s colonial heritage while pushing modern brewing boundaries.',
      'Back East Brewing Company': 'A Bloomfield brewery known for sessionable ales and commitment to approachable, quality craft beer that represents Connecticut\'s brewing culture.',
      'City Steam Brewery': 'Hartford\'s historic brewery café, bringing craft beer culture to Connecticut\'s capital city with a focus on traditional and innovative styles.',
      'Firefly Hollow Brewing Company': 'A Bristol farmhouse brewery that embodies Connecticut\'s agricultural heritage and commitment to rustic, authentic brewing.'
    }
    return breweryDescriptions[breweryName] || `${breweryName} represents Connecticut's thriving craft beer scene.`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Connecticut's craft beer journey...</p>
        </div>
      </div>
    )
  }

  if (!connecticutState) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connecticut data not found</h2>
          <Link href="/states" className="text-amber-600 hover:text-amber-700">
            ← Back to States
          </Link>
        </div>
      </div>
    )
  }

  const availableBeers = beerReviews.filter(beer => beer.day_of_week <= currentDay)
  const isWeekComplete = currentDay >= 7

  const weeklyContent = {
    title: `Week ${connecticutState.week_number}: Connecticut's Constitution State Brewing`,
    publishDate: "2025-10-21",
    readTime: "15 min read",
    heroImage: "/images/State Images/Connecticut.png",
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px]">
        <Image
          src={weeklyContent.heroImage}
          alt="Connecticut craft beer landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {connecticutState.status === 'current' ? 'In Progress' :
                 connecticutState.status === 'completed' ? 'Completed' : 'Coming Soon'}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                Week {connecticutState.week_number} • State {connecticutState.week_number} of 50
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {weeklyContent.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{weeklyContent.publishDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{weeklyContent.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{connecticutState.total_breweries || 109} Breweries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-700 leading-relaxed">
            {connecticutState.description ||
             "Welcome to Connecticut, the Constitution State, where New England brewing tradition meets modern innovation. With over 100 breweries blending colonial heritage with cutting-edge techniques, Connecticut's craft beer scene represents the perfect fusion of history and creativity."}
          </p>
        </div>

        {/* Progress Indicator */}
        {connecticutState.status === 'current' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {currentDay}/7
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Week {connecticutState.week_number} In Progress - Day {currentDay}
                </h3>
                <p className="text-gray-700 mb-4">
                  {isWeekComplete
                    ? "This week's Connecticut beer journey is complete! All 7 featured beers are now available."
                    : `We're currently on Day ${currentDay} of our Connecticut beer journey. Check back daily for new beer reviews!`}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentDay / 7) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Beer Reviews Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Connecticut Beers
            </h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="font-semibold">{availableBeers.length} of 7 Featured</span>
            </div>
          </div>

          {availableBeers.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <p className="text-gray-600 text-lg">
                Beer reviews coming soon! Check back on Monday for our first Connecticut featured beer.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {availableBeers.map((beer) => (
                <BeerReviewCard
                  key={beer.id}
                  review={beer}
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary Section (shown when week is complete) */}
        {isWeekComplete && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Connecticut Beer Journey Complete! 🍺
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              We've explored {connecticutState.total_breweries || 109} breweries across Connecticut,
              featuring 7 exceptional beers that showcase the Constitution State's brewing excellence.
              From farmhouse saisons to innovative IPAs, Connecticut proves that great things come from
              New England brewing tradition.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {connecticutState.total_breweries || 109}+
                </div>
                <div className="text-gray-600">Connecticut Breweries</div>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">7</div>
                <div className="text-gray-600">Featured Beers</div>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {connecticutState.week_number}
                </div>
                <div className="text-gray-600">Week of Journey</div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <Link
            href="/states"
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-4 rounded-lg hover:bg-amber-700 transition-colors font-semibold text-lg"
          >
            Explore More States
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
