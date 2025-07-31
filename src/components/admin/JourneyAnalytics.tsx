'use client'

/**
 * Journey Analytics Component
 * 
 * Comprehensive analytics dashboard showing progress metrics,
 * engagement statistics, and data visualization for the beer journey.
 */

import React, { useState, useMemo, useCallback } from 'react'
import { StateProgress } from '@/lib/supabase/functions/stateProgressFunctions'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Clock,
  Target,
  Users,
  Star,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Heart,
  Share2,
  Zap
} from 'lucide-react'

// ==================================================
// Type Definitions
// ==================================================

interface JourneyAnalyticsProps {
  states: StateProgress[]
  className?: string
}

interface AnalyticsMetrics {
  totalStates: number
  completedStates: number
  currentStates: number
  upcomingStates: number
  progressPercentage: number
  totalBreweries: number
  avgDifficultyRating: number
  totalResearchHours: number
  completionRate: number
  avgBreweriesPerState: number
  regionProgress: Record<string, number>
  weeklyProgress: Array<{ week: number; completed: boolean; date?: Date }>
  difficultyDistribution: Record<number, number>
}

interface TimelineEvent {
  date: Date
  type: 'completion' | 'start' | 'milestone'
  stateCode: string
  stateName: string
  description: string
}

// ==================================================
// Analytics Calculation Hook
// ==================================================

function useAnalyticsMetrics(states: StateProgress[]): AnalyticsMetrics {
  return useMemo(() => {
    const totalStates = states.length
    const completedStates = states.filter(s => s.status === 'completed').length
    const currentStates = states.filter(s => s.status === 'current').length
    const upcomingStates = states.filter(s => s.status === 'upcoming').length
    
    const progressPercentage = totalStates > 0 ? Math.round((completedStates / totalStates) * 100) : 0
    const totalBreweries = states.reduce((sum, s) => sum + s.total_breweries, 0)
    const totalResearchHours = states.reduce((sum, s) => sum + s.research_hours, 0)
    
    const statesWithRating = states.filter(s => s.difficulty_rating && s.difficulty_rating > 0)
    const avgDifficultyRating = statesWithRating.length > 0 
      ? statesWithRating.reduce((sum, s) => sum + (s.difficulty_rating || 0), 0) / statesWithRating.length
      : 0
    
    const avgBreweriesPerState = totalStates > 0 ? totalBreweries / totalStates : 0
    const completionRate = 50 > 0 ? (completedStates / 50) * 100 : 0 // Assuming 50 total states
    
    // Region progress calculation
    const regionProgress: Record<string, number> = {}
    const regionGroups = states.reduce((acc, state) => {
      if (!acc[state.region]) acc[state.region] = []
      acc[state.region].push(state)
      return acc
    }, {} as Record<string, StateProgress[]>)
    
    Object.entries(regionGroups).forEach(([region, regionStates]) => {
      const completed = regionStates.filter(s => s.status === 'completed').length
      regionProgress[region] = regionStates.length > 0 ? (completed / regionStates.length) * 100 : 0
    })
    
    // Weekly progress
    const weeklyProgress = Array.from({ length: 50 }, (_, i) => {
      const week = i + 1
      const state = states.find(s => s.week_number === week)
      return {
        week,
        completed: state?.status === 'completed' || false,
        date: state?.completion_date ? new Date(state.completion_date) : undefined
      }
    })
    
    // Difficulty distribution
    const difficultyDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    statesWithRating.forEach(state => {
      const rating = Math.round(state.difficulty_rating || 0)
      if (rating >= 1 && rating <= 5) {
        difficultyDistribution[rating]++
      }
    })

    return {
      totalStates,
      completedStates,
      currentStates,
      upcomingStates,
      progressPercentage,
      totalBreweries,
      avgDifficultyRating,
      totalResearchHours,
      completionRate,
      avgBreweriesPerState,
      regionProgress,
      weeklyProgress,
      difficultyDistribution
    }
  }, [states])
}

// ==================================================
// Metrics Overview Component
// ==================================================

function MetricsOverview({ metrics }: { metrics: AnalyticsMetrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium">Journey Progress</p>
            <p className="text-3xl font-bold text-blue-900">{metrics.progressPercentage}%</p>
            <p className="text-blue-700 text-sm">
              {metrics.completedStates} of {metrics.totalStates} states
            </p>
          </div>
          <Target className="w-12 h-12 text-blue-400" />
        </div>
        <div className="mt-4 bg-blue-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${metrics.progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 text-sm font-medium">Total Breweries</p>
            <p className="text-3xl font-bold text-green-900">{metrics.totalBreweries.toLocaleString()}</p>
            <p className="text-green-700 text-sm">
              {metrics.avgBreweriesPerState.toFixed(1)} avg per state
            </p>
          </div>
          <MapPin className="w-12 h-12 text-green-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-600 text-sm font-medium">Research Hours</p>
            <p className="text-3xl font-bold text-purple-900">{metrics.totalResearchHours.toFixed(1)}</p>
            <p className="text-purple-700 text-sm">
              {(metrics.totalResearchHours / Math.max(metrics.completedStates, 1)).toFixed(1)} avg per state
            </p>
          </div>
          <Clock className="w-12 h-12 text-purple-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-600 text-sm font-medium">Avg Difficulty</p>
            <p className="text-3xl font-bold text-yellow-900">{metrics.avgDifficultyRating.toFixed(1)}</p>
            <div className="flex items-center space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`w-4 h-4 ${
                    star <= metrics.avgDifficultyRating 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <Star className="w-12 h-12 text-yellow-400" />
        </div>
      </div>
    </div>
  )
}

// ==================================================
// Progress Timeline Component
// ==================================================

function ProgressTimeline({ metrics }: { metrics: AnalyticsMetrics }) {
  const [viewMode, setViewMode] = useState<'weeks' | 'months'>('weeks')
  
  const timelineData = useMemo(() => {
    if (viewMode === 'weeks') {
      return metrics.weeklyProgress.map((week, index) => ({
        label: `W${week.week}`,
        completed: week.completed,
        position: (index / 49) * 100 // 50 weeks total
      }))
    } else {
      // Group by months (assuming 4 weeks per month approximately)
      const months = []
      for (let i = 0; i < 12; i++) {
        const monthWeeks = metrics.weeklyProgress.slice(i * 4, (i + 1) * 4)
        const completed = monthWeeks.filter(w => w.completed).length
        months.push({
          label: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
          completed: completed / monthWeeks.length,
          position: (i / 11) * 100
        })
      }
      return months
    }
  }, [metrics.weeklyProgress, viewMode])

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Progress Timeline</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('weeks')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'weeks' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Weeks
          </button>
          <button
            onClick={() => setViewMode('months')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'months' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Months
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Timeline bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
          <div 
            className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${metrics.progressPercentage}%` }}
          />
        </div>

        {/* Timeline markers */}
        <div className="relative h-16">
          {timelineData.map((item, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${item.position}%` }}
            >
              <div className={`w-4 h-4 rounded-full border-2 ${
                (viewMode === 'weeks' ? item.completed : item.completed > 0.5)
                  ? 'bg-green-500 border-green-600' 
                  : 'bg-gray-300 border-gray-400'
              }`} />
              <div className="text-xs text-gray-600 mt-2 whitespace-nowrap">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ==================================================
// Regional Progress Component
// ==================================================

function RegionalProgress({ metrics }: { metrics: AnalyticsMetrics }) {
  const sortedRegions = Object.entries(metrics.regionProgress)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8) // Show top 8 regions

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Regional Progress</h3>
      
      <div className="space-y-4">
        {sortedRegions.map(([region, progress]) => (
          <div key={region} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{region}</span>
                <span className="text-sm text-gray-600">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================================================
// Difficulty Distribution Component
// ==================================================

function DifficultyDistribution({ metrics }: { metrics: AnalyticsMetrics }) {
  const maxCount = Math.max(...Object.values(metrics.difficultyDistribution))
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Difficulty Distribution</h3>
      
      <div className="flex items-end justify-between h-40 space-x-2">
        {Object.entries(metrics.difficultyDistribution).map(([rating, count]) => (
          <div key={rating} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-gradient-to-t from-yellow-400 to-yellow-200 rounded-t transition-all duration-500"
              style={{ 
                height: maxCount > 0 ? `${(count / maxCount) * 100}%` : '0%',
                minHeight: count > 0 ? '8px' : '0px'
              }}
            />
            <div className="mt-2 text-center">
              <div className="text-sm font-medium text-gray-900">{count}</div>
              <div className="flex justify-center mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600 ml-1">{rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================================================
// Export Options Component
// ==================================================

function ExportOptions({ states }: { states: StateProgress[] }) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = useCallback(async (format: 'csv' | 'json' | 'pdf') => {
    setIsExporting(true)
    try {
      // Simulate export - in real implementation, this would call an API
      const data = states.map(state => ({
        state_code: state.state_code,
        state_name: state.state_name,
        status: state.status,
        week_number: state.week_number,
        total_breweries: state.total_breweries,
        difficulty_rating: state.difficulty_rating,
        research_hours: state.research_hours,
        completion_date: state.completion_date,
        region: state.region
      }))

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `hop-harrison-journey-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
      } else if (format === 'csv') {
        const headers = Object.keys(data[0] || {})
        const csvContent = [
          headers.join(','),
          ...data.map(row => headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(','))
        ].join('\n')
        
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `hop-harrison-journey-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
      }
      
      // PDF export would require a more complex implementation
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }, [states])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Export Analytics</h3>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleExport('csv')}
          disabled={isExporting}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
        
        <button
          onClick={() => handleExport('json')}
          disabled={isExporting}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Export JSON</span>
        </button>
        
        <button
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Export PDF Report</span>
        </button>
      </div>
      
      {isExporting && (
        <div className="mt-4 text-sm text-gray-600">
          Preparing export...
        </div>
      )}
    </div>
  )
}

// ==================================================
// Main Journey Analytics Component
// ==================================================

export default function JourneyAnalytics({ states, className = '' }: JourneyAnalyticsProps) {
  const metrics = useAnalyticsMetrics(states)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    // In a real implementation, this would trigger a data refresh
    setTimeout(() => setRefreshing(false), 1000)
  }, [])

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Journey Analytics</h2>
            <p className="text-gray-600 mt-1">
              Comprehensive insights into your craft beer journey progress
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <MetricsOverview metrics={metrics} />

      {/* Charts and Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <ProgressTimeline metrics={metrics} />
          <RegionalProgress metrics={metrics} />
        </div>
        
        <div className="space-y-8">
          <DifficultyDistribution metrics={metrics} />
          <ExportOptions states={states} />
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Completion Rate</h4>
          <p className="text-3xl font-bold text-blue-600">{metrics.completionRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-600 mt-1">Of total journey</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Calendar className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Active States</h4>
          <p className="text-3xl font-bold text-green-600">{metrics.currentStates}</p>
          <p className="text-sm text-gray-600 mt-1">Currently exploring</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Zap className="w-12 h-12 text-purple-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Efficiency</h4>
          <p className="text-3xl font-bold text-purple-600">
            {metrics.totalResearchHours > 0 ? (metrics.totalBreweries / metrics.totalResearchHours).toFixed(1) : '0'}
          </p>
          <p className="text-sm text-gray-600 mt-1">Breweries per hour</p>
        </div>
      </div>
    </div>
  )
}