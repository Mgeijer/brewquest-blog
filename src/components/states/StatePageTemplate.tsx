'use client'

import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { ArrowRight, MapPin, Calendar, Clock } from 'lucide-react'
import DynamicBeerSection from './DynamicBeerSection'

interface BrewingFact {
  icon: React.ReactNode
  title: string
  description: string
}

interface StatePageTemplateProps {
  stateCode: string
  stateName: string
  weekNumber: number
  heroImage: string
  brewingFacts: BrewingFact[]
  storyContent: {
    title: string
    subtitle: string
    description: string
    paragraphs: string[]
    didYouKnow?: string
  }
  brewingStats: {
    breweries: string
    economic: string
    ranking: string
    perCapita: string
  }
  uniqueIngredients: string[]
  imagePathMapping?: Record<string, string>
  gradientFrom?: string
  gradientTo?: string
  themeColor?: string
}

export default function StatePageTemplate({
  stateCode,
  stateName,
  weekNumber,
  heroImage,
  brewingFacts,
  storyContent,
  brewingStats,
  uniqueIngredients,
  imagePathMapping = {},
  gradientFrom = 'slate-900',
  gradientTo = 'blue-900',
  themeColor = 'blue'
}: StatePageTemplateProps) {
  return (
    <>
      <Head>
        <title>{stateName} Craft Beer Guide - {storyContent.subtitle} | BrewQuest Chronicles</title>
        <meta name="description" content={storyContent.description} />
        <meta name="keywords" content={`${stateName} craft beer, ${stateName} breweries, craft beer guide, beer reviews`} />
        <meta property="og:title" content={`${stateName} Craft Beer Guide - ${storyContent.subtitle}`} />
        <meta property="og:description" content={storyContent.description} />
        <meta property="og:image" content={heroImage} />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section */}
        <section className={`relative overflow-hidden bg-gradient-to-r from-${gradientFrom} via-${themeColor}-900 to-${gradientTo}`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`bg-${themeColor}-600 p-2 rounded-lg`}>
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className={`text-${themeColor}-300 font-semibold tracking-wide`}>WEEK {weekNumber}</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  {storyContent.title}
                </h1>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {storyContent.description}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="#beers" 
                    className={`bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center`}
                  >
                    Explore {stateName} Beers
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
                    src={heroImage}
                    alt={`${stateName} craft beer scene`}
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
                {stateName}'s Brewing Excellence
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {storyContent.subtitle}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {brewingFacts.map((fact, index) => (
                <div key={index} className={`text-center p-6 rounded-xl bg-gradient-to-br from-${themeColor}-50 to-slate-50 hover:shadow-lg transition-all duration-300`}>
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
        <section className={`py-16 bg-gradient-to-br from-slate-50 to-${themeColor}-50`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {storyContent.title}
                </h2>
                <div className="prose prose-lg text-gray-700 space-y-6">
                  {storyContent.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                
                {storyContent.didYouKnow && (
                  <div className={`mt-8 p-6 bg-${themeColor}-100 rounded-xl border-l-4 border-${themeColor}-600`}>
                    <h3 className="font-bold text-gray-900 mb-2">Did You Know?</h3>
                    <p className="text-gray-700">{storyContent.didYouKnow}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Brewing by the Numbers</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Breweries</span>
                      <span className={`font-bold text-${themeColor}-600`}>{brewingStats.breweries}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Economic Contribution</span>
                      <span className={`font-bold text-${themeColor}-600`}>{brewingStats.economic}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Per Capita Ranking</span>
                      <span className={`font-bold text-${themeColor}-600`}>{brewingStats.ranking}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Craft Beer Per Resident</span>
                      <span className={`font-bold text-${themeColor}-600`}>{brewingStats.perCapita}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Signature Ingredients</h3>
                  <ul className="space-y-2 text-gray-700">
                    {uniqueIngredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center">
                        <div className={`w-2 h-2 bg-${themeColor}-600 rounded-full mr-3`}></div>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Beer Section */}
        <DynamicBeerSection
          stateCode={stateCode}
          stateName={stateName}
          imagePathMapping={imagePathMapping}
          fallbackDescription={`Exceptional craft beer from ${stateName}'s brewing scene.`}
        />

        {/* CTA Section */}
        <section className={`py-16 bg-gradient-to-r from-${themeColor}-900 to-slate-800`}>
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-6">
              Continue the BrewQuest Journey
            </h2>
            <p className={`text-xl text-${themeColor}-200 mb-8`}>
              {stateName}'s brewing heritage lives on in every glass. Join us as we explore 
              America's craft beer renaissance, one state at a time.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/blog" 
                className={`bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center`}
              >
                Read All Stories
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/states" 
                className={`border border-${themeColor}-300 hover:bg-${themeColor}-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors`}
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