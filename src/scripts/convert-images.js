/**
 * Image Conversion Script
 * Converts JPG, JPEG, and PNG images to WebP format
 * 
 * Usage: node convert-images.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if cwebp is installed
try {
  execSync('cwebp -version', { stdio: 'ignore' });
} catch (error) {
  console.error('Error: cwebp is not installed. Please install it first.');
  console.log('You can install it via:');
  console.log('  - On Windows: Download from https://developers.google.com/speed/webp/download');
  console.log('  - On macOS: brew install webp');
  console.log('  - On Linux: sudo apt-get install webp');
  process.exit(1);
}

// Configuration
const imgDir = path.join(__dirname, '..', 'frontend', 'img');
const imageExtensions = ['.jpg', '.jpeg', '.png'];
const quality = 80; // WebP quality (0-100)

// Function to convert an image to WebP
function convertToWebP(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!imageExtensions.includes(ext)) return;
  
  const baseName = path.basename(filePath, ext);
  const dirName = path.dirname(filePath);
  const webpPath = path.join(dirName, `${baseName}.webp`);
  
  // Skip if WebP version already exists
  if (fs.existsSync(webpPath)) {
    console.log(`Skipping ${filePath} (WebP already exists)`);
    return;
  }
  
  try {
    console.log(`Converting ${filePath} to WebP...`);
    execSync(`cwebp -q ${quality} "${filePath}" -o "${webpPath}"`);
    console.log(`Created ${webpPath}`);
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error.message);
  }
}

// Function to process a directory recursively
function processDirectory(directory) {
  const items = fs.readdirSync(directory);
  
  for (const item of items) {
    const itemPath = path.join(directory, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      processDirectory(itemPath);
    } else if (stats.isFile()) {
      convertToWebP(itemPath);
    }
  }
}

// Start processing
console.log('Starting image conversion to WebP...');
processDirectory(imgDir);
console.log('Image conversion completed!');