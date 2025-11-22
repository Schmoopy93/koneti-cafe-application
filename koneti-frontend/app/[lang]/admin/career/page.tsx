import CareerManagementPageWrapper from "@/components/admin/CareerManagementPageWrapper"
import type { Metadata } from 'next'

type Props = { params: Promise<{ lang: 'sr' | 'en' }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'sr' ? 'Upravljanje Karijerom | Admin' : 'Career Management | Admin',
    robots: { index: false, follow: false },
    alternates: { canonical: `https://koneti.com/${lang}/admin/career` }
  }
}

export default function CareerManagementPage() {
  return <CareerManagementPageWrapper />
}