/**
 * Barrel export file for all modules - Updated for backward compatibility
 */

// Re-export all functions from navigation.js
export { initNavigation, NavigationController } from './navigation.js';

// Re-export all functions from animations.js
export { initAnimations, fadeInElements, slideInElements, AnimationManager } from './animations.js';

// Re-export all functions from forms.js
export { initForms, validateForm, handleFormSubmission } from './forms.js';

// Re-export all functions from utils.js
export { debounce, throttle, validateEmail, getViewportDimensions, isMobileDevice, formatDate } from './utils.js';

// Re-export all functions from carousel.js
export { initCarousel, destroyCarousels } from './carousel.js';

// Re-export all functions from gallery.js
export { initGallery } from './gallery.js';

// Re-export all functions from webp-support.js
export { initWebPSupport } from './webp-support.js';