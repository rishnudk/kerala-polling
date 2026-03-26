import type { Metadata } from "next";
import { Outfit, Inter, Nunito_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kerala-polling.vercel.app"),
  title: "Kerala Polling | Real-time Public Opinion & Live Results",
  description: "Join the conversation and participate in real-time polling across Kerala's districts. Stay updated with live, localized results and community insights.",
  keywords: ["Kerala Polling", "Public Opinion", "Live Results", "District-wise Data", "Kerala Elections", "Community Insights"],
  authors: [{ name: "Kerala Polling Team" }],
  openGraph: {
    title: "Kerala Polling | Real-time Public Opinion & Live Results",
    description: "Participate in real-time polling across Kerala's districts and see live results.",
    url: "https://kerala-polling.vercel.app",
    siteName: "Kerala Polling",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Kerala Polling Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://kerala-polling.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      className={`${outfit.variable} ${inter.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
