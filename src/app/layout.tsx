import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "dice.fun - Where Creators Actually Win",
  description:
    "Decentralized streaming platform built on Kadena blockchain. 0.5% fees, instant payments, Filecoin storage. No barriers, no BS.",
  keywords: [
    "dice.fun",
    "streaming platform",
    "Kadena blockchain",
    "decentralized",
    "creator economy",
    "Web3",
    "zero gas fees",
    "instant payments",
    "Filecoin storage"
  ],
  authors: [{ name: "dice.fun team" }],
  creator: "dice.fun",
  publisher: "dice.fun",
  openGraph: {
    title: "dice.fun - Where Creators Actually Win",
    description: "Decentralized streaming platform with 0.5% fees, instant payments, and Filecoin storage",
    siteName: "dice.fun",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "dice.fun - Where Creators Actually Win",
    description: "Decentralized streaming platform with 0.5% fees, instant payments, and Filecoin storage",
    creator: "@dicefun_xyz",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
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
        className={`${inter.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />{" "}
      </body>
    </html>
  );
}
