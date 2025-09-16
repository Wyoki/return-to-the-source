/**
 * Forms module for Return to the Source website
 * Handles form validation, submission, and feedback
 */

// This file is no longer used directly. All functionality has been moved to bundle.js

/**
 * Initialize all forms on the page
 */
export function initForms() {
    initContactForm();
    initNewsletterForm();
}

/**
 * Initialize the contact form
 */
export function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form fields
        const nameInput = contactForm.querySelector('#name');
        const emailInput = contactForm.querySelector('#email');
        const messageInput = contactForm.querySelector('#message');
        
        // Validate form
        let isValid = true;
        
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Please enter your name');
            isValid = false;
        } else {
            clearError(nameInput);
        }
        
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(emailInput);
        }
        
        if (!messageInput.value.trim()) {
            showError(messageInput, 'Please enter your message');
            isValid = false;
        } else {
            clearError(messageInput);
        }
        
        // Submit form if valid
        if (isValid) {
            // In a real implementation, you would send the form data to a server
            // For now, we'll just show a success message
            contactForm.innerHTML = '<div class="form-success">Thank you for your message! We will get back to you soon.</div>';
        }
    });
}

/**
 * Initialize the newsletter subscription form
 */
export function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const emailInput = newsletterForm.querySelector('#newsletter-email');
        
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            return;
        }
        
        clearError(emailInput);
        
        // In a real implementation, you would send the form data to a server
        // For now, we'll just show a success message
        const formContainer = newsletterForm.closest('.newsletter-container');
        if (formContainer) {
            formContainer.innerHTML = '<div class="form-success">Thank you for subscribing to our newsletter!</div>';
        } else {
            newsletterForm.innerHTML = '<div class="form-success">Thank you for subscribing to our newsletter!</div>';
        }
    });
}

/**
 * Show error message for a form field
 * @param {HTMLElement} input - The input element
 * @param {string} message - The error message
 */
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    
    if (formGroup) {
        const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
        
        if (!formGroup.querySelector('.error-message')) {
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.classList.add('error');
    }
}

/**
 * Clear error message for a form field
 * @param {HTMLElement} input - The input element
 */
function clearError(input) {
    const formGroup = input.closest('.form-group');
    
    if (formGroup) {
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        input.classList.remove('error');
    }
}