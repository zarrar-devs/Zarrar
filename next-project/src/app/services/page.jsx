"use client";

/* =============================================================
   Zarrar — services & plans
   -------------------------------------------------------------
   SEO note: put this in the route's page.js / layout.js, not here
   (metadata can't be exported from a "use client" file):

   export const metadata = {
     title: "Zarrar — Websites, outreach and social for people who sell themselves",
     description:
       "We build the website, run the social accounts and send the cold outreach for speakers, authors, coaches and founders. Three plans, one team.",
     alternates: { canonical: "https://zarrar.com/services" },
     openGraph: {
       title: "Zarrar — Get found. Get booked.",
       description:
         "Websites, social media management and lead generation for speakers, authors, coaches and founders.",
       url: "https://zarrar.com/services",
       type: "website",
     },
   };
   ============================================================= */

import React, { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./Services.css";

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

/* ---------------- Content ---------------- */

const AUDIENCE = [
  { who: "Speakers", line: "Be on the shortlist when an event organiser searches your name." },
  { who: "Authors", line: "A home for the book that keeps selling after launch week ends." },
  { who: "Coaches", line: "Discovery calls that arrive from outreach, not from luck." },
  { who: "Consultants", line: "Proof of work that closes the deal before the first meeting." },
  { who: "Founders", line: "One clear page that explains the business to customers and investors." },
  { who: "Creators", line: "An audience that lands somewhere you own, not just a feed." },
];

const SERVICES = [
  {
    id: "web-development",
    title: "Website development",
    body: "A fast, custom-built site that says what you do in the first five seconds. Designed from scratch, tuned for search, and handed over so you can update it yourself.",
    cta: "Build my site",
    icon: <WebIcon />,
  },
  {
    id: "lead-generation",
    title: "Lead generation & cold outreach",
    body: "We find the people who already need what you sell, write the emails that get replies, and run the follow-up. You get booked calls, not a list of contacts.",
    cta: "Get me leads",
    icon: <OutreachIcon />,
  },
  {
    id: "social-media",
    title: "Social media management",
    body: "Content planned around your offers, shot and edited by us, posted on schedule. We handle comments and DMs so the account builds trust instead of filling a calendar.",
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

/* Structured data — helps the services and plans surface in search */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Zarrar",
  description:
    "Websites, social media management and lead generation for speakers, authors, coaches and founders.",
  areaServed: "Worldwide",
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

/* ---------------- Component ---------------- */

function Services() {
  const root = useRef(null);

  useIsoLayoutEffect(() => {
    const splits = [];
    let lenis;

    /* optional smooth scroll — skipped silently if lenis isn't installed */
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

      /* ---- signature move: per-character 3D flip-in ----
         Chars start folded back on the X axis (edge-on, squashed
         flat) and snap upright on a fast overlapping stagger.    */
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

      /* ================= reduced motion ================= */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q(".hero-rule"), { scaleX: 1 });
      });

      /* ================= everything else ================= */
      mm.add("(prefers-reduced-motion: no-preference)", (mctx) => {
        const { isDesktop } = mctx.conditions || {};

        /* ---- load sequence ---- */
        gsap.timeline({ defaults: { ease: "expo.out" } })
          .from(q(".logo, .nav-links a, .nav-cta"), {
            yPercent: -160, opacity: 0, duration: 0.75, stagger: 0.05,
          })
          .add(flipIn(q(".hero-l1")[0]), 0.06)
          .add(flipIn(q(".hero-l2")[0]), 0.2)
          .add(linesIn(q(".hero-sub")[0]), 0.42)
          .from(q(".hero-actions > *"), { y: 24, opacity: 0, duration: 0.75, stagger: 0.08 }, 0.55)
          .to(q(".hero-rule"), { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0.35);

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

        /* ---- audience rows wipe in, batched ---- */
        ScrollTrigger.batch(q(".aud-row"), {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.from(batch, {
              yPercent: 60, opacity: 0, duration: 0.85, ease: "expo.out", stagger: 0.07,
            }),
        });
        gsap.from(q(".aud-rule"), {
          scaleX: 0, transformOrigin: "left center", ease: "none", stagger: 0.4,
          scrollTrigger: { trigger: q(".audience-list")[0], start: "top 82%", end: "bottom 65%", scrub: 0.5 },
        });

        /* ---- the statement: words light up on scrub ---- */
        const stmt = q(".statement p")[0];
        if (stmt) {
          const split = SplitText.create(stmt, { type: "words", wordsClass: "word", aria: "auto" });
          splits.push(split);
          gsap.fromTo(
            split.words,
            { opacity: 0.16 },
            {
              opacity: 1, ease: "none", stagger: 0.35,
              scrollTrigger: {
                trigger: q(".statement")[0],
                start: "top 78%",
                end: "bottom 62%",
                scrub: 0.4,
              },
            }
          );
        }

        /* ---- service cards ---- */
        const cards = q(".service-card");
        gsap.from(cards, {
          y: 60, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.09,
          scrollTrigger: { trigger: q(".services-grid")[0], start: "top 80%", once: true },
        });
        cards.forEach((card) => {
          flipIn(card.querySelector("h3"), { trigger: card, start: "top 82%" });
          drawIcon(card.querySelector("svg"), card);
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

        /* desktop-only: the featured plan lifts as it passes */
        if (isDesktop) {
          gsap.to(q(".plan.is-featured"), {
            y: -34, ease: "none",
            scrollTrigger: { trigger: q(".plans-grid")[0], start: "top bottom", end: "bottom top", scrub: 1 },
          });
        }

        /* ---- closing ---- */
        const close = q(".closing")[0];
        if (close) {
          gsap.timeline({ scrollTrigger: { trigger: close, start: "top 82%", once: true } })
            .add(flipIn(close.querySelector("h2")))
            .from(close.querySelector(".btn"), { y: 28, opacity: 0, duration: 0.65, ease: "back.out(1.6)" }, "-=0.45");
        }
      }, { isDesktop: "(min-width: 900px)" });

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

    /* webfonts change metrics — re-measure line splits once they land */
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
    <div className="services-page" ref={root}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <header className="nav">
        <a className="logo" href="#top">Zarrar</a>
        <nav className="nav-links" aria-label="Sections">
          <a href="#who">Who it&apos;s for</a>
          <a href="#services">Services</a>
          <a href="#plans">Plans</a>
        </nav>
        <a className="nav-cta magnetic" href="#contact">Book a call</a>
        <div className="nav-progress" aria-hidden="true"><span /></div>
      </header>

      <main>
        <section className="hero" id="top">
          <h1 className="hero-heading">
            <span className="hero-l1">Get found.</span>
            <span className="hero-l2">Get booked.</span>
          </h1>

          <div className="hero-rule" aria-hidden="true" />

          <div className="hero-foot">
            <p className="hero-sub">
              We build the website, run the social accounts and send the outreach
              — so speakers, authors, coaches and founders spend their time on the
              work instead of chasing it.
            </p>
            <div className="hero-actions">
              <a className="btn btn-solid magnetic" href="#plans">See the plans</a>
              <a className="btn btn-ghost" href="#services">What we do</a>
            </div>
          </div>
        </section>

        <section className="audience" id="who" aria-labelledby="who-title">
          <div className="section-head">
            <h2 id="who-title">Who we work with</h2>
            <p>Different work, same problem: the right people can&apos;t find you yet.</p>
          </div>

          <ul className="audience-list">
            {AUDIENCE.map((a) => (
              <li className="aud-row" key={a.who}>
                <span className="aud-rule" aria-hidden="true" />
                <span className="aud-who">{a.who}</span>
                <span className="aud-line">{a.line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="statement" aria-label="What we believe">
          <p>
            You don&apos;t have a talent problem. You have a nobody-can-find-you
            problem — and that one is fixable.
          </p>
        </section>

        <section className="services" id="services" aria-labelledby="services-title">
          <div className="section-head">
            <h2 id="services-title">What we do</h2>
            <p>Pick one, or let them work together.</p>
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

        <section className="closing" id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title">Tell us what you&apos;re building.</h2>
          <a className="btn btn-solid btn-lg magnetic" href="mailto:hello@zarrar.com">
            Say hello
          </a>
        </section>
      </main>
    </div>
  );
}

export default Services;