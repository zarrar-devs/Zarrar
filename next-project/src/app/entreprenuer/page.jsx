"use client";

/* =============================================================
   Zarrar — /for-founders  (founders, entrepreneurs & CEOs)
   -------------------------------------------------------------
   Sibling of /for-coaches. Same offer, different look:
   deep green + brass, Gloock (serif) + Schibsted Grotesk,
   floating pill nav, sheet-style sections.

   Deps:  npm i gsap lenis      (SplitText is free in gsap >= 3.13)

   Every class is prefixed `fd-` on purpose. Coaches.css has
   unscoped selectors (.btn, .nav, .hero ...) that would leak into
   this page if both stylesheets are ever loaded together.

   SEO note: put this in the route's page.js (metadata can't be
   exported from a "use client" file):

   import Founders from "@/components/Founders";

   export const metadata = {
     title: "Website, Email & Social Media for Founders & CEOs | Zarrar",
     description:
       "Premium website and portfolio development, email marketing and social media management for founders and CEOs. Look as big as the company you're building.",
     alternates: { canonical: "https://zarrar.com/for-founders" },
     robots: { index: true, follow: true },
     openGraph: {
       title: "Founders and CEOs get Googled before they get a reply | Zarrar",
       description:
         "Websites, email marketing and social media management for founders and CEOs.",
       url: "https://zarrar.com/for-founders",
       siteName: "Zarrar",
       type: "website",
       images: [{ url: "https://zarrar.com/og/for-founders.png", width: 1200, height: 630 }],
     },
     twitter: {
       card: "summary_large_image",
       title: "Website, Email & Social Media for Founders & CEOs | Zarrar",
       description:
         "Premium web design, email marketing and social media management for founders and CEOs.",
       images: ["https://zarrar.com/og/for-founders.png"],
     },
   };

   export default function Page() {
     return <Founders />;
   }
   ============================================================= */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./entreprenuer.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SITE = "https://zarrar.com";
const PAGE_URL = `${SITE}/for-founders`;

/* ---------------- Icons (decorative — hidden from AT) ---------------- */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function WebIcon() {
  return (
    <svg viewBox="0 0 48 48" {...stroke}>
      <rect x="5" y="7" width="38" height="34" rx="3" />
      <path d="M5 16h38" />
      <path d="M13 24h12M13 30h8" />
      <rect x="29" y="22" width="10" height="13" rx="1.5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 48 48" {...stroke}>
      <rect x="5" y="11" width="38" height="26" rx="3" />
      <path d="M5 15l19 14 19-14" />
    </svg>
  );
}

function SocialIcon() {
  return (
    <svg viewBox="0 0 48 48" {...stroke}>
      <path d="M8 10h32a3 3 0 013 3v16a3 3 0 01-3 3H26l-9 7v-7H8a3 3 0 01-3-3V13a3 3 0 013-3z" />
      <path d="M14 18h20M14 24h12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l5 5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

/* =====================  FOUNDER-SPECIFIC CONTENT  ===================== */

/* Hero demo: what a search for a founder's name can look like.
   Illustrative only, so the names are invented. Each row maps to a service:
   website -> web development, LinkedIn -> social, newsletter -> email. */
const SERP_QUERY = "Maya Hart CEO Northwind";

const SERP = [
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

const PAIN_POINTS = [
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

const TIMELINE = [
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

const FAQS = [
  {
    q: "Why does a founder or CEO need a personal website as well as a company site?",
    a: "Because people look up the person before they back, hire or partner with the company. A company site explains the product. A founder site explains why you're the one to build it, and it's the one page in your search results that you fully control.",
  },
  {
    q: "What should a CEO or founder portfolio website include?",
    a: "A clear line on what you do and for whom, your track record and case studies, press and proof, what you're working on now, and one obvious way to get in touch or book a call. Underneath that: fast load times, a mobile-first layout and proper on-page SEO.",
  },
  {
    q: "Is cold email still effective for founders and CEOs?",
    a: "It works when the list is targeted, the message is relevant and the sending setup is technically sound: authenticated domains, sensible volumes and an easy way to opt out. Blasting a generic email to a huge list doesn't. We handle the research, copy, sending and follow-up.",
  },
  {
    q: "Does social media matter for a busy CEO?",
    a: "Usually it's where investors, candidates and customers check you out first. You don't need to become a content creator. We plan the content, write it in your voice, post it and handle replies, so the account keeps working while you run the company.",
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

/* =====================  SHARED OFFER  ===================== */
/* SERVICES copy is rewritten for founders; PLANS are identical to
   /for-coaches on purpose so the offer stays the same everywhere. */

const SERVICES = [
  {
    id: "web-development",
    tone: "pine",
    title: "Award-level website and portfolio development",
    body: "First impressions happen on your website, so we design and build one that looks like the company you actually run: custom, fast, mobile-first, and set up to rank when someone searches your name or your category.",
    points: [
      "Custom design and build, never a template",
      "Portfolio and case-study pages that build credibility",
      "Technical SEO, schema and fast load times built in",
      "Handover training so your team can edit it",
    ],
    cta: "Build my site",
    icon: <WebIcon />,
  },
  {
    id: "email-marketing",
    tone: "brass",
    title: "Email marketing and outbound promotion",
    body: "We research the investors, buyers, partners and press worth reaching, write the emails, send them from properly authenticated domains and handle the follow-up. We also run newsletters and launch promotions for the list you already have.",
    points: [
      "Prospect research and list building",
      "Copywriting, sending and follow-up sequences",
      "Sending domains set up with SPF, DKIM and DMARC",
      "Newsletter and launch-promotion campaigns",
    ],
    cta: "Start my outreach",
    icon: <MailIcon />,
  },
  {
    id: "social-media",
    tone: "mint",
    title: "Social media management for founders",
    body: "Your LinkedIn, X and Instagram run like a proper channel: content planned around your positioning, posted on schedule, with comments and DMs handled. The people who search your name find a founder worth backing.",
    points: [
      "Content plan built around your positioning",
      "Posts written in your voice",
      "Posting, replies and DM handling",
      "Profile and bio optimisation",
    ],
    cta: "Run my socials",
    icon: <SocialIcon />,
  },
];

const PLANS = [
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
    name: "Growth",
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

/* Internal links to the sibling persona pages. Remove any that aren't live yet. */
const PERSONAS = [
  { label: "Coaches", href: "/for-coaches" },
  { label: "Speakers", href: "/for-speakers" },
  { label: "Authors", href: "/for-authors" },
  { label: "Creators", href: "/for-creators" },
  { label: "Consultants", href: "/for-consultants" },
];

/* ---------------- Structured data ---------------- */

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: "Website, Email Marketing & Social Media for Founders & CEOs",
      description:
        "Premium website and portfolio development, email marketing and social media management for founders and CEOs.",
      inLanguage: "en",
      isPartOf: { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: "Zarrar" },
      breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
      about: { "@id": `${PAGE_URL}#service` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Founders & CEOs", item: PAGE_URL },
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${PAGE_URL}#service`,
      name: "Zarrar: Websites, Email Marketing & Social Media for Founders & CEOs",
      url: PAGE_URL,
      description:
        "Website and portfolio development, email marketing and outbound promotion, and social media management for founders, entrepreneurs and CEOs.",
      areaServed: "Worldwide",
      audience: { "@type": "Audience", audienceType: "Founders, entrepreneurs and CEOs" },
      serviceType: SERVICES.map((s) => s.title),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: SERVICES.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title, description: s.body },
        })),
      },
      makesOffer: PLANS.map((p) => ({
        "@type": "Offer",
        name: p.name,
        description: `${p.body} Includes: ${p.includes.join("; ")}.`,
      })),
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

const safeJson = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

/* ---------------- Component ---------------- */

function Founders() {
  const root = useRef(null);
  const [openFAQ, setOpenFAQ] = useState(0);

  useIsoLayoutEffect(() => {
    const splits = [];
    let lenis;
    let tick;
    let disposed = false;

    /* ---- smooth scroll (skipped for reduced motion) ---- */
    (async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      try {
        const { default: Lenis } = await import("lenis");
        if (disposed) return;
        lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: { offset: -72 } });
        lenis.on("scroll", ScrollTrigger.update);
        tick = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
      } catch {
        /* native scroll is fine */
      }
    })();

    const ctx = gsap.context((self) => {
      const q = self.selector;

      /* Headline reveal: words rise out of a line mask. autoSplit re-splits on
         resize / font load, and the returned tween keeps its progress. */
      const revealHeading = (el, { trigger, start = "top 85%", delay = 0 } = {}) => {
        if (!el) return;
        splits.push(
          SplitText.create(el, {
            type: "lines,words",
            mask: "lines",
            autoSplit: true,
            aria: "auto",
            onSplit: (s) =>
              gsap.from(s.words, {
                yPercent: 110,
                duration: 1,
                ease: "expo.out",
                stagger: 0.06,
                delay,
                scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
              }),
          })
        );
      };

      const mm = gsap.matchMedia();

      /* ---- reduced motion: the final state is the default state ---- */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const typed = q(".fd-serp-typed")[0];
        if (typed) typed.textContent = SERP_QUERY;
      });

      /* ---- motion ---- */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Hero: one orchestrated moment. A founder's name gets typed into
           search, the weak results show, then each one is replaced. */
        const typed = q(".fd-serp-typed")[0];
        const items = q(".fd-serp-item");
        const befores = q(".fd-serp-before");
        const afters = q(".fd-serp-after");
        const typing = { n: 0 };

        if (typed) typed.textContent = "";
        gsap.set(befores, { autoAlpha: 1 });
        gsap.set(afters, { clipPath: "inset(0 100% 0 0)" });
        gsap.set(items, { autoAlpha: 0, y: 16 });

        revealHeading(q(".fd-hero-title")[0], { delay: 0.15 });

        gsap
          .timeline({ defaults: { ease: "expo.out" }, delay: 0.1 })
          .from(q(".fd-logo, .fd-nav-links a"), { y: -24, opacity: 0, duration: 0.8, stagger: 0.05 }, 0)
          .from(q(".fd-nav-cta"), { opacity: 0, duration: 0.8 }, 0.2)
          .from(q(".fd-hero-sub, .fd-hero-actions"), { y: 22, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.7)
          .from(q(".fd-serp"), { y: 40, opacity: 0, duration: 1.1 }, 0.5)
          .to(
            typing,
            {
              n: SERP_QUERY.length,
              duration: 1.4,
              ease: "none",
              onUpdate: () => {
                if (typed) typed.textContent = SERP_QUERY.slice(0, Math.round(typing.n));
              },
            },
            1.1
          )
          .to(items, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12 }, 2.6)
          .to(afters, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.inOut", stagger: 0.22 }, 4.2)
          .set(befores, { autoAlpha: 0 }, 5.9);

        /* Scroll progress in the nav */
        gsap.to(q(".fd-nav-progress span"), {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.3 },
        });

        /* Section headings */
        q(".fd-section-head").forEach((head) => {
          revealHeading(head.querySelector("h2"), { trigger: head, start: "top 82%" });
        });

        const closing = q(".fd-closing")[0];
        if (closing) {
          revealHeading(closing.querySelector("h2"), { trigger: closing, start: "top 75%" });
          gsap.from(q(".fd-closing-cta > *"), {
            y: 24,
            opacity: 0,
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: { trigger: closing, start: "top 65%", once: true },
          });
        }

        /* Problem statements light up as you read down them */
        q(".fd-problem-item").forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0.2 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: item, start: "top 82%", end: "top 48%", scrub: true },
            }
          );
        });

        /* 90-day line fills as the section scrolls */
        gsap.fromTo(
          q(".fd-steps-fill"),
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: q(".fd-steps-wrap")[0], start: "top 75%", end: "bottom 55%", scrub: 0.4 },
          }
        );
      });

      /* ---- service sheets stack, earlier ones recede (desktop only) ---- */
      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 900px) and (min-height: 680px)",
        () => {
          const cards = q(".fd-svc");
          cards.forEach((card, i) => {
            const next = cards[i + 1];
            if (!next) return;
            gsap.to(card, {
              scale: 0.93,
              "--dim": 0.55,
              transformOrigin: "50% 0%",
              ease: "none",
              scrollTrigger: { trigger: next, start: "top 92%", end: "top 22%", scrub: true },
            });
          });
        }
      );

      /* ---- magnetic buttons ---- */
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const cleanups = [];
        q(".fd-magnetic").forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
          const move = (e) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
          });
        });
        return () => cleanups.forEach((fn) => fn());
      });

      return () => mm.revert();
    }, root);

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => {
      disposed = true;
      if (tick) gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <div className="founders-page" ref={root}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson(JSON_LD) }}
      />

      <a className="fd-skip" href="#main">Skip to content</a>

      <header className="fd-nav">
        <a className="fd-logo fd-display" href="/">Zarrar</a>
        <nav className="fd-nav-links" aria-label="Sections">
          <a href="#problem">Why it matters</a>
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#plans">Plans</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="fd-nav-cta fd-magnetic" href="#contact">Book a call</a>
        <div className="fd-nav-progress" aria-hidden="true"><span /></div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* ---------- Hero ---------- */}
        <section className="fd-hero" id="top" aria-labelledby="hero-title">
          <div className="fd-wrap fd-hero-grid">
            <div className="fd-hero-copy">
              <h1 className="fd-hero-title fd-display" id="hero-title">
                Founders and CEOs get Googled before they get a reply.
              </h1>
              <p className="fd-hero-sub">
                Premium website and portfolio design, email marketing and social
                media management for founders and CEOs, so what people find is
                worth the click.
              </p>
              <div className="fd-hero-actions">
                <a className="fd-btn fd-magnetic" href="#plans">See the plans</a>
                <a className="fd-link" href="#services">What we do</a>
              </div>
            </div>

            <figure className="fd-serp-fig">
              <div className="fd-serp" aria-hidden="true" data-nosnippet>
                <div className="fd-serp-bar">
                  <span className="fd-serp-icon"><SearchIcon /></span>
                  <span className="fd-serp-typed" />
                  <span className="fd-serp-caret" />
                </div>
                <ul className="fd-serp-list">
                  {SERP.map((r) => (
                    <li className="fd-serp-item" key={r.key}>
                      <div className="fd-serp-layer fd-serp-before">
                        <span className="fd-serp-url">{r.before.url}</span>
                        <span className="fd-serp-title">{r.before.title}</span>
                        <span className="fd-serp-desc">{r.before.desc}</span>
                      </div>
                      <div className="fd-serp-layer fd-serp-after">
                        <span className="fd-serp-url">{r.after.url}</span>
                        <span className="fd-serp-title">{r.after.title}</span>
                        <span className="fd-serp-desc">{r.after.desc}</span>
                        {r.after.chips && (
                          <span className="fd-serp-chips">
                            {r.after.chips.map((c) => <span key={c}>{c}</span>)}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <figcaption className="fd-serp-caption">
                Illustrative example: a search for a founder&apos;s name, before and after.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ---------- Problem ---------- */}
        <section className="fd-problem fd-light fd-sheet" id="problem" aria-labelledby="problem-title">
          <div className="fd-wrap fd-split">
            <div className="fd-section-head fd-sticky">
              <h2 className="fd-display" id="problem-title">
                Why great founders and CEOs still get overlooked online
              </h2>
              <p>The company is ready. Its public face often isn&apos;t.</p>
            </div>

            <ul className="fd-problem-list">
              {PAIN_POINTS.map((p) => (
                <li className="fd-problem-item" key={p.title}>
                  <h3 className="fd-display">{p.title}</h3>
                  <p>{p.line}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Services ---------- */}
        <section className="fd-services fd-light" id="services" aria-labelledby="services-title">
          <div className="fd-wrap">
            <div className="fd-section-head">
              <h2 className="fd-display" id="services-title">
                Website, email and social media that work together
              </h2>
              <p>Pick one, or run all three. Each one makes the others work harder.</p>
            </div>

            <div className="fd-stack">
              {SERVICES.map((s, i) => (
                <article
                  className="fd-svc"
                  id={s.id}
                  data-tone={s.tone}
                  style={{ "--i": i }}
                  key={s.id}
                >
                  <span className="fd-svc-icon" aria-hidden="true">{s.icon}</span>
                  <div className="fd-svc-main">
                    <h3 className="fd-display">{s.title}</h3>
                    <p>{s.body}</p>
                    <a className="fd-btn fd-magnetic" href="#contact">{s.cta}</a>
                  </div>
                  <ul className="fd-svc-points fd-ticks">
                    {s.points.map((pt) => <li key={pt}>{pt}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Process ---------- */}
        <section className="fd-process" id="process" aria-labelledby="process-title">
          <div className="fd-wrap">
            <div className="fd-section-head">
              <h2 className="fd-display" id="process-title">What the first 90 days look like</h2>
              <p>A rough shape of how the pieces come online, in order.</p>
            </div>

            <div className="fd-steps-wrap">
              <div className="fd-steps-track" aria-hidden="true"><span className="fd-steps-fill" /></div>
              <ol className="fd-steps">
                {TIMELINE.map((s) => (
                  <li className="fd-step" key={s.title}>
                    <span className="fd-step-when">{s.when}</span>
                    <h3 className="fd-display">{s.title}</h3>
                    <p>{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
            <p className="fd-note">
              Illustrative timeline. Exact pace depends on your market, offer
              and existing audience.
            </p>
          </div>
        </section>

        {/* ---------- Plans ---------- */}
        <section className="fd-plans fd-light fd-sheet" id="plans" aria-labelledby="plans-title">
          <div className="fd-wrap">
            <div className="fd-section-head">
              <h2 className="fd-display" id="plans-title">Pick a starting point</h2>
              <p>Each plan builds on the one before it. Move up whenever you&apos;re ready.</p>
            </div>

            <div className="fd-plans-grid">
              {PLANS.map((p) => (
                <article className={`fd-plan${p.featured ? " is-featured" : ""}`} key={p.id}>
                  {p.featured && <span className="fd-plan-flag">Most complete</span>}
                  <h3 className="fd-plan-name fd-display">{p.name}</h3>
                  <p className="fd-plan-line">{p.line}</p>
                  <p className="fd-plan-body">{p.body}</p>
                  <ul className="fd-plan-includes fd-ticks">
                    {p.includes.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <a className="fd-btn" href="#contact">Start with {p.name}</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="fd-faq fd-light" id="faq" aria-labelledby="faq-title">
          <div className="fd-wrap fd-split">
            <div className="fd-section-head fd-sticky">
              <h2 className="fd-display" id="faq-title">Questions founders and CEOs ask us</h2>
              <p>If yours isn&apos;t here, ask us directly. We reply fast.</p>
            </div>

            <div className="fd-faq-list">
              {FAQS.map((f, i) => {
                const isOpen = openFAQ === i;
                const qId = `fd-faq-q-${i}`;
                const aId = `fd-faq-a-${i}`;
                return (
                  <div className={`fd-faq-item${isOpen ? " is-open" : ""}`} key={f.q}>
                    <h3 className="fd-faq-h">
                      <button
                        className="fd-faq-q"
                        id={qId}
                        aria-expanded={isOpen}
                        aria-controls={aId}
                        onClick={() => setOpenFAQ(isOpen ? -1 : i)}
                      >
                        <span>{f.q}</span>
                        <span className="fd-faq-icon" aria-hidden="true"><PlusIcon /></span>
                      </button>
                    </h3>
                    <div className="fd-faq-a" id={aId}>
                      <div className="fd-faq-a-inner">
                        <p>{f.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- Closing ---------- */}
        <section className="fd-closing" id="contact" aria-labelledby="contact-title">
          <div className="fd-wrap fd-closing-inner">
            <h2 className="fd-closing-title fd-display" id="contact-title">
              Let&apos;s build the presence your company has earned.
            </h2>
            <div className="fd-closing-cta">
              <a className="fd-btn fd-btn-lg fd-magnetic" href="mailto:hello@zarrar.com">Say hello</a>
              <p className="fd-closing-alt">
                Not a founder or CEO? <a href="#audiences">See who else we work with</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="fd-footer" id="audiences">
        <div className="fd-footer-inner">
          <div>
            <p className="fd-footer-title">Who we work with</p>
            <nav aria-label="Who we work with">
              <ul>
                <li><span aria-current="page">Founders &amp; CEOs</span></li>
                {PERSONAS.map((p) => (
                  <li key={p.href}><a href={p.href}>{p.label}</a></li>
                ))}
              </ul>
            </nav>
          </div>
          <p className="fd-footer-copy">&copy; {new Date().getFullYear()} Zarrar</p>
        </div>
      </footer>
    </div>
  );
}

export default Founders;