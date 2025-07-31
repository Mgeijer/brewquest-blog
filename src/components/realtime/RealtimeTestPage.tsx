/**
 * Real-time Integration Test Page
 * 
 * Comprehensive testing component for real-time progress updates
 * that demonstrates integration with existing API routes and 
 * validates real-time subscription functionality.
 * 
 * Features:
 * - Real-time subscription testing
 * - API integration validation
 * - Manual trigger testing
 * - Performance monitoring
 * - Error simulation and handling
 * - Connection state management
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useStateProgress } from '@/hooks/useStateProgress'
import { ProgressNotification } from './ProgressNotification'
import { getSubscriptionManager } from '@/lib/realtime/stateProgressSubscription'
import { StateProgress, JourneyMilestone } from '@/lib/supabase/functions/stateProgressFunctions'

// ==================================================
// Type Definitions
// ==================================================

interface TestLog {
  timestamp: Date
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  details?: any
}

interface TestResults {
  subscriptionConnection: 'pending' | 'success' | 'failed'
  apiIntegration: 'pending' | 'success' | 'failed'
  realtimeUpdates: 'pending' | 'success' | 'failed'
  errorHandling: 'pending' | 'success' | 'failed'
  performance: 'pending' | 'success' | 'failed'
}

// ==================================================
// Test Utilities
// ==================================================

const simulateStateUpdate = async (stateCode: string): Promise<Response> => {
  return fetch('/api/admin/states/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` // For testing
    },
    body: JSON.stringify({
      state_code: stateCode,
      updates: {
        state_progress: {
          description: `Test update at ${new Date().toISOString()}`,
          journey_highlights: [`Test highlight at ${Date.now()}`]
        }
      },
      trigger_realtime: true,
      admin_notes: 'Integration test update'
    })
  })
}

const simulateMilestoneCreation = async (stateCode: string): Promise<Response> => {
  return fetch('/api/admin/states/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` // For testing
    },
    body: JSON.stringify({
      state_code: stateCode,
      updates: {
        milestones: {
          add: [{
            milestone_type: 'technical_milestone',
            title: 'Real-time Test Milestone',
            description: 'Successfully tested real-time milestone creation',
            celebration_level: 'minor',
            social_media_posted: false,
            is_public: true,
            metadata: { test: true, timestamp: Date.now() }
          }]
        }
      },
      trigger_realtime: true,
      admin_notes: 'Integration test milestone'
    })
  })
}

// ==================================================
// Main Test Component
// ==================================================

export const RealtimeTestPage: React.FC = () => {
  const [testLogs, setTestLogs] = useState<TestLog[]>([])
  const [testResults, setTestResults] = useState<TestResults>({
    subscriptionConnection: 'pending',
    apiIntegration: 'pending',
    realtimeUpdates: 'pending',
    errorHandling: 'pending',
    performance: 'pending'
  })
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [selectedState, setSelectedState] = useState('AL')

  const { data, actions, utils } = useStateProgress({
    enableRealtime: true,
    enableOptimisticUpdates: true,
    enableNotifications: true,
    enableRetry: true,
    maxRetries: 3
  })

  // ==================================================
  // Logging Utilities
  // ==================================================

  const addLog = useCallback((type: TestLog['type'], message: string, details?: any) => {
    const log: TestLog = {
      timestamp: new Date(),
      type,
      message,
      details
    }
    
    setTestLogs(prev => [...prev.slice(-49), log]) // Keep last 50 logs
    console.log(`[RealtimeTest] ${type.toUpperCase()}: ${message}`, details)
  }, [])

  const updateTestResult = useCallback((test: keyof TestResults, result: TestResults[keyof TestResults]) => {
    setTestResults(prev => ({ ...prev, [test]: result }))
  }, [])

  // ==================================================
  // Test Functions
  // ==================================================

  const testSubscriptionConnection = useCallback(async (): Promise<void> => {
    addLog('info', 'Testing subscription connection...')
    updateTestResult('subscriptionConnection', 'pending')

    try {
      const manager = getSubscriptionManager()
      const connectionState = manager.getConnectionState()
      
      if (connectionState === 'connected') {
        addLog('success', 'Subscription already connected')
        updateTestResult('subscriptionConnection', 'success')
      } else {
        // Wait for connection
        const timeout = setTimeout(() => {
          addLog('error', 'Subscription connection timeout')
          updateTestResult('subscriptionConnection', 'failed')
        }, 10000)

        const cleanup = manager.onConnectionChange((state) => {
          if (state === 'connected') {
            clearTimeout(timeout)
            cleanup()
            addLog('success', 'Subscription connected successfully')
            updateTestResult('subscriptionConnection', 'success')
          } else if (state === 'error') {
            clearTimeout(timeout)
            cleanup()
            addLog('error', 'Subscription connection failed')
            updateTestResult('subscriptionConnection', 'failed')
          }
        })
      }
    } catch (error) {
      addLog('error', 'Subscription connection test failed', error)
      updateTestResult('subscriptionConnection', 'failed')
    }
  }, [addLog, updateTestResult])

  const testApiIntegration = useCallback(async (): Promise<void> => {
    addLog('info', 'Testing API integration...')
    updateTestResult('apiIntegration', 'pending')

    try {
      // Test basic API endpoints
      const progressResponse = await fetch('/api/states/progress?format=basic')
      
      if (!progressResponse.ok) {
        throw new Error(`Progress API failed: ${progressResponse.status}`)
      }

      const progressData = await progressResponse.json()
      
      if (!progressData.states || !Array.isArray(progressData.states)) {
        throw new Error('Invalid progress API response format')
      }

      addLog('success', `API integration test passed: ${progressData.states.length} states loaded`)
      updateTestResult('apiIntegration', 'success')

    } catch (error) {
      addLog('error', 'API integration test failed', error)
      updateTestResult('apiIntegration', 'failed')
    }
  }, [addLog, updateTestResult])

  const testRealtimeUpdates = useCallback(async (): Promise<void> => {
    addLog('info', 'Testing real-time updates...')
    updateTestResult('realtimeUpdates', 'pending')

    try {
      let updateReceived = false
      const manager = getSubscriptionManager()
      
      // Set up listener for state progress updates
      const cleanup = manager.onStateProgressChange((update) => {
        if (update.stateCode === selectedState) {
          updateReceived = true
          addLog('success', `Real-time update received for ${selectedState}`, update)
          updateTestResult('realtimeUpdates', 'success')
          cleanup()
        }
      })

      // Trigger an update via API
      const response = await simulateStateUpdate(selectedState)
      
      if (!response.ok) {
        throw new Error(`Failed to trigger update: ${response.status}`)
      }

      // Wait for real-time update
      setTimeout(() => {
        if (!updateReceived) {
          cleanup()
          addLog('warning', 'No real-time update received within timeout')
          updateTestResult('realtimeUpdates', 'failed')
        }
      }, 5000)

    } catch (error) {
      addLog('error', 'Real-time updates test failed', error)
      updateTestResult('realtimeUpdates', 'failed')
    }
  }, [addLog, updateTestResult, selectedState])

  const testErrorHandling = useCallback(async (): Promise<void> => {
    addLog('info', 'Testing error handling...')
    updateTestResult('errorHandling', 'pending')

    try {
      // Test invalid API call
      const response = await fetch('/api/admin/states/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalid: 'data' })
      })

      if (response.status === 400 || response.status === 401) {
        addLog('success', 'Error handling test passed: API correctly rejected invalid request')
        updateTestResult('errorHandling', 'success')
      } else {
        addLog('warning', `Unexpected response status: ${response.status}`)
        updateTestResult('errorHandling', 'failed')
      }

    } catch (error) {
      addLog('success', 'Error handling test passed: Network error caught', error)
      updateTestResult('errorHandling', 'success')
    }
  }, [addLog, updateTestResult])

  const testPerformance = useCallback(async (): Promise<void> => {
    addLog('info', 'Testing performance...')
    updateTestResult('performance', 'pending')

    try {
      const startTime = performance.now()
      
      // Test multiple rapid API calls
      const promises = Array.from({ length: 5 }, (_, i) => 
        fetch(`/api/states/progress?format=basic&t=${i}`)
      )

      const responses = await Promise.all(promises)
      const endTime = performance.now()
      
      const allSuccessful = responses.every(r => r.ok)
      const avgResponseTime = (endTime - startTime) / responses.length

      if (allSuccessful && avgResponseTime < 2000) {
        addLog('success', `Performance test passed: ${avgResponseTime.toFixed(0)}ms average response time`)
        updateTestResult('performance', 'success')
      } else {
        addLog('warning', `Performance test completed with issues: ${avgResponseTime.toFixed(0)}ms average`)
        updateTestResult('performance', 'failed')
      }

    } catch (error) {
      addLog('error', 'Performance test failed', error)
      updateTestResult('performance', 'failed')
    }
  }, [addLog, updateTestResult])

  // ==================================================
  // Full Test Suite
  // ==================================================

  const runAllTests = useCallback(async (): Promise<void> => {
    if (isRunningTests) return

    setIsRunningTests(true)
    addLog('info', 'Starting comprehensive real-time integration tests...')

    try {
      await testSubscriptionConnection()
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      await testApiIntegration()
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      await testRealtimeUpdates()
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      await testErrorHandling()
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      await testPerformance()
      
      addLog('info', 'All integration tests completed')
    } catch (error) {
      addLog('error', 'Test suite execution failed', error)
    } finally {
      setIsRunningTests(false)
    }
  }, [isRunningTests, testSubscriptionConnection, testApiIntegration, testRealtimeUpdates, testErrorHandling, testPerformance, addLog])

  // ==================================================
  // Manual Test Actions
  // ==================================================

  const triggerManualUpdate = useCallback(async (): Promise<void> => {
    try {
      addLog('info', `Triggering manual update for ${selectedState}...`)
      const response = await simulateStateUpdate(selectedState)
      
      if (response.ok) {
        addLog('success', 'Manual update triggered successfully')
      } else {
        addLog('error', `Manual update failed: ${response.status}`)
      }
    } catch (error) {
      addLog('error', 'Manual update failed', error)
    }
  }, [selectedState, addLog])

  const triggerMilestone = useCallback(async (): Promise<void> => {
    try {
      addLog('info', `Creating test milestone for ${selectedState}...`)
      const response = await simulateMilestoneCreation(selectedState)
      
      if (response.ok) {
        addLog('success', 'Test milestone created successfully')
      } else {
        addLog('error', `Milestone creation failed: ${response.status}`)
      }
    } catch (error) {
      addLog('error', 'Milestone creation failed', error)
    }
  }, [selectedState, addLog])

  // ==================================================
  // Render Helpers
  // ==================================================

  const getStatusColor = (status: TestResults[keyof TestResults]) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'failed': return 'text-red-600'
      case 'pending': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: TestResults[keyof TestResults]) => {
    switch (status) {
      case 'success': return '✅'
      case 'failed': return '❌'
      case 'pending': return '⏳'
      default: return '❓'
    }
  }

  // ==================================================
  // Effects
  // ==================================================

  useEffect(() => {
    // Monitor real-time data changes
    if (data.lastUpdated) {
      addLog('info', `Data updated: ${data.eventsReceived} events received`, {
        connectionState: data.connectionState,
        statesCount: data.states.length,
        milestonesCount: data.milestones.length
      })
    }
  }, [data.lastUpdated, data.eventsReceived, data.connectionState, data.states.length, data.milestones.length, addLog])

  // ==================================================
  // Render
  // ==================================================

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Real-time Integration Test Suite
        </h1>
        <p className="text-gray-600 mb-6">
          Comprehensive testing for real-time progress updates, API integration, and subscription management.
        </p>

        {/* Test Controls */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Test Controls</h2>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="AL">Alabama</option>
              <option value="CA">California</option>
              <option value="TX">Texas</option>
              <option value="NY">New York</option>
            </select>

            <button
              onClick={runAllTests}
              disabled={isRunningTests}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
            </button>

            <button
              onClick={triggerManualUpdate}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Trigger Update
            </button>

            <button
              onClick={triggerMilestone}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Create Milestone
            </button>

            <button
              onClick={actions.reconnect}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Reconnect
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Object.entries(testResults).map(([test, status]) => (
            <div key={test} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 capitalize">
                  {test.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </h3>
                <span className={`${getStatusColor(status)} text-lg`}>
                  {getStatusIcon(status)}
                </span>
              </div>
              <p className={`text-sm mt-1 ${getStatusColor(status)}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </p>
            </div>
          ))}
        </div>

        {/* Real-time Status */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Real-time Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{data.connectionState}</div>
              <div className="text-sm text-gray-600">Connection</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.eventsReceived}</div>
              <div className="text-sm text-gray-600">Events Received</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{data.states.length}</div>
              <div className="text-sm text-gray-600">States Loaded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{data.milestones.length}</div>
              <div className="text-sm text-gray-600">Milestones</div>
            </div>
          </div>
        </div>

        {/* Test Logs */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Test Logs</h2>
          
          <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            {testLogs.map((log, index) => (
              <div key={index} className={`mb-1 ${
                log.type === 'error' ? 'text-red-400' :
                log.type === 'success' ? 'text-green-400' :
                log.type === 'warning' ? 'text-yellow-400' :
                'text-gray-300'
              }`}>
                <span className="text-gray-500">
                  [{log.timestamp.toLocaleTimeString()}]
                </span>{' '}
                <span className="uppercase font-bold">
                  {log.type}:
                </span>{' '}
                {log.message}
              </div>
            ))}
            {testLogs.length === 0 && (
              <div className="text-gray-500 italic">No logs yet...</div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Notification Component */}
      <ProgressNotification
        enableToasts={true}
        enableCelebrations={true}
        position="top-right"
        maxNotifications={5}
        onNotification={(notification) => {
          addLog('info', `Notification: ${notification.title}`, notification)
        }}
        onCelebration={(milestone) => {
          addLog('success', `Celebration: ${milestone.title}`, milestone)
        }}
        onError={(error) => {
          addLog('error', `Notification error: ${error.message}`, error)
        }}
      />
    </div>
  )
}

export default RealtimeTestPage