import type { Metadata } from 'next'
import GalleryManagementPageWrapper from "@/components/admin/GalleryManagementPageWrapper"

type Props = { params: Promise<{ lang: 'sr' | 'en' }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'sr' ? 'Upravljanje Galerijom | Admin' : 'Gallery Management | Admin',
    robots: { index: false, follow: false },
    alternates: { canonical: `https://koneti.com/${lang}/admin/gallery` }
  }
}

export default function GalleryManagementPage() {
  return <GalleryManagementPageWrapper />
}
