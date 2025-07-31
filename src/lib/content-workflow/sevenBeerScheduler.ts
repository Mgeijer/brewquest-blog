/**
 * Seven Beer Weekly Scheduler
 * 
 * Updated content workflow to support:
 * - 1 weekly state post + 7 beer reviews per week
 * - Monday: State post (morning) + Beer #1 (afternoon)
 * - Tuesday-Sunday: Beers #2-7 (one per day)
 * - Total: 50 state posts + 350 beer reviews
 */

import { supabase } from '../supabase/client'

// ==================================================
// Type Definitions
// ==================================================

export interface WeeklyContentPlan {
  stateCode: string
  weekNumber: number
  statePost: {
    title: string
    content: string
    publishDate: Date
    publishTime: string // '09:00'
  }
  beerReviews: BeerReviewPlan[]
  socialMediaPosts: SocialMediaPlan[]
}

export interface BeerReviewPlan {
  dayOfWeek: number // 1-7 (Monday=1, Sunday=7)
  breweryName: string
  beerName: string
  beerStyle: string
  abv: number
  ibu?: number
  rating: number
  description: string
  uniqueFeature: string
  breweryWebsite?: string
  publishDate: Date
  publishTime: string // Monday='14:00', Others='10:00'
}

export interface SocialMediaPlan {
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin'
  contentType: 'state_post' | 'beer_review'
  beerDay?: number // 1-7 for beer reviews
  postText: string
  hashtags: string[]
  scheduledDate: Date
  scheduledTime: string
}

// ==================================================
// Seven Beer Content Scheduler
// ==================================================

export class SevenBeerScheduler {
  private supabase = supabase

  /**
   * Generate complete weekly content plan for a state
   */
  async generateWeeklyPlan(
    stateCode: string,
    weekNumber: number,
    startDate: Date
  ): Promise<WeeklyContentPlan> {
    try {
      // Generate state post
      const statePost = await this.generateStatePost(stateCode, weekNumber, startDate)
      
      // Generate 7 beer reviews
      const beerReviews = await this.generateSevenBeerReviews(stateCode, weekNumber, startDate)
      
      // Generate social media posts for all content
      const socialMediaPosts = await this.generateWeeklySocialPosts(stateCode, weekNumber, startDate, beerReviews)

      return {
        stateCode,
        weekNumber,
        statePost,
        beerReviews,
        socialMediaPosts
      }
    } catch (error) {
      console.error('Failed to generate weekly plan:', error)
      throw new Error(`Failed to generate weekly plan for ${stateCode} week ${weekNumber}`)
    }
  }

  /**
   * Generate state culture/history post
   */
  private async generateStatePost(
    stateCode: string,
    weekNumber: number,
    startDate: Date
  ): Promise<WeeklyContentPlan['statePost']> {
    // This would typically call an AI service or use templates
    const stateInfo = await this.getStateInformation(stateCode)
    
    return {
      title: `${stateInfo.name} Craft Beer Renaissance: Week ${weekNumber}`,
      content: `Discover the rich brewing heritage and innovative craft beer scene of ${stateInfo.name}...`,
      publishDate: startDate, // Monday
      publishTime: '09:00'
    }
  }

  /**
   * Generate 7 beer reviews for the week
   */
  private async generateSevenBeerReviews(
    stateCode: string,
    weekNumber: number,
    startDate: Date
  ): Promise<BeerReviewPlan[]> {
    const breweries = await this.researchStateBreweries(stateCode, 7) // Get 7 breweries
    
    return breweries.map((brewery, index) => {
      const dayOfWeek = index + 1 // 1-7
      const publishDate = new Date(startDate)
      publishDate.setDate(startDate.getDate() + (dayOfWeek - 1))
      
      return {
        dayOfWeek,
        breweryName: brewery.name,
        beerName: brewery.featuredBeer.name,
        beerStyle: brewery.featuredBeer.style,
        abv: brewery.featuredBeer.abv,
        ibu: brewery.featuredBeer.ibu,
        rating: brewery.featuredBeer.rating,
        description: brewery.featuredBeer.description,
        uniqueFeature: brewery.featuredBeer.uniqueFeature,
        breweryWebsite: brewery.website,
        publishDate,
        publishTime: dayOfWeek === 1 ? '14:00' : '10:00' // Monday afternoon, others morning
      }
    })
  }

  /**
   * Generate social media posts for weekly content
   * 4 platforms × 7 beer reviews = 28 posts per week
   */
  private async generateWeeklySocialPosts(
    stateCode: string,
    weekNumber: number,
    startDate: Date,
    beerReviews: BeerReviewPlan[]
  ): Promise<SocialMediaPlan[]> {
    const platforms: SocialMediaPlan['platform'][] = ['instagram', 'twitter', 'facebook', 'linkedin']
    const socialPosts: SocialMediaPlan[] = []

    // Generate posts for each beer review
    beerReviews.forEach(beer => {
      platforms.forEach(platform => {
        const postText = this.generatePlatformSpecificText(platform, beer, stateCode)
        const hashtags = this.generateHashtags(platform, stateCode, beer.beerStyle)
        
        socialPosts.push({
          platform,
          contentType: 'beer_review',
          beerDay: beer.dayOfWeek,
          postText,
          hashtags,
          scheduledDate: beer.publishDate,
          scheduledTime: this.getSocialMediaPostTime(platform, beer.dayOfWeek)
        })
      })
    })

    return socialPosts
  }

  /**
   * Save complete weekly plan to database
   */
  async saveWeeklyPlan(plan: WeeklyContentPlan): Promise<{
    success: boolean
    statePostId?: string
    beerReviewIds?: string[]
    socialPostIds?: string[]
    error?: string
  }> {
    try {
      // 1. Save state post
      const { data: statePost, error: stateError } = await this.supabase
        .from('blog_posts')
        .insert({
          state_code: plan.stateCode,
          week_number: plan.weekNumber,
          title: plan.statePost.title,
          content: plan.statePost.content,
          content_type: 'state_overview',
          scheduled_date: plan.statePost.publishDate.toISOString().split('T')[0],
          scheduled_time: plan.statePost.publishTime,
          status: 'scheduled'
        })
        .select('id')
        .single()

      if (stateError) throw stateError

      // 2. Save beer reviews
      const beerReviewsData = plan.beerReviews.map(beer => ({
        state_code: plan.stateCode,
        week_number: plan.weekNumber,
        day_of_week: beer.dayOfWeek,
        brewery_name: beer.breweryName,
        beer_name: beer.beerName,
        beer_style: beer.beerStyle,
        abv: beer.abv,
        ibu: beer.ibu,
        rating: beer.rating,
        description: beer.description,
        unique_feature: beer.uniqueFeature,
        brewery_website: beer.breweryWebsite,
        scheduled_date: beer.publishDate.toISOString().split('T')[0],
        scheduled_time: beer.publishTime,
        status: 'scheduled'
      }))

      const { data: beerReviews, error: beerError } = await this.supabase
        .from('beer_reviews')
        .insert(beerReviewsData)
        .select('id')

      if (beerError) throw beerError

      // 3. Save social media posts
      const socialMediaData = plan.socialMediaPosts.map(social => ({
        platform: social.platform,
        content_type: social.contentType,
        state_code: plan.stateCode,
        week_number: plan.weekNumber,
        beer_day: social.beerDay,
        post_text: social.postText,
        hashtags: social.hashtags,
        scheduled_date: social.scheduledDate.toISOString().split('T')[0],
        scheduled_time: social.scheduledTime,
        status: 'scheduled'
      }))

      const { data: socialPosts, error: socialError } = await this.supabase
        .from('social_posts')
        .insert(socialMediaData)
        .select('id')

      if (socialError) throw socialError

      return {
        success: true,
        statePostId: statePost.id,
        beerReviewIds: beerReviews.map(r => r.id),
        socialPostIds: socialPosts.map(s => s.id)
      }

    } catch (error) {
      console.error('Failed to save weekly plan:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Validate weekly content completeness
   */
  async validateWeeklyContent(stateCode: string, weekNumber: number): Promise<{
    isComplete: boolean
    hasStatePost: boolean
    beerReviewCount: number
    missingBeerDays: number[]
    socialPostCount: number
    issues: string[]
  }> {
    try {
      // Check state post
      const { data: statePosts, error: stateError } = await this.supabase
        .from('blog_posts')
        .select('id')
        .eq('state_code', stateCode)
        .eq('week_number', weekNumber)
        .eq('content_type', 'state_overview')

      if (stateError) throw stateError

      // Check beer reviews
      const { data: beerReviews, error: beerError } = await this.supabase
        .from('beer_reviews')
        .select('id, day_of_week')
        .eq('state_code', stateCode)
        .eq('week_number', weekNumber)

      if (beerError) throw beerError

      // Check social posts
      const { data: socialPosts, error: socialError } = await this.supabase
        .from('social_posts')
        .select('id')
        .eq('state_code', stateCode)
        .eq('week_number', weekNumber)

      if (socialError) throw socialError

      const hasStatePost = (statePosts?.length || 0) > 0
      const beerReviewCount = beerReviews?.length || 0
      const socialPostCount = socialPosts?.length || 0
      
      // Find missing beer review days
      const existingDays = new Set(beerReviews?.map(r => r.day_of_week) || [])
      const missingBeerDays = []
      for (let day = 1; day <= 7; day++) {
        if (!existingDays.has(day)) {
          missingBeerDays.push(day)
        }
      }

      const issues = []
      if (!hasStatePost) issues.push('Missing state overview post')
      if (beerReviewCount < 7) issues.push(`Missing ${7 - beerReviewCount} beer reviews`)
      if (socialPostCount < 28) issues.push(`Missing ${28 - socialPostCount} social media posts`)

      return {
        isComplete: hasStatePost && beerReviewCount === 7 && socialPostCount === 28,
        hasStatePost,
        beerReviewCount,
        missingBeerDays,
        socialPostCount,
        issues
      }

    } catch (error) {
      console.error('Failed to validate weekly content:', error)
      return {
        isComplete: false,
        hasStatePost: false,
        beerReviewCount: 0,
        missingBeerDays: [1, 2, 3, 4, 5, 6, 7],
        socialPostCount: 0,
        issues: ['Failed to validate content: ' + (error instanceof Error ? error.message : 'Unknown error')]
      }
    }
  }

  // ==================================================
  // Helper Methods
  // ==================================================

  private async getStateInformation(stateCode: string) {
    // This would integrate with state data APIs or database
    return {
      name: 'Alabama', // This would be dynamic
      region: 'Southeast',
      brewingHistory: 'Rich brewing heritage...',
      keyBreweries: []
    }
  }

  private async researchStateBreweries(stateCode: string, count: number) {
    // This would integrate with brewery research APIs
    return Array.from({ length: count }, (_, i) => ({
      name: `Brewery ${i + 1}`,
      website: `https://brewery${i + 1}.com`,
      featuredBeer: {
        name: `Beer ${i + 1}`,
        style: 'IPA',
        abv: 6.5,
        ibu: 45,
        rating: 4.2,
        description: 'Excellent beer',
        uniqueFeature: 'Special ingredient'
      }
    }))
  }

  private generatePlatformSpecificText(
    platform: SocialMediaPlan['platform'],
    beer: BeerReviewPlan,
    stateCode: string
  ): string {
    const baseText = `🍺 Day ${beer.dayOfWeek}: ${beer.beerName} from ${beer.breweryName}! ${beer.uniqueFeature}`
    
    switch (platform) {
      case 'instagram':
        return `${baseText}\n\n📍 ${stateCode} Beer Journey\n🍻 ${beer.beerStyle} | ${beer.abv}% ABV\n⭐ ${beer.rating}/5\n\n#CraftBeer #${stateCode}Beer #BeerJourney`
      case 'twitter':
        return `${baseText} #CraftBeer #${stateCode}Beer 🍻`
      case 'facebook':
        return `${baseText}\n\nJoin me as I explore the incredible craft beer scene across America! Day ${beer.dayOfWeek} of ${stateCode}'s beer journey features this amazing ${beer.beerStyle}.`
      case 'linkedin':
        return `Exploring America's craft beer industry: ${beer.beerName} from ${beer.breweryName} showcases the innovation and quality driving the craft beer renaissance in ${stateCode}.`
      default:
        return baseText
    }
  }

  private generateHashtags(platform: string, stateCode: string, beerStyle: string): string[] {
    const baseHashtags = ['craftbeer', 'beer', 'brewery', `${stateCode.toLowerCase()}beer`]
    const styleHashtag = beerStyle.toLowerCase().replace(/\s+/g, '')
    
    return [...baseHashtags, styleHashtag, 'beerjourney', 'americancraftbeer']
  }

  private getSocialMediaPostTime(platform: string, dayOfWeek: number): string {
    // Optimal posting times by platform
    const postTimes = {
      instagram: '12:00', // Lunch time engagement
      twitter: '15:00',   // Afternoon engagement
      facebook: '13:00',  // Early afternoon
      linkedin: '08:00'   // Morning professional time
    }
    
    return postTimes[platform as keyof typeof postTimes] || '12:00'
  }
}

// Export singleton instance
export const sevenBeerScheduler = new SevenBeerScheduler()