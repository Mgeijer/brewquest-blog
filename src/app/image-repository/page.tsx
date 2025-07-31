'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Eye, EyeOff, Download, FolderOpen, Lock, Unlock } from 'lucide-react'

export default function ImageRepositoryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedState, setSelectedState] = useState('Alabama')
  const [error, setError] = useState('')

  // Simple password protection (in production, use proper authentication)
  const ADMIN_PASSWORD = 'hopharrison2025!'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ]

  // Mock image data - in production, this would come from the file system
  const beerImages = {
    'Alabama': [
      {
        name: 'Good People IPA',
        brewery: 'Good People Brewing Company',
        filename: 'Good People IPA.png',
        path: '/images/Beer images/Alabama/Good People IPA.png',
        size: '245 KB',
        uploaded: '2025-01-27'
      },
      {
        name: 'Cahaba Oka Uba IPA',
        brewery: 'Cahaba Brewing Company',
        filename: 'Cahaba Oka Uba IPA.png',
        path: '/images/Beer images/Alabama/Cahaba Oka Uba IPA.png',
        size: '312 KB',
        uploaded: '2025-01-27'
      },
      {
        name: 'TrimTab Paradise Now',
        brewery: 'TrimTab Brewing Company',
        filename: 'TrimTab Paradise now.png',
        path: '/images/Beer images/Alabama/TrimTab Paradise now.png',
        size: '198 KB',
        uploaded: '2025-01-27'
      },
      {
        name: "Avondale Miss Fancy's Tripel",
        brewery: 'Avondale Brewing Company',
        filename: "Avondale Miss Fancy's Triple.png",
        path: "/images/Beer images/Alabama/Avondale Miss Fancy's Triple.png",
        size: '287 KB',
        uploaded: '2025-01-27'
      },
      {
        name: 'Monday Night Imperial Stout',
        brewery: 'Monday Night Brewing',
        filename: 'Monday Night Brewing Imperial Stout.png',
        path: '/images/Beer images/Alabama/Monday Night Brewing Imperial Stout.png',
        size: '356 KB',
        uploaded: '2025-01-27'
      }
    ]
  }

  const currentStateImages = beerImages[selectedState as keyof typeof beerImages] || []

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beer-dark to-beer-brown flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-beer-amber rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-beer-dark mb-2">Image Repository</h1>
            <p className="text-gray-600">Password-protected access for Hop Harrison admin</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beer-amber focus:border-beer-amber pr-12"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-beer-amber text-white py-3 px-4 rounded-lg hover:bg-beer-gold transition-colors font-medium"
            >
              Access Repository
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This repository contains beer images for the Hop Harrison blog.<br/>
              Access is restricted to authorized personnel only.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-beer-cream">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-beer-amber rounded-full flex items-center justify-center">
                <Unlock className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-beer-dark">Beer Image Repository</h1>
                <p className="text-sm text-gray-600">Admin access • Hop Harrison</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsAuthenticated(false)
                setPassword('')
              }}
              className="text-beer-amber hover:text-beer-gold text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* State Selector */}
        <div className="bg-white rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FolderOpen className="w-5 h-5 text-beer-amber" />
            <h2 className="text-lg font-bold text-beer-dark">Select State</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {states.map((state) => (
              <button
                key={state}
                onClick={() => setSelectedState(state)}
                className={`p-2 text-sm rounded-lg transition-colors ${
                  selectedState === state
                    ? 'bg-beer-amber text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        {/* Images Grid */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-beer-dark">
              {selectedState} Beer Images
            </h2>
            <span className="text-sm text-gray-600">
              {currentStateImages.length} images
            </span>
          </div>

          {currentStateImages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No images found for {selectedState}</p>
              <p className="text-sm mt-2">Images will appear here once uploaded</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentStateImages.map((image) => (
                <div key={image.filename} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={image.path}
                      alt={image.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-beer-dark mb-1">{image.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{image.brewery}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{image.size}</span>
                      <span>{image.uploaded}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <a
                        href={image.path}
                        download={image.filename}
                        className="flex-1 bg-beer-amber text-white text-center py-2 px-3 rounded text-xs hover:bg-beer-gold transition-colors"
                      >
                        <Download className="w-3 h-3 inline mr-1" />
                        Download
                      </a>
                      <button className="flex-1 border border-gray-300 text-gray-700 text-center py-2 px-3 rounded text-xs hover:bg-gray-50 transition-colors">
                        Copy URL
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Instructions */}
        <div className="bg-beer-amber/10 rounded-xl p-6 mt-8 border border-beer-amber/20">
          <h3 className="font-bold text-beer-dark mb-3">Upload Instructions</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>Directory Structure:</strong> /public/images/Beer images/[State]/[BeerName].[ext]</p>
            <p><strong>Naming Convention:</strong> Use exact beer name with brewery for clarity</p>
            <p><strong>File Formats:</strong> Prefer .png for quality, .jpg for smaller file sizes</p>
            <p><strong>Recommended Size:</strong> 400x400px minimum, square aspect ratio preferred</p>
          </div>
        </div>
      </div>
    </div>
  )
}