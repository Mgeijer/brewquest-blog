'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import BlogPostCard from '@/components/blog/BlogPostCard'
import BeerReviewCard from '@/components/blog/BeerReviewCard'
import JourneyProgressSection from '@/components/blog/JourneyProgressSection'
import WeekIndicator from '@/components/blog/WeekIndicator'
import { getAllStateProgress } from '@/lib/supabase/functions/stateProgressFunctions'
import { BlogPost } from '@/lib/types/blog'
import { foundationStories } from '@/data/foundationStories'
import { getCurrentState } from '@/lib/data/stateProgress'

// Dynamic import for USMap to avoid SSR issues
const USMap = dynamic(() => import('@/components/interactive/USMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beer-amber"></div>
    </div>
  )
})


// Mock data - replace with real data from Supabase
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Exploring California\'s Craft Beer Renaissance',
    slug: 'california-craft-beer-renaissance',
    excerpt: 'From San Diego to San Francisco, California\'s craft beer scene continues to innovate and inspire. Join me as I explore seven exceptional breweries across the Golden State.',
    content: '',
    featured_image_url: '/images/california-hero.jpg',
    state: 'California',
    week_number: 1,
    read_time: 8,
    published_at: new Date('2024-01-15'),
    created_at: new Date('2024-01-15'),
    seo_meta_description: 'Explore California\'s thriving craft beer scene from San Diego to San Francisco.',
    seo_keywords: ['california', 'craft beer', 'breweries', 'IPA'],
    view_count: 1247,
    is_featured: true
  },
  {
    id: '2', 
    title: 'Texas-Sized Flavors: BBQ and Beer Done Right',
    slug: 'texas-bbq-beer-pairing',
    excerpt: 'Everything\'s bigger in Texas, including the flavor profiles. Discover how Lone Star State breweries are pairing perfectly with world-class barbecue.',
    content: '',
    featured_image_url: '/images/texas-hero.jpg',
    state: 'Texas',
    week_number: 2,
    read_time: 6,
    published_at: new Date('2024-01-08'),
    created_at: new Date('2024-01-08'),
    seo_meta_description: 'Discover the perfect pairing of Texas BBQ and craft beer.',
    seo_keywords: ['texas', 'barbecue', 'beer pairing', 'craft beer'],
    view_count: 892,
    is_featured: false
  },
  {
    id: '3',
    title: 'Colorado\'s High-Altitude Brewing Mastery',
    slug: 'colorado-high-altitude-brewing',
    excerpt: 'The Rocky Mountain state has mastered the art of high-altitude brewing. From Denver to Boulder, see how elevation affects flavor.',
    content: '',
    featured_image_url: '/images/colorado-hero.jpg',
    state: 'Colorado',
    week_number: 3,
    read_time: 7,
    published_at: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
    seo_meta_description: 'Learn how Colorado breweries master high-altitude brewing techniques.',
    seo_keywords: ['colorado', 'high altitude brewing', 'denver', 'boulder'],
    view_count: 654,
    is_featured: true
  },
];

const states = [
  'All States',
  'California',
  'Texas', 
  'Colorado',
  'Oregon',
  'Vermont',
  'Maine',
  'North Carolina',
];

function BlogContent() {
  const searchParams = useSearchParams()
  const [selectedState, setSelectedState] = useState('All States')
  const [sortBy, setSortBy] = useState('newest')
  const [currentState, setCurrentState] = useState(null)
  const [isLoadingState, setIsLoadingState] = useState(true)
  
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  // Load current state data from Supabase
  useEffect(() => {
    const loadCurrentState = async () => {
      try {
        setIsLoadingState(true)
        const { data: allStates, error } = await getAllStateProgress()
        
        if (error) {
          console.error('Error loading states:', error)
          return
        }

        if (allStates) {
          const current = allStates.find(state => state.status === 'current')
          if (current) {
            // Get local state data with featured beers
            const localStateData = getCurrentState()
            
            // Convert to legacy format for compatibility, merging Supabase and local data
            setCurrentState({
              code: current.state_code,
              name: current.state_name,
              status: current.status,
              weekNumber: current.week_number,
              featuredBeers: localStateData?.featuredBeers || [], // Use local data for featured beers
              totalBreweries: current.total_breweries,
              region: current.region,
              description: current.description
            })
          }
        } else {
          // Fallback to local data if Supabase is unavailable
          const localStateData = getCurrentState()
          if (localStateData) {
            setCurrentState(localStateData)
          }
        }
      } catch (err) {
        console.error('Exception loading current state:', err)
      } finally {
        setIsLoadingState(false)
      }
    }

    loadCurrentState()
  }, [])
  
  // Filter content based on category
  const isShowingBeerReviews = category === 'reviews'
  const isShowingBreweryStories = category === 'breweries'
  const isShowingLocalCulture = category === 'local-culture'
  const isShowingFeatured = featured === 'true'
  
  // Get beer reviews for current week - show Monday through current day
  const getCurrentDay = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    return dayOfWeek === 0 ? 7 : dayOfWeek // Convert Sunday to 7
  }
  
  const currentDay = getCurrentDay()
  const beerReviews = currentState?.featuredBeers.filter(beer => beer.dayOfWeek <= currentDay) || []
  
  // If no specific query parameters, show Alabama weekly content by default
  const shouldShowAlabamaByDefault = !category && !featured && selectedState === 'All States'
  
  // Get content based on category
  const getBreweryStories = () => {
    // Get brewery stories from current state (Alabama) - link to weekly Alabama post
    if (!currentState?.featuredBeers || currentState.featuredBeers.length === 0) {
      // Fallback content when Supabase data isn't available
      return [{
        id: 'brewery-fallback-1',
        title: 'Alabama Craft Beer Stories - Database Loading',
        excerpt: 'We\'re loading the latest brewery stories from Alabama\'s vibrant craft beer scene. Please check back in a moment or visit our Alabama state page directly.',
        content: 'Alabama brewery stories are being loaded from our database. For the complete Alabama craft beer journey, visit our states page.',
        featured_image_url: '/images/Craft-Brewery-Landscape.png',
        state: 'Alabama',
        week_number: 1,
        read_time: 5,
        published_at: new Date(),
        created_at: new Date(),
        seo_meta_description: 'Alabama brewery stories loading from database.',
        seo_keywords: ['alabama', 'craft beer', 'brewery story', 'loading'],
        view_count: 0,
        is_featured: false,
        slug: 'states/alabama'
      }]
    }
    
    return currentState.featuredBeers.map(beer => ({
      id: `brewery-${beer.id}`,
      title: `${beer.brewery} - Craft Beer Excellence in Alabama`,
      excerpt: `Discover the story behind ${beer.brewery}, one of Alabama's premier craft beer destinations featured in our weekly state exploration.`,
      content: `Learn more about ${beer.brewery} and their ${beer.name} in our comprehensive Alabama craft beer journey.`,
      featured_image_url: beer.imageUrl,
      state: currentState?.name || 'Alabama',
      week_number: currentState?.weekNumber || 1,
      read_time: 5,
      published_at: new Date(),
      created_at: new Date(),
      seo_meta_description: `Learn about ${beer.brewery} and their contribution to Alabama's craft beer scene.`,
      seo_keywords: [beer.brewery.toLowerCase(), 'alabama', 'craft beer', 'brewery story'],
      view_count: Math.floor(Math.random() * 500) + 100,
      is_featured: false,
      slug: 'states/alabama'
    })) || []
  }
  
  const getLocalCultureStories = () => {
    // Get local culture stories for Alabama - link to actual weekly state post
    return [{
      id: 'alabama-culture-1',
      title: 'Week 1: Alabama\'s Craft Beer Renaissance - Heart of Dixie Brewing',
      excerpt: 'This week, we\'re diving deep into Alabama\'s surprising and vibrant craft beer scene. From Birmingham\'s urban brewing culture to Mobile\'s coastal flavors, the Heart of Dixie has quietly built one of the South\'s most authentic and innovative brewing communities.',
      content: `
# Welcome to Alabama: The Heart of Dixie's Brewing Renaissance

This week, we're diving deep into Alabama's surprising and vibrant craft beer scene. From Birmingham's urban brewing culture to Mobile's coastal flavors, the Heart of Dixie has quietly built one of the South's most authentic and innovative brewing communities.

## A State Transformed by Craft

Alabama's relationship with beer has been complicated. Until 2009, it was illegal to brew beer stronger than 6% ABV in the state. The "Gourmet Beer Bill" changed everything, opening the doors for craft breweries to flourish and for beer lovers to experience the full spectrum of flavors that define modern American brewing.

Today, Alabama is home to 45+ breweries, each telling a unique story of Southern hospitality, local ingredients, and innovative brewing techniques. From Good People Brewing's flagship IPA that's been Alabama's #1 selling IPA for over a decade, to TrimTab's experimental sours that push the boundaries of what beer can be.
      `,
      featured_image_url: '/images/Beer images/Alabama/Good People IPA.png',
      state: 'Alabama',
      week_number: 1,
      read_time: 12,
      published_at: new Date('2025-01-27'),
      created_at: new Date('2025-01-27'),
      seo_meta_description: 'Explore Alabama\'s craft beer culture and the weekly journey through the Heart of Dixie\'s brewing renaissance.',
      seo_keywords: ['alabama', 'local culture', 'craft beer', 'weekly journey', 'brewing history', 'birmingham'],
      view_count: 567,
      is_featured: true,
      slug: 'states/alabama'
    }]
  }
  
  const getFoundationStories = (): BlogPost[] => {
    try {
      // Convert foundation stories to BlogPost format
      if (!foundationStories || foundationStories.length === 0) {
        console.warn('Foundation stories not available')
        return []
      }
      
      return foundationStories.map(story => ({
        id: story.id,
        title: story.title,
        slug: story.slug,
        excerpt: story.excerpt,
        content: story.content,
        featured_image_url: story.featuredImage,
        state: 'Foundation',
        week_number: 0,
        read_time: parseInt(story.readTime.split(' ')[0]) || 5,
        published_at: new Date(story.publishDate),
        created_at: new Date(story.publishDate),
        seo_meta_description: story.excerpt,
        seo_keywords: story.tags,
        view_count: Math.floor(Math.random() * 1000) + 500,
        is_featured: true
      }))
    } catch (error) {
      console.error('Error loading foundation stories:', error)
      return []
    }
  }
  
  // Filter blog posts and handle special categories
  let filteredPosts = blogPosts
  
  // Show Alabama content by default when no filters applied
  if (shouldShowAlabamaByDefault) {
    // Return empty array to show Alabama beer content instead of old blog posts
    filteredPosts = []
  } else if (isShowingBreweryStories) {
    // Show brewery stories for current state
    filteredPosts = getBreweryStories()
  } else if (isShowingLocalCulture) {
    // Show local culture stories for current state
    filteredPosts = getLocalCultureStories()
  } else if (isShowingFeatured) {
    // Show foundation stories instead of old mock featured posts
    filteredPosts = getFoundationStories()
  } else if (selectedState !== 'All States') {
    filteredPosts = filteredPosts.filter(post => post.state === selectedState)
  }
  
  // Sort posts
  switch (sortBy) {
    case 'oldest':
      filteredPosts = [...filteredPosts].sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
        const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
        return dateA - dateB
      })
      break
    case 'popular':
      filteredPosts = [...filteredPosts].sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      break
    case 'featured':
      filteredPosts = [...filteredPosts].sort((a, b) => Number(b.is_featured) - Number(a.is_featured))
      break
    default: // newest
      filteredPosts = [...filteredPosts].sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
        const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
        return dateB - dateA
      })
  }

  const getPageTitle = () => {
    if (isShowingBeerReviews) return 'Beer Reviews'
    if (isShowingBreweryStories) return 'Brewery Stories'
    if (isShowingLocalCulture) return 'Local Culture'
    if (isShowingFeatured) return 'Featured Posts'
    if (shouldShowAlabamaByDefault) return 'Current State: Alabama Beer Reviews'
    return 'The Beer Blog'
  }

  const getPageSubtitle = () => {
    if (isShowingBeerReviews) return 'Discover exceptional craft beers from our current state exploration'
    if (isShowingBreweryStories) return 'Behind every great beer is an incredible story - meet the brewers and discover their passion'
    if (isShowingLocalCulture) return 'Explore how craft beer shapes and reflects the local culture of America\'s communities'
    if (isShowingFeatured) return 'Our most popular and recommended brewery discoveries'
    if (shouldShowAlabamaByDefault) return 'Discover exceptional craft beers from Alabama - our current state exploration'
    return 'Join Hop Harrison on his journey to discover America\'s best craft beers, one state at a time'
  }

  const getItemCount = () => {
    if (isShowingBeerReviews || shouldShowAlabamaByDefault) return beerReviews.length
    return filteredPosts.length
  }

  const getItemType = () => {
    if (isShowingBeerReviews || shouldShowAlabamaByDefault) return beerReviews.length === 1 ? 'beer review' : 'beer reviews'
    return filteredPosts.length === 1 ? 'post' : 'posts'
  }

  return (
    <div className="min-h-screen bg-beer-cream">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-beer-amber to-beer-gold text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {getPageTitle()}
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              {getPageSubtitle()}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Alabama Weekly Content - Show prominently on main blog page */}
        {shouldShowAlabamaByDefault && (
          <>
            {/* Loading State */}
            {isLoadingState && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beer-amber mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Alabama weekly content...</p>
              </div>
            )}
            
            {/* Main Content */}
            {!isLoadingState && currentState && (
              <>
            {/* Featured Weekly State Section */}
            <div className="mb-12">
              <div className="bg-gradient-to-r from-beer-amber/10 to-beer-gold/10 rounded-2xl p-8 border border-beer-amber/20">
                <div className="flex items-center gap-3 mb-4">
                  <WeekIndicator weekNumber={currentState?.weekNumber || 1} size="large" />
                  <div>
                    <h2 className="text-2xl font-bold text-beer-dark">Alabama's Craft Beer Renaissance</h2>
                    <p className="text-beer-malt">Currently exploring the Heart of Dixie's brewing scene</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <img 
                      src="/images/Craft-Brewery-Landscape.png" 
                      alt="Alabama Craft Beer Scene" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="text-gray-700 mb-4">
                      This week, we're diving deep into Alabama's surprising and vibrant craft beer scene. 
                      From Birmingham's urban brewing culture to Mobile's coastal flavors, the Heart of Dixie 
                      has quietly built one of the South's most authentic and innovative brewing communities.
                    </p>
                    <div className="flex gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-beer-amber">45</div>
                        <div className="text-gray-600">Breweries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-beer-amber">7</div>
                        <div className="text-gray-600">Featured Beers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-beer-amber">0.9</div>
                        <div className="text-gray-600">Per 100k People</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href="/states/alabama"
                    className="bg-beer-amber text-white px-6 py-3 rounded-lg hover:bg-beer-gold transition-colors font-medium"
                  >
                    Read Full Weekly Journey
                  </a>
                  <a 
                    href="/blog?category=reviews"
                    className="border border-beer-amber text-beer-amber px-6 py-3 rounded-lg hover:bg-beer-amber hover:text-white transition-colors font-medium"
                  >
                    View Beer Reviews
                  </a>
                </div>
              </div>
            </div>

            {/* Weekly Beer Progress */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-beer-dark mb-6">This Week's Beer Journey</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentState?.featuredBeers.slice(0, 3).map((beer) => (
                  <a 
                    key={beer.id} 
                    href={`/beers/${beer.id}`}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-beer-amber rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {beer.dayOfWeek}
                      </div>
                      <div className="text-sm text-gray-600">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][beer.dayOfWeek - 1]}
                      </div>
                    </div>
                    <img 
                      src={beer.imageUrl} 
                      alt={beer.name}
                      className="w-full h-32 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-200"
                    />
                    <h4 className="font-bold text-beer-dark mb-2 group-hover:text-beer-amber transition-colors">
                      {beer.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{beer.brewery}</p>
                    <p className="text-sm text-gray-700">{beer.style} • {beer.abv}% ABV</p>
                    <div className="mt-3 text-beer-amber text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Read Full Review →
                    </div>
                  </a>
                ))}
              </div>
              <div className="text-center mt-6">
                <a 
                  href="/states/alabama"
                  className="text-beer-amber hover:text-beer-gold font-medium"
                >
                  View All 7 Beers →
                </a>
              </div>
            </div>


            {/* Interactive Map Section */}
            <div id="interactive-map" className="mb-12">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-beer-dark mb-2">Interactive Journey Map</h3>
                  <p className="text-gray-600">
                    Visualize our 50-state beer journey. Click on any state to explore our craft beer discoveries.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="w-full max-w-4xl">
                    <USMap 
                      className="w-full"
                      showLegend={true}
                      showProgress={true}
                      enableNavigation={true}
                      enableAnalytics={true}
                      enableTooltips={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Journey Progress Section */}
            <JourneyProgressSection />
              </>
            )}
            
            {/* Fallback when no currentState data */}
            {!isLoadingState && !currentState && (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Alabama Week 1 - Loading</h3>
                <p className="text-gray-600 mb-6">We're setting up Alabama's craft beer journey. Please check back in a moment!</p>
                <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
                  <p className="text-sm text-yellow-800">
                    <strong>Temporary:</strong> If you see this message, the database connection is still loading. 
                    You can visit <a href="/states/alabama" className="underline text-yellow-900">/states/alabama</a> directly 
                    to see the full Alabama craft beer story.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Category-specific content */}
        {!shouldShowAlabamaByDefault && (
          <>
            {/* Filters - Only show for blog posts, not beer reviews or default Alabama view */}
            {!isShowingBeerReviews && (
              <div className="mb-12 flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-3">
              <label htmlFor="state-filter" className="text-sm font-semibold text-beer-dark">
                Filter by state:
              </label>
              <select
                id="state-filter"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-beer-dark focus:outline-none focus:ring-2 focus:ring-beer-amber focus:border-beer-amber"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <label htmlFor="sort-filter" className="text-sm font-semibold text-beer-dark">
                Sort by:
              </label>
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-beer-dark focus:outline-none focus:ring-2 focus:ring-beer-amber focus:border-beer-amber"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="featured">Featured</option>
              </select>
            </div>

            <div className="ml-auto">
              <span className="text-sm text-gray-600">
                {getItemCount()} {getItemType()} found
              </span>
            </div>
          </div>
        )}
        
        {/* Show count for beer reviews and default Alabama view */}
        {(isShowingBeerReviews || shouldShowAlabamaByDefault) && (
          <div className="mb-8 text-center">
            <span className="text-lg text-gray-600">
              Showing {getItemCount()} {getItemType()} from {currentState?.name || 'current state'}
            </span>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {(isShowingBeerReviews || shouldShowAlabamaByDefault) ? (
            beerReviews.map((review) => {
              // Get brewery story based on brewery name
              const getBreweryStory = (breweryName: string): string => {
                const breweryStories: Record<string, string> = {
                  'Good People Brewing Company': 'Founded in 2008 in Birmingham, Good People Brewing is Alabama\'s largest craft brewery. Their mission is simple: to make good beer for good people. Known for their flagship IPA that\'s been Alabama\'s #1 selling craft beer for over a decade.',
                  'Cahaba Brewing Company': 'Established in 2012, Cahaba Brewing takes its name from the Cahaba River that flows through Birmingham. They\'re known for creating approachable, drinkable beers that pair perfectly with Alabama\'s outdoor lifestyle and river adventures.',
                  'TrimTab Brewing Company': 'Founded in 2014, TrimTab Brewing is known for their innovative approach to beer making, especially their exceptional sour beers and fruit-forward creations. Located in Birmingham\'s historic warehouse district.',
                  'Avondale Brewing Company': 'Opening in 2014 in the historic Avondale neighborhood of Birmingham, this brewery focuses on Belgian-inspired ales and traditional European styles, bringing old-world brewing techniques to Alabama.',
                  'Monday Night Brewing (Birmingham Social Club)': 'The Birmingham location of the popular Atlanta-based brewery, known for their bold, innovative beers and strong community focus. They bring their signature style and social atmosphere to Alabama.'
                }
                return breweryStories[breweryName] || `${breweryName} is one of Alabama's craft beer pioneers, contributing to the state's growing reputation for quality brewing.`
              }

              return (
                <BeerReviewCard 
                  key={review.id}
                  review={{
                    id: review.id,
                    blog_post_id: '',
                    beer_name: review.name,
                    brewery_name: review.brewery,
                    beer_style: review.style,
                    abv: review.abv,
                    ibu: review.ibu,
                    rating: review.rating,
                    tasting_notes: review.tastingNotes,
                    image_url: review.imageUrl,
                    unique_feature: review.description,
                    brewery_location: currentState?.name || '',
                    brewery_website: undefined,
                    brewery_story: getBreweryStory(review.brewery),
                    day_of_week: review.dayOfWeek,
                    created_at: new Date()
                  }}
                  size="large"
                />
              )
            })
          ) : (
            filteredPosts.map((post, index) => (
              <BlogPostCard 
                key={post.id}
                post={post}
                priority={index < 3} // Priority loading for first 3 posts
              />
            ))
          )}
        </div>

        {/* Show message if no content */}
        {getItemCount() === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {(isShowingBeerReviews || shouldShowAlabamaByDefault)
                ? 'No beer reviews available yet. Check back soon!' 
                : 'No blog posts found with the selected filters.'
              }
            </p>
          </div>
        )}
            </>
        )}

        {/* Load More Button - Only for blog posts */}
        {!isShowingBeerReviews && !shouldShowAlabamaByDefault && filteredPosts.length > 0 && (
          <div className="text-center">
            <button className="bg-beer-amber hover:bg-beer-gold text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
              Load More Posts
            </button>
          </div>
        )}

        {/* Pagination Alternative - Only for blog posts */}
        {!isShowingBeerReviews && !shouldShowAlabamaByDefault && filteredPosts.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-beer-cream transition-colors text-beer-dark font-medium">
                ← Previous
              </button>
              <button className="px-4 py-2 bg-beer-amber text-white rounded-lg font-medium">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-beer-cream transition-colors text-beer-dark font-medium">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-beer-cream transition-colors text-beer-dark font-medium">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-beer-cream transition-colors text-beer-dark font-medium">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-beer-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-beer-amber"></div>
      </div>
    }>
      <BlogContent />
    </Suspense>
  )
}