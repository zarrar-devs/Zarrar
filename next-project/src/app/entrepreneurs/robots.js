import { SITE } from "@/components/founders-data";

/* If you already have app/robots.js, just make sure it allows "/" and
   points at the sitemap. */
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
