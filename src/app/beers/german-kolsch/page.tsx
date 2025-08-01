import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Award, Snowflake } from 'lucide-react'

export const metadata: Metadata = {
  title: 'German Kölsch Review - HooDoo Brewing Fairbanks | BrewQuest Chronicles',
  description: 'Discover HooDoo Brewing\'s authentic German Kölsch (4.8% ABV), brewed with traditional techniques in Alaska\'s interior. Light, crisp, and refreshing with subtle fruit notes.',
  keywords: 'German Kolsch review, HooDoo Brewing, Fairbanks brewery, authentic German beer, Alaska Kolsch, traditional brewing techniques'
}

export default function GermanKolschPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
      {/* Navigation */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link 
            href="/states/alaska" 
            className="inline-flex items-center text-yellow-700 hover:text-yellow-900 font-medium transition-colors"
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
                  src="/images/Beer images/Alaska/German Kolsch.png"
                  alt="German Kölsch in traditional stange glass"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -right-4 top-8 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-yellow-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">4.8%</div>
                  <div className="text-sm text-gray-600 font-medium">ABV</div>
                </div>
              </div>
              
              <div className="absolute -right-4 top-32 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-yellow-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">22</div>
                  <div className="text-sm text-gray-600 font-medium">IBU</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-yellow-600 p-2 rounded-lg">
                  <Snowflake className="w-6 h-6 text-white" />
                </div>
                <span className="text-yellow-700 font-semibold tracking-wide">GERMAN TRADITION</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                German
                <span className="block text-yellow-600">Kölsch</span>
              </h1>
              
              <div className="flex items-center space-x-6 mb-6 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-yellow-600" />
                  <span>HooDoo Brewing</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-yellow-600" />
                  <span>Fairbanks, Alaska</span>
                </div>
              </div>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Authentic German-style Kölsch brewed with traditional techniques in Alaska's interior. 
                Light, crisp, and refreshing with subtle fruit notes, this flagship represents 
                HooDoo's commitment to Old World brewing excellence.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/80 p-4 rounded-lg border border-yellow-200">
                  <div className="text-sm text-gray-600 mb-1">Style</div>
                  <div className="font-semibold text-gray-900">German Kölsch</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-yellow-200">
                  <div className="text-sm text-gray-600 mb-1">Location</div>
                  <div className="font-semibold text-gray-900">Fairbanks, Alaska</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-yellow-200">
                  <div className="text-sm text-gray-600 mb-1">IBU</div>
                  <div className="font-semibold text-gray-900">22</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-yellow-200">
                  <div className="text-sm text-gray-600 mb-1">Serving Temp</div>
                  <div className="font-semibold text-gray-900">40-45°F</div>
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
            <div className="text-center p-6 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl">
              <div className="text-2xl mb-3">👁️</div>
              <h3 className="font-bold text-gray-900 mb-2">Appearance</h3>
              <p className="text-gray-700 text-sm">Pale straw gold, crystal clear with white foam head and excellent clarity</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl">
              <div className="text-2xl mb-3">👃</div>
              <h3 className="font-bold text-gray-900 mb-2">Aroma</h3>
              <p className="text-gray-700 text-sm">Clean malt sweetness with subtle fruit notes, delicate floral hop character</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl">
              <div className="text-2xl mb-3">👅</div>
              <h3 className="font-bold text-gray-900 mb-2">Taste</h3>
              <p className="text-gray-700 text-sm">Crisp, clean, and refreshing with gentle malt sweetness and subtle hop balance</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl">
              <div className="text-2xl mb-3">🫧</div>
              <h3 className="font-bold text-gray-900 mb-2">Mouthfeel</h3>
              <p className="text-gray-700 text-sm">Light-bodied with crisp texture and high carbonation, refreshing finish</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg border border-yellow-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">The Hop Harrison Review</h3>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Finding authentic German Kölsch in Fairbanks, Alaska feels like discovering a hidden gem 
                in the wilderness. HooDoo Brewing's commitment to traditional German brewing techniques 
                in one of America's most remote cities is nothing short of remarkable.
              </p>
              <p>
                What immediately strikes you about this Kölsch is its authenticity. This isn't an 
                American interpretation of the style – it's the real deal. The pale straw color, 
                crystal-clear appearance, and delicate balance are exactly what you'd expect from 
                a brewery in Cologne.
              </p>
              <p>
                At 4.8% ABV, this is quintessential session beer territory. The subtle fruit notes 
                and clean finish make it incredibly drinkable, while the traditional German yeast 
                provides just enough character to keep things interesting. It's refreshing without 
                being bland, traditional without being boring.
              </p>
              <p>
                What's most impressive is how HooDoo has maintained the style's integrity despite 
                Alaska's extreme brewing conditions. The clean fermentation and delicate hop character 
                require precise temperature control – no small feat when you're brewing in Fairbanks.
              </p>
              <p>
                <strong>Verdict:</strong> HooDoo's German Kölsch proves that great beer transcends 
                geography. This is authentic German brewing executed flawlessly in Alaska's interior. 
                Perfect for those who appreciate subtle complexity and traditional craftsmanship. 
                A testament to brewing excellence in the Last Frontier.
              </p>
            </div>
            
            <div className="mt-8 p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-600">
              <h4 className="font-bold text-gray-900 mb-2">Perfect Pairings</h4>
              <p className="text-gray-700">
                Light salads, grilled fish, German sausages, soft cheeses, or as a refreshing 
                palate cleanser between courses. Ideal for Alaska's summer months.
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
              href="/beers/pipeline-stout" 
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Next: Pipeline Stout
            </Link>
            <Link 
              href="/states/alaska" 
              className="border border-yellow-600 text-yellow-600 hover:bg-yellow-50 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              All Alaska Beers
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}