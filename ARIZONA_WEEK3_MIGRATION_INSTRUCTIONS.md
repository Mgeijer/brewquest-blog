# Arizona Week 3 Migration Instructions

## Overview
This document provides complete instructions for populating Arizona Week 3 brewery and beer data into your Supabase database.

## Migration Data Summary
- **State**: Arizona (Week 3)
- **Dates**: August 11-17, 2025
- **Breweries**: 7 
- **Beers**: 7
- **Reviews**: 7 (one per day)
- **State Progress**: 1 record

## Step 1: Execute Migration SQL

### Option A: Supabase SQL Editor (Recommended)
1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the entire contents of `arizona-week3-supabase-migration.sql`
4. Paste into the SQL Editor
5. Click "Run" to execute

### Option B: Command Line (if environment configured)
```bash
node execute-arizona-migration-direct.js
```

## Step 2: Verify Migration Success

Execute the verification queries in `verify-arizona-migration.sql` to confirm:

### Expected Results:
- ✅ **7 Arizona breweries** added to `breweries` table
- ✅ **7 Arizona beers** added to `beers` table  
- ✅ **7 beer reviews** added to `beer_reviews` table (state='Arizona', week_number=3)
- ✅ **1 state progress** record added to `state_progress` table

## Arizona Week 3 Schedule

| Day | Date | Brewery | Beer | Style | ABV |
|-----|------|---------|------|-------|-----|
| Monday | 2025-08-11 | Four Peaks Brewing Company | Kilt Lifter | Scottish-Style Ale | 6.0% |
| Tuesday | 2025-08-12 | Arizona Wilderness Brewing Company | Refuge IPA | American IPA | 6.8% |
| Wednesday | 2025-08-13 | Historic Brewing Company | Piehole Porter | Porter | 5.5% |
| Thursday | 2025-08-14 | Dragoon Brewing Company | Dragoon IPA | West Coast IPA | 7.3% |
| Friday | 2025-08-15 | SanTan Brewing Company | Devil's Ale | American Pale Ale | 5.5% |
| Saturday | 2025-08-16 | Oak Creek Brewery | Nut Brown Ale | English Brown Ale | 5.5% |
| Sunday | 2025-08-17 | Mother Road Brewing Company | Tower Station IPA | American IPA | 6.8% |

## Database Schema Requirements

The migration assumes these tables exist:
- `breweries` (id, name, location, founded, description, website, image_url)
- `beers` (id, brewery_id, name, style, abv, ibu, description, image_url)
- `beer_reviews` (id, beer_id, author, rating, review_text, review_date, featured_image_url, day_of_week, week_number, state)
- `state_progress` (id, state_name, week_number, status, start_date, completion_date, breweries_featured, beers_reviewed, progress_percentage, featured_image_url, hero_description)

## Content Features

### Arizona Brewing Themes:
- 🌵 **Desert Brewing Innovation**: Unique challenges and opportunities
- 💧 **Water Conservation**: Environmental sustainability in arid climate  
- 🏔️ **High-Altitude Brewing**: Flagstaff's 7,000-foot elevation effects
- 🛣️ **Route 66 Heritage**: Arizona's role in American adventure culture
- 🎨 **Arts & Culture**: Sedona's connection to brewing creativity

### Review Highlights:
- Four Peaks: Arizona's pioneering craft brewery (1996)
- Arizona Wilderness: 100% Arizona-grown Sinagua Malt sustainability
- Historic: Piehole Porter's liquid cherry pie experience
- Dragoon: Tucson's uncompromising quality-over-quantity philosophy
- SanTan: Playful irreverence of Arizona craft beer culture
- Oak Creek: Sedona's scenic brewing with red rock views
- Mother Road: Route 66 adventure beer celebrating westward exploration

## Troubleshooting

### Common Issues:
1. **Foreign key constraints**: Ensure breweries are inserted before beers
2. **Duplicate entries**: Migration uses ON CONFLICT DO NOTHING for safety
3. **Missing tables**: Run complete schema setup first
4. **Image paths**: Verify image assets exist in `/public/images/` directories

### Verification Queries:
Use the queries in `verify-arizona-migration.sql` to check each step.

## Files Included:
- `arizona-week3-supabase-migration.sql` - Complete migration script
- `verify-arizona-migration.sql` - Verification queries
- `execute-arizona-migration-direct.js` - Automated execution script
- `ARIZONA_WEEK3_MIGRATION_INSTRUCTIONS.md` - This document

## Success Criteria:
✅ All 7 Arizona breweries, beers, and reviews successfully inserted  
✅ State progress shows Arizona Week 3 as ready_for_publication  
✅ All foreign key relationships properly established  
✅ Content follows BrewQuest Chronicles quality standards