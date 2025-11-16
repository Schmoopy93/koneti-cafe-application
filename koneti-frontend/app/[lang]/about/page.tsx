import About from "../../../components/about/About";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const metadata: Record<string, Metadata> = {
    sr: {
      title: "O Nama - Koneti Café",
      description: "Upoznajte priču iza Caffe bar Koneti - naša strast, misija i posvećenost kvalitetu.",
      alternates: {
        canonical: "https://koneti.com/sr/about",
      },
      openGraph: {
        title: "O Nama - Koneti Café",
        description: "Saznajte više o našoj priči, vrednostima i posvećenosti kvalitetu.",
        url: "https://koneti.com/sr/about",
        type: "website",
        images: [
          {
            url: "/og/about.jpg",
            width: 1200,
            height: 630,
            alt: "Koneti Café - O Nama",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "O Nama - Koneti Café",
        description: "Saznajte više o našoj priči, vrednostima i posvećenosti kvalitetu.",
        images: ["/og/about.jpg"],
      },
      robots: {
        index: true,
        follow: true,
      },
    },
    en: {
      title: "About Us - Koneti Café",
      description: "Discover the story behind Caffe bar Koneti - our passion, mission and dedication to quality.",
      alternates: {
        canonical: "https://koneti.com/en/about",
      },
      openGraph: {
        title: "About Us - Koneti Café",
        description: "Learn more about our story, values and commitment to quality.",
        url: "https://koneti.com/en/about",
        type: "website",
        images: [
          {
            url: "/og/about.jpg",
            width: 1200,
            height: 630,
            alt: "Koneti Café - About Us",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "About Us - Koneti Café",
        description: "Learn more about our story, values and commitment to quality.",
        images: ["/og/about.jpg"],
      },
      robots: {
        index: true,
        follow: true,
      },
    },
  };

  return metadata[lang] || metadata.sr;
}

export default function AboutPage() {
  return <About />;
}
