import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Award, Thermometer } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Alaskan Amber Review - Gold Rush Recipe Beer | BrewQuest Chronicles',
  description: 'Discover Alaskan Brewing Company\'s flagship Alaskan Amber (5.3% ABV), based on a genuine Gold Rush-era recipe with traditional Bohemian Saaz hops and perfectly balanced malt character.',
  keywords: 'Alaskan Amber review, Alaskan Brewing Company, Gold Rush beer recipe, amber ale Alaska, Juneau brewery, Bohemian Saaz hops'
}

export default function AlaskanAmberPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Navigation */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link 
            href="/states/alaska" 
            className="inline-flex items-center text-amber-700 hover:text-amber-900 font-medium transition-colors"
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
                  src="/images/Beer images/Alaska/Alaskan Amber.png"
                  alt="Alaskan Amber beer bottle and glass"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -right-4 top-8 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-amber-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">5.3%</div>
                  <div className="text-sm text-gray-600 font-medium">ABV</div>
                </div>
              </div>
              
              <div className="absolute -right-4 top-32 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-amber-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">★★★★★</div>
                  <div className="text-sm text-gray-600 font-medium">Rating</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-amber-600 p-2 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <span className="text-amber-700 font-semibold tracking-wide">FLAGSHIP AMBER</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                Alaskan
                <span className="block text-amber-600">Amber</span>
              </h1>
              
              <div className="flex items-center space-x-6 mb-6 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-amber-600" />
                  <span>Alaskan Brewing Company</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-amber-600" />
                  <span>Since 1986</span>
                </div>
              </div>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Based on a genuine Gold Rush-era recipe discovered in historical shipping records, 
                this flagship amber ale uses traditional Bohemian Saaz hops for a perfectly balanced 
                malt-forward experience that launched Alaska's craft beer renaissance.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/80 p-4 rounded-lg border border-amber-200">
                  <div className="text-sm text-gray-600 mb-1">Style</div>
                  <div className="font-semibold text-gray-900">American Amber Ale</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-amber-200">
                  <div className="text-sm text-gray-600 mb-1">Location</div>
                  <div className="font-semibold text-gray-900">Juneau, Alaska</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-amber-200">
                  <div className="text-sm text-gray-600 mb-1">IBU</div>
                  <div className="font-semibold text-gray-900">18</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-amber-200">
                  <div className="text-sm text-gray-600 mb-1">Serving Temp</div>
                  <div className="font-semibold text-gray-900">45-50°F</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tasting Notes */}
      <section className="py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tasting Experience</h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
              <div className="text-2xl mb-3">👁️</div>
              <h3 className="font-bold text-gray-900 mb-2">Appearance</h3>
              <p className="text-gray-700 text-sm">Deep amber with copper highlights, crystal clear with a creamy off-white head</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
              <div className="text-2xl mb-3">👃</div>
              <h3 className="font-bold text-gray-900 mb-2">Aroma</h3>
              <p className="text-gray-700 text-sm">Rich caramel malt sweetness with floral Saaz hop character and subtle bread notes</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
              <div className="text-2xl mb-3">👅</div>
              <h3 className="font-bold text-gray-900 mb-2">Taste</h3>
              <p className="text-gray-700 text-sm">Balanced caramel sweetness with gentle hop bitterness, toasted malt complexity</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
              <div className="text-2xl mb-3">🫧</div>
              <h3 className="font-bold text-gray-900 mb-2">Mouthfeel</h3>
              <p className="text-gray-700 text-sm">Medium body with smooth, creamy texture and moderate carbonation</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg border border-amber-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">The Hop Harrison Review</h3>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Stepping into Alaskan Brewing Company in Juneau, you're immediately struck by the weight of history. 
                This isn't just any craft brewery – it's where Alaska's modern beer renaissance began in 1986, and 
                their flagship Alaskan Amber tells that story in every sip.
              </p>
              <p>
                What makes this amber ale extraordinary isn't just its perfect balance, but its authentic connection 
                to Alaska's Gold Rush past. The recipe was literally discovered in historical shipping records and 
                newspaper archives, making this one of the most historically accurate beers in America.
              </p>
              <p>
                The use of traditional Bohemian Saaz hops creates a distinctly European character that's become 
                increasingly rare in American craft brewing. There's no aggressive hop assault here – instead, 
                you get gentle floral notes that complement rather than compete with the rich, caramel malt backbone.
              </p>
              <p>
                At 5.3% ABV, this is a beer you can actually enjoy over conversation, and that's entirely the point. 
                Like the best of German and Czech brewing traditions, Alaskan Amber prioritizes drinkability and 
                balance over extreme flavors.
              </p>
              <p>
                <strong>Verdict:</strong> This is what American craft brewing looked like before we got obsessed with 
                hop bombs and barrel-aging everything. Alaskan Amber proves that sometimes the most revolutionary 
                thing you can do is perfect the classics. A true gateway beer that deserves respect from even the 
                most jaded craft beer veterans.
              </p>
            </div>
            
            <div className="mt-8 p-6 bg-amber-50 rounded-lg border-l-4 border-amber-600">
              <h4 className="font-bold text-gray-900 mb-2">Perfect Pairings</h4>
              <p className="text-gray-700">
                Grilled salmon, roasted chicken, BBQ pork, aged cheddar cheese, apple pie, 
                or anything you'd enjoy around a campfire in the Alaskan wilderness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brewery Story */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The Brewery Behind the Beer</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Alaskan Brewing Company was founded by 28-year-olds Marcy and Geoff Larson in 1986, 
                  making it the 67th independent brewery in the United States and the first in Juneau 
                  since Prohibition.
                </p>
                <p>
                  The couple discovered the recipe for their flagship amber in the Juneau-Douglas City 
                  Museum, where historical records showed that Douglas City Brewing Company had operated 
                  from 1899-1907 using this exact formulation.
                </p>
                <p>
                  Today, Alaskan Brewing distributes to 25 states and has won numerous international 
                  awards, but they've never forgotten their commitment to Alaska's brewing heritage 
                  and environmental stewardship.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="text-2xl font-bold text-amber-600">1986</div>
                  <div className="text-sm text-gray-600">Founded</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="text-2xl font-bold text-amber-600">25</div>
                  <div className="text-sm text-gray-600">States Distributed</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sustainability Leadership</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>CO₂ recovery system captures and reuses fermentation CO₂</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Mash filter press saves 30% more water than traditional systems</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Spent grain donated to local farmers for cattle feed</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Steam condensate recovery reduces energy consumption</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Your Alaska Beer Journey</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/beers/alaskan-smoked-porter" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Next: Alaskan Smoked Porter
            </Link>
            <Link 
              href="/states/alaska" 
              className="border border-amber-600 text-amber-600 hover:bg-amber-50 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              All Alaska Beers
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}