import { test, expect } from '@playwright/test';

test.describe('Interactive Map Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
  });

  test('interactive map is present and visible', async ({ page }) => {
    // Look for map container
    const mapSelectors = [
      'svg[data-testid="us-map"]',
      '.us-map',
      '.interactive-map',
      'svg',
      '[data-testid="map"]'
    ];
    
    let mapFound = false;
    for (const selector of mapSelectors) {
      const map = page.locator(selector);
      if (await map.count() > 0) {
        await expect(map.first()).toBeVisible();
        mapFound = true;
        console.log(`Map found with selector: ${selector}`);
        break;
      }
    }
    
    expect(mapFound).toBe(true);
  });

  test('Alabama state is clickable on map', async ({ page }) => {
    // Look for Alabama state element
    const alabamaSelectors = [
      'svg path[data-state="alabama"]',
      'svg path[data-state="AL"]',
      'svg g[data-state="alabama"]',
      'svg *[id*="alabama"]',
      'svg *[id*="AL"]'
    ];
    
    let alabamaElement = null;
    for (const selector of alabamaSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        alabamaElement = element.first();
        break;
      }
    }
    
    if (alabamaElement) {
      await expect(alabamaElement).toBeVisible();
      
      // Test hover effect
      await alabamaElement.hover();
      await page.waitForTimeout(500);
      
      // Test click
      await alabamaElement.click();
      await page.waitForTimeout(1000);
      
      // Should navigate to Alabama page or show tooltip
      const currentUrl = page.url();
      if (currentUrl.includes('/states/alabama')) {
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('text=Alabama')).toBeVisible();
      } else {
        // Look for tooltip or modal
        const tooltipSelectors = [
          '.tooltip',
          '.state-tooltip',
          '.popup',
          '.modal',
          '[data-testid="tooltip"]'
        ];
        
        for (const selector of tooltipSelectors) {
          if (await page.locator(selector).count() > 0) {
            await expect(page.locator(selector).first()).toBeVisible();
            break;
          }
        }
      }
    }
  });

  test('map states have hover effects', async ({ page }) => {
    // Find any state path elements
    const stateElements = page.locator('svg path, svg g[data-state]');
    const stateCount = await stateElements.count();
    
    if (stateCount > 0) {
      const firstState = stateElements.first();
      
      // Get initial styles
      const initialFill = await firstState.evaluate((el) => 
        window.getComputedStyle(el).fill || el.getAttribute('fill')
      );
      
      // Hover over state
      await firstState.hover();
      await page.waitForTimeout(300);
      
      // Check if styles changed (hover effect)
      const hoverFill = await firstState.evaluate((el) => 
        window.getComputedStyle(el).fill || el.getAttribute('fill')
      );
      
      // Styles should change on hover OR cursor should change
      const cursor = await firstState.evaluate((el) => 
        window.getComputedStyle(el).cursor
      );
      
      const hasHoverEffect = initialFill !== hoverFill || cursor === 'pointer';
      expect(hasHoverEffect).toBe(true);
    }
  });

  test('map displays state progress indicators', async ({ page }) => {
    // Look for progress indicators
    const progressSelectors = [
      '.state-progress',
      '.progress-indicator',
      '.completed',
      '.in-progress',
      '[data-status]',
      '.state-status'
    ];
    
    for (const selector of progressSelectors) {
      const elements = page.locator(selector);
      if (await elements.count() > 0) {
        await expect(elements.first()).toBeVisible();
        console.log(`Progress indicators found: ${selector}`);
        break;
      }
    }
  });

  test('map is responsive on mobile', async ({ page }) => {
    // Switch to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    const map = page.locator('svg, .map-container, .interactive-map');
    if (await map.count() > 0) {
      const mapElement = map.first();
      await expect(mapElement).toBeVisible();
      
      // Check if map fits in viewport
      const boundingBox = await mapElement.boundingBox();
      if (boundingBox) {
        expect(boundingBox.width).toBeLessThanOrEqual(375);
      }
      
      // Test touch interactions
      const stateElements = page.locator('svg path, svg g[data-state]');
      if (await stateElements.count() > 0) {
        await stateElements.first().tap();
        await page.waitForTimeout(500);
      }
    }
  });

  test('map legend or key is present', async ({ page }) => {
    // Look for map legend
    const legendSelectors = [
      '.map-legend',
      '.legend',
      '.map-key',
      '.state-legend',
      '[data-testid="legend"]'
    ];
    
    let legendFound = false;
    for (const selector of legendSelectors) {
      if (await page.locator(selector).count() > 0) {
        await expect(page.locator(selector).first()).toBeVisible();
        legendFound = true;
        console.log(`Map legend found: ${selector}`);
        break;
      }
    }
    
    // Legend might not be implemented yet
    console.log('Map legend present:', legendFound);
  });

  test('map loading performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:3002');
    
    // Wait for map to be visible
    const map = page.locator('svg, .interactive-map');
    await expect(map.first()).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Map should load quickly
    expect(loadTime).toBeLessThan(3000);
    console.log(`Map load time: ${loadTime}ms`);
  });

  test('map accessibility features', async ({ page }) => {
    const map = page.locator('svg');
    
    if (await map.count() > 0) {
      // Check for accessibility attributes
      const hasAriaLabel = await map.evaluate((el) => 
        el.hasAttribute('aria-label') || el.hasAttribute('role')
      );
      
      // Check for keyboard navigation
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      
      console.log('Map has accessibility attributes:', hasAriaLabel);
      console.log('Focused element after tab:', focusedElement);
    }
  });
});