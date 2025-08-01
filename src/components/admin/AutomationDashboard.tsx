'use client'

import { useState, useEffect } from 'react'
import { Clock, CheckCircle, XCircle, AlertTriangle, Play, Pause, RotateCcw, Activity } from 'lucide-react'

interface CronJobStatus {
  name: string
  path: string
  schedule: string
  nextRun: string
  lastRun?: string
  status: 'active' | 'paused' | 'error' | 'unknown'
  successRate: number
  lastResult?: {
    success: boolean
    message: string
    timestamp: string
    duration: number
  }
}

interface AutomationStats {
  totalRuns: number
  successfulRuns: number
  failedRuns: number
  averageResponseTime: number
  uptime: number
}

export default function AutomationDashboard() {
  const [cronJobs, setCronJobs] = useState<CronJobStatus[]>([])
  const [stats, setStats] = useState<AutomationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    fetchAutomationStatus()
    const interval = setInterval(fetchAutomationStatus, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchAutomationStatus = async () => {
    try {
      const response = await fetch('/api/admin/automation-status')
      if (response.ok) {
        const data = await response.json()
        setCronJobs(data.cronJobs)
        setStats(data.stats)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch automation status:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCronJob = async (jobName: string, action: 'pause' | 'resume') => {
    try {
      const response = await fetch('/api/admin/automation-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job: jobName, action })
      })
      
      if (response.ok) {
        fetchAutomationStatus() // Refresh status
      }
    } catch (error) {
      console.error(`Failed to ${action} cron job:`, error)
    }
  }

  const triggerManualRun = async (jobPath: string) => {
    try {
      const response = await fetch(jobPath, { method: 'POST' })
      if (response.ok) {
        fetchAutomationStatus() // Refresh status
      }
    } catch (error) {
      console.error('Failed to trigger manual run:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'paused':
        return <Pause className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-800 border-green-200'
      case 'paused': return 'bg-yellow-50 text-yellow-800 border-yellow-200'
      case 'error': return 'bg-red-50 text-red-800 border-red-200'
      default: return 'bg-gray-50 text-gray-800 border-gray-200'
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
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Runs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRuns}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {((stats.successfulRuns / stats.totalRuns) * 100).toFixed(1)}%
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-blue-600">{stats.averageResponseTime}ms</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-green-600">{stats.uptime.toFixed(1)}%</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      )}

      {/* Cron Jobs Status */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Automation Status</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              <button
                onClick={fetchAutomationStatus}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {cronJobs.map((job) => (
            <div key={job.name} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(job.status)}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{job.name}</h3>
                    <p className="text-sm text-gray-500">{job.path}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                    {job.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Schedule</p>
                  <p className="text-sm text-gray-900">{job.schedule}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Next Run</p>
                  <p className="text-sm text-gray-900">{job.nextRun}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Last Run</p>
                  <p className="text-sm text-gray-900">{job.lastRun || 'Never'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Success Rate</p>
                  <p className="text-sm text-gray-900">{job.successRate.toFixed(1)}%</p>
                </div>
              </div>

              {job.lastResult && (
                <div className={`p-3 rounded-md mb-4 ${
                  job.lastResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      job.lastResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      Last Result: {job.lastResult.success ? 'Success' : 'Failed'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {job.lastResult.duration}ms • {new Date(job.lastResult.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {job.lastResult.message && (
                    <p className={`text-sm mt-1 ${
                      job.lastResult.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {job.lastResult.message}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => triggerManualRun(job.path)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  <Play className="w-4 h-4" />
                  <span>Run Now</span>
                </button>

                <button
                  onClick={() => toggleCronJob(job.name, job.status === 'active' ? 'pause' : 'resume')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                    job.status === 'active' 
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {job.status === 'active' ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}