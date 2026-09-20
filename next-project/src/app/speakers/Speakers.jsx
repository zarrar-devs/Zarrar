"use client";

/* =============================================================
   Zarrar — /for-speakers
   -------------------------------------------------------------
   Content + JSON-LD live in speakers-data.js.
   Metadata, fonts and the JSON-LD <script> live in page.js.
   This file is only the interactive UI.

   Needs: gsap (with SplitText, gsap >= 3.13) and, optionally, lenis
   (`npm i lenis`). Lenis is only loaded on desktop-class pointers.
   ============================================================= */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  AS_SEEN_AT,
  CONTACT_EMAIL,
  FAQS,
  PAGE_PARTS,
  PLANS,
  SERVICES,
  TIMELINE,
} from "./speakers-data";
import "./speakers.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const NAV_LINKS = [
  { href: "#speaker-page", label: "Speaker" },
  { href: "#services", label: "Services" },
  { href: "#plans", label: "Plans" },
  { href: "#faq", label: "FAQ" },
];

/* ---------------- Icons (decorative — hidden from AT) ---------------- */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  focusable: "false",
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

const ICONS = { web: WebIcon, outreach: OutreachIcon, social: SocialIcon };

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}

/* ---------------- Component ---------------- */

function Speakers() {
  const root = useRef(null);
  const [openFAQ, setOpenFAQ] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ---- mobile menu: Esc closes it, and it resets when the nav goes desktop ---- */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    const mq = window.matchMedia("(min-width: 720px)");
    const onMq = () => mq.matches && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [menuOpen]);

  /* ---- an open FAQ changes page height: re-measure scroll triggers ---- */
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 520);
    return () => clearTimeout(t);
  }, [openFAQ]);

  useIsoLayoutEffect(() => {
    const splits = [];
    let lenis = null;
    let raf = null;
    let cancelled = false;

    const reduceMotion = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = () =>
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    /* optional smooth scroll: desktop pointers only (phones keep native
       momentum scrolling, and we skip the JS). Needs `npm i lenis`. */
    const startSmooth = async () => {
      if (reduceMotion() || !finePointer()) return;
      try {
        const { default: Lenis } = await import("lenis");
        if (cancelled) return;
        lenis = new Lenis({ duration: 1.1, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        raf = (t) => lenis.raf(t * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
      } catch {
        /* native scroll is fine */
      }
    };
    startSmooth();

    /* in-page links (#faq, #plans ...) glide instead of jumping */
    const onAnchorClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;

      const id = a.getAttribute("href").slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;

      e.preventDefault();
      setMenuOpen(false);

      if (lenis && !reduceMotion()) {
        lenis.scrollTo(target, {
          offset: 0,
          duration: 1.4,
          easing: (t) => 1 - Math.pow(1 - t, 4),
        });
      } else {
        target.scrollIntoView({
          behavior: reduceMotion() ? "auto" : "smooth",
          block: "start",
        });
      }

      /* keyboard users land where they jumped (skip link -> <main>) */
      if (target.hasAttribute("tabindex")) target.focus({ preventScroll: true });

      history.pushState(null, "", `#${id}`);
    };

    const rootEl = root.current;
    rootEl?.addEventListener("click", onAnchorClick);

    const ctx = gsap.context((self) => {
      const q = self.selector;

      /* heavy 3D char flip: section headings on desktop only */
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
          /* put the plain text back: no stale spans after a resize */
          onComplete: () => split.revert(),
          scrollTrigger: opts.trigger
            ? { trigger: opts.trigger, start: opts.start || "top 80%", once: true }
            : undefined,
        });
      };

      /* masked line reveal, desktop only. Reverted when done so the text
         reflows normally if the window is resized afterwards. */
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
          onComplete: () => split.revert(),
          scrollTrigger: opts.trigger
            ? { trigger: opts.trigger, start: opts.start || "top 85%", once: true }
            : undefined,
        });
      };

      /* cheap alternative for phones and tablets: one transform, no splitting */
      const riseIn = (el, opts = {}, y = 22) => {
        if (!el) return gsap.timeline();
        return gsap.from(el, {
          y,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: opts.trigger
            ? { trigger: opts.trigger, start: opts.start || "top 86%", once: true }
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
          scrollTrigger: { trigger, start: "top 82%", once: true },
        });
      };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q(".hero-rule"), { scaleX: 1 });
      });

      mm.add(
        {
          heavy: "(prefers-reduced-motion: no-preference) and (min-width: 900px)",
          light: "(prefers-reduced-motion: no-preference) and (max-width: 899px)",
        },
        (mq) => {
          const heavy = Boolean(mq.conditions.heavy);
          const headIn = (el, opts) => (heavy ? flipIn(el, opts) : riseIn(el, opts, 18));
          const textIn = (el, opts) => (heavy ? linesIn(el, opts) : riseIn(el, opts, 14));

          /* ---- load sequence (light hero: simple rise + fade, no 3D) ---- */
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .from(q(".logo, .nav-links a, .nav-cta, .nav-toggle"), {
              yPercent: -160,
              opacity: 0,
              duration: 0.75,
              stagger: 0.05,
            })
            .from(q(".hero-eyebrow"), { y: 14, opacity: 0, duration: 0.7 }, 0.05)
            .from(
              q(".hero-line"),
              { yPercent: 35, opacity: 0, duration: 0.9, stagger: 0.07, ease: "power3.out" },
              0.1
            )
            .add(textIn(q(".hero-sub")[0]), 0.45)
            .from(q(".hero-actions > *"), { y: 24, opacity: 0, duration: 0.75, stagger: 0.08 }, 0.6)
            .to(q(".hero-rule"), { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0.35);

          /* ---- scroll progress ---- */
          gsap.to(q(".nav-progress span"), {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.3,
              invalidateOnRefresh: true,
            },
          });

          /* ---- hero drifts away as you leave it (desktop only) ---- */
          if (heavy) {
            gsap.to(q(".hero-heading"), {
              yPercent: -14,
              opacity: 0.25,
              ease: "none",
              scrollTrigger: {
                trigger: q(".hero")[0],
                start: "top top",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          }

          /* ---- proof strip (only exists when AS_SEEN_AT has entries) ---- */
          if (q(".proof-badge").length) {
            gsap.from(q(".proof-badge"), {
              y: 10,
              opacity: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.05,
              scrollTrigger: { trigger: q(".proof")[0], start: "top 90%", once: true },
            });
          }

          /* ---- section heads ---- */
          q(".section-head").forEach((head) => {
            headIn(head.querySelector("h2"), { trigger: head, start: "top 84%" });
            textIn(head.querySelector("p"), { trigger: head, start: "top 82%" });
          });

          /* ---- speaker page parts grid ---- */
          const partCards = q(".topic-card");
          gsap.from(partCards, {
            y: 50,
            opacity: 0,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: q(".topics-grid")[0], start: "top 84%", once: true },
          });
          if (heavy) {
            partCards.forEach((card) => {
              flipIn(card.querySelector("h3"), { trigger: card, start: "top 84%" });
            });
          }

          /* ---- service cards ---- */
          const cards = q(".service-card");
          gsap.from(cards, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: q(".services-grid")[0], start: "top 84%", once: true },
          });
          cards.forEach((card) => {
            if (heavy) flipIn(card.querySelector("h3"), { trigger: card, start: "top 82%" });
            drawIcon(card.querySelector("svg"), card);
          });

          /* ---- timeline steps ---- */
          gsap.from(q(".case-step"), {
            y: 50,
            opacity: 0,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: { trigger: q(".case-steps")[0], start: "top 84%", once: true },
          });
          if (heavy) {
            q(".case-step").forEach((step) => {
              flipIn(step.querySelector("h3"), { trigger: step, start: "top 84%" });
            });
          }

          /* ---- plans: land tilted in 3D on desktop, plain rise on phones ---- */
          if (heavy) gsap.set(q(".plans-grid"), { perspective: 1400 });
          gsap.from(q(".plan"), {
            y: 88,
            rotateX: heavy ? -13 : 0,
            opacity: 0,
            transformOrigin: "50% 0%",
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: q(".plans-grid")[0], start: "top 84%", once: true },
          });
          q(".plan").forEach((plan) => {
            gsap.from(plan.querySelectorAll(".plan-includes li"), {
              y: 14,
              opacity: 0,
              duration: 0.55,
              ease: "power3.out",
              stagger: 0.05,
              scrollTrigger: { trigger: plan, start: "top 80%", once: true },
            });
          });

          /* ---- FAQ rows ---- */
          gsap.from(q(".faq-item"), {
            y: 26,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: q(".faq-list")[0], start: "top 86%", once: true },
          });

          /* ---- closing ---- */
          const close = q(".closing")[0];
          if (close) {
            gsap
              .timeline({ scrollTrigger: { trigger: close, start: "top 84%", once: true } })
              .add(headIn(close.querySelector("h2")))
              .from(
                close.querySelector(".btn"),
                { y: 28, opacity: 0, duration: 0.65, ease: "back.out(1.6)" },
                "-=0.45"
              )
              .from(close.querySelector(".closing-alt"), { opacity: 0, duration: 0.5 }, "-=0.2");
          }
        }
      );

      /* ---- magnetic buttons (mouse only) ---- */
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

    /* webfonts change metrics: re-measure once they land */
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => {
      cancelled = true;
      rootEl?.removeEventListener("click", onAnchorClick);
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <div className="speakers-page" ref={root}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="nav">
        <Link className="logo" href="/">
          Zarrar
        </Link>

        <nav
          id="site-sections"
          className={`nav-links${menuOpen ? " is-open" : ""}`}
          aria-label="On this page"
        >
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-end">
          <a className="nav-cta magnetic" href="#contact">
            Contact
          </a>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="site-sections"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>

        <div className="nav-progress" aria-hidden="true">
          <span />
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <p className="hero-eyebrow">
            Websites, outreach and social media for keynote speakers
          </p>

          <h1 className="hero-heading" id="hero-title">
            <span className="hero-line">Book more</span>{" "}
            <span className="hero-line">stages.</span>{" "}
            <span className="hero-line hero-line--accent">Chase fewer</span>{" "}
            <span className="hero-line hero-line--accent">emails.</span>
          </h1>

          <div className="hero-rule" aria-hidden="true" />

          <div className="hero-foot">
            <p className="hero-sub">
              Speaker website development, cold-email outreach to event
              organisers and social media management, so your topics, reel
              and past talks do the pitching and you spend your time on
              stage instead of in your inbox.
            </p>
            <div className="hero-actions">
              <a className="btn btn-solid magnetic" href="#plans">
                See the plans
              </a>
              <a className="btn btn-ghost" href="#services">
                How it works
              </a>
            </div>
          </div>
        </section>

        {AS_SEEN_AT.length > 0 && (
          <section className="proof" id="proof" aria-label="Past speaking engagements">
            <div className="proof-inner">
              <span className="proof-label">As seen at</span>
              <div className="proof-badges">
                {AS_SEEN_AT.map((name) => (
                  <span className="proof-badge" key={name}>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="topics" id="speaker-page" aria-labelledby="topics-title">
          <div className="section-head">
            <h2 id="topics-title">Everything an organiser needs, on one page</h2>
            <p>
              This is what your speaker website includes, so a program
              committee can shortlist you without a single follow-up email.
            </p>
          </div>

          <ul className="topics-grid">
            {PAGE_PARTS.map((t) => (
              <li className="topic-card" key={t.title}>
                <h3>{t.title}</h3>
                <p>{t.line}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="services" id="services" aria-labelledby="services-title">
          <div className="section-head">
            <h2 id="services-title">Built to get keynote speakers booked</h2>
            <p>Three services that work together. Pick one, or run all three.</p>
          </div>

          <div className="services-grid">
            {SERVICES.map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <article className="service-card" id={s.id} key={s.id}>
                  <span className="service-icon" aria-hidden="true">
                    {Icon && <Icon />}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <a className="btn btn-outline" href="#contact">
                    {s.cta}
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="case-study" id="process" aria-labelledby="case-title">
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
            Timing is a guide. The exact pace depends on your topic and the
            events you&apos;re targeting.
          </p>
        </section>

        <section className="plans" id="plans" aria-labelledby="plans-title">
          <div className="section-head">
            <h2 id="plans-title">Pick a starting point</h2>
            <p>
              Each plan builds on the one before it. Move up whenever
              you&apos;re ready.
            </p>
          </div>

          <div className="plans-grid">
            {PLANS.map((p) => (
              <article
                className={`plan${p.featured ? " is-featured" : ""}`}
                key={p.id}
                aria-labelledby={`plan-${p.id}`}
              >
                {p.featured && <span className="plan-flag">Most complete</span>}
                <h3 className="plan-name" id={`plan-${p.id}`}>
                  {p.name}
                </h3>
                <p className="plan-line">{p.line}</p>
                <p className="plan-body">{p.body}</p>
                <ul className="plan-includes">
                  {p.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
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
            <h2 id="faq-title">Questions speakers ask us</h2>
            <p>If yours isn&apos;t here, ask us directly. We reply fast.</p>
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
                      <span className="faq-icon" aria-hidden="true">
                        <PlusIcon />
                      </span>
                    </button>
                  </h3>
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
          <h2 id="contact-title">Ready to get booked?</h2>
          <a
            className="btn btn-solid btn-lg magnetic"
            href={`mailto:${CONTACT_EMAIL}?subject=Speaker%20website%20and%20outreach%20enquiry`}
          >
            Get in touch
          </a>
          <p className="closing-alt">
            Not a speaker? <Link href="/services">Check out our services</Link>
          </p>
        </section>
      </main>
    </div>
  );
}

export default Speakers;
