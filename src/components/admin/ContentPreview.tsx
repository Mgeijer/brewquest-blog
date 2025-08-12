'use client'

import { useState, useEffect } from 'react'
import { Eye, Edit, CheckCircle, XCircle, Calendar, Clock, Star, AlertTriangle, Send } from 'lucide-react'

interface ScheduledContent {
  id: string
  type: 'daily_beer' | 'weekly_state' | 'social_post'
  title: string
  scheduledFor: string
  status: 'pending' | 'approved' | 'rejected' | 'published'
  content: {
    body: string
    metadata?: {
      beer?: {
        name: string
        brewery: string
        style: string
        abv: number
      }
      state?: {
        name: string
        week: number
      }
      platform?: string
      characterCount?: number
      image_url?: string
    }
  }
  qualityScore: number
  aiGenerated: boolean
  lastModified: string
}

interface ContentStats {
  totalScheduled: number
  pendingApproval: number
  approved: number
  qualityScoreAvg: number
}

export default function ContentPreview() {
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([])
  const [stats, setStats] = useState<ContentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState<ScheduledContent | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [editingContent, setEditingContent] = useState<string | null>(null)
  const [publishingContent, setPublishingContent] = useState<string | null>(null)

  useEffect(() => {
    fetchScheduledContent()
  }, [filter])

  const fetchScheduledContent = async () => {
    try {
      const response = await fetch(`/api/admin/scheduled-content?filter=${filter}`)
      if (response.ok) {
        const data = await response.json()
        setScheduledContent(data.content)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch scheduled content:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateContentStatus = async (contentId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/admin/scheduled-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: status === 'approved' ? 'approve' : 'reject',
          contentId,
          status 
        })
      })
      
      if (response.ok) {
        fetchScheduledContent()
      } else {
        console.error('Failed to update content status:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Failed to update content status:', error)
    }
  }

  const bulkApprove = async (contentIds: string[]) => {
    try {
      // For now, approve each item individually
      for (const contentId of contentIds) {
        await updateContentStatus(contentId, 'approved')
      }
      
      // Refresh the content after all approvals
      fetchScheduledContent()
    } catch (error) {
      console.error('Failed to bulk approve content:', error)
    }
  }

  const saveEditedContent = async (contentId: string, newContent: string) => {
    try {
      // For now, just close the editor
      // TODO: Implement content editing in the database
      console.log('Content editing not yet implemented for database-driven content')
      setEditingContent(null)
    } catch (error) {
      console.error('Failed to save edited content:', error)
    }
  }

  const publishNow = async (contentId: string, contentType: string) => {
    setPublishingContent(contentId)
    try {
      if (contentType === 'weekly_state') {
        // For weekly newsletters, use the Alaska newsletter endpoint
        const response = await fetch('/api/admin/trigger-weekly-digest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentId, admin: 'manual-publish' })
        })
        
        if (response.ok) {
          await updateContentStatus(contentId, 'approved')
          fetchScheduledContent()
        } else {
          console.error('Failed to publish weekly content:', response.status)
        }
      } else {
        // For daily beers, use the daily publish endpoint
        const response = await fetch('/api/admin/trigger-daily-publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentId })
        })
        
        if (response.ok) {
          await updateContentStatus(contentId, 'approved')
          fetchScheduledContent()
        } else {
          console.error('Failed to publish daily content:', response.status)
        }
      }
    } catch (error) {
      console.error('Failed to publish content:', error)
    } finally {
      setPublishingContent(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'published':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-50 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-50 text-red-800 border-red-200'
      case 'published': return 'bg-blue-50 text-blue-800 border-blue-200'
      default: return 'bg-yellow-50 text-yellow-800 border-yellow-200'
    }
  }

  const getQualityScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatContentType = (type: string) => {
    switch (type) {
      case 'daily_beer': return 'Daily Beer Review'
      case 'weekly_state': return 'Weekly State Feature'
      case 'social_post': return 'Social Media Post'
      default: return type
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const pendingCount = scheduledContent.filter(c => c.status === 'pending').length
  const selectedPending = scheduledContent.filter(c => c.status === 'pending').map(c => c.id)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalScheduled}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingApproval}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quality Score</p>
                <p className={`text-2xl font-bold ${getQualityScoreColor(stats.qualityScoreAvg)}`}>
                  {stats.qualityScoreAvg.toFixed(1)}/10
                </p>
              </div>
              <Star className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>
      )}

      {/* Content Management */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Scheduled Content</h2>
            
            {pendingCount > 0 && (
              <button
                onClick={() => bulkApprove(selectedPending)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Approve All Pending ({pendingCount})
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {scheduledContent.map((content) => (
            <div key={content.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(content.status)}
                    <h3 className="text-lg font-medium text-gray-900">{content.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(content.status)}`}>
                      {content.status.toUpperCase()}
                    </span>
                    {content.aiGenerated && (
                      <span className="px-2 py-1 bg-purple-50 text-purple-800 rounded-full text-xs font-medium border border-purple-200">
                        AI Generated
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Type:</span> {formatContentType(content.type)}
                    </div>
                    <div>
                      <span className="font-medium">Scheduled:</span> {new Date(content.scheduledFor).toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Quality:</span>
                      <span className={`font-bold ${getQualityScoreColor(content.qualityScore)}`}>
                        {content.qualityScore}/10
                      </span>
                      {content.qualityScore < 6 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>

                  {/* Content Metadata */}
                  {content.content.metadata && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      {content.content.metadata.beer && (
                        <div className="text-sm">
                          <strong>{content.content.metadata.beer.name}</strong> by {content.content.metadata.beer.brewery} 
                          ({content.content.metadata.beer.style}, {content.content.metadata.beer.abv}% ABV)
                        </div>
                      )}
                      {content.content.metadata.state && (
                        <div className="text-sm">
                          <strong>Week {content.content.metadata.state.week}:</strong> {content.content.metadata.state.name}
                        </div>
                      )}
                      {content.content.metadata.platform && (
                        <div className="text-sm">
                          <strong>Platform:</strong> {content.content.metadata.platform}
                          {content.content.metadata.characterCount && (
                            <span className="ml-2 text-gray-500">({content.content.metadata.characterCount} chars)</span>
                          )}
                        </div>
                      )}
                      {content.content.metadata.image_url && (
                        <div className="mt-2">
                          <div className="text-sm font-medium text-gray-700 mb-1">Featured Image:</div>
                          <img 
                            src={content.content.metadata.image_url} 
                            alt={`${content.title} featured image`}
                            className="w-32 h-20 object-cover rounded border border-gray-200"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedContent(content)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  
                  <button
                    onClick={() => setEditingContent(content.id)}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              {/* Content Preview */}
              {editingContent === content.id ? (
                <div className="mt-4">
                  <textarea
                    className="w-full h-32 p-3 border border-gray-300 rounded-md"
                    defaultValue={content.content.body}
                    onBlur={(e) => saveEditedContent(content.id, e.target.value)}
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => setEditingContent(null)}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEditedContent(content.id, (document.querySelector('textarea') as HTMLTextAreaElement)?.value)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{content.content.body}</p>
                </div>
              )}

              {/* Action Buttons */}
              {content.status === 'pending' && (
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => updateContentStatus(content.id, 'rejected')}
                    className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => updateContentStatus(content.id, 'approved')}
                    className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                </div>
              )}
              
              {content.status === 'approved' && (
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => publishNow(content.id, content.type)}
                    disabled={publishingContent === content.id}
                    className={`flex items-center space-x-1 px-4 py-2 rounded font-semibold transition-colors ${
                      publishingContent === content.id
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {publishingContent === content.id ? 'Publishing...' : 'Publish Now'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Preview Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{selectedContent.title}</h3>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">{selectedContent.content.body}</div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Scheduled for:</span>
                    <p className="text-gray-900">{new Date(selectedContent.scheduledFor).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Quality Score:</span>
                    <p className={`font-bold ${getQualityScoreColor(selectedContent.qualityScore)}`}>
                      {selectedContent.qualityScore}/10
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}