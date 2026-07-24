import type { Metadata, Viewport } from "next";
import { Montserrat, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import Preloader from "@/components/Preloader";
import { siteGraph } from "@/lib/schema";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_KEYWORDS } from "@/lib/site";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mohammed Taufeeq Ahmed — Cloud & DevOps Engineer",
    template: "%s — Mohammed Taufeeq Ahmed",
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: `${SITE_NAME} — Portfolio`,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "profile",
    firstName: "Mohammed Taufeeq",
    lastName: "Ahmed",
    username: "taufeeqahmedmd",
    title: "Mohammed Taufeeq Ahmed — Cloud & DevOps Engineer",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    images: [{ url: "/portrait.png", alt: "Mohammed Taufeeq Ahmed — Cloud & DevOps Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammed Taufeeq Ahmed — Cloud & DevOps Engineer",
    description: SITE_DESCRIPTION,
    images: ["/portrait.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Keep pinch-zoom available for accessibility; only ensure a sensible cap.
  maximumScale: 5,
  // Extends the layout into the notch/home-indicator areas so we can pad with env().
  viewportFit: "cover",
  themeColor: "#1c1d1f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      >
        <JsonLd data={siteGraph()} />
        {/* If JS is disabled the overlay can never animate away — hide it. */}
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
        <Preloader />
        {children}
      </body>
    </html>
  );
}
