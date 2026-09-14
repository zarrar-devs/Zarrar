"use client";

/**
 * Requires: npm install gsap@latest lenis   (v3.13+ — SplitText is bundled & free)
 *
 * next.config.js — needed because inline images use next/image with a remote host:
 *   images: { remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }] }
 *   (swap picsum for your real, self-hosted assets before shipping — a third-party
 *    image host on the critical path hurts LCP, which hurts SEO.)
 *
 * ── What changed vs the previous version (round 8) ────────────────────────────
 * FAST-SCROLL BUG — on a fast fling/trackpad swipe, the "Who are we?"
 * intro (and sometimes the lede/capability reveals) would never fully
 * play, or would appear to not trigger at all, and the whole pinned
 * timeline felt broken at speed. Root cause: `scrub: 1` on a long
 * (3.4 viewport-heights) pinned timeline gives the tween up to a full
 * second of lag behind the actual scroll position. On a fast scroll the
 * real scroll position can blow straight through (or past) the pin's end
 * before the smoothed tween ever catches up, so the section unpins with
 * animations mid-flight / never started. Two changes fix this:
 *
 * 1) `fastScrollEnd: true` added to ScrollTrigger.config — tells GSAP
 *    that above a velocity threshold, a scrub tween should snap straight
 *    to its target progress instead of continuing to smooth-lag toward
 *    it. This is the actual fix for "animation doesn't play on fast
 *    scroll".
 * 2) `scrub` dropped from 1 -> 0.35 — a full second of smoothing was
 *    always too loose for a 3.4vh timeline; 0.35 stays smooth but tracks
 *    the scrollbar far more tightly, so there's much less lag to blow
 *    through in the first place.
 *
 * These two together fix the animation itself. For the *input* side —
 * i.e. stopping the browser from ever registering a huge, discontinuous
 * scroll jump on a fast trackpad fling/wheel flick in the first place —
 * pair this component with the SmoothScrollProvider (Lenis) at the app
 * root. See SmoothScrollProvider.jsx — wrap it around {children} in your
 * root layout once; you don't need to touch it per-section.
 *
 * ── Round 7 recap (still current) ──────────────────────────────────────────
 * Blur-reveal on every capability photo (including the first), real alt
 * text wired into next/image, and JSON-LD structured data for the three
 * services.
 *
 * ── Round 6 recap (still current) ──────────────────────────────────────────
 * Fixed the black-flash-on-load, the portrait crop of landscape photos,
 * the plain crossfade (now a directional clip-path wipe + Ken-Burns pop),
 * and row alignment (centered instead of baseline).
 *
 * Everything else (SplitText intro heading, the lede reveal, the closing
 * line, the background rings + cursor parallax, and the
 * prefers-reduced-motion / no-JS handling via matchMedia) is untouched.
 */

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { Space_Grotesk, Manrope } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./WhoAreWe.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  // ignoreMobileResize: don't refresh ScrollTrigger on the address-bar-hide
  // resize that mobile browsers fire on scroll.
  // fastScrollEnd: on a fast fling, snap a scrub tween straight to its
  // target progress instead of continuing to smooth-lag toward it — this
  // is what stops the intro/lede/capability reveals from being skipped or
  // left mid-animation when someone scrolls quickly.
  ScrollTrigger.config({ ignoreMobileResize: true, fastScrollEnd: true });
}

// Self-hosted, deliberately-paired fonts (next/font — no external request,
// no layout shift). Display font carries the headline, the lede and the
// capability labels; body font carries the descriptions and closing line.
const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--waw-font-display",
  display: "swap",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--waw-font-body",
  display: "swap",
});

// Timeline is 0..1 across the whole pinned scroll. Acts overlap slightly at
// their edges so there's no point where you scroll and nothing happens.
// This is the LAST act of the story — the section settles and stays put;
// there's no exit-left. Once progress hits 1, ScrollTrigger just unpins and
// normal page scroll carries on underneath it, like any other section.
const PHASE = {
  introSlide: [0, 0.2],
  introReveal: [0.02, 0.12],
  storySlide: [0.17, 0.36],
  ledeReveal: [0.24, 0.34],
  capabilitiesReveal: [0.3, 0.42],
  cap1: [0.5, 0.62],
  cap2: [0.64, 0.76],
  cap3: [0.78, 0.9],
  closingReveal: [0.88, 0.98],
};
const span = (k) => PHASE[k][1] - PHASE[k][0];
const TOTAL_VH = 3.4; // viewport-heights of scroll the whole story consumes
const BUFFER = 80;
const PROGRESS_TRACK_PX = 120; // keep in sync with .waw-progress height in the CSS
const PROGRESS_DOT_PX = 8; // keep in sync with .waw-progress-dot size in the CSS

// The lede is the one idea worth saying big. Kept to two short lines on
// purpose — everything else lives in the capability list below it.
const LEDE_LINES = [
  { text: "From qualified leads to a digital presence people actually trust,", accent: false },
  { text: "we're the team that runs the whole engine.", accent: true },
];

const CAPABILITIES = [
  {
    label: "Email marketing",
    mark: "01",
    description: "Campaigns people actually open, click, and remember.",
    media: {
      type: "image",
      src: "/email-marketing.png",
      alt: "Email marketing campaign preview",
    },
  },
  {
    label: "Lead generation",
    mark: "02",
    description: "Funnels engineered to turn visits into qualified leads.",
    media: {
      type: "image",
      src: "/graphic-design.png",
      alt: "Lead generation funnel dashboard",
    },
  },
  {
    label: "Web development",
    mark: "03",
    description: "Fast, conversion-ready sites built to hold up at scale.",
    media: {
      type: "image",
      // Swap for your own self-hosted, compressed (ideally <1MB, no audio
      // track) clip before shipping — this MDN clip is a public-domain
      // placeholder so the layout is real end-to-end.
      src: "/web-development.png",
      alt: "Responsive web development project preview",
    },
  },
];

const CLOSING_TEXT =
  "We pair data-driven strategy with conversion-focused design, so every " +
  "campaign, funnel and website we ship actually moves the needle for " +
  "your business.";

// Reveal direction for the stage photo wipe — mirrors the row fill's
// left-anchored scaleX, so the two "spotlight" motions read as one idea.
const HIDDEN_CLIP = "inset(0% 0% 0% 100%)";
const VISIBLE_CLIP = "inset(0% 0% 0% 0%)";

// Structured data so search engines can read the three services directly,
// independent of the scroll-linked reveal animation.
const SERVICES_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: CAPABILITIES.map((cap, i) => ({
    "@type": "Service",
    position: i + 1,
    name: cap.label,
    description: cap.description,
  })),
};

export default function WhoAreWe() {
  const pinRef = useRef(null);
  const stageRef = useRef(null);
  const introRestRef = useRef(null);
  const highlightRef = useRef(null);
  const storyRef = useRef(null);
  const ledeLineRefs = useRef([]);
  const capabilityBlockRef = useRef(null);
  const capabilitiesListRef = useRef(null);
  const mediaStageRef = useRef(null);
  const closingRef = useRef(null);
  const webVideoRef = useRef(null);
  const ringsLayerRef = useRef(null);
  const progressDotRef = useRef(null);
  const progressTrackRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        isMobile: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { isDesktop } = context.conditions;

        const pin = pinRef.current;
        const stage = stageRef.current;
        const introRest = introRestRef.current;
        const highlight = highlightRef.current;
        const story = storyRef.current;
        const ledeLines = ledeLineRefs.current.filter(Boolean);
        const closing = closingRef.current;
        const ringsLayer = ringsLayerRef.current;
        const progressDot = progressDotRef.current;
        const introEl = introRest.closest(".waw-intro");

        // Row-level pieces (queried from the <ul> only).
        const capabilityItems = capabilitiesListRef.current.querySelectorAll(".waw-capability");
        const fills = capabilitiesListRef.current.querySelectorAll(".waw-capability-fill");
        const capLabels = capabilitiesListRef.current.querySelectorAll(".waw-capability-label");
        const capDescs = capabilitiesListRef.current.querySelectorAll(".waw-capability-desc");
        const capIndices = capabilitiesListRef.current.querySelectorAll(".waw-capability-index");
        // The shared photo/video stack (queried from the stage only) — the
        // wrapper divs (clip-path drives their reveal) and, separately, the
        // <img>/<video> inside each one (scale drives the Ken-Burns pop).
        const stageMedia = mediaStageRef.current.querySelectorAll(".waw-capability-media");
        const stageMediaInner = mediaStageRef.current.querySelectorAll(
          ".waw-capability-media img, .waw-capability-media video"
        );
        // Stage + rows fade in together as one group at capabilitiesReveal.
        const revealTargets = [mediaStageRef.current, ...capabilityItems];

        const rings = ringsLayer.querySelectorAll(".waw-ring");
        const startVideo = () => webVideoRef.current?.play?.().catch(() => {});
        // Slightly lighter blur on mobile — cheaper to composite on weaker GPUs.
        const blurPx = isDesktop ? 16 : 10;
        const blurHidden = `blur(${blurPx}px)`;
        const blurVisible = "blur(0px)";
        const blurOut = `blur(${Math.round(blurPx * 0.4)}px)`;
        let parallaxCleanup = () => {};
        let tl; // assigned in the desktop branch; activateCapability() only runs there

        const splitRest = new SplitText(introRest, { type: "chars", charsClass: "waw-char" });
        const chars = splitRest.chars;

        gsap.set(chars, {
          y: (i) => (i % 2 === 0 ? "0.5em" : "-0.5em"),
          rotateZ: () => gsap.utils.random(-6, 6),
          opacity: 0,
          filter: "blur(10px)",
        });
        gsap.set(highlight, { autoAlpha: 0, x: -40 });
        gsap.set(ledeLines, { yPercent: 130, opacity: 0 });
        gsap.set(revealTargets, { opacity: 0, y: "1.4rem", filter: "blur(10px)" });
        gsap.set(fills, { scaleX: 0 });
        gsap.set(closing, { opacity: 0, y: "1rem", filter: "blur(6px)" });

        // Stage photos: hidden by default, EXCEPT the first — it stays
        // visible (and at rest, no zoom) from mount straight through the
        // capabilitiesReveal fade-in, so there is never a moment where the
        // (black) stage background is showing with nothing on top of it.
        // Every photo — including the first — starts softly blurred; it
        // only sharpens once its own row lights up, so unblurring reads as
        // "this one's active now" rather than the photo just sitting there
        // finished before the section has introduced it.
        gsap.set(stageMedia, { clipPath: HIDDEN_CLIP, opacity: 1 });
        gsap.set(stageMedia[0], { clipPath: VISIBLE_CLIP });
        gsap.set(stageMediaInner, { scale: 1.18, filter: blurHidden });
        gsap.set(stageMediaInner[0], { scale: 1, filter: blurHidden });

        // Light up row i: black fill wipes in, its text flips white, and its
        // photo takes over the stage. Whenever i > 0, the SAME beat sends
        // row i-1 back to its resting look — so the highlight always reads
        // as one spotlight handing off down the list, never as two rows lit
        // (or none) at once. Row 0 is the exception: its photo is already
        // resting in the stage from mount (see above), so lighting it up
        // only needs the row styling plus a small confirm pop on the photo
        // — not a full wipe-in.
        const activateCapability = (i, phaseKey) => {
          const [start] = PHASE[phaseKey];
          const dur = span(phaseKey);
          const snap = dur * 0.4;
          // The photo wipe is deliberately a touch slower than the row's
          // fill-snap so the handoff reads as a considered sweep rather
          // than a blink — the row still "arrives" quickly, the photo
          // follows through.
          const wipe = dur * 0.65;

          tl.to(fills[i], { scaleX: 1, ease: "power4.out", duration: snap }, start)
            .to(capLabels[i], { color: "#ffffff", ease: "power2.out", duration: snap }, start)
            .to(capDescs[i], { color: "rgba(255,255,255,0.78)", ease: "power2.out", duration: snap }, start)
            .to(capIndices[i], { color: "#ffffff", ease: "power2.out", duration: snap }, start);

          if (i === 0) {
            // Row 0's photo is already resting in the stage — this is a
            // blur→sharp reveal plus a small confirm pop, not a wipe (there's
            // nothing to wipe over yet).
            tl.fromTo(
              stageMediaInner[0],
              { scale: 1.04, filter: blurHidden },
              { scale: 1, filter: blurVisible, ease: "power2.out", duration: wipe },
              start
            );
          } else {
            // Incoming photo sweeps in left-to-right, covering the previous
            // one as it goes, sharpening out of a soft blur with a slight
            // zoom-out pop on the image itself.
            tl.fromTo(
              stageMedia[i],
              { clipPath: HIDDEN_CLIP },
              { clipPath: VISIBLE_CLIP, ease: "power4.inOut", duration: wipe },
              start
            ).fromTo(
              stageMediaInner[i],
              { scale: 1.18, filter: blurHidden },
              { scale: 1, filter: blurVisible, ease: "power3.out", duration: wipe },
              start
            );

            // Outgoing photo: a small push-back scale + soft blur starts
            // immediately (visible briefly through the not-yet-wiped
            // portion), and it fades the rest of the way out timed to
            // finish exactly as the wipe finishes covering it — never
            // leaving a gap where the (black) stage background could show
            // through.
            tl.to(
              stageMediaInner[i - 1],
              { scale: 1.08, filter: blurOut, ease: "power2.in", duration: wipe },
              start
            ).to(
              stageMedia[i - 1],
              { opacity: 0, ease: "power2.in", duration: wipe * 0.45 },
              start + wipe * 0.55
            );
          }

          if (i > 0) {
            tl.to(fills[i - 1], { scaleX: 0, ease: "power3.inOut", duration: snap }, start)
              .to(capLabels[i - 1], { color: "#0a0a0a", ease: "power2.inOut", duration: snap }, start)
              .to(capDescs[i - 1], { color: "rgba(10,10,10,0.46)", ease: "power2.inOut", duration: snap }, start)
              .to(capIndices[i - 1], { color: "rgba(10,10,10,0.46)", ease: "power2.inOut", duration: snap }, start);
          }
        };

        if (isDesktop) {
          pin.classList.add("is-marquee");
          stage.classList.add("is-marquee");
          progressTrackRef.current?.classList.add("is-visible");

          tl = gsap.timeline({
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: () => `+=${Math.round(window.innerHeight * TOTAL_VH)}`,
              // Was 1 — a full second of smoothing on a 3.4vh timeline let
              // fast scrolls blow past the pin before the tween caught up,
              // which is what made the intro/lede/capability reveals look
              // like they "didn't play" on quick scrolls. 0.35 keeps the
              // scrub feel but tracks the scrollbar far more tightly.
              scrub: 0.35,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                gsap.set(progressDot, { y: self.progress * (PROGRESS_TRACK_PX - PROGRESS_DOT_PX) });
              },
            },
          });

          // Act 1 — "Who are we?" (unchanged)
          tl.fromTo(
            introEl,
            { x: () => window.innerWidth + BUFFER },
            { x: () => -(introEl.offsetWidth + BUFFER), ease: "none", duration: span("introSlide") },
            PHASE.introSlide[0]
          );
          tl.to(
            chars,
            {
              y: 0,
              opacity: 1,
              rotateZ: 0,
              filter: "blur(0px)",
              ease: "power2.out",
              duration: span("introReveal"),
              stagger: span("introReveal") / (chars.length * 1.4),
            },
            PHASE.introReveal[0]
          ).to(
            highlight,
            { autoAlpha: 1, x: 0, ease: "power3.out", duration: span("introReveal") * 0.8 },
            PHASE.introReveal[0]
          );

          // Act 2 — the story panel slides in and settles centred (pin/hold spot)
          tl.fromTo(
            story,
            { x: () => window.innerWidth + BUFFER },
            { x: 0, ease: "power2.out", duration: span("storySlide") },
            PHASE.storySlide[0]
          );
          tl.to(
            ledeLines,
            {
              yPercent: 0,
              opacity: 1,
              ease: "power3.out",
              duration: span("ledeReveal"),
              stagger: 0.12,
            },
            PHASE.ledeReveal[0]
          );
          tl.to(
            revealTargets,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              ease: "power2.out",
              duration: span("capabilitiesReveal"),
              stagger: 0.08,
              onStart: startVideo, // only fetch/play the clip once it's actually revealed
            },
            PHASE.capabilitiesReveal[0]
          );

          // Act 3 — HOLD (no x movement, and nothing exits after this — this
          // is the last act). Keep scrolling to hand the spotlight down the
          // list, then once progress reaches 1 the pin simply releases and
          // normal page scroll continues with the section resting exactly
          // where it is (last row + its photo stay lit).
          activateCapability(0, "cap1");
          activateCapability(1, "cap2");
          activateCapability(2, "cap3");

          tl.to(
            closing,
            { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: span("closingReveal") },
            PHASE.closingReveal[0]
          );

          // Quiet background depth — three faint rings drifting the whole way through
          if (rings[0]) tl.fromTo(rings[0], { x: -60, y: -30, scale: 0.9 }, { x: 70, y: 40, scale: 1.15, ease: "none", duration: 1 }, 0);
          if (rings[1]) tl.fromTo(rings[1], { x: 90, y: 40, scale: 1.1 }, { x: -100, y: -20, scale: 0.85, ease: "none", duration: 1 }, 0);
          if (rings[2]) tl.fromTo(rings[2], { x: 0, y: 70, scale: 1 }, { x: -50, y: -80, scale: 1.2, ease: "none", duration: 1 }, 0);

          // Fade the progress rail in/out at the very edges of the pin
          tl.fromTo(progressTrackRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0);
          tl.to(progressTrackRef.current, { autoAlpha: 0, duration: 0.06 }, 0.95);

          // Subtle cursor parallax on the ring layer — only for real mice,
          // so touch-capable laptops at desktop widths don't get a stuck offset.
          if (window.matchMedia("(pointer: fine)").matches) {
            const px = gsap.quickTo(ringsLayer, "x", { duration: 0.9, ease: "power3.out" });
            const py = gsap.quickTo(ringsLayer, "y", { duration: 0.9, ease: "power3.out" });
            const onMove = (e) => {
              const relX = e.clientX / window.innerWidth - 0.5;
              const relY = e.clientY / window.innerHeight - 0.5;
              px(relX * 26);
              py(relY * 26);
            };
            window.addEventListener("pointermove", onMove);
            parallaxCleanup = () => window.removeEventListener("pointermove", onMove);
          }

          // Custom fonts can shift metrics after first paint — cheap safety net.
          document.fonts?.ready?.then(() => ScrollTrigger.refresh());
        } else {
          const reveal = (targets, trigger, extra = {}) =>
            gsap.to(targets, {
              y: 0,
              yPercent: 0,
              opacity: 1,
              filter: "blur(0px)",
              ease: "power2.out",
              duration: 0.7,
              ...extra,
              scrollTrigger: { trigger, start: "top 85%", toggleActions: "play none none reverse" },
            });

          reveal(chars, introEl, { stagger: 0.02, duration: 0.5, rotateZ: 0 });
          reveal(highlight, introEl, { x: 0, autoAlpha: 1, duration: 0.6 });
          reveal(ledeLines, story, { stagger: 0.12 });
          reveal(revealTargets, capabilityBlockRef.current, { stagger: 0.12, onStart: startVideo });
          reveal(closing, closing, { duration: 0.6 });

          // No pin on mobile, so the spotlight is driven by each row's own
          // trigger instead of one scrubbed timeline — but it's the exact
          // same "light row i, revert row i-1" logic as desktop, just fired
          // discretely as each row crosses ~60% up the viewport (either
          // scroll direction), so it still only ever lights one row.
          let activeIndex = -1;
          const setActive = (i) => {
            if (activeIndex === i) return;

            if (activeIndex > -1) {
              gsap.to(fills[activeIndex], { scaleX: 0, duration: 0.45, ease: "power3.inOut" });
              gsap.to(capLabels[activeIndex], { color: "#0a0a0a", duration: 0.45 });
              gsap.to(capDescs[activeIndex], { color: "rgba(10,10,10,0.46)", duration: 0.45 });
              gsap.to(capIndices[activeIndex], { color: "rgba(10,10,10,0.46)", duration: 0.45 });
              gsap.to(stageMediaInner[activeIndex], {
                scale: 1.08,
                filter: blurOut,
                duration: 0.6,
                ease: "power2.in",
              });
              gsap.to(stageMedia[activeIndex], {
                opacity: 0,
                duration: 0.35,
                delay: 0.25,
                ease: "power2.in",
              });
            }

            gsap.to(fills[i], { scaleX: 1, duration: 0.45, ease: "power4.out" });
            gsap.to(capLabels[i], { color: "#ffffff", duration: 0.45 });
            gsap.to(capDescs[i], { color: "rgba(255,255,255,0.78)", duration: 0.45 });
            gsap.to(capIndices[i], { color: "#ffffff", duration: 0.45 });

            if (i === 0 && activeIndex === -1) {
              // First activation, first row — the photo is already resting
              // in the stage (see mount-time gsap.set above); unblur + pop it.
              gsap.fromTo(
                stageMediaInner[0],
                { scale: 1.04, filter: blurHidden },
                { scale: 1, filter: blurVisible, duration: 0.6, ease: "power2.out" }
              );
            } else {
              // Guard against a mid-fade-out opacity from a previous visit
              // to this row before the wipe reveals it again.
              gsap.set(stageMedia[i], { opacity: 1 });
              gsap.fromTo(
                stageMedia[i],
                { clipPath: HIDDEN_CLIP },
                { clipPath: VISIBLE_CLIP, duration: 0.6, ease: "power4.inOut" }
              );
              gsap.fromTo(
                stageMediaInner[i],
                { scale: 1.18, filter: blurHidden },
                { scale: 1, filter: blurVisible, duration: 0.6, ease: "power3.out" }
              );
            }

            activeIndex = i;
          };

          capabilityItems.forEach((row, i) => {
            ScrollTrigger.create({
              trigger: row,
              start: "top 62%",
              end: "bottom 38%",
              onEnter: () => setActive(i),
              onEnterBack: () => setActive(i),
            });
          });

          gsap.to(rings, {
            y: -30,
            duration: 6,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            stagger: 0.6,
          });
        }

        return () => {
          parallaxCleanup();
          splitRest.revert();
          pin.classList.remove("is-marquee");
          stage.classList.remove("is-marquee");
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="who-we-are"
      aria-labelledby="who-we-are-heading"
      className={`waw-section ${displayFont.variable} ${bodyFont.variable}`}
    >
      {/* Structured data for the three services — read by crawlers straight
          from markup, independent of the scroll-linked reveal animation. */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_JSON_LD) }}
      />

      <div className="waw-pin" ref={pinRef}>
        <div className="waw-progress" ref={progressTrackRef} aria-hidden="true">
          <span className="waw-progress-dot" ref={progressDotRef} />
        </div>

        <div className="waw-rings-layer" ref={ringsLayerRef} aria-hidden="true">
          <span className="waw-ring waw-ring-a" />
          <span className="waw-ring waw-ring-b" />
          <span className="waw-ring waw-ring-c" />
        </div>

        <div className="waw-stage" ref={stageRef}>
          {/* ---------- "Who are we?" — unchanged from the previous round ---------- */}
          <h2 id="who-we-are-heading" className="waw-heading waw-intro">
            <span className="waw-sr-only">Who are we?</span>
            <span aria-hidden="true">
              <span className="waw-highlight" ref={highlightRef}>
                <span className="waw-highlight-text">Who</span>
              </span>{" "}
              <span className="waw-intro-rest" ref={introRestRef}>
                are we?
              </span>
            </span>
          </h2>

          {/* ---------- the statement section (lede unchanged; capabilities rebuilt) ---------- */}
          <div className="waw-statement-wrap">
            <div className="waw-story" ref={storyRef}>
              <p className="waw-lede">
                {LEDE_LINES.map((line, i) => (
                  <span className="waw-lede-line-mask" key={line.text}>
                    <span
                      className={`waw-heading waw-lede-line${line.accent ? " waw-lede-accent" : ""}`}
                      ref={(el) => (ledeLineRefs.current[i] = el)}
                    >
                      {line.text}
                    </span>
                  </span>
                ))}
              </p>

              {/* Shared "stage" + list: only one row is ever highlighted, and
                  the stage always shows that same row's photo/video — the
                  two are always in sync because one activateCapability()
                  call (or setActive() on mobile) drives both at once. */}
              <div className="waw-capability-block" ref={capabilityBlockRef}>
                <div className="waw-capability-stage" ref={mediaStageRef} aria-hidden="true">
                  {CAPABILITIES.map((cap) => (
                    <div className="waw-capability-media" key={cap.label}>
                      {cap.media.type === "video" ? (
                        <video
                          ref={webVideoRef}
                          muted
                          loop
                          playsInline
                          preload="none"
                          poster={cap.media.poster}
                        >
                          <source src={cap.media.src} type="video/mp4" />
                        </video>
                      ) : (
                        <Image
                          src={cap.media.src}
                          alt={cap.media.alt || ""}
                          fill
                          loading="lazy"
                          sizes="(min-width: 1024px) 420px, 90vw"
                          style={{ objectFit: "cover", objectPosition: "center" }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <ul className="waw-capabilities" ref={capabilitiesListRef}>
                  {CAPABILITIES.map((cap) => (
                    <li className="waw-capability" key={cap.label}>
                      <span className="waw-capability-fill" aria-hidden="true" />
                      <div className="waw-capability-row">
                        <div className="waw-capability-copy">
                          <h3 className="waw-capability-label">{cap.label}</h3>
                          <p className="waw-capability-desc">{cap.description}</p>
                        </div>
                        <span className="waw-capability-index" aria-hidden="true">
                          {cap.mark}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="waw-closing" ref={closingRef}>
                {CLOSING_TEXT}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
