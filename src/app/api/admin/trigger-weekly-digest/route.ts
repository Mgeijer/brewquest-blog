import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email/resendService'

/**
 * POST /api/admin/trigger-weekly-digest
 * Manually trigger the weekly newsletter digest (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentId, admin } = body

    console.log(`[ADMIN] Manually triggering weekly digest - Content ID: ${contentId}`)

    // Send weekly digest emails for the current/completed state
    let emailResults = { successful: 0, failed: 0, total: 0 }
    
    try {
      emailResults = await emailService.sendWeeklyDigest()
      console.log(`[ADMIN] Weekly digest emails sent: ${emailResults.successful} successful, ${emailResults.failed} failed`)
      
      return NextResponse.json({
        success: true,
        message: 'Weekly digest sent successfully',
        stats: {
          successful: emailResults.successful,
          failed: emailResults.failed,
          total: emailResults.total
        },
        contentId,
        triggeredBy: 'admin'
      })
      
    } catch (emailError) {
      console.error('[ADMIN] Failed to send weekly digest emails:', emailError)
      
      return NextResponse.json({
        success: false,
        error: 'Failed to send weekly digest',
        details: emailError instanceof Error ? emailError.message : 'Unknown email error',
        contentId
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error triggering weekly digest:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to trigger weekly digest',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}