/**
 * WebP Support Detection and Handling - Optimized without breaking changes
 */

let webpSupportCache = null;

// Original function maintained
export function initWebPSupport() {
  return checkWebPSupport().then(supported => {
    document.documentElement.classList.toggle('webp', supported);
    updateImageSources(supported);
    setupLazyLoading(supported);
    return supported;
  });
}

// Enhanced checkWebPSupport function
function checkWebPSupport() {
  if (webpSupportCache !== null) {
    return Promise.resolve(webpSupportCache);
  }

  return new Promise(resolve => {
    // Use the smallest possible WebP image for testing
    const webP = new Image();
    
    webP.onload = webP.onerror = () => {
      webpSupportCache = (webP.width === 2);
      resolve(webpSupportCache);
    };
    
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

// Enhanced image source updating
function updateImageSources(webpSupported) {
  if (!webpSupported) {
    // Process picture elements with WebP sources
    document.querySelectorAll('picture source[type="image/webp"]').forEach(source => {
      const fallbackSrc = source.dataset.fallback;
      if (fallbackSrc) {
        const img = source.parentElement.querySelector('img');
        if (img) {
          img.src = fallbackSrc;
        }
      }
    });
    
    // Process img elements with data-fallback
    document.querySelectorAll('img[data-fallback]').forEach(img => {
      if (img.src.endsWith('.webp')) {
        img.src = img.dataset.fallback;
      }
    });
  }
}

// Enhanced lazy loading setup
function setupLazyLoading(webpSupported) {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (lazyImages.length === 0) return;
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Determine the correct source based on WebP support
        let src;
        if (webpSupported && img.dataset.src) {
          src = img.dataset.src;
        } else if (img.dataset.fallback) {
          src = img.dataset.fallback;
        } else if (img.dataset.src) {
          src = img.dataset.src;
        } else {
          observer.unobserve(img);
          return;
        }
        
        img.classList.add('lazy-loading');
        
        // Use requestIdleCallback for better performance if available
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            loadImage(img, src, observer);
          });
        } else {
          setTimeout(() => {
            loadImage(img, src, observer);
          }, 0);
        }
      }
    });
  }, {
    rootMargin: '200px 0px' // Start loading when within 200px of viewport
  });

  lazyImages.forEach(img => imageObserver.observe(img));
}

// Helper function to load images with error handling
function loadImage(img, src, observer) {
  // Check if image is still in the DOM
  if (!img.parentNode) {
    observer.unobserve(img);
    return;
  }
  
  img.src = src;
  
  img.onload = () => {
    img.classList.remove('lazy-loading');
    img.classList.add('lazy-loaded');
    observer.unobserve(img);
  };
  
  img.onerror = () => {
    console.error('Failed to load image:', src);
    img.classList.remove('lazy-loading');
    
    // Try fallback if available and not already using it
    if (img.dataset.fallback && src !== img.dataset.fallback) {
      img.src = img.dataset.fallback;
    } else {
      observer.unobserve(img);
    }
  };
}