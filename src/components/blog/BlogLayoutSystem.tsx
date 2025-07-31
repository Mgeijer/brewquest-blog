'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, ArrowRight, MapPin, Calendar } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  subtitle: string
  excerpt: string
  readTime: string
  publishDate: string
  author: string
  slug: string
  featuredImage: string
  tags: string[]
  keyTakeaways?: string[]
}

interface StatePost extends BlogPost {
  state: string
  weekNumber: number
  isStatePost: true
}

interface FoundationStory extends BlogPost {
  isStatePost: false
}

interface BlogLayoutSystemProps {
  foundationStories: FoundationStory[]
  stateJourneyPosts: StatePost[]
  currentWeek: number
}

export default function BlogLayoutSystem({ 
  foundationStories, 
  stateJourneyPosts, 
  currentWeek 
}: BlogLayoutSystemProps) {
  // Get the 3 most recent foundation stories for hero section
  const heroFoundationStories = foundationStories.slice(0, 3)
  
  // Get remaining foundation stories for "View All Stories" section
  const additionalFoundationStories = foundationStories.slice(3)
  
  // Calculate which state posts should be shown
  const getStatePostsForDisplay = () => {
    const sortedStatePosts = stateJourneyPosts
      .sort((a, b) => b.weekNumber - a.weekNumber) // Most recent first
    
    // Current week's post goes in "Discover America's Craft Beer Stories"
    const currentPost = sortedStatePosts.find(post => post.weekNumber === currentWeek)
    
    // Previous 4 weeks go in the cycling section (weeks 2-5 show, week 6+ go to "View All")
    const cyclingPosts = sortedStatePosts
      .filter(post => post.weekNumber < currentWeek && post.weekNumber >= currentWeek - 4)
      .slice(0, 4)
    
    // Older posts go to "View All Stories" section
    const archivedPosts = sortedStatePosts
      .filter(post => post.weekNumber < currentWeek - 4)
    
    return {
      currentPost,
      cyclingPosts,
      archivedPosts
    }
  }

  const { currentPost, cyclingPosts, archivedPosts } = getStatePostsForDisplay()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section - Foundation Stories */}
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
          {heroFoundationStories.map((story, index) => (
            <article key={story.id} className={`
              bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow
              ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}
            `}>
              <div className="relative h-48 md:h-64">
                <Image
                  src={`/images/blog/${story.featuredImage}`}
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
                </div>
                
                <h2 className={`font-bold text-gray-900 mb-3 ${
                  index === 0 ? 'text-2xl md:text-3xl' : 'text-xl'
                }`}>
                  {story.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {story.excerpt}
                </p>
                
                {story.keyTakeaways && (
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
                
                <Link 
                  href={`/stories/${story.slug}`}
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold"
                >
                  Read Full Story
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Discover America's Craft Beer Stories - Current State Post */}
      {currentPost && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Discover America's Craft Beer Stories
              </h2>
              <p className="text-xl text-gray-600">
                Follow our journey through all 50 states, one week at a time
              </p>
            </div>

            <article className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full font-medium">
                      Week {currentPost.weekNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {currentPost.state}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {currentPost.readTime}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {currentPost.title}
                  </h3>
                  
                  <p className="text-lg text-gray-700 mb-6">
                    {currentPost.excerpt}
                  </p>
                  
                  <Link 
                    href={`/states/${currentPost.slug}`}
                    className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
                  >
                    Explore {currentPost.state}'s Beer Scene
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                  <Image
                    src={`/images/states/${currentPost.featuredImage}`}
                    alt={`${currentPost.state} craft beer scene`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Recent State Adventures - Cycling Posts (Weeks 2-5) */}
      {cyclingPosts.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Recent State Adventures
              </h2>
              <p className="text-gray-600">
                Discover the stories from our recent brewery journeys
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cyclingPosts.map((post, index) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={`/images/states/${post.featuredImage}`}
                      alt={`${post.state} beer scene`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Week {post.weekNumber}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <MapPin className="w-3 h-3" />
                      {post.state}
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <Link 
                      href={`/states/${post.slug}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* View All Stories Button */}
      <section className="py-8 px-4 text-center">
        <Link 
          href="/stories/all"
          className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg"
        >
          View All Stories
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-gray-600 mt-3">
          Explore {additionalFoundationStories.length + archivedPosts.length} more stories 
          from our archives
        </p>
      </section>
    </div>
  )
}

// Hook for managing the rotation logic
export function useBlogRotation(stateJourneyPosts: StatePost[], currentWeek: number) {
  const getRotationStatus = () => {
    const currentPost = stateJourneyPosts.find(post => post.weekNumber === currentWeek)
    const recentPosts = stateJourneyPosts
      .filter(post => post.weekNumber < currentWeek && post.weekNumber >= currentWeek - 4)
      .sort((a, b) => b.weekNumber - a.weekNumber)
    const archivedPosts = stateJourneyPosts
      .filter(post => post.weekNumber < currentWeek - 4)
      .sort((a, b) => b.weekNumber - a.weekNumber)

    return {
      currentPost,
      recentPosts,
      archivedPosts,
      totalPosts: stateJourneyPosts.length
    }
  }

  return getRotationStatus()
}