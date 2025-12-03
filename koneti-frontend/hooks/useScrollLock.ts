import { useEffect, useRef } from 'react';

/**
 * Custom hook that prevents body scroll when modal/popup is open
 * and preserves scroll position when closing
 * Usage: useScrollLock(isOpen)
 * 
 * This ensures consistent UX across all modals and popups in the application
 */
export const useScrollLock = (isOpen: boolean) => {
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      scrollPositionRef.current = window.scrollY || document.documentElement.scrollTop;
      
      // Disable scroll
      document.body.classList.add('body--no-scroll');
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px';
    } else {
      // Enable scroll
      document.body.classList.remove('body--no-scroll');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollPositionRef.current);
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('body--no-scroll');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);
};
