export interface BeerReview {
  id: string
  name: string
  brewery: string
  style: string
  abv: number
  ibu?: number
  description: string
  tastingNotes: string
  rating: number // 1-5 scale
  dayOfWeek: number // 1-7 for daily content
  imageUrl?: string
}

export interface StateData {
  code: string // 'AL', 'AK', etc.
  name: string
  status: 'upcoming' | 'current' | 'completed'
  weekNumber: number
  featuredBeers: BeerReview[] // 7 beers for daily content
  blogPostSlug?: string
  completionDate?: Date
  heroImage?: string
  description?: string
  totalBreweries?: number
  region: 'northeast' | 'southeast' | 'midwest' | 'southwest' | 'west'
  capital?: string
  population?: number
  breweryDensity?: number // breweries per 100k people
}

export const stateProgressData: StateData[] = [
  // CORRECT ALPHABETICAL ORDER - All 50 States
  
  // Week 1: Alabama
  {
    code: 'AL',
    name: 'Alabama',
    status: 'completed',
    weekNumber: 1,
    featuredBeers: [
      {
        id: 'al-01',
        name: 'Good People IPA',
        brewery: 'Good People Brewing Company',
        style: 'American IPA',
        abv: 6.8,
        ibu: 55,
        description: "Alabama's #1 selling IPA for the last 10 years, this flagship brew showcases American hop character with citrus and pine notes.",
        tastingNotes: 'Bright citrus aroma with grapefruit and orange peel, balanced malt backbone, clean bitter finish with subtle pine resin.',
        rating: 4,
        dayOfWeek: 1,
        imageUrl: '/images/Beer images/Alabama/Good People IPA.png'
      },
      {
        id: 'al-02',
        name: 'Belgian White',
        brewery: 'Yellowhammer Brewing',
        style: 'Belgian Witbier',
        abv: 4.8,
        ibu: 15,
        description: "Huntsville's signature wheat beer, this traditional Belgian-style witbier showcases authentic European brewing techniques with coriander and orange peel.",
        tastingNotes: 'Cloudy golden appearance, citrus and spice aromas from coriander and orange peel, smooth wheat mouthfeel, refreshing and authentic.',
        rating: 4,
        dayOfWeek: 2,
        imageUrl: '/images/Beer images/Alabama/Belgian White.YellowHammerpng.png'
      },
      {
        id: 'al-03',
        name: 'Cahaba Oka Uba IPA',
        brewery: 'Cahaba Brewing Company',
        style: 'American IPA',
        abv: 7.0,
        ibu: 61,
        description: 'Named after the indigenous word for Cahaba River meaning "the Water Above," this earthy IPA is dry-hopped for complexity.',
        tastingNotes: 'Orange-red hue, earthy hop character with citrus notes, malty backbone, balanced bitterness with noble hop finish.',
        rating: 4,
        dayOfWeek: 3,
        imageUrl: '/images/Beer images/Alabama/Cahaba Oka Uba IPA.png'
      },
      {
        id: 'al-04',
        name: 'TrimTab Paradise Now',
        brewery: 'TrimTab Brewing Company',
        style: 'Berliner Weisse (Fruited)',
        abv: 4.2,
        ibu: 8,
        description: "A tropical passionfruit and raspberry Berliner Weisse that showcases Birmingham's innovative brewing scene.",
        tastingNotes: 'Bright pink color, tropical fruit aroma, tart and refreshing with passionfruit and raspberry sweetness, crisp finish.',
        rating: 4.5,
        dayOfWeek: 4,
        imageUrl: '/images/Beer images/Alabama/TrimTab Paradise now.jpg'
      },
      {
        id: 'al-05',
        name: "Avondale Miss Fancy's Tripel",
        brewery: 'Avondale Brewing Company',
        style: 'Belgian Tripel',
        abv: 9.2,
        ibu: 28,
        description: "A classic Belgian-style tripel brewed in Birmingham's historic Avondale district with traditional techniques.",
        tastingNotes: 'Golden color, spicy phenolic aroma, fruity esters, warming alcohol, dry finish with Belgian yeast character.',
        rating: 4,
        dayOfWeek: 5,
        imageUrl: '/images/Beer images/Alabama/Avondale Miss Fancy\'s Triple.png'
      },
      {
        id: 'al-06',
        name: 'Snake Handler',
        brewery: 'Back Forty Beer Company',
        style: 'Double IPA',
        abv: 9.2,
        ibu: 99,
        description: 'Gadsden-based brewery\'s flagship DIPA, this bold beer showcases aggressive American hop character with Southern attitude.',
        tastingNotes: 'Golden copper color, intense citrus and pine hop aroma, full-bodied with substantial malt backbone, lingering bitter finish.',
        rating: 4.5,
        dayOfWeek: 6,
        imageUrl: '/images/Beer images/Alabama/Snake-Handler-Back-Forty.jpg'
      },
      {
        id: 'al-07',
        name: 'Darker Subject Matter',
        brewery: 'Monday Night Brewing (Birmingham Social Club)',
        style: 'Imperial Stout',
        abv: 13.9,
        ibu: 45,
        description: "A bold, high-gravity imperial stout from the Atlanta-based brewery's Birmingham location, showcasing intense roasted complexity.",
        tastingNotes: 'Pitch black with dense tan head, intense coffee and dark chocolate aroma, full-bodied with bourbon barrel character, warming finish with roasted bitterness.',
        rating: 4.5,
        dayOfWeek: 7,
        imageUrl: '/images/Beer images/Alabama/Monday Night Brewing Imperial Stout.png'
      }
    ],
    blogPostSlug: 'alabama-craft-beer-journey',
    heroImage: '/images/Craft-Brewery-Landscape.png',
    description: 'Heart of Dixie brewing scene emerging with southern charm and innovation.',
    totalBreweries: 45,
    region: 'southeast',
    capital: 'Montgomery',
    population: 5024279,
    breweryDensity: 0.9
  },

  // Week 2: Alaska
  {
    code: 'AK',
    name: 'Alaska',
    status: 'completed',
    weekNumber: 2,
    featuredBeers: [
      {
        id: 'ak-01',
        name: 'Alaskan Amber',
        brewery: 'Alaskan Brewing Company',
        style: 'American Amber Ale',
        abv: 5.3,
        ibu: 18,
        description: "Based on a Gold Rush-era recipe discovered in historical records, this flagship amber uses traditional Bohemian Saaz hops for a perfectly balanced malt-forward experience.",
        tastingNotes: 'Rich amber color with caramel sweetness, toasted malt flavors balanced by floral hop character, smooth finish with lingering warmth.',
        rating: 4,
        dayOfWeek: 1,
        imageUrl: '/images/Beer images/Alaska/Alaskan Amber.png'
      },
      {
        id: 'ak-02',
        name: 'Sockeye Red IPA',
        brewery: 'Midnight Sun Brewing',
        style: 'Red IPA',
        abv: 5.7,
        ibu: 50,
        description: "Bold Pacific Northwest-style IPA with distinctive red hue from specialty malts. Aggressively hopped with Centennial, Cascade, and Simcoe varieties.",
        tastingNotes: 'Deep copper color, citrus and pine hop aroma, caramel malt backbone balances intense hop bitterness, clean dry finish.',
        rating: 4.5,
        dayOfWeek: 2,
        imageUrl: '/images/Beer images/Alaska/Sockeye-Red.png'
      },
      {
        id: 'ak-03',
        name: 'Chocolate Coconut Porter',
        brewery: 'King Street Brewing',
        style: 'Flavored Porter',
        abv: 6.0,
        ibu: 35,
        description: "Robust porter infused with cacao nibs and hand-toasted coconut, creating a smooth, velvety texture with tropical undertones.",
        tastingNotes: 'Dark brown color, chocolate and coconut aroma, smooth mouthfeel with rich chocolate flavors, subtle coconut finish.',
        rating: 4,
        dayOfWeek: 3,
        imageUrl: '/images/Beer images/Alaska/Chocolate Coconut Porter.jpeg'
      },
      {
        id: 'ak-04',
        name: 'Belgian Triple',
        brewery: 'Cynosure Brewing',
        style: 'Belgian Tripel',
        abv: 9.7,
        ibu: 25,
        description: "Deceptively smooth despite its strength, featuring subtle spice and fruit tones with pale gold appearance and complex Belgian yeast character.",
        tastingNotes: 'Golden color with white head, spicy phenolic aroma, fruity esters balanced by warming alcohol, dry crisp finish.',
        rating: 4.5,
        dayOfWeek: 4,
        imageUrl: '/images/Beer images/Alaska/Belgian Triple.jpeg'
      },
      {
        id: 'ak-05',
        name: 'New England IPA',
        brewery: 'Resolution Brewing',
        style: 'New England IPA',
        abv: 6.2,
        ibu: 40,
        description: "Soft, luscious mouthfeel with Citra, El Dorado, and Mosaic hops creating notes of mango creamcicle and pineapple. Double dry-hopped perfection.",
        tastingNotes: 'Hazy golden appearance, tropical fruit aroma, creamy texture with mango and pineapple flavors, smooth low bitterness.',
        rating: 4.5,
        dayOfWeek: 5,
        imageUrl: '/images/Beer images/Alaska/A deal with the devil.jpg'
      },
      {
        id: 'ak-06',
        name: 'German Kölsch',
        brewery: 'HooDoo Brewing',
        style: 'Kölsch',
        abv: 4.8,
        ibu: 20,
        description: "Authentic German-style Kölsch brewed with traditional techniques in Alaska's interior. Light, crisp, and refreshing with subtle fruit notes.",
        tastingNotes: 'Pale golden color, clean grainy aroma, light body with subtle sweetness, crisp finish with delicate hop presence.',
        rating: 4,
        dayOfWeek: 6,
        imageUrl: '/images/Beer images/Alaska/HooDoo-German Kolsch.jpg'
      },
      {
        id: 'ak-07',
        name: 'Pipeline Stout',
        brewery: 'Broken Tooth Brewing',
        style: 'Imperial Stout',
        abv: 5.9,
        ibu: 42,
        description: "Rich, full-bodied stout with notes of coffee and dark chocolate. Brewed with Alaska's pristine glacier water for exceptional smoothness.",
        tastingNotes: 'Dark black color, coffee and chocolate aroma, medium body with roasted malt character, smooth finish with balanced bitterness.',
        rating: 4,
        dayOfWeek: 7,
        imageUrl: '/images/Beer images/Alaska/Pipeline Stout.jpeg'
      }
    ],
    blogPostSlug: 'alaska-craft-beer-journey',
    heroImage: '/images/State Images/Alaska.png',
    description: 'Last frontier brewing with glacier water and midnight sun innovation.',
    totalBreweries: 49,
    region: 'west',
    capital: 'Juneau',
    population: 733391,
    breweryDensity: 6.7
  },

  // Week 3: Arizona
  {
    code: 'AZ',
    name: 'Arizona',
    status: 'current',
    weekNumber: 3,
    featuredBeers: [
      {
        id: 'az-01',
        name: 'Kilt Lifter Scottish Ale',
        brewery: 'Four Peaks Brewing Company',
        style: 'Scottish Ale',
        abv: 6.0,
        ibu: 25,
        description: "Arizona's flagship beer since 1996, this smooth Scottish ale showcases caramel malts and subtle hop character that pairs perfectly with desert heat.",
        tastingNotes: 'Rich copper color, caramel and toffee aromas, smooth malt sweetness balanced by mild hop bitterness, clean dry finish.',
        rating: 4,
        dayOfWeek: 1,
        imageUrl: '/images/Beer images/Arizona/Kilt Lifter.png'
      },
      {
        id: 'az-02',
        name: 'Desert Botanical Wheat',
        brewery: 'SanTan Brewing Company',
        style: 'American Wheat Beer',
        abv: 4.8,
        ibu: 18,
        description: 'Chandler-based brewery\'s refreshing wheat beer perfect for Arizona\'s year-round outdoor culture and scorching summers.',
        tastingNotes: 'Hazy golden color, citrus and coriander notes, light body with wheat smoothness, crisp refreshing finish.',
        rating: 4,
        dayOfWeek: 2,
        imageUrl: '/images/Beer images/Arizona/Desert Botanical Wheat.png'
      },
      {
        id: 'az-03',
        name: 'Prickly Pear Wheat',
        brewery: 'Sonoran Brewing Company',
        style: 'Fruit Beer',
        abv: 4.5,
        ibu: 12,
        description: 'Uniquely Arizona beer featuring prickly pear cactus fruit, creating a distinctive pink hue and subtle desert terroir.',
        tastingNotes: 'Beautiful pink color, light fruit aroma, subtle prickly pear sweetness, smooth wheat base, refreshing desert character.',
        rating: 4.5,
        dayOfWeek: 3,
        imageUrl: '/images/Beer images/Arizona/Prickly Pear Wheat.png'
      },
      {
        id: 'az-04',
        name: 'Flagstaff IPA',
        brewery: 'Mother Percolator',
        style: 'American IPA',
        abv: 6.8,
        ibu: 65,
        description: 'High-altitude IPA from Flagstaff showcasing citrus and pine hop character with mountain water and cooler brewing conditions.',
        tastingNotes: 'Golden amber color, intense citrus and pine aroma, bold hop flavor with caramel malt backbone, lingering bitter finish.',
        rating: 4,
        dayOfWeek: 4,
        imageUrl: '/images/Beer images/Arizona/Flagstaff IPA.png'
      },
      {
        id: 'az-05',
        name: 'Desert Stout',
        brewery: 'Wren House Brewing',
        style: 'American Stout',
        abv: 5.8,
        ibu: 35,
        description: 'Phoenix neighborhood brewery\'s take on the classic stout, proving dark beers work in the desert when crafted with skill.',
        tastingNotes: 'Dark black color, coffee and chocolate aromas, medium body with roasted malt character, smooth finish despite the heat.',
        rating: 4,
        dayOfWeek: 5,
        imageUrl: '/images/Beer images/Arizona/Desert Stout.png'
      },
      {
        id: 'az-06',
        name: 'Sedona Red',
        brewery: 'Oak Creek Brewing Company',
        style: 'Red Ale',
        abv: 5.4,
        ibu: 28,
        description: 'Named after the iconic red rocks of Sedona, this amber ale captures the spirit of Arizona\'s most beautiful landscape.',
        tastingNotes: 'Deep red-amber color matching Sedona rocks, caramel and toasted malt flavors, balanced hop character, smooth malty finish.',
        rating: 4,
        dayOfWeek: 6,
        imageUrl: '/images/Beer images/Arizona/Sedona Red.png'
      },
      {
        id: 'az-07',
        name: 'Grand Canyon Porter',
        brewery: 'Grand Canyon Brewing Company',
        style: 'Porter',
        abv: 6.2,
        ibu: 30,
        description: 'Dark, rich porter inspired by the majesty of the Grand Canyon, brewed with chocolate and coffee notes for desert evening enjoyment.',
        tastingNotes: 'Deep brown color, coffee and dark chocolate aromas, full body with roasted malt complexity, warming finish perfect for desert nights.',
        rating: 4.5,
        dayOfWeek: 7,
        imageUrl: '/images/Beer images/Arizona/Grand Canyon Porter.png'
      }
    ],
    blogPostSlug: 'arizona-craft-beer-journey',
    heroImage: '/images/State Images/Arizona.png',
    description: 'Desert brewing oasis with year-round outdoor drinking culture and unique ingredients.',
    totalBreweries: 108,
    region: 'southwest',
    capital: 'Phoenix',
    population: 7151502,
    breweryDensity: 1.5
  },

  // Week 4: Arkansas
  {
    code: 'AR',
    name: 'Arkansas',
    status: 'upcoming',
    weekNumber: 4,
    featuredBeers: [], // TODO: Research 7 authentic Arkansas craft beers
    description: 'Natural State brewing with mountain water and delta hospitality.',
    totalBreweries: 38,
    region: 'southeast',
    capital: 'Little Rock',
    population: 3011524,
    breweryDensity: 1.3
  },

  // Week 5: California
  {
    code: 'CA',
    name: 'California',
    status: 'upcoming',
    weekNumber: 5,
    featuredBeers: [], // TODO: Research 7 authentic California craft beers
    description: 'Craft beer capital with hop-forward IPAs and experimental brewing.',
    totalBreweries: 958,
    region: 'west',
    capital: 'Sacramento',
    population: 39538223,
    breweryDensity: 2.4
  },

  // Week 6: Colorado
  {
    code: 'CO',
    name: 'Colorado',
    status: 'upcoming',
    weekNumber: 6,
    featuredBeers: [], // TODO: Research 7 authentic Colorado craft beers
    description: 'High-altitude brewing with mountain water and outdoor culture.',
    totalBreweries: 425,
    region: 'west',
    capital: 'Denver',
    population: 5773714,
    breweryDensity: 7.4
  },

  // Week 7: Connecticut
  {
    code: 'CT',
    name: 'Connecticut',
    status: 'upcoming',
    weekNumber: 7,
    featuredBeers: [], // TODO: Research 7 authentic Connecticut craft beers
    description: 'Constitution State brewing with New England tradition and innovation.',
    totalBreweries: 108,
    region: 'northeast',
    capital: 'Hartford',
    population: 3605944,
    breweryDensity: 3.0
  },

  // Week 8: Delaware
  {
    code: 'DE',
    name: 'Delaware',
    status: 'upcoming',
    weekNumber: 8,
    featuredBeers: [], // TODO: Research 7 authentic Delaware craft beers
    description: 'First State brewing with coastal influence and experimental spirit.',
    totalBreweries: 28,
    region: 'northeast',
    capital: 'Dover',
    population: 989948,
    breweryDensity: 2.8
  },

  // Week 9: Florida
  {
    code: 'FL',
    name: 'Florida',
    status: 'upcoming',
    weekNumber: 9,
    featuredBeers: [], // TODO: Research 7 authentic Florida craft beers
    description: 'Sunshine State brewing with tropical flavors and year-round patio weather.',
    totalBreweries: 327,
    region: 'southeast',
    capital: 'Tallahassee',
    population: 21538187,
    breweryDensity: 1.5
  },

  // Week 10: Georgia
  {
    code: 'GA',
    name: 'Georgia',
    status: 'upcoming',
    weekNumber: 10,
    featuredBeers: [], // TODO: Research 7 authentic Georgia craft beers
    description: 'Peach State brewing renaissance with Atlanta leading the charge.',
    totalBreweries: 139,
    region: 'southeast',
    capital: 'Atlanta',
    population: 10711908,
    breweryDensity: 1.3
  },

  // Week 11: Hawaii
  {
    code: 'HI',
    name: 'Hawaii',
    status: 'upcoming',
    weekNumber: 11,
    featuredBeers: [], // TODO: Research 7 authentic Hawaii craft beers
    description: 'Aloha State brewing with tropical ingredients and island innovation.',
    totalBreweries: 24,
    region: 'west',
    capital: 'Honolulu',
    population: 1455271,
    breweryDensity: 1.6
  },

  // Week 12: Idaho
  {
    code: 'ID',
    name: 'Idaho',
    status: 'upcoming',
    weekNumber: 12,
    featuredBeers: [], // TODO: Research 7 authentic Idaho craft beers
    description: 'Gem State brewing with mountain water and outdoor adventure spirit.',
    totalBreweries: 75,
    region: 'west',
    capital: 'Boise',
    population: 1839106,
    breweryDensity: 4.1
  },

  // Week 13: Illinois
  {
    code: 'IL',
    name: 'Illinois',
    status: 'upcoming',
    weekNumber: 13,
    featuredBeers: [], // TODO: Research 7 authentic Illinois craft beers
    description: 'Prairie State brewing with Chicago leading the craft beer revolution.',
    totalBreweries: 296,
    region: 'midwest',
    capital: 'Springfield',
    population: 12812508,
    breweryDensity: 2.3
  },

  // Week 14: Indiana
  {
    code: 'IN',
    name: 'Indiana',
    status: 'upcoming',
    weekNumber: 14,
    featuredBeers: [], // TODO: Research 7 authentic Indiana craft beers
    description: 'Hoosier State brewing with Midwest hospitality and innovation.',
    totalBreweries: 178,
    region: 'midwest',
    capital: 'Indianapolis',
    population: 6785528,
    breweryDensity: 2.6
  },

  // Week 15: Iowa
  {
    code: 'IA',
    name: 'Iowa',
    status: 'upcoming',
    weekNumber: 15,
    featuredBeers: [], // TODO: Research 7 authentic Iowa craft beers
    description: 'Hawkeye State brewing with agricultural heritage and craft innovation.',
    totalBreweries: 109,
    region: 'midwest',
    capital: 'Des Moines',
    population: 3190369,
    breweryDensity: 3.4
  },

  // Week 16: Kansas
  {
    code: 'KS',
    name: 'Kansas',
    status: 'upcoming',
    weekNumber: 16,
    featuredBeers: [], // TODO: Research 7 authentic Kansas craft beers
    description: 'Sunflower State brewing with prairie spirit and agricultural roots.',
    totalBreweries: 54,
    region: 'midwest',
    capital: 'Topeka',
    population: 2937880,
    breweryDensity: 1.8
  },

  // Week 17: Kentucky
  {
    code: 'KY',
    name: 'Kentucky',
    status: 'upcoming',
    weekNumber: 17,
    featuredBeers: [], // TODO: Research 7 authentic Kentucky craft beers
    description: 'Bluegrass State brewing heritage meeting bourbon barrel innovation.',
    totalBreweries: 74,
    region: 'southeast',
    capital: 'Frankfort',
    population: 4505836,
    breweryDensity: 1.6
  },

  // Week 18: Louisiana
  {
    code: 'LA',
    name: 'Louisiana',
    status: 'upcoming',
    weekNumber: 18,
    featuredBeers: [], // TODO: Research 7 authentic Louisiana craft beers
    description: 'Pelican State brewing with Creole flavors and jazz culture.',
    totalBreweries: 42,
    region: 'southeast',
    capital: 'Baton Rouge',
    population: 4657757,
    breweryDensity: 0.9
  },

  // Week 19: Maine
  {
    code: 'ME',
    name: 'Maine',
    status: 'upcoming',
    weekNumber: 19,
    featuredBeers: [], // TODO: Research 7 authentic Maine craft beers
    description: 'Coastal brewing traditions meet modern innovation in the Pine Tree State.',
    totalBreweries: 155,
    region: 'northeast',
    capital: 'Augusta',
    population: 1362359,
    breweryDensity: 11.4
  },

  // Week 20: Maryland
  {
    code: 'MD',
    name: 'Maryland',
    status: 'upcoming',
    weekNumber: 20,
    featuredBeers: [], // TODO: Research 7 authentic Maryland craft beers
    description: 'Old Line State brewing with Chesapeake Bay influence and urban innovation.',
    totalBreweries: 104,
    region: 'northeast',
    capital: 'Annapolis',
    population: 6177224,
    breweryDensity: 1.7
  },

  // Week 21: Massachusetts
  {
    code: 'MA',
    name: 'Massachusetts',
    status: 'upcoming',
    weekNumber: 21,
    featuredBeers: [], // TODO: Research 7 authentic Massachusetts craft beers
    description: 'Bay State brewing birthplace of American craft beer revolution.',
    totalBreweries: 204,
    region: 'northeast',
    capital: 'Boston',
    population: 7001399,
    breweryDensity: 2.9
  },

  // Week 22: Michigan
  {
    code: 'MI',
    name: 'Michigan',
    status: 'upcoming',
    weekNumber: 22,
    featuredBeers: [], // TODO: Research 7 authentic Michigan craft beers
    description: 'Great Lakes State brewing with water abundance and Midwest innovation.',
    totalBreweries: 385,
    region: 'midwest',
    capital: 'Lansing',
    population: 10037261,
    breweryDensity: 3.8
  },

  // Week 23: Minnesota
  {
    code: 'MN',
    name: 'Minnesota',
    status: 'upcoming',
    weekNumber: 23,
    featuredBeers: [], // TODO: Research 7 authentic Minnesota craft beers
    description: 'Land of 10,000 Lakes brewing with Scandinavian heritage and innovation.',
    totalBreweries: 196,
    region: 'midwest',
    capital: 'Saint Paul',
    population: 5737915,
    breweryDensity: 3.4
  },

  // Week 24: Mississippi
  {
    code: 'MS',
    name: 'Mississippi',
    status: 'upcoming',
    weekNumber: 24,
    featuredBeers: [], // TODO: Research 7 authentic Mississippi craft beers
    description: 'Magnolia State brewing with Delta heritage and southern hospitality.',
    totalBreweries: 18,
    region: 'southeast',
    capital: 'Jackson',
    population: 2961279,
    breweryDensity: 0.6
  },

  // Week 25: Missouri
  {
    code: 'MO',
    name: 'Missouri',
    status: 'upcoming',
    weekNumber: 25,
    featuredBeers: [], // TODO: Research 7 authentic Missouri craft beers
    description: 'Show-Me State brewing with gateway city innovation and heartland values.',
    totalBreweries: 142,
    region: 'midwest',
    capital: 'Jefferson City',
    population: 6196010,
    breweryDensity: 2.3
  },

  // Week 26: Montana
  {
    code: 'MT',
    name: 'Montana',
    status: 'upcoming',
    weekNumber: 26,
    featuredBeers: [], // TODO: Research 7 authentic Montana craft beers
    description: 'Big Sky Country brewing with mountain water and frontier spirit.',
    totalBreweries: 76,
    region: 'west',
    capital: 'Helena',
    population: 1084225,
    breweryDensity: 7.0
  },

  // Week 27: Nebraska
  {
    code: 'NE',
    name: 'Nebraska',
    status: 'upcoming',
    weekNumber: 27,
    featuredBeers: [], // TODO: Research 7 authentic Nebraska craft beers
    description: 'Cornhusker State brewing with agricultural heritage and plains innovation.',
    totalBreweries: 44,
    region: 'midwest',
    capital: 'Lincoln',
    population: 1961504,
    breweryDensity: 2.2
  },

  // Week 28: Nevada
  {
    code: 'NV',
    name: 'Nevada',
    status: 'upcoming',
    weekNumber: 28,
    featuredBeers: [], // TODO: Research 7 authentic Nevada craft beers
    description: 'Silver State brewing with desert innovation and 24/7 hospitality.',
    totalBreweries: 56,
    region: 'west',
    capital: 'Carson City',
    population: 3104614,
    breweryDensity: 1.8
  },

  // Week 29: New Hampshire
  {
    code: 'NH',
    name: 'New Hampshire',
    status: 'upcoming',
    weekNumber: 29,
    featuredBeers: [], // TODO: Research 7 authentic New Hampshire craft beers
    description: 'Live Free or Die brewing with granite state independence and innovation.',
    totalBreweries: 95,
    region: 'northeast',
    capital: 'Concord',
    population: 1377529,
    breweryDensity: 6.9
  },

  // Week 30: New Jersey
  {
    code: 'NJ',
    name: 'New Jersey',
    status: 'upcoming',
    weekNumber: 30,
    featuredBeers: [], // TODO: Research 7 authentic New Jersey craft beers
    description: 'Garden State brewing with shore influence and urban innovation.',
    totalBreweries: 147,
    region: 'northeast',
    capital: 'Trenton',
    population: 9288994,
    breweryDensity: 1.6
  },

  // Week 31: New Mexico
  {
    code: 'NM',
    name: 'New Mexico',
    status: 'upcoming',
    weekNumber: 31,
    featuredBeers: [], // TODO: Research 7 authentic New Mexico craft beers
    description: 'Land of Enchantment brewing with high desert innovation and cultural fusion.',
    totalBreweries: 67,
    region: 'southwest',
    capital: 'Santa Fe',
    population: 2117522,
    breweryDensity: 3.2
  },

  // Week 32: New York
  {
    code: 'NY',
    name: 'New York',
    status: 'upcoming',
    weekNumber: 32,
    featuredBeers: [], // TODO: Research 7 authentic New York craft beers
    description: 'From NYC\'s urban brewing scene to the Finger Lakes wine and beer region.',
    totalBreweries: 469,
    region: 'northeast',
    capital: 'Albany',
    population: 20201249,
    breweryDensity: 2.3
  },

  // Week 33: North Carolina
  {
    code: 'NC',
    name: 'North Carolina',
    status: 'upcoming',
    weekNumber: 33,
    featuredBeers: [], // TODO: Research 7 authentic North Carolina craft beers
    description: 'Southern hospitality meets craft beer excellence in the Research Triangle.',
    totalBreweries: 343,
    region: 'southeast',
    capital: 'Raleigh',
    population: 10439388,
    breweryDensity: 3.3
  },

  // Week 34: North Dakota
  {
    code: 'ND',
    name: 'North Dakota',
    status: 'upcoming',
    weekNumber: 34,
    featuredBeers: [], // TODO: Research 7 authentic North Dakota craft beers
    description: 'Peace Garden State brewing with prairie resilience and oil boom prosperity.',
    totalBreweries: 23,
    region: 'midwest',
    capital: 'Bismarck',
    population: 779094,
    breweryDensity: 3.0
  },

  // Week 35: Ohio
  {
    code: 'OH',
    name: 'Ohio',
    status: 'upcoming',
    weekNumber: 35,
    featuredBeers: [], // TODO: Research 7 authentic Ohio craft beers
    description: 'Buckeye State brewing with Great Lakes heritage and heartland innovation.',
    totalBreweries: 315,
    region: 'midwest',
    capital: 'Columbus',
    population: 11799448,
    breweryDensity: 2.7
  },

  // Week 36: Oklahoma
  {
    code: 'OK',
    name: 'Oklahoma',
    status: 'upcoming',
    weekNumber: 36,
    featuredBeers: [], // TODO: Research 7 authentic Oklahoma craft beers
    description: 'Sooner State brewing with frontier spirit and native innovation.',
    totalBreweries: 62,
    region: 'southwest',
    capital: 'Oklahoma City',
    population: 3959353,
    breweryDensity: 1.6
  },

  // Week 37: Oregon
  {
    code: 'OR',
    name: 'Oregon',
    status: 'upcoming',
    weekNumber: 37,
    featuredBeers: [], // TODO: Research 7 authentic Oregon craft beers
    description: 'The Pacific Northwest awaits with its renowned hop culture and innovative brewing techniques.',
    totalBreweries: 295,
    region: 'west',
    capital: 'Salem',
    population: 4237256,
    breweryDensity: 7.0
  },

  // Week 38: Pennsylvania
  {
    code: 'PA',
    name: 'Pennsylvania',
    status: 'upcoming',
    weekNumber: 38,
    featuredBeers: [], // TODO: Research 7 authentic Pennsylvania craft beers
    description: 'Keystone State brewing birthplace with historic heritage and modern innovation.',
    totalBreweries: 436,
    region: 'northeast',
    capital: 'Harrisburg',
    population: 13002700,
    breweryDensity: 3.4
  },

  // Week 39: Rhode Island
  {
    code: 'RI',
    name: 'Rhode Island',
    status: 'upcoming',
    weekNumber: 39,
    featuredBeers: [], // TODO: Research 7 authentic Rhode Island craft beers
    description: 'Ocean State brewing with coastal charm and small state big flavor.',
    totalBreweries: 26,
    region: 'northeast',
    capital: 'Providence',
    population: 1097379,
    breweryDensity: 2.4
  },

  // Week 40: South Carolina
  {
    code: 'SC',
    name: 'South Carolina',
    status: 'upcoming',
    weekNumber: 40,
    featuredBeers: [], // TODO: Research 7 authentic South Carolina craft beers
    description: 'Palmetto State brewing with lowcountry hospitality and coastal influence.',
    totalBreweries: 68,
    region: 'southeast',
    capital: 'Columbia',
    population: 5118425,
    breweryDensity: 1.3
  },

  // Week 41: South Dakota
  {
    code: 'SD',
    name: 'South Dakota',
    status: 'upcoming',
    weekNumber: 41,
    featuredBeers: [], // TODO: Research 7 authentic South Dakota craft beers
    description: 'Mount Rushmore State brewing with frontier spirit and Black Hills water.',
    totalBreweries: 30,
    region: 'midwest',
    capital: 'Pierre',
    population: 886667,
    breweryDensity: 3.4
  },

  // Week 42: Tennessee
  {
    code: 'TN',
    name: 'Tennessee',
    status: 'upcoming',
    weekNumber: 42,
    featuredBeers: [], // TODO: Research 7 authentic Tennessee craft beers
    description: 'Volunteer State brewing with country music spirit and bourbon barrel aging.',
    totalBreweries: 115,
    region: 'southeast',
    capital: 'Nashville',
    population: 6910840,
    breweryDensity: 1.7
  },

  // Week 43: Texas
  {
    code: 'TX',
    name: 'Texas',
    status: 'upcoming',
    weekNumber: 43,
    featuredBeers: [], // TODO: Research 7 authentic Texas craft beers
    description: 'Lone Star State brewing with BBQ pairings and big flavors.',
    totalBreweries: 370,
    region: 'southwest',
    capital: 'Austin',
    population: 29145505,
    breweryDensity: 1.3
  },

  // Week 44: Utah
  {
    code: 'UT',
    name: 'Utah',
    status: 'upcoming',
    weekNumber: 44,
    featuredBeers: [], // TODO: Research 7 authentic Utah craft beers
    description: 'Beehive State brewing with mountain innovation and unique alcohol laws.',
    totalBreweries: 42,
    region: 'west',
    capital: 'Salt Lake City',
    population: 3271616,
    breweryDensity: 1.3
  },

  // Week 45: Vermont
  {
    code: 'VT',
    name: 'Vermont',
    status: 'upcoming',
    weekNumber: 45,
    featuredBeers: [], // TODO: Research 7 authentic Vermont craft beers
    description: 'New England\'s craft beer revolution and the birthplace of hazy IPAs.',
    totalBreweries: 74,
    region: 'northeast',
    capital: 'Montpelier',
    population: 643077,
    breweryDensity: 11.5
  },

  // Week 46: Virginia
  {
    code: 'VA',
    name: 'Virginia',
    status: 'upcoming',
    weekNumber: 46,
    featuredBeers: [], // TODO: Research 7 authentic Virginia craft beers
    description: 'Old Dominion brewing with colonial heritage and modern innovation.',
    totalBreweries: 262,
    region: 'southeast',
    capital: 'Richmond',
    population: 8631393,
    breweryDensity: 3.0
  },

  // Week 47: Washington
  {
    code: 'WA',
    name: 'Washington',
    status: 'upcoming',
    weekNumber: 47,
    featuredBeers: [], // TODO: Research 7 authentic Washington craft beers
    description: 'Seattle\'s coffee culture meets world-class brewing innovation.',
    totalBreweries: 458,
    region: 'west',
    capital: 'Olympia',
    population: 7693612,
    breweryDensity: 6.0
  },

  // Week 48: West Virginia
  {
    code: 'WV',
    name: 'West Virginia',
    status: 'upcoming',
    weekNumber: 48,
    featuredBeers: [], // TODO: Research 7 authentic West Virginia craft beers
    description: 'Mountain State brewing with Appalachian heritage and mountain water.',
    totalBreweries: 22,
    region: 'southeast',
    capital: 'Charleston',
    population: 1793716,
    breweryDensity: 1.2
  },

  // Week 49: Wisconsin
  {
    code: 'WI',
    name: 'Wisconsin',
    status: 'upcoming',
    weekNumber: 49,
    featuredBeers: [], // TODO: Research 7 authentic Wisconsin craft beers
    description: 'Badger State brewing with German heritage and cheese pairing perfection.',
    totalBreweries: 208,
    region: 'midwest',
    capital: 'Madison',
    population: 5893718,
    breweryDensity: 3.5
  },

  // Week 50: Wyoming
  {
    code: 'WY',
    name: 'Wyoming',
    status: 'upcoming',
    weekNumber: 50,
    featuredBeers: [], // TODO: Research 7 authentic Wyoming craft beers
    description: 'Equality State brewing finale with cowboy spirit and mountain majesty.',
    totalBreweries: 28,
    region: 'west',
    capital: 'Cheyenne',
    population: 578759,
    breweryDensity: 4.8
  }
]

export const getStateByCode = (code: string): StateData | undefined => {
  return stateProgressData.find(state => state.code === code)
}

export const getCompletedStates = (): StateData[] => {
  return stateProgressData.filter(state => state.status === 'completed')
}

export const getCurrentState = (): StateData | undefined => {
  return stateProgressData.find(state => state.status === 'current')
}

export const getUpcomingStates = (): StateData[] => {
  return stateProgressData.filter(state => state.status === 'upcoming')
}

export const getAllStatesData = (): StateData[] => {
  return stateProgressData
}

export const getJourneyProgress = (): { completed: number; total: number; percentage: number } => {
  const completed = getCompletedStates().length
  const total = 50 // All US states
  const percentage = Math.round((completed / total) * 100)
  
  return { completed, total, percentage }
}

// Enhanced management functions

export const updateStateStatus = (stateCode: string, newStatus: 'upcoming' | 'current' | 'completed', completionDate?: Date): StateData | null => {
  const stateIndex = stateProgressData.findIndex(state => state.code === stateCode)
  if (stateIndex === -1) return null

  const updatedState = { 
    ...stateProgressData[stateIndex], 
    status: newStatus,
    ...(completionDate && { completionDate })
  }
  
  stateProgressData[stateIndex] = updatedState
  return updatedState
}

export const getStatesByRegion = (region: 'northeast' | 'southeast' | 'midwest' | 'southwest' | 'west'): StateData[] => {
  return stateProgressData.filter(state => state.region === region)
}

export const getStatesByStatus = (status: 'upcoming' | 'current' | 'completed'): StateData[] => {
  return stateProgressData.filter(state => state.status === status)
}

export const getStatesWithBlogPosts = (): StateData[] => {
  return stateProgressData.filter(state => state.blogPostSlug)
}

export const generateBlogPostSlug = (stateName: string): string => {
  return stateName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    + '-craft-beer-journey'
}

export const getTopBreweryDensityStates = (limit: number = 10): StateData[] => {
  return stateProgressData
    .filter(state => state.breweryDensity)
    .sort((a, b) => (b.breweryDensity || 0) - (a.breweryDensity || 0))
    .slice(0, limit)
}

export const getTotalBreweriesCount = (): number => {
  return stateProgressData.reduce((total, state) => total + (state.totalBreweries || 0), 0)
}

export const getWeeklySchedule = (): StateData[] => {
  return stateProgressData.sort((a, b) => a.weekNumber - b.weekNumber)
}

export const getStatesByWeekRange = (startWeek: number, endWeek: number): StateData[] => {
  return stateProgressData.filter(state => 
    state.weekNumber >= startWeek && state.weekNumber <= endWeek
  ).sort((a, b) => a.weekNumber - b.weekNumber)
}

export const getRegionalStatistics = () => {
  const regionStats = {
    northeast: { count: 0, totalBreweries: 0, avgDensity: 0 },
    southeast: { count: 0, totalBreweries: 0, avgDensity: 0 },
    midwest: { count: 0, totalBreweries: 0, avgDensity: 0 },
    southwest: { count: 0, totalBreweries: 0, avgDensity: 0 },
    west: { count: 0, totalBreweries: 0, avgDensity: 0 }
  }

  stateProgressData.forEach(state => {
    const region = state.region
    regionStats[region].count++
    regionStats[region].totalBreweries += state.totalBreweries || 0
    regionStats[region].avgDensity += state.breweryDensity || 0
  })

  // Calculate averages
  Object.keys(regionStats).forEach(region => {
    const stats = regionStats[region as keyof typeof regionStats]
    stats.avgDensity = stats.count > 0 ? Math.round((stats.avgDensity / stats.count) * 10) / 10 : 0
  })

  return regionStats
}

export const getJourneyStatistics = () => {
  const completed = getCompletedStates()
  const current = getCurrentState()
  const upcoming = getUpcomingStates()
  
  return {
    completed: {
      count: completed.length,
      totalBreweries: completed.reduce((sum, state) => sum + (state.totalBreweries || 0), 0),
      avgDensity: completed.length > 0 
        ? Math.round((completed.reduce((sum, state) => sum + (state.breweryDensity || 0), 0) / completed.length) * 10) / 10 
        : 0
    },
    current: current ? {
      state: current,
      weekNumber: current.weekNumber,
      totalBreweries: current.totalBreweries || 0
    } : null,
    upcoming: {
      count: upcoming.length,
      nextFive: upcoming.slice(0, 5),
      totalBreweries: upcoming.reduce((sum, state) => sum + (state.totalBreweries || 0), 0)
    },
    overall: {
      totalStates: stateProgressData.length,
      totalBreweries: getTotalBreweriesCount(),
      completionPercentage: Math.round((completed.length / 50) * 100)
    }
  }
}