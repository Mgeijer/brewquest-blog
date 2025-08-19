'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ContentPreview from '@/components/admin/ContentPreview'
import { getCurrentState } from '@/lib/data/stateProgress'

export default function AdminDashboard() {
  const router = useRouter()
  const currentState = getCurrentState()

  // For now, redirect to the real admin dashboard with content preview
  useEffect(() => {
    router.push('/admin/dashboard')
  }, [router])

  // Show content preview as fallback while redirecting
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome back, Hop!</h2>
        <p className="text-muted-foreground">
          Review and approve your {currentState?.name || 'Current State'} Week {currentState?.weekNumber || 1} content for Monday launch.
        </p>
      </div>

      {/* Current State Content Review */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-amber-800 mb-2">🚀 Ready for Launch: Monday</h3>
        <p className="text-amber-700">
          Your {currentState?.name || 'Current State'} Week {currentState?.weekNumber || 1} content is loaded and ready for review. 8 posts scheduled including 7 daily beer reviews and 1 weekly wrap-up.
        </p>
      </div>

      {/* Content Preview Component */}
      <ContentPreview />
    </div>
  );
} 