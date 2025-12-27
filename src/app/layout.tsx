import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Burch Contracting | Reliable Home Repair & Remodeling in Simpsonville, SC",
  description: "Professional residential and light commercial contracting services in Simpsonville, SC. Quality craftsmanship, clear communication, and dependable service for all your home improvement needs.",
  keywords: ["home repair", "remodeling", "contractor", "Simpsonville SC", "home improvement", "residential contractor", "commercial contractor", "handyman services", "renovation", "construction"],
  authors: [{ name: "Burch Contracting" }],
  creator: "Burch Contracting",
  publisher: "Burch Contracting",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://burchcontracting.com",
    siteName: "Burch Contracting",
    title: "Burch Contracting | Reliable Home Repair & Remodeling in Simpsonville, SC",
    description: "Professional residential and light commercial contracting services in Simpsonville, SC. Quality craftsmanship, clear communication, and dependable service.",
    images: [
      {
        url: "https://burchcontracting.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Burch Contracting - Professional Home Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Burch Contracting | Reliable Home Repair & Remodeling",
    description: "Professional residential and light commercial contracting services in Simpsonville, SC.",
    images: ["https://burchcontracting.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "ntiguLhlJqrZC6Iwzu-HD4", // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
