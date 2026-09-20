import { SITE, PAGE_URL, SEO } from "@/components/founders-data";

/* If you already have app/sitemap.js, just copy the PAGE_URL entry into it.
   Only list pages that really exist (a sitemap full of 404s hurts).
   Update lastModified when the page content really changes. */
export default function sitemap() {
  return [
    { url: SITE, lastModified: SEO.lastModified },
    { url: PAGE_URL, lastModified: SEO.lastModified },
  ];
}
