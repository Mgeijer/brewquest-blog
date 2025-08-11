import { SocialMediaContentPack, BeerData, StateData, ContentGenerationConfig } from './types';

export class SocialMediaContentGenerator {
  private countCharacters(text: string): number {
    return text.length;
  }

  private formatHashtags(tags: string[]): string {
    return tags.map(tag => `#${tag}`).join(' ');
  }

  private generateInstagramHashtags(state: string, theme: string): string[] {
    const baseHashtags = ['CraftBeer', 'BrewQuestChronicles', 'HopHarrison'];
    const stateHashtags = [`${state}Beer`, `${state}Brewing`, `${state}CraftBeer`];
    const themeHashtags = this.getThemeHashtags(theme);
    const trendingHashtags = ['craftbeerlife', 'beertography', 'supportlocal', 'drinkcraft', 'craftbeernotcrapbeer'];
    
    return [...baseHashtags, ...stateHashtags, ...themeHashtags, ...trendingHashtags].slice(0, 30);
  }

  private generateTwitterHashtags(state: string, theme: string): string[] {
    const baseHashtags = ['CraftBeer', 'BrewQuest'];
    const stateHashtags = [`${state}Beer`];
    const themeHashtags = this.getThemeHashtags(theme).slice(0, 2);
    
    return [...baseHashtags, ...stateHashtags, ...themeHashtags].slice(0, 4);
  }

  private getThemeHashtags(theme: string): string[] {
    const themes: { [key: string]: string[] } = {
      'brewery_spotlight': ['LocalBrewing', 'CraftBrewery', 'SmallBusiness', 'BeerSpotlight'],
      'beer_education': ['BeerEducation', 'BeerStyles', 'BeerHistory', 'LearnAboutBeer'],
      'cultural_history': ['BeerHistory', 'AmericanBrewing', 'BeerCulture', 'BrewingHeritage'],
      'community_building': ['BeerCommunity', 'CraftBeerLovers', 'BeerFriends', 'LocalSupport'],
      'food_pairing': ['BeerPairing', 'FoodAndBeer', 'PerfectPairings', 'CraftBeerDining'],
      'seasonal': ['SeasonalBeer', 'SeasonalBrewing', 'BeerSeasons', 'SeasonalFlavors']
    };
    
    return themes[theme] || themes['brewery_spotlight'];
  }

  public generateWeeklyContent(
    weekNumber: number, 
    stateData: StateData, 
    config: ContentGenerationConfig = {
      tone: 'enthusiastic',
      focus: 'brewery_spotlight',
      includeBrandMentions: true,
      maxHashtags: { instagram: 30, twitter: 4 }
    }
  ): SocialMediaContentPack {
    
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
      },
      dailyPosts: this.generateDailyPosts(stateData, weekNumber),
      postingSchedule: {
        bestTimes: {
          instagram: ['12:00 PM', '6:00 PM', '8:00 PM'],
          twitter: ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'],
          facebook: ['1:00 PM', '3:00 PM', '8:00 PM'],
          linkedin: ['8:00 AM', '12:00 PM', '5:00 PM']
        },
        recommendations: [
          'Post weekly content on Monday for maximum week-long engagement',
          'Share daily content at peak engagement times for each platform',
          'Cross-post with 2-4 hour delays between platforms',
          'Engage with comments within 2 hours of posting',
          'Use Facebook Groups to amplify reach in craft beer communities'
        ]
      }
    };
  }

  private generateDailyPosts(stateData: StateData, weekNumber: number) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dailyThemes = [
      'Monday Brewery Spotlight',
      'Tuesday Tasting Notes', 
      'Wednesday Beer Education',
      'Thursday Throwback',
      'Friday Beer & Food',
      'Saturday Adventure',
      'Sunday Reflection'
    ];

    const dailyPosts: any = {};

    days.forEach((day, index) => {
      const theme = dailyThemes[index];
      const beer = stateData.signature_beers[index % stateData.signature_beers.length];
      
      // Daily Instagram
      const instagramCaption = `${theme.split(' ')[0]} ${theme.split(' ')[1]} 🍺

Featuring: ${beer.name} from ${beer.brewery}

${beer.description}

Style: ${beer.style} | ABV: ${beer.abv}%
Tasting Notes: ${beer.tastingNotes.slice(0, 3).join(', ')}

Perfect for your ${day} evening! 🌟`;

      const instagramHashtags = this.generateInstagramHashtags(stateData.name.replace(' ', ''), theme.toLowerCase().replace(' ', '_'));
      const fullInstagramPost = `${instagramCaption}

${this.formatHashtags(instagramHashtags.slice(0, 20))}`;

      // Daily Twitter
      const twitterText = `${theme} 🍺

${beer.name} - ${beer.brewery}
${beer.style} | ${beer.abv}% ABV

${beer.tastingNotes[0]} character

Perfect ${day} choice! 🌟`;

      const twitterHashtags = this.generateTwitterHashtags(stateData.name.replace(' ', ''), theme.toLowerCase().replace(' ', '_'));
      const fullTwitterPost = `${twitterText}

${this.formatHashtags(twitterHashtags)}`;

      dailyPosts[day] = {
        instagram: {
          caption: fullInstagramPost,
          characterCount: this.countCharacters(fullInstagramPost),
          hashtags: instagramHashtags.slice(0, 20)
        },
        twitter: {
          text: fullTwitterPost,
          characterCount: this.countCharacters(fullTwitterPost),
          hashtags: twitterHashtags
        }
      };
    });

    return dailyPosts;
  }

  public generateFormattedOutput(contentPack: SocialMediaContentPack): string {
    return `# ${contentPack.state} Social Media Posts - Week ${contentPack.weekNumber}
## BrewQuest Chronicles: ${contentPack.state} Craft Beer Journey

### Weekly Overview Posts

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

## Daily Posts

${Object.entries(contentPack.dailyPosts).map(([day, posts]) => `
### ${day.charAt(0).toUpperCase() + day.slice(1)}

#### Instagram Post
**Caption:**
${posts.instagram.caption}

**Character Count:** ${posts.instagram.characterCount}

#### Twitter/X Post
**Text:**
${posts.twitter.text}

**Character Count:** ${posts.twitter.characterCount}

---`).join('')}

## Posting Schedule

### Best Posting Times
- **Instagram:** ${contentPack.postingSchedule.bestTimes.instagram.join(', ')}
- **Twitter:** ${contentPack.postingSchedule.bestTimes.twitter.join(', ')}
- **Facebook:** ${contentPack.postingSchedule.bestTimes.facebook.join(', ')}
- **LinkedIn:** ${contentPack.postingSchedule.bestTimes.linkedin.join(', ')}

### Usage Instructions
${contentPack.postingSchedule.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

---

*Generated by BrewQuest Chronicles Social Media Content System*
*Ready for copy-paste to all platforms*`;
  }
}

// Example usage and test data
export const exampleAlabamaData: StateData = {
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
    },
    {
      name: 'Snake Handler Double IPA',
      brewery: 'Back Forty Beer Company',
      style: 'Double IPA',
      abv: 9.2,
      description: 'An intense, hop-driven double IPA with layers of tropical and citrus flavors balanced by a rich malt character.',
      tastingNotes: ['Mango', 'Grapefruit', 'Resinous hops', 'Biscuit malt']
    },
    {
      name: 'Paradise Now',
      brewery: 'TrimTab Brewing',
      style: 'Gose',
      abv: 4.8,
      description: 'A refreshing gose with passion fruit, guava, and sea salt, perfect for Alabama\'s warm climate.',
      tastingNotes: ['Passion fruit', 'Guava', 'Sea salt', 'Tart finish']
    },
    {
      name: 'Miss Fancy\'s Triple',
      brewery: 'Avondale Brewing',
      style: 'Belgian Tripel',
      abv: 9.5,
      description: 'A complex Belgian-style tripel with fruity esters and spicy phenols, showcasing traditional brewing techniques.',
      tastingNotes: ['Banana', 'Clove', 'Honey', 'Peppery finish']
    }
  ],
  beer_culture_highlights: [
    'Alabama\'s craft beer scene has exploded from just a handful of breweries in 2010 to over 45 thriving operations across the state.',
    'The state\'s beer laws evolved significantly in recent years, allowing higher ABV beers and brewpub sales.',
    'Alabama breweries focus heavily on community engagement and local ingredient sourcing.'
  ],
  history: 'Alabama\'s modern craft beer renaissance began in earnest around 2012, overcoming restrictive beer laws that had limited the industry for decades. The passage of the Gourmet Beer Bill in 2009 allowed beers over 6% ABV, opening the door for craft brewers to compete nationally.',
  notable_facts: [
    'Alabama didn\'t allow beer over 6% ABV until 2009',
    'The state has seen 400% growth in craft breweries since 2010',
    'Birmingham and Huntsville lead the state in brewery density',
    'Many Alabama breweries feature live music and food trucks as community gathering spaces'
  ]
};

// Usage Example:
// const generator = new SocialMediaContentGenerator();
// const contentPack = generator.generateWeeklyContent(1, exampleAlabamaData);
// const formattedOutput = generator.generateFormattedOutput(contentPack);
// console.log(formattedOutput);