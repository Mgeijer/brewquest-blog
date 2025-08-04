# BrewQuest Chronicles - Supabase Migration Guide

## Overview
This guide documents the complete process for populating weekly state brewery data into the BrewQuest Chronicles Supabase database. This knowledge base was established during the Arizona Week 3 migration and should be referenced for all future state data loads.

## Database Schema

### Core Tables

#### 1. `state_progress` Table
**Purpose**: Tracks the completion status of each state's beer journey
**Columns**:
- `id`: UUID (auto-generated)
- `state_code`: VARCHAR(2) - Two-letter state code (e.g., 'AZ', 'AL', 'AK')
- `state_name`: VARCHAR - Full state name (e.g., 'Arizona', 'Alabama', 'Alaska')
- `status`: VARCHAR(20) - Status values: 'current', 'upcoming', 'completed'
- `week_number`: INTEGER - Sequential week number (1, 2, 3, etc.)
- `blog_post_id`: UUID - References blog post entry
- `completion_date`: TIMESTAMP (nullable)
- `featured_breweries`: JSON (nullable)
- `total_breweries`: INTEGER - Total breweries in the state
- `featured_beers_count`: INTEGER - Number of featured beers (typically 7)
- `region`: VARCHAR(20) - Geographic region (e.g., 'southwest', 'southeast')
- `description`: TEXT - State brewing scene description
- `journey_highlights`: JSON (nullable)
- `difficulty_rating`: INTEGER (nullable)
- `research_hours`: INTEGER (default 0)
- `created_at`: TIMESTAMP (auto)
- `updated_at`: TIMESTAMP (auto)

#### 2. `beer_reviews` Table
**Purpose**: Stores individual beer reviews for each day of the week
**Columns**:
- `id`: UUID (auto-generated)
- `blog_post_id`: UUID (nullable)
- `brewery_name`: VARCHAR - Full brewery name
- `beer_name`: VARCHAR - Beer name
- `beer_style`: VARCHAR - Beer style (e.g., 'American IPA', 'Porter')
- `abv`: NUMERIC - Alcohol by volume percentage
- `rating`: INTEGER - Rating out of 5
- `tasting_notes`: TEXT - Detailed tasting description
- `unique_feature`: TEXT - What makes this beer special
- `brewery_story`: TEXT - Background story about the brewery
- `brewery_location`: VARCHAR - City, State format
- `image_url`: VARCHAR - Path to beer image
- `day_of_week`: INTEGER - 1=Monday, 2=Tuesday, ..., 7=Sunday
- `state_code`: VARCHAR(2) - **FOREIGN KEY** to state_progress
- `state_name`: VARCHAR - Full state name
- `week_number`: INTEGER - Must match state_progress entry
- `ibu`: INTEGER (nullable) - International Bitterness Units
- `description`: TEXT - Brief description for the day
- `status`: VARCHAR - Typically 'published'
- `created_at`: TIMESTAMP (auto)
- `updated_at`: TIMESTAMP (auto)

### Critical Foreign Key Constraint
⚠️ **IMPORTANT**: The `beer_reviews` table has a foreign key constraint `fk_beer_reviews_state_code` that references the `state_progress` table. You **MUST** create the state_progress entry before inserting beer_reviews.

## Migration Process

⚠️ **CRITICAL REQUIREMENT**: When migrating a new state, you must populate **THREE** tables in order:
1. `state_progress` (foreign key requirement)
2. `brewery_features` (website/social media data for linking)
3. `beer_reviews` (daily beer content)

### Step 1: Environment Setup
```javascript
const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
```

### Step 2: Create State Progress Entry
**MUST BE DONE FIRST** to satisfy foreign key constraints.

```javascript
const stateProgressEntry = {
  state_code: 'AZ', // Two letters only
  state_name: 'Arizona',
  status: 'upcoming', // or 'current', 'completed'
  week_number: 3,
  blog_post_id: 'generate-uuid-here', // Use crypto.randomUUID()
  completion_date: null,
  featured_breweries: null,
  total_breweries: 100, // Approximate count
  featured_beers_count: 7,
  region: 'southwest', // Keep under 20 chars
  description: "Brief description under 200 chars",
  journey_highlights: null,
  difficulty_rating: 3, // 1-5 scale
  research_hours: 0
}

const { data, error } = await supabase
  .from('state_progress')
  .insert(stateProgressEntry)
```

### Step 3: Create Brewery Features Entries
**MUST BE DONE** to populate brewery websites and social media for linking/tagging.

```javascript
const breweryFeatures = [
  {
    state_code: 'AZ',
    brewery_name: 'Four Peaks Brewing Company',
    brewery_type: 'microbrewery',
    city: 'Tempe',
    address: '1340 E 8th St, Tempe, AZ 85281', // Optional but recommended
    website_url: 'https://fourpeaks.com',
    founded_year: 1996,
    specialty_styles: 'Scottish-Style Ale,American IPA,Pale Ale', // Comma-separated string
    signature_beers: 'Kilt Lifter,Hop Knot IPA,Peach Ale', // Comma-separated string  
    brewery_description: 'Arizona\'s brewing pioneer, Four Peaks opened in 1996...',
    why_featured: 'Arizona\'s first major craft brewery, pioneering desert brewing since 1996',
    visit_priority: 1, // 1-7 ranking
    social_media: {
      instagram: 'fourpeaksbrewing',
      twitter: 'fourpeaksbeer', 
      facebook: 'FourPeaksBrewing'
    },
    awards: 'Great American Beer Festival medals, Arizona Beer Competition winners', // String, not array
    taproom_info: 'Original Tempe location with full restaurant and brewery tours',
    featured_week: 3,
    is_active: true
  }
  // ... 6 more brewery entries (must have 7 total for complete week)
]

const { data, error } = await supabase
  .from('brewery_features')
  .insert(breweryFeatures)
```

### Step 4: Create Beer Reviews Entries
Create 7 entries for Monday-Sunday (day_of_week: 1-7)

```javascript
const beerReviews = [
  {
    brewery_name: 'Four Peaks Brewing Company',
    beer_name: 'Kilt Lifter',
    beer_style: 'Scottish-Style Ale',
    abv: 6.0,
    rating: 4, // 1-5 scale
    tasting_notes: 'Detailed flavor profile...',
    unique_feature: 'What makes this beer special',
    brewery_story: 'Background about the brewery',
    brewery_location: 'Tempe, Arizona',
    image_url: '/images/Beer images/Arizona/Four Peaks Kilt Lifter.jpg',
    day_of_week: 1, // Monday
    state_code: 'AZ', // MUST match state_progress entry
    state_name: 'Arizona',
    week_number: 3, // MUST match state_progress entry
    ibu: 25, // Optional
    description: 'Day-specific description',
    status: 'published'
  }
  // ... 6 more entries for days 2-7
]

const { data, error } = await supabase
  .from('beer_reviews')
  .insert(beerReviews)
```

## Complete Migration Script Template

```javascript
#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateStateData(stateCode, stateName, weekNumber, breweryData, breweryFeatures) {
  try {
    // Step 1: Create state_progress entry
    const stateProgress = {
      state_code: stateCode,
      state_name: stateName,
      status: 'upcoming',
      week_number: weekNumber,
      blog_post_id: require('crypto').randomUUID(),
      total_breweries: 100, // Adjust as needed
      featured_beers_count: 7,
      region: 'region-name', // Keep under 20 chars
      description: "State brewing description",
      difficulty_rating: 3,
      research_hours: 0
    }

    const { error: stateError } = await supabase
      .from('state_progress')
      .insert(stateProgress)

    if (stateError) throw new Error(`State progress failed: ${stateError.message}`)

    // Step 2: Create brewery_features entries
    const { error: breweryError } = await supabase
      .from('brewery_features')
      .insert(breweryFeatures)

    if (breweryError) throw new Error(`Brewery features failed: ${breweryError.message}`)

    // Step 3: Create beer_reviews entries
    const { error: reviewError } = await supabase
      .from('beer_reviews')
      .insert(breweryData)

    if (reviewError) throw new Error(`Beer reviews failed: ${reviewError.message}`)

    // Step 4: Verify
    const { data: verification } = await supabase
      .from('beer_reviews')
      .select('*')
      .eq('state_code', stateCode)
      .eq('week_number', weekNumber)
      .order('day_of_week')

    console.log(`✅ Migration complete: ${verification.length} entries created`)
    return { success: true, count: verification.length }

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    return { success: false, error: error.message }
  }
}
```

## Data Standards

### Beer Review Structure
Each beer review should include:
- **Brewery Name**: Full legal name
- **Beer Name**: Official beer name
- **Beer Style**: Standard BJCP style when possible
- **ABV**: Accurate percentage (verify with brewery)
- **Rating**: 1-5 scale based on quality and uniqueness
- **Tasting Notes**: 100-200 characters describing flavor profile
- **Unique Feature**: What makes this beer/brewery special (50-100 chars)
- **Brewery Story**: Background context (200-300 characters)
- **Location**: "City, State" format
- **Image**: Path to beer image in `/images/Beer images/[State]/[Beer Name].jpg`

### State Selection Criteria
For each week, select 7 breweries that represent:
1. **Geographic Diversity**: Different regions within the state
2. **Style Diversity**: Mix of IPA, stout, lager, specialty styles
3. **Historical Significance**: Include pioneering breweries
4. **Current Innovation**: Modern creative breweries
5. **Local Character**: Breweries that embody state culture

### Content Themes by Day
- **Monday**: State overview/pioneering brewery
- **Tuesday**: Environmental/sustainability focus
- **Wednesday**: Creative/specialty beer
- **Thursday**: Classic style done exceptionally
- **Friday**: Popular/approachable beer
- **Saturday**: Scenic/destination brewery
- **Sunday**: Adventure/outdoor-themed brewery

## Common Pitfalls & Solutions

### 1. Foreign Key Constraint Errors
**Problem**: `violates foreign key constraint "fk_beer_reviews_state_code"`
**Solution**: Always create `state_progress` entry first

### 2. UUID Format Errors
**Problem**: `invalid input syntax for type uuid`
**Solution**: Use `require('crypto').randomUUID()` for blog_post_id

### 3. Character Limit Errors
**Problem**: `value too long for type character varying(20)`
**Solution**: Check these fields:
- `region`: Max 20 characters
- `status`: Use 'upcoming', 'current', 'completed'
- `state_code`: Exactly 2 characters

### 4. Missing Environment Variables
**Problem**: Supabase connection fails
**Solution**: Ensure `.env.local` contains:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Verification Steps

After each migration:

1. **Check State Progress**:
```javascript
const { data } = await supabase
  .from('state_progress')
  .select('*')
  .eq('state_code', 'AZ')
```

2. **Check Beer Reviews**:
```javascript
const { data } = await supabase
  .from('beer_reviews')
  .select('*')
  .eq('state_code', 'AZ')
  .order('day_of_week')
```

3. **Check Brewery Features**:
```javascript
const { data } = await supabase
  .from('brewery_features')
  .select('brewery_name, website_url, social_media')
  .eq('state_code', 'AZ')
  .order('visit_priority')
```

4. **Verify Cross-Links**:
```javascript
const { data } = await supabase
  .from('beer_reviews')
  .select('brewery_name, beer_name, day_of_week')
  .eq('week_number', 3)
  .order('day_of_week')
```

## Current Database Status

As of Arizona Week 3 migration:
- **Alabama (AL)**: Week 1 ✅ (Complete with locations, websites, social media)
- **Alaska (AK)**: Week 2 ✅ (Complete with locations, websites, social media)  
- **Arizona (AZ)**: Week 3 ✅ (Complete with locations, websites, social media)

### Populated Tables:
- `beer_reviews`: 21 records (7 per state)
- `state_progress`: 3 records (1 per state)
- `blog_posts`: 3 records (1 per state)
- `brewery_features`: 21 records (7 per state with complete website/social data)
- `state_analytics`: 3 records (basic tracking per state)
- `newsletter_subscribers`: Active subscriptions
- `social_posts`: Table exists but managed manually

## Files and Scripts

Reference these files for future migrations:
- `arizona-complete-migration.js` - Complete migration template
- `add-arizona-brewery-final.js` - Successful brewery_features script template
- `check-supabase-schema.js` - Schema verification tool
- `check-state-progress.js` - State progress checker
- `supabase-comprehensive-fix.js` - Multi-table fix script
- `SUPABASE_MIGRATION_GUIDE.md` - This guide

## Next Steps Template

For future state migrations:
1. Research state breweries and select 7 representative breweries
2. Create social media content
3. Download beer images
4. Create migration script based on template above
5. Execute migration with state_progress entry first
6. Verify all data and cross-links
7. Update this guide with any new findings

---

*Last Updated: August 2, 2025 - Arizona Week 3 Migration*
*Next State: TBD - Week 4*