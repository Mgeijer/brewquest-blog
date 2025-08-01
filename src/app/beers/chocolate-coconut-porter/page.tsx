import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Award, Coffee } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Chocolate Coconut Porter Review - Tropical Porter | BrewQuest Chronicles',
  description: 'Discover King Street Brewing\'s Chocolate Coconut Porter (6.0% ABV), a robust porter infused with cacao nibs and hand-toasted coconut for smooth, velvety texture.',
  keywords: 'Chocolate Coconut Porter review, King Street Brewing, flavored porter Alaska, cacao nibs coconut beer, Anchorage brewery'
}

export default function ChocolateCoconutPorterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
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

      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/Beer images/Alaska/Chocolate Coconut Porter.png"
                  alt="Chocolate Coconut Porter with coconut and cacao"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              <div className="absolute -right-4 top-8 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-amber-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">6.0%</div>
                  <div className="text-sm text-gray-600 font-medium">ABV</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-amber-600 p-2 rounded-lg">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <span className="text-amber-700 font-semibold tracking-wide">TROPICAL PORTER</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                Chocolate
                <span className="block text-amber-600">Coconut Porter</span>
              </h1>
              
              <div className="flex items-center space-x-6 mb-6 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-amber-600" />
                  <span>King Street Brewing</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-amber-600" />
                  <span>Anchorage, Alaska</span>
                </div>
              </div>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Robust porter infused with cacao nibs and hand-toasted coconut, creating a smooth, 
                velvety texture with tropical undertones that transport you to warmer climates despite 
                Alaska's harsh winters.
              </p>
              
              <div className="bg-white p-8 rounded-xl shadow-lg border border-amber-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tasting Notes</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Aroma:</strong> Rich chocolate, toasted coconut, vanilla, coffee</p>
                  <p><strong>Taste:</strong> Smooth chocolate, coconut sweetness, roasted malt backbone</p>
                  <p><strong>Finish:</strong> Velvety, warming, with lingering coconut and cacao</p>
                  <p><strong>Pairing:</strong> Coconut desserts, dark chocolate, tropical cuisine</p>
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
              href="/beers/belgian-triple" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Next: Belgian Triple
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