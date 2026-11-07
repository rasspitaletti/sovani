import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "Soneva Jani, Beyond Paradise | Independent concept redesign";
const description = "An independent concept redesign of the Soneva Jani digital experience: a real-time lagoon, overwater villas and the Noonu Atoll, Maldives. Not affiliated with Soneva.";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title,
  description,
  robots: { index: false }, // a concept should never outrank the resort's own site
  openGraph: { title, description, type: "website", images: ["/media/hero-golden.webp"] },
  twitter: { card: "summary_large_image", title, description, images: ["/media/hero-golden.webp"] },
};
export const viewport: Viewport = { themeColor: "#050b10", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preload" href="/fonts/boska-400.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
