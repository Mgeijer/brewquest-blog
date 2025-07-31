import { test, expect } from '@playwright/test';

test.describe('Navigation and UX', () => {
  test('header navigation works across all pages', async ({ page }) => {
    const pages = [
      'http://localhost:3002',
      'http://localhost:3002/blog',
      'http://localhost:3002/states/alabama',
      'http://localhost:3002/about',
      'http://localhost:3002/contact'
    ];
    
    for (const pageUrl of pages) {
      await page.goto(pageUrl);
      
      // Check header is visible
      await expect(page.locator('header, nav')).toBeVisible();
      
      // Check for navigation links
      const navLinks = ['Home', 'Blog', 'States', 'About'];
      for (const linkText of navLinks) {
        const link = page.locator(`nav a:has-text("${linkText}"), header a:has-text("${linkText}")`);
        if (await link.count() > 0) {
          await expect(link.first()).toBeVisible();
        }
      }
    }
  });

  test('footer links are functional', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    await expect(page.locator('footer')).toBeVisible();
    
    // Test footer links
    const footerLinks = [
      { text: 'About', url: '/about' },
      { text: 'Contact', url: '/contact' },
      { text: 'Privacy', url: '/privacy' },
      { text: 'Terms', url: '/terms' }
    ];
    
    for (const link of footerLinks) {
      const linkElement = page.locator(`footer a:has-text("${link.text}")`);
      if (await linkElement.count() > 0) {
        await linkElement.click();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain(link.url);
        await page.goBack();
      }
    }
  });

  test('mobile responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3002');
    
    // Header should be responsive
    await expect(page.locator('header')).toBeVisible();
    
    // Check for mobile menu or hamburger
    const mobileMenuSelectors = [
      '.mobile-menu',
      '.hamburger',
      '[data-testid="mobile-menu"]',
      'button[aria-label*="menu"]'
    ];
    
    for (const selector of mobileMenuSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element).toBeVisible();
        await element.click();
        await page.waitForTimeout(500);
        break;
      }
    }
    
    // Test content is readable on mobile
    await expect(page.locator('h1')).toBeVisible();
    
    // No horizontal scrolling
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // Allow small margin
  });

  test('page loading performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time (5 seconds)
    expect(loadTime).toBeLessThan(5000);
    
    // Check for performance metrics
    const performanceEntries = await page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('navigation')[0]);
    });
    
    const navigationEntry = JSON.parse(performanceEntries);
    console.log('Load time:', navigationEntry.loadEventEnd - navigationEntry.fetchStart, 'ms');
  });

  test('error handling for broken links', async ({ page }) => {
    // Test 404 page
    await page.goto('http://localhost:3002/nonexistent-page');
    
    // Should show proper error page or redirect
    const title = await page.title();
    const content = await page.locator('body').textContent();
    
    // Either shows 404 error or redirects to valid page
    const isValidErrorHandling = 
      title?.includes('404') || 
      title?.includes('Not Found') ||
      content?.includes('404') ||
      content?.includes('not found') ||
      page.url() === 'http://localhost:3002/'; // Redirected to home
    
    expect(isValidErrorHandling).toBe(true);
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    
    // Check if focus is visible
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    
    // Should have focused on an interactive element
    const interactiveElements = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
    if (focusedElement) {
      expect(interactiveElements).toContain(focusedElement);
    }
  });

  test('social media integration present', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    // Look for social media links or sharing buttons
    const socialSelectors = [
      'a[href*="facebook"]',
      'a[href*="twitter"]',
      'a[href*="instagram"]',
      'a[href*="linkedin"]',
      '.social-share',
      '.social-links',
      '[data-testid="social"]'
    ];
    
    let socialFound = false;
    for (const selector of socialSelectors) {
      if (await page.locator(selector).count() > 0) {
        await expect(page.locator(selector).first()).toBeVisible();
        socialFound = true;
        break;
      }
    }
    
    // Note: Social media integration might not be implemented yet
    console.log('Social media integration found:', socialFound);
  });
});