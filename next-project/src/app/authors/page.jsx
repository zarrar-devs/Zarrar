"use client";

/* =============================================================
   Zarrar — /for-authors
   -------------------------------------------------------------
   Sibling to /for-speakers, but a different room entirely: dark
   "editor's desk" theme, Newsreader + IBM Plex Sans, chapters
   instead of service cards, editions instead of plans. The proof
   strip, genres and chapter copy are placeholder/example content
   and MUST be swapped for the real author's own before this goes
   live. Never list a real publication/press mention here unless
   it's genuine.

   SEO note: put this in the route's page.js / layout.js, not here
   (metadata can't be exported from a "use client" file):

   export const metadata = {
     title: "Websites, Reader Growth & Press Outreach for Authors | Zarrar",
     description:
       "We build the author site that sells the book, run the email and social that keep readers coming back, and pitch you to the agents, press and podcasts covering your genre.",
     alternates: { canonical: "https://zarrar.com/for-authors" },
     openGraph: {
       title: "You wrote the book. We build its audience. | Zarrar for Authors",
       description:
         "Websites, email marketing, social media management and press outreach for authors and writers.",
       url: "https://zarrar.com/for-authors",
       type: "website",
     },
   };
   ============================================================= */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./Authors.css";

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

function MailIcon() {
  return (
    <svg viewBox="0 0 40 40" {...stroke}>
      <rect className="draw" x="4" y="9" width="32" height="22" rx="2" />
      <path className="draw" d="M5 11l15 12 15-12" />
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

const CHAPTERS = [
  {
    numeral: "I",
    title: "Website & portfolio development",
    body: "An author site built to sell the book — synopsis, reviews, buy links, events and a press kit, all in one polished, award-ready site.",
    cta: "Build my site",
    icon: <BookIcon />,
  },
  {
    numeral: "II",
    title: "Lead generation & cold outreach",
    body: "We find the literary agents, podcast hosts, bookshops and press already covering your genre, and send the outreach that gets you featured.",
    cta: "Get me covered",
    icon: <OutreachIcon />,
  },
  {
    numeral: "III",
    title: "Email marketing",
    body: "A reader newsletter that turns one-time buyers into people who pre-order the next book — written, designed and sent on schedule.",
    cta: "Grow my list",
    icon: <MailIcon />,
  },
  {
    numeral: "IV",
    title: "Social media management",
    body: "Content planned and posted from your writing, readings and reviews, so you stay visible in the gap between book launches.",
    cta: "Run my socials",
    icon: <SocialIcon />,
  },
];

const TIMELINE = [
  {
    when: "Weeks 1–2",
    title: "Foundation",
    body: "Author site live with book pages, press kit and newsletter signup in place; an outreach list of agents, bookshops and press built.",
  },
  {
    when: "Weeks 3–6",
    title: "Outreach + content",
    body: "Pitches to podcasts, bookshops and reviewers go out on schedule; the newsletter and social content start pulling from your backlist and reviews.",
  },
  {
    when: "Weeks 7–12",
    title: "Momentum",
    body: "Press mentions and reader replies start layering on top of outreach, and the newsletter keeps selling the backlist on its own.",
  },
];

const FAQS = [
  {
    q: "Do I need a website if my books are already listed on Amazon?",
    a: "Amazon sells the book you already have. A site sells you — synopsis, reviews, backlist, press kit and a way to join your list — for the agents, press and readers deciding whether to follow your next one.",
  },
  {
    q: "What should an author's website actually include?",
    a: "Clear book pages with buy links and reviews, a short bio and photo press can use, a press kit, a way to join your newsletter, and enough SEO that people searching for a writer in your genre actually land on you.",
  },
  {
    q: "Can you get me press and podcast bookings, not just a nice site?",
    a: "Yes — that's the outreach side. We find agents, program hosts, bookshops and reviewers already covering your genre and send the outreach and follow-up that gets you onto their list.",
  },
  {
    q: "Is email marketing worth it if I already post on social media?",
    a: "Social reach can disappear overnight when a platform changes its algorithm. A newsletter is a list you own — it's what actually moves backlist copies and pre-orders when the next book is ready.",
  },
  {
    q: "How long before I see results?",
    a: "The site and newsletter are usually ready within the first couple of weeks. Outreach replies and press mentions typically start in the following weeks once campaigns are running — timing depends on your genre and the release calendar.",
  },
];

/* =====================  SHARED / STRUCTURAL  ===================== */

const EDITIONS = [
  {
    id: "paperback",
    name: "Paperback",
    line: "For getting found.",
    body: "You've got the book, but no real home for it online. We build one.",
    includes: [
      "Custom author website, designed and built from scratch",
      "Book pages with buy links, reviews and press kit",
      "On-page SEO and Google Business setup",
      "Handover and training so you can edit it",
    ],
  },
  {
    id: "hardcover",
    name: "Hardcover",
    line: "For looking established.",
    body: "Everything in Paperback, plus the accounts that make you look like a working author, not a hobbyist.",
    includes: [
      "Everything in Paperback",
      "Reader newsletter, designed and set up",
      "Social media management, posting and replies",
      "Custom email domain (you@yourname.com)",
    ],
  },
  {
    id: "collectors",
    name: "Collector's Edition",
    line: "For selling more books.",
    body: "The full engine. We build the presence, then go get the readers and the press.",
    includes: [
      "Everything in Hardcover",
      "Cold outreach campaigns to agents, press and podcasts",
      "Lead generation and booked interviews in your calendar",
      "Ongoing email marketing calendar tied to your launches",
    ],
    featured: true,
  },
];

/* Structured data */
const JSON_LD_SERVICE = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Zarrar — Websites & Reader Growth for Authors",
  description:
    "Website development, email marketing, social media management and press outreach for authors and writers.",
  areaServed: "Worldwide",
  audience: { "@type": "Audience", audienceType: "Authors" },
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

/* ---------------- Component ---------------- */

function Authors() {
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
          .from(q(".logo, .nav-links a, .nav-cta"), {
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

      <header className="nav">
        <a className="logo" href="/">Zarrar</a>
        <nav className="nav-links" aria-label="Sections">
          <a href="#genres">Genres</a>
          <a href="#chapters">Services</a>
          <a href="#editions">Editions</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="nav-cta magnetic" href="#contact">Book a call</a>
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
              An author site that sells the book on sight, outreach that lands
              you agents, press and podcasts, and email and social that keep
              readers coming back for the next one.
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
            <h2 id="chapters-title">Four ways we get you read</h2>
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
                  className={`btn ${e.featured ? "btn-brass" : "btn-outline"}`}
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