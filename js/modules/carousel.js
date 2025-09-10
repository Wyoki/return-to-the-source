/**
 * Partner Carousel Module - Optimized without breaking changes
 */

// Main initialization function (unchanged signature)
export function initCarousel() {
  const carousels = document.querySelectorAll('.partner-carousel');
  
  if (carousels.length === 0) {
    console.warn('No partner carousels found on the page');
    return;
  }

  carousels.forEach((carousel, index) => {
    try {
      initSingleCarousel(carousel, index);
    } catch (error) {
      console.error(`Failed to initialize carousel ${index}:`, error);
    }
  });
}

// Enhanced single carousel initialization
function initSingleCarousel(carousel, carouselIndex) {
  const container = carousel.querySelector('.partner-logos');
  const slides = carousel.querySelectorAll('.partner-slide');
  const prevBtn = carousel.querySelector('.prev-btn');
  const nextBtn = carousel.querySelector('.next-btn');

  if (!container || !prevBtn || !nextBtn) {
    console.warn(`Carousel ${carouselIndex}: Missing required elements`);
    return;
  }

  if (slides.length === 0) {
    console.warn(`Carousel ${carouselIndex}: No slides found`);
    return;
  }

  // Configuration with defaults
  const config = {
    slideWidth: 200,
    gap: 32,
    scrollBehavior: 'smooth',
    disabledOpacity: '0.5',
    enabledOpacity: '1',
    scrollThreshold: 5
  };

  // State management
  const state = {
    scrollPosition: 0,
    isScrolling: false,
    maxScrollPosition: 0
  };

  // Calculate maximum scroll position
  const calculateMaxScroll = () => {
    state.maxScrollPosition = Math.max(0, container.scrollWidth - container.clientWidth);
    return state.maxScrollPosition;
  };

  // Calculate scroll distance based on visible area
  const getScrollDistance = () => {
    const visibleWidth = container.clientWidth;
    const slideWithGap = config.slideWidth + config.gap;
    
    const slidesToScroll = Math.max(1, Math.floor(visibleWidth / slideWithGap));
    return slidesToScroll * slideWithGap;
  };

  // Smooth scroll to position with bounds checking
  const scrollToPosition = (targetPosition) => {
    if (state.isScrolling) return;
    
    const maxScroll = calculateMaxScroll();
    const clampedPosition = Math.max(0, Math.min(targetPosition, maxScroll));
    
    state.isScrolling = true;
    state.scrollPosition = clampedPosition;

    container.scrollTo({
      left: clampedPosition,
      behavior: config.scrollBehavior
    });

    // Use scrollend event if available, otherwise fallback
    const onScrollComplete = () => {
      state.isScrolling = false;
      if ('scrollend' in window) {
        container.removeEventListener('scrollend', onScrollComplete);
      }
    };
    
    if ('scrollend' in window) {
      container.addEventListener('scrollend', onScrollComplete, { once: true });
    } else {
      setTimeout(onScrollComplete, 300);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    const scrollDistance = getScrollDistance();
    const newPosition = state.scrollPosition + scrollDistance;
    scrollToPosition(newPosition);
  };

  const handlePrevious = () => {
    const scrollDistance = getScrollDistance();
    const newPosition = state.scrollPosition - scrollDistance;
    scrollToPosition(newPosition);
  };

  // Update button states based on scroll position
  const updateButtonStates = () => {
    const maxScroll = calculateMaxScroll();
    
    const atStart = state.scrollPosition <= config.scrollThreshold;
    const atEnd = state.scrollPosition >= (maxScroll - config.scrollThreshold);
    
    prevBtn.style.opacity = atStart ? config.disabledOpacity : config.enabledOpacity;
    nextBtn.style.opacity = atEnd ? config.disabledOpacity : config.enabledOpacity;
    
    prevBtn.setAttribute('aria-disabled', atStart.toString());
    nextBtn.setAttribute('aria-disabled', atEnd.toString());
    
    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
  };

  // Handle scroll events with debouncing
  let scrollTimeout;
  const handleScroll = () => {
    state.scrollPosition = container.scrollLeft;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      updateButtonStates();
    }, 16);
  };

  // Handle resize events with debouncing
  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      calculateMaxScroll();
      const maxScroll = state.maxScrollPosition;
      
      if (state.scrollPosition > maxScroll) {
        scrollToPosition(maxScroll);
      } else {
        updateButtonStates();
      }
    }, 250);
  };

  // Initialize carousel
  const initialize = () => {
    // Set up ARIA attributes for accessibility
    prevBtn.setAttribute('aria-label', 'Previous partners');
    nextBtn.setAttribute('aria-label', 'Next partners');
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Partner logos carousel');

    // Add event listeners
    prevBtn.addEventListener('click', handlePrevious);
    nextBtn.addEventListener('click', handleNext);
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Initial setup
    calculateMaxScroll();
    updateButtonStates();
    
    // Store cleanup function
    carousel._cleanupCarousel = () => {
      prevBtn.removeEventListener('click', handlePrevious);
      nextBtn.removeEventListener('click', handleNext);
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(scrollTimeout);
      clearTimeout(resizeTimeout);
    };
  };

  // Initialize this carousel instance
  initialize();
}

// Cleanup function (unchanged signature)
export function destroyCarousels() {
  const carousels = document.querySelectorAll('.partner-carousel');
  carousels.forEach(carousel => {
    if (carousel._cleanupCarousel) {
      carousel._cleanupCarousel();
      delete carousel._cleanupCarousel;
    }
  });
}