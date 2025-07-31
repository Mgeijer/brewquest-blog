'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllStatesData, getJourneyProgress, getRegionalStatistics } from '@/lib/data/stateProgress'
import { MapPin, Calendar, Star, Users, ExternalLink, Map } from 'lucide-react'

const regions = {
  northeast: { name: 'Northeast', color: 'bg-blue-500' },
  southeast: { name: 'Southeast', color: 'bg-green-500' },
  midwest: { name: 'Midwest', color: 'bg-yellow-500' },
  southwest: { name: 'Southwest', color: 'bg-orange-500' },
  west: { name: 'West', color: 'bg-purple-500' }
}

export default function StatesPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  
  const allStates = getAllStatesData()
  const journeyProgress = getJourneyProgress()
  const regionalStats = getRegionalStatistics()

  // Filter states based on selected region and status
  const filteredStates = allStates.filter(state => {
    const regionMatch = selectedRegion === 'all' || state.region === selectedRegion
    const statusMatch = selectedStatus === 'all' || state.status === selectedStatus
    return regionMatch && statusMatch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 text-green-100 border-green-500'
      case 'current':
        return 'bg-beer-amber text-white border-beer-gold'
      case 'upcoming':
        return 'bg-amber-700 text-amber-200 border-amber-600'
      default:
        return 'bg-amber-700 text-amber-200 border-amber-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'current':
        return 'In Progress'
      case 'upcoming':
        return 'Coming Soon'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-beer-cream">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-beer-amber to-beer-gold text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              50 States Beer Journey
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 mb-8">
              Explore America's craft beer scene, one state at a time. Follow Hop Harrison's weekly adventures across all 50 states.
            </p>
            
            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{journeyProgress.completed}</div>
                <div className="text-sm opacity-90">States Completed</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{journeyProgress.percentage}%</div>
                <div className="text-sm opacity-90">Journey Complete</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{allStates.reduce((sum, state) => sum + (state.totalBreweries || 0), 0)}</div>
                <div className="text-sm opacity-90">Breweries to Explore</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Interactive Map CTA */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-beer-amber rounded-full flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-beer-dark">Interactive Journey Map</h3>
                <p className="text-gray-600">Visualize the 50-state beer journey on our interactive map</p>
              </div>
            </div>
            <Link 
              href="/blog#interactive-map"
              className="bg-beer-amber hover:bg-beer-gold text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              View Map
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-6">
          <div className="flex items-center space-x-3">
            <label htmlFor="region-filter" className="text-sm font-semibold text-beer-dark">
              Filter by region:
            </label>
            <select
              id="region-filter"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-beer-dark focus:outline-none focus:ring-2 focus:ring-beer-amber focus:border-beer-amber"
            >
              <option value="all">All Regions</option>
              <option value="northeast">Northeast</option>
              <option value="southeast">Southeast</option>
              <option value="midwest">Midwest</option>
              <option value="southwest">Southwest</option>
              <option value="west">West</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-3">
            <label htmlFor="status-filter" className="text-sm font-semibold text-beer-dark">
              Filter by status:
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-beer-dark focus:outline-none focus:ring-2 focus:ring-beer-amber focus:border-beer-amber"
            >
              <option value="all">All States</option>
              <option value="completed">Completed</option>
              <option value="current">Current</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          <div className="ml-auto">
            <span className="text-sm text-gray-600">
              {filteredStates.length} states found
            </span>
          </div>
        </div>

        {/* States Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredStates.map((state) => (
            <div
              key={state.code}
              className="state-card bg-gradient-to-br from-amber-900 to-amber-800 rounded-xl shadow-lg border border-amber-700 overflow-hidden transition-all duration-300 cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-xl hover:border-beer-amber group"
            >
              {/* State Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="state-name text-xl font-bold text-amber-100 mb-1 group-hover:text-beer-cream transition-colors duration-300">
                      {state.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-amber-300 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{regions[state.region].name}</span>
                      <span className="text-amber-500">•</span>
                      <Calendar className="w-4 h-4" />
                      <span>Week {state.weekNumber}</span>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(state.status)}`}>
                    {getStatusText(state.status)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-amber-200 text-sm mb-4 line-clamp-2">
                  {state.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center bg-amber-800/50 rounded-lg p-3 border border-amber-700">
                    <div className="text-lg font-bold text-amber-100">
                      {state.totalBreweries}
                    </div>
                    <div className="text-xs text-amber-300">Breweries</div>
                  </div>
                  <div className="text-center bg-amber-800/50 rounded-lg p-3 border border-amber-700">
                    <div className="text-lg font-bold text-amber-100">
                      {state.breweryDensity}
                    </div>
                    <div className="text-xs text-amber-300">Per 100k Pop</div>
                  </div>
                </div>

                {/* Featured Beers Count */}
                {state.featuredBeers && state.featuredBeers.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-beer-amber" />
                    <span className="text-sm text-amber-200">
                      {state.featuredBeers.length} featured beers
                    </span>
                  </div>
                )}

                {/* Action Button */}
                <Link
                  href={`/states/${state.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    state.status === 'completed'
                      ? 'bg-green-600 hover:bg-green-500 text-white border border-green-500'
                      : state.status === 'current'
                      ? 'bg-beer-amber hover:bg-beer-gold text-white border border-beer-gold'
                      : 'bg-amber-700 hover:bg-amber-600 text-amber-200 border border-amber-600'
                  }`}
                >
                  {state.status === 'completed' && 'Explore Journey'}
                  {state.status === 'current' && 'Current Adventure'}
                  {state.status === 'upcoming' && 'Coming Soon'}
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Regional Statistics */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-6">Regional Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {Object.entries(regionalStats).map(([regionKey, stats]) => (
              <div key={regionKey} className="text-center">
                <div className={`w-12 h-12 ${regions[regionKey as keyof typeof regions].color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-beer-dark mb-2">
                  {regions[regionKey as keyof typeof regions].name}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>{stats.count} states</div>
                  <div>{stats.totalBreweries} breweries</div>
                  <div>{stats.avgDensity} avg density</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Progress */}
        <div className="bg-gradient-to-r from-beer-amber/10 to-beer-gold/10 rounded-xl p-8 border border-beer-amber/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-beer-dark mb-4">Journey Progress</h2>
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-beer-amber to-beer-gold h-4 rounded-full transition-all duration-500"
                  style={{ width: `${journeyProgress.percentage}%` }}
                ></div>
              </div>
              <p className="text-gray-700">
                <span className="font-semibold text-beer-dark">{journeyProgress.completed}</span> of <span className="font-semibold text-beer-dark">{journeyProgress.total}</span> states explored
                {journeyProgress.percentage < 100 && (
                  <span className="text-gray-600"> • {journeyProgress.total - journeyProgress.completed} states remaining</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}