import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import "./sitemap-keywords.scss";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const metadata: Record<string, Metadata> = {
    sr: {
      title: "Koneti - Ključne reči i važni linkovi | Sitemap",
      description: "Pronađite sve važne linkove, ključne reči i informacije o Koneti Café-u u Novom Sadu. Specialty coffee, proslave, poslovni sastanci.",
      keywords: ["Koneti", "sitemap", "ključne reči", "linkovi", "kafić Novi Sad"],
    },
    en: {
      title: "Koneti - Keywords and Important Links | Sitemap",
      description: "Find all important links, keywords and information about Koneti Café in Novi Sad. Specialty coffee, celebrations, business meetings.",
      keywords: ["Koneti", "sitemap", "keywords", "links", "café Novi Sad"],
    },
  };

  return metadata[lang] || metadata.sr;
}

interface SitemapKeywordsProps {
  params: Promise<{ lang: string }>;
}

export default async function SitemapKeywords({ params }: SitemapKeywordsProps) {
  const { lang } = await params;
  const isSerbian = lang === "sr";

  const keywords = {
    sr: [
      { text: "Koneti kafić Novi Sad", href: "/sr" },
      { text: "Najbolja kafa u Novom Sadu", href: "/sr/menu" },
      { text: "Specialty coffee Novi Sad", href: "/sr/menu" },
      { text: "Brunch Novi Sad", href: "/sr/menu" },
      { text: "Poslovni sastanci", href: "/sr/reservation?type=business" },
      { text: "Proslave Novi Sad", href: "/sr/reservation?type=experience" },
      { text: "Ketering usluge", href: "/sr/reservation" },
      { text: "Premium kafić", href: "/sr" },
      { text: "Event prostor Novi Sad", href: "/sr/reservation" },
      { text: "Privatni događaji", href: "/sr/reservation" },
      { text: "Caffe bar Novi Sad", href: "/sr" },
      { text: "Rezervacija stolova online", href: "/sr/reservation" },
    ],
    en: [
      { text: "Koneti café Novi Sad", href: "/en" },
      { text: "Best coffee in Novi Sad", href: "/en/menu" },
      { text: "Specialty coffee Novi Sad", href: "/en/menu" },
      { text: "Brunch Novi Sad", href: "/en/menu" },
      { text: "Business meetings", href: "/en/reservation?type=business" },
      { text: "Celebrations in Novi Sad", href: "/en/reservation?type=experience" },
      { text: "Catering services", href: "/en/reservation" },
      { text: "Premium café", href: "/en" },
      { text: "Event space Novi Sad", href: "/en/reservation" },
      { text: "Private events", href: "/en/reservation" },
      { text: "Coffee shop Novi Sad", href: "/en" },
      { text: "Online table reservation", href: "/en/reservation" },
    ],
  };

  const currentKeywords = isSerbian ? keywords.sr : keywords.en;

  return (
    <div className="sitemap-keywords-container">
      <div className="sitemap-keywords">
        <h1>{isSerbian ? "Ključne reči i linkovi" : "Keywords and Links"}</h1>
        <p>
          {isSerbian
            ? "Pronađite sve važne linkove i ključne reči povezane sa Koneti Café-om"
            : "Find all important links and keywords related to Koneti Café"}
        </p>

        <div className="keywords-grid">
          {currentKeywords.map((keyword, index) => (
            <Link
              key={index}
              href={keyword.href}
              className="keyword-link"
              title={keyword.text}
            >
              {keyword.text}
            </Link>
          ))}
        </div>

        <div className="additional-info">
          <h2>{isSerbian ? "Dodatne informacije" : "Additional Information"}</h2>
          <p>
            {isSerbian
              ? "Koneti se nalazi na Bulevaru Oslobođenja 97, Novi Sad, Srbija. Nudimo premium specialty coffee, brunch, ketering i prostor za poslovne sastanke i proslave."
              : "Koneti is located at Bulevar Oslobođenja 97, Novi Sad, Serbia. We offer premium specialty coffee, brunch, catering and space for business meetings and celebrations."}
          </p>
        </div>
      </div>
    </div>
  );
}
