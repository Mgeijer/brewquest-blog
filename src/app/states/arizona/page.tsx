import { getCurrentState } from '@/lib/data/stateProgress'
import Link from 'next/link'

export default function ArizonaPage() {
  return (
    <div className="min-h-screen bg-beer-cream">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Arizona Beer Journey
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Where desert innovation meets thousand-year brewing traditions
            </p>
            <div className="mt-8">
              <span className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-lg font-medium">
                🍺 Week 3 Journey • Day 7 of 7
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Arizona Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="card text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">108</div>
            <div className="text-gray-600">Active Breweries</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">#8</div>
            <div className="text-gray-600">Per Capita Rank</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">$2.1B</div>
            <div className="text-gray-600">Economic Impact</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">11,000+</div>
            <div className="text-gray-600">Jobs Created</div>
          </div>
        </div>

        {/* Featured Beers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-beer-dark mb-8 text-center">
            Arizona's Featured Beers
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Prickly Pear Wheat",
                brewery: "Four Peaks Brewing",
                style: "Fruit Beer",
                abv: 4.2,
                rating: 4,
                description: "Desert-inspired wheat beer featuring local prickly pear cactus fruit"
              },
              {
                name: "Desert Eagle IPA", 
                brewery: "SanTan Brewing",
                style: "American IPA",
                abv: 7.3,
                rating: 4.5,
                description: "Bold IPA showcasing citrus hops with a hint of desert spice"
              },
              {
                name: "Kilt Lifter",
                brewery: "Four Peaks Brewing", 
                style: "Scottish Ale",
                abv: 6.0,
                rating: 4,
                description: "Arizona's flagship beer with rich malt character and smooth finish"
              },
              {
                name: "Flagstaff IPA",
                brewery: "Mother Percolator",
                style: "American IPA", 
                abv: 6.8,
                rating: 4,
                description: "High-altitude IPA from Flagstaff with citrus and pine hop character"
              },
              {
                name: "Desert Stout",
                brewery: "Wren House Brewing",
                style: "American Stout",
                abv: 5.8,
                rating: 4.5,
                description: "Rich stout with chocolate and coffee notes, perfect for desert nights"
              },
              {
                name: "Sonoran Wheat",
                brewery: "Dragoon Brewing",
                style: "American Wheat",
                abv: 4.8,
                rating: 4,
                description: "Light and refreshing wheat beer inspired by the Sonoran Desert"
              },
              {
                name: "Copper State Amber",
                brewery: "Arizona Wilderness",
                style: "Amber Ale",
                abv: 5.2,
                rating: 4,
                description: "Balanced amber ale celebrating Arizona's copper mining heritage"
              }
            ].map((beer, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
                    Day {index + 1}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="font-medium">{beer.rating}/5</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-beer-dark mb-2">
                  {beer.name}
                </h3>
                <p className="text-red-600 font-medium mb-2">
                  {beer.brewery}
                </p>
                <p className="text-gray-600 mb-2">
                  {beer.style} • {beer.abv}% ABV
                </p>
                <p className="text-gray-700 text-sm">
                  {beer.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Arizona Brewing Excellence */}
        <div className="card mb-12">
          <h2 className="text-2xl font-bold text-beer-dark mb-6">
            Arizona's Brewing Excellence
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-600">
                🏜️ Desert Terroir
              </h3>
              <p className="text-gray-700 mb-4">
                Arizona's unique high-desert climate creates distinctive fermentation profiles and allows year-round brewing with innovative cooling techniques perfected in extreme heat.
              </p>
              <h3 className="text-lg font-semibold mb-3 text-red-600">
                🌵 Indigenous Ingredients
              </h3>
              <p className="text-gray-700">
                Prickly pear cactus, mesquite honey, cholla buds, and desert sage create flavor profiles impossible to replicate anywhere else in America.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-600">
                ☀️ Solar Sustainability
              </h3>
              <p className="text-gray-700 mb-4">
                Arizona breweries lead the nation in solar-powered operations, turning the relentless desert sun into sustainable energy for eco-friendly brewing.
              </p>
              <h3 className="text-lg font-semibold mb-3 text-red-600">
                🏛️ Ancient Heritage
              </h3>
              <p className="text-gray-700">
                Modern craft brewing built on 1,000+ year old traditions from Hohokam and Ancestral Puebloan cultures who brewed corn-based beverages in this desert.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link 
            href="/blog?category=reviews"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors mr-4"
          >
            Read All Beer Reviews 🍺
          </Link>
          <Link 
            href="/newsletter"
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            Get Weekly Updates 📧
          </Link>
        </div>
      </div>
    </div>
  )
}