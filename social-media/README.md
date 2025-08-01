# BrewQuest Chronicles Social Media Content Library

## 📁 Folder Structure

This directory contains all social media content organized by state, with each state containing a complete set of posts for their featured week.

```
social-media/
├── README.md                    # This file
├── alabama/
│   └── alabama-social-posts.md  # Week 1 - Complete Alabama content
├── alaska/
│   └── alaska-social-posts.md   # Week 2 - Complete Alaska content
├── arizona/
│   └── arizona-social-posts.md  # Week 3 - Complete Arizona content
├── arkansas/
│   └── arkansas-social-posts.md # Week 4 - Complete Arkansas content
└── [... all 50 states]
```

## 📋 Content Structure Per State

Each state markdown file contains:

### Weekly Overview Posts (4 platforms)
- **Instagram Weekly Launch** - Visual storytelling with brewery journey
- **Facebook Weekly Launch** - Community engagement with state history  
- **LinkedIn Weekly Launch** - Industry analysis and economic insights
- **Twitter/X Weekly Launch** - Key facts and transformation story

### Daily Beer Feature Posts (7 days × 2 platforms = 14 posts)
- **Instagram Daily** - Brewery spotlight with beer details and local context
- **Twitter/X Daily** - Concise beer facts with character count optimization

### Total per state: **18 posts** (4 weekly + 14 daily)

## 🎯 Post Templates

### Instagram Daily Beer Template
```
🍺 Day [X] of [State] Week! 

[Brewery]'s [Beer] ([ABV]%) - [brief tasting note]

[Unique brewery feature in 1-2 sentences]

www.hopharrison.com/blog/[state]

#CraftBeer #[State]Beer #[BreweryName] #[City]Eats #BrewQuestChronicles #HopHarrison #Day[X]

[Character count: XXX/280]
```

### Twitter/X Daily Beer Template  
```
🍺 Day [X] of [State] Week! 

[Brewery]'s [Beer] ([ABV]%) - [brief tasting note]

[Unique feature in 1 sentence]

www.hopharrison.com/blog/[state]

#CraftBeer #[State]Beer

[Character count: XXX/280]
```

## 📊 Platform Specifications

### Character Limits
- **Instagram**: 2,200 characters (aim for 800-1,200)
- **Twitter/X**: 280 characters (aim for 200-250)  
- **Facebook**: No limit (aim for 1,200-1,800)
- **LinkedIn**: 3,000 characters (aim for 1,200-1,600)

### Hashtag Strategy
- **Instagram**: 20-30 hashtags (mix of popular and niche)
- **Twitter/X**: 2-4 hashtags (focus on relevant and trending)
- **Facebook**: 3-5 hashtags (used sparingly)
- **LinkedIn**: 3-5 professional hashtags

### Best Posting Times (EST)
- **Instagram**: 12:00 PM, 6:00 PM, 8:00 PM
- **Twitter/X**: 9:00 AM, 12:00 PM, 3:00 PM, 6:00 PM
- **Facebook**: 1:00 PM, 3:00 PM, 8:00 PM  
- **LinkedIn**: 8:00 AM, 12:00 PM, 5:00 PM

## 🗓️ Weekly Content Schedule

### Monday - Week Launch Day
- **Morning**: LinkedIn weekly industry analysis
- **Afternoon**: Instagram weekly journey post
- **Evening**: Facebook community engagement post
- **Late**: Twitter/X weekly facts

### Tuesday-Sunday - Daily Beer Features
- **Afternoon**: Instagram daily beer spotlight
- **Evening**: Twitter/X daily beer post

### Wednesday - Mid-Week Boost
- **Extra Facebook post** with community questions and engagement

### Friday - Professional Focus  
- **LinkedIn follow-up** with industry insights and economic data

### Sunday - Week Wrap & Preview
- **Cross-platform wrap-up** of the week's discoveries
- **Preview teaser** for next state's upcoming week

## 🔧 Content Management Tools

### Available Generation Tools
- **Manual Content Generator**: `/src/app/social-content-generator/page.tsx`
- **API Endpoint**: `/api/generate-social-content`
- **Command Line**: `npm run generate-social`
- **Content Library**: All files in this `/social-media/` directory

### File Naming Convention
- Format: `[state-name]-social-posts.md`
- Examples: `alabama-social-posts.md`, `california-social-posts.md`
- Always lowercase state names with hyphens for multi-word states

## 📈 Performance Tracking

### Key Metrics to Monitor
- **Engagement Rate**: Likes, comments, shares per post
- **Reach**: Total unique accounts reached
- **Click-through Rate**: Traffic to hopharrison.com
- **Hashtag Performance**: Which tags drive the most engagement
- **Best Posting Times**: When your audience is most active

### A/B Testing Opportunities
- Different hashtag combinations
- Varying post lengths
- Image vs. video content
- Posting time optimization
- Caption style variations

## 🎨 Brand Voice Guidelines

### Tone Characteristics
- **Enthusiastic** but not overwhelming
- **Educational** without being academic
- **Community-focused** and inclusive
- **Authentic** storytelling approach
- **Professional** on LinkedIn, casual elsewhere

### Content Pillars
1. **Beer Education** - Styles, brewing techniques, ingredients
2. **Brewery Stories** - Founders, history, community impact
3. **Cultural Context** - State history, local ingredients, regional styles
4. **Community Building** - Encouraging discussion and sharing
5. **Industry Insights** - Business trends, economic impact (LinkedIn focus)

## ✅ Quality Checklist

Before posting, verify:
- [ ] Character counts within platform limits
- [ ] All links are working and properly formatted
- [ ] Hashtags are relevant and properly formatted
- [ ] Beer details are accurate (name, brewery, ABV, style)
- [ ] State-specific information is correct
- [ ] Brand voice is consistent
- [ ] Call-to-action is clear and engaging
- [ ] Visual content is high quality and properly sized

---

*This social media content library supports the complete 52-week, 50-state BrewQuest Chronicles journey with ready-to-use, platform-optimized content for consistent, engaging social media presence.*