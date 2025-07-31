# Phase 4: Social Media Automation & BrewMetrics Integration (Week 7-8)

## Step 15: Social Media Automation System

### 15.1 Social Media Manager Service
```typescript
// lib/social/socialManager.ts
interface PlatformConfig {
  instagram: {
    accessToken: string
    businessAccountId: string
  }
  twitter: {
    apiKey: string
    apiSecret: string
    accessToken: string
    accessTokenSecret: string
  }
  facebook: {
    pageId: string
    accessToken: string
  }
  linkedin: {
    organizationId: string
    accessToken: string
  }
}

interface ScheduledPost {
  id: string
  platform: keyof PlatformConfig
  content: string
  imageUrl?: string
  hashtags: string[]
  scheduledTime: Date
  status: 'draft' | 'scheduled' | 'posted' | 'failed'
  engagement?: {
    likes: number
    comments: number
    shares: number
    reach: number
  }
}

export class SocialMediaManager {
  private config: PlatformConfig

  constructor() {
    this.config = {
      instagram: {
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
        businessAccountId: process.env.INSTAGRAM_BUSINESS_ID || ''
      },
      twitter: {
        apiKey: process.env.TWITTER_API_KEY || '',
        apiSecret: process.env.TWITTER_API_SECRET || '',
        accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || ''
      },
      facebook: {
        pageId: process.env.FACEBOOK_PAGE_ID || '',
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN || ''
      },
      linkedin: {
        organizationId: process.env.LINKEDIN_ORG_ID || '',
        accessToken: process.env.LINKEDIN_ACCESS_TOKEN || ''
      }
    }
  }

  async schedulePost(post: Omit<ScheduledPost, 'id' | 'status'>): Promise<string> {
    const postId = crypto.randomUUID()
    
    // Save to database with scheduled status
    const { error } = await supabase
      .from('social_posts')
      .insert([{
        id: postId,
        platform: post.platform,
        content: post.content,
        image_url: post.imageUrl,
        hashtags: post.hashtags,
        scheduled_time: post.scheduledTime.toISOString(),
        status: 'scheduled'
      }])

    if (error) throw error

    // Schedule with cron job or queue system
    await this.addToScheduleQueue(postId, post.scheduledTime)
    
    return postId
  }

  async publishPost(postId: string): Promise<void> {
    // Get post from database
    const { data: post, error } = await supabase
      .from('social_posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (error || !post) throw new Error('Post not found')

    try {
      let externalPostId: string

      switch (post.platform) {
        case 'instagram':
          externalPostId = await this.publishToInstagram(post)
          break
        case 'twitter':
          externalPostId = await this.publishToTwitter(post)
          break
        case 'facebook':
          externalPostId = await this.publishToFacebook(post)
          break
        case 'linkedin':
          externalPostId = await this.publishToLinkedIn(post)
          break
        default:
          throw new Error(`Unsupported platform: ${post.platform}`)
      }

      // Update status to posted
      await supabase
        .from('social_posts')
        .update({
          status: 'posted',
          posted_at: new Date().toISOString(),
          engagement_metrics: { external_id: externalPostId }
        })
        .eq('id', postId)

    } catch (error) {
      // Update status to failed
      await supabase
        .from('social_posts')
        .update({ status: 'failed' })
        .eq('id', postId)
      
      throw error
    }
  }

  private async publishToInstagram(post: any): Promise<string> {
    const { accessToken, businessAccountId } = this.config.instagram
    
    // Step 1: Create media object
    const mediaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${businessAccountId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: post.image_url,
          caption: this.formatInstagramPost(post.content, post.hashtags),
          access_token: accessToken
        })
      }
    )

    const mediaData = await mediaResponse.json()
    if (!mediaResponse.ok) throw new Error(mediaData.error?.message || 'Instagram media creation failed')

    // Step 2: Publish media
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${businessAccountId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: mediaData.id,
          access_token: accessToken
        })
      }
    )

    const publishData = await publishResponse.json()
    if (!publishResponse.ok) throw new Error(publishData.error?.message || 'Instagram publish failed')

    return publishData.id
  }

  private async publishToTwitter(post: any): Promise<string> {
    // Using Twitter API v2
    const tweetData = {
      text: this.formatTwitterPost(post.content, post.hashtags)
    }

    // Add media if present
    if (post.image_url) {
      const mediaId = await this.uploadMediaToTwitter(post.image_url)
      tweetData.media = { media_ids: [mediaId] }
    }

    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.twitter.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tweetData)
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'Twitter post failed')

    return data.data.id
  }

  private async publishToFacebook(post: any): Promise<string> {
    const { pageId, accessToken } = this.config.facebook
    
    const postData = {
      message: this.formatFacebookPost(post.content, post.hashtags),
      access_token: accessToken
    }

    if (post.image_url) {
      postData.link = post.image_url
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      }
    )

    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'Facebook post failed')

    return data.id
  }

  private async publishToLinkedIn(post: any): Promise<string> {
    const { organizationId, accessToken } = this.config.linkedin
    
    const postData = {
      author: `urn:li:organization:${organizationId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: this.formatLinkedInPost(post.content, post.hashtags)
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    }

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postData)
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'LinkedIn post failed')

    return data.id
  }

  // Platform-specific formatting methods
  private formatInstagramPost(content: string, hashtags: string[]): string {
    return `${content}\n\n${hashtags.join(' ')}`
  }

  private formatTwitterPost(content: string, hashtags: string[]): string {
    const maxLength = 280
    const hashtagString = hashtags.slice(0, 3).join(' ')
    const availableLength = maxLength - hashtagString.length - 2
    
    const truncatedContent = content.length > availableLength 
      ? content.substring(0, availableLength - 3) + '...'
      : content
    
    return `${truncatedContent}\n\n${hashtagString}`
  }

  private formatFacebookPost(content: string, hashtags: string[]): string {
    return `${content}\n\n${hashtags.slice(0, 5).join(' ')}`
  }

  private formatLinkedInPost(content: string, hashtags: string[]): string {
    return `${content}\n\n${hashtags.slice(0, 3).join(' ')}`
  }

  async getEngagementMetrics(postId: string): Promise<any> {
    const { data: post } = await supabase
      .from('social_posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (!post || !post.engagement_metrics?.external_id) return null

    switch (post.platform) {
      case 'instagram':
        return await this.getInstagramMetrics(post.engagement_metrics.external_id)
      case 'twitter':
        return await this.getTwitterMetrics(post.engagement_metrics.external_id)
      case 'facebook':
        return await this.getFacebookMetrics(post.engagement_metrics.external_id)
      default:
        return null
    }
  }

  private async addToScheduleQueue(postId: string, scheduledTime: Date): Promise<void> {
    // This would integrate with a job queue system like Bull, Agenda, or cloud functions
    // For now, we'll use a simple cron job approach
    console.log(`Scheduled post ${postId} for ${scheduledTime}`)
  }
}
```

### 15.2 Social Media Dashboard
```typescript
// app/(dashboard)/admin/social/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, TrendingUp, Users, Heart, MessageCircle, Share, Eye } from 'lucide-react'
import { SocialPostCard } from '@/components/admin/SocialPostCard'
import { SocialCalendar } from '@/components/admin/SocialCalendar'
import { EngagementChart } from '@/components/admin/EngagementChart'

interface SocialPost {
  id: string
  platform: string
  content: string
  scheduled_time: string
  status: 'draft' | 'scheduled' | 'posted' | 'failed'
  engagement_metrics?: {
    likes: number
    comments: number
    shares: number
    reach: number
  }
}

export default function SocialDashboard() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')

  useEffect(() => {
    loadSocialPosts()
  }, [])

  const loadSocialPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .order('scheduled_time', { ascending: true })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error loading social posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = selectedPlatform === 'all' 
    ? posts 
    : posts.filter(post => post.platform === selectedPlatform)

  const platformStats = {
    instagram: posts.filter(p => p.platform === 'instagram'),
    twitter: posts.filter(p => p.platform === 'twitter'),
    facebook: posts.filter(p => p.platform === 'facebook'),
    linkedin: posts.filter(p => p.platform === 'linkedin')
  }

  const totalEngagement = posts.reduce((sum, post) => {
    if (post.engagement_metrics) {
      return sum + post.engagement_metrics.likes + post.engagement_metrics.comments + post.engagement_metrics.shares
    }
    return sum
  }, 0)

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Social Media</h1>
          <p className="text-gray-600">Manage and schedule your social media posts</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="facebook">Facebook</option>
            <option value="linkedin">LinkedIn</option>
          </select>
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                view === 'calendar'
                  ? 'bg-beer-amber text-white border-beer-amber'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Calendar
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                view === 'list'
                  ? 'bg-beer-amber text-white border-beer-amber'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-beer-amber" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Scheduled Posts
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {posts.filter(p => p.status === 'scheduled').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Posted Today
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {posts.filter(p => 
                    p.status === 'posted' && 
                    new Date(p.scheduled_time).toDateString() === new Date().toDateString()
                  ).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Engagement
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {totalEngagement.toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Reach
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {posts.reduce((sum, post) => 
                    sum + (post.engagement_metrics?.reach || 0), 0
                  ).toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Performance */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Platform Performance</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(platformStats).map(([platform, platformPosts]) => (
              <div key={platform} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium capitalize">{platform}</h3>
                  <span className="text-sm text-gray-500">
                    {platformPosts.length} posts
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Scheduled:</span>
                    <span>{platformPosts.filter(p => p.status === 'scheduled').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Posted:</span>
                    <span>{platformPosts.filter(p => p.status === 'posted').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Failed:</span>
                    <span className="text-red-500">
                      {platformPosts.filter(p => p.status === 'failed').length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {view === 'calendar' ? (
        <SocialCalendar posts={filteredPosts} onPostUpdate={loadSocialPosts} />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Posts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <SocialPostCard 
                key={post.id} 
                post={post} 
                onUpdate={loadSocialPosts}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

## Step 16: BrewMetrics Integration Points

### 16.1 BrewMetrics Integration Manager
```typescript
// lib/brewmetrics/integrationManager.ts
interface BrewMetricsIntegration {
  weekNumber: number
  integrationType: 'soft' | 'educational' | 'case_study' | 'direct'
  content: {
    widget?: BreweryInsightWidget
    caseStudy?: BrewMetricsCaseStudy
    educational?: EducationalContent
    directPromotion?: DirectPromotion
  }
}

interface BreweryInsightWidget {
  insight: string
  ctaText: string
  ctaUrl: string
  statistic?: {
    value: string
    description: string
  }
}

interface BrewMetricsCaseStudy {
  breweryName: string
  improvement: string
  quote: string
  metrics: {
    wasteReduction?: number
    profitIncrease?: number
    timeSaved?: string
    costSavings?: number
  }
  testimonial?: {
    person: string
    role: string
    company: string
  }
}

export class BrewMetricsIntegrationManager {
  private readonly integrationSchedule: Record<number, BrewMetricsIntegration> = {
    // Weeks 30-35: Soft Introduction
    30: {
      weekNumber: 30,
      integrationType: 'soft',
      content: {
        widget: {
          insight: "Did you know 68% of craft breweries struggle with inventory management?",
          ctaText: "Learn about brewery challenges",
          ctaUrl: "/brewery-insights",
          statistic: {
            value: "23%",
            description: "average waste reduction possible with proper tracking"
          }
        }
      }
    },
    
    32: {
      weekNumber: 32,
      integrationType: 'soft',
      content: {
        widget: {
          insight: "Successful breweries track costs down to the individual ingredient level",
          ctaText: "Discover brewery best practices",
          ctaUrl: "/brewery-operations"
        }
      }
    },

    // Weeks 36-40: Educational Content
    36: {
      weekNumber: 36,
      integrationType: 'educational',
      content: {
        educational: {
          title: "Brewery Business 101: Understanding Your Numbers",
          topics: [
            "Cost per barrel calculations",
            "Inventory turnover rates", 
            "Recipe costing and scaling",
            "Quality control metrics"
          ],
          ctaText: "Learn brewery management",
          ctaUrl: "/brewery-education"
        }
      }
    },

    38: {
      weekNumber: 38,
      integrationType: 'educational',
      content: {
        educational: {
          title: "The Hidden Costs of Brewery Inefficiency",
          topics: [
            "Ingredient waste and spoilage",
            "Inaccurate recipe scaling",
            "Manual tracking errors",
            "Compliance documentation gaps"
          ],
          ctaText: "Optimize your brewery",
          ctaUrl: "/brewery-optimization"
        }
      }
    },

    // Weeks 41-45: Case Studies
    41: {
      weekNumber: 41,
      integrationType: 'case_study',
      content: {
        caseStudy: {
          breweryName: "Mountain Peak Brewing",
          improvement: "Reduced waste by 23% and increased profitability by 18%",
          quote: "BrewMetrics transformed how we track our inventory and costs. Now we make data-driven decisions instead of guessing.",
          metrics: {
            wasteReduction: 23,
            profitIncrease: 18,
            timeSaved: "15 hours/week",
            costSavings: 12000
          },
          testimonial: {
            person: "Sarah Chen",
            role: "Head Brewer",
            company: "Mountain Peak Brewing"
          }
        }
      }
    },

    43: {
      weekNumber: 43,
      integrationType: 'case_study',
      content: {
        caseStudy: {
          breweryName: "Coastal Craft Co.",
          improvement: "Streamlined operations and reduced manual tracking by 80%",
          quote: "The real-time inventory tracking saved us from multiple stockouts and helped us identify our most profitable recipes.",
          metrics: {
            timeSaved: "20 hours/week",
            profitIncrease: 15,
            costSavings: 8500
          },
          testimonial: {
            person: "Mike Rodriguez",
            role: "Operations Manager", 
            company: "Coastal Craft Co."
          }
        }
      }
    },

    // Weeks 46-50: Direct Promotion
    46: {
      weekNumber: 46,
      integrationType: 'direct',
      content: {
        directPromotion: {
          title: "Exclusive BrewMetrics Offer for Hop Harrison Readers",
          discount: "25% off first year",
          promoCode: "HOPHARRISON25",
          features: [
            "Real-time inventory tracking",
            "Recipe costing and scaling",
            "Quality control metrics",
            "Compliance documentation",
            "Performance analytics"
          ],
          ctaText: "Start your free trial",
          ctaUrl: "https://brewmetrics.com/signup?ref=hopharrison"
        }
      }
    }
  }

  getIntegrationForWeek(weekNumber: number): BrewMetricsIntegration | null {
    return this.integrationSchedule[weekNumber] || null
  }

  shouldShowIntegration(weekNumber: number): boolean {
    return weekNumber >= 30 && this.integrationSchedule[weekNumber] !== undefined
  }

  generateIntegrationContent(weekNumber: number, state: string): string {
    const integration = this.getIntegrationForWeek(weekNumber)
    if (!integration) return ''

    switch (integration.integrationType) {
      case 'soft':
        return this.generateSoftIntegration(integration.content.widget!, state)
      case 'educational':
        return this.generateEducationalContent(integration.content.educational!)
      case 'case_study':
        return this.generateCaseStudy(integration.content.caseStudy!)
      case 'direct':
        return this.generateDirectPromotion(integration.content.directPromotion!)
      default:
        return ''
    }
  }

  private generateSoftIntegration(widget: BreweryInsightWidget, state: string): string {
    return `
## Behind the Numbers: ${state} Brewery Insights

${widget.insight} Many of the breweries we've featured this week have shared insights about the operational challenges they face.

${widget.statistic ? `**Did you know?** ${widget.statistic.value} ${widget.statistic.description}` : ''}

Running a successful brewery isn't just about great beer—it's about understanding your business at every level. From ingredient costs to batch yields, the most successful breweries track everything.

*Curious about brewery operations? [${widget.ctaText}](${widget.ctaUrl})*
`
  }

  private generateCaseStudy(caseStudy: BrewMetricsCaseStudy): string {
    return `
## Success Story: How ${caseStudy.breweryName} ${caseStudy.improvement}

We've been following the incredible growth of ${caseStudy.breweryName}, and their story perfectly illustrates how data-driven decisions can transform a brewery's operations.

> "${caseStudy.quote}"
> 
> — ${caseStudy.testimonial?.person}, ${caseStudy.testimonial?.role}

**The Results:**
${caseStudy.metrics.wasteReduction ? `- ${caseStudy.metrics.wasteReduction}% reduction in waste` : ''}
${caseStudy.metrics.profitIncrease ? `- ${caseStudy.metrics.profitIncrease}% increase in profitability` : ''}
${caseStudy.metrics.timeSaved ? `- ${caseStudy.metrics.timeSaved} saved on manual processes` : ''}
${caseStudy.metrics.costSavings ? `- $${caseStudy.metrics.costSavings.toLocaleString()} in annual cost savings` : ''}

Their transformation started with implementing BrewMetrics to track inventory, costs, and production metrics in real-time. What began as a simple efficiency project evolved into a complete operational overhaul that's positioned them for sustainable growth.

*Want to see how BrewMetrics could help your brewery? [Learn more about their platform](https://brewmetrics.com?ref=hopharrison)*
`
  }

  private generateDirectPromotion(promotion: any): string {
    return `
## Special Offer: Optimize Your Brewery Operations

After featuring hundreds of breweries across all 50 states, one thing is clear: the most successful operations use data to drive decisions. That's why I'm excited to offer my readers an exclusive deal with BrewMetrics.

**${promotion.title}**
- ${promotion.discount}
- Use code: **${promotion.promoCode}**

**What you get:**
${promotion.features.map((feature: string) => `- ${feature}`).join('\n')}

This isn't just software—it's the operational foundation that successful breweries build on. Whether you're tracking costs, managing inventory, or ensuring quality consistency, BrewMetrics provides the insights you need to grow profitably.

[${promotion.ctaText}](${promotion.ctaUrl})

*This offer is exclusive to Hop Harrison readers and expires at the end of the month.*
`
  }
}
```

### 16.2 BrewMetrics Components
```typescript
// components/brewmetrics/BreweryInsightWidget.tsx
interface BreweryInsightWidgetProps {
  insight: string
  ctaText: string
  ctaUrl: string
  statistic?: {
    value: string
    description: string
  }
  weekNumber: number
}

export function BreweryInsightWidget({ 
  insight, 
  ctaText, 
  ctaUrl, 
  statistic, 
  weekNumber 
}: BreweryInsightWidgetProps) {
  // Only show if we're past week 30
  if (weekNumber < 30) return null

  return (
    <div className="bg-gradient-to-r from-beer-amber/10 to-beer-gold/10 border border-beer-amber/20 rounded-lg p-6 my-8">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-beer-amber rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-beer-dark mb-2">
            Brewery Insight
          </h3>
          
          <p className="text-beer-brown/80 mb-4">
            {insight}
          </p>
          
          {statistic && (
            <div className="bg-white/50 rounded-lg p-3 mb-4">
              <div className="text-2xl font-bold text-beer-amber">
                {statistic.value}
              </div>
              <div className="text-sm text-beer-brown">
                {statistic.description}
              </div>
            </div>
          )}
          
          <Link
            href={ctaUrl}
            className="inline-flex items-center space-x-2 text-beer-amber hover:text-beer-gold font-medium"
            onClick={() => trackBrewMetricsClick('insight_widget', weekNumber)}
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
```

### 16.3 BrewMetrics Case Study Component
```typescript
// components/brewmetrics/BrewMetricsCaseStudy.tsx
import { Quote, TrendingUp, DollarSign, Clock, Target } from 'lucide-react'

interface BrewMetricsCaseStudyProps {
  breweryName: string
  improvement: string
  quote: string
  metrics: {
    wasteReduction?: number
    profitIncrease?: number
    timeSaved?: string
    costSavings?: number
  }
  testimonial?: {
    person: string
    role: string
    company: string
  }
  weekNumber: number
}

export function BrewMetricsCaseStudy({
  breweryName,
  improvement,
  quote,
  metrics,
  testimonial,
  weekNumber
}: BrewMetricsCaseStudyProps) {
  // Only show case studies from week 41+
  if (weekNumber < 41) return null

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 my-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
          <Target className="w-4 h-4" />
          <span>Success Story</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          How {breweryName} {improvement}
        </h3>
        <p className="text-gray-600">
          A real-world example of brewery optimization in action
        </p>
      </div>

      {/* Quote Section */}
      <div className="bg-beer-cream/30 rounded-lg p-6 mb-6">
        <Quote className="w-8 h-8 text-beer-amber mb-4" />
        <blockquote className="text-lg text-beer-dark italic mb-4">
          "{quote}"
        </blockquote>
        {testimonial && (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-beer-amber rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {testimonial.person.charAt(0)}
              </span>
            </div>
            <div>
              <div className="font-semibold text-beer-dark">
                {testimonial.person}
              </div>
              <div className="text-sm text-beer-brown">
                {testimonial.role}, {testimonial.company}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.wasteReduction && (
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">
              {metrics.wasteReduction}%
            </div>
            <div className="text-sm text-gray-600">Waste Reduction</div>
          </div>
        )}
        
        {metrics.profitIncrease && (
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {metrics.profitIncrease}%
            </div>
            <div className="text-sm text-gray-600">Profit Increase</div>
          </div>
        )}
        
        {metrics.timeSaved && (
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {metrics.timeSaved}
            </div>
            <div className="text-sm text-gray-600">Time Saved</div>
          </div>
        )}
        
        {metrics.costSavings && (
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <DollarSign className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              ${metrics.costSavings.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Annual Savings</div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Ready to see similar results in your brewery?
        </p>
        <Link
          href="https://brewmetrics.com?ref=hopharrison&source=case_study"
          className="inline-flex items-center space-x-2 bg-beer-amber hover:bg-beer-gold text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          onClick={() => trackBrewMetricsClick('case_study', weekNumber)}
        >
          <span>Learn More About BrewMetrics</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
```

## Step 17: Analytics & Performance Tracking

### 17.1 Analytics Service
```typescript
// lib/analytics/analyticsService.ts
interface AnalyticsEvent {
  event: string
  properties: Record<string, any>
  timestamp: Date
  userId?: string
  sessionId: string
}

interface PageView {
  path: string
  title: string
  referrer?: string
  userAgent: string
  timestamp: Date
  sessionId: string
  userId?: string
}

interface BrewMetricsConversion {
  source: 'insight_widget' | 'case_study' | 'direct_promotion'
  weekNumber: number
  clickedAt: Date
  convertedAt?: Date
  conversionValue?: number
}

export class AnalyticsService {
  private sessionId: string

  constructor() {
    this.sessionId = this.getOrCreateSessionId()
  }

  private getOrCreateSessionId(): string {
    const existing = localStorage.getItem('brewquest_session_id')
    if (existing) return existing

    const newSessionId = crypto.randomUUID()
    localStorage.setItem('brewquest_session_id', newSessionId)
    return newSessionId
  }

  async trackPageView(path: string, title: string): Promise<void> {
    const pageView: PageView = {
      path,
      title,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date(),
      sessionId: this.sessionId
    }

    // Send to database
    await supabase
      .from('page_analytics')
      .insert([{
        page_path: pageView.path,
        session_id: pageView.sessionId,
        timestamp: pageView.timestamp.toISOString(),
        referrer: pageView.referrer,
        user_agent: pageView.userAgent
      }])

    // Also send to external analytics if needed
    this.sendToExternalAnalytics('page_view', pageView)
  }

  async trackEvent(event: string, properties: Record<string, any>): Promise<void> {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date(),
      sessionId: this.sessionId
    }

    // Custom events for blog engagement
    if (event === 'blog_post_read') {
      await this.updateBlogPostMetrics(properties.postId, properties.readTime)
    }

    // BrewMetrics conversion tracking
    if (event === 'brewmetrics_click') {
      await this.trackBrewMetricsClick(properties)
    }

    // Send to external analytics
    this.sendToExternalAnalytics(event, analyticsEvent)
  }

  async trackBrewMetricsClick(properties: {
    source: string
    weekNumber: number
    url: string
  }): Promise<void> {
    const conversion: BrewMetricsConversion = {
      source: properties.source as any,
      weekNumber: properties.weekNumber,
      clickedAt: new Date()
    }

    await supabase
      .from('brewmetrics_conversions')
      .insert([{
        source: conversion.source,
        week_number: conversion.weekNumber,
        clicked_at: conversion.clickedAt.toISOString(),
        session_id: this.sessionId,
        referral_url: properties.url
      }])
  }

  async updateBlogPostMetrics(postId: string, readTime: number): Promise<void> {
    // Update view count and read time
    await supabase.rpc('update_blog_post_metrics', {
      post_id: postId,
      read_time_seconds: readTime
    })
  }

  private sendToExternalAnalytics(event: string, data: any): void {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', event, {
        custom_parameter_1: data.sessionId,
        ...data.properties
      })
    }

    // Plausible Analytics
    if (typeof plausible !== 'undefined') {
      plausible(event, { props: data.properties })
    }
  }

  async getDashboardMetrics(): Promise<any> {
    const [
      pageViews,
      topPosts,
      conversionStats,
      socialEngagement
    ] = await Promise.all([
      this.getPageViewStats(),
      this.getTopBlogPosts(),
      this.getBrewMetricsConversions(),
      this.getSocialEngagementStats()
    ])

    return {
      pageViews,
      topPosts,
      conversionStats,
      socialEngagement
    }
  }

  private async getPageViewStats() {
    const { data } = await supabase
      .from('page_analytics')
      .select('*')
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    return {
      total: data?.length || 0,
      unique: new Set(data?.map(d => d.session_id)).size || 0,
      topPages: this.groupByPage(data || [])
    }
  }

  private async getTopBlogPosts() {
    const { data } = await supabase
      .from('blog_posts')
      .select('title, slug, view_count')
      .order('view_count', { ascending: false })
      .limit(10)

    return data || []
  }

  private async getBrewMetricsConversions() {
    const { data } = await supabase
      .from('brewmetrics_conversions')
      .select('*')
      .gte('clicked_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    return {
      totalClicks: data?.length || 0,
      bySource: this.groupBySource(data || []),
      byWeek: this.groupByWeek(data || [])
    }
  }

  private groupByPage(data: any[]): Record<string, number> {
    return data.reduce((acc, item) => {
      acc[item.page_path] = (acc[item.page_path] || 0) + 1
      return acc
    }, {})
  }

  private groupBySource(data: any[]): Record<string, number> {
    return data.reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1
      return acc
    }, {})
  }

  private groupByWeek(data: any[]): Record<number, number> {
    return data.reduce((acc, item) => {
      acc[item.week_number] = (acc[item.week_number] || 0) + 1
      return acc
    }, {})
  }
}

// Global analytics instance
export const analytics = new AnalyticsService()

// Helper function for BrewMetrics click tracking
export function trackBrewMetricsClick(source: string, weekNumber: number) {
  analytics.trackEvent('brewmetrics_click', {
    source,
    weekNumber,
    url: window.location.href
  })
}
```

### 17.2 Analytics Dashboard
```typescript
// app/(dashboard)/admin/analytics/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Eye, DollarSign, Calendar, Globe } from 'lucide-react'
import { AnalyticsChart } from '@/components/admin/AnalyticsChart'
import { BrewMetricsConversionChart } from '@/components/admin/BrewMetricsConversionChart'
import { TopContentTable } from '@/components/admin/TopContentTable'

interface DashboardMetrics {
  pageViews: {
    total: number
    unique: number
    topPages: Record<string, number>
  }
  topPosts: Array<{
    title: string
    slug: string
    view_count: number
  }>
  conversionStats: {
    totalClicks: number
    bySource: Record<string, number>
    byWeek: Record<number, number>
  }
  socialEngagement: {
    totalFollowers: number
    totalEngagement: number
    topPosts: any[]
  }
}

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    loadMetrics()
  }, [timeRange])

  const loadMetrics = async () => {
    try {
      const response = await fetch(`/api/analytics/dashboard?range=${timeRange}`)
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error('Error loading metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading analytics...</div>
  }

  if (!metrics) {
    return <div className="text-center p-8">Failed to load analytics</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your blog performance and growth</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Page Views
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {metrics.pageViews.total.toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Unique Visitors
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {metrics.pageViews.unique.toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-beer-amber" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  BrewMetrics Clicks
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {metrics.conversionStats.totalClicks}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Globe className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Social Followers
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {metrics.socialEngagement.totalFollowers.toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Page Views Over Time
          </h2>
          <AnalyticsChart 
            data={metrics.pageViews} 
            type="pageviews"
            timeRange={timeRange}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            BrewMetrics Conversion Funnel
          </h2>
          <BrewMetricsConversionChart data={metrics.conversionStats} />
        </div>
      </div>

      {/* Content Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Top Blog Posts</h2>
          </div>
          <TopContentTable data={metrics.topPosts} type="blog" />
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Top Pages</h2>
          </div>
          <TopContentTable 
            data={Object.entries(metrics.pageViews.topPages).map(([path, views]) => ({
              title: path,
              slug: path,
              view_count: views
            }))} 
            type="pages" 
          />
        </div>
      </div>

      {/* BrewMetrics Performance */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">BrewMetrics Integration Performance</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Clicks by Source</h3>
              <div className="space-y-2">
                {Object.entries(metrics.conversionStats.bySource).map(([source, clicks]) => (
                  <div key={source} className="flex justify-between">
                    <span className="capitalize">{source.replace('_', ' ')}</span>
                    <span className="font-medium">{clicks}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Clicks by Week</h3>
              <div className="space-y-2">
                {Object.entries(metrics.conversionStats.byWeek).map(([week, clicks]) => (
                  <div key={week} className="flex justify-between">
                    <span>Week {week}</span>
                    <span className="font-medium">{clicks}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Conversion Rate</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-beer-amber">
                  {((metrics.conversionStats.totalClicks / metrics.pageViews.total) * 100).toFixed(2)}%
                </div>
                <div className="text-sm text-gray-500">Click-through rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Cursor Prompts for Phase 4

### Prompt 1: Social Media Automation System
```
Create a comprehensive social media automation system with:

1. SocialMediaManager class for multi-platform posting
2. Platform-specific API integrations (Instagram, Twitter, Facebook, LinkedIn)
3. Social media dashboard with calendar view
4. Post scheduling and queue management
5. Engagement tracking and analytics
6. Error handling and retry logic
7. Content formatting for each platform

Include proper TypeScript types and rate limiting.
```

### Prompt 2: BrewMetrics Integration Components
```
Build BrewMetrics integration system with:

1. BrewMetricsIntegrationManager for scheduled rollout
2. Week-based integration strategy (soft → educational → case studies → direct)
3. BreweryInsightWidget component
4. BrewMetricsCaseStudy component  
5. Conversion tracking and analytics
6. A/B testing capabilities for different messaging
7. UTM parameter tracking

Include conditional rendering based on week numbers.
```

### Prompt 3: Analytics & Performance Tracking
```
Create comprehensive analytics system with:

1. AnalyticsService for event tracking
2. Page view and engagement metrics
3. BrewMetrics conversion funnel tracking
4. Analytics dashboard with charts and KPIs
5. Real-time performance monitoring
6. Export capabilities for reports
7. Integration with Google Analytics and Plausible

Include proper database schema for analytics data.
```

## Next Steps Summary

You now have a complete implementation plan with 4 comprehensive phases:

1. **Phase 1**: Project foundation (Next.js, Supabase, basic structure)
2. **Phase 2**: Core blog functionality (landing page, blog system, components)
3. **Phase 3**: Admin dashboard & AI content generation
4. **Phase 4**: Social automation & BrewMetrics integration

Each phase includes detailed Cursor prompts that you can copy directly into your development environment. The system is designed to scale from launch through your 50-week journey and beyond, with enterprise-level features throughout.

Ready to start building? Begin with Phase 1 and work through each step systematically!