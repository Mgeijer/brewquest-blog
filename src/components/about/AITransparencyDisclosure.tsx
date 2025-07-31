import { Bot, CheckCircle, Heart, Search } from 'lucide-react'

export default function AITransparencyDisclosure() {
  return (
    <div className="bg-gradient-to-r from-beer-cream to-beer-amber/10 rounded-xl p-8 border border-beer-amber/20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-beer-amber rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-beer-dark">Meet My AI Beer Buddy</h3>
            <p className="text-gray-600">Full transparency about how this journey works</p>
          </div>
        </div>

        {/* Story */}
        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-gray-700 leading-relaxed">
            <strong>Ever dream of traveling to all 50 states to discover America's best craft beer?</strong> I did too. 
            When life made that journey impossible, I found another way. Meet my AI beer buddy—a passionate 
            researcher and storyteller who's embarking on this adventure for me, one state at a time.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>Full transparency:</strong> While I can't physically visit every brewery, my AI companion 
            does the heavy lifting on research, discovery, and storytelling. Every brewery featured is real, 
            every beer is carefully selected, and every story is worth telling. Think of it as having the 
            world's most dedicated beer researcher who never gets tired and always finds the hidden gems.
          </p>
        </div>

        {/* How It Works Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-beer-amber/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-beer-amber" />
            </div>
            <h4 className="font-semibold text-beer-dark mb-2">Deep Research</h4>
            <p className="text-sm text-gray-600">
              Comprehensive analysis of each state's craft beer scene, local favorites, and hidden gems
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-beer-amber/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-beer-amber" />
            </div>
            <h4 className="font-semibold text-beer-dark mb-2">Passionate Curation</h4>
            <p className="text-sm text-gray-600">
              Every brewery and beer is selected based on quality, uniqueness, and the stories behind them
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-beer-amber/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-beer-amber" />
            </div>
            <h4 className="font-semibold text-beer-dark mb-2">Human Review</h4>
            <p className="text-sm text-gray-600">
              All content is reviewed for accuracy, authenticity, and to ensure it captures the true spirit of craft brewing
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-beer-amber/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-beer-amber" />
            </div>
            <h4 className="font-semibold text-beer-dark mb-2">AI Storytelling</h4>
            <p className="text-sm text-gray-600">
              Engaging narratives that bring brewery stories to life and celebrate the craft beer community
            </p>
          </div>
        </div>

        {/* Trust Message */}
        <div className="mt-8 p-6 bg-white/50 rounded-lg border-l-4 border-beer-amber">
          <p className="text-beer-dark font-medium mb-2">Why This Approach?</p>
          <p className="text-gray-700 text-sm leading-relaxed">
            This AI-powered journey lets me explore and share America's incredible craft beer stories in a way 
            that wouldn't otherwise be possible. It's about discovery, passion, and connecting beer lovers with 
            the amazing breweries and people that make this industry special. Your feedback and engagement help 
            make this journey even better.
          </p>
        </div>
      </div>
    </div>
  )
} 