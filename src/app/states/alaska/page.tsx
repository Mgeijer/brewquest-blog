'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { ArrowRight, Mountain, Snowflake, Anchor, Clock } from 'lucide-react'

const alaskaBeers = [
  {
    id: 'alaskan-amber',
    name: 'Alaskan Amber',
    brewery: 'Alaskan Brewing Company',
    location: 'Juneau',
    style: 'American Amber Ale',
    abv: 5.3,
    description: 'Based on a Gold Rush-era recipe discovered in historical records, this flagship amber uses traditional Bohemian Saaz hops for a perfectly balanced malt-forward experience.',
    image: '/images/Beer images/Alaska/Alaskan Amber.png',
    featured: true
  },
  {
    id: 'sockeye-red-ipa',
    name: 'Sockeye Red IPA',
    brewery: 'Midnight Sun Brewing',
    location: 'Anchorage',
    style: 'Red IPA',
    abv: 5.7,
    description: 'Bold Pacific Northwest-style IPA with distinctive red hue from specialty malts. Aggressively hopped with Centennial, Cascade, and Simcoe varieties.',
    image: '/images/Beer images/Alaska/Sockeye-Red.png',
    featured: true
  },
  {
    id: 'chocolate-coconut-porter',
    name: 'Chocolate Coconut Porter',
    brewery: 'King Street Brewing',
    location: 'Anchorage',
    style: 'Flavored Porter',
    abv: 6.0,
    description: 'Robust porter infused with cacao nibs and hand-toasted coconut, creating a smooth, velvety texture with tropical undertones.',
    image: '/images/Beer images/Alaska/Chocolate Coconut Porter.jpeg',
    featured: true
  },
  {
    id: 'belgian-triple',
    name: 'Belgian Triple',
    brewery: 'Cynosure Brewing',
    location: 'Anchorage',
    style: 'Belgian Tripel',
    abv: 9.7,
    description: 'Deceptively smooth despite its strength, featuring subtle spice and fruit tones with pale gold appearance and complex Belgian yeast character.',
    image: '/images/Beer images/Alaska/Belgian Triple.jpeg',
    featured: true
  },
  {
    id: 'ne-ipa',
    name: 'New England IPA',
    brewery: 'Resolution Brewing',
    location: 'Anchorage',
    style: 'New England IPA',
    abv: 6.2,
    description: 'Soft, luscious mouthfeel with Citra, El Dorado, and Mosaic hops creating notes of mango creamsicle and pineapple. Double dry-hopped perfection.',
    image: '/images/Beer images/Alaska/A deal with the devil.jpg',
    featured: true
  },
  {
    id: 'german-kolsch',
    name: 'German Kölsch',
    brewery: 'HooDoo Brewing',
    location: 'Fairbanks',
    style: 'Kölsch',
    abv: 4.8,
    description: 'Authentic German-style Kölsch brewed with traditional techniques in Alaska\'s interior. Light, crisp, and refreshing with subtle fruit notes.',
    image: '/images/Beer images/Alaska/HooDoo-German Kolsch.jpg',
    featured: true
  },
  {
    id: 'pipeline-stout',
    name: 'Pipeline Stout',
    brewery: 'Broken Tooth Brewing',
    location: 'Anchorage',
    style: 'Oatmeal Stout',
    abv: 5.9,
    description: 'Full-bodied oatmeal stout with smooth, creamy texture. Roasted malt character with hints of chocolate and coffee, perfect with their famous pizza.',
    image: '/images/Beer images/Alaska/Pipeline Stout.jpeg',
    featured: true
  }
]

const brewingFacts = [
  {
    icon: <Mountain className="w-8 h-8 text-blue-600" />,
    title: "49 Active Breweries",
    description: "From Juneau to Fairbanks, Alaska ranks 4th nationally in breweries per capita"
  },
  {
    icon: <Snowflake className="w-8 h-8 text-blue-600" />,
    title: "Pristine Glacial Water",
    description: "Sourced from the Juneau Icefield and other glacial sources for exceptionally pure brewing"
  },
  {
    icon: <Anchor className="w-8 h-8 text-blue-600" />,
    title: "Gold Rush Heritage",
    description: "Modern recipes based on historical brewing records from the 1800s Gold Rush era"
  }
]

export default function AlaskaPage() {
  const [publishedBeers, setPublishedBeers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPublished, setTotalPublished] = useState(0)
  
  useEffect(() => {
    const fetchPublishedBeers = async () => {
      try {
        const response = await fetch('/api/states/alaska/published-beers')
        if (response.ok) {
          const data = await response.json()
          
          // Map database beer reviews to display format
          const mappedBeers = data.published_beers.map((beer: any) => ({
            id: beer.id,
            name: beer.beer_name,
            brewery: beer.brewery_name,
            location: beer.brewery_location || 'Alaska',
            style: beer.beer_style,
            abv: beer.abv,
            description: beer.tasting_notes || beer.description || `Exceptional ${beer.beer_style} from Alaska's craft beer scene.`,
            image: getImagePath(beer.beer_name),
            featured: true,
            rating: beer.rating,
            day_of_week: beer.day_of_week
          }))
          
          setPublishedBeers(mappedBeers)
          setTotalPublished(data.total_published)
        } else {
          console.error('Failed to fetch published beers')
          // Fallback to showing no beers instead of all 7
          setPublishedBeers([])
        }
      } catch (error) {
        console.error('Error fetching published beers:', error)
        setPublishedBeers([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchPublishedBeers()
  }, [])
  
  // Helper function to map beer names to image paths
  const getImagePath = (beerName: string) => {
    const imageMap: Record<string, string> = {
      'Alaskan Amber': '/images/Beer images/Alaska/Alaskan Amber.png',
      'Sockeye Red IPA': '/images/Beer images/Alaska/Sockeye-Red.png',
      'Chocolate Coconut Porter': '/images/Beer images/Alaska/Chocolate Coconut Porter.jpeg',
      'Belgian Triple': '/images/Beer images/Alaska/Belgian Triple.jpeg',
      'New England IPA': '/images/Beer images/Alaska/A deal with the devil.jpg',
      'German Kölsch': '/images/Beer images/Alaska/HooDoo-German Kolsch.jpg',
      'Pipeline Stout': '/images/Beer images/Alaska/Pipeline Stout.jpeg'
    }
    return imageMap[beerName] || '/images/Beer images/placeholder.png'
  }
  
  const featuredBeers = publishedBeers

  return (
    <>
      <Head>
        <title>Alaska Craft Beer Guide - Last Frontier Brewing | BrewQuest Chronicles</title>
        <meta name="description" content="Discover Alaska's remarkable craft beer scene, from Alaskan Brewing Company's Gold Rush-era recipes to innovative breweries using spruce tips and alder-smoked malts. Explore 49 breweries across the Last Frontier." />
        <meta name="keywords" content="Alaska craft beer, Alaskan Brewing Company, Midnight Sun Brewing, Alaska breweries, Anchorage beer, Fairbanks beer, Juneau beer, smoked porter, spruce tip IPA" />
        <meta property="og:title" content="Alaska Craft Beer Guide - Last Frontier Brewing" />
        <meta property="og:description" content="From glacial water to spruce tip IPAs - discover Alaska's unique craft beer renaissance" />
        <meta property="og:image" content="/images/State Images/Alaska.png" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Mountain className="w-6 h-6" />
                </div>
                <span className="text-blue-300 font-semibold tracking-wide">WEEK 2</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Alaska's
                <span className="block text-blue-400">Last Frontier</span>
                <span className="block">Brewing</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                From Gold Rush-era recipes to innovative breweries using spruce tips and alder-smoked malts, 
                Alaska's craft beer scene combines pristine glacial water with frontier ingenuity across 49 breweries.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="#beers" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
                >
                  Explore Alaska Beers
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link 
                  href="/blog" 
                  className="border border-white/30 hover:bg-white/10 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Read Full Story
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[600px] rounded-xl overflow-hidden">
                <Image
                  src="/images/State Images/Alaska.png"
                  alt="Alaska craft beer scene with mountain brewery"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Alaska's Brewing Excellence
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Despite extreme challenges, Alaska has built one of America's most distinctive craft beer scenes, 
              turning geographic isolation into innovation and pristine ingredients into liquid gold.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {brewingFacts.map((fact, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-slate-50 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-center mb-4">
                  {fact.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{fact.title}</h3>
                <p className="text-gray-600">{fact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                From Gold Rush to Craft Renaissance
              </h2>
              <div className="prose prose-lg text-gray-700 space-y-6">
                <p>
                  Alaska's modern craft beer story begins in 1986 when 28-year-old Marcy and Geoff Larson 
                  founded Alaskan Brewing Company in Juneau, becoming the 67th independent brewery in the US. 
                  Their flagship Alaskan Amber was based on a genuine Gold Rush-era recipe discovered in 
                  historical shipping records.
                </p>
                <p>
                  What makes Alaska brewing truly unique is the necessity-driven innovation. Extreme weather, 
                  supply chain challenges, and geographic isolation forced breweries to develop groundbreaking 
                  sustainability practices, including CO₂ recovery systems and water-saving technologies.
                </p>
                <p>
                  Today, Alaska ranks 4th nationally in breweries per capita, with 49 breweries utilizing 
                  pristine glacial water and indigenous ingredients like Sitka spruce tips, alder-smoked malts, 
                  and wild berries to create beers that truly capture the Last Frontier spirit.
                </p>
              </div>
              
              <div className="mt-8 p-6 bg-blue-100 rounded-xl border-l-4 border-blue-600">
                <h3 className="font-bold text-gray-900 mb-2">Did You Know?</h3>
                <p className="text-gray-700">
                  Alaskan Brewing's Smoked Porter uses alder wood from the Tongass National Forest, 
                  creating a flavor profile so unique it won gold at the 2024 European Beer Star competition.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Brewing by the Numbers</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Breweries</span>
                    <span className="font-bold text-blue-600">49</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Economic Contribution</span>
                    <span className="font-bold text-blue-600">$332M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Per Capita Ranking</span>
                    <span className="font-bold text-blue-600">#4 Nationally</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Craft Beer Per Resident</span>
                    <span className="font-bold text-blue-600">9.3 Gallons</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Signature Ingredients</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Sitka Spruce Tips (Tongass National Forest)
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Alder-Smoked Malt (Traditional Smoking)
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Pristine Glacial Water (Juneau Icefield)
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Wild Berries (Cloudberries, Salmonberries)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Beers Section */}
      <section id="beers" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Alaska's Daily Beer Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {loading ? (
                'Loading the latest published beers...'
              ) : totalPublished === 0 ? (
                'Beer reviews are published daily. Check back soon for Alaska\'s featured craft beer selections!'
              ) : totalPublished === 7 ? (
                'All seven of Alaska\'s featured beers have been published! Discover the complete Last Frontier brewing journey.'
              ) : (
                `${totalPublished} of 7 Alaska craft beers published so far. New beers are added daily as part of our week-long Alaska exploration.`
              )}
            </p>
            
            {!loading && totalPublished > 0 && totalPublished < 7 && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-blue-600">
                <Clock className="w-4 h-4" />
                <span>Next beer publishes daily at 3 PM EST</span>
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : featuredBeers.length === 0 ? (
            <div className="text-center py-12">
              <Mountain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No beers published yet</h3>
              <p className="text-gray-500">
                Alaska's craft beer journey begins soon! Beer reviews are published daily starting Monday.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBeers.map((beer, index) => (
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
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {beer.name}
                      </h3>
                      <p className="text-blue-600 font-semibold">{beer.brewery}</p>
                      <p className="text-sm text-gray-500">{beer.location} • {beer.style}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-slate-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Continue the BrewQuest Journey
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Alaska's pioneering spirit lives on in every glass. Join us as we explore 
            America's craft beer renaissance, one state at a time.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/blog" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              Read All Stories
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/states" 
              className="border border-blue-300 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Explore More States
            </Link>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}