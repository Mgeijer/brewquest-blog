'use client'

// Mobile-specific performance optimizations and utilities

export interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  interactionTime: number
  memoryUsage?: number
}

// Lazy loading utilities for mobile
export class MobileLazyLoader {
  private observer: IntersectionObserver | null = null
  private loadedItems = new Set<string>()

  constructor() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement
              const itemId = element.dataset.lazyId
              if (itemId && !this.loadedItems.has(itemId)) {
                this.loadItem(element, itemId)
              }
            }
          })
        },
        {
          rootMargin: '50px',
          threshold: 0.1
        }
      )
    }
  }

  private loadItem(element: HTMLElement, itemId: string) {
    const onLoad = element.dataset.onLoad
    if (onLoad) {
      try {
        const loadFunction = new Function('element', onLoad)
        loadFunction(element)
        this.loadedItems.add(itemId)
        this.observer?.unobserve(element)
      } catch (error) {
        console.warn('Error loading lazy item:', error)
      }
    }
  }

  observe(element: HTMLElement, itemId: string, onLoad: string) {
    if (this.observer) {
      element.dataset.lazyId = itemId
      element.dataset.onLoad = onLoad
      this.observer.observe(element)
    }
  }

  unobserve(element: HTMLElement) {
    this.observer?.unobserve(element)
  }

  disconnect() {
    this.observer?.disconnect()
  }
}

// Image optimization for mobile
export function optimizeImageForMobile(src: string, options: {
  width?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
} = {}) {
  const { width = 800, quality = 80, format = 'webp' } = options
  
  // If it's a local image, add optimization parameters
  if (src.startsWith('/')) {
    const params = new URLSearchParams({
      w: width.toString(),
      q: quality.toString(),
      f: format
    })
    return `${src}?${params.toString()}`
  }
  
  return src
}

// Performance monitoring for mobile
export class MobilePerformanceMonitor {
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0
  }
  private startTime = performance.now()

  markLoadComplete() {
    this.metrics.loadTime = performance.now() - this.startTime
  }

  markRenderComplete() {
    this.metrics.renderTime = performance.now() - this.startTime
  }

  markInteractionStart() {
    this.metrics.interactionTime = performance.now()
  }

  markInteractionComplete() {
    this.metrics.interactionTime = performance.now() - this.metrics.interactionTime
  }

  getMetrics(): PerformanceMetrics {
    if ('memory' in performance) {
      this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize
    }
    return { ...this.metrics }
  }

  reportMetrics() {
    const metrics = this.getMetrics()
    
    // Report to analytics (in real app, would send to analytics service)
    if (process.env.NODE_ENV === 'development') {
      console.log('📱 Mobile Performance Metrics:', metrics)
    }
    
    // Report performance issues if thresholds exceeded
    if (metrics.loadTime > 3000) {
      console.warn('⚠️ Slow loading detected:', metrics.loadTime + 'ms')
    }
    
    if (metrics.renderTime > 100) {
      console.warn('⚠️ Slow rendering detected:', metrics.renderTime + 'ms')
    }
    
    return metrics
  }
}

// Offline support utilities
export class OfflineSupport {
  private cache: Map<string, any> = new Map()
  private cacheVersion = 'v1'

  async cacheData(key: string, data: any, ttl = 3600000) { // 1 hour default
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl
    }
    
    try {
      if ('localStorage' in window) {
        localStorage.setItem(
          `${this.cacheVersion}_${key}`, 
          JSON.stringify(cacheItem)
        )
      }
      this.cache.set(key, cacheItem)
    } catch (error) {
      console.warn('Failed to cache data:', error)
    }
  }

  async getCachedData(key: string): Promise<any | null> {
    try {
      // Try memory cache first
      const memoryItem = this.cache.get(key)
      if (memoryItem && this.isValidCache(memoryItem)) {
        return memoryItem.data
      }

      // Try localStorage
      if ('localStorage' in window) {
        const stored = localStorage.getItem(`${this.cacheVersion}_${key}`)
        if (stored) {
          const cacheItem = JSON.parse(stored)
          if (this.isValidCache(cacheItem)) {
            this.cache.set(key, cacheItem)
            return cacheItem.data
          } else {
            localStorage.removeItem(`${this.cacheVersion}_${key}`)
          }
        }
      }
    } catch (error) {
      console.warn('Failed to get cached data:', error)
    }
    
    return null
  }

  private isValidCache(item: any): boolean {
    return item && 
           item.timestamp && 
           item.ttl && 
           (Date.now() - item.timestamp) < item.ttl
  }

  clearCache() {
    this.cache.clear()
    
    if ('localStorage' in window) {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(`${this.cacheVersion}_`)) {
          localStorage.removeItem(key)
        }
      })
    }
  }

  isOnline(): boolean {
    return navigator.onLine
  }
}

// Touch gesture optimization
export function optimizeScrolling() {
  // Enable smooth scrolling for mobile
  if (typeof document !== 'undefined') {
    document.documentElement.style.scrollBehavior = 'smooth'
    
    // Disable bounce scrolling on iOS
    document.body.style.overscrollBehavior = 'none'
  }
}

// Memory management for mobile
export function cleanupMobileResources() {
  // Clear any large objects from memory
  if ('gc' in window && typeof (window as any).gc === 'function') {
    (window as any).gc()
  }
  
  // Clear caches if memory pressure is high
  if ('memory' in performance) {
    const memory = (performance as any).memory
    const memoryUsageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit
    
    if (memoryUsageRatio > 0.8) {
      console.warn('High memory usage detected, clearing caches')
      // Clear various caches here
    }
  }
}

// Service Worker registration for offline support
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', registration)
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        console.log('Service Worker update found')
      })
      
      return registration
    } catch (error) {
      console.warn('Service Worker registration failed:', error)
    }
  }
  return null
}

// Progressive loading utilities
export function loadProgressively<T>(
  items: T[], 
  batchSize: number = 10,
  delay: number = 100
): Promise<T[]> {
  return new Promise((resolve) => {
    const result: T[] = []
    let currentIndex = 0
    
    function loadBatch() {
      const batch = items.slice(currentIndex, currentIndex + batchSize)
      result.push(...batch)
      currentIndex += batchSize
      
      if (currentIndex >= items.length) {
        resolve(result)
      } else {
        setTimeout(loadBatch, delay)
      }
    }
    
    loadBatch()
  })
}

// Mobile-specific feature detection
export function getMobileCapabilities() {
  const capabilities = {
    touchSupport: 'ontouchstart' in window,
    orientationSupport: 'orientation' in window,
    vibrationSupport: 'vibrate' in navigator,
    geolocationSupport: 'geolocation' in navigator,
    accelerometerSupport: 'DeviceMotionEvent' in window,
    gyroscopeSupport: 'DeviceOrientationEvent' in window,
    cameraSupport: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    installSupport: 'serviceWorker' in navigator && 'PushManager' in window,
    shareSupport: 'share' in navigator,
    clipboardSupport: 'clipboard' in navigator,
    wakeLockSupport: 'wakeLock' in navigator,
    batterySupport: 'getBattery' in navigator
  }
  
  return capabilities
}