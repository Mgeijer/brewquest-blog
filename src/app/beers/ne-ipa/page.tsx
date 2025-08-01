import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Award, Waves } from 'lucide-react'

export const metadata: Metadata = {
  title: 'New England IPA Review - Resolution Brewing Alaska | BrewQuest Chronicles',
  description: 'Discover Resolution Brewing\'s New England IPA (6.2% ABV), featuring soft mouthfeel with Citra, El Dorado, and Mosaic hops creating mango creamsicle and pineapple notes.',
  keywords: 'New England IPA review, Resolution Brewing, NEIPA Alaska, Citra Mosaic hops, hazy IPA Anchorage, double dry hopped'
}

export default function NEIPAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Navigation */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link 
            href="/states/alaska" 
            className="inline-flex items-center text-orange-700 hover:text-orange-900 font-medium transition-colors"
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
                  src="/images/Beer images/Alaska/New England IPA.png"
                  alt="Hazy New England IPA with tropical hop aroma"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              <div className="absolute -right-4 top-8 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-orange-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">6.2%</div>
                  <div className="text-sm text-gray-600 font-medium">ABV</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-orange-600 p-2 rounded-lg">
                  <Waves className="w-6 h-6 text-white" />
                </div>
                <span className="text-orange-700 font-semibold tracking-wide">HAZY PERFECTION</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                New England
                <span className="block text-orange-600">IPA</span>
              </h1>
              
              <div className="flex items-center space-x-6 mb-6 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                  <span>Resolution Brewing</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                  <span>Anchorage, Alaska</span>
                </div>
              </div>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Soft, luscious mouthfeel with Citra, El Dorado, and Mosaic hops creating notes of 
                mango creamsicle and pineapple. Double dry-hopped perfection named after Captain 
                James Cook's ship HMS Resolution.
              </p>
              
              <div className="bg-white p-8 rounded-xl shadow-lg border border-orange-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tasting Notes</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Aroma:</strong> Tropical fruit explosion, mango, pineapple, citrus</p>
                  <p><strong>Taste:</strong> Creamy mouthfeel, low bitterness, tropical juice character</p>
                  <p><strong>Finish:</strong> Smooth, hazy, with lingering tropical fruit</p>
                  <p><strong>Pairing:</strong> Spicy Asian cuisine, fish tacos, tropical fruit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Alaska Beer Journey Complete!</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/states/alaska" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Alaska Beers
            </Link>
            <Link 
              href="/states" 
              className="border border-orange-600 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Explore More States
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}