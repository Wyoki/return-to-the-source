# Image Organization Structure

## Directory Structure
```
img/
├── logos/          # Brand logos and partner logos
├── team/           # Team member photos
├── partners/       # Partner organization logos
├── events/         # Event and project photos
├── projects/       # Project-specific images
├── gallery/        # General gallery images
└── README.md       # This file
```

## Optimization Guidelines

### File Naming Convention
- Use descriptive, kebab-case names: `team-member-name.webp`
- Include dimensions for reference: `logo-main-200x100.webp`
- Use WebP format for optimal compression

### Image Optimization
- All images should be WebP format for best compression
- Use appropriate sizes: thumbnails (300px), medium (800px), large (1200px)
- Implement lazy loading for better performance
- Use responsive images with srcset for different screen sizes

### Usage in Code
```html
<!-- Logo usage -->
<img src="img/logos/return-to-the-source.webp" alt="Return to the Source" width="140" height="70">

<!-- Team photo with lazy loading -->
<img loading="lazy" src="img/team/member-name.webp" alt="Team Member Name" width="400" height="400">

<!-- Responsive images -->
<picture>
  <source srcset="img/gallery/image-800.webp" media="(max-width: 800px)">
  <img src="img/gallery/image-1200.webp" alt="Gallery Image">
</picture>
```

## Current Status
- ✅ Organized subfolders created
- ✅ Existing images in appropriate folders
- ⚠️  Loose images in root directory need organization
- 📝 Image optimization script available in `src/scripts/convert-images.js`