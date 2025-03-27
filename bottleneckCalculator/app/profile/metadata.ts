import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Your Profile | Bottleneck Ninja",
  description: "Manage your Bottleneck Ninja account preferences. Set your PC hardware budget, usage preferences, and optimize your bottleneck analysis experience.",
  keywords: ["user profile", "PC preferences", "hardware budget", "performance settings", "account management"],
  openGraph: {
    title: "Your Bottleneck Ninja Profile",
    description: "Manage your PC hardware preferences and settings",
    images: [
      {
        url: "/name.svg",
        width: 1200,
        height: 630,
        alt: "Bottleneck Ninja User Profile",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Bottleneck Ninja Profile",
    description: "Manage your PC hardware preferences and settings",
    images: ["/name.svg"],
  }
};