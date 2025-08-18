import { NextRequest, NextResponse } from 'next/server'
import { updateStateStatus } from '@/lib/data/stateProgress'

/**
 * Force state transition for emergency fixes
 * Updates local data file to match current progression
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fromState, toState, action } = body

    if (action === 'alaska-to-arizona') {
      // Update local data: Alaska completed, Arizona current
      const alaskaUpdate = updateStateStatus('AK', 'completed', new Date())
      const arizonaUpdate = updateStateStatus('AZ', 'current')

      return NextResponse.json({
        success: true,
        message: 'State transition forced: Alaska → Arizona',
        updates: {
          alaska: alaskaUpdate,
          arizona: arizonaUpdate
        },
        note: 'Local data file updated. Deploy triggered.'
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action specified'
    }, { status: 400 })

  } catch (error) {
    console.error('Force transition error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to force state transition',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'State transition force endpoint',
    available_actions: ['alaska-to-arizona'],
    current_week: 3,
    current_state: 'Arizona',
    last_updated: new Date().toISOString()
  })
}