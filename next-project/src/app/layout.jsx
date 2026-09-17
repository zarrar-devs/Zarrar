import { Space_Grotesk, Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import PageTransition from "../components/PageTransition";

// Same three font families/weights as the old index.html <link> tags —
// next/font self-hosts them (no external Google Fonts request, no
// layout-shift flash), so the visual result is identical, just faster
// and better for SEO/Core Web Vitals.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// TODO: apna asli production domain yahan daalein — metadataBase, OG
// tags, robots.js aur sitemap.js sab isi se URLs banate hain.
const SITE_URL = "https://your-domain.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "a-lign studio — Websites that make sense",
    template: "%s | a-lign studio",
  },
  description:
    "From the first click to the inbox, we design, build, and send everything your brand needs to grow — websites, email marketing, and the strategy that ties them together.",
  keywords: [
    "web design",
    "web development",
    "email marketing",
    "branding",
    "digital studio",
  ],
  authors: [{ name: "a-lign studio" }],
  creator: "a-lign studio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "a-lign studio",
    title: "a-lign studio — Websites that make sense",
    description:
      "We design, build, and send everything your brand needs to grow — websites, email marketing, and the strategy that ties them together.",
    images: [
      {
        // TODO: public/og-image.jpg (1200x630) add karein
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "a-lign studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "a-lign studio — Websites that make sense",
    description:
      "We design, build, and send everything your brand needs to grow.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    // TODO: public/favicon.ico (aur chaho to icon.png / apple-icon.png) add karein
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
