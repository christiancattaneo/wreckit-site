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
  title: "Reckit Ralph — AI Code Verification",
  description:
    "Reckit Ralph is a full verification system for software quality. Ralph Loop is one gate inside a broader evidence pipeline.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Reckit Ralph",
    "description": "AI code verification system. 11 parallel gates — slop scan, type check, mutation testing, security, and more. Ships a signed proof bundle with every verdict.",
    "url": "https://wreckit-ralph.vercel.app",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web, CLI",
    "offers": [
      { "@type": "Offer", "name": "Free", "price": "0", "priceCurrency": "USD" },
      { "@type": "Offer", "name": "Pro", "price": "29", "priceCurrency": "USD", "billingIncrement": "month" },
      { "@type": "Offer", "name": "Team", "price": "99", "priceCurrency": "USD", "billingIncrement": "month" }
    ],
    "publisher": {
      "@type": "Organization",
      "name": "Reckit Ralph",
      "url": "https://wreckit-ralph.vercel.app"
    }
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
      <body className="bg-[var(--bg)] text-[var(--text)] antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
