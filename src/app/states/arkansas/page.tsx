'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Star, ExternalLink, ArrowLeft } from 'lucide-react'
import { getStateByCode } from '@/lib/data/stateProgress'
import BeerReviewCard from '@/components/blog/BeerReviewCard'

export default function ArkansasWeeklyPage() {
  const [currentDay, setCurrentDay] = useState(1) // Start with Day 1 for current states
  const arkansasState = getStateByCode('AR')
  
  // For current states, show progressive content based on day
  useEffect(() => {
    if (arkansasState?.status === 'current') {
      // For current states, show progressive content based on actual day
      const today = new Date()
      const dayOfWeek = today.getDay()
      const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek
      setCurrentDay(adjustedDay)
    } else if (arkansasState?.status === 'completed') {
      setCurrentDay(7) // Show all days for completed state
    } else {
      setCurrentDay(1) // Upcoming states show Day 1
    }
  }, [arkansasState])

  // Helper functions
  const getBreweryWebsite = (breweryName: string): string | null => {
    const breweryWebsites: Record<string, string> = {
      'Lost Forty Brewing': 'https://lostforty.com',
      'Ozark Beer Company': 'https://ozarkbeer.com', 
      'Fossil Cove Brewing Company': 'https://fossilcove.com',
      'Core Brewing & Distilling Company': 'https://corebrewing.com',
      'Diamond Bear Brewing Company': 'https://diamondbear.com',
      'Flyway Brewing Company': 'https://flywaybrewing.beer',
      'Superior Bathhouse Brewery': 'https://superiorbathhouse.com'
    }
    return breweryWebsites[breweryName] || null
  }

  const getBreweryDescription = (breweryName: string): string => {
    const breweryDescriptions: Record<string, string> = {
      'Lost Forty Brewing': 'Founded in 2014 in Little Rock, Lost Forty Brewing is Arkansas\'s most awarded craft brewery. Their mission is to create world-class beer while preserving Arkansas\'s natural heritage. Known for their 2020 GABF Gold Medal winning Day Drinker Belgian Blonde, Lost Forty combines environmental consciousness with exceptional brewing craftsmanship.',
      'Ozark Beer Company': 'Founded in 2012 in Rogers, Ozark Beer Company was named one of America\'s "Most Underrated Breweries" by Paste Magazine. Their mission is to craft honest beer with Ozark Mountain pride. Known for their award-winning BDCS barrel-aged imperial stout and commitment to Northwest Arkansas craft beer culture.',
      'Fossil Cove Brewing Company': 'Founded in 2013 in Fayetteville, Fossil Cove Brewing Company draws inspiration from Arkansas\'s fossil-rich geology and brewing heritage. Their mission is to create approachable craft beer that reflects the Natural State\'s character. Known for their La Brea Brown and commitment to community-focused brewing.',
      'Core Brewing & Distilling Company': 'Founded in 2012 in Springdale, Core Brewing & Distilling Company is Arkansas\'s first combined brewery and distillery. Their mission is to produce premium craft beverages using Northwest Arkansas ingredients. Known for their Los Santos IPA and innovative approach to craft beverage production.',
      'Diamond Bear Brewing Company': 'Founded in 1993 in North Little Rock, Diamond Bear Brewing Company is Arkansas\'s first modern craft brewery. Their mission is to brew presidential-quality beer for the people of Arkansas. Known for their Presidential IPA and pioneering role in establishing Arkansas\'s craft beer industry.',
      'Flyway Brewing Company': 'Founded in 2018 in North Little Rock, Flyway Brewing Company focuses on innovative fruit-forward beers and traditional styles. Their mission is to create unique beers that showcase Arkansas\'s agricultural bounty. Known for their Bluewing Berry Wheat and creative approach to regional ingredients.',
      'Superior Bathhouse Brewery': 'Founded in 2013 in Hot Springs, Superior Bathhouse Brewery is the only brewery located in a U.S. National Park. Their mission is to brew craft beer using the legendary thermal spring water of Hot Springs National Park. Known for their historic location in a 1922 bathhouse and unique brewing water source.'
    }
    return breweryDescriptions[breweryName] || `${breweryName} is one of Arkansas's craft beer pioneers, contributing to the state's remarkable brewing renaissance.`
  }

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
          <div className="bg-white rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-beer-dark">
                Featured Beers {!isWeekComplete && `(So Far)`}
              </h2>
              <span className="text-sm text-gray-600">
                {availableBeers.length} of 7 beers reviewed
              </span>
            </div>
          
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
                  ibu: beer.ibu,
                  rating: beer.rating,
                  tasting_notes: beer.tastingNotes,
                  image_url: beer.imageUrl,
                  unique_feature: beer.description,
                  brewery_location: arkansasState.name,
                  brewery_website: getBreweryWebsite(beer.brewery),
                  brewery_story: getBreweryDescription(beer.brewery),
                  day_of_week: beer.dayOfWeek,
                  created_at: new Date(),
                  blog_post_id: '',
                }}
                size="large"
              />
            ))}
          </div>
          
            {!isWeekComplete && arkansasState.status === 'current' && (
              <div className="text-center mt-12 p-8 bg-green-50 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold text-beer-dark mb-4">Coming Tomorrow</h3>
                <p className="text-gray-600 mb-4">
                  Day {currentDay + 1} of our Arkansas adventure brings another amazing brewery and craft beer discovery!
                </p>
                <div className="text-sm text-gray-500">
                  {7 - currentDay} more beers to discover this week
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}