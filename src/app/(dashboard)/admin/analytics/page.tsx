export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">
          Track your blog performance, traffic, and engagement metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Page Views', value: '24,389', change: '+12.5%' },
          { label: 'Unique Visitors', value: '8,234', change: '+8.2%' },
          { label: 'Avg. Session Duration', value: '3:24', change: '+15.3%' },
          { label: 'Bounce Rate', value: '42%', change: '-5.1%' },
        ].map((metric, index) => (
          <div key={index} className="card">
            <div className="text-sm text-gray-600">{metric.label}</div>
            <div className="text-2xl font-bold text-beer-dark">{metric.value}</div>
            <div className="text-sm text-green-600">{metric.change}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Detailed Analytics</h3>
        <p className="text-gray-600">
          Advanced analytics features will be implemented in Phase 2.
        </p>
      </div>
    </div>
  )
} 