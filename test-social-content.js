// Simple test script for social media content generation

class SocialMediaContentGenerator {
  countCharacters(text) {
    return text.length;
  }

  formatHashtags(tags) {
    return tags.map(tag => `#${tag}`).join(' ');
  }

  generateInstagramHashtags(state, theme) {
    const baseHashtags = ['CraftBeer', 'BrewQuestChronicles', 'HopHarrison'];
    const stateHashtags = [`${state}Beer`, `${state}Brewing`, `${state}CraftBeer`];
    const themeHashtags = ['LocalBrewing', 'CraftBrewery', 'SmallBusiness', 'BeerSpotlight'];
    
    return [...baseHashtags, ...stateHashtags, ...themeHashtags].slice(0, 30);
  }

  generateTwitterHashtags(state, theme) {
    const baseHashtags = ['CraftBeer', 'BrewQuest'];
    const stateHashtags = [`${state}Beer`];
    const themeHashtags = ['LocalBrewing', 'BeerSpotlight'];
    
    return [...baseHashtags, ...stateHashtags, ...themeHashtags].slice(0, 4);
  }

  generateWeeklyContent(weekNumber, stateData) {
    const signatureBeer = stateData.signature_beers[0];
    const famousBrewery = stateData.famousBreweries[0];
    
    // Weekly Instagram Post
    const instagramCaption = `🍺 Week ${weekNumber}: Discovering ${stateData.name}! 🍺

${stateData.beer_culture_highlights[0]}

🏭 Featured Brewery: ${famousBrewery}
🍻 Signature Beer: ${signatureBeer.name}
📊 ${stateData.name} Fun Fact: ${stateData.notable_facts[0]}

${signatureBeer.description}

Tasting Notes: ${signatureBeer.tastingNotes.join(', ')} 🎯

What's your favorite ${stateData.name} brewery? Drop it in the comments! ⬇️

Read the full ${stateData.name} beer guide (link in bio) ⬆️`;

    const instagramHashtags = this.generateInstagramHashtags(stateData.name.replace(' ', ''), 'brewery_spotlight');
    const fullInstagramPost = `${instagramCaption}

${this.formatHashtags(instagramHashtags)}`;

    // Weekly Twitter Post
    const twitterText = `🍺 Week ${weekNumber}: ${stateData.name} Beer Spotlight

🏭 ${famousBrewery}
🍻 ${signatureBeer.name} (${signatureBeer.abv}% ABV)
📊 ${stateData.breweryCount}+ breweries statewide

${stateData.notable_facts[0]}

Full guide: [link]`;

    const twitterHashtags = this.generateTwitterHashtags(stateData.name.replace(' ', ''), 'brewery_spotlight');
    const fullTwitterPost = `${twitterText}

${this.formatHashtags(twitterHashtags)}`;

    // Weekly Facebook Post
    const facebookText = `🍺 Week ${weekNumber}: Exploring ${stateData.name}'s Craft Beer Scene! 🇺🇸

${stateData.history}

This week, we're spotlighting some incredible ${stateData.name} brewing:

🏭 **${famousBrewery}**
One of ${stateData.name}'s most celebrated breweries, known for their innovative approach and community focus.

🍻 **${signatureBeer.name}** (${signatureBeer.abv}% ABV)
${signatureBeer.description}

**Tasting Profile:** ${signatureBeer.tastingNotes.join(', ')}

${stateData.beer_culture_highlights[0]}

**${stateData.name} by the Numbers:**
📊 ${stateData.breweryCount}+ craft breweries
👥 Population: ${stateData.population.toLocaleString()}
🏆 Notable breweries: ${stateData.famousBreweries.slice(0, 3).join(', ')}

Fun fact: ${stateData.notable_facts[0]}

What's your go-to ${stateData.name} brewery or beer? We'd love to hear your recommendations in the comments! 👇

Read our complete ${stateData.name} craft beer guide: [link to blog]`;

    // Weekly LinkedIn Post
    const linkedinText = `Week ${weekNumber}: ${stateData.name} Craft Beer Industry Analysis 📊

The ${stateData.name} craft beer market represents a compelling case study in regional brewing development, with ${stateData.breweryCount}+ active breweries serving a population of ${stateData.population.toLocaleString()}.

**Market Leadership:**
${famousBrewery} exemplifies the successful integration of traditional brewing techniques with modern market positioning, demonstrated through their flagship ${signatureBeer.name}.

**Industry Characteristics:**
• Strong local brewery density relative to population
• Diverse style portfolio emphasizing regional ingredients
• Community-focused business models driving customer loyalty
• Tourism integration creating additional revenue streams

**Economic Impact:**
${stateData.beer_culture_highlights[0]}

**Innovation Focus:**
Breweries like ${famousBrewery} showcase how craft beverage companies can achieve sustainable growth through product quality, brand authenticity, and strategic market development.

Key success factors: ${stateData.notable_facts[0]}

Full market analysis: www.hopharrison.com`;

    return {
      weekNumber,
      state: stateData.name,
      weeklyPosts: {
        instagram: {
          caption: fullInstagramPost,
          characterCount: this.countCharacters(fullInstagramPost),
          hashtags: instagramHashtags
        },
        twitter: {
          text: fullTwitterPost,
          characterCount: this.countCharacters(fullTwitterPost),
          hashtags: twitterHashtags
        },
        facebook: {
          text: facebookText,
          characterCount: this.countCharacters(facebookText),
          engagementQuestion: `What's your go-to ${stateData.name} brewery or beer? We'd love to hear your recommendations in the comments! 👇`
        },
        linkedin: {
          text: linkedinText,
          characterCount: this.countCharacters(linkedinText),
          businessFocus: 'Market analysis and industry insights'
        }
      }
    };
  }

  generateFormattedOutput(contentPack) {
    return `# Social Media Content Pack - Week ${contentPack.weekNumber}: ${contentPack.state}

## Weekly Posts

### Instagram Post
**Caption:**
${contentPack.weeklyPosts.instagram.caption}

**Character Count:** ${contentPack.weeklyPosts.instagram.characterCount}
**Hashtags Used:** ${contentPack.weeklyPosts.instagram.hashtags.length}

---

### LinkedIn Post
**Text:**
${contentPack.weeklyPosts.linkedin.text}

**Character Count:** ${contentPack.weeklyPosts.linkedin.characterCount}
**Business Focus:** ${contentPack.weeklyPosts.linkedin.businessFocus}

---

### Facebook Post
**Text:**
${contentPack.weeklyPosts.facebook.text}

**Character Count:** ${contentPack.weeklyPosts.facebook.characterCount}
**Engagement Question:** ${contentPack.weeklyPosts.facebook.engagementQuestion}

---

### Twitter/X Post
**Text:**
${contentPack.weeklyPosts.twitter.text}

**Character Count:** ${contentPack.weeklyPosts.twitter.characterCount}

---

## Posting Schedule

### Best Posting Times
- **Instagram:** 12:00 PM, 6:00 PM, 8:00 PM
- **Twitter:** 9:00 AM, 12:00 PM, 3:00 PM, 6:00 PM
- **Facebook:** 1:00 PM, 3:00 PM, 8:00 PM
- **LinkedIn:** 8:00 AM, 12:00 PM, 5:00 PM

### Usage Instructions
1. Post weekly content on Monday for maximum week-long engagement
2. Share daily content at peak engagement times for each platform
3. Cross-post with 2-4 hour delays between platforms
4. Engage with comments within 2 hours of posting
5. Use Facebook Groups to amplify reach in craft beer communities

---

*Generated by BrewQuest Chronicles Social Media Content System*
*Ready for copy-paste to all platforms*`;
  }
}

// Example Alabama data
const exampleAlabamaData = {
  name: 'Alabama',
  abbreviation: 'AL',
  population: 5108468,
  breweryCount: 45,
  famousBreweries: ['Good People Brewing', 'Avondale Brewing', 'TrimTab Brewing', 'Back Forty Beer Company'],
  signature_beers: [
    {
      name: 'Good People IPA',
      brewery: 'Good People Brewing Company',
      style: 'American IPA',
      abv: 7.1,
      description: 'A bold, hop-forward IPA showcasing the citrusy character of American hops with a solid malt backbone.',
      tastingNotes: ['Citrus', 'Pine', 'Tropical fruit', 'Caramel malt'],
      awards: ['Great American Beer Festival Bronze Medal 2019']
    }
  ],
  beer_culture_highlights: [
    'Alabama\'s craft beer scene has exploded from just a handful of breweries in 2010 to over 45 thriving operations across the state.'
  ],
  history: 'Alabama\'s modern craft beer renaissance began in earnest around 2012, overcoming restrictive beer laws that had limited the industry for decades. The passage of the Gourmet Beer Bill in 2009 allowed beers over 6% ABV, opening the door for craft brewers to compete nationally.',
  notable_facts: [
    'Alabama didn\'t allow beer over 6% ABV until 2009'
  ]
};

// Test the system
console.log('🍺 Generating Example Social Media Content Pack...\n');

const generator = new SocialMediaContentGenerator();
const contentPack = generator.generateWeeklyContent(1, exampleAlabamaData);
const formattedOutput = generator.generateFormattedOutput(contentPack);

console.log(formattedOutput);

// Save to file
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'generated-content');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const filename = 'example-week-1-alabama-social-content.md';
const filepath = path.join(outputDir, filename);

fs.writeFileSync(filepath, formattedOutput);

console.log(`\n✅ Content saved to: ${filepath}`);
console.log(`\n📊 Content Statistics:`);
console.log(`   - Instagram: ${contentPack.weeklyPosts.instagram.characterCount} characters`);
console.log(`   - Twitter: ${contentPack.weeklyPosts.twitter.characterCount} characters`);
console.log(`   - Facebook: ${contentPack.weeklyPosts.facebook.characterCount} characters`);
console.log(`   - LinkedIn: ${contentPack.weeklyPosts.linkedin.characterCount} characters`);
console.log(`\n🎉 Ready for copy-paste to all social media platforms!`);