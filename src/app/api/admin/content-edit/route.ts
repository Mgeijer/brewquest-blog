import { NextRequest, NextResponse } from 'next/server'
import { AdminStorage } from '@/lib/admin/contentStorage'

export async function POST(request: NextRequest) {
  try {
    const { contentId, content } = await request.json()

    if (!contentId || !content) {
      return NextResponse.json(
        { error: 'Content ID and content are required' },
        { status: 400 }
      )
    }

    // Store the edited content using shared storage
    AdminStorage.setEditedContent(contentId, content)
    console.log(`Content ${contentId} edited by admin`)

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      contentId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}