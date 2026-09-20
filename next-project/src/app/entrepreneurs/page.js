import { Bricolage_Grotesque, Newsreader } from "next/font/google";
import Founders from "./Founders";
import {
  SITE,
  PAGE_URL,
  BRAND,
  SEO,
  buildJsonLd,
  safeJson,
} from "./founders-data";

/* Self-hosted by Next at build time: no render-blocking Google Fonts
   @import, no layout shift, and the fonts are preloaded. The CSS
   variables are picked up by entreprenuer.css. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fd-display",
});

const text = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fd-text",
});

export const metadata = {
  metadataBase: new URL(SITE),

  /* "absolute" stops a layout title template from adding the brand twice */
  title: { absolute: SEO.title },
  description: SEO.description,

  alternates: { canonical: PAGE_URL },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  /* og:image / twitter:image come from opengraph-image.js and
     twitter-image.js in this folder */
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: BRAND,
    locale: "en_US",
    title: SEO.ogTitle,
    description: SEO.description,
  },

  twitter: {
    card: "summary_large_image",
    title: SEO.ogTitle,
    description: SEO.description,
  },
};

export default function Page() {
  return (
    <div className={`${display.variable} ${text.variable}`}>
      {/* Structured data is rendered on the server, so it is in the
          initial HTML that Google fetches. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson(buildJsonLd()) }}
      />
      <Founders />
    </div>
  );
}
