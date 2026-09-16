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
 * Hero — v7
 *
 * What changed vs v6:
 *  - The three-image collage is gone (kept adding weight without
 *    earning it — pulled per feedback). Back to a pure-typography hero.
 *  - .hero is now a flex column with min-height: 100dvh (100vh fallback)
 *    and .hero__stage centers .hero__content vertically in the space
 *    below the nav — previously the section just grew as tall as its
 *    content needed and the copy could end up sitting low/off-balance
 *    on short viewports. Now it always reads as one composed screen.
 *  - Headline now has its own display face (Bricolage Grotesque, via
 *    an @import — see the CSS for a note on moving this to next/font)
 *    distinct from the Space Grotesk body copy, per "two families,
 *    clearly distinct."
 *  - The load-in is no longer just the headline's mask-reveal: once
 *    ScrambleHeadline finishes measuring (see its settle()), it also
 *    fires a one-time decode wave across every letter — reusing its
 *    own hover-decode mechanism, just triggered by mount instead of
 *    the cursor. So letters are still resolving out of glyph-noise as
 *    their word rises out of its mask. That's additive: nothing about
 *    the existing hover-decode trigger changed.
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

const SUB_COPY =
  "A design studio building websites, email systems, and identities for brands that don't blend in.";

// Stable reference on purpose — see ScrambleHeadline's setup effect for
// why. Never inline this array literal directly into <ScrambleHeadline lines={...}/>.
const HEADLINE_LINES = ["Interfaces worth staying on.", "Inboxes worth opening."];

const Hero = forwardRef(function Hero({ revealed = true }, ref) {
  const navMarkRef = useRef(null);
  const navMenuRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);

  // Hide nav + headline + sub-copy words up front *only* if
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

  return (
    <section className="hero" ref={ref}>
      <style>{`
        /* Display face for the headline only — body copy stays on the
           existing Space Grotesk. This @import is the quick, drop-in
           way to get a second family into a single component file;
           it's render-blocking, so once this settles, move it into
           next/font/google in your root layout (that also lets you
           drop this @import and the manual font-display entirely) and
           expose it the same way --font-space-grotesk is already
           exposed, e.g. as --font-bricolage. */
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap');

        .hero {
          --paper: #FFFFFF;
          --ink: #14141c;
          --ink-soft: #57575f;
          --line: rgba(20, 20, 28, 0.14);
          --red: #e6432f;
          --blue: #2a44ff;
          --gold: #c98d00;
          --font: var(--font-space-grotesk), ui-sans-serif, system-ui,
            -apple-system, "Segoe UI", sans-serif;
          --font-display: "Bricolage Grotesque", var(--font);

          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          min-height: 100dvh;
          background: var(--paper);
          color: var(--ink);
          font-family: var(--font);
          padding: 28px clamp(20px, 4vw, 56px) clamp(56px, 8vw, 96px);
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
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--line);
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

        /* Content — centered, single column, vertically centered in
           whatever height is left below the nav. min-height on .hero
           (not height) means this still just grows taller — never
           clips — if the headline wraps onto extra lines on a narrow
           viewport. */
        .hero__stage {
          position: relative;
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

        .hero__headline {
          margin: 0;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(2.75rem, 7vw, 6.5rem);
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
    padding-top: 80px;
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
        <span className="hero__mark" ref={navMarkRef}>
          ZARRAR
        </span>
        <button className="hero__menu" ref={navMenuRef} aria-label="Open menu">
          <span />
          <span />
        </button>
      </header>

      <div className="hero__stage">
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
const INTRO_STAGGER_MS = 22; // ms between each letter starting its on-load decode

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
    // instant (Space Grotesk loads via @import with font-display:swap,
    // so there's always a fallback-font frame first); re-measuring a
    // second time after the swap is what used to cause a visible jolt
    // of its own. Waiting for document.fonts.ready and only measuring
    // once means there's nothing left to correct later.
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
