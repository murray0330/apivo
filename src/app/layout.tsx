import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apivo | AI Booking Assistant for Your Website",
  description:
    "Apivo is an AI chatbot that lives on your website, books appointments directly to your calendar, answers patient questions in 29+ languages, and never double-books — no staff required.",
  keywords: [
    "AI booking assistant",
    "AI chatbot appointment booking",
    "website chatbot",
    "automated scheduling",
    "AI front desk",
    "appointment chatbot",
    "calendar booking AI",
    "patient scheduling AI",
    "no double booking",
    "Apivo",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Apivo | AI Booking Assistant for Your Website",
    description:
      "An AI chatbot that books appointments, answers questions, and runs your front desk — 24/7, on autopilot.",
    url: "https://apivo.ai",
    siteName: "Apivo",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apivo | AI Booking Assistant for Your Website",
    description:
      "An AI chatbot that books appointments, answers questions, and runs your front desk — 24/7, on autopilot.",
    site: "@apivo_ai",
  },
  alternates: {
    canonical: "https://apivo.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-white text-zinc-900">
        {children}
        <Script
          src="https://vapi-chatbot.vercel.app/api/widget.js"
          data-widget-id="apivo"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
