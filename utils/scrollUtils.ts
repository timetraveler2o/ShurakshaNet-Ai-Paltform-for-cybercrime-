/**
 * Utility functions for handling scrolling in the application
 */

/**
 * Scrolls the main content area to the top
 * @param smooth Whether to use smooth scrolling animation
 */
export const scrollToTop = (smooth: boolean = true) => {
  const mainElement = document.getElementById('mainContent');
  if (mainElement) {
    mainElement.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }
};

/**
 * Scrolls the main content area to a specific element
 * @param elementId The ID of the element to scroll to
 * @param offset Optional offset from the top of the element (in pixels)
 */
export const scrollToElement = (elementId: string, offset: number = 0) => {
  const mainElement = document.getElementById('mainContent');
  const targetElement = document.getElementById(elementId);
  
  if (mainElement && targetElement) {
    const targetPosition = targetElement.getBoundingClientRect().top + mainElement.scrollTop - offset;
    
    mainElement.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Enables or disables scrolling on the main content area
 * @param enable Whether to enable or disable scrolling
 */
export const toggleScrolling = (enable: boolean) => {
  const mainElement = document.getElementById('mainContent');
  if (mainElement) {
    mainElement.style.overflowY = enable ? 'auto' : 'hidden';
  }
};

/**
 * Updates the scroll indicator based on current scroll position
 */
export const updateScrollIndicator = () => {
  const mainElement = document.getElementById('mainContent');
  if (mainElement) {
    const scrollTop = mainElement.scrollTop;
    const scrollHeight = mainElement.scrollHeight - mainElement.clientHeight;
    const scrollPercent = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    
    const indicator = document.getElementById('pageScrollIndicator');
    if (indicator) {
      indicator.style.transform = `scaleX(${scrollPercent})`;
    }
  }
};