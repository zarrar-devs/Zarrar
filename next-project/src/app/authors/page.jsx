"use client";

/* =============================================================
   Zarrar — /for-authors
   -------------------------------------------------------------
   Black-and-white "editor's desk" theme: white background, ink
   type, Fraunces + Inter, chapters instead of service cards,
   editions instead of plans. Three services only — web
   development, lead generation + outreach, social media
   management. The proof strip and genre list are placeholder /
   example content and MUST be swapped for the real author's own
   before this goes live. Never list a real publication/press
   mention here unless it's genuine — fabricated review quotes
   are a quick way to lose the exact press credibility this page
   is trying to build.

   ⚠️ SEO: metadata (and the separate viewport export) CANNOT be
   exported from a "use client" file. Put both into the route's
   page.js / layout.js (server component). The full, up-to-date
   object ships separately as authors-metadata.js — copy it in
   as-is and just fill in the bracketed placeholders (domain, OG
   image, social links).
   ============================================================= */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./authors.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ---------------- Icons (decorative — hidden from AT) ---------------- */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
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

/* Placeholder — swap for real reviews/mentions only. Don't ship
   with bracketed names, and never credit a quote to a publication
   that hasn't actually said it. */
const PRAISE = [
  {
    quote: "A voice that stays with you long after the last page.",
    source: "[Publication Name]",
  },
  {
    quote: "One of the most assured debuts of the year.",
    source: "[Bestseller List / Critic Name]",
  },
  {
    quote: "Exactly the kind of book you press into a friend's hands.",
    source: "[Podcast / Reviewer Name]",
  },
];

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
    body: "We build the list of literary agents, podcast hosts, bookshops and press already covering your genre, then run the cold outreach and follow-up that turns that list into replies and bookings.",
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
    body: "Press mentions and reader replies start layering on top of outreach, and the site keeps climbing in search while social keeps you visible.",
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
    a: "Ranking takes ongoing work, not a one-time setup, but every site we build starts with clean semantic markup, fast performance, a proper sitemap and structured data for your books and bio, which is the technical foundation search engines need before content and links can do the rest.",
  },
  {
    q: "Can lead generation and outreach really get me agents, press and podcast bookings?",
    a: "That's the point of the service — we research and build the list of agents, program hosts, bookshops and reviewers already covering your genre, then send the outreach and follow-up that gets you onto their calendar.",
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
      "On-page SEO, structured data and Google Business setup",
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
    id: "collectors",
    name: "Collector's Edition",
    line: "For selling more books.",
    body: "The full engine. We build the presence, keep it visible, then go get the readers and the press.",
    includes: [
      "Everything in Hardcover",
      "Lead generation: a built list of agents, press and podcasts in your genre",
      "Cold outreach campaigns and follow-up, run on your behalf",
      "Booked interviews and pitches tracked in your calendar",
    ],
    featured: true,
  },
];

/* Structured data */
const JSON_LD_SERVICE = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://zarrar.com/for-authors#service",
  name: "Zarrar — Websites, Lead Generation & Social Media for Authors",
  description:
    "Premium website development, lead generation and outreach, and social media management for authors and writers.",
  url: "https://zarrar.com/for-authors",
  areaServed: "Worldwide",
  audience: { "@type": "Audience", audienceType: "Authors" },
  provider: { "@type": "Organization", name: "Zarrar", url: "https://zarrar.com" },
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
    { "@type": "ListItem", position: 1, name: "Home", item: "https://zarrar.com/" },
    { "@type": "ListItem", position: 2, name: "For Authors", item: "https://zarrar.com/for-authors" },
  ],
};

/* ---------------- Component ---------------- */

function Authors() {
  const root = useRef(null);
  const [openFAQ, setOpenFAQ] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Close the mobile menu on Escape or an outside click, and lock
     background scroll while it's open. */
  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (e) => {
      if (!e.target.closest(".nav")) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  useIsoLayoutEffect(() => {
    const splits = [];
    let lenis;
    const node = root.current;

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

    /* Same-page nav links (#genres, #chapters, ...) should glide
       to their target instead of jumping — route the scroll
       through Lenis when it's running so it stays in sync with
       the rest of the page's scroll animation, and fall back to
       native smooth scrolling otherwise. Also closes the mobile
       menu after any in-page navigation. */
    const handleAnchorClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (lenis && !reduceMotion) {
        lenis.scrollTo(target, { offset: -80, duration: 1.3 });
      } else {
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
      window.history.pushState(null, "", hash);
      setMenuOpen(false);
    };
    node?.addEventListener("click", handleAnchorClick);

    const ctx = gsap.context((self) => {
      const q = self.selector;

      /* Ink-fill: lines grow in from the left edge, like a line
         being written, rather than dropping/flipping into place. */
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

      /* Page-turn: the recurring physical motif for every card,
         chapter row and edition — like opening to that page. */
      const pageTurn = (elements, opts = {}) => {
        if (!elements || (elements.length === 0)) return gsap.timeline();
        gsap.set(opts.container || elements, { transformPerspective: 1400 });
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

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q(".nav-progress span"), { scaleX: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---- one orchestrated load sequence ---- */
        const shelf = q(".spine");
        gsap.timeline({ defaults: { ease: "expo.out" } })
          .from(q(".logo, .nav-links a, .nav-cta, .nav-toggle"), {
            y: -18, opacity: 0, duration: 0.7, stagger: 0.05,
          })
          .add(inkIn(q(".hero-l1")[0]), 0.1)
          .add(inkIn(q(".hero-l2")[0]), 0.28)
          .add(wordsUp(q(".hero-sub")[0]), 0.55)
          .from(q(".hero-actions > *"), { y: 20, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.7)
          .from(shelf, {
            xPercent: 40, opacity: 0, rotate: -6, duration: 1,
            stagger: { each: 0.06, from: "end" },
          }, 0.35);

        /* ---- scroll progress, styled as a bookmark ribbon ---- */
        gsap.to(q(".nav-progress span"), {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.3 },
        });

        /* ---- hero settles back as you leave it ---- */
        gsap.to(q(".hero-copy"), {
          yPercent: -10, opacity: 0.3, ease: "none",
          scrollTrigger: { trigger: q(".hero")[0], start: "top top", end: "bottom top", scrub: 0.6 },
        });

        /* ---- praise strip ---- */
        gsap.from(q(".praise-inner > *"), {
          y: 14, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.08,
          scrollTrigger: { trigger: q(".praise")[0], start: "top 88%", once: true },
        });

        /* ---- section heads ---- */
        q(".section-head").forEach((head) => {
          inkIn(head.querySelector("h2"), { trigger: head, start: "top 82%" });
          wordsUp(head.querySelector("p"), { trigger: head, start: "top 80%" });
        });

        /* ---- genres: page-turn cards ---- */
        pageTurn(q(".card"), { trigger: q(".genres-grid")[0], container: q(".genres-grid")[0] });

        /* ---- chapters: page-turn rows + drawn icons ---- */
        pageTurn(q(".chapter"), { trigger: q(".chapters-list")[0], container: q(".chapters-list")[0], stagger: 0.12 });
        q(".chapter").forEach((row) => drawIcon(row.querySelector("svg"), row));

        /* ---- timeline ---- */
        gsap.from(q(".timeline-step"), {
          y: 40, opacity: 0, duration: 0.85, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: q(".timeline-list")[0], start: "top 82%", once: true },
        });

        /* ---- editions: page-turn + includes stagger ---- */
        pageTurn(q(".edition"), { trigger: q(".editions-grid")[0], container: q(".editions-grid")[0], stagger: 0.1 });
        q(".edition").forEach((ed) => {
          gsap.from(ed.querySelectorAll(".edition-includes li"), {
            y: 12, opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.05,
            scrollTrigger: { trigger: ed, start: "top 70%", once: true },
          });
        });

        /* ---- FAQ rows ---- */
        gsap.from(q(".faq-item"), {
          y: 22, opacity: 0, duration: 0.65, ease: "power3.out", stagger: 0.06,
          scrollTrigger: { trigger: q(".faq-list")[0], start: "top 82%", once: true },
        });

        /* ---- closing ---- */
        const close = q(".closing")[0];
        if (close) {
          gsap.timeline({ scrollTrigger: { trigger: close, start: "top 82%", once: true } })
            .add(inkIn(close.querySelector("h2")))
            .from(close.querySelector(".btn"), { y: 24, opacity: 0, duration: 0.6, ease: "back.out(1.6)" }, "-=0.4")
            .from(close.querySelector(".closing-links"), { opacity: 0, duration: 0.5 }, "-=0.2");
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
            xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.34);
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
      node?.removeEventListener("click", handleAnchorClick);
      lenis?.destroy();
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <div className="authors-page" ref={root}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SERVICE) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_FAQ) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_BREADCRUMB) }}
      />

      <header className="nav">
        <a className="logo" href="/">Zarrar</a>
        <nav
          className={`nav-links${menuOpen ? " is-open" : ""}`}
          id="primary-navigation"
          aria-label="Sections"
        >
          <a href="#genres">Genres</a>
          <a href="#chapters">Services</a>
          <a href="#editions">Editions</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="nav-right">
          <a className="nav-cta magnetic" href="#contact">Book a call</a>
          <button
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

      <main>
        <section className="hero" id="top">
          <div className="hero-copy">
            <h1 className="hero-heading">
              <span className="hero-l1">You wrote the book.</span>
              <span className="hero-l2">We build its audience.</span>
            </h1>
            <p className="hero-sub">
              A premium author website that sells the book on sight, lead
              generation and outreach that land you agents, press and
              podcasts, and social media management that keeps readers
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

        <section className="praise" id="praise" aria-label="Example praise strip">
          <div className="praise-inner">
            {PRAISE.map((p) => (
              <blockquote className="praise-quote" key={p.quote}>
                &ldquo;{p.quote}&rdquo;
                <span className="praise-source">{p.source}</span>
              </blockquote>
            ))}
            <p className="praise-note">
              Example layout — only real reviews and mentions go here.
            </p>
          </div>
        </section>

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
          <p className="genres-note">
            Example categories — trim or rewrite to match your real body of work.
          </p>
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
            <p>A rough shape of how the pieces come online, in order.</p>
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
          <p className="timeline-note">
            Illustrative timeline — exact pace depends on your genre and release calendar.
          </p>
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
                    <span className="faq-mark" aria-hidden="true">+</span>
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
          <h2 id="contact-title">Ready to sell more books?</h2>
          <a className="btn btn-solid btn-lg magnetic" href="mailto:hello@zarrar.com">
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
