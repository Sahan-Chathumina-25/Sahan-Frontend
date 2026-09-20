import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { AppLoader } from "@/components/layout/AppLoader";
import { BackgroundGrid } from "@/components/layout/BackgroundGrid";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "S A H A N — Network Engineer | Cybersecurity | Full-Stack Developer",
    template: "%s · S A H A N",
  },
  description: siteConfig.description,
  keywords: ["Network Engineer", "Cybersecurity", "Full-Stack Developer", "Sahan Chathumina", "Portfolio"],
  authors: [{ name: siteConfig.fullName }],
  creator: siteConfig.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "S A H A N — Network Engineer | Cybersecurity | Full-Stack Developer",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary",
    title: "S A H A N — Network Engineer | Cybersecurity | Full-Stack Developer",
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07090d",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.fullName,
  jobTitle: "Network Engineer",
  description: siteConfig.description,
  url: siteConfig.url,
  knowsAbout: ["Network Engineering", "Cybersecurity", "Full-Stack Development"],
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950"
        >
          Skip to content
        </a>
        <AppLoader />
        <CustomCursor />
        <ScrollProgress />
        <BackgroundGrid />
        <Navbar />
        <div id="content" className="relative z-10 pt-16">
          <PageTransition>{children}</PageTransition>
        </div>
        <Footer />
      </body>
    </html>
  );
}
