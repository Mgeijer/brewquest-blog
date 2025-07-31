export interface BeerReview {
  id: string
  name: string
  brewery: string
  style: string
  abv: number
  ibu?: number
  description: string
  tastingNotes: string
  rating: number // 1-5 scale
  dayOfWeek: number // 1-7 for daily content
  imageUrl?: string
}

export interface DatabaseBeerReview {
  id: string
  blog_post_id: string
  beer_name: string
  brewery_name: string
  beer_style: string
  abv: number
  ibu?: number
  rating: number
  tasting_notes: string
  image_url?: string
  unique_feature: string
  brewery_location: string
  brewery_website?: string
  brewery_story: string
  day_of_week: number
  created_at: Date
}