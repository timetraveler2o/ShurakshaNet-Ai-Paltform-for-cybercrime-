import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { scrollToTop } from '@/utils/scrollUtils';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    const mainElement = document.getElementById('mainContent');
    if (mainElement) {
      if (mainElement.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  };

  // Set up scroll event listener
  useEffect(() => {
    const mainElement = document.getElementById('mainContent');
    if (mainElement) {
      mainElement.addEventListener('scroll', toggleVisibility);
      
      // Initial check
      toggleVisibility();
      
      return () => mainElement.removeEventListener('scroll', toggleVisibility);
    }
  }, []);

  // Handle click
  const handleScrollToTop = () => {
    scrollToTop(true);
  };

  return (
    <button
      onClick={handleScrollToTop}
      className={`fixed bottom-20 right-4 md:bottom-6 md:right-6 p-3 rounded-full bg-blue-600 text-white shadow-blue-glow transition-all duration-300 z-40 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp size={20} />
    </button>
  );
};

export default ScrollToTopButton;