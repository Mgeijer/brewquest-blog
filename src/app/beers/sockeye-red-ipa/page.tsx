import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Award, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sockeye Red IPA Review - Pacific Northwest Style | BrewQuest Chronicles',
  description: 'Discover Midnight Sun Brewing\'s flagship Sockeye Red IPA (5.7% ABV), featuring aggressive Centennial, Cascade, and Simcoe hops with distinctive red hue from specialty malts.',
  keywords: 'Sockeye Red IPA review, Midnight Sun Brewing, red IPA Alaska, Anchorage brewery, Pacific Northwest IPA, Centennial hops Cascade Simcoe'
}

export default function SockeyeRedIPAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Navigation */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link 
            href="/states/alaska" 
            className="inline-flex items-center text-red-700 hover:text-red-900 font-medium transition-colors"
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
                  src="/images/Beer images/Alaska/Sockeye Red IPA.png"
                  alt="Sockeye Red IPA bottle and glass with hop cones"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -right-4 top-8 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-red-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">5.7%</div>
                  <div className="text-sm text-gray-600 font-medium">ABV</div>
                </div>
              </div>
              
              <div className="absolute -right-4 top-32 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-red-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">70</div>
                  <div className="text-sm text-gray-600 font-medium">IBU</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-red-700 font-semibold tracking-wide">FLAGSHIP RED IPA</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                Sockeye
                <span className="block text-red-600">Red IPA</span>
              </h1>
              
              <div className="flex items-center space-x-6 mb-6 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-red-600" />
                  <span>Midnight Sun Brewing</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-red-600" />
                  <span>Since 1995</span>
                </div>
              </div>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Bold Pacific Northwest-style IPA with distinctive red hue from specialty malts. 
                Aggressively hopped with Centennial, Cascade, and Simcoe varieties for explosive 
                citrus and pine character that defines Anchorage craft brewing.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/80 p-4 rounded-lg border border-red-200">
                  <div className="text-sm text-gray-600 mb-1">Style</div>
                  <div className="font-semibold text-gray-900">Red IPA</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-red-200">
                  <div className="text-sm text-gray-600 mb-1">Location</div>
                  <div className="font-semibold text-gray-900">Anchorage, Alaska</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-red-200">
                  <div className="text-sm text-gray-600 mb-1">IBU</div>
                  <div className="font-semibold text-gray-900">70</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-red-200">
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
            <div className="text-center p-6 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl">
              <div className="text-2xl mb-3">👁️</div>
              <h3 className="font-bold text-gray-900 mb-2">Appearance</h3>
              <p className="text-gray-700 text-sm">Deep amber-red with copper highlights, hazy with a persistent off-white head</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl">
              <div className="text-2xl mb-3">👃</div>
              <h3 className="font-bold text-gray-900 mb-2">Aroma</h3>
              <p className="text-gray-700 text-sm">Explosive citrus and pine with grapefruit, orange peel, and resinous hop character</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl">
              <div className="text-2xl mb-3">👅</div>
              <h3 className="font-bold text-gray-900 mb-2">Taste</h3>
              <p className="text-gray-700 text-sm">Bold hop bitterness balanced by caramel malt sweetness, citrus and pine finish</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl">
              <div className="text-2xl mb-3">🫧</div>
              <h3 className="font-bold text-gray-900 mb-2">Mouthfeel</h3>
              <p className="text-gray-700 text-sm">Medium-full body with creamy texture and assertive carbonation</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">The Hop Harrison Review</h3>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Walking into Midnight Sun Brewing in Anchorage, you immediately understand why this 
                brewery has become synonymous with bold, unapologetic hop character. Their Sockeye Red IPA 
                isn't just their flagship – it's a statement about what Pacific Northwest brewing can be 
                when pushed to its logical extreme.
              </p>
              <p>
                The red hue isn't just for show. Those specialty malts provide a caramel backbone that's 
                essential for balancing the aggressive 70 IBU hop assault. Without this malt foundation, 
                the triple-hop combination of Centennial, Cascade, and Simcoe would be overwhelming. 
                Instead, you get complexity.
              </p>
              <p>
                What sets this apart from typical West Coast IPAs is the Alaskan attitude. This beer 
                doesn't apologize for being big, bold, and in-your-face. At 5.7% ABV, it's surprisingly 
                drinkable for something with this much hop intensity, but make no mistake – this is 
                designed for serious hop heads.
              </p>
              <p>
                The Simcoe hops are the star here, providing those distinctive tropical fruit notes that 
                play beautifully against the citrus character from Centennial and Cascade. It's like 
                drinking the essence of an Alaska wilderness adventure – bold, uncompromising, and 
                unforgettable.
              </p>
              <p>
                <strong>Verdict:</strong> This is what happens when Pacific Northwest hop culture meets 
                Alaska frontier spirit. Sockeye Red IPA is aggressive without being unbalanced, bold 
                without being crude. A perfect representation of Midnight Sun's commitment to pushing 
                boundaries while respecting traditional brewing principles.
              </p>
            </div>
            
            <div className="mt-8 p-6 bg-red-50 rounded-lg border-l-4 border-red-600">
              <h4 className="font-bold text-gray-900 mb-2">Perfect Pairings</h4>
              <p className="text-gray-700">
                Spicy foods, grilled salmon, sharp cheeses, hop-forward dishes, or anything that 
                can stand up to bold flavors. Great with Alaskan king crab.
              </p>
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
              href="/beers/berserker-imperial-stout" 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Next: Berserker Imperial Stout
            </Link>
            <Link 
              href="/states/alaska" 
              className="border border-red-600 text-red-600 hover:bg-red-50 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              All Alaska Beers
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}