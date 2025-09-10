/**
 * Animations module - Optimized without breaking changes
 */

// Constants
const ANIMATION_THRESHOLD = 0.1;
const ANIMATION_ROOT_MARGIN = '0px 0px -50px 0px';

// Original functions maintained
export function initAnimations() {
  fadeInElements();
  slideInElements();
}

// Enhanced fadeInElements with better performance
export function fadeInElements() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if (fadeElements.length === 0) return;
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: ANIMATION_THRESHOLD,
    rootMargin: ANIMATION_ROOT_MARGIN
  });
  
  fadeElements.forEach(element => {
    fadeObserver.observe(element);
  });
}

// Enhanced slideInElements with better performance
export function slideInElements() {
  const slideElements = document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up, .slide-in-down');
  
  if (slideElements.length === 0) return;
  
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        slideObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: ANIMATION_THRESHOLD,
    rootMargin: ANIMATION_ROOT_MARGIN
  });
  
  slideElements.forEach(element => {
    slideObserver.observe(element);
  });
}

// New class-based API for more control
export class AnimationManager {
  constructor(config = {}) {
    this.config = {
      threshold: ANIMATION_THRESHOLD,
      rootMargin: ANIMATION_ROOT_MARGIN,
      ...config
    };
    
    this.observers = new Map();
    this.animatedElements = new Set();
  }

  init() {
    this.setupFadeInAnimations();
    this.setupSlideInAnimations();
    this.setupMutationObserver();
  }

  setupFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.animatedElements.add(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, this.config);
    
    fadeElements.forEach(element => {
      observer.observe(element);
    });
    
    this.observers.set('fade', observer);
  }

  setupSlideInAnimations() {
    const slideElements = document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up, .slide-in-down');
    if (slideElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.animatedElements.add(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, this.config);
    
    slideElements.forEach(element => {
      observer.observe(element);
    });
    
    this.observers.set('slide', observer);
  }

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              this.handleNewElement(node);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    this.observers.set('mutation', observer);
  }

  handleNewElement(element) {
    if (this.animatedElements.has(element)) return;
    
    const isFadeIn = element.classList.contains('fade-in');
    const isSlideIn = element.classList.contains('slide-in-left') || 
                     element.classList.contains('slide-in-right') ||
                     element.classList.contains('slide-in-up') ||
                     element.classList.contains('slide-in-down');
    
    if (isFadeIn && this.observers.has('fade')) {
      this.observers.get('fade').observe(element);
    } else if (isSlideIn && this.observers.has('slide')) {
      this.observers.get('slide').observe(element);
    }
  }

  animateElement(element, animationType) {
    if (this.animatedElements.has(element)) return;
    
    element.classList.add('visible');
    this.animatedElements.add(element);
  }

  resetElementAnimation(element) {
    element.classList.remove('visible');
    this.animatedElements.delete(element);
    
    const isFadeIn = element.classList.contains('fade-in');
    const isSlideIn = element.classList.contains('slide-in-left') || 
                     element.classList.contains('slide-in-right') ||
                     element.classList.contains('slide-in-up') ||
                     element.classList.contains('slide-in-down');
    
    if (isFadeIn && this.observers.has('fade')) {
      this.observers.get('fade').observe(element);
    } else if (isSlideIn && this.observers.has('slide')) {
      this.observers.get('slide').observe(element);
    }
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
  }
}