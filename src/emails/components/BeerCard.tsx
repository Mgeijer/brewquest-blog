import { Section, Text, Img, Container } from '@react-email/components'

interface BeerReview {
  beer_name: string
  brewery_name: string
  rating: number
  beer_style: string
  abv?: number
  day_of_week?: number
  image_url?: string
  notes?: string
}

interface BeerCardProps {
  beer: BeerReview
  showDay?: boolean
  variant?: 'digest' | 'featured' | 'compact'
}

export default function BeerCard({ 
  beer, 
  showDay = true,
  variant = 'digest' 
}: BeerCardProps) {
  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px 0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  }

  const compactCardStyle = {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '12px',
    margin: '8px 0',
  }

  const featuredCardStyle = {
    backgroundColor: '#fef3c7', // amber-50
    border: '2px solid #d97706', // beer-amber
    borderRadius: '12px',
    padding: '20px',
    margin: '16px 0',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  }

  const getCardStyle = () => {
    switch (variant) {
      case 'featured':
        return featuredCardStyle
      case 'compact':
        return compactCardStyle
      default:
        return cardStyle
    }
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  }

  const beerNameStyle = {
    fontSize: variant === 'compact' ? '16px' : '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 4px',
  }

  const breweryStyle = {
    fontSize: variant === 'compact' ? '14px' : '16px',
    color: '#6b7280',
    margin: '0 0 8px',
  }

  const ratingStyle = {
    fontSize: variant === 'compact' ? '16px' : '18px',
    fontWeight: 'bold',
    color: '#d97706', // beer-amber
    textAlign: 'right' as const,
  }

  const detailsStyle = {
    fontSize: '14px',
    color: '#6b7280',
    margin: '8px 0',
  }

  const dayStyle = {
    fontSize: '12px',
    color: '#9ca3af',
    backgroundColor: '#f3f4f6',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block',
    marginBottom: '8px',
  }

  const imageStyle = {
    width: variant === 'compact' ? '60px' : '80px',
    height: variant === 'compact' ? '60px' : '80px',
    borderRadius: '6px',
    objectFit: 'cover' as const,
    marginRight: '12px',
    float: 'left' as const,
  }

  const notesStyle = {
    fontSize: '14px',
    color: '#4b5563',
    fontStyle: 'italic',
    margin: '8px 0 0',
  }

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    let stars = '★'.repeat(fullStars)
    if (hasHalfStar) stars += '☆'
    return stars + ' '.repeat(Math.max(0, 5 - Math.ceil(rating)))
  }

  const getDayName = (dayNumber?: number) => {
    if (!dayNumber) return ''
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayNumber - 1] || ''
  }

  return (
    <Section style={getCardStyle()}>
      <Container>
        {showDay && beer.day_of_week && (
          <Text style={dayStyle}>
            {getDayName(beer.day_of_week)}
          </Text>
        )}
        
        <div style={{overflow: 'hidden'}}>
          {beer.image_url && variant !== 'compact' && (
            <Img
              src={beer.image_url}
              alt={`${beer.beer_name} from ${beer.brewery_name}`}
              style={imageStyle}
            />
          )}
          
          <div style={headerStyle}>
            <div style={{flex: 1}}>
              <Text style={beerNameStyle}>{beer.beer_name}</Text>
              <Text style={breweryStyle}>{beer.brewery_name}</Text>
            </div>
            <div>
              <Text style={ratingStyle}>
                {beer.rating.toFixed(1)}/5<br/>
                <span style={{fontSize: '14px', color: '#d97706'}}>
                  {getRatingStars(beer.rating)}
                </span>
              </Text>
            </div>
          </div>

          <Text style={detailsStyle}>
            <strong>Style:</strong> {beer.beer_style}
            {beer.abv && (
              <> • <strong>ABV:</strong> {beer.abv}%</>
            )}
          </Text>

          {beer.notes && variant !== 'compact' && (
            <Text style={notesStyle}>
              "{beer.notes}"
            </Text>
          )}
        </div>
      </Container>
    </Section>
  )
}