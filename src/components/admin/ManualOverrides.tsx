'use client'

import { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Zap, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  Mail
} from 'lucide-react'

interface EmergencyAction {
  id: string
  name: string
  description: string
  type: 'publish' | 'skip' | 'reschedule' | 'pause' | 'emergency'
  targetContent?: string
  confirmationRequired: boolean
  lastUsed?: string
}

interface SystemStatus {
  automationEnabled: boolean
  emergencyMode: boolean
  lastEmergencyAction?: {
    action: string
    timestamp: string
    user: string
  }
  upcomingPublications: {
    id: string
    title: string
    scheduledFor: string
    type: string
    canOverride: boolean
  }[]
}

export default function ManualOverrides() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmingAction, setConfirmingAction] = useState<string | null>(null)
  const [emergencyReason, setEmergencyReason] = useState('')
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')
  const [newsletterSending, setNewsletterSending] = useState(false)
  const [newsletterResult, setNewsletterResult] = useState<string | null>(null)
  const [publishSending, setPublishSending] = useState(false)
  const [publishResult, setPublishResult] = useState<string | null>(null)

  const emergencyActions: EmergencyAction[] = [
    {
      id: 'emergency_publish',
      name: 'Emergency Publish',
      description: 'Immediately publish next scheduled content',
      type: 'emergency',
      confirmationRequired: true
    },
    {
      id: 'pause_automation',
      name: 'Pause All Automation',
      description: 'Stop all automated publishing until manually resumed',
      type: 'pause',
      confirmationRequired: true
    },
    {
      id: 'skip_next',
      name: 'Skip Next Publication',
      description: 'Skip the next scheduled content and move to following item',
      type: 'skip',
      confirmationRequired: true
    },
    {
      id: 'emergency_mode',
      name: 'Emergency Mode',
      description: 'Enable emergency mode - all content requires manual approval',
      type: 'emergency',
      confirmationRequired: true
    }
  ]

  useEffect(() => {
    fetchSystemStatus()
    const interval = setInterval(fetchSystemStatus, 10000) // Update every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/admin/system-status')
      if (response.ok) {
        const data = await response.json()
        setSystemStatus(data)
      }
    } catch (error) {
      console.error('Failed to fetch system status:', error)
    } finally {
      setLoading(false)
    }
  }

  const executeEmergencyAction = async (actionId: string) => {
    try {
      const response = await fetch('/api/admin/emergency-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          actionId, 
          reason: emergencyReason,
          rescheduleDateTime: rescheduleDate && rescheduleTime ? 
            `${rescheduleDate}T${rescheduleTime}` : undefined
        })
      })
      
      if (response.ok) {
        setConfirmingAction(null)
        setEmergencyReason('')
        setRescheduleDate('')
        setRescheduleTime('')
        fetchSystemStatus()
      }
    } catch (error) {
      console.error('Failed to execute emergency action:', error)
    }
  }

  const publishNow = async (contentId: string) => {
    try {
      const response = await fetch('/api/admin/publish-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId })
      })
      
      if (response.ok) {
        fetchSystemStatus()
      }
    } catch (error) {
      console.error('Failed to publish content:', error)
    }
  }

  const rescheduleContent = async (contentId: string) => {
    if (!rescheduleDate || !rescheduleTime) return
    
    try {
      const response = await fetch('/api/admin/reschedule-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contentId, 
          newDateTime: `${rescheduleDate}T${rescheduleTime}`
        })
      })
      
      if (response.ok) {
        setRescheduleDate('')
        setRescheduleTime('')
        fetchSystemStatus()
      }
    } catch (error) {
      console.error('Failed to reschedule content:', error)
    }
  }

  const toggleAutomation = async () => {
    try {
      const response = await fetch('/api/admin/toggle-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          enable: !systemStatus?.automationEnabled 
        })
      })
      
      if (response.ok) {
        fetchSystemStatus()
      }
    } catch (error) {
      console.error('Failed to toggle automation:', error)
    }
  }

  const sendAlaskaNewsletter = async () => {
    setNewsletterSending(true)
    setNewsletterResult(null)
    
    try {
      const response = await fetch('/api/cron/weekly-digest', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'fallback-secret'}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setNewsletterResult(`✅ Alaska newsletter sent successfully! ${data.stats?.successful || 0} emails delivered.`)
      } else {
        // Try alternative endpoint
        const altResponse = await fetch('/api/admin/send-weekly-digest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ admin: 'admin-request' })
        })
        
        const altData = await altResponse.json()
        
        if (altResponse.ok) {
          setNewsletterResult(`✅ Alaska newsletter sent successfully! ${altData.stats?.successful || 0} emails delivered.`)
        } else {
          setNewsletterResult(`❌ Failed to send newsletter: ${data.error || altData.error}`)
        }
      }
    } catch (error) {
      setNewsletterResult(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setNewsletterSending(false)
    }
  }

  const triggerDailyPublish = async () => {
    setPublishSending(true)
    setPublishResult(null)
    
    try {
      const response = await fetch('/api/admin/trigger-daily-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setPublishResult(`✅ Daily publish triggered successfully! ${data.result?.data?.beer?.name || 'Beer'} published.`)
      } else {
        setPublishResult(`❌ Failed to trigger daily publish: ${data.error || data.details}`)
      }
    } catch (error) {
      setPublishResult(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setPublishSending(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!systemStatus) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <XCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-800">Failed to load system status</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* System Status Alert */}
      <div className={`border rounded-lg p-4 ${
        systemStatus.emergencyMode 
          ? 'bg-red-50 border-red-200' 
          : systemStatus.automationEnabled 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {systemStatus.emergencyMode ? (
              <AlertTriangle className="w-6 h-6 text-red-500" />
            ) : systemStatus.automationEnabled ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <Pause className="w-6 h-6 text-yellow-500" />
            )}
            
            <div>
              <h3 className={`font-semibold ${
                systemStatus.emergencyMode 
                  ? 'text-red-800' 
                  : systemStatus.automationEnabled 
                    ? 'text-green-800' 
                    : 'text-yellow-800'
              }`}>
                {systemStatus.emergencyMode 
                  ? 'Emergency Mode Active' 
                  : systemStatus.automationEnabled 
                    ? 'Automation Running' 
                    : 'Automation Paused'
                }
              </h3>
              <p className={`text-sm ${
                systemStatus.emergencyMode 
                  ? 'text-red-700' 
                  : systemStatus.automationEnabled 
                    ? 'text-green-700' 
                    : 'text-yellow-700'
              }`}>
                {systemStatus.emergencyMode 
                  ? 'All content requires manual approval' 
                  : systemStatus.automationEnabled 
                    ? 'Content publishing automatically as scheduled' 
                    : 'No automated content will be published'
                }
              </p>
            </div>
          </div>

          <button
            onClick={toggleAutomation}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
              systemStatus.automationEnabled
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {systemStatus.automationEnabled ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Automation</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Resume Automation</span>
              </>
            )}
          </button>
        </div>

        {systemStatus.lastEmergencyAction && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Last emergency action:</span> {systemStatus.lastEmergencyAction.action} by {systemStatus.lastEmergencyAction.user} 
              at {new Date(systemStatus.lastEmergencyAction.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Alaska Newsletter Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Mail className="w-5 h-5 text-blue-500" />
            <span>Manual Newsletter</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Send the Alaska newsletter immediately to all subscribers.
          </p>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Alaska Newsletter</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Send "Week 2 Complete: Alaska Last Frontier Brewing" newsletter to all active subscribers.
                  This will include all Alaska beer reviews, brewery stories, and upcoming Arizona preview.
                </p>
              </div>
            </div>
          </div>

          {newsletterResult && (
            <div className={`mb-4 p-3 rounded-lg ${
              newsletterResult.includes('✅') 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {newsletterResult}
            </div>
          )}

          <button
            onClick={sendAlaskaNewsletter}
            disabled={newsletterSending}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              newsletterSending
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Mail className="w-5 h-5" />
            <span>{newsletterSending ? 'Sending Alaska Newsletter...' : 'Send Alaska Newsletter Now'}</span>
          </button>

          <p className="text-xs text-gray-500 mt-2">
            Note: Arizona newsletter will automatically send this Sunday (Aug 17) at 8 PM PDT
          </p>
        </div>
      </div>

      {/* Daily Beer Publishing Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-500" />
            <span>Daily Beer Publishing</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manually trigger today's beer publication for the current state.
          </p>
        </div>

        <div className="p-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900">Publish Today's Beer</h3>
                <p className="text-sm text-green-700 mt-1">
                  Trigger daily beer publishing cron job to publish today's scheduled beer review for Alaska.
                  This will mark the beer as published and trigger social media content generation.
                </p>
              </div>
            </div>
          </div>

          {publishResult && (
            <div className={`mb-4 p-3 rounded-lg ${
              publishResult.includes('✅') 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {publishResult}
            </div>
          )}

          <button
            onClick={triggerDailyPublish}
            disabled={publishSending}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              publishSending
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>{publishSending ? 'Publishing Today\'s Beer...' : 'Publish Today\'s Beer Now'}</span>
          </button>

          <p className="text-xs text-gray-500 mt-2">
            Note: This publishes the beer for today's day of the week and creates social media content
          </p>
        </div>
      </div>

      {/* Emergency Actions */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-red-500" />
            <span>Emergency Controls</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Use these controls only in emergency situations or when immediate intervention is required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {emergencyActions.map((action) => (
            <div key={action.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {action.type === 'emergency' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                  {action.type === 'pause' && <Pause className="w-5 h-5 text-yellow-500" />}
                  {action.type === 'skip' && <SkipForward className="w-5 h-5 text-blue-500" />}
                  {action.type === 'publish' && <Play className="w-5 h-5 text-green-500" />}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{action.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  
                  {action.lastUsed && (
                    <p className="text-xs text-gray-500 mt-2">
                      Last used: {new Date(action.lastUsed).toLocaleString()}
                    </p>
                  )}
                  
                  <button
                    onClick={() => setConfirmingAction(action.id)}
                    className={`mt-3 px-3 py-1 rounded text-sm font-medium ${
                      action.type === 'emergency' 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : action.type === 'pause'
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {action.name}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Publications */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span>Upcoming Publications</span>
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {systemStatus.upcomingPublications.map((content) => (
            <div key={content.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{content.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {new Date(content.scheduledFor).toLocaleString()}
                    </span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-medium">
                      {content.type}
                    </span>
                  </div>
                </div>

                {content.canOverride && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => publishNow(content.id)}
                      className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      <Play className="w-4 h-4" />
                      <span>Publish Now</span>
                    </button>
                    
                    <button
                      onClick={() => setConfirmingAction(`reschedule_${content.id}`)}
                      className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Reschedule</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Confirm Action</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                {confirmingAction.startsWith('reschedule_') 
                  ? 'Select new date and time for this content:'
                  : 'Are you sure you want to perform this emergency action? This action cannot be undone.'
                }
              </p>

              {confirmingAction.startsWith('reschedule_') ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason (required)</label>
                  <textarea
                    value={emergencyReason}
                    onChange={(e) => setEmergencyReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Explain why this emergency action is needed..."
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setConfirmingAction(null)
                    setEmergencyReason('')
                    setRescheduleDate('')
                    setRescheduleTime('')
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (confirmingAction.startsWith('reschedule_')) {
                      rescheduleContent(confirmingAction.replace('reschedule_', ''))
                    } else {
                      executeEmergencyAction(confirmingAction)
                    }
                  }}
                  disabled={
                    confirmingAction.startsWith('reschedule_') 
                      ? !rescheduleDate || !rescheduleTime
                      : !emergencyReason.trim()
                  }
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}