'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface AnalyticsErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

interface AnalyticsErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

class AnalyticsErrorBoundary extends Component<
  AnalyticsErrorBoundaryProps,
  AnalyticsErrorBoundaryState
> {
  constructor(props: AnalyticsErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): AnalyticsErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.warn('Analytics Error Boundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // In development, provide more detailed error information
    if (process.env.NODE_ENV === 'development') {
      console.error('Analytics component stack trace:', errorInfo.componentStack)
    }

    // Try to track the error using PostHog if available
    try {
      if (typeof window !== 'undefined' && (window as any).posthog?.__loaded) {
        (window as any).posthog.capture('analytics_component_error', {
          error_message: error.message,
          error_name: error.name,
          component_stack: errorInfo.componentStack,
          error_boundary: 'AnalyticsErrorBoundary',
          timestamp: new Date().toISOString()
        })
      }
    } catch (trackingError) {
      // Silently fail if we can't track the error
      console.warn('Failed to track analytics error:', trackingError)
    }
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI (invisible in production, minimal in development)
      if (process.env.NODE_ENV === 'development') {
        return (
          <div 
            style={{
              padding: '12px',
              margin: '8px 0',
              backgroundColor: '#fef2f2',
              border: '1px solid #f87171',
              borderRadius: '6px',
              color: '#dc2626',
              fontSize: '14px'
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
              Analytics Component Error
            </h3>
            <p style={{ margin: '0 0 8px 0' }}>
              {this.state.error?.message || 'An error occurred in the analytics system'}
            </p>
            <details style={{ fontSize: '12px', opacity: 0.8 }}>
              <summary style={{ cursor: 'pointer' }}>Technical Details</summary>
              <pre style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap' }}>
                {this.state.error?.stack}
              </pre>
            </details>
          </div>
        )
      }

      // In production, render nothing to avoid disrupting the user experience
      return null
    }

    // No error, render children normally
    return this.props.children
  }
}

export default AnalyticsErrorBoundary