import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key for database operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    console.log('🔍 Verifying Alabama blog post creation...')
    
    // Get the Alabama blog post
    const { data: blogPost, error: blogError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', 'alabama-craft-beer-journey')
      .single()

    if (blogError) {
      return NextResponse.json({
        success: false,
        error: blogError.message,
        message: 'Failed to find Alabama blog post'
      }, { status: 404 })
    }

    // Get linked beer reviews
    const { data: linkedBeers, error: beersError } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('blog_post_id', blogPost.id)
      .order('day_of_week', { ascending: true })

    if (beersError) {
      console.warn('Could not fetch linked beer reviews:', beersError)
    }

    // Get all Alabama beer reviews (to see if any are unlinked)
    const { data: allAlabamaBeers, error: allBeersError } = await supabase
      .from('beer_reviews')
      .select('*')
      .ilike('unique_feature', 'AL:%')
      .order('day_of_week', { ascending: true })

    if (allBeersError) {
      console.warn('Could not fetch all Alabama beer reviews:', allBeersError)
    }

    // Calculate content statistics
    const contentLength = blogPost.content?.length || 0
    const wordCount = blogPost.content ? blogPost.content.split(/\s+/).length : 0
    const readTimeCalculated = Math.ceil(wordCount / 200) // 200 words per minute

    return NextResponse.json({
      success: true,
      message: 'Alabama blog post verification complete',
      blogPost: {
        id: blogPost.id,
        title: blogPost.title,
        slug: blogPost.slug,
        excerpt: blogPost.excerpt,
        state: blogPost.state,
        week_number: blogPost.week_number,
        published_at: blogPost.published_at,
        created_at: blogPost.created_at,
        updated_at: blogPost.updated_at,
        read_time: blogPost.read_time,
        view_count: blogPost.view_count,
        is_featured: blogPost.is_featured,
        seo_meta_description: blogPost.seo_meta_description,
        seo_keywords: blogPost.seo_keywords,
        featured_image_url: blogPost.featured_image_url
      },
      contentStats: {
        contentLength,
        wordCount,
        readTimeStored: blogPost.read_time,
        readTimeCalculated,
        hasExcerpt: !!blogPost.excerpt,
        hasMetaDescription: !!blogPost.seo_meta_description,
        hasKeywords: !!(blogPost.seo_keywords && blogPost.seo_keywords.length > 0),
        hasFeaturedImage: !!blogPost.featured_image_url
      },
      linkedBeers: {
        count: linkedBeers?.length || 0,
        beers: linkedBeers?.map(beer => ({
          id: beer.id,
          beer_name: beer.beer_name,
          brewery_name: beer.brewery_name,
          beer_style: beer.beer_style,
          rating: beer.rating,
          day_of_week: beer.day_of_week,
          blog_post_id: beer.blog_post_id
        })) || []
      },
      allAlabamaBeers: {
        count: allAlabamaBeers?.length || 0,
        unlinked: allAlabamaBeers?.filter(beer => !beer.blog_post_id).length || 0
      },
      verification: {
        hasValidSlug: blogPost.slug === 'alabama-craft-beer-journey',
        hasValidState: blogPost.state === 'Alabama',
        hasValidWeek: blogPost.week_number === 1,
        isPublished: !!blogPost.published_at,
        isFeatured: blogPost.is_featured === true,
        hasContent: contentLength > 0,
        hasLinkedBeers: (linkedBeers?.length || 0) > 0,
        allBeerLinksValid: (allAlabamaBeers?.every(beer => beer.blog_post_id === blogPost.id)) || false
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error verifying Alabama blog post:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to verify Alabama blog post'
    }, { status: 500 })
  }
}