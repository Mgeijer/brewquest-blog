import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { 
  validateBeerReview, 
  validateSocialMediaContent, 
  validateBlogPost,
  validateStateWeekContent,
  type ContentValidation,
  type BeerReviewValidation,
  type SocialMediaValidation,
  type BlogPostValidation
} from '@/lib/validation/contentValidation'

/**
 * Content Validation API Endpoint
 * 
 * POST /api/validate-content
 * 
 * Validates content for quality control before publication.
 * Supports individual content validation and bulk state week validation.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, content, options = {} } = body

    if (!type || !content) {
      return NextResponse.json({
        error: 'Missing required fields: type and content'
      }, { status: 400 })
    }

    let validationResult: any

    switch (type) {
      case 'beer_review':
        validationResult = await validateBeerReview(content)
        break

      case 'social_media':
        validationResult = await validateSocialMediaContent(content)
        break

      case 'blog_post':
        validationResult = await validateBlogPost(content)
        break

      case 'state_week':
        validationResult = await validateStateWeekContent(content)
        break

      default:
        return NextResponse.json({
          error: `Unsupported validation type: ${type}`
        }, { status: 400 })
    }

    // Log validation results if enabled
    if (options.logResults) {
      const supabase = createClient()
      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'content_validation',
          event_data: {
            validation_type: type,
            score: validationResult.score || validationResult.overallScore,
            errors_count: validationResult.errors?.length || validationResult.criticalErrors?.length || 0,
            warnings_count: validationResult.warnings?.length || 0,
            ready_for_publication: validationResult.readyForPublication || validationResult.score >= 80,
            timestamp: new Date().toISOString()
          },
          created_at: new Date().toISOString()
        })
    }

    return NextResponse.json({
      success: true,
      validation: validationResult,
      recommendations: generateRecommendations(validationResult),
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Content validation error:', error)
    return NextResponse.json({
      error: 'Content validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * GET /api/validate-content/state/{stateCode}
 * 
 * Validates all content for a specific state
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const stateCode = url.pathname.split('/').pop()

    if (!stateCode) {
      return NextResponse.json({
        error: 'State code is required'
      }, { status: 400 })
    }

    const supabase = createClient()

    // Get state information
    const { data: state, error: stateError } = await supabase
      .from('state_progress')
      .select('*')
      .eq('state_code', stateCode.toUpperCase())
      .single()

    if (stateError || !state) {
      return NextResponse.json({
        error: `State ${stateCode} not found`
      }, { status: 404 })
    }

    // Get blog post
    const { data: blogPost, error: blogError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', state.blog_post_id)
      .single()

    if (blogError) {
      console.warn(`Blog post not found for state ${stateCode}:`, blogError)
    }

    // Get beer reviews
    const { data: beerReviews, error: beersError } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('blog_post_id', state.blog_post_id)
      .order('day_of_week')

    if (beersError) {
      console.warn(`Beer reviews not found for state ${stateCode}:`, beersError)
    }

    // Get recent social media content
    const { data: socialPosts, error: socialError } = await supabase
      .from('social_posts')
      .select('*')
      .eq('state_week', state.week_number)
      .order('created_at', { ascending: false })
      .limit(20)

    if (socialError) {
      console.warn(`Social posts not found for state ${stateCode}:`, socialError)
    }

    // Organize social content by platform
    const socialContent: any = {}
    if (socialPosts) {
      socialPosts.forEach(post => {
        socialContent[post.platform] = post.content
      })
    }

    // Validate all content
    const validation = await validateStateWeekContent({
      blogPost: blogPost || undefined,
      beerReviews: beerReviews || undefined,
      socialContent: Object.keys(socialContent).length > 0 ? socialContent : undefined
    })

    // Generate detailed report
    const report = {
      state: {
        name: state.state_name,
        code: state.state_code,
        week: state.week_number,
        status: state.status
      },
      content: {
        blog_post: !!blogPost,
        beer_reviews: beerReviews?.length || 0,
        social_posts: socialPosts?.length || 0
      },
      validation,
      recommendations: generateRecommendations(validation),
      action_items: generateActionItems(validation),
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(report)

  } catch (error) {
    console.error('State validation error:', error)
    return NextResponse.json({
      error: 'State validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// ==================================================
// Helper Functions
// ==================================================

/**
 * Generates recommendations based on validation results
 */
function generateRecommendations(validation: any): string[] {
  const recommendations: string[] = []

  if (validation.score !== undefined) {
    // Single content validation
    if (validation.score < 60) {
      recommendations.push('Content quality is below acceptable standards - major revisions needed')
    } else if (validation.score < 80) {
      recommendations.push('Content quality is good but could be improved before publication')
    } else {
      recommendations.push('Content quality is excellent and ready for publication')
    }

    if (validation.errors?.length > 0) {
      recommendations.push(`Fix ${validation.errors.length} critical error${validation.errors.length > 1 ? 's' : ''} before publication`)
    }

    if (validation.warnings?.length > 0) {
      recommendations.push(`Consider addressing ${validation.warnings.length} warning${validation.warnings.length > 1 ? 's' : ''} for better quality`)
    }
  } else if (validation.overallScore !== undefined) {
    // State week validation
    if (validation.overallScore < 60) {
      recommendations.push('State content requires significant work before publication')
    } else if (validation.overallScore < 80) {
      recommendations.push('State content is good but needs refinement')
    } else {
      recommendations.push('State content meets publication standards')
    }

    if (!validation.readyForPublication) {
      recommendations.push('Content is not ready for automated publication - manual review required')
    }

    if (validation.criticalErrors?.length > 0) {
      recommendations.push(`Resolve ${validation.criticalErrors.length} critical error${validation.criticalErrors.length > 1 ? 's' : ''} across all content`)
    }
  }

  return recommendations
}

/**
 * Generates specific action items for content improvement
 */
function generateActionItems(validation: any): string[] {
  const actionItems: string[] = []

  if (validation.blogPost) {
    const bp = validation.blogPost
    if (!bp.seoFields.title) actionItems.push('Fix blog post title length (30-60 characters)')
    if (!bp.seoFields.metaDescription) actionItems.push('Add meta description (120-160 characters)')
    if (!bp.seoFields.slug) actionItems.push('Create SEO-friendly URL slug')
    if (bp.readability.wordCount < 300) actionItems.push('Expand blog post content (minimum 300 words)')
  }

  if (validation.beerReviews) {
    validation.beerReviews.forEach((review: BeerReviewValidation, index: number) => {
      if (!review.beerFields.name) actionItems.push(`Beer ${index + 1}: Add beer name`)
      if (!review.beerFields.brewery) actionItems.push(`Beer ${index + 1}: Add brewery name`)
      if (!review.beerFields.tastingNotes) actionItems.push(`Beer ${index + 1}: Add detailed tasting notes (minimum 50 characters)`)
      if (!review.beerFields.abv) actionItems.push(`Beer ${index + 1}: Add valid ABV percentage`)
    })
  }

  if (validation.socialContent) {
    const sc = validation.socialContent
    if (!sc.platformLimits.instagram) actionItems.push('Reduce Instagram caption length')
    if (!sc.platformLimits.twitter) actionItems.push('Reduce Twitter post length')
    if (!sc.platformLimits.facebook) actionItems.push('Optimize Facebook post length')
    if (!sc.platformLimits.linkedin) actionItems.push('Optimize LinkedIn post length')
    if (!sc.hashtagsValid) actionItems.push('Fix hashtag formatting (alphanumeric only, max 30 chars)')
    if (!sc.linksValid) actionItems.push('Fix broken links or update to www.hopharrison.com domain')
  }

  return actionItems
}

/**
 * Validates content before automated publication
 * Used by cron jobs to ensure quality
 */
export async function validateBeforePublication(content: any, type: string): Promise<{
  isValid: boolean
  score: number
  errors: string[]
  warnings: string[]
}> {
  let validation: ContentValidation

  switch (type) {
    case 'beer_review':
      validation = await validateBeerReview(content)
      break
    case 'social_media':
      validation = await validateSocialMediaContent(content)
      break
    case 'blog_post':
      validation = await validateBlogPost(content)
      break
    default:
      throw new Error(`Unsupported validation type: ${type}`)
  }

  return {
    isValid: validation.score >= 80 && validation.errors.length === 0,
    score: validation.score,
    errors: validation.errors,
    warnings: validation.warnings
  }
}