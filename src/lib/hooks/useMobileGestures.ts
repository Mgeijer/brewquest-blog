'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// Types for gesture handling
export interface GestureState {
  isSwipeActive: boolean
  swipeDirection: 'left' | 'right' | 'up' | 'down' | null
  touchStart: { x: number; y: number } | null
  isPullToRefresh: boolean
}

export interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPullToRefresh?: () => void
}

// Swipe gesture hook
export function useSwipeGestures(handlers: SwipeHandlers) {
  const [gestureState, setGestureState] = useState<GestureState>({
    isSwipeActive: false,
    swipeDirection: null,
    touchStart: null,
    isPullToRefresh: false
  })

  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const pullToRefreshRef = useRef(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    const startPoint = { x: touch.clientX, y: touch.clientY }
    
    touchStartRef.current = startPoint
    setGestureState(prev => ({
      ...prev,
      touchStart: startPoint,
      isSwipeActive: true
    }))

    // Check if this might be a pull-to-refresh gesture
    if (window.scrollY === 0 && startPoint.y < 100) {
      pullToRefreshRef.current = true
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return

    const touch = e.touches[0]
    const currentPoint = { x: touch.clientX, y: touch.clientY }
    const deltaX = currentPoint.x - touchStartRef.current.x
    const deltaY = currentPoint.y - touchStartRef.current.y

    // Pull-to-refresh detection
    if (pullToRefreshRef.current && deltaY > 80 && Math.abs(deltaX) < 50) {
      setGestureState(prev => ({
        ...prev,
        isPullToRefresh: true
      }))
      e.preventDefault()
    }
  }, [])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return

    const touch = e.changedTouches[0]
    const endPoint = { x: touch.clientX, y: touch.clientY }
    const deltaX = endPoint.x - touchStartRef.current.x
    const deltaY = endPoint.y - touchStartRef.current.y

    const minSwipeDistance = 50
    const maxSwipeTime = 500

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        const direction = deltaX > 0 ? 'right' : 'left'
        setGestureState(prev => ({ ...prev, swipeDirection: direction }))
        
        if (direction === 'left' && handlers.onSwipeLeft) {
          handlers.onSwipeLeft()
        } else if (direction === 'right' && handlers.onSwipeRight) {
          handlers.onSwipeRight()
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        const direction = deltaY > 0 ? 'down' : 'up'
        setGestureState(prev => ({ ...prev, swipeDirection: direction }))
        
        if (direction === 'up' && handlers.onSwipeUp) {
          handlers.onSwipeUp()
        } else if (direction === 'down' && handlers.onSwipeDown) {
          handlers.onSwipeDown()
        }
      }
    }

    // Handle pull-to-refresh
    if (gestureState.isPullToRefresh && handlers.onPullToRefresh) {
      handlers.onPullToRefresh()
    }

    // Reset state
    touchStartRef.current = null
    pullToRefreshRef.current = false
    setGestureState({
      isSwipeActive: false,
      swipeDirection: null,
      touchStart: null,
      isPullToRefresh: false
    })
  }, [gestureState.isPullToRefresh, handlers])

  return {
    gestureState,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  }
}

// Haptic feedback hook
export function useHapticFeedback() {
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' | 'selection' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        selection: [5]
      }
      navigator.vibrate(patterns[type])
    }
  }, [])

  return { triggerHaptic }
}

// Mobile device detection hook
export function useMobileDetection() {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    screenSize: 'desktop' as 'mobile' | 'tablet' | 'desktop',
    orientation: 'portrait' as 'portrait' | 'landscape',
    touchSupported: false
  })

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const userAgent = navigator.userAgent
      
      const isMobile = width < 640
      const isTablet = width >= 640 && width < 1024
      const isDesktop = width >= 1024
      
      const touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const orientation = width > height ? 'landscape' : 'portrait'
      
      let screenSize: 'mobile' | 'tablet' | 'desktop' = 'desktop'
      if (isMobile) screenSize = 'mobile'
      else if (isTablet) screenSize = 'tablet'

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenSize,
        orientation,
        touchSupported
      })
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    window.addEventListener('orientationchange', checkDevice)

    return () => {
      window.removeEventListener('resize', checkDevice)
      window.removeEventListener('orientationchange', checkDevice)
    }
  }, [])

  return deviceInfo
}

// Touch-friendly interaction hook
export function useTouchFriendly() {
  const [touchState, setTouchState] = useState({
    isPressed: false,
    pressedElement: null as string | null
  })

  const handleTouchStart = useCallback((elementId: string) => {
    setTouchState({
      isPressed: true,
      pressedElement: elementId
    })
  }, [])

  const handleTouchEnd = useCallback(() => {
    setTouchState({
      isPressed: false,
      pressedElement: null
    })
  }, [])

  return {
    touchState,
    handleTouchStart,
    handleTouchEnd
  }
}