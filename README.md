# Return to the Source - Pan-African Film Lab

A transformative Pan-African film lab bridging history, healing, and future narratives through trauma-informed cinema education.

## 🚀 Live Site

The website is deployed on GitHub Pages at: [https://wyoki.github.io/return-to-the-source/](https://wyoki.github.io/return-to-the-source/)

## 📋 Features

- **Hero Background Images**: Strategic hero images on all major pages
- **Responsive Design**: Optimized for all device sizes
- **Performance Optimized**: Minified CSS/JS, lazy loading, and image optimization
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **SEO Optimized**: Meta tags, structured data, and semantic HTML

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Wyoki/return-to-the-source.git
cd return-to-the-source

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build Process
```bash
# Build for production
npm run build

# Serve production build locally
cd dist && python -m http.server 8080
```

## 📁 Project Structure

```
return-to-the-source/
├── src/
│   ├── frontend/          # Source HTML files
│   ├── backend/           # Backend routes (if needed)
│   └── scripts/           # Build and utility scripts
├── dist/                  # Production build output
├── .github/
│   └── workflows/         # GitHub Actions for deployment
├── package.json
├── build.js              # Build script
└── README.md
```

## 🚀 Deployment

### Automatic Deployment (GitHub Actions)

The site automatically deploys to GitHub Pages when you push to the `master` or `main` branch.

1. **Create GitHub Repository**:
   - Go to [GitHub.com](https://github.com)
   - Click "New repository"
   - Name: `return-to-the-source`
   - Make it public
   - Don't initialize with README

2. **Push Code to GitHub**:
   ```bash
   git remote add origin https://github.com/Wyoki/return-to-the-source.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` / `/(root)`
   - Save

### Manual Deployment

If you prefer manual deployment:

```bash
# Build the site
npm run build

# Deploy to gh-pages branch
npm run deploy
```

## 🎨 Customization

### Adding New Pages
1. Create HTML file in `src/frontend/`
2. Add corresponding CSS in `src/frontend/css/pages/`
3. Update navigation in all HTML files
4. Run `npm run build`

### Hero Images
- Place images in `src/frontend/img/events/`
- Update CSS background-image property
- Ensure images are optimized (WebP format recommended)

### Styling
- Main styles: `src/frontend/css/pages/theme.unified.css`
- Page-specific styles: `src/frontend/css/pages/`
- Use CSS custom properties for consistent theming

## 🔧 Configuration

### Build Settings
Edit `build.js` to modify:
- File minification settings
- Asset copying destinations
- HTML processing rules

### GitHub Actions
Edit `.github/workflows/deploy.yml` to modify:
- Node.js version
- Build commands
- Deployment settings

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)
- **Image Optimization**: WebP format with fallbacks
- **CSS/JS Minification**: Automatic minification in production
- **Lazy Loading**: Images load as needed
- **Caching**: Proper cache headers for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test locally: `npm run build && cd dist && python -m http.server 8080`
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or support:
- Email: info@returntothesource.org
- Website: [Return to the Source](https://wyoki.github.io/return-to-the-source/)

---

**Built with ❤️ for African cinema and cultural preservation**