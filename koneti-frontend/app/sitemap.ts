import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://koneticaffee.com';
  const languages = ['sr', 'en'];
  
  // Rute sa prioritetima - home je primaran (1.0)
  const routes = [
    { path: '', priority: 1.0, freq: 'daily' as const },
    { path: '/menu', priority: 0.9, freq: 'daily' as const },
    { path: '/reservation', priority: 0.85, freq: 'daily' as const },
    { path: '/about', priority: 0.8, freq: 'weekly' as const },
    { path: '/career', priority: 0.75, freq: 'weekly' as const },
    { path: '/sitemap-keywords', priority: 0.7, freq: 'weekly' as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Dodaj root URL
  entries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
    alternates: {
      languages: {
        sr: `${baseUrl}/sr`,
        en: `${baseUrl}/en`,
        'x-default': `${baseUrl}/sr`,
      },
    },
  });

  // Dodaj lokalizovane URL-e
  languages.forEach((lang) => {
    routes.forEach(({ path, priority, freq }) => {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      const url = `${baseUrl}/${lang}${cleanPath}`;
      
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: freq,
        priority,
        alternates: {
          languages: {
            sr: `${baseUrl}/sr${cleanPath}`,
            en: `${baseUrl}/en${cleanPath}`,
            'x-default': `${baseUrl}/sr${cleanPath}`,
          },
        },
      });
    });
  });

  return entries;
}