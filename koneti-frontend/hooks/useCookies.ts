import { useState, useEffect } from 'react';
import { 
  getCookie, 
  setCookie, 
  deleteCookie, 
  getCookiePreferences, 
  hasAcceptedCookies,
  type CookieOptions,
  type CookiePreferences 
} from '@/utils/cookies';

export const useCookie = (name: string, defaultValue?: string) => {
  const [value, setValue] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return getCookie(name) || defaultValue || null;
    }
    return defaultValue || null;
  });

  const updateCookie = (newValue: string, options?: CookieOptions) => {
    setCookie(name, newValue, options);
    setValue(newValue);
  };

  const removeCookie = (options?: Omit<CookieOptions, 'expires' | 'maxAge'>) => {
    deleteCookie(name, options);
    setValue(null);
  };

  useEffect(() => {
    const currentValue = getCookie(name);
    if (currentValue !== value) {
      setValue(currentValue);
    }
  }, [name, value]);

  return [value, updateCookie, removeCookie] as const;
};

export const useCookiePreferences = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    if (typeof window !== 'undefined') {
      return getCookiePreferences();
    }
    return {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
  });

  const [hasConsent, setHasConsent] = useState(() => {
    if (typeof window !== 'undefined') {
      return hasAcceptedCookies();
    }
    return false;
  });

  useEffect(() => {
    setPreferences(getCookiePreferences());
    setHasConsent(hasAcceptedCookies());
  }, []);

  return {
    preferences,
    hasConsent,
    canUseAnalytics: hasConsent && preferences.analytics,
    canUseMarketing: hasConsent && preferences.marketing,
    canUsePreferences: hasConsent && preferences.preferences
  };
};