# State Page Template - Alabama Format Standard

This document defines the **mandatory structure** for all state beer review pages in the BrewQuest Chronicles project. **Alabama's page structure is the master template** that all other state pages must follow exactly.

## ✅ Required Structure Overview

All state pages must follow this **exact structure** based on `src/app/states/alabama/page.tsx`:

### 1. **Imports & Setup**
```typescript
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Star, ExternalLink, ArrowLeft } from 'lucide-react'
import { getStateByCode } from '@/lib/data/stateProgress'
import BeerReviewCard from '@/components/blog/BeerReviewCard'
```

### 2. **Component Structure**
```typescript
export default function [StateName]WeeklyPage() {
  const [currentDay, setCurrentDay] = useState(7) // or dynamic calculation
  const stateState = getStateByCode('[CODE]')
  
  // Day calculation logic
  useEffect(() => {
    // Alabama logic for completed/current/upcoming states
  }, [stateState])
  
  // Helper functions
  const getBreweryWebsite = (breweryName: string): string | null => { /* */ }
  const getBreweryDescription = (breweryName: string): string => { /* */ }
  
  return (
    // JSX structure below
  )
}
```

## 🎯 **Page Layout Sections (Mandatory Order)**

### **Section 1: Navigation**
```typescript
{/* Navigation */}
<div className="bg-white border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <Link href="/blog" className="inline-flex items-center gap-2 text-beer-amber hover:text-beer-gold transition-colors">
      <ArrowLeft className="w-4 h-4" />
      Back to Blog
    </Link>
  </div>
</div>
```

### **Section 2: Hero Section**
- **State-specific gradient colors**
- **Week number badge** with completion status
- **State title** with descriptive tagline
- **Metadata**: publish date, read time, state name
- **Background image**: `/images/State Images/[StateName].png`

### **Section 3: Week Progress Indicator**
```typescript
<div className="bg-white rounded-xl p-6 mb-8 border border-[state-color]/20">
  <h2 className="text-xl font-bold text-beer-dark">Week Progress</h2>
  <span className="text-sm text-gray-600">
    Day {currentDay} of 7 • {availableBeers.length} beers tasted
  </span>
  {/* 7-day grid with beer emojis */}
  {/* Progress bar */}
</div>
```

### **Section 4: Weekly Article Content**
```typescript
<article className="bg-white rounded-xl p-8 mb-8">
  <div className="prose prose-lg max-w-none">
    <h1>Welcome to [State]: [Brewing Story Title]</h1>
    
    {/* Highlighted intro paragraph */}
    <div className="bg-[state-color]/10 border-l-4 border-[state-color] p-6 mb-8 rounded-r-lg">
      <p className="text-lg text-beer-dark font-medium">
        [State brewing introduction]
      </p>
    </div>

    {/* State landscape image */}
    <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
      <Image src="/images/State Images/[State].png" alt="[State] State Landscape" fill className="object-cover" />
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
        <p className="text-sm font-medium text-gray-900">[Image caption about state brewing]</p>
      </div>
    </div>

    <h2>A State [Transformed/Forged] by [Craft/Innovation]</h2>
    {/* Historical paragraph about brewing in state */}
    
    <h2>What Makes [State] Beer Special</h2>
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {/* 3 special characteristics cards */}
    </div>

    <h2>This Week's Journey</h2>
    {/* Daily schedule grid */}
    
    <h2>Supporting [State] Breweries</h2>
    {/* Closing paragraph about supporting local */}
  </div>
</article>
```

### **Section 5: Beer Reviews Section (CRITICAL)**
```typescript
<div className="bg-white rounded-xl p-8">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-beer-dark">
      Featured Beers {!isWeekComplete && `(So Far)`}
    </h2>
    <span className="text-sm text-gray-600">
      {availableBeers.length} of 7 beers reviewed
    </span>
  </div>

  {/* BeerReviewCard grid - MANDATORY COMPONENT */}
  <div className="grid md:grid-cols-2 gap-6">
    {availableBeers.map((beer) => (
      <BeerReviewCard
        key={beer.id}
        review={{
          id: beer.id,
          beer_name: beer.name,
          brewery_name: beer.brewery,
          beer_style: beer.style,
          abv: beer.abv,
          ibu: beer.ibu,
          rating: beer.rating,
          tasting_notes: beer.tastingNotes,
          image_url: beer.imageUrl,
          unique_feature: beer.description,
          brewery_location: stateState.name,
          brewery_website: getBreweryWebsite(beer.brewery),
          brewery_story: getBreweryDescription(beer.brewery),
          day_of_week: beer.dayOfWeek,
          created_at: new Date()
        }}
        size="large"
      />
    ))}
  </div>

  {/* Coming Tomorrow / Week Complete sections */}
</div>
```

## 📋 **Required Helper Functions**

### **getBreweryWebsite Function**
```typescript
const getBreweryWebsite = (breweryName: string): string | null => {
  const breweryWebsites: Record<string, string> = {
    '[Brewery Name]': 'https://brewery-website.com',
    // Must include ALL 7 breweries for the state
  }
  return breweryWebsites[breweryName] || null
}
```

### **getBreweryDescription Function**
```typescript
const getBreweryDescription = (breweryName: string): string => {
  const breweryDescriptions: Record<string, string> = {
    '[Brewery Name]': 'Founded in [year] in [city], [Brewery Name] is [state]\'s [description]. Their mission is [mission]. Known for [achievement/signature beer], [additional context about brewing philosophy or local impact].',
    // Must be detailed like Alabama examples - include:
    // - Founding year and location
    // - Mission/philosophy
    // - Signature achievement or beer
    // - Local impact or unique characteristics
  }
  return breweryDescriptions[breweryName] || `${breweryName} is one of [State]'s craft beer pioneers, contributing to the state's [brewing renaissance/unique culture].`
}
```

## 🎨 **Styling Requirements**

### **Color Schemes by State**
- **Alabama**: `beer-amber`, `beer-gold`, `beer-dark`
- **Alaska**: `slate-900`, `blue-900`, `slate-800`  
- **Arizona**: `red-600`, `orange-500`, `red-500`
- **Arkansas**: TBD (follow pattern)

### **Progress Indicators**
- 7-day grid with beer emoji 🍺 for completed days
- Hourglass emoji ⏳ for upcoming days
- Current day should have `animate-pulse` class
- State-specific color for progress bar

### **Image Requirements**
- **Hero background**: `/images/State Images/[StateName].png`
- **Beer images**: `/images/Beer images/[StateName]/[BeerName].png`
- All images must exist in the file system

## ⚠️ **Critical Requirements**

### **NEVER Use These Components**
- ❌ `DynamicBeerSection` (deprecated)
- ❌ `StaticBeerSection` (deprecated)
- ❌ Custom beer display components

### **ALWAYS Use These Components**
- ✅ `BeerReviewCard` (mandatory for all beer displays)
- ✅ Standard progress indicators
- ✅ Consistent navigation structure

### **Data Integration**
- Must use `getStateByCode()` function
- Must filter beers by `dayOfWeek <= currentDay`
- Must handle completed/current/upcoming state status
- Must include proper brewery websites and descriptions

### **Content Requirements**
- State-specific brewing history (minimum 2 paragraphs)
- 3 unique characteristics that make state brewing special
- Daily brewery schedule (Monday-Sunday mapping)
- Supporting local breweries section
- Proper week progress tracking

## 📁 **File Naming Convention**

- **Page file**: `src/app/states/[statename]/page.tsx`
- **State images**: `/images/State Images/[StateName].png`
- **Beer images**: `/images/Beer images/[StateName]/[BeerName].png`
- **Component name**: `[StateName]WeeklyPage`

## 🔍 **Quality Checklist**

Before completing any state page, verify:

- [ ] Uses exact Alabama page structure
- [ ] All 7 beer images exist and load correctly
- [ ] BeerReviewCard components display properly
- [ ] Brewery websites are clickable and accurate
- [ ] Brewery descriptions are detailed (Alabama-length)
- [ ] Progress tracking works for current day
- [ ] State-specific color scheme applied
- [ ] Navigation links work correctly
- [ ] Article content is comprehensive
- [ ] No deprecated components used

## 🚨 **Non-Negotiable Standards**

1. **Alabama format is LAW** - no deviations allowed
2. **BeerReviewCard is mandatory** - no custom components
3. **All 7 beers must have images** - no broken image links
4. **Brewery info must be complete** - websites + detailed descriptions
5. **Progress tracking must work** - proper day calculation
6. **Article content must be comprehensive** - minimum Alabama length

---

**Remember**: Every state page is a representative of the BrewQuest Chronicles brand. Consistency and quality are non-negotiable. When in doubt, reference Alabama's implementation as the source of truth.