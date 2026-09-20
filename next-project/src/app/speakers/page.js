import { Archivo, Inter_Tight } from "next/font/google";
import Speakers from "./Speakers";
import {
  PAGE_DESCRIPTION,
  PAGE_PATH,
  PAGE_TITLE,
  SITE,
  buildJsonLd,
} from "./speakers-data";

/* Metadata must live in a server file, so it sits here and the
   interactive component stays "use client".

   Fonts are self-hosted through next/font: no render-blocking request to
   Google, automatic preload, and a size-matched fallback so the huge hero
   heading doesn't jump when the webfont lands (better LCP and CLS). */

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"], // variable weight is included; this adds the width axis
  display: "swap",
  variable: "--font-archivo",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

const SOCIAL_TITLE = "Book more stages. Chase fewer emails. | Zarrar for Speakers";

export const metadata = {
  metadataBase: new URL(SITE),
  /* absolute: stops a root-layout title template from doubling "| Zarrar" */
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  keywords: [
    "speaker website",
    "keynote speaker website",
    "speaker lead generation",
    "get booked as a keynote speaker",
    "event organiser outreach",
    "social media management for speakers",
  ],
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: SOCIAL_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_PATH,
    siteName: "Zarrar",
    type: "website",
    locale: "en_US",
    /* image comes from opengraph-image.jsx in this folder */
  },
  twitter: {
    card: "summary_large_image",
    title: SOCIAL_TITLE,
    description: PAGE_DESCRIPTION,
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
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2eee3",
};

export default function ForSpeakersPage() {
  /* "<" escaped so the JSON can never close the script tag early */
  const jsonLd = JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c");

  return (
    <div className={`${archivo.variable} ${interTight.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <Speakers />
    </div>
  );
}
