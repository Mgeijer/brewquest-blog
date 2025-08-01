import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { SocialMediaContentPack } from './types';

export class SocialMediaFileManager {
  private basePath = join(process.cwd(), 'social-media');

  /**
   * Save social media content to structured state folder
   */
  public saveContentToFile(contentPack: SocialMediaContentPack, formattedOutput: string): string {
    const stateName = contentPack.state.toLowerCase().replace(/\s+/g, '-');
    const stateDir = join(this.basePath, stateName);
    
    // Create state directory if it doesn't exist
    if (!existsSync(stateDir)) {
      mkdirSync(stateDir, { recursive: true });
    }
    
    // Generate filename
    const filename = `${stateName}-social-posts.md`;
    const filepath = join(stateDir, filename);
    
    // Write file
    writeFileSync(filepath, formattedOutput);
    
    return filepath;
  }

  /**
   * Get the expected file path for a state's social media content
   */
  public getStateFilePath(stateName: string): string {
    const stateSlug = stateName.toLowerCase().replace(/\s+/g, '-');
    return join(this.basePath, stateSlug, `${stateSlug}-social-posts.md`);
  }

  /**
   * Check if social media content exists for a state
   */
  public contentExistsForState(stateName: string): boolean {
    const filepath = this.getStateFilePath(stateName);
    return existsSync(filepath);
  }

  /**
   * List all states with existing social media content
   */
  public getStatesWithContent(): string[] {
    if (!existsSync(this.basePath)) {
      return [];
    }
    
    const fs = require('fs');
    return fs.readdirSync(this.basePath, { withFileTypes: true })
      .filter((dirent: any) => dirent.isDirectory())
      .map((dirent: any) => dirent.name)
      .filter((dirname: string) => dirname !== 'node_modules' && !dirname.startsWith('.'))
      .sort();
  }

  /**
   * Generate content for all 50 states (placeholder for future implementation)
   */
  public async generateAllStatesContent(): Promise<void> {
    // This would be implemented to generate content for all 50 states
    // using the state data from stateProgress.ts
    console.log('Bulk generation not yet implemented - use individual state generation');
  }
}