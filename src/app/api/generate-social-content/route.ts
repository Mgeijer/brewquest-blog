import { NextRequest, NextResponse } from 'next/server';
import { SocialMediaContentGenerator, exampleAlabamaData } from '@/lib/social-media/content-generator';
import { SocialMediaFileManager } from '@/lib/social-media/file-manager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weekNumber, stateName = 'Alabama', config } = body;

    if (!weekNumber || weekNumber < 1 || weekNumber > 52) {
      return NextResponse.json(
        { error: 'Week number must be between 1 and 52' },
        { status: 400 }
      );
    }

    const generator = new SocialMediaContentGenerator();
    const fileManager = new SocialMediaFileManager();
    
    // For now, using Alabama example data - can be extended with database lookups
    const stateData = exampleAlabamaData;
    
    const contentPack = generator.generateWeeklyContent(weekNumber, stateData, config);
    const formattedOutput = generator.generateFormattedOutput(contentPack);
    
    // Save to structured file system
    const savedFilePath = fileManager.saveContentToFile(contentPack, formattedOutput);

    return NextResponse.json({
      success: true,
      data: {
        contentPack,
        formattedOutput,
        savedFilePath,
        statistics: {
          weekNumber,
          state: stateData.name,
          characterCounts: {
            instagram: contentPack.weeklyPosts.instagram.characterCount,
            twitter: contentPack.weeklyPosts.twitter.characterCount,
            facebook: contentPack.weeklyPosts.facebook.characterCount,
            linkedin: contentPack.weeklyPosts.linkedin.characterCount
          },
          totalPosts: Object.keys(contentPack.dailyPosts).length + 4, // 7 daily + 4 weekly
          hashtagsUsed: {
            instagram: contentPack.weeklyPosts.instagram.hashtags.length,
            twitter: contentPack.weeklyPosts.twitter.hashtags.length
          }
        }
      }
    });

  } catch (error) {
    console.error('Error generating social content:', error);
    return NextResponse.json(
      { error: 'Failed to generate social media content' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'BrewQuest Chronicles Social Media Content Generator API',
    usage: {
      endpoint: '/api/generate-social-content',
      method: 'POST',
      parameters: {
        weekNumber: 'number (1-52) - Required',
        stateName: 'string - Optional, defaults to "Alabama"',
        config: 'object - Optional content generation configuration'
      },
      example: {
        weekNumber: 1,
        stateName: 'Alabama',
        config: {
          tone: 'enthusiastic',
          focus: 'brewery_spotlight',
          includeBrandMentions: true,
          maxHashtags: {
            instagram: 30,
            twitter: 4
          }
        }
      }
    },
    features: [
      'Perfect format matching with existing social media posts',
      'Character counts for all platforms',
      'Platform-specific hashtag optimization',
      'Daily content for entire week',
      'Posting schedule recommendations',
      'Copy-paste ready content'
    ]
  });
}