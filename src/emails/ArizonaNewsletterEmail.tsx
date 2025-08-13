import StateNewsletterTemplate from './StateNewsletterTemplate'

interface ArizonaNewsletterProps {
  subscriberName?: string
  weekNumber?: number
  unsubscribeToken?: string
  previewMode?: boolean
}

export default function ArizonaNewsletterEmail({
  subscriberName = 'Beer Enthusiast',
  weekNumber = 3,
  unsubscribeToken,
  previewMode = false
}: ArizonaNewsletterProps) {
  
  const arizonaData = {
    stateName: 'Arizona',
    stateCode: 'AZ',
    weekNumber,
    tagline: 'Where desert innovation meets thousand-year brewing traditions',
    heroImage: 'https://www.hopharrison.com/images/State%20Images/Arizona.png',
    colorScheme: {
      primary: '#dc2626', // Red rock inspired
      secondary: '#ea580c', // Desert sunset
      accent: '#f97316', // Arizona orange
      light: '#fef2f2' // Light red tint
    },
    stats: {
      breweries: 108,
      perCapitaRank: '#8',
      economicImpact: '$2.1B',
      additionalStats: [
        { label: 'Jobs Created', value: '11,000+' },
        { label: 'Per 100k Residents', value: '14.8' },
        { label: 'Craft Beer Tourism', value: '$180M' }
      ]
    },
    uniqueAdvantages: [
      {
        icon: '🏜️',
        title: 'Desert Terroir',
        description: 'Unique high-desert climate creates distinctive fermentation profiles and allows year-round brewing with innovative cooling techniques perfected in extreme heat.'
      },
      {
        icon: '🌵',
        title: 'Indigenous Ingredients',
        description: 'Prickly pear cactus, mesquite honey, cholla buds, and desert sage create flavor profiles impossible to replicate anywhere else in America.'
      },
      {
        icon: '☀️',
        title: 'Solar Sustainability',
        description: 'Arizona breweries lead the nation in solar-powered operations, turning the relentless desert sun into sustainable energy for eco-friendly brewing.'
      },
      {
        icon: '🏛️',
        title: 'Ancient Brewing Heritage',
        description: 'Modern craft brewing built on 1,000+ year old traditions from Hohokam and Ancestral Puebloan cultures who brewed corn-based beverages in this desert.'
      }
    ],
    pioneerBreweries: [
      {
        name: 'Four Peaks Brewing Company',
        location: 'Tempe',
        yearFounded: 1996,
        story: 'Founded in a former creamery building, Four Peaks became Arizona\'s flagship brewery by perfecting year-round brewing in extreme heat. Their Kilt Lifter Scottish Ale became the state\'s signature beer, proving desert brewing could produce world-class results.',
        achievement: 'First Arizona brewery to achieve national distribution and AB InBev partnership while maintaining quality'
      },
      {
        name: 'Tombstone Brewing Company',
        location: 'Tombstone',
        yearFounded: 1996,
        story: 'Operating in the historic Wild West town, Tombstone Brewing connects modern craft beer to Arizona\'s frontier heritage. Their location in the "Town Too Tough to Die" embodies Arizona\'s independent brewing spirit.',
        achievement: 'Pioneered Wild West-themed brewing and tourist destination brewery model'
      },
      {
        name: 'Prescott Brewing Company',
        location: 'Prescott',
        yearFounded: 1994,
        story: 'Arizona\'s first brewpub established brewing culture in the state\'s mountains, proving craft beer could thrive at elevation with cooler temperatures and pine-scented mountain air creating unique brewing conditions.',
        achievement: 'Arizona\'s first brewpub and pioneer of mountain desert brewing techniques'
      }
    ],
    culturalStory: {
      title: 'Beer as Desert Community in the Sonoran',
      paragraphs: [
        'In Arizona, craft breweries serve as essential gathering spaces in a state where community building requires intention. From Phoenix\'s urban heat islands to Flagstaff\'s mountain communities, breweries provide climate-controlled refuges where neighbors connect over locally-made beer.',
        'The state\'s brewing culture reflects its diverse population—retirees seeking community, tech workers building the new Arizona economy, and multi-generational families preserving Southwest traditions. Breweries like Wren House Brewing in Phoenix have become neighborhood institutions that bridge these communities.',
        'Arizona\'s craft beer scene also celebrates the state\'s indigenous heritage, with breweries partnering with tribal communities to source native ingredients and honor traditional fermentation practices that predate European brewing by centuries.'
      ],
      impactStats: 'Arizona breweries generate $2.1 billion annually while employing 11,000+ Arizonans, with craft beer tourism contributing an additional $180 million to local economies.'
    },
    innovations: [
      {
        title: '🌡️ Heat-Resistant Brewing',
        description: 'Arizona breweries developed specialized cooling systems and fermentation techniques that work efficiently in 115°F+ summer temperatures, innovations now adopted globally.'
      },
      {
        title: '🌵 Desert Foraging Programs',
        description: 'Systematic harvesting of prickly pear, cholla buds, and desert sage creates seasonal beer programs that showcase the Sonoran Desert\'s unique terroir.'
      },
      {
        title: '☀️ Solar Brewing Operations',
        description: 'Leading the craft beer industry in renewable energy adoption, with breweries like SanTan Brewing operating entirely on solar power during peak production.'
      },
      {
        title: '🏛️ Heritage Grain Revival',
        description: 'Partnerships with University of Arizona to revive ancestral corn varieties and brewing techniques, connecting modern craft beer to 1,000+ year brewing traditions.'
      }
    ],
    nextState: {
      name: 'Colorado',
      preview: 'From Denver\'s Beer Mile to mountain breweries at 10,000+ feet elevation, discover how the Centennial State became America\'s craft beer capital with 400+ breweries and revolutionary high-altitude brewing techniques.'
    }
  }

  return (
    <StateNewsletterTemplate
      subscriberName={subscriberName}
      stateData={arizonaData}
      unsubscribeToken={unsubscribeToken}
      previewMode={previewMode}
    />
  )
}