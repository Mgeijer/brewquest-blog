import { NextRequest, NextResponse } from 'next/server'
import { populateBeerReviews, clearBeerReviews, syncStateProgressWithDatabase } from '@/lib/utils/populateBeerDatabase'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    switch (action) {
      case 'populate':
        const populateResult = await populateBeerReviews()
        return NextResponse.json(populateResult)
        
      case 'clear':
        const clearResult = await clearBeerReviews()
        return NextResponse.json(clearResult)
        
      case 'sync':
        const syncResult = await syncStateProgressWithDatabase()
        return NextResponse.json(syncResult)
        
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action. Use: populate, clear, or sync' },
          { status: 400 }
        )
    }
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Simple health check
    return NextResponse.json({ 
      success: true, 
      message: 'Beer review population API is available',
      actions: ['populate', 'clear', 'sync']
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Service unavailable' },
      { status: 500 }
    )
  }
}