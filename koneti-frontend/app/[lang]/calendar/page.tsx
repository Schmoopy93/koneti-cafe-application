import type { Metadata } from 'next'
import CalendarPageWrapper from "@/components/calendar/CalendarPageWrapper"

type Props = { params: Promise<{ lang: 'sr' | 'en' }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'sr' ? 'Kalendar | Admin' : 'Calendar | Admin',
    robots: { index: false, follow: false },
    alternates: { canonical: `https://koneti.com/${lang}/calendar` }
  }
}

export default function CalendarPage() {
  return <CalendarPageWrapper />
}