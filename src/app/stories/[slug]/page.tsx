import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react'
import { foundationStories } from '@/data/foundationStories'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return foundationStories.map((story) => ({
    slug: story.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const story = foundationStories.find((s) => s.slug === slug)
  
  if (!story) {
    return {
      title: 'Story Not Found - BrewQuest Chronicles',
    }
  }

  return {
    title: `${story.title} - BrewQuest Chronicles`,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      images: [story.featuredImage],
    },
  }
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params
  const story = foundationStories.find((s) => s.slug === slug)
  
  if (!story) {
    notFound()
  }

  // Get adjacent stories for navigation
  const currentIndex = foundationStories.findIndex((s) => s.slug === slug)
  const previousStory = currentIndex > 0 ? foundationStories[currentIndex - 1] : null
  const nextStory = currentIndex < foundationStories.length - 1 ? foundationStories[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Back to Stories */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Stories
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Foundation Story
            </span>
            {story.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {story.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {story.subtitle}
          </p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {story.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(story.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {story.readTime}
            </span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
          <Image
            src={story.featuredImage}
            alt={story.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Key Takeaways */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-4 text-lg">Key Takeaways</h2>
          <ul className="space-y-2">
            {story.keyTakeaways.map((takeaway, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-amber-500 mt-1 text-lg">•</span>
                <span className="text-gray-700">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {story.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Article Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid md:grid-cols-2 gap-8">
            {previousStory && (
              <Link 
                href={`/stories/${previousStory.slug}`}
                className="group bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <ArrowLeft className="w-4 h-4" />
                  Previous Story
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors mb-2">
                  {previousStory.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {previousStory.excerpt}
                </p>
              </Link>
            )}
            
            {nextStory && (
              <Link 
                href={`/stories/${nextStory.slug}`}
                className="group bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-end gap-2 text-sm text-gray-500 mb-2">
                  Next Story
                  <ArrowRight className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors mb-2 text-right">
                  {nextStory.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 text-right">
                  {nextStory.excerpt}
                </p>
              </Link>
            )}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Join the Beer Journey
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Get weekly updates about America's craft beer renaissance delivered straight to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500"
            />
            <button className="bg-white text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}