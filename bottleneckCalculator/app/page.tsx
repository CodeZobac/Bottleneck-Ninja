import { Metadata } from 'next';
import ClientHome from './client-home';
import { ToastProvider } from './components/ui/toast';

export const metadata: Metadata = {
  title: "Bottleneck Ninja - Find and Fix PC Hardware Bottlenecks",
  description: "Analyze your PC build to identify hardware bottlenecks. Our free calculator helps you optimize CPU, GPU, and RAM combinations for gaming and productivity.",
  keywords: ["bottleneck calculator", "PC performance", "hardware compatibility", "CPU GPU bottleneck", "system optimizer"],
  openGraph: {
    title: "Bottleneck Ninja - PC Performance Optimization Tool",
    description: "Free tool to analyze and fix hardware bottlenecks in your PC build",
    images: [
      {
        url: "/name.svg",
        width: 1200,
        height: 630,
        alt: "Bottleneck Ninja Homepage",
      }
    ],
  }
};

export default function Home() {
  return (
    <ToastProvider>
      <ClientHome />
    </ToastProvider>
  );
}


