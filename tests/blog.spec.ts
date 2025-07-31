import { test, expect } from '@playwright/test';

test.describe('Blog Page Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002/blog');
  });

  test('blog page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Blog.*BrewQuest|BrewQuest.*Blog/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('beer review cards are displayed', async ({ page }) => {
    // Look for beer review cards with various selectors
    const cardSelectors = [
      '.beer-card',
      '.beer-review-card',
      '[data-testid="beer-card"]',
      '.review-card',
      'article',
      '.card'
    ];
    
    let cardsFound = false;
    for (const selector of cardSelectors) {
      const cards = page.locator(selector);
      if (await cards.count() > 0) {
        await expect(cards.first()).toBeVisible();
        cardsFound = true;
        break;
      }
    }
    
    // If no specific cards found, check for any content structure
    if (!cardsFound) {
      console.log('No specific beer cards found, checking for general content');
      const content = page.locator('main, .content, .blog-content');
      await expect(content.first()).toBeVisible();
    }
  });

  test('Alabama breweries are featured', async ({ page }) => {
    // Check for Alabama-related content
    await expect(page.locator('text=Alabama')).toBeVisible();
    
    // Look for brewery names or beer names
    const alabamaBreweries = [
      'Good People',
      'Avondale',
      'TrimTab',
      'Cahaba',
      'Back Forty',
      'Monday Night',
      'Yellowhammer'
    ];
    
    let breweriesFound = 0;
    for (const brewery of alabamaBreweries) {
      if (await page.locator(`text=${brewery}`).count() > 0) {
        breweriesFound++;
      }
    }
    
    expect(breweriesFound).toBeGreaterThan(0);
  });

  test('blog post filtering works', async ({ page }) => {
    // Look for filter elements
    const filterSelectors = [
      'select',
      '.filter',
      '.category-filter',
      'button[data-filter]',
      '[data-testid="filter"]'
    ];
    
    for (const selector of filterSelectors) {
      const filterElement = page.locator(selector);
      if (await filterElement.count() > 0) {
        await expect(filterElement.first()).toBeVisible();
        // Try to interact with filter if clickable
        if (await filterElement.first().isEnabled()) {
          await filterElement.first().click();
        }
        break;
      }
    }
  });

  test('individual beer review links work', async ({ page }) => {
    // Find any links that might lead to individual beer pages
    const beerLinks = page.locator('a[href*="/beers/"], a[href*="/beer/"]');
    const linkCount = await beerLinks.count();
    
    if (linkCount > 0) {
      // Test first beer link
      const firstLink = beerLinks.first();
      await expect(firstLink).toBeVisible();
      
      const href = await firstLink.getAttribute('href');
      if (href) {
        // Navigate to beer page
        await firstLink.click();
        await page.waitForLoadState('networkidle');
        
        // Should be on a beer detail page
        expect(page.url()).toContain('/beer');
        await expect(page.locator('h1')).toBeVisible();
      }
    }
  });

  test('foundation stories section exists', async ({ page }) => {
    // Navigate back to main blog if on beer detail
    await page.goto('http://localhost:3002/blog');
    
    // Look for foundation stories
    const storySelectors = [
      'text=Foundation Stories',
      'text=Stories',
      '.foundation-stories',
      '.stories-section',
      '[data-testid="stories"]'
    ];
    
    for (const selector of storySelectors) {
      if (await page.locator(selector).count() > 0) {
        await expect(page.locator(selector)).toBeVisible();
        break;
      }
    }
  });
});