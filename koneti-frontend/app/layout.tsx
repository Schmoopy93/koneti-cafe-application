import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koneti Café",
  verification: {
    google: '1vHXZcaq_PxJ4JsGFbrV5PCygadNzzjPeUi',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}