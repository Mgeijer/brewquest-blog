'use client'

import React, { useEffect, useState } from 'react'

interface AnimationConfig {
  enableAnimations: boolean
  reducedMotion: boolean
  duration: number
  easing: string
}

interface StateAnimationProps {
  stateCode: string
  previousStatus?: string
  currentStatus: string
  onAnimationComplete?: () => void
}

// Hook to detect user's motion preferences
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return reducedMotion
}

// Animation configuration hook
export function useAnimationConfig(): AnimationConfig {
  const reducedMotion = useReducedMotion()
  
  return {
    enableAnimations: !reducedMotion,
    reducedMotion,
    duration: reducedMotion ? 0 : 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
}

// State transition animation controller
export function useStateTransition(stateCode: string, status: string) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [animationClass, setAnimationClass] = useState('')
  const config = useAnimationConfig()

  const triggerStatusChange = (newStatus: string) => {
    if (!config.enableAnimations) return

    setIsTransitioning(true)
    
    // Determine animation based on status change
    switch (newStatus) {
      case 'completed':
        setAnimationClass('state-completion-pulse')
        break
      case 'current':
        setAnimationClass('state-activation-glow')
        break
      default:
        setAnimationClass('state-status-change')
    }

    // Reset animation after duration
    setTimeout(() => {
      setIsTransitioning(false)
      setAnimationClass('')
    }, config.duration * 2) // Allow time for animation to complete
  }

  return {
    isTransitioning,
    animationClass,
    triggerStatusChange
  }
}

// Hover animation utilities
export const getHoverAnimationClasses = (
  isHovered: boolean, 
  isFocused: boolean, 
  reducedMotion: boolean
) => {
  if (reducedMotion) {
    return isHovered || isFocused ? 'brightness-110' : ''
  }

  const baseClasses = 'transition-all duration-300 ease-out'
  const hoverClasses = isHovered || isFocused 
    ? 'scale-105 brightness-110 drop-shadow-md' 
    : 'scale-100 drop-shadow-sm'
  
  return `${baseClasses} ${hoverClasses}`
}

// Loading animation for states
export function StateLoadingAnimation({ stateCode }: { stateCode: string }) {
  const config = useAnimationConfig()
  
  if (!config.enableAnimations) {
    return null
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-4 h-4 bg-beer-cream rounded-full animate-pulse" />
    </div>
  )
}

// Progress bar animation hook
export function useProgressAnimation(targetPercentage: number) {
  const [currentPercentage, setCurrentPercentage] = useState(0)
  const config = useAnimationConfig()

  useEffect(() => {
    if (!config.enableAnimations) {
      setCurrentPercentage(targetPercentage)
      return
    }

    const startPercentage = currentPercentage
    const difference = targetPercentage - startPercentage
    const duration = config.duration * 2 // Slower for progress bar
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const newPercentage = startPercentage + (difference * easeOutCubic)
      
      setCurrentPercentage(Math.round(newPercentage))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [targetPercentage, config.enableAnimations, config.duration])

  return currentPercentage
}

// Touch ripple effect for mobile
export function useTouchRipple() {
  const [ripples, setRipples] = useState<Array<{ id: string; x: number; y: number }>>([])
  const config = useAnimationConfig()

  const createRipple = (event: React.TouchEvent | React.MouseEvent) => {
    if (!config.enableAnimations) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ('touches' in event ? event.touches[0].clientX : event.clientX) - rect.left
    const y = ('touches' in event ? event.touches[0].clientY : event.clientY) - rect.top
    
    const newRipple = {
      id: Date.now().toString(),
      x,
      y
    }

    setRipples(prev => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)
  }

  const RippleElements = () => (
    <>
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-4 h-4 bg-beer-cream/30 rounded-full animate-ping" />
        </div>
      ))}
    </>
  )

  return { createRipple, RippleElements }
}

// Celebration animation for completing states
export function CompletionCelebration({ stateCode, onComplete }: { 
  stateCode: string
  onComplete?: () => void 
}) {
  const config = useAnimationConfig()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!config.enableAnimations) {
      onComplete?.()
      return
    }

    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 2000)

    return () => clearTimeout(timer)
  }, [config.enableAnimations, onComplete])

  if (!config.enableAnimations || !isVisible) {
    return null
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="relative">
        {/* Main celebration burst */}
        <div className="w-16 h-16 bg-beer-amber rounded-full animate-ping opacity-75" />
        
        {/* Secondary rings */}
        <div className="absolute inset-0 w-16 h-16 bg-beer-cream rounded-full animate-pulse opacity-50" />
        
        {/* Completion checkmark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-beer-dark animate-bounce" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>

        {/* Sparkle effects */}
        <div className="absolute -top-2 -left-2 w-2 h-2 bg-beer-cream rounded-full animate-bounce delay-100" />
        <div className="absolute -top-2 -right-2 w-2 h-2 bg-beer-cream rounded-full animate-bounce delay-200" />
        <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-beer-cream rounded-full animate-bounce delay-300" />
        <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-beer-cream rounded-full animate-bounce delay-75" />
      </div>
    </div>
  )
}

// Enhanced state style generator with animations
export function getAnimatedStateStyle(
  stateCode: string,
  status: string,
  isHovered: boolean,
  isFocused: boolean,
  isSelected: boolean,
  isLoading: boolean,
  hasError: boolean,
  isNavigating: boolean,
  animationClass: string = '',
  config: AnimationConfig
) {
  
  let baseStyle = ''
  
  // Handle error states
  if (hasError) {
    baseStyle = 'fill-red-300 hover:fill-red-400'
  }
  // Handle loading states
  else if (isLoading) {
    baseStyle = config.enableAnimations 
      ? 'fill-gray-300 animate-pulse' 
      : 'fill-gray-300'
  }
  // Normal state styling
  else {
    switch (status) {
      case 'completed':
        baseStyle = 'fill-beer-amber hover:fill-beer-amber-dark focus:fill-beer-amber-dark'
        break
      case 'current':
        baseStyle = config.enableAnimations
          ? 'fill-beer-cream hover:fill-yellow-400 focus:fill-yellow-400 animate-pulse'
          : 'fill-beer-cream hover:fill-yellow-400 focus:fill-yellow-400'
        break
      case 'upcoming':
        baseStyle = 'fill-gray-200 hover:fill-gray-300 focus:fill-gray-300'
        break
      default:
        baseStyle = 'fill-gray-200 hover:fill-gray-300 focus:fill-gray-300'
    }
  }

  // Add selection styling
  if (isSelected) {
    baseStyle += ' ring-2 ring-beer-foam ring-offset-1'
  }

  // Add focus styling for accessibility
  if (isFocused) {
    baseStyle += ' ring-2 ring-blue-500 ring-offset-1'
  }

  // Add hover/focus effects
  const hoverClasses = getHoverAnimationClasses(isHovered, isFocused, config.reducedMotion)

  // Add cursor styling
  const cursorStyle = isNavigating ? 'cursor-wait' : 'cursor-pointer'

  // Add transition and animation classes
  const transitionClasses = config.enableAnimations 
    ? 'transition-all duration-300 ease-out' 
    : ''

  // Combine all classes
  return [
    baseStyle,
    hoverClasses,
    transitionClasses,
    cursorStyle,
    animationClass,
    'drop-shadow-sm hover:drop-shadow-md'
  ].join(' ').trim()
}

// Utility to trigger celebration when state completes
export function useCelebrationTrigger() {
  const [celebrations, setCelebrations] = useState<string[]>([])

  const triggerCelebration = (stateCode: string) => {
    setCelebrations(prev => [...prev, stateCode])
  }

  const completeCelebration = (stateCode: string) => {
    setCelebrations(prev => prev.filter(code => code !== stateCode))
  }

  return {
    celebrations,
    triggerCelebration,
    completeCelebration
  }
}