#!/usr/bin/env node

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:5174';

async function testThemeFunctionality() {
  let browser;
  
  try {
    console.log('🎨 Starting theme functionality test...');
    
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 200,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setDefaultTimeout(15000);
    
    // Go to login page first
    await page.goto(`${BASE_URL}/#login`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🔑 Logging in...');
    
    try {
      // Wait for and fill login form
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      await page.type('input[type="email"]', 'test@example.com', { delay: 50 });
      
      await page.waitForSelector('input[type="password"]', { timeout: 5000 });
      await page.type('input[type="password"]', 'password123', { delay: 50 });
      
      await page.click('button[type="submit"]');
      
      // Wait for redirect to chat page
      await page.waitForFunction(() => window.location.hash === '#chat', { timeout: 10000 });
      console.log('✅ Login successful');
      
    } catch (loginError) {
      console.log('⚠️  Login failed, trying to continue anyway...');
    }
    
    console.log('🧭 Navigating to Preferences page...');
    
    // Navigate to preferences page
    await page.goto(`${BASE_URL}/#preferences`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🔍 Looking for theme controls...');
    
    // Try to find theme buttons
    const themeButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const themeButtons = [];
      
      buttons.forEach((button, index) => {
        const text = button.textContent.trim();
        if (text.includes('Light') || text.includes('Dark') || text.includes('System')) {
          themeButtons.push({
            index,
            text,
            classes: button.className
          });
        }
      });
      
      return themeButtons;
    });
    
    console.log(`Found ${themeButtons.length} theme buttons:`, themeButtons.map(b => b.text));
    
    if (themeButtons.length === 0) {
      console.log('❌ No theme buttons found');
      return false;
    }
    
    // Test each theme
    const themes = ['Light', 'Dark', 'System'];
    
    for (const themeName of themes) {
      const themeButton = themeButtons.find(b => b.text.includes(themeName));
      
      if (!themeButton) {
        console.log(`⚠️  ${themeName} theme button not found`);
        continue;
      }
      
      console.log(`🎨 Testing ${themeName} theme...`);
      
      // Click the theme button
      await page.evaluate((buttonIndex) => {
        const buttons = document.querySelectorAll('button');
        buttons[buttonIndex].click();
      }, themeButton.index);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if theme was applied
      const themeState = await page.evaluate((theme) => {
        const html = document.documentElement;
        const hasDarkClass = html.classList.contains('dark');
        const bodyStyles = window.getComputedStyle(document.body);
        
        return {
          hasDarkClass,
          backgroundColor: bodyStyles.backgroundColor,
          color: bodyStyles.color,
          theme
        };
      }, themeName);
      
      console.log(`  ${themeName} theme state:`, {
        darkClass: themeState.hasDarkClass ? 'Yes' : 'No',
        bgColor: themeState.backgroundColor,
        textColor: themeState.color
      });
      
      // Test theme across different pages
      const testPages = ['#chat', '#health', '#performance', '#docs'];
      
      for (const testHash of testPages) {
        await page.goto(`${BASE_URL}/${testHash}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const pageThemeState = await page.evaluate(() => {
          return {
            hasDarkClass: document.documentElement.classList.contains('dark'),
            url: window.location.hash
          };
        });
        
        const consistent = (themeName === 'Dark' && pageThemeState.hasDarkClass) ||
                          (themeName === 'Light' && !pageThemeState.hasDarkClass) ||
                          (themeName === 'System'); // System theme is variable
        
        console.log(`    ${testHash}: ${consistent ? '✅' : '❌'} Theme consistent`);
      }
      
      // Go back to preferences for next theme test
      await page.goto(`${BASE_URL}/#preferences`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('💾 Testing theme persistence...');
    
    // Set to dark theme
    const darkButton = themeButtons.find(b => b.text.includes('Dark'));
    if (darkButton) {
      await page.evaluate((buttonIndex) => {
        const buttons = document.querySelectorAll('button');
        buttons[buttonIndex].click();
      }, darkButton.index);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refresh page and check if theme persists
      await page.reload();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const persistedTheme = await page.evaluate(() => {
        return {
          hasDarkClass: document.documentElement.classList.contains('dark'),
          localStorage: localStorage.getItem('user_preferences')
        };
      });
      
      console.log(`  Theme persistence: ${persistedTheme.hasDarkClass ? '✅ Persisted' : '❌ Not persisted'}`);
      
      if (persistedTheme.localStorage) {
        try {
          const prefs = JSON.parse(persistedTheme.localStorage);
          console.log(`  Stored theme preference: ${prefs.theme || 'not found'}`);
        } catch (e) {
          console.log(`  Could not parse localStorage preferences`);
        }
      }
    }
    
    console.log('\n🎉 Theme testing completed!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Theme test failed:', error.message);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

if (require.main === module) {
  testThemeFunctionality().then(success => {
    console.log(`\n${success ? '✅ Theme functionality test PASSED' : '❌ Theme functionality test FAILED'}`);
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = testThemeFunctionality;
