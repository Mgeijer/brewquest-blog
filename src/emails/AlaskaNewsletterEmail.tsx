import {
  Html, Head, Preview, Body, Container, Section, Heading, Text, Button, Img, Hr
} from '@react-email/components'

interface BeerReview {
  beer_name: string
  brewery_name: string
  rating: number
  beer_style: string
  abv: number
  day_of_week: number
  image_url?: string
  review_content?: string
}

interface AlaskaNewsletterEmailProps {
  subscriberName?: string
  weekNumber: number
  beerReviews: BeerReview[]
  unsubscribeToken?: string
  previewMode?: boolean
}

export default function AlaskaNewsletterEmail({
  subscriberName = 'Beer Enthusiast',
  weekNumber = 2,
  beerReviews = [],
  unsubscribeToken,
  previewMode = false
}: AlaskaNewsletterEmailProps) {
  
  const alaskaBeerData = [
    {
      day: 'Monday',
      brewery: 'Alaskan Brewing Company - Juneau',
      beer: 'Alaskan Amber',
      style: 'Amber Ale',
      abv: '5.3%',
      image: 'https://www.hopharrison.com/images/Beer%20images/Alaska/Alaskan%20Amber.png',
      description: 'Deep amber with copper highlights, crystal clear with creamy off-white head. Rich caramel malt sweetness with floral Saaz hop character and subtle bread notes.',
      story: 'Our Alaska journey begins with the state\'s pioneering brewery, founded in 1986. This flagship beer\'s authenticity comes from a recipe discovered in the Juneau-Douglas City Museum from the Gold Rush era (1899-1907).'
    },
    {
      day: 'Tuesday',
      brewery: 'Midnight Sun Brewing - Anchorage',
      beer: 'Sockeye Red IPA',
      style: 'Red IPA',
      abv: '5.7%',
      image: 'https://www.hopharrison.com/images/Beer%20images/Alaska/Sockeye-Red.png',
      description: 'Deep amber-red with copper highlights, hazy with persistent off-white head. Explosive citrus and pine with grapefruit, orange peel, and resinous hop character.',
      story: 'Founded in 1995, Midnight Sun represents Alaska\'s bold brewing attitude with aggressive hop-forward beers and experimental barrel-aging programs.'
    },
    {
      day: 'Wednesday',
      brewery: 'King Street Brewing - Anchorage',
      beer: 'Chocolate Coconut Porter',
      style: 'Porter',
      abv: '6.0%',
      image: 'https://www.hopharrison.com/images/Beer%20images/Alaska/Chocolate%20Coconut%20Porter.jpeg',
      description: 'Deep black with ruby highlights, tan head with excellent retention. Rich chocolate, toasted coconut, vanilla, coffee with smooth chocolate and coconut sweetness.',
      story: 'King Street specializes in creative flavor combinations that bring warmth to Alaska\'s long winters, using hand-toasted coconut and premium cacao nibs.'
    },
    {
      day: 'Thursday',
      brewery: 'Cynosure Brewing - Anchorage',
      beer: 'Belgian Triple',
      style: 'Belgian Tripel',
      abv: '9.7%',
      image: 'https://www.hopharrison.com/images/Beer%20images/Alaska/Belgian%20Triple.jpeg',
      description: 'Pale gold with crystal clarity, white foam head with good retention. Spicy phenolics, fruity esters, honey, coriander with smooth honey sweetness and warming alcohol.',
      story: 'Cynosure specializes in traditional European beer styles, bringing Old World brewing techniques to Alaska\'s frontier environment.'
    },
    {
      day: 'Friday',
      brewery: 'Resolution Brewing - Anchorage',
      beer: 'New England IPA',
      style: 'NEIPA',
      abv: '6.2%',
      image: 'https://www.hopharrison.com/images/Beer%20images/Alaska/A%20deal%20with%20the%20devil.jpg',
      description: 'Hazy orange-gold with minimal head retention. Tropical fruit explosion with mango, pineapple, citrus. Creamy mouthfeel, low bitterness, tropical juice character.',
      story: 'Named after Captain James Cook\'s ship HMS Resolution, this brewery represents modern craft brewing\'s exploration spirit in Alaska.'
    },
    {
      day: 'Saturday',
      brewery: 'HooDoo Brewing - Fairbanks',
      beer: 'German Kölsch',
      style: 'Kölsch',
      abv: '4.8%',
      image: 'https://www.hopharrison.com/images/Beer%20images/Alaska/HooDoo-German%20Kolsch.jpg',
      description: 'Pale straw gold, crystal clear with white foam head and excellent clarity. Clean malt sweetness with subtle fruit notes, delicate floral hop character.',
      story: 'Founded in 2012 in Fairbanks, HooDoo brings authentic German brewing techniques to Alaska\'s interior, where winter temperatures reach -40°F.'
    },
    {
      day: 'Sunday',
      brewery: 'Broken Tooth Brewing - Anchorage',
      beer: 'Pipeline Stout',
      style: 'Stout',
      abv: '5.9%',
      image: 'https://www.hopharrison.com/images/Beer%20images/Alaska/Pipeline%20Stout.jpeg',
      description: 'Deep black with ruby highlights, tan head with excellent retention. Roasted malt, dark chocolate, coffee notes with oatmeal smoothness and creamy texture.',
      story: 'Operating within Moose\'s Tooth Pub & Pizzeria, this brewery represents Alaska\'s community-focused approach where breweries serve as neighborhood gathering places.'
    }
  ]

  return (
    <Html>
      <Head />
      <Preview>Week {weekNumber}: Alaska's Last Frontier Brewing Excellence - BrewQuest Chronicles</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Header with Alaska Hero Image */}
          <Section style={header}>
            <Img
              src="https://www.hopharrison.com/images/State%20Images/Alaska.png"
              alt="Alaska's Last Frontier Brewing Scene"
              style={heroImage}
            />
            <div style={headerOverlay}>
              <Text style={logoText}>
                🍺 BrewQuest Chronicles 🍺
              </Text>
              <Heading style={heroHeading}>
                Week {weekNumber}: Alaska's Last Frontier Brewing
              </Heading>
              <Text style={heroSubtext}>
                From Gold Rush recipes to frontier innovation
              </Text>
            </div>
          </Section>
          
          <Section style={content}>
            {/* Welcome Message */}
            <Section style={welcomeBox}>
              <Text style={welcomeText}>
                Hey {subscriberName}! 👋
              </Text>
              <Text style={text}>
                Welcome to Week {weekNumber} of our 50-state craft beer journey! This week we're exploring 
                Alaska's remarkable Last Frontier brewing scene. From Juneau's Gold Rush-era recipes to 
                Anchorage's innovative breweries using pristine glacial water and indigenous ingredients 
                like spruce tips and alder-smoked malts.
              </Text>
            </Section>

            {/* Alaska Overview Stats */}
            <Section style={statsContainer}>
              <Text style={statsTitle}>🗺️ Alaska Brewing by the Numbers</Text>
              <div style={statsGrid}>
                <div style={statItem}>
                  <Text style={statNumber}>49</Text>
                  <Text style={statLabel}>Active Breweries</Text>
                </div>
                <div style={statItem}>
                  <Text style={statNumber}>#4</Text>
                  <Text style={statLabel}>Per Capita Ranking</Text>
                </div>
                <div style={statItem}>
                  <Text style={statNumber}>$332M</Text>
                  <Text style={statLabel}>Economic Impact</Text>
                </div>
              </div>
            </Section>

            {/* Journey Overview */}
            <Section style={journeyBox}>
              <Text style={journeyTitle}>🍺 This Week's Alaska Adventure</Text>
              <Text style={journeyText}>
                Alaska's craft beer scene represents one of America's most challenging and rewarding brewing 
                environments. Where winter temperatures can reach -40°F and summer brings midnight sun, 
                brewers have created a unique culture that combines historical authenticity, extreme innovation, 
                and community resilience. Our seven-day journey reveals breweries that don't just survive 
                Alaska's conditions - they thrive in them.
              </Text>
            </Section>
            
            {/* Daily Beer Reviews */}
            <Heading style={sectionHeading}>📅 Seven Days of Last Frontier Brewing</Heading>
            
            {alaskaBeerData.map((beer, index) => (
              <Section key={index} style={beerCard}>
                <div style={beerCardHeader}>
                  <Text style={beerDay}>{beer.day}</Text>
                  <Text style={beerRating}>⭐⭐⭐⭐⭐</Text>
                </div>
                
                <div style={beerCardContent}>
                  <div style={beerImageContainer}>
                    <Img
                      src={beer.image}
                      alt={`${beer.beer} from ${beer.brewery}`}
                      style={beerImage}
                    />
                  </div>
                  
                  <div style={beerDetails}>
                    <Heading style={beerName}>{beer.beer}</Heading>
                    <Text style={breweryName}>{beer.brewery}</Text>
                    <Text style={beerStyle}>
                      {beer.style} • {beer.abv} ABV
                    </Text>
                    
                    <Text style={tastingNotes}>
                      <strong>Tasting Notes:</strong> {beer.description}
                    </Text>
                    
                    <Text style={breweryStory}>
                      {beer.story}
                    </Text>
                  </div>
                </div>
              </Section>
            ))}

            {/* Alaska Special Features */}
            <Section style={specialFeaturesBox}>
              <Text style={featuresTitle}>🌟 What Makes Alaska Beer Special</Text>
              <div style={featuresList}>
                <Text style={featureItem}>
                  ❄️ <strong>Pristine Glacial Water:</strong> Sourced from the Juneau Icefield for exceptionally pure brewing
                </Text>
                <Text style={featureItem}>
                  🌲 <strong>Indigenous Ingredients:</strong> Sitka spruce tips and alder-smoked malts create unique Alaska flavors
                </Text>
                <Text style={featureItem}>
                  🏔️ <strong>Frontier Innovation:</strong> Extreme weather drives sustainability practices and brewing innovation
                </Text>
                <Text style={featureItem}>
                  📜 <strong>Gold Rush Heritage:</strong> Modern recipes based on historical brewing records from the 1800s
                </Text>
              </div>
            </Section>

            {/* Call to Action */}
            <Section style={ctaSection}>
              <Button style={primaryButton} href="https://www.hopharrison.com/states/alaska">
                Read Full Alaska Reviews 🍺
              </Button>
              
              <Button style={secondaryButton} href="https://www.hopharrison.com/blog">
                View Complete Journey 🗺️
              </Button>
            </Section>

            {/* Next Week Preview */}
            <Section style={nextWeekBox}>
              <Text style={nextWeekTitle}>🌵 Coming Next Week</Text>
              <Text style={nextWeekText}>
                <strong>Week 3: Arizona's Desert Brewing Oasis</strong><br/>
                From Sedona's red rock breweries to Phoenix's innovative desert-inspired ales, 
                discover how Arizona's craft beer scene thrives in the Sonoran Desert.
              </Text>
            </Section>

            {/* Progress Tracker */}
            <Section style={progressBox}>
              <Text style={progressTitle}>🇺🇸 BrewQuest Progress</Text>
              <Text style={progressText}>
                States Completed: {weekNumber}/50 • {((weekNumber/50) * 100).toFixed(1)}% Complete
              </Text>
              <div style={progressBar}>
                <div style={{...progressFill, width: `${(weekNumber/50) * 100}%`}}></div>
              </div>
            </Section>

            <Hr style={divider} />

            {/* Footer Message */}
            <Text style={footerMessage}>
              Thanks for joining me on this incredible beer journey across America! Alaska's pioneering 
              spirit lives on in every glass, proving that great beer can be made anywhere with enough 
              passion and determination.
              <br/><br/>
              🍻 Hop Harrison - BrewQuest Chronicles
            </Text>
          </Section>
          
          {/* Email Footer */}
          <Section style={footer}>
            <Text style={footerSmall}>
              You're receiving this weekly digest as a BrewQuest Chronicles subscriber.
              <br/>
              {unsubscribeToken ? (
                <>
                  <a href={`https://www.hopharrison.com/unsubscribe?token=${unsubscribeToken}`} style={link}>Unsubscribe</a> | 
                  <a href="https://www.hopharrison.com/newsletter" style={link}>Update Preferences</a>
                </>
              ) : (
                <>
                  <a href="https://www.hopharrison.com/unsubscribe" style={link}>Unsubscribe</a> | 
                  <a href="https://www.hopharrison.com/newsletter" style={link}>Update Preferences</a>
                </>
              )}
              <br/>
              BrewQuest Chronicles | hopharrison.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Alaska-themed email styles with blue/slate color scheme
const main = { 
  backgroundColor: '#f8fafc', 
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif' 
}

const container = { 
  margin: '0 auto', 
  padding: '0',
  width: '100%',
  maxWidth: '600px'
}

const header = { 
  position: 'relative' as const,
  overflow: 'hidden',
  borderRadius: '0'
}

const heroImage = {
  width: '100%',
  height: '300px',
  objectFit: 'cover' as const,
  display: 'block'
}

const headerOverlay = {
  position: 'absolute' as const,
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 64, 175, 0.8))',
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center' as const,
  padding: '40px 20px'
}

const logoText = { 
  fontSize: '20px', 
  fontWeight: 'bold', 
  color: '#93c5fd', 
  textAlign: 'center' as const, 
  margin: '0 0 16px' 
}

const heroHeading = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  textAlign: 'center' as const,
  margin: '0 0 8px',
  lineHeight: '1.2'
}

const heroSubtext = {
  fontSize: '16px',
  color: '#cbd5e1',
  textAlign: 'center' as const,
  margin: '0'
}

const content = { 
  padding: '32px 24px' 
}

const welcomeBox = {
  backgroundColor: '#1e40af',
  padding: '24px',
  borderRadius: '12px',
  marginBottom: '24px',
  textAlign: 'center' as const
}

const welcomeText = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 12px'
}

const text = { 
  fontSize: '16px', 
  lineHeight: '1.6', 
  color: '#ffffff', 
  margin: '0' 
}

const statsContainer = {
  backgroundColor: '#475569',
  padding: '24px',
  borderRadius: '12px',
  margin: '24px 0',
  textAlign: 'center' as const
}

const statsTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 20px'
}

const statsGrid = {
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap' as const
}

const statItem = {
  textAlign: 'center' as const,
  minWidth: '80px'
}

const statNumber = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#60a5fa',
  margin: '0'
}

const statLabel = {
  fontSize: '12px',
  color: '#cbd5e1',
  margin: '4px 0 0',
  textTransform: 'uppercase' as const
}

const journeyBox = {
  backgroundColor: '#ffffff',
  border: '2px solid #3b82f6',
  padding: '24px',
  borderRadius: '12px',
  margin: '24px 0'
}

const journeyTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1e40af',
  margin: '0 0 12px'
}

const journeyText = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '0'
}

const sectionHeading = { 
  fontSize: '24px', 
  fontWeight: 'bold', 
  color: '#1e40af', 
  textAlign: 'center' as const,
  margin: '32px 0 24px' 
}

const beerCard = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '20px',
  margin: '16px 0',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
}

const beerCardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px'
}

const beerDay = { 
  fontSize: '14px', 
  color: '#6b7280', 
  textTransform: 'uppercase' as const,
  fontWeight: '600',
  margin: '0' 
}

const beerRating = {
  fontSize: '14px',
  margin: '0'
}

const beerCardContent = {
  display: 'flex',
  gap: '16px',
  alignItems: 'flex-start'
}

const beerImageContainer = {
  flexShrink: 0
}

const beerImage = {
  width: '80px',
  height: '80px',
  objectFit: 'cover' as const,
  borderRadius: '8px'
}

const beerDetails = {
  flex: 1
}

const beerName = { 
  fontSize: '18px', 
  fontWeight: 'bold', 
  color: '#1e40af', 
  margin: '0 0 4px' 
}

const breweryName = { 
  fontSize: '14px', 
  color: '#6b7280', 
  margin: '0 0 8px',
  fontWeight: '500'
}

const beerStyle = { 
  fontSize: '14px', 
  color: '#475569', 
  margin: '0 0 12px',
  fontWeight: '500'
}

const tastingNotes = {
  fontSize: '14px',
  color: '#374151',
  margin: '0 0 12px',
  lineHeight: '1.5',
  backgroundColor: '#f1f5f9',
  padding: '12px',
  borderRadius: '6px'
}

const breweryStory = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
  lineHeight: '1.5',
  fontStyle: 'italic'
}

const specialFeaturesBox = {
  backgroundColor: '#f8fafc',
  border: '2px solid #3b82f6',
  padding: '24px',
  borderRadius: '12px',
  margin: '32px 0'
}

const featuresTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1e40af',
  margin: '0 0 16px',
  textAlign: 'center' as const
}

const featuresList = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px'
}

const featureItem = {
  fontSize: '14px',
  color: '#374151',
  margin: '0',
  lineHeight: '1.5'
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0'
}

const primaryButton = {
  backgroundColor: '#1e40af',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '8px'
}

const secondaryButton = {
  backgroundColor: '#475569',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '8px'
}

const nextWeekBox = {
  backgroundColor: '#fef3c7',
  border: '2px solid #f59e0b',
  padding: '20px',
  borderRadius: '12px',
  margin: '32px 0',
  textAlign: 'center' as const
}

const nextWeekTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#92400e',
  margin: '0 0 8px'
}

const nextWeekText = {
  fontSize: '14px',
  color: '#78350f',
  margin: '0'
}

const progressBox = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
  textAlign: 'center' as const
}

const progressTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#374151',
  margin: '0 0 8px'
}

const progressText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0 0 12px'
}

const progressBar = {
  backgroundColor: '#e5e7eb',
  height: '8px',
  borderRadius: '4px',
  overflow: 'hidden',
  position: 'relative' as const
}

const progressFill = {
  backgroundColor: '#3b82f6',
  height: '100%',
  borderRadius: '4px',
  transition: 'width 0.3s ease'
}

const divider = {
  border: 'none',
  borderTop: '1px solid #e2e8f0',
  margin: '32px 0'
}

const footerMessage = { 
  fontSize: '16px', 
  color: '#374151', 
  fontStyle: 'italic', 
  textAlign: 'center' as const, 
  margin: '24px 0',
  lineHeight: '1.6'
}

const footer = { 
  marginTop: '32px', 
  borderTop: '1px solid #e2e8f0', 
  paddingTop: '16px',
  backgroundColor: '#f8fafc',
  padding: '16px 24px'
}

const footerSmall = { 
  fontSize: '12px', 
  color: '#6b7280', 
  textAlign: 'center' as const,
  lineHeight: '1.5'
}

const link = { 
  color: '#3b82f6', 
  textDecoration: 'underline' 
}