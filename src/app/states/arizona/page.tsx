'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Star, ExternalLink, ArrowLeft } from 'lucide-react'
import { getStateByCode } from '@/lib/data/stateProgress'
import BeerReviewCard from '@/components/blog/BeerReviewCard'

export default function ArizonaWeeklyPage() {
  const [currentDay, setCurrentDay] = useState(1)
  const arizonaState = getStateByCode('AZ')
  
  useEffect(() => {
    if (arizonaState?.status === 'completed') {
      setCurrentDay(7) // Show all days for completed state
    } else if (arizonaState?.status === 'current') {
      // Calculate current day for Arizona (Week 3, started Aug 18)
      const weekStartDate = new Date('2025-08-18T00:00:00.000Z')
      const now = new Date()
      
      if (now < weekStartDate) {
        setCurrentDay(1)
      } else {
        const daysDiff = Math.floor((now.getTime() - weekStartDate.getTime()) / (1000 * 60 * 60 * 24))
        const calculatedDay = Math.min(daysDiff + 1, 7)
        // Force to 3 for Wednesday
        setCurrentDay(3)
      }
    } else {
      setCurrentDay(1)
    }
  }, [arizonaState])

  if (!arizonaState) {
    return <div>Arizona data not found</div>
  }

  // Get beers up to current day
  const availableBeers = arizonaState.featuredBeers.filter(beer => beer.dayOfWeek <= currentDay)
  const isWeekComplete = currentDay >= 7

  const weeklyContent = {
    title: "Week 3: Arizona's Desert Brewing Renaissance",
    publishDate: "2025-08-18", 
    readTime: "12 min read",
    heroImage: "/images/State Images/Arizona.png"
  }

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  // Arizona brewery websites
  const getBreweryWebsite = (breweryName: string): string | null => {
    const breweryWebsites: Record<string, string> = {
      'Four Peaks Brewing': 'https://fourpeaks.com',
      'SanTan Brewing': 'https://santanbrewing.com',
      'Sonoran Brewing Company': 'https://sonoranbrewing.com',
      'Mother Percolator': 'https://motherpercolator.com',
      'Wren House Brewing': 'https://wrenhousebrewing.com',
      'Dragoon Brewing': 'https://dragoonbrewing.com',
      'Arizona Wilderness': 'https://azwbeer.com',
      'Tombstone Brewing': 'https://tombstonebrewing.com'
    }
    return breweryWebsites[breweryName] || null
  }

  const getBreweryDescription = (breweryName: string): string => {
    const breweryDescriptions: Record<string, string> = {
      'Four Peaks Brewing': 'Founded in 1996 in Tempe, Four Peaks Brewing is Arizona\'s largest craft brewery. Their mission is simple: to make good beer for good people. Known for their flagship Kilt Lifter Scottish Ale that\'s been Arizona\'s #1 selling craft beer for over a decade, establishing the foundation for Arizona\'s craft beer renaissance.',
      'SanTan Brewing': 'Established in 2007 in Chandler, SanTan Brewing takes its name from the nearby Salt River and Tan Mountains. They focus on innovative brewing techniques while incorporating local desert ingredients, becoming pioneers in solar-powered brewing operations that harness Arizona\'s abundant sunshine.',
      'Sonoran Brewing Company': 'Founded in 2012 in Phoenix, Sonoran Brewing Company celebrates the unique terroir of the Sonoran Desert. They\'re known for creating beers that incorporate indigenous desert ingredients like prickly pear cactus, creating distinctive flavor profiles that capture the essence of Arizona\'s landscape.',
      'Mother Percolator': 'Located in Flagstaff at 7,000 feet elevation, Mother Percolator specializes in high-altitude brewing with pine-scented mountain air creating unique fermentation conditions. Founded in 2014, they\'re known for their innovative approach to mountain brewing and coffee-beer collaborations.',
      'Wren House Brewing': 'Phoenix neighborhood brewery that has become an institution, bridging diverse communities over locally-made beer and celebrating Arizona\'s indigenous heritage.',
      'Dragoon Brewing': 'Tucson-based brewery inspired by the Sonoran Desert, incorporating prickly pear, cholla buds, and desert sage into their seasonal beer programs.',
      'Arizona Wilderness': 'Focused on foraging programs and heritage grain revival, partnering with University of Arizona to revive ancestral brewing techniques and indigenous ingredients.',
      'Tombstone Brewing': 'Operating in the historic Wild West town since 1996, Tombstone Brewing connects modern craft beer to Arizona\'s frontier heritage in the "Town Too Tough to Die".'
    }
    return breweryDescriptions[breweryName] || `${breweryName} is one of Arizona's craft beer pioneers, contributing to the state's desert brewing renaissance.`
  }

  return (
    <div className="min-h-screen bg-beer-cream">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-beer-amber hover:text-beer-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="absolute inset-0">
          <Image
            src={weeklyContent.heroImage}
            alt="Arizona Desert Landscape"
            fill
            className="object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/60 via-orange-500/40 to-red-500/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                Week {arizonaState.weekNumber}
              </div>
              <span className="text-white/90">•</span>
              <span className="text-white/90">{isWeekComplete ? 'Completed' : 'In Progress'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {weeklyContent.title}
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-white/90">
              Where desert innovation meets thousand-year brewing traditions
            </p>
            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {weeklyContent.publishDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {weeklyContent.readTime}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {arizonaState.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Week Progress Indicator */}
        <div className="bg-white rounded-xl p-6 mb-8 border border-red-500/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-beer-dark">Week Progress</h2>
            <span className="text-sm text-gray-600">
              Day {currentDay} of 7 • {availableBeers.length} beers tasted
            </span>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map((day, index) => {
              const dayNumber = index + 1
              const isActive = dayNumber <= currentDay
              const isCurrent = dayNumber === currentDay && !isWeekComplete
              
              return (
                <div
                  key={day}
                  className={`text-center p-2 rounded-lg text-xs ${
                    isActive
                      ? isCurrent
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-red-500/20 text-beer-dark'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <div className="font-medium">{day.slice(0, 3)}</div>
                  <div className="text-xs mt-1">
                    {isActive ? '🍺' : '⏳'}
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-600 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentDay / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Arizona Stats */}
        <div className="bg-white rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-beer-dark mb-4">Arizona by the Numbers</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-1">108</div>
              <div className="text-sm text-gray-600">Active Breweries</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-1">#8</div>
              <div className="text-sm text-gray-600">Per Capita Rank</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-1">$2.1B</div>
              <div className="text-sm text-gray-600">Economic Impact</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-1">11,000+</div>
              <div className="text-sm text-gray-600">Jobs Created</div>
            </div>
          </div>
        </div>

        {/* Beer Reviews Section */}
        <div className="bg-white rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-beer-dark">
              Featured Beers {!isWeekComplete && `(So Far)`}
            </h2>
            <span className="text-sm text-gray-600">
              {availableBeers.length} of 7 beers reviewed
            </span>
          </div>

          {availableBeers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Beer reviews will appear here as the week progresses...</p>
              <p className="text-sm mt-2">Check back tomorrow for the first beer review!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {availableBeers.map((beer) => (
                <BeerReviewCard
                  key={beer.id}
                  review={{
                    id: beer.id,
                    beer_name: beer.name,
                    brewery_name: beer.brewery,
                    beer_style: beer.style,
                    abv: beer.abv,
                    ibu: beer.ibu || 0,
                    rating: beer.rating,
                    tasting_notes: beer.tastingNotes,
                    image_url: beer.imageUrl,
                    unique_feature: beer.description,
                    brewery_location: arizonaState.name,
                    brewery_website: getBreweryWebsite(beer.brewery),
                    brewery_story: getBreweryDescription(beer.brewery),
                    day_of_week: beer.dayOfWeek,
                    created_at: new Date()
                  }}
                  size="large"
                />
              ))}
            </div>
          )}

          {!isWeekComplete && currentDay < 7 && (
            <div className="mt-8 p-6 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="font-medium text-beer-dark">Coming Tomorrow</span>
              </div>
              <p className="text-gray-700">
                Check back tomorrow for the next beer review in our Arizona journey. 
                We'll be featuring {arizonaState.featuredBeers.find(b => b.dayOfWeek === currentDay + 1)?.brewery || 'another amazing brewery'} 
                with their signature brew.
              </p>
            </div>
          )}

          {isWeekComplete && (
            <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Week Complete!</span>
              </div>
              <p className="text-green-700">
                We've explored all 7 breweries and their signature beers from Arizona. 
                Next week, we'll be heading to Colorado for another exciting beer adventure!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}