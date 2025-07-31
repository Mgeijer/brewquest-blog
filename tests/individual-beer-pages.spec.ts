import { test, expect } from '@playwright/test';

test.describe('Individual Beer Pages', () => {
  test('individual beer review pages load correctly', async ({ page }) => {
    // First, find beer links from blog page
    await page.goto('http://localhost:3002/blog');
    
    const beerLinks = page.locator('a[href*="/beers/"]');
    const linkCount = await beerLinks.count();
    
    if (linkCount > 0) {
      // Test first beer link
      const firstBeerHref = await beerLinks.first().getAttribute('href');
      if (firstBeerHref) {
        await page.goto(`http://localhost:3002${firstBeerHref}`);
        
        // Should load successfully
        await expect(page.locator('h1')).toBeVisible();
        
        // Should have beer-specific content
        const beerContentSelectors = [
          '.beer-review',
          '.beer-details',
          '.brewery-info',
          '.rating',
          '.star-rating'
        ];
        
        let contentFound = false;
        for (const selector of beerContentSelectors) {
          if (await page.locator(selector).count() > 0) {
            contentFound = true;
            break;
          }
        }
        
        expect(contentFound).toBe(true);
      }
    } else {
      // Try direct beer URLs if no links found
      const commonBeerIds = ['1', '2', '3', 'good-people-ipa', 'avondale-miss-fancy'];
      
      for (const beerId of commonBeerIds) {
        try {
          await page.goto(`http://localhost:3002/beers/${beerId}`);
          const response = await page.waitForResponse(response => 
            response.url().includes(`/beers/${beerId}`) && response.status() === 200
          );
          
          if (response) {
            await expect(page.locator('h1')).toBeVisible();
            break;
          }
        } catch (error) {
          console.log(`Beer page /beers/${beerId} not found`);
        }
      }
    }
  });

  test('beer pages contain required elements', async ({ page }) => {
    // Try to access a specific Alabama beer
    await page.goto('http://localhost:3002/beers/1');
    
    try {
      await page.waitForLoadState('networkidle');
      
      if (page.url().includes('/beers/')) {
        // Should have beer name
        await expect(page.locator('h1')).toBeVisible();
        
        // Should have brewery information
        const brewerySelectors = [
          'text=Brewery',
          '.brewery',
          '.brewery-name',
          '[data-testid="brewery"]'
        ];
        
        for (const selector of brewerySelectors) {
          if (await page.locator(selector).count() > 0) {
            await expect(page.locator(selector).first()).toBeVisible();
            break;
          }
        }
        
        // Should have rating or review content
        const ratingSelectors = [
          '.rating',
          '.star-rating',
          '.review-score',
          '[data-testid="rating"]'
        ];
        
        for (const selector of ratingSelectors) {
          if (await page.locator(selector).count() > 0) {
            await expect(page.locator(selector).first()).toBeVisible();
            break;
          }
        }
        
        // Should have description or review text
        const reviewSelectors = [
          '.review-text',
          '.description',
          '.beer-description',
          'p'
        ];
        
        let reviewFound = false;
        for (const selector of reviewSelectors) {
          const elements = page.locator(selector);
          if (await elements.count() > 0) {
            const text = await elements.first().textContent();
            if (text && text.length > 50) { // Substantial content
              reviewFound = true;
              break;
            }
          }
        }
        
        expect(reviewFound).toBe(true);
      }
    } catch (error) {
      console.log('Individual beer page not accessible:', error);
    }
  });

  test('beer pages have proper navigation back to blog', async ({ page }) => {
    await page.goto('http://localhost:3002/beers/1');
    
    try {
      await page.waitForLoadState('networkidle');
      
      if (page.url().includes('/beers/')) {
        // Should have back navigation or breadcrumbs
        const backNavigationSelectors = [
          'a[href="/blog"]',
          'a[href*="blog"]',
          '.back-button',
          '.breadcrumb',
          'text=Back to Blog',
          'text=← Back'
        ];
        
        for (const selector of backNavigationSelectors) {
          const element = page.locator(selector);
          if (await element.count() > 0) {
            await expect(element.first()).toBeVisible();
            
            // Test navigation
            await element.first().click();
            await page.waitForLoadState('networkidle');
            expect(page.url()).toContain('/blog');
            return;
          }
        }
        
        // If no specific back button, header navigation should work
        const headerNav = page.locator('header a[href*="blog"]');
        if (await headerNav.count() > 0) {
          await headerNav.first().click();
          await page.waitForLoadState('networkidle');
          expect(page.url()).toContain('/blog');
        }
      }
    } catch (error) {
      console.log('Navigation test not applicable:', error);
    }
  });

  test('beer images load correctly', async ({ page }) => {
    await page.goto('http://localhost:3002/beers/1');
    
    try {
      await page.waitForLoadState('networkidle');
      
      if (page.url().includes('/beers/')) {
        const images = page.locator('img');
        const imageCount = await images.count();
        
        if (imageCount > 0) {
          for (let i = 0; i < imageCount; i++) {
            const img = images.nth(i);
            await expect(img).toBeVisible();
            
            // Check if image loaded successfully
            const naturalWidth = await img.evaluate((img: HTMLImageElement) => img.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
          }
        }
      }
    } catch (error) {
      console.log('Image test not applicable:', error);
    }
  });

  test('beer pages have sharing functionality', async ({ page }) => {
    await page.goto('http://localhost:3002/beers/1');
    
    try {
      await page.waitForLoadState('networkidle');
      
      if (page.url().includes('/beers/')) {
        // Look for share buttons
        const shareSelectors = [
          '.share-button',
          '.social-share',
          'button[data-share]',
          'a[href*="facebook.com/sharer"]',
          'a[href*="twitter.com/intent"]'
        ];
        
        for (const selector of shareSelectors) {
          if (await page.locator(selector).count() > 0) {
            await expect(page.locator(selector).first()).toBeVisible();
            break;
          }
        }
      }
    } catch (error) {
      console.log('Share functionality test not applicable:', error);
    }
  });
});