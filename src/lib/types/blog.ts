export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url?: string
  state: string
  week_number: number
  read_time: number
  published_at?: Date
  created_at: Date
  seo_meta_description?: string
  seo_keywords?: string[]
  view_count: number
  is_featured: boolean
}

export interface BeerReview {
  id: string
  blog_post_id: string
  brewery_name: string
  beer_name: string
  beer_style: string
  abv?: number
  rating: number
  tasting_notes: string
  unique_feature: string
  brewery_story: string
  brewery_location?: string
  brewery_website?: string
  image_url?: string
  day_of_week: number
  created_at: Date
}

export interface SocialPost {
  id: string
  beer_review_id: string
  platform: 'instagram' | 'twitter' | 'facebook' | 'tiktok'
  content: string
  image_url?: string
  hashtags: string[]
  scheduled_time?: Date
  posted_at?: Date
  status: 'draft' | 'scheduled' | 'posted' | 'failed'
} 