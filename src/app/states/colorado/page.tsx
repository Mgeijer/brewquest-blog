'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Star, ExternalLink, ArrowLeft } from 'lucide-react'
import { getStateByCode } from '@/lib/data/stateProgress'
import BeerReviewCard from '@/components/blog/BeerReviewCard'

export default function ColoradoWeeklyPage() {
  const [currentDay, setCurrentDay] = useState(1) // Start with Day 1 for current states
  const coloradoState = getStateByCode('CO')
  
  // For current states, show progressive content based on day
  useEffect(() => {
    if (coloradoState?.status === 'current') {
      // For current states, show progressive content based on actual day
      const today = new Date()
      const dayOfWeek = today.getDay()
      const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek
      setCurrentDay(adjustedDay)
    } else if (coloradoState?.status === 'completed') {
      setCurrentDay(7) // Show all days for completed state
    } else {
      setCurrentDay(1) // Upcoming states show Day 1
    }
  }, [coloradoState])

  // Helper functions
  const getBreweryWebsite = (breweryName: string): string | null => {
    const breweryWebsites: Record<string, string> = {
      'Westbound & Down Brewing': 'https://westbounddown.com',
      'New Belgium Brewing Company': 'https://www.newbelgium.com',
      'Odell Brewing Company': 'https://www.odellbrewing.com',
      'WeldWerks Brewing Company': 'https://weldwerksbrewing.com',
      'Avery Brewing Company': 'https://www.averybrewing.com',
      'Upslope Brewing Company': 'https://upslopebrewing.com',
      'Great Divide Brewing Company': 'https://greatdivide.com',
      'Left Hand Brewing Company': 'https://lefthandbrewing.com',
      'Oskar Blues Brewery': 'https://oskarblues.com',
      'Breckenridge Brewery': 'https://www.breckbrew.com'
    }
    return breweryWebsites[breweryName] || null
  }

  const getBreweryDescription = (breweryName: string): string => {
    const breweryDescriptions: Record<string, string> = {
      'Westbound & Down Brewing': 'Founded in 2016 in Idaho Springs, Westbound & Down brings California brewing expertise to Colorado\'s mountains. Their GABF Gold-winning Select IPA represents the perfect fusion of West Coast hop character with Rocky Mountain water.',
      'New Belgium Brewing Company': 'Founded in 1991 in Fort Collins by Jeff Lebesch and Kim Jordan, New Belgium is famous for Fat Tire Amber Ale and environmental sustainability. As America\'s first carbon-neutral brewery, they perfectly embody Colorado\'s outdoor lifestyle and pioneering spirit in craft brewing.',
      'Odell Brewing Company': 'Founded in 1989 in Fort Collins by Doug Odell, Odell Brewing is known for their flagship IPA and represents the evolution of traditional brewing in the American craft context with Rocky Mountain character.',
      'WeldWerks Brewing Company': 'Founded in 2015 in Greeley, WeldWerks has rapidly become Colorado\'s most awarded brewery, earning national recognition for their exceptional New England IPAs like Juicy Bits and setting new standards for hop-forward brewing.',
      'Avery Brewing Company': 'Founded in 1993 in Boulder by Adam Avery, Avery created Colorado\'s first packaged IPA, pioneering the state\'s hop-forward beer culture and helping establish Colorado as a major player in the American IPA revolution.',
      'Upslope Brewing Company': 'Founded in 2008 in Boulder, Upslope Brewing is named after Colorado\'s famous snow-dumping weather pattern. Their Craft Lager showcases pure mountain brewing with all-malted barley and authentic Colorado character.',
      'Great Divide Brewing Company': 'Founded in 1994 in Denver by Brian Dunn, Great Divide is renowned for bold, intense beers like Yeti Imperial Stout. They represent Colorado\'s fearless approach to brewing big beers that stand up to the rugged Rocky Mountain environment.',
      'Left Hand Brewing Company': 'Founded in 1993 in Longmont by Eric Wallace and Dick Doore, Left Hand pioneered nitro canning technology with their famous Milk Stout Nitro. They represent Colorado\'s technical brewing excellence and innovation in beer experience.',
      'Oskar Blues Brewery': 'Founded in 1997 in Lyons by Dale Katechis, Oskar Blues created America\'s first hand-canned craft beer with Dale\'s Pale Ale in 2002, revolutionizing craft beer packaging and changing perceptions about canned craft beer.',
      'Breckenridge Brewery': 'Founded in 1990 in Breckenridge by Richard Squire, Breckenridge Brewery showcases Colorado\'s creativity in flavor innovation with their famous Vanilla Porter, demonstrating the quality ingredients Colorado brewers source for unique mountain-inspired beers.'
    }
    return breweryDescriptions[breweryName] || `${breweryName} is one of Colorado's craft beer pioneers, contributing to the state's position as America's craft beer capital.`
  }

  // Use the centralized Colorado beer data from stateProgress.ts
  const coloradoBeers = coloradoState?.featuredBeers.map(beer => ({
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
    day_of_week: beer.dayOfWeek,
    created_at: new Date(),
    blog_post_id: ''
  })) || []

  if (!coloradoState) {
    return <div>Colorado data not found</div>
  }

  // Get beers up to current day
  const availableBeers = coloradoBeers.filter(beer => beer.day_of_week <= currentDay)
  const isWeekComplete = currentDay >= 7

  const weeklyContent = {
    title: "Week 6: Colorado's Mile High Brewing Excellence",
    publishDate: "2025-09-07", 
    readTime: "15 min read",
    heroImage: "/images/State Images/Colorado.png",
  }

  return (
    <div className="min-h-screen bg-white">
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

      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 text-blue-200 mb-4">
                <Calendar className="w-5 h-5" />
                <span>{weeklyContent.publishDate}</span>
                <Clock className="w-5 h-5 ml-4" />
                <span>{weeklyContent.readTime}</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {coloradoState.name}
                <span className="block text-2xl lg:text-3xl font-normal text-blue-200 mt-2">
                  Week {coloradoState.weekNumber} of our 50-state journey
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 leading-relaxed">
                America's craft beer capital with the highest brewery density in the nation - home to pioneering breweries like New Belgium, Great Divide, and Oskar Blues.
              </p>
            </div>
            
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] rounded-xl overflow-hidden">
                <Image
                  src={weeklyContent.heroImage}
                  alt="Colorado craft beer scene"
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

      {/* Weekly Article Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white rounded-xl p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              <h1 className="text-3xl font-bold text-beer-dark mb-6">Welcome to Colorado: America's Craft Beer Capital</h1>
              
              <div className="bg-blue-600/10 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
                <p className="text-lg text-beer-dark font-medium">
                  Colorado leads the nation with the highest brewery density in America - over 425 breweries creating world-class beer at mile-high altitude. From New Belgium's pioneering sustainability to Great Divide's bold imperial stouts, Colorado combines Rocky Mountain water, innovative spirit, and outdoor culture to create the epicenter of American craft brewing.
                </p>
              </div>

              {/* Colorado State Image */}
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
                <Image 
                  src="/images/State Images/Colorado.png" 
                  alt="Colorado State Landscape" 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
                  <p className="text-sm font-medium text-gray-900">Colorado's Rocky Mountain water and mile-high altitude create perfect brewing conditions</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-beer-dark mb-4">America's Craft Beer Capital</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                With over 425 breweries and the highest brewery density in America, Colorado didn't just join the craft beer revolution - they led it. From New Belgium's Fat Tire introducing millions to craft beer to Oskar Blues revolutionizing canning, Colorado breweries have consistently pushed boundaries and set industry standards.
              </p>

              <h2 className="text-2xl font-bold text-beer-dark mb-4">What Makes Colorado Beer Special</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-bold text-blue-800 mb-2">🏔️ Rocky Mountain Water</h3>
                  <p className="text-sm text-gray-700">Pure mountain snowmelt creates some of the world's finest brewing water, providing the perfect foundation for Colorado's legendary beers.</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-bold text-blue-800 mb-2">🚀 Innovation Leadership</h3>
                  <p className="text-sm text-gray-700">Colorado breweries pioneered nitro canning, sustainable brewing, and craft beer canning, constantly pushing the industry forward with groundbreaking innovations.</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-bold text-blue-800 mb-2">🌟 Outdoor Culture</h3>
                  <p className="text-sm text-gray-700">Colorado's adventure lifestyle perfectly complements craft beer culture, creating breweries that celebrate both bold flavors and outdoor living.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-beer-dark mb-4">This Week's Journey</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {coloradoBeers.slice(0, 7).map((beer, index) => (
                  <div key={beer.id} className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-sm font-medium text-blue-600 mb-1">
                      Day {beer.day_of_week}
                    </div>
                    <div className="font-bold text-beer-dark text-sm">{beer.brewery_name}</div>
                    <div className="text-xs text-gray-600">{beer.beer_name}</div>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-beer-dark mb-4">Supporting Colorado Breweries</h2>
              <p className="text-gray-700 leading-relaxed">
                When you visit these Colorado breweries, you're not just buying exceptional beer—you're supporting the institutions that created America's craft beer culture. Colorado's brewery density and innovation leadership continue to influence brewing worldwide, making every pint a contribution to craft beer's future.
              </p>
            </div>
          </article>
        </div>
      </section>

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
                  beer_name: beer.beer_name,
                  brewery_name: beer.brewery_name,
                  beer_style: beer.beer_style,
                  abv: beer.abv,
                  ibu: beer.ibu,
                  rating: beer.rating,
                  tasting_notes: beer.tasting_notes,
                  image_url: beer.image_url,
                  unique_feature: beer.unique_feature,
                  brewery_location: coloradoState.name,
                  brewery_website: getBreweryWebsite(beer.brewery_name),
                  brewery_story: getBreweryDescription(beer.brewery_name),
                  day_of_week: beer.day_of_week,
                  created_at: new Date(),
                  blog_post_id: '',
                }}
                size="large"
              />
            ))}
          </div>
          
            {!isWeekComplete && coloradoState.status === 'current' && (
              <div className="text-center mt-12 p-8 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-beer-dark mb-4">Coming Tomorrow</h3>
                <p className="text-gray-600 mb-4">
                  Day {currentDay + 1} of our Colorado adventure brings another amazing brewery and craft beer discovery!
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