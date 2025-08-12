# State Page Creation Guide

This guide explains how to create new state pages that automatically follow the dynamic daily beer publishing system.

## Overview

All state pages should use the dynamic beer publishing system to show only published beers rather than hardcoded arrays. This ensures the proper daily schedule is maintained across all states.

## Key Components

### 1. DynamicBeerSection
**File**: `/src/components/states/DynamicBeerSection.tsx`

This component automatically:
- Fetches published beers from the database via API
- Shows loading states and progress messaging
- Handles different state statuses (upcoming, current, completed)
- Displays publication schedule information

### 2. Generic API Endpoint
**File**: `/src/app/api/states/[stateCode]/published-beers/route.ts`

This API endpoint:
- Works for any state code (AL, AK, AZ, etc.)
- Returns only beers with `published_at` timestamps
- Provides metadata about publication progress

### 3. StatePageTemplate (Optional)
**File**: `/src/components/states/StatePageTemplate.tsx`

A complete page template that includes:
- SEO metadata
- Hero section
- Brewing facts and stats
- Story content
- Dynamic beer section
- CTA section

## Creating a New State Page

### Option 1: Using the Template (Recommended)

```tsx
// src/app/states/arizona/page.tsx
'use client'

import { Mountain, Cactus, Sun } from 'lucide-react'
import StatePageTemplate from '@/components/states/StatePageTemplate'

export default function ArizonaPage() {
  const arizonaImageMapping = {
    'Desert IPA': '/images/Beer images/Arizona/Desert-IPA.png',
    'Prickly Pear Wheat': '/images/Beer images/Arizona/Prickly-Pear.png',
    // Add more beer name to image path mappings
  }

  const brewingFacts = [
    {
      icon: <Cactus className="w-8 h-8 text-orange-600" />,
      title: "123 Active Breweries",
      description: "Desert oasis of craft brewing with year-round outdoor drinking culture"
    },
    {
      icon: <Sun className="w-8 h-8 text-orange-600" />,
      title: "330+ Days of Sunshine",
      description: "Perfect climate for patio drinking and outdoor brewery experiences"
    },
    {
      icon: <Mountain className="w-8 h-8 text-orange-600" />,
      title: "Unique Desert Ingredients",
      description: "Prickly pear, agave, and desert botanicals create distinctive flavors"
    }
  ]

  return (
    <StatePageTemplate
      stateCode="AZ"
      stateName="Arizona"
      weekNumber={3}
      heroImage="/images/State Images/Arizona.png"
      brewingFacts={brewingFacts}
      storyContent={{
        title: "Arizona's Desert Brewing Oasis",
        subtitle: "Craft beer thrives in the desert with innovative brewing and year-round outdoor culture",
        description: "Discover Arizona's remarkable craft beer scene, from desert ingredient innovation to the state's thriving beer tourism industry.",
        paragraphs: [
          "Arizona's craft beer scene has exploded over the past decade, with breweries taking advantage of the state's year-round outdoor drinking climate and unique desert ingredients.",
          "From Flagstaff's mountain breweries to Phoenix's urban beer gardens, Arizona offers one of America's most diverse brewing landscapes."
        ],
        didYouKnow: "Arizona breweries are pioneering the use of desert botanicals like prickly pear cactus, creating unique flavor profiles you can't find anywhere else."
      }}
      brewingStats={{
        breweries: "123",
        economic: "$285M",
        ranking: "#15 Nationally",
        perCapita: "4.2 Gallons"
      }}
      uniqueIngredients={[
        "Prickly Pear Cactus (Natural Colors)",
        "Desert Sage and Botanicals",
        "Agave Nectar (Local Sweetener)",
        "Mesquite-Smoked Malt"
      ]}
      imagePathMapping={arizonaImageMapping}
      gradientFrom="orange-900"
      gradientTo="red-800"
      themeColor="orange"
    />
  )
}
```

### Option 2: Custom Page with DynamicBeerSection

```tsx
// src/app/states/newstate/page.tsx
'use client'

import DynamicBeerSection from '@/components/states/DynamicBeerSection'
import { /* other imports */ } from 'lucide-react'

export default function NewStatePage() {
  const imageMapping = {
    'Beer Name': '/images/Beer images/NewState/beer-image.png',
    // Map beer names to their image paths
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Your custom hero section, story, etc. */}
      
      {/* Dynamic Beer Section - REQUIRED */}
      <DynamicBeerSection
        stateCode="NS"  // Two-letter state code
        stateName="New State"
        title="Custom Beer Section Title"
        description="Custom description for this state's beers"
        imagePathMapping={imageMapping}
        fallbackDescription="Exceptional craft beer from New State's brewing scene."
      />
      
      {/* Your custom CTA section, etc. */}
    </div>
  )
}
```

## Important Rules

### ❌ DO NOT DO THIS (Hardcoded Beers)
```tsx
// WRONG - Shows all beers immediately
const stateBeers = [
  { name: 'Beer 1', brewery: 'Brewery 1' },
  { name: 'Beer 2', brewery: 'Brewery 2' },
  // ... all 7 beers shown at once
]

return (
  <div>
    {stateBeers.map(beer => <BeerCard key={beer.name} beer={beer} />)}
  </div>
)
```

### ✅ DO THIS (Dynamic Publishing)
```tsx
// CORRECT - Shows only published beers based on daily schedule
import DynamicBeerSection from '@/components/states/DynamicBeerSection'

return (
  <DynamicBeerSection
    stateCode="AZ"
    stateName="Arizona"
    imagePathMapping={imageMapping}
  />
)
```

## Database Requirements

For the dynamic system to work, each state needs:

1. **State Progress Record**: Entry in `state_progress` table with proper `state_code`
2. **Blog Post**: Associated blog post with proper `blog_post_id`
3. **Beer Reviews**: 7 beer reviews in `beer_reviews` table with:
   - `blog_post_id` linking to the state's blog post
   - `day_of_week` values 1-7 for daily scheduling
   - `published_at` set to null initially (populated by daily cron job)

## Beer Image Mapping

Create an object mapping exact beer names from the database to image paths:

```tsx
const imageMapping = {
  'Exact Beer Name from Database': '/images/Beer images/State/beer-image.png',
  'Another Beer Name': '/images/Beer images/State/another-beer.jpeg',
}
```

**Important**: The keys must match the `beer_name` field exactly as stored in the database.

## Daily Publishing Flow

1. **Daily Cron Job** (`/api/cron/daily-publish`) runs at 3 PM EST
2. **Finds today's beer** for the current state based on `day_of_week`
3. **Sets `published_at`** timestamp in the database
4. **State pages automatically update** to show the newly published beer

## Manual Publishing

Admins can manually trigger beer publishing via:
- Admin dashboard "Publish Today's Beer Now" button
- Direct API call to `/api/admin/trigger-daily-publish`

## Testing

To test a new state page:
1. Create the state page following this guide
2. Add some beer reviews to the database for testing
3. Use the admin trigger to publish beers manually
4. Verify the page shows published beers correctly
5. Verify unpublished beers are hidden

## Migration from Hardcoded Pages

If you have existing hardcoded pages:
1. Replace hardcoded beer arrays with `DynamicBeerSection`
2. Create the image mapping object
3. Remove custom beer fetching logic
4. Test the dynamic functionality
5. Ensure proper fallback messaging

This system ensures all states follow the same daily publishing schedule and prevents the issue of showing all 7 beers on day 1.