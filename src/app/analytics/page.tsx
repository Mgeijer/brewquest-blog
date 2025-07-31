import MapAnalyticsDashboard from '@/components/analytics/MapAnalyticsDashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Map Analytics Dashboard | Hop Harrison',
  description: 'Interactive analytics dashboard showing user engagement with the US craft beer journey map.',
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-beer-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MapAnalyticsDashboard />
      </div>
    </div>
  )
}