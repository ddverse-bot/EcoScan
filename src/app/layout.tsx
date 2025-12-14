import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI EcoScan - Ecological Footprint Estimator",
  description: "Use your phone camera and AI to analyze objects and estimate your ecological footprint in real-time. Scan food, clothing, appliances, and more to learn about your environmental impact.",
  keywords: "ecological footprint, AI scanner, environmental impact, sustainability, carbon footprint, eco-friendly",
  authors: [{ name: "AI EcoScan Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#22c55e",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI EcoScan" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} h-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 antialiased`}>
        <div className="min-h-full flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}