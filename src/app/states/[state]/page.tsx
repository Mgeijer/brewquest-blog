import { redirect } from 'next/navigation'

interface StatePageProps {
  params: {
    state: string
  }
}

export default function StatePage({ params }: StatePageProps) {
  const { state } = params
  
  // Handle state code to full name redirects
  const stateCodeMap: Record<string, string> = {
    'al': 'alabama',
    'ak': 'alaska',
    'az': 'arizona',
    // Add more as needed
  }
  
  if (stateCodeMap[state.toLowerCase()]) {
    redirect(`/states/${stateCodeMap[state.toLowerCase()]}`)
  }
  
  const stateFormatted = state.charAt(0).toUpperCase() + state.slice(1)

  return (
    <div className="min-h-screen bg-beer-cream">
      <div className="bg-gradient-to-r from-beer-amber to-beer-gold text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {stateFormatted} Beer Journey
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Discover the craft beer scene in {stateFormatted}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card">
          <h2 className="text-2xl font-bold text-beer-dark mb-4">
            Coming Soon: {stateFormatted} Breweries
          </h2>
          <p className="text-gray-600">
            This page will feature all blog posts and breweries from {stateFormatted}. 
            Content will be populated from Supabase in Phase 2.
          </p>
        </div>
      </div>
    </div>
  )
} 