import Gallery from "../../../components/gallery/Gallery";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const metadata: Record<string, Metadata> = {
    sr: {
      title: "Galerija - Koneti Café",
      description: "Pogledajte naše fotografije iz kafea, događaja i atmosfere u Koneti Café-u.",
      alternates: {
        canonical: "https://koneti.com/sr/gallery",
      },
      openGraph: {
        title: "Galerija - Koneti Café",
        description: "Fotografije iz našeg kafea, specijaliteta i događaja.",
        url: "https://koneti.com/sr/gallery",
        type: "website",
        images: [
          {
            url: "/og/gallery.jpg",
            width: 1200,
            height: 630,
            alt: "Koneti Café Galerija",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Galerija - Koneti Café",
        description: "Fotografije iz našeg kafea, specijaliteta i događaja.",
        images: ["/og/gallery.jpg"],
      },
      robots: {
        index: true,
        follow: true,
      },
    },
    en: {
      title: "Gallery - Koneti Café",
      description: "View our photos from the café, events and atmosphere at Koneti Café.",
      alternates: {
        canonical: "https://koneti.com/en/gallery",
      },
      openGraph: {
        title: "Gallery - Koneti Café",
        description: "Photos from our café, specialties and events.",
        url: "https://koneti.com/en/gallery",
        type: "website",
        images: [
          {
            url: "/og/gallery.jpg",
            width: 1200,
            height: 630,
            alt: "Koneti Café Gallery",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Gallery - Koneti Café",
        description: "Photos from our café, specialties and events.",
        images: ["/og/gallery.jpg"],
      },
      robots: {
        index: true,
        follow: true,
      },
    },
  };

  return metadata[lang] || metadata.sr;
}

export default function GalleryPage() {
  return <Gallery />;
}
