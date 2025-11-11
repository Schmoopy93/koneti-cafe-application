import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://koneti.com'
  const languages = ['sr', 'en']

  const routes = [
    '',
    '/menu',
    '/reservation',
    '/career'
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  languages.forEach((lang) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: {
            sr: `${baseUrl}/sr${route}`,
            en: `${baseUrl}/en${route}`,
          },
        },
      })
    })
  })

  return sitemapEntries
}