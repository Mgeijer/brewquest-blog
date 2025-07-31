#!/usr/bin/env ts-node

import { SocialMediaContentGenerator, exampleAlabamaData } from '../src/lib/social-media/content-generator';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Command line interface for generating social media content
class SocialContentCLI {
  private generator = new SocialMediaContentGenerator();

  public async generateWeeklyContent(weekNumber: number, stateName: string = 'Alabama') {
    console.log(`🍺 Generating Week ${weekNumber} social media content for ${stateName}...`);
    
    // For now, using Alabama example data - can be extended with a state data service
    const stateData = exampleAlabamaData;
    
    const contentPack = this.generator.generateWeeklyContent(weekNumber, stateData);
    const formattedOutput = this.generator.generateFormattedOutput(contentPack);
    
    // Save to file
    const filename = `week-${weekNumber}-${stateName.toLowerCase()}-social-content.md`;
    const filepath = join(process.cwd(), 'generated-content', filename);
    
    try {
      // Create directory if it doesn't exist
      const fs = require('fs');
      if (!fs.existsSync(join(process.cwd(), 'generated-content'))) {
        fs.mkdirSync(join(process.cwd(), 'generated-content'));
      }
      
      writeFileSync(filepath, formattedOutput);
      console.log(`✅ Content generated successfully!`);
      console.log(`📁 Saved to: ${filepath}`);
      console.log(`📊 Content Statistics:`);
      console.log(`   - Instagram: ${contentPack.weeklyPosts.instagram.characterCount} characters`);
      console.log(`   - Twitter: ${contentPack.weeklyPosts.twitter.characterCount} characters`);
      console.log(`   - Facebook: ${contentPack.weeklyPosts.facebook.characterCount} characters`);
      console.log(`   - LinkedIn: ${contentPack.weeklyPosts.linkedin.characterCount} characters`);
      console.log(`   - Daily posts: ${Object.keys(contentPack.dailyPosts).length} days`);
      
    } catch (error) {
      console.error('❌ Error saving file:', error);
    }
    
    return formattedOutput;
  }

  public displayUsage() {
    console.log(`
🍺 BrewQuest Chronicles Social Media Content Generator

Usage:
  npm run generate-social <week-number> [state-name]

Examples:
  npm run generate-social 1           # Generate Week 1 content for Alabama
  npm run generate-social 5 Texas     # Generate Week 5 content for Texas
  npm run generate-social 12 Colorado # Generate Week 12 content for Colorado

Features:
  ✅ Perfect format matching with existing social-media-posts-with-facebook.md
  ✅ Character counts for all platforms
  ✅ Platform-specific hashtag optimization
  ✅ Daily content for entire week
  ✅ Posting schedule recommendations
  ✅ Copy-paste ready content

Output:
  - Saves formatted content to generated-content/ directory
  - Includes all 4 weekly posts (Instagram, Twitter, Facebook, LinkedIn)
  - Includes 7 daily posts (Instagram + Twitter for each day)
  - Character counts and usage instructions
    `);
  }
}

// Main execution
const cli = new SocialContentCLI();

if (process.argv.length < 3) {
  cli.displayUsage();
  process.exit(1);
}

const command = process.argv[2];

if (command === 'help' || command === '--help' || command === '-h') {
  cli.displayUsage();
  process.exit(0);
}

const weekNumber = parseInt(command);
const stateName = process.argv[3] || 'Alabama';

if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 52) {
  console.error('❌ Error: Week number must be between 1 and 52');
  cli.displayUsage();
  process.exit(1);
}

cli.generateWeeklyContent(weekNumber, stateName)
  .then(() => {
    console.log('🎉 Social media content generation complete!');
  })
  .catch((error) => {
    console.error('❌ Error generating content:', error);
    process.exit(1);
  });