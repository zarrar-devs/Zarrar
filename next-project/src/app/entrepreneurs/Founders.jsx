"use client";

/* =============================================================
   Zarrar — /for-founders  (founders, entrepreneurs & CEOs)
   -------------------------------------------------------------
   Black and white. Content, metadata and schema live in
   ./founders-data.js; the route file (app/for-founders/page.js)
   owns metadata, fonts and JSON-LD, because none of those can be
   exported from a "use client" file.

   Deps:  npm i gsap lenis      (SplitText is free in gsap >= 3.13)

   Motion principles
   - The hero is one orchestrated moment and runs in CSS, so it
     starts on first paint and never flashes before hydration.
   - GSAP only handles what needs scroll or timing: the search
     demo, section headings, the stacking service sheets, the
     timeline and the nav (progress bar, scrolled state, active link).
   - Everything is visible by default; animation only ever hides
     things that are below the fold or that CSS controls.
   - prefers-reduced-motion gets the finished state.

   Nav
   - <header.fd-header> is the sticky wrapper. The gap around the
     pill is PADDING, not margin: a margin on the first child of
     .founders-page collapses through it and exposes the body
     background as a white strip above the page.
   - Below 900px the links move into a dropdown (.fd-menu) opened by
     the hamburger button.
   - `.fd-nav` has a STATIC className on purpose. GSAP toggles
     `is-scrolled` on it directly; if React ever re-rendered a
     different className it would wipe that class. Menu state lives
     on the header as `data-open` instead.

   Every class is prefixed `fd-` on purpose. Coaches.css has
   unscoped selectors (.btn, .nav, .hero ...) that would leak into
   this page if both stylesheets are ever loaded together.
   ============================================================= */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  BRAND,
  SEO,
  HERO,
  SERP_QUERY,
  SERP,
  PAIN_POINTS,
  AUDIENCES,
  TIMELINE,
  FAQS,
  SERVICES,
  PLANS,
  PERSONAS,
} from "./founders-data";
import "./entreprenuer.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Section ids the nav points at. Used for the desktop links, the
   mobile menu and the "you are here" highlight. */
const NAV_LINKS = [
  { id: "problem", label: "Why it matters" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "plans", label: "Plans" },
  { id: "faq", label: "FAQ" },
];

/* ---------------- Icons (decorative, hidden from AT) ---------------- */

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

const ICONS = {
  "web-development": <WebIcon />,
  "email-marketing": <MailIcon />,
  "social-media": <SocialIcon />,
};

/* Splits a headline into masked words for the CSS rise animation.
   The words stay separated by real spaces, so the heading reads as
   one normal sentence to crawlers and screen readers. */
function Words({ text }) {
  const words = text.split(" ");
  return words.map((w, i) => (
    <React.Fragment key={`${w}-${i}`}>
      <span className="fd-w">
        <span className="fd-w-i" style={{ "--d": `${i * 0.055}s` }}>
          {w}
        </span>
      </span>
      {i < words.length - 1 ? " " : null}
    </React.Fragment>
  ));
}

/* ---------------- Component ---------------- */

function Founders() {
  const root = useRef(null);
  const shellRef = useRef(null);
  const burgerRef = useRef(null);
  const [openFAQ, setOpenFAQ] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

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
        lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: { offset: -80 } });
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

      /* Section headings: words rise out of a line mask as they enter.
         autoSplit re-splits on resize / font load, and the returned
         tween keeps its progress. */
      const revealHeading = (el, { trigger, start = "top 85%" } = {}) => {
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
                stagger: 0.05,
                scrollTrigger: { trigger: trigger || el, start, once: true },
              }),
          })
        );
      };

      /* ---- nav: firmer pill after the first scroll + "you are here" ----
         Runs for everyone (reduced motion included): it is state, not motion. */
      ScrollTrigger.create({
        start: 24,
        end: "max",
        onToggle: (st) => {
          q(".fd-nav")[0]?.classList.toggle("is-scrolled", st.isActive);
        },
      });

      NAV_LINKS.forEach(({ id }) => {
        const section = root.current?.querySelector(`#${id}`);
        const links = q(`[data-nav="${id}"]`);
        if (!section || !links.length) return;
        ScrollTrigger.create({
          trigger: section,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (st) =>
            links.forEach((a) => {
              a.classList.toggle("is-active", st.isActive);
              if (st.isActive) a.setAttribute("aria-current", "location");
              else a.removeAttribute("aria-current");
            }),
        });
      });

      const mm = gsap.matchMedia();

      /* ---- reduced motion: the final state is the default state ---- */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const typed = q(".fd-serp-typed")[0];
        if (typed) typed.textContent = SERP_QUERY;
      });

      /* ---- motion ---- */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Hero search demo. CSS already fades the card and rows in and
           leaves them in their START state (weak results visible, strong
           results clipped away). This timeline types the founder's name,
           then wipes each weak result out with its stronger version. */
        const typed = q(".fd-serp-typed")[0];
        const befores = q(".fd-serp-before");
        const afters = q(".fd-serp-after");
        const typing = { n: 0 };
        if (typed) typed.textContent = "";

        gsap
          .timeline({ delay: 1.3 })
          .to(typing, {
            n: SERP_QUERY.length,
            duration: 1.3,
            ease: "none",
            onUpdate: () => {
              if (typed) typed.textContent = SERP_QUERY.slice(0, Math.round(typing.n));
            },
          })
          .to(
            afters,
            { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.inOut", stagger: 0.25 },
            "+=0.9"
          )
          .set(befores, { autoAlpha: 0 });

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

  /* Mobile menu: Escape closes it (focus returns to the button), so does
     a tap outside the header or growing the window to desktop width. */
  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    const onDown = (e) => {
      if (!shellRef.current?.contains(e.target)) setMenuOpen(false);
    };
    const mq = window.matchMedia("(min-width: 900px)");
    const onMq = (e) => {
      if (e.matches) setMenuOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      mq.removeEventListener("change", onMq);
    };
  }, [menuOpen]);

  return (
    <div className="founders-page" ref={root}>
      <a className="fd-skip" href="#main">Skip to content</a>

      <header className="fd-header" data-open={menuOpen}>
        <div className="fd-nav-shell" ref={shellRef}>
          <div className="fd-nav">
            <Link className="fd-logo fd-display" href="/">{BRAND}</Link>

            <nav className="fd-nav-links" aria-label="Sections">
              {NAV_LINKS.map((l) => (
                <a key={l.id} href={`#${l.id}`} data-nav={l.id}>{l.label}</a>
              ))}
            </nav>

            <div className="fd-nav-actions">
              <a className="fd-nav-cta" href="#contact">Book a call</a>
              <button
                ref={burgerRef}
                type="button"
                className="fd-burger"
                aria-expanded={menuOpen}
                aria-controls="fd-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((o) => !o)}
              >
                <span />
                <span />
              </button>
            </div>

            <div className="fd-nav-progress" aria-hidden="true"><span /></div>
          </div>

          <nav className="fd-menu" id="fd-menu" aria-label="Sections menu">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                data-nav={l.id}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* ---------- Hero ---------- */}
        <section className="fd-hero" id="top" aria-labelledby="hero-title">
          <div className="fd-wrap fd-hero-grid">
            <div className="fd-hero-copy">
              <nav className="fd-crumbs" aria-label="Breadcrumb">
                <ol>
                  <li><Link href="/">Home</Link></li>
                  <li><span aria-current="page">Founders &amp; CEOs</span></li>
                </ol>
              </nav>

              <h1 className="fd-hero-title fd-display" id="hero-title">
                <Words text={SEO.h1} />
              </h1>
              <p className="fd-hero-sub">{HERO.sub}</p>
              <div className="fd-hero-actions">
                <a className="fd-btn" href="#contact">Book a call</a>
                <a className="fd-link" href="#plans">See the plans</a>
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
                  {SERP.map((r, i) => (
                    <li className="fd-serp-item" style={{ "--i": i }} key={r.key}>
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
                Website, email marketing and social media that work together
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
                  <span className="fd-svc-icon" aria-hidden="true">{ICONS[s.id]}</span>
                  <div className="fd-svc-main">
                    <h3 className="fd-display">{s.title}</h3>
                    <p>{s.body}</p>
                    <a className="fd-btn" href="#contact">{s.cta}</a>
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

        {/* ---------- Audience ---------- */}
        <section className="fd-audience fd-light fd-sheet" id="audience" aria-labelledby="audience-title">
          <div className="fd-wrap fd-split">
            <div className="fd-section-head fd-sticky">
              <h2 className="fd-display" id="audience-title">
                Built for founders, CEOs and entrepreneurs
              </h2>
              <p>
                Whether you&apos;re raising, hiring, launching or leading, how people
                find you online is working for you or against you.
              </p>
            </div>

            <ul className="fd-audience-list">
              {AUDIENCES.map((a) => (
                <li className="fd-audience-item" key={a.title}>
                  <h3 className="fd-display">{a.title}</h3>
                  <p>{a.line}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Plans ---------- */}
        <section className="fd-plans fd-light" id="plans" aria-labelledby="plans-title">
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
                        type="button"
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
                    <div className="fd-faq-a" id={aId} role="region" aria-labelledby={qId}>
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
              <a
                className="fd-btn fd-btn-lg"
                href="mailto:hello@zarrar.com?subject=Website%2C%20email%20and%20social%20media%20for%20my%20company"
              >
                Say hello
              </a>
              <p className="fd-closing-alt">
                Not a founder or CEO? <a href="#audiences">See who else we work with</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="fd-footer" id="audiences">
        <div className="fd-footer-inner">
          <div className="fd-footer-cols">
            <div>
              <p className="fd-footer-title">Services</p>
              <nav aria-label="Services">
                <ul>
                  {SERVICES.map((s) => (
                    <li key={s.id}><a href={`#${s.id}`}>{s.serviceType}</a></li>
                  ))}
                </ul>
              </nav>
            </div>
            <div>
              <p className="fd-footer-title">Who we work with</p>
              <nav aria-label="Who we work with">
                <ul>
                  <li><span aria-current="page">Founders &amp; CEOs</span></li>
                  {PERSONAS.map((p) => (
                    <li key={p.href}><Link href={p.href}>{p.label}</Link></li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          <p className="fd-footer-copy">
            &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> {BRAND}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Founders;