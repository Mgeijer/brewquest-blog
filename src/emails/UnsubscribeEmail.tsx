import {
  Html, Head, Preview, Body, Container, Section, Heading, Text, Button, Img
} from '@react-email/components'

interface UnsubscribeEmailProps {
  subscriberName?: string
}

export default function UnsubscribeEmail({
  subscriberName = 'Beer Enthusiast'
}: UnsubscribeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sorry to see you go from BrewQuest Chronicles</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://www.hopharrison.com/images/hop-harrison-logo.png"
              width="120"
              height="40"
              alt="Hop Harrison"
              style={logo}
            />
          </Section>
          
          <Section style={content}>
            <Heading style={heading}>
              Until We Meet Again, {subscriberName}
            </Heading>
            
            <Text style={text}>
              You've successfully unsubscribed from BrewQuest Chronicles. 
              I'm sorry to see you go, but I understand that not every beer 
              journey is for everyone.
            </Text>

            <Text style={text}>
              If you change your mind, you're always welcome back at the bar. 
              Our 50-state adventure continues, and there are always new 
              discoveries waiting to be shared.
            </Text>

            {/* Stay Connected */}
            <Section style={highlightBox}>
              <Text style={highlightTitle}>Stay Connected</Text>
              <Text style={highlightText}>
                Even without email updates, you can still follow our journey:<br/><br/>
                🌐 Visit BrewQuest Chronicles online<br/>
                📱 Follow us on Instagram, Twitter, and Facebook<br/>
                🗺️ Track our progress on the interactive map
              </Text>
            </Section>

            {/* Feedback Section */}
            <Text style={text}>
              Your feedback matters! If you have a moment, let us know why 
              you unsubscribed so we can improve the BrewQuest experience 
              for other beer enthusiasts.
            </Text>
            
            <Button style={button} href="https://www.hopharrison.com/feedback">
              Share Feedback
            </Button>

            {/* Resubscribe Option */}
            <Text style={text}>
              Changed your mind? You can resubscribe anytime:
            </Text>
            
            <Button style={secondaryButton} href="https://www.hopharrison.com/newsletter">
              Resubscribe to BrewQuest
            </Button>

            <Text style={footerText}>
              Thanks for being part of our journey, even if just for a while.<br/>
              🍻 Hop Harrison<br/>
              <em>Your (Former) Guide Through America's Craft Beer Renaissance</em>
            </Text>
          </Section>
          
          <Section style={footer}>
            <Text style={footerSmall}>
              This is a confirmation that you've unsubscribed from BrewQuest Chronicles emails.<br/>
              <a href="https://www.hopharrison.com/contact" style={link}>Contact Us</a> if you have any questions.
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
const header = { padding: '20px 0' }
const logo = { margin: '0 auto' }
const content = { padding: '20px 32px' }
const heading = { fontSize: '28px', fontWeight: 'bold', color: '#78350F', textAlign: 'center' as const }
const text = { fontSize: '16px', lineHeight: '24px', color: '#78350F', margin: '16px 0' }

const highlightBox = {
  backgroundColor: '#92400E',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
  textAlign: 'center' as const
}
const highlightTitle = { fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 12px' }
const highlightText = { fontSize: '16px', color: '#ffffff', margin: '0' }

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
  width: '220px'
}

const footer = { marginTop: '32px', borderTop: '1px solid #D97706', paddingTop: '16px' }
const footerText = { fontSize: '16px', color: '#78350F', fontStyle: 'italic', textAlign: 'center' as const, margin: '24px 0' }
const footerSmall = { fontSize: '12px', color: '#92400E', textAlign: 'center' as const }
const link = { color: '#D97706', textDecoration: 'underline' }