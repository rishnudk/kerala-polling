import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kerala Polling | Real-time Public Opinion & Live Results",
  description: "Join the conversation and participate in real-time polling across Kerala's districts. Stay updated with live, localized results and community insights.",
  keywords: ["Kerala Polling", "Public Opinion", "Live Results", "District-wise Data", "Kerala Elections", "Community Insights"],
  authors: [{ name: "Kerala Polling Team" }],
  openGraph: {
    title: "Kerala Polling | Real-time Public Opinion & Live Results",
    description: "Participate in real-time polling across Kerala's districts and see live results.",
    url: "https://keralapolling.com", // Placeholder
    siteName: "Kerala Polling",
    images: [
      {
        url: "/icon.png", // Use the new icon as a preview for now
        width: 512,
        height: 512,
        alt: "Kerala Polling Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kerala Polling | Real-time Public Opinion & Live Results",
    description: "Participate in real-time polling across Kerala's districts and see live results.",
    images: ["/icon.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
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
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
