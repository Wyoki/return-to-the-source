/**
 * Contact page specific JavaScript
 */

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Contact page specific functionality
    initContactPage();
});

/**
 * Initialize Contact page specific functionality
 */
function initContactPage() {
    // Initialize contact form validation
    initFormValidation();
    
    // Initialize FAQ accordion
    initFaqAccordion();
    
    // Initialize Google Maps (if available)
    initMap();
}

/**
 * Initialize form validation
 */
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form fields
            const nameInput = contactForm.querySelector('#name');
            const emailInput = contactForm.querySelector('#email');
            const subjectInput = contactForm.querySelector('#subject');
            const messageInput = contactForm.querySelector('#message');
            
            // Simple validation
            let isValid = true;
            
            // Validate name
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Please enter your name');
                isValid = false;
            } else {
                removeError(nameInput);
            }
            
            // Validate email
            if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                removeError(emailInput);
            }
            
            // Validate subject
            if (!subjectInput.value.trim()) {
                showError(subjectInput, 'Please enter a subject');
                isValid = false;
            } else {
                removeError(subjectInput);
            }
            
            // Validate message
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Please enter your message');
                isValid = false;
            } else {
                removeError(messageInput);
            }
            
            // If form is valid, submit it
            if (isValid) {
                // Show success message
                const formSubmit = contactForm.querySelector('.form-submit');
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.innerHTML = '<p>Thank you for your message! We will get back to you soon.</p>';
                
                // Insert success message before the submit button
                formSubmit.parentNode.insertBefore(successMessage, formSubmit);
                
                // Reset form
                contactForm.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
                
                // In a real application, you would send the form data to a server here
                console.log('Form submitted successfully');
            }
        });
    }
}

/**
 * Show error message for input
 */
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');
    
    // Create error message if it doesn't exist
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    // Set error message and add error class
    errorElement.textContent = message;
    input.classList.add('error');
}

/**
 * Remove error message for input
 */
function removeError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    // Remove error message if it exists
    if (errorElement) {
        errorElement.remove();
    }
    
    // Remove error class
    input.classList.remove('error');
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Initialize FAQ accordion
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach((item) => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Toggle active class
                item.classList.toggle('active');
                
                // Close other items
                faqItems.forEach((otherItem) => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        });
    }
}

/**
 * Initialize Google Maps
 */
function initMap() {
    // This function would initialize Google Maps
    // For demonstration purposes, we're just logging a message
    console.log('Map initialized');
}