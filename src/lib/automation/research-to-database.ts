/**
 * Research to Database Automation
 * Automatically converts research data into Supabase database entries
 */

import { createClient } from '@/lib/supabase/server'

interface BeerResearchData {
  brewery_name: string
  beer_name: string
  beer_style: string
  abv: number
  ibu?: number
  rating?: number
  tasting_notes: string
  description: string
  brewery_story: string
  unique_feature: string
  day_of_week: number
  state_code: string
  state_name: string
  week_number: number
  image_url: string
}

interface BreweryResearchData {
  state_code: string
  brewery_name: string
  brewery_type: string
  city: string
  address?: string
  website_url?: string
  founded_year: number
  specialty_styles: string[]
  signature_beers: string[]
  brewery_description: string
  why_featured: string
  visit_priority: number
  social_media?: Record<string, string>
  awards?: string[]
  is_active: boolean
  featured_week: number
}

interface StateResearchData {
  state_code: string
  state_name: string
  week_number: number
  beers: BeerResearchData[]
  breweries: BreweryResearchData[]
  featured_breweries: string[]
  journey_highlights: string[]
  difficulty_rating: number
  current_status: 'research' | 'active' | 'completed'
}

export class ResearchToDatabaseAutomation {
  private supabase = createClient()

  /**
   * Populate database from research data
   */
  async populateFromResearch(stateData: StateResearchData): Promise<{
    success: boolean
    message: string
    populated: {
      beers: number
      breweries: number
      errors: string[]
    }
  }> {
    const errors: string[] = []
    let beersInserted = 0
    let breweriesInserted = 0

    try {
      // Validate research data
      const validation = this.validateResearchData(stateData)
      if (!validation.valid) {
        return {
          success: false,
          message: 'Research data validation failed',
          populated: { beers: 0, breweries: 0, errors: validation.errors }
        }
      }

      // Insert beer reviews with brewery stories
      for (const beer of stateData.beers) {
        const { error: beerError } = await this.supabase
          .from('beer_reviews')
          .upsert({
            brewery_name: beer.brewery_name,
            beer_name: beer.beer_name,
            beer_style: beer.beer_style,
            abv: beer.abv,
            ibu: beer.ibu || null,
            rating: beer.rating || 4.0,
            tasting_notes: beer.tasting_notes,
            description: beer.description,
            brewery_story: beer.brewery_story,
            unique_feature: beer.unique_feature,
            day_of_week: beer.day_of_week,
            state_code: beer.state_code,
            state_name: beer.state_name,
            week_number: beer.week_number,
            image_url: beer.image_url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'brewery_name,beer_name,state_code',
            ignoreDuplicates: false
          })

        if (beerError) {
          errors.push(`Beer ${beer.beer_name}: ${beerError.message}`)
        } else {
          beersInserted++
        }
      }

      // Insert brewery features
      for (const brewery of stateData.breweries) {
        const { error: breweryError } = await this.supabase
          .from('brewery_features')
          .upsert({
            state_code: brewery.state_code,
            brewery_name: brewery.brewery_name,
            brewery_type: brewery.brewery_type,
            city: brewery.city,
            address: brewery.address || null,
            website_url: brewery.website_url || null,
            founded_year: brewery.founded_year,
            specialty_styles: brewery.specialty_styles,
            signature_beers: brewery.signature_beers,
            brewery_description: brewery.brewery_description,
            why_featured: brewery.why_featured,
            visit_priority: brewery.visit_priority,
            social_media: brewery.social_media || null,
            awards: brewery.awards || null,
            is_active: brewery.is_active,
            featured_week: brewery.featured_week,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'state_code,brewery_name',
            ignoreDuplicates: false
          })

        if (breweryError) {
          errors.push(`Brewery ${brewery.brewery_name}: ${breweryError.message}`)
        } else {
          breweriesInserted++
        }
      }

      // Update state progress
      const { error: stateError } = await this.supabase
        .from('state_progress')
        .upsert({
          state_code: stateData.state_code,
          state_name: stateData.state_name,
          week_number: stateData.week_number,
          featured_breweries: stateData.featured_breweries,
          featured_beers_count: stateData.beers.length,
          journey_highlights: stateData.journey_highlights,
          difficulty_rating: stateData.difficulty_rating,
          current_status: stateData.current_status,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'state_code',
          ignoreDuplicates: false
        })

      if (stateError) {
        errors.push(`State progress: ${stateError.message}`)
      }

      return {
        success: errors.length === 0,
        message: errors.length === 0 
          ? `Successfully populated ${stateData.state_name} with ${beersInserted} beers and ${breweriesInserted} breweries`
          : `Partially populated ${stateData.state_name} with some errors`,
        populated: {
          beers: beersInserted,
          breweries: breweriesInserted,
          errors
        }
      }

    } catch (error) {
      return {
        success: false,
        message: `Failed to populate ${stateData.state_name}: ${error.message}`,
        populated: { beers: beersInserted, breweries: breweriesInserted, errors: [error.message] }
      }
    }
  }

  /**
   * Validate research data before database insertion
   */
  private validateResearchData(stateData: StateResearchData): {
    valid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    // Check basic state data
    if (!stateData.state_code || stateData.state_code.length !== 2) {
      errors.push('Invalid state code')
    }

    if (!stateData.beers || stateData.beers.length !== 7) {
      errors.push('Must have exactly 7 beers')
    }

    if (!stateData.breweries || stateData.breweries.length !== 7) {
      errors.push('Must have exactly 7 breweries')
    }

    // Check brewery uniqueness
    const breweryNames = stateData.beers?.map(b => b.brewery_name) || []
    const uniqueBreweries = new Set(breweryNames)
    if (uniqueBreweries.size !== 7) {
      errors.push('All 7 beers must be from different breweries')
    }

    // Validate each beer
    stateData.beers?.forEach((beer, index) => {
      if (!beer.brewery_name) errors.push(`Beer ${index + 1}: Missing brewery name`)
      if (!beer.beer_name) errors.push(`Beer ${index + 1}: Missing beer name`)
      if (!beer.brewery_story || beer.brewery_story.length < 100) {
        errors.push(`Beer ${index + 1}: Brewery story too short (minimum 100 characters)`)
      }
      if (!beer.unique_feature) errors.push(`Beer ${index + 1}: Missing unique feature`)
      if (beer.abv <= 0 || beer.abv > 20) errors.push(`Beer ${index + 1}: Invalid ABV`)
    })

    // Validate each brewery
    stateData.breweries?.forEach((brewery, index) => {
      if (!brewery.brewery_name) errors.push(`Brewery ${index + 1}: Missing name`)
      if (!brewery.city) errors.push(`Brewery ${index + 1}: Missing city`)
      if (!brewery.founded_year || brewery.founded_year < 1800) {
        errors.push(`Brewery ${index + 1}: Invalid founded year`)
      }
      if (!brewery.brewery_description || brewery.brewery_description.length < 50) {
        errors.push(`Brewery ${index + 1}: Description too short`)
      }
    })

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Generate state research data from existing patterns
   */
  generateStateResearchTemplate(
    stateCode: string, 
    stateName: string, 
    weekNumber: number
  ): StateResearchData {
    return {
      state_code: stateCode,
      state_name: stateName,
      week_number: weekNumber,
      beers: Array.from({ length: 7 }, (_, i) => ({
        brewery_name: `[Brewery ${i + 1} Name]`,
        beer_name: `[Beer ${i + 1} Name]`,
        beer_style: '[Beer Style]',
        abv: 5.0,
        ibu: 30,
        rating: 4.0,
        tasting_notes: '[Detailed tasting notes with appearance, aroma, taste, and mouthfeel]',
        description: '[2-3 sentence beer description highlighting unique characteristics]',
        brewery_story: '[Comprehensive brewery story including founding, philosophy, and what makes them unique]',
        unique_feature: '[What makes this brewery distinctive in the state]',
        day_of_week: i + 1,
        state_code: stateCode,
        state_name: stateName,
        week_number: weekNumber,
        image_url: `/images/Beer images/${stateName}/[Beer Name].png`
      })),
      breweries: Array.from({ length: 7 }, (_, i) => ({
        state_code: stateCode,
        brewery_name: `[Brewery ${i + 1} Name]`,
        brewery_type: 'microbrewery',
        city: '[City]',
        address: '[Address]',
        website_url: 'https://[brewery-website].com',
        founded_year: 2010,
        specialty_styles: ['[Style 1]', '[Style 2]', '[Style 3]'],
        signature_beers: ['[Beer 1]', '[Beer 2]', '[Beer 3]'],
        brewery_description: '[Comprehensive brewery description and philosophy]',
        why_featured: '[Why this brewery represents the state\'s brewing character]',
        visit_priority: i + 1,
        social_media: {
          instagram: '@[brewery-handle]',
          facebook: '[brewery-page]'
        },
        awards: ['[Award 1]', '[Award 2]'],
        is_active: true,
        featured_week: weekNumber
      })),
      featured_breweries: Array.from({ length: 7 }, (_, i) => `[Brewery ${i + 1} Name]`),
      journey_highlights: [
        `[Unique aspect 1 of ${stateName} brewing]`,
        `[Unique aspect 2 of ${stateName} brewing]`,
        `[Unique aspect 3 of ${stateName} brewing]`
      ],
      difficulty_rating: 3,
      current_status: 'research'
    }
  }
}

export const researchToDatabaseAutomation = new ResearchToDatabaseAutomation()