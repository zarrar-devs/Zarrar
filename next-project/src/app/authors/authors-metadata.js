/* =============================================================
   Zarrar — /for-authors metadata
   -------------------------------------------------------------
   Copy this whole file's exports into app/for-authors/page.js
   (or layout.js) — both `metadata` and `viewport` MUST live in a
   server component, not in authors.jsx, because "use client"
   files can't export either one in Next.js's App Router.

   Only three things need to change before this ships:
   1. Replace zarrar.com in `siteUrl` below with your real domain
      — metadataBase then resolves every relative URL below it
      (canonical, OG image, etc.) automatically, so you only
      update the domain in one place.
   2. Replace /og/for-authors.jpg with a real 1200x630 image.
   3. Add your real social profile URLs to `sameAs` wherever you
      set up Organization/Person schema (not included here —
      don't invent them).
   ============================================================= */

const siteUrl = "https://zarrar.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Author Website Design, Book Marketing & Outreach | Zarrar",
  description:
    "Premium website development, lead generation & outreach, and social media management for authors and writers. We build the site that sells your book and get you in front of agents, press and readers.",
  keywords: [
    "author website design",
    "author website developer",
    "website for authors",
    "book marketing agency",
    "author branding services",
    "lead generation for authors",
    "author outreach services",
    "literary agent outreach",
    "social media management for authors",
    "writer website design",
    "author SEO services",
    "author platform building",
  ],
  authors: [{ name: "Zarrar" }],
  creator: "Zarrar",
  publisher: "Zarrar",
  category: "Marketing services",
  formatDetection: { telephone: false },

  alternates: {
    canonical: "/for-authors",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: "You wrote the book. We build its audience. | Zarrar for Authors",
    description:
      "Premium website development, lead generation & outreach, and social media management for authors and writers.",
    url: "/for-authors",
    siteName: "Zarrar",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og/for-authors.jpg",
        width: 1200,
        height: 630,
        alt: "Zarrar — websites, lead generation and social media for authors",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "You wrote the book. We build its audience. | Zarrar for Authors",
    description:
      "Premium website development, lead generation & outreach, and social media management for authors and writers.",
    images: ["/og/for-authors.jpg"],
  },
};

/* Next.js 14+ wants theme-color and other viewport settings in
   their own export rather than nested inside `metadata` — this
   also sets the mobile browser chrome color to match the page's
   white background instead of leaving it at the OS default. */
export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};
