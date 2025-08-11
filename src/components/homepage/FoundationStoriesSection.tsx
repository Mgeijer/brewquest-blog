'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, ArrowRight, Calendar, User } from 'lucide-react'
import { foundationStories } from '@/data/foundationStories'
import CurrentStateSection from './CurrentStateSection'

export default function FoundationStoriesSection() {
  // Get the 3 most recent foundation stories for main display
  const featuredStories = foundationStories.slice(0, 3)
  
  // Get remaining stories for "View All Stories" section
  const additionalStories = foundationStories.slice(3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            American Beer Culture Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the rich history, passionate pioneers, and cultural movements 
            that shaped America's craft beer renaissance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredStories.map((story, index) => (
            <article key={story.id} className={`
              bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]
              ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}
            `}>
              <div className={`relative ${index === 0 ? 'h-64 md:h-80' : 'h-48'}`}>
                <Image
                  src={story.featuredImage}
                  alt={story.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Foundation Story
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {story.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(story.publishDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {story.author}
                  </span>
                </div>
                
                <h2 className={`font-bold text-gray-900 mb-3 ${
                  index === 0 ? 'text-2xl md:text-3xl' : 'text-xl'
                }`}>
                  {story.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {story.excerpt}
                </p>
                
                {story.keyTakeaways && index === 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Key Takeaways:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {story.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
                          {takeaway}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/stories/${story.slug}`}
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                  >
                    Read Full Story
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <div className="hidden md:flex gap-2">
                    {story.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Current State Section */}
      <CurrentStateSection />

      {/* Additional Stories Teaser */}
      {additionalStories.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                More Beer Culture Stories
              </h2>
              <p className="text-gray-600">
                Dive deeper into America's brewing heritage
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {additionalStories.map((story) => (
                <article key={story.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={story.featuredImage}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Foundation Story
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Clock className="w-3 h-3" />
                      {story.readTime}
                      <span>•</span>
                      <Calendar className="w-3 h-3" />
                      {new Date(story.publishDate).toLocaleDateString()}
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {story.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {story.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Link 
                        href={`/stories/${story.slug}`}
                        className="text-amber-600 hover:text-amber-700 text-sm font-semibold"
                      >
                        Read More →
                      </Link>
                      <div className="flex gap-1">
                        {story.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Meet Hop Harrison Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
            <Image
              src="/images/HopHarrison Profile Pic.png"
              alt="Hop Harrison - Beer Culture Expert"
              fill
              className="object-cover"
            />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Meet Hop Harrison
          </h2>
          
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Your guide through America's craft beer renaissance. With a passion for brewing history, 
            local culture, and the stories behind every great beer, Hop brings decades of industry 
            knowledge to every article and brewery visit.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link 
              href="/about"
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
            >
              About Hop Harrison
            </Link>
            <Link 
              href="/blog"
              className="border border-amber-600 text-amber-600 px-6 py-3 rounded-lg hover:bg-amber-50 transition-colors font-semibold"
            >
              Start Reading
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}