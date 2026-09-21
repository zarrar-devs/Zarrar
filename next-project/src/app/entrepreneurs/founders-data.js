/* =============================================================
   /for-founders — content, SEO strings and structured data.

   This is a plain module (NO "use client") on purpose: the server
   page (metadata + JSON-LD) and the client component both import
   from it, and Next.js can't hand plain data across a "use client"
   boundary.

   Edit copy here and the page, the metadata and the schema all stay
   in sync.
   ============================================================= */

export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://zarrar.com";
export const PAGE_URL = `${SITE}/for-founders`;
export const BRAND = "Zarrar";
export const AUDIENCE_TYPE = "Founders, entrepreneurs and CEOs";

/* Put your real profile URLs here (LinkedIn, X, Instagram...).
   They are added to Organization.sameAs, which helps Google connect
   the page to the brand. Leave empty until you have them. */
export const SOCIAL_LINKS = [];

/* ---------------- SEO strings ---------------- */

export const SEO = {
  /* <= 60 chars so it isn't truncated in results */
  title: "Founder & CEO Website, Email & Social Media Agency | Zarrar",
  /* <= 155 chars */
  description:
    "Custom websites, email marketing and social media management for founders, entrepreneurs and CEOs. Look as big as the company you're building.",
  ogTitle: "Founders and CEOs get Googled before they get a reply | Zarrar",
  h1: "Founders and CEOs get Googled before they get a reply.",
  /* Update when you materially change the page (used in sitemap.js) */
  lastModified: "2026-09-20",
};

export const HERO = {
  sub: "Custom website and portfolio design, email marketing and social media management for founders, entrepreneurs and CEOs, so what people find is worth the click.",
};

/* ---------------- Hero demo ----------------
   Illustrative only, so the names are invented. Each row maps to a
   service: website -> web development, LinkedIn -> social,
   newsletter -> email. The demo is aria-hidden and data-nosnippet so
   the made-up names never get indexed as page content. */

export const SERP_QUERY = "Maya Hart CEO Northwind";

export const SERP = [
  {
    key: "site",
    before: {
      url: "northwind-old.com",
      title: "Northwind - Home",
      desc: "Welcome to our website. We are a company. Contact us for more information.",
    },
    after: {
      url: "mayahart.com",
      title: "Maya Hart, Founder & CEO of Northwind",
      desc: "Building the freight platform behind thousands of deliveries. Work, writing and how to get in touch.",
      chips: ["Work", "Writing", "Book a call"],
    },
  },
  {
    key: "social",
    before: {
      url: "linkedin.com/in/maya-hart",
      title: "Maya Hart - CEO - Northwind | LinkedIn",
      desc: "212 followers. Last post two years ago.",
    },
    after: {
      url: "linkedin.com/in/maya-hart",
      title: "Maya Hart on LinkedIn: notes on building in freight tech",
      desc: "Posts every week on hiring, fundraising and what went wrong.",
    },
  },
  {
    key: "email",
    before: {
      url: "maya-hart.wordpress.com",
      title: "My blog",
      desc: "Last updated in 2019. Nothing here yet.",
    },
    after: {
      url: "mayahart.com/dispatch",
      title: "The Northwind Dispatch, a newsletter by Maya Hart",
      desc: "Fortnightly notes for operators. Subscribe free.",
    },
  },
];

/* ---------------- Page content ---------------- */

export const PAIN_POINTS = [
  {
    title: "Your name doesn't tell your story",
    line: "Investors, candidates and journalists look you up before the meeting. If the first results are a stale profile or an old press mention, that's the pitch they've already heard.",
  },
  {
    title: "The website undersells the company",
    line: "People judge a company by its site within seconds. A dated one quietly undersells work that's genuinely good.",
  },
  {
    title: "You're building in silence",
    line: "Competitors post every week while you run the company. Attention, and the introductions that follow it, go to whoever shows up.",
  },
  {
    title: "Outreach never gets done properly",
    line: "Investor, partner and customer emails get written late at night or not at all, and without a proper sending setup they land in spam.",
  },
];

export const AUDIENCES = [
  {
    title: "Startup founders",
    line: "Raising a round, hiring your first team or launching a product. Investors and candidates check you out before they reply.",
  },
  {
    title: "CEOs and executives",
    line: "You lead a real company, and your public profile hasn't caught up with it. We close that gap.",
  },
  {
    title: "Solo entrepreneurs",
    line: "You are the brand. A clear website, a working inbox and a steady social presence sell while you deliver.",
  },
  {
    title: "Founders of B2B and service businesses",
    line: "Your next client will look you up first. A credible portfolio and steady outreach turn that look into a booked call.",
  },
];

export const TIMELINE = [
  {
    when: "Weeks 1–2",
    title: "Foundation",
    body: "Positioning agreed, the website in design, sending domains and social profiles set up properly, outreach list built.",
  },
  {
    when: "Weeks 3–6",
    title: "Launch and outreach",
    body: "The site goes live. Email campaigns and social content start on schedule, and the first replies come in.",
  },
  {
    when: "Weeks 7–12",
    title: "Momentum",
    body: "A steady flow of conversations from outreach and search, a founder presence that keeps compounding, and campaigns refined around what's working.",
  },
];

export const FAQS = [
  {
    q: "Why does a founder or CEO need a personal website as well as a company site?",
    a: "Because people look up the person before they back, hire or partner with the company. A company site explains the product. A founder site explains why you're the one to build it, and it's the one page in your search results that you fully control.",
  },
  {
    q: "What should a CEO or founder portfolio website include?",
    a: "A clear line on what you do and for whom, your track record and case studies, press and proof, what you're working on now, and one obvious way to get in touch or book a call. Underneath that: fast load times, a mobile-first layout and proper on-page SEO.",
  },
  {
    q: "Can you help me rank on Google for my own name?",
    a: "A proper founder website is the strongest first step: a fast, well-structured site with your name, role and company in the right places, structured data, and social profiles that link back to it. Nobody can guarantee a ranking, because it depends on how much competition your name and category have, but this is the foundation every ranking is built on.",
  },
  {
    q: "Is cold email still effective for founders and CEOs?",
    a: "It works when the list is targeted, the message is relevant and the sending setup is technically sound: authenticated domains, sensible volumes and an easy way to opt out. Blasting a generic email to a huge list doesn't. We handle the research, copy, sending and follow-up.",
  },
  {
    q: "What are SPF, DKIM and DMARC, and why do they matter for outreach?",
    a: "They're three DNS records that prove your emails really come from your domain. SPF lists who may send for you, DKIM signs each message, and DMARC tells inboxes what to do with mail that fails the checks. Without them, outreach and newsletters are far more likely to land in spam. We set all three up before anything is sent.",
  },
  {
    q: "Does social media matter for a busy CEO?",
    a: "Usually it's where investors, candidates and customers check you out first. You don't need to become a content creator. We plan the content, write it in your voice, post it and handle replies, so the account keeps working while you run the company.",
  },
  {
    q: "Can I start with just a website and add email or social media later?",
    a: "Yes. Each plan builds on the one before it, so you can start with the website and move up whenever you're ready. Most founders find the pieces work harder together, because the site gives every email and post somewhere credible to land.",
  },
  {
    q: "How long before we see results?",
    a: "The website and profiles typically go live in the first few weeks. Outreach replies and conversations tend to follow once campaigns are running. Timing depends on your market and offer, and we'll be upfront about it on a call.",
  },
  {
    q: "How much does it cost?",
    a: "It depends on scope. The three plans above (Launch, Presence and Growth) are starting points, and we'll give you a clear quote after a short call.",
  },
];

/* SERVICES copy is written for founders; PLANS are identical to
   /for-coaches on purpose so the offer stays the same everywhere.
   Icons live in the component (this file has no JSX). */

export const SERVICES = [
  {
    id: "web-development",
    tone: "ink",
    serviceType: "Website design and development",
    title: "Website and portfolio development for founders and CEOs",
    body: "First impressions happen on your website, so we design and build one that looks like the company you actually run: custom, fast, mobile-first, and set up to rank when someone searches your name or your category.",
    points: [
      "Custom design and build, never a template",
      "Portfolio and case-study pages that build credibility",
      "Technical SEO, schema and fast load times built in",
      "Handover training so your team can edit it",
    ],
    cta: "Build my site",
  },
  {
    id: "email-marketing",
    tone: "paper",
    serviceType: "Email marketing and outbound outreach",
    title: "Email marketing and outbound promotion",
    body: "We research the investors, buyers, partners and press worth reaching, write the emails, send them from properly authenticated domains and handle the follow-up. We also run newsletters and launch promotions for the list you already have.",
    points: [
      "Prospect research and list building",
      "Copywriting, sending and follow-up sequences",
      "Sending domains set up with SPF, DKIM and DMARC",
      "Newsletter and launch-promotion campaigns",
    ],
    cta: "Start my outreach",
  },
  {
    id: "social-media",
    tone: "stone",
    serviceType: "Social media management",
    title: "Social media management for founders and CEOs",
    body: "Your LinkedIn, X and Instagram run like a proper channel: content planned around your positioning, posted on schedule, with comments and DMs handled. The people who search your name find a founder worth backing.",
    points: [
      "Content plan built around your positioning",
      "Posts written in your voice",
      "Posting, replies and DM handling",
      "Profile and bio optimisation",
    ],
    cta: "Run my socials",
  },
];

export const PLANS = [
  {
    id: "launch",
    name: "Launch",
    line: "For getting found.",
    body: "You have the work but no proper home online. We build one.",
    includes: [
      "Custom website, designed and built from scratch",
      "On-page SEO and Google Business setup",
      "Copy written for your offer, not filler text",
      "Handover and training so you can edit it",
    ],
  },
  {
    id: "presence",
    name: "Presence",
    line: "For looking established.",
    body: "Everything in Launch, plus the accounts that make you look like a real operation.",
    includes: [
      "Everything in Launch",
      "Social media management, posting and replies",
      "Instagram handle set up and built out",
      "Custom email domain (you@yourname.com)",
    ],
  },
  {
    id: "growth",
    name: "Reborn",
    line: "For bringing in clients.",
    body: "The full engine. We build the presence, then go and get the work.",
    includes: [
      "Everything in Presence",
      "Portfolio site that closes on your behalf",
      "Cold outreach campaigns, written and sent",
      "Lead generation and booked calls in your calendar",
    ],
    featured: true,
  },
];

/* Internal links to the sibling persona pages.
   Remove any that aren't live yet: links to 404s hurt. */
export const PERSONAS = [
  { label: "Coaches", href: "/for-coaches" },
  { label: "Speakers", href: "/for-speakers" },
  { label: "Authors", href: "/for-authors" },
  { label: "Creators", href: "/for-creators" },
  { label: "Consultants", href: "/for-consultants" },
];

/* ---------------- Structured data (JSON-LD) ---------------- */

export function buildJsonLd() {
  const orgId = `${SITE}/#organization`;
  const websiteId = `${SITE}/#website`;
  const pageId = `${PAGE_URL}#webpage`;
  const crumbId = `${PAGE_URL}#breadcrumb`;
  const serviceId = `${PAGE_URL}#service`;

  const audience = { "@type": "Audience", audienceType: AUDIENCE_TYPE };

  return {
    "@context": "https://schema.org",
    "@graph": [
      /* Keep this @id identical on your home page so Google merges them. */
      {
        "@type": "Organization",
        "@id": orgId,
        name: BRAND,
        url: SITE,
        ...(SOCIAL_LINKS.length ? { sameAs: SOCIAL_LINKS } : {}),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE,
        name: BRAND,
        inLanguage: "en",
        publisher: { "@id": orgId },
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url: PAGE_URL,
        name: "Website, Email Marketing & Social Media for Founders & CEOs",
        description: SEO.description,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
        breadcrumb: { "@id": crumbId },
        about: { "@id": serviceId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": crumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Founders & CEOs", item: PAGE_URL },
        ],
      },
      {
        "@type": "Service",
        "@id": serviceId,
        name: "Website, email marketing and social media management for founders and CEOs",
        serviceType: SERVICES.map((s) => s.serviceType),
        description:
          "Website and portfolio development, email marketing and outbound promotion, and social media management for founders, entrepreneurs and CEOs.",
        url: PAGE_URL,
        provider: { "@id": orgId },
        areaServed: "Worldwide",
        audience,
        hasOfferCatalog: [
          {
            "@type": "OfferCatalog",
            name: "Services",
            itemListElement: SERVICES.map((s) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: s.title,
                serviceType: s.serviceType,
                description: s.body,
                url: `${PAGE_URL}#${s.id}`,
              },
            })),
          },
          {
            "@type": "OfferCatalog",
            name: "Plans",
            itemListElement: PLANS.map((p) => ({
              "@type": "Offer",
              name: p.name,
              description: `${p.body} Includes: ${p.includes.join("; ")}.`,
            })),
          },
        ],
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

/* Escape "<" so the JSON can never close the <script> tag early. */
export const safeJson = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");
