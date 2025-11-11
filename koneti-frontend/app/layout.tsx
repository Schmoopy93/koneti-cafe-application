import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koneti Café",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}