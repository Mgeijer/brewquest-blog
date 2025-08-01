import { Container, Section, Text, Link } from '@react-email/components'

interface EmailFooterProps {
  unsubscribeToken?: string
  includeResubscribe?: boolean
  variant?: 'default' | 'unsubscribe'
}

export default function EmailFooter({ 
  unsubscribeToken,
  includeResubscribe = false,
  variant = 'default'
}: EmailFooterProps) {
  const footerStyle = {
    padding: '24px',
    textAlign: 'center' as const,
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  }

  const footerTextStyle = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 16px',
  }

  const unsubscribeTextStyle = {
    color: '#9ca3af',
    fontSize: '12px',
    lineHeight: '16px',
    margin: '0',
  }

  const linkStyle = {
    color: '#d97706',
    textDecoration: 'underline',
  }

  const socialLinksStyle = {
    margin: '16px 0',
    textAlign: 'center' as const,
  }

  return (
    <Section style={footerStyle}>
      <Container>
        <Text style={footerTextStyle}>
          Thanks for joining the BrewQuest adventure!<br/>
          🍻 Hop Harrison<br/>
          <em>Your Guide Through America's Craft Beer Renaissance</em>
        </Text>
        
        <div style={socialLinksStyle}>
          <Text style={{...footerTextStyle, fontSize: '12px', margin: '0 0 8px'}}>
            Follow the journey: {' '}
            <Link href="https://instagram.com/hopharrison" style={linkStyle}>Instagram</Link> • {' '}
            <Link href="https://x.com/hop_harrison" style={linkStyle}>Twitter</Link> • {' '}
            <Link href="https://www.facebook.com/profile.php?id=61578376754732" style={linkStyle}>Facebook</Link>
          </Text>
        </div>

        {variant !== 'unsubscribe' && (
          <Text style={unsubscribeTextStyle}>
            You're receiving this email because you subscribed to BrewQuest Chronicles.<br/>
            {unsubscribeToken ? (
              <>
                <Link 
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?token=${unsubscribeToken}`} 
                  style={linkStyle}
                >
                  Unsubscribe
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe`} 
                  style={linkStyle}
                >
                  Unsubscribe
                </Link>
              </>
            )} • {' '}
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/contact`} style={linkStyle}>
              Contact Us
            </Link> • {' '}
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/privacy`} style={linkStyle}>
              Privacy Policy
            </Link>
          </Text>
        )}

        {includeResubscribe && (
          <Text style={unsubscribeTextStyle}>
            Changed your mind? {' '}
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/newsletter`} style={linkStyle}>
              Resubscribe to BrewQuest Chronicles
            </Link>
          </Text>
        )}

        <Text style={{...unsubscribeTextStyle, marginTop: '12px'}}>
          BrewQuest Chronicles • {process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '').replace('http://', '')}
        </Text>
      </Container>
    </Section>
  )
}