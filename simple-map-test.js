const { chromium } = require('playwright');

async function testInteractiveMapSimple() {
  console.log('🚀 Starting simplified interactive map test...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
  });
  
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    bypassCSP: true
  });
  
  const page = await context.newPage();
  
  // Enable comprehensive console logging
  page.on('console', msg => {
    const type = msg.type();
    if (['log', 'warn', 'error', 'info'].includes(type)) {
      console.log(`[Browser ${type.toUpperCase()}] ${msg.text()}`);
    }
  });
  
  // Track page errors
  page.on('pageerror', error => {
    console.error('[PAGE ERROR]', error.message);
  });
  
  // Track network failures
  page.on('requestfailed', request => {
    console.warn('[NETWORK FAILED]', request.url(), request.failure()?.errorText);
  });
  
  try {
    console.log('🌐 Navigating to blog page...');
    await page.goto('http://localhost:3002/blog', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    console.log('⏳ Waiting for page to settle...');
    await page.waitForTimeout(3000);
    
    // Check for React errors
    console.log('🔍 Checking for React hook initialization errors...');
    const hasReactError = await page.evaluate(() => {
      const errorPatterns = [
        'Cannot access',
        'before initialization',
        'ReferenceError',
        'handleStateClick'
      ];
      
      const bodyText = document.body.innerText || '';
      const consoleErrors = window.console?.error || [];
      
      return errorPatterns.some(pattern => 
        bodyText.includes(pattern) || 
        JSON.stringify(consoleErrors).includes(pattern)
      );
    });
    
    if (hasReactError) {
      console.log('❌ React hook initialization error detected');
    } else {
      console.log('✅ No React hook initialization errors found');
    }
    
    // Look for the interactive map section
    console.log('🗺️ Searching for interactive map...');
    
    // Try multiple selectors to find the map
    const mapSelectors = [
      '#interactive-map-section',
      '.map-container',
      'svg',
      '[data-testid="interactive-map"]'
    ];
    
    let mapFound = false;
    for (const selector of mapSelectors) {
      const element = await page.locator(selector).first();
      if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log(`✅ Map found with selector: ${selector}`);
        mapFound = true;
        break;
      }
    }
    
    if (!mapFound) {
      console.log('❌ Interactive map not found, checking page content...');
      const pageContent = await page.evaluate(() => {
        return {
          title: document.title,
          headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent).slice(0, 5),
          hasInteractiveSection: document.querySelector('#interactive-map-section') !== null,
          hasSVG: document.querySelector('svg') !== null,
          bodyText: document.body.innerText.substring(0, 500) + '...'
        };
      });
      console.log('📄 Page content:', JSON.stringify(pageContent, null, 2));
      return;
    }
    
    // Test MapClickTest component
    console.log('🧪 Testing MapClickTest component...');
    const mapClickTestButton = page.locator('text="Click Alabama (Fallback)"');
    if (await mapClickTestButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('✅ MapClickTest component found');
      
      // Test button click
      console.log('🎯 Clicking MapClickTest button...');
      await mapClickTestButton.click();
      await page.waitForTimeout(1000);
      
      // Check if alert appeared (it will be dismissed automatically)
      console.log('✅ MapClickTest button clicked');
      
      // Wait for potential navigation
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      console.log(`📍 Current URL after button click: ${currentUrl}`);
      
      if (currentUrl.includes('alabama') || currentUrl.includes('states')) {
        console.log('✅ Navigation to Alabama page detected!');
      } else {
        console.log('⚠️ No navigation detected, checking for other responses...');
      }
      
      // Go back to continue testing
      if (currentUrl.includes('alabama') || currentUrl.includes('states')) {
        await page.goBack();
        await page.waitForTimeout(2000);
      }
    } else {
      console.log('⚠️ MapClickTest component not found');
    }
    
    // Test main interactive map
    console.log('🗺️ Testing main interactive map...');
    
    // Look for Alabama state path
    const alabamaSelectors = [
      'path[data-state="AL"]',
      'path[data-state="al"]',
      'path[data-state="Alabama"]',
      '[data-state="AL"]'
    ];
    
    let alabamaFound = false;
    let alabamaElement = null;
    
    for (const selector of alabamaSelectors) {
      alabamaElement = page.locator(selector).first();
      if (await alabamaElement.isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log(`✅ Alabama state found with selector: ${selector}`);
        alabamaFound = true;
        break;
      }
    }
    
    if (alabamaFound && alabamaElement) {
      console.log('🎯 Testing Alabama state click...');
      
      // Try clicking Alabama with different methods
      const clickMethods = [
        { name: 'Standard Click', method: () => alabamaElement.click() },
        { name: 'Force Click', method: () => alabamaElement.click({ force: true }) },
        { name: 'Click with Position', method: async () => {
          const box = await alabamaElement.boundingBox();
          if (box) {
            await page.mouse.click(box.x + box.width/2, box.y + box.height/2);
          }
        }}
      ];
      
      for (const clickMethod of clickMethods) {
        try {
          console.log(`🖱️ Trying ${clickMethod.name}...`);
          await clickMethod.method();
          await page.waitForTimeout(2000);
          
          const urlAfterClick = page.url();
          console.log(`📍 URL after ${clickMethod.name}: ${urlAfterClick}`);
          
          if (urlAfterClick.includes('alabama') || urlAfterClick.includes('states')) {
            console.log(`✅ ${clickMethod.name} successful - navigation detected!`);
            
            // Go back for next test
            await page.goBack();
            await page.waitForTimeout(2000);
            break;
          } else {
            console.log(`⚠️ ${clickMethod.name} - no navigation detected`);
          }
        } catch (error) {
          console.log(`❌ ${clickMethod.name} failed:`, error.message);
        }
      }
    } else {
      console.log('❌ Alabama state path not found, checking available states...');
      
      // Check what states are available
      const availableStates = await page.evaluate(() => {
        const statePaths = document.querySelectorAll('path[data-state]');
        return Array.from(statePaths).map(path => ({
          code: path.getAttribute('data-state'),
          visible: path.offsetParent !== null
        })).slice(0, 10); // First 10 states
      });
      
      console.log('📊 Available states:', JSON.stringify(availableStates, null, 2));
      
      // Try clicking any available state
      if (availableStates.length > 0) {
        const firstState = availableStates[0];
        console.log(`🎯 Testing click on first available state: ${firstState.code}`);
        
        const stateElement = page.locator(`path[data-state="${firstState.code}"]`).first();
        await stateElement.click({ force: true });
        await page.waitForTimeout(2000);
        
        const urlAfterStateClick = page.url();
        console.log(`📍 URL after state click: ${urlAfterStateClick}`);
      }
    }
    
    // Test mobile touch events
    console.log('📱 Testing mobile touch events...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    if (alabamaFound && alabamaElement) {
      console.log('📱 Testing tap on Alabama (mobile)...');
      await alabamaElement.tap();
      await page.waitForTimeout(2000);
      
      const mobileUrl = page.url();
      console.log(`📱 Mobile URL after tap: ${mobileUrl}`);
      
      if (mobileUrl.includes('alabama') || mobileUrl.includes('states')) {
        console.log('✅ Mobile touch navigation working!');
      } else {
        console.log('⚠️ Mobile touch navigation not detected');
      }
    }
    
    // Test console logging output
    console.log('📊 Console logging verification: Check logs above for click detection flow');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    console.log('🔄 Keeping browser open for manual inspection...');
    console.log('⏳ Browser will close in 30 seconds...');
    await page.waitForTimeout(30000);
    await browser.close();
  }
  
  console.log('✅ Interactive map test completed');
}

testInteractiveMapSimple().catch(console.error);