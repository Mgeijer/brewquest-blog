# BrewQuest Chronicles Database Setup

This guide will help you set up the complete database schema for the BrewQuest Chronicles 50-state beer journey blog.

## Quick Setup

### 1. Environment Variables
Ensure you have these environment variables set:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Run Database Setup
Execute the automated setup:
```bash
curl -X POST http://localhost:3000/api/setup-database
```

Or visit: `http://localhost:3000/api/setup-database` and click the POST button.

### 3. Verify Setup
Check that everything is working:
```bash
curl http://localhost:3000/api/verify-database
```

## What Gets Created

### Core Tables
- **blog_posts** - Main blog posts for each state
- **beer_reviews** - Individual beer reviews (7 per state)
- **state_progress** - Track completion status for all 50 states
- **state_analytics** - User interaction tracking
- **brewery_features** - Detailed brewery information
- **journey_milestones** - Achievement tracking

### Supporting Tables
- **social_posts** - Social media content management
- **newsletter_subscribers** - Email list management
- **page_analytics** - Website analytics
- **social_campaigns** - Campaign management

### Initial Data
- All 50 US states populated with metadata
- Alabama set as current state (Week 1)
- 7 Alabama beer reviews with complete data
- 3 featured Alabama breweries
- Sample analytics data
- Launch milestone created

## Database Features

### Performance Optimizations
- Comprehensive indexing for blog queries
- Materialized views for analytics
- GIN indexes for array/JSON searches
- Partitioning-ready for future scaling

### Security
- Row Level Security (RLS) enabled
- Public read access for published content
- Admin policies ready for authentication
- Audit trail for all changes

### Real-time Features
- Supabase real-time subscriptions enabled
- Live analytics tracking
- Real-time progress updates

### Functions
- `get_journey_statistics()` - Complete journey stats
- `get_current_journey_week()` - Current week calculation
- `get_database_health()` - Health monitoring
- `refresh_state_progress_views()` - View maintenance

## Testing the Setup

### 1. Check State Data
```bash
# Get all states
curl http://localhost:3000/api/states

# Get Alabama specifically
curl http://localhost:3000/api/states/AL
```

### 2. Verify Functions Work
```bash
# Run verification tests
curl http://localhost:3000/api/verify-database
```

### 3. Test the Blog
- Visit `/states/alabama` to see the populated data
- Use the interactive map to track analytics
- Check that beer reviews display properly

## Manual Setup (If Needed)

If the automated setup doesn't work, you can run the SQL files manually:

### 1. Complete Schema
Run: `src/lib/supabase/schema/complete-brewquest-schema.sql`

### 2. Alabama Data
Run: `src/lib/supabase/schema/populate-alabama-data.sql`

## Troubleshooting

### Common Issues

**"Function doesn't exist" errors:**
- The automated setup creates all necessary functions
- Some functions may need to be created manually in Supabase dashboard

**"Table doesn't exist" errors:**
- Run the complete schema setup first
- Check Supabase permissions

**"RLS policy" errors:**
- Policies are included in the schema
- May need to disable RLS temporarily for testing

**Connection errors:**
- Verify environment variables
- Check Supabase project status
- Ensure service role key has proper permissions

### Getting Help

1. Check the setup API response for detailed error messages
2. Run the verification endpoint to see which components are working
3. Check Supabase logs in the dashboard
4. Look at browser console for client-side errors

## Next Steps After Setup

1. **Content Creation**: Start adding beer reviews for other states
2. **Blog Posts**: Create blog post content for completed states  
3. **Social Media**: Set up social media automation
4. **Analytics**: Monitor user engagement with the interactive map
5. **SEO**: Optimize blog posts for search engines
6. **Email**: Set up newsletter campaigns

## Database Schema Overview

```
blog_posts (main content)
├── beer_reviews (7 per state)
├── state_progress (journey tracking)
├── brewery_features (brewery details)
└── journey_milestones (achievements)

Analytics & Engagement
├── state_analytics (map interactions)
├── page_analytics (website visits)
└── map_interactions (legacy support)

Social & Marketing
├── social_posts (automated posting)
├── social_campaigns (campaign management)
├── newsletter_subscribers (email list)
└── newsletter_campaigns (email content)

Administration
├── state_progress_audit (change tracking)
└── map_interaction_summary (materialized view)
```

## Success Criteria

After setup, you should have:
- ✅ All 50 states in the database
- ✅ Alabama set as current state
- ✅ 7 Alabama beer reviews populated
- ✅ 3 Alabama brewery features
- ✅ All database functions working
- ✅ RLS policies enabled
- ✅ Real-time subscriptions active
- ✅ Sample analytics data
- ✅ Launch milestone created

The blog should be fully functional with Alabama content ready for visitors!