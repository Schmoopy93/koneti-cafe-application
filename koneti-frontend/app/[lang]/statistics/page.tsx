import type { Metadata } from 'next'
import EventStatsPage from "@/components/statistics/EventStatsPage"

type Props = { params: Promise<{ lang: 'sr' | 'en' }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'sr' ? 'Statistika | Admin' : 'Statistics | Admin',
    robots: { index: false, follow: false },
    alternates: { canonical: `https://koneticaffee.com/${lang}/statistics` }
  }
}

export default function StatisticsPageWrapper() {
  return <EventStatsPage />
}
