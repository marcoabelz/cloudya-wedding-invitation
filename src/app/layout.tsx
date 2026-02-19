import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { weddingConfig } from "@/lib/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000"
  ),
  title: {
    default: weddingConfig.meta.title,
    template: `%s | ${weddingConfig.meta.title}`,
  },
  description: weddingConfig.meta.description,
  keywords: ["wedding", "invitation", "undangan", "pernikahan", "nikah"],
  authors: [{ name: "Cloudya & Alvin" }],
  creator: "Cloudya & Alvin",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: weddingConfig.meta.title,
    description: weddingConfig.meta.description,
    type: "website",
    locale: "id_ID",
    images: [weddingConfig.meta.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: weddingConfig.meta.title,
    description: weddingConfig.meta.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fff1f2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
