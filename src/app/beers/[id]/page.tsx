'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MapPin, Calendar, Star, Hop, Wheat, Droplets } from 'lucide-react'
import { BeerReview } from '@/lib/data/stateProgress'
import { getAllStateProgress } from '@/lib/supabase/functions/stateProgressFunctions'
import { getCurrentState } from '@/lib/data/stateProgress'

export default function BeerReviewPage() {
  const params = useParams()
  const [beer, setBeer] = useState<BeerReview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stateName, setStateName] = useState('')

  // Get the beer ID from params
  const beerId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : null

  useEffect(() => {
    const loadBeerReview = async () => {
      try {
        setIsLoading(true)
        
        console.log('🔍 Loading beer with ID:', beerId)
        
        if (!beerId) {
          console.error('No beer ID provided')
          return
        }

        // Always start with local data since it has the beer details
        const localStateData = getCurrentState()
        console.log('📊 Local state data:', localStateData)
        
        if (!localStateData || !localStateData.featuredBeers) {
          console.error('No local state data available')
          return
        }

        // Find the specific beer by ID
        const foundBeer = localStateData.featuredBeers.find(beer => beer.id === beerId)
        console.log('🍺 Found beer:', foundBeer)
        
        if (foundBeer) {
          setBeer(foundBeer)
          setStateName(localStateData.name)
          console.log('✅ Beer loaded successfully:', foundBeer.name)
        } else {
          console.error('❌ Beer not found with ID:', beerId)
          console.log('Available beer IDs:', localStateData.featuredBeers.map(b => b.id))
        }
        
      } catch (error) {
        console.error('Error loading beer review:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBeerReview()
  }, [beerId])

  const getABVColor = (abv: number) => {
    if (abv < 4) return 'text-green-600'
    if (abv < 6) return 'text-yellow-600'
    if (abv < 8) return 'text-orange-600'
    return 'text-red-600'
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-beer-amber fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getDayName = (dayOfWeek: number) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return days[dayOfWeek - 1] || 'Unknown'
  }

  const getBreweryWebsite = (breweryName: string): string | null => {
    const breweryWebsites: Record<string, string> = {
      'Good People Brewing Company': 'https://goodpeoplebrewing.com',
      'Yellowhammer Brewing': 'https://yellowhammerbrewery.com',
      'Cahaba Brewing Company': 'https://cahababrewing.com',
      'TrimTab Brewing Company': 'https://trimtabbrewing.com',
      'Avondale Brewing Company': 'https://avondalebrewing.com',
      'Back Forty Beer Company': 'https://backfortybeer.com',
      'Monday Night Brewing (Birmingham Social Club)': 'https://mondaynight.beer/birmingham'
    }
    return breweryWebsites[breweryName] || null
  }

  const getBreweryDescription = (breweryName: string): string => {
    const breweryDescriptions: Record<string, string> = {
      'Good People Brewing Company': 'Founded in 2008 in Birmingham, Good People Brewing is Alabama\'s largest craft brewery. Their mission is simple: to make good beer for good people. Known for their flagship IPA that\'s been Alabama\'s #1 selling craft beer for over a decade.',
      'Yellowhammer Brewing': 'Established in 2013 in Huntsville, Yellowhammer Brewing takes its name from the state bird of Alabama. They focus on traditional German brewing techniques while incorporating Southern flavors and local ingredients.',
      'Cahaba Brewing Company': 'Established in 2012, Cahaba Brewing takes its name from the Cahaba River that flows through Birmingham. They\'re known for creating approachable, drinkable beers that pair perfectly with Alabama\'s outdoor lifestyle and river adventures.',
      'TrimTab Brewing Company': 'Founded in 2014, TrimTab Brewing is known for their innovative approach to beer making, especially their exceptional sour beers and fruit-forward creations. Located in Birmingham\'s historic warehouse district.',
      'Avondale Brewing Company': 'Opening in 2014 in the historic Avondale neighborhood of Birmingham, this brewery focuses on Belgian-inspired ales and traditional European styles, bringing old-world brewing techniques to Alabama.',
      'Back Forty Beer Company': 'Located in Gadsden since 2009, Back Forty Beer Company takes its name from the back forty acres of farmland. They\'re known for their bold, hop-forward beers and strong connection to Alabama\'s agricultural heritage.',
      'Monday Night Brewing (Birmingham Social Club)': 'The Birmingham location of the popular Atlanta-based brewery, known for their bold, innovative beers and strong community focus. They bring their signature style and social atmosphere to Alabama.'
    }
    return breweryDescriptions[breweryName] || `${breweryName} is one of Alabama's craft beer pioneers, contributing to the state's growing reputation for quality brewing.`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-beer-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beer-amber mx-auto mb-4"></div>
          <p className="text-gray-600">Loading beer review...</p>
        </div>
      </div>
    )
  }

  if (!beer) {
    return (
      <div className="min-h-screen bg-beer-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Beer Review Not Found</h1>
          <p className="text-gray-600 mb-6">The beer review you're looking for doesn't exist.</p>
          <Link 
            href="/blog"
            className="bg-beer-amber text-white px-6 py-3 rounded-lg hover:bg-beer-gold transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-beer-cream">
      {/* Header */}
      <div className="bg-gradient-to-r from-beer-amber to-beer-gold text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                  {beer.dayOfWeek}
                </div>
                <div className="text-sm opacity-90">
                  Day {beer.dayOfWeek} • {getDayName(beer.dayOfWeek)}
                </div>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{beer.name}</h1>
              <p className="text-xl opacity-90 mb-4">{beer.brewery}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {stateName}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Week 1
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src={beer.imageUrl || '/images/beer-placeholder.jpg'}
                  alt={beer.name}
                  width={300}
                  height={300}
                  className="rounded-lg shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Beer Stats */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-6">Beer Details</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-beer-amber/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wheat className="w-8 h-8 text-beer-amber" />
              </div>
              <div className="font-semibold text-beer-dark">{beer.style}</div>
              <div className="text-sm text-gray-600">Style</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-beer-amber/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Droplets className={`w-8 h-8 ${getABVColor(beer.abv)}`} />
              </div>
              <div className={`font-semibold ${getABVColor(beer.abv)}`}>{beer.abv}%</div>
              <div className="text-sm text-gray-600">ABV</div>
            </div>
            
            {beer.ibu && (
              <div className="text-center">
                <div className="w-16 h-16 bg-beer-amber/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Hop className="w-8 h-8 text-green-600" />
                </div>
                <div className="font-semibold text-beer-dark">{beer.ibu}</div>
                <div className="text-sm text-gray-600">IBU</div>
              </div>
            )}
            
            <div className="text-center">
              <div className="w-16 h-16 bg-beer-amber/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="flex">
                  {getRatingStars(beer.rating).slice(0, 1)}
                </div>
              </div>
              <div className="font-semibold text-beer-dark">{beer.rating}/5</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="text-center mb-8">
            <div className="flex justify-center gap-1 mb-2">
              {getRatingStars(beer.rating)}
            </div>
            <p className="text-gray-600">Our Rating: {beer.rating} out of 5 stars</p>
          </div>
        </div>

        {/* Description & Tasting Notes */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-xl font-bold text-beer-dark mb-4">About This Beer</h3>
            <p className="text-gray-700 leading-relaxed">{beer.description}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-xl font-bold text-beer-dark mb-4">Tasting Notes</h3>
            <p className="text-gray-700 leading-relaxed">{beer.tastingNotes}</p>
          </div>
        </div>

        {/* Brewery Info */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h3 className="text-xl font-bold text-beer-dark mb-4">About {beer.brewery}</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                {getBreweryDescription(beer.brewery)}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  Located in {stateName}
                </div>
                {getBreweryWebsite(beer.brewery) && (
                  <div className="flex items-center gap-2">
                    <a
                      href={getBreweryWebsite(beer.brewery)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-beer-amber hover:text-beer-gold transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit Brewery Website
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-beer-dark mb-2">Part of Our Journey</h4>
                <p className="text-sm text-gray-600">
                  This beer is featured as Day {beer.dayOfWeek} of our {stateName} craft beer exploration, 
                  representing the best of what the state has to offer.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-beer-dark mb-2">Find This Beer</h4>
                <p className="text-sm text-gray-600">
                  Visit {beer.brewery} directly or look for {beer.name} at select Alabama craft beer retailers 
                  and restaurants throughout the state.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-beer-amber hover:text-beer-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Reviews
          </Link>
          
          <Link 
            href={`/states/${stateName.toLowerCase().replace(/\s+/g, '-')}`}
            className="bg-beer-amber text-white px-6 py-3 rounded-lg hover:bg-beer-gold transition-colors"
          >
            Explore {stateName}
          </Link>
        </div>
      </div>
    </div>
  )
}