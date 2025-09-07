/**
 * Responsive Image Testing Script
 * Tests image optimizations across different screen sizes
 * 
 * Usage: node test-responsive-images.js
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const viewports = [
  { width: 375, height: 667, name: 'mobile' },  // iPhone SE
  { width: 768, height: 1024, name: 'tablet' },  // iPad
  { width: 1366, height: 768, name: 'laptop' },  // Laptop
  { width: 1920, height: 1080, name: 'desktop' } // Desktop
];

const pagesToTest = [
  { url: 'http://localhost:5000/team.html', name: 'team' },
  { url: 'http://localhost:5000/index.html', name: 'index' },
  { url: 'http://localhost:5000/about.html', name: 'about' },
  { url: 'http://localhost:5000/edition1.html', name: 'edition1' },
  { url: 'http://localhost:5000/contact.html', name: 'contact' }
];

const outputDir = path.join(__dirname, 'test-results');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Main test function
async function testResponsiveImages() {
  console.log('Starting responsive image testing...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Enable request interception to track image loading
  await page.setRequestInterception(true);
  
  const imageStats = {};
  
  page.on('request', request => {
    request.continue();
  });
  
  page.on('response', response => {
    const url = response.url();
    const contentType = response.headers()['content-type'] || '';
    
    if (contentType.includes('image')) {
      const fileType = contentType.split('/')[1];
      const size = parseInt(response.headers()['content-length'] || '0', 10);
      
      if (!imageStats[url]) {
        imageStats[url] = {
          type: fileType,
          size: size,
          count: 1
        };
      } else {
        imageStats[url].count++;
      }
    }
  });
  
  // Test each page at each viewport size
  for (const pageConfig of pagesToTest) {
    console.log(`Testing page: ${pageConfig.name}`);
    
    for (const viewport of viewports) {
      console.log(`  At viewport: ${viewport.width}x${viewport.height} (${viewport.name})`);
      
      // Set viewport size
      await page.setViewport({
        width: viewport.width,
        height: viewport.height
      });
      
      // Navigate to the page
      await page.goto(pageConfig.url, { waitUntil: 'networkidle2' });
      
      // Take a screenshot
      const screenshotPath = path.join(outputDir, `${pageConfig.name}-${viewport.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`  Screenshot saved to: ${screenshotPath}`);
      
      // Measure image sizes and loading times
      const imageSizes = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.map(img => ({
          src: img.src,
          displayWidth: img.clientWidth,
          displayHeight: img.clientHeight,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          className: img.className,
          isWebP: img.src.toLowerCase().endsWith('.webp')
        }));
      });
      
      // Log image information
      console.log(`  Found ${imageSizes.length} images on the page`);
      
      // Save image data to JSON file
      const dataPath = path.join(outputDir, `${pageConfig.name}-${viewport.name}-data.json`);
      fs.writeFileSync(dataPath, JSON.stringify({
        page: pageConfig.name,
        viewport: viewport,
        images: imageSizes
      }, null, 2));
    }
  }
  
  // Log image statistics
  console.log('\nImage Statistics:');
  console.log('----------------');
  
  let webpCount = 0;
  let jpgCount = 0;
  let pngCount = 0;
  let otherCount = 0;
  
  let webpSize = 0;
  let jpgSize = 0;
  let pngSize = 0;
  let otherSize = 0;
  
  for (const [url, stats] of Object.entries(imageStats)) {
    if (stats.type === 'webp') {
      webpCount++;
      webpSize += stats.size;
    } else if (['jpg', 'jpeg'].includes(stats.type)) {
      jpgCount++;
      jpgSize += stats.size;
    } else if (stats.type === 'png') {
      pngCount++;
      pngSize += stats.size;
    } else {
      otherCount++;
      otherSize += stats.size;
    }
  }
  
  console.log(`WebP images: ${webpCount} (${formatBytes(webpSize)})`);
  console.log(`JPG images: ${jpgCount} (${formatBytes(jpgSize)})`);
  console.log(`PNG images: ${pngCount} (${formatBytes(pngSize)})`);
  console.log(`Other images: ${otherCount} (${formatBytes(otherSize)})`);
  
  const totalSize = webpSize + jpgSize + pngSize + otherSize;
  console.log(`\nTotal image size: ${formatBytes(totalSize)}`);
  
  // Close the browser
  await browser.close();
  console.log('\nTesting completed!');
}

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Run the tests
testResponsiveImages().catch(error => {
  console.error('Error during testing:', error);
  process.exit(1);
});