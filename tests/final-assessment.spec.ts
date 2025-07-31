import { test, expect } from '@playwright/test';

test.describe('Final Comprehensive Assessment', () => {
  test('complete site structure analysis', async ({ page }) => {
    console.log('=== BREWQUEST CHRONICLES COMPREHENSIVE SITE REVIEW ===\n');
    
    // Homepage Analysis
    await page.goto('http://localhost:3002');
    await page.screenshot({ path: 'homepage-full.png', fullPage: true });
    
    const title = await page.title();
    console.log('📍 HOMEPAGE ANALYSIS');
    console.log(`Title: ${title}`);
    console.log(`URL: ${page.url()}`);
    
    // Check Core Elements
    const h1 = await page.locator('h1').textContent();
    console.log(`Main Heading: ${h1}`);
    
    const alabamaCount = await page.locator('text=Alabama').count();
    console.log(`Alabama mentions: ${alabamaCount}`);
    
    const svgCount = await page.locator('svg').count();
    console.log(`SVG elements (including map): ${svgCount}`);
    
    // Navigation check
    const navLinks = await page.locator('nav a, header a').count();
    console.log(`Navigation links: ${navLinks}`);
    
    // Newsletter check
    const emailInputs = await page.locator('input[type="email"]').count();
    console.log(`Email inputs (newsletter): ${emailInputs}`);
    
    console.log('\n📍 BLOG PAGE ANALYSIS');
    // Blog Page Analysis
    await page.goto('http://localhost:3002/blog');
    await page.screenshot({ path: 'blog-page-full.png', fullPage: true });
    
    const blogTitle = await page.title();
    console.log(`Blog Title: ${blogTitle}`);
    
    const beerMentions = await page.locator('text=Beer').count();
    const breweryMentions = await page.locator('text=Brewing').count();
    console.log(`Beer mentions: ${beerMentions}`);
    console.log(`Brewery mentions: ${breweryMentions}`);
    
    // Check for brewery names
    const breweries = ['Good People', 'Avondale', 'TrimTab', 'Cahaba', 'Back Forty', 'Monday Night', 'Yellowhammer'];
    console.log('Brewery visibility on blog:');
    for (const brewery of breweries) {
      const count = await page.locator(`text=${brewery}`).count();
      console.log(`  ${brewery}: ${count} mentions`);
    }
    
    console.log('\n📍 ALABAMA STATE PAGE ANALYSIS');
    // Alabama State Page Analysis
    await page.goto('http://localhost:3002/states/alabama');
    await page.screenshot({ path: 'alabama-state-full.png', fullPage: true });
    
    const alabamaTitle = await page.title();
    console.log(`Alabama Page Title: ${alabamaTitle}`);
    
    console.log('Brewery presence on Alabama page:');
    for (const brewery of breweries) {
      const count = await page.locator(`text=${brewery}`).count();
      console.log(`  ${brewery}: ${count} mentions`);
    }
    
    const cardElements = await page.locator('.card, .beer-card, .review-card, article').count();
    console.log(`Card/Review elements: ${cardElements}`);
    
    console.log('\n📍 STATES INDEX PAGE ANALYSIS');
    // States Index
    await page.goto('http://localhost:3002/states');
    const statesTitle = await page.title();
    console.log(`States Index Title: ${statesTitle}`);
    
    const stateLinks = await page.locator('a[href*="/states/"]').count();
    console.log(`State links: ${stateLinks}`);
    
    console.log('\n📍 ABOUT PAGE ANALYSIS');
    // About Page
    await page.goto('http://localhost:3002/about');
    const aboutTitle = await page.title();
    console.log(`About Page Title: ${aboutTitle}`);
    
    console.log('\n📍 CONTACT PAGE ANALYSIS');
    // Contact Page - Check if exists
    try {
      await page.goto('http://localhost:3002/contact');
      const contactTitle = await page.title();
      console.log(`Contact Page Title: ${contactTitle}`);
    } catch (error) {
      console.log('Contact page: Not accessible or doesn\'t exist');
    }
    
    console.log('\n📍 BEER PAGES ANALYSIS');
    // Individual Beer Pages - Check if any exist
    const beerPageIds = ['1', '2', '3', 'good-people-ipa', 'avondale-miss-fancy'];
    for (const id of beerPageIds) {
      try {
        const response = await page.goto(`http://localhost:3002/beers/${id}`);
        if (response?.status() === 200) {
          const beerTitle = await page.title();
          console.log(`Beer page /beers/${id} - Title: ${beerTitle}`);
          break;
        }
      } catch (error) {
        console.log(`Beer page /beers/${id}: Not found`);
      }
    }
    
    console.log('\n📍 TECHNICAL PERFORMANCE ANALYSIS');
    // Performance Check
    await page.goto('http://localhost:3002');
    const performanceEntries = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as any;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        loadComplete: navigation.loadEventEnd - navigation.fetchStart,
        firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0
      };
    });
    
    console.log(`DOM Content Loaded: ${Math.round(performanceEntries.domContentLoaded)}ms`);
    console.log(`Page Load Complete: ${Math.round(performanceEntries.loadComplete)}ms`);
    console.log(`First Paint: ${Math.round(performanceEntries.firstPaint)}ms`);
    console.log(`First Contentful Paint: ${Math.round(performanceEntries.firstContentfulPaint)}ms`);
    
    console.log('\n📍 MOBILE RESPONSIVENESS ANALYSIS');
    // Mobile Test
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.screenshot({ path: 'mobile-homepage.png', fullPage: true });
    
    const mobileBodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const mobileViewportWidth = await page.evaluate(() => window.innerWidth);
    console.log(`Mobile Body Width: ${mobileBodyWidth}px`);
    console.log(`Mobile Viewport Width: ${mobileViewportWidth}px`);
    console.log(`Mobile Horizontal Scroll: ${mobileBodyWidth > mobileViewportWidth + 5 ? 'YES (Issue)' : 'NO (Good)'}`);
    
    // Mobile Menu Check
    const mobileMenuButton = await page.locator('button[aria-label*="menu"], .hamburger, .mobile-menu-button').count();
    console.log(`Mobile menu button: ${mobileMenuButton > 0 ? 'Present' : 'Not found'}`);
    
    console.log('\n📍 ERROR HANDLING ANALYSIS');
    // Error Handling
    await page.goto('http://localhost:3002/nonexistent-page');
    const errorPageTitle = await page.title();
    const errorPageContent = await page.locator('body').textContent();
    const isProperErrorHandling = 
      errorPageTitle?.includes('404') || 
      errorPageTitle?.includes('Not Found') ||
      errorPageContent?.includes('404') ||
      errorPageContent?.includes('not found') ||
      page.url() === 'http://localhost:3002/';
    
    console.log(`404 Error Handling: ${isProperErrorHandling ? 'Proper' : 'Needs improvement'}`);
    
    console.log('\n=== END COMPREHENSIVE SITE REVIEW ===');
  });

  test('interactive map detailed analysis', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    console.log('\n📍 INTERACTIVE MAP DETAILED ANALYSIS');
    
    // Find the main map SVG
    const mapSVGs = page.locator('svg').filter({ has: page.locator('path') });
    const mapCount = await mapSVGs.count();
    console.log(`Map SVGs with paths: ${mapCount}`);
    
    if (mapCount > 0) {
      // Take map screenshot
      const mainMap = mapSVGs.first();
      await mainMap.screenshot({ path: 'interactive-map.png' });
      
      // Check for state paths
      const statePaths = await page.locator('svg path[data-state], svg g[data-state], svg path[id*="state"], svg g[id*="state"]').count();
      console.log(`Identified state elements: ${statePaths}`);
      
      // Check for Alabama specifically
      const alabamaPaths = await page.locator('svg path[data-state="alabama"], svg path[data-state="AL"], svg *[id*="alabama"], svg *[id*="AL"]').count();
      console.log(`Alabama map elements: ${alabamaPaths}`);
      
      // Test hover on any path
      const anyPath = page.locator('svg path').first();
      if (await anyPath.count() > 0) {
        await anyPath.hover();
        await page.waitForTimeout(500);
        console.log('Map hover test: Completed');
        
        // Check for tooltip or hover effects
        const tooltips = await page.locator('.tooltip, .state-tooltip, .popup').count();
        console.log(`Tooltips on hover: ${tooltips}`);
      }
    }
  });
});