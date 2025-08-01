import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    // First, test basic connection with a simple query
    const { data: basicTest, error: basicError } = await supabase
      .from('beer_reviews')
      .select('count(*)', { count: 'exact', head: true })

    if (basicError) {
      console.error('Basic database error:', basicError)
      return Response.json({ 
        error: 'Basic database connection failed', 
        details: basicError.message,
        code: basicError.code
      }, { status: 500 })
    }

    // Then test newsletter_subscribers table
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('count(*)', { count: 'exact', head: true })

    if (error) {
      console.error('Newsletter table error:', error)
      return Response.json({ 
        error: 'Newsletter table not found', 
        details: error.message,
        code: error.code,
        basicConnectionWorks: true
      }, { status: 200 }) // Return 200 since basic connection works
    }

    return Response.json({ 
      success: true, 
      message: 'Database connection successful',
      tableExists: true,
      newsletterTableExists: true
    })

  } catch (error) {
    console.error('Connection test error:', error)
    return Response.json({ 
      error: 'Failed to connect to database',
      details: error.message
    }, { status: 500 })
  }
}