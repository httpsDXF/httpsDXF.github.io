import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { JsonLd } from "./components/JsonLd";
import { SiteFooter } from "./components/SiteFooter";
import { siteConfig, siteUrl } from "./config/site";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.person.name, url: siteUrl }],
  creator: siteConfig.person.name,
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteUrl,
    siteName: siteConfig.siteName,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full bg-black font-sans text-white">
        <JsonLd />
        <div className="flex min-h-full flex-col">
          <div className="flex flex-1 flex-col">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
