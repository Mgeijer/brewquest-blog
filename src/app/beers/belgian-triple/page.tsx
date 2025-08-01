import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Award, Crown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Belgian Triple Review - Cynosure Brewing Alaska | BrewQuest Chronicles',
  description: 'Discover Cynosure Brewing\'s Belgian Triple (9.7% ABV), deceptively smooth despite its strength with subtle spice and fruit tones and complex Belgian yeast character.',
  keywords: 'Belgian Triple review, Cynosure Brewing, Belgian tripel Alaska, high ABV beer Anchorage, Belgian yeast character'
}

export default function BelgianTriplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
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

      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/Beer images/Alaska/Belgian Triple.png"
                  alt="Belgian Triple in tulip glass with Belgian styling"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              <div className="absolute -right-4 top-8 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-yellow-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">9.7%</div>
                  <div className="text-sm text-gray-600 font-medium">ABV</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-yellow-600 p-2 rounded-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <span className="text-yellow-700 font-semibold tracking-wide">BELGIAN EXCELLENCE</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                Belgian
                <span className="block text-yellow-600">Triple</span>
              </h1>
              
              <div className="flex items-center space-x-6 mb-6 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-yellow-600" />
                  <span>Cynosure Brewing</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-yellow-600" />
                  <span>Anchorage, Alaska</span>
                </div>
              </div>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Deceptively smooth despite its 9.7% strength, featuring subtle spice and fruit tones 
                with pale gold appearance and complex Belgian yeast character that showcases authentic 
                Old World brewing techniques in the Last Frontier.
              </p>
              
              <div className="bg-white p-8 rounded-xl shadow-lg border border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tasting Notes</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Aroma:</strong> Spicy phenolics, fruity esters, honey, coriander</p>
                  <p><strong>Taste:</strong> Smooth honey sweetness, spice complexity, dry finish</p>
                  <p><strong>Finish:</strong> Warming alcohol, Belgian yeast character</p>
                  <p><strong>Pairing:</strong> Belgian cheeses, seafood, spicy cuisine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/beers/ne-ipa" 
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Next: New England IPA
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