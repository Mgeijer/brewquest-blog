/**
 * Content Validation Service
 * 
 * Comprehensive quality control system for validating beer reviews,
 * social media content, blog posts, and all automated content
 * before publication or database insertion.
 */

// ==================================================
// Type Definitions
// ==================================================

export interface ContentValidation {
  hasRequiredFields: boolean
  linksValid: boolean
  imagesAccessible: boolean
  characterLimitsOK: boolean
  hashtagsValid: boolean
  seoOptimized: boolean
  errors: string[]
  warnings: string[]
  score: number // 0-100 quality score
}

export interface BeerReviewValidation extends ContentValidation {
  beerFields: {
    name: boolean
    brewery: boolean
    style: boolean
    abv: boolean
    tastingNotes: boolean
    rating: boolean
  }
  breweryFields: {
    name: boolean
    location: boolean
    story: boolean
    founded: boolean
  }
}

export interface SocialMediaValidation extends ContentValidation {
  platformLimits: {
    instagram: boolean
    twitter: boolean
    facebook: boolean
    linkedin: boolean
  }
  hashtagCount: number
  mentionCount: number
  linkCount: number
}

export interface BlogPostValidation extends ContentValidation {
  seoFields: {
    title: boolean
    metaDescription: boolean
    slug: boolean
    headings: boolean
    imageAlt: boolean
  }
  readability: {
    wordCount: number
    readingTime: number
    paragraphCount: number
    averageSentenceLength: number
  }
}

// ==================================================
// Platform Limits and Requirements
// ==================================================

export const PLATFORM_LIMITS = {
  instagram: {
    caption: 2200,
    hashtags: 30,
    mentions: 20
  },
  twitter: {
    text: 280,
    hashtags: 2, // recommended max
    mentions: 10
  },
  facebook: {
    post: 63206, // technical limit
    recommended: 500, // engagement optimized
    hashtags: 5 // recommended max
  },
  linkedin: {
    post: 3000,
    hashtags: 5,
    mentions: 10
  }
} as const

export const REQUIRED_BEER_FIELDS = [
  'beer_name',
  'brewery_name',
  'beer_style',
  'abv',
  'tasting_notes'
] as const

export const REQUIRED_BREWERY_FIELDS = [
  'brewery_name',
  'location',
  'brewery_story',
  'founded_year'
] as const

export const SEO_REQUIREMENTS = {
  title: { min: 30, max: 60 },
  metaDescription: { min: 120, max: 160 },
  slug: { max: 75 },
  imageAlt: { max: 125 },
  headings: { h1: 1, h2: { min: 2, max: 6 } }
} as const

// ==================================================
// Core Validation Functions
// ==================================================

/**
 * Validates a beer review for completeness and quality
 */
export async function validateBeerReview(review: any): Promise<BeerReviewValidation> {
  const validation: BeerReviewValidation = {
    hasRequiredFields: false,
    linksValid: false,
    imagesAccessible: false,
    characterLimitsOK: false,
    hashtagsValid: false,
    seoOptimized: false,
    errors: [],
    warnings: [],
    score: 0,
    beerFields: {
      name: false,
      brewery: false,
      style: false,
      abv: false,
      tastingNotes: false,
      rating: false
    },
    breweryFields: {
      name: false,
      location: false,
      story: false,
      founded: false
    }
  }

  // Validate required beer fields
  validation.beerFields.name = !!(review.beer_name && review.beer_name.trim().length > 0)
  validation.beerFields.brewery = !!(review.brewery_name && review.brewery_name.trim().length > 0)
  validation.beerFields.style = !!(review.beer_style && review.beer_style.trim().length > 0)
  validation.beerFields.abv = !!(review.abv && parseFloat(review.abv) > 0 && parseFloat(review.abv) < 20)
  validation.beerFields.tastingNotes = !!(review.tasting_notes && review.tasting_notes.trim().length >= 50)
  validation.beerFields.rating = !!(review.rating && review.rating >= 1 && review.rating <= 5)

  // Check for missing required fields
  const missingBeerFields = Object.entries(validation.beerFields)
    .filter(([_, valid]) => !valid)
    .map(([field, _]) => field)

  if (missingBeerFields.length > 0) {
    validation.errors.push(`Missing required beer fields: ${missingBeerFields.join(', ')}`)
  } else {
    validation.hasRequiredFields = true
  }

  // Validate brewery fields if provided
  if (review.brewery_story) {
    validation.breweryFields.story = review.brewery_story.trim().length >= 100
    if (!validation.breweryFields.story) {
      validation.warnings.push('Brewery story should be at least 100 characters for better engagement')
    }
  }

  if (review.brewery_location) {
    validation.breweryFields.location = review.brewery_location.trim().length > 0
  }

  if (review.founded_year) {
    const currentYear = new Date().getFullYear()
    const foundedYear = parseInt(review.founded_year)
    validation.breweryFields.founded = foundedYear > 1800 && foundedYear <= currentYear
    if (!validation.breweryFields.founded) {
      validation.errors.push(`Invalid founded year: ${review.founded_year}`)
    }
  }

  // Validate links
  if (review.brewery_website || review.untappd_url || review.beer_image_url) {
    validation.linksValid = await validateLinks([
      review.brewery_website,
      review.untappd_url,
      review.beer_image_url
    ].filter(Boolean))
  } else {
    validation.linksValid = true // No links to validate
  }

  // Validate images
  if (review.beer_image_url) {
    validation.imagesAccessible = await validateImageUrl(review.beer_image_url)
  } else {
    validation.warnings.push('No beer image provided - consider adding for better engagement')
    validation.imagesAccessible = true // Not required
  }

  // Calculate quality score
  validation.score = calculateQualityScore(validation)

  return validation
}

/**
 * Validates social media content for all platforms
 */
export async function validateSocialMediaContent(content: any): Promise<SocialMediaValidation> {
  const validation: SocialMediaValidation = {
    hasRequiredFields: false,
    linksValid: false,
    imagesAccessible: false,
    characterLimitsOK: false,
    hashtagsValid: false,
    seoOptimized: false,
    errors: [],
    warnings: [],
    score: 0,
    platformLimits: {
      instagram: false,
      twitter: false,
      facebook: false,
      linkedin: false
    },
    hashtagCount: 0,
    mentionCount: 0,
    linkCount: 0
  }

  // Validate each platform's content
  const platforms = ['instagram', 'twitter', 'facebook', 'linkedin'] as const

  for (const platform of platforms) {
    if (content[platform]) {
      const platformContent = content[platform]
      const limits = PLATFORM_LIMITS[platform]

      // Check character limits
      const contentLength = platformContent.length
      const withinLimit = contentLength <= limits.caption || limits.post || limits.text
      
      validation.platformLimits[platform] = withinLimit

      if (!withinLimit) {
        validation.errors.push(
          `${platform} content exceeds character limit: ${contentLength}/${limits.caption || limits.post || limits.text}`
        )
      }

      // Count hashtags
      const hashtags = (platformContent.match(/#\w+/g) || []).length
      validation.hashtagCount = Math.max(validation.hashtagCount, hashtags)

      if (hashtags > limits.hashtags) {
        validation.warnings.push(
          `${platform} has ${hashtags} hashtags, recommended max is ${limits.hashtags}`
        )
      }

      // Count mentions
      const mentions = (platformContent.match(/@\w+/g) || []).length
      validation.mentionCount = Math.max(validation.mentionCount, mentions)

      // Count links
      const links = (platformContent.match(/https?:\/\/\S+/g) || []).length
      validation.linkCount = Math.max(validation.linkCount, links)
    } else {
      validation.warnings.push(`Missing ${platform} content`)
    }
  }

  // Overall character limits check
  validation.characterLimitsOK = Object.values(validation.platformLimits).every(valid => valid)

  // Validate hashtags format
  validation.hashtagsValid = validateHashtagFormat(content)

  // Validate links in content
  const allContent = platforms
    .map(p => content[p])
    .filter(Boolean)
    .join(' ')
  
  const links = extractLinksFromText(allContent)
  if (links.length > 0) {
    validation.linksValid = await validateLinks(links)
  } else {
    validation.linksValid = true
  }

  // Calculate score
  validation.score = calculateQualityScore(validation)

  return validation
}

/**
 * Validates a blog post for SEO and readability
 */
export async function validateBlogPost(post: any): Promise<BlogPostValidation> {
  const validation: BlogPostValidation = {
    hasRequiredFields: false,
    linksValid: false,
    imagesAccessible: false,
    characterLimitsOK: false,
    hashtagsValid: false,
    seoOptimized: false,
    errors: [],
    warnings: [],
    score: 0,
    seoFields: {
      title: false,
      metaDescription: false,
      slug: false,
      headings: false,
      imageAlt: false
    },
    readability: {
      wordCount: 0,
      readingTime: 0,
      paragraphCount: 0,
      averageSentenceLength: 0
    }
  }

  // Validate SEO fields
  if (post.title) {
    const titleLength = post.title.length
    validation.seoFields.title = titleLength >= SEO_REQUIREMENTS.title.min && 
                                titleLength <= SEO_REQUIREMENTS.title.max
    if (!validation.seoFields.title) {
      validation.errors.push(
        `Title length ${titleLength} should be between ${SEO_REQUIREMENTS.title.min}-${SEO_REQUIREMENTS.title.max} characters`
      )
    }
  } else {
    validation.errors.push('Missing required title')
  }

  if (post.meta_description) {
    const metaLength = post.meta_description.length
    validation.seoFields.metaDescription = metaLength >= SEO_REQUIREMENTS.metaDescription.min && 
                                         metaLength <= SEO_REQUIREMENTS.metaDescription.max
    if (!validation.seoFields.metaDescription) {
      validation.errors.push(
        `Meta description length ${metaLength} should be between ${SEO_REQUIREMENTS.metaDescription.min}-${SEO_REQUIREMENTS.metaDescription.max} characters`
      )
    }
  } else {
    validation.warnings.push('Missing meta description - important for SEO')
  }

  if (post.slug) {
    validation.seoFields.slug = post.slug.length <= SEO_REQUIREMENTS.slug.max &&
                              /^[a-z0-9-]+$/.test(post.slug)
    if (!validation.seoFields.slug) {
      validation.errors.push('Slug should be lowercase, alphanumeric with hyphens only, max 75 chars')
    }
  } else {
    validation.errors.push('Missing required slug')
  }

  // Analyze content readability
  if (post.content) {
    validation.readability = analyzeReadability(post.content)
    
    if (validation.readability.wordCount < 300) {
      validation.warnings.push('Content is quite short - consider adding more detail for better SEO')
    }
    
    if (validation.readability.averageSentenceLength > 25) {
      validation.warnings.push('Average sentence length is high - consider shorter sentences for readability')
    }
  }

  // Validate links
  if (post.content) {
    const links = extractLinksFromText(post.content)
    if (links.length > 0) {
      validation.linksValid = await validateLinks(links)
    } else {
      validation.linksValid = true
    }
  }

  // Calculate overall SEO optimization
  validation.seoOptimized = Object.values(validation.seoFields).filter(Boolean).length >= 3

  // Calculate score
  validation.score = calculateQualityScore(validation)

  return validation
}

// ==================================================
// Helper Functions
// ==================================================

/**
 * Validates that links are accessible and use correct domain
 */
async function validateLinks(links: string[]): Promise<boolean> {
  if (!links || links.length === 0) return true

  const validations = await Promise.allSettled(
    links.map(async (link) => {
      try {
        // Check if internal links use correct domain
        if (link.includes('hopharrison.com') && !link.includes('www.hopharrison.com')) {
          throw new Error(`Link should use www.hopharrison.com domain: ${link}`)
        }

        // For external links, do a simple HEAD request check
        if (link.startsWith('http')) {
          const response = await fetch(link, { method: 'HEAD', timeout: 5000 })
          return response.ok
        }

        return true
      } catch (error) {
        console.error(`Link validation failed for ${link}:`, error)
        return false
      }
    })
  )

  return validations.every(result => 
    result.status === 'fulfilled' && result.value === true
  )
}

/**
 * Validates that an image URL is accessible
 */
async function validateImageUrl(imageUrl: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD', timeout: 5000 })
    return response.ok && response.headers.get('content-type')?.startsWith('image/')
  } catch (error) {
    console.error(`Image validation failed for ${imageUrl}:`, error)
    return false
  }
}

/**
 * Validates hashtag formatting across platforms
 */
function validateHashtagFormat(content: any): boolean {
  const platforms = ['instagram', 'twitter', 'facebook', 'linkedin']
  
  for (const platform of platforms) {
    if (content[platform]) {
      const hashtags = content[platform].match(/#\w+/g) || []
      
      for (const hashtag of hashtags) {
        // Check for proper format: #Word or #WordWord (no spaces, special chars)
        if (!/^#[A-Za-z][A-Za-z0-9]*$/.test(hashtag)) {
          return false
        }
        
        // Check for reasonable length
        if (hashtag.length > 30) {
          return false
        }
      }
    }
  }
  
  return true
}

/**
 * Extracts all links from text content
 */
function extractLinksFromText(text: string): string[] {
  const linkRegex = /https?:\/\/\S+/g
  return text.match(linkRegex) || []
}

/**
 * Analyzes text readability metrics
 */
function analyzeReadability(content: string): BlogPostValidation['readability'] {
  const words = content.split(/\s+/).filter(word => word.length > 0)
  const sentences = content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0)
  const paragraphs = content.split(/\n\s*\n/).filter(para => para.trim().length > 0)

  return {
    wordCount: words.length,
    readingTime: Math.ceil(words.length / 200), // Average reading speed
    paragraphCount: paragraphs.length,
    averageSentenceLength: words.length / Math.max(sentences.length, 1)
  }
}

/**
 * Calculates overall quality score (0-100)
 */
function calculateQualityScore(validation: ContentValidation): number {
  let score = 0
  let maxScore = 0

  // Required fields (40 points)
  maxScore += 40
  if (validation.hasRequiredFields) score += 40

  // Links valid (20 points)
  maxScore += 20
  if (validation.linksValid) score += 20

  // Character limits (15 points)
  maxScore += 15
  if (validation.characterLimitsOK) score += 15

  // Hashtags valid (10 points)
  maxScore += 10
  if (validation.hashtagsValid) score += 10

  // Images accessible (10 points)
  maxScore += 10
  if (validation.imagesAccessible) score += 10

  // SEO optimized (5 points)
  maxScore += 5
  if (validation.seoOptimized) score += 5

  // Deduct points for errors
  score -= validation.errors.length * 5

  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, Math.round((score / maxScore) * 100)))
}

// ==================================================
// Bulk Validation Functions
// ==================================================

/**
 * Validates all content for a state week
 */
export async function validateStateWeekContent(stateData: {
  blogPost?: any
  beerReviews?: any[]
  socialContent?: any
}): Promise<{
  blogPost?: BlogPostValidation
  beerReviews?: BeerReviewValidation[]
  socialContent?: SocialMediaValidation
  overallScore: number
  readyForPublication: boolean
  criticalErrors: string[]
}> {
  const results: any = {
    overallScore: 0,
    readyForPublication: false,
    criticalErrors: []
  }

  const scores: number[] = []

  // Validate blog post
  if (stateData.blogPost) {
    results.blogPost = await validateBlogPost(stateData.blogPost)
    scores.push(results.blogPost.score)
    results.criticalErrors.push(...results.blogPost.errors)
  }

  // Validate beer reviews
  if (stateData.beerReviews) {
    results.beerReviews = []
    for (const review of stateData.beerReviews) {
      const validation = await validateBeerReview(review)
      results.beerReviews.push(validation)
      scores.push(validation.score)
      results.criticalErrors.push(...validation.errors)
    }
  }

  // Validate social content
  if (stateData.socialContent) {
    results.socialContent = await validateSocialMediaContent(stateData.socialContent)
    scores.push(results.socialContent.score)
    results.criticalErrors.push(...results.socialContent.errors)
  }

  // Calculate overall score
  results.overallScore = scores.length > 0 
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0

  // Determine if ready for publication (score >= 80 and no critical errors)
  results.readyForPublication = results.overallScore >= 80 && results.criticalErrors.length === 0

  return results
}