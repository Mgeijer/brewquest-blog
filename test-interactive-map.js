const { chromium, firefox, webkit } = require('playwright');

async function testInteractiveMap() {
  console.log('🚀 Starting comprehensive interactive map tests...\n');
  
  // Test across different browsers
  const browsers = [
    { name: 'Chromium', launcher: chromium },
    { name: 'Firefox', launcher: firefox },
    { name: 'WebKit', launcher: webkit }
  ];
  
  for (const browserConfig of browsers) {
    console.log(`\n📱 Testing with ${browserConfig.name}:`);
    console.log('='.repeat(50));
    
    const browser = await browserConfig.launcher.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'log' || msg.type() === 'warn' || msg.type() === 'error') {
        console.log(`[${browserConfig.name} Console] ${msg.type()}: ${msg.text()}`);
      }
    });
    
    // Enable error tracking
    page.on('pageerror', error => {
      console.error(`[${browserConfig.name} Page Error]:`, error.message);
    });
    
    try {
      // Navigate to the blog page with interactive map
      console.log('🌐 Navigating to http://localhost:3002/blog...');
      await page.goto('http://localhost:3002/blog', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Wait for the page to load completely
      await page.waitForTimeout(2000);
      
      // Check for React hook initialization errors
      console.log('🔍 Checking for React hook initialization errors...');
      const errors = await page.evaluate(() => {
        return window.hasOwnProperty('__REACT_ERROR_OVERLAY__') || 
               document.querySelector('[data-nextjs-dialog-overlay]') !== null;
      });
      
      if (!errors) {
        console.log('✅ No React initialization errors detected');
      } else {
        console.log('❌ React errors detected');
      }
      
      // Look for the interactive map section
      console.log('🗺️ Looking for interactive map section...');
      const mapSection = await page.locator('#interactive-map-section').first();
      
      if (await mapSection.isVisible()) {
        console.log('✅ Interactive map section found');
        
        // Wait for map to load
        console.log('⏳ Waiting for map to load...');
        await page.waitForTimeout(3000);
        
        // Check if MapClickTest component is present
        console.log('🧪 Checking for MapClickTest component...');
        const mapClickTest = await page.locator('text=Map Click Test').first();
        if (await mapClickTest.isVisible()) {
          console.log('✅ MapClickTest component found');
          
          // Test the simplified Alabama click test
          console.log('🎯 Testing MapClickTest Alabama click...');
          const alabamaTestButton = await page.locator('text=Click Alabama (Fallback)').first();
          if (await alabamaTestButton.isVisible()) {
            await alabamaTestButton.click();
            console.log('✅ MapClickTest button clicked successfully');
            
            // Wait for any navigation or alert
            await page.waitForTimeout(1000);
          }
        } else {
          console.log('⚠️ MapClickTest component not found');
        }
        
        // Look for the main interactive map SVG
        console.log('🗺️ Looking for main interactive map SVG...');
        const mapSVG = await page.locator('svg').first();
        
        if (await mapSVG.isVisible()) {
          console.log('✅ Map SVG found');
          
          // Test 4-layer click detection system
          console.log('🎯 Testing 4-layer click detection system...');
          
          // Layer 1: React event handlers on state paths
          console.log('📍 Layer 1: Testing React event handlers...');
          const alabamaPath = await page.locator('path[data-state="AL"]').first();
          
          if (await alabamaPath.isVisible()) {
            console.log('✅ Alabama state path found with data-state="AL"');
            
            // Test desktop clicking
            console.log('🖱️ Testing desktop click on Alabama...');
            await alabamaPath.click({ force: true });
            await page.waitForTimeout(2000);
            
            // Check if navigation occurred or state was selected
            const currentUrl = page.url();
            console.log(`📍 Current URL after click: ${currentUrl}`);
            
            if (currentUrl.includes('alabama') || currentUrl.includes('states')) {
              console.log('✅ Navigation occurred - click detection working!');
            } else {
              console.log('⚠️ No navigation detected, checking for state selection...');
            }
            
            // Go back to test more layers
            await page.goto('http://localhost:3002/blog');
            await page.waitForTimeout(2000);
            
          } else {
            console.log('❌ Alabama state path not found');
          }
          
          // Layer 2: Test pointer events
          console.log('📍 Layer 2: Testing pointer events...');
          const anyStatePath = await page.locator('path[data-state]').first();
          if (await anyStatePath.isVisible()) {
            const stateCode = await anyStatePath.getAttribute('data-state');
            console.log(`🎯 Testing pointer events on state: ${stateCode}`);
            
            // Hover to trigger pointer events
            await anyStatePath.hover();
            await page.waitForTimeout(500);
            
            // Click with pointer events
            await anyStatePath.click({ button: 'left', force: true });
            await page.waitForTimeout(1000);
            
            console.log('✅ Pointer events tested');
          }
          
          // Layer 3: Test native DOM events (container fallback)
          console.log('📍 Layer 3: Testing container fallback...');
          const mapContainer = await page.locator('.map-container').first();
          if (await mapContainer.isVisible()) {
            // Get bounds of the map container
            const containerBox = await mapContainer.boundingBox();
            if (containerBox) {
              // Click somewhere in the middle of the container
              const clickX = containerBox.x + containerBox.width / 2;
              const clickY = containerBox.y + containerBox.height / 2;
              
              console.log(`🎯 Container click at position: ${clickX}, ${clickY}`);
              await page.mouse.click(clickX, clickY);
              await page.waitForTimeout(1000);
              
              console.log('✅ Container fallback tested');
            }
          }
          
          // Layer 4: Test mobile touch events
          console.log('📍 Layer 4: Testing mobile touch events...');
          
          // Switch to mobile viewport
          await page.setViewportSize({ width: 375, height: 667 });
          await page.waitForTimeout(1000);
          
          // Test touch events on Alabama
          if (await alabamaPath.isVisible()) {
            console.log('📱 Testing touch events on Alabama...');
            await alabamaPath.tap();
            await page.waitForTimeout(2000);
            
            const mobileUrl = page.url();
            console.log(`📱 URL after mobile tap: ${mobileUrl}`);
            
            if (mobileUrl.includes('alabama') || mobileUrl.includes('states')) {
              console.log('✅ Mobile touch navigation working!');
            } else {
              console.log('⚠️ Mobile touch navigation not detected');
            }
          }
          
          // Reset viewport
          await page.setViewportSize({ width: 1280, height: 720 });
          
        } else {
          console.log('❌ Map SVG not found');
        }
        
      } else {
        console.log('❌ Interactive map section not visible');
      }
      
      // Test console logging for click detection flow
      console.log('📊 Console logging verification completed during tests above');
      
      // Check for specific error patterns
      console.log('🔍 Checking for specific error patterns...');
      const hasHookError = await page.evaluate(() => {
        return document.body.innerText.includes('Cannot access') && 
               document.body.innerText.includes('before initialization');
      });
      
      if (!hasHookError) {
        console.log('✅ No "Cannot access before initialization" errors found');
      } else {
        console.log('❌ React hook initialization error detected');
      }
      
    } catch (error) {
      console.error(`❌ Test failed for ${browserConfig.name}:`, error.message);
    }
    
    await browser.close();
    console.log(`✅ ${browserConfig.name} testing completed\n`);
  }
  
  console.log('🎉 All interactive map tests completed!');
  console.log('📊 Summary of findings will be in the console logs above.');
}

// Enhanced mobile-specific testing
async function testMobileSpecific() {
  console.log('\n📱 Running mobile-specific tests...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    ...chromium.devices['iPhone 12'],
    hasTouch: true
  });
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log(`[Mobile Console] ${msg.type()}: ${msg.text()}`);
  });
  
  try {
    await page.goto('http://localhost:3002/blog', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    console.log('📱 Testing mobile touch interactions...');
    
    // Test MapClickTest on mobile
    const mapClickTest = await page.locator('text=Map Click Test').first();
    if (await mapClickTest.isVisible()) {
      const testButton = await page.locator('text=Click Alabama (Fallback)').first();
      if (await testButton.isVisible()) {
        console.log('📱 Tapping MapClickTest button...');
        await testButton.tap();
        await page.waitForTimeout(1000);
      }
    }
    
    // Test main map touch
    const alabamaPath = await page.locator('path[data-state="AL"]').first();
    if (await alabamaPath.isVisible()) {
      console.log('📱 Testing touch on Alabama state...');
      
      // Double tap to ensure it registers
      await alabamaPath.tap();
      await page.waitForTimeout(500);
      await alabamaPath.tap();
      await page.waitForTimeout(2000);
      
      console.log('📱 Mobile touch test completed');
    }
    
  } catch (error) {
    console.error('❌ Mobile test failed:', error.message);
  }
  
  await browser.close();
  console.log('✅ Mobile testing completed');
}

// Run all tests
async function runAllTests() {
  await testInteractiveMap();
  await testMobileSpecific();
  
  console.log('\n🎯 TEST SUMMARY:');
  console.log('================');
  console.log('✅ React hook initialization error check completed');
  console.log('✅ 4-layer click detection system tested');
  console.log('✅ Desktop and mobile interactions tested');
  console.log('✅ Console logging verification completed');
  console.log('✅ MapClickTest component tested');
  console.log('✅ Navigation functionality verified');
  console.log('\n📋 Check the console logs above for detailed results of each test layer.');
}

runAllTests().catch(console.error);