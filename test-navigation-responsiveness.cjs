#!/usr/bin/env node

/**
 * Test Script for Step 3: Navigation & Layout Responsiveness
 * 
 * This script tests:
 * 1. Navigation between Chat, Health, Performance, Docs, and Preferences pages
 * 2. Responsive layout at different viewport sizes (mobile ≤640px, tablet ~768px, desktop ≥1024px)
 * 3. Dark/light theme toggling across all pages
 */

const puppeteer = require('puppeteer');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const PAGES = [
  { name: 'Chat', hash: '#chat' },
  { name: 'Health', hash: '#health' },
  { name: 'Performance', hash: '#performance' },
  { name: 'Docs', hash: '#docs' },
  { name: 'Preferences', hash: '#preferences' }
];

const VIEWPORT_SIZES = [
  { name: 'Mobile', width: 375, height: 667 },      // iPhone SE
  { name: 'Tablet', width: 768, height: 1024 },     // iPad Portrait
  { name: 'Desktop', width: 1024, height: 768 },    // Desktop
  { name: 'Large Desktop', width: 1440, height: 900 } // Large Desktop
];

class NavigationTestRunner {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      navigation: [],
      responsiveness: [],
      themes: [],
      errors: []
    };
  }

  async setup() {
    console.log('🚀 Setting up browser...');
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      slowMo: 50,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    await this.page.setDefaultTimeout(10000);
    
    // Set up console logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });
    
    // Set up error handling
    this.page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
      this.results.errors.push({
        type: 'page-error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    });
  }

  async login() {
    console.log('🔑 Logging in...');
    await this.page.goto(`${BASE_URL}/#login`);
    
    // Wait for login form
    await this.page.waitForSelector('input[type="email"]', { timeout: 5000 });
    
    // Fill in credentials
    await this.page.type('input[type="email"]', 'test@example.com');
    await this.page.type('input[type="password"]', 'password123');
    
    // Submit login
    await this.page.click('button[type="submit"]');
    
    // Wait for redirect to chat page
    await this.page.waitForFunction(() => window.location.hash === '#chat', { timeout: 5000 });
    
    console.log('✅ Login successful');
  }

  async testNavigation() {
    console.log('🧭 Testing navigation...');
    
    for (const pageInfo of PAGES) {
      try {
        console.log(`  Testing navigation to ${pageInfo.name}...`);
        
        // Test URL hash navigation
        await this.page.goto(`${BASE_URL}/${pageInfo.hash}`);
        await this.page.waitForTimeout(1000);
        
        // Verify the page loaded correctly
        const currentHash = await this.page.evaluate(() => window.location.hash);
        const isCorrectPage = currentHash === pageInfo.hash;
        
        // Test sidebar navigation if not on preferences page
        if (pageInfo.hash !== '#preferences') {
          // Click sidebar link
          const sidebarLink = await this.page.$(`a[href="${pageInfo.hash}"]`);
          if (sidebarLink) {
            await sidebarLink.click();
            await this.page.waitForTimeout(500);
          }
        } else {
          // Navigate to preferences via user menu
          await this.page.click('button[class*="flex items-center gap-3 px-4 py-2 w-full"]');
          await this.page.waitForTimeout(500);
          await this.page.click('a[href="#preferences"]');
          await this.page.waitForTimeout(500);
        }
        
        // Check for page-specific content
        let hasContent = false;
        switch (pageInfo.name) {
          case 'Chat':
            hasContent = await this.page.$('.chat-container, [class*="chat"]') !== null;
            break;
          case 'Health':
            hasContent = await this.page.$('text/Health') !== null || 
                        await this.page.$('[class*="health"]') !== null;
            break;
          case 'Performance':
            hasContent = await this.page.$('text/Performance') !== null ||
                        await this.page.$('[class*="performance"]') !== null;
            break;
          case 'Docs':
            hasContent = await this.page.$('text/Documentation') !== null ||
                        await this.page.$('text/Getting Started') !== null;
            break;
          case 'Preferences':
            hasContent = await this.page.$('text/User Preferences') !== null ||
                        await this.page.$('text/Theme') !== null;
            break;
        }
        
        this.results.navigation.push({
          page: pageInfo.name,
          hash: pageInfo.hash,
          urlNavigation: isCorrectPage,
          sidebarNavigation: true,
          contentLoaded: hasContent,
          success: isCorrectPage && hasContent
        });
        
        console.log(`    ✅ ${pageInfo.name} navigation: ${isCorrectPage && hasContent ? 'PASS' : 'FAIL'}`);
        
      } catch (error) {
        console.log(`    ❌ ${pageInfo.name} navigation: FAIL - ${error.message}`);
        this.results.navigation.push({
          page: pageInfo.name,
          hash: pageInfo.hash,
          success: false,
          error: error.message
        });
      }
    }
  }

  async testResponsiveness() {
    console.log('📱 Testing responsive layout...');
    
    for (const viewport of VIEWPORT_SIZES) {
      console.log(`  Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      await this.page.setViewport({
        width: viewport.width,
        height: viewport.height
      });
      
      for (const pageInfo of PAGES) {
        try {
          await this.page.goto(`${BASE_URL}/${pageInfo.hash}`);
          await this.page.waitForTimeout(1000);
          
          // Check for overflow
          const hasOverflow = await this.page.evaluate(() => {
            const body = document.body;
            return body.scrollWidth > body.clientWidth || body.scrollHeight > body.clientHeight;
          });
          
          // Check if sidebar is properly hidden/shown
          const sidebarBehavior = await this.page.evaluate((viewportWidth) => {
            const sidebar = document.querySelector('aside');
            if (!sidebar) return 'not-found';
            
            const styles = window.getComputedStyle(sidebar);
            const isHidden = styles.transform.includes('translateX(-100%)') || 
                           styles.transform.includes('translate3d(-100%') ||
                           styles.display === 'none';
            
            if (viewportWidth < 768) {
              return isHidden ? 'correctly-hidden' : 'incorrectly-visible';
            } else {
              return !isHidden ? 'correctly-visible' : 'incorrectly-hidden';
            }
          }, viewport.width);
          
          // Check for broken layout elements
          const brokenElements = await this.page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            const broken = [];
            
            elements.forEach(el => {
              const rect = el.getBoundingClientRect();
              const styles = window.getComputedStyle(el);
              
              // Check for elements that are too wide
              if (rect.width > window.innerWidth && styles.overflow !== 'hidden') {
                broken.push({
                  element: el.tagName.toLowerCase(),
                  class: el.className,
                  width: rect.width,
                  viewportWidth: window.innerWidth
                });
              }
            });
            
            return broken;
          });
          
          const result = {
            viewport: viewport.name,
            page: pageInfo.name,
            dimensions: `${viewport.width}x${viewport.height}`,
            hasOverflow,
            sidebarBehavior,
            brokenElements: brokenElements.length,
            success: !hasOverflow && sidebarBehavior.includes('correctly') && brokenElements.length === 0
          };
          
          this.results.responsiveness.push(result);
          
          console.log(`    ${result.success ? '✅' : '❌'} ${pageInfo.name} on ${viewport.name}: ${result.success ? 'PASS' : 'FAIL'}`);
          
        } catch (error) {
          console.log(`    ❌ ${pageInfo.name} on ${viewport.name}: ERROR - ${error.message}`);
          this.results.responsiveness.push({
            viewport: viewport.name,
            page: pageInfo.name,
            success: false,
            error: error.message
          });
        }
      }
    }
  }

  async testThemes() {
    console.log('🎨 Testing theme toggling...');
    
    // Reset to desktop viewport
    await this.page.setViewport({ width: 1024, height: 768 });
    
    const themes = ['light', 'dark', 'system'];
    
    for (const theme of themes) {
      console.log(`  Testing ${theme} theme...`);
      
      // Navigate to preferences
      await this.page.goto(`${BASE_URL}/#preferences`);
      await this.page.waitForTimeout(1000);
      
      // Click theme button
      const themeButton = await this.page.$(`button:has-text("${theme.charAt(0).toUpperCase() + theme.slice(1)}")`);
      if (themeButton) {
        await themeButton.click();
        await this.page.waitForTimeout(500);
      } else {
        // Alternative selector method
        await this.page.click(`button[class*="border"]:has-text("${theme.charAt(0).toUpperCase() + theme.slice(1)}")`);
        await this.page.waitForTimeout(500);
      }
      
      // Test theme on all pages
      for (const pageInfo of PAGES) {
        try {
          await this.page.goto(`${BASE_URL}/${pageInfo.hash}`);
          await this.page.waitForTimeout(1000);
          
          // Check if theme is applied
          const themeApplied = await this.page.evaluate((expectedTheme) => {
            const htmlElement = document.documentElement;
            const hasDarkClass = htmlElement.classList.contains('dark');
            
            if (expectedTheme === 'dark') {
              return hasDarkClass;
            } else if (expectedTheme === 'light') {
              return !hasDarkClass;
            } else { // system
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              return hasDarkClass === prefersDark;
            }
          }, theme);
          
          // Check for theme-specific styling
          const hasThemeStyles = await this.page.evaluate(() => {
            const sampleElement = document.querySelector('body, main, .bg-white, .bg-gray-50');
            if (!sampleElement) return false;
            
            const styles = window.getComputedStyle(sampleElement);
            return styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent';
          });
          
          const result = {
            theme,
            page: pageInfo.name,
            themeApplied,
            hasThemeStyles,
            success: themeApplied && hasThemeStyles
          };
          
          this.results.themes.push(result);
          
          console.log(`    ${result.success ? '✅' : '❌'} ${theme} theme on ${pageInfo.name}: ${result.success ? 'PASS' : 'FAIL'}`);
          
        } catch (error) {
          console.log(`    ❌ ${theme} theme on ${pageInfo.name}: ERROR - ${error.message}`);
          this.results.themes.push({
            theme,
            page: pageInfo.name,
            success: false,
            error: error.message
          });
        }
      }
    }
  }

  async generateReport() {
    console.log('\n📊 Generating test report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        navigation: {
          total: this.results.navigation.length,
          passed: this.results.navigation.filter(r => r.success).length,
          failed: this.results.navigation.filter(r => !r.success).length
        },
        responsiveness: {
          total: this.results.responsiveness.length,
          passed: this.results.responsiveness.filter(r => r.success).length,
          failed: this.results.responsiveness.filter(r => !r.success).length
        },
        themes: {
          total: this.results.themes.length,
          passed: this.results.themes.filter(r => r.success).length,
          failed: this.results.themes.filter(r => !r.success).length
        },
        errors: this.results.errors.length
      },
      details: this.results
    };
    
    const reportPath = path.join(__dirname, 'test-report-navigation-responsiveness.json');
    require('fs').writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📋 Test Report Summary:`);
    console.log(`  Navigation: ${report.summary.navigation.passed}/${report.summary.navigation.total} passed`);
    console.log(`  Responsiveness: ${report.summary.responsiveness.passed}/${report.summary.responsiveness.total} passed`);
    console.log(`  Themes: ${report.summary.themes.passed}/${report.summary.themes.total} passed`);
    console.log(`  Errors: ${report.summary.errors}`);
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    return report;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      await this.setup();
      await this.login();
      await this.testNavigation();
      await this.testResponsiveness();
      await this.testThemes();
      
      const report = await this.generateReport();
      
      const allTestsPassed = 
        report.summary.navigation.failed === 0 &&
        report.summary.responsiveness.failed === 0 &&
        report.summary.themes.failed === 0 &&
        report.summary.errors === 0;
      
      console.log(`\n${allTestsPassed ? '🎉 All tests passed!' : '⚠️  Some tests failed.'}`);
      
      return allTestsPassed;
      
    } catch (error) {
      console.error('❌ Test runner error:', error);
      return false;
    } finally {
      await this.cleanup();
    }
  }
}

// Run the tests
if (require.main === module) {
  const runner = new NavigationTestRunner();
  runner.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = NavigationTestRunner;
