/**
 * Return to the Source - Unified Interaction Manager
 * Optimized for performance, maintainability, and user experience
 */

(function() {
class InteractionManager {
    constructor() {
        // Store all observers for proper cleanup
        this.observers = [];
        // Track timeouts to prevent memory leaks
        this.timeouts = new Map();
        // Cache frequently accessed DOM elements
        this.elements = {};
        // Debounce timeout for scroll handling
        this.debounceTimeout = null;

        // Bind methods to maintain context
        this.handleScroll = this.handleScroll.bind(this);
        this.updateHeader = this.updateHeader.bind(this);
    }

    /**
     * Initialize all interaction systems
     * This is the main entry point for setting up the enhanced interactions
     */
    init() {
        // Wait for DOM to be fully ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAllSystems());
        } else {
            this.setupAllSystems();
        }
    }

    /**
     * Set up all interaction systems in logical order
     */
    setupAllSystems() {
        try {
            // Cache important elements first
            this.cacheElements();
            
            // Core navigation and scrolling
            this.setupSmoothScrolling();
            this.setupScrollHeader();
            
            // Visual enhancements
            this.setupIntersectionObserver();
            this.setupCardHoverEffects();
            this.createFloatingElements();
            
            // User interface components
            this.setupMobileMenu();
            this.setupDropdowns();
            this.setupLazyLoading();
            
            // Form handling
            this.setupFormEnhancements();
            
            console.log('InteractionManager: All systems initialized successfully');
        } catch (error) {
            console.error('InteractionManager: Initialization failed:', error);
        }
    }

    /**
     * Cache frequently accessed DOM elements to improve performance
     */
    cacheElements() {
        this.elements = {
            header: document.querySelector('.site-header'),
            mobileToggle: document.querySelector('.mobile-toggle'),
            navMenu: document.querySelector('.nav-menu'),
            heroes: document.querySelectorAll('.hero'),
            forms: document.querySelectorAll('form'),
            cards: document.querySelectorAll('.pillar-card'),
            dropdowns: document.querySelectorAll('.dropdown')
        };
    }

    /**
     * Enhanced smooth scrolling with improved accessibility and performance
     */
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    // Respect user's motion preferences
                    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    
                    target.scrollIntoView({
                        behavior: prefersReducedMotion ? 'auto' : 'smooth',
                        block: 'start',
                        inline: 'nearest'
                    });
                    
                    // Update URL without triggering navigation
                    history.pushState(null, '', targetId);
                    
                    // Improve accessibility by focusing the target element
                    target.focus({ preventScroll: true });
                }
            });
        });
    }

    /**
     * Optimized intersection observer with better performance and accessibility
     */
    setupIntersectionObserver() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Skip animations if user prefers reduced motion
            document.querySelectorAll('.fade-in, .slide-in').forEach(el => {
                el.classList.add('visible');
            });
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Use requestAnimationFrame for smooth animations
                    requestAnimationFrame(() => {
                        entry.target.classList.add('visible');
                    });
                    
                    // Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.fade-in, .slide-in').forEach(el => {
            observer.observe(el);
        });

        this.observers.push(observer);
    }

    /**
     * Enhanced card hover effects with better performance and accessibility
     */
    setupCardHoverEffects() {
        // Skip hover effects on touch devices to prevent sticky hover states
        if ('ontouchstart' in window) return;

        this.elements.cards.forEach(card => {
            // Use CSS custom properties for smoother transitions
            card.style.setProperty('--hover-transform', 'translateY(0) scale(1) rotateY(0deg)');
            
            card.addEventListener('mouseenter', () => {
                card.style.setProperty('--hover-transform', 'translateY(-10px) scale(1.02) rotateY(2deg)');
                card.style.transform = 'var(--hover-transform)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--hover-transform', 'translateY(0) scale(1) rotateY(0deg)');
                card.style.transform = 'var(--hover-transform)';
            });

            // Add keyboard support for accessibility
            card.addEventListener('focus', () => {
                card.style.setProperty('--hover-transform', 'translateY(-5px) scale(1.01) rotateY(1deg)');
                card.style.transform = 'var(--hover-transform)';
            });

            card.addEventListener('blur', () => {
                card.style.setProperty('--hover-transform', 'translateY(0) scale(1) rotateY(0deg)');
                card.style.transform = 'var(--hover-transform)';
            });
        });
    }

    /**
     * Enhanced mobile menu with improved accessibility and keyboard navigation
     */
    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (!mobileToggle || !navMenu) return;

        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');

            // Toggle menu state
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open', !isOpen);

            // Update ARIA attributes for accessibility
            mobileToggle.setAttribute('aria-expanded', !isOpen);

            // Focus management for better accessibility
            if (!isOpen) {
                // Menu is opening - focus first menu item
                const firstMenuItem = navMenu.querySelector('a, button');
                if (firstMenuItem) {
                    setTimeout(() => firstMenuItem.focus(), 100);
                }
            }
        });

        // Handle dropdown menus in mobile
        const dropdowns = navMenu.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const button = dropdown.querySelector('.dropbtn');
            const content = dropdown.querySelector('.dropdown-content');

            if (button && content) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                });
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.focus();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    /**
     * Enhanced form handling with better error handling and user feedback
     */
    setupFormEnhancements() {
        this.elements.forms.forEach(form => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (!submitBtn) return;

            const originalText = submitBtn.textContent;

            form.addEventListener('submit', (e) => {
                // Prevent double submissions
                if (submitBtn.disabled) {
                    e.preventDefault();
                    return;
                }

                // Add loading state with better UX
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                submitBtn.setAttribute('aria-busy', 'true');
                
                // Clear any existing timeouts for this form
                if (this.timeouts.has(form)) {
                    clearTimeout(this.timeouts.get(form));
                }
                
                // Fallback timeout to restore button state
                const timeoutId = setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.setAttribute('aria-busy', 'false');
                    this.timeouts.delete(form);
                }, 10000); // Increased timeout for slower connections
                
                this.timeouts.set(form, timeoutId);
            });

            // Handle form reset to restore button state
            form.addEventListener('reset', () => {
                if (this.timeouts.has(form)) {
                    clearTimeout(this.timeouts.get(form));
                    this.timeouts.delete(form);
                }
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.setAttribute('aria-busy', 'false');
            });
        });
    }

    /**
     * Optimized floating elements creation with better performance
     */
    createFloatingElements() {
        // Skip on devices that might struggle with performance
        if (window.innerWidth < 768 || navigator.hardwareConcurrency < 4) {
            return;
        }

        // Check user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        this.elements.heroes.forEach(hero => {
            // Use DocumentFragment for better DOM performance
            const fragment = document.createDocumentFragment();
            const elementCount = Math.min(15, Math.floor(hero.offsetWidth / 100)); // Adaptive count
            
            for (let i = 0; i < elementCount; i++) {
                const element = document.createElement('div');
                element.className = 'floating-element';
                
                // Use CSS custom properties for better performance
                const size = Math.random() * 4 + 2;
                const opacity = Math.random() * 0.3 + 0.1;
                
                Object.assign(element.style, {
                    position: 'absolute',
                    width: `${size}px`,
                    height: `${size}px`,
                    background: `rgba(218, 165, 32, ${opacity})`,
                    borderRadius: '50%',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 15}s`,
                    pointerEvents: 'none', // Improve performance
                    willChange: 'transform' // Optimize for animations
                });
                
                fragment.appendChild(element);
            }
            
            hero.appendChild(fragment);
        });
    }

    /**
     * Optimized lazy loading with better error handling
     */
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        if (images.length === 0) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    if (src) {
                        // Create a new image to preload
                        const imageLoader = new Image();
                        
                        imageLoader.onload = () => {
                            img.src = src;
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
                        };
                        
                        imageLoader.onerror = () => {
                            img.classList.add('error');
                            console.warn('Failed to load image:', src);
                        };
                        
                        imageLoader.src = src;
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px', // Start loading before image is visible
            threshold: 0.01
        });

        images.forEach(img => imageObserver.observe(img));
        this.observers.push(imageObserver);
    }

    /**
     * Enhanced dropdown behavior with better accessibility
     */
    setupDropdowns() {
        this.elements.dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-trigger') || dropdown;
            const content = dropdown.querySelector('.dropdown-content');
            
            if (!content) return;

            let timeout;
            let isOpen = false;

            const openDropdown = () => {
                clearTimeout(timeout);
                content.style.display = 'block';
                trigger.setAttribute('aria-expanded', 'true');
                content.setAttribute('aria-hidden', 'false');
                isOpen = true;
            };

            const closeDropdown = (delay = 300) => {
                timeout = setTimeout(() => {
                    content.style.display = 'none';
                    trigger.setAttribute('aria-expanded', 'false');
                    content.setAttribute('aria-hidden', 'true');
                    isOpen = false;
                }, delay);
            };

            // Mouse interactions
            dropdown.addEventListener('mouseenter', openDropdown);
            dropdown.addEventListener('mouseleave', () => closeDropdown());

            // Keyboard interactions for accessibility
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (isOpen) {
                        closeDropdown(0);
                    } else {
                        openDropdown();
                    }
                } else if (e.key === 'Escape' && isOpen) {
                    closeDropdown(0);
                    trigger.focus();
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target) && isOpen) {
                    closeDropdown(0);
                }
            });
        });
    }

    /**
     * Optimized scroll-based header behavior with throttling
     */
    setupScrollHeader() {
        const header = this.elements.header;
        if (!header) return;
        
        this.lastScrollTop = 0;
        
        // Add CSS for smooth transitions
        header.style.transition = 'transform 0.3s ease-in-out';
        
        // Use passive event listeners for better performance
        window.addEventListener('scroll', this.handleScroll, { passive: true });
    }

    /**
     * Debounced scroll handler for better performance
     */
    handleScroll() {
        if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
            this.updateHeader();
        }, 100);
    }

    /**
     * Update header visibility based on scroll direction
     */
    updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = this.elements.header;
        
        if (scrollTop > this.lastScrollTop && scrollTop > 100) {
            // Scrolling down - hide header
            header.style.transform = 'translateY(-100%)';
            header.setAttribute('data-scrolled', 'hidden');
        } else {
            // Scrolling up - show header
            header.style.transform = 'translateY(0)';
            header.setAttribute('data-scrolled', 'visible');
        }
        
        this.lastScrollTop = scrollTop;
        this.isScrolling = false;
    }

    /**
     * Comprehensive cleanup method to prevent memory leaks
     */
    cleanup() {
        // Disconnect all observers
        this.observers.forEach(observer => {
            if (observer && observer.disconnect) {
                observer.disconnect();
            }
        });
        this.observers = [];

        // Clear all timeouts
        this.timeouts.forEach(timeout => clearTimeout(timeout));
        this.timeouts.clear();

        // Clear debounce timeout
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = null;
        }

        // Remove scroll listener
        window.removeEventListener('scroll', this.handleScroll);

        // Clear element cache
        this.elements = {};

        console.log('InteractionManager: Cleanup completed');
    }
}

/**
 * Enhanced Contact Form Handler with better error handling and user experience
 */
class ContactFormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) {
            console.warn(`ContactFormHandler: Form with ID "${formId}" not found`);
            return;
        }
        
        this.originalText = '';
        this.isSubmitting = false;
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add real-time validation if needed
        this.setupValidation();
    }

    /**
     * Set up form validation for better user experience
     */
    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    /**
     * Validate individual form fields
     */
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';

        // Basic validation rules
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${fieldName} is required`;
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        this.setFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }

    /**
     * Email validation helper
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Set error state for form field
     */
    setFieldError(field, message) {
        const errorElement = field.parentNode.querySelector('.field-error');
        
        if (message) {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
            
            if (errorElement) {
                errorElement.textContent = message;
            } else {
                const error = document.createElement('div');
                error.className = 'field-error';
                error.textContent = message;
                error.setAttribute('role', 'alert');
                field.parentNode.appendChild(error);
            }
        } else {
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }

    /**
     * Clear field error state
     */
    clearFieldError(field) {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Enhanced form submission handling
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        // Prevent double submissions
        if (this.isSubmitting) return;
        
        // Validate form before submission
        const isFormValid = this.validateForm();
        if (!isFormValid) {
            showNotification('Please correct the errors in the form', 'error');
            return;
        }
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        this.originalText = submitBtn.textContent;
        this.isSubmitting = true;
        
        try {
            // Update button state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-busy', 'true');
            
            const formData = new FormData(this.form);
            
            // Add timestamp and user agent for debugging
            formData.append('timestamp', new Date().toISOString());
            formData.append('user_agent', navigator.userAgent);
            
            const response = await fetch(this.form.action || '#', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (response.ok) {
                const result = await response.json().catch(() => ({}));
                showNotification(result.message || 'Message sent successfully!', 'success');
                this.form.reset();
                this.clearAllErrors();
            } else {
                throw new Error(`Server responded with status: ${response.status}`);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            
            let errorMessage = 'Failed to send message. Please try again.';
            
            // Provide more specific error messages when possible
            if (error.name === 'NetworkError') {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error.name === 'TypeError') {
                errorMessage = 'Unable to connect to server. Please try again later.';
            }
            
            showNotification(errorMessage, 'error');
        } finally {
            // Restore button state
            submitBtn.textContent = this.originalText;
            submitBtn.disabled = false;
            submitBtn.setAttribute('aria-busy', 'false');
            this.isSubmitting = false;
        }
    }

    /**
     * Validate entire form
     */
    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Clear all form errors
     */
    clearAllErrors() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => this.clearFieldError(input));
    }
}

/**
 * Enhanced notification system with better accessibility and customization
 */
function showNotification(message, type = 'info', duration = 4000) {
    // Remove existing notifications with the same message to prevent duplicates
    document.querySelectorAll('.notification').forEach(notification => {
        if (notification.textContent === message) {
            notification.remove();
        }
    });
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    // Enhanced styling with better visual hierarchy
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        fontSize: '0.9rem',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        maxWidth: '400px',
        wordWrap: 'break-word'
    });
    
    // Color scheme for different notification types
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Force reflow for smooth animation
    notification.offsetHeight;
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Auto-remove after specified duration
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, duration);

    // Allow manual dismissal by clicking
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
}

/**
 * Initialize everything when DOM is ready with comprehensive error handling
 */
function initializeApp() {
    try {
        console.log('Initializing Return to the Source interactions...');
        
        // Create and initialize the main interaction manager
        const interactionManager = new InteractionManager();
        interactionManager.init();
        
        // Initialize contact form handler if contact form exists
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            new ContactFormHandler('contact-form');
            console.log('Contact form handler initialized');
        }
        
        // Set up cleanup on page unload to prevent memory leaks
        window.addEventListener('beforeunload', () => {
            interactionManager.cleanup();
        });
        
        // Performance monitoring (optional)
        if (window.performance && console.log) {
            const loadTime = performance.now();
            console.log(`App initialization completed in ${Math.round(loadTime)}ms`);
        }

    } catch (error) {
        console.error('Failed to initialize app:', error);
        showNotification('Some interactive features may not be available', 'warning');
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

})();