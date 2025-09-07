/* gallery.js  –  universal image / video light-box (Optimized)
   opts = { selector, lightboxClass, closeOnBackdrop: true, closeOnEsc: true }
*/
export function initGallery(opts = {}) {
  const SEL        = opts.selector || '.gallery img';
  const LB_CLASS   = opts.lightboxClass || 'rts-lightbox';
  const CLOSE_BG   = opts.closeOnBackdrop !== false;
  const CLOSE_ESC  = opts.closeOnEsc !== false;

  const items = Array.from(document.querySelectorAll(SEL));
  if (!items.length) return;

  let active = null;
  let keydownHandler = null;

  function open(src, alt, element) {
    if (active) return;
    
    active = document.createElement('div');
    active.className = LB_CLASS;
    active.setAttribute('role', 'dialog');
    active.setAttribute('aria-modal', 'true');
    active.setAttribute('aria-label', 'Image preview');
    
    active.innerHTML = `
      <button class="${LB_CLASS}__close" aria-label="Close dialog">&times;</button>
      <div class="${LB_CLASS}__content">
        <img src="${src}" alt="${alt || ''}" loading="eager">
      </div>
    `;
    
    document.body.appendChild(active);
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    active.querySelector(`.${LB_CLASS}__close`).focus();

    // Add event listeners with proper cleanup references
    const backdropClickHandler = e => {
      if (CLOSE_BG && e.target === active) close();
    };
    
    const closeClickHandler = () => close();
    
    keydownHandler = e => {
      if (CLOSE_ESC && e.key === 'Escape') close();
    };
    
    active.addEventListener('click', backdropClickHandler);
    active.querySelector(`.${LB_CLASS}__close`).addEventListener('click', closeClickHandler);
    
    if (CLOSE_ESC) {
      document.addEventListener('keydown', keydownHandler);
    }
    
    // Store handlers for cleanup
    active._handlers = {
      backdrop: backdropClickHandler,
      close: closeClickHandler,
      keydown: keydownHandler
    };
  }

  function close() {
    if (!active) return;
    
    // Remove event listeners
    active.removeEventListener('click', active._handlers.backdrop);
    active.querySelector(`.${LB_CLASS}__close`).removeEventListener('click', active._handlers.close);
    
    if (CLOSE_ESC) {
      document.removeEventListener('keydown', active._handlers.keydown);
    }
    
    // Clean up
    document.body.style.overflow = '';
    active.remove();
    active = null;
    keydownHandler = null;
  }

  // Add click handlers to gallery items
  items.forEach(img => {
    // Skip if already has a listener (to prevent duplicates)
    if (img._galleryListener) return;
    
    img.style.cursor = 'zoom-in';
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Enlarge image');
    
    const clickHandler = () => open(img.src, img.alt, img);
    
    // Add keyboard support
    const keydownHandler = e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(img.src, img.alt, img);
      }
    };
    
    img.addEventListener('click', clickHandler);
    img.addEventListener('keydown', keydownHandler);
    
    // Store reference for potential cleanup
    img._galleryListener = clickHandler;
    img._galleryKeydown = keydownHandler;
  });
  
  // Return API for potential external control
  return {
    open,
    close,
    items
  };
}