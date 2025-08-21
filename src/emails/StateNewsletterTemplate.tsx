import {
  Html, Head, Preview, Body, Container, Section, Heading, Text, Button, Img, Hr
} from '@react-email/components'

interface StateNewsletterData {
  stateName: string
  stateCode: string
  weekNumber: number
  tagline: string
  heroImage: string
  colorScheme: {
    primary: string
    secondary: string
    accent: string
    light: string
  }
  stats: {
    breweries: number
    perCapitaRank: string
    economicImpact: string
    additionalStats: Array<{ label: string; value: string }>
  }
  uniqueAdvantages: Array<{
    icon: string
    title: string
    description: string
  }>
  pioneerBreweries: Array<{
    name: string
    location: string
    yearFounded: number
    story: string
    achievement: string
  }>
  culturalStory: {
    title: string
    paragraphs: string[]
    impactStats: string
  }
  innovations: Array<{
    title: string
    description: string
  }>
  nextState: {
    name: string
    preview: string
  }
}

interface StateNewsletterProps {
  subscriberName?: string
  stateData: StateNewsletterData
  unsubscribeToken?: string
  previewMode?: boolean
}

export default function StateNewsletterTemplate({
  subscriberName = 'Beer Enthusiast',
  stateData,
  unsubscribeToken,
  previewMode = false
}: StateNewsletterProps) {
  
  return (
    <Html>
      <Head />
      <Preview>Week {stateData.weekNumber}: {stateData.stateName}'s Craft Beer Renaissance - {stateData.tagline}</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Dynamic Hero Section */}
          <Section style={header}>
            <Img
              src={stateData.heroImage}
              alt={`${stateData.stateName}'s Craft Beer Scene`}
              style={heroImage}
            />
            <div style={{...headerOverlay, background: `linear-gradient(135deg, ${stateData.colorScheme.primary}CC, ${stateData.colorScheme.secondary}CC)`}}>
              <Text style={logoText}>
                🍺 BrewQuest Chronicles 🍺
              </Text>
              <Heading style={heroHeading}>
                {stateData.stateName}: Craft Beer<br/>Renaissance
              </Heading>
              <Text style={heroSubtext}>
                {stateData.tagline}
              </Text>
            </div>
          </Section>
          
          <Section style={content}>
            {/* Personal Welcome */}
            <Section style={{...welcomeBox, backgroundColor: stateData.colorScheme.primary}}>
              <Text style={welcomeText}>
                Welcome to {stateData.stateName}, {subscriberName}! 🌟
              </Text>
              <Text style={text}>
                This week we're exploring {stateData.stateName}'s unique craft beer landscape. From pioneering 
                breweries that shaped the movement to innovative techniques that define regional character, 
                discover what makes {stateData.stateName}'s brewing scene truly distinctive.
              </Text>
            </Section>

            {/* State Overview Story */}
            <Section style={storySection}>
              <Heading style={{...storyHeading, color: stateData.colorScheme.primary}}>
                🎯 The {stateData.stateName} Brewing Story
              </Heading>
              
              <Text style={storyText}>
                Every state's craft beer journey is unique, shaped by local culture, geography, and community. 
                {stateData.stateName} has carved out its distinctive place in America's brewing renaissance through 
                innovation, tradition, and an unwavering commitment to quality that reflects the state's character.
              </Text>
              
              <Text style={storyText}>
                What sets {stateData.stateName} apart isn't just the number of breweries—it's the story behind each one, 
                the local ingredients that define regional flavors, and the communities that support and celebrate 
                craft beer as an integral part of local culture.
              </Text>
            </Section>

            {/* State Advantages Grid */}
            <Section style={{...advantageSection, borderColor: stateData.colorScheme.secondary}}>
              <Heading style={{...advantageHeading, color: stateData.colorScheme.primary}}>
                ✨ What Makes {stateData.stateName} Beer Special
              </Heading>
              
              <div style={advantageGrid}>
                {stateData.uniqueAdvantages.map((advantage, index) => (
                  <div key={index} style={{...advantageCard, borderColor: stateData.colorScheme.light}}>
                    <Text style={{...advantageTitle, color: stateData.colorScheme.primary}}>
                      {advantage.icon} {advantage.title}
                    </Text>
                    <Text style={advantageText}>
                      {advantage.description}
                    </Text>
                  </div>
                ))}
              </div>
            </Section>

            {/* Pioneer Brewery Spotlights */}
            <Section style={spotlightSection}>
              <Heading style={{...spotlightHeading, color: stateData.colorScheme.primary}}>
                🏆 {stateData.stateName}'s Brewing Pioneers
              </Heading>
              
              {stateData.pioneerBreweries.map((brewery, index) => (
                <div key={index} style={{...brewerySpotlight, borderColor: stateData.colorScheme.light}}>
                  <Text style={{...pioneerBreweryName, color: stateData.colorScheme.primary}}>
                    {brewery.name} - {brewery.location} ({brewery.yearFounded})
                  </Text>
                  <Text style={pioneerBreweryStory}>
                    {brewery.story}
                  </Text>
                  <Text style={breweryAchievement}>
                    🏅 {brewery.achievement}
                  </Text>
                </div>
              ))}
            </Section>

            {/* Cultural Impact */}
            <Section style={{...cultureSection, backgroundColor: stateData.colorScheme.light, borderColor: stateData.colorScheme.secondary}}>
              <Heading style={{...cultureHeading, color: stateData.colorScheme.primary}}>
                🤝 {stateData.culturalStory.title}
              </Heading>
              
              {stateData.culturalStory.paragraphs.map((paragraph, index) => (
                <Text key={index} style={cultureText}>
                  {paragraph}
                </Text>
              ))}
              
              <div style={{...cultureStats, backgroundColor: stateData.colorScheme.primary}}>
                <Text style={{...cultureStatText, color: '#ffffff'}}>
                  <strong>Community Impact:</strong> {stateData.culturalStory.impactStats}
                </Text>
              </div>
            </Section>

            {/* Innovation Spotlight */}
            <Section style={innovationSection}>
              <Heading style={{...innovationHeading, color: stateData.colorScheme.primary}}>
                💡 {stateData.stateName}'s Brewing Innovations
              </Heading>
              
              <div style={innovationGrid}>
                {stateData.innovations.map((innovation, index) => (
                  <div key={index} style={{...innovationCard, borderColor: stateData.colorScheme.light}}>
                    <Text style={{...innovationTitle, color: stateData.colorScheme.primary}}>
                      {innovation.title}
                    </Text>
                    <Text style={innovationText}>
                      {innovation.description}
                    </Text>
                  </div>
                ))}
              </div>
            </Section>

            {/* Weekly Journey Preview */}
            <Section style={{...weekAheadSection, backgroundColor: '#fef3c7', borderColor: '#f59e0b'}}>
              <Heading style={weekAheadHeading}>🗓️ Your {stateData.stateName} Beer Journey</Heading>
              
              <Text style={weekAheadText}>
                This week on hopharrison.com, discover {stateData.stateName}'s brewing excellence through daily 
                releases that explore different aspects of the state's craft beer culture. Each day reveals new 
                stories, flavors, and the passionate people behind {stateData.stateName}'s brewing renaissance.
              </Text>
              
              <div style={journeyPreview}>
                <Text style={journeyItem}>
                  🏺 Historical foundations and brewing heritage
                </Text>
                <Text style={journeyItem}>
                  🌾 Local ingredients and regional flavor profiles
                </Text>
                <Text style={journeyItem}>
                  🔬 Innovation and brewing technique mastery
                </Text>
                <Text style={journeyItem}>
                  🤝 Community building and cultural impact
                </Text>
                <Text style={journeyItem}>
                  🌟 Modern excellence and future vision
                </Text>
              </div>
            </Section>

            {/* Enhanced Statistics */}
            <Section style={{...statsContainer, backgroundColor: stateData.colorScheme.primary}}>
              <Text style={statsTitle}>📊 {stateData.stateName} Brewing by the Numbers</Text>
              <div style={enhancedStatsGrid}>
                <div style={statItem}>
                  <Text style={{...statNumber, color: '#ffffff'}}>
                    {stateData.stats.breweries}
                  </Text>
                  <Text style={statLabel}>Active Breweries</Text>
                </div>
                <div style={statItem}>
                  <Text style={{...statNumber, color: '#ffffff'}}>
                    {stateData.stats.perCapitaRank}
                  </Text>
                  <Text style={statLabel}>Per Capita Ranking</Text>
                </div>
                <div style={statItem}>
                  <Text style={{...statNumber, color: '#ffffff'}}>
                    {stateData.stats.economicImpact}
                  </Text>
                  <Text style={statLabel}>Economic Impact</Text>
                </div>
                {stateData.stats.additionalStats.map((stat, index) => (
                  <div key={index} style={statItem}>
                    <Text style={{...statNumber, color: '#ffffff'}}>
                      {stat.value}
                    </Text>
                    <Text style={statLabel}>{stat.label}</Text>
                  </div>
                ))}
              </div>
            </Section>

            {/* Call to Action */}
            <Section style={ctaSection}>
              <Button 
                style={{...primaryButton, backgroundColor: stateData.colorScheme.primary}} 
                href={`https://www.hopharrison.com/states/${stateData.stateName.toLowerCase()}`}
              >
                Explore {stateData.stateName}'s Breweries 🍺
              </Button>
              
              <Button style={secondaryButton} href="https://www.hopharrison.com/blog">
                Follow Daily Beer Journey 🗺️
              </Button>
            </Section>

            {/* Next Week Preview */}
            <Section style={nextWeekBox}>
              <Text style={nextWeekTitle}>🌟 Coming Next Week</Text>
              <Text style={nextWeekText}>
                <strong>Week {stateData.weekNumber + 1}: {stateData.nextState.name}'s Brewing Adventure</strong><br/>
                {stateData.nextState.preview}
              </Text>
            </Section>

            {/* Progress Tracker */}
            <Section style={progressBox}>
              <Text style={progressTitle}>🇺🇸 BrewQuest Progress</Text>
              <Text style={progressText}>
                States Completed: {stateData.weekNumber}/50 • {((stateData.weekNumber/50) * 100).toFixed(1)}% Complete
              </Text>
              <div style={progressBar}>
                <div style={{...progressFill, width: `${(stateData.weekNumber/50) * 100}%`, backgroundColor: stateData.colorScheme.secondary}}></div>
              </div>
            </Section>

            <Hr style={divider} />

            {/* Enhanced Footer Message */}
            <Text style={footerMessage}>
              {stateData.stateName} represents the diversity and passion that defines American craft brewing. 
              Every brewery tells a story, every beer reflects its place, and every glass connects us to 
              the communities that make craft beer culture so vibrant and authentic.
              <br/><br/>
              Keep exploring the great American beer journey,<br/>
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

// Enhanced, reusable email styles
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
  height: '320px',
  objectFit: 'cover' as const,
  display: 'block'
}

const headerOverlay = {
  position: 'absolute' as const,
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center' as const,
  padding: '40px 20px'
}

const logoText = { 
  fontSize: '22px', 
  fontWeight: 'bold', 
  color: '#ffffff', 
  textAlign: 'center' as const, 
  margin: '0 0 16px',
  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
}

const heroHeading = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#ffffff',
  textAlign: 'center' as const,
  margin: '0 0 12px',
  lineHeight: '1.2',
  textShadow: '0 2px 4px rgba(0,0,0,0.4)'
}

const heroSubtext = {
  fontSize: '18px',
  color: '#ffffff',
  textAlign: 'center' as const,
  margin: '0',
  opacity: '0.95',
  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
}

const content = { 
  padding: '32px 24px' 
}

const welcomeBox = {
  padding: '28px',
  borderRadius: '16px',
  marginBottom: '28px',
  textAlign: 'center' as const,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
}

const welcomeText = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 16px'
}

const text = { 
  fontSize: '16px', 
  lineHeight: '1.6', 
  color: '#ffffff', 
  margin: '0' 
}

const storySection = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  padding: '28px',
  borderRadius: '16px',
  margin: '28px 0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
}

const storyHeading = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  textAlign: 'center' as const
}

const storyText = {
  fontSize: '16px',
  lineHeight: '1.7',
  color: '#374151',
  margin: '0 0 18px'
}

const advantageSection = {
  backgroundColor: '#f8fafc',
  padding: '28px',
  borderRadius: '16px',
  margin: '28px 0',
  border: '2px solid'
}

const advantageHeading = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 24px',
  textAlign: 'center' as const
}

const advantageGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '20px'
}

const advantageCard = {
  backgroundColor: '#ffffff',
  border: '1px solid',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
}

const advantageTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px'
}

const advantageText = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '0'
}

const spotlightSection = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  padding: '28px',
  borderRadius: '16px',
  margin: '28px 0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
}

const spotlightHeading = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 24px',
  textAlign: 'center' as const
}

const brewerySpotlight = {
  backgroundColor: '#f8fafc',
  border: '1px solid',
  padding: '20px',
  borderRadius: '12px',
  margin: '0 0 20px'
}

const pioneerBreweryName = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px'
}

const pioneerBreweryStory = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '0 0 12px'
}

const breweryAchievement = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#059669',
  margin: '0',
  fontStyle: 'italic'
}

const cultureSection = {
  padding: '28px',
  borderRadius: '16px',
  margin: '28px 0',
  border: '2px solid'
}

const cultureHeading = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  textAlign: 'center' as const
}

const cultureText = {
  fontSize: '16px',
  lineHeight: '1.7',
  color: '#374151',
  margin: '0 0 18px'
}

const cultureStats = {
  padding: '20px',
  borderRadius: '12px',
  margin: '20px 0 0',
  textAlign: 'center' as const
}

const cultureStatText = {
  fontSize: '15px',
  margin: '0',
  fontWeight: '500'
}

const innovationSection = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  padding: '28px',
  borderRadius: '16px',
  margin: '28px 0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
}

const innovationHeading = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 24px',
  textAlign: 'center' as const
}

const innovationGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '18px'
}

const innovationCard = {
  backgroundColor: '#f8fafc',
  border: '1px solid',
  padding: '18px',
  borderRadius: '10px'
}

const innovationTitle = {
  fontSize: '15px',
  fontWeight: 'bold',
  margin: '0 0 10px'
}

const innovationText = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#374151',
  margin: '0'
}

const weekAheadSection = {
  padding: '28px',
  borderRadius: '16px',
  margin: '28px 0',
  border: '2px solid'
}

const weekAheadHeading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#92400e',
  margin: '0 0 20px',
  textAlign: 'center' as const
}

const weekAheadText = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#78350f',
  margin: '0 0 20px',
  textAlign: 'center' as const
}

const journeyPreview = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '10px'
}

const journeyItem = {
  fontSize: '15px',
  color: '#78350f',
  margin: '0',
  lineHeight: '1.5',
  fontWeight: '500'
}

const statsContainer = {
  padding: '28px',
  borderRadius: '16px',
  margin: '28px 0',
  textAlign: 'center' as const,
  color: '#ffffff'
}

const statsTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 24px'
}

const enhancedStatsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: '20px',
  marginTop: '24px'
}

const statItem = {
  textAlign: 'center' as const,
  minWidth: '100px'
}

const statNumber = {
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 4px'
}

const statLabel = {
  fontSize: '13px',
  color: '#cbd5e1',
  margin: '0',
  textTransform: 'uppercase' as const,
  fontWeight: '500'
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '36px 0'
}

const primaryButton = {
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
  margin: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
}

const secondaryButton = {
  backgroundColor: '#475569',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
  margin: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
}

const nextWeekBox = {
  backgroundColor: '#fef3c7',
  border: '2px solid #f59e0b',
  padding: '24px',
  borderRadius: '16px',
  margin: '36px 0',
  textAlign: 'center' as const
}

const nextWeekTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#92400e',
  margin: '0 0 12px'
}

const nextWeekText = {
  fontSize: '15px',
  color: '#78350f',
  margin: '0',
  lineHeight: '1.6'
}

const progressBox = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  padding: '24px',
  borderRadius: '12px',
  margin: '28px 0',
  textAlign: 'center' as const,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
}

const progressTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#374151',
  margin: '0 0 12px'
}

const progressText = {
  fontSize: '15px',
  color: '#6b7280',
  margin: '0 0 16px'
}

const progressBar = {
  backgroundColor: '#e5e7eb',
  height: '10px',
  borderRadius: '5px',
  overflow: 'hidden',
  position: 'relative' as const
}

const progressFill = {
  height: '100%',
  borderRadius: '5px',
  transition: 'width 0.3s ease'
}

const divider = {
  border: 'none',
  borderTop: '1px solid #e2e8f0',
  margin: '36px 0'
}

const footerMessage = { 
  fontSize: '16px', 
  color: '#374151', 
  fontStyle: 'italic', 
  textAlign: 'center' as const, 
  margin: '28px 0',
  lineHeight: '1.7'
}

const footer = { 
  marginTop: '36px', 
  borderTop: '1px solid #e2e8f0', 
  paddingTop: '20px',
  backgroundColor: '#f8fafc',
  padding: '20px 24px'
}

const footerSmall = { 
  fontSize: '13px', 
  color: '#6b7280', 
  textAlign: 'center' as const,
  lineHeight: '1.6'
}

const link = { 
  color: '#3b82f6', 
  textDecoration: 'underline' 
}