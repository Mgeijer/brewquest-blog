import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import WelcomeEmail from '@/emails/WelcomeEmail'
import WeeklyDigestEmail from '@/emails/WeeklyDigestEmail'
import StateTransitionEmail from '@/emails/StateTransitionEmail'
import UnsubscribeEmail from '@/emails/UnsubscribeEmail'
import crypto from 'crypto'

// Initialize Resend only when needed to avoid build-time errors
let resend: Resend | null = null

const getResendClient = () => {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set in environment variables')
    }
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

export interface EmailSubscriber {
  id: string
  email: string
  first_name?: string
  subscribed_at: string
  is_active: boolean
  preferences?: {
    weekly_digest?: boolean
    state_updates?: boolean
    special_announcements?: boolean
    unsubscribe_token?: string
  }
}

export interface WeeklyDigestData {
  weekNumber: number
  stateName: string
  stateCode: string
  beerReviews: Array<{
    beer_name: string
    brewery_name: string
    rating: number
    beer_style: string
    abv: number
    day_of_week: number
    image_url?: string
  }>
  breweryCount: number
  nextStateName?: string
}

export class ResendEmailService {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  async addSubscriber(email: string, firstName?: string, source = 'service'): Promise<EmailSubscriber> {
    // Generate unsubscribe token
    const unsubscribeToken = crypto.randomBytes(32).toString('hex')

    try {
      // Check if subscriber already exists
      const { data: existingSubscriber, error: selectError } = await this.supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email.toLowerCase())
        .single()

      // If table doesn't exist, we'll get an error here
      if (selectError && selectError.code === 'PGRST301') {
        throw new Error('Newsletter subscribers table does not exist. Please create it in Supabase dashboard first.')
      }

      if (existingSubscriber) {
        if (existingSubscriber.is_active) {
          return existingSubscriber // Already subscribed
        }
        
        // Reactivate existing subscriber - only update columns that exist
        const { data, error } = await this.supabase
          .from('newsletter_subscribers')
          .update({
            is_active: true,
            subscribed_at: new Date().toISOString(),
            first_name: firstName || existingSubscriber.first_name,
            preferences: {
              weekly_digest: true,
              state_updates: true,
              special_announcements: true,
              unsubscribe_token: unsubscribeToken
            }
          })
          .eq('email', email.toLowerCase())
          .select()
          .single()

        if (error) throw error
        return data
      }

      // Create new subscriber - only insert columns that exist
      const { data, error } = await this.supabase
        .from('newsletter_subscribers')
        .insert([{
          email: email.toLowerCase(),
          first_name: firstName,
          subscribed_at: new Date().toISOString(),
          is_active: true,
          preferences: {
            weekly_digest: true,
            state_updates: true,
            special_announcements: true,
            unsubscribe_token: unsubscribeToken
          }
        }])
        .select()
        .single()

      if (error) {
        console.error('Insert error:', error)
        throw new Error(`Failed to create subscriber: ${error.message}`)
      }
      return data

    } catch (error) {
      console.error('addSubscriber error:', error)
      throw error
    }
  }

  async sendWelcomeEmail(subscriber: EmailSubscriber): Promise<void> {
    const currentState = await this.getCurrentState()
    const currentWeek = await this.getCurrentWeek()
    
    // Handle null/undefined firstName gracefully
    const subscriberName = subscriber.first_name && subscriber.first_name.trim() 
      ? subscriber.first_name.trim() 
      : 'Beer Enthusiast'
    
    const result = await getResendClient().emails.send({
      from: 'Hop Harrison - BrewQuest Chronicles <hop@hopharrison.com>',
      to: subscriber.email,
      subject: `Welcome to BrewQuest Chronicles - Week ${currentWeek}: ${currentState}!`,
      react: WelcomeEmail({ 
        subscriberName,
        currentState,
        currentWeek,
        unsubscribeToken: subscriber.preferences?.unsubscribe_token
      })
    })

    console.log('Welcome email sent:', result)
  }

  async sendWeeklyDigest(): Promise<{ successful: number; failed: number; total: number }> {
    const subscribers = await this.getActiveSubscribers()
    const weeklyData = await this.getWeeklyDigestData()
    
    let successful = 0
    let failed = 0
    const batchSize = 50

    // Process subscribers in batches
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      
      const batchPromises = batch
        .filter(subscriber => subscriber.preferences?.weekly_digest !== false)
        .map(async (subscriber) => {
          try {
            await getResendClient().emails.send({
              from: 'Hop Harrison - BrewQuest Chronicles <hop@hopharrison.com>',
              to: subscriber.email,
              subject: `Week ${weeklyData.weekNumber} Complete: ${weeklyData.stateName} Craft Beer Journey`,
              react: WeeklyDigestEmail({
                subscriberName: subscriber.first_name && subscriber.first_name.trim() 
                  ? subscriber.first_name.trim() 
                  : 'Beer Enthusiast',
                weekNumber: weeklyData.weekNumber,
                stateName: weeklyData.stateName,
                stateCode: weeklyData.stateCode,
                beerReviews: weeklyData.beerReviews,
                breweryCount: weeklyData.breweryCount,
                nextStateName: weeklyData.nextStateName,
                unsubscribeToken: subscriber.preferences?.unsubscribe_token
              })
            })
            successful++
          } catch (error) {
            console.error(`Failed to send weekly digest to ${subscriber.email}:`, error)
            failed++
          }
        })

      await Promise.all(batchPromises)
      
      // Small delay between batches to avoid rate limits
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    // Log campaign analytics
    await this.logCampaign({
      campaign_type: 'weekly_digest',
      subject: `Week ${weeklyData.weekNumber} Complete: ${weeklyData.stateName} Craft Beer Journey`,
      recipient_count: subscribers.length,
      success_count: successful,
      failure_count: failed,
      state_code: weeklyData.stateCode,
      week_number: weeklyData.weekNumber,
      metadata: {
        beer_count: weeklyData.beerReviews.length,
        brewery_count: weeklyData.breweryCount,
        next_state: weeklyData.nextStateName
      }
    })

    return { successful, failed, total: subscribers.length }
  }

  async sendStateTransitionEmail(completedState: string, newState: string): Promise<{ successful: number; failed: number; total: number }> {
    const subscribers = await this.getActiveSubscribers()
    const completedStateData = await this.getStateData(completedState)
    const newStateData = await this.getStateData(newState)
    const topBeers = await this.getTopBeers(completedStateData.stateCode, 3)
    
    let successful = 0
    let failed = 0
    const batchSize = 50

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      
      const batchPromises = batch
        .filter(subscriber => subscriber.preferences?.state_updates !== false)
        .map(async (subscriber) => {
          try {
            await getResendClient().emails.send({
              from: 'Hop Harrison - BrewQuest Chronicles <hop@hopharrison.com>',
              to: subscriber.email,
              subject: `🎉 ${completedState} Complete! Next Stop: ${newState} - BrewQuest Chronicles`,
              react: StateTransitionEmail({
                subscriberName: subscriber.first_name && subscriber.first_name.trim() 
                  ? subscriber.first_name.trim() 
                  : 'Beer Enthusiast',
                completedState: completedStateData.stateName,
                completedStateCode: completedStateData.stateCode,
                completedWeek: completedStateData.weekNumber,
                newState: newStateData.stateName,
                newStateCode: newStateData.stateCode,
                newWeek: newStateData.weekNumber,
                topBeers,
                breweryCount: await this.getBreweryCount(completedStateData.stateCode),
                unsubscribeToken: subscriber.preferences?.unsubscribe_token
              })
            })
            successful++
          } catch (error) {
            console.error(`Failed to send state transition email to ${subscriber.email}:`, error)
            failed++
          }
        })

      await Promise.all(batchPromises)
      
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    return { successful, failed, total: subscribers.length }
  }

  async sendUnsubscribeConfirmation(subscriber: EmailSubscriber): Promise<void> {
    const subscriberName = subscriber.first_name && subscriber.first_name.trim() 
      ? subscriber.first_name.trim() 
      : 'Beer Enthusiast'
      
    await getResendClient().emails.send({
      from: 'Hop Harrison - BrewQuest Chronicles <hop@hopharrison.com>',
      to: subscriber.email,
      subject: 'Unsubscribed from BrewQuest Chronicles',
      react: UnsubscribeEmail({
        subscriberName
      })
    })
  }

  // Helper methods
  private async getCurrentState(): Promise<string> {
    const { data } = await this.supabase
      .from('state_progress')
      .select('state_name')
      .eq('status', 'current')
      .single()
    return data?.state_name || 'Alabama'
  }

  private async getCurrentWeek(): Promise<number> {
    const { data } = await this.supabase
      .from('state_progress')
      .select('week_number')
      .eq('status', 'current')
      .single()
    return data?.week_number || 1
  }

  private async getStateData(stateName: string) {
    const { data } = await this.supabase
      .from('state_progress')
      .select('*')
      .eq('state_name', stateName)
      .single()
    
    return {
      stateName: data?.state_name || stateName,
      stateCode: data?.state_code || 'AL',
      weekNumber: data?.week_number || 1
    }
  }

  private async getActiveSubscribers(): Promise<EmailSubscriber[]> {
    const { data } = await this.supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('is_active', true)
    return data || []
  }

  private async getWeeklyDigestData(): Promise<WeeklyDigestData> {
    // Get current state information
    const { data: currentStateData } = await this.supabase
      .from('state_progress')
      .select('state_code, state_name, week_number')
      .eq('status', 'current')
      .single()

    // Get beer reviews for the current state
    const { data: beerReviews } = await this.supabase
      .from('beer_reviews')
      .select('beer_name, brewery_name, rating, beer_style, abv, day_of_week, image_url')
      .eq('state_code', currentStateData?.state_code || 'AL')
      .order('day_of_week', { ascending: true })

    // Get next state for preview
    const { data: nextStateData } = await this.supabase
      .from('state_progress')
      .select('state_name')
      .eq('week_number', (currentStateData?.week_number || 1) + 1)
      .single()

    return {
      weekNumber: currentStateData?.week_number || 1,
      stateName: currentStateData?.state_name || 'Alabama',
      stateCode: currentStateData?.state_code || 'AL',
      beerReviews: beerReviews || [],
      breweryCount: [...new Set(beerReviews?.map(b => b.brewery_name) || [])].length,
      nextStateName: nextStateData?.state_name
    }
  }

  private async getTopBeers(stateCode: string, limit = 3) {
    const { data } = await this.supabase
      .from('beer_reviews')
      .select('beer_name, brewery_name, rating')
      .eq('state_code', stateCode)
      .order('rating', { ascending: false })
      .limit(limit)

    return data || []
  }

  private async getBreweryCount(stateCode: string): Promise<number> {
    const { data } = await this.supabase
      .from('beer_reviews')
      .select('brewery_name')
      .eq('state_code', stateCode)

    return [...new Set(data?.map(b => b.brewery_name) || [])].length
  }

  private async logCampaign(campaignData: any) {
    try {
      await this.supabase
        .from('newsletter_campaigns')
        .insert({
          ...campaignData,
          sent_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Failed to log campaign:', error)
    }
  }
}

// Export singleton instance for convenience
export const emailService = new ResendEmailService()