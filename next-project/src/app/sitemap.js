// Generates /sitemap.xml automatically. TODO: apna asli domain daalein,
// aur jab aur pages add karein to unki entries yahan add karte jayein.
export default function sitemap() {
  const SITE_URL = "https://your-domain.com";

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
