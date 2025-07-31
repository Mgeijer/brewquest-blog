import React from 'react'

interface WeekIndicatorProps {
  weekNumber: number
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function WeekIndicator({ 
  weekNumber, 
  size = 'medium',
  className = '' 
}: WeekIndicatorProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-12 h-12 text-xs'
      case 'large':
        return 'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-xs sm:text-sm md:text-base'
      default: // medium
        return 'w-14 h-14 text-sm'
    }
  }

  return (
    <div 
      className={`
        week-circle 
        ${getSizeClasses()}
        bg-gradient-to-br from-amber-500 to-orange-600 
        rounded-full 
        flex items-center justify-center 
        shadow-lg
        ${className}
      `}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <span className="text-white font-bold leading-none">
        Week {weekNumber}
      </span>
    </div>
  )
}