import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'small' | 'medium' | 'large'
  showNumber?: boolean
  className?: string
}

export default function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'medium', 
  showNumber = true,
  className = '' 
}: StarRatingProps) {
  const filledStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  
  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  }
  
  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, index) => {
          const starIndex = index + 1
          const isFilled = starIndex <= filledStars
          const isHalf = starIndex === filledStars + 1 && hasHalfStar
          
          return (
            <div key={index} className="relative">
              <Star 
                className={`${sizeClasses[size]} ${
                  isFilled 
                    ? 'text-beer-gold fill-beer-gold' 
                    : 'text-gray-300 fill-gray-300'
                }`}
              />
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star 
                    className={`${sizeClasses[size]} text-beer-gold fill-beer-gold`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {showNumber && (
        <span className={`font-semibold text-beer-dark ml-1 ${textSizeClasses[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}