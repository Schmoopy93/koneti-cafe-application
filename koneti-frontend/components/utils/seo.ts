import type { Metadata } from 'next'

const BASE_URL = 'https://koneti.com'
const LOCALE_MAP: Record<string, string> = { sr: 'sr_RS', en: 'en_US' }

interface BuildMetaOptions {
  lang: 'sr' | 'en'
  path: string
  title: string
  description: string
  image?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  keywords?: string[]
}

export function buildMetadata(opts: BuildMetaOptions): Metadata {
  const {
    lang,
    path,
    title,
    description,
    image = '/og/cover.jpg',
    type = 'website',
    noIndex = false,
    keywords = []
  } = opts

  const canonical = `${BASE_URL}/${lang}${path}`

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        sr: `${BASE_URL}/sr${path}`,
        en: `${BASE_URL}/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type,
      siteName: 'Koneti Café',
      locale: LOCALE_MAP[lang],
      images: [{
        url: image.startsWith('http') ? image : `${BASE_URL}${image}`,
        width: 1200,
        height: 630,
        alt: title
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@KonetiCafe'
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      }
    }
  }
}