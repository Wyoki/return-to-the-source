/**
 * Lazy loading for CSS background images using Intersection Observer
 */

class LazyBackgroundLoader {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    // Create Intersection Observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.classList.add('bg-loaded');
          this.observer.unobserve(target);
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before entering viewport
      threshold: 0.1
    });

    // Observe all hero sections
    const heroSections = document.querySelectorAll('.hero-section');
    heroSections.forEach(section => {
      this.observer.observe(section);
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Initialize lazy background loading
export function initLazyBackgrounds() {
  if ('IntersectionObserver' in window) {
    new LazyBackgroundLoader();
  } else {
    // Fallback for browsers without Intersection Observer
    const heroSections = document.querySelectorAll('.hero-section');
    heroSections.forEach(section => {
      section.classList.add('bg-loaded');
    });
  }
}

export { LazyBackgroundLoader };