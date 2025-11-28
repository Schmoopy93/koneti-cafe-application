import { useEffect } from 'react';

/**
 * Custom hook that prevents body scroll when modal/popup is open
 * Usage: useScrollLock(isOpen)
 * 
 * This ensures consistent UX across all modals and popups in the application
 */
export const useScrollLock = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      // Disable scroll
      document.body.classList.add('body--no-scroll');
      // Also handle iOS Safari
      document.body.style.overflow = 'hidden';
    } else {
      // Enable scroll
      document.body.classList.remove('body--no-scroll');
      document.body.style.overflow = '';
    }

    // Cleanup on unmount or when isOpen changes
    return () => {
      document.body.classList.remove('body--no-scroll');
      document.body.style.overflow = '';
    };
  }, [isOpen]);
};
