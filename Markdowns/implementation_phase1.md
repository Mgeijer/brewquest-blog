# Phase 1: Project Foundation Setup (Week 1-2)

## Step 1: Initialize Next.js Project

### 1.1 Create Project Structure
```bash
npx create-next-app@latest brewquest-blog --typescript --tailwind --eslint --app
cd brewquest-blog
```

### 1.2 Install Dependencies
```bash
npm install @supabase/supabase-js lucide-react @types/node
npm install -D @types/react @types/react-dom
```

### 1.3 Project Structure Setup
```
src/
├── app/
│   ├── (dashboard)/
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── blog/
│   │       ├── analytics/
│   │       └── social/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── states/
│   │   └── [state]/
│   │       └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── blog/
│   ├── navigation/
│   └── social/
├── lib/
│   ├── supabase/
│   ├── utils/
│   └── types/
└── public/
    ├── images/
    └── icons/
```

## Step 2: Configure Environment & Supabase

### 2.1 Environment Variables (.env.local)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services (for later)
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key

# Social Media APIs (for later)
INSTAGRAM_ACCESS_TOKEN=
TWITTER_API_KEY=
```

### 2.2 Supabase Client Setup
```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// lib/supabase/server.ts (for server-side operations)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
```

### 2.3 TypeScript Interfaces
```typescript
// lib/types/blog.ts
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
```

## Step 3: Database Schema Setup

### 3.1 Supabase SQL Schema
Run this in your Supabase SQL editor:

```sql
-- Blog Posts Table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  state VARCHAR(50) NOT NULL,
  week_number INTEGER NOT NULL,
  read_time INTEGER DEFAULT 5,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  seo_meta_description TEXT,
  seo_keywords TEXT[],
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE
);

-- Beer Reviews Table
CREATE TABLE beer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  brewery_name VARCHAR(255) NOT NULL,
  beer_name VARCHAR(255) NOT NULL,
  beer_style VARCHAR(100) NOT NULL,
  abv DECIMAL(4,2),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  tasting_notes TEXT,
  unique_feature TEXT,
  brewery_story TEXT,
  brewery_location VARCHAR(255),
  image_url TEXT,
  day_of_week INTEGER CHECK (day_of_week >= 1 AND day_of_week <= 7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Posts Table
CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beer_review_id UUID REFERENCES beer_reviews(id),
  platform VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  hashtags TEXT[],
  scheduled_time TIMESTAMP WITH TIME ZONE,
  posted_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'posted', 'failed')),
  engagement_metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  preferences JSONB DEFAULT '{"weekly_digest": true, "state_updates": true}'
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_state ON blog_posts(state);
CREATE INDEX idx_blog_posts_week ON blog_posts(week_number);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at);
CREATE INDEX idx_beer_reviews_blog_post ON beer_reviews(blog_post_id);
CREATE INDEX idx_social_posts_scheduled ON social_posts(scheduled_time);
```

### 3.2 Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE beer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can read published blog posts" ON blog_posts
  FOR SELECT USING (published_at IS NOT NULL);

CREATE POLICY "Public can read beer reviews" ON beer_reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM blog_posts 
      WHERE blog_posts.id = beer_reviews.blog_post_id 
      AND blog_posts.published_at IS NOT NULL
    )
  );

-- Admin full access (you'll set up auth later)
CREATE POLICY "Admin full access to blog_posts" ON blog_posts
  FOR ALL USING (auth.role() = 'service_role');
```

## Step 4: Basic UI Components

### 4.1 Tailwind Configuration
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        beer: {
          amber: '#F59E0B',
          gold: '#D97706',
          brown: '#78350F',
          cream: '#FEF3C7',
          dark: '#451A03',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
export default config
```

### 4.2 Global Styles
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-beer-cream text-beer-dark;
  }
}

@layer components {
  .btn-primary {
    @apply bg-beer-amber hover:bg-beer-gold text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200;
  }
}
```

## Next Steps for Phase 2
- Create landing page components
- Build blog listing and detail pages
- Set up basic navigation
- Create admin dashboard layout

## Cursor Prompts to Run

Copy these prompts into Cursor to accelerate development:

### Prompt 1: Landing Page
```
Create a stunning landing page for the beer blog with:
- Hero section featuring Hop Harrison introduction
- Featured blog posts grid
- About section
- Newsletter signup
- Responsive design with beer-themed colors
- Smooth animations and hover effects
```

### Prompt 2: Blog Components
```
Build blog system components:
- BlogPostCard for listing pages
- BlogPost detail page with SEO
- BeerReviewCard components
- Navigation with mobile menu
- Footer with social links
```
