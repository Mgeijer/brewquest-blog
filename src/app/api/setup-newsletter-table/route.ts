import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { adminPassword } = await request.json()
    
    // Verify admin access
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Create newsletter_subscribers table
    const { data, error } = await supabase.rpc('create_newsletter_table')
    
    if (error) {
      console.error('Error creating table:', error)
      
      // Fallback: try direct table creation
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          first_name VARCHAR(100),
          subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          is_active BOOLEAN DEFAULT true,
          preferences JSONB DEFAULT '{}',
          unsubscribed_at TIMESTAMP WITH TIME ZONE,
          source VARCHAR(100),
          state_interest VARCHAR(2),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
        CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_is_active ON newsletter_subscribers(is_active);
      `
      
      // Use raw SQL execution (this might not work directly)
      return Response.json({ 
        error: 'RPC failed, need to manually create table',
        sql: createTableSQL,
        originalError: error.message
      }, { status: 500 })
    }

    return Response.json({ 
      success: true, 
      message: 'Newsletter table created successfully',
      data 
    })

  } catch (error) {
    console.error('Setup error:', error)
    return Response.json({ 
      error: 'Failed to setup newsletter table: ' + error.message 
    }, { status: 500 })
  }
}

// GET endpoint to check table status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminPassword = searchParams.get('admin')
    
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Test if table exists by trying to count records
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('count(*)', { count: 'exact', head: true })

    if (error) {
      return Response.json({
        tableExists: false,
        error: error.message,
        code: error.code
      })
    }

    return Response.json({
      tableExists: true,
      message: 'Newsletter table exists and is accessible'
    })

  } catch (error) {
    return Response.json({ 
      error: 'Failed to check table status: ' + error.message 
    }, { status: 500 })
  }
}