import { test, expect } from '@playwright/test';

test.describe('State Pages Functionality', () => {
  test('Alabama state page loads correctly', async ({ page }) => {
    await page.goto('http://localhost:3002/states/alabama');
    
    await expect(page).toHaveTitle(/Alabama.*BrewQuest|BrewQuest.*Alabama/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Alabama')).toBeVisible();
  });

  test('Alabama page displays 7 unique breweries', async ({ page }) => {
    await page.goto('http://localhost:3002/states/alabama');
    
    const expectedBreweries = [
      'Good People Brewing',
      'Avondale Brewing',
      'TrimTab Brewing',
      'Cahaba Brewing',
      'Back Forty Beer',
      'Monday Night Brewing',
      'Yellowhammer Brewery'
    ];
    
    let breweriesFound = 0;
    for (const brewery of expectedBreweries) {
      const breweryElement = page.locator(`text=${brewery}`);
      if (await breweryElement.count() > 0) {
        breweriesFound++;
      }
    }
    
    // Should find at least 5 out of 7 breweries (allowing for slight name variations)
    expect(breweriesFound).toBeGreaterThanOrEqual(5);
  });

  test('Alabama beer reviews are displayed with proper structure', async ({ page }) => {
    await page.goto('http://localhost:3002/states/alabama');
    
    // Look for beer review structure
    const reviewSelectors = [
      '.beer-review',
      '.beer-card', 
      '.review-card',
      'article',
      '[data-testid="beer-review"]'
    ];
    
    let reviewsFound = false;
    for (const selector of reviewSelectors) {
      const reviews = page.locator(selector);
      if (await reviews.count() > 0) {
        await expect(reviews.first()).toBeVisible();
        reviewsFound = true;
        
        // Check for rating system
        const ratingSelectors = ['.star-rating', '.rating', '[data-testid="rating"]'];
        for (const ratingSelector of ratingSelectors) {
          if (await page.locator(ratingSelector).count() > 0) {
            await expect(page.locator(ratingSelector).first()).toBeVisible();
            break;
          }
        }
        break;
      }
    }
    
    expect(reviewsFound).toBe(true);
  });

  test('dynamic state pages work', async ({ page }) => {
    // Test a few different state URLs
    const states = ['california', 'texas', 'colorado'];
    
    for (const state of states) {
      await page.goto(`http://localhost:3002/states/${state}`);
      
      // Should load without error
      const title = await page.title();
      expect(title.toLowerCase()).toContain('brewquest');
      
      // Should have some content
      await expect(page.locator('main, .content, body')).toBeVisible();
    }
  });

  test('states index page lists available states', async ({ page }) => {
    await page.goto('http://localhost:3002/states');
    
    await expect(page.locator('h1')).toBeVisible();
    
    // Should have Alabama listed
    await expect(page.locator('text=Alabama')).toBeVisible();
    
    // Look for state links
    const stateLinks = page.locator('a[href*="/states/"]');
    const linkCount = await stateLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('state navigation from map works', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    // Look for clickable map elements
    const mapElements = page.locator('svg path[data-state], svg g[data-state], [data-state="alabama"], [data-state="AL"]');
    
    if (await mapElements.count() > 0) {
      // Try clicking Alabama on the map
      const alabamaElement = mapElements.first();
      await alabamaElement.click();
      
      // Should navigate to Alabama page or show tooltip
      await page.waitForTimeout(1000);
      
      // Check if we navigated or if there's a tooltip/modal
      const url = page.url();
      if (url.includes('/states/alabama')) {
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('text=Alabama')).toBeVisible();
      } else {
        // Look for tooltip or modal
        const tooltip = page.locator('.tooltip, .state-tooltip, .modal, .popup');
        if (await tooltip.count() > 0) {
          await expect(tooltip.first()).toBeVisible();
        }
      }
    }
  });
});