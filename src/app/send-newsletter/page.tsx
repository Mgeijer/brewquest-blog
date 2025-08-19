'use client'

import { useState } from 'react'

export default function SendNewsletterPage() {
  const [password, setPassword] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/send-arizona-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResult(data)
        setPassword('') // Clear password after successful send
      } else {
        setError(data.error || 'Failed to send newsletter')
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-red-600 p-3 rounded-full">
            <span className="text-white text-2xl">📧</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Send Arizona Newsletter
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Week 3: Arizona's Desert Brewing Renaissance
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* Preview Link */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📄 Newsletter Preview</h3>
            <p className="text-sm text-blue-700 mb-3">
              Review the complete Arizona newsletter before sending:
            </p>
            <a 
              href="/newsletter-preview" 
              target="_blank"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              View Newsletter Preview →
            </a>
          </div>

          {/* Send Form */}
          <form className="space-y-6" onSubmit={handleSend}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Admin Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={sending}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                <h4 className="font-semibold mb-2">✅ Newsletter Sent Successfully!</h4>
                <ul className="text-xs space-y-1">
                  <li>• Total Subscribers: {result.results?.total_subscribers}</li>
                  <li>• Successful Sends: {result.results?.successful_sends}</li>
                  <li>• Failed Sends: {result.results?.failed_sends}</li>
                  <li>• Subject: {result.results?.subject}</li>
                  <li>• State: {result.results?.state} (Week {result.results?.week})</li>
                </ul>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={sending || !password.trim()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Newsletter...
                  </div>
                ) : (
                  '🚀 Send Arizona Newsletter'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Newsletter Info</span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-500 text-center">
                This will send the Arizona Week 3 newsletter to all active subscribers with the subject: 
                <br />
                <strong>"🍺 Week 3 Complete: Arizona's Desert Brewing Renaissance"</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}