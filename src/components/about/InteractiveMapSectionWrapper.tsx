'use client'

import dynamic from 'next/dynamic'
import { type StateData } from '@/lib/data/stateProgress'

// Dynamically import InteractiveMapSection to avoid SSR issues
const InteractiveMapSection = dynamic(() => import('@/components/about/InteractiveMapSection'), {
  ssr: false,
  loading: () => (
    <div className="py-20 bg-beer-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-beer-dark mb-6">
            Track the Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our progress across America's craft beer landscape.
          </p>
        </div>
        <div className="w-full h-96 bg-beer-cream/30 rounded-2xl border border-beer-malt/20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-beer-malt">
            <div className="w-8 h-8 border-4 border-beer-malt/30 border-t-beer-malt rounded-full animate-spin" />
            <div className="text-center">
              <p className="font-medium">Loading Interactive Map...</p>
              <p className="text-sm opacity-70">Preparing your beer journey visualization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

interface InteractiveMapSectionWrapperProps {
  stateData?: StateData[]
  className?: string
}

export default function InteractiveMapSectionWrapper({ stateData, className }: InteractiveMapSectionWrapperProps) {
  // Debug logging
  console.log('InteractiveMapSectionWrapper rendered with stateData:', stateData?.length || 0, 'states')
  
  return <InteractiveMapSection stateData={stateData} className={className} />
}