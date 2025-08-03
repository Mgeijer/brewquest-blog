import { NextRequest, NextResponse } from 'next/server'
import { AdminStorageDB } from '@/lib/admin/contentStorageDB'

export async function POST(request: NextRequest) {
  try {
    const { contentIds, status, adminUser } = await request.json()

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

    // Update all content items with the new status using database storage
    const success = await AdminStorageDB.bulkSetApprovalStatus(contentIds, status, adminUser)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to bulk update approval status in database' },
        { status: 500 }
      )
    }
    
    const results = contentIds.map(contentId => {
      console.log(`Content ${contentId} ${status} by ${adminUser || 'admin'} (bulk operation)`)
      return { contentId, status }
    })

    return NextResponse.json({
      success: true,
      message: `${contentIds.length} items ${status} successfully`,
      results,
      timestamp: new Date().toISOString(),
      persistedToDatabase: true
    })

  } catch (error) {
    console.error('Error bulk updating content approval:', error)
    return NextResponse.json(
      { error: 'Failed to bulk update content approval' },
      { status: 500 }
    )
  }
}