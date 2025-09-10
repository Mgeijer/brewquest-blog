'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Star, ExternalLink, ArrowLeft } from 'lucide-react'
import { getStateByCode } from '@/lib/data/stateProgress'
import BeerReviewCard from '@/components/blog/BeerReviewCard'

export default function CaliforniaWeeklyPage() {
  const [currentDay, setCurrentDay] = useState(1) // Start with Day 1 for current states
  const californiaState = getStateByCode('CA')
  
  // For current states, show progressive content based on day
  useEffect(() => {
    if (californiaState?.status === 'current') {
      // For current states, show progressive content based on actual day
      const today = new Date()
      const dayOfWeek = today.getDay()
      const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek
      setCurrentDay(adjustedDay)
    } else if (californiaState?.status === 'completed') {
      setCurrentDay(7) // Show all days for completed state
    } else {
      setCurrentDay(1) // Upcoming states show Day 1
    }
  }, [californiaState])

  // Helper functions
  const getBreweryWebsite = (breweryName: string): string | null => {
    const breweryWebsites: Record<string, string> = {
      'Stone Brewing': 'https://stonebrewing.com',
      'Firestone Walker Brewing Company': 'https://firestonewalker.com', 
      'Russian River Brewing Company': 'https://russianriverbrewing.com',
      'AleSmith Brewing Company': 'https://alesmith.com',
      'Lagunitas Brewing Company': 'https://lagunitas.com',
      'Anchor Brewing Company': 'https://anchorbrewing.com',
      'Sierra Nevada Brewing Company': 'https://sierranevada.com'
    }
    return breweryWebsites[breweryName] || null
  }

  const getBreweryDescription = (breweryName: string): string => {
    const breweryDescriptions: Record<string, string> = {
      'Stone Brewing': 'Founded in 1996 in San Diego, Stone Brewing is one of California\'s most iconic craft breweries. Their mission is to brew bold, flavorful beers that challenge conventional expectations. Known worldwide for Stone IPA and their uncompromising commitment to hoppy beer excellence.',
      'Firestone Walker Brewing Company': 'Founded in 1996 in Paso Robles, Firestone Walker combines traditional brewing methods with modern innovation. Their mission is to create world-class beers using oak barrel fermentation and Central Coast terroir. Known for their Union Jack IPA and sophisticated barrel-aged programs.',
      'Russian River Brewing Company': 'Founded in 1997 in Santa Rosa, Russian River Brewing Company is legendary for their hop-forward beers and wild ales. Their mission is to craft exceptional beers using traditional techniques and innovation. Home of Pliny the Elder, America\'s most famous Double IPA.',
      'AleSmith Brewing Company': 'Founded in 1995 in San Diego, AleSmith Brewing Company is renowned for their high-strength, complex beers. Their mission is to create artisanal ales and lagers with meticulous attention to detail. Known for their Speedway Stout and barrel-aging expertise.',
      'Lagunitas Brewing Company': 'Founded in 1993 in Petaluma, Lagunitas Brewing Company embodies the Northern California craft beer spirit. Their mission is to brew hoppy, flavorful beers with irreverent personality. Known for their IPA and quirky, music-influenced brand culture.',
      'Anchor Brewing Company': 'Founded in 1896 in San Francisco, Anchor Brewing Company is America\'s oldest craft brewery. Their mission is to preserve traditional brewing methods while innovating for the future. Known for Anchor Steam Beer, the beer that saved American brewing tradition.',
      'Sierra Nevada Brewing Company': 'Founded in 1980 in Chico, Sierra Nevada Brewing Company launched the American craft beer revolution. Their mission is to brew the finest quality ales and lagers using whole-cone hops and sustainable practices. Known for Pale Ale, the template for American craft beer.'
    }
    return breweryDescriptions[breweryName] || `${breweryName} is one of California's craft beer pioneers, contributing to the state's remarkable brewing leadership.`
  }

  if (!californiaState) {
    return <div>California data not found</div>
  }

  // Get beers up to current day
  const availableBeers = californiaState.featuredBeers.filter(beer => beer.dayOfWeek <= currentDay)
  const isWeekComplete = currentDay >= 7

  const weeklyContent = {
    title: "Week 5: California's Golden State Brewing Revolution",
    publishDate: "2025-08-31", 
    readTime: "15 min read",
    heroImage: "/images/State Images/California.png",
    content: `
# California: Golden State Brewing Revolution

This week marks California's emergence as the undisputed leader of American craft brewing, home to legendary breweries like Sierra Nevada, Stone, Russian River, and Anchor. From San Francisco's historic steam beer to San Diego's hop-forward innovations, the Golden State combines perfect climate, innovative spirit, and pioneering brewers to create the epicenter of craft beer excellence.

## The California Advantage

### Perfect Climate 🌞
Year-round brewing weather allows for consistent production and outdoor beer culture, creating the perfect environment for craft beer innovation.

### Hop Innovation 🌿
Home to the Cascade hop and countless hop varieties, California breweries have access to the finest American hops and pioneered hop-forward brewing techniques.

### Pioneer Spirit 🏗️
From Sierra Nevada's 1980 Pale Ale launch to Stone's aggressive IPA philosophy, California breweries have consistently pushed boundaries and defined American craft beer.

## Pioneer Breweries

**Sierra Nevada Brewing Company (1980)** - The brewery that launched the American craft beer revolution with their Pale Ale, inspiring countless brewers and establishing the template for American craft beer.

**Anchor Brewing Company (1896/1965)** - America's oldest craft brewery, saved by Fritz Maytag in 1965, preserving steam beer tradition and inspiring the craft beer renaissance.

**Stone Brewing (1996)** - San Diego's hop warriors who popularized aggressive IPAs and bold, uncompromising beer flavors throughout America and beyond.

**Russian River Brewing (1997)** - Santa Rosa's masters of hop-forward brewing and wild ales, creators of Pliny the Elder, America's most coveted Double IPA.

California proves that innovation, perfect climate, and pioneering spirit combine to create the world's most influential craft beer culture.`
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
      <div className="bg-gradient-to-br from-orange-900 via-red-800 to-yellow-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 text-orange-200 mb-4">
                <Calendar className="w-5 h-5" />
                <span>{weeklyContent.publishDate}</span>
                <Clock className="w-5 h-5 ml-4" />
                <span>{weeklyContent.readTime}</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {californiaState.name}
                <span className="block text-2xl lg:text-3xl font-normal text-orange-200 mt-2">
                  Week {californiaState.weekNumber} of our 50-state journey
                </span>
              </h1>
              
              <p className="text-xl text-orange-100 leading-relaxed">
                Golden State brewing excellence - birthplace of the American craft beer revolution with pioneering breweries like Sierra Nevada, Stone, and Russian River.
              </p>
            </div>
            
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] rounded-xl overflow-hidden">
                <Image
                  src={weeklyContent.heroImage}
                  alt="California craft beer scene"
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
              <h1 className="text-3xl font-bold text-beer-dark mb-6">Welcome to California: Golden State Brewing Revolution</h1>
              
              <div className="bg-orange-600/10 border-l-4 border-orange-600 p-6 mb-8 rounded-r-lg">
                <p className="text-lg text-beer-dark font-medium">
                  This week marks California's emergence as the undisputed leader of American craft brewing, home to legendary breweries like Sierra Nevada, Stone, Russian River, and Anchor. From San Francisco's historic steam beer to San Diego's hop-forward innovations, the Golden State combines perfect climate, innovative spirit, and pioneering brewers to create the epicenter of craft beer excellence.
                </p>
              </div>

              {/* California State Image */}
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
                <Image 
                  src="/images/State Images/California.png" 
                  alt="California State Landscape" 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
                  <p className="text-sm font-medium text-gray-900">California's perfect climate and innovative spirit created the American craft beer revolution</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-beer-dark mb-4">The Birthplace of American Craft Beer</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                California's craft beer story is the story of American craft beer itself. From Fritz Maytag saving Anchor Brewing in 1965 to Ken Grossman launching Sierra Nevada in 1980, California breweries have consistently led innovation, set standards, and inspired generations of brewers worldwide.
              </p>

              <h2 className="text-2xl font-bold text-beer-dark mb-4">What Makes California Beer Special</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="font-bold text-orange-800 mb-2">🌞 Perfect Climate</h3>
                  <p className="text-sm text-gray-700">Year-round brewing weather allows for consistent production and outdoor beer culture, creating the perfect environment for craft beer innovation.</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="font-bold text-orange-800 mb-2">🌿 Hop Innovation</h3>
                  <p className="text-sm text-gray-700">Home to the Cascade hop and countless hop varieties, California breweries have access to the finest American hops and pioneered hop-forward brewing techniques.</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="font-bold text-orange-800 mb-2">🏗️ Pioneer Spirit</h3>
                  <p className="text-sm text-gray-700">From Sierra Nevada's 1980 Pale Ale launch to Stone's aggressive IPA philosophy, California breweries have consistently pushed boundaries and defined American craft beer.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-beer-dark mb-4">This Week's Journey</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {californiaState.featuredBeers.slice(0, 7).map((beer, index) => (
                  <div key={beer.id} className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-sm font-medium text-orange-600 mb-1">
                      Day {beer.dayOfWeek}
                    </div>
                    <div className="font-bold text-beer-dark text-sm">{beer.brewery}</div>
                    <div className="text-xs text-gray-600">{beer.name}</div>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-beer-dark mb-4">Supporting California Breweries</h2>
              <p className="text-gray-700 leading-relaxed">
                When you visit these California breweries, you're not just buying exceptional beer—you're supporting the institutions that created American craft beer culture. California's craft beer scene represents the perfect balance of innovation, tradition, and pioneering spirit that continues to influence brewing worldwide.
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
                  beer_name: beer.name,
                  brewery_name: beer.brewery,
                  beer_style: beer.style,
                  abv: beer.abv,
                  ibu: beer.ibu,
                  rating: beer.rating,
                  tasting_notes: beer.tastingNotes,
                  image_url: beer.imageUrl,
                  unique_feature: beer.description,
                  brewery_location: californiaState.name,
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
          
            {!isWeekComplete && californiaState.status === 'current' && (
              <div className="text-center mt-12 p-8 bg-orange-50 rounded-xl border border-orange-200">
                <h3 className="text-xl font-bold text-beer-dark mb-4">Coming Tomorrow</h3>
                <p className="text-gray-600 mb-4">
                  Day {currentDay + 1} of our California adventure brings another amazing brewery and craft beer discovery!
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