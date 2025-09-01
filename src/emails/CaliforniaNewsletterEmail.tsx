import StateNewsletterTemplate from './StateNewsletterTemplate'

interface CaliforniaNewsletterProps {
  subscriberName?: string
  unsubscribeToken?: string
  previewMode?: boolean
}

export default function CaliforniaNewsletterEmail({
  subscriberName,
  unsubscribeToken,
  previewMode = false
}: CaliforniaNewsletterProps) {
  
  const californiaData = {
    stateName: 'California',
    stateCode: 'CA',
    weekNumber: 5,
    tagline: 'The craft beer capital where innovation meets tradition - from San Diego\'s hop paradise to Northern California\'s wine barrel experiments',
    heroImage: 'https://www.hopharrison.com/images/State%20Images/California.png',
    colorScheme: {
      primary: '#c4302b',    // California red representing the state flag
      secondary: '#d2691e',  // Golden orange for sunset/Golden State
      accent: '#ffd700',     // Gold for the Golden State
      light: '#fff8f0'       // Warm light background
    },
    stats: {
      breweries: 958,
      perCapitaRank: '#4',
      economicImpact: '$9.4B',
      additionalStats: [
        { label: 'Jobs Created', value: '65,000+' },
        { label: 'Per 100k Residents', value: '2.4' },
        { label: 'Tourism Impact', value: '$3.2B' },
        { label: 'First Modern Brewery', value: '1976' }
      ]
    },
    uniqueAdvantages: [
      {
        icon: '🍃',
        title: 'Hop Innovation Capital',
        description: 'Home to experimental hop farms and the birthplace of American IPA culture, California brewers continuously push hop flavor boundaries with fresh, unique varietals.'
      },
      {
        icon: '🍷',
        title: 'Wine Barrel Aging Mastery',
        description: 'Unparalleled access to premium wine barrels from Napa and Sonoma creates complex barrel-aged beers that showcase California\'s wine heritage in craft beer.'
      },
      {
        icon: '🌮',
        title: 'Food Pairing Culture',
        description: 'California\'s diverse culinary scene drives innovative brewing, from Mexican-inspired cerveza to Asian fusion pairings, creating America\'s most food-centric beer culture.'
      }
    ],
    pioneerBreweries: [
      {
        name: 'Anchor Brewing Company',
        location: 'San Francisco',
        yearFounded: 1896,
        story: 'America\'s first modern craft brewery revival, Anchor rescued traditional brewing methods and created the uniquely American Steam Beer style. When Fritz Maytag purchased the failing brewery in 1965, his commitment to quality and tradition sparked what would become the entire American craft beer movement.',
        achievement: 'Created California Common style, sparked American craft beer renaissance'
      },
      {
        name: 'New Albion Brewing Company',
        location: 'Sonoma',
        yearFounded: 1976,
        story: 'Founded by Jack McAuliffe, New Albion was the first new brewery built in America since Prohibition. Though it closed in 1982, this pioneering brewery proved that Americans were ready for flavorful, full-bodied beers and inspired countless others to start brewing.',
        achievement: 'First new American brewery since Prohibition, inspired craft beer movement'
      },
      {
        name: 'Sierra Nevada Brewing Co.',
        location: 'Chico',
        yearFounded: 1980,
        story: 'Ken Grossman\'s Sierra Nevada perfected the American Pale Ale style and established the hop-forward tradition that defines West Coast brewing. Their commitment to sustainability and innovation continues to influence brewers worldwide.',
        achievement: 'Perfected American Pale Ale style, established hop-forward tradition'
      },
      {
        name: 'Stone Brewing',
        location: 'San Diego',
        yearFounded: 1996,
        story: 'Stone Brewing revolutionized American craft beer with their unapologetically bold, hop-forward approach. Their Arrogant Bastard Ale challenged conventional brewing wisdom and established San Diego as America\'s hop capital.',
        achievement: 'Pioneered aggressive hop-forward ales, established San Diego brewing'
      }
    ],
    culturalStory: {
      title: 'Innovation Meets Tradition in the Golden State',
      paragraphs: [
        'California breweries serve as epicenters of innovation where tradition meets experimentation, creating a culture that constantly pushes the boundaries of what beer can be. From San Diego\'s aggressive hop experiments to Northern California\'s sophisticated barrel-aging programs, the Golden State has redefined American brewing.',
        'The state\'s diverse geography and climate provide unique advantages: coastal fog creates perfect hop-growing conditions, wine country offers endless barrel possibilities, and year-round growing seasons provide fresh ingredients. This natural bounty combines with California\'s innovation culture to create unparalleled brewing creativity.',
        'California breweries have become global destinations, with beer tourists traveling from around the world to experience everything from Russian River\'s legendary Pliny releases to Stone Brewing\'s bold hop showcases. This tourism generates billions in economic impact while cementing California\'s position as the world\'s craft beer capital.'
      ],
      impactStats: '958 breweries supporting 65,000+ jobs and generating $9.4B economic impact while leading global brewing innovation'
    },
    innovations: [
      {
        title: 'West Coast IPA Revolution',
        description: 'California breweries pioneered the hop-forward IPA style that became America\'s signature beer style, influencing brewers worldwide.'
      },
      {
        title: 'Wine Barrel Aging Mastery',
        description: 'Proximity to world-class wineries created innovative barrel-aging programs that add wine complexity to craft beer.'
      },
      {
        title: 'Fresh Hop Innovation',
        description: 'California\'s hop farms allow breweries to create fresh-hop beers that capture the essence of just-harvested hops.'
      },
      {
        title: 'Sustainable Brewing Practices',
        description: 'California breweries lead in environmental sustainability, from solar power to water conservation and organic farming partnerships.'
      }
    ],
    nextState: {
      name: 'Colorado',
      preview: 'High-altitude brewing with mountain water meets outdoor adventure culture in America\'s brewing playground'
    }
  }

  return (
    <StateNewsletterTemplate 
      stateData={californiaData}
      subscriberName={subscriberName}
      unsubscribeToken={unsubscribeToken}
      previewMode={previewMode}
    />
  )
}