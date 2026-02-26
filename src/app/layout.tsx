import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Appointly AI — AI Chatbots That Actually Book Appointments",
  description:
    "Appointly AI creates intelligent website chatbots that book appointments directly on your calendar, answer customer questions, and never double-book.",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
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
