import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const emailConfig = {
  from: {
    email: process.env.RESEND_FROM_EMAIL || 'hop@hopharrison.com',
    name: process.env.RESEND_FROM_NAME || 'Hop Harrison - BrewQuest Chronicles'
  },
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'BrewQuest Chronicles',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  supportEmail: 'hop@hopharrison.com',
  replyTo: 'hop@hopharrison.com'
}

// Email sending utility with error handling
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}) {
  try {
    const result = await resend.emails.send({
      from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      replyTo: replyTo || emailConfig.replyTo
    })

    console.log('Email sent successfully:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error: error.message }
  }
}

// Batch email sending for newsletters
export async function sendBatchEmail({
  emails,
  subject,
  html,
  text
}: {
  emails: { email: string; name?: string }[]
  subject: string
  html: string
  text?: string
}) {
  const results = []
  
  // Send in batches of 50 to avoid rate limits
  const batchSize = 50
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize)
    
    try {
      const batchResults = await Promise.all(
        batch.map(async ({ email, name }) => {
          // Personalize HTML if name is provided
          const personalizedHtml = name 
            ? html.replace(/{{subscriber_name}}/g, name)
            : html.replace(/{{subscriber_name}}/g, 'Beer Enthusiast')
          
          const personalizedText = text && name
            ? text.replace(/{{subscriber_name}}/g, name)
            : text?.replace(/{{subscriber_name}}/g, 'Beer Enthusiast')

          return sendEmail({
            to: email,
            subject,
            html: personalizedHtml,
            text: personalizedText
          })
        })
      )
      
      results.push(...batchResults)
      
      // Small delay between batches to be respectful
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error(`Failed to send batch ${i / batchSize + 1}:`, error)
      results.push({ success: false, error: error.message })
    }
  }
  
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  
  return {
    success: failed === 0,
    results,
    stats: {
      total: emails.length,
      successful,
      failed
    }
  }
}