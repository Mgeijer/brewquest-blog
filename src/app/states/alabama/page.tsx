'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Star, ExternalLink, ArrowLeft } from 'lucide-react'
import { getStateByCode } from '@/lib/data/stateProgress'
import BeerReviewCard from '@/components/blog/BeerReviewCard'

export default function AlabamaWeeklyPage() {
  const [currentDay, setCurrentDay] = useState(7) // Show all 7 days since Alabama is completed
  const alabamaState = getStateByCode('AL')
  
  // For completed states, show all content
  useEffect(() => {
    if (alabamaState?.status === 'completed') {
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
  }, [alabamaState])

  if (!alabamaState) {
    return <div>Alabama data not found</div>
  }

  // Get beers up to current day (for in-progress week)
  const availableBeers = alabamaState.featuredBeers.filter(beer => beer.dayOfWeek <= currentDay)
  const isWeekComplete = currentDay >= 7

  const weeklyContent = {
    title: "Week 1: Alabama's Craft Beer Renaissance - Heart of Dixie Brewing",
    publishDate: "2025-01-27",
    readTime: "12 min read",
    heroImage: "/images/Craft-Brewery-Landscape.png",
    content: `
# Welcome to Alabama: The Heart of Dixie's Brewing Renaissance

This week, we're diving deep into Alabama's surprising and vibrant craft beer scene. From Birmingham's urban brewing culture to Mobile's coastal flavors, the Heart of Dixie has quietly built one of the South's most authentic and innovative brewing communities.

## A State Transformed by Craft

Alabama's relationship with beer has been complicated. Until 2009, it was illegal to brew beer stronger than 6% ABV in the state. The "Gourmet Beer Bill" changed everything, opening the doors for craft breweries to flourish and for beer lovers to experience the full spectrum of flavors that define modern American brewing.

Today, Alabama is home to 45+ breweries, each telling a unique story of Southern hospitality, local ingredients, and innovative brewing techniques. From Good People Brewing's flagship IPA that's been Alabama's #1 selling IPA for over a decade, to TrimTab's experimental sours that push the boundaries of what beer can be.

## What Makes Alabama Beer Special

**Local Ingredients**: Alabama brewers take advantage of local agriculture, incorporating everything from locally grown hops to regional fruits and spices.

**Southern Innovation**: These breweries aren't just copying West Coast or European styles—they're creating distinctly Southern interpretations that reflect the state's culture and climate.

**Community Focus**: Every brewery we've encountered serves as a community gathering place, supporting local causes and bringing people together over exceptional beer.

## This Week's Journey

Each day this week, we're featuring a different Alabama brewery and their signature beer. From Monday's Good People IPA to Sunday's bold imperial stout, you'll discover the breadth and quality of Alabama's craft beer scene.

**Monday**: Good People Brewing Company - The flagship that started it all
**Tuesday**: Yellowhammer Brewing - Huntsville's German-inspired tradition  
**Wednesday**: Cahaba Brewing Company - Birmingham's river-inspired ales
**Thursday**: TrimTab Brewing - Innovation meets drinkability
**Friday**: Avondale Brewing - Belgian traditions in Southern soil
**Saturday**: Back Forty Beer Company - Gadsden's hop-forward approach
**Sunday**: Monday Night Brewing - Atlanta meets Birmingham

## Supporting Local Breweries

When you visit these breweries, you're not just buying great beer—you're supporting local jobs, local agriculture, and local communities. Alabama's craft beer scene represents the best of American entrepreneurship and creativity.

Ready to explore? Let's dive into each brewery and discover what makes Alabama's craft beer scene so special.
    `
  }

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  // Brewery helper functions (same as in individual beer pages)
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
      <div className="relative h-96 bg-gradient-to-r from-beer-amber to-beer-gold">
        <div className="absolute inset-0">
          <Image
            src={weeklyContent.heroImage}
            alt="Alabama Craft Beer Scene - Good People IPA"
            fill
            className="object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-beer-dark/60 via-beer-amber/40 to-beer-gold/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                Week {alabamaState.weekNumber}
              </div>
              <span className="text-white/90">•</span>
              <span className="text-white/90">{isWeekComplete ? 'Completed' : 'In Progress'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {weeklyContent.title}
            </h1>
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
                {alabamaState.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Week Progress Indicator */}
        <div className="bg-white rounded-xl p-6 mb-8 border border-beer-amber/20">
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
                        ? 'bg-beer-amber text-white animate-pulse'
                        : 'bg-beer-amber/20 text-beer-dark'
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
              className="bg-gradient-to-r from-beer-amber to-beer-gold h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentDay / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Weekly Article Content */}
        <article className="bg-white rounded-xl p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-3xl font-bold text-beer-dark mb-6">Welcome to Alabama: The Heart of Dixie's Brewing Renaissance</h1>
            
            <div className="bg-beer-amber/10 border-l-4 border-beer-amber p-6 mb-8 rounded-r-lg">
              <p className="text-lg text-beer-dark font-medium">
                This week, we're diving deep into Alabama's surprising and vibrant craft beer scene. From Birmingham's urban brewing culture to Mobile's coastal flavors, the Heart of Dixie has quietly built one of the South's most authentic and innovative brewing communities.
              </p>
            </div>

            {/* Alabama State Image */}
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
              <Image
                src="/images/State Images/Alabama.png"
                alt="Alabama State Landscape"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
                <p className="text-sm font-medium text-gray-900">The beautiful landscapes of Alabama provide the perfect backdrop for the state's thriving craft beer renaissance.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-beer-dark mb-4">A State Transformed by Craft</h2>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Alabama's relationship with beer has been complicated. Until 2009, it was illegal to brew beer stronger than 6% ABV in the state. The "Gourmet Beer Bill" changed everything, opening the doors for craft breweries to flourish and for beer lovers to experience the full spectrum of flavors that define modern American brewing.
            </p>
            
            <p className="text-gray-700 mb-8 leading-relaxed">
              Today, Alabama is home to 45+ breweries, each telling a unique story of Southern hospitality, local ingredients, and innovative brewing techniques. From Good People Brewing's flagship IPA that's been Alabama's #1 selling IPA for over a decade, to TrimTab's experimental sours that push the boundaries of what beer can be.
            </p>

            <h2 className="text-2xl font-bold text-beer-dark mb-4">What Makes Alabama Beer Special</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-beer-cream p-6 rounded-lg">
                <h3 className="font-bold text-beer-dark mb-3">Local Ingredients</h3>
                <p className="text-gray-700 text-sm">Alabama brewers take advantage of local agriculture, incorporating everything from locally grown hops to regional fruits and spices.</p>
              </div>
              <div className="bg-beer-cream p-6 rounded-lg">
                <h3 className="font-bold text-beer-dark mb-3">Southern Innovation</h3>
                <p className="text-gray-700 text-sm">These breweries aren't just copying West Coast or European styles—they're creating distinctly Southern interpretations.</p>
              </div>
              <div className="bg-beer-cream p-6 rounded-lg">
                <h3 className="font-bold text-beer-dark mb-3">Community Focus</h3>
                <p className="text-gray-700 text-sm">Every brewery serves as a community gathering place, supporting local causes and bringing people together over exceptional beer.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-beer-dark mb-4">This Week's Journey</h2>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Each day this week, we're featuring a different Alabama brewery and their signature beer. From Monday's Good People IPA to Sunday's bold imperial stout, you'll discover the breadth and quality of Alabama's craft beer scene.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Monday:</strong> Good People Brewing Company - The flagship that started it all</div>
                <div><strong>Tuesday:</strong> Yellowhammer Brewing - Huntsville's German-inspired tradition</div>
                <div><strong>Wednesday:</strong> Cahaba Brewing Company - Birmingham's river-inspired ales</div>
                <div><strong>Thursday:</strong> TrimTab Brewing - Innovation meets drinkability</div>
                <div><strong>Friday:</strong> Avondale Brewing - Belgian traditions in Southern soil</div>
                <div><strong>Saturday:</strong> Back Forty Beer Company - Gadsden's hop-forward approach</div>
                <div><strong>Sunday:</strong> Monday Night Brewing - Atlanta meets Birmingham</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-beer-dark mb-4">Supporting Local Breweries</h2>
            
            <p className="text-gray-700 leading-relaxed">
              When you visit these breweries, you're not just buying great beer—you're supporting local jobs, local agriculture, and local communities. Alabama's craft beer scene represents the best of American entrepreneurship and creativity.
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
                    brewery_location: alabamaState.name,
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
            <div className="mt-8 p-6 bg-beer-amber/10 rounded-lg border border-beer-amber/20">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-beer-amber" />
                <span className="font-medium text-beer-dark">Coming Tomorrow</span>
              </div>
              <p className="text-gray-700">
                Check back tomorrow for the next beer review in our Alabama journey. 
                We'll be featuring {alabamaState.featuredBeers.find(b => b.dayOfWeek === currentDay + 1)?.brewery || 'another amazing brewery'} 
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
                We've explored all 7 breweries and their signature beers from Alabama. 
                Next week, we'll be heading to {/* Next state would go here */} Alaska for another exciting beer adventure!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}