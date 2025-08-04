'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { TrendingUp, Users, Eye, MapPin, Mail, Star, Clock, Share2 } from 'lucide-react'

interface AnalyticsData {
  pageViews: Array<{ date: string; views: number; unique_users: number }>
  topStates: Array<{ state: string; views: number; engagement_time: number }>
  topBeers: Array<{ name: string; brewery: string; views: number; ratings: number }>
  userEngagement: Array<{ event: string; count: number; percentage: number }>
  newsletterStats: { signups: number; conversion_rate: number; sources: Array<{ source: string; count: number }> }
  mapInteractions: Array<{ state: string; clicks: number; hovers: number }>
  performanceMetrics: { avg_load_time: number; avg_tti: number; bounce_rate: number }
  realtimeUsers: number
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [selectedMetric, setSelectedMetric] = useState<'pageviews' | 'engagement' | 'conversions'>('pageviews')

  useEffect(() => {
    fetchAnalyticsData()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchAnalyticsData, 30000)
    return () => clearInterval(interval)
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="analytics-dashboard p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 rounded-lg h-64"></div>
            <div className="bg-gray-200 rounded-lg h-64"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="analytics-dashboard p-6">
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-600">Analytics data will appear here once tracking is active.</p>
        </div>
      </div>
    )
  }

  const COLORS = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6']

  return (
    <div className="analytics-dashboard p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">BrewQuest Analytics</h1>
          <p className="text-gray-600">Track user engagement and beer discovery patterns</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{analyticsData.realtimeUsers} users online</span>
          </div>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Page Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.pageViews.reduce((sum, day) => sum + day.views, 0).toLocaleString()}
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">
            +12% from last period
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.pageViews.reduce((sum, day) => sum + day.unique_users, 0).toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">
            +8% from last period
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Newsletter Signups</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.newsletterStats.signups.toLocaleString()}
              </p>
            </div>
            <Mail className="w-8 h-8 text-amber-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">
            {analyticsData.newsletterStats.conversion_rate.toFixed(1)}% conversion rate
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Load Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.performanceMetrics.avg_load_time.toFixed(1)}s
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">
            -0.3s from last period
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Over Time */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Views Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.pageViews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#F59E0B" strokeWidth={2} />
              <Line type="monotone" dataKey="unique_users" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top States */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular States</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.topStates.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Engagement */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analyticsData.userEngagement}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={(entry) => `${entry.event}: ${entry.percentage}%`}
              >
                {analyticsData.userEngagement.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Beers */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Viewed Beers</h3>
          <div className="space-y-3">
            {analyticsData.topBeers.slice(0, 5).map((beer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{beer.name}</p>
                  <p className="text-sm text-gray-600">{beer.brewery}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{beer.views}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-gray-600">{beer.ratings}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Sources */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Newsletter Sources</h3>
          <div className="space-y-3">
            {analyticsData.newsletterStats.sources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-900 capitalize">{source.source.replace('_', ' ')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ 
                        width: `${(source.count / analyticsData.newsletterStats.signups) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{source.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Interactions */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Map Engagement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Most Clicked States</h4>
            <div className="space-y-2">
              {analyticsData.mapInteractions.slice(0, 5).map((interaction, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-900">{interaction.state}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{interaction.hovers}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="text-sm">{interaction.clicks}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Bounce Rate</span>
                <span className="font-medium">{analyticsData.performanceMetrics.bounce_rate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg. Time to Interactive</span>
                <span className="font-medium">{analyticsData.performanceMetrics.avg_tti.toFixed(1)}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Mobile vs Desktop</span>
                <span className="font-medium">60% / 40%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Export Analytics</h4>
            <p className="text-sm text-gray-600">Download detailed analytics reports</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-beer-amber text-white rounded-lg hover:bg-beer-gold transition-colors">
              Export CSV
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}