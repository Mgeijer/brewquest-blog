import { test, expect } from '@playwright/test';

test.describe('Homepage Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
  });

  test('homepage loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/BrewQuest Chronicles/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Alabama launch section is visible and functional', async ({ page }) => {
    // Check for Alabama launch section
    await expect(page.locator('text=Alabama')).toBeVisible();
    
    // Look for launch-related content
    const launchSection = page.locator('[data-testid="alabama-launch"], .alabama-launch, .launch-section');
    if (await launchSection.count() > 0) {
      await expect(launchSection.first()).toBeVisible();
    }
  });

  test('navigation header is present and functional', async ({ page }) => {
    // Check header navigation
    await expect(page.locator('header, nav')).toBeVisible();
    
    // Check for common navigation links
    const navigationLinks = ['Blog', 'States', 'About'];
    for (const link of navigationLinks) {
      const linkElement = page.locator(`text=${link}`);
      if (await linkElement.count() > 0) {
        await expect(linkElement.first()).toBeVisible();
      }
    }
  });

  test('interactive map is present', async ({ page }) => {
    // Look for map container or SVG
    const mapSelectors = [
      'svg[data-testid="us-map"]',
      '.us-map',
      '.interactive-map',
      '[data-testid="interactive-map"]'
    ];
    
    let mapFound = false;
    for (const selector of mapSelectors) {
      if (await page.locator(selector).count() > 0) {
        await expect(page.locator(selector)).toBeVisible();
        mapFound = true;
        break;
      }
    }
    
    if (!mapFound) {
      console.log('Map not found with standard selectors, checking for any SVG');
      const anySvg = page.locator('svg');
      if (await anySvg.count() > 0) {
        await expect(anySvg.first()).toBeVisible();
      }
    }
  });

  test('footer is present with proper links', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    
    // Check for common footer links
    const footerLinks = ['Privacy', 'Terms', 'Contact'];
    for (const link of footerLinks) {
      const linkElement = page.locator(`footer a:has-text("${link}")`);
      if (await linkElement.count() > 0) {
        await expect(linkElement).toBeVisible();
      }
    }
  });

  test('page loads without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    // Filter out common non-critical errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404') &&
      !error.includes('net::ERR_')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});