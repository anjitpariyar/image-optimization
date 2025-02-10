import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Image Optimization - Web-Optimized Images in .webp Format",
  description: "Optimize images for the web with our API. Convert images to .webp format, reduce file size to under 100KB, and resize images to a maximum width of 2500px while maintaining aspect ratio.",
  keywords: "image optimization, webp, image compression, image resizing, image conversion, image processing, image API, WebP Conversion, Fast Loading Images, Web Performance",
  URL: "https://image-optimization.tech/"
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
        {children}
        <SpeedInsights />
        <Analytics />
        
      </body>
    </html>
  );
}
