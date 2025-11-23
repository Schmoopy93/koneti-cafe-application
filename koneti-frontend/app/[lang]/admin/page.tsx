import type { Metadata } from 'next'
import AdminPageWrapper from "@/components/admin/AdminPageWrapper"

type Props = { params: Promise<{ lang: 'sr' | 'en' }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  return {
    title: 'Admin Panel | Koneti Café',
    robots: { index: false, follow: false },
    alternates: { canonical: `https://koneticaffee.com/${lang}/admin` }
  }
}

export default function AdminPage() {
  return <AdminPageWrapper />
}