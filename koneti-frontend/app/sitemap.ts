import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://koneti.com'
  const languages = ['sr', 'en']
  const publicRoutes = ['', '/about', '/menu', '/reservation', '/career']

  const entries: MetadataRoute.Sitemap = []

  languages.forEach((lang) => {
    publicRoutes.forEach((route) => {
      const url = `${baseUrl}/${lang}${route}`
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority:
          route === '' ? 1 :
          route === '/about' ? 0.7 :
          0.8,
        alternates: {
          languages: {
            sr: `${baseUrl}/sr${route}`,
            en: `${baseUrl}/en${route}`,
          },
        },
      })
    })
  })

  return entries
}