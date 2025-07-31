'use client'

import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TestResult {
  table: string
  success: boolean
  count: number
  error?: string
}

interface DatabaseTestResponse {
  success: boolean
  message: string
  supabaseUrl: string
  timestamp: string
  testResults: TestResult[]
  error?: string
}

export default function DatabaseTestPage() {
  const [testResults, setTestResults] = useState<DatabaseTestResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const runTest = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-db')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({
        success: false,
        message: 'Failed to run test',
        error: error instanceof Error ? error.message : 'Unknown error',
        supabaseUrl: '',
        timestamp: new Date().toISOString(),
        testResults: []
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runTest()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-beer-dark mb-2">Database Connection Test</h2>
          <p className="text-gray-600">
            Test the connection to your Supabase database and verify all tables are accessible.
          </p>
        </div>
        <button
          onClick={runTest}
          disabled={loading}
          className="btn-primary flex items-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Testing...</span>
            </>
          ) : (
            <span>Run Test</span>
          )}
        </button>
      </div>

      {testResults && (
        <div className="space-y-4">
          {/* Overall Status */}
          <div className={`card ${testResults.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center space-x-3">
              {testResults.success ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
              <div>
                <h3 className={`text-lg font-semibold ${testResults.success ? 'text-green-800' : 'text-red-800'}`}>
                  {testResults.message}
                </h3>
                <p className="text-sm text-gray-600">
                  Test run at: {new Date(testResults.timestamp).toLocaleString()}
                </p>
                {testResults.supabaseUrl && (
                  <p className="text-sm text-gray-600">
                    Connected to: {testResults.supabaseUrl}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Individual Table Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testResults.testResults.map((result, index) => (
              <div key={index} className="card">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-beer-dark">{result.table}</h4>
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <p>Records found: {result.count}</p>
                  <p>Status: {result.success ? 'Connected' : 'Error'}</p>
                  {result.error && (
                    <p className="text-red-600 mt-1">Error: {result.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Error Details */}
          {testResults.error && (
            <div className="card border-red-200 bg-red-50">
              <h4 className="font-semibold text-red-800 mb-2">Error Details</h4>
              <p className="text-sm text-red-700">{testResults.error}</p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-beer-dark mb-3">Troubleshooting</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Make sure your .env.local file contains the correct Supabase URL and keys</p>
          <p>• Verify that Row Level Security policies allow public read access</p>
          <p>• Check that all tables were created with the provided SQL schema</p>
          <p>• Ensure your Supabase project is active and not paused</p>
        </div>
      </div>
    </div>
  )
} 