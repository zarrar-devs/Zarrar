// Generates /robots.txt automatically. TODO: apna asli domain daalein
// (layout.jsx ke SITE_URL ke saath match hona chahiye).
export default function robots() {
  const SITE_URL = "https://your-domain.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
