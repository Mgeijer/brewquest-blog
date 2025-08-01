import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()

    // Get beer reviews count by state
    const { data: beerReviews, error: beerError } = await supabase
      .from('beer_reviews')
      .select('state_code, brewery_name, beer_name, brewery_story')

    // Get brewery features count by state  
    const { data: breweryFeatures, error: breweryError } = await supabase
      .from('brewery_features')
      .select('state_code, brewery_name, city, founded_year')

    if (beerError || breweryError) {
      return NextResponse.json(
        { error: 'Database query failed', details: { beerError, breweryError } },
        { status: 500 }
      )
    }

    // Organize data by state
    const states = ['AL', 'AK'] // Add more as we expand
    const summary = {}

    states.forEach(stateCode => {
      const stateBeers = beerReviews?.filter(b => b.state_code === stateCode) || []
      const stateBreweries = breweryFeatures?.filter(b => b.state_code === stateCode) || []
      
      summary[stateCode] = {
        beer_reviews: {
          count: stateBeers.length,
          target: 7,
          has_brewery_stories: stateBeers.every(b => b.brewery_story && b.brewery_story.length > 100),
          beers: stateBeers.map(b => ({
            brewery: b.brewery_name,
            beer: b.beer_name,
            has_story: !!(b.brewery_story && b.brewery_story.length > 100)
          }))
        },
        brewery_features: {
          count: stateBreweries.length,
          target: 7,
          breweries: stateBreweries.map(b => ({
            name: b.brewery_name,
            city: b.city,
            founded: b.founded_year
          }))
        },
        complete: stateBeers.length === 7 && 
                  stateBreweries.length === 7 && 
                  stateBeers.every(b => b.brewery_story && b.brewery_story.length > 100)
      }
    })

    return NextResponse.json({
      status: 'Database Status Check',
      timestamp: new Date().toISOString(),
      summary,
      recommendations: {
        alabama: summary['AL']?.complete ? '✅ Complete' : '❌ Missing brewery stories or incomplete data',
        alaska: summary['AK']?.complete ? '✅ Complete' : '❌ Missing brewery stories or incomplete data'
      },
      next_steps: [
        'Run /api/populate-complete-database with admin password to populate complete data',
        'Verify all brewery stories are comprehensive (100+ characters)',
        'Ensure cross-references between beer_reviews and brewery_features tables'
      ]
    })

  } catch (error) {
    console.error('Database status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check database status', details: error.message },
      { status: 500 }
    )
  }
}