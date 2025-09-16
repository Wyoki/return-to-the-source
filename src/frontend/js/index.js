/**
 * Main JavaScript barrel export file
 * This file exports all modules for easier imports in other files
 */

// Export navigation module functions
export { 
    initNavigation,
    initializeHeaderScrollEffect,
    initializeMobileNavigation,
    initializeSmoothScrolling 
} from './modules/navigation.js';

// Export animation functions
export {
    initAnimations,
    fadeInElements,
    slideInElements
} from './modules/animations.js';

// Export utility functions
export {
    debounce,
    throttle,
    validateEmail
} from './modules/utils.js';

// Export form handling functions
export {
    initForms,
    handleFormSubmission,
    validateForm
} from './modules/forms.js';