# Phase 2: Core Blog Development (Week 3-4)

## Step 5: Create Landing Page Components

### 5.1 Main Landing Page
```typescript
// app/page.tsx
import { HeroSection } from '@/components/sections/HeroSection'
import { FeaturedPosts } from '@/components/sections/FeaturedPosts'
import { AboutSection } from '@/components/sections/AboutSection'
import { NewsletterSignup } from '@/components/sections/NewsletterSignup'
import { USMapProgress } from '@/components/interactive/USMapProgress'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedPosts />
      <USMapProgress />
      <AboutSection />
      <NewsletterSignup />
    </main>
  )
}
```

### 5.2 Hero Section Component
```typescript
// components/sections/HeroSection.tsx
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-beer-amber/20 to-beer-brown/20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/brewery-background.jpg"
          alt="Craft brewery background"
          fill
          className="object-cover opacity-30"
          priority
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="mb-8">
          <Image
            src="/images/hop-harrison-avatar.jpg"
            alt="Hop Harrison"
            width={200}
            height={200}
            className="rounded-full mx-auto mb-6 border-4 border-beer-amber shadow-xl"
          />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-beer-dark">
          Discovering America's
          <span className="text-beer-amber block">Best Craft Beers</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-beer-brown max-w-2xl mx-auto">
          One State at a Time
        </p>
        
        <p className="text-lg mb-8 text-beer-dark/80 max-w-3xl mx-auto">
          Join Hop Harrison on an epic journey through all 50 states, discovering 
          the stories, breweries, and incredible beers that make America's craft 
          beer scene the most exciting in the world.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/blog" className="btn-primary text-lg px-8 py-3">
            Start the Journey
          </Link>
          <Link href="/about" className="text-beer-brown hover:text-beer-amber transition-colors font-semibold">
            Meet Hop Harrison →
          </Link>
        </div>
        
        {/* Social Proof */}
        <div className="mt-12 flex justify-center items-center space-x-8 text-beer-brown/60">
          <div className="text-center">
            <div className="text-2xl font-bold text-beer-amber">350+</div>
            <div className="text-sm">Beers Reviewed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-beer-amber">50</div>
            <div className="text-sm">States Explored</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-beer-amber">10K+</div>
            <div className="text-sm">Beer Lovers</div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-beer-amber" />
      </div>
    </section>
  )
}
```

## Step 6: Blog System Components

### 6.1 Blog Listing Page
```typescript
// app/blog/page.tsx
import { supabase } from '@/lib/supabase/client'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { BlogFilters } from '@/components/blog/BlogFilters'
import { Pagination } from '@/components/ui/Pagination'

interface BlogPageProps {
  searchParams: {
    page?: string
    state?: string
    search?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1')
  const state = searchParams.state
  const search = searchParams.search
  const perPage = 9

  // Build query
  let query = supabase
    .from('blog_posts')
    .select('*, beer_reviews(count)')
    .eq('published_at', 'not.null')
    .order('published_at', { ascending: false })

  if (state) {
    query = query.eq('state', state)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%, excerpt.ilike.%${search}%`)
  }

  // Get total count for pagination
  const { count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })

  // Get paginated results
  const { data: posts, error } = await query
    .range((page - 1) * perPage, page * perPage - 1)

  if (error) {
    console.error('Error fetching blog posts:', error)
    return <div>Error loading posts</div>
  }

  const totalPages = Math.ceil((count || 0) / perPage)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-beer-dark">
          The BrewQuest Chronicles
        </h1>
        <p className="text-xl text-beer-brown max-w-2xl mx-auto">
          Follow Hop Harrison's journey through America's craft beer landscape, 
          one state and one incredible beer at a time.
        </p>
      </div>

      <BlogFilters currentState={state} currentSearch={search} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {posts?.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          basePath="/blog"
        />
      )}
    </div>
  )
}
```

### 6.2 Blog Post Card Component
```typescript
// components/blog/BlogPostCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { BlogPost } from '@/lib/types/blog'

interface BlogPostCardProps {
  post: BlogPost & {
    beer_reviews: { count: number }[]
  }
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const beerCount = post.beer_reviews?.[0]?.count || 7
  const publishedDate = new Date(post.published_at || post.created_at).toLocaleDateString()

  return (
    <article className="card group hover:scale-105 transition-transform duration-200">
      {/* Featured Image */}
      {post.featured_image_url && (
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-beer-amber text-white px-3 py-1 rounded-full text-sm font-semibold">
              Week {post.week_number}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-center space-x-4 text-sm text-beer-brown/70">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{post.state}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{publishedDate}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{post.read_time} min</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-beer-dark group-hover:text-beer-amber transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        <p className="text-beer-brown/80 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-beer-brown/70">
            {beerCount} beers featured
          </div>
          <Link 
            href={`/blog/${post.slug}`}
            className="text-beer-amber hover:text-beer-gold font-semibold text-sm"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  )
}
```

### 6.3 Individual Blog Post Page
```typescript
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { BlogPostHeader } from '@/components/blog/BlogPostHeader'
import { BeerReviewSection } from '@/components/blog/BeerReviewSection'
import { SocialSharing } from '@/components/social/SocialSharing'
import { RelatedPosts } from '@/components/blog/RelatedPosts'

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, seo_meta_description, featured_image_url')
    .eq('slug', params.slug)
    .single()

  if (!post) return {}

  return {
    title: post.title,
    description: post.seo_meta_description,
    openGraph: {
      title: post.title,
      description: post.seo_meta_description,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      beer_reviews (
        *
      )
    `)
    .eq('slug', params.slug)
    .eq('published_at', 'not.null')
    .single()

  if (error || !post) {
    notFound()
  }

  // Increment view count
  await supabase
    .from('blog_posts')
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq('id', post.id)

  const beerReviews = post.beer_reviews?.sort((a, b) => a.day_of_week - b.day_of_week) || []

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <BlogPostHeader post={post} />
      
      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <BeerReviewSection reviews={beerReviews} />

      <div className="mt-12 pt-8 border-t border-beer-cream">
        <SocialSharing 
          url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`}
          title={post.title}
        />
      </div>

      <RelatedPosts currentPostId={post.id} state={post.state} />
    </article>
  )
}
```

## Step 7: Beer Review Components

### 7.1 Beer Review Card
```typescript
// components/blog/BeerReviewCard.tsx
import Image from 'next/image'
import { Star, MapPin, Percent } from 'lucide-react'
import { BeerReview } from '@/lib/types/blog'

interface BeerReviewCardProps {
  review: BeerReview
  dayLabel?: string
}

export function BeerReviewCard({ review, dayLabel }: BeerReviewCardProps) {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const displayDay = dayLabel || dayNames[review.day_of_week - 1]

  return (
    <div className="card">
      <div className="flex items-start space-x-4">
        {/* Beer Image */}
        {review.image_url && (
          <div className="flex-shrink-0">
            <Image
              src={review.image_url}
              alt={`${review.beer_name} by ${review.brewery_name}`}
              width={120}
              height={160}
              className="rounded-lg object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div>
            <div className="text-sm text-beer-amber font-semibold mb-1">
              {displayDay}
            </div>
            <h3 className="text-xl font-bold text-beer-dark">
              {review.beer_name}
            </h3>
            <div className="flex items-center space-x-2 text-beer-brown">
              <MapPin className="w-4 h-4" />
              <span>{review.brewery_name}</span>
              {review.brewery_location && (
                <span className="text-beer-brown/60">• {review.brewery_location}</span>
              )}
            </div>
          </div>

          {/* Beer Details */}
          <div className="flex items-center space-x-4 text-sm">
            <span className="bg-beer-cream px-2 py-1 rounded text-beer-brown">
              {review.beer_style}
            </span>
            {review.abv && (
              <div className="flex items-center space-x-1">
                <Percent className="w-3 h-3" />
                <span>{review.abv}% ABV</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating 
                      ? 'text-beer-amber fill-current' 
                      : 'text-beer-cream'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Unique Feature */}
          {review.unique_feature && (
            <div className="bg-beer-amber/10 p-3 rounded-lg">
              <div className="text-sm font-semibold text-beer-amber mb-1">
                What Makes It Special
              </div>
              <p className="text-beer-dark text-sm">
                {review.unique_feature}
              </p>
            </div>
          )}

          {/* Tasting Notes */}
          <div>
            <h4 className="font-semibold text-beer-dark mb-1">Hop's Take</h4>
            <p className="text-beer-brown/80 text-sm leading-relaxed">
              {review.tasting_notes}
            </p>
          </div>

          {/* Brewery Story */}
          {review.brewery_story && (
            <div className="pt-2 border-t border-beer-cream">
              <h4 className="font-semibold text-beer-dark mb-1">Brewery Story</h4>
              <p className="text-beer-brown/80 text-sm leading-relaxed">
                {review.brewery_story}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

## Step 8: Navigation & Layout

### 8.1 Main Layout
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'
import { Navigation } from '@/components/navigation/Navigation'
import { Footer } from '@/components/navigation/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BrewQuest Chronicles | Hop Harrison\'s Beer Journey',
  description: 'Follow Hop Harrison as he discovers the best craft beers from all 50 states',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

### 8.2 Navigation Component
```typescript
// components/navigation/Navigation.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Beer } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/blog', label: 'Blog' },
    { href: '/states', label: 'States' },
    { href: '/about', label: 'About Hop' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-beer-cream shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Beer className="w-8 h-8 text-beer-amber" />
            <div>
              <div className="font-bold text-lg text-beer-dark">BrewQuest</div>
              <div className="text-xs text-beer-brown -mt-1">with Hop Harrison</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-beer-brown hover:text-beer-amber transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/newsletter"
              className="btn-primary"
            >
              Subscribe
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-beer-cream transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-beer-cream">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-beer-brown hover:text-beer-amber transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/newsletter"
                className="btn-primary inline-block text-center mt-4"
                onClick={() => setIsOpen(false)}
              >
                Subscribe
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
```

## Step 9: Utility Components

### 9.1 Blog Filters Component
```typescript
// components/blog/BlogFilters.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter } from 'lucide-react'

interface BlogFiltersProps {
  currentState?: string
  currentSearch?: string
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
]

export function BlogFilters({ currentState, currentSearch }: BlogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentSearch || '')

  const handleStateFilter = (state: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (state === 'all') {
      params.delete('state')
    } else {
      params.set('state', state)
    }
    params.delete('page') // Reset to first page
    router.push(`/blog?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search.trim()) {
      params.set('search', search.trim())
    } else {
      params.delete('search')
    }
    params.delete('page') // Reset to first page
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-beer-brown/50" />
          <input
            type="text"
            placeholder="Search blog posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-beer-cream rounded-lg focus:ring-2 focus:ring-beer-amber focus:border-transparent"
          />
        </div>
      </form>

      {/* State Filter */}
      <div className="flex items-center justify-center space-x-4">
        <Filter className="w-5 h-5 text-beer-brown/70" />
        <select
          value={currentState || 'all'}
          onChange={(e) => handleStateFilter(e.target.value)}
          className="px-4 py-2 border border-beer-cream rounded-lg focus:ring-2 focus:ring-beer-amber focus:border-transparent bg-white"
        >
          <option value="all">All States</option>
          {US_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters */}
      {(currentState || currentSearch) && (
        <div className="flex items-center justify-center space-x-2 text-sm">
          <span className="text-beer-brown/70">Active filters:</span>
          {currentState && (
            <span className="bg-beer-amber text-white px-2 py-1 rounded">
              {currentState}
            </span>
          )}
          {currentSearch && (
            <span className="bg-beer-amber text-white px-2 py-1 rounded">
              "{currentSearch}"
            </span>
          )}
          <button
            onClick={() => router.push('/blog')}
            className="text-beer-amber hover:text-beer-gold"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
```

### 9.2 Pagination Component
```typescript
// components/ui/Pagination.tsx
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const showPages = 5
    let start = Math.max(1, currentPage - Math.floor(showPages / 2))
    let end = Math.min(totalPages, start + showPages - 1)

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-beer-cream hover:bg-beer-cream transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Link>
      ) : (
        <div className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-beer-cream/50 text-beer-brown/50">
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </div>
      )}

      {/* Page Numbers */}
      {getPageNumbers().map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className={`px-3 py-2 rounded-lg transition-colors ${
            page === currentPage
              ? 'bg-beer-amber text-white'
              : 'border border-beer-cream hover:bg-beer-cream'
          }`}
        >
          {page}
        </Link>
      ))}

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-beer-cream hover:bg-beer-cream transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <div className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-beer-cream/50 text-beer-brown/50">
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </div>
  )
}
```

## Step 10: Essential Pages

### 10.1 About Page
```typescript
// app/about/page.tsx
import Image from 'next/image'
import { Mail, Instagram, Twitter } from 'lucide-react'

export const metadata = {
  title: 'About Hop Harrison | BrewQuest Chronicles',
  description: 'Meet Hop Harrison, your guide through America\'s craft beer landscape',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Image
          src="/images/hop-harrison-about.jpg"
          alt="Hop Harrison"
          width={300}
          height={300}
          className="rounded-full mx-auto mb-6 shadow-xl"
        />
        <h1 className="text-4xl font-bold mb-4 text-beer-dark">
          Meet Hop Harrison
        </h1>
        <p className="text-xl text-beer-brown max-w-2xl mx-auto">
          Your guide through America's incredible craft beer landscape
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-beer-dark">The Journey Begins</h2>
            <p className="text-beer-brown/80 leading-relaxed">
              Hey there, beer lovers! I'm Harrison Fletcher, but everyone calls me "Hop." 
              I earned that nickname during my homebrewing days when I became absolutely 
              obsessed with hop varieties and their incredible flavor profiles.
            </p>
            <p className="text-beer-brown/80 leading-relaxed">
              My craft beer journey started with a single Vermont IPA at age 21 that 
              completely changed my perspective on what beer could be. That moment sparked 
              a passion that's taken me through 8 years working in breweries across the 
              country and now on this incredible 50-state adventure.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4 text-beer-dark">Why This Matters</h2>
            <p className="text-beer-brown/80 leading-relaxed">
              Every brewery has a story. Every beer represents someone's passion, creativity, 
              and connection to their community. My mission is to discover those stories and 
              share them with you in a way that's approachable, authentic, and exciting.
            </p>
            <p className="text-beer-brown/80 leading-relaxed">
              Whether you're a seasoned beer geek or just curious about craft beer, 
              I believe there's always something new to discover, and every beer deserves 
              to be understood and appreciated.
            </p>
          </div>
        </div>

        <div className="bg-beer-cream/50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-bold mb-3 text-beer-dark">My Beer Philosophy</h3>
          <blockquote className="text-beer-brown italic text-lg">
            "Every beer tells a story - about the brewer, the community, and the ingredients 
            that came together to create something unique. My job is to help you discover 
            those stories."
          </blockquote>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6 text-beer-dark">Let's Connect</h3>
          <div className="flex justify-center space-x-6">
            <a 
              href="mailto:hop@brewquest.com" 
              className="flex items-center space-x-2 text-beer-amber hover:text-beer-gold"
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </a>
            <a 
              href="https://instagram.com/hopharrisonbrew" 
              className="flex items-center space-x-2 text-beer-amber hover:text-beer-gold"
            >
              <Instagram className="w-5 h-5" />
              <span>Instagram</span>
            </a>
            <a 
              href="https://twitter.com/hopharrisonbrew" 
              className="flex items-center space-x-2 text-beer-amber hover:text-beer-gold"
            >
              <Twitter className="w-5 h-5" />
              <span>Twitter</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Cursor Prompts for Phase 2

### Prompt 1: Complete Landing Page Implementation
```
Create a stunning beer blog landing page with these components:

1. HeroSection with Hop Harrison introduction
2. FeaturedPosts grid showing latest blog posts
3. AboutSection with character intro
4. NewsletterSignup with email capture
5. Responsive design with beer-themed colors (amber, brown, cream)
6. Smooth animations and hover effects
7. Social media integration
8. Mobile-friendly navigation

Use Tailwind CSS and include proper TypeScript interfaces.
```

### Prompt 2: Blog System Components
```
Build comprehensive blog components:

1. BlogPostCard for listing pages with featured images
2. BlogPost detail page with SEO optimization
3. BeerReviewCard showing individual beer reviews
4. BlogFilters with state and search functionality
5. Pagination component
6. Navigation with mobile menu
7. Social sharing buttons

Include proper TypeScript types and Supabase integration.
```

### Prompt 3: Database Operations
```
Create Supabase database operations:

1. Blog post CRUD operations
2. Beer review management
3. Social post scheduling
4. Newsletter subscriber handling
5. Analytics tracking
6. Search and filtering functions
7. Pagination queries

Include proper error handling and TypeScript types.
```

## Next Phase Preview
Phase 3 will cover:
- Admin dashboard creation
- AI content generation system
- Social media automation
- BrewMetrics integration points
- Testing and optimization