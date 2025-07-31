# Prompt 2 Implementation: Supabase Schema for Map Progress

## 🎯 Overview

This implementation creates a comprehensive database schema for tracking state progress, user interactions, brewery features, and journey milestones for the Hop Harrison 50-state beer journey.

## 📁 Files Created

### Database Schema
- **`src/lib/supabase/schema/stateProgress.sql`** - Complete SQL schema with tables, indexes, functions, triggers, and RLS policies

### TypeScript Functions
- **`src/lib/supabase/functions/stateProgressFunctions.ts`** - Comprehensive functions for managing state progress, analytics, brewery features, and journey milestones
- **`src/lib/supabase/queries/stateQueries.ts`** - Optimized query utilities for fetching and searching state data

### API Endpoints
- **`src/app/api/setup-state-schema/route.ts`** - Setup endpoint (provides instructions for manual schema execution)
- **`src/app/api/verify-state-schema/route.ts`** - Verification and initial data population endpoint
- **`src/app/api/database-health/route.ts`** - Database health monitoring and maintenance endpoint

## 🗄️ Database Tables

### 1. state_progress
**Purpose**: Track completion status and progress for each state in the 50-state journey

**Key Fields**:
- `state_code` (VARCHAR(2)) - Two-letter state code (primary identifier)
- `state_name` (VARCHAR(50)) - Full state name
- `status` (ENUM) - 'upcoming', 'current', 'completed'
- `week_number` (INTEGER) - Sequential week (1-50)
- `blog_post_id` (UUID) - Links to associated blog post
- `completion_date` (TIMESTAMP) - When state was completed
- `featured_breweries` (TEXT[]) - Array of featured brewery names
- `total_breweries` (INTEGER) - Total breweries researched
- `featured_beers_count` (INTEGER) - Number of featured beers
- `region` (VARCHAR(20)) - Geographic region
- `description` (TEXT) - State journey description
- `journey_highlights` (TEXT[]) - Key journey highlights
- `difficulty_rating` (INTEGER 1-5) - Research difficulty
- `research_hours` (INTEGER) - Hours spent on research

### 2. state_analytics
**Purpose**: Track user interactions with the interactive map

**Key Fields**:
- `state_code` (VARCHAR(2)) - References state_progress
- `interaction_type` (ENUM) - 'hover', 'click', 'navigation', 'tooltip_view', 'mobile_tap'
- `session_id` (VARCHAR(255)) - User session identifier
- `user_agent` (TEXT) - Browser information
- `device_type` (ENUM) - 'desktop', 'mobile', 'tablet', 'unknown'
- `source_page` (VARCHAR(100)) - Page where interaction occurred
- `duration_ms` (INTEGER) - Interaction duration
- `metadata` (JSONB) - Flexible interaction data
- `ip_address` (INET) - Anonymized IP for geographic analysis
- `referrer` (TEXT) - Traffic source

### 3. brewery_features
**Purpose**: Store detailed information about featured breweries per state

**Key Fields**:
- `state_code` (VARCHAR(2)) - References state_progress
- `brewery_name` (VARCHAR(200)) - Brewery name
- `brewery_type` (ENUM) - 'microbrewery', 'brewpub', 'large', 'regional', 'contract', 'proprietor'
- `city` (VARCHAR(100)) - Brewery location
- `website_url` (TEXT) - Brewery website
- `founded_year` (INTEGER) - Year brewery was founded
- `specialty_styles` (TEXT[]) - Beer styles they're known for
- `signature_beers` (TEXT[]) - Flagship beers
- `brewery_description` (TEXT) - About the brewery
- `why_featured` (TEXT) - Why this brewery was selected
- `visit_priority` (INTEGER 1-10) - Visit recommendation priority
- `social_media` (JSONB) - Social media links
- `awards` (TEXT[]) - Notable awards
- `capacity_barrels` (INTEGER) - Annual production capacity
- `taproom_info` (JSONB) - Taproom details
- `featured_week` (INTEGER) - Week brewery was featured

### 4. journey_milestones
**Purpose**: Track major events and achievements throughout the journey

**Key Fields**:
- `milestone_type` (ENUM) - Type of milestone achieved
- `title` (VARCHAR(200)) - Milestone title
- `description` (TEXT) - Detailed description
- `state_code` (VARCHAR(2)) - Associated state (optional)
- `week_number` (INTEGER) - Associated week
- `milestone_date` (TIMESTAMP) - When milestone was achieved
- `metric_value` (INTEGER) - Quantifiable achievement
- `metric_unit` (VARCHAR(50)) - What the metric represents
- `celebration_level` (ENUM) - 'minor', 'major', 'epic'
- `social_media_posted` (BOOLEAN) - Posted to social media
- `blog_post_id` (UUID) - Associated blog post
- `metadata` (JSONB) - Additional milestone data
- `is_public` (BOOLEAN) - Whether to show publicly

## 🔧 Setup Instructions

### Step 1: Execute SQL Schema
1. Open your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `src/lib/supabase/schema/stateProgress.sql`
4. Execute the SQL to create all tables, indexes, functions, and policies

### Step 2: Verify Schema
```bash
curl -X GET http://localhost:3000/api/verify-state-schema
```

### Step 3: Populate Initial Data
```bash
curl -X POST http://localhost:3000/api/verify-state-schema
```

## 🚀 Key Features

### Performance Optimizations (Enhanced by Supabase Specialist)
- **Composite Indexes**: Multi-column indexes for common query patterns
- **Partial Indexes**: Indexes only on active/public records for better performance
- **GIN Indexes**: Full-text search capabilities for arrays and JSONB fields
- **Materialized Views**: Pre-computed analytics summaries
- **Efficient Queries**: Optimized query functions with proper filtering
- **Bulk Operations**: Bulk insert/update functions for better performance
- **Connection Pooling**: Optimized for high-traffic scenarios

### Security Features
- **Row Level Security (RLS)**: All tables have appropriate access policies
- **Public Read Access**: State progress and brewery features visible to public
- **Admin Control**: Full CRUD access for authenticated admin users
- **Analytics Privacy**: Analytics data only accessible to admins

### Analytics Capabilities
- **Interaction Tracking**: Comprehensive map interaction analytics
- **Performance Metrics**: Engagement tracking and user behavior analysis
- **Geographic Insights**: IP-based geographic analysis (anonymized)
- **Device Analytics**: Mobile vs desktop usage patterns
- **Session Analysis**: User journey tracking across pages

### Data Relationships
- **Foreign Key Constraints**: Proper relationships between tables
- **Cascade Deletes**: Automatic cleanup of related records
- **Reference Integrity**: Maintains data consistency across tables

## 📊 Available Functions

### State Progress Management
- `getAllStateProgress()` - Get all state progress with filtering
- `getStateProgress(stateCode)` - Get specific state details
- `updateStateProgress(stateCode, updates)` - Update state information
- `completeState(stateCode, data)` - Mark state as completed
- `getCurrentJourneyWeek()` - Get current week number

### Analytics Functions
- `trackMapInteraction(interaction)` - Track user interactions
- `getStateAnalytics(stateCode, timeRange)` - Get interaction analytics
- `getMapInteractionSummary()` - Get aggregated analytics

### Brewery Management
- `getStateBreweries(stateCode)` - Get featured breweries for state
- `addBreweryFeature(brewery)` - Add new featured brewery
- `updateBreweryFeature(breweryId, updates)` - Update brewery information

### Journey Milestones
- `createJourneyMilestone(milestone)` - Create new milestone
- `getJourneyMilestones(filters)` - Get milestones with filtering

### Advanced Queries
- `getStateWithDetails(stateCode)` - Get state with breweries and blog data
- `getProgressByRegion()` - Get progress organized by region
- `getWeeklyTimeline(startWeek, endWeek)` - Get weekly progress timeline
- `getTopPerformingStates(limit)` - Get states by engagement
- `getStatesNeedingAttention()` - Get states requiring updates
- `searchStates(query)` - Search states by various criteria
- `getDashboardSummary()` - Get comprehensive dashboard data

### Real-time Functions (Supabase Specialist Enhanced)
- `subscribeToStateChanges(callback)` - Real-time state progress updates
- `subscribeToMilestoneChanges(callback)` - Real-time milestone notifications
- `subscribeToAnalyticsEvents(callback)` - Real-time analytics tracking

### Performance & Monitoring
- `getDatabaseHealth()` - Comprehensive database health metrics
- `getStateEngagementSummary(hours)` - Engagement analytics summary
- `bulkTrackMapInteractions(interactions[])` - Bulk analytics insertion
- `bulkUpdateBreweryFeatures(updates[])` - Bulk brewery updates

## 🔄 Triggers and Automation

### Automatic Timestamps
- `updated_at` columns automatically updated on record changes
- Created timestamps set on record insertion

### Status Management
- Automatic state status updates based on current week
- Completion date automatically set when status changes to 'completed'

### Milestone Creation
- Automatic milestone creation for state completions
- Celebration level assignment based on achievement significance

## 📈 Analytics Schema

### Interaction Types
- **hover** - Mouse hover over state
- **click** - Click on state
- **navigation** - Navigation to state page
- **tooltip_view** - Tooltip display
- **mobile_tap** - Mobile touch interaction

### Device Classification
- **desktop** - Desktop browsers
- **mobile** - Mobile devices
- **tablet** - Tablet devices
- **unknown** - Unclassified devices

## 🛡️ Security Considerations

### Data Privacy
- IP addresses stored for geographic analysis (anonymized)
- User agents stored for compatibility analysis
- Session IDs used for user journey tracking (not personally identifiable)

### Access Control
- Public read access to progress and brewery data
- Admin-only access to analytics and management functions
- Insert-only access for analytics tracking

### Data Integrity
- Foreign key constraints ensure referential integrity
- Check constraints validate data ranges and formats
- Unique constraints prevent duplicate entries

## 🔍 Testing and Verification

### Schema Verification
The verification endpoint checks:
- All tables exist and are accessible
- Helper functions are properly created
- Data can be inserted and retrieved
- Indexes are functioning

### Sample Data
Initial data includes:
- 5 sample states (AL, AK, AZ, AR, CA)
- Realistic brewery counts and descriptions
- Proper region assignments
- Featured brewery examples

## 🚀 Next Steps

After completing Prompt 2:
1. **Integration**: Connect the interactive map to use real database data
2. **Admin Interface**: Build admin dashboard for managing state progress
3. **Analytics Dashboard**: Create analytics visualization interface
4. **Content Management**: Integrate with blog post creation workflow
5. **Social Media**: Connect milestone system to social media automation

## 📝 Usage Examples

### Track Map Interaction
```typescript
import { trackMapInteraction } from '@/lib/supabase/functions/stateProgressFunctions'

await trackMapInteraction({
  state_code: 'CA',
  interaction_type: 'click',
  session_id: 'user-session-123',
  device_type: 'desktop',
  source_page: '/about',
  duration_ms: 1500,
  metadata: { source: 'about_page_map' }
})
```

### Get State with Full Details
```typescript
import { getStateWithDetails } from '@/lib/supabase/queries/stateQueries'

const { data: californiaDetails } = await getStateWithDetails('CA')
// Returns state progress + breweries + beer reviews + blog post
```

### Search States
```typescript
import { searchStates } from '@/lib/supabase/queries/stateQueries'

const { data: searchResults } = await searchStates({
  text: 'IPA',
  status: ['completed'],
  regions: ['West', 'Southwest'],
  hasBreweries: true
})
```

This comprehensive schema provides the foundation for advanced state progress tracking, user analytics, and brewery management throughout the 50-state beer journey.