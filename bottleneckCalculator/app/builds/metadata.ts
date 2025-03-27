import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Your PC Hardware Builds | Bottleneck Ninja",
  description: "View and manage your saved PC hardware builds. Compare performance, analyze bottlenecks, and track your component upgrades over time.",
  keywords: ["saved PC builds", "hardware comparison", "bottleneck history", "PC build management", "hardware tracking"],
  openGraph: {
    title: "Your PC Hardware Builds | Bottleneck Ninja",
    description: "Manage your saved PC builds and track component performance over time",
    images: [
      {
        url: "/name.svg",
        width: 1200,
        height: 630,
        alt: "PC Build Management Dashboard",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your PC Hardware Builds | Bottleneck Ninja",
    description: "Manage your saved PC builds and track component performance over time",
    images: ["/name.svg"],
  }
};