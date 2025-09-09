#!/usr/bin/env node

/**
 * Build script for minifying CSS and JavaScript files for production
 * Generates source maps for debugging
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = 'src/frontend';
const DIST_DIR = 'dist';

// Ensure dist directory exists
function ensureDistDir() {
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }
  if (!fs.existsSync(`${DIST_DIR}/css`)) {
    fs.mkdirSync(`${DIST_DIR}/css`, { recursive: true });
  }
  if (!fs.existsSync(`${DIST_DIR}/js`)) {
    fs.mkdirSync(`${DIST_DIR}/js`, { recursive: true });
  }
}

// Minify CSS files
function minifyCSS() {
  console.log('Minifying CSS files...');

  const cssFiles = [
    'css/navigation.css',
    'css/portfolio.css',
    'css/pages/theme.unified.css',
    'css/pages/about.css',
    'css/pages/blog.css',
    'css/pages/contact.css',
    'css/pages/editions.css',
    'css/pages/home.css',
    'css/pages/impact.css',
    'css/pages/partners.css',
    'css/pages/team.css'
  ];

  cssFiles.forEach(cssFile => {
    const srcPath = path.join(SRC_DIR, cssFile);
    const distPath = path.join(DIST_DIR, cssFile.replace('.css', '.min.css'));

    if (fs.existsSync(srcPath)) {
      try {
        console.log(`Minifying ${cssFile}...`);
        execSync(`npx postcss "${srcPath}" --use cssnano --map --output "${distPath}"`, {
          stdio: 'inherit'
        });
        console.log(`✓ Minified ${cssFile}`);
      } catch (error) {
        console.error(`✗ Failed to minify ${cssFile}:`, error.message);
      }
    } else {
      console.warn(`⚠ Source file not found: ${srcPath}`);
    }
  });
}

// Minify JavaScript files
function minifyJS() {
  console.log('Minifying JavaScript files...');

  const jsFiles = [
    'js/bundle.js',
    'js/modules/animations.js',
    'js/modules/carousel.js',
    'js/modules/gallery.js',
    'js/modules/index.js',
    'js/modules/navigation.js',
    'js/modules/utils.js',
    'js/modules/webp-support.js'
  ];

  jsFiles.forEach(jsFile => {
    const srcPath = path.join(SRC_DIR, jsFile);
    const distPath = path.join(DIST_DIR, jsFile.replace('.js', '.min.js'));

    if (fs.existsSync(srcPath)) {
      try {
        console.log(`Minifying ${jsFile}...`);
        execSync(`npx terser "${srcPath}" --compress --mangle --source-map "url='${path.basename(distPath)}.map'" --output "${distPath}"`, {
          stdio: 'inherit'
        });
        console.log(`✓ Minified ${jsFile}`);
      } catch (error) {
        console.error(`✗ Failed to minify ${jsFile}:`, error.message);
      }
    } else {
      console.warn(`⚠ Source file not found: ${srcPath}`);
    }
  });
}

// Copy HTML files and update references
function updateHTMLFiles() {
  console.log('Updating HTML files with minified references...');

  const htmlFiles = [
    'index.html',
    'about.html',
    'team.html',
    'contact.html',
    'blog.html',
    'privacy.html',
    'terms.html',
    'accessibility.html',
    'editions/edition1.html',
    'editions/edition2.html',
    'editions/impact.html',
    'portfolios/theory.html',
    'portfolios/infrastructure.html',
    'portfolios/cinema.html',
    'portfolios/healing.html'
  ];

  htmlFiles.forEach(htmlFile => {
    const srcPath = path.join(SRC_DIR, htmlFile);
    const distPath = path.join(DIST_DIR, htmlFile);

    if (fs.existsSync(srcPath)) {
      try {
        let content = fs.readFileSync(srcPath, 'utf8');

        // Update CSS references
        content = content.replace(/href="css\/([^"]+)\.css"/g, 'href="css/$1.min.css"');

        // Update JS references
        content = content.replace(/src="js\/([^"]+)\.js"/g, 'src="js/$1.min.js"');

        // Ensure dist directory exists for this file
        const distDir = path.dirname(distPath);
        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir, { recursive: true });
        }

        fs.writeFileSync(distPath, content, 'utf8');
        console.log(`✓ Updated ${htmlFile}`);
      } catch (error) {
        console.error(`✗ Failed to update ${htmlFile}:`, error.message);
      }
    } else {
      console.warn(`⚠ HTML file not found: ${srcPath}`);
    }
  });
}

// Copy other assets (images, etc.)
function copyAssets() {
  console.log('Copying assets...');

  const assets = ['img', 'resources'];

  assets.forEach(asset => {
    const srcPath = path.join(SRC_DIR, asset);
    const distPath = path.join(DIST_DIR, asset);

    if (fs.existsSync(srcPath)) {
      try {
        execSync(`xcopy "${srcPath}" "${distPath}" /E /I /H /Y`, { stdio: 'inherit' });
        console.log(`✓ Copied ${asset}`);
      } catch (error) {
        console.error(`✗ Failed to copy ${asset}:`, error.message);
      }
    }
  });
}

// Main build function
function build() {
  console.log('🚀 Starting production build...');
  console.log('================================');

  try {
    ensureDistDir();
    minifyCSS();
    minifyJS();
    updateHTMLFiles();
    copyAssets();

    console.log('================================');
    console.log('✅ Build completed successfully!');
    console.log(`📁 Minified files are in: ${DIST_DIR}/`);
    console.log('🔍 Source maps are available for debugging');

  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run build if called directly
if (process.argv[1] && process.argv[1].endsWith('build.js')) {
  build();
}

export { build, minifyCSS, minifyJS, updateHTMLFiles, copyAssets };