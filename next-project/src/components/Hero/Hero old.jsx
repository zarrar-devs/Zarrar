"use client";

import {
  forwardRef,
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";

/**
 * Hero — v4
 *
 * What changed vs v3 — this is the actual root cause of the jolt /
 * scroll / "button jumps down" bug that v2 and v3's fixes didn't catch:
 *
 * 1. THE HEADLINE'S `lines` ARRAY WAS RECREATED ON EVERY RENDER.
 *    `<ScrambleHeadline lines={["Websites people love.", "Emails they
 *    actually open."]} />` — that array literal is a NEW reference every
 *    time Hero re-renders. ScrambleHeadline derives `words` from `lines`
 *    via useMemo, and its setup effect depends on `[words]` — so a new
 *    `lines` reference makes that effect re-fire.
 *
 *    Hero re-renders the instant Preloader flips `revealed` to true —
 *    i.e. exactly at reveal, exactly when the cursor is most likely to
 *    already be sitting on the headline (it's the focal point the
 *    moment the page appears). The re-fired effect reset every letter's
 *    decode state (wiping mid-flip letters back to "not decoding" while
 *    their span still showed a glitch glyph) and re-ran the width-lock —
 *    colliding with a live decode. The visible result: a letter stuck
 *    mid-glitch, its line's total width shifting, the line wrapping to
 *    a 3rd line, and everything below (CTA included) jumping down — plus
 *    a scrollbar appearing as a side effect of the page suddenly being
 *    taller. Confirmed on video: the wrap happens on the exact frame a
 *    letter under the cursor shows a glitch glyph, not on any resize or
 *    font event.
 *
 *    Fixed two ways (belt and suspenders):
 *      - `lines` is now a stable, module-level constant
 *        (HEADLINE_LINES), so its reference never changes and the
 *        effect only ever fires once, at true mount.
 *      - ScrambleHeadline itself no longer trusts callers to memoize
 *        `lines` correctly. Its setup effect now guards on the actual
 *        *text content* (a ref holding the last string it initialized
 *        for), not on array identity — so even a caller that passes a
 *        fresh array every render can no longer make it re-run and
 *        stomp on live decode state.
 *
 * Everything else (word-cascade reveal, CTA overshoot, lockWidths'
 * dataset.char fix, magnetic CTA, dead-hook removal) is unchanged from
 * v3 — those fixes were correct, they just weren't the thing actually
 * causing this particular bug.
 *
 * v5 — the headline now animates in too.
 *   Previously the headline had no entrance at all: it sat fully
 *   formed underneath Preloader's opaque mask, so the moment the mask
 *   wiped away it just "popped" into view while the sub-copy/CTA/link
 *   around it were still cascading in. It's now wrapped in the same
 *   mask+inner pattern the sub-copy already used (new
 *   .headline-word-mask / .headline-word-inner, one level above
 *   ScrambleHeadline's own .scramble-word), hidden/revealed by Hero in
 *   the same two effects as everything else, and choreographed to lead
 *   the sequence: nav settles → headline cascades word-by-word → sub
 *   overlaps its tail → CTA overshoots → link. The hover-decode scramble
 *   effect is untouched — it lives one level deeper, on .scramble-char,
 *   and only ever runs after a real mouse move.
 *   One subtlety this introduces: ScrambleHeadline measures each
 *   letter's on-screen position (for the hover-decode radius) as soon
 *   as the webfont is ready, which is almost always *before* this
 *   reveal timeline even runs — so it measures the letters while
 *   they're still translated into their hidden position. The reveal
 *   timeline ends by dispatching a synthetic `resize` event once the
 *   headline has visually settled, reusing ScrambleHeadline's own
 *   (already-debounced) resize handler to re-measure correctly. This is
 *   a synthetic DOM event only — it doesn't touch the viewport or the
 *   body-scroll lock Preloader manages, so it doesn't interact with the
 *   scrollbar-gutter handling described in Preloader.jsx.
 *
 * Props:
 *  - revealed: whether the page's own entrance settle should play.
 *    True by default; Preloader sets this explicitly via cloneElement.
 */

const SUB_COPY =
  "From the first click to the inbox, we design, build, and send everything your brand needs to grow — websites, email marketing, and the strategy that ties them together.";

// Stable reference on purpose — see file header, point 1. Never inline
// this array literal directly into <ScrambleHeadline lines={...}/>.
const HEADLINE_LINES = ["Websites people love.", "Emails they actually open."];

const Hero = forwardRef(function Hero({ revealed = true }, ref) {
  const navMarkRef = useRef(null);
  const navMenuRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const linkRef = useRef(null);

  // Hide nav + headline + sub-copy words + actions up front *only* if
  // we're going to be revealed later (i.e. a Preloader controls us) —
  // otherwise Hero used standalone would flash blank content with
  // nothing to un-hide it.
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
      gsap.set([navMarkRef.current, navMenuRef.current], {
        opacity: 0,
        y: -10,
      });

      const words = subRef.current?.querySelectorAll(".word-inner");
      gsap.set(words, { yPercent: 130, opacity: 0, filter: "blur(6px)" });
      gsap.set([ctaRef.current, linkRef.current], {
        opacity: 0,
        y: 20,
        scale: 0.94,
        filter: "blur(8px)",
      });
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
      gsap.set([navMarkRef.current, navMenuRef.current], {
        opacity: 1,
        y: 0,
      });
      gsap.set(words, { yPercent: 0, opacity: 1, filter: "blur(0px)" });
      gsap.set([ctaRef.current, linkRef.current], {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    // nav settles first — quick and understated, it's chrome, not the
    // content the page is actually about
    tl.to(
      [navMarkRef.current, navMenuRef.current],
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.06 },
      0
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

    // CTA overshoots slightly on landing, then gets one soft glow pulse
    tl.to(
      ctaRef.current,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.85,
        ease: "back.out(1.6)",
      },
      0.85
    )
      .to(
        ctaRef.current,
        {
          boxShadow: "0 18px 38px -14px rgba(42, 68, 255, 0.5)",
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.35"
      )
      .to(ctaRef.current, {
        boxShadow: "0 0 0 0 rgba(20, 20, 28, 0)",
        duration: 0.7,
        ease: "power2.inOut",
      });

    // link follows right behind the CTA — overlapping, not waiting
    tl.to(
      linkRef.current,
      { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.8 },
      0.98
    );

    // The headline's chars were measured (for the hover-decode radius,
    // see ScrambleHeadline) as soon as the webfont was ready — almost
    // always earlier than this timeline even starts — so that
    // measurement happened while the words were still translated into
    // their hidden position. Once the words have visually settled here,
    // nudge ScrambleHeadline's own (already-debounced) resize handler
    // to re-measure, so a hover right after reveal targets the real
    // on-screen position instead of the stale pre-animation one. This
    // is a synthetic event only — it doesn't touch the viewport or the
    // body-scroll lock Preloader owns.
    tl.call(() => window.dispatchEvent(new Event("resize")), null, 1.35);

    return () => tl.kill();
  }, [revealed]);

  // Magnetic CTA — desktop, fine-pointer only, respects reduced motion.
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    const btn = ctaRef.current;
    if (!btn || reduceMotion || !canHover) return;

    const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });

    const handleMove = (e) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.35);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    };
    const reset = () => {
      xTo(0);
      yTo(0);
    };

    btn.addEventListener("mousemove", handleMove);
    btn.addEventListener("mouseleave", reset);
    return () => {
      btn.removeEventListener("mousemove", handleMove);
      btn.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <section className="hero" ref={ref}>
      <style>{`
        .hero {
          --paper: #fcfbf8;
          --ink: #14141c;
          --ink-soft: #57575f;
          --line: rgba(20, 20, 28, 0.14);
          --red: #e6432f;
          --blue: #2a44ff;
          --gold: #c98d00;
          --font: var(--font-space-grotesk), ui-sans-serif, system-ui,
            -apple-system, "Segoe UI", sans-serif;

          position: relative;
          background: var(--paper);
          color: var(--ink);
          font-family: var(--font);
          padding: 28px clamp(20px, 4vw, 56px) 64px;
        }
        .hero, .hero *, .hero *::before, .hero *::after {
          box-sizing: border-box;
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
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--line);
          margin-bottom: clamp(48px, 9vw, 96px);
        }
        .hero__mark {
          font-weight: 700;
          font-size: 1.05rem;
          letter-spacing: 0.03em;
        }
        .hero__menu {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 30px;
          padding: 8px 0;
          background: none;
          border: none;
          cursor: pointer;
        }
        .hero__menu span {
          display: block;
          height: 2px;
          background: var(--ink);
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .hero__menu:hover span:first-child { transform: translateX(4px); }
        .hero__menu:hover span:last-child { transform: translateX(-4px); }
        .hero__menu:focus-visible {
          outline: 2px solid var(--blue);
          outline-offset: 4px;
        }

        /* Content — top-aligned, single column */
        .hero__content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 1040px;
        }

        .hero__headline {
          margin: 0;
          font-weight: 600;
          font-size: clamp(2.75rem, 6.4vw, 5.4rem);
          line-height: 1.05;
          letter-spacing: -0.01em;
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
        .scramble-char {
          display: inline-block;
          text-align: center;
          transition: filter 0.16s ease, opacity 0.16s ease,
            color 0.2s ease, transform 0.16s ease;
          filter: blur(0);
          opacity: 1;
        }
        .scramble-char.is-flip {
          filter: blur(3px);
          opacity: 0.55;
          transform: translateY(-2px);
        }
        /* color only hits on the flip right before a letter settles —
           see ScrambleHeadline's tick loop */
        .scramble-char.is-spark {
          color: var(--accent, var(--blue));
        }

        .hero__sub {
          margin: 24px 0 0;
          max-width: 46ch;
          font-size: 1.1rem;
          line-height: 1.6;
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

        .hero__actions {
          display: flex;
          align-items: center;
          gap: 26px;
          margin-top: 34px;
          flex-wrap: wrap;
        }
        .hero__cta {
          font-family: var(--font);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--paper);
          background: var(--ink);
          border: none;
          border-radius: 999px;
          padding: 15px 28px;
          cursor: pointer;
          transition: background 0.35s cubic-bezier(.4,0,.2,1), box-shadow 0.35s ease;
          box-shadow: 0 0 0 0 rgba(20, 20, 28, 0);
          will-change: transform, opacity, filter;
        }
        .hero__cta:hover {
          background: var(--blue);
          box-shadow: 0 14px 30px -12px rgba(42, 68, 255, 0.55);
        }
        .hero__cta:focus-visible {
          outline: 2px solid var(--blue);
          outline-offset: 3px;
        }

        .hero__link {
          position: relative;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--ink);
          text-decoration: none;
          padding-bottom: 2px;
          will-change: transform, opacity, filter;
        }
        .hero__link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background: var(--line);
        }
        .hero__link::before {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background: var(--blue);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(.4,0,.2,1);
        }
        .hero__link:hover { color: var(--blue); }
        .hero__link:hover::before { transform: scaleX(1); }
        .hero__link:focus-visible {
          outline: 2px solid var(--blue);
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .scramble-char, .hero__cta, .hero__link::before { transition: none; }
        }
      `}</style>

      <header className="hero__nav">
        <span className="hero__mark" ref={navMarkRef}>
          ZARRAR
        </span>
        <button className="hero__menu" ref={navMenuRef} aria-label="Open menu">
          <span />
          <span />
        </button>
      </header>

      <div className="hero__content">
        <h1 className="hero__headline" ref={headlineRef}>
          <ScrambleHeadline lines={HEADLINE_LINES} />
        </h1>

        <p className="hero__sub" ref={subRef}>
          <span aria-hidden="true">
            {SUB_COPY.split(" ").map((word, i) => (
              <span className="word-mask" key={i}>
                <span className="word-inner">{word}&nbsp;</span>
              </span>
            ))}
          </span>
          <span className="sr-only">{SUB_COPY}</span>
        </p>

        <div className="hero__actions">
          <button className="hero__cta" ref={ctaRef}>
            Start a project
          </button>
          <a href="#work" className="hero__link" ref={linkRef}>
            See recent work
          </a>
        </div>
      </div>
    </section>
  );
});

const SCRAMBLE_GLYPHS = "!<>{}[]/\\=+*^?#%&~";
const SPARK_COLORS = ["var(--red)", "var(--blue)", "var(--gold)"];
const HOVER_RADIUS = 70; // px, how close the cursor has to be to wake a letter
const DECODE_FLIPS = 4; // glyph flips a letter runs through before it settles
const FLIP_MS = 46; // base time between flips
const FLIP_EASE = 18; // ms added per flip — makes the decode decelerate

/**
 * Renders `lines` as one letter-per-span. When the cursor first comes
 * within HOVER_RADIUS of a letter, that letter runs a short, decelerating
 * "decode": a few glyph flips, each crossfaded through a blur, landing
 * back on the real character. Only the flip immediately before settling
 * carries an accent color — a single spark at the moment of resolving,
 * rather than color on every flip (which reads as noise once several
 * letters are decoding at once). Letters only re-trigger when the cursor
 * leaves and re-enters their radius, so a stationary cursor settles
 * instead of flickering forever, and a moving cursor reads as a wave of
 * letters waking up in sequence. Everything is direct DOM writes on a
 * rAF loop (no React state) so it stays smooth. Each letter's box width
 * is measured and locked after mount so swapping glyphs never reflows
 * the line.
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
    // instant (Space Grotesk loads via @import with font-display:swap,
    // so there's always a fallback-font frame first); re-measuring a
    // second time after the swap is what used to cause a visible jolt
    // of its own. Waiting for document.fonts.ready and only measuring
    // once means there's nothing left to correct later.
    const settle = () => {
      lockWidths();
      measure();
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
    const handleScroll = () => measure();
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
            el.style.removeProperty("--accent");
            st.decoding = false;
          } else {
            const glyph =
              SCRAMBLE_GLYPHS[(Math.random() * SCRAMBLE_GLYPHS.length) | 0];
            el.textContent = glyph;
            if (isSpark) {
              const accent =
                SPARK_COLORS[(Math.random() * SPARK_COLORS.length) | 0];
              el.style.setProperty("--accent", accent);
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
                    <span className="scramble-word">
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
