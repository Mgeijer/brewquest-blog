import BeerReviewCard from '@/components/blog/BeerReviewCard'
import { formatDate, formatReadTime } from '@/lib/utils'
import { ArrowLeft, Bookmark, Calendar, Clock, MapPin, Share2 } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Mock data - replace with actual data fetching
const mockBlogPost = {
  id: '1',
  title: 'California Craft Beer Renaissance: From San Diego to San Francisco',
  slug: 'california-craft-beer-renaissance',
  excerpt: 'Discover how California continues to lead America\'s craft beer revolution with innovative breweries and bold flavors.',
  content: `
    <h2>The Golden State's Brewing Legacy</h2>
    <p>California's craft beer scene is nothing short of extraordinary. From the hop-forward IPAs of San Diego to the experimental sours of the Bay Area, the Golden State continues to push the boundaries of what beer can be.</p>
    
    <h3>San Diego: The IPA Capital</h3>
    <p>San Diego has earned its reputation as the IPA capital of the world. Breweries like Stone, Ballast Point, and Modern Times have redefined what hoppy beer can be, creating bold, aromatic brews that capture the essence of California's innovative spirit.</p>
    
    <blockquote>
      "San Diego brewers aren't just making beer; they're crafting liquid art that tells the story of California's pioneering spirit." - Local Beer Enthusiast
    </blockquote>
    
    <h3>The Bay Area's Innovation</h3>
    <p>Moving north, the San Francisco Bay Area showcases a different side of California brewing. Here, breweries like Russian River and The Rare Barrel focus on wild fermentation and complex flavor profiles that challenge traditional beer categories.</p>
    
    <h2>Featured Brewery Spotlight</h2>
    <p>During my week in California, I had the privilege of visiting several iconic breweries. Each one told a unique story of passion, innovation, and community.</p>
  `,
  featured_image_url: '/images/california-hero.jpg',
  state: 'California',
  week_number: 1,
  read_time: 8,
  published_at: new Date('2024-01-15'),
  created_at: new Date('2024-01-15'),
  seo_meta_description: 'Explore California\'s craft beer renaissance, from San Diego\'s hop-forward IPAs to the Bay Area\'s innovative brewing techniques.',
  seo_keywords: ['california craft beer', 'san diego ipa', 'bay area breweries', 'american craft beer'],
  view_count: 1247,
  is_featured: true
}

const mockBeerReview = {
  id: '1',
  blog_post_id: '1',
  brewery_name: 'Stone Brewing',
  beer_name: 'Arrogant Bastard Ale',
  beer_style: 'American Strong Ale',
  abv: 7.2,
  rating: 4.5,
  tasting_notes: 'Bold and aggressive with intense hop character, balanced by rich malt sweetness. Notes of citrus, pine, and caramel create a complex flavor profile.',
  unique_feature: 'One of the first aggressively hopped beers that helped define the American craft beer movement.',
  brewery_story: 'Founded in 1996 by Greg Koch and Steve Wagner, Stone Brewing has been a pioneer in bold, hop-forward beers and sustainable brewing practices.',
  brewery_location: 'Escondido, California',
  brewery_website: 'https://stonebrewing.com',
  image_url: '/images/arrogant-bastard.jpg',
  day_of_week: 3,
  created_at: new Date('2024-01-15')
}

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  // In a real app, fetch the actual blog post data here
  const post = mockBlogPost
  
  return {
    title: `${post.title} | Hop Harrison's Beer Blog`,
    description: post.seo_meta_description || post.excerpt,
    keywords: post.seo_keywords?.join(', '),
    authors: [{ name: 'Hop Harrison' }],
    openGraph: {
      title: post.title,
      description: post.seo_meta_description || post.excerpt,
      images: [
        {
          url: post.featured_image_url || '/images/default-hero.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.published_at?.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.seo_meta_description || post.excerpt,
      images: [post.featured_image_url || '/images/default-hero.jpg'],
    },
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  // In a real app, fetch the blog post data based on the slug
  const post = mockBlogPost
  const beerReview = mockBeerReview

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-beer-cream">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={post.featured_image_url || '/images/default-hero.jpg'}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-beer-dark/80 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-beer-dark px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 text-beer-cream/80 text-sm mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatReadTime(post.read_time)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{post.state} • Week {post.week_number}</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-beer-cream/90 max-w-3xl">
              {post.excerpt}
            </p>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {/* Social Actions */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{post.view_count} views</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      text: post.excerpt,
                      url: window.location.href
                    }).catch(console.error);
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="flex items-center gap-2 text-beer-amber hover:text-beer-gold transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Share</span>
              </button>
              <button 
                onClick={() => {
                  const saved = localStorage.getItem('savedArticles') || '[]';
                  const savedArticles = JSON.parse(saved);
                  const isAlreadySaved = savedArticles.some((article: any) => article.id === post.id);
                  
                  if (isAlreadySaved) {
                    const updatedSaved = savedArticles.filter((article: any) => article.id !== post.id);
                    localStorage.setItem('savedArticles', JSON.stringify(updatedSaved));
                    alert('Article removed from saved items');
                  } else {
                    savedArticles.push({
                      id: post.id,
                      title: post.title,
                      slug: post.slug,
                      savedAt: new Date().toISOString()
                    });
                    localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
                    alert('Article saved!');
                  }
                }}
                className="flex items-center gap-2 text-beer-amber hover:text-beer-gold transition-colors"
              >
                <Bookmark className="w-4 h-4" />
                <span className="text-sm font-medium">Save</span>
              </button>
            </div>
          </div>

          {/* State Overview Header */}
          <div className="bg-gradient-to-r from-beer-cream/30 to-beer-amber/10 -mx-8 md:-mx-12 px-8 md:px-12 py-4 mb-8 rounded-lg border border-beer-amber/20">
            <h2 className="text-xl font-bold text-beer-dark mb-1 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-beer-amber" />
              {post.state} Beer Culture & History - Week {post.week_number}
            </h2>
            <p className="text-beer-dark/70 text-sm">
              Exploring the craft beer heritage and regional brewing traditions
            </p>
          </div>

          {/* Article Body */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-beer-dark prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-h2:mb-6 prose-h2:mt-8 prose-h3:mb-4 prose-h3:mt-6 prose-blockquote:border-beer-amber prose-blockquote:bg-beer-cream/30 prose-blockquote:p-6 prose-blockquote:rounded-lg prose-blockquote:my-6 prose-blockquote:border-l-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Beer Review Section */}
          {beerReview && (
            <div className="mt-12 pt-8 border-t-2 border-beer-amber/30">
              <div className="bg-gradient-to-r from-beer-amber/5 to-beer-gold/5 -mx-8 md:-mx-12 px-8 md:px-12 py-6 mb-6 rounded-lg">
                <h2 className="text-2xl font-bold text-beer-dark mb-2 flex items-center gap-3">
                  <span className="bg-beer-amber text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {beerReview.day_of_week}
                  </span>
                  Featured Beer Review - Day {beerReview.day_of_week}
                </h2>
                <p className="text-beer-dark/70 text-sm">
                  Daily spotlight on exceptional craft beer from {post.state}
                </p>
              </div>
              <BeerReviewCard review={beerReview} size="large" />
            </div>
          )}

          {/* Author Bio */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-beer-amber rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">HH</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-beer-dark mb-2">Hop Harrison</h3>
                <p className="text-gray-700 mb-4">
                  Beer explorer and storyteller on a mission to document America's craft beer culture, 
                  one state at a time. Follow along for brewery discoveries, local stories, and the 
                  passionate people behind every great beer.
                </p>
                <Link 
                  href="/about"
                  className="text-beer-amber hover:text-beer-gold font-semibold transition-colors"
                >
                  Learn more about Hop Harrison →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 