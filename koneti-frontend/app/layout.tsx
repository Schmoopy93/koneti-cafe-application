import type { Metadata, Viewport } from "next";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import "@/styles/main.scss";

export const metadata: Metadata = {
  title: "Koneti Café",
  description: "Premium coffee experience",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 5,
};

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={lang}>
      <head>
        <GoogleAnalytics />
      </head>
      <body>{children}</body>
    </html>
  );
}