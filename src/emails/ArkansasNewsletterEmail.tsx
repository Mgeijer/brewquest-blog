import StateNewsletterTemplate from './StateNewsletterTemplate'

interface ArkansasNewsletterProps {
  subscriberName?: string
  unsubscribeToken?: string
  previewMode?: boolean
}

export default function ArkansasNewsletterEmail({
  subscriberName,
  unsubscribeToken,
  previewMode = false
}: ArkansasNewsletterProps) {
  
  const arkansasData = {
    stateName: 'Arkansas',
    stateCode: 'AR',
    weekNumber: 4,
    tagline: 'Natural State brewing excellence with thermal springs, Ozark water, and GABF Gold Medal achievements',
    heroImage: 'https://www.hopharrison.com/images/State%20Images/Arkansas.png',
    colorScheme: {
      primary: '#1e5128',    // Forest green representing Arkansas's natural heritage
      secondary: '#4f772d',  // Lighter green for accents
      accent: '#90a955',     // Fresh green for highlights
      light: '#f7f8f4'       // Very light green background
    },
    stats: {
      breweries: 40,
      perCapitaRank: '#38',
      economicImpact: '$65M',
      additionalStats: [
        { label: 'Jobs Created', value: '850+' },
        { label: 'Per 100k Residents', value: '1.3' },
        { label: 'Tourism Impact', value: '$28M' },
        { label: 'First Brewery', value: '1993' }
      ]
    },
    uniqueAdvantages: [
      {
        icon: '🏔️',
        title: 'Ozark Mountain Water',
        description: 'Pure, mineral-rich water from the Ozark Mountains provides exceptional brewing foundation, filtered through ancient limestone for perfect brewing chemistry.'
      },
      {
        icon: '♨️',
        title: 'Thermal Spring Innovation',
        description: 'Hot Springs National Park features the only brewery in a U.S. National Park, using legendary 143°F thermal spring water for unique brewing processes.'
      },
      {
        icon: '🥇',
        title: 'GABF Gold Medal Excellence',
        description: 'Arkansas earned national recognition with Lost Forty\'s 2020 GABF Gold Medal for Day Drinker, proving the state\'s brewing excellence on the national stage.'
      },
      {
        icon: '🌿',
        title: 'Natural State Heritage',
        description: 'Rich agricultural heritage and pristine natural environment provide exceptional local ingredients and inspire conservation-focused brewing practices.'
      }
    ],
    pioneerBreweries: [
      {
        name: 'Diamond Bear Brewing Company',
        location: 'North Little Rock',
        yearFounded: 1993,
        story: 'Arkansas\'s pioneering brewery, Diamond Bear was the first production brewery in the Little Rock area in over 15 years when it opened. The brewery helped establish Arkansas as a legitimate craft beer destination and paved the way for the state\'s brewing renaissance.',
        achievement: 'Multiple GABF and World Beer Cup medals, Arkansas craft beer pioneer'
      },
      {
        name: 'Lost Forty Brewing',
        location: 'Little Rock',
        yearFounded: 2014,
        story: 'Named after Arkansas\'s famous "Lost Forty" virgin forest, this brewery combines conservation advocacy with world-class brewing. Their Day Drinker Belgian Blonde became the first Arkansas beer to win GABF Gold, putting the state on the national craft beer map.',
        achievement: '2020 GABF Gold Medal winner, largest Arkansas brewery by output'
      },
      {
        name: 'Superior Bathhouse Brewery',
        location: 'Hot Springs',
        yearFounded: 2013,
        story: 'The only brewery located within a U.S. National Park, Superior Bathhouse occupies a historic 1922 bathhouse and uses the legendary thermal spring water that has drawn visitors to Hot Springs for over a century.',
        achievement: 'America\'s only National Park brewery, unique thermal spring water brewing'
      },
      {
        name: 'Ozark Beer Company',
        location: 'Rogers',
        yearFounded: 2012,
        story: 'Named one of the "50 Most Underrated Craft Breweries in the U.S.A." by Paste Magazine, Ozark Beer Company has built a reputation for exceptional quality and consistency, representing Northwest Arkansas\'s growing brewing scene.',
        achievement: 'National media recognition, award-winning BDCS barrel-aged stout'
      }
    ],
    culturalStory: {
      title: 'Community Roots and Natural Heritage',
      paragraphs: [
        'Arkansas breweries serve as vital community gathering spaces that celebrate the state\'s natural heritage while fostering economic development across urban and rural areas. From Little Rock\'s growing brewery district to the unique thermal spring brewing in Hot Springs, each brewery reflects Arkansas\'s commitment to preserving natural resources while embracing innovation.',
        'The state\'s breweries often incorporate conservation themes, with Lost Forty Brewing leading advocacy for forest preservation and many breweries sourcing ingredients from local farms and suppliers. This connection to the land resonates deeply with Arkansans who value outdoor recreation and environmental stewardship.',
        'Arkansas breweries have become destinations for both residents and tourists, with the Hot Springs brewery drawing visitors from around the world to experience beer brewed with thermal spring water, while Northwest Arkansas breweries capitalize on the region\'s growing reputation as an outdoor adventure destination.'
      ],
      impactStats: '40+ breweries supporting 850+ jobs and generating $65M+ economic impact while preserving Arkansas\'s natural brewing advantages'
    },
    innovations: [
      {
        title: 'Thermal Spring Brewing',
        description: 'Superior Bathhouse\'s use of 143°F thermal spring water creates unique brewing processes impossible to replicate anywhere else in America.'
      },
      {
        title: 'Conservation Advocacy Brewing',
        description: 'Lost Forty combines world-class brewing with forest conservation education, proving breweries can be environmental stewards.'
      },
      {
        title: 'Ozark Terroir Development',
        description: 'Local ingredient sourcing from Ozark Mountain farms and springs creates distinctive regional flavors unique to Arkansas.'
      },
      {
        title: 'Historic Preservation Integration',
        description: 'Breweries in restored historic buildings blend Arkansas heritage with modern brewing innovation, preserving architectural history.'
      }
    ],
    nextState: {
      name: 'California',
      preview: 'The Golden State\'s craft beer revolution awaits - from San Diego\'s hop innovation to Napa Valley\'s barrel-aging mastery, discover America\'s largest brewing scene.'
    }
  }

  return (
    <StateNewsletterTemplate
      subscriberName={subscriberName}
      stateData={arkansasData}
      unsubscribeToken={unsubscribeToken}
      previewMode={previewMode}
    />
  )
}