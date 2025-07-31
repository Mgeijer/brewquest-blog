#!/usr/bin/env node

/**
 * BrewQuest Chronicles - Beer Image Management System
 * Comprehensive system for downloading and organizing beer images for all 50 states
 * 
 * Author: Hop Harrison Blog Team
 * Usage: node scripts/beer-image-management.js [command] [options]
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

class BeerImageManager {
  constructor() {
    this.baseImagePath = path.join(process.cwd(), 'public', 'images', 'Beer images');
    this.logFile = path.join(process.cwd(), 'beer-image-downloads.log');
  }

  /**
   * Ensure directory structure exists for a state
   */
  async ensureStateDirectory(stateName) {
    const statePath = path.join(this.baseImagePath, stateName);
    try {
      await fs.access(statePath);
    } catch {
      await fs.mkdir(statePath, { recursive: true });
      this.log(`Created directory: ${statePath}`);
    }
    return statePath;
  }

  /**
   * Download image from URL
   */
  async downloadImage(url, filePath) {
    return new Promise((resolve, reject) => {
      const file = createWriteStream(filePath);
      
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve();
        });
        
        file.on('error', (err) => {
          file.destroy();
          fs.unlink(filePath).catch(() => {}); // Cleanup failed download
          reject(err);
        });
      }).on('error', reject);
    });
  }

  /**
   * Sanitize filename for file system
   */
  sanitizeFilename(filename) {
    return filename
      .replace(/[^a-zA-Z0-9\s\-_.]/g, '') // Remove special chars
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }

  /**
   * Generate filename from beer name and brewery
   */
  generateFilename(beerName, brewery, extension = 'jpg') {
    const sanitized = this.sanitizeFilename(`${beerName} - ${brewery}`);
    return `${sanitized}.${extension}`;
  }

  /**
   * Log messages to file and console
   */
  async log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    console.log(message);
    try {
      await fs.appendFile(this.logFile, logMessage);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Verify image exists and is valid
   */
  async verifyImage(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size > 1000; // At least 1KB
    } catch {
      return false;
    }
  }

  /**
   * Download beer images for a state
   */
  async downloadStateImages(stateName, beerList) {
    await this.log(`Starting image downloads for ${stateName}`);
    const statePath = await this.ensureStateDirectory(stateName);
    const results = [];

    for (const beer of beerList) {
      try {
        const filename = this.generateFilename(beer.name, beer.brewery);
        const filePath = path.join(statePath, filename);
        
        // Check if image already exists
        if (await this.verifyImage(filePath)) {
          await this.log(`Image already exists: ${filename}`);
          results.push({ beer: beer.name, status: 'exists', path: filePath });
          continue;
        }

        if (beer.imageUrl && beer.imageUrl.startsWith('http')) {
          await this.downloadImage(beer.imageUrl, filePath);
          
          if (await this.verifyImage(filePath)) {
            await this.log(`✓ Downloaded: ${filename}`);
            results.push({ beer: beer.name, status: 'downloaded', path: filePath });
          } else {
            await this.log(`✗ Failed verification: ${filename}`);
            results.push({ beer: beer.name, status: 'failed_verification', error: 'Invalid file' });
          }
        } else {
          await this.log(`✗ No valid URL for: ${beer.name}`);
          results.push({ beer: beer.name, status: 'no_url', error: 'Missing or invalid URL' });
        }

        // Rate limiting - wait 1 second between downloads
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        await this.log(`✗ Error downloading ${beer.name}: ${error.message}`);
        results.push({ beer: beer.name, status: 'error', error: error.message });
      }
    }

    await this.log(`Completed ${stateName} downloads: ${results.filter(r => r.status === 'downloaded').length}/${beerList.length} successful`);
    return results;
  }

  /**
   * Generate report of missing images
   */
  async generateMissingImagesReport() {
    const report = [];
    const stateDataPath = path.join(process.cwd(), 'src', 'lib', 'data', 'stateProgress.ts');
    
    try {
      const stateData = await fs.readFile(stateDataPath, 'utf8');
      // Parse state data and check for missing images
      // This would need to be implemented based on your actual data structure
      
      await this.log('Generated missing images report');
      return report;
    } catch (error) {
      await this.log(`Error generating report: ${error.message}`);
      return [];
    }
  }

  /**
   * Bulk rename images following standard naming convention
   */
  async standardizeImageNames(stateName) {
    const statePath = path.join(this.baseImagePath, stateName);
    
    try {
      const files = await fs.readdir(statePath);
      const renames = [];

      for (const file of files) {
        const oldPath = path.join(statePath, file);
        const standardName = this.sanitizeFilename(file);
        const newPath = path.join(statePath, standardName);

        if (oldPath !== newPath) {
          await fs.rename(oldPath, newPath);
          renames.push({ from: file, to: standardName });
          await this.log(`Renamed: ${file} → ${standardName}`);
        }
      }

      return renames;
    } catch (error) {
      await this.log(`Error standardizing names for ${stateName}: ${error.message}`);
      throw error;
    }
  }
}

// Alabama Beer Data with Researched URLs
const ALABAMA_BEER_DATA = [
  {
    name: 'Good People IPA',
    brewery: 'Good People Brewing Company',
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/61df5a9c912bf074afe1f208/1642029861541-7CYGJXBM1E2DK9VHWQYY/GP-CANS-IPA.png',
    websiteUrl: 'https://www.goodpeoplebrewing.com/',
    style: 'American IPA',
    abv: 7.1,
    description: "Alabama's #1 selling IPA for the last 10 years"
  },
  {
    name: 'Ghost Train',
    brewery: 'Yellowhammer Brewing',
    imageUrl: null, // Need to find specific Ghost Train image
    websiteUrl: 'https://www.yellowhammerbrewery.com/',
    style: 'German-Style Hefeweizen',
    abv: 4.8,
    description: "Huntsville's signature wheat beer with authentic Bavarian brewing techniques"
  },
  {
    name: 'Cahaba Oka Uba IPA',
    brewery: 'Cahaba Brewing Company',
    imageUrl: null, // Available for purchase but need product image
    websiteUrl: 'https://cahababrewing.com/',
    style: 'American IPA',
    abv: 7.0,
    description: 'Named after indigenous word meaning "the Water Above"'
  },
  {
    name: 'TrimTab Paradise Now',
    brewery: 'TrimTab Brewing Company',
    imageUrl: 'https://static.wixstatic.com/media/d4ad6a_d557819dc7f041a0870ed6adcef3138e~mv2.jpg/v1/crop/x_8,y_0,w_900,h_667/fill/w_543,h_393,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Paradise%20Now%20Raspberry%20Berliner%20Weisse.jpg',
    websiteUrl: 'https://www.trimtabbrewing.com/',
    style: 'Raspberry Berliner Weisse',
    abv: 5.2,
    description: 'GABF award-winning tart, refreshing wheat ale with raspberry and cherry'
  },
  {
    name: "Avondale Miss Fancy's Tripel",
    brewery: 'Avondale Brewing Company',
    imageUrl: null, // Need to find product image
    websiteUrl: 'https://www.avondalebrewing.com/',
    style: 'Belgian Tripel',
    abv: 9.2,
    description: 'Strong Belgian golden ale named after a famous elephant'
  },
  {
    name: 'Snake Handler',
    brewery: 'Back Forty Beer Company',
    imageUrl: null, // Mentioned in articles but need product image
    websiteUrl: 'https://backfortybeer.com/',
    style: 'Double IPA',
    abv: 9.2,
    description: "Gadsden-based brewery's flagship DIPA with Southern attitude"
  },
  {
    name: 'Darker Subject Matter',
    brewery: 'Monday Night Brewing',
    imageUrl: 'https://cdn.mondaynightbrewing.com/uploads/2025/01/DSM-Bourbon-web@2x-221x300.webp',
    websiteUrl: 'https://mondaynightbrewing.com/',
    style: 'Imperial Stout',
    abv: 13.9,
    description: 'Bold, high-gravity imperial stout from Birmingham Social Club location'
  }
];

// Brewery Contact Information
const ALABAMA_BREWERY_INFO = {
  'Good People Brewing Company': {
    address: '114 14th St S, Birmingham, AL 35233',
    phone: '(205) 286-2337',
    website: 'https://www.goodpeoplebrewing.com/',
    socialMedia: {
      facebook: 'https://www.facebook.com/goodpeoplebrewing/',
      instagram: '@goodpeoplebrewing'
    }
  },
  'Yellowhammer Brewing': {
    address: 'Campus 805, Huntsville, AL',
    phone: '(256) 489-3510',
    website: 'https://www.yellowhammerbrewery.com/',
    socialMedia: {
      facebook: 'https://www.facebook.com/yellowhammerbrewing/'
    }
  },
  'Cahaba Brewing Company': {
    address: '4500 5th Ave South Building C, Birmingham, AL 35222',
    phone: '(205) 578-2616',
    website: 'https://cahababrewing.com/',
    socialMedia: {
      facebook: '@cahababrewing'
    }
  },
  'TrimTab Brewing Company': {
    address: '2721 5th Ave S, Birmingham, AL 35233',
    phone: '(205) 374-8749',
    website: 'https://www.trimtabbrewing.com/',
    socialMedia: {
      instagram: '@trimtabbrewing'
    }
  },
  'Avondale Brewing Company': {
    address: '201 41st Street South, Birmingham, AL 35222',
    phone: '(205) 203-4546',
    website: 'https://www.avondalebrewing.com/',
    socialMedia: {
      facebook: '@avondalebrewing'
    }
  },
  'Back Forty Beer Company': {
    address: 'Gadsden, AL (with Birmingham location at Sloss Docks)',
    website: 'https://backfortybeer.com/',
    socialMedia: {
      facebook: '@backfortybeer'
    }
  },
  'Monday Night Brewing': {
    address: '14 12th Street South Birmingham, AL 35233',
    phone: '(205) 444-1429',
    website: 'https://mondaynightbrewing.com/',
    socialMedia: {
      instagram: '@mondaynightbrewing'
    }
  }
};

// CLI Interface
async function main() {
  const manager = new BeerImageManager();
  const command = process.argv[2];
  const stateName = process.argv[3] || 'Alabama';

  switch (command) {
    case 'download':
      await manager.downloadStateImages(stateName, ALABAMA_BEER_DATA);
      break;
      
    case 'standardize':
      await manager.standardizeImageNames(stateName);
      break;
      
    case 'report':
      await manager.generateMissingImagesReport();
      break;
      
    case 'brewery-info':
      console.log(JSON.stringify(ALABAMA_BREWERY_INFO, null, 2));
      break;
      
    case 'beer-data':
      console.log(JSON.stringify(ALABAMA_BEER_DATA, null, 2));
      break;
      
    default:
      console.log(`
Beer Image Management System

Commands:
  download [state]     Download images for state (default: Alabama)
  standardize [state]  Standardize image filenames for state
  report              Generate missing images report
  brewery-info        Display brewery contact information
  beer-data           Display beer data with URLs

Examples:
  node scripts/beer-image-management.js download Alabama
  node scripts/beer-image-management.js standardize Alabama
  node scripts/beer-image-management.js brewery-info
      `);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { BeerImageManager, ALABAMA_BEER_DATA, ALABAMA_BREWERY_INFO };