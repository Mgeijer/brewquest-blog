import Image from 'next/image'
import Link from 'next/link'
import { Clock, Calendar, User, ArrowLeft } from 'lucide-react'
import { foundationStories } from '@/data/foundationStories'
import { getCurrentState, getStateTitle } from '@/lib/data/stateProgress'

export const metadata = {
  title: 'All Beer Culture Stories - BrewQuest Chronicles',
  description: 'Explore our complete collection of American beer culture stories, from the craft beer renaissance to regional brewing traditions.',
}

export default function AllStoriesPage() {
  const currentState = getCurrentState()
  const stateTitle = getStateTitle(currentState?.code || '')
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Homepage
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              All Beer Culture Stories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dive deep into the complete collection of American beer culture stories, 
              exploring the history, pioneers, and traditions that shaped our brewing heritage.
            </p>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {foundationStories.map((story, index) => (
            <article 
              key={story.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative h-48">
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
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {story.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {story.excerpt}
                </p>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Key Highlights:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {story.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span className="line-clamp-1">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/stories/${story.slug}`}
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                  >
                    Read Full Story
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
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            More Stories Coming Soon
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Follow our 50-state journey as we explore America's greatest breweries, 
            one state at a time. Each week brings new discoveries, brewery profiles, 
            and the stories behind your favorite beers.
          </p>
          
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {currentState?.status === 'current' ? 'Now Exploring' : 'Starting Soon'}: Week {currentState?.weekNumber || 1} - {currentState?.name || 'Current State'}
                </h3>
                <p className="text-gray-700 mb-6">
                  Join us as we {currentState?.status === 'current' ? 'explore' : 'kick off our journey in'} {stateTitle.replace(' Brewing', '')}, 
                  {currentState?.status === 'current' ? 'currently discovering' : 'exploring'} {currentState?.name || 'the state'}'s {currentState?.status === 'current' ? 'thriving' : 'surprising'} craft beer {currentState?.status === 'current' ? 'scene' : 'renaissance'} with 
                  {currentState?.featuredBeers?.length || 7} featured breweries and their signature beers.
                </p>
                <button className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold">
                  Get Notified
                </button>
              </div>
              
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src="/images/Craft-Brewery-Landscape.png"
                  alt="Craft brewery landscape"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Never Miss a Beer Story
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Subscribe to get weekly brewery discoveries, beer reviews, and behind-the-scenes stories delivered to your inbox.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500"
              />
              <button className="bg-white text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-white/80 text-sm mt-4">
              Join 1,200+ beer enthusiasts. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}