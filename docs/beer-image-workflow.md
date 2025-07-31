# BrewQuest Chronicles Beer Image Management System

## Overview

This document outlines the comprehensive system for researching, downloading, and organizing beer images for the Hop Harrison blog's 50-state beer journey. Each state requires 7 unique brewery beer images for daily content.

## Directory Structure

```
/public/images/Beer images/
├── Alabama/
│   ├── Good People IPA - Good People Brewing Company.jpg
│   ├── Ghost Train - Yellowhammer Brewing.jpg
│   ├── Cahaba Oka Uba IPA - Cahaba Brewing Company.jpg
│   ├── TrimTab Paradise Now - TrimTab Brewing Company.jpg
│   ├── Avondale Miss Fancy's Tripel - Avondale Brewing Company.jpg
│   ├── Snake Handler - Back Forty Beer Company.jpg
│   └── Darker Subject Matter - Monday Night Brewing.jpg
├── Alaska/
│   └── [7 beer images]
├── Arizona/
│   └── [7 beer images]
└── [All 50 states...]
```

## Naming Convention

**Standard Format:** `[BeerName] - [BreweryName].[ext]`

**Examples:**
- `Good People IPA - Good People Brewing Company.jpg`
- `Paradise Now - TrimTab Brewing Company.png`
- `Miss Fancy's Tripel - Avondale Brewing Company.webp`

**Rules:**
- Remove special characters except hyphens, spaces, and periods
- Use title case for beer names
- Include full brewery name for authenticity
- Preferred formats: JPG, PNG, WEBP
- Maximum file size: 2MB per image
- Minimum resolution: 800x600px

## Research Workflow for Each State

### Phase 1: Brewery Research (2-3 hours per state)

1. **State Brewery Discovery**
   ```bash
   # Use FireCrawl to research state breweries
   - State brewery association websites
   - Craft beer directories (CraftBeer.com, BreweryDB)
   - Beer rating platforms (Untappd, RateBeer, BeerAdvocate)
   - Local tourism and visitor bureau sites
   - Regional beer publications
   ```

2. **Brewery Selection Criteria**
   - Geographic distribution across the state
   - Mix of brewery sizes (micro, regional, production)
   - Variety in beer styles and brewing philosophies
   - Strong local reputation and community impact
   - Authentic representation of state's beer culture
   - Accessibility for readers (distribution, taproom visits)

3. **Beer Selection Per Brewery**
   - Flagship/signature beers preferred
   - Available in cans/bottles for photography
   - Represent brewery's identity and style
   - Seasonal availability considerations
   - Regional ingredient usage when possible

### Phase 2: Image Research (1-2 hours per state)

1. **Primary Image Sources**
   ```javascript
   // Brewery official websites
   const primarySources = [
     'brewery-website.com/beer-gallery',
     'brewery-website.com/products',
     'brewery-website.com/our-beers'
   ];
   
   // Social media platforms
   const socialSources = [
     'instagram.com/breweryname',
     'facebook.com/breweryname/photos',
     'twitter.com/breweryname/media'
   ];
   
   // Beer platforms
   const beerPlatforms = [
     'untappd.com/brewery/[id]/beer/[beer-id]',
     'beeradvocate.com/beer/profile/[brewery]/[beer]',
     'ratebeer.com/beer/[beer-name]/[id]'
   ];
   ```

2. **Image Quality Standards**
   - Professional product photography preferred
   - Clear, well-lit can/bottle shots
   - Minimal background distractions
   - Logo and beer name clearly visible
   - High resolution (minimum 800x600px)
   - Authentic brewery-created content

### Phase 3: Download and Organization (30 minutes per state)

1. **Automated Download Process**
   ```bash
   # Run the beer image management script
   node scripts/beer-image-management.js download [StateName]
   
   # Verify downloads
   node scripts/beer-image-management.js report
   
   # Standardize naming if needed
   node scripts/beer-image-management.js standardize [StateName]
   ```

2. **Manual Quality Check**
   - Verify image quality and authenticity
   - Check file sizes and formats
   - Ensure proper naming convention
   - Test image loading in blog system
   - Create backup copies if needed

## Alabama Beer Images - Research Results

### ✅ Images Found with URLs

1. **Good People IPA** - Good People Brewing Company
   - **URL:** `https://images.squarespace-cdn.com/content/v1/61df5a9c912bf074afe1f208/1642029861541-7CYGJXBM1E2DK9VHWQYY/GP-CANS-IPA.png`
   - **Status:** High-quality official brewery image
   - **Notes:** Alabama's #1 selling IPA, flagship brew

2. **TrimTab Paradise Now** - TrimTab Brewing Company
   - **URL:** `https://static.wixstatic.com/media/d4ad6a_d557819dc7f041a0870ed6adcef3138e~mv2.jpg/v1/crop/x_8,y_0,w_900,h_667/fill/w_543,h_393,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Paradise%20Now%20Raspberry%20Berliner%20Weisse.jpg`
   - **Status:** Official brewery product image
   - **Notes:** GABF award-winning Raspberry Berliner Weisse

3. **Darker Subject Matter** - Monday Night Brewing
   - **URL:** `https://cdn.mondaynightbrewing.com/uploads/2025/01/DSM-Bourbon-web@2x-221x300.webp`
   - **Status:** Official brewery product image
   - **Notes:** 13.9% ABV Imperial Stout, Birmingham location

### 🔍 Images Needed - Research Required

4. **Ghost Train** - Yellowhammer Brewing
   - **Status:** Brewery confirmed, specific beer image needed
   - **Research Notes:** German-style Hefeweizen, Huntsville flagship
   - **Action:** Contact brewery or search social media

5. **Cahaba Oka Uba IPA** - Cahaba Brewing Company
   - **Status:** Product available, image needed
   - **Research Notes:** Available for purchase, need product photography
   - **Action:** Check brewery social media or request image

6. **Avondale Miss Fancy's Tripel** - Avondale Brewing Company
   - **Status:** Beer confirmed, product image needed
   - **Research Notes:** 9.2% ABV Belgian Tripel, named after elephant
   - **Action:** Search brewery gallery or Untappd photos

7. **Snake Handler** - Back Forty Beer Company
   - **Status:** Flagship beer confirmed, image needed
   - **Research Notes:** Double IPA, Gadsden-based brewery
   - **Action:** Check Back Forty website and social media

## Image Licensing Guidelines

### Legal Considerations

1. **Brewery Permission (Preferred)**
   ```
   Subject: Image Use Request - Hop Harrison Beer Blog
   
   Dear [Brewery Name],
   
   I'm writing to request permission to use product images of [Beer Name] 
   for editorial purposes in our craft beer blog, BrewQuest Chronicles 
   (brewquest-blog.com). We're featuring Alabama's finest craft beers 
   in our 50-state beer journey.
   
   Usage: Editorial blog content, social media promotion
   Attribution: Full brewery credit and website link
   Commercial Use: None - educational/editorial only
   
   Please let us know if we can use your official product images or if 
   you can provide high-resolution photos.
   
   Best regards,
   Hop Harrison Blog Team
   ```

2. **Fair Use Considerations**
   - Editorial/educational use
   - Commentary and criticism
   - Non-commercial blog content
   - Proper attribution always provided
   - Limited use (single product image)

3. **Creative Commons Sources**
   - Search Flickr CC, Wikimedia Commons
   - Ensure proper attribution
   - Check commercial use restrictions
   - Verify brewery product authenticity

### Best Practices

1. **Always Credit Sources**
   ```html
   <!-- Image attribution example -->
   <img src="/images/Beer images/Alabama/Good People IPA.jpg" 
        alt="Good People IPA by Good People Brewing Company">
   <p class="image-credit">Image courtesy of Good People Brewing Company</p>
   ```

2. **Maintain Quality Standards**
   - Use official brewery images when possible
   - Avoid user-generated content without permission
   - Ensure images represent beer authentically
   - Check image date relevance (current packaging)

3. **Build Brewery Relationships**
   - Contact breweries directly for partnerships
   - Offer content collaboration opportunities
   - Provide traffic and exposure benefits
   - Maintain professional communication

## Workflow for Future States

### Week Before State Coverage Begins

1. **Research Phase (Monday-Tuesday)**
   ```bash
   # Day 1: Brewery research and selection
   - Identify 7 representative breweries
   - Research flagship/signature beers
   - Gather brewery contact information
   
   # Day 2: Image research and collection
   - Find official beer images
   - Contact breweries if needed
   - Prepare download list
   ```

2. **Download Phase (Wednesday)**
   ```bash
   # Automated download
   node scripts/beer-image-management.js download [StateName]
   
   # Quality verification
   - Check image quality and resolution
   - Verify proper naming convention
   - Test in blog system
   ```

3. **Content Integration (Thursday-Friday)**
   ```bash
   # Update state data with image paths
   - Edit src/lib/data/stateProgress.ts
   - Update beer review objects
   - Test daily content system
   ```

### Scalable Process for All 50 States

**Estimated Time Investment:**
- Research per state: 3-4 hours
- Image collection: 1-2 hours  
- Organization/setup: 30 minutes
- **Total per state: 4.5-6.5 hours**
- **Total for 50 states: 225-325 hours**

**Resource Requirements:**
- High-speed internet for image downloads
- Storage: ~2GB (assuming 2MB avg per image × 7 × 50)
- Research tools: FireCrawl, brewery websites, beer platforms
- Communication: Email for brewery partnerships

**Quality Assurance Checklist:**
- [ ] 7 unique breweries per state
- [ ] Geographic distribution within state
- [ ] Variety in beer styles
- [ ] High-quality product images
- [ ] Proper naming convention
- [ ] Legal/ethical image sourcing
- [ ] Brewery attribution provided
- [ ] Integration with blog system tested

## Tools and Resources

### Automated Tools
- `scripts/beer-image-management.js` - Download and organization
- FireCrawl MCP - Website research and data extraction
- Supabase - Database storage for beer metadata

### Research Platforms
- **Brewery Discovery:** State brewery associations, CraftBeer.com
- **Beer Information:** Untappd, BeerAdvocate, RateBeer
- **Image Sources:** Brewery websites, Instagram, Facebook
- **Industry Data:** BreweryDB, American Brewers Association

### Quality Control
- Image verification scripts
- Naming convention validation
- Legal compliance checklist
- Brewery relationship tracking

This system ensures consistent, high-quality beer imagery across all 50 states while maintaining ethical sourcing practices and building positive relationships with craft breweries nationwide.