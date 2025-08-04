import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Get content from database
const getScheduledContent = async (filter: string) => {
  try {
    // Get blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (blogError) {
      console.error('Error fetching blog posts:', blogError)
    }

    // Get beer reviews
    const { data: beerReviews, error: beerError } = await supabase
      .from('beer_reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (beerError) {
      console.error('Error fetching beer reviews:', beerError)
    }

    const allContent: any[] = []

    // Process blog posts
    if (blogPosts) {
      blogPosts.forEach(post => {
        const status = post.published_at ? 'approved' : 'pending'
        
        allContent.push({
          id: `blog_${post.id}`,
          type: 'weekly_state' as const,
          title: post.title,
          scheduledFor: post.published_at || post.created_at,
          status: status,
          content: {
            body: post.content || post.excerpt || '',
            metadata: {
              state: {
                name: post.state,
                week: post.week_number
              },
              platform: 'Blog Post',
              characterCount: (post.content || post.excerpt || '').length,
              image_url: post.featured_image_url
            }
          },
          qualityScore: 8.5, // Default quality score
          aiGenerated: true,
          lastModified: post.updated_at || post.created_at
        })
      })
    }

    // Process beer reviews
    if (beerReviews) {
      beerReviews.forEach(beer => {
        const status = beer.status === 'published' ? 'approved' : 
                     beer.status === 'scheduled' ? 'pending' : 
                     beer.status || 'pending'
        
        allContent.push({
          id: `beer_${beer.id}`,
          type: 'daily_beer' as const,
          title: `${beer.beer_name} - ${beer.state_name} Week ${beer.week_number} Day ${beer.day_of_week}`,
          scheduledFor: beer.created_at,
          status: status,
          content: {
            body: `🍺 Day ${beer.day_of_week}: ${beer.beer_name} by ${beer.brewery_name}

${beer.description || ''}

🍺 TASTING NOTES:
${beer.tasting_notes || 'Rich, flavorful beer with unique character.'}

🏭 BREWERY STORY:
${beer.brewery_story || `${beer.brewery_name} represents the best of ${beer.state_name} craft brewing.`}

Perfect for pairing with local cuisine and enjoying the ${beer.state_name} craft beer scene.

#${beer.state_name?.replace(/\s+/g, '')} #${beer.beer_name?.replace(/\s+/g, '')} #${beer.brewery_name?.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')} #CraftBeer #Week${beer.week_number} #BrewQuestChronicles`,
            metadata: {
              beer: {
                name: beer.beer_name,
                brewery: beer.brewery_name,
                style: beer.beer_style,
                abv: beer.abv
              },
              platform: 'Instagram',
              characterCount: 800, // Estimated
              image_url: beer.image_url
            }
          },
          qualityScore: beer.rating || 8.0,
          aiGenerated: true,
          lastModified: beer.updated_at || beer.created_at
        })
      })
    }

    // Filter content based on status
    let filteredContent = allContent
    if (filter !== 'all') {
      filteredContent = allContent.filter(content => content.status === filter)
    }

    // Sort by scheduled date (most recent first)
    filteredContent.sort((a, b) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime())

    return filteredContent

  } catch (error) {
    console.error('Error fetching content from database:', error)
    return []
  }
}

const getContentStats = async () => {
  try {
    const allContent = await getScheduledContent('all')
    
    const totalScheduled = allContent.length
    const pendingApproval = allContent.filter(c => c.status === 'pending').length
    const approved = allContent.filter(c => c.status === 'approved').length
    const rejected = allContent.filter(c => c.status === 'rejected').length
    
    // Calculate average quality score
    const totalQualityScore = allContent.reduce((sum, content) => sum + content.qualityScore, 0)
    const qualityScoreAvg = totalScheduled > 0 ? totalQualityScore / totalScheduled : 0
    
    return {
      totalScheduled,
      pendingApproval,
      approved,
      rejected,
      qualityScoreAvg: Math.round(qualityScoreAvg * 10) / 10 // Round to 1 decimal place
    }
  } catch (error) {
    console.error('Error calculating content stats:', error)
    return {
      totalScheduled: 0,
      pendingApproval: 0,
      approved: 0,
      rejected: 0,
      qualityScoreAvg: 0
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'

    const content = await getScheduledContent(filter)
    const stats = await getContentStats()

    return NextResponse.json({
      success: true,
      content,
      stats
    })
  } catch (error) {
    console.error('Error fetching scheduled content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scheduled content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, contentId, status, editedContent } = await request.json()

    if (action === 'approve' && contentId) {
      // Handle approval - update database
      if (contentId.startsWith('blog_')) {
        const blogId = contentId.replace('blog_', '')
        const { error } = await supabase
          .from('blog_posts')
          .update({ published_at: new Date().toISOString() })
          .eq('id', blogId)
        
        if (error) {
          console.error('Error approving blog post:', error)
          return NextResponse.json({ error: 'Failed to approve content' }, { status: 500 })
        }
      } else if (contentId.startsWith('beer_')) {
        const beerId = contentId.replace('beer_', '')
        const { error } = await supabase
          .from('beer_reviews')
          .update({ status: 'published' })
          .eq('id', beerId)
        
        if (error) {
          console.error('Error approving beer review:', error)
          return NextResponse.json({ error: 'Failed to approve content' }, { status: 500 })
        }
      }

      return NextResponse.json({ success: true, message: 'Content approved' })
    }

    if (action === 'reject' && contentId) {
      // Handle rejection - update database
      if (contentId.startsWith('blog_')) {
        const blogId = contentId.replace('blog_', '')
        const { error } = await supabase
          .from('blog_posts')
          .update({ published_at: null })
          .eq('id', blogId)
        
        if (error) {
          console.error('Error rejecting blog post:', error)
          return NextResponse.json({ error: 'Failed to reject content' }, { status: 500 })
        }
      } else if (contentId.startsWith('beer_')) {
        const beerId = contentId.replace('beer_', '')
        const { error } = await supabase
          .from('beer_reviews')
          .update({ status: 'rejected' })
          .eq('id', beerId)
        
        if (error) {
          console.error('Error rejecting beer review:', error)
          return NextResponse.json({ error: 'Failed to reject content' }, { status: 500 })
        }
      }

      return NextResponse.json({ success: true, message: 'Content rejected' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Error processing admin action:', error)
    return NextResponse.json(
      { error: 'Failed to process admin action' },
      { status: 500 }
    )
  }
}