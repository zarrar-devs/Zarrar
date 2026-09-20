/* =============================================================
   app/sitemap.js  →  Next.js serves this at /sitemap.xml automatically.
   Place this file at the ROOT of your app/ directory (next to layout.jsx),
   not inside app/for-coaches/.
   ============================================================= */

const SITE_URL = "https://zarrar.com"; // VERIFY: keep this in sync with SITE_URL in each page.jsx

export default function sitemap() {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/for-coaches`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Add each persona page here the moment it goes live — check the
    // `live: true` flags in the PERSONAS array inside each page.jsx.
    // A page that isn't live yet should NOT be listed here.
  ];
}
