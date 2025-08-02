'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Activity, Calendar, Settings, AlertTriangle, Eye } from 'lucide-react'
import AutomationDashboard from '@/components/admin/AutomationDashboard'
import ContentPreview from '@/components/admin/ContentPreview'
import ManualOverrides from '@/components/admin/ManualOverrides'

type TabType = 'automation' | 'content' | 'overrides'

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('content')
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
      })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Force redirect even if API call fails
      router.push('/admin/login')
    }
  }

  const tabs = [
    {
      id: 'automation' as const,
      name: 'Automation Status',
      icon: Activity,
      description: 'Monitor cron jobs and system performance'
    },
    {
      id: 'content' as const,
      name: 'Content Preview',
      icon: Eye,
      description: 'Review and approve upcoming content'
    },
    {
      id: 'overrides' as const,
      name: 'Manual Overrides',
      icon: AlertTriangle,
      description: 'Emergency controls and manual publishing'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Monitor and control the BrewQuest Chronicles automated publishing system
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-50 text-green-800 px-3 py-2 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">System Online</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-md border border-red-200 hover:bg-red-100"
              >
                <Settings className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`mr-2 h-5 w-5 ${
                      activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    <div className="text-left">
                      <div className="font-medium">{tab.name}</div>
                      <div className="text-xs text-gray-500 font-normal">
                        {tab.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'automation' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Automation Monitoring</h2>
                <p className="text-gray-600">
                  Real-time monitoring of cron jobs, success rates, and system performance metrics.
                </p>
              </div>
              <AutomationDashboard />
            </div>
          )}

          {activeTab === 'content' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Content Management</h2>
                <p className="text-gray-600">
                  Preview, review, and approve upcoming content before it goes live. Edit content and manage publishing schedules.
                </p>
              </div>
              <ContentPreview />
            </div>
          )}

          {activeTab === 'overrides' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Manual Controls</h2>
                <p className="text-gray-600">
                  Emergency controls for immediate intervention. Use these tools when manual override of the automated system is required.
                </p>
              </div>
              <ManualOverrides />
            </div>
          )}
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Week 1</div>
              <div className="text-sm text-gray-600">Current State: Alabama</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">5/7</div>
              <div className="text-sm text-gray-600">Beers Published This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">98.7%</div>
              <div className="text-sm text-gray-600">System Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-600">Pending Approvals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}