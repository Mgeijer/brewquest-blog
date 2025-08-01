import {
  Html, Head, Preview, Body, Container, Section, Heading, Text, Button, Img
} from '@react-email/components'

interface WelcomeEmailProps {
  subscriberName?: string
  currentState?: string
  currentWeek?: number
  unsubscribeToken?: string
}

export default function WelcomeEmail({ 
  subscriberName = 'Beer Enthusiast', 
  currentState = 'Alabama', 
  currentWeek = 1,
  unsubscribeToken
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the BrewQuest Journey! 🍺</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <div style={avatarContainer}>
              <div style={avatar}>
                🍺
              </div>
              <Text style={avatarText}>Hop Harrison</Text>
            </div>
          </Section>
          
          <Section style={content}>
            <Heading style={heading}>
              Welcome to BrewQuest, {subscriberName}! 🍺
            </Heading>
            
            <Text style={text}>
              Thanks for joining our epic 50-state craft beer journey! I'm Hop Harrison, 
              and I'm thrilled to have you along as we discover America's best breweries 
              and most interesting beers.
            </Text>
            
            <Text style={text}>
              We're currently exploring <strong>{currentState}</strong> (Week {currentWeek}), 
              featuring 7 incredible breweries and their flagship beers. Each week, 
              you'll get behind-the-scenes stories, tasting notes, and brewery insights 
              that you won't find anywhere else.
            </Text>
            
            <Button style={button} href={`https://www.hopharrison.com/states/${currentState?.toLowerCase()}`}>
              See This Week's Beers 🍻
            </Button>
            
            <Text style={text}>
              <strong>What to expect:</strong>
            </Text>
            <Text style={bulletText}>
              • Weekly state spotlights with 7 featured breweries<br/>
              • Daily beer reviews with tasting notes and stories<br/>
              • Behind-the-scenes brewery insights<br/>
              • Interactive journey tracking across all 50 states
            </Text>
            
            <Text style={footerText}>
              Cheers to great beer and even better stories!<br/>
              Hop Harrison
            </Text>
          </Section>
          
          <Section style={footer}>
            <Text style={footerSmall}>
              You're receiving this because you subscribed to BrewQuest updates at hopharrison.com.
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
const avatarContainer = { textAlign: 'center' as const, margin: '0 auto' }
const avatar = { 
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  border: '3px solid #F59E0B',
  backgroundColor: '#FBBF24',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '32px',
  margin: '0 auto 8px auto'
}
const avatarText = { 
  fontSize: '14px', 
  color: '#78350F', 
  fontWeight: 'bold',
  margin: '0'
}
const content = { padding: '20px 32px' }
const heading = { fontSize: '28px', fontWeight: 'bold', color: '#78350F', textAlign: 'center' as const }
const text = { fontSize: '16px', lineHeight: '24px', color: '#78350F', margin: '16px 0' }
const bulletText = { fontSize: '16px', lineHeight: '24px', color: '#78350F', margin: '8px 0' }
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
  width: '200px'
}
const footer = { marginTop: '32px', borderTop: '1px solid #D97706', paddingTop: '16px' }
const footerText = { fontSize: '16px', color: '#78350F', fontStyle: 'italic', textAlign: 'center' as const }
const footerSmall = { fontSize: '12px', color: '#92400E', textAlign: 'center' as const }
const link = { color: '#D97706', textDecoration: 'underline' }