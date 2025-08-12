'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Mountain, Clock, Calendar } from 'lucide-react'

interface Beer {
  id: string
  name: string
  brewery: string
  location: string
  style: string
  abv: number
  description: string
  image: string
  rating: number
  day_of_week: number
}

interface DynamicBeerSectionProps {
  stateCode: string
  stateName: string
  title?: string
  description?: string
  imagePathMapping?: Record<string, string>
  fallbackDescription?: string
}

export default function DynamicBeerSection({
  stateCode,
  stateName,
  title,
  description,
  imagePathMapping = {},
  fallbackDescription = "Exceptional craft beer from America's brewing scene."
}: DynamicBeerSectionProps) {
  const [publishedBeers, setPublishedBeers] = useState<Beer[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPublished, setTotalPublished] = useState(0)
  const [weekNumber, setWeekNumber] = useState(0)
  const [stateStatus, setStateStatus] = useState('')
  
  useEffect(() => {
    const fetchPublishedBeers = async () => {
      try {
        const response = await fetch(`/api/states/${stateCode.toLowerCase()}/published-beers`)
        if (response.ok) {
          const data = await response.json()
          
          // Map database beer reviews to display format
          const mappedBeers = data.published_beers.map((beer: any) => ({
            id: beer.id,
            name: beer.beer_name,
            brewery: beer.brewery_name,
            location: beer.brewery_location || stateName,
            style: beer.beer_style,
            abv: beer.abv,
            description: beer.tasting_notes || beer.description || fallbackDescription,
            image: getImagePath(beer.beer_name),
            rating: beer.rating,
            day_of_week: beer.day_of_week
          }))
          
          setPublishedBeers(mappedBeers)
          setTotalPublished(data.total_published)
          setWeekNumber(data.week)
          setStateStatus(data.status)
        } else {
          console.error(`Failed to fetch published beers for ${stateCode}`)
          setPublishedBeers([])
        }
      } catch (error) {
        console.error(`Error fetching published beers for ${stateCode}:`, error)
        setPublishedBeers([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchPublishedBeers()
  }, [stateCode, stateName, fallbackDescription])
  
  // Helper function to map beer names to image paths
  const getImagePath = (beerName: string) => {
    return imagePathMapping[beerName] || '/images/Beer images/placeholder.png'
  }

  // Helper function to get brewery websites
  const getBreweryWebsite = (breweryName: string): string | null => {
    const breweryWebsites: Record<string, string> = {
      // Alaska breweries
      'Alaskan Brewing Company': 'https://alaskanbeer.com',
      'Midnight Sun Brewing': 'https://midnightsunbrewing.com',
      'King Street Brewing': 'https://kingstreetbrewing.com',
      'Cynosure Brewing': 'https://cynosurebrewing.com',
      'Resolution Brewing': 'https://resolutionbrewing.com',
      'HooDoo Brewing': 'https://hoodoobrewing.com',
      'Broken Tooth Brewing': 'https://brokentoothbrewing.com',
      
      // Alabama breweries
      'Good People Brewing Company': 'https://goodpeoplebrewing.com',
      'Yellowhammer Brewing': 'https://yellowhammerbrewery.com',
      'Cahaba Brewing Company': 'https://cahababrewing.com',
      'TrimTab Brewing Company': 'https://trimtabbrewing.com',
      'Avondale Brewing Company': 'https://avondalebrewing.com',
      'Back Forty Beer Company': 'https://backfortybeer.com',
      'Monday Night Brewing (Birmingham Social Club)': 'https://mondaynight.beer/birmingham',
      
      // Add more brewery websites as needed for other states
    }
    return breweryWebsites[breweryName] || null
  }

  const sectionTitle = title || `${stateName}'s Daily Beer Journey`
  const sectionDescription = description || 
    (loading ? 
      'Loading the latest published beers...' :
      totalPublished === 0 ? 
        'Beer reviews are published daily. Check back soon for featured craft beer selections!' :
        totalPublished === 7 ? 
          `All seven of ${stateName}'s featured beers have been published! Discover the complete brewing journey.` :
          `${totalPublished} of 7 ${stateName} craft beers published so far. New beers are added daily as part of our week-long exploration.`
    )

  return (
    <section id="beers" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {sectionDescription}
          </p>
          
          {!loading && totalPublished > 0 && totalPublished < 7 && stateStatus === 'current' && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-blue-600">
              <Clock className="w-4 h-4" />
              <span>Next beer publishes daily at 3 PM EST</span>
            </div>
          )}

          {!loading && stateStatus === 'upcoming' && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-orange-600">
              <Calendar className="w-4 h-4" />
              <span>This state's journey begins in Week {weekNumber}</span>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : publishedBeers.length === 0 ? (
          <div className="text-center py-12">
            <Mountain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {stateStatus === 'upcoming' ? 
                `${stateName}'s journey starts soon` : 
                'No beers published yet'
              }
            </h3>
            <p className="text-gray-500">
              {stateStatus === 'upcoming' ? 
                `Stay tuned for Week ${weekNumber} when we explore ${stateName}'s craft beer scene!` :
                `${stateName}'s craft beer journey begins soon! Beer reviews are published daily.`
              }
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedBeers.map((beer, index) => (
              <Link
                key={beer.id}
                href={`/beers/${beer.id}`}
                className="group bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border hover:border-blue-200"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={beer.image}
                    alt={`${beer.name} from ${beer.brewery}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {beer.abv}% ABV
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
                      Day {beer.day_of_week}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {beer.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <p className="text-blue-600 font-semibold">{beer.brewery}</p>
                        {getBreweryWebsite(beer.brewery) && (
                          <a
                            href={getBreweryWebsite(beer.brewery)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Visit Website →
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{beer.location} • {beer.style}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {beer.description}
                  </p>
                  
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-semibold group-hover:text-blue-700 transition-colors">
                    Read Full Review
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}