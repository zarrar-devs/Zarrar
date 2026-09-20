/* =============================================================
   app/robots.js  →  Next.js serves this at /robots.txt automatically.
   Place this file at the ROOT of your app/ directory (next to layout.jsx),
   not inside app/for-coaches/.
   ============================================================= */

const SITE_URL = "https://zarrar.com"; // VERIFY: keep this in sync with SITE_URL in each page.jsx

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
