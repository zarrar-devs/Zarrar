import { Archivo, Inter_Tight } from "next/font/google";
import RealEstate from "./RealEstate";
import {
  PAGE_DESCRIPTION,
  PAGE_PATH,
  PAGE_TITLE,
  SITE,
  buildJsonLd,
} from "./realestate-data";

/* Metadata must live in a server file, so it sits here and the
   interactive component stays "use client".

   Fonts are self-hosted through next/font: no render-blocking request to
   Google, automatic preload, and a size-matched fallback so the hero
   heading doesn't jump when the webfont lands (better LCP and CLS).
   If you'd rather not repeat this on every persona page, move these two
   calls into a shared fonts.js and import the objects from there. */

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

const SOCIAL_TITLE =
  "Own your pipeline. Not just your listings. | Zarrar for Real Estate Agents";

export const metadata = {
  metadataBase: new URL(SITE),
  /* absolute: stops a root-layout title template from doubling "| Zarrar" */
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  keywords: [
    "real estate agent website",
    "real estate local SEO",
    "Google Business Profile for realtors",
    "real estate lead generation",
    "realtor website development",
    "real estate social media management",
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

export default function ForRealEstateAgentsPage() {
  /* "<" escaped so the JSON can never close the script tag early */
  const jsonLd = JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c");

  return (
    <div className={`${archivo.variable} ${interTight.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <RealEstate />
    </div>
  );
}
