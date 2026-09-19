"use client";

/* =============================================================
   Zarrar — /for-real-estate-agents
   -------------------------------------------------------------
   Deliberately NOT a copy of Coaches.js with find-replace text.
   Real estate has different pressures (portal dependence, speed-
   to-lead, hyper-local search) so the layout differs in three
   places: the hero (single-line masked reveal + a local-area chip
   strip), the "problem" section (a two-column portal-vs-owned
   comparison instead of a stacked list), and the services grid
   (4 horizontal icon-left cards, adding a local-SEO card that's
   specific to this persona — Coaches/Services keep 3).

   AREAS below are placeholders. Swap them for the agent's real
   neighbourhoods/city before shipping — they only help local SEO
   if they're the actual local search terms buyers use.

   SEO note: put this in the route's page.js / layout.js, not here
   (metadata can't be exported from a "use client" file):

   export const metadata = {
     title: "Real Estate Agent Websites, Local SEO & Leads | Zarrar",
     description:
       "We build your website, dial in your local SEO and send outreach that brings buyers and sellers straight to you — not shared with every other agent in your zip code.",
     alternates: { canonical: "https://zarrar.com/for-real-estate-agents" },
     openGraph: {
       title: "Own your pipeline. Not just your listings. | Zarrar for Real Estate Agents",
       description:
         "Websites, local SEO and lead generation for real estate agents.",
       url: "https://zarrar.com/for-real-estate-agents",
       type: "website",
     },
   };
   ============================================================= */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./realestate.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ---------------- Icons (decorative — hidden from AT) ---------------- */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function WebIcon() {
  return (
    <svg viewBox="0 0 48 48" {...stroke}>
      <rect className="draw" x="4" y="8" width="40" height="32" rx="3" />
      <line className="draw" x1="4" y1="17" x2="44" y2="17" />
      <path className="draw" d="M19 25l-5 5 5 5" />
      <path className="draw" d="M29 25l5 5-5 5" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 48 48" {...stroke}>
      <path className="draw" d="M24 44S38 30.8 38 20a14 14 0 1 0-28 0c0 10.8 14 24 14 24z" />
      <circle className="draw" cx="24" cy="20" r="5" />
    </svg>
  );
}

function OutreachIcon() {
  return (
    <svg viewBox="0 0 48 48" {...stroke}>
      <path className="draw" d="M5 24L43 9l-6 30-11-9-8 8v-10z" />
      <path className="draw" d="M18 28L43 9" />
    </svg>
  );
}

function SocialIcon() {
  return (
    <svg viewBox="0 0 48 48" {...stroke}>
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
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}

/* =====================  PERSONA-SPECIFIC CONTENT  ===================== */

/* Placeholder local areas — replace with the agent's real
   neighbourhoods/suburbs/city. This is the whole point of the
   chip strip, so don't ship it with these placeholders. */
const AREAS = ["Downtown", "Uptown", "Riverside", "The Hills", "Lakeside", "Historic District"];

const COMPARE = {
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
      "A site that's only about you, with no one else's ad on the page.",
      "Enquiries come straight to you — no one else sees them first.",
      "Local search rankings keep working long after a listing sells.",
    ],
  },
};

const TIMELINE = [
  {
    num: "Weeks 1–2",
    title: "Foundation",
    body: "Website goes live with a lead capture on every page, Google Business Profile optimised, first geo-farm list built.",
  },
  {
    num: "Weeks 3–6",
    title: "Outreach + content",
    body: "Geo-targeted outreach and neighbourhood content go out on schedule. First replies and showing requests start coming in direct.",
  },
  {
    num: "Weeks 7–12",
    title: "Local flywheel",
    body: "Local rankings compound, referrals layer on top of outreach, and enquiries stop routing through a portal at all.",
  },
];

const FAQS = [
  {
    q: "I'm already on Zillow and Realtor.com — do I need my own website?",
    a: "Yes, for one reason: a lead on a portal is often shared with other agents paying for the same zip code. A site that's only about you keeps enquiries yours alone, and it's the one piece of online property you fully control.",
  },
  {
    q: "Can the website show my live MLS listings?",
    a: "In most markets, yes, through an IDX feed tied to your MLS access — we set that up as part of the build. The exact setup depends on your board and brokerage, so we'll confirm what's available for your MLS before we start.",
  },
  {
    q: "How fast do you respond to a new lead?",
    a: "Speed matters more here than in almost any other business — a lead that waits an hour often books with whoever answered first. We set up instant notifications so you can respond immediately, and outreach follow-up runs on a schedule that doesn't let anyone go cold.",
  },
  {
    q: "What's actually involved in local SEO?",
    a: "Mainly your Google Business Profile — categories, photos, posts and reviews — plus location-specific pages on your site that match how people actually search, like \"[your city] realtor\" or \"[neighbourhood] homes for sale\".",
  },
  {
    q: "How much does social media management cost for an agent?",
    a: "It depends on how much video and how many platforms you want covered. It's part of the Presence and Growth plans below, and we size it to your market once we know your patch.",
  },
];

/* =====================  SHARED / STRUCTURAL  ===================== */

const SERVICES = [
  {
    id: "web-development",
    title: "Website development",
    body: "A site built to showcase listings and sell your brand — mobile-first, fast, and set up to convert visitors who are already deep into a search.",
    cta: "Build my site",
    icon: <WebIcon />,
  },
  {
    id: "local-seo",
    title: "Local SEO & Google Business Profile",
    body: "We optimise your Google Business Profile and build the local pages that get you found when someone searches \"[city] real estate agent\" — not just when a portal ad happens to show you.",
    cta: "Boost my local presence",
    icon: <MapPinIcon />,
  },
  {
    id: "lead-generation",
    title: "Lead generation & outreach",
    body: "Geo-targeted outreach to expired listings, FSBOs and past clients, written and sent for you — so new leads arrive with your name already attached.",
    cta: "Get me leads",
    icon: <OutreachIcon />,
  },
  {
    id: "social-media",
    title: "Social media & video",
    body: "Listing walkthroughs, neighbourhood content and open-house promotion, planned and posted on schedule — built to get local eyes on you.",
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

/* Structured data */
const JSON_LD_SERVICE = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Zarrar — Websites & Local SEO for Real Estate Agents",
  description:
    "Website development, local SEO and lead generation for real estate agents.",
  areaServed: "Worldwide",
  audience: { "@type": "Audience", audienceType: "Real Estate Agents" },
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
};

const JSON_LD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/* ---------------- Component ---------------- */

function RealEstate() {
  const root = useRef(null);
  const [openFAQ, setOpenFAQ] = useState(0);

  useIsoLayoutEffect(() => {
    const splits = [];
    let lenis;

    const startSmooth = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      try {
        const { default: Lenis } = await import("lenis");
        lenis = new Lenis({ duration: 1.1, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      } catch {
        /* native scroll is fine */
      }
    };
    startSmooth();

    const ctx = gsap.context((self) => {
      const q = self.selector;

      const flipIn = (el, opts = {}) => {
        if (!el) return gsap.timeline();

        const split = SplitText.create(el, {
          type: "chars,words",
          charsClass: "char",
          wordsClass: "word",
          aria: "auto",
        });
        splits.push(split);
        gsap.set(el, { perspective: 620 });

        return gsap.from(split.chars, {
          rotateX: -96,
          rotateY: (i) => (i % 2 ? 8 : -5),
          z: -70,
          yPercent: 36,
          scaleY: 0.4,
          transformOrigin: "50% 100% -0.42em",
          duration: 1.05,
          ease: "expo.out",
          stagger: { each: 0.02 },
          onComplete: () => gsap.set(split.chars, { clearProps: "willChange" }),
          scrollTrigger: opts.trigger
            ? { trigger: opts.trigger, start: opts.start || "top 80%", once: true }
            : undefined,
        });
      };

      const linesIn = (el, opts = {}) => {
        if (!el) return gsap.timeline();

        const split = SplitText.create(el, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
          aria: "auto",
        });
        splits.push(split);

        return gsap.from(split.lines, {
          yPercent: 110,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: opts.trigger
            ? { trigger: opts.trigger, start: opts.start || "top 85%", once: true }
            : undefined,
        });
      };

      const drawIcon = (svg, trigger) => {
        if (!svg) return;
        const strokes = svg.querySelectorAll(".draw");
        strokes.forEach((s) => {
          const len = s.getTotalLength ? s.getTotalLength() : 200;
          gsap.set(s, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.to(strokes, {
          strokeDashoffset: 0,
          duration: 1,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: { trigger, start: "top 80%", once: true },
        });
      };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q(".hero-rule"), { scaleX: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---- load sequence: single masked-line hero instead of
           the two-span char-flip used on the other persona pages ---- */
        gsap.timeline({ defaults: { ease: "expo.out" } })
          .from(q(".logo, .nav-links a, .nav-cta"), {
            yPercent: -160, opacity: 0, duration: 0.75, stagger: 0.05,
          })
          .add(linesIn(q(".hero-heading")[0]), 0.1)
          .add(linesIn(q(".hero-sub")[0]), 0.4)
          .from(q(".area-chip"), { y: 14, opacity: 0, duration: 0.5, stagger: 0.05 }, 0.62)
          .from(q(".hero-actions > *"), { y: 24, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.6)
          .to(q(".hero-rule"), { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0.3);

        /* ---- scroll progress ---- */
        gsap.to(q(".nav-progress span"), {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.3 },
        });

        /* ---- hero drifts away as you leave it ---- */
        gsap.to(q(".hero-heading"), {
          yPercent: -14, opacity: 0.25, ease: "none",
          scrollTrigger: { trigger: q(".hero")[0], start: "top top", end: "bottom top", scrub: 0.6 },
        });

        /* ---- section heads ---- */
        q(".section-head").forEach((head) => {
          flipIn(head.querySelector("h2"), { trigger: head, start: "top 82%" });
          linesIn(head.querySelector("p"), { trigger: head, start: "top 80%" });
        });

        /* ---- compare columns slide in from opposite sides ---- */
        const compareCols = q(".compare-col");
        if (compareCols[0]) {
          gsap.from(compareCols[0], {
            xPercent: -6, opacity: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: q(".compare-grid")[0], start: "top 78%", once: true },
          });
        }
        if (compareCols[1]) {
          gsap.from(compareCols[1], {
            xPercent: 6, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.12,
            scrollTrigger: { trigger: q(".compare-grid")[0], start: "top 78%", once: true },
          });
        }
        compareCols.forEach((col) => {
          gsap.from(col.querySelectorAll("li"), {
            y: 12, opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.06,
            scrollTrigger: { trigger: col, start: "top 74%", once: true },
          });
        });

        /* ---- service cards (4, horizontal) ---- */
        const cards = q(".service-card");
        gsap.from(cards, {
          y: 50, opacity: 0, duration: 0.95, ease: "expo.out", stagger: 0.08,
          scrollTrigger: { trigger: q(".services-grid")[0], start: "top 80%", once: true },
        });
        cards.forEach((card) => {
          flipIn(card.querySelector("h3"), { trigger: card, start: "top 84%" });
          drawIcon(card.querySelector("svg"), card);
        });

        /* ---- timeline steps ---- */
        gsap.from(q(".case-step"), {
          y: 50, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.1,
          scrollTrigger: { trigger: q(".case-steps")[0], start: "top 80%", once: true },
        });
        q(".case-step").forEach((step) => {
          flipIn(step.querySelector("h3"), { trigger: step, start: "top 84%" });
        });

        /* ---- plans land tilted in 3D, then settle ---- */
        gsap.set(q(".plans-grid"), { perspective: 1400 });
        gsap.from(q(".plan"), {
          y: 88, rotateX: -13, opacity: 0, transformOrigin: "50% 0%",
          duration: 1.1, ease: "expo.out", stagger: 0.09,
          scrollTrigger: { trigger: q(".plans-grid")[0], start: "top 78%", once: true },
        });
        q(".plan").forEach((plan) => {
          gsap.from(plan.querySelectorAll(".plan-includes li"), {
            y: 14, opacity: 0, duration: 0.55, ease: "power3.out", stagger: 0.05,
            scrollTrigger: { trigger: plan, start: "top 72%", once: true },
          });
        });

        /* ---- FAQ rows ---- */
        gsap.from(q(".faq-item"), {
          y: 26, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.06,
          scrollTrigger: { trigger: q(".faq-list")[0], start: "top 82%", once: true },
        });

        /* ---- closing ---- */
        const close = q(".closing")[0];
        if (close) {
          gsap.timeline({ scrollTrigger: { trigger: close, start: "top 82%", once: true } })
            .add(flipIn(close.querySelector("h2")))
            .from(close.querySelector(".btn"), { y: 28, opacity: 0, duration: 0.65, ease: "back.out(1.6)" }, "-=0.45")
            .from(close.querySelector(".closing-alt"), { opacity: 0, duration: 0.5 }, "-=0.2");
        }
      });

      /* ---- magnetic buttons ---- */
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const cleanups = [];
        q(".magnetic").forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
          const move = (e) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.42);
          };
          const leave = () => { xTo(0); yTo(0); };
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
      lenis?.destroy();
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <div className="realestate-page" ref={root}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SERVICE) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_FAQ) }}
      />

      <header className="nav">
        <a className="logo" href="/">Zarrar</a>
        <nav className="nav-links" aria-label="Sections">
          <a href="#compare">Why it's different</a>
          <a href="#services">Services</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="nav-cta magnetic" href="#contact">Book a call</a>
        <div className="nav-progress" aria-hidden="true"><span /></div>
      </header>

      <main>
        <section className="hero" id="top">
          <h1 className="hero-heading">
            Own your <span className="accent">pipeline</span>. Not just your listings.
          </h1>

          <div className="hero-rule" aria-hidden="true" />

          <div className="hero-foot">
            <p className="hero-sub">
              A website built to convert, local SEO that gets you found before
              a portal ad does, and outreach that lands showings and listings
              straight in your calendar.
            </p>
            <div className="hero-actions">
              <a className="btn btn-solid magnetic" href="#plans">See the plans</a>
              <a className="btn btn-ghost" href="#services">How it works</a>
            </div>
          </div>

          <div className="area-chips" aria-label="Areas we help you rank in">
            <span className="area-chips-label">Built to rank in:</span>
            {AREAS.map((a) => (
              <span className="area-chip" key={a}>{a}</span>
            ))}
          </div>
        </section>

        <section className="compare" id="compare" aria-labelledby="compare-title">
          <div className="section-head">
            <h2 id="compare-title">Portals get the traffic. You take the risk.</h2>
            <p>Here&apos;s the actual difference between renting attention and owning it.</p>
          </div>

          <div className="compare-grid">
            <div className="compare-col">
              <span className="compare-tag compare-tag-old">{COMPARE.old.tag}</span>
              <ul>
                {COMPARE.old.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
            <div className="compare-col compare-col-highlight">
              <span className="compare-tag compare-tag-new">{COMPARE.owned.tag}</span>
              <ul>
                {COMPARE.owned.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="services" id="services" aria-labelledby="services-title">
          <div className="section-head">
            <h2 id="services-title">Built around speed and local search</h2>
            <p>Four pieces that work together — pick what you need first.</p>
          </div>

          <div className="services-grid">
            {SERVICES.map((s) => (
              <article className="service-card" id={s.id} key={s.id}>
                <span className="service-icon" aria-hidden="true">{s.icon}</span>
                <div className="service-card-body">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <a className="btn btn-outline" href="#contact">{s.cta}</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="case-study" id="how" aria-labelledby="case-title">
          <div className="section-head">
            <h2 id="case-title">What the first 90 days look like</h2>
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
            Illustrative timeline — exact pace depends on your market,
            price point and how competitive your area is.
          </p>
        </section>

        <section className="plans" id="plans" aria-labelledby="plans-title">
          <div className="section-head">
            <h2 id="plans-title">Pick a starting point</h2>
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
            <h2 id="faq-title">Questions agents ask us</h2>
            <p>If yours isn&apos;t here, ask us directly — we reply fast.</p>
          </div>

          <div className="faq-list">
            {FAQS.map((f, i) => {
              const isOpen = openFAQ === i;
              const qId = `faq-q-${i}`;
              const aId = `faq-a-${i}`;
              return (
                <div className={`faq-item${isOpen ? " is-open" : ""}`} key={f.q}>
                  <button
                    className="faq-q"
                    id={qId}
                    aria-expanded={isOpen}
                    aria-controls={aId}
                    onClick={() => setOpenFAQ(isOpen ? -1 : i)}
                  >
                    <span>{f.q}</span>
                    <span className="faq-icon"><PlusIcon /></span>
                  </button>
                  <div className="faq-a" id={aId} role="region" aria-labelledby={qId}>
                    <div className="faq-a-inner">
                      <p>{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="closing" id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title">Ready to own your pipeline?</h2>
          <a className="btn btn-solid btn-lg magnetic" href="mailto:hello@zarrar.com">
            Say hello
          </a>
          <p className="closing-alt">
            Not an agent? <a href="/#who">See who else we work with</a>
          </p>
        </section>
      </main>
    </div>
  );
}

export default RealEstate;