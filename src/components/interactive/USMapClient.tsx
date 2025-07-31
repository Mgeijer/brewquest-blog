'use client'

import dynamic from 'next/dynamic'

// Client-side dynamic import for Responsive Map Container
const ResponsiveMapContainer = dynamic(() => import('./ResponsiveMapContainer'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-beer-cream/30 rounded-2xl border border-beer-malt/20 flex items-center justify-center">
      <div className="text-beer-malt">Loading interactive map...</div>
    </div>
  )
})

export default ResponsiveMapContainer