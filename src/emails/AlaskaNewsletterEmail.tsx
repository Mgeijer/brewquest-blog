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

  return (
    <Html>
      <Head />
      <Preview>Week {weekNumber}: Alaska's Last Frontier Brewing Renaissance - Where Gold Rush History Meets Modern Innovation</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Header with Alaska Hero Image */}
          <Section style={header}>
            <Img
              src="https://www.hopharrison.com/images/State%20Images/Alaska.png"
              alt="Alaska's Last Frontier - From Denali to Coastal Breweries"
              style={heroImage}
            />
            <div style={headerOverlay}>
              <Text style={logoText}>
                🍺 BrewQuest Chronicles 🍺
              </Text>
              <Heading style={heroHeading}>
                Alaska: The Last Frontier's<br/>Brewing Renaissance
              </Heading>
              <Text style={heroSubtext}>
                Where -40°F winters and midnight sun create America's most resilient beer culture
              </Text>
            </div>
          </Section>
          
          <Section style={content}>
            {/* Welcome Message */}
            <Section style={welcomeBox}>
              <Text style={welcomeText}>
                Welcome to the Last Frontier, {subscriberName}! 🏔️
              </Text>
              <Text style={text}>
                This week we're venturing into one of America's most extreme brewing environments. Alaska's 
                49 breweries don't just survive in conditions that would challenge any brewer - they've 
                turned isolation, harsh weather, and limited supply chains into sources of innovation that 
                define what frontier brewing truly means.
              </Text>
            </Section>

            {/* Alaska: The Brewing Frontier Story */}
            <Section style={storySection}>
              <Heading style={storyHeading}>🎯 The Last Frontier Brewing Story</Heading>
              
              <Text style={storyText}>
                In 1986, when Marcy and Geoff Larson founded Alaskan Brewing Company in Juneau, 
                there were only 67 independent breweries in the entire United States. Today, Alaska 
                ranks #4 nationally in breweries per capita - a testament to the state's fierce 
                independence and innovative spirit.
              </Text>
              
              <Text style={storyText}>
                What makes Alaska brewing extraordinary isn't just the numbers - it's the necessity-driven 
                innovation. When your brewery operates where winter temperatures hit -40°F and supply 
                chains can be cut off for weeks, you develop solutions that push the entire industry forward.
              </Text>
            </Section>

            {/* The Alaska Advantage */}
            <Section style={advantageSection}>
              <Heading style={advantageHeading}>❄️ The Alaska Brewing Advantage</Heading>
              
              <div style={advantageGrid}>
                <div style={advantageCard}>
                  <Text style={advantageTitle}>🏔️ Pristine Glacial Water</Text>
                  <Text style={advantageText}>
                    Juneau Icefield provides some of the world's purest brewing water. Alaskan Brewing's 
                    water source has been flowing for over 3,000 years - no municipal treatment needed.
                  </Text>
                </div>
                
                <div style={advantageCard}>
                  <Text style={advantageTitle}>🌲 Wild Indigenous Ingredients</Text>
                  <Text style={advantageText}>
                    Sitka spruce tips from Tongass National Forest, alder-smoked malts, wild berries, 
                    and even kelp create flavors impossible to replicate anywhere else.
                  </Text>
                </div>
                
                <div style={advantageCard}>
                  <Text style={advantageTitle}>♻️ Pioneering Sustainability</Text>
                  <Text style={advantageText}>
                    Necessity bred innovation: Alaskan Brewing's CO₂ recovery system and steam generation 
                    from spent grain were industry firsts, now adopted worldwide.
                  </Text>
                </div>
                
                <div style={advantageCard}>
                  <Text style={advantageTitle}>📜 Living History</Text>
                  <Text style={advantageText}>
                    Alaskan Amber's recipe comes from actual Gold Rush-era shipping records (1899-1907) 
                    discovered in the Juneau-Douglas City Museum.
                  </Text>
                </div>
              </div>
            </Section>

            {/* Brewery Spotlight */}
            <Section style={spotlightSection}>
              <Heading style={spotlightHeading}>🏆 Alaska's Brewing Pioneers</Heading>
              
              <div style={brewerySpotlight}>
                <Text style={breweryName}>Alaskan Brewing Company - Juneau (1986)</Text>
                <Text style={breweryStory}>
                  The state's founding brewery began when Geoff Larson, a former chemical engineer, 
                  discovered historical brewing records in Juneau's museum. Their flagship Amber became 
                  a Gold Rush recipe brought back to life, proving that authenticity and innovation 
                  could coexist.
                </Text>
                <Text style={breweryAchievement}>
                  🏅 First brewery to implement CO₂ recovery in the US
                </Text>
              </div>
              
              <div style={brewerySpotlight}>
                <Text style={breweryName}>Midnight Sun Brewing - Anchorage (1995)</Text>
                <Text style={breweryStory}>
                  Known for boundary-pushing beers like their 27% ABV "M" barleywine, Midnight Sun 
                  represents Alaska's "go big or go home" mentality. They've mastered barrel-aging 
                  in extreme temperatures that would ruin most beer.
                </Text>
                <Text style={breweryAchievement}>
                  🥃 Pioneers of extreme temperature barrel-aging
                </Text>
              </div>

              <div style={brewerySpotlight}>
                <Text style={breweryName}>HooDoo Brewing - Fairbanks (2012)</Text>
                <Text style={breweryStory}>
                  Operating where temperatures reach -40°F, HooDoo proves German precision works in 
                  Alaska's interior. Their authentic Kölsch and Hefeweizen maintain traditional 
                  character despite challenging conditions.
                </Text>
                <Text style={breweryAchievement}>
                  🌡️ Successfully brewing European styles at -40°F
                </Text>
              </div>
            </Section>

            {/* Cultural Impact */}
            <Section style={cultureSection}>
              <Heading style={cultureHeading}>🤝 Beer as Community in the Last Frontier</Heading>
              
              <Text style={cultureText}>
                In Alaska, breweries aren't just businesses - they're survival hubs. During Anchorage's 
                long winters, places like Broken Tooth Brewing (inside Moose's Tooth Pub) become 
                essential gathering spaces where neighbors check on each other over locally-made beer.
              </Text>
              
              <Text style={cultureText}>
                This community focus drives innovation too. When supply chains fail, brewers share 
                ingredients. When equipment breaks, they fix each other's. The result? A brewing 
                community that's tighter and more collaborative than anywhere else in America.
              </Text>
              
              <div style={cultureStats}>
                <Text style={cultureStatText}>
                  <strong>Community Impact:</strong> Alaska breweries generate $332 million annually 
                  while employing 2,800+ Alaskans in communities from Ketchikan to Fairbanks.
                </Text>
              </div>
            </Section>

            {/* Innovation Spotlight */}
            <Section style={innovationSection}>
              <Heading style={innovationHeading}>💡 Alaska's Brewing Innovations</Heading>
              
              <div style={innovationGrid}>
                <div style={innovationCard}>
                  <Text style={innovationTitle}>🔥 Alder Wood Smoking</Text>
                  <Text style={innovationText}>
                    Alaskan Brewing's Smoked Porter uses alder wood from Tongass National Forest, 
                    creating flavors so unique it won gold at the 2024 European Beer Star competition.
                  </Text>
                </div>
                
                <div style={innovationCard}>
                  <Text style={innovationTitle}>🌿 Foraged Ingredients</Text>
                  <Text style={innovationText}>
                    Alaska brewers forage cloudberries, salmonberries, and rose hips, creating seasonal 
                    beers that capture the state's wild essence in liquid form.
                  </Text>
                </div>
                
                <div style={innovationCard}>
                  <Text style={innovationTitle}>❄️ Cold-Weather Logistics</Text>
                  <Text style={innovationText}>
                    Alaska breweries pioneered cold-weather brewing techniques and developed supply 
                    chain solutions that work when roads freeze and planes can't fly.
                  </Text>
                </div>
              </div>
            </Section>

            {/* The Week Ahead */}
            <Section style={weekAheadSection}>
              <Heading style={weekAheadHeading}>🗓️ Your Alaska Beer Journey</Heading>
              
              <Text style={weekAheadText}>
                This week on hopharrison.com, we're releasing daily beer reviews that tell Alaska's 
                brewing story. Each day reveals a different aspect of Last Frontier brewing - from 
                Gold Rush authenticity to modern innovation. Follow along as we explore:
              </Text>
              
              <div style={journeyPreview}>
                <Text style={journeyItem}>
                  🥉 Historical authenticity with Gold Rush-era recipes
                </Text>
                <Text style={journeyItem}>
                  🍺 Extreme climate brewing techniques and solutions  
                </Text>
                <Text style={journeyItem}>
                  🌲 Wild ingredient sourcing and foraging traditions
                </Text>
                <Text style={journeyItem}>
                  🏔️ Community resilience and collaboration stories
                </Text>
                <Text style={journeyItem}>
                  ♻️ Sustainability innovations born from necessity
                </Text>
              </div>
            </Section>

            {/* Alaska Stats */}
            <Section style={statsContainer}>
              <Text style={statsTitle}>📊 Alaska Brewing by the Numbers</Text>
              <div style={statsGrid}>
                <div style={statItem}>
                  <Text style={statNumber}>49</Text>
                  <Text style={statLabel}>Active Breweries</Text>
                </div>
                <div style={statItem}>
                  <Text style={statNumber}>#4</Text>
                  <Text style={statLabel}>Per Capita Nationally</Text>
                </div>
                <div style={statItem}>
                  <Text style={statNumber}>6.7</Text>
                  <Text style={statLabel}>Per 100k Residents</Text>
                </div>
                <div style={statItem}>
                  <Text style={statNumber}>$332M</Text>
                  <Text style={statLabel}>Economic Impact</Text>
                </div>
                <div style={statItem}>
                  <Text style={statNumber}>2,800+</Text>
                  <Text style={statLabel}>Jobs Created</Text>
                </div>
                <div style={statItem}>
                  <Text style={statNumber}>9.3</Text>
                  <Text style={statLabel}>Gallons Per Person</Text>
                </div>
              </div>
            </Section>

            {/* Call to Action */}
            <Section style={ctaSection}>
              <Button style={primaryButton} href="https://www.hopharrison.com/states/alaska">
                Explore Alaska's Breweries 🏔️
              </Button>
              
              <Button style={secondaryButton} href="https://www.hopharrison.com/blog">
                Follow Daily Beer Journey 🍺
              </Button>
            </Section>

            {/* Next Week Preview */}
            <Section style={nextWeekBox}>
              <Text style={nextWeekTitle}>🌵 Coming Next Week</Text>
              <Text style={nextWeekText}>
                <strong>Week 3: Arizona's Desert Brewing Oasis</strong><br/>
                From Sedona's red rock breweries to Phoenix's innovative desert-inspired ales, 
                discover how Arizona's craft beer scene thrives in the Sonoran Desert where 
                summer temperatures reach 115°F.
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
              Alaska proves that great beer isn't just about perfect conditions - it's about passion, 
              innovation, and community. These brewers don't just make beer; they preserve history, 
              build communities, and show us what's possible when you refuse to be limited by your environment.
              <br/><br/>
              Keep exploring,<br/>
              🍻 Hop Harrison - BrewQuest Chronicles
            </Text>
          </Section>
          
          {/* Email Footer */}
          <Section style={footer}>
            <Text style={footerSmall}>
              You're receiving this because you're part of the BrewQuest Chronicles community.
              <br/>
              {unsubscribeToken ? (
                <>
                  <a href={`https://www.hopharrison.com/unsubscribe?token=${unsubscribeToken}`} style={link}>Unsubscribe</a> | 
                  <a href="https://www.hopharrison.com/newsletter" style={link}>Manage Preferences</a>
                </>
              ) : (
                <>
                  <a href="https://www.hopharrison.com/unsubscribe" style={link}>Unsubscribe</a> | 
                  <a href="https://www.hopharrison.com/newsletter" style={link}>Manage Preferences</a>
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

// New styles for enhanced content sections
const storySection = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  padding: '24px',
  borderRadius: '12px',
  margin: '24px 0'
}

const storyHeading = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1e40af',
  margin: '0 0 16px'
}

const storyText = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '0 0 16px'
}

const advantageSection = {
  backgroundColor: '#f8fafc',
  padding: '24px',
  borderRadius: '12px',
  margin: '24px 0'
}

const advantageHeading = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1e40af',
  margin: '0 0 20px',
  textAlign: 'center' as const
}

const advantageGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '16px'
}

const advantageCard = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  padding: '16px',
  borderRadius: '8px'
}

const advantageTitle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#1e40af',
  margin: '0 0 8px'
}

const advantageText = {
  fontSize: '13px',
  lineHeight: '1.5',
  color: '#374151',
  margin: '0'
}

const spotlightSection = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  padding: '24px',
  borderRadius: '12px',
  margin: '24px 0'
}

const spotlightHeading = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1e40af',
  margin: '0 0 20px',
  textAlign: 'center' as const
}

const brewerySpotlight = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  padding: '16px',
  borderRadius: '8px',
  margin: '0 0 16px'
}

const breweryName = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1e40af',
  margin: '0 0 8px'
}

const breweryStory = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#374151',
  margin: '0 0 8px'
}

const breweryAchievement = {
  fontSize: '13px',
  fontWeight: '500',
  color: '#059669',
  margin: '0',
  fontStyle: 'italic'
}

const cultureSection = {
  backgroundColor: '#eff6ff',
  border: '2px solid #3b82f6',
  padding: '24px',
  borderRadius: '12px',
  margin: '24px 0'
}

const cultureHeading = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1e40af',
  margin: '0 0 16px',
  textAlign: 'center' as const
}

const cultureText = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '0 0 16px'
}

const cultureStats = {
  backgroundColor: '#dbeafe',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0 0'
}

const cultureStatText = {
  fontSize: '14px',
  color: '#1e40af',
  margin: '0',
  textAlign: 'center' as const
}

const innovationSection = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  padding: '24px',
  borderRadius: '12px',
  margin: '24px 0'
}

const innovationHeading = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1e40af',
  margin: '0 0 20px',
  textAlign: 'center' as const
}

const innovationGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '16px'
}

const innovationCard = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  padding: '16px',
  borderRadius: '8px'
}

const innovationTitle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#1e40af',
  margin: '0 0 8px'
}

const innovationText = {
  fontSize: '13px',
  lineHeight: '1.5',
  color: '#374151',
  margin: '0'
}

const weekAheadSection = {
  backgroundColor: '#fef3c7',
  border: '2px solid #f59e0b',
  padding: '24px',
  borderRadius: '12px',
  margin: '24px 0'
}

const weekAheadHeading = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#92400e',
  margin: '0 0 16px',
  textAlign: 'center' as const
}

const weekAheadText = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#78350f',
  margin: '0 0 16px',
  textAlign: 'center' as const
}

const journeyPreview = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '8px'
}

const journeyItem = {
  fontSize: '14px',
  color: '#78350f',
  margin: '0',
  lineHeight: '1.5'
}