import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { password } = await request.json()
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Read and execute Alabama complete data
    const alabamaScriptPath = path.join(process.cwd(), 'src/lib/supabase/schema/populate-complete-alabama-data.sql')
    const alabamaScript = fs.readFileSync(alabamaScriptPath, 'utf8')

    console.log('Executing Alabama complete data script...')
    const { error: alabamaError } = await supabase.rpc('execute_sql', { 
      sql_query: alabamaScript 
    })

    if (alabamaError) {
      console.error('Alabama population error:', alabamaError)
      return NextResponse.json(
        { error: 'Alabama data population failed', details: alabamaError },
        { status: 500 }
      )
    }

    // Read and execute Alaska complete data
    const alaskaScriptPath = path.join(process.cwd(), 'src/lib/supabase/schema/populate-complete-alaska-data.sql')
    const alaskaScript = fs.readFileSync(alaskaScriptPath, 'utf8')

    console.log('Executing Alaska complete data script...')
    const { error: alaskaError } = await supabase.rpc('execute_sql', { 
      sql_query: alaskaScript 
    })

    if (alaskaError) {
      console.error('Alaska population error:', alaskaError)
      return NextResponse.json(
        { error: 'Alaska data population failed', details: alaskaError },
        { status: 500 }
      )
    }

    // Verify the data was inserted correctly
    const { data: alabamaBeers, error: alabamaCheckError } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('state_code', 'AL')

    const { data: alaskaBeers, error: alaskaCheckError } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('state_code', 'AK')

    const { data: alabamaBreweries, error: alabamaBreweryError } = await supabase
      .from('brewery_features')
      .select('*')
      .eq('state_code', 'AL')

    const { data: alaskaBreweries, error: alaskaBreweryError } = await supabase
      .from('brewery_features')
      .select('*')
      .eq('state_code', 'AK')

    if (alabamaCheckError || alaskaCheckError || alabamaBreweryError || alaskaBreweryError) {
      console.error('Data verification error:', { alabamaCheckError, alaskaCheckError, alabamaBreweryError, alaskaBreweryError })
    }

    return NextResponse.json({
      success: true,
      message: 'Complete database populated successfully with all brewery stories',
      populated: {
        alabama: {
          beers: alabamaBeers?.length || 0,
          breweries: alabamaBreweries?.length || 0,
          brewery_stories_included: true
        },
        alaska: {
          beers: alaskaBeers?.length || 0,
          breweries: alaskaBreweries?.length || 0,
          brewery_stories_included: true
        },
        total_beers: (alabamaBeers?.length || 0) + (alaskaBeers?.length || 0),
        total_breweries: (alabamaBreweries?.length || 0) + (alaskaBreweries?.length || 0),
        cross_referenced: true
      }
    })

  } catch (error) {
    console.error('Error populating complete database:', error)
    return NextResponse.json(
      { error: 'Failed to populate complete database', details: error.message },
      { status: 500 }
    )
  }
}

// Get current database status
export async function GET() {
  try {
    const supabase = createClient()

    const { data: beerReviews } = await supabase
      .from('beer_reviews')
      .select('state_code, brewery_name, beer_name, brewery_story')
      .order('state_code', { ascending: true })

    const { data: breweryFeatures } = await supabase
      .from('brewery_features')
      .select('state_code, brewery_name, city, founded_year')
      .order('state_code', { ascending: true })

    const alabamaData = {
      beers: beerReviews?.filter(b => b.state_code === 'AL') || [],
      breweries: breweryFeatures?.filter(b => b.state_code === 'AL') || []
    }

    const alaskaData = {
      beers: beerReviews?.filter(b => b.state_code === 'AK') || [],
      breweries: breweryFeatures?.filter(b => b.state_code === 'AK') || []
    }

    return NextResponse.json({
      status: 'Current database status',
      alabama: {
        beer_count: alabamaData.beers.length,
        brewery_count: alabamaData.breweries.length,
        has_brewery_stories: alabamaData.beers.every(b => b.brewery_story && b.brewery_story.length > 0),
        beers: alabamaData.beers.map(b => `${b.brewery_name} - ${b.beer_name}`),
        breweries: alabamaData.breweries.map(b => `${b.brewery_name} (${b.city}, ${b.founded_year})`)
      },
      alaska: {
        beer_count: alaskaData.beers.length,
        brewery_count: alaskaData.breweries.length,
        has_brewery_stories: alaskaData.beers.every(b => b.brewery_story && b.brewery_story.length > 0),
        beers: alaskaData.beers.map(b => `${b.brewery_name} - ${b.beer_name}`),
        breweries: alaskaData.breweries.map(b => `${b.brewery_name} (${b.city}, ${b.founded_year})`)
      }
    })

  } catch (error) {
    console.error('Error checking database status:', error)
    return NextResponse.json(
      { error: 'Failed to check database status' },
      { status: 500 }
    )
  }
}