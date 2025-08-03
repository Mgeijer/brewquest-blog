import { NextRequest, NextResponse } from 'next/server'
import { AdminStorageDB } from '@/lib/admin/contentStorageDB'

export async function POST(request: NextRequest) {
  try {
    const { contentId, status, adminUser } = await request.json()

    if (!contentId || !status) {
      return NextResponse.json(
        { error: 'Content ID and status are required' },
        { status: 400 }
      )
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be approved or rejected' },
        { status: 400 }
      )
    }

    // Update content status using database storage
    const success = await AdminStorageDB.setApprovalStatus(contentId, status, adminUser)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update approval status in database' },
        { status: 500 }
      )
    }

    console.log(`Content ${contentId} ${status} by ${adminUser || 'admin'}`)

    return NextResponse.json({
      success: true,
      message: `Content ${status} successfully`,
      contentId,
      status,
      timestamp: new Date().toISOString(),
      persistedToDatabase: true
    })

  } catch (error) {
    console.error('Error updating content approval:', error)
    return NextResponse.json(
      { error: 'Failed to update content approval' },
      { status: 500 }
    )
  }
}