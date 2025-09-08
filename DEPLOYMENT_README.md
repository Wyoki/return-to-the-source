# 🚀 Return to the Source - Netlify Deployment Guide

## Prerequisites

- Netlify account (free tier available)
- GitHub repository with this project
- Domain name (optional, but recommended)

## Quick Deployment Steps

### 1. Connect Repository to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click "New site from Git"
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Select this repository
5. Configure build settings:

### 2. Build Settings

```
Branch to deploy: main (or your default branch)
Build command: echo 'Static site - no build needed'
Publish directory: src/frontend
```

### 3. Environment Variables (Optional)

Add these if needed for future features:
```
NODE_ENV = production
```

### 4. Deploy

Click "Deploy site" - Netlify will automatically deploy your site!

## File Structure for Deployment

```
src/frontend/          # ← This is your publish directory
├── index.html
├── about.html
├── team.html
├── contact.html
├── blog.html
├── privacy.html
├── terms.html
├── accessibility.html
├── partners.html
├── editions/
│   ├── edition1.html
│   ├── edition2.html
│   └── impact.html
├── portfolios/
│   ├── theory.html
│   ├── infrastructure.html
│   ├── cinema.html
│   └── healing.html
├── blog/
│   ├── healing-through-film.html
│   ├── oscars-journey.html
│   └── continental-infrastructure.html
├── css/
├── js/
└── img/
```

## Custom Domain Setup (Optional)

1. Go to Site settings > Domain management
2. Add custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate (automatic)

## Key Features Configured

### ✅ Security Headers
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### ✅ Performance Optimization
- Static asset caching (1 year)
- CSS/JS caching optimization
- Image optimization ready

### ✅ SEO & Accessibility
- Proper meta tags
- Semantic HTML structure
- ARIA labels and roles
- Skip links for keyboard navigation

### ✅ Mobile Responsive
- Responsive design across all devices
- Touch-friendly navigation
- Optimized images with fallbacks

## Post-Deployment Checklist

- [ ] Test all navigation links
- [ ] Verify images load correctly
- [ ] Check mobile responsiveness
- [ ] Test contact forms (if any)
- [ ] Verify SSL certificate
- [ ] Test social media links
- [ ] Check blog article links
- [ ] Verify portfolio page links

## Troubleshooting

### Common Issues

**404 Errors on Direct Links:**
- Check that `_redirects` file is in the publish directory
- Ensure file paths match exactly

**Images Not Loading:**
- Verify image paths are correct
- Check that images exist in the repository

**CSS/JS Not Loading:**
- Ensure file paths are relative to the publish directory
- Check that files exist and are not corrupted

### Useful Netlify Commands

```bash
# Check build logs
netlify logs

# Deploy manually
netlify deploy --prod --dir=src/frontend

# Check site status
netlify status
```

## Performance Monitoring

After deployment, monitor:
- Page load times
- Core Web Vitals
- Mobile performance
- SEO rankings

## Future Enhancements

Consider adding:
- Form handling (Netlify Forms)
- CMS integration (Netlify CMS)
- A/B testing
- Analytics integration
- CDN optimization

---

**Deployment completed successfully!** 🎉

Your Return to the Source website is now live and ready to share African cinema stories with the world.