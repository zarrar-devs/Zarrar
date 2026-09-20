/* =============================================================
   Zarrar — /for-real-estate-agents  ·  content + structured data
   -------------------------------------------------------------
   No "use client" here on purpose: page.js (server) builds the
   JSON-LD from this file, and RealEstate.jsx (client) renders it.

   Before going live:
   - SEARCH_TERMS are search patterns, not real places. They are
     written in plain language ("Realtor in your city") so no
     [placeholder] brackets ever show on the live page.
   - FAQ answers describe the service in general terms. Check that
     each one matches how you actually work (especially IDX/MLS
     setup and the outreach-compliance answer).
   - The copy is US/Canada-flavoured (MLS, IDX, zip code, realtor).
   ============================================================= */

export const SITE = "https://zarrar.com";
export const PAGE_PATH = "/for-real-estate-agents";
export const PAGE_URL = `${SITE}${PAGE_PATH}`;
export const CONTACT_EMAIL = "hello@zarrar.com";

export const PAGE_TITLE = "Real Estate Agent Websites, Local SEO & Leads | Zarrar";
/* keep under ~160 characters so Google doesn't cut it off */
export const PAGE_DESCRIPTION =
  "Website development, local SEO and outreach for real estate agents, so buyer and seller enquiries come straight to you instead of being shared on portals.";

/* Search patterns buyers and sellers actually type. */
export const SEARCH_TERMS = [
  "Realtor in your city",
  "Real estate agent near me",
  "Homes for sale in your neighbourhood",
  "Sell my home in your city",
  "Buyer's agent near me",
];

export const COMPARE = {
  old: {
    tag: "Relying on portals",
    points: [
      "Your profile sits next to ads for other agents on the same listing page.",
      "Enquiries are often shared with whoever else is paying for that zip code.",
      "Stop paying for placement, and your visibility disappears with it.",
    ],
  },
  owned: {
    tag: "Owning your pipeline",
    points: [
      "A website that's only about you, with no one else's ad on the page.",
      "Enquiries come straight to you, and no one else sees them first.",
      "Local search rankings keep working long after a listing sells.",
    ],
  },
};

export const TIMELINE = [
  {
    num: "Weeks 1–2",
    title: "Foundation",
    body: "Website goes live with lead capture on every page, Google Business Profile optimised, and the first geo-farm list built.",
  },
  {
    num: "Weeks 3–6",
    title: "Outreach and content",
    body: "Geo-targeted outreach and neighbourhood content go out on schedule. First replies and showing requests start coming in direct.",
  },
  {
    num: "Weeks 7–12",
    title: "Local flywheel",
    body: "Local rankings compound, referrals layer on top of outreach, and enquiries stop routing through a portal at all.",
  },
];

/* `icon` is a key, not JSX, so this file stays server-safe. */
export const SERVICES = [
  {
    id: "web-development",
    title: "Real estate website development",
    body: "A website built to showcase listings and sell your brand: mobile-first, fast, and set up to convert visitors who are already deep into a search.",
    cta: "Build my site",
    icon: "web",
  },
  {
    id: "local-seo",
    title: "Local SEO and Google Business Profile",
    body: "We optimise your Google Business Profile and build the local pages that get you found when someone searches for a real estate agent in your city, not only when a portal ad happens to show you.",
    cta: "Boost my local presence",
    icon: "pin",
  },
  {
    id: "lead-generation",
    title: "Lead generation and outreach",
    body: "Geo-targeted outreach to expired listings, FSBOs and past clients, written and sent for you, so new leads arrive with your name already attached.",
    cta: "Get me leads",
    icon: "outreach",
  },
  {
    id: "social-media",
    title: "Social media and video",
    body: "Listing walkthroughs, neighbourhood content and open-house promotion, planned and posted on schedule to get local eyes on you.",
    cta: "Run my socials",
    icon: "social",
  },
];

export const PLANS = [
  {
    id: "launch",
    name: "Launch",
    line: "For getting found.",
    body: "You have the listings but no proper home online. We build one.",
    includes: [
      "Custom real estate website with lead capture on every page",
      "Local SEO and Google Business Profile setup",
      "Copy written for your area and offer, not filler text",
      "Handover and training so you can edit it",
    ],
  },
  {
    id: "presence",
    name: "Presence",
    line: "For looking established.",
    body: "Everything in Launch, plus the accounts that make you look like a serious local agent.",
    includes: [
      "Everything in Launch",
      "Social media management: listings, neighbourhood content and replies",
      "Instagram handle set up and built out",
      "Custom email domain (you@yourname.com)",
    ],
  },
  {
    id: "growth",
    name: "Reborn",
    line: "For bringing in clients.",
    body: "The full engine. We build the presence, then go and get the listings.",
    includes: [
      "Everything in Presence",
      "Outreach to expired listings, FSBOs and past clients",
      "Instant lead alerts and follow-up sequences",
      "Showing requests and booked calls in your calendar",
    ],
    featured: true,
  },
];

/* Plan names are read from PLANS so the FAQ can never drift from the cards. */
const planName = (id) => PLANS.find((p) => p.id === id)?.name ?? id;

export const FAQS = [
  {
    q: "I'm already on Zillow and Realtor.com. Do I still need my own website?",
    a: "Yes. A portal lead is often shared with other agents paying for the same zip code, and your profile sits next to their ads. A website that's only about you keeps enquiries yours alone, and it's the one piece of online property you fully control.",
  },
  {
    q: "Can my real estate website show live MLS listings?",
    a: "In most markets, yes, through an IDX feed tied to your MLS access. We set that up as part of the build. The exact setup depends on your board and brokerage, so we confirm what's available for your MLS before we start.",
  },
  {
    q: "How fast will I hear about a new lead?",
    a: "Speed matters more here than in almost any other business, because a lead that waits often goes with whoever answers first. We set up instant notifications so you can respond right away, and outreach follow-up runs on a schedule that doesn't let anyone go cold.",
  },
  {
    q: "What is local SEO for real estate agents?",
    a: "Mainly your Google Business Profile (categories, photos, posts and reviews), plus location-specific pages on your website that match how people actually search, like “realtor in your city” or “homes for sale in your neighbourhood”. It's what gets you found before a portal ad does.",
  },
  {
    q: "Is cold outreach to expired listings and FSBOs allowed?",
    a: "Rules differ by country and state, and email and phone outreach are regulated differently. In the US, for example, email falls under CAN-SPAM and phone calls under Do Not Call rules. We confirm what's allowed in your market before any campaign goes out, and your brokerage's compliance team should have the final say.",
  },
  {
    q: "Which plan is right for me, and is social media included?",
    a: `Start with ${planName("launch")} if you need a proper website and local SEO. ${planName("presence")} adds social media management, an Instagram build-out and a custom email domain. ${planName("growth")} adds outreach and booked calls. Social media is part of ${planName("presence")} and ${planName("growth")}, sized to your market once we know your patch. Book a call for a quote.`,
  },
  {
    q: "How long before I see new enquiries?",
    a: "The website and Google Business Profile updates are usually live within the first couple of weeks. Outreach replies and showing requests typically start in the weeks after campaigns go out, while local rankings build over a few months. Timing depends on your market, price point and how competitive your area is.",
  },
];

/* ---------------- Structured data (built on the server) ---------------- */

export function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${SITE}/#business`,
        name: "Zarrar",
        url: SITE,
        areaServed: "Worldwide",
      },
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": `${SITE}/#business` },
        about: { "@id": `${PAGE_URL}#service` },
        breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "For real estate agents", item: PAGE_URL },
        ],
      },
      {
        "@type": "Service",
        "@id": `${PAGE_URL}#service`,
        name: "Websites, local SEO and lead generation for real estate agents",
        serviceType:
          "Real estate website development, local SEO, lead generation and social media management",
        provider: { "@id": `${SITE}/#business` },
        areaServed: "Worldwide",
        audience: { "@type": "Audience", audienceType: "Real estate agents" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services and plans for real estate agents",
          itemListElement: [
            ...SERVICES.map((s) => ({
              "@type": "Offer",
              url: `${PAGE_URL}#${s.id}`,
              itemOffered: { "@type": "Service", name: s.title, description: s.body },
            })),
            ...PLANS.map((p) => ({
              "@type": "Offer",
              url: `${PAGE_URL}#plans`,
              name: `${p.name} plan`,
              description: `${p.body} Includes: ${p.includes.join("; ")}.`,
            })),
          ],
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
