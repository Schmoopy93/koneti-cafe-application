/**
 * Cookie utility functions
 */

export interface CookieOptions {
  expires?: Date | number;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
  if (typeof document === 'undefined') return;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expires) {
    if (typeof options.expires === 'number') {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    } else {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }
  }

  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  } else {
    cookieString += `; path=/`;
  }

  if (options.secure) {
    cookieString += `; secure`;
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    let c = cookie.trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null;
};

export const deleteCookie = (name: string, options: Omit<CookieOptions, 'expires' | 'maxAge'> = {}) => {
  setCookie(name, '', { ...options, expires: new Date(0) });
};

export const getAllCookies = (): Record<string, string> => {
  if (typeof document === 'undefined') return {};

  const cookies: Record<string, string> = {};
  document.cookie.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  });
  return cookies;
};

// Cookie categories for GDPR compliance
export const COOKIE_CATEGORIES = {
  NECESSARY: 'necessary',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
  PREFERENCES: 'preferences'
} as const;

export type CookieCategory = typeof COOKIE_CATEGORIES[keyof typeof COOKIE_CATEGORIES];

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export const getDefaultCookiePreferences = (): CookiePreferences => ({
  necessary: true, // Always true, can't be disabled
  analytics: false,
  marketing: false,
  preferences: false
});

export const saveCookiePreferences = (preferences: CookiePreferences) => {
  setCookie('cookie_preferences', JSON.stringify(preferences), {
    expires: 365, // 1 year
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
};

export const getCookiePreferences = (): CookiePreferences => {
  const saved = getCookie('cookie_preferences');
  if (saved) {
    try {
      return { ...getDefaultCookiePreferences(), ...JSON.parse(saved) };
    } catch {
      return getDefaultCookiePreferences();
    }
  }
  return getDefaultCookiePreferences();
};

export const hasAcceptedCookies = (): boolean => {
  return getCookie('cookie_consent') === 'accepted';
};

export const acceptAllCookies = () => {
  const allAccepted: CookiePreferences = {
    necessary: true,
    analytics: true,
    marketing: true,
    preferences: true
  };
  
  saveCookiePreferences(allAccepted);
  setCookie('cookie_consent', 'accepted', {
    expires: 365,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
};