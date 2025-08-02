'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ContentPreview from '@/components/admin/ContentPreview'

export default function AdminDashboard() {
  const router = useRouter()

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
          Review and approve your Alaska Week 2 content for Monday August 4th launch.
        </p>
      </div>

      {/* Alaska Week 2 Content Review */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-amber-800 mb-2">🚀 Ready for Launch: Monday August 4th</h3>
        <p className="text-amber-700">
          Your Alaska Week 2 content is loaded and ready for review. 8 posts scheduled including 7 daily beer reviews and 1 weekly wrap-up.
        </p>
      </div>

      {/* Content Preview Component */}
      <ContentPreview />
    </div>
  );
} 