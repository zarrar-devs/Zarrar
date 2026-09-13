"use client";

import {
  cloneElement,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import "./Preloader.css";

/**
 * Preloader — v2 (+ scrollbar-gutter fix)
 *
 * What changed vs the old version, and why:
 *
 * 1. THE SKELETON NOW MATCHES THE REAL PAGE.
 *    The old skeleton previewed a three-panel layout (email / browser /
 *    services blocks) that doesn't exist anymore — the current Hero is a
 *    single left-aligned column. Loading UI that foreshadows the wrong
 *    layout reads as a bug, not a preview. The stage below mirrors the
 *    real hero exactly (same padding, same block order: nav → headline
 *    x2 → sub x2 → CTA + link), positioned at the same coordinates as
 *    the real content so the wipe reads as "the sketch sharpens into the
 *    real thing" rather than two unrelated screens swapping.
 *
 * 2. REF-FORWARDING IS NO LONGER MANUAL.
 *    The old version required the parent to pass the *same* ref object
 *    both to <Preloader heroRef={...}> and to the child it renders
 *    inside — easy to get out of sync. This version clones `children`
 *    itself and attaches the ref for you. You can still pass an external
 *    heroRef if some other part of your app needs it too; it'll stay in
 *    sync automatically.
 *
 * 3. THE REVEAL HANDS OFF TO THE PAGE.
 *    At the moment the mask wipes away, Preloader now injects a
 *    `revealed` prop into the child. Your page component (see Hero.jsx)
 *    can use that to run one last, subtle settle-in on its own content —
 *    so the grow-back doesn't look like a static image scaling up, it
 *    looks like the page is arriving.
 *
 * 4. COUNTER + TIMING POLISH.
 *    - The "glitch" digit only re-rolls when the *integer* value changes
 *      (previously every animation frame — 60×/sec — which made it look
 *      like flicker/jank rather than an intentional effect).
 *    - A hairline progress bar reinforces the percentage without
 *      competing with it.
 *    - Shrink/grow now use expo easing instead of power3 for a snappier,
 *      more premium settle, and the dark dip gets a very faint grain
 *      texture instead of a flat fill (see Preloader.css).
 *    - Total runtime is ~10% tighter.
 *
 * 5. CLICKS ARE NOW BLOCKED CORRECTLY WHILE LOADING.
 *    The mask (not the outer panel) owns pointer-events, so the real
 *    page underneath can't be clicked while it's covered, but becomes
 *    interactive the instant the wipe finishes — not a beat later, when
 *    the whole outro timeline finally completes.
 *
 * 6. FONT-SWAP JOLT, FIXED.
 *    Space Grotesk loads via @import with font-display:swap, so the
 *    fallback font can still be showing when the intro starts. The
 *    timeline now waits for document.fonts.ready (capped at 800ms) before
 *    it starts counting, so if a swap happens it happens while the
 *    loading screen still covers everything — not mid-count or right
 *    after reveal. Hero.jsx's headline measurement got the matching fix
 *    (see its file header).
 *
 * 7. prefers-reduced-motion is respected: the whole sequence is skipped
 *    and the page is handed over instantly.
 *
 * 8. SCROLLBAR-GUTTER RESERVATION — belt and suspenders (see Preloader.css).
 *    Reserving space for the scrollbar matters because while the intro
 *    plays, body scroll is locked (overflow: hidden) and the viewport is
 *    at its full, unconstrained width. The instant `finish()` flips
 *    overflow back to `auto`, the page's real (taller-than-viewport)
 *    content makes a scrollbar appear — narrowing the usable viewport
 *    width and firing a `resize` event, which is exactly the kind of
 *    event a layout bug could hook into and mis-handle. Reserving the
 *    gutter unconditionally, from the first stylesheet parse (in CSS,
 *    not toggled via JS at some later, timing-dependent moment), means
 *    the layout width is identical whether or not a scrollbar is
 *    actually drawn — nothing shifts and no resize fires when scroll
 *    unlocks. See Preloader.css for the actual mechanism (it no longer
 *    lives here as a JS side effect).
 *
 * Props:
 *  - onDone: called once the whole intro has finished
 *  - heroRef: optional external ref if you need the hero element
 *    elsewhere too (Preloader always attaches its own ref regardless)
 *  - children: your real page (e.g. <Hero/>) — a single element that
 *    accepts a ref and, ideally, a `revealed` boolean prop
 */
export default function Preloader({ heroRef: externalHeroRef, onDone, children }) {
  const heroElRef = useRef(null);
  const bgRef = useRef(null);
  const panelRef = useRef(null);
  const maskRef = useRef(null);
  const frameRef = useRef(null);
  const labelRef = useRef(null);
  const counterWrapRef = useRef(null);
  const counterTextRef = useRef(null);
  const progressRef = useRef(null);
  const skeletonRefs = useRef([]);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  // Custom cursor lives here, not inside Hero — it must be a sibling of
  // the element Preloader scales (heroEl), never a descendant of it.
  // Nesting it inside Hero would make it position:fixed *relative to
  // heroEl* the moment heroEl gets a CSS transform (during the shrink/
  // grow phases below), which makes a fixed-position child track the
  // transformed ancestor instead of the viewport — the cursor would
  // visibly jump/scale with the intro. Living out here sidesteps that
  // entirely.
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (reduceMotion || !canHover) return;

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });

    const handleMove = (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };
    // delegated (not per-element), so it keeps working as Hero's content
    // changes without needing to re-bind anything
    const handleOver = (e) => {
      if (e.target.closest("a, button")) ring.classList.add("is-active");
    };
    const handleOut = (e) => {
      if (e.target.closest("a, button")) ring.classList.remove("is-active");
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, []);

  // Stable identity (useCallback) on purpose: `revealed` flips once via
  // setState below, which re-renders this component and re-clones the
  // child. A ref callback with a new identity on every render gets
  // detached-and-reattached by React each time; keeping this one stable
  // means the DOM ref only attaches once, at mount.
  const setHeroEl = useCallback(
    (node) => {
      heroElRef.current = node;
      if (typeof externalHeroRef === "function") externalHeroRef(node);
      else if (externalHeroRef) externalHeroRef.current = node;
    },
    [externalHeroRef]
  );

  useLayoutEffect(() => {
    const heroEl = heroElRef.current;
    const counterWrap = counterWrapRef.current;
    const counterText = counterTextRef.current;
    const skeletonEls = skeletonRefs.current.filter(Boolean);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    document.body.style.overflow = "hidden";
    if (heroEl) {
      Object.assign(heroEl.style, {
        position: "fixed",
        inset: "0",
        zIndex: 901,
        transformOrigin: "50% 50%",
      });
    }

    const finish = () => {
      document.body.style.overflow = "auto";
      if (heroEl) {
        heroEl.style.position = "";
        heroEl.style.inset = "";
        heroEl.style.zIndex = "";
        heroEl.style.transform = "";
      }
      gsap.set([bgRef.current, panelRef.current, frameRef.current], {
        display: "none",
      });
      onDone?.();
    };

    if (reduceMotion) {
      setRevealed(true);
      finish();
      return;
    }

    let cancelled = false;
    let tl = null;

    function start() {
      if (cancelled) return;

      const revealedThresholds = new Set();
      const glitchChars = ["/", "\\", "-", ";", ":", "#", "*", "+"];

      let lastRounded = -1;
      function paintCounter(rawValue) {
        const value = Math.min(100, Math.max(0, rawValue));
        const rounded = Math.round(value);

        if (rounded !== lastRounded) {
          lastRounded = rounded;
          const showGlitch = rounded < 100 && Math.random() < 0.1;
          const symbol = showGlitch
            ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
            : "%";
          counterText.textContent = `${rounded}${symbol}`;
        }

        counterWrap.style.left = `${value}%`;
        counterWrap.style.transform = `translateX(-${value}%)`;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${value / 100})`;
        }

        skeletonEls.forEach((el) => {
          const threshold = Number(el.dataset.threshold || 0);
          if (value >= threshold && !revealedThresholds.has(el)) {
            revealedThresholds.add(el);
            gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
          }
        });
      }

      gsap.set(skeletonEls, { opacity: 0, y: 10 });
      gsap.set(frameRef.current, { opacity: 0 });
      gsap.set(bgRef.current, { backgroundColor: "var(--bg)" });
      gsap.set(maskRef.current, { yPercent: 0 });
      // hero is left at its natural scale (1) here — it must always
      // match the panel's CURRENT scale, never a separately-chosen
      // "small" value that then has to catch up.

      const counter = { value: 0 };
      tl = gsap.timeline({ onComplete: finish });

      // --- 1. entrance + count ---
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
      tl.to(
        counter,
        {
          value: 100,
          duration: 2.2,
          ease: "power2.inOut",
          onUpdate: () => paintCounter(counter.value),
        },
        "<"
      );
      tl.to({}, { duration: 0.18 });

      // --- 2. fade chrome, dip dark, shrink the (still opaque) window ---
      tl.to(
        [labelRef.current, counterWrapRef.current, progressRef.current, ...skeletonEls],
        { opacity: 0, y: -8, duration: 0.32, stagger: 0.012, ease: "power1.in" }
      );
      tl.to(
        bgRef.current,
        {
          backgroundColor: "#0a0a0a",
          duration: 0.48,
          ease: "power2.inOut",
          onStart: () => bgRef.current.classList.add("is-dark"),
        },
        "<0.04"
      );
      tl.to(
        [panelRef.current, heroEl].filter(Boolean),
        { scale: 0.82, duration: 0.6, ease: "expo.inOut" },
        "<"
      );
      tl.to(
        frameRef.current,
        { opacity: 1, duration: 0.35, ease: "power1.out" },
        "<0.1"
      );
      tl.to({}, { duration: 0.16 });

      // --- 3. wipe the mask away (slide, not fade) to reveal real content ---
      tl.addLabel("reveal");
      tl.to(
        maskRef.current,
        { yPercent: -100, duration: 0.68, ease: "expo.inOut" },
        "reveal"
      );
      // hand off to the page's own settle-in the instant the wipe starts
      tl.call(() => setRevealed(true), null, "reveal+=0.05");
      tl.set(maskRef.current, { display: "none" });

      // --- 4. grow back out, dissolve the frame + dark backdrop ---
      tl.to(
        [panelRef.current, heroEl].filter(Boolean),
        { scale: 1, duration: 0.95, ease: "expo.out" },
        "reveal+=0.14"
      );
      tl.to(
        [frameRef.current, bgRef.current],
        { opacity: 0, duration: 0.48, ease: "power1.inOut" },
        "-=0.42"
      );
    }

    // Don't start counting until the page's webfont has actually
    // loaded (capped at 800ms so a slow font never holds up the intro
    // for long). Space Grotesk loads via @import with font-display:swap,
    // so without this gate the fallback font can still be showing when
    // the counter/label first paint, and the real font can swap in at
    // any point afterwards — including mid-count or right after reveal,
    // which reads as a jolt. Waiting here means the swap (if any) always
    // happens while the loading screen is still covering the page.
    const fontsReady =
      document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve();
    const timeout = new Promise((resolve) => setTimeout(resolve, 800));
    Promise.race([fontsReady, timeout]).then(start);

    return () => {
      cancelled = true;
      tl?.kill();
      document.body.style.overflow = "auto";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addSkeletonRef = (el, threshold) => {
    if (el && !skeletonRefs.current.includes(el)) {
      el.dataset.threshold = threshold;
      skeletonRefs.current.push(el);
    }
  };

  const child = cloneElement(children, { ref: setHeroEl, revealed });

  return (
    <>
      <div className="preloader__bg" ref={bgRef} />

      {/* your real page — rendered here, not as a sibling of
          <Preloader/>, so it shares this stacking context */}
      {child}

      <div className="preloader__panel" ref={panelRef}>
        <div className="preloader__mask" ref={maskRef}>
          <div className="stage" aria-hidden="true">
            {/* mirrors Hero's real structure 1:1 — see file header */}
            <div className="sk-nav-row">
              <div
                className="sk sk--nav"
                ref={(el) => addSkeletonRef(el, 4)}
              />
              <div
                className="sk sk--menu"
                ref={(el) => addSkeletonRef(el, 4)}
              />
            </div>
            <div className="sk-headline-block">
              <div
                className="sk sk--headline w1"
                ref={(el) => addSkeletonRef(el, 18)}
              />
              <div
                className="sk sk--headline w2"
                ref={(el) => addSkeletonRef(el, 32)}
              />
            </div>
            <div
              className="sk sk--sub w1"
              ref={(el) => addSkeletonRef(el, 48)}
            />
            <div
              className="sk sk--sub w2"
              ref={(el) => addSkeletonRef(el, 58)}
            />
            <div className="sk-actions">
              <div
                className="sk sk--pill"
                ref={(el) => addSkeletonRef(el, 74)}
              />
              <div
                className="sk sk--linkbar"
                ref={(el) => addSkeletonRef(el, 84)}
              />
            </div>
          </div>

          <div className="preloader__chrome">
            <span className="preloader__label" ref={labelRef}>
              Loading
            </span>
            <div className="preloader__counter" ref={counterWrapRef}>
              <span ref={counterTextRef}>0%</span>
            </div>
            <div className="preloader__progress">
              <i ref={progressRef} />
            </div>
          </div>
        </div>
      </div>

      {/* fixed-size, does not scale — stays put while the panel
          shrinks inside it */}
      <div className="preloader__frame" ref={frameRef} aria-hidden="true" />

      {/* desktop-only, respects prefers-reduced-motion (see effect above) */}
      <div className="cursor-ring" ref={cursorRingRef} aria-hidden="true" />
      <div className="cursor-dot" ref={cursorDotRef} aria-hidden="true" />
    </>
  );
}
