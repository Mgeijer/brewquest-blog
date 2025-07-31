'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Star, ArrowRight } from 'lucide-react'

export default function AlabamaLaunchSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Now Exploring: Alabama
          </h2>
          <p className="text-xl text-gray-600">
            Week 1 of our 50-state journey begins in the Heart of Dixie
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full font-medium">
                  Live Now
                </span>
                <span>Week 1 • State 1 of 50</span>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Alabama's Craft Beer Renaissance
              </h3>
              
              <p className="text-lg text-gray-700 mb-6">
                Discover the Heart of Dixie's thriving craft beer scene, featuring 7 exceptional breweries and their signature beers. From Birmingham's urban brewing culture to Mobile's coastal flavors, Alabama's beer revolution is in full swing.
              </p>
              
              <div className="bg-white p-6 rounded-lg mb-6 border border-amber-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  This Week's Features:
                </h4>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>7 featured Alabama breweries with complete stories</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Daily beer reviews with detailed tasting notes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Local brewery history and founder insights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Interactive journey map tracking our progress</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/states/alabama"
                  className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold text-center flex items-center justify-center gap-2"
                >
                  Read Alabama Story
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/blog?category=reviews"
                  className="border border-amber-600 text-amber-600 px-6 py-3 rounded-lg hover:bg-amber-50 transition-colors font-semibold text-center"
                >
                  View Beer Reviews
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                <Image
                  src="/images/State Images/Alabama.png"
                  alt="Alabama state landscape"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
                  <div className="text-xs text-gray-600 font-medium">Alabama • Week 1</div>
                  <div className="text-sm font-bold text-gray-900">7 Breweries Featured</div>
                </div>
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span className="font-medium text-gray-900">Heart of Dixie</span>
                  </div>
                </div>
              </div>
              
              {/* Alabama Beer Preview Cards */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-amber-100">
                  <div className="text-xs text-gray-600 mb-1">Monday's Featured Beer</div>
                  <div className="font-semibold text-sm text-gray-900">Good People IPA</div>
                  <div className="text-xs text-amber-600">Good People Brewing</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-amber-100">
                  <div className="text-xs text-gray-600 mb-1">Tuesday's Featured Beer</div>
                  <div className="font-semibold text-sm text-gray-900">Avondale Miss Fancy</div>
                  <div className="text-xs text-amber-600">Avondale Brewing</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">45+</div>
            <div className="text-gray-600 text-sm">Alabama Breweries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">7</div>
            <div className="text-gray-600 text-sm">Featured This Week</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">1</div>
            <div className="text-gray-600 text-sm">State Complete</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">49</div>
            <div className="text-gray-600 text-sm">States Remaining</div>
          </div>
        </div>
      </div>
    </section>
  )
}