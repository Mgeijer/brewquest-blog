import { NextResponse } from 'next/server'
import { getAllBeerReviews, getBeerReviewsByState } from '@/lib/utils/populateBeerDatabase'

export async function GET() {
  try {
    console.log('🔍 Verifying beer review data...')
    
    // Get all beer reviews
    const allReviews = await getAllBeerReviews()
    const alabamaReviews = await getBeerReviewsByState('AL')
    
    console.log(`📊 Found ${allReviews.length} total beer reviews`)
    console.log(`📍 Found ${alabamaReviews.length} Alabama beer reviews`)
    
    // Analyze the data structure
    const sampleReview = allReviews[0]
    
    // Extract state and week data from metadata
    const stateData = allReviews.map(review => {
      if (review.unique_feature) {
        const [stateCode, weekNumber, ibu, originalId] = review.unique_feature.split(':')
        return {
          stateCode,
          weekNumber: parseInt(weekNumber),
          ibu: parseInt(ibu),
          originalId,
          beer: review.beer_name,
          brewery: review.brewery_name
        }
      }
      return null
    }).filter(Boolean)
    
    // Group by state
    const stateGroups = stateData.reduce((acc, item) => {
      if (!item) return acc
      if (!acc[item.stateCode]) {
        acc[item.stateCode] = []
      }
      acc[item.stateCode].push(item)
      return acc
    }, {} as Record<string, any[]>)
    
    return NextResponse.json({
      success: true,
      message: 'Beer review data verification complete',
      summary: {
        totalReviews: allReviews.length,
        alabamaReviews: alabamaReviews.length,
        statesWithData: Object.keys(stateGroups).length,
        sampleReview: {
          id: sampleReview?.id,
          beer_name: sampleReview?.beer_name,
          brewery_name: sampleReview?.brewery_name,
          rating: sampleReview?.rating,
          metadata: sampleReview?.unique_feature,
          description: sampleReview?.brewery_story?.substring(0, 100) + '...'
        }
      },
      stateBreakdown: stateGroups,
      fullAlabamData: alabamaReviews.map(review => ({
        beer_name: review.beer_name,
        brewery_name: review.brewery_name,
        beer_style: review.beer_style,
        abv: review.abv,
        rating: review.rating,
        day_of_week: review.day_of_week,
        metadata: review.unique_feature,
        tasting_notes: review.tasting_notes
      })),
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Error verifying beer data:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to verify beer review data'
    }, { status: 500 })
  }
}