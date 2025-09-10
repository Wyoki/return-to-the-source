/**
 * Optimized Navigation Module - No breaking changes
 */

// Original function API maintained
export async function initNavigation() {
  const nav = new NavigationController();
  return nav.init();
}

// Enhanced class implementation
export class NavigationController {
  constructor() {
    this.elements = {
      header: null,
      mobileMenuToggle: null,
      navMenu: null,
      navBackdrop: null,
      dropdownToggles: null,
      anchorLinks: null
    };
    
    this.config = {
      SCROLL_THRESHOLD: 100,
      MOBILE_BREAKPOINT: 992,
      SCROLL_THROTTLE_DELAY: 16,
      TRANSITION_DURATION: 300
    };
    
    this.state = {
      isScrolling: false,
      isMobileMenuOpen: false,
      currentScrollY: 0,
      isInitialized: false
    };
    
    // Bind methods
    this.handleScroll = this.throttle(this.handleScroll.bind(this), this.config.SCROLL_THROTTLE_DELAY);
    this.handleResize = this.debounce(this.handleResize.bind(this), 250);
  }

  async init() {
    try {
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }
      
      this.cacheElements();
      if (!this.validateElements()) {
        throw new Error('Essential navigation elements not found');
      }
      
      this.attachEventListeners();
      this.initializeScrollState();
      
      this.state.isInitialized = true;
      console.log('Navigation initialized successfully');
      
    } catch (error) {
      console.error('Navigation initialization failed:', error);
      this.initializeFallback();
    }
  }

  cacheElements() {
    this.elements = {
      header: document.querySelector('header'),
      mobileMenuToggle: document.querySelector('.mobile-toggle'),
      navMenu: document.querySelector('.nav-menu') || document.querySelector('.nav-links'),
      navBackdrop: document.querySelector('.nav-backdrop'),
      dropdownToggles: document.querySelectorAll('.dropbtn'),
      anchorLinks: document.querySelectorAll('a[href^="#"]:not([href="#"])')
    };
  }

  validateElements() {
    return !!this.elements.header;
  }

  attachEventListeners() {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleResize, { passive: true });
    
    if (this.elements.mobileMenuToggle && this.elements.navMenu) {
      this.elements.mobileMenuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
    }
    
    if (this.elements.navBackdrop) {
      this.elements.navBackdrop.addEventListener('click', this.closeMobileMenu.bind(this));
    }
    
    if (this.elements.dropdownToggles.length > 0) {
      this.elements.dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', this.handleDropdownToggle.bind(this));
      });
    }
    
    if (this.elements.anchorLinks.length > 0) {
      this.elements.anchorLinks.forEach(link => {
        link.addEventListener('click', this.handleSmoothScroll.bind(this));
      });
    }
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  initializeScrollState() {
    this.state.currentScrollY = window.scrollY;
    this.updateHeaderStyle();
  }

  handleScroll() {
    if (this.state.isScrolling) return;
    
    this.state.isScrolling = true;
    
    requestAnimationFrame(() => {
      const newScrollY = window.scrollY;
      const scrollDifference = Math.abs(newScrollY - this.state.currentScrollY);
      
      if (scrollDifference > 5) {
        this.state.currentScrollY = newScrollY;
        this.updateHeaderStyle();
      }
      
      this.state.isScrolling = false;
    });
  }

  updateHeaderStyle() {
    if (!this.elements.header) return;
    
    const shouldAddScrolledClass = this.state.currentScrollY > this.config.SCROLL_THRESHOLD;
    this.elements.header.classList.toggle('scrolled', shouldAddScrolledClass);
  }

  handleResize() {
    const isDesktop = window.innerWidth >= this.config.MOBILE_BREAKPOINT;
    
    if (isDesktop && this.state.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
    
    if (isDesktop) {
      this.closeAllDropdowns();
    }
  }

  toggleMobileMenu(event) {
    if (event) event.preventDefault();
    
    this.state.isMobileMenuOpen = !this.state.isMobileMenuOpen;
    
    if (this.elements.mobileMenuToggle) {
      this.elements.mobileMenuToggle.setAttribute('aria-expanded', this.state.isMobileMenuOpen);
    }
    
    if (this.elements.navMenu) {
      this.elements.navMenu.classList.toggle('active', this.state.isMobileMenuOpen);
    }
    
    if (this.elements.navBackdrop) {
      this.elements.navBackdrop.classList.toggle('active', this.state.isMobileMenuOpen);
    }
    
    document.body.classList.toggle('menu-open', this.state.isMobileMenuOpen);
    
    if (this.state.isMobileMenuOpen) {
      this.trapFocus();
    } else {
      this.releaseFocus();
    }
  }

  closeMobileMenu() {
    if (!this.state.isMobileMenuOpen) return;
    
    this.state.isMobileMenuOpen = false;
    
    if (this.elements.mobileMenuToggle) {
      this.elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
    
    if (this.elements.navMenu) {
      this.elements.navMenu.classList.remove('active');
    }
    
    if (this.elements.navBackdrop) {
      this.elements.navBackdrop.classList.remove('active');
    }
    
    document.body.classList.remove('menu-open');
    
    this.closeAllDropdowns();
    this.releaseFocus();
  }

  handleDropdownToggle(event) {
    const toggle = event.currentTarget;
    const isDesktop = window.innerWidth >= this.config.MOBILE_BREAKPOINT;
    
    if (isDesktop) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    const dropdownMenu = toggle.nextElementSibling;
    
    this.closeAllDropdowns(toggle);
    
    if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
      toggle.setAttribute('aria-expanded', !isExpanded);
      dropdownMenu.classList.toggle('show', !isExpanded);
    }
  }

  closeAllDropdowns(except = null) {
    this.elements.dropdownToggles.forEach(toggle => {
      if (toggle === except) return;
      
      toggle.setAttribute('aria-expanded', 'false');
      const dropdownMenu = toggle.nextElementSibling;
      if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
        dropdownMenu.classList.remove('show');
      }
    });
  }

  handleSmoothScroll(event) {
    const targetId = event.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (!targetElement) return;
    
    event.preventDefault();
    
    if (this.state.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
    
    const headerHeight = this.elements.header ? this.elements.header.offsetHeight : 0;
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
    
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } else {
      this.animateScroll(window.scrollY, targetPosition, 800);
    }
  }

  animateScroll(start, end, duration) {
    const startTime = performance.now();
    const distance = end - start;
    
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      window.scrollTo(0, start + (distance * easedProgress));
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    
    requestAnimationFrame(step);
  }

  trapFocus() {
    if (!this.elements.navMenu) return;
    
    const focusableElements = this.elements.navMenu.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    firstFocusable.focus();
    
    this.focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };
    
    document.addEventListener('keydown', this.focusTrapHandler);
  }

  releaseFocus() {
    if (this.focusTrapHandler) {
      document.removeEventListener('keydown', this.focusTrapHandler);
      this.focusTrapHandler = null;
    }
  }

  throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  debounce(func, delay) {
    let timeoutId;
    
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  initializeFallback() {
    console.warn('Initializing navigation fallback mode');
    
    if (this.elements.header) {
      window.addEventListener('scroll', () => {
        const shouldAddClass = window.scrollY > this.config.SCROLL_THRESHOLD;
        this.elements.header.classList.toggle('scrolled', shouldAddClass);
      }, { passive: true });
    }
  }

  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    
    if (this.elements.mobileMenuToggle) {
      this.elements.mobileMenuToggle.removeEventListener('click', this.toggleMobileMenu);
    }
    
    if (this.elements.navBackdrop) {
      this.elements.navBackdrop.removeEventListener('click', this.closeMobileMenu);
    }
    
    this.elements.dropdownToggles?.forEach(toggle => {
      toggle.removeEventListener('click', this.handleDropdownToggle);
    });
    
    this.elements.anchorLinks?.forEach(link => {
      link.removeEventListener('click', this.handleSmoothScroll);
    });
    
    this.releaseFocus();
    
    console.log('Navigation destroyed');
  }
}