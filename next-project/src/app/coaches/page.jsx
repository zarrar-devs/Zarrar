"use client";

/* =============================================================
   Zarrar — /for-coaches
   -------------------------------------------------------------
   TEMPLATE NOTE: this page is built to be cloned for the other
   five personas (authors, founders, creators, speakers,
   consultants). Everything under "COACH-SPECIFIC CONTENT" below
   is what to rewrite per persona. SERVICES and PLANS are meant to
   stay identical across every persona page (single source of
   truth for the offer) — if you end up maintaining six copies of
   this file, pull SERVICES/PLANS into a shared data file instead
   of editing six places every time pricing changes.

   SEO note: put this in the route's page.js / layout.js, not here
   (metadata can't be exported from a "use client" file):

   export const metadata = {
     title: "Website, Leads & Social Media for Coaches | Zarrar",
     description:
       "We build your website, run your social accounts and send the outreach that turns into booked discovery calls — for coaches who want clients, not just followers.",
     alternates: { canonical: "https://zarrar.com/for-coaches" },
     openGraph: {
       title: "Fill your calendar. Not your inbox. | Zarrar for Coaches",
       description:
         "Websites, social media management and lead generation for coaches.",
       url: "https://zarrar.com/for-coaches",
       type: "website",
     },
   };
   ============================================================= */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./coaches.css";

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

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}

/* =====================  COACH-SPECIFIC CONTENT  ===================== */

const PAIN_POINTS = [
  {
    title: "Referrals dried up",
    line: "You built a client base on word of mouth, and the pipeline's gone quiet.",
  },
  {
    title: "Followers don't convert",
    line: "The Instagram numbers look fine. Discovery calls booked from it? Not so much.",
  },
  {
    title: "The website just sits there",
    line: "It's live, it's fine to look at, and it sends you close to zero enquiries a month.",
  },
];

const TIMELINE = [
  {
    num: "Weeks 1–2",
    title: "Foundation",
    body: "Website goes live with a booking flow connected, socials set up properly, outreach list built.",
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
    a: "Yes — even when most clients come from referrals or social media, people check your website before they book a call. Without one, you're relying on trust you haven't built yet.",
  },
  {
    q: "What should a coach's website actually include?",
    a: "A clear statement of who you help and how, a way to book a call without emailing back and forth, some proof you know what you're doing, and enough on-page SEO that people searching for a coach like you can actually find you.",
  },
  {
    q: "Is social media management worth it if I'm not a content creator?",
    a: "It's less about content skill and more about consistency. Most coaches stop posting because it becomes one more job. We handle the planning, posting and replies, so the account keeps showing up even when you're busy with clients.",
  },
  {
    q: "Can you get me leads without me doing outreach myself?",
    a: "Yes. We write the outreach, send it, and manage replies and follow-up. You get booked calls on your calendar, not a spreadsheet of contacts to chase.",
  },
  {
    q: "How long before I see booked calls?",
    a: "The website and socials are usually live within the first couple of weeks. Outreach replies and the first calls typically start in the following few weeks once campaigns are running — it depends on your niche and offer, but you're not waiting months for movement.",
  },
];

/* =====================  SHARED ACROSS PERSONAS  ===================== */

const SERVICES = [
  {
    id: "lead-generation",
    title: "Lead generation & cold outreach",
    body: "We find people already looking for a coach like you, write the outreach that gets replies, and manage the follow-up — so discovery calls land in your calendar on their own.",
    cta: "Get me leads",
    icon: <OutreachIcon />,
  },
  {
    id: "web-development",
    title: "Website development",
    body: "A site built around one job: turning a visitor into a booked call. Fast, on-brand, and set up to rank for the people searching for you.",
    cta: "Build my site",
    icon: <WebIcon />,
  },
  {
    id: "social-media",
    title: "Social media management",
    body: "Content planned around your offer, posted on schedule, comments and DMs handled — so the account builds trust instead of just racking up likes.",
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
  name: "Zarrar — Websites & Lead Generation for Coaches",
  description:
    "Website development, lead generation and social media management for coaching businesses.",
  areaServed: "Worldwide",
  audience: { "@type": "Audience", audienceType: "Coaches" },
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

function Coaches() {
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
        gsap.set(q(".hero-rule, .problem-rule"), { scaleX: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
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

        /* ---- section heads (reused for every section below) ---- */
        q(".section-head").forEach((head) => {
          flipIn(head.querySelector("h2"), { trigger: head, start: "top 82%" });
          linesIn(head.querySelector("p"), { trigger: head, start: "top 80%" });
        });

        /* ---- pain points ---- */
        q(".problem-item").forEach((item) => {
          flipIn(item.querySelector("h3"), { trigger: item, start: "top 85%" });
          linesIn(item.querySelector("p"), { trigger: item, start: "top 83%" });
        });
        gsap.from(q(".problem-rule"), {
          scaleX: 0, transformOrigin: "left center", ease: "none", stagger: 0.35,
          scrollTrigger: { trigger: q(".problem-list")[0], start: "top 82%", end: "bottom 65%", scrub: 0.5 },
        });

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
    <div className="coaches-page" ref={root}>
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
          <a href="#problem">The problem</a>
          <a href="#services">Services</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="nav-cta magnetic" href="#contact">Book a call</a>
        <div className="nav-progress" aria-hidden="true"><span /></div>
      </header>

      <main>
        <section className="hero" id="top">
          <h1 className="hero-heading">
            <span className="hero-l1">Fill your calendar.</span>
            <span className="hero-l2">Not your inbox.</span>
          </h1>

          <div className="hero-rule" aria-hidden="true" />

          <div className="hero-foot">
            <p className="hero-sub">
              A website that ranks, a social presence that keeps posting, and
              outreach that lands discovery calls — so growing your coaching
              business stops depending on referrals alone.
            </p>
            <div className="hero-actions">
              <a className="btn btn-solid magnetic" href="#plans">See the plans</a>
              <a className="btn btn-ghost" href="#services">How it works</a>
            </div>
          </div>
        </section>

        <section className="problem" id="problem" aria-labelledby="problem-title">
          <div className="section-head">
            <h2 id="problem-title">This will sound familiar</h2>
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
            <h2 id="services-title">Built to fill your calendar</h2>
            <p>Three pieces that work together — pick one, or run all three.</p>
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
            Illustrative timeline — exact pace depends on your niche, offer
            price and existing audience.
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
            <h2 id="faq-title">Questions coaches ask us</h2>
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
          <h2 id="contact-title">Ready to stop chasing referrals?</h2>
          <a className="btn btn-solid btn-lg magnetic" href="mailto:hello@zarrar.com">
            Say hello
          </a>
          <p className="closing-alt">
            Not a coach? <a href="/#who">See who else we work with</a>
          </p>
        </section>
      </main>
    </div>
  );
}

export default Coaches;