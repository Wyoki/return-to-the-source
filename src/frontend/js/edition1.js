/**
 * Edition1 page specific JavaScript
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Edition1 page specific functionality
    initEdition1Page();
});

/**
 * Initialize Edition1 page specific functionality
 */
function initEdition1Page() {
    // Initialize filmmaker profile interactions
    initFilmmakerProfiles();
    
    // Initialize gallery lightbox
    initGalleryLightbox();
    
    // Initialize video players
    initVideoPlayers();
}

/**
 * Initialize filmmaker profile interactions
 */
function initFilmmakerProfiles() {
    const filmmakerProfiles = document.querySelectorAll('.team-member');
    
    if (filmmakerProfiles.length > 0) {
        filmmakerProfiles.forEach(profile => {
            // Add hover effect
            profile.addEventListener('mouseenter', () => {
                profile.classList.add('hover');
            });
            
            profile.addEventListener('mouseleave', () => {
                profile.classList.remove('hover');
            });
        });
    }
}

/**
 * Initialize gallery lightbox
 */
function initGalleryLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-image img');
    
    if (galleryImages.length > 0) {
        galleryImages.forEach(image => {
            image.addEventListener('click', () => {
                // Create lightbox
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                
                // Create lightbox content
                const lightboxContent = document.createElement('div');
                lightboxContent.className = 'lightbox-content';
                
                // Create close button
                const closeButton = document.createElement('span');
                closeButton.className = 'lightbox-close';
                closeButton.innerHTML = '&times;';
                
                // Create image
                const lightboxImage = document.createElement('img');
                lightboxImage.src = image.src;
                lightboxImage.alt = image.alt;
                
                // Append elements
                lightboxContent.appendChild(closeButton);
                lightboxContent.appendChild(lightboxImage);
                lightbox.appendChild(lightboxContent);
                document.body.appendChild(lightbox);
                
                // Add close functionality
                closeButton.addEventListener('click', () => {
                    document.body.removeChild(lightbox);
                });
                
                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) {
                        document.body.removeChild(lightbox);
                    }
                });
            });
        });
    }
}

/**
 * Initialize video players
 */
function initVideoPlayers() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    if (videoContainers.length > 0) {
        videoContainers.forEach(container => {
            const video = container.querySelector('video');
            const playButton = container.querySelector('.play-button');
            
            if (video && playButton) {
                playButton.addEventListener('click', () => {
                    if (video.paused) {
                        video.play();
                        playButton.style.display = 'none';
                    } else {
                        video.pause();
                        playButton.style.display = 'flex';
                    }
                });
                
                video.addEventListener('ended', () => {
                    playButton.style.display = 'flex';
                });
            }
        });
    }
}