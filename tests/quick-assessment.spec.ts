import { test, expect } from '@playwright/test';

test.describe('Quick Site Assessment', () => {
  test('comprehensive site overview', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    // Take screenshot
    await page.screenshot({ path: 'site-overview.png', fullPage: true });
    
    // Get page info
    const title = await page.title();
    const url = page.url();
    console.log('Page Title:', title);
    console.log('URL:', url);
    
    // Check main elements
    const h1Elements = await page.locator('h1').count();
    const headerExists = await page.locator('header').count();
    const navExists = await page.locator('nav').count();
    const svgExists = await page.locator('svg').count();
    const alabamaElements = await page.locator('text=Alabama').count();
    
    console.log('H1 elements:', h1Elements);
    console.log('Header elements:', headerExists);
    console.log('Nav elements:', navExists);
    console.log('SVG elements:', svgExists);
    console.log('Alabama mentions:', alabamaElements);
    
    // Get some text content
    const h1Text = await page.locator('h1').first().textContent();
    console.log('Main H1:', h1Text);
    
    // Check for blog link
    const blogLink = page.locator('a[href*="/blog"]');
    const blogLinkCount = await blogLink.count();
    console.log('Blog links found:', blogLinkCount);
    
    if (blogLinkCount > 0) {
      await blogLink.first().click();
      await page.waitForLoadState('networkidle');
      const blogTitle = await page.title();
      console.log('Blog page title:', blogTitle);
      
      // Check for beer content
      const beerElements = await page.locator('text=Beer').count();
      const breweryElements = await page.locator('text=Brewing').count();
      console.log('Beer mentions on blog:', beerElements);
      console.log('Brewery mentions on blog:', breweryElements);
    }
  });

  test('Alabama state page assessment', async ({ page }) => {
    await page.goto('http://localhost:3002/states/alabama');
    
    const title = await page.title();
    console.log('Alabama page title:', title);
    
    // Take screenshot
    await page.screenshot({ path: 'alabama-page.png', fullPage: true });
    
    // Check for brewery content
    const breweries = [
      'Good People',
      'Avondale',
      'TrimTab',
      'Cahaba',
      'Back Forty',
      'Monday Night',
      'Yellowhammer'
    ];
    
    for (const brewery of breweries) {
      const found = await page.locator(`text=${brewery}`).count();
      console.log(`${brewery}: ${found} mentions`);
    }
    
    // Check for beer cards or reviews
    const cardElements = await page.locator('.card, .beer-card, .review-card, article').count();
    console.log('Card elements:', cardElements);
  });

  test('navigation flow test', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    // Test main navigation
    const pages = [
      { name: 'Blog', url: '/blog' },
      { name: 'States', url: '/states' },
      { name: 'About', url: '/about' }
    ];
    
    for (const pageInfo of pages) {
      const link = page.locator(`a[href*="${pageInfo.url}"]`).first();
      if (await link.count() > 0) {
        await link.click();
        await page.waitForLoadState('networkidle');
        const title = await page.title();
        console.log(`${pageInfo.name} page title:`, title);
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('mobile responsive check', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3002');
    
    await page.screenshot({ path: 'mobile-view.png', fullPage: true });
    
    // Check if content is visible
    const h1Visible = await page.locator('h1').isVisible();
    const headerVisible = await page.locator('header').isVisible();
    
    console.log('Mobile H1 visible:', h1Visible);
    console.log('Mobile header visible:', headerVisible);
    
    // Check for horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    console.log('Body width:', bodyWidth);
    console.log('Viewport width:', viewportWidth);
    console.log('Has horizontal scroll:', bodyWidth > viewportWidth + 5);
  });
});