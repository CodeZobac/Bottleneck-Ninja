import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "PC Bottleneck Results - Detailed Hardware Analysis | Bottleneck Ninja",
  description: "View your detailed PC hardware bottleneck analysis. See how your CPU, GPU, and RAM work together and get personalized recommendations to improve performance.",
  keywords: ["bottleneck results", "PC hardware analysis", "system performance", "component compatibility", "hardware recommendations"],
  openGraph: {
    title: "Your PC Bottleneck Analysis Results | Bottleneck Ninja",
    description: "View your personalized hardware bottleneck analysis and recommendations",
    images: [
      {
        url: "/name.svg",
        width: 1200,
        height: 630,
        alt: "PC Bottleneck Analysis Results",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PC Bottleneck Analysis Results | Bottleneck Ninja",
    description: "View your personalized hardware bottleneck analysis and recommendations",
    images: ["/name.svg"],
  }
};