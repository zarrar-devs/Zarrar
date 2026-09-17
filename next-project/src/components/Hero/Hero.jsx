"use client";

import {
  forwardRef,
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import Link from "next/link";
import { Fraunces, Space_Mono } from "next/font/google";
import gsap from "gsap";
import TransitionLink from "../TransitionLink"; 

/**
 * Hero — v10
 *
 * What changed vs v9:
 *  - The nav's hamburger menu button is gone. In its place: two direct
 *    links, "Services" and "Contact", styled as small stamp-blocks —
 *    the exact same solid/outline invert-on-hover device the headline
 *    already uses for its two boxed words (see .scramble-word--boxed
 *    below). This reuses an existing motif instead of introducing a
 *    new one: "Services" gets the outline treatment, "Contact" (the
 *    one action worth making bold) gets the solid fill. Both invert on
 *    hover exactly like the headline blocks and the old menu button
 *    did, so the interaction language doesn't change, only what's
 *    being pointed at.
 *  - navMenuRef is gone; navLinksRef (an array ref, same pattern as
 *    pupilRefs) now feeds the entrance timeline and the magnetic-pull
 *    effect, so both nav links settle in and get the same cursor-pull
 *    the mark always had — nothing about those effects changed besides
 *    what they target.
 *  - No layout logic changed. .hero keeps its own overflow:hidden and
 *    box-sizing:border-box, so this component was already containing
 *    its own content before this edit and still does after it.
 *
 * (v9's changes are unchanged and still apply: black-and-white
 * palette, the two-typeface headline with hover-scramble decode,
 * cursor-tracking eyes, the vertical edge label, and the faint paper
 * grain layer.)
 *
 * What did NOT change: ScrambleHeadline's width-lock-after-fonts-ready
 * and text-content-keyed setup effect are the fix for a real bug (see
 * the git history on this file) — don't "simplify" those without
 * re-reading why they're built this way.
 *
 * Props:
 *  - revealed: whether the page's own entrance settle should play.
 *    True by default; Preloader sets this explicitly via cloneElement.
 */

// Serif for the headline's plain words — self-hosted, so no
// third-party request and a matched-metric fallback from next/font.
const displayFont = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic", "normal"],
  variable: "--font-serif",
  display: "swap",
});

// Bold mono for the headline's "stamped" words, plus the nav links and
// edge label that borrow the same device — deliberately a second,
// clearly-distinct family (see the file header).
const stampFont = Space_Mono({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-mono-stamp",
  display: "swap",
});

const SUB_COPY =
  "A design studio building websites, email systems, and identities for brands that don't blend in.";

// Stable reference on purpose — see ScrambleHeadline's setup effect for
// why. Never inline this array literal directly into <ScrambleHeadline lines={...}/>.
const HEADLINE_LINES = ["Interfaces worth staying on.", "Inboxes worth opening."];

const Hero = forwardRef(function Hero({ revealed = true }, ref) {
  const navMarkRef = useRef(null);
  const navLinksRef = useRef([]);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const eyesRef = useRef(null);
  const pupilRefs = useRef([]);
  const edgeTagRef = useRef(null);

  // Hide nav + eyes + edge label + headline + sub-copy words up front
  // *only* if we're going to be revealed later (i.e. a Preloader
  // controls us) — otherwise Hero used standalone would flash blank
  // content with nothing to un-hide it.
  useLayoutEffect(() => {
    if (!revealed) {
      const headlineWords = headlineRef.current?.querySelectorAll(
        ".headline-word-inner"
      );
      gsap.set(headlineWords, {
        yPercent: 115,
        opacity: 0,
        filter: "blur(14px)",
      });
      gsap.set([navMarkRef.current, ...navLinksRef.current], {
        opacity: 0,
        y: -10,
      });
      gsap.set(eyesRef.current, { opacity: 0, scale: 0.6 });
      gsap.set(edgeTagRef.current, { opacity: 0, x: 10 });

      const words = subRef.current?.querySelectorAll(".word-inner");
      gsap.set(words, { yPercent: 130, opacity: 0, filter: "blur(6px)" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!revealed) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const headlineWords = headlineRef.current?.querySelectorAll(
      ".headline-word-inner"
    );
    const words = subRef.current?.querySelectorAll(".word-inner");

    if (reduceMotion) {
      gsap.set(headlineWords, {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
      });
      gsap.set([navMarkRef.current, ...navLinksRef.current], {
        opacity: 1,
        y: 0,
      });
      gsap.set(eyesRef.current, { opacity: 1, scale: 1 });
      gsap.set(edgeTagRef.current, { opacity: 1, x: 0 });
      gsap.set(words, { yPercent: 0, opacity: 1, filter: "blur(0px)" });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    // nav settles first — quick and understated, it's chrome, not the
    // content the page is actually about
    tl.to(
      [navMarkRef.current, ...navLinksRef.current],
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.06 },
      0
    );

    // the eyes wake up next, with a bit of overshoot — the one purely
    // playful beat before the headline's straighter motion
    tl.to(
      eyesRef.current,
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2.2)" },
      0.15
    );

    tl.to(
      edgeTagRef.current,
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
      0.3
    );

    // headline is the main event: each word cascades up out of its own
    // mask, shedding blur as it lands. Word-level (not letter-level)
    // stagger keeps it reading as language, not confetti — letters get
    // to perform individually later, on hover, via the scramble effect.
    tl.to(
      headlineWords,
      {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.15,
        stagger: 0.07,
      },
      0.08
    );

    // sub-copy overlaps the headline's tail instead of waiting for it to
    // fully finish — keeps the whole thing feeling like one continuous
    // motion rather than a checklist of parts arriving in turn
    tl.to(
      words,
      {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.1,
        stagger: 0.035,
      },
      0.55
    );

    // The headline's chars were measured (for the hover-decode radius,
    // see ScrambleHeadline) as soon as the webfont was ready — almost
    // always earlier than this timeline even starts — so that
    // measurement happened while the words were still translated into
    // their hidden position. Once everything has visually settled here,
    // nudge ScrambleHeadline's own (already-debounced) resize handler
    // to re-measure, so a hover right after reveal targets the real
    // on-screen position instead of the stale pre-animation one. This
    // is a synthetic event only — it doesn't touch the viewport or the
    // body-scroll lock Preloader owns.
    tl.call(() => window.dispatchEvent(new Event("resize")), null, 1.7);

    return () => tl.kill();
  }, [revealed]);

  // Cursor-follow pupils + an irregular blink. Independent of
  // `revealed` — if Hero is ever mounted without a Preloader (see the
  // guard in the effect above), the eyes should still work.
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const quickies = pupilRefs.current.map((el) =>
      el
        ? {
            x: gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" }),
            y: gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" }),
          }
        : null
    );

    const MAX_DRIFT = 5; // px the pupil can wander from center
    const REACH = 70; // px of cursor distance before drift maxes out

    const handleMove = (e) => {
      pupilRefs.current.forEach((el, i) => {
        if (!el || !quickies[i]) return;
        const eyeEl = el.parentElement;
        if (!eyeEl) return;
        const r = eyeEl.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.min(Math.hypot(dx, dy), REACH);
        const angle = Math.atan2(dy, dx);
        quickies[i].x(Math.cos(angle) * MAX_DRIFT * (dist / REACH));
        quickies[i].y(Math.sin(angle) * MAX_DRIFT * (dist / REACH));
      });
    };
    window.addEventListener("mousemove", handleMove);

    // Deliberately irregular interval so the blink never lines up with
    // anything else on the page and reads as alive, not metronomic.
    let blinkTimer = null;
    const blink = () => {
      const eyes = eyesRef.current?.querySelectorAll(".eye");
      gsap.to(eyes, {
        scaleY: 0.08,
        duration: 0.07,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
        transformOrigin: "50% 50%",
      });
      blinkTimer = setTimeout(blink, 2600 + Math.random() * 3000);
    };
    blinkTimer = setTimeout(blink, 2000 + Math.random() * 1200);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      clearTimeout(blinkTimer);
    };
  }, []);

  // Small magnetic pull on the nav mark and each nav link toward the
  // cursor. Cheap (two quickTo calls per element, only active while the
  // pointer is over the element) and consistent with the eyes' use of
  // the same GSAP pattern elsewhere in this file.
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const targets = [navMarkRef.current, ...navLinksRef.current].filter(
      Boolean
    );
    const cleanups = targets.map((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * 0.25);
        yTo(dy * 0.25);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section className={`hero ${displayFont.variable} ${stampFont.variable}`} ref={ref}>
      <style>{`
        .hero {
          --paper: #FFFFFF;
          --ink: #0B0B0C;
          --ink-soft: #6B6B70;
          --line: rgba(11, 11, 12, 0.14);
          --font: var(--font-space-grotesk), ui-sans-serif, system-ui,
            -apple-system, "Segoe UI", sans-serif;
          --font-display: var(--font-serif), Georgia, "Times New Roman", serif;
          --font-stamp: var(--font-mono-stamp), "SFMono-Regular", Menlo,
            Consolas, monospace;

          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          min-height: 100dvh;
          background: var(--paper);
          color: var(--ink);
          font-family: var(--font);
          padding: 28px clamp(20px, 4vw, 56px) clamp(56px, 8vw, 96px);
          overflow: hidden;
        }
        .hero, .hero *, .hero *::before, .hero *::after {
          box-sizing: border-box;
        }
        /* faint paper grain — decorative only, sits behind everything
           and can't intercept clicks or affect layout */
        .hero::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.035;
          mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Nav */
        .hero__nav {
          position: relative;
          z-index: 1;
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--line);
        }
        .hero__mark {
          font-weight: 700;
          font-size: 1.05rem;
          letter-spacing: 0.03em;
          color: inherit;
          text-decoration: none;
          white-space: nowrap;
        }

        /* Services / Contact — reuses the exact solid/outline invert
           device the headline's boxed words already use (see
           .scramble-word--boxed below), just at nav scale. Contact
           gets the solid fill since it's the one action worth making
           bold; Services stays outline. clamp() keeps both legible
           and non-wrapping down to narrow phones without needing a
           separate mobile layout. */
        .hero__links {
          display: flex;
          align-items: center;
          gap: clamp(6px, 2vw, 12px);
        }
        .hero__link {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          font-family: var(--font-stamp);
          font-weight: 700;
          font-size: clamp(0.68rem, 1.9vw, 0.82rem);
          letter-spacing: -0.01em;
          text-decoration: none;
          padding: 0.5em 0.8em;
          border-radius: 8px;
          transition: background 0.22s ease, color 0.22s ease,
            box-shadow 0.22s ease, transform 0.2s ease;
        }
        .hero__link:hover {
          transform: translateY(-1px);
        }
        .hero__link--outline {
          background: var(--paper);
          color: var(--ink);
          box-shadow: inset 0 0 0 1.5px var(--ink);
        }
        .hero__link--outline:hover {
          background: var(--ink);
          color: var(--paper);
          box-shadow: none;
        }
        .hero__link--solid {
          background: var(--ink);
          color: var(--paper);
        }
        .hero__link--solid:hover {
          background: var(--paper);
          color: var(--ink);
          box-shadow: inset 0 0 0 1.5px var(--ink);
        }
        .hero__link:focus-visible {
          outline: 2px solid var(--ink);
          outline-offset: 3px;
        }
        @media (max-width: 360px) {
          .hero__link {
            padding: 0.42em 0.6em;
            font-size: 0.66rem;
          }
          .hero__links {
            gap: 6px;
          }
        }

        /* Edge label — doubles as the page's only scroll affordance */
        .hero__edge-tag {
          position: absolute;
          z-index: 1;
          right: clamp(10px, 2vw, 26px);
          top: 50%;
          display: flex;
          align-items: center;
          gap: 10px;
          writing-mode: vertical-rl;
          transform: translateY(-50%) rotate(180deg);
          font-family: var(--font-stamp);
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          color: var(--ink-soft);
        }
        .hero__edge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--ink);
          animation: heroPulse 1.8s ease-in-out infinite;
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 780px) {
          .hero__edge-tag { display: none; }
        }

        /* Content — centered, single column, vertically centered in
           whatever height is left below the nav. min-height on .hero
           (not height) means this still just grows taller — never
           clips — if the headline wraps onto extra lines on a narrow
           viewport. */
        .hero__stage {
          position: relative;
          z-index: 1;
          flex: 1 1 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(24px, 5vw, 48px) 0;
        }
        .hero__content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        /* Curious eyes — purely decorative, aria-hidden. Track the
           cursor and blink; see the effects above the return. */
        .hero__eyes {
          display: flex;
          gap: 14px;
          margin-bottom: 20px;
        }
        .eye {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--paper);
          border: 1.5px solid var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .eye__pupil {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--ink);
        }
        @media (max-width: 420px) {
          .hero__eyes { display: none; }
        }

        .hero__headline {
          margin: 0;
          font-family: var(--font-display);
          font-weight: 600;
          font-style: italic;
          /* Only takes effect under ~460px-wide viewports, so this
             renders identically to before on every phone/tablet/desktop
             width above that; it just stops the two headline lines
             wrapping quite so many times on the narrowest phones. */
          font-size: clamp(2.3rem, 7vw, 6.5rem);
          line-height: 1.05;
          letter-spacing: -0.02em;
        }
        /* masks the entrance only — line-height/font-size are
           inherited from .hero__headline on purpose, so this never
           needs to be kept in sync by hand. The hover-scramble decode
           (see ScrambleHeadline) operates independently, one level
           deeper, on .scramble-char. */
        .headline-word-mask {
          display: inline-block;
          overflow: hidden;
          vertical-align: top;
        }
        .headline-word-inner {
          display: inline-block;
          will-change: transform, opacity, filter;
        }
        .scramble-word {
          display: inline-block;
          white-space: nowrap;
        }
        /* the two "stamped" words (see HEADLINE_LINES) — a bold mono
           block instead of the plain italic serif. Line one is filled,
           line two is its outline inverse; hovering either swaps it to
           the other treatment, echoing the nav's own invert-on-hover. */
        .scramble-word--boxed {
          font-family: var(--font-stamp);
          font-style: normal;
          font-weight: 700;
          font-size: 0.92em;
          letter-spacing: -0.01em;
          padding: 0.05em 0.32em;
          border-radius: 8px;
          transition: background 0.22s ease, color 0.22s ease,
            box-shadow 0.22s ease, transform 0.22s ease;
        }
        .scramble-word--boxed-solid {
          background: var(--ink);
          color: var(--paper);
          transform: rotate(-1.4deg);
        }
        .scramble-word--boxed-outline {
          background: var(--paper);
          color: var(--ink);
          box-shadow: inset 0 0 0 2px var(--ink);
          transform: rotate(1.4deg);
        }
        .scramble-word--boxed:hover {
          transform: rotate(0deg) scale(1.05);
        }
        .scramble-word--boxed-solid:hover {
          background: var(--paper);
          color: var(--ink);
          box-shadow: inset 0 0 0 2px var(--ink);
        }
        .scramble-word--boxed-outline:hover {
          background: var(--ink);
          color: var(--paper);
          box-shadow: none;
        }
        .scramble-char {
          display: inline-block;
          text-align: center;
          transition: filter 0.16s ease, opacity 0.16s ease,
            transform 0.16s ease;
          filter: blur(0);
          opacity: 1;
        }
        .scramble-char.is-flip {
          filter: blur(3px);
          opacity: 0.55;
          transform: translateY(-2px);
        }
        /* the flip right before a letter settles gets a quick scale
           pop instead of a color change — reads the same over the
           plain serif words and the filled mono blocks */
        .scramble-char.is-spark {
          transform: scale(1.3);
        }

        .hero__sub {
          margin: 24px auto 0;
          max-width: 46ch;
          font-size: 1.1rem;
          line-height: 1.6;
        }
        .hero__sub, .hero__sub .word-inner {
          color: var(--ink-soft);
        }
        /* each word sits in its own overflow-hidden mask so it can
           slide up from "underneath" the line during the reveal,
           instead of the whole paragraph fading in as one flat block */
        .word-mask {
          display: inline-block;
          overflow: hidden;
          vertical-align: top;
          line-height: 1.6;
        }
        .word-inner {
          display: inline-block;
          will-change: transform, opacity, filter;
        }

        @media (max-width: 640px) {
          .hero {
            min-height: auto;
            padding-top: 28px;
            padding-bottom: 24px;
          }
          .hero__stage {
            padding-bottom: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .scramble-char { transition: none; }
        }
      `}</style>

      <header className="hero__nav">
        <Link href="/" className="hero__mark" ref={navMarkRef} aria-label="Zarrar — home">
          ZARRAR
        </Link>
        <nav className="hero__links" aria-label="Primary">
       <TransitionLink
  href="/services"
  className="hero__link hero__link--outline"
  ref={(el) => (navLinksRef.current[0] = el)}
>
  Services
</TransitionLink>
          <Link
            href="#contact"
            className="hero__link hero__link--solid"
            ref={(el) => (navLinksRef.current[1] = el)}
          >
            Contact
          </Link>
        </nav>
      </header>

      <div className="hero__edge-tag" ref={edgeTagRef}>
        <span>SCROLL TO EXPLORE</span>
        <span className="hero__edge-dot" aria-hidden="true" />
      </div>

      <div className="hero__stage">
        <div className="hero__content">
          <div className="hero__eyes" ref={eyesRef} aria-hidden="true">
            <span className="eye">
              <span className="eye__pupil" ref={(el) => (pupilRefs.current[0] = el)} />
            </span>
            <span className="eye">
              <span className="eye__pupil" ref={(el) => (pupilRefs.current[1] = el)} />
            </span>
          </div>

          <h1 className="hero__headline" ref={headlineRef}>
            <ScrambleHeadline lines={HEADLINE_LINES} />
          </h1>

          <p className="hero__sub" ref={subRef}>
            <span aria-hidden="true">
              {SUB_COPY.split(" ").map((word, i, words) => (
                <span className="word-mask" key={i}>
                  <span className="word-inner">
                    {word}
                    {i < words.length - 1 ? "\u00A0" : ""}
                  </span>
                </span>
              ))}
            </span>
            <span className="sr-only">{SUB_COPY}</span>
          </p>
        </div>
      </div>
    </section>
  );
});

const SCRAMBLE_GLYPHS = "!<>{}[]/\\=+*^?#%&~";
const HOVER_RADIUS = 70; // px, how close the cursor has to be to wake a letter
const DECODE_FLIPS = 4; // glyph flips a letter runs through before it settles
const FLIP_MS = 46; // base time between flips
const FLIP_EASE = 18; // ms added per flip — makes the decode decelerate
const INTRO_STAGGER_MS = 22; // ms between each letter starting its on-load decode

/**
 * Renders `lines` as one letter-per-span. When the cursor first comes
 * within HOVER_RADIUS of a letter, that letter runs a short, decelerating
 * "decode": a few glyph flips, each crossfaded through a blur, landing
 * back on the real character. The flip immediately before settling gets
 * a quick scale pop rather than a color change (see .is-spark in the
 * stylesheet above) — a single, understated spark at the moment of
 * resolving, rather than something on every flip (which reads as noise
 * once several letters are decoding at once). Letters only re-trigger
 * when the cursor leaves and re-enters their radius, so a stationary
 * cursor settles instead of flickering forever, and a moving cursor
 * reads as a wave of letters waking up in sequence. Everything is
 * direct DOM writes on a rAF loop (no React state) so it stays smooth.
 * Each letter's box width is measured and locked after mount so
 * swapping glyphs never reflows the line.
 *
 * Words at index 0 of each line get the "boxed" treatment (see
 * .scramble-word--boxed) — line 0 filled, line 1 outlined — everything
 * else stays a plain word in the italic serif.
 *
 * IMPORTANT — `lines` should be a STABLE reference (defined outside the
 * component, or memoized by the caller). See this component's setup
 * effect below for why: it no longer trusts that anyway (it guards on
 * text content, not array identity), but a stable reference is still
 * the correct, cheap thing to pass in.
 */
function ScrambleHeadline({ lines, className }) {
  const charRefs = useRef([]);
  const positions = useRef([]);
  const mouse = useRef({ x: -99999, y: -99999 });
  const rafRef = useRef(null);
  const letterState = useRef([]); // per-letter: { inRadius, decoding, flipsLeft, nextFlipAt }
  const initializedForRef = useRef(null); // guards against re-running setup for unchanged content

  const words = useMemo(() => lines.map((line) => line.split(" ")), [lines]);
  const plainText = useMemo(() => lines.join(" "), [lines]);

  // Measures + locks every letter's box width so glyph-swapping during a
  // decode never reflows the line.
  //
  // IMPORTANT: this must measure each letter's REAL character
  // (el.dataset.char), never whatever textContent currently happens to
  // be painted — a decode can be actively showing a random glitch glyph
  // at any given moment, and measuring that instead of the real letter
  // would permanently lock the box to the glitch's (wrong) width.
  //
  // The swap-measure-restore below happens synchronously, before the
  // browser gets a chance to paint, so there's no visible flicker even
  // when a letter is mid-decode when this runs.
  const lockWidths = () => {
    const nodes = charRefs.current;
    const savedContent = nodes.map((el) => (el ? el.textContent : null));

    nodes.forEach((el) => {
      if (!el) return;
      el.style.width = "auto";
      el.textContent = el.dataset.char;
    });
    nodes.forEach((el) => {
      if (!el) return;
      const w = el.getBoundingClientRect().width;
      el.style.width = `${w}px`;
    });
    nodes.forEach((el, i) => {
      if (el) el.textContent = savedContent[i];
    });
  };

  const measure = () => {
    positions.current = charRefs.current.map((el) => {
      if (!el) return { x: -99999, y: -99999 };
      const r = el.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 + window.scrollX,
        y: r.top + r.height / 2 + window.scrollY,
      };
    });
  };

  // Kicks off one decode per letter, staggered left-to-right, using the
  // exact same per-letter state (letterState.current[i]) the hover
  // effect's rAF loop already reads — this doesn't duplicate the decode
  // logic, it just seeds it once on load instead of waiting for the
  // cursor. Only called from settle(), i.e. after fonts are ready and
  // widths are locked, so glyph-swapping during the wave never reflows
  // anything (same reasoning as the hover case — see lockWidths above).
  const playIntroDecode = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const now = performance.now();
    letterState.current.forEach((st, i) => {
      if (!st) return;
      st.decoding = true;
      st.flipsLeft = DECODE_FLIPS;
      st.nextFlipAt = now + i * INTRO_STAGGER_MS;
    });
  };

  useLayoutEffect(() => {
    // Guard on the actual TEXT this component was last set up for, not
    // on whether `words`/`lines` changed reference. A caller passing a
    // fresh array literal every render (an easy mistake — see Hero's
    // file header) would otherwise make this effect re-fire on every
    // parent re-render, which resets every letter's decode state
    // (letterState below) even mid-flip. If that reset lands while a
    // letter is actively showing a glitch glyph — very likely right at
    // a Preloader reveal, since the cursor is typically already resting
    // on the headline at that exact moment — the letter gets stuck
    // out-of-sync with the animation loop and the line's width can
    // shift, wrapping onto an extra line and pushing everything below
    // it down. Keying off the actual string means this only ever runs
    // again if the headline's real content changes.
    if (initializedForRef.current === plainText) return;
    initializedForRef.current = plainText;

    letterState.current = charRefs.current.map(() => ({
      inRadius: false,
      decoding: false,
      flipsLeft: 0,
      nextFlipAt: 0,
    }));

    // Lock widths exactly ONCE, only once the real webfont has actually
    // loaded — not immediately at mount. Locking immediately measures
    // each letter against whatever fallback font is showing at that
    // instant; re-measuring a second time after the swap is what used
    // to cause a visible jolt of its own. Waiting for document.fonts.ready
    // and only measuring once means there's nothing left to correct later.
    const settle = () => {
      lockWidths();
      measure();
      playIntroDecode();
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(settle);
    } else {
      settle();
    }
  }, [words, plainText]);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        lockWidths();
        measure();
      }, 120);
    };
    // Batched through rAF so a fast scroll can't force a
    // getBoundingClientRect() layout read (inside measure(), once per
    // letter) on every single scroll event — at most once per frame.
    let scrollScheduled = false;
    const handleScroll = () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      requestAnimationFrame(() => {
        measure();
        scrollScheduled = false;
      });
    };
    const handleMove = (e) => {
      mouse.current.x = e.pageX;
      mouse.current.y = e.pageY;
    };
    const handleWindowLeave = () => {
      mouse.current.x = -99999;
      mouse.current.y = -99999;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    if (!reduceMotion) {
      window.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseleave", handleWindowLeave);
    }

    const tick = (t) => {
      const nodes = charRefs.current;
      const pos = positions.current;
      const states = letterState.current;
      const m = mouse.current;

      for (let i = 0; i < nodes.length; i++) {
        const el = nodes[i];
        const p = pos[i];
        const st = states[i];
        if (!el || !p || !st) continue;

        const dx = m.x - p.x;
        const dy = m.y - p.y;
        const inRadius = Math.sqrt(dx * dx + dy * dy) < HOVER_RADIUS;

        // A decode only ever STARTS the moment a letter is entered,
        // never just because it's still nearby — so a stationary cursor
        // settles instead of flickering forever.
        if (inRadius && !st.inRadius && !st.decoding) {
          st.decoding = true;
          st.flipsLeft = DECODE_FLIPS;
          st.nextFlipAt = t;
        }
        st.inRadius = inRadius;

        if (st.decoding && t >= st.nextFlipAt) {
          st.flipsLeft -= 1;
          const settling = st.flipsLeft <= 0;
          const isSpark = st.flipsLeft === 1; // the flip right before settling

          if (settling) {
            el.textContent = el.dataset.char;
            el.classList.remove("is-spark");
            st.decoding = false;
          } else {
            const glyph =
              SCRAMBLE_GLYPHS[(Math.random() * SCRAMBLE_GLYPHS.length) | 0];
            el.textContent = glyph;
            if (isSpark) {
              el.classList.add("is-spark");
            } else {
              el.classList.remove("is-spark");
            }
            const step = DECODE_FLIPS - st.flipsLeft;
            st.nextFlipAt = t + FLIP_MS + step * FLIP_EASE;
          }

          // brief blur+fade dip on every flip, CSS-driven so it's
          // always smooth regardless of the JS tick rate
          el.classList.add("is-flip");
          requestAnimationFrame(() => el.classList.remove("is-flip"));
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    if (!reduceMotion) {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleWindowLeave);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
    };
  }, []);

  let idx = -1;

  return (
    <span className={className}>
      <span className="scramble" aria-hidden="true">
        {words.map((lineWords, li) => (
          <Fragment key={li}>
            {lineWords.map((word, wi) => (
              <Fragment key={wi}>
                <span className="headline-word-mask">
                  <span className="headline-word-inner">
                    <span
                      className={
                        wi === 0
                          ? `scramble-word scramble-word--boxed scramble-word--boxed-${
                              li === 0 ? "solid" : "outline"
                            }`
                          : "scramble-word"
                      }
                    >
                      {word.split("").map((ch, ci) => {
                        idx += 1;
                        const at = idx;
                        return (
                          <span
                            key={ci}
                            ref={(el) => (charRefs.current[at] = el)}
                            data-char={ch}
                            className="scramble-char"
                          >
                            {ch}
                          </span>
                        );
                      })}
                    </span>
                  </span>
                </span>
                {wi < lineWords.length - 1 ? " " : ""}
              </Fragment>
            ))}
            {li < words.length - 1 && <br />}
          </Fragment>
        ))}
      </span>
      <span className="sr-only">{plainText}</span>
    </span>
  );
}

export default Hero;