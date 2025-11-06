"use client";

import { useState, useEffect } from 'react';

const OfflineNotice = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotice(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotice(true);
    };

    // Check initial state
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showNotice) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: '#dc3545',
      color: 'white',
      padding: '0.5rem',
      textAlign: 'center',
      zIndex: 9999,
      fontSize: '0.9rem'
    }}>
      📡 Nema internet konekcije. Neki sadržaji možda neće biti dostupni.
    </div>
  );
};

export default OfflineNotice;