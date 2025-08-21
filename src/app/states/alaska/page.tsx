'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Star, ExternalLink, ArrowLeft } from 'lucide-react'
import { getStateByCode } from '@/lib/data/stateProgress'
import BeerReviewCard from '@/components/blog/BeerReviewCard'

export default function AlaskaWeeklyPage() {
  const [currentDay, setCurrentDay] = useState(7) // Show all 7 days since Alaska is completed
  const alaskaState = getStateByCode('AK')
  
  // For completed states, show all content
  useEffect(() => {
    if (alaskaState?.status === 'completed') {
      setCurrentDay(7) // Show all days for completed state
    } else {
      // Keep original logic for other states
      const launchDate = new Date('2025-08-05T00:00:00.000Z')
      const now = new Date()
      
      if (now < launchDate) {
        setCurrentDay(1)
      } else {
        const today = new Date()
        const dayOfWeek = today.getDay()
        const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek
        setCurrentDay(adjustedDay)
      }
    }
  }, [alaskaState])

  if (!alaskaState) {
    return <div>Alaska data not found</div>
  }

  // Get beers up to current day (for in-progress week)
  const availableBeers = alaskaState.featuredBeers.filter(beer => beer.dayOfWeek <= currentDay)
  const isWeekComplete = currentDay >= 7

  const weeklyContent = {
    title: "Week 2: Alaska's Last Frontier Brewing - Glacial Waters and Gold Rush Heritage",
    publishDate: "2025-08-12",
    readTime: "12 min read",
    heroImage: "/images/State Images/Alaska.png"
  }

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  // Alaska brewery helper functions
  const getBreweryWebsite = (breweryName: string): string | null => {
    const breweryWebsites: Record<string, string> = {
      'Alaskan Brewing Company': 'https://alaskanbeer.com',
      'Midnight Sun Brewing Company': 'https://midnightsunbrewing.com',
      'Broken Tooth Brewing Company': 'https://brokentoothbrewing.com',
      'Denali Brewing Company': 'https://denalibrewing.com',
      'Hoodoo Brewing Company': 'https://hoodoobrew.com',
      'Anchorage Brewing Company': 'https://anchoragebrewingcompany.com',
      'King Street Brewing Company': 'https://kingstreetbrewing.com'
    }
    return breweryWebsites[breweryName] || null
  }

  const getBreweryDescription = (breweryName: string): string => {
    const breweryDescriptions: Record<string, string> = {
      'Alaskan Brewing Company': 'Founded in 1986 in Juneau, Alaskan Brewing Company is Alaska\'s oldest and largest brewery. Their mission is to brew beer using traditional methods and local ingredients. Known for their flagship Alaskan Amber based on a genuine Gold Rush-era recipe discovered in historical shipping records.',
      'Midnight Sun Brewing Company': 'Established in 1995 in Anchorage, Midnight Sun Brewing takes its name from Alaska\'s famous summer phenomenon. They focus on bold, innovative beers that push the boundaries of traditional brewing, becoming known for their extreme ABV beers and creative ingredient usage.',
      'Broken Tooth Brewing Company': 'Founded in 2014 in Anchorage, Broken Tooth Brewing celebrates Alaska\'s rugged spirit with their bold, unapologetic approach to brewing. They\'re known for creating beers that pair perfectly with Alaska\'s outdoor adventures and harsh climate conditions.',
      'Denali Brewing Company': 'Established in 2010 in Talkeetna, Denali Brewing Company takes its name from North America\'s highest peak. Located at the gateway to Denali National Park, they brew beers inspired by Alaska\'s pristine wilderness and the adventurous spirit of climbers and explorers.',
      'Hoodoo Brewing Company': 'Founded in 2012 in Fairbanks, Hoodoo Brewing Company operates in Alaska\'s interior, dealing with extreme temperature variations. They\'re known for their traditional German-style beers and their ability to maintain consistent quality despite challenging brewing conditions.',
      'Anchorage Brewing Company': 'Established in 2010 in Anchorage, Anchorage Brewing Company specializes in barrel-aged and wild ales. They\'re known for their innovative approach to fermentation and aging, creating complex beers that reflect Alaska\'s untamed wilderness character.',
      'King Street Brewing Company': 'Founded in 2015 in Anchorage, King Street Brewing Company focuses on approachable, well-crafted beers that appeal to both newcomers and beer enthusiasts. They\'re known for their community focus and dedication to supporting local Alaskan culture.'
    }
    return breweryDescriptions[breweryName] || `${breweryName} is one of Alaska's craft beer pioneers, contributing to the Last Frontier's unique brewing culture.`
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
      <div className="relative h-96 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800">
        <div className="absolute inset-0">
          <Image
            src={weeklyContent.heroImage}
            alt="Alaska Last Frontier Landscape"
            fill
            className="object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-blue-900/40 to-slate-800/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                Week {alaskaState.weekNumber}
              </div>
              <span className="text-white/90">•</span>
              <span className="text-white/90">{isWeekComplete ? 'Completed' : 'In Progress'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {weeklyContent.title}
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-white/90">
              Where pristine glacial waters meet Gold Rush heritage and frontier innovation
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
                {alaskaState.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Week Progress Indicator */}
        <div className="bg-white rounded-xl p-6 mb-8 border border-blue-500/20">
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
                        ? 'bg-blue-600 text-white animate-pulse'
                        : 'bg-blue-500/20 text-beer-dark'
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
              className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentDay / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Weekly Article Content */}
        <article className="bg-white rounded-xl p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-3xl font-bold text-beer-dark mb-6">Welcome to Alaska: The Last Frontier's Brewing Renaissance</h1>
            
            <div className="bg-blue-600/10 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
              <p className="text-lg text-beer-dark font-medium">
                This week, we're exploring Alaska's remarkable craft beer scene. From Gold Rush-era recipes to innovative breweries using spruce tips and alder-smoked malts, the Last Frontier has built one of America's most distinctive brewing cultures using pristine glacial water and frontier ingenuity.
              </p>
            </div>

            {/* Alaska State Image */}
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
              <Image
                src="/images/State Images/Alaska.png"
                alt="Alaska State Landscape"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
                <p className="text-sm font-medium text-gray-900">Alaska's pristine wilderness provides the perfect backdrop for the Last Frontier's unique craft beer renaissance.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-beer-dark mb-4">A State Forged by Frontier Innovation</h2>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Alaska's craft beer story begins in 1986 when 28-year-old Marcy and Geoff Larson founded Alaskan Brewing Company in Juneau, becoming the 67th independent brewery in the US. Their flagship Alaskan Amber was based on a genuine Gold Rush-era recipe discovered in historical shipping records.
            </p>
            
            <p className="text-gray-700 mb-8 leading-relaxed">
              Today, Alaska ranks 4th nationally in breweries per capita, with 49 breweries utilizing pristine glacial water and indigenous ingredients like Sitka spruce tips, alder-smoked malts, and wild berries to create beers that truly capture the Last Frontier spirit.
            </p>

            <h2 className="text-2xl font-bold text-beer-dark mb-4">What Makes Alaska Beer Special</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-beer-cream p-6 rounded-lg">
                <h3 className="font-bold text-beer-dark mb-3">Pristine Glacial Water</h3>
                <p className="text-gray-700 text-sm">Sourced from the Juneau Icefield and other glacial sources for exceptionally pure brewing water.</p>
              </div>
              <div className="bg-beer-cream p-6 rounded-lg">
                <h3 className="font-bold text-beer-dark mb-3">Indigenous Ingredients</h3>
                <p className="text-gray-700 text-sm">Sitka spruce tips, alder-smoked malts, and wild berries create unique Last Frontier flavors.</p>
              </div>
              <div className="bg-beer-cream p-6 rounded-lg">
                <h3 className="font-bold text-beer-dark mb-3">Gold Rush Heritage</h3>
                <p className="text-gray-700 text-sm">Modern recipes based on historical brewing records from the 1800s Gold Rush era.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-beer-dark mb-4">This Week's Journey</h2>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Each day this week, we featured a different Alaska brewery and their signature beer. From Monday's historic Alaskan Amber to Sunday's complex barrel-aged ale, you've discovered the breadth and quality of Alaska's craft beer scene.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Monday:</strong> Alaskan Brewing Company - The Gold Rush pioneer</div>
                <div><strong>Tuesday:</strong> Midnight Sun Brewing - Anchorage innovation</div>
                <div><strong>Wednesday:</strong> Broken Tooth Brewing - Rugged Alaska spirit</div>
                <div><strong>Thursday:</strong> Denali Brewing - Gateway to the wilderness</div>
                <div><strong>Friday:</strong> Hoodoo Brewing - Fairbanks tradition</div>
                <div><strong>Saturday:</strong> Anchorage Brewing - Barrel-aged excellence</div>
                <div><strong>Sunday:</strong> King Street Brewing - Community focused</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-beer-dark mb-4">Supporting Alaska Breweries</h2>
            
            <p className="text-gray-700 leading-relaxed">
              When you visit these breweries, you're not just buying great beer—you're supporting local jobs, local communities, and the preservation of Alaska's unique brewing heritage. Alaska's craft beer scene represents the frontier spirit and innovation that defines the Last Frontier.
            </p>
          </div>
        </article>

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
                    ibu: beer.ibu,
                    rating: beer.rating,
                    tasting_notes: beer.tastingNotes,
                    image_url: beer.imageUrl,
                    unique_feature: beer.description,
                    brewery_location: alaskaState.name,
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
            <div className="mt-8 p-6 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-beer-dark">Coming Tomorrow</span>
              </div>
              <p className="text-gray-700">
                Check back tomorrow for the next beer review in our Alaska journey. 
                We'll be featuring {alaskaState.featuredBeers.find(b => b.dayOfWeek === currentDay + 1)?.brewery || 'another amazing brewery'} 
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
                We've explored all 7 breweries and their signature beers from Alaska. 
                Next week, we'll be heading to Arizona for another exciting beer adventure!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}