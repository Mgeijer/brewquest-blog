'use client'

import { Calendar, MapPin, Menu, User, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'States', href: '/states' },
  { name: 'About', href: '/about' },
  { name: 'Newsletter', href: '/newsletter' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(1)
  const pathname = usePathname()

  useEffect(() => {
    // Set to Week 1 for Alabama's journey
    setCurrentWeek(1)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [mobileMenuOpen])

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-beer-amber to-beer-gold rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-lg">🍺</span>
              </div>
              <div>
                <div className="text-xl font-bold text-beer-dark group-hover:text-beer-amber transition-colors">
                  Hop Harrison
                </div>
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Week {currentWeek} Journey
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors duration-200 relative group ${
                    isActive 
                      ? 'text-beer-amber' 
                      : 'text-gray-700 hover:text-beer-amber'
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-beer-amber transition-all duration-200 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-700 hover:text-beer-amber p-2 rounded-lg hover:bg-beer-cream/50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  setMobileMenuOpen(!mobileMenuOpen)
                }}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-gray-200 bg-white shadow-lg rounded-b-lg">
            <div className="px-4 py-6 space-y-4">
              {/* Journey Status */}
              <div className="bg-beer-cream/30 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-beer-dark font-medium">
                    <Calendar className="w-4 h-4" />
                    <span>Current Journey</span>
                  </div>
                  <div className="text-beer-amber font-semibold">
                    Week {currentWeek}/50
                  </div>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-beer-amber to-beer-gold h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentWeek / 50) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Navigation Links */}
              {navigationItems.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between font-medium transition-colors duration-200 px-3 py-2 rounded-lg group ${
                      isActive 
                        ? 'text-beer-amber bg-beer-cream/50' 
                        : 'text-gray-700 hover:text-beer-amber hover:bg-beer-cream/30'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span>{item.name}</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 