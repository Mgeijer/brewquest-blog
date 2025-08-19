'use client'

import { useEffect, useState } from 'react'

export default function NewsletterPreviewPage() {
  const [newsletterHtml, setNewsletterHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await fetch('/api/email/preview?template=arizona')
        if (response.ok) {
          const html = await response.text()
          setNewsletterHtml(html)
        } else {
          setError('Failed to load newsletter preview')
        }
      } catch (err) {
        setError('Error loading preview: ' + (err instanceof Error ? err.message : 'Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchPreview()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beer-amber mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Arizona newsletter preview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Arizona Newsletter Preview</h1>
            <p className="text-gray-600">Week 3 - Desert Brewing Renaissance</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Refresh Preview
            </button>
            <p className="text-sm text-gray-500 flex items-center">
              ℹ️ To send newsletter, please log into admin panel
            </p>
          </div>
        </div>
      </div>
      
      {/* Newsletter Content */}
      <div className="max-w-4xl mx-auto py-6">
        <div 
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          dangerouslySetInnerHTML={{ __html: newsletterHtml }}
        />
      </div>
    </div>
  )
}