'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Star, ExternalLink, ArrowLeft } from 'lucide-react'
import { getStateByCode } from '@/lib/data/stateProgress'

export default function ArkansasWeeklyPage() {
  const [currentDay, setCurrentDay] = useState(7) // Show all for now to avoid build issues
  const arkansasState = getStateByCode('AR')
  
  // For current states, show progressive content based on day
  useEffect(() => {
    // Only run this on client side to avoid build issues
    if (typeof window !== 'undefined') {
      if (arkansasState?.status === 'current') {
        const today = new Date()
        const dayOfWeek = today.getDay()
        const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek
        setCurrentDay(adjustedDay)
      } else if (arkansasState?.status === 'completed') {
        setCurrentDay(7) // Show all days for completed state
      }
    }
  }, [arkansasState])

  if (!arkansasState) {
    return <div>Arkansas data not found</div>
  }

  // Get beers up to current day
  const availableBeers = arkansasState.featuredBeers.filter(beer => beer.dayOfWeek <= currentDay)
  const isWeekComplete = currentDay >= 7

  const weeklyContent = {
    title: "Week 4: Arkansas's Natural State Brewing Excellence",
    publishDate: "2025-08-24", 
    readTime: "15 min read",
    heroImage: "/images/State Images/Arkansas.png",
    content: `
# Arkansas: Natural State Brewing Excellence

This week marks Arkansas's emergence as a serious craft beer destination, crowned by Lost Forty Brewing's historic 2020 GABF Gold Medal victory. From the Ozark Mountains to the Mississippi Delta, the Natural State combines pristine water sources, innovative brewing techniques, and conservation-minded brewing to create a truly unique beer culture.

## The Arkansas Advantage

### Ozark Mountain Water 🏔️
Pure, mineral-rich water filtered through ancient limestone provides the perfect brewing foundation, rivaling the best brewing water in America.

### Thermal Spring Innovation ♨️
Hot Springs National Park hosts America's only National Park brewery, using legendary 143°F thermal spring water for brewing that exists nowhere else on Earth.

### Conservation Brewing 🌿
Arkansas breweries like Lost Forty combine world-class brewing with environmental stewardship, proving craft beer can be both excellent and sustainable.

## Pioneer Breweries

**Diamond Bear Brewing Company (1993)** - Arkansas's first modern craft brewery, establishing the foundation for the state's brewing renaissance with multiple GABF and World Beer Cup medals.

**Lost Forty Brewing (2014)** - Named after Arkansas's famous "Lost Forty" virgin forest, this Little Rock brewery achieved national recognition with their 2020 GABF Gold Medal winning Day Drinker Belgian Blonde.

**Superior Bathhouse Brewery (2013)** - The only brewery in a U.S. National Park, occupying a historic 1922 bathhouse and using Hot Springs' famous thermal water.

**Ozark Beer Company (2012)** - Named one of America's "Most Underrated Breweries" by Paste Magazine, known for their award-winning BDCS barrel-aged stout.

Arkansas proves that exceptional brewing can emerge from unexpected places, combining natural advantages with innovative techniques and environmental consciousness.`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/states" className="inline-flex items-center text-green-200 hover:text-white mb-8 group">
            <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to All States
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 text-green-200 mb-4">
                <Calendar className="w-5 h-5" />
                <span>{weeklyContent.publishDate}</span>
                <Clock className="w-5 h-5 ml-4" />
                <span>{weeklyContent.readTime}</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {arkansasState.name}
                <span className="block text-2xl lg:text-3xl font-normal text-green-200 mt-2">
                  Week {arkansasState.weekNumber} of our 50-state journey
                </span>
              </h1>
              
              <p className="text-xl text-green-100 leading-relaxed mb-8">
                Natural State brewing excellence with thermal springs, Ozark water, and GABF Gold Medal achievements showcasing Arkansas's remarkable craft beer renaissance.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/blog"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
                >
                  Read Full Story
                  <ExternalLink className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] rounded-xl overflow-hidden">
                <Image
                  src={weeklyContent.heroImage}
                  alt="Arkansas craft beer scene"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Beer Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Arkansas's Featured Beers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              {arkansasState.status === 'current' 
                ? `Experience Arkansas's brewing excellence through our daily journey. Currently showing ${currentDay} of 7 featured beers.`
                : "Discover all 7 featured beers from Arkansas's finest breweries, showcasing the Natural State's brewing diversity."
              }
            </p>
            
            {arkansasState.status === 'current' && (
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                <MapPin className="w-4 h-4" />
                Currently exploring: Arkansas (Day {currentDay} of 7)
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableBeers.map((beer) => (
              <div key={beer.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-400/40 transform hover:-translate-y-1 overflow-hidden">
                {/* Beer Image */}
                <div className="relative h-64 bg-gradient-to-br from-green-50 to-emerald-50">
                  {beer.imageUrl && (
                    <Image
                      src={beer.imageUrl}
                      alt={`${beer.name} by ${beer.brewery}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                  
                  {/* Day Badge */}
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Day {beer.dayOfWeek}
                  </div>
                  
                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold">{beer.rating}</span>
                    </div>
                  </div>
                </div>
                
                {/* Beer Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{beer.name}</h3>
                      <p className="text-green-600 font-medium">{beer.brewery}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded">{beer.style}</span>
                    <span className="font-medium">{beer.abv}% ABV</span>
                    {beer.ibu && <span>{beer.ibu} IBU</span>}
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{beer.description}</p>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Tasting Notes</h4>
                    <p className="text-sm text-gray-600">{beer.tastingNotes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {!isWeekComplete && arkansasState.status === 'current' && (
            <div className="text-center mt-12 p-8 bg-white rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">More Arkansas Beers Coming Soon</h3>
              <p className="text-gray-600 mb-4">
                We're revealing new Arkansas craft beers daily. Check back tomorrow for the next featured brewery and beer!
              </p>
              <div className="text-sm text-gray-500">
                {7 - currentDay} more beers to discover this week
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}