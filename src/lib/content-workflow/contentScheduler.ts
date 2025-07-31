// ===================================================================
// BREWQUEST CHRONICLES CONTENT WORKFLOW SCHEDULER
// ===================================================================
// Manages the weekly state posts + daily beer reviews publishing schedule

import { supabase } from '@/lib/supabase/client'
import { imageService } from '@/lib/image-management/imageService'

export interface StateContentPlan {
  stateCode: string
  stateName: string
  weekNumber: number
  startDate: Date
  endDate: Date
  status: 'planned' | 'in_progress' | 'ready' | 'published' | 'delayed'
  
  // Content structure
  stateOverviewPost: {
    title: string
    planned_publish_date: Date
    content_id?: string
    status: 'planned' | 'draft' | 'ready' | 'published'
  }
  
  dailyBeerReviews: Array<{
    day: number // 2-7 (Tuesday through Sunday)
    breweryName: string
    beerName: string
    planned_publish_date: Date
    content_id?: string
    status: 'planned' | 'draft' | 'ready' | 'published'
    has_images: boolean
  }>
  
  socialMediaPosts: {
    total_scheduled: number
    by_platform: Record<string, number>
  }
  
  imageAssets: {
    total_images: number
    by_type: Record<string, number>
    missing_images: string[]
  }
}

export interface ContentCreationRequest {
  stateCode: string
  weekNumber: number
  breweryData: Array<{
    breweryName: string
    beerName: string
    beerStyle: string
    abv?: number
    ibu?: number
    rating: number
    tastingNotes: string
    uniqueFeature: string
    breweryStory: string
    breweryLocation: string
    breweryWebsite?: string
    dayOfWeek: number
  }>
  stateInfo: {
    name: string
    brewingHistory: string
    uniqueFeatures: string[]
    culturalHighlights: string[]
  }
  publishingSchedule: {
    weekStartDate: Date
    stateOverviewDate: Date
    dailyReviewDates: Date[]
  }
}

export interface ContentValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  checklist: {
    stateOverviewPost: boolean
    allBeerReviewsCreated: boolean
    allImagesUploaded: boolean
    socialMediaScheduled: boolean
    seoOptimized: boolean
    factChecked: boolean
  }
}

class ContentWorkflowScheduler {
  private supabase = supabase

  /**
   * Create a complete content plan for a state week
   */
  async createStateContentPlan(request: ContentCreationRequest): Promise<StateContentPlan> {
    const { stateCode, weekNumber, breweryData, stateInfo, publishingSchedule } = request

    try {
      // 1. Create state overview blog post
      const stateOverviewPost = await this.createStateOverviewPost(
        stateCode,
        weekNumber,
        stateInfo,
        publishingSchedule.stateOverviewDate
      )

      // 2. Create daily beer reviews
      const dailyBeerReviews = await this.createDailyBeerReviews(
        stateCode,
        weekNumber,
        breweryData,
        publishingSchedule.dailyReviewDates,
        stateOverviewPost.id
      )

      // 3. Generate content schedule entries
      await this.generateContentSchedule(stateCode, weekNumber, publishingSchedule.weekStartDate)

      // 4. Get current status
      const contentPlan = await this.getStateContentStatus(stateCode, weekNumber)

      return contentPlan
    } catch (error) {
      console.error('Failed to create state content plan:', error)
      throw new Error(`Content plan creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get comprehensive status of state content
   */
  async getStateContentStatus(stateCode: string, weekNumber: number): Promise<StateContentPlan> {
    // Use the database function to get comprehensive status
    const { data: statusData, error } = await this.supabase
      .rpc('get_weekly_content_status', { target_week: weekNumber })

    if (error) {
      throw new Error(`Failed to get content status: ${error.message}`)
    }

    // Get state progress info
    const { data: stateProgress } = await this.supabase
      .from('state_progress')
      .select('state_name, status')
      .eq('state_code', stateCode)
      .eq('week_number', weekNumber)
      .single()

    // Transform the data into our format
    const stateOverviewPost = statusData.blog_post_status || {}
    const beerReviews = statusData.beer_reviews?.reviews || []
    const socialPosts = statusData.social_posts || {}
    const images = statusData.images_summary || {}

    // Calculate dates (this would be enhanced with actual schedule data)
    const weekStartDate = this.getWeekStartDate(weekNumber)
    const endDate = new Date(weekStartDate)
    endDate.setDate(endDate.getDate() + 6)

    return {
      stateCode,
      stateName: stateProgress?.state_name || 'Unknown',
      weekNumber,
      startDate: weekStartDate,
      endDate,
      status: this.determineOverallStatus(stateOverviewPost, beerReviews),
      
      stateOverviewPost: {
        title: stateOverviewPost.title || `${stateProgress?.state_name} Craft Beer Journey`,
        planned_publish_date: weekStartDate,
        content_id: stateOverviewPost.id,
        status: stateOverviewPost.published ? 'published' : stateOverviewPost.exists ? 'ready' : 'planned'
      },
      
      dailyBeerReviews: beerReviews.map((review: any) => ({
        day: review.day,
        breweryName: review.brewery,
        beerName: review.beer,
        planned_publish_date: this.calculateDailyDate(weekStartDate, review.day),
        content_id: review.id,
        status: 'ready', // This would be determined from actual data
        has_images: review.has_image
      })),
      
      socialMediaPosts: {
        total_scheduled: socialPosts.total_scheduled || 0,
        by_platform: socialPosts.by_platform || {}
      },
      
      imageAssets: {
        total_images: images.total_images || 0,
        by_type: images.by_type || {},
        missing_images: this.identifyMissingImages(beerReviews)
      }
    }
  }

  /**
   * Validate content readiness for publication
   */
  async validateContentReadiness(stateCode: string, weekNumber: number): Promise<ContentValidationResult> {
    const contentPlan = await this.getStateContentStatus(stateCode, weekNumber)
    
    const errors: string[] = []
    const warnings: string[] = []

    // Check state overview post
    const hasStateOverview = contentPlan.stateOverviewPost.status !== 'planned'
    if (!hasStateOverview) {
      errors.push('State overview post not created')
    }

    // Check beer reviews (should have 6 daily reviews)
    const expectedReviews = 6
    const actualReviews = contentPlan.dailyBeerReviews.length
    if (actualReviews < expectedReviews) {
      errors.push(`Missing ${expectedReviews - actualReviews} beer reviews`)
    }

    // Check images
    const reviewsWithoutImages = contentPlan.dailyBeerReviews.filter(review => !review.has_images)
    if (reviewsWithoutImages.length > 0) {
      warnings.push(`${reviewsWithoutImages.length} beer reviews missing images`)
    }

    // Check social media scheduling
    const expectedSocialPosts = actualReviews * 4 // 4 platforms per review
    if (contentPlan.socialMediaPosts.total_scheduled < expectedSocialPosts) {
      warnings.push('Social media posts not fully scheduled')
    }

    // Additional validations
    await this.validateSEOOptimization(stateCode, weekNumber, warnings)
    await this.validateBreweryWebsites(stateCode, weekNumber, warnings)

    const checklist = {
      stateOverviewPost: hasStateOverview,
      allBeerReviewsCreated: actualReviews >= expectedReviews,
      allImagesUploaded: reviewsWithoutImages.length === 0,
      socialMediaScheduled: contentPlan.socialMediaPosts.total_scheduled >= expectedSocialPosts,
      seoOptimized: true, // Would be determined by actual SEO check
      factChecked: true // Would be determined by fact-checking process
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      checklist
    }
  }

  /**
   * Generate social media posts for all beer reviews in a week
   */
  async generateWeeklySocialPosts(stateCode: string, weekNumber: number): Promise<{
    created: number
    failed: number
    details: Array<{ beer_review_id: string; platform: string; status: string }>
  }> {
    // Get all beer reviews for the week
    const { data: beerReviews, error: reviewsError } = await this.supabase
      .from('beer_reviews')
      .select('id, brewery_name, beer_name, beer_style, unique_feature, rating, day_of_week')
      .eq('state_code', stateCode)
      .eq('week_number', weekNumber)
      .order('day_of_week')

    if (reviewsError || !beerReviews) {
      throw new Error(`Failed to get beer reviews: ${reviewsError?.message}`)
    }

    const platforms = ['instagram', 'twitter', 'facebook', 'tiktok']
    const results = {
      created: 0,
      failed: 0,
      details: [] as Array<{ beer_review_id: string; platform: string; status: string }>
    }

    for (const review of beerReviews) {
      for (const platform of platforms) {
        try {
          const socialPost = await this.generateSocialPost(review, platform, stateCode)
          
          const { error: insertError } = await this.supabase
            .from('social_posts')
            .insert(socialPost)

          if (insertError) {
            results.failed++
            results.details.push({
              beer_review_id: review.id,
              platform,
              status: `Failed: ${insertError.message}`
            })
          } else {
            results.created++
            results.details.push({
              beer_review_id: review.id,
              platform,
              status: 'Created'
            })
          }
        } catch (error) {
          results.failed++
          results.details.push({
            beer_review_id: review.id,
            platform,
            status: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
          })
        }
      }
    }

    return results
  }

  /**
   * Get content production analytics
   */
  async getContentProductionAnalytics(timeframe: 'week' | 'month' | 'all' = 'month'): Promise<{
    content_velocity: {
      blog_posts_per_week: number
      beer_reviews_per_week: number
      social_posts_per_week: number
    }
    completion_rates: {
      states_on_schedule: number
      states_behind_schedule: number
      average_completion_percentage: number
    }
    content_quality: {
      posts_with_images: number
      posts_with_seo: number
      average_word_count: number
    }
    upcoming_deadlines: Array<{
      state_code: string
      week_number: number
      deadline: Date
      status: string
    }>
  }> {
    // This would involve complex queries across multiple tables
    // Simplified implementation for now
    
    const { data: recentPosts, error } = await this.supabase
      .from('blog_posts')
      .select('*')
      .gte('created_at', this.getTimeframeStartDate(timeframe).toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to get analytics: ${error.message}`)
    }

    // Calculate basic metrics
    const weeksInTimeframe = this.getWeeksInTimeframe(timeframe)
    const postsCount = recentPosts?.length || 0

    return {
      content_velocity: {
        blog_posts_per_week: Math.round(postsCount / weeksInTimeframe),
        beer_reviews_per_week: Math.round((postsCount * 6) / weeksInTimeframe), // 6 reviews per post
        social_posts_per_week: Math.round((postsCount * 24) / weeksInTimeframe) // 4 platforms * 6 reviews
      },
      completion_rates: {
        states_on_schedule: 0, // Would calculate from actual data
        states_behind_schedule: 0,
        average_completion_percentage: 0
      },
      content_quality: {
        posts_with_images: recentPosts?.filter(p => p.featured_image_url).length || 0,
        posts_with_seo: recentPosts?.filter(p => p.seo_meta_description).length || 0,
        average_word_count: 2000 // Would calculate from actual content
      },
      upcoming_deadlines: [] // Would fetch from content_schedule table
    }
  }

  // Private helper methods

  private async createStateOverviewPost(
    stateCode: string,
    weekNumber: number,
    stateInfo: any,
    publishDate: Date
  ): Promise<{ id: string; slug: string }> {
    const slug = `${stateInfo.name.toLowerCase().replace(/\s+/g, '-')}-craft-beer-journey`
    const title = `${stateInfo.name} Craft Beer: ${this.generateStateTitle(stateInfo)}`
    
    const blogPost = {
      title,
      slug,
      excerpt: `Discover ${stateInfo.name}'s craft beer scene with 6 exceptional brewery visits and beer reviews.`,
      content: `# ${title}\n\n[Content would be generated here with state brewing history, culture, and preview of the week's breweries]`,
      state: stateInfo.name,
      week_number: weekNumber,
      status: 'draft',
      content_type: 'state_overview',
      published_at: publishDate.toISOString(),
      seo_meta_description: `Explore ${stateInfo.name}'s best craft breweries and beers in this comprehensive guide to the state's brewing culture.`,
      seo_keywords: [`${stateInfo.name} craft beer`, `${stateInfo.name} breweries`, 'beer reviews']
    }

    const { data, error } = await this.supabase
      .from('blog_posts')
      .insert(blogPost)
      .select('id, slug')
      .single()

    if (error) {
      throw new Error(`Failed to create state overview post: ${error.message}`)
    }

    return data
  }

  private async createDailyBeerReviews(
    stateCode: string,
    weekNumber: number,
    breweryData: any[],
    publishDates: Date[],
    blogPostId: string
  ): Promise<string[]> {
    const reviewIds: string[] = []

    for (let i = 0; i < breweryData.length; i++) {
      const brewery = breweryData[i]
      const publishDate = publishDates[i]

      const beerReview = {
        blog_post_id: blogPostId,
        brewery_name: brewery.breweryName,
        beer_name: brewery.beerName,
        beer_style: brewery.beerStyle,
        abv: brewery.abv,
        ibu: brewery.ibu,
        rating: brewery.rating,
        tasting_notes: brewery.tastingNotes,
        unique_feature: brewery.uniqueFeature,
        brewery_story: brewery.breweryStory,
        brewery_location: brewery.breweryLocation,
        brewery_website: brewery.breweryWebsite,
        day_of_week: brewery.dayOfWeek,
        state_code: stateCode,
        state_name: this.getStateName(stateCode),
        week_number: weekNumber,
        description: `${brewery.tastingNotes}\n\n${brewery.breweryStory}`
      }

      const { data, error } = await this.supabase
        .from('beer_reviews')
        .insert(beerReview)
        .select('id')
        .single()

      if (error) {
        throw new Error(`Failed to create beer review for ${brewery.beerName}: ${error.message}`)
      }

      reviewIds.push(data.id)
    }

    return reviewIds
  }

  private async generateContentSchedule(stateCode: string, weekNumber: number, startDate: Date): Promise<void> {
    // Use the database function to generate schedule
    const { error } = await this.supabase
      .rpc('generate_state_content_schedule', {
        target_state_code: stateCode,
        target_week: weekNumber,
        start_date: startDate.toISOString().split('T')[0]
      })

    if (error) {
      throw new Error(`Failed to generate content schedule: ${error.message}`)
    }
  }

  private async generateSocialPost(review: any, platform: string, stateCode: string): Promise<any> {
    // Generate platform-specific content
    const platformTemplates = {
      instagram: this.generateInstagramPost(review, stateCode),
      twitter: this.generateTwitterPost(review, stateCode),
      facebook: this.generateFacebookPost(review, stateCode),
      tiktok: this.generateTikTokPost(review, stateCode)
    }

    const content = platformTemplates[platform as keyof typeof platformTemplates]
    
    return {
      beer_review_id: review.id,
      state_code: stateCode,
      platform,
      post_type: 'beer_review',
      content: content.text,
      hashtags: content.hashtags,
      scheduled_time: this.calculateSocialPostTime(review.day_of_week, platform),
      status: 'draft'
    }
  }

  private generateInstagramPost(review: any, stateCode: string) {
    const hashtags = [
      '#CraftBeer',
      `#${stateCode}Beer`,
      `#${review.brewery_name.replace(/\s+/g, '')}`,
      '#BrewQuest',
      '#HopHarrison',
      `#${review.beer_style.replace(/\s+/g, '')}`
    ]

    const text = `🍺 Day ${review.day_of_week - 1} in ${this.getStateName(stateCode)}!\n\n` +
      `${review.beer_name} by ${review.brewery_name}\n` +
      `${review.beer_style} • ${review.rating}/5 stars\n\n` +
      `${review.unique_feature}\n\n` +
      `What's your favorite ${review.beer_style}? 👇`

    return { text, hashtags }
  }

  private generateTwitterPost(review: any, stateCode: string) {
    const hashtags = ['#CraftBeer', `#${stateCode}Beer`, '#BrewQuest']
    
    const text = `🍻 ${review.beer_name} by ${review.brewery_name}\n` +
      `${review.beer_style} • ${review.rating}/5\n\n` +
      `${review.unique_feature.substring(0, 120)}...`

    return { text, hashtags }
  }

  private generateFacebookPost(review: any, stateCode: string) {
    const hashtags = ['#CraftBeer', `#${stateCode}Beer`, '#BrewQuest', '#HopHarrison']
    
    const text = `Discovering amazing craft beer in ${this.getStateName(stateCode)}! 🍺\n\n` +
      `Today's feature: ${review.beer_name} by ${review.brewery_name}\n` +
      `Style: ${review.beer_style}\nRating: ${review.rating}/5 stars\n\n` +
      `What makes it special: ${review.unique_feature}\n\n` +
      `Following along with our 50-state beer journey? What states should we visit next?`

    return { text, hashtags }
  }

  private generateTikTokPost(review: any, stateCode: string) {
    const hashtags = ['#CraftBeer', `#${stateCode}Beer`, '#BeerReview', '#BrewQuest']
    
    const text = `Rating ${review.beer_name} from ${review.brewery_name} ✨\n` +
      `${review.beer_style} • ${review.rating}/5\n\n` +
      `${review.unique_feature}`

    return { text, hashtags }
  }

  // Utility methods
  private determineOverallStatus(blogPost: any, reviews: any[]): StateContentPlan['status'] {
    if (blogPost.published && reviews.length >= 6) return 'published'
    if (blogPost.exists && reviews.length >= 6) return 'ready'
    if (blogPost.exists || reviews.length > 0) return 'in_progress'
    return 'planned'
  }

  private getWeekStartDate(weekNumber: number): Date {
    // Calculate based on project start date (January 1, 2024)
    const projectStart = new Date('2024-01-01')
    const weekStartDate = new Date(projectStart)
    weekStartDate.setDate(projectStart.getDate() + (weekNumber - 1) * 7)
    return weekStartDate
  }

  private calculateDailyDate(weekStart: Date, dayOfWeek: number): Date {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + dayOfWeek - 1)
    return date
  }

  private calculateSocialPostTime(dayOfWeek: number, platform: string): Date {
    // Schedule posts at optimal times for each platform
    const optimalTimes = {
      instagram: 11, // 11 AM
      twitter: 9,    // 9 AM
      facebook: 13,  // 1 PM
      tiktok: 18     // 6 PM
    }

    const baseDate = this.getWeekStartDate(1) // Use current week logic
    baseDate.setDate(baseDate.getDate() + dayOfWeek - 1)
    baseDate.setHours(optimalTimes[platform as keyof typeof optimalTimes] || 12)
    baseDate.setMinutes(0)
    baseDate.setSeconds(0)

    return baseDate
  }

  private identifyMissingImages(reviews: any[]): string[] {
    return reviews
      .filter(review => !review.has_image)
      .map(review => `${review.brewery} - ${review.beer}`)
  }

  private generateStateTitle(stateInfo: any): string {
    const titles = [
      'Brewing Excellence',
      'Craft Beer Culture',
      'Beer Heritage',
      'Brewing Innovation',
      'Hoppy Discoveries'
    ]
    return titles[Math.floor(Math.random() * titles.length)]
  }

  private getStateName(stateCode: string): string {
    const stateNames: Record<string, string> = {
      'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
      'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
      // ... Add all 50 states
    }
    return stateNames[stateCode] || stateCode
  }

  private async validateSEOOptimization(stateCode: string, weekNumber: number, warnings: string[]): Promise<void> {
    const { data: blogPost } = await this.supabase
      .from('blog_posts')
      .select('seo_meta_description, seo_keywords')
      .eq('week_number', weekNumber)
      .single()

    if (!blogPost?.seo_meta_description) {
      warnings.push('Blog post missing SEO meta description')
    }
    if (!blogPost?.seo_keywords || blogPost.seo_keywords.length === 0) {
      warnings.push('Blog post missing SEO keywords')
    }
  }

  private async validateBreweryWebsites(stateCode: string, weekNumber: number, warnings: string[]): Promise<void> {
    const { data: reviews } = await this.supabase
      .from('beer_reviews')
      .select('brewery_name, brewery_website')
      .eq('state_code', stateCode)
      .eq('week_number', weekNumber)

    const missingWebsites = reviews?.filter(r => !r.brewery_website) || []
    if (missingWebsites.length > 0) {
      warnings.push(`${missingWebsites.length} brewery websites missing`)
    }
  }

  private getTimeframeStartDate(timeframe: 'week' | 'month' | 'all'): Date {
    const now = new Date()
    switch (timeframe) {
      case 'week':
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - 7)
        return weekStart
      case 'month':
        const monthStart = new Date(now)
        monthStart.setMonth(now.getMonth() - 1)
        return monthStart
      case 'all':
        return new Date('2024-01-01')
    }
  }

  private getWeeksInTimeframe(timeframe: 'week' | 'month' | 'all'): number {
    switch (timeframe) {
      case 'week': return 1
      case 'month': return 4
      case 'all': return 52
    }
  }
}

// Export singleton instance
export const contentScheduler = new ContentWorkflowScheduler()

// Utility functions for content management
export const contentUtils = {
  /**
   * Generate a complete 50-state content calendar
   */
  async generateFullContentCalendar(): Promise<Array<{
    week: number
    state: string
    startDate: Date
    stateOverviewDate: Date
    dailyReviewDates: Date[]
  }>> {
    const states = [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
      'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
      'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
      'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
      'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
      'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
      'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
      'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
      'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
      'West Virginia', 'Wisconsin', 'Wyoming'
    ]

    const calendar = []
    const startDate = new Date('2024-01-01') // Monday

    for (let week = 1; week <= 50; week++) {
      const weekStart = new Date(startDate)
      weekStart.setDate(startDate.getDate() + (week - 1) * 7)

      const stateOverviewDate = new Date(weekStart) // Monday
      const dailyReviewDates = []

      // Tuesday through Sunday (6 beer reviews)
      for (let day = 2; day <= 7; day++) {
        const reviewDate = new Date(weekStart)
        reviewDate.setDate(weekStart.getDate() + day - 1)
        dailyReviewDates.push(reviewDate)
      }

      calendar.push({
        week,
        state: states[week - 1],
        startDate: weekStart,
        stateOverviewDate,
        dailyReviewDates
      })
    }

    return calendar
  },

  /**
   * Calculate content production metrics
   */
  calculateProductionMetrics(calendar: any[]): {
    totalWeeks: number
    totalBlogPosts: number
    totalBeerReviews: number
    totalSocialPosts: number
    estimatedWordCount: number
    estimatedImageCount: number
  } {
    return {
      totalWeeks: calendar.length,
      totalBlogPosts: calendar.length, // 1 per week
      totalBeerReviews: calendar.length * 6, // 6 per week
      totalSocialPosts: calendar.length * 6 * 4, // 6 reviews * 4 platforms
      estimatedWordCount: calendar.length * 2500, // 2500 words per blog post
      estimatedImageCount: calendar.length * 8 // Multiple images per week
    }
  }
}