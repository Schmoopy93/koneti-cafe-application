'use client';

import { GoogleAnalytics } from '@next/third-parties/google';

export default function GA() {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  if (!gaId) {
    console.warn('Google Analytics ID je missing');
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}