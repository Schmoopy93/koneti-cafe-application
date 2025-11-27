import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://koneticaffee.com';
  const languages = ['sr', 'en'];
  // Home je '' (prazan string), ostale rute bez 'home'
  const publicRoutes = ['', '/about', '/menu', '/reservation', '/career'];

  const entries: MetadataRoute.Sitemap = [];

  languages.forEach((lang) => {
    publicRoutes.forEach((route) => {
      // Izbegni duple slash-eve
      const cleanRoute = route.startsWith('/') ? route : `/${route}`;
      const url = route === '' ? `${baseUrl}/${lang}` : `${baseUrl}/${lang}${cleanRoute}`;
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route === '/about' ? 0.8 : 0.7,
        alternates: {
          languages: {
            sr: route === '' ? `${baseUrl}/sr` : `${baseUrl}/sr${cleanRoute}`,
            en: route === '' ? `${baseUrl}/en` : `${baseUrl}/en${cleanRoute}`,
          },
        },
      });
    });
  });

  return entries;
}