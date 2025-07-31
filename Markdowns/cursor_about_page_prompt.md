# Cursor Prompt: Update About Page with AI Beer Journey Story

Create an updated About page and related components that honestly explains the AI-powered beer journey concept. The story should be engaging while being transparent about the AI nature of the content.

## Requirements:

### 1. Update About Page Content (src/app/about/page.tsx)
Replace the existing about page with a story-driven layout that includes:

**Hero Section:**
- Large image of a map with beer glass overlay
- Headline: "A Beer Journey Powered by Passion and AI"
- Subheadline: "When life keeps you from your dream trip, technology helps you explore anyway"

**The Story Section:**
- Personal narrative about wanting to explore America's craft beer scene
- Honest explanation of how AI is helping fulfill this dream
- Emphasis on discovery, learning, and sharing authentic brewery stories
- Clear but friendly disclosure about AI-generated content

**How It Works Section:**
- 3-4 step process of how the AI journey works
- Research methodology for finding great breweries
- Content creation and verification process
- Community engagement and feedback loops

**Interactive US Map Section:**
- Clickable SVG map showing journey progress
- States colored based on completion status
- Hover effects showing featured breweries
- Click navigation to state-specific content

### 2. Create Interactive US Map Component (src/components/interactive/USMap.tsx)
Build a fully interactive SVG-based US map with:
- Individual state paths with unique IDs
- Dynamic coloring based on completion status:
  - Gray: Not yet explored
  - Amber: Currently exploring
  - Gold: Completed
- Hover effects showing state info
- Click handlers for navigation
- Responsive design for mobile
- Accessibility features

### 3. Update Homepage Hero Section
Modify the landing page hero to align with the new story:
- Updated tagline reflecting the AI journey concept
- Honest but engaging copy about the project
- Clear value proposition for readers

### 4. Create About Story Components
Build reusable components:
- StoryTimeline component showing the journey progression
- AITransparencyDisclosure component (subtle but clear)
- CommunityEngagement component encouraging reader participation

### 5. Update Navigation and Footer
- Add transparency links in footer
- Update meta descriptions and SEO content
- Ensure consistent messaging across all pages

## Content Tone and Messaging:

**Key Messages to Convey:**
- This is a passion project driven by genuine love for craft beer
- AI technology enables exploration that wouldn't otherwise be possible
- Content is researched, curated, and verified for accuracy
- Community engagement and feedback are valued
- The journey is about discovery and sharing great brewery stories

**Transparency Approach:**
- Be upfront about AI involvement without making it the focus
- Emphasize the research and curation process
- Highlight the human passion behind the project
- Invite community participation and feedback

## Technical Requirements:

### US Map Implementation:
```typescript
interface StateData {
  code: string // 'AL', 'AK', etc.
  name: string
  status: 'upcoming' | 'current' | 'completed'
  weekNumber?: number
  featuredBreweries?: string[]
  blogPostSlug?: string
  completionDate?: Date
}

interface USMapProps {
  stateData: StateData[]
  onStateClick: (stateCode: string) => void
  className?: string
}
```

### Color Scheme:
- Upcoming states: #E5E7EB (gray-200)
- Current state: #F59E0B (beer-amber)
- Completed states: #D97706 (beer-gold)
- Hover effects: Lighten by 10%

### Responsive Behavior:
- Desktop: Full map with state names on hover
- Tablet: Scaled map with touch-friendly interactions
- Mobile: Simplified map or list view option

## File Structure to Create/Update:

```
src/
├── app/
│   ├── about/
│   │   └── page.tsx (complete rewrite)
│   └── page.tsx (update hero section)
├── components/
│   ├── interactive/
│   │   ├── USMap.tsx (new)
│   │   └── StateProgress.tsx (new)
│   ├── about/
│   │   ├── StoryTimeline.tsx (new)
│   │   ├── AITransparencyDisclosure.tsx (new)
│   │   ├── CommunityEngagement.tsx (new)
│   │   └── HowItWorksSection.tsx (new)
│   └── navigation/
│       ├── Header.tsx (update)
│       └── Footer.tsx (update)
└── lib/
    └── data/
        └── stateProgress.ts (new - state completion data)
```

## Sample Content Snippets:

### About Page Hero:
"Ever dream of traveling to all 50 states to discover America's best craft beer? I did too. When life made that journey impossible, I found another way. Meet my AI beer buddy—a passionate researcher and storyteller who's embarking on this adventure for me, one state at a time."

### Transparency Section:
"Full transparency: While I can't physically visit every brewery, my AI companion does the heavy lifting on research, discovery, and storytelling. Every brewery featured is real, every beer is carefully selected, and every story is worth telling. Think of it as having the world's most dedicated beer researcher who never gets tired and always finds the hidden gems."

### How It Works:
"My AI beer buddy researches each state's craft beer scene, identifies the most interesting breweries and unique beers, and crafts engaging stories about the people and passion behind each pint. I review everything to ensure accuracy and authenticity."

## Implementation Instructions:

1. **Start with the About page structure and content**
2. **Create the US Map component with basic SVG**
3. **Add interactivity and state management**
4. **Update homepage hero section**
5. **Create supporting story components**
6. **Update navigation and footer**
7. **Test responsive behavior across devices**
8. **Ensure accessibility compliance**

## Styling Guidelines:
- Use existing beer-themed color palette
- Maintain consistent typography scale
- Add subtle animations for map interactions
- Ensure sufficient color contrast for accessibility
- Mobile-first responsive design approach

Create engaging, honest, and technically excellent components that tell the story of this AI-powered beer journey while building trust with readers through transparency.