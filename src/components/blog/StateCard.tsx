import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import WeekIndicator from './WeekIndicator'

interface StateCardProps {
  state: {
    code: string
    name: string
    status: 'current' | 'completed' | 'upcoming'
    weekNumber: number
    totalBreweries: number
    region: string
    description?: string
    imageUrl?: string
  }
  size?: 'small' | 'medium' | 'large'
  showWeekIndicator?: boolean
}

export default function StateCard({ 
  state, 
  size = 'medium',
  showWeekIndicator = true 
}: StateCardProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'p-4'
      case 'large':
        return 'p-8'
      default: // medium
        return 'p-6'
    }
  }

  const getStatusColor = () => {
    switch (state.status) {
      case 'current':
        return 'border-beer-gold bg-gradient-to-br from-amber-900 to-amber-800'
      case 'completed':
        return 'border-green-500 bg-gradient-to-br from-amber-900 to-amber-800'
      case 'upcoming':
        return 'border-amber-700 bg-gradient-to-br from-amber-900 to-amber-800'
      default:
        return 'border-amber-700 bg-gradient-to-br from-amber-900 to-amber-800'
    }
  }

  const getStatusBadge = () => {
    switch (state.status) {
      case 'current':
        return <span className="bg-beer-amber text-white border border-beer-gold text-xs px-2 py-1 rounded-full">Live Now</span>
      case 'completed':
        return <span className="bg-green-600 text-green-100 border border-green-500 text-xs px-2 py-1 rounded-full">Completed</span>
      case 'upcoming':
        return <span className="bg-amber-700 text-amber-200 border border-amber-600 text-xs px-2 py-1 rounded-full">Coming Soon</span>
      default:
        return null
    }
  }

  return (
    <div className={`
      state-card rounded-xl shadow-md border-2 ${getStatusColor()} ${getSizeClasses()}
      transition-all duration-300 cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-xl 
      hover:border-beer-amber group
    `}>
      {/* Header with Week Indicator */}
      {showWeekIndicator && (
        <div className="flex items-center justify-between mb-4">
          <WeekIndicator weekNumber={state.weekNumber} size="small" />
          {getStatusBadge()}
        </div>
      )}

      {/* State Image */}
      {state.imageUrl && (
        <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
          <Image
            src={state.imageUrl}
            alt={`${state.name} landscape`}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* State Info */}
      <div>
        <h3 className="state-name text-xl font-bold text-amber-100 mb-2 group-hover:text-beer-cream transition-colors duration-300">{state.name}</h3>
        <p className="text-sm text-amber-300 mb-3">{state.region} Region</p>
        
        {state.description && (
          <p className="text-amber-200 text-sm mb-4 line-clamp-3">
            {state.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-amber-200 mb-4">
          <div>
            <span className="font-semibold text-amber-100">{state.totalBreweries}</span>
            <span className="ml-1">Breweries</span>
          </div>
          <div>
            <span className="font-semibold text-amber-100">Week {state.weekNumber}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link 
          href={`/states/${state.name.toLowerCase().replace(/\s+/g, '-')}`}
          className={`inline-block w-full text-center py-2 px-4 rounded-lg transition-colors font-medium border ${
            state.status === 'completed'
              ? 'bg-green-600 hover:bg-green-500 text-white border-green-500'
              : state.status === 'current'
              ? 'bg-beer-amber hover:bg-beer-gold text-white border-beer-gold'
              : 'bg-amber-700 hover:bg-amber-600 text-amber-200 border-amber-600'
          }`}
        >
          {state.status === 'current' ? 'Explore Now' : 
           state.status === 'completed' ? 'View Journey' : 
           'Coming Soon'}
        </Link>
      </div>
    </div>
  )
}