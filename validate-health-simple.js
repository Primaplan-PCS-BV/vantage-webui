import puppeteer from 'puppeteer';

// Simplified Health Dashboard validation script
async function validateHealthDashboard() {
  console.log('🚀 Starting Health Dashboard Validation...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Keep browser open to see results
    devtools: true,  // Open DevTools
    defaultViewport: { width: 1280, height: 800 }
  });
  
  const page = await browser.newPage();
  
  // Monitor network requests
  const networkRequests = [];
  await page.setRequestInterception(true);
  
  page.on('request', (req) => {
    const url = req.url();
    if (url.includes('/health') || url.includes('/p6/status')) {
      networkRequests.push({
        url: url,
        method: req.method(),
        timestamp: Date.now()
      });
      console.log(`📡 Network: ${req.method()} ${url}`);
    }
    req.continue();
  });
  
  try {
    console.log('1️⃣  Opening Health page...');
    await page.goto('http://localhost:5174/#health', { waitUntil: 'networkidle2' });
    
    // Wait for page to load
    await page.waitForSelector('h2', { timeout: 10000 });
    console.log('✅ Health page loaded');
    
    // Step 1: Check service cards
    console.log('\n2️⃣  Checking service cards...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for data to load
    
    const serviceCards = await page.evaluate(() => {
      const cards = document.querySelectorAll('.grid > div');
      return Array.from(cards).map(card => {
        const serviceName = card.querySelector('h4')?.textContent || 'Unknown';
        const statusBadge = card.querySelector('.inline-flex')?.textContent || 'No badge';
        const hasIcon = !!card.querySelector('svg');
        const statusColors = card.querySelector('.inline-flex')?.className || '';
        
        return {
          serviceName,
          statusBadge,
          hasIcon,
          hasStatusColor: statusColors.includes('bg-green') || statusColors.includes('bg-yellow') || 
                         statusColors.includes('bg-red') || statusColors.includes('bg-gray')
        };
      });
    });
    
    console.log('Service Cards Found:');
    serviceCards.forEach((card, i) => {
      console.log(`  ${i + 1}. ${card.serviceName} - Status: ${card.statusBadge}`);
      console.log(`     Icon: ${card.hasIcon ? '✅' : '❌'} | Status Color: ${card.hasStatusColor ? '✅' : '❌'}`);
    });
    
    // Step 2: Test auto-refresh
    console.log('\n3️⃣  Testing auto-refresh...');
    
    const autoRefreshState = await page.evaluate(() => {
      const checkbox = document.querySelector('input[type="checkbox"]');
      const select = document.querySelector('select');
      
      if (checkbox && !checkbox.checked) {
        checkbox.click();
      }
      
      if (select) {
        select.value = '10';
        select.dispatchEvent(new Event('change'));
      }
      
      return {
        checkboxExists: !!checkbox,
        selectExists: !!select,
        isChecked: checkbox?.checked || false
      };
    });
    
    console.log(`Auto-refresh checkbox: ${autoRefreshState.checkboxExists ? '✅' : '❌'}`);
    console.log(`Interval selector: ${autoRefreshState.selectExists ? '✅' : '❌'}`);
    console.log(`Auto-refresh enabled: ${autoRefreshState.isChecked ? '✅' : '❌'}`);
    
    // Monitor for periodic requests
    console.log('🕐 Monitoring for 15 seconds...');
    const startMonitoring = Date.now();
    networkRequests.length = 0; // Clear previous requests
    
    await new Promise(resolve => setTimeout(resolve, 15000)); // Wait 15 seconds
    
    const periodicRequests = networkRequests.filter(req => req.timestamp > startMonitoring);
    console.log(`Periodic requests detected: ${periodicRequests.length}`);
    
    // Step 3: Test manual refresh
    console.log('\n4️⃣  Testing manual refresh...');
    
    networkRequests.length = 0; // Clear requests
    
    const refreshClicked = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent.includes('Refresh')) {
          btn.click();
          return true;
        }
      }
      return false;
    });
    
    if (refreshClicked) {
      console.log('✅ Refresh button clicked');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const immediateRequests = networkRequests.length;
      console.log(`Immediate requests after refresh: ${immediateRequests}`);
    } else {
      console.log('❌ Refresh button not found');
    }
    
    // Step 4: Test fetch override
    console.log('\n5️⃣  Testing fetch override...');
    
    await page.evaluate(() => {
      // Override fetch in browser console
      window.originalFetch = window.fetch;
      window.fetch = () => Promise.resolve(new Response(JSON.stringify({status:'UNHEALTHY'}), {
        headers: { 'Content-Type': 'application/json' }
      }));
      console.log('Fetch overridden to return UNHEALTHY');
    });
    
    // Trigger another refresh
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent.includes('Refresh')) {
          btn.click();
          break;
        }
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check for error/unhealthy indicators
    const hasErrorIndicators = await page.evaluate(() => {
      const errorElements = document.querySelectorAll('.text-red-600, .bg-red-100, .text-red-700');
      return errorElements.length > 0;
    });
    
    console.log(`UI shows error indicators: ${hasErrorIndicators ? '✅' : '⚠️'}`);
    
    // Restore fetch
    await page.evaluate(() => {
      if (window.originalFetch) {
        window.fetch = window.originalFetch;
        console.log('Fetch restored');
      }
    });
    
    // Step 5: Check debug section
    console.log('\n6️⃣  Checking debug section...');
    
    const debugInfo = await page.evaluate(() => {
      const details = document.querySelector('details');
      if (!details) return { exists: false };
      
      const summary = details.querySelector('summary')?.textContent || '';
      details.open = true; // Expand it
      const pre = details.querySelector('pre')?.textContent || '';
      
      return {
        exists: true,
        summaryText: summary,
        hasContent: pre.length > 0,
        preview: pre.substring(0, 100) + '...'
      };
    });
    
    console.log(`Debug section: ${debugInfo.exists ? '✅' : '❌'}`);
    if (debugInfo.exists) {
      console.log(`Summary: ${debugInfo.summaryText}`);
      console.log(`Has content: ${debugInfo.hasContent ? '✅' : '❌'}`);
      if (debugInfo.hasContent) {
        console.log(`Preview: ${debugInfo.preview}`);
      }
    }
    
    // Summary
    console.log('\n📋 VALIDATION SUMMARY');
    console.log('===================');
    console.log(`✅ Service cards: ${serviceCards.length} found`);
    console.log(`✅ Status badges: ${serviceCards.filter(c => c.hasStatusColor).length}/${serviceCards.length} with colors`);
    console.log(`✅ Auto-refresh: ${autoRefreshState.checkboxExists && autoRefreshState.selectExists ? 'Available' : 'Missing'}`);
    console.log(`✅ Network monitoring: ${periodicRequests.length > 0 ? 'Periodic requests detected' : 'No periodic requests'}`);
    console.log(`✅ Manual refresh: ${refreshClicked ? 'Working' : 'Not found'}`);
    console.log(`✅ Fetch override: Capability demonstrated`);
    console.log(`✅ Debug mode: ${debugInfo.exists ? 'Available' : 'Not found'}`);
    
    console.log('\n🎉 Validation completed!');
    console.log('\n👀 Browser kept open for manual inspection...');
    console.log('You can now:');
    console.log('- Open DevTools → Network tab');
    console.log('- Test auto-refresh with different intervals');
    console.log('- Run console commands: window.fetch = () => Promise.resolve(new Response(JSON.stringify({status:"UNHEALTHY"})))');
    console.log('- Inspect the debug data section');
    
    // Keep browser open
    await new Promise(resolve => {
      console.log('\nPress Ctrl+C to close the browser and exit...');
      process.on('SIGINT', () => {
        console.log('\n👋 Closing browser...');
        browser.close().then(resolve);
      });
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await browser.close();
  }
}

// Run validation
validateHealthDashboard().catch(console.error);
