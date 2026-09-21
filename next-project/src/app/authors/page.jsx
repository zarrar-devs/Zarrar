"use client";

/* =============================================================
   Zarrar — /for-authors
   -------------------------------------------------------------
   Black-and-white "editor's desk" theme: white background, ink
   type, Fraunces + Inter, chapters instead of service cards,
   editions instead of plans. Three services only — web
   development, lead generation + outreach, social media
   management.

   TRUST SECTION (important)
   -------------------------------------------------------------
   The old fake-praise strip is gone. It is replaced by:
     1. PROMISES     — factual statements about how the work is
                       done. Only keep the ones that are true for
                       your business.
     2. TESTIMONIALS — starts EMPTY. The section only renders once
                       you add a real quote from a real person
                       (with their permission). Nothing is shown
                       and no fake content ever ships by default.
   No Review / AggregateRating markup is generated: Google ignores
   self-serving reviews on your own site for Organization /
   ProfessionalService, and fake markup can trigger a manual
   action. Real testimonials are shown visibly on the page only.

   GENRES is still example content — trim or rewrite it to match
   the real body of work before going live.

   ⚠️ SEO: metadata (and the separate viewport export) CANNOT be
   exported from a "use client" file. Put both into the route's
   page.js / layout.js (server component). The full object ships
   separately as authors-metadata.js — copy it in as-is and fill
   in the bracketed placeholders (domain, OG image, social links).

   New CSS classes used here are in authors-additions.css —
   append that to authors.css.
   ============================================================= */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./authors.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ---------------- Site constants ---------------- */

const SITE_URL = "https://zarrar.com";
const PAGE_URL = `${SITE_URL}/for-authors`;
const CONTACT_EMAIL = "hello@zarrar.com";

/* ---------------- Icons (decorative — hidden from AT) ---------------- */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  focusable: "false",
  "aria-hidden": "true",
};

function BookIcon() {
  return (
    <svg viewBox="0 0 40 40" {...stroke}>
      <path className="draw" d="M20 10c-3-3-8-4-14-3v22c6-1 11 0 14 3 3-3 8-4 14-3V7c-6-1-11 0-14 3z" />
      <path className="draw" d="M20 10v22" />
    </svg>
  );
}

function OutreachIcon() {
  return (
    <svg viewBox="0 0 40 40" {...stroke}>
      <path className="draw" d="M5 20L34 8l-5 25-9-8-7 7v-9z" />
      <path className="draw" d="M15 23L34 8" />
    </svg>
  );
}

function SocialIcon() {
  return (
    <svg viewBox="0 0 40 40" {...stroke}>
      <circle className="draw" cx="10" cy="12" r="4" />
      <circle className="draw" cx="30" cy="10" r="4" />
      <circle className="draw" cx="20" cy="30" r="4" />
      <path className="draw" d="M14 14l10 14" />
      <path className="draw" d="M13 11l13 -1" />
      <path className="draw" d="M27 13l-4 13" />
    </svg>
  );
}

/* =====================  PERSONA-SPECIFIC CONTENT  ===================== */

/* Factual statements about how the work is done — every line below
   is something the packages actually include. Delete any line that
   stops being true. */
const PROMISES = [
  {
    title: "Custom-coded",
    line: "Every site is designed and built from scratch, not dropped into a template.",
  },
  {
    title: "Search-ready",
    line: "Clean markup, a sitemap and structured data are in place from launch day.",
  },
  {
    title: "Researched outreach",
    line: "Pitches go to agents, hosts and reviewers who already cover your genre.",
  },
  {
    title: "Handed over properly",
    line: "You get training so you can edit your own site without calling a developer.",
  },
];

/* Add REAL testimonials here, with permission. While this array is
   empty the whole section is skipped. Example shape:
   { quote: "…", name: "Real Name", role: "Author of Title", url: "https://…" } */
const TESTIMONIALS = [];

/* Example author categories — replace or trim to match the
   real author's actual genre and body of work. */
const GENRES = [
  { title: "Fiction & novelists", line: "A site that sells the story before the sample chapter does." },
  { title: "Nonfiction & memoir", line: "Credibility and a clear pitch, ready for press and podcasts." },
  { title: "Self-published authors", line: "Everything a publisher would handle, minus the publisher." },
  { title: "Poets & essayists", line: "A home for the work between magazine credits and readings." },
  { title: "Ghostwriters & co-authors", line: "A portfolio that lets the work speak without naming names." },
  { title: "Nonfiction experts", line: "Turn a body of expertise into speaking, media and book deals." },
];

/* Three services only: premium website development, lead
   generation + outreach, and social media management. */
const CHAPTERS = [
  {
    numeral: "I",
    title: "Premium website development",
    body: "A custom-built author site, not a template — synopsis, reviews, buy links, events and a press kit, designed and coded to sell the book and to rank for your name and your genre.",
    cta: "Build my site",
    icon: <BookIcon />,
  },
  {
    numeral: "II",
    title: "Lead generation & outreach",
    body: "We build the list of literary agents, podcast hosts, bookshops and press already covering your genre, then run the cold outreach and follow-up that turns that list into conversations and bookings.",
    cta: "Get me covered",
    icon: <OutreachIcon />,
  },
  {
    numeral: "III",
    title: "Social media management",
    body: "Content planned and posted from your writing, readings and reviews, plus replies handled day to day — so you stay visible between book launches without doing the posting yourself.",
    cta: "Run my socials",
    icon: <SocialIcon />,
  },
];

const TIMELINE = [
  {
    when: "Weeks 1–2",
    title: "Foundation",
    body: "Author website live with book pages, press kit and on-page SEO in place; an outreach list of agents, bookshops and press built.",
  },
  {
    when: "Weeks 3–6",
    title: "Outreach + content",
    body: "Pitches to podcasts, bookshops and reviewers go out on schedule; social content starts posting from your backlist, readings and reviews.",
  },
  {
    when: "Weeks 7–12",
    title: "Momentum",
    body: "Replies from outreach start to build up, the site keeps gaining ground in search, and social keeps you visible between releases.",
  },
];

const FAQS = [
  {
    q: "Do I need an author website if my books are already listed on Amazon?",
    a: "Amazon sells the book you already have. A site sells you — synopsis, reviews, backlist, press kit and the SEO that gets you found — for the agents, press and readers deciding whether to follow your next one.",
  },
  {
    q: "What's actually included in a premium author website?",
    a: "A custom design (not a template), book pages with buy links and reviews, a short bio and photo press can use, a press kit, and the on-page SEO — page titles, structured data, fast load times — that lets people searching for a writer in your genre actually land on you.",
  },
  {
    q: "Will my author website actually show up in Google search?",
    a: "Ranking takes ongoing work, not a one-time setup, and nobody can promise a position. What we do guarantee is the technical foundation: clean semantic markup, fast performance, a proper sitemap and structured data for your books and bio. Content and links then build on top of that.",
  },
  {
    q: "Can lead generation and outreach really get me agents, press and podcast bookings?",
    a: "We research and build the list of agents, hosts, bookshops and reviewers already covering your genre, then send the outreach and follow-up. Whether someone says yes depends on your book and timing, so we can't promise placements, but you'll have a real, targeted list in front of the right people instead of hoping to be discovered.",
  },
  {
    q: "Do you actually manage my social media, or just tell me what to post?",
    a: "We handle it day to day — planning the content calendar, writing and posting from your work and reviews, and responding to comments and messages, so it runs without needing your time.",
  },
  {
    q: "How long before I see results?",
    a: "The website is usually ready within the first couple of weeks. Outreach replies and social growth typically build over the following weeks once campaigns are running — timing depends on your genre and release calendar.",
  },
];

/* =====================  SHARED / STRUCTURAL  ===================== */

const EDITIONS = [
  {
    id: "paperback",
    name: "Paperback",
    line: "For getting found.",
    body: "You've got the book, but no real home for it online. We design and build one, SEO included.",
    includes: [
      "Premium author website, custom-designed and built from scratch",
      "Book pages with buy links, reviews and press kit",
      "On-page SEO, structured data and Google Search Console setup",
      "Handover and training so you can edit it",
    ],
  },
  {
    id: "hardcover",
    name: "Hardcover",
    line: "For staying visible.",
    body: "Everything in Paperback, plus a social media presence that runs without you.",
    includes: [
      "Everything in Paperback",
      "Social media management — content, posting and replies",
      "Custom email domain (you@yourname.com)",
      "Quarterly SEO check-in as your backlist grows",
    ],
  },
  {
    id: "reborn",
    name: "Reborn",
    line: "For selling more books.",
    body: "The full engine. We build the presence, keep it visible, then go after the readers and the press.",
    includes: [
      "Everything in Hardcover",
      "Lead generation: a built list of agents, press and podcasts in your genre",
      "Cold outreach campaigns and follow-up, run on your behalf",
      "Interviews and pitches tracked in one shared calendar",
    ],
    featured: true,
  },
];

/* ---------------- Structured data ---------------- */

/* Escape "<" so content can never close the <script> tag early. */
const ld = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

const JSON_LD_SERVICE = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${PAGE_URL}#service`,
  name: "Zarrar — Websites, Lead Generation & Social Media for Authors",
  description:
    "Premium website development, lead generation and outreach, and social media management for authors and writers.",
  url: PAGE_URL,
  areaServed: "Worldwide",
  audience: { "@type": "Audience", audienceType: "Authors" },
  provider: { "@type": "Organization", name: "Zarrar", url: SITE_URL },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: CHAPTERS.map((c) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: c.title, description: c.body },
    })),
  },
  makesOffer: EDITIONS.map((e) => ({
    "@type": "Offer",
    name: e.name,
    description: `${e.body} Includes: ${e.includes.join("; ")}.`,
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

const JSON_LD_BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "For Authors", item: PAGE_URL },
  ],
};

const JSON_LD_BLOCKS = [JSON_LD_SERVICE, JSON_LD_FAQ, JSON_LD_BREADCRUMB];

/* ---------------- Helpers ---------------- */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- Component ---------------- */

function Authors() {
  const root = useRef(null);
  const lenisRef = useRef(null);
  const toggleRef = useRef(null);
  const [openFAQ, setOpenFAQ] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Mobile menu: close on Escape (and return focus to the toggle)
     or outside click, lock background scroll while open. */
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenisRef.current?.stop();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (e) => {
      if (!e.target.closest(".nav")) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      lenisRef.current?.start();
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  useIsoLayoutEffect(() => {
    const splits = [];
    const node = root.current;
    let cancelled = false;
    let tickerFn = null;
    let mm = null;

    /* ---- smooth scroll (Lenis), fully cleaned up on unmount ---- */
    const startSmooth = async () => {
      if (prefersReducedMotion()) return;
      try {
        const { default: Lenis } = await import("lenis");
        if (cancelled) return;
        const instance = new Lenis({ duration: 1.1, smoothWheel: true });
        lenisRef.current = instance;
        instance.on("scroll", ScrollTrigger.update);
        tickerFn = (t) => instance.raf(t * 1000);
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);
      } catch {
        /* native scroll is fine */
      }
    };
    startSmooth();

    /* Same-page nav links glide to their target. Goes through Lenis
       when it's running, native smooth scroll otherwise. Moves focus
       to the target so keyboard and screen-reader users land there,
       and closes the mobile menu. */
    const handleAnchorClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      let target = null;
      try {
        target = document.querySelector(hash);
      } catch {
        return;
      }
      if (!target) return;

      e.preventDefault();
      const reduce = prefersReducedMotion();
      const lenis = lenisRef.current;

      if (lenis && !reduce) {
        lenis.scrollTo(target, { offset: -80, duration: 1.3 });
      } else {
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }

      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });

      window.history.pushState(null, "", hash);
      setMenuOpen(false);
    };
    node?.addEventListener("click", handleAnchorClick);

    const ctx = gsap.context((self) => {
      const q = self.selector;

      /* Ink-fill: lines grow in from the left edge, like a line
         being written. */
      const inkIn = (el, opts = {}) => {
        if (!el) return gsap.timeline();
        const split = SplitText.create(el, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
          aria: "auto",
        });
        splits.push(split);
        gsap.set(split.lines, { transformOrigin: "0% 50%" });
        return gsap.from(split.lines, {
          scaleX: 0,
          duration: 0.95,
          ease: "power4.inOut",
          stagger: 0.12,
          onComplete: () => gsap.set(split.lines, { clearProps: "willChange" }),
          scrollTrigger: opts.trigger
            ? { trigger: opts.trigger, start: opts.start || "top 82%", once: true }
            : undefined,
        });
      };

      /* Soft focus-pull: words rise and sharpen out of a blur,
         used for supporting copy rather than headlines. */
      const wordsUp = (el, opts = {}) => {
        if (!el) return gsap.timeline();
        const split = SplitText.create(el, {
          type: "lines,words",
          linesClass: "line",
          wordsClass: "word",
          mask: "lines",
          aria: "auto",
        });
        splits.push(split);
        return gsap.from(split.words, {
          yPercent: 120,
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.015,
          scrollTrigger: opts.trigger
            ? { trigger: opts.trigger, start: opts.start || "top 85%", once: true }
            : undefined,
        });
      };

      /* Page-turn: the recurring physical motif for chapter rows and
         editions — like opening to that page. Perspective is set on
         each element so every card rotates in its own 3D space. */
      const pageTurn = (elements, opts = {}) => {
        if (!elements || elements.length === 0) return gsap.timeline();
        gsap.set(elements, { transformPerspective: 1400 });
        return gsap.from(elements, {
          rotateY: -62,
          opacity: 0,
          transformOrigin: "0% 50%",
          duration: 1,
          ease: "power3.out",
          stagger: opts.stagger ?? 0.09,
          scrollTrigger: {
            trigger: opts.trigger,
            start: opts.start || "top 82%",
            once: true,
          },
        });
      };

      const drawIcon = (svg, trigger) => {
        if (!svg) return;
        const strokes = svg.querySelectorAll(".draw");
        strokes.forEach((s) => {
          const len = s.getTotalLength ? s.getTotalLength() : 160;
          gsap.set(s, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.to(strokes, {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: { trigger, start: "top 80%", once: true },
        });
      };

      mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q(".nav-progress span"), { scaleX: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---- one orchestrated load sequence ---- */
        const shelf = q(".spine");
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(q(".logo, .nav-links a, .nav-cta, .nav-toggle"), {
            y: -18,
            opacity: 0,
            duration: 0.7,
            stagger: 0.05,
          })
          .add(inkIn(q(".hero-l1")[0]), 0.1)
          .add(inkIn(q(".hero-l2")[0]), 0.28)
          .add(wordsUp(q(".hero-sub")[0]), 0.55)
          .from(q(".hero-actions > *"), { y: 20, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.7)
          .from(
            shelf,
            {
              xPercent: 40,
              opacity: 0,
              rotate: -6,
              duration: 1,
              stagger: { each: 0.06, from: "end" },
            },
            0.35
          );

        /* ---- scroll progress, styled as a bookmark ribbon ---- */
        gsap.to(q(".nav-progress span"), {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: node, start: "top top", end: "bottom bottom", scrub: 0.3 },
        });

        /* ---- hero settles back as you leave it ---- */
        gsap.to(q(".hero-copy"), {
          yPercent: -10,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: { trigger: q(".hero")[0], start: "top top", end: "bottom top", scrub: 0.6 },
        });

        /* ---- how-we-work strip ---- */
        gsap.from(q(".praise-inner > *"), {
          y: 14,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: q(".praise")[0], start: "top 88%", once: true },
        });

        /* ---- real testimonials (only present if you add some) ---- */
        const testimonials = q(".testimonial");
        if (testimonials.length) {
          gsap.from(testimonials, {
            y: 20,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: q(".testimonials")[0], start: "top 82%", once: true },
          });
        }

        /* ---- section heads ---- */
        q(".section-head").forEach((head) => {
          inkIn(head.querySelector("h2"), { trigger: head, start: "top 82%" });
          wordsUp(head.querySelector("p"), { trigger: head, start: "top 80%" });
        });

        /* ---- genres ---- */
        pageTurn(q(".card"), { trigger: q(".genres-grid")[0] });

        /* ---- chapters: page-turn rows + drawn icons ---- */
        pageTurn(q(".chapter"), { trigger: q(".chapters-list")[0], stagger: 0.12 });
        q(".chapter").forEach((row) => drawIcon(row.querySelector("svg"), row));

        /* ---- timeline ---- */
        gsap.from(q(".timeline-step"), {
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: q(".timeline-list")[0], start: "top 82%", once: true },
        });

        /* ---- editions: page-turn + includes stagger ---- */
        pageTurn(q(".edition"), { trigger: q(".editions-grid")[0], stagger: 0.1 });
        q(".edition").forEach((ed) => {
          gsap.from(ed.querySelectorAll(".edition-includes li"), {
            y: 12,
            opacity: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.05,
            scrollTrigger: { trigger: ed, start: "top 70%", once: true },
          });
        });

        /* ---- FAQ rows ---- */
        gsap.from(q(".faq-item"), {
          y: 22,
          opacity: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: q(".faq-list")[0], start: "top 82%", once: true },
        });

        /* ---- closing ---- */
        const close = q(".closing")[0];
        if (close) {
          gsap
            .timeline({ scrollTrigger: { trigger: close, start: "top 82%", once: true } })
            .add(inkIn(close.querySelector("h2")))
            .from(close.querySelector(".btn"), { y: 24, opacity: 0, duration: 0.6, ease: "back.out(1.6)" }, "-=0.4")
            .from(close.querySelector(".closing-links"), { opacity: 0, duration: 0.5 }, "-=0.2");
        }
      });

      /* ---- magnetic buttons (fine pointers only) ---- */
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const cleanups = [];
        q(".magnetic").forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
          const move = (e) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.34);
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
    }, root);

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    }

    return () => {
      cancelled = true;
      node?.removeEventListener("click", handleAnchorClick);

      mm?.revert();
      ctx.revert();
      splits.forEach((s) => s.revert());

      if (tickerFn) gsap.ticker.remove(tickerFn);
      gsap.ticker.lagSmoothing(500, 33);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <div className="authors-page" ref={root}>
      {JSON_LD_BLOCKS.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: ld(block) }}
        />
      ))}

      <a className="skip-link" href="#main">Skip to content</a>

      <header className="nav">
        <a className="logo" href="/">Zarrar</a>
        <nav
          className={`nav-links${menuOpen ? " is-open" : ""}`}
          id="primary-navigation"
          aria-label="Sections"
        >
          <a href="#genres">Genres</a>
          <a href="#chapters">Services</a>
          <a href="#how">Process</a>
          <a href="#editions">Editions</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="nav-right">
          <a className="nav-cta magnetic" href="#contact">Contact</a>
          <button
            ref={toggleRef}
            type="button"
            className="nav-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="nav-toggle-bar" aria-hidden="true" />
            <span className="nav-toggle-bar" aria-hidden="true" />
            <span className="nav-toggle-bar" aria-hidden="true" />
          </button>
        </div>
        <div className="nav-progress" aria-hidden="true"><span /></div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <h1 className="hero-heading">
              <span className="hero-l1">You wrote the book.</span>{" "}
              <span className="hero-l2">We build its audience.</span>
            </h1>
            <p className="hero-sub">
              A premium author website that sells the book on sight, lead
              generation and outreach that put you in front of agents, press
              and podcasts, and social media management that keeps readers
              coming back for the next one.
            </p>
            <div className="hero-actions">
              <a className="btn btn-solid magnetic" href="#editions">See the editions</a>
              <a className="btn btn-ghost" href="#chapters">How it works</a>
            </div>
          </div>

          <div className="hero-shelf" aria-hidden="true">
            <span className="spine" />
            <span className="spine" />
            <span className="spine" />
            <span className="spine" />
            <span className="spine" />
            <span className="spine" />
            <span className="spine" />
          </div>
        </section>

        {/* Factual "how we work" strip — replaces the old fake praise. */}
        <section className="praise" id="praise" aria-label="How we work">
          <ul className="praise-inner">
            {PROMISES.map((p) => (
              <li className="praise-quote" key={p.title}>
                <strong>{p.title}</strong>
                <span className="praise-source">{p.line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Renders only once you add real testimonials above. */}
        {TESTIMONIALS.length > 0 && (
          <section className="testimonials" id="testimonials" aria-labelledby="testimonials-title">
            <div className="section-head">
              <h2 id="testimonials-title">What authors say</h2>
            </div>
            <div className="testimonials-list">
              {TESTIMONIALS.map((t) => (
                <figure className="testimonial" key={`${t.name}-${t.quote.slice(0, 24)}`}>
                  <blockquote>
                    <p>&ldquo;{t.quote}&rdquo;</p>
                  </blockquote>
                  <figcaption>
                    {t.url ? (
                      <a href={t.url} rel="noopener noreferrer" target="_blank">{t.name}</a>
                    ) : (
                      t.name
                    )}
                    {t.role ? `, ${t.role}` : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="genres" id="genres" aria-labelledby="genres-title">
          <div className="section-head">
            <h2 id="genres-title">Built for every kind of author</h2>
            <p>Whatever you write, the site and outreach are built around it.</p>
          </div>

          <ul className="genres-grid">
            {GENRES.map((g) => (
              <li className="card" key={g.title}>
                <h3 className="card-title">{g.title}</h3>
                <p>{g.line}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="chapters" id="chapters" aria-labelledby="chapters-title">
          <div className="section-head">
            <h2 id="chapters-title">Three ways we get you read</h2>
            <p>Pick one chapter, or run the whole book.</p>
          </div>

          <div className="chapters-list">
            {CHAPTERS.map((c) => (
              <article className="chapter" key={c.title}>
                <span className="chapter-num" aria-hidden="true">{c.numeral}</span>
                <div className="chapter-head">
                  <span className="chapter-icon" aria-hidden="true">{c.icon}</span>
                  <h3 className="chapter-title">{c.title}</h3>
                </div>
                <p>{c.body}</p>
                <a className="btn btn-outline" href="#contact">{c.cta}</a>
              </article>
            ))}
          </div>
        </section>

        <section className="timeline" id="how" aria-labelledby="timeline-title">
          <div className="section-head">
            <h2 id="timeline-title">What the first 90 days look like</h2>
            <p>The rough order the pieces come online. Exact pace depends on your genre and release calendar.</p>
          </div>

          <ol className="timeline-list">
            {TIMELINE.map((s) => (
              <li className="timeline-step" key={s.title}>
                <span className="timeline-when">{s.when}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="editions" id="editions" aria-labelledby="editions-title">
          <div className="section-head">
            <h2 id="editions-title">Pick an edition</h2>
            <p>Each one builds on the last. Move up whenever you&apos;re ready.</p>
          </div>

          <div className="editions-grid">
            {EDITIONS.map((e) => (
              <article className={`edition${e.featured ? " is-featured" : ""}`} key={e.id}>
                {e.featured && <span className="edition-flag">Most complete</span>}
                <h3 className="edition-name">{e.name}</h3>
                <p className="edition-line">{e.line}</p>
                <p className="edition-body">{e.body}</p>
                <ul className="edition-includes">
                  {e.includes.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <a
                  className={`btn ${e.featured ? "btn-invert" : "btn-outline"}`}
                  href="#contact"
                >
                  Start with {e.name}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="faq" id="faq" aria-labelledby="faq-title">
          <div className="section-head">
            <h2 id="faq-title">Questions authors ask us</h2>
            <p>If yours isn&apos;t here, ask us directly.</p>
          </div>

          <div className="faq-list">
            {FAQS.map((f, i) => {
              const isOpen = openFAQ === i;
              const qId = `faq-q-${i}`;
              const aId = `faq-a-${i}`;
              return (
                <div className={`faq-item${isOpen ? " is-open" : ""}`} key={f.q}>
                  <h3 className="faq-heading">
                    <button
                      type="button"
                      className="faq-q"
                      id={qId}
                      aria-expanded={isOpen}
                      aria-controls={aId}
                      onClick={() => setOpenFAQ(isOpen ? -1 : i)}
                    >
                      <span>{f.q}</span>
                      <span className="faq-mark" aria-hidden="true">+</span>
                    </button>
                  </h3>
                  <div
                    className="faq-a"
                    id={aId}
                    role="region"
                    aria-labelledby={qId}
                    aria-hidden={!isOpen}
                  >
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
          <h2 id="contact-title">Ready to sell more books?</h2>
          <a className="btn btn-solid btn-lg magnetic" href={`mailto:${CONTACT_EMAIL}`}>
            Say hello
          </a>
          <p className="closing-links">
            <span className="closing-alt">Not an author? <a href="/#who">See who else we work with</a></span>
            <span className="closing-alt"><a href="/for-speakers">See our page for speakers</a></span>
          </p>
        </section>
      </main>
    </div>
  );
}

export default Authors;