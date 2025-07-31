import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase/client'

export async function GET() {
  try {
    // Test basic connection
    const { data: tables, error } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Supabase connection error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        message: 'Failed to connect to Supabase'
      }, { status: 500 })
    }

    // Test all our main tables
    const testResults = []
    
    // Test blog_posts table
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(5)
    
    testResults.push({
      table: 'blog_posts', 
      success: !blogError,
      count: blogPosts?.length || 0,
      error: blogError?.message
    })

    // Test beer_reviews table
    const { data: beerReviews, error: beerError } = await supabase
      .from('beer_reviews')
      .select('*')
      .limit(5)
    
    testResults.push({
      table: 'beer_reviews',
      success: !beerError, 
      count: beerReviews?.length || 0,
      error: beerError?.message
    })

    // Test social_posts table
    const { data: socialPosts, error: socialError } = await supabase
      .from('social_posts')
      .select('*')
      .limit(5)
    
    testResults.push({
      table: 'social_posts',
      success: !socialError,
      count: socialPosts?.length || 0, 
      error: socialError?.message
    })

    // Test newsletter_subscribers table
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .limit(5)
    
    testResults.push({
      table: 'newsletter_subscribers',
      success: !subError,
      count: subscribers?.length || 0,
      error: subError?.message
    })

    const allSuccessful = testResults.every(result => result.success)

    return NextResponse.json({
      success: allSuccessful,
      message: allSuccessful ? 'All database tables accessible!' : 'Some tables had errors',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      timestamp: new Date().toISOString(),
      testResults
    })

  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database test failed'
    }, { status: 500 })
  }
} 