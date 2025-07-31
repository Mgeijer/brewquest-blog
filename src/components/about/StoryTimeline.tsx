import { getCompletedStates, getCurrentState, getJourneyProgress } from '@/lib/data/stateProgress'
import { Calendar, CheckCircle, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function StoryTimeline() {
  const completedStates = getCompletedStates()
  const currentState = getCurrentState()
  const progress = getJourneyProgress()

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-beer-amber" />
          <h2 className="text-3xl font-bold text-beer-dark">The Journey So Far</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Following the path across America, one pint at a time
        </p>
        
        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3 max-w-md mx-auto mb-4">
          <div 
            className="bg-gradient-to-r from-beer-amber to-beer-gold h-3 rounded-full transition-all duration-1000"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-beer-amber">{progress.completed}</span> of {progress.total} states explored
          <span className="mx-2">•</span>
          <span className="font-semibold text-beer-amber">{progress.percentage}%</span> complete
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-beer-amber via-beer-gold to-gray-300"></div>

        {/* Completed States */}
        {completedStates.map((state, index) => (
          <div key={state.code} className="relative flex items-start gap-6 pb-12">
            {/* Timeline Dot */}
            <div className="relative z-10 w-16 h-16 bg-beer-amber rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-beer-dark">{state.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>Week {state.weekNumber}</span>
                      </div>
                      {state.completionDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{state.completionDate.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="bg-beer-amber/10 text-beer-amber text-xs font-semibold px-3 py-1 rounded-full">
                    Completed
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{state.description}</p>
                
                {/* Featured Breweries */}
                {state.featuredBreweries && state.featuredBreweries.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-beer-dark text-sm mb-2">Featured Breweries:</h4>
                    <div className="flex flex-wrap gap-2">
                      {state.featuredBreweries.map((brewery) => (
                        <span 
                          key={brewery}
                          className="bg-beer-cream text-beer-dark text-xs px-2 py-1 rounded-full"
                        >
                          {brewery}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Read Post Link */}
                {state.blogPostSlug && (
                  <Link 
                    href={`/blog/${state.blogPostSlug}`}
                    className="inline-flex items-center text-beer-amber hover:text-beer-gold font-semibold text-sm transition-colors"
                  >
                    Read the full story
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Current State */}
        {currentState && (
          <div className="relative flex items-start gap-6 pb-12">
            {/* Timeline Dot - Animated */}
            <div className="relative z-10 w-16 h-16 bg-beer-gold rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Clock className="w-8 h-8 text-white" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-gradient-to-r from-beer-gold/10 to-beer-amber/10 rounded-xl shadow-md p-6 border border-beer-amber/30">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-beer-dark">{currentState.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>Week {currentState.weekNumber}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Currently exploring</span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-beer-gold text-white text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
                    In Progress
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{currentState.description}</p>
                
                {/* Featured Breweries */}
                {currentState.featuredBreweries && currentState.featuredBreweries.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-beer-dark text-sm mb-2">Exploring These Breweries:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentState.featuredBreweries.map((brewery) => (
                        <span 
                          key={brewery}
                          className="bg-beer-gold/20 text-beer-dark text-xs px-2 py-1 rounded-full border border-beer-gold/30"
                        >
                          {brewery}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-beer-dark font-medium">
                  🍺 Story coming soon! Follow along for real-time updates.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coming Next */}
        <div className="relative flex items-start gap-6">
          {/* Timeline Dot */}
          <div className="relative z-10 w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="w-8 h-8 text-gray-500" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-600 mb-2">The Journey Continues...</h3>
              <p className="text-gray-500 mb-4">
                {progress.total - progress.completed - 1} more states await discovery. Each week brings new breweries, new flavors, and new stories 
                from America's incredible craft beer landscape.
              </p>
              <div className="text-sm text-gray-500">
                Next up: Oregon, Vermont, Maine, and more amazing brewing destinations!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 