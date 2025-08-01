import { Container, Heading, Img, Section } from '@react-email/components'

interface EmailHeaderProps {
  title: string
  subtitle?: string
  variant?: 'default' | 'welcome' | 'digest' | 'transition'
}

export default function EmailHeader({ 
  title, 
  subtitle,
  variant = 'default' 
}: EmailHeaderProps) {
  const getHeaderStyle = () => {
    switch (variant) {
      case 'welcome':
        return {
          padding: '32px 24px',
          textAlign: 'center' as const,
          backgroundColor: '#d97706', // beer-amber
          color: '#ffffff',
        }
      case 'digest':
        return {
          padding: '32px 24px',
          textAlign: 'center' as const,
          backgroundColor: '#92400e', // beer-brown
          color: '#ffffff',
        }
      case 'transition':
        return {
          padding: '32px 24px',
          textAlign: 'center' as const,
          backgroundColor: '#1f2937', // beer-dark
          color: '#ffffff',
        }
      default:
        return {
          padding: '32px 24px',
          textAlign: 'center' as const,
          backgroundColor: '#6b7280',
          color: '#ffffff',
        }
    }
  }

  const getTitleStyle = () => ({
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '16px 0',
    padding: '0',
    textAlign: 'center' as const,
  })

  const getSubtitleStyle = () => ({
    color: '#ffffff',
    fontSize: '18px',
    margin: '8px 0 0',
    padding: '0',
    textAlign: 'center' as const,
    opacity: 0.9,
  })

  const logoStyle = {
    margin: '0 auto',
    borderRadius: '12px',
  }

  return (
    <Section style={getHeaderStyle()}>
      <Container>
        <Img
          src={`${process.env.NEXT_PUBLIC_APP_URL}/images/hop-harrison-logo.png`}
          width="60"
          height="60"
          alt="Hop Harrison Logo"
          style={logoStyle}
        />
        <Heading style={getTitleStyle()}>{title}</Heading>
        {subtitle && (
          <Heading style={getSubtitleStyle()}>{subtitle}</Heading>
        )}
      </Container>
    </Section>
  )
}