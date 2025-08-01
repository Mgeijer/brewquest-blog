import {
  Html, Head, Preview, Body, Container, Section, Heading, Text, Button, Img
} from '@react-email/components'

interface StateTransitionEmailProps {
  subscriberName?: string
  completedState: string
  completedStateCode: string
  completedWeek: number
  newState: string
  newStateCode: string
  newWeek: number
  topBeers?: Array<{
    beer_name: string
    brewery_name: string
    rating: number
  }>
  breweryCount?: number
  unsubscribeToken?: string
}

export default function StateTransitionEmail({
  subscriberName = 'Beer Enthusiast',
  completedState,
  completedStateCode,
  completedWeek,
  newState,
  newStateCode,
  newWeek,
  topBeers = [],
  breweryCount = 0,
  unsubscribeToken
}: StateTransitionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        🎉 {completedState} Complete! Next Stop: {newState} - BrewQuest Chronicles
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <EmailHeader 
            title={`🎉 ${completedState} Complete!`}
            subtitle={`Next Adventure: ${newState}`}
            variant="transition"
          />

          {/* Celebration Section */}
          <Section style={section}>
            <Text style={greeting}>Hey {subscriberName}! 🍻</Text>
            
            <Text style={text}>
              What an incredible week exploring {completedState}! Week {completedWeek} is now 
              officially in the books, and I'm amazed by the craft beer scene we discovered together.
            </Text>

            <div style={statsBox}>
              <div style={statItem}>
                <div style={statNumber}>{breweryCount}</div>
                <div style={statLabel}>Breweries Visited</div>
              </div>
              <div style={statItem}>
                <div style={statNumber}>{topBeers.length}</div>
                <div style={statLabel}>Beers Reviewed</div>
              </div>
              <div style={statItem}>
                <div style={statNumber}>7</div>
                <div style={statLabel}>Days of Adventure</div>
              </div>
            </div>
          </Section>

          {/* Top Beers Recap */}
          {topBeers.length > 0 && (
            <Section style={highlightSection}>
              <Text style={h2}>🌟 {completedState}'s Top Beers</Text>
              <Text style={text}>
                Here are the standout brews from our {completedState} adventure:
              </Text>
              
              {topBeers.slice(0, 3).map((beer, index) => (
                <div key={index} style={beerHighlight}>
                  <div style={beerRank}>#{index + 1}</div>
                  <div>
                    <Text style={beerName}>{beer.beer_name}</Text>
                    <Text style={breweryName}>{beer.brewery_name}</Text>
                    <div style={rating}>
                      {'★'.repeat(Math.floor(beer.rating))} {beer.rating.toFixed(1)}/5
                    </div>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* New State Preview */}
          <Section style={newStateSection}>
            <Text style={h2}>🗺️ Next Stop: {newState}!</Text>
            <Text style={text}>
              Week {newWeek} begins now as we set our sights on {newState}'s craft beer landscape. 
              I've been researching the breweries, talking to local beer enthusiasts, and planning 
              an amazing week of discoveries.
            </Text>

            <Text style={text}>
              <strong>What to expect from {newState}:</strong>
            </Text>
            <ul style={listStyle}>
              <li style={listItem}>Daily brewery visits and beer tastings</li>
              <li style={listItem}>In-depth conversations with local brewers</li>
              <li style={listItem}>Exploration of {newState}'s unique beer culture</li>
              <li style={listItem}>Hidden gems and local favorites</li>
              <li style={listItem}>Weekly recap with all the highlights</li>
            </ul>

            <div style={buttonSection}>
              <Button
                style={button}
                href={`${process.env.NEXT_PUBLIC_APP_URL}/states/${newStateCode.toLowerCase()}`}
              >
                Follow {newState}'s Journey
              </Button>
            </div>
          </Section>

          {/* Community Engagement */}
          <Section style={section}>
            <Text style={h2}>🤝 Join the Conversation</Text>
            <Text style={text}>
              Have recommendations for {newState}? Know a brewery I should visit? 
              I love hearing from fellow beer enthusiasts who know their local scenes!
            </Text>
            
            <div style={buttonSection}>
              <Button
                style={secondaryButton}
                href={`${process.env.NEXT_PUBLIC_APP_URL}/contact`}
              >
                Share Your {newState} Recommendations
              </Button>
            </div>
          </Section>

          {/* Journey Progress */}
          <Section style={progressSection}>
            <Text style={h2}>📊 BrewQuest Progress</Text>
            <div style={progressBar}>
              <div style={{...progressFill, width: `${(newWeek / 50) * 100}%`}}></div>
            </div>
            <Text style={progressText}>
              State {newWeek} of 50 • {Math.round((newWeek / 50) * 100)}% Complete
            </Text>
            <Text style={text}>
              Every week brings us closer to completing this epic 50-state journey. 
              Thanks for being part of this incredible adventure!
            </Text>
          </Section>

          <EmailFooter 
            unsubscribeToken={unsubscribeToken}
            variant="default"
          />
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const section = {
  padding: '24px',
}

const highlightSection = {
  padding: '24px',
  backgroundColor: '#fef3c7', // amber-50
  margin: '0 24px',
  borderRadius: '8px',
  marginBottom: '24px',
  border: '1px solid #d97706',
}

const newStateSection = {
  padding: '24px',
  backgroundColor: '#f0f9ff', // blue-50
  margin: '0 24px',
  borderRadius: '8px',
  marginBottom: '24px',
  border: '1px solid #0ea5e9',
}

const progressSection = {
  padding: '24px',
  backgroundColor: '#f3f4f6',
  margin: '0 24px',
  borderRadius: '8px',
  marginBottom: '24px',
}

const greeting = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const h2 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px',
  padding: '0',
}

const statsBox = {
  display: 'flex',
  justifyContent: 'space-around',
  backgroundColor: '#1f2937',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
}

const statItem = {
  textAlign: 'center' as const,
  color: '#ffffff',
}

const statNumber = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#d97706',
}

const statLabel = {
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  marginTop: '4px',
}

const beerHighlight = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 0',
  borderBottom: '1px solid #f3f4f6',
}

const beerRank = {
  backgroundColor: '#d97706',
  color: '#ffffff',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
  flexShrink: 0,
}

const beerName = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 4px',
}

const breweryName = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0 0 4px',
}

const rating = {
  fontSize: '14px',
  color: '#d97706',
  fontWeight: 'bold',
}

const listStyle = {
  paddingLeft: '20px',
  margin: '16px 0',
}

const listItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
}

const buttonSection = {
  padding: '24px 0',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#d97706',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '8px',
}

const secondaryButton = {
  backgroundColor: '#374151',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '8px',
}

const progressBar = {
  width: '100%',
  height: '8px',
  backgroundColor: '#e5e7eb',
  borderRadius: '4px',
  overflow: 'hidden',
  margin: '16px 0',
}

const progressFill = {
  height: '100%',
  backgroundColor: '#d97706',
  borderRadius: '4px',
  transition: 'width 0.3s ease',
}

const progressText = {
  textAlign: 'center' as const,
  fontSize: '14px',
  color: '#6b7280',
  margin: '8px 0 16px',
}