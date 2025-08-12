import { test, expect } from '@playwright/test'

test.describe('Alaska Newsletter Email Template', () => {
  test('should display Alaska newsletter preview with proper formatting', async ({ page }) => {
    // Navigate to the Alaska newsletter preview
    await page.goto('/api/newsletter/alaska-preview')
    
    // Wait for the email content to load
    await page.waitForLoadState('networkidle')
    
    // Check if the email renders successfully (should be HTML)
    const bodyContent = await page.content()
    expect(bodyContent).toContain('BrewQuest Chronicles')
    expect(bodyContent).toContain('Alaska\'s Last Frontier Brewing')
    expect(bodyContent).toContain('Week 2')
    
    // Verify Alaska-specific content is present
    expect(bodyContent).toContain('Alaska')
    expect(bodyContent).toContain('Last Frontier')
    expect(bodyContent).toContain('pristine glacial water')
    
    // Check for beer content structure
    expect(bodyContent).toContain('Alaskan Amber')
    expect(bodyContent).toContain('Sockeye Red IPA')
    expect(bodyContent).toContain('Chocolate Coconut Porter')
    
    // Verify Alaska state image is included
    expect(bodyContent).toContain('Alaska.png')
    
    // Check for Alaska-specific features
    expect(bodyContent).toContain('49 Active Breweries')
    expect(bodyContent).toContain('Pristine Glacial Water')
    expect(bodyContent).toContain('Gold Rush Heritage')
    
    // Verify email styling (blue/slate theme)
    expect(bodyContent).toContain('#1e40af') // Alaska blue theme
    expect(bodyContent).toContain('#475569') // Slate theme
    
    // Check for proper email structure
    expect(bodyContent).toContain('unsubscribe')
    expect(bodyContent).toContain('hopharrison.com')
  })

  test('should display Alaska newsletter preview with custom subscriber name', async ({ page }) => {
    // Navigate with custom subscriber name
    await page.goto('/api/newsletter/alaska-preview?name=John%20Smith&week=2')
    
    await page.waitForLoadState('networkidle')
    
    const bodyContent = await page.content()
    expect(bodyContent).toContain('John Smith')
    expect(bodyContent).toContain('Hey John Smith!')
  })

  test('should handle preview generation errors gracefully', async ({ page }) => {
    // Test error handling by navigating to a potential error-inducing endpoint
    const response = await page.goto('/api/newsletter/alaska-preview?invalid=test')
    
    // Should still return some content (either success or error page)
    expect(response?.status()).toBeLessThan(500)
  })

  test('should verify Alaska beer images are accessible', async ({ page }) => {
    await page.goto('/api/newsletter/alaska-preview')
    await page.waitForLoadState('networkidle')
    
    const bodyContent = await page.content()
    
    // Check that Alaska beer images are referenced correctly
    const alaskaBeerImages = [
      'Alaskan%20Amber.png',
      'Sockeye-Red.png',
      'Chocolate%20Coconut%20Porter.jpeg',
      'Belgian%20Triple.jpeg',
      'HooDoo-German%20Kolsch.jpg',
      'Pipeline%20Stout.jpeg'
    ]
    
    for (const image of alaskaBeerImages) {
      expect(bodyContent).toContain(image)
    }
  })

  test('should display mobile-responsive design elements', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/api/newsletter/alaska-preview')
    await page.waitForLoadState('networkidle')
    
    const bodyContent = await page.content()
    
    // Verify mobile-friendly styling is present
    expect(bodyContent).toContain('max-width: 600px')
    expect(bodyContent).toContain('padding')
    expect(bodyContent).toContain('border-radius')
    
    // Check for responsive email structure
    expect(bodyContent).toContain('display: flex')
    expect(bodyContent).toContain('text-align: center')
  })

  test('should include proper email metadata and headers', async ({ page }) => {
    await page.goto('/api/newsletter/alaska-preview')
    await page.waitForLoadState('networkidle')
    
    const bodyContent = await page.content()
    
    // Check for proper HTML email structure
    expect(bodyContent).toContain('<!DOCTYPE html')
    expect(bodyContent).toContain('<html')
    expect(bodyContent).toContain('<head>')
    expect(bodyContent).toContain('<body')
    
    // Verify email-specific elements
    expect(bodyContent).toContain('font-family')
    expect(bodyContent).toContain('text-decoration')
  })

  test('should verify Alaska state color theme consistency', async ({ page }) => {
    await page.goto('/api/newsletter/alaska-preview')
    await page.waitForLoadState('networkidle')
    
    const bodyContent = await page.content()
    
    // Alaska-specific color scheme verification
    const alaskaColors = [
      '#1e40af', // Primary blue
      '#3b82f6', // Secondary blue  
      '#475569', // Slate
      '#f8fafc', // Light background
      '#ffffff'  // White
    ]
    
    for (const color of alaskaColors) {
      expect(bodyContent).toContain(color)
    }
    
    // Ensure no generic beer colors (should use Alaska-specific theme)
    expect(bodyContent).not.toContain('#F59E0B') // Generic beer gold
    expect(bodyContent).not.toContain('#78350F') // Generic brown
  })
})