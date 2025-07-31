# 🍺 BrewQuest Chronicles Social Media Content System

## CRITICAL: Perfect Manual Social Media Content Generation System

This system generates copy-paste ready social media content that matches your existing format exactly, providing character counts, hashtag optimization, and posting schedule instructions for all major platforms.

## 🚀 Quick Start

### Method 1: Command Line (Fastest)
```bash
npm run generate-social
```

### Method 2: Web Interface
Visit: `http://localhost:3000/social-content-generator`

### Method 3: API Endpoint
```bash
curl -X POST http://localhost:3000/api/generate-social-content \
  -H "Content-Type: application/json" \
  -d '{"weekNumber": 1, "stateName": "Alabama"}'
```

## 📋 What This System Generates

### ✅ EXACT Format Matching
- **Instagram**: Visual storytelling with optimized hashtag strategy (up to 30 hashtags)
- **Twitter/X**: Concise content with key facts and 4 strategic hashtags  
- **Facebook**: Community engagement with longer-form content and questions
- **LinkedIn**: Business insights and industry analysis approach

### ✅ Complete Content Package
- **4 Weekly Posts** (one for each platform)
- **14 Daily Posts** (Instagram + Twitter for each day of the week)
- **Character Counts** for every post
- **Hashtag Optimization** platform-specific
- **Posting Schedule** recommendations
- **Copy-paste Ready** formatting

## 📊 Content Statistics Example

```
📊 Content Statistics:
   - Instagram: 746 characters | 10 hashtags
   - Twitter: 234 characters | 4 hashtags  
   - Facebook: 1233 characters | Engagement question included
   - LinkedIn: 1144 characters | Business focus defined
   - Daily posts: 7 days × 2 platforms = 14 additional posts
```

## 🎯 Perfect Format Matching

### Instagram Post Structure
```
🍺 Week [X]: Discovering [State]! 🍺

[Beer culture highlight]

🏭 Featured Brewery: [Brewery Name]
🍻 Signature Beer: [Beer Name]
📊 [State] Fun Fact: [Interesting fact]

[Beer description]

Tasting Notes: [Notes] 🎯

What's your favorite [State] brewery? Drop it in the comments! ⬇️

Read the full [State] beer guide (link in bio) ⬆️

#CraftBeer #BrewQuestChronicles #HopHarrison [+ state-specific hashtags]
```

### Twitter/X Post Structure
```
🍺 Week [X]: [State] Beer Spotlight

🏭 [Brewery Name]
🍻 [Beer Name] ([ABV]% ABV)
📊 [Number]+ breweries statewide

[Fun fact]

Full guide: [link]

#CraftBeer #BrewQuest #[State]Beer #LocalBrewing
```

### Facebook Post Structure
```
🍺 Week [X]: Exploring [State]'s Craft Beer Scene! 🇺🇸

[Historical context paragraph]

This week, we're spotlighting some incredible [State] brewing:

🏭 **[Brewery Name]**
[Brewery description]

🍻 **[Beer Name]** ([ABV]% ABV)
[Beer description]

**Tasting Profile:** [Tasting notes]

[Beer culture highlight]

**[State] by the Numbers:**
📊 [Number]+ craft breweries
👥 Population: [Population]
🏆 Notable breweries: [List]

Fun fact: [Interesting fact]

What's your go-to [State] brewery or beer? We'd love to hear your recommendations in the comments! 👇

Read our complete [State] craft beer guide: [link to blog]
```

### LinkedIn Post Structure
```
Week [X]: [State] Craft Beer Industry Analysis 📊

The [State] craft beer market represents a compelling case study in regional brewing development, with [number]+ active breweries serving a population of [population].

**Market Leadership:**
[Analysis paragraph]

**Industry Characteristics:**
• Strong local brewery density relative to population
• Diverse style portfolio emphasizing regional ingredients
• Community-focused business models driving customer loyalty
• Tourism integration creating additional revenue streams

**Economic Impact:**
[Economic impact paragraph]

**Innovation Focus:**
[Innovation analysis]

Key success factors: [Key factors]

Full market analysis: www.hopharrison.com

#BusinessTransformation #Entrepreneurship #AmericanBusiness #CraftBeer
```

## 🛠 System Components

### Core Files
```
src/lib/social-media/
├── types.ts                    # TypeScript interfaces
├── content-generator.ts        # Core generation logic
└── README.md                   # Component documentation

src/app/api/generate-social-content/
└── route.ts                    # API endpoint

src/app/social-content-generator/
└── page.tsx                    # Web interface

scripts/
└── generate-social-content.ts  # CLI tool

# Quick test files
test-social-content.js          # Simple test script
generate-example-content.js     # Example generator
```

### TypeScript Interface
```typescript
interface SocialMediaContentPack {
  weekNumber: number;
  state: string;
  weeklyPosts: {
    instagram: { caption: string; characterCount: number; hashtags: string[]; };
    twitter: { text: string; characterCount: number; hashtags: string[]; };
    facebook: { text: string; characterCount: number; engagementQuestion: string; };
    linkedin: { text: string; characterCount: number; businessFocus: string; };
  };
  dailyPosts: {
    monday: { instagram: {...}; twitter: {...}; };
    // ... for each day of the week
  };
  postingSchedule: {
    bestTimes: { instagram: string[]; twitter: string[]; facebook: string[]; linkedin: string[]; };
    recommendations: string[];
  };
}
```

## 📅 Posting Schedule & Best Practices

### Optimal Posting Times
- **Instagram**: 12:00 PM, 6:00 PM, 8:00 PM
- **Twitter**: 9:00 AM, 12:00 PM, 3:00 PM, 6:00 PM
- **Facebook**: 1:00 PM, 3:00 PM, 8:00 PM
- **LinkedIn**: 8:00 AM, 12:00 PM, 5:00 PM

### Usage Instructions
1. **Post weekly content on Monday** for maximum week-long engagement
2. **Share daily content** at peak engagement times for each platform
3. **Cross-post with 2-4 hour delays** between platforms
4. **Engage with comments** within 2 hours of posting
5. **Use Facebook Groups** to amplify reach in craft beer communities

## 🔧 Configuration Options

### Content Generation Config
```typescript
interface ContentGenerationConfig {
  tone: 'professional' | 'casual' | 'enthusiastic' | 'educational';
  focus: 'beer_education' | 'brewery_spotlight' | 'cultural_history' | 'community_building';
  includeBrandMentions: boolean;
  maxHashtags: {
    instagram: number;  // Recommended: 30
    twitter: number;    // Recommended: 4
  };
}
```

## 📈 Advanced Features

### Character Count Optimization
- **Instagram**: Up to 2,200 characters (optimized for ~700-900)
- **Twitter/X**: 280 character limit (optimized for ~200-250)
- **Facebook**: No limit (optimized for ~1,000-1,500)
- **LinkedIn**: 3,000 character limit (optimized for ~1,000-1,500)

### Hashtag Strategy
- **Instagram**: 30 hashtags max, mix of popular and niche
- **Twitter**: 4 hashtags max, focus on trending and relevant
- **Facebook**: Hashtags used sparingly, focus on content
- **LinkedIn**: Professional hashtags for business networking

### Platform-Specific Optimization
- **Instagram**: Visual storytelling, emoji usage, community questions
- **Twitter**: Quick facts, data points, link sharing
- **Facebook**: Community building, longer narratives, engagement questions
- **LinkedIn**: Business insights, industry analysis, professional networking

## 🚀 Usage Examples

### Generate Week 1 Alabama Content
```bash
npm run generate-social
```

### Generate Custom Week/State Content
```javascript
const generator = new SocialMediaContentGenerator();
const contentPack = generator.generateWeeklyContent(5, texasStateData);
const formattedOutput = generator.generateFormattedOutput(contentPack);
```

### API Usage
```javascript
const response = await fetch('/api/generate-social-content', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    weekNumber: 12,
    stateName: 'Colorado',
    config: {
      tone: 'enthusiastic',
      focus: 'brewery_spotlight',
      includeBrandMentions: true,
      maxHashtags: { instagram: 30, twitter: 4 }
    }
  })
});
```

## 📁 Output Files

### Generated Content Structure
```
generated-content/
├── week-1-alabama-social-content.md
├── week-2-alaska-social-content.md
└── example-week-1-alabama-social-content.md
```

### Markdown Output Format
- Complete content pack with all platform posts
- Character counts for each post
- Hashtag lists and recommendations
- Posting schedule instructions
- Copy-paste ready formatting

## 🎯 Key Benefits

✅ **Perfect Format Matching** - Matches existing social-media-posts-with-facebook.md exactly
✅ **Character Count Precision** - Optimized for each platform's limits
✅ **Platform-Specific Optimization** - Tailored content for each social media platform
✅ **Copy-Paste Ready** - No additional formatting needed
✅ **Comprehensive Coverage** - Weekly + daily content for entire campaign
✅ **Hashtag Strategy** - Platform-optimized hashtag selection
✅ **Posting Schedule** - Data-driven timing recommendations
✅ **Scalable System** - Easy to extend for all 50 states

## 🔄 Next Steps for Full 50-State Implementation

1. **Create state data service** with comprehensive brewery/beer information
2. **Add state-specific customization** for regional beer culture
3. **Implement content calendar** for 52-week journey planning
4. **Add image generation** integration for visual content
5. **Create automated posting** integration with social media APIs
6. **Add analytics tracking** for content performance optimization

---

*This system provides the foundation for a complete social media content strategy that scales across all 50 states and maintains consistent, engaging, copy-paste ready content for the entire BrewQuest Chronicles journey.*