import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * Clear cache for all key pages after state transitions
 */
export async function POST(request: NextRequest) {
  try {
    // Revalidate key pages
    revalidatePath('/blog')
    revalidatePath('/states')
    revalidatePath('/')
    revalidatePath('/states/alaska')
    revalidatePath('/states/arizona')
    
    return NextResponse.json({
      success: true,
      message: 'Cache cleared for all key pages',
      timestamp: new Date().toISOString(),
      revalidated_paths: ['/blog', '/states', '/', '/states/alaska', '/states/arizona']
    })

  } catch (error) {
    console.error('Cache clear error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to clear cache',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Cache clearing endpoint',
    usage: 'POST to clear cache for key pages',
    last_cleared: new Date().toISOString(),
    cache_bust: Math.random()
  })
}