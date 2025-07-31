/**
 * Admin States Management Page
 * 
 * Comprehensive dashboard for managing state progress, brewery data,
 * and journey analytics across all 50 states.
 */

import { Metadata } from 'next'
import StateProgressManager from '@/components/admin/StateProgressManager'
import { getAllStateProgress } from '@/lib/supabase/functions/stateProgressFunctions'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'State Management | Admin Dashboard',
  description: 'Manage state progress, brewery data, and journey analytics for the Hop Harrison beer journey.',
  robots: 'noindex, nofollow', // Prevent search engine indexing
}

// Loading component for the state manager
function StateManagerLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
      </div>

      {/* Overview cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-3 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Error boundary for state management
function StateManagerError({ error }: { error: Error }) {
  return (
    <Alert variant="destructive">
      <AlertDescription>
        Failed to load state management interface: {error.message}
        <button 
          onClick={() => window.location.reload()} 
          className="ml-4 underline hover:no-underline"
        >
          Try Again
        </button>
      </AlertDescription>
    </Alert>
  )
}

// Server component to fetch data
async function StateManagerData() {
  try {
    const { data: states, error } = await getAllStateProgress()
    
    if (error) {
      throw new Error(`Database error: ${(error as any)?.message || 'Failed to fetch states'}`)
    }

    if (!states || states.length === 0) {
      return (
        <Alert>
          <AlertDescription>
            No state data found. The database schema may not be set up yet.
            <br />
            <a 
              href="/api/setup-state-schema" 
              className="underline hover:no-underline mt-2 inline-block"
              target="_blank"
            >
              Set up database schema →
            </a>
          </AlertDescription>
        </Alert>
      )
    }

    return <StateProgressManager initialStates={states} />
  } catch (error) {
    console.error('Error loading states:', error)
    return <StateManagerError error={error as Error} />
  }
}

export default function AdminStatesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">State Management</h1>
            <p className="text-gray-600 mt-2">
              Manage state progress, brewery data, and journey analytics across all 50 states
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Bulk Actions
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Export Data
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* State Manager Component */}
      <Suspense fallback={<StateManagerLoading />}>
        <StateManagerData />
      </Suspense>

      {/* Quick Actions Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-medium text-gray-900">Update Current Week</div>
            <div className="text-sm text-gray-600">Mark current state as completed and advance</div>
          </button>
          
          <button className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-medium text-gray-900">Generate Analytics</div>
            <div className="text-sm text-gray-600">Create comprehensive progress report</div>
          </button>
          
          <button className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-medium text-gray-900">Sync with Blog</div>
            <div className="text-sm text-gray-600">Update blog posts with latest state data</div>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">✓</div>
            <div className="text-sm font-medium text-green-800">Database</div>
            <div className="text-xs text-green-600">Connected</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">⟲</div>
            <div className="text-sm font-medium text-blue-800">Real-time</div>
            <div className="text-xs text-blue-600">Active</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">📊</div>
            <div className="text-sm font-medium text-purple-800">Analytics</div>
            <div className="text-xs text-purple-600">Tracking</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">⚡</div>
            <div className="text-sm font-medium text-yellow-800">Cache</div>
            <div className="text-xs text-yellow-600">Optimized</div>
          </div>
        </div>
      </div>
    </div>
  )
}