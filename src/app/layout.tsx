// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { BackgroundShader } from "@/components/BackgroundShader";
import { NavigationLayout } from "@/components/NavigationLayout";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "CarbonCoach — Personal Carbon Living World",
  description: "A carbon awareness platform where your daily choices shape a living world, guided by contextual AI nudges.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CarbonCoach",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "CarbonCoach",
    title: "CarbonCoach — Personal Carbon Living World",
    description: "Track your carbon footprint with a living, animated world that reacts to your choices",
  },
  twitter: {
    card: "summary_large_image",
    title: "CarbonCoach — Personal Carbon Living World",
    description: "Track your carbon footprint with a living, animated world that reacts to your choices",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable}`}
    >
      <body className="bg-background text-on-surface antialiased overflow-x-hidden min-h-screen relative font-sans">
        {/* Unified premium WebGL Background Shader */}
        <BackgroundShader />

        {/* Global Navigation Shell */}
        <NavigationLayout>{children}</NavigationLayout>
      </body>
    </html>
  );
}
