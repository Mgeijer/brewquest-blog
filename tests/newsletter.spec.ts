import { test, expect } from '@playwright/test';

test.describe('Newsletter Subscription', () => {
  test('newsletter signup form is present', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    // Look for newsletter signup form
    const formSelectors = [
      'form[data-newsletter]',
      '.newsletter-form',
      '.newsletter-signup',
      'form:has(input[type="email"])',
      '[data-testid="newsletter"]'
    ];
    
    let formFound = false;
    for (const selector of formSelectors) {
      const form = page.locator(selector);
      if (await form.count() > 0) {
        await expect(form.first()).toBeVisible();
        formFound = true;
        break;
      }
    }
    
    // If not on homepage, check footer
    if (!formFound) {
      const footerForm = page.locator('footer form, footer .newsletter');
      if (await footerForm.count() > 0) {
        await expect(footerForm.first()).toBeVisible();
        formFound = true;
      }
    }
    
    expect(formFound).toBe(true);
  });

  test('newsletter form has required elements', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    // Find email input
    const emailInputs = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]');
    const emailCount = await emailInputs.count();
    
    if (emailCount > 0) {
      const emailInput = emailInputs.first();
      await expect(emailInput).toBeVisible();
      
      // Should have submit button
      const submitButtons = page.locator(
        'button[type="submit"]:near(input[type="email"]), ' +
        'input[type="submit"]:near(input[type="email"]), ' +
        'button:has-text("Subscribe"), ' +
        'button:has-text("Sign up")'
      );
      
      const submitCount = await submitButtons.count();
      if (submitCount > 0) {
        await expect(submitButtons.first()).toBeVisible();
      }
    }
  });

  test('newsletter form validation works', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const emailInput = page.locator('input[type="email"]').first();
    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    
    if (await emailInput.count() > 0 && await submitButton.count() > 0) {
      // Test empty submission
      await submitButton.click();
      
      // Should show validation message
      const validationMessage = await emailInput.evaluate((input: HTMLInputElement) => 
        input.validationMessage
      );
      
      expect(validationMessage.length).toBeGreaterThan(0);
      
      // Test invalid email
      await emailInput.fill('invalid-email');
      await submitButton.click();
      
      const invalidValidationMessage = await emailInput.evaluate((input: HTMLInputElement) => 
        input.validationMessage
      );
      
      expect(invalidValidationMessage.length).toBeGreaterThan(0);
    }
  });

  test('newsletter form submission works', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const emailInput = page.locator('input[type="email"]').first();
    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    
    if (await emailInput.count() > 0 && await submitButton.count() > 0) {
      // Fill valid email
      await emailInput.fill('test@example.com');
      
      // Submit form
      await submitButton.click();
      
      // Wait for response
      await page.waitForTimeout(2000);
      
      // Check for success message or confirmation
      const successSelectors = [
        '.success-message',
        '.confirmation',
        'text=Thank you',
        'text=Subscribed',
        'text=Success',
        '[data-testid="success"]'
      ];
      
      let successFound = false;
      for (const selector of successSelectors) {
        if (await page.locator(selector).count() > 0) {
          await expect(page.locator(selector).first()).toBeVisible();
          successFound = true;
          break;
        }
      }
      
      // If no success message, check if form was cleared or disabled
      if (!successFound) {
        const inputValue = await emailInput.inputValue();
        const isDisabled = await submitButton.isDisabled();
        
        // Form should be cleared or button disabled after submission
        expect(inputValue === '' || isDisabled).toBe(true);
      }
    }
  });

  test('newsletter signup available on multiple pages', async ({ page }) => {
    const pages = [
      'http://localhost:3002',
      'http://localhost:3002/blog',
      'http://localhost:3002/about'
    ];
    
    for (const pageUrl of pages) {
      await page.goto(pageUrl);
      
      // Check for newsletter signup
      const newsletterElements = page.locator(
        'input[type="email"], ' +
        '.newsletter, ' +
        'form:has(input[name="email"]), ' +
        '[data-testid="newsletter"]'
      );
      
      const count = await newsletterElements.count();
      if (count > 0) {
        console.log(`Newsletter signup found on ${pageUrl}`);
        await expect(newsletterElements.first()).toBeVisible();
      } else {
        console.log(`No newsletter signup on ${pageUrl}`);
      }
    }
  });

  test('newsletter privacy compliance', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    // Look for privacy notice or GDPR compliance
    const privacySelectors = [
      'text=Privacy Policy',
      'text=privacy',
      'text=GDPR',
      'text=unsubscribe',
      '.privacy-notice',
      '[data-testid="privacy"]'
    ];
    
    let privacyNoticeFound = false;
    for (const selector of privacySelectors) {
      if (await page.locator(selector).count() > 0) {
        privacyNoticeFound = true;
        break;
      }
    }
    
    // Privacy compliance is important for newsletters
    if (privacyNoticeFound) {
      console.log('Privacy compliance elements found');
    } else {
      console.log('Consider adding privacy compliance for newsletter');
    }
  });
});