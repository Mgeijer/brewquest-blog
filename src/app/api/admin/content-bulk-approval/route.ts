import { NextRequest, NextResponse } from 'next/server'
import { AdminStorage } from '@/lib/admin/contentStorage'

export async function POST(request: NextRequest) {
  try {
    const { contentIds, status } = await request.json()

    if (!contentIds || !Array.isArray(contentIds) || !status) {
      return NextResponse.json(
        { error: 'Content IDs array and status are required' },
        { status: 400 }
      )
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be approved or rejected' },
        { status: 400 }
      )
    }

    // Update all content items with the new status using shared storage
    AdminStorage.bulkSetApprovalStatus(contentIds, status)
    
    const results = contentIds.map(contentId => {
      console.log(`Content ${contentId} ${status} by admin (bulk operation)`)
      return { contentId, status }
    })

    return NextResponse.json({
      success: true,
      message: `${contentIds.length} items ${status} successfully`,
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error bulk updating content approval:', error)
    return NextResponse.json(
      { error: 'Failed to bulk update content approval' },
      { status: 500 }
    )
  }
}