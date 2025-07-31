/**
 * Rate Limiting Utilities for API Endpoints
 * 
 * Implements in-memory rate limiting with IP-based tracking and configurable limits.
 * Includes different rate limit strategies for various endpoint types.
 */

interface RateLimitEntry {
  count: number
  resetTime: number
  firstRequest: number
}

interface RateLimitConfig {
  windowMs: number  // Time window in milliseconds
  maxRequests: number  // Maximum requests per window
  skipSuccessfulRequests?: boolean  // Don't count successful requests
  skipFailedRequests?: boolean      // Don't count failed requests
}

interface RateLimitResult {
  allowed: boolean
  remainingRequests: number
  resetTime: number
  totalRequests: number
}

// In-memory store for rate limiting
// In production, consider using Redis for distributed systems
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Generic rate limiter
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = `rate_limit:${identifier}`
  
  let entry = rateLimitStore.get(key)
  
  // Initialize or reset if window has expired
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
      firstRequest: now
    }
  }
  
  // Check if limit exceeded
  const allowed = entry.count < config.maxRequests
  
  if (allowed) {
    entry.count++
    rateLimitStore.set(key, entry)
  }
  
  return {
    allowed,
    remainingRequests: Math.max(0, config.maxRequests - entry.count),
    resetTime: entry.resetTime,
    totalRequests: entry.count
  }
}

/**
 * Extract client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  let ip = forwardedFor?.split(',')[0]?.trim() || 
           realIp || 
           cfConnectingIp || 
           '0.0.0.0'
  
  // For additional security, include user agent in identifier
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const userAgentHash = Buffer.from(userAgent).toString('base64').slice(0, 16)
  
  return `${ip}:${userAgentHash}`
}

/**
 * Analytics endpoint rate limiting (stricter limits)
 */
export function checkAnalyticsRateLimit(identifier: string): RateLimitResult {
  return checkRateLimit(identifier, {
    windowMs: 60 * 1000,      // 1 minute window
    maxRequests: 60           // 60 requests per minute (1 per second)
  })
}

/**
 * General API rate limiting (more permissive)
 */
export function checkApiRateLimit(identifier: string): RateLimitResult {
  return checkRateLimit(identifier, {
    windowMs: 60 * 1000,      // 1 minute window
    maxRequests: 100          // 100 requests per minute
  })
}

/**
 * Admin endpoint rate limiting (moderate limits)
 */
export function checkAdminRateLimit(identifier: string): RateLimitResult {
  return checkRateLimit(identifier, {
    windowMs: 60 * 1000,      // 1 minute window
    maxRequests: 30           // 30 requests per minute
  })
}

/**
 * Heavy operation rate limiting (very strict)
 */
export function checkHeavyOperationRateLimit(identifier: string): RateLimitResult {
  return checkRateLimit(identifier, {
    windowMs: 5 * 60 * 1000,  // 5 minute window
    maxRequests: 10           // 10 requests per 5 minutes
  })
}

/**
 * Create rate limit response headers
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.totalRequests + result.remainingRequests),
    'X-RateLimit-Remaining': String(result.remainingRequests),
    'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
    'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000))
  }
}

/**
 * Session-based rate limiting (for analytics tracking)
 * Uses a combination of IP and session to allow higher limits for legitimate users
 */
export function checkSessionRateLimit(
  ip: string, 
  sessionId?: string
): RateLimitResult {
  const identifier = sessionId ? `session:${sessionId}` : `ip:${ip}`
  
  // Higher limits for identified sessions
  const config = sessionId ? {
    windowMs: 60 * 1000,      // 1 minute window
    maxRequests: 120          // 120 requests per minute for sessions
  } : {
    windowMs: 60 * 1000,      // 1 minute window
    maxRequests: 30           // 30 requests per minute for IPs without session
  }
  
  return checkRateLimit(identifier, config)
}

/**
 * Burst protection - allows short bursts but prevents sustained high traffic
 */
export function checkBurstRateLimit(identifier: string): RateLimitResult {
  // First check: Allow 10 requests per 10 seconds (burst protection)
  const burstResult = checkRateLimit(`burst:${identifier}`, {
    windowMs: 10 * 1000,      // 10 second window
    maxRequests: 10           // 10 requests per 10 seconds
  })
  
  if (!burstResult.allowed) {
    return burstResult
  }
  
  // Second check: Allow 100 requests per 5 minutes (sustained rate)
  return checkRateLimit(`sustained:${identifier}`, {
    windowMs: 5 * 60 * 1000,  // 5 minute window
    maxRequests: 100          // 100 requests per 5 minutes
  })
}

/**
 * Clear rate limit for an identifier (useful for testing or admin override)
 */
export function clearRateLimit(identifier: string, prefix?: string): void {
  const key = prefix ? `${prefix}:${identifier}` : `rate_limit:${identifier}`
  rateLimitStore.delete(key)
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(identifier: string): RateLimitResult | null {
  const key = `rate_limit:${identifier}`
  const entry = rateLimitStore.get(key)
  
  if (!entry || Date.now() > entry.resetTime) {
    return null
  }
  
  return {
    allowed: entry.count < 100, // Assuming default limit
    remainingRequests: Math.max(0, 100 - entry.count),
    resetTime: entry.resetTime,
    totalRequests: entry.count
  }
}

/**
 * Middleware helper for Next.js API routes
 */
export function withRateLimit<T extends any[]>(
  rateLimitFn: (identifier: string) => RateLimitResult,
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    const request = args[0] as Request
    const identifier = getClientIdentifier(request)
    const rateLimitResult = rateLimitFn(identifier)
    
    if (!rateLimitResult.allowed) {
      const headers = {
        'Content-Type': 'application/json',
        ...createRateLimitHeaders(rateLimitResult)
      }
      
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          timestamp: new Date().toISOString(),
          retry_after: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers
        }
      )
    }
    
    const response = await handler(...args)
    
    // Add rate limit headers to successful responses
    const rateLimitHeaders = createRateLimitHeaders(rateLimitResult)
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }
}

/**
 * Special rate limiting for sensitive endpoints
 */
export function checkSensitiveEndpointRateLimit(identifier: string): RateLimitResult {
  return checkRateLimit(identifier, {
    windowMs: 15 * 60 * 1000,  // 15 minute window
    maxRequests: 5             // Only 5 requests per 15 minutes
  })
}

/**
 * Analytics for rate limiting (track abuse patterns)
 */
export interface RateLimitAnalytics {
  identifier: string
  endpoint: string
  timestamp: number
  blocked: boolean
  requestsInWindow: number
}

const rateLimitAnalytics: RateLimitAnalytics[] = []

export function trackRateLimitEvent(
  identifier: string,
  endpoint: string,
  blocked: boolean,
  requestsInWindow: number
): void {
  rateLimitAnalytics.push({
    identifier,
    endpoint,
    timestamp: Date.now(),
    blocked,
    requestsInWindow
  })
  
  // Keep only last 1000 events to prevent memory growth
  if (rateLimitAnalytics.length > 1000) {
    rateLimitAnalytics.splice(0, rateLimitAnalytics.length - 1000)
  }
}

export function getRateLimitAnalytics(): RateLimitAnalytics[] {
  return [...rateLimitAnalytics]
}