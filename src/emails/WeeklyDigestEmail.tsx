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
  const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayNumber - 1] || 'Monday'
  }

  const getStarRating = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating))
  }

  const averageRating = beerReviews.length > 0 
    ? (beerReviews.reduce((sum, beer) => sum + beer.rating, 0) / beerReviews.length).toFixed(1)
    : '0.0'

  const topBeer = beerReviews.length > 0
    ? beerReviews.reduce((prev, current) => (prev.rating > current.rating) ? prev : current)
    : null

  return (
    <Html>
      <Head />
      <Preview>Week {weekNumber}: {stateName} Craft Beer Journey Complete!</Preview>
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
              Week {weekNumber} Complete: {stateName} 🍺
            </Heading>
            
            <Text style={text}>
              Hey {subscriberName}! What an incredible week exploring {stateName}'s craft beer scene! 
              We've discovered {breweryCount} amazing breweries and tasted some truly exceptional beers. 
              Here's your complete recap of our {stateName} adventure.
            </Text>

            {/* State Overview */}
            <Section style={statsBox}>
              <Text style={statsTitle}>🗺️ {stateName} at a Glance</Text>
              <Text style={statsText}>
                <strong>Week {weekNumber} of 50</strong><br/>
                📍 {breweryCount} Featured Breweries<br/>
                🍺 {beerReviews.length} Beer Reviews<br/>
                ⭐ Average Rating: {averageRating}/5
              </Text>
            </Section>

            {/* Top Beer Highlight */}
            {topBeer && (
              <Section style={highlightBox}>
                <Text style={highlightTitle}>🏆 Week's Top Beer</Text>
                <Text style={highlightText}>
                  <strong>{topBeer.beer_name}</strong><br/>
                  {topBeer.brewery_name}<br/>
                  {getStarRating(topBeer.rating)} {topBeer.rating}/5 • {topBeer.beer_style}
                </Text>
              </Section>
            )}
            
            <Heading style={subHeading}>🍻 This Week's Beer Reviews</Heading>
            
            {beerReviews.map((beer, index) => (
              <Section key={index} style={beerCard}>
                <Text style={beerDay}>{getDayName(beer.day_of_week)}</Text>
                <Text style={beerName}>{beer.beer_name}</Text>
                <Text style={breweryName}>{beer.brewery_name}</Text>
                <Text style={beerDetails}>
                  {getStarRating(beer.rating)} {beer.rating}/5 • {beer.beer_style} • {beer.abv}% ABV
                </Text>
              </Section>
            ))}

            <Button style={button} href={`https://www.hopharrison.com/states/${stateCode.toLowerCase()}`}>
              Read Full {stateName} Reviews 📖
            </Button>

            {/* Next Week Preview */}
            {nextStateName && (
              <Section style={nextWeekBox}>
                <Text style={nextWeekTitle}>🗺️ Next Week: {nextStateName}!</Text>
                <Text style={text}>
                  Week {weekNumber + 1} begins now as we set our sights on {nextStateName}'s craft beer landscape. 
                  I've been researching the breweries and can't wait to share what we discover together!
                </Text>
              </Section>
            )}

            {/* Interactive Map */}
            <Text style={text}>
              Track our progress on the interactive journey map:
            </Text>
            
            <Button style={secondaryButton} href="https://www.hopharrison.com/blog#interactive-map">
              View Journey Map 🗺️
            </Button>

            <Text style={footerText}>
              Thanks for joining me on this incredible beer journey!<br/>
              Progress: {weekNumber}/50 states • {((weekNumber/50) * 100).toFixed(1)}% complete<br/>
              🍻 Hop Harrison
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
const header = { padding: '20px 0' }
const logo = { margin: '0 auto' }
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

const nextWeekBox = {
  backgroundColor: '#92400E',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
  textAlign: 'center' as const
}
const nextWeekTitle = { fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 12px' }

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