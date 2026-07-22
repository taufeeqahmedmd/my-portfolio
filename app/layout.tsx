import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Mohammed Taufeeq Ahmed — Cloud Engineer",
  description:
    "Mohammed Taufeeq Ahmed — Cloud & DevOps Engineer. AWS, Docker, CI/CD, full-stack.",
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
      <body className={`${montserrat.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
