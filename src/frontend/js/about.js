/**
 * About page specific JavaScript
 */

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // About page specific functionality
    initAboutPage();
});

/**
 * Initialize About page specific functionality
 */
function initAboutPage() {
    // Animate mission values on scroll
    const valueItems = document.querySelectorAll('.value-item');
    if (valueItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        valueItems.forEach((item) => {
            observer.observe(item);
        });
    }
    
    // Animate approach items with staggered delay
    const approachItems = document.querySelectorAll('.approach-item');
    if (approachItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-slide-up');
                    }, index * 150); // Staggered animation
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        approachItems.forEach((item) => {
            observer.observe(item);
        });
    }
    
    // Partner logos hover effect
    const partnerLogos = document.querySelectorAll('.partner-logo');
    if (partnerLogos.length > 0) {
        partnerLogos.forEach((logo) => {
            logo.addEventListener('mouseenter', () => {
                logo.style.transform = 'scale(1.1)';
            });
            
            logo.addEventListener('mouseleave', () => {
                logo.style.transform = 'scale(1)';
            });
        });
    }
}