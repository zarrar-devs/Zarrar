/* =============================================================
   Zarrar — /for-speakers  ·  content + structured data
   -------------------------------------------------------------
   No "use client" here on purpose: page.js (server) builds the
   JSON-LD from this file, and Speakers.jsx (client) renders it.
   That keeps the schema code out of the client bundle.

   Before going live:
   - AS_SEEN_AT is empty on purpose. The "As seen at" strip only
     renders when it has entries. Add REAL past engagements only.
   - FAQ answers describe the service in general terms. Check that
     each one matches how you actually work.
   ============================================================= */

export const SITE = "https://zarrar.com";
export const PAGE_PATH = "/for-speakers";
export const PAGE_URL = `${SITE}${PAGE_PATH}`;
export const CONTACT_EMAIL = "hello@zarrar.com";

export const PAGE_TITLE = "Website & Booking Leads for Keynote Speakers | Zarrar";
/* keep under ~160 characters so Google doesn't cut it off */
export const PAGE_DESCRIPTION =
  "Speaker websites, cold-email outreach to event organisers and social media for keynote speakers, built to get you shortlisted and booked.";

/* Real past engagements only. Leave empty and the strip is hidden. */
export const AS_SEEN_AT = [];

/* What a speaker page includes — real content, not sample talks. */
export const PAGE_PARTS = [
  {
    title: "Talk topics",
    line: "Each keynote framed around the problem it solves, so an organiser can match it to their theme in seconds.",
  },
  {
    title: "Speaker reel",
    line: "A short showreel and clips from past talks: the fastest way to show you can hold a room.",
  },
  {
    title: "One-sheet and bio",
    line: "A speaker one-sheet and a bio written for organisers, ready to forward to a program committee.",
  },
  {
    title: "Past engagements",
    line: "Real stages, testimonials and logos, so booking you feels like the safe choice.",
  },
  {
    title: "Booking enquiry form",
    line: "A clear way to check availability, with the details organisers need in a single message.",
  },
  {
    title: "Fees and logistics",
    line: "Fee range, travel and tech needs up front, so fewer emails go back and forth.",
  },
];

export const TIMELINE = [
  {
    num: "Weeks 1–2",
    title: "Foundation",
    body: "Speaker page live with topics, reel and one-sheet in place. Outreach list of relevant events and organisers built.",
  },
  {
    num: "Weeks 3–6",
    title: "Outreach and content",
    body: "Outreach to program committees and organisers goes out on schedule. Social content starts recycling clips from past talks.",
  },
  {
    num: "Weeks 7–12",
    title: "Momentum",
    body: "Shortlist mentions and inbound enquiries start layering on top of outreach, and the reel keeps pitching on its own.",
  },
];

/* `icon` is a key, not JSX, so this file stays server-safe. */
export const SERVICES = [
  {
    id: "web-development",
    title: "Speaker website development",
    body: "A speaker page that does the pitching for you: topics, reel, one-sheet and booking details in one place an organiser can screenshot and forward internally.",
    cta: "Build my site",
    icon: "web",
  },
  {
    id: "lead-generation",
    title: "Lead generation and event outreach",
    body: "We find event organisers and program committees already booking speakers on your topics, and send the outreach and follow-up that gets you onto the shortlist.",
    cta: "Get me booked",
    icon: "outreach",
  },
  {
    id: "social-media",
    title: "Social media management",
    body: "Clips and takeaways from your past talks, planned and posted on schedule, so you stay visible between conference seasons and not only during them.",
    cta: "Run my socials",
    icon: "social",
  },
];

export const PLANS = [
  {
    id: "launch",
    name: "Launch",
    line: "For getting found.",
    body: "You have the talks but no proper home online. We build one.",
    includes: [
      "Custom speaker website with topics, reel and booking form",
      "On-page SEO and Google Business setup",
      "Bio and copy written for organisers, not filler text",
      "Handover and training so you can edit it",
    ],
  },
  {
    id: "presence",
    name: "Presence",
    line: "For looking established.",
    body: "Everything in Launch, plus the accounts that make you look like a working speaker.",
    includes: [
      "Everything in Launch",
      "Social media management: posting and replies",
      "Instagram handle set up and built out",
      "Custom email domain (you@yourname.com)",
    ],
  },
  {
    id: "growth",
    name: "Reborn",
    line: "For getting booked.",
    body: "The full engine. We build the presence, then go and get the stages.",
    includes: [
      "Everything in Presence",
      "Outreach to event organisers, written and sent",
      "Follow-ups and reply handling",
      "Enquiries and booked calls in your calendar",
    ],
    featured: true,
  },
];

/* Plan names are read from PLANS so the FAQ can never drift from the cards. */
const planName = (id) => PLANS.find((p) => p.id === id)?.name ?? id;

export const FAQS = [
  {
    q: "Do keynote speakers really need their own website?",
    a: "Yes. A bureau listing or a LinkedIn profile rarely gives an organiser everything in one place. A speaker website puts your topics, reel, past engagements, fee range and booking form on one page, so they can make the call without a back-and-forth. Organisers usually research a speaker online before they reply to anyone.",
  },
  {
    q: "What should a speaker website include?",
    a: "A clear list of talk topics, a short reel or clips from past talks, real past engagements and testimonials, a one-sheet, a way to check availability or request a booking, and enough SEO that people searching for a speaker on your topic can actually find you.",
  },
  {
    q: "Can you help me get booked for more events, not just look good online?",
    a: "Yes, that's the outreach side. We find program committees and event organisers who already book speakers on your topics, then send the outreach and follow-up that gets you onto their shortlist.",
  },
  {
    q: "How does cold email outreach to event organisers work?",
    a: "We build a targeted list of conferences, summits and corporate events that fit your topics, write the emails, send them on a schedule and follow up. Replies and booked calls land in your calendar, so your time goes to conversations with organisers who are interested.",
  },
  {
    q: "Is social media worth it between speaking seasons?",
    a: "It's what keeps you visible between seasons. Clips, takeaways and behind-the-scenes content from past talks give organisers a reason to remember you months after they first saw you, not just during conference season.",
  },
  {
    q: "Which plan is right for me?",
    a: `Start with ${planName("launch")} if you have no proper speaker website yet. Choose ${planName("presence")} if you also want social media and a professional email domain. Choose ${planName("growth")} if you want us to run outreach to organisers and put booked calls in your calendar. You can move up whenever you're ready.`,
  },
  {
    q: "How long before I see new booking enquiries?",
    a: "The site and reel are usually ready within the first couple of weeks. Outreach replies and shortlist mentions typically start in the weeks after campaigns go live. Timing depends on your topic and the event calendar you're targeting.",
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
          { "@type": "ListItem", position: 2, name: "For speakers", item: PAGE_URL },
        ],
      },
      {
        "@type": "Service",
        "@id": `${PAGE_URL}#service`,
        name: "Website, outreach and social media for keynote speakers",
        serviceType:
          "Speaker website development, lead generation and social media management",
        provider: { "@id": `${SITE}/#business` },
        areaServed: "Worldwide",
        audience: { "@type": "Audience", audienceType: "Keynote speakers" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services and plans for speakers",
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
