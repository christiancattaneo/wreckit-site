import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "wreckit — Bulletproof AI Code Verification",
  description:
    "14 verification gates. Mutation testing, SAST, dynamic analysis, and more. Ship proof, not vibes. An OpenClaw skill by Christian Cattaneo.",
  metadataBase: new URL("https://wreckit-ralph.vercel.app"),
  openGraph: {
    title: "wreckit — Bulletproof AI Code Verification",
    description: "14 verification gates. Ship proof, not vibes.",
    url: "https://wreckit-ralph.vercel.app",
    siteName: "wreckit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "wreckit — Bulletproof AI Code Verification",
    description: "14 verification gates. Ship proof, not vibes.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "wreckit",
    "description": "Bulletproof AI code verification. 14 parallel gates — slop scan, type check, mutation testing, SAST, dynamic analysis, and more. Ships a signed proof bundle with every verdict.",
    "url": "https://wreckit-ralph.vercel.app",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "macOS, Linux",
    "offers": {
      "@type": "Offer",
      "name": "Open Source",
      "price": "0",
      "priceCurrency": "USD",
    },
    "publisher": {
      "@type": "Person",
      "name": "Christian Cattaneo",
    },
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${syne.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#fafafa] text-[#1a1a2e] antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
