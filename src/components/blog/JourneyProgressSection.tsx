'use client'

import { useState } from 'react'
import { getCurrentState, getJourneyProgress, getAllStatesData } from '@/lib/data/stateProgress'
import { Clock, MapPin, Calendar, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function JourneyProgressSection() {
  const progress = getJourneyProgress()
  const currentState = getCurrentState()
  const allStates = getAllStatesData()
  
  // Get next few states for preview
  const upcomingStates = allStates
    .filter(state => state.status === 'upcoming')
    .sort((a, b) => a.weekNumber - b.weekNumber)
    .slice(0, 3)

  return (
    <section className="py-12 bg-gradient-to-r from-beer-amber/10 to-beer-gold/10 rounded-2xl border border-beer-amber/20 mb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-beer-amber/20 text-beer-dark px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MapPin className="w-4 h-4" />
            The Journey So Far
          </div>
          <h2 className="text-3xl font-bold text-beer-dark mb-4">
            Following the path across America, one pint at a time
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {progress.completed} of 50 states explored • {progress.percentage}% complete
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-beer-dark">Overall Progress</span>
            <span className="text-sm text-gray-600">{progress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-beer-amber to-beer-gold h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Current State Spotlight */}
        {currentState && (
          <div className="bg-white rounded-xl p-6 mb-8 border border-beer-amber/30 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-beer-amber rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-beer-dark">{currentState.name}</h3>
                  <p className="text-beer-malt">Week {currentState.weekNumber} • Currently exploring</p>
                </div>
              </div>
              <div className="bg-beer-amber/20 text-beer-dark px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                In Progress
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{currentState.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-beer-amber">{currentState.totalBreweries}</div>
                <div className="text-sm text-gray-600">Breweries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-beer-amber">{currentState.featuredBeers?.length || 0}</div>
                <div className="text-sm text-gray-600">Featured Beers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-beer-amber">{currentState.breweryDensity}</div>
                <div className="text-sm text-gray-600">Per 100k People</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-beer-amber capitalize">{currentState.region}</div>
                <div className="text-sm text-gray-600">Region</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link 
                href={`/states/${currentState.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-beer-amber text-white px-4 py-2 rounded-lg hover:bg-beer-gold transition-colors text-sm font-medium"
              >
                View Weekly Journey
              </Link>
              <Link 
                href="/blog?category=reviews"
                className="border border-beer-amber text-beer-amber px-4 py-2 rounded-lg hover:bg-beer-amber hover:text-white transition-colors text-sm font-medium"
              >
                Beer Reviews Only
              </Link>
            </div>
          </div>
        )}

        {/* Upcoming States Preview */}
        <div className="bg-white/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-beer-dark mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Coming Next
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {upcomingStates.map((state) => (
              <div key={state.code} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-beer-dark">{state.name}</h4>
                  <span className="text-xs text-gray-500">Week {state.weekNumber}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{state.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{state.totalBreweries} breweries</span>
                  <span className="capitalize">{state.region}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link 
              href="/states"
              className="inline-flex items-center gap-2 text-beer-amber hover:text-beer-gold font-medium text-sm transition-colors"
            >
              View All 50 States
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}