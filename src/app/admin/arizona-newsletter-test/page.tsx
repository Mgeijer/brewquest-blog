'use client'

import { useState } from 'react'

export default function ArizonaNewsletterTest() {
  const [previewUrl, setPreviewUrl] = useState('')
  const [subscriberName, setSubscriberName] = useState('Beer Enthusiast')
  const [loading, setLoading] = useState(false)
  const [sendResult, setSendResult] = useState<any>(null)

  const generatePreview = () => {
    const url = `/api/newsletter/arizona-preview?name=${encodeURIComponent(subscriberName)}&week=3`
    setPreviewUrl(url)
  }

  const sendTestEmail = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/send-approved-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId: 'arizona-week-3-test'
        }),
      })
      
      const result = await response.json()
      setSendResult(result)
    } catch (error) {
      setSendResult({ success: false, error: 'Failed to send test email' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Arizona Newsletter Email Template Test
          </h1>
          
          <div className="space-y-6">
            {/* Preview Section */}
            <div className="border border-gray-200 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                📧 Email Preview
              </h2>
              
              <div className="flex items-center space-x-4 mb-4">
                <label className="font-medium text-gray-700">Subscriber Name:</label>
                <input
                  type="text"
                  value={subscriberName}
                  onChange={(e) => setSubscriberName(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subscriber name"
                />
                <button
                  onClick={generatePreview}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Generate Preview
                </button>
              </div>
              
              {previewUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview URL:</p>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {window.location.origin}{previewUrl}
                  </a>
                  
                  <div className="mt-4">
                    <iframe
                      src={previewUrl}
                      className="w-full h-96 border border-gray-300 rounded-md"
                      title="Arizona Newsletter Preview"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Send Test Email Section */}
            <div className="border border-gray-200 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                📤 Send Test Newsletter
              </h2>
              
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ This will send the Arizona newsletter to all active subscribers in the database.
                  Only use for testing with a limited subscriber list.
                </p>
              </div>
              
              <button
                onClick={sendTestEmail}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Arizona Newsletter'}
              </button>
              
              {sendResult && (
                <div className="mt-4 p-3 rounded-md border">
                  <h3 className="font-semibold mb-2">
                    {sendResult.success ? '✅ Send Result' : '❌ Send Error'}
                  </h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(sendResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Email Template Features */}
            <div className="border border-gray-200 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                ✨ Template Features
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Design Features:</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>✅ Arizona state hero image</li>
                    <li>✅ Red rock/desert color scheme</li>
                    <li>✅ Mobile-responsive design</li>
                    <li>✅ Email client compatibility</li>
                    <li>✅ Professional typography</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Content Features:</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>✅ Personalized greeting</li>
                    <li>✅ 7 Arizona beer reviews</li>
                    <li>✅ Desert terroir & brewing innovations</li>
                    <li>✅ Arizona brewing statistics</li>
                    <li>✅ Unsubscribe links</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="border border-gray-200 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                🔧 Technical Implementation
              </h2>
              
              <div className="space-y-2 text-sm">
                <p><strong>Preview Endpoint:</strong> /api/newsletter/arizona-preview</p>
                <p><strong>Send Endpoint:</strong> /api/admin/send-approved-content</p>
                <p><strong>Template Component:</strong> /src/emails/ArizonaNewsletterEmail.tsx</p>
                <p><strong>Email Service:</strong> Resend API</p>
                <p><strong>Template Engine:</strong> @react-email/render</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}