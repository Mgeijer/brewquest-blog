import { NextRequest, NextResponse } from 'next/server'
import { AdminStorage } from '@/lib/admin/contentStorage'

export async function POST(request: NextRequest) {
  try {
    const { contentId, status } = await request.json()

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

    // Update content status using shared storage
    AdminStorage.setApprovalStatus(contentId, status)
    console.log(`Content ${contentId} ${status} by admin`)

    return NextResponse.json({
      success: true,
      message: `Content ${status} successfully`,
      contentId,
      status,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error updating content approval:', error)
    return NextResponse.json(
      { error: 'Failed to update content approval' },
      { status: 500 }
    )
  }
}