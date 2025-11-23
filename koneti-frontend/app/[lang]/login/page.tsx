import StaffLogin from "../../../components/auth/StaffLogin"
import type { Metadata } from 'next'

type Props = { params: Promise<{ lang: 'sr' | 'en' }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'sr' ? 'Prijava | Koneti Café' : 'Staff Login | Koneti Café',
    description: lang === 'sr'
      ? 'Interna prijava za osoblje.'
      : 'Internal staff login.',
    robots: { index: false, follow: false },
    alternates: { canonical: `https://koneticaffee.com/${lang}/login` }
  }
}

export default function LoginPage() {
  return <StaffLogin />
}