import { NextRequest, NextResponse } from 'next/server'

// Mock scheduled content data - replace with actual database queries
const getScheduledContent = (filter: string) => {
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const dayAfter = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)

  const allContent = [
    {
      id: 'content_1',
      type: 'daily_beer' as const,
      title: 'Yellowhammer Belgian White - Alabama Day 2',
      scheduledFor: tomorrow.toISOString(),
      status: 'pending' as const,
      content: {
        body: `🍺 Day 2 of Alabama Week! 

Yellowhammer Brewing's Belgian White (4.8%) - Traditional Belgian witbier with coriander and orange peel. Cloudy golden, smooth wheat mouthfeel.

Huntsville's authentic European brewing techniques meet Southern hospitality since 2013.

www.hopharrison.com/blog/alabama

#CraftBeer #AlabamaBeer #YellowhammerBrewing #BelgianBeer #HuntsvilleEats #BrewQuestChronicles #HopHarrison #Day2`,
        metadata: {
          beer: {
            name: 'Belgian White',
            brewery: 'Yellowhammer Brewing',
            style: 'Belgian Witbier',
            abv: 4.8
          },
          platform: 'Instagram',
          characterCount: 414
        }
      },
      qualityScore: 8.5,
      aiGenerated: true,
      lastModified: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'content_2',
      type: 'social_post' as const,
      title: 'Twitter - Yellowhammer Belgian White',
      scheduledFor: tomorrow.toISOString(),
      status: 'approved' as const,
      content: {
        body: `🍺 Day 2 of Alabama Week! 

Yellowhammer Brewing's Belgian White (4.8%) - traditional witbier with coriander and orange peel

Huntsville's authentic European brewing since 2013.

www.hopharrison.com/blog/alabama

#CraftBeer #AlabamaBeer`,
        metadata: {
          beer: {
            name: 'Belgian White',
            brewery: 'Yellowhammer Brewing',
            style: 'Belgian Witbier',
            abv: 4.8
          },
          platform: 'Twitter',
          characterCount: 234
        }
      },
      qualityScore: 9.1,
      aiGenerated: true,
      lastModified: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'content_3',
      type: 'daily_beer' as const,
      title: 'Cahaba Oka Uba IPA - Alabama Day 3',
      scheduledFor: dayAfter.toISOString(),
      status: 'pending' as const,
      content: {
        body: `🍺 Day 3 of Alabama Week! 

Cahaba Brewing's Oka Uba IPA (7.0%) - Named after indigenous Cahaba River word meaning "Water Above." Earthy hop character with citrus notes.

Birmingham's river-inspired brewery creating perfect outdoor adventure beers since 2012.

www.hopharrison.com/blog/alabama

#CraftBeer #AlabamaBeer #CahabaBrewing #BirminghamEats #CahabaRiver #OutdoorBeer #BrewQuestChronicles #HopHarrison #Day3`,
        metadata: {
          beer: {
            name: 'Oka Uba IPA',
            brewery: 'Cahaba Brewing Company',
            style: 'American IPA',
            abv: 7.0
          },
          platform: 'Instagram',
          characterCount: 438
        }
      },
      qualityScore: 7.8,
      aiGenerated: true,
      lastModified: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'content_4',
      type: 'weekly_state' as const,
      title: 'Alaska Week Launch - Week 2',
      scheduledFor: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending' as const,
      content: {
        body: `🍺 Week 2: Alaska's Last Frontier Brewing! 🍺

The Last Frontier has built a unique brewing scene shaped by extreme conditions and pioneering spirit. From Anchorage's urban breweries to remote glacier-fed operations.

🌟 What makes Alaska special:
• Extreme weather creates unique brewing challenges and opportunities
• Glacier water provides some of the purest brewing water in the world
• Small population means tight-knit brewing community
• Indigenous ingredients like spruce tips and birch syrup

This week's journey through Alaska's brewing frontier...`,
        metadata: {
          state: {
            name: 'Alaska',
            week: 2
          },
          platform: 'Instagram'
        }
      },
      qualityScore: 6.2,
      aiGenerated: true,
      lastModified: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()
    }
  ]

  let filteredContent = allContent
  if (filter !== 'all') {
    filteredContent = allContent.filter(content => content.status === filter)
  }

  return filteredContent
}

const getContentStats = () => {
  return {
    totalScheduled: 12,
    pendingApproval: 3,
    approved: 7,
    qualityScoreAvg: 8.1
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'

    const content = getScheduledContent(filter)
    const stats = getContentStats()

    return NextResponse.json({
      success: true,
      content,
      stats
    })
  } catch (error) {
    console.error('Error fetching scheduled content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scheduled content' },
      { status: 500 }
    )
  }
}