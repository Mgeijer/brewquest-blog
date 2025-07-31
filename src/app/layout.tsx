import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "../components/navigation/Footer";
import Header from "../components/navigation/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Hop Harrison's Beer Blog | Discover America's Craft Beer Stories",
  description: "Join Hop Harrison on an epic journey across all 50 states, exploring breweries, flavors, and the passionate people behind America's craft beer renaissance.",
  keywords: ["craft beer", "brewery tours", "beer reviews", "american craft beer", "hop harrison", "beer blog"],
  authors: [{ name: "Hop Harrison" }],
  openGraph: {
    title: "Hop Harrison's Beer Blog",
    description: "Discover America's craft beer stories, one state at a time",
    url: "https://hopharrison.com",
    siteName: "Hop Harrison's Beer Blog",
    images: [
      {
        url: "/images/hop-harrison-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Hop Harrison exploring America's craft beer scene",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
