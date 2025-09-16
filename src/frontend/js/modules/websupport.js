export function initWebPSupport() {
  return checkWebPSupport().then(supported => {
    document.documentElement.classList.toggle('webp', supported);
    updateImageSources(supported);
    setupLazyLoading(supported);
  });
}