import {
  Html, Head, Preview, Body, Container, Section, Heading, Text, Button, Img
} from '@react-email/components'

interface BeerReview {
  beer_name: string
  brewery_name: string
  rating: number
  beer_style: string
  abv: number
  day_of_week: number
  image_url?: string
}

interface WeeklyDigestEmailProps {
  subscriberName?: string
  weekNumber: number
  stateName: string
  stateCode: string
  beerReviews: BeerReview[]
  breweryCount?: number
  nextStateName?: string
  unsubscribeToken?: string
}

export default function WeeklyDigestEmail({
  subscriberName = 'Beer Enthusiast',
  weekNumber,
  stateName,
  stateCode,
  beerReviews,
  breweryCount = 7,
  nextStateName,
  unsubscribeToken
}: WeeklyDigestEmailProps) {
  const getStateDescription = (state: string) => {
    const descriptions: Record<string, string> = {
      'Alabama': `This week, we're diving deep into Alabama's surprising and vibrant craft beer scene. From Birmingham's urban brewing culture to Mobile's coastal flavors, the Heart of Dixie has quietly built one of the South's most authentic and innovative brewing communities.

Alabama's relationship with beer has been complicated. Until 2009, it was illegal to brew beer stronger than 6% ABV in the state. The "Gourmet Beer Bill" changed everything, opening the doors for craft breweries to flourish and for beer lovers to experience the full spectrum of flavors that define modern American brewing.

Today, Alabama is home to 45+ breweries, each telling a unique story of Southern hospitality, local ingredients, and innovative brewing techniques.`,
      'Alaska': `Coming soon - Alaska's frontier brewing adventure awaits!`,
      // Add more states as needed
    }
    return descriptions[state] || `Discover the unique craft beer culture of ${state} in this week's journey.`
  }

  const getWeeklySchedule = (state: string) => {
    const schedules: Record<string, string[]> = {
      'Alabama': [
        'Monday: Good People Brewing Company - The flagship that started it all',
        'Tuesday: Yellowhammer Brewing - Huntsville\'s German-inspired tradition',
        'Wednesday: Cahaba Brewing Company - Birmingham\'s river-inspired ales',
        'Thursday: TrimTab Brewing - Innovation meets drinkability',
        'Friday: Avondale Brewing - Belgian traditions in Southern soil',
        'Saturday: Back Forty Beer Company - Gadsden\'s hop-forward approach',
        'Sunday: Monday Night Brewing - Atlanta meets Birmingham'
      ]
    }
    return schedules[state] || []
  }

  return (
    <Html>
      <Head />
      <Preview>Week {weekNumber}: {stateName} Craft Beer Journey Complete!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logoText}>
              🍺 BrewQuest Chronicles 🍺
            </Text>
          </Section>
          
          <Section style={content}>
            <Heading style={heading}>
              Week {weekNumber}: {stateName} Beer Adventure 🍺
            </Heading>
            
            <Text style={text}>
              Hey {subscriberName}! Welcome to Week {weekNumber} of our 50-state craft beer journey! 
              This week we're exploring {stateName} - {stateName === 'Alabama' ? 'The Heart of Dixie' : 'an incredible craft beer destination'}. 
              Get ready to discover what makes {stateName}'s brewing scene so special.
            </Text>

            {/* State Overview */}
            <Section style={statsBox}>
              <Text style={statsTitle}>🗺️ Week {weekNumber}: {stateName}</Text>
              <Text style={statsText}>
                <strong>Journey Progress: {weekNumber}/50 States</strong><br/>
                📍 7 Days of Brewery Discoveries<br/>
                🍺 Daily Featured Beers<br/>
                🏭 Local Craft Beer Culture
              </Text>
            </Section>

            {/* State Description */}
            <Section style={highlightBox}>
              <Text style={highlightTitle}>🍺 Discovering {stateName}</Text>
              <Text style={highlightText}>
                {getStateDescription(stateName)}
              </Text>
            </Section>
            
            <Heading style={subHeading}>📅 This Week's Brewery Schedule</Heading>
            
            {getWeeklySchedule(stateName).map((day, index) => (
              <Section key={index} style={beerCard}>
                <Text style={beerDetails}>
                  {day}
                </Text>
              </Section>
            ))}

            <Button style={button} href={`https://www.hopharrison.com/states/${stateCode.toLowerCase()}`}>
              Read Full {stateName} Reviews 📖
            </Button>

            {/* What Makes This State Special */}
            <Section style={stateHighlights}>
              <Text style={stateHighlightTitle}>🌟 What Makes {stateName} Beer Special</Text>
              <Text style={text}>
                {stateName === 'Alabama' ? (
                  <>
                    • <strong>Local Ingredients:</strong> Alabama brewers take advantage of local agriculture<br/>
                    • <strong>Southern Innovation:</strong> Creating distinctly Southern interpretations of classic styles<br/>
                    • <strong>Community Focus:</strong> Every brewery serves as a community gathering place
                  </>
                ) : (
                  `Discover the unique characteristics that make ${stateName}'s craft beer scene extraordinary.`
                )}
              </Text>
            </Section>

            {/* Interactive Map */}
            <Text style={text}>
              Follow our complete 50-state journey and see where we've been:
            </Text>
            
            <Button style={secondaryButton} href="https://www.hopharrison.com/blog">
              View Full Journey 🗺️
            </Button>

            <Text style={footerText}>
              Thanks for joining me on this incredible beer journey across America!<br/>
              Progress: {weekNumber}/50 states • {((weekNumber/50) * 100).toFixed(1)}% complete<br/>
              🍻 Hop Harrison - BrewQuest Chronicles
            </Text>
          </Section>
          
          <Section style={footer}>
            <Text style={footerSmall}>
              You're receiving this weekly digest as a BrewQuest Chronicles subscriber.
              <br/>
              {unsubscribeToken ? (
                <>
                  <a href={`https://www.hopharrison.com/unsubscribe?token=${unsubscribeToken}`} style={link}>Unsubscribe</a> | 
                  <a href="https://www.hopharrison.com/preferences" style={link}>Update Preferences</a>
                </>
              ) : (
                <>
                  <a href="https://www.hopharrison.com/unsubscribe" style={link}>Unsubscribe</a> | 
                  <a href="https://www.hopharrison.com/preferences" style={link}>Update Preferences</a>
                </>
              )}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = { backgroundColor: '#FEF3C7', fontFamily: 'Inter, sans-serif' }
const container = { margin: '0 auto', padding: '20px 0 48px', width: '600px' }
const header = { padding: '20px 0', textAlign: 'center' as const }
const logoText = { fontSize: '24px', fontWeight: 'bold', color: '#78350F', textAlign: 'center' as const, margin: '0' }
const content = { padding: '20px 32px' }
const heading = { fontSize: '28px', fontWeight: 'bold', color: '#78350F', textAlign: 'center' as const }
const subHeading = { fontSize: '22px', fontWeight: 'bold', color: '#78350F', marginTop: '32px', marginBottom: '16px' }
const text = { fontSize: '16px', lineHeight: '24px', color: '#78350F', margin: '16px 0' }

const statsBox = {
  backgroundColor: '#F59E0B',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
  textAlign: 'center' as const
}
const statsTitle = { fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 12px' }
const statsText = { fontSize: '16px', color: '#ffffff', margin: '0' }

const highlightBox = {
  backgroundColor: '#D97706',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
  textAlign: 'center' as const
}
const highlightTitle = { fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 12px' }
const highlightText = { fontSize: '16px', color: '#ffffff', margin: '0' }

const stateHighlights = {
  backgroundColor: '#ffffff',
  border: '2px solid #F59E0B',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0'
}
const stateHighlightTitle = { fontSize: '18px', fontWeight: 'bold', color: '#78350F', margin: '0 0 12px' }

const beerCard = {
  backgroundColor: '#ffffff',
  border: '2px solid #F59E0B',
  borderRadius: '8px',
  padding: '16px',
  margin: '12px 0'
}
const beerDay = { fontSize: '12px', color: '#92400E', textTransform: 'uppercase' as const, margin: '0 0 8px' }
const beerName = { fontSize: '18px', fontWeight: 'bold', color: '#78350F', margin: '0 0 4px' }
const breweryName = { fontSize: '16px', color: '#92400E', margin: '0 0 8px' }
const beerDetails = { fontSize: '14px', color: '#78350F', margin: '0' }

const button = {
  backgroundColor: '#F59E0B',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
  margin: '24px auto',
  width: '240px'
}

const secondaryButton = {
  backgroundColor: '#D97706',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
  margin: '24px auto',
  width: '200px'
}

const footer = { marginTop: '32px', borderTop: '1px solid #D97706', paddingTop: '16px' }
const footerText = { fontSize: '16px', color: '#78350F', fontStyle: 'italic', textAlign: 'center' as const, margin: '24px 0' }
const footerSmall = { fontSize: '12px', color: '#92400E', textAlign: 'center' as const }
const link = { color: '#D97706', textDecoration: 'underline' }