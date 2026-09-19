import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://algo-motion.example"),
  title: { default: "AlgoMotion", template: "%s · AlgoMotion" },
  description: "Interactive, bilingual algorithm visualizations for competitive programmers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" data-scroll-behavior="smooth" suppressHydrationWarning><body>{children}</body></html>;
}
