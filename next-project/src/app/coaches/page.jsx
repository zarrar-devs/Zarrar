/* =============================================================
   Zarrar — /for-coaches            (app/for-coaches/page.jsx)
   -------------------------------------------------------------
   This is a SERVER component on purpose (no "use client"):
   - metadata + JSON-LD live in the same file as the content
   - the markup ships as plain HTML, so Googlebot doesn't need JS
     to read a single word
   - only <CoachesMotion /> (GSAP) is hydrated on the client

   Files in this folder:
     page.jsx           ← this file (content, SEO, markup)
     CoachesMotion.jsx  ← all GSAP animation (client)
     coaches.css        ← styles, fully scoped under .coaches-page

   CLONING FOR OTHER PERSONAS
   Rewrite everything above the "SHARED" line per persona:
   URL/constants, title, description, H1, sub-copy, pain points,
   FAQs. Google punishes near-duplicate pages, so the persona-
   specific part must be the bulk of each page — different
   title, H1, intro, pain points and FAQ answers every time.

   Lines marked VERIFY are claims I added — confirm they're true.
   ============================================================= */

import { Fragment } from "react";
import Link from "next/link";
import { Archivo, Inter_Tight } from "next/font/google";
import CoachesMotion from "./CoachesMotion";
import "./coaches.css";

/* Self-hosted fonts (no render-blocking @import from Google).
   If your root layout already loads these, delete this block and
   the two variables on the root <div> below. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

/* =====================  PERSONA-SPECIFIC  ===================== */

const SITE_URL = "https://zarrar.com"; // VERIFY: your real production domain
const PAGE_URL = `${SITE_URL}/for-coaches`;
const CONTACT_EMAIL = "hello@zarrar.com";
// Swap for a Calendly / Cal.com link if you have one.
const CONTACT_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Website & lead generation for my coaching business"
)}`;

// Title ≈ 60 chars, description ≈ 155 chars: what Google shows before truncating.
// Primary keyword leads the title (front-loading helps both CTR and relevance).
const PAGE_TITLE = "Coach Website Design, SEO & Lead Generation | Zarrar";
const PAGE_DESC =
  "We design coaching websites, run on-page SEO and social media, and send outreach that books discovery calls. Start with a site or go all-in on lead generation.";
const SOCIAL_TITLE = "Fill your calendar with coaching clients | Zarrar";
// Next.js auto-detects app/for-coaches/opengraph-image.(jpg|png|gif) and
// twitter-image.(jpg|png|gif) and injects them into the metadata below —
// add those files (1200×630) instead of hardcoding an `images` array here,
// or you'll end up with duplicate/conflicting OG tags.

export const metadata = {
  // If your root layout already sets metadataBase, delete this line —
  // the closest one to the leaf route wins and duplicating it is harmless
  // but pointless.
  metadataBase: new URL(SITE_URL),
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESC,
  authors: [{ name: "Zarrar", url: SITE_URL }],
  creator: "Zarrar",
  publisher: "Zarrar",
  category: "Business",
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // VERIFY: paste your real Search Console / Bing Webmaster codes.
  // Remove any line you don't use — an empty string still gets rendered.
  verification: {
    google: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_CODE",
    // bing: "REPLACE_WITH_BING_WEBMASTER_CODE",
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "Zarrar",
    title: SOCIAL_TITLE,
    description: PAGE_DESC,
    locale: "en_US",
    // Add app/for-coaches/opengraph-image.png (1200×630) — Next injects it
    // into `images` automatically, no need to list it here.
  },
  twitter: {
    card: "summary_large_image",
    title: SOCIAL_TITLE,
    description: PAGE_DESC,
    // VERIFY: your real handle, e.g. "@zarrar"
    // site: "@yourhandle",
    // creator: "@yourhandle",
  },
};

// Split from `metadata` since Next 14+ (themeColor moved out of the
// metadata export into its own `viewport` export).
export const viewport = {
  themeColor: "#f2eee3",
};

const PAIN_POINTS = [
  {
    title: "Referrals dried up",
    line: "You built your coaching practice on word of mouth, and the pipeline has gone quiet.",
  },
  {
    title: "Followers don't convert",
    line: "The Instagram numbers look fine. Discovery calls booked from it? Not so much.",
  },
  {
    title: "The website just sits there",
    line: "It's live and it looks fine, but it sends you close to zero enquiries a month.",
  },
];

const TIMELINE = [
  {
    num: "Weeks 1–2",
    title: "Foundation",
    body: "Your coaching website goes live with a booking flow connected, socials are set up properly, and the outreach list is built.",
  },
  {
    num: "Weeks 3–6",
    title: "Outreach starts",
    body: "Cold outreach and content go out on schedule. First replies and discovery calls start landing.",
  },
  {
    num: "Weeks 7–12",
    title: "Rhythm",
    body: "A steady flow of calls from outreach and search, plus a social presence that keeps building on its own.",
  },
];

const FAQS = [
  {
    q: "Does a coaching business actually need a website?",
    a: "Yes. Even when most of your clients come from referrals or social media, people check your website before they book a call. It's also the one place you fully own: Instagram reach can change overnight, a website you control doesn't.",
  },
  {
    q: "What should a coach's website include?",
    a: "A clear statement of who you help and how, a way to book a call without emailing back and forth, some proof you know what you're doing, and enough on-page SEO that people searching for a coach like you can actually find you.",
  },
  {
    q: "How much do a coaching website and lead generation cost?",
    a: "It depends on where you start. Launch covers the website, Presence adds social media management and a custom email domain, and Growth adds cold outreach and lead generation. Tell us about your niche and goals and we'll recommend the plan that fits.",
  },
  {
    q: "Is social media management worth it if I'm not a content creator?",
    a: "It's less about content skill and more about consistency. Most coaches stop posting because it becomes one more job. We handle the planning, posting and replies, so the account keeps showing up even when you're busy with clients.",
  },
  {
    q: "Can you get me coaching leads without me doing outreach myself?",
    a: "Yes. We write the outreach, send it, and manage replies and follow-up. You get booked calls on your calendar, not a spreadsheet of contacts to chase.",
  },
  {
    q: "How long before I see booked discovery calls?",
    a: "The website and socials are usually live within the first couple of weeks. Outreach replies and the first calls typically start in the following few weeks once campaigns are running. It depends on your niche and offer, but you're not waiting months for movement.",
  },
  {
    q: "What's the difference between the Launch, Presence and Growth plans?",
    a: "Each plan includes everything in the one before it. Launch is the website and on-page SEO. Presence adds social media management, an Instagram handle and a custom email domain. Growth adds cold outreach campaigns and lead generation, with booked calls in your calendar.",
  },
  {
    // VERIFY: confirm you're happy to say this about niches.
    q: "Do you work with every type of coach?",
    a: "We work with independent coaches and coaching businesses across niches, from life and career coaching to business, executive and health coaching. If you sell 1:1 or group programs and want more qualified enquiries, this page is for you. Not sure your niche fits? Send us a message and we'll tell you honestly.",
  },
];

// Flip `live: true` only once that page actually exists (no dead links).
const PERSONAS = [
  { label: "authors", href: "/for-authors", live: false },
  { label: "founders", href: "/for-founders", live: false },
  { label: "creators", href: "/for-creators", live: false },
  { label: "speakers", href: "/for-speakers", live: false },
  { label: "consultants", href: "/for-consultants", live: false },
];

/* =====================  SHARED ACROSS PERSONAS  ===================== */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function WebIcon() {
  return (
    <svg viewBox="0 0 48 48" focusable="false" {...stroke}>
      <rect className="draw" x="4" y="8" width="40" height="32" rx="3" />
      <line className="draw" x1="4" y1="17" x2="44" y2="17" />
      <path className="draw" d="M19 25l-5 5 5 5" />
      <path className="draw" d="M29 25l5 5-5 5" />
    </svg>
  );
}

function OutreachIcon() {
  return (
    <svg viewBox="0 0 48 48" focusable="false" {...stroke}>
      <path className="draw" d="M5 24L43 9l-6 30-11-9-8 8v-10z" />
      <path className="draw" d="M18 28L43 9" />
    </svg>
  );
}

function SocialIcon() {
  return (
    <svg viewBox="0 0 48 48" focusable="false" {...stroke}>
      <circle className="draw" cx="12" cy="15" r="5" />
      <circle className="draw" cx="36" cy="12" r="5" />
      <circle className="draw" cx="24" cy="36" r="5" />
      <path className="draw" d="M17 17l14-4" />
      <path className="draw" d="M14 20l8 12" />
      <path className="draw" d="M34 17l-8 15" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}

const SERVICES = [
  {
    id: "lead-generation",
    title: "Lead generation for coaches",
    body: "We find people already looking for a coach like you, write the cold outreach that gets replies, and manage the follow-up, so discovery calls land in your calendar on their own.",
    cta: "Get me leads",
    icon: <OutreachIcon />,
  },
  {
    id: "web-development",
    title: "Website design for coaches",
    body: "A coaching website built around one job: turning a visitor into a booked call. Fast, on-brand, and set up to rank for the people searching for you.",
    cta: "Build my site",
    icon: <WebIcon />,
  },
  {
    id: "social-media",
    title: "Social media for coaches",
    body: "Content planned around your offer, posted on schedule, with comments and DMs handled, so the account builds trust instead of just racking up likes.",
    cta: "Run my socials",
    icon: <SocialIcon />,
  },
];

const PLANS = [
  {
    id: "launch",
    name: "Launch",
    line: "For getting found.",
    body: "You have the coaching but no proper home online. We build one.",
    includes: [
      "Custom coaching website with a booking flow connected", // VERIFY
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
      // VERIFY: replaced "Portfolio site that closes on your behalf" (a coach has no portfolio).
      "A results and testimonials page that builds trust before the first call",
      "Cold outreach campaigns, written and sent",
      "Lead generation and booked calls in your calendar",
    ],
    featured: true,
  },
];

/* ---------------- Structured data (one @graph) ----------------
   If your homepage / root layout already outputs Organization and
   WebSite JSON-LD, delete those two nodes and keep the @id refs.
   The Organization node below has `logo` and `sameAs` placeholders —
   fill them in (see the VERIFY comments) instead of leaving them empty. */

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PAGE_ID = `${PAGE_URL}#webpage`;
const CRUMBS_ID = `${PAGE_URL}#breadcrumb`;
const SERVICE_ID = `${PAGE_URL}#service`;

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Zarrar",
      url: SITE_URL,
      email: CONTACT_EMAIL,
      logo: `${SITE_URL}/logo.png`, // VERIFY: real logo, min 112×112px
      sameAs: [
        // VERIFY: add your real profile URLs, e.g.
        // "https://www.instagram.com/yourhandle",
        // "https://www.linkedin.com/company/yourcompany",
      ],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: "Zarrar",
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "WebPage",
      "@id": PAGE_ID,
      url: PAGE_URL,
      name: PAGE_TITLE,
      description: PAGE_DESC,
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": SERVICE_ID },
      mainEntity: { "@id": SERVICE_ID },
      breadcrumb: { "@id": CRUMBS_ID },
    },
    {
      "@type": "BreadcrumbList",
      "@id": CRUMBS_ID,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "For coaches", item: PAGE_URL },
      ],
    },
    {
      "@type": "Service",
      "@id": SERVICE_ID,
      name: "Website, lead generation and social media management for coaches",
      serviceType: "Digital marketing for coaches",
      description: PAGE_DESC,
      url: PAGE_URL,
      provider: { "@id": ORG_ID },
      audience: { "@type": "Audience", audienceType: "Coaches" },
      areaServed: "Worldwide",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Zarrar for coaches",
        itemListElement: [
          {
            "@type": "OfferCatalog",
            name: "Services",
            itemListElement: SERVICES.map((s) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: s.title, description: s.body },
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

function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // "<" escaped so nothing inside the data can close the script tag
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

// Visible breadcrumb — text matches the BreadcrumbList JSON-LD above so the
// on-page trail and the structured data never drift out of sync.
function Breadcrumb() {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li><Link href="/">Home</Link></li>
        <li aria-current="page">For coaches</li>
      </ol>
    </nav>
  );
}

function OtherPersonas() {
  const live = PERSONAS.filter((p) => p.live);
  if (live.length === 0) {
    return <Link href="/#who">See who else we work with</Link>;
  }
  return (
    <>
      We also work with{" "}
      {live.map((p, i) => (
        <Fragment key={p.href}>
          {i > 0 && (i === live.length - 1 ? " and " : ", ")}
          <Link href={p.href}>{p.label}</Link>
        </Fragment>
      ))}
      .
    </>
  );
}

/* ---------------- Page ---------------- */

export default function ForCoachesPage() {
  return (
    <div className={`coaches-page ${archivo.variable} ${interTight.variable}`}>
      <JsonLd data={JSON_LD} />
      <CoachesMotion />

      <a className="skip-link" href="#main">Skip to content</a>

      <header className="nav">
        <Link className="logo" href="/">Zarrar</Link>
        <nav className="nav-links" aria-label="On this page">
          <a href="#problem">THE PROBLEM</a>
          <a href="#services">SERVICES</a>
          <a href="#plans">PLANS</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="nav-cta magnetic" href="#contact">Book a call</a>
        <div className="nav-progress" aria-hidden="true"><span /></div>
      </header>

      <main id="main">
        <Breadcrumb />

        <section className="hero" id="top">
          <h1 className="hero-heading">
            <span className="hero-l1">Fill your calendar</span>{" "}
            <span className="hero-l2">with coaching clients.</span>
          </h1>

          <div className="hero-rule" aria-hidden="true" />

          <div className="hero-foot">
            <p className="hero-sub">
              A coaching website that ranks on Google, social media that keeps
              posting, and outreach that lands discovery calls, so growing your
              coaching business stops depending on referrals alone.
            </p>
            <div className="hero-actions">
              <a className="btn btn-solid magnetic" href="#plans">See the plans</a>
              <a className="btn btn-ghost" href="#how">How it works</a>
            </div>
          </div>
        </section>

        <section className="problem" id="problem" aria-labelledby="problem-title">
          <div className="section-head">
            <h2 id="problem-title">Why coaches struggle to get clients online</h2>
            <p>Most coaches hit the same wall before they fix it for good.</p>
          </div>

          <ul className="problem-list">
            {PAIN_POINTS.map((p, i) => (
              <li className="problem-item" key={p.title}>
                <span className="problem-rule" aria-hidden="true" />
                <div className="problem-head">
                  <span className="problem-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{p.title}</h3>
                </div>
                <p>{p.line}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="services" id="services" aria-labelledby="services-title">
          <div className="section-head">
            <h2 id="services-title">Website, lead generation and social media for coaches</h2>
            <p>Three pieces that work together. Pick one, or run all three.</p>
          </div>

          <div className="services-grid">
            {SERVICES.map((s) => (
              <article className="service-card" id={s.id} key={s.id}>
                <span className="service-icon" aria-hidden="true">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <a className="btn btn-outline" href="#contact">{s.cta}</a>
              </article>
            ))}
          </div>
        </section>

        <section className="case-study" id="how" aria-labelledby="case-title">
          <div className="section-head">
            <h2 id="case-title">What your first 90 days look like</h2>
            <p>A rough shape of how the pieces come online, in order.</p>
          </div>

          <ol className="case-steps">
            {TIMELINE.map((s) => (
              <li className="case-step" key={s.title}>
                <span className="case-step-num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="case-note">
            Illustrative timeline. Exact pace depends on your niche, offer
            price and existing audience.
          </p>
        </section>

        <section className="plans" id="plans" aria-labelledby="plans-title">
          <div className="section-head">
            <h2 id="plans-title">Coaching website and lead generation plans</h2>
            <p>Each plan builds on the one before it. Move up whenever you&apos;re ready.</p>
          </div>

          <div className="plans-grid">
            {PLANS.map((p) => (
              <article className={`plan${p.featured ? " is-featured" : ""}`} key={p.id}>
                {p.featured && <span className="plan-flag">Most complete</span>}
                <h3 className="plan-name">{p.name}</h3>
                <p className="plan-line">{p.line}</p>
                <p className="plan-body">{p.body}</p>
                <ul className="plan-includes">
                  {p.includes.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <a
                  className={`btn ${p.featured ? "btn-acid" : "btn-outline"}`}
                  href="#contact"
                >
                  Start with {p.name}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="faq" id="faq" aria-labelledby="faq-title">
          <div className="section-head">
            <h2 id="faq-title">Questions coaches ask before hiring us</h2>
            <p>If yours isn&apos;t here, ask us directly. We reply fast.</p>
          </div>

          {/* Native <details>: zero JS, keyboard + screen-reader friendly,
              and the answers are real DOM text Google can index. */}
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <details className="faq-item" name="faq" open={i === 0} key={f.q}>
                <summary className="faq-q">
                  <h3>{f.q}</h3>
                  <span className="faq-icon" aria-hidden="true"><PlusIcon /></span>
                </summary>
                <div className="faq-a">
                  <p>{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="closing" id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title">Ready to stop chasing referrals?</h2>
          <p className="closing-sub">
            Tell us about your coaching business and we&apos;ll recommend where to start.
          </p>
          <a className="btn btn-solid btn-lg magnetic" href={CONTACT_HREF}>
            Book a call
          </a>
          <p className="closing-alt">
            Not a coach? <OtherPersonas />
          </p>
        </section>
      </main>
    </div>
  );
}
