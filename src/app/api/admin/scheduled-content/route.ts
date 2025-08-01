import { NextRequest, NextResponse } from 'next/server'

// Alaska Week 2 Content - Ready for August 4th Launch
const getScheduledContent = (filter: string) => {
  // Set launch date to Monday August 4th, 2025
  const launchDate = new Date('2025-08-04T15:00:00.000Z') // 3 PM EST Monday
  const day1 = new Date(launchDate.getTime() + 0 * 24 * 60 * 60 * 1000) // Monday
  const day2 = new Date(launchDate.getTime() + 1 * 24 * 60 * 60 * 1000) // Tuesday  
  const day3 = new Date(launchDate.getTime() + 2 * 24 * 60 * 60 * 1000) // Wednesday
  const day4 = new Date(launchDate.getTime() + 3 * 24 * 60 * 60 * 1000) // Thursday
  const day5 = new Date(launchDate.getTime() + 4 * 24 * 60 * 60 * 1000) // Friday
  const day6 = new Date(launchDate.getTime() + 5 * 24 * 60 * 60 * 1000) // Saturday
  const day7 = new Date(launchDate.getTime() + 6 * 24 * 60 * 60 * 1000) // Sunday

  const allContent = [
    // Alaska Week 2 - Day 1 (Monday) - Alaskan Amber
    {
      id: 'alaska_day1_amber',
      type: 'daily_beer' as const,
      title: 'Alaskan Amber - Alaska Week 2 Day 1',
      scheduledFor: day1.toISOString(),
      status: 'pending' as const,
      content: {
        body: `🍺 WEEK 2 BEGINS: ALASKA'S LAST FRONTIER! 🗻❄️

Day 1: Alaskan Brewing Company's Alaskan Amber (5.3% ABV)

This isn't just beer - it's liquid history! Brewed from a Gold Rush-era recipe discovered in the Juneau-Douglas City Museum archives. Founded by 28-year-old Marcy and Geoff Larson in 1986, becoming the 67th independent brewery in America.

🥃 TASTING NOTES:
Rich amber color with toasted malt sweetness balanced by noble hop character. Smooth, clean finish that pairs perfectly with fresh salmon or hearty Alaskan stews. 

🏔️ THE ALASKA DIFFERENCE:
• Pristine glacial water from the Juneau Icefield
• Extreme weather challenges create unique brewing opportunities  
• Sustainability leadership: industry-first CO₂ recovery systems
• Distribution to 25 states despite remote location

From museum archives to modern craft brewing empire - this is Alaska's pioneering spirit in a glass.

Read the full Alaska adventure: www.hopharrison.com/states/alaska

#AlaskanBrewing #AlaskaAmber #GoldRush #LastFrontier #CraftBeer #AlaskaBeer #Week2 #BrewQuestChronicles #HopHarrison #JuneauBrewing #HistoricRecipe`,
        metadata: {
          beer: {
            name: 'Alaskan Amber',
            brewery: 'Alaskan Brewing Company',
            style: 'American Amber Ale',
            abv: 5.3
          },
          platform: 'Instagram',
          characterCount: 1247
        }
      },
      qualityScore: 9.2,
      aiGenerated: true,
      lastModified: new Date().toISOString()
    },
    // Alaska Week 2 - Day 2 (Tuesday) - Sockeye Red IPA  
    {
      id: 'alaska_day2_sockeye',
      type: 'daily_beer' as const,
      title: 'Sockeye Red IPA - Alaska Week 2 Day 2',
      scheduledFor: day2.toISOString(),
      status: 'pending' as const,
      content: {
        body: `🍺 Day 2: Midnight Sun's Sockeye Red IPA! 🐟🍻

Midnight Sun Brewing Company (Anchorage, 1995)
Sockeye Red IPA - 5.7% ABV, 70 IBU

Named after Alaska's legendary salmon run, this copper-red IPA perfectly captures the wild spirit of the Last Frontier. Bold hop character meets rich malt backbone - like watching the Northern Lights with a campfire nearby.

🎣 TASTING PROFILE:
Deep copper-red color from crystal malts. Citrus and pine hop aromas with caramel sweetness. Balanced bitterness that doesn't overpower the malt complexity. Clean, dry finish.

🌌 MIDNIGHT SUN STORY:
From humble beginnings to Alaska's most extreme brewery. Known for pushing boundaries with beers like Berserker Imperial Stout (12.7% ABV). Their barrel-aging program rivals any Lower 48 operation.

Fun fact: Anchorage gets 22 hours of daylight in summer - perfect for extended brewery visits!

Perfect pairing: Fresh grilled salmon, Alaskan king crab, or hearty winter stews.

Experience Alaska's brewing frontier: www.hopharrison.com/states/alaska

#MidnightSun #SockeyeRed #AlaskaBrewing #Anchorage #RedIPA #SalmonRun #ExtremeBrewing #Week2 #BrewQuestChronicles #AlaskanAdventure`,
        metadata: {
          beer: {
            name: 'Sockeye Red IPA',
            brewery: 'Midnight Sun Brewing Company',
            style: 'Red IPA',
            abv: 5.7
          },
          platform: 'Instagram',
          characterCount: 1089
        }
      },
      qualityScore: 8.8,
      aiGenerated: true,
      lastModified: new Date().toISOString()
    },

    // Alaska Week 2 - Day 3 (Wednesday) - German Kölsch
    {
      id: 'alaska_day3_kolsch',
      type: 'daily_beer' as const,
      title: 'HooDoo German Kölsch - Alaska Week 2 Day 3',
      scheduledFor: day3.toISOString(),
      status: 'pending' as const,
      content: {
        body: `🍺 Day 3: HooDoo's German Kölsch from Alaska's Interior! 🍻

HooDoo Brewing Company (Fairbanks, 2012)
German Kölsch - Light, Crisp, Always on Tap

From Fairbanks (-40°F winters!) comes this authentic German-style Kölsch. While most Alaska breweries go big and bold, HooDoo proves that sometimes simplicity is genius.

🇩🇪 AUTHENTIC KÖLSCH STYLE:
Light golden color, delicate hop character, clean crisp finish. Brewed with traditional German techniques in Alaska's interior - where winter temperatures can freeze your breath!

❄️ THE FAIRBANKS FACTOR:
Interior Alaska presents unique brewing challenges:
• Extreme temperature swings (-40°F to 90°F)
• Supply logistics across hundreds of miles
• Short growing season for local ingredients
• Tight-knit community of serious beer enthusiasts

🍺 BREWING PHILOSOPHY:
HooDoo focuses on authentic European styles executed flawlessly. Their German Kölsch stays true to Cologne brewing traditions while adapting to Alaska's extreme climate.

Perfect for: Summer fishing trips, after cross-country skiing, or simply appreciating craftsmanship in its purest form.

This is what happens when German precision meets Alaskan determination.

Explore Alaska's brewing diversity: www.hopharrison.com/states/alaska

#HooDoo #GermanKolsch #Fairbanks #InteriorAlaska #AuthenticBrewing #ExtremeBrewing #TraditionalStyles #Week2 #BrewQuestChronicles #AlaskanCraft`,
        metadata: {
          beer: {
            name: 'German Kölsch',
            brewery: 'HooDoo Brewing Company',
            style: 'Kölsch',
            abv: 4.8
          },
          platform: 'Instagram',
          characterCount: 1245
        }
      },
      qualityScore: 8.4,
      aiGenerated: true,
      lastModified: new Date().toISOString()
    },
    // Alaska Week 2 - Day 4 (Thursday) - Belgian Triple
    {
      id: 'alaska_day4_triple',
      type: 'daily_beer' as const,
      title: 'Belgian Triple - Alaska Week 2 Day 4',
      scheduledFor: day4.toISOString(),
      status: 'pending' as const,
      content: {
        body: `🍺 Day 4: Cynosure's Belgian Triple - European Elegance in Alaska! 🇧🇪

Cynosure Brewing (Anchorage)
Belgian Triple - 9.7% ABV

In the land of extreme brewing, sometimes the most radical approach is traditional European elegance. Cynosure Brewing brings authentic Belgian monastery brewing traditions to Alaska's urban frontier.

🍺 CLASSIC BELGIAN TRIPLE:
Golden color, complex spicy-fruity esters from Belgian yeast. Traditional brewing techniques using pilsner malt, Belgian candi sugar, and noble hops. Deceptively smooth despite high alcohol content.

🏔️ ANCHORAGE BREWING SCENE:
Alaska's largest city hosts diverse brewing styles:
• Midnight Sun (extreme/experimental)
• King Street (flavored porters)
• Resolution (modern hop-forward)
• Cynosure (traditional European styles)
• Broken Tooth (pizza + beer integration)

🇧🇪 TRADITIONAL TECHNIQUE MEETS ALASKAN INNOVATION:
Using imported Belgian yeast strains that have been cultivated for centuries in monastery breweries. The extreme climate actually helps with temperature control during fermentation.

Perfect for: Contemplative winter evenings, pairing with rich game meats, or celebrating special occasions in true European style.

From monastery traditions to Alaskan innovation - this is brewing without borders.

Discover Alaska's brewing diversity: www.hopharrison.com/states/alaska

#Cynosure #BelgianTriple #TraditionalBrewing #Anchorage #MonasteryStyle #HighABV #EuropeanTradition #Week2 #BrewQuestChronicles #AlaskanBrewing`,
        metadata: {
          beer: {
            name: 'Belgian Triple',
            brewery: 'Cynosure Brewing',
            style: 'Belgian Tripel',
            abv: 9.7
          },
          platform: 'Instagram',
          characterCount: 1398
        }
      },
      qualityScore: 8.9,
      aiGenerated: true,
      lastModified: new Date().toISOString()
    },

    // Alaska Week 2 - Day 5 (Friday) - Pipeline Stout
    {
      id: 'alaska_day5_stout',
      type: 'daily_beer' as const,
      title: 'Pipeline Stout - Alaska Week 2 Day 5',
      scheduledFor: day5.toISOString(),
      status: 'pending' as const,
      content: {
        body: `🍺 Day 5: Moose's Tooth Pipeline Stout - Alaska's Ultimate Winter Warmer! ⚫🍻

Broken Tooth Brewing/Moose's Tooth (Anchorage)
Pipeline Stout - 5.9% ABV, Full-Bodied Oatmeal Stout

Friday night in Anchorage means pizza, beer, and legendary Alaskan hospitality. Pipeline Stout is Alaska's answer to the perfect winter companion - smooth, creamy, and as reliable as the Trans-Alaska Pipeline itself.

🖤 OATMEAL STOUT PERFECTION:
Deep black color with tan head. Rich chocolate and coffee flavors balanced by oatmeal smoothness. Full body without being overwhelming. Clean, satisfying finish.

🍕 THE MOOSE'S TOOTH EXPERIENCE:
More than a brewery - it's an Anchorage institution! This brewpub combines award-winning pizza with exceptional craft beer. Friday night waits are legendary, but totally worth it.

🛢️ PIPELINE REFERENCE:
Named after the Trans-Alaska Pipeline, this stout represents the engineering marvel that keeps Alaska connected. Like the pipeline, this beer delivers consistently excellent results under extreme conditions.

❄️ PERFECT ALASKA PAIRING:
Pairs beautifully with their famous pizza, fresh Alaska seafood, or enjoyed by itself while watching the Northern Lights. The oatmeal provides warming comfort during those long Alaskan winters.

When Alaskans gather for good food and great beer, Pipeline Stout flows freely.

Experience Anchorage brewing culture: www.hopharrison.com/states/alaska

#MoosesTooth #PipelineStout #OatmealStout #Anchorage #PizzaAndBeer #CommunityHub #TransAlaskaPipeline #Week2 #BrewQuestChronicles #AlaskanInstitution`,
        metadata: {
          beer: {
            name: 'Pipeline Stout',
            brewery: 'Broken Tooth Brewing/Moose\'s Tooth',
            style: 'Oatmeal Stout',
            abv: 5.9
          },
          platform: 'Instagram',
          characterCount: 1456
        }
      },
      qualityScore: 9.0,
      aiGenerated: true,
      lastModified: new Date().toISOString()
    },

    // Alaska Week 2 - Day 6 (Saturday) - New England IPA
    {
      id: 'alaska_day6_neipa',
      type: 'daily_beer' as const,
      title: 'New England IPA - Alaska Week 2 Day 6',
      scheduledFor: day6.toISOString(),
      status: 'pending' as const,
      content: {
        body: `🍺 Day 6: Resolution's New England IPA - Modern Hops Meet Maritime History! 🚢

Resolution Brewing Company (Anchorage)
New England Style IPA with Citra, El Dorado, Mosaic

Named after Captain James Cook's ship HMS Resolution, this brewery brings modern hop innovation to Alaska's maritime heritage. This NEIPA proves that Alaska's brewing scene rivals any coastal hop hotbed.

🌊 HMS RESOLUTION HISTORY:
Captain Cook's ship explored Alaska's coast in 1778-1779, mapping uncharted waters and establishing trade routes. Today's Resolution Brewing continues that spirit of exploration through innovative hop combinations.

🍺 NEIPA PERFECTION IN ALASKA:
Hazy golden appearance, tropical fruit aromas from modern hop varieties. Soft mouthfeel with intense flavor but balanced bitterness. Citra provides grapefruit notes, El Dorado adds pineapple, Mosaic brings complexity.

🗺️ MODERN EXPLORATION:
While Cook mapped coastlines, Resolution Brewing maps hop flavor territories:
• Citra: Bright citrus exploration
• El Dorado: Tropical fruit discovery  
• Mosaic: Complex flavor navigation

🌨️ ALASKA'S HOP INNOVATION:
Despite being far from hop-growing regions, Alaska brewers excel at hop-forward styles. Creative use of modern hop varieties creates unique expressions you won't find elsewhere.

Perfect for: Weekend fishing trips, summer festivals under the midnight sun, or exploring Anchorage's vibrant craft scene.

From maritime exploration to hop innovation - Alaska continues charting new territories.

Navigate Alaska's craft beer waters: www.hopharrison.com/states/alaska

#Resolution #NewEnglandIPA #CaptainCook #Anchorage #ModernHops #Citra #ElDorado #Mosaic #MaritimeHistory #Week2 #BrewQuestChronicles #HopExploration`,
        metadata: {
          beer: {
            name: 'New England Style IPA',
            brewery: 'Resolution Brewing Company',
            style: 'New England IPA',
            abv: 6.8
          },
          platform: 'Instagram',
          characterCount: 1487
        }
      },
      qualityScore: 8.7,
      aiGenerated: true,
      lastModified: new Date().toISOString()
    },

    // Alaska Week 2 - Day 7 (Sunday) - Chocolate Coconut Porter
    {
      id: 'alaska_day7_porter',
      type: 'daily_beer' as const,
      title: 'Chocolate Coconut Porter - Alaska Week 2 Day 7',
      scheduledFor: day7.toISOString(),
      status: 'pending' as const,
      content: {
        body: `🍺 Day 7 FINALE: King Street's Chocolate Coconut Porter - Tropical Dreams in the Last Frontier! 🥥🍫

King Street Brewing Company (Anchorage)
Chocolate Coconut Porter - 6.0% ABV

What do you get when Alaska's creativity meets unexpected flavors? Pure magic! King Street's Chocolate Coconut Porter perfectly caps our Alaska adventure with bold innovation that only makes sense in the Last Frontier.

🥥 TROPICAL MEETS ARCTIC:
Rich dark porter base infused with real chocolate and coconut. Smooth, creamy texture with indulgent dessert-like character. The contrast between tropical flavors and Alaska's extreme climate creates something uniquely special.

👑 KING STREET INNOVATION:
Known for pushing flavor boundaries with both beer and ciders. Their experimental spirit reflects Alaska's willingness to try anything once - and perfect it twice.

🌺 THE ALASKA PARADOX:
While Anchorage averages -10°F in January, locals dream of tropical escapes. This porter delivers vacation vibes without leaving the brewery. It's comfort food in liquid form.

🍫 PERFECT PAIRINGS:
Pairs beautifully with:
• Fresh Alaskan salmon with teriyaki glaze
• Dark chocolate desserts
• Coconut curry dishes
• S'mores around a winter campfire

WEEK 2 COMPLETE! From historic Gold Rush recipes to modern tropical innovation, Alaska's 49 breweries prove that great beer knows no boundaries.

Next week: Which state calls to us next?

Explore Alaska's complete brewing story: www.hopharrison.com/states/alaska

#KingStreet #ChocolateCoconut #Porter #Innovation #TropicalMeetsArctic #Week2Finale #AlaskaComplete #49Breweries #LastFrontier #BrewQuestChronicles #NextAdventure`,
        metadata: {
          beer: {
            name: 'Chocolate Coconut Porter',
            brewery: 'King Street Brewing Company',
            style: 'Flavored Porter',
            abv: 6.0
          },
          platform: 'Instagram',
          characterCount: 1342
        }
      },
      qualityScore: 9.1,
      aiGenerated: true,
      lastModified: new Date().toISOString()
    },

    // Weekly Wrap-up Post (Sunday evening)
    {
      id: 'alaska_week_complete',
      type: 'weekly_state' as const,
      title: 'Alaska Week 2 Complete - State Summary',
      scheduledFor: new Date(day7.getTime() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
      status: 'pending' as const,
      content: {
        body: `🏔️ WEEK 2 COMPLETE: ALASKA'S LAST FRONTIER CONQUERED! ❄️🍺

From Gold Rush history to modern innovation, Alaska has shown us what brewing excellence looks like under extreme conditions. Here's what makes the 49th state special:

📊 ALASKA BY THE NUMBERS:
• 49 active breweries
• 4th nationally in breweries per capita  
• $332M economic impact
• 250+ brewing jobs, 2,200+ related jobs
• 9.3 gallons consumed per drinking-age resident

🗺️ THIS WEEK'S JOURNEY:
Day 1: Alaskan Amber (Historic Gold Rush recipe)
Day 2: Sockeye Red IPA (Salmon-inspired boldness)
Day 3: German Kölsch (European precision)
Day 4: Belgian Triple (Monastery traditions)
Day 5: Pipeline Stout (Community gathering)
Day 6: New England IPA (Maritime exploration)
Day 7: Chocolate Coconut Porter (Tropical innovation)

🌟 ALASKA'S UNIQUE ADVANTAGES:
• Pristine glacial water from Juneau Icefield
• Extreme weather creates unique brewing challenges/opportunities
• Indigenous ingredients: spruce tips, birch syrup, wild berries
• Tight-knit community drives quality and innovation
• Sustainability leadership with CO₂ recovery systems

Next week's adventure awaits! Which state should we explore next in our 50-state journey?

Read the complete Alaska brewing story: www.hopharrison.com/states/alaska

#AlaskaComplete #Week2Done #LastFrontier #49Breweries #GlacialWater #ExtremeBrewing #NextAdventure #BrewQuestChronicles #50StateJourney #WhatsNext`,
        metadata: {
          state: {
            name: 'Alaska',
            week: 2
          },
          platform: 'Instagram',
          characterCount: 1456
        }
      },
      qualityScore: 9.3,
      aiGenerated: true,
      lastModified: new Date().toISOString()
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
    totalScheduled: 8,
    pendingApproval: 8,
    approved: 0,
    qualityScoreAvg: 8.9
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