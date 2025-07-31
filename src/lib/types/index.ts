export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  state: string;
  weekNumber: number;
  publishedAt: Date;
  readTime: number;
  seo: {
    metaDescription: string;
    keywords: string[];
  };
}

export interface BeerReview {
  id: string;
  blogPostId: string;
  breweryName: string;
  beerName: string;
  beerStyle: string;
  abv: number;
  rating: number;
  tastingNotes: string;
  uniqueFeature: string;
  breweryStory: string;
  imageUrl: string;
  dayOfWeek: number;
  breweryLocation?: string;
}

export interface SocialPost {
  id: string;
  beerReviewId?: string;
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin';
  content: string;
  imageUrl?: string;
  hashtags: string[];
  scheduledTime?: Date;
  postedAt?: Date;
  engagementMetrics?: EngagementMetrics;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
}

export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  reach: number;
  clicks?: number;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  subscribedAt: Date;
  isActive: boolean;
  preferences: {
    weeklyDigest: boolean;
    stateUpdates: boolean;
  };
}

export interface StateProgress {
  code: string; // 'AL', 'AK', etc.
  name: string;
  status: 'completed' | 'current' | 'upcoming';
  beerCount: number;
  blogPostUrl?: string;
  featuredBrewery?: string;
  weekNumber?: number;
}

export interface PageAnalytics {
  id: string;
  pagePath: string;
  visitorId?: string;
  sessionId?: string;
  timestamp: Date;
  referrer?: string;
  userAgent?: string;
  country?: string;
  deviceType?: string;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: 'article';
  };
  twitter: {
    card: 'summary_large_image';
    title: string;
    description: string;
    image: string;
  };
  jsonLd: {
    "@context": "https://schema.org";
    "@type": "BlogPosting";
    headline: string;
    author: {
      "@type": "Person";
      name: "Hop Harrison";
    };
    datePublished: string;
    image: string;
  };
}

export interface AnalyticsMetrics {
  traffic: {
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgSessionDuration: number;
    topPages: Array<{page: string; views: number}>;
  };
  social: {
    followers: Record<string, number>;
    engagement: Record<string, EngagementMetrics>;
    topPosts: Array<{platform: string; post: string; engagement: number}>;
  };
  content: {
    postsPublished: number;
    avgReadTime: number;
    mostPopularStates: Array<{state: string; views: number}>;
    contentPerformance: Array<{title: string; score: number}>;
  };
  business: {
    newsletterSubscribers: number;
    brewMetricsLeads: number;
    conversionRate: number;
    revenueAttribution: number;
  };
}

// Utility types for API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

// Form types
export interface BlogPostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: File | string;
  state: string;
  weekNumber: number;
  publishedAt?: Date;
  seoMetaDescription?: string;
  seoKeywords?: string[];
  isFeatured?: boolean;
}

export interface BeerReviewForm {
  breweryName: string;
  beerName: string;
  beerStyle: string;
  abv: number;
  rating: number;
  tastingNotes: string;
  uniqueFeature: string;
  breweryStory: string;
  breweryLocation?: string;
  image?: File | string;
  dayOfWeek: number;
}

export interface NewsletterSignupForm {
  email: string;
  firstName?: string;
  preferences?: {
    weeklyDigest: boolean;
    stateUpdates: boolean;
  };
} 