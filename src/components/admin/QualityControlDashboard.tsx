'use client'

/**
 * Quality Control Dashboard Component
 * 
 * Comprehensive interface for content validation, quality monitoring,
 * and publication approval workflow. Used by admins to ensure content
 * quality before automated publishing.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Eye, 
  Edit, 
  Play,
  Pause,
  Settings,
  BarChart3,
  Clock,
  Users,
  TrendingUp,
  Shield,
  AlertCircle
} from 'lucide-react'

// ==================================================
// Type Definitions
// ==================================================

interface QualityMetrics {
  overallScore: number
  totalContent: number
  validContent: number
  pendingReview: number
  criticalErrors: number
  warnings: number
  lastUpdated: Date
}

interface ContentItem {
  id: string
  type: 'beer_review' | 'blog_post' | 'social_media' | 'state_week'
  title: string
  state?: string
  week?: number
  status: 'draft' | 'validated' | 'approved' | 'published' | 'error'
  score: number
  errors: string[]
  warnings: string[]
  lastValidated?: Date
  canPublish: boolean
}

interface ValidationResult {
  success: boolean
  validation: any
  recommendations: string[]
  timestamp: string
}

// ==================================================
// Main Dashboard Component
// ==================================================

export default function QualityControlDashboard() {
  const [metrics, setMetrics] = useState<QualityMetrics>({
    overallScore: 0,
    totalContent: 0,
    validContent: 0,
    pendingReview: 0,
    criticalErrors: 0,
    warnings: 0,
    lastUpdated: new Date()
  })

  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('score')

  // ==================================================
  // Data Loading and Refresh
  // ==================================================

  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    try {
      // Load quality metrics
      const metricsResponse = await fetch('/api/admin/quality-metrics')
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json()
        setMetrics(metricsData)
      }

      // Load content items for validation
      const contentResponse = await fetch('/api/admin/content-review')
      if (contentResponse.ok) {
        const contentData = await contentResponse.json()
        setContentItems(contentData.items || [])
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboardData()
    // Refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [loadDashboardData])

  // ==================================================
  // Content Validation Functions
  // ==================================================

  const validateContent = async (item: ContentItem) => {
    try {
      const response = await fetch('/api/validate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: item.type,
          content: { id: item.id }, // API will fetch full content
          options: { logResults: true }
        })
      })

      if (response.ok) {
        const result = await response.json()
        setValidationResult(result)
        
        // Update item in list
        setContentItems(prev => 
          prev.map(content => 
            content.id === item.id 
              ? {
                  ...content,
                  score: result.validation.score || result.validation.overallScore,
                  errors: result.validation.errors || result.validation.criticalErrors || [],
                  warnings: result.validation.warnings || [],
                  lastValidated: new Date(),
                  canPublish: result.validation.readyForPublication || result.validation.score >= 80
                }
              : content
          )
        )
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const validateStateWeek = async (stateCode: string) => {
    try {
      const response = await fetch(`/api/validate-content/state/${stateCode}`)
      if (response.ok) {
        const result = await response.json()
        setValidationResult(result)
      }
    } catch (error) {
      console.error('State validation failed:', error)
    }
  }

  // ==================================================
  // Content Management Functions
  // ==================================================

  const approveContent = async (item: ContentItem) => {
    try {
      const response = await fetch('/api/admin/approve-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          type: item.type,
          approve: true
        })
      })

      if (response.ok) {
        setContentItems(prev =>
          prev.map(content =>
            content.id === item.id
              ? { ...content, status: 'approved' }
              : content
          )
        )
      }
    } catch (error) {
      console.error('Approval failed:', error)
    }
  }

  const rejectContent = async (item: ContentItem, reason: string) => {
    try {
      const response = await fetch('/api/admin/approve-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          type: item.type,
          approve: false,
          reason
        })
      })

      if (response.ok) {
        setContentItems(prev =>
          prev.map(content =>
            content.id === item.id
              ? { ...content, status: 'draft' }
              : content
          )
        )
      }
    } catch (error) {
      console.error('Rejection failed:', error)
    }
  }

  // ==================================================
  // Filtering and Sorting
  // ==================================================

  const filteredAndSortedItems = contentItems
    .filter(item => {
      if (filterStatus === 'all') return true
      if (filterStatus === 'needs_review') return item.score < 80 || item.errors.length > 0
      if (filterStatus === 'approved') return item.status === 'approved'
      if (filterStatus === 'errors') return item.errors.length > 0
      return item.status === filterStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score
        case 'errors':
          return b.errors.length - a.errors.length
        case 'updated':
          return (b.lastValidated?.getTime() || 0) - (a.lastValidated?.getTime() || 0)
        case 'week':
          return (b.week || 0) - (a.week || 0)
        default:
          return 0
      }
    })

  // ==================================================
  // Render Functions
  // ==================================================

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'validated':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'published':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Loading quality control dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quality Control Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor and validate content before publication</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadDashboardData}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <div className="text-sm text-gray-500">
              Last updated: {metrics.lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Quality Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{metrics.overallScore}%</div>
              <div className="text-sm font-medium text-gray-500">Overall Score</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{metrics.validContent}</div>
              <div className="text-sm font-medium text-gray-500">Valid Content</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{metrics.pendingReview}</div>
              <div className="text-sm font-medium text-gray-500">Pending Review</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{metrics.criticalErrors}</div>
              <div className="text-sm font-medium text-gray-500">Critical Errors</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{metrics.warnings}</div>
              <div className="text-sm font-medium text-gray-500">Warnings</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{metrics.totalContent}</div>
              <div className="text-sm font-medium text-gray-500">Total Content</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Content</option>
              <option value="needs_review">Needs Review</option>
              <option value="approved">Approved</option>
              <option value="errors">Has Errors</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="score">Sort by Score</option>
              <option value="errors">Sort by Errors</option>
              <option value="updated">Sort by Updated</option>
              <option value="week">Sort by Week</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Showing {filteredAndSortedItems.length} of {contentItems.length} items
            </span>
          </div>
        </div>
      </div>

      {/* Content Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow border hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    {item.type.replace('_', ' ')}
                  </span>
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                  {item.score}%
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h3>

              {item.state && (
                <div className="text-sm text-gray-600 mb-2">
                  {item.state} {item.week && `• Week ${item.week}`}
                </div>
              )}

              {item.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="ml-2">
                      <div className="text-sm font-medium text-red-800">
                        {item.errors.length} Error{item.errors.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-red-600 mt-1">
                        {item.errors.slice(0, 2).join(' • ')}
                        {item.errors.length > 2 && ` • +${item.errors.length - 2} more`}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {item.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
                  <div className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="ml-2">
                      <div className="text-sm font-medium text-yellow-800">
                        {item.warnings.length} Warning{item.warnings.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => validateContent(item)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Validate</span>
                  </button>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                </div>

                <div className="flex space-x-2">
                  {item.canPublish && item.status !== 'approved' && (
                    <button
                      onClick={() => approveContent(item)}
                      className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Shield className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-600">
            {filterStatus === 'all' 
              ? 'No content available for review'
              : `No content matches the "${filterStatus}" filter`
            }
          </p>
        </div>
      )}

      {/* Validation Results Modal */}
      {validationResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Validation Results</h2>
                <button
                  onClick={() => setValidationResult(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(validationResult, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}