import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./providers/auth-provider";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react"
import { Providers } from "./providers/providers";


// Define the Geist fonts
const geistSans = localFont({
  src: [
    {
      path: '../node_modules/geist/dist/fonts/geist-sans/Geist-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/geist/dist/fonts/geist-sans/Geist-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/geist/dist/fonts/geist-sans/Geist-Bold.woff2',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-geist-sans',
});

const geistMono = localFont({
  src: [
    {
      path: '../node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/geist/dist/fonts/geist-mono/GeistMono-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/geist/dist/fonts/geist-mono/GeistMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: "Bottleneck Calculator - Find Your PC Component Bottlenecks",
  description: "Identify and resolve hardware bottlenecks in your PC build. Compare CPU, GPU, and RAM performance to optimize your system for gaming and productivity.",
  keywords: ["bottleneck calculator", "PC bottleneck", "CPU GPU bottleneck", "hardware compatibility", "PC performance optimization"],
  authors: [{ name: "Bottleneck Ninja" }],
  creator: "Bottleneck Ninja",
  publisher: "Bottleneck Ninja",
  openGraph: {
    title: "Bottleneck Calculator - Optimize Your PC Build",
    description: "Identify hardware bottlenecks and optimize your PC build for maximum performance",
    url: "https://bottleneck-ninja.vercel.app",
    siteName: "Bottleneck Ninja",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/name.svg",
        width: 1200,
        height: 630,
        alt: "Bottleneck Ninja Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bottleneck Calculator - Optimize Your PC Build",
    description: "Identify hardware bottlenecks and optimize your PC build for maximum performance",
    images: ["/name.svg"],
    creator: "@bottleneckninja",
  },
  icons: {
    icon: "/icon.jpg",
    shortcut: "/icon.jpg",
    apple: "/icon.jpg",
  },
  metadataBase: new URL("https://bottleneck-ninja.vercel.app"),
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://bottleneck-ninja.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthProvider>
          
              {children}
            
          </AuthProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
