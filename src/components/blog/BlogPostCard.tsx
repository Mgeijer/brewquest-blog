import { BlogPost } from '@/lib/types/blog'
import { formatDate, formatReadTime } from '@/lib/utils'
import { Calendar, Clock, MapPin, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface BlogPostCardProps {
  post: BlogPost
  priority?: boolean
}

export default function BlogPostCard({ post, priority = false }: BlogPostCardProps) {
  return (
    <article className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-beer-amber/30 hover:-translate-y-1">
      {/* Featured Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={post.featured_image_url || '/images/default-beer-post.jpg'}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={priority}
        />
        
        {post.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 bg-beer-amber text-white text-xs font-semibold px-2 py-1 rounded-full">
              <Star className="w-3 h-3" />
              Featured
            </span>
          </div>
        )}

        {/* State Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-beer-dark/80 text-beer-cream text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
            {post.state}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta Information */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
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
            <span>Week {post.week_number}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-beer-dark mb-3 group-hover:text-beer-amber transition-colors duration-200 line-clamp-2">
          <Link href={post.slug.startsWith('states/') ? `/${post.slug}` : `/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-700 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{post.view_count} views</span>
          </div>
          
          <Link 
            href={post.slug.startsWith('states/') ? `/${post.slug}` : `/blog/${post.slug}`}
            className="inline-flex items-center text-beer-amber hover:text-beer-gold font-semibold text-sm transition-colors duration-200"
          >
            Read More
            <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
} 