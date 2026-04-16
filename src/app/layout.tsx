import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Booking Assistant for Med Spas | Apivo",
  description:
    "Apivo is an AI chat widget built for Square-powered med spas. It knows your services, pricing, and FAQs — books appointments 24/7 without your staff touching it. Live in 48 hours.",
  keywords: [
    "AI booking assistant for med spas",
    "Square Scheduling chatbot",
    "med spa booking automation",
    "AI receptionist med spa",
    "AI booking assistant",
    "AI chatbot appointment booking",
    "website chatbot",
    "automated scheduling",
    "AI front desk",
    "appointment chatbot",
    "calendar booking AI",
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
    title: "AI Booking Assistant for Med Spas | Apivo",
    description:
      "Apivo is an AI chat widget built for Square-powered med spas. It knows your services, pricing, and FAQs — books appointments 24/7 without your staff touching it. Live in 48 hours.",
    url: "https://apivo.ai",
    siteName: "Apivo",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Booking Assistant for Med Spas | Apivo",
    description:
      "Apivo is an AI chat widget built for Square-powered med spas. It knows your services, pricing, and FAQs — books appointments 24/7 without your staff touching it. Live in 48 hours.",
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
