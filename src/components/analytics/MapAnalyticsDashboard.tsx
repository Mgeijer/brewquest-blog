'use client'

import React, { useState, useEffect } from 'react'
import { useSimpleMapAnalytics } from '@/lib/analytics/simpleMapAnalytics'
import type { StatePopularity, MapEngagementMetrics } from '@/lib/analytics/simpleMapAnalytics'
import { Card } from '@/components/ui/Card'
import { BarChart3, TrendingUp, Users, MousePointer, Smartphone, Monitor, Tablet } from 'lucide-react'

interface AnalyticsDashboardProps {
  className?: string
}

export default function MapAnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const [popularStates, setPopularStates] = useState<StatePopularity[]>([])
  const [engagementMetrics, setEngagementMetrics] = useState<MapEngagementMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { getPopularStates, getEngagementMetrics } = useSimpleMapAnalytics()

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)

        const [statesData, metricsData] = await Promise.all([
          getPopularStates(),
          getEngagementMetrics()
        ])

        setPopularStates(statesData || [])
        setEngagementMetrics(metricsData || null)
      } catch (err) {
        setError('Failed to load analytics data')
        console.error('Analytics loading error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [getPopularStates, getEngagementMetrics])

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${Math.round(seconds / 3600)}h`
  }

  const formatPercentage = (value: number): string => {
    return `${Math.round(value * 100) / 100}%`
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-300 rounded"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center gap-2 text-red-800">
          <BarChart3 className="w-5 h-5" />
          <span className="font-medium">Analytics Error</span>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-beer-amber" />
        <h2 className="text-2xl font-bold text-beer-dark">Map Analytics Dashboard</h2>
      </div>

      {/* Key Metrics Cards */}
      {engagementMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-beer-dark">{engagementMetrics.totalSessions.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-beer-amber" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Session</p>
                <p className="text-2xl font-bold text-beer-dark">{formatDuration(engagementMetrics.avgSessionDuration)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-beer-amber" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Interactions</p>
                <p className="text-2xl font-bold text-beer-dark">{engagementMetrics.totalInteractions.toLocaleString()}</p>
              </div>
              <MousePointer className="w-8 h-8 text-beer-amber" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Click→Navigation</p>
                <p className="text-2xl font-bold text-beer-dark">{formatPercentage(engagementMetrics.conversionMetrics.clickToNavigation)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular States */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-beer-dark mb-4">Most Popular States</h3>
          <div className="space-y-3">
            {popularStates.slice(0, 10).map((state, index) => (
              <div key={state.stateCode} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-beer-amber text-white text-sm font-bold rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-beer-dark">{state.stateName || state.stateCode}</p>
                    <p className="text-sm text-gray-600">{state.totalInteractions} interactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-beer-dark">{state.clickCount} clicks</p>
                  <p className="text-sm text-gray-600">{formatPercentage(state.conversionRate)} conversion</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Device Breakdown */}
        {engagementMetrics && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-beer-dark mb-4">Device Usage</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-beer-amber" />
                  <span className="font-medium">Desktop</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-beer-amber h-2 rounded-full"
                      style={{ 
                        width: `${(engagementMetrics.deviceBreakdown.desktop / engagementMetrics.totalInteractions) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {Math.round((engagementMetrics.deviceBreakdown.desktop / engagementMetrics.totalInteractions) * 100)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-beer-amber" />
                  <span className="font-medium">Mobile</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-beer-amber h-2 rounded-full"
                      style={{ 
                        width: `${(engagementMetrics.deviceBreakdown.mobile / engagementMetrics.totalInteractions) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {Math.round((engagementMetrics.deviceBreakdown.mobile / engagementMetrics.totalInteractions) * 100)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Tablet className="w-5 h-5 text-beer-amber" />
                  <span className="font-medium">Tablet</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-beer-amber h-2 rounded-full"
                      style={{ 
                        width: `${(engagementMetrics.deviceBreakdown.tablet / engagementMetrics.totalInteractions) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {Math.round((engagementMetrics.deviceBreakdown.tablet / engagementMetrics.totalInteractions) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* User Journey Flow */}
      {engagementMetrics && engagementMetrics.userJourneyFlow.commonPaths.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-beer-dark mb-4">Common User Journeys</h3>
          <div className="space-y-3">
            {engagementMetrics.userJourneyFlow.commonPaths.slice(0, 5).map((pathData, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-beer-cream text-beer-dark text-sm font-bold rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-mono text-sm text-beer-dark">
                    {pathData.path.join(' → ')}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {pathData.count} users
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Conversion Metrics */}
      {engagementMetrics && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-beer-dark mb-4">Conversion Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-beer-cream/20 rounded-lg">
              <p className="text-2xl font-bold text-beer-dark">
                {formatPercentage(engagementMetrics.conversionMetrics.hoverToClick)}
              </p>
              <p className="text-sm text-gray-600">Hover → Click</p>
            </div>
            <div className="text-center p-4 bg-beer-cream/20 rounded-lg">
              <p className="text-2xl font-bold text-beer-dark">
                {formatPercentage(engagementMetrics.conversionMetrics.clickToNavigation)}
              </p>
              <p className="text-sm text-gray-600">Click → Navigation</p>
            </div>
            <div className="text-center p-4 bg-beer-cream/20 rounded-lg">
              <p className="text-2xl font-bold text-beer-dark">
                {formatPercentage(engagementMetrics.conversionMetrics.mapViewToClick)}
              </p>
              <p className="text-sm text-gray-600">View → Click</p>
            </div>
          </div>
        </Card>
      )}

      {/* Data Export & Management */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-beer-dark mb-4">Data Management</h3>
        <div className="flex gap-4">
          <button className="bg-beer-amber text-white px-4 py-2 rounded-lg hover:bg-beer-amber-dark transition-colors">
            Export Data
          </button>
          <button className="border border-beer-malt text-beer-dark px-4 py-2 rounded-lg hover:bg-beer-cream transition-colors">
            Refresh Analytics
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Data shown for the last 30 days. Updates automatically every hour.
        </p>
      </Card>
    </div>
  )
}