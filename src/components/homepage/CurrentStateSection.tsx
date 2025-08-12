'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Star, ArrowRight } from 'lucide-react'
import { getCurrentState } from '@/lib/data/stateProgress'

interface StateProgress {
  state_code: string
  state_name: string
  status: string
  week_number: number
  total_breweries: number
  featured_beers_count: number
  description?: string
}

interface ProgressStats {
  completed_states: number
  total_states: number
}

export default function CurrentStateSection() {
  const [currentState, setCurrentState] = useState<StateProgress | null>(null)
  const [completedCount, setCompletedCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentState = async () => {
      try {
        const response = await fetch('/api/states/progress?include_stats=true')
        const data = await response.json()
        
        // Find the current state
        const current = data.states?.find((state: StateProgress) => state.status === 'current')
        const completed = data.statistics?.completed_states || 0
        
        // If API data is incomplete (no breweries), use local fallback
        if (current && current.total_breweries === 0) {
          const localState = getCurrentState()
          if (localState) {
            const enhancedState = {
              ...current,
              total_breweries: localState.totalBreweries || 0,
              featured_beers_count: localState.featuredBeers?.length || 0,
              description: localState.description
            }
            setCurrentState(enhancedState)
          } else {
            setCurrentState(current)
          }
        } else {
          setCurrentState(current)
        }
        setCompletedCount(completed)
      } catch (error) {
        console.error('Error fetching current state:', error)
        // Fallback to local data if API fails
        const localState = getCurrentState()
        if (localState) {
          const fallbackState = {
            state_code: localState.code,
            state_name: localState.name,
            status: localState.status,
            week_number: localState.weekNumber,
            total_breweries: localState.totalBreweries || 0,
            featured_beers_count: localState.featuredBeers?.length || 0,
            description: localState.description
          }
          setCurrentState(fallbackState)
          setCompletedCount(localState.status === 'completed' ? 1 : 0)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentState()
  }, [])

  if (loading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4 max-w-md mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded mb-8 max-w-lg mx-auto"></div>
            <div className="bg-gray-100 rounded-xl p-8 md:p-12 h-96"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!currentState) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Journey Paused
          </h2>
          <p className="text-xl text-gray-600">
            Check back soon for the next state in our 50-state beer journey
          </p>
        </div>
      </section>
    )
  }

  const stateImage = `/images/State Images/${currentState.state_name}.png`
  const stateNickname = getStateNickname(currentState.state_code)
  const remainingStates = 50 - completedCount - 1 // -1 for current state
  
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Now Exploring: {currentState.state_name}
          </h2>
          <p className="text-xl text-gray-600">
            Week {currentState.week_number} of our 50-state journey in {stateNickname || currentState.state_name}
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full font-medium">
                  Live Now
                </span>
                <span>Week {currentState.week_number} • State {currentState.week_number} of 50</span>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {currentState.state_name}'s Craft Beer Scene
              </h3>
              
              <p className="text-lg text-gray-700 mb-6">
                {currentState.description || 
                  `Discover ${currentState.state_name}'s thriving craft beer scene, featuring ${currentState.featured_beers_count} exceptional breweries and their signature beers. Join us as we explore the unique flavors and brewing traditions that make this state special.`
                }
              </p>
              
              <div className="bg-white p-6 rounded-lg mb-6 border border-amber-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  This Week's Features:
                </h4>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>{currentState.featured_beers_count} featured {currentState.state_name} breweries with complete stories</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Daily beer reviews with detailed tasting notes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Local brewery history and founder insights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Interactive journey map tracking our progress</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href={`/states/${currentState.state_name.toLowerCase()}`}
                  className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold text-center flex items-center justify-center gap-2"
                >
                  Read {currentState.state_name} Story
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/blog?category=reviews"
                  className="border border-amber-600 text-amber-600 px-6 py-3 rounded-lg hover:bg-amber-50 transition-colors font-semibold text-center"
                >
                  View Beer Reviews
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                <Image
                  src={stateImage}
                  alt={`${currentState.state_name} state landscape`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to a generic image if state image doesn't exist
                    ;(e.target as HTMLImageElement).src = '/images/default-state.png'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
                  <div className="text-xs text-gray-600 font-medium">{currentState.state_name} • Week {currentState.week_number}</div>
                  <div className="text-sm font-bold text-gray-900">{currentState.featured_beers_count} Breweries Featured</div>
                </div>
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span className="font-medium text-gray-900">{stateNickname || currentState.state_name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Stats */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">{currentState.total_breweries}+</div>
            <div className="text-gray-600 text-sm">{currentState.state_name} Breweries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">{currentState.featured_beers_count}</div>
            <div className="text-gray-600 text-sm">Featured This Week</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">{completedCount}</div>
            <div className="text-gray-600 text-sm">{completedCount === 1 ? 'State Complete' : 'States Complete'}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">{remainingStates}</div>
            <div className="text-gray-600 text-sm">{remainingStates === 1 ? 'State Remaining' : 'States Remaining'}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Helper function to get state nicknames
function getStateNickname(stateCode: string): string | null {
  const nicknames: Record<string, string> = {
    'AL': 'Heart of Dixie',
    'AK': 'The Last Frontier',
    'AZ': 'The Grand Canyon State',
    'AR': 'The Natural State',
    'CA': 'The Golden State',
    'CO': 'The Centennial State',
    'CT': 'The Constitution State',
    'DE': 'The First State',
    'FL': 'The Sunshine State',
    'GA': 'The Peach State',
    // Add more as needed
  }
  
  return nicknames[stateCode] || null
}