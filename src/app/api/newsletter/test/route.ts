import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    console.log('Testing newsletter signup components...')
    
    // 1. Check environment variables
    const envCheck = {
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
    
    console.log('Environment variables:', envCheck)
    
    // 2. Test Supabase connection
    const supabase = createClient()
    
    const { data: tableCheck, error: tableError } = await supabase
      .from('newsletter_subscribers')
      .select('count(*)')
      .limit(1)
    
    console.log('Supabase table check:', { data: tableCheck, error: tableError })
    
    // 3. Test Resend import
    let resendCheck = false
    try {
      const { ResendEmailService } = await import('@/lib/email/resendService')
      resendCheck = true
      console.log('ResendEmailService import: SUCCESS')
    } catch (error) {
      console.log('ResendEmailService import error:', error.message)
    }
    
    return Response.json({
      success: true,
      checks: {
        environment: envCheck,
        supabase: {
          connected: !tableError,
          error: tableError?.message,
          data: tableCheck
        },
        resendService: resendCheck
      }
    })
    
  } catch (error) {
    console.error('Test endpoint error:', error)
    return Response.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}