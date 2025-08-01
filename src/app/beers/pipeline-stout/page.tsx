import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Award, Coffee } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pipeline Stout Review - Broken Tooth Brewing Alaska | BrewQuest Chronicles',
  description: 'Discover Broken Tooth Brewing\'s Pipeline Stout (5.9% ABV), a full-bodied oatmeal stout with smooth, creamy texture and roasted malt character perfect with their famous pizza.',
  keywords: 'Pipeline Stout review, Broken Tooth Brewing, Mooses Tooth, oatmeal stout Alaska, Anchorage brewery, pizza brewery'
}

export default function PipelineStoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-black text-white">
      {/* Navigation */}
      <div className="bg-black/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link 
            href="/states/alaska" 
            className="inline-flex items-center text-gray-300 hover:text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Alaska Beers
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/Beer images/Alaska/Pipeline Stout.png"
                  alt="Pipeline Stout with pizza in background"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -right-4 top-8 bg-black/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-amber-500">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-400">5.9%</div>
                  <div className="text-sm text-gray-400 font-medium">ABV</div>
                </div>
              </div>
              
              <div className="absolute -right-4 top-32 bg-black/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-amber-500">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">32</div>
                  <div className="text-sm text-gray-400 font-medium">IBU</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-amber-600 p-2 rounded-lg">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <span className="text-amber-400 font-semibold tracking-wide">PIZZA PERFECT STOUT</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Pipeline
                <span className="block text-amber-400">Stout</span>
              </h1>
              
              <div className="flex items-center space-x-6 mb-6 text-gray-400">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-amber-400" />
                  <span>Broken Tooth Brewing</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-amber-400" />
                  <span>Anchorage, Alaska</span>
                </div>
              </div>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Full-bodied oatmeal stout with smooth, creamy texture and roasted malt character. 
                Hints of chocolate and coffee create the perfect complement to their world-famous 
                pizza at this iconic Anchorage brewpub.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-black/60 p-4 rounded-lg border border-amber-500/30">
                  <div className="text-sm text-gray-400 mb-1">Style</div>
                  <div className="font-semibold text-white">Oatmeal Stout</div>
                </div>
                <div className="bg-black/60 p-4 rounded-lg border border-amber-500/30">
                  <div className="text-sm text-gray-400 mb-1">Location</div>
                  <div className="font-semibold text-white">Anchorage, Alaska</div>
                </div>
                <div className="bg-black/60 p-4 rounded-lg border border-amber-500/30">
                  <div className="text-sm text-gray-400 mb-1">IBU</div>
                  <div className="font-semibold text-white">32</div>
                </div>
                <div className="bg-black/60 p-4 rounded-lg border border-amber-500/30">
                  <div className="text-sm text-gray-400 mb-1">Serving Temp</div>
                  <div className="font-semibold text-white">50-55°F</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tasting Notes */}
      <section className="py-16 bg-black/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Tasting Experience</h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-black rounded-xl border border-amber-500/30">
              <div className="text-2xl mb-3">👁️</div>
              <h3 className="font-bold mb-2">Appearance</h3>
              <p className="text-gray-400 text-sm">Deep black with ruby highlights, tan head with excellent retention</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-black rounded-xl border border-amber-500/30">
              <div className="text-2xl mb-3">👃</div>
              <h3 className="font-bold mb-2">Aroma</h3>
              <p className="text-gray-400 text-sm">Roasted malt, dark chocolate, coffee notes with subtle oatmeal smoothness</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-black rounded-xl border border-amber-500/30">
              <div className="text-2xl mb-3">👅</div>
              <h3 className="font-bold mb-2">Taste</h3>
              <p className="text-gray-400 text-sm">Rich chocolate and coffee with creamy oatmeal texture, balanced bitterness</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-black rounded-xl border border-amber-500/30">
              <div className="text-2xl mb-3">🫧</div>
              <h3 className="font-bold mb-2">Mouthfeel</h3>
              <p className="text-gray-400 text-sm">Full-bodied, creamy, smooth with moderate carbonation</p>
            </div>
          </div>
          
          <div className="bg-black/60 p-8 rounded-xl shadow-lg border border-amber-500/30">
            <h3 className="text-2xl font-bold mb-6">The Hop Harrison Review</h3>
            <div className="prose prose-lg prose-invert max-w-none">
              <p>
                You can't talk about Pipeline Stout without talking about Moose's Tooth Pub & Pizzeria. 
                This isn't just a brewery – it's an Anchorage institution where locals have been pairing 
                world-class pizza with exceptional craft beer since the early days of Alaska brewing.
              </p>
              <p>
                Pipeline Stout represents everything great about brewpub culture. At 5.9% ABV, it's 
                substantial enough to stand up to rich, cheesy pizza, but smooth enough to drink over 
                a long meal with friends. The oatmeal addition creates a silky mouthfeel that's pure 
                comfort in a glass.
              </p>
              <p>
                What sets this stout apart is its perfect balance. Many oatmeal stouts can be cloying 
                or overly sweet, but Pipeline shows remarkable restraint. The roasted malt character 
                provides backbone without overwhelming bitterness, while the oats contribute creaminess 
                without heaviness.
              </p>
              <p>
                The chocolate and coffee notes aren't artificial – they come from carefully selected 
                roasted malts that create natural complexity. It's the kind of beer that works equally 
                well as a standalone sipper or as the perfect complement to their legendary pizza.
              </p>
              <p>
                <strong>Verdict:</strong> Pipeline Stout embodies the best of Alaska brewpub culture. 
                It's approachable without being simple, flavorful without being overwhelming. This is 
                comfort food in beer form – exactly what you want after a day of Alaska adventures. 
                A perfect representation of how great beer enhances great food.
              </p>
            </div>
            
            <div className="mt-8 p-6 bg-amber-900/30 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-bold mb-2">Perfect Pairings</h4>
              <p className="text-gray-300">
                Pizza (especially their famous combinations), grilled meats, chocolate desserts, 
                aged cheeses, or enjoy while watching the Northern Lights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <section className="py-12 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Alaska Beer Journey Complete!</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/states/alaska" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Alaska Beers
            </Link>
            <Link 
              href="/states" 
              className="border border-amber-500 text-amber-400 hover:bg-amber-900/30 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Explore More States
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}