// ===================================================================
// BREWQUEST CHRONICLES STATE CONTENT MANAGEMENT API
// ===================================================================
// Comprehensive API for managing state-by-state content creation workflow

import { NextRequest, NextResponse } from 'next/server'
import { contentScheduler, type ContentCreationRequest } from '@/lib/content-workflow/contentScheduler'
import { breweryResearchService, type BreweryResearchCriteria } from '@/lib/data-population/breweryResearchService'
import { imageService } from '@/lib/image-management/imageService'

// POST /api/content-management/state-content
// Create complete content package for a state week
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...params } = body

    switch (action) {
      case 'create_state_content':
        return await createStateContent(params)
      
      case 'research_breweries':
        return await researchStateBreweries(params)
      
      case 'validate_content':
        return await validateStateContent(params)
      
      case 'generate_social_posts':
        return await generateSocialPosts(params)
      
      case 'upload_images':
        return await handleImageUploads(params)
      
      case 'get_content_status':
        return await getContentStatus(params)

      case 'batch_create_states':
        return await batchCreateStates(params)

      default:
        return NextResponse.json(
          { error: 'Invalid action', available_actions: [
            'create_state_content', 'research_breweries', 'validate_content',
            'generate_social_posts', 'upload_images', 'get_content_status',
            'batch_create_states'
          ]},
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('State content API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET /api/content-management/state-content
// Get content status and analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stateCode = searchParams.get('stateCode')
    const weekNumber = searchParams.get('weekNumber')
    const analytics = searchParams.get('analytics') === 'true'

    if (stateCode && weekNumber) {
      // Get specific state content status
      const contentPlan = await contentScheduler.getStateContentStatus(
        stateCode,
        parseInt(weekNumber)
      )
      
      return NextResponse.json({
        success: true,
        data: contentPlan
      })
    }

    if (analytics) {
      // Get content production analytics
      const analyticsData = await contentScheduler.getContentProductionAnalytics('month')
      
      return NextResponse.json({
        success: true,
        data: analyticsData
      })
    }

    // Default: return overall project status
    const projectStatus = await getProjectOverview()
    
    return NextResponse.json({
      success: true,
      data: projectStatus
    })

  } catch (error) {
    console.error('Get state content error:', error)
    return NextResponse.json(
      { error: 'Failed to get content status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Helper function implementations

async function createStateContent(params: {
  stateCode: string
  weekNumber: number
  autoResearch?: boolean
  publishingSchedule?: {
    weekStartDate: string
    stateOverviewDate: string
    dailyReviewDates: string[]
  }
}) {
  const { stateCode, weekNumber, autoResearch = true } = params

  try {
    let breweryData: any[] = []
    let stateInfo: any = {}

    if (autoResearch) {
      console.log(`Auto-researching breweries for ${stateCode}...`)
      
      // Research breweries automatically
      const researchCriteria: BreweryResearchCriteria = {
        stateCode,
        stateName: getStateName(stateCode),
        weekNumber,
        breweryCount: 6,
        selectionCriteria: {
          includeRegionalDistribution: true,
          includeSizeVariety: true,
          includeStyleDiversity: true,
          includeHistoricalSignificance: true,
          includeLocalFavorites: true,
          includeAwardWinners: true
        },
        beerStyleDistribution: {
          monday_ipa: false, // State overview on Monday
          tuesday_lager: true,
          wednesday_specialty: true,
          thursday_stout: true,
          friday_sour: true,
          saturday_wheat: true,
          sunday_local_specialty: true
        }
      }

      const researchResult = await breweryResearchService.researchStateBreweries(researchCriteria)
      
      // Convert research result to content creation format
      breweryData = researchResult.breweries.map((brewery, index) => ({
        breweryName: brewery.name,
        beerName: brewery.flagshipBeers[0] || 'Flagship Beer',
        beerStyle: brewery.specialtyStyles[0] || 'American IPA',
        abv: 5.5 + Math.random() * 3,
        ibu: Math.floor(20 + Math.random() * 60),
        rating: 4 + Math.random(),
        tastingNotes: `Excellent example of ${brewery.specialtyStyles[0] || 'craft brewing'}`,
        uniqueFeature: brewery.uniqueSellingPoint,
        breweryStory: brewery.whyFeatured,
        breweryLocation: `${brewery.city}, ${brewery.state}`,
        breweryWebsite: brewery.website,
        dayOfWeek: index + 2 // Tuesday through Sunday
      }))

      stateInfo = {
        name: researchResult.stateProfile.stateName,
        brewingHistory: researchResult.stateProfile.brewingHistory.craftBeerRenaissance || 'Rich brewing heritage',
        uniqueFeatures: researchResult.stateProfile.brewing_characteristics.uniqueTraditions,
        culturalHighlights: researchResult.stateProfile.beerCulture.touristAttractions
      }
    } else {
      // Use provided brewery data
      breweryData = params.breweryData || []
      stateInfo = params.stateInfo || {}
    }

    // Set up publishing schedule
    const weekStartDate = params.publishingSchedule?.weekStartDate 
      ? new Date(params.publishingSchedule.weekStartDate)
      : getWeekStartDate(weekNumber)
    
    const stateOverviewDate = params.publishingSchedule?.stateOverviewDate
      ? new Date(params.publishingSchedule.stateOverviewDate)
      : weekStartDate
    
    const dailyReviewDates = params.publishingSchedule?.dailyReviewDates?.map(d => new Date(d)) || 
      Array.from({ length: 6 }, (_, i) => {
        const date = new Date(weekStartDate)
        date.setDate(weekStartDate.getDate() + i + 1) // Tuesday through Sunday
        return date
      })

    // Create content request
    const contentRequest: ContentCreationRequest = {
      stateCode,
      weekNumber,
      breweryData,
      stateInfo,
      publishingSchedule: {
        weekStartDate,
        stateOverviewDate,
        dailyReviewDates
      }
    }

    // Create content plan
    const contentPlan = await contentScheduler.createStateContentPlan(contentRequest)

    return NextResponse.json({
      success: true,
      message: `Content created for ${stateInfo.name} (Week ${weekNumber})`,
      data: {
        contentPlan,
        brewery_count: breweryData.length,
        publishing_schedule: {
          week_start: weekStartDate.toISOString(),
          state_overview: stateOverviewDate.toISOString(),
          daily_reviews: dailyReviewDates.map(d => d.toISOString())
        },
        next_steps: [
          'Upload brewery and beer images',
          'Review and edit generated content',
          'Schedule social media posts',
          'Fact-check brewery information'
        ]
      }
    })

  } catch (error) {
    console.error('Create state content error:', error)
    return NextResponse.json(
      { error: 'Failed to create state content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function researchStateBreweries(params: {
  stateCode: string
  weekNumber: number
  criteria?: Partial<BreweryResearchCriteria>
}) {
  const { stateCode, weekNumber, criteria = {} } = params

  try {
    const researchCriteria: BreweryResearchCriteria = {
      stateCode,
      stateName: getStateName(stateCode),
      weekNumber,
      breweryCount: 6,
      selectionCriteria: {
        includeRegionalDistribution: true,
        includeSizeVariety: true,
        includeStyleDiversity: true,
        includeHistoricalSignificance: true,
        includeLocalFavorites: true,
        includeAwardWinners: true,
        ...criteria.selectionCriteria
      },
      beerStyleDistribution: {
        monday_ipa: false,
        tuesday_lager: true,
        wednesday_specialty: true,
        thursday_stout: true,
        friday_sour: true,
        saturday_wheat: true,
        sunday_local_specialty: true,
        ...criteria.beerStyleDistribution
      }
    }

    const researchResult = await breweryResearchService.researchStateBreweries(researchCriteria)

    return NextResponse.json({
      success: true,
      message: `Research completed for ${researchResult.stateProfile.stateName}`,
      data: {
        breweries: researchResult.breweries,
        state_profile: researchResult.stateProfile,
        research_report: researchResult.researchReport,
        recommendations: researchResult.breweries.length >= 6 
          ? ['Proceed with content creation']
          : ['Need additional brewery research', 'Consider expanding search criteria']
      }
    })

  } catch (error) {
    console.error('Research breweries error:', error)
    return NextResponse.json(
      { error: 'Failed to research breweries', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function validateStateContent(params: {
  stateCode: string
  weekNumber: number
}) {
  const { stateCode, weekNumber } = params

  try {
    const validation = await contentScheduler.validateContentReadiness(stateCode, weekNumber)
    
    return NextResponse.json({
      success: true,
      message: validation.isValid ? 'Content is ready for publication' : 'Content needs attention',
      data: {
        validation_result: validation,
        ready_for_publish: validation.isValid,
        critical_issues: validation.errors,
        recommendations: validation.warnings,
        checklist_status: validation.checklist
      }
    })

  } catch (error) {
    console.error('Validate content error:', error)
    return NextResponse.json(
      { error: 'Failed to validate content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function generateSocialPosts(params: {
  stateCode: string
  weekNumber: number
  platforms?: string[]
}) {
  const { stateCode, weekNumber, platforms = ['instagram', 'twitter', 'facebook', 'tiktok'] } = params

  try {
    const socialResult = await contentScheduler.generateWeeklySocialPosts(stateCode, weekNumber)
    
    return NextResponse.json({
      success: true,
      message: `Generated ${socialResult.created} social media posts`,
      data: {
        posts_created: socialResult.created,
        posts_failed: socialResult.failed,
        details: socialResult.details,
        platforms_used: platforms,
        estimated_reach: socialResult.created * 1000, // Rough estimate
        next_steps: [
          'Review generated content for brand voice',
          'Upload accompanying images',
          'Schedule posts for optimal timing',
          'Set up engagement monitoring'
        ]
      }
    })

  } catch (error) {
    console.error('Generate social posts error:', error)
    return NextResponse.json(
      { error: 'Failed to generate social posts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function handleImageUploads(params: {
  stateCode: string
  weekNumber: number
  imageData: Array<{
    filename: string
    imageType: string
    breweryName?: string
    beerName?: string
    base64Data: string
  }>
}) {
  const { stateCode, weekNumber, imageData } = params

  try {
    const uploadResults = {
      successful: [] as string[],
      failed: [] as { filename: string; error: string }[]
    }

    for (const image of imageData) {
      try {
        // Convert base64 to File object
        const base64Response = await fetch(image.base64Data)
        const blob = await base64Response.blob()
        const file = new File([blob], image.filename, { type: blob.type })

        // Upload image
        const imageAsset = await imageService.uploadImage(file, {
          imageType: image.imageType as any,
          contentCategory: 'beer_review',
          stateCode,
          weekNumber,
          breweryName: image.breweryName,
          beerName: image.beerName,
          altText: `${image.beerName || 'Beer'} by ${image.breweryName || 'Brewery'}`
        })

        uploadResults.successful.push(imageAsset.id)

      } catch (error) {
        uploadResults.failed.push({
          filename: image.filename,
          error: error instanceof Error ? error.message : 'Upload failed'
        })
      }
    }

    return NextResponse.json({
      success: uploadResults.failed.length === 0,
      message: `Uploaded ${uploadResults.successful.length} images, ${uploadResults.failed.length} failed`,
      data: {
        uploaded_count: uploadResults.successful.length,
        failed_count: uploadResults.failed.length,
        successful_uploads: uploadResults.successful,
        failed_uploads: uploadResults.failed,
        next_steps: uploadResults.successful.length > 0 
          ? ['Link images to beer reviews', 'Generate social media variants']
          : ['Retry failed uploads', 'Check image format and size requirements']
      }
    })

  } catch (error) {
    console.error('Handle image uploads error:', error)
    return NextResponse.json(
      { error: 'Failed to handle image uploads', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function getContentStatus(params: {
  stateCode?: string
  weekNumber?: number
  scope?: 'week' | 'state' | 'project'
}) {
  const { stateCode, weekNumber, scope = 'week' } = params

  try {
    if (scope === 'week' && stateCode && weekNumber) {
      const contentPlan = await contentScheduler.getStateContentStatus(stateCode, parseInt(weekNumber.toString()))
      const validation = await contentScheduler.validateContentReadiness(stateCode, parseInt(weekNumber.toString()))
      
      return NextResponse.json({
        success: true,
        data: {
          content_plan: contentPlan,
          validation_status: validation,
          completion_percentage: calculateCompletionPercentage(validation.checklist),
          ready_for_publish: validation.isValid
        }
      })
    }

    if (scope === 'project') {
      const projectStatus = await getProjectOverview()
      
      return NextResponse.json({
        success: true,
        data: projectStatus
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid scope or missing parameters'
    }, { status: 400 })

  } catch (error) {
    console.error('Get content status error:', error)
    return NextResponse.json(
      { error: 'Failed to get content status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function batchCreateStates(params: {
  stateCodes: string[]
  startWeek: number
  autoResearch: boolean
}) {
  const { stateCodes, startWeek, autoResearch } = params

  try {
    if (autoResearch) {
      // Use the automated research service
      const batchResult = await breweryResearchService.batchResearchStates(stateCodes, startWeek)
      
      return NextResponse.json({
        success: true,
        message: `Batch processing completed: ${batchResult.completed.length} states successful, ${batchResult.failed.length} failed`,
        data: {
          completed_states: batchResult.completed,
          failed_states: batchResult.failed,
          summary: batchResult.summary,
          estimated_content_ready: batchResult.completed.length * 6, // 6 beer reviews per state
          next_steps: [
            'Review generated content for accuracy',
            'Upload missing images',
            'Schedule social media campaigns',
            'Begin fact-checking process'
          ]
        }
      })
    } else {
      // Manual batch creation (would require individual content requests)
      return NextResponse.json({
        success: false,
        error: 'Manual batch creation not yet implemented',
        recommendation: 'Use autoResearch: true or create states individually'
      }, { status: 501 })
    }

  } catch (error) {
    console.error('Batch create states error:', error)
    return NextResponse.json(
      { error: 'Failed to batch create states', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Utility functions

function getStateName(stateCode: string): string {
  const stateNames: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
    'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming'
  }
  return stateNames[stateCode] || stateCode
}

function getWeekStartDate(weekNumber: number): Date {
  const projectStart = new Date('2024-01-01') // Monday
  const weekStartDate = new Date(projectStart)
  weekStartDate.setDate(projectStart.getDate() + (weekNumber - 1) * 7)
  return weekStartDate
}

function calculateCompletionPercentage(checklist: any): number {
  const items = Object.values(checklist) as boolean[]
  const completed = items.filter(Boolean).length
  return Math.round((completed / items.length) * 100)
}

async function getProjectOverview() {
  // This would query the database for comprehensive project status
  return {
    total_weeks: 50,
    completed_weeks: 1, // Would be calculated from actual data
    current_week: 1,
    total_breweries_researched: 6,
    total_beer_reviews: 6,
    total_blog_posts: 1,
    content_completion_percentage: 2, // 1/50 weeks = 2%
    next_deadlines: [
      {
        state: 'Alaska',
        week: 2,
        due_date: '2024-01-08',
        status: 'upcoming'
      }
    ],
    recent_activity: [
      'Alabama content package completed',
      'Social media posts scheduled for Week 1',
      'Beer review images uploaded'
    ]
  }
}