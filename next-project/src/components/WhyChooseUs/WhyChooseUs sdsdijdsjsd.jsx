"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./WhyChooseUs.module.css";
import ContactModal from "../ContactModal/ContactModal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Self-hosted via next/font instead of the previous Google Fonts
// @import in the CSS module — same two families, but no extra
// render-blocking network round trip and no flash-of-fallback-font on
// first load. Each font's `variable` name matches the CSS custom
// property it used to hard-code (--font-display / --font-sans), so
// nothing else in the stylesheet has to change; the values just arrive
// via the className applied to the root <section> below instead.
// Bricolage Grotesque is a variable font (the old @import loaded its
// opsz/wght axis directly), so no `weight` is passed here — omitting it
// tells next/font to load the full variable range, which is what lets
// .statement keep using the in-between font-weight: 650.
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

// Small lead-in line that sits above the big statement.
const KICKER_TEXT =
  "Every project starts with one question — how does this get you more customers?";

// The pull-quote for the philosophy stage (Stage 2, unchanged). Split
// into words below for a masked line-reveal (each word slides up from
// underneath a mask).
const QUOTE_TEXT =
  "A beautiful website that doesn't bring you customers is just an " +
  "expensive brochure.";

// The big statement, tokenized word-by-word so every word — plain or
// chip-bearing — gets its own mask and can be revealed individually on
// scroll (see the GSAP block below). A token with a `chip` id renders
// as a glued word+icon unit via .chipGroup, same as before; a plain
// token is just a word. Keeping the four-discipline copy here (instead
// of a separate capability list) means the visible text and the
// Service schema at the bottom of this file stay in sync automatically.
const STATEMENT_TOKENS = [
  { text: "We" },
  { text: "combine" },
  { text: "premium" },
  { text: "web development", chip: "web" },
  { text: "with" },
  { text: "lead generation", chip: "leads" },
  { text: "systems," },
  { text: "email marketing", chip: "email" },
  { text: "that" },
  { text: "nurtures" },
  { text: "every" },
  { text: "contact," },
  { text: "and" },
  { text: "graphic design", chip: "design" },
  { text: "that" },
  { text: "keeps" },
  { text: "your" },
  { text: "brand" },
  { text: "consistent" },
  { text: "everywhere" },
  { text: "it" },
  { text: "shows" },
  { text: "up." },
];

// Icon + tint for each inline chip. Colors are fixed (not tied to the
// stage1 light/dark theme vars) since they're standing in for photos —
// a photo doesn't change with the section's color state, so these
// shouldn't either. Every icon shares the same stroke weight (1.6) so
// the set reads as one deliberate family instead of four icons picked
// up from different places. Reused again for the .marqueeServices list
// in Stage 3, so the close of the page echoes the opening statement.
const CHIP_DEFS = {
  web: {
    bg: "#CFE3FF",
    label: "Web development",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
  leads: {
    bg: "#FFDCA8",
    label: "Lead generation",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16l-6 8v6l-4 2v-8z" />
      </svg>
    ),
  },
  email: {
    bg: "#D6F3D0",
    label: "Email marketing",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3.5 7l8.5 6 8.5-6" />
      </svg>
    ),
  },
  design: {
    bg: "#F5D3E6",
    label: "Graphic design",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20l1-4L15 6l3 3L8 19l-4 1z" />
        <path d="M13 8l3 3" />
      </svg>
    ),
  },
};

// Same four disciplines, in copy form, for the closing CTA's services
// list (Stage 3) — kept as a short separate list (rather than reused
// verbatim from APPROACH_ITEMS below) since the CTA wants short labels,
// not the longer descriptive sentence.
const CTA_SERVICES = [
  { id: "web", label: "Web development" },
  { id: "leads", label: "Lead generation" },
  { id: "email", label: "Email marketing" },
  { id: "design", label: "Graphic design" },
];

// Inline chip used inside the statement — purely decorative, so it's
// hidden from assistive tech; the discipline name is already present as
// real text right before it.
function Chip({ id }) {
  const def = CHIP_DEFS[id];
  if (!def) return null;
  return (
    <span className={styles.chip} style={{ backgroundColor: def.bg }} aria-hidden="true">
      {def.icon}
    </span>
  );
}

// These four disciplines feed the Service schema below so the
// structured data matches the copy in STATEMENT_TOKENS above.
const APPROACH_ITEMS = [
  {
    title: "Web development",
    desc:
      "Custom-built Next.js sites engineered for speed as much as looks.",
  },
  {
    title: "Lead generation",
    desc:
      "Landing pages, forms, and calls-to-action designed to turn visits " +
      "into qualified conversations.",
  },
  {
    title: "Email marketing",
    desc:
      "Welcome sequences, nurture flows, and campaigns written to move " +
      "someone toward a decision.",
  },
  {
    title: "Graphic design",
    desc:
      "A visual identity that holds together across your site, ads, " +
      "emails, and everywhere else your brand shows up.",
  },
];

// Client stories carousel — replace with real testimonials/photos.
// `photo` is a placeholder (picsum.photos) standing in for an actual
// client/project photo; swap each one out before shipping. Rendered via
// next/image now (see renderStoryGroup), so picsum.photos needs to be
// added to images.remotePatterns in next.config.js — or just swap these
// for real photos hosted on a domain you've already allow-listed.
const STORIES = [
  {
    handle: "@Sarah Bennett",
    role: "Founder, Bennett Studio",
    quote:
      "Working with ZARRAR changed how we think about our website. It's " +
      "not just prettier now — it actually brings in leads every week.",
    rating: 5,
    photo: "https://picsum.photos/seed/zarrar-story-1/640/480",
  },
  {
    handle: "@Marcus Webb",
    role: "Marketing Lead, Webb & Co",
    quote:
      "The email flows they built paid for the whole project twice over " +
      "inside the first quarter. Open rates have never been this consistent.",
    rating: 5,
    photo: "https://picsum.photos/seed/zarrar-story-2/640/480",
  },
  {
    handle: "@Priya Raman",
    role: "Co-founder, Raman Interiors",
    quote:
      "Finally a team that gets design and marketing together. Our brand " +
      "feels the same everywhere now — site, ads, and every email.",
    rating: 5,
    photo: "https://picsum.photos/seed/zarrar-story-3/640/480",
  },
  {
    handle: "@Daniel Osei",
    role: "Operations Director, Osei Logistics",
    quote:
      "They didn't hand us a site and disappear. Six months in and we're " +
      "still getting new lead-generation ideas from this team.",
    rating: 4,
    photo: "https://picsum.photos/seed/zarrar-story-4/640/480",
  },
  {
    handle: "@Elena Kowalski",
    role: "Owner, Kowalski Bakehouse",
    quote:
      "Clean, fast, and it actually converts — that's rare. I'd recommend " +
      "ZARRAR to any small business tired of pretty-but-useless websites.",
    rating: 5,
    photo: "https://picsum.photos/seed/zarrar-story-5/640/480",
  },
];

// Single five-pointed star, drawn once and reused filled/outlined so the
// rating reads crisply at any size instead of relying on a font's own
// glyph metrics (unicode ★/☆ render inconsistently across platforms and
// can look mismatched in weight/size next to the rest of the UI).
function StarIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.4}
      strokeLinejoin="round"
    >
      <path d="M10 1.4l2.55 5.4 5.85.66-4.36 4.06 1.15 5.83L10 14.62l-5.19 2.73 1.15-5.83L1.6 7.46l5.85-.66z" />
    </svg>
  );
}

// The icon row itself is aria-hidden — the human-readable rating is
// announced once via the wrapping element's aria-label (see call sites
// below), so a screen reader isn't asked to parse five separate glyphs.
function StarRating({ rating, className }) {
  return (
    <span className={className} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < rating} />
      ))}
    </span>
  );
}

function ChevronIcon({ direction }) {
  const d = direction === "left" ? "M12.5 5l-6 6 6 6" : "M7.5 5l6 6-6 6";
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M6.5 4.5v11l9-5.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <rect x="5.5" y="4.5" width="3" height="11" rx="0.8" />
      <rect x="11.5" y="4.5" width="3" height="11" rx="0.8" />
    </svg>
  );
}

// Small trailing arrow used on both CTA buttons (Stage 2's "Let's Talk"
// and Stage 3's "Start a Project") so the two calls-to-action read as
// the same family of control.
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

// Repeating phrase for the closing marquee banner. Rendered twice (two
// identical groups back to back) so an xPercent(-50) loop is seamless.
const MARQUEE_PHRASE = "Let's build your next website";
const MARQUEE_REPEAT = 6;

// Shared duration/ease for the point-triggered color snaps below. Set
// SNAP_DURATION to 0 if you want a literal instant color cut instead of
// a quick eased transition.
const SNAP_DURATION = 0.5;
const SNAP_EASE = "power2.out";

// How long one full loop of the story cards takes to drift by (one pass
// through a single, non-duplicated set — since the track holds two
// copies and travels xPercent(-50), this is the time to travel half the
// track). Bump this up to slow the drift down, or down to speed it up.
const STORIES_LOOP_DURATION = 14;

// Roughly how long a single card takes to drift past, assuming a
// constant rate across the loop (the tween's ease is "none", so this
// holds). Used to step the carousel by exactly "one card" — both from
// the prev/next buttons and from clicking the left/right half of the
// viewport.
const CARD_STEP_DURATION = STORIES_LOOP_DURATION / STORIES.length;

// Hovering a card brings the loop to a full, clean stop (0 = stopped)
// instead of just slowing it down, so someone can actually read a card
// without it drifting out from under them. The card currently sitting
// in the exit-fade zone is still excluded from this (see isExiting
// below) so you never freeze a half-faded card mid-fade.
const STORIES_HOVER_TIMESCALE = 0;

// Stage 1 lives in two color states: "light" (the resting state before
// the section is scrolled into view) and "dark" (snapped once the
// section crosses the fixed trigger point below). Every themed value in
// the section is a CSS custom property so the JS only has to flip one
// set of variables instead of touching a dozen elements.
const STAGE1_LIGHT_VARS = {
  "--stage1-bg": "#ffffff",
  "--stage1-fg": "#0a0a0a",
  "--stage1-fg-muted": "rgba(10, 10, 10, 0.65)",
  "--stage1-fg-soft": "rgba(10, 10, 10, 0.55)",
  "--stage1-border": "rgba(10, 10, 10, 0.14)",
  "--stage1-border-soft": "rgba(10, 10, 10, 0.1)",
};

const STAGE1_DARK_VARS = {
  "--stage1-bg": "#0a0a0a",
  "--stage1-fg": "#ffffff",
  "--stage1-fg-muted": "rgba(255, 255, 255, 0.78)",
  "--stage1-fg-soft": "rgba(255, 255, 255, 0.68)",
  "--stage1-border": "rgba(255, 255, 255, 0.14)",
  "--stage1-border-soft": "rgba(255, 255, 255, 0.1)",
};

export default function WhyChooseUs() {
  const sectionRef = useRef(null);

  // Stage 1 — statement + client stories carousel
  const stage1Ref = useRef(null);
  const heroRef = useRef(null); // wraps kicker + statement; used purely
  // as the color-snap trigger point so "dark" fires when the heading is
  // centered, independent of the taller section's own top/bottom edges.
  const kickerRef = useRef(null);
  const statementRef = useRef(null);
  const storiesLabelRef = useRef(null);
  const storiesViewportRef = useRef(null);
  const storiesTrackRef = useRef(null);
  const storiesCursorRef = useRef(null);
  const storyItemRefs = useRef([]); // only the first (real, non-duplicated,
  // non-aria-hidden) group of cards lives here — see the JSX below.
  const carouselTweenRef = useRef(null); // exposed outside the effect so
  // the prev/next/pause buttons can drive the same tween the auto-scroll
  // effect creates.
  const [isPaused, setIsPaused] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Stage 2 — philosophy quote
  const quoteRef = useRef(null);
  const quoteTextRef = useRef(null);
  const ctaRef = useRef(null);

  // Stage 3 — marquee CTA
  const marqueeSectionRef = useRef(null);
  const marqueeTrackRef = useRef(null);

  // ---------------------------------------------------------------
  // Core scroll choreography: Stage 1 color snap + entrance reveals,
  // Stage 2 / Stage 3 snaps + marquee.
  // ---------------------------------------------------------------
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // No-JS and reduced-motion visitors get the fully "settled" version
    // that's already in the CSS: Stage 1 resting dark (see .stage1
    // defaults), each later stage's final resting color, a static
    // marquee clipped to one line, and a static (non-looping) row of
    // story cards. Nothing to wire up in that case.
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Stage 1 starts light. It only snaps dark once the heading block
      // is actually centered on screen (see heroRef below) — deliberately
      // NOT tied to the whole (now much taller, statement + carousel)
      // section, since a "top X%" point on that full tall box would fire
      // as soon as its top edge passed that line, well before the
      // heading is visually centered. This section is not pinned —
      // pinning content taller than one viewport would just clip the
      // carousel off the bottom of the screen while pinned.
      gsap.set(stage1Ref.current, STAGE1_LIGHT_VARS);

      const snapStage1 = (toDark) => {
        gsap.to(stage1Ref.current, {
          ...(toDark ? STAGE1_DARK_VARS : STAGE1_LIGHT_VARS),
          duration: SNAP_DURATION,
          ease: SNAP_EASE,
        });
      };

      const isMobile = window.matchMedia("(max-width: 640px)").matches;


      ScrollTrigger.create({
        trigger: heroRef.current,
        start: isMobile ? "center 38%" : "center center",
        onEnter: () => snapStage1(true),
        onEnterBack: () => snapStage1(true),
        onLeaveBack: () => snapStage1(false),
      });

      gsap.from(kickerRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: kickerRef.current, start: "top 88%" },
      });

      // Statement — masked word-by-word reveal (mirrors the Stage 2
      // quote treatment below) instead of the whole line fading up as
      // one flat block. Each .word span slides up out of its .wordMask
      // with a touch of rotation for an organic, not-quite-mechanical
      // feel; a slightly longer duration + power4 easing reads as more
      // "premium" than the quicker power3 used elsewhere.
      const statementWords = statementRef.current.querySelectorAll(
        `.${styles.word}`
      );
      gsap.from(statementWords, {
        yPercent: 115,
        rotateZ: 2,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.028,
        scrollTrigger: { trigger: statementRef.current, start: "top 85%" },
      });

      // Chip icons pop in with a small bounce just behind their word,
      // instead of appearing instantly as part of the flat text.
      const statementChips = statementRef.current.querySelectorAll(
        `.${styles.chip}`
      );
      gsap.from(statementChips, {
        scale: 0,
        rotate: -18,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(2.4)",
        stagger: 0.05,
        delay: 0.15,
        scrollTrigger: { trigger: statementRef.current, start: "top 85%" },
      });

      gsap.from(storiesLabelRef.current, {
        opacity: 0,
        y: 12,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: { trigger: storiesLabelRef.current, start: "top 92%" },
      });

      // Story cards — small blur-in on top of a fade/rise/stagger for a
      // softer, more deliberate arrival. Only the first (real) group of
      // cards is in storyItemRefs, so the duplicated loop-filler group
      // doesn't double up this animation.
      gsap.fromTo(
        storyItemRefs.current,
        { opacity: 0, y: 36, scale: 0.97, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: storiesTrackRef.current, start: "top 92%" },
        }
      );

      // ---------- Stage 2 — philosophy stage ----------
      // Background SNAPS from black to accent the instant the section
      // crosses a fixed point (vertical center of the viewport). Not
      // tied to how far you keep scrolling after that — onEnter fires
      // once going down, onLeaveBack reverses it once going back up.
      gsap.set(quoteRef.current, {
        backgroundColor: "#0a0a0a",
        color: "#ffffff",
      });

      ScrollTrigger.create({
        trigger: quoteRef.current,
        start: isMobile ? "top -10%" : "top 10%",
        onEnter: () => gsap.to(quoteRef.current, { backgroundColor: "var(--color-accent)", color: "var(--color-on-accent)", duration: SNAP_DURATION, ease: SNAP_EASE }),
        onLeaveBack: () => gsap.to(quoteRef.current, { backgroundColor: "#0a0a0a", color: "#ffffff", duration: SNAP_DURATION, ease: SNAP_EASE }),
      });

      // Masked word-by-word reveal for the quote.
      const quoteWords = quoteTextRef.current.querySelectorAll(
        `.${styles.word}`
      );
      gsap.from(quoteWords, {
        yPercent: 110,
        rotateZ: 1.5,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.025,
        scrollTrigger: {
          trigger: quoteTextRef.current,
          start: "top 80%",
        },
      });

      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 90%",
        },
      });

      // ---------- Stage 3 — marquee CTA ----------
      // Background SNAPS from accent to black at its own fixed point
      // (same point-trigger pattern as above).
      gsap.set(marqueeSectionRef.current, {
        backgroundColor: "var(--color-accent)",
        color: "var(--color-ink)",
      });

      ScrollTrigger.create({
        trigger: marqueeSectionRef.current,
        start: isMobile ? "top -10%" : "top 10%",
        onEnter: () =>
          gsap.to(marqueeSectionRef.current, {
            backgroundColor: "#0a0a0a",
            color: "#ffffff",
            duration: SNAP_DURATION,
            ease: SNAP_EASE,
          }),
        onLeaveBack: () =>
          gsap.to(marqueeSectionRef.current, {
            backgroundColor: "var(--color-accent)",
            color: "var(--color-ink)",
            duration: SNAP_DURATION,
            ease: SNAP_EASE,
          }),
      });

      gsap.from(`.${styles.marqueeCtaContent}`, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: marqueeSectionRef.current,
          start: "top 65%",
        },
      });

      // Infinite horizontal loop. Two identical groups sit side by side
      // in the track, so shifting exactly -50% loops seamlessly.
      const marqueeTween = gsap.to(marqueeTrackRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 22,
        repeat: -1,
      });

      // A small "awwwards" touch: the marquee subtly speeds up with
      // scroll velocity, then eases back down.
      ScrollTrigger.create({
        trigger: marqueeSectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const boost = gsap.utils.clamp(
            0.4,
            3.2,
            1 + Math.abs(velocity) / 2000
          );
          gsap.to(marqueeTween, {
            timeScale: boost,
            duration: 0.3,
            overwrite: true,
          });
        },
      });
    }, sectionRef);

    // Safety net: re-measure trigger positions once everything (webfonts
    // in particular — they can reflow text after GSAP's first measurement
    // and throw off "top X%" points) has finished loading.
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
      ctx.revert();
    };
  }, []);

  // ---------------------------------------------------------------
  // Client-stories carousel: a continuous auto-scroll. The track holds
  // two identical groups of cards back to back (see the JSX) and drifts
  // left by exactly 50% of its own width on an infinite loop, so it
  // never visibly "resets" — new cards keep arriving on the right and
  // old ones fade out on the left (matching the mask-image fade on
  // .storiesViewport).
  //
  // Hovering (or keyboard-focusing) a card brings the loop to a full
  // stop — see STORIES_HOVER_TIMESCALE — so someone can read a
  // testimonial without it sliding away. Listeners live on each card
  // itself (not the shared viewport), so hovering the gaps between
  // cards does nothing.
  //
  // Three ways to move manually, all sharing stepCarousel(): the
  // prev/next buttons in the header (keyboard- and touch-reachable),
  // clicking the left/right half of the viewport (desktop, hinted by
  // the round "Back / Next" cursor), and the pause button, which fully
  // stops the tween until toggled back on.
  //
  // One exception to the hover-stop: whichever card is CURRENTLY sitting
  // in the narrow exit sliver on the left edge (already partway under
  // the fade) is left at full speed instead of stopped — freezing it
  // there would leave a half-faded card hanging, which is exactly the
  // "looks cut off" look this was built to avoid. This is checked by
  // live position (getBoundingClientRect), not by which of the 5
  // testimonials it happens to be — with 5 cards cycling through only 3
  // visible slots, tying the exception to content instead of position
  // meant it landed on the wrong slot half the time.
  // ---------------------------------------------------------------
  useEffect(() => {
    const track = storiesTrackRef.current;
    const viewport = storiesViewportRef.current;
    if (!track || !viewport) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const tween = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: STORIES_LOOP_DURATION,
      repeat: -1,
    });
    carouselTweenRef.current = tween;

    const stop = () => {
      if (tween.paused()) return;
      gsap.to(tween, { timeScale: STORIES_HOVER_TIMESCALE, duration: 0.25, overwrite: true });
    };
    const resume = () => {
      if (tween.paused()) return;
      gsap.to(tween, { timeScale: 1, duration: 0.4, overwrite: true });
    };

    // Roughly matches where .storiesViewport's mask-image starts fading
    // on the left (8%) plus a little margin, so "exiting" means "already
    // visibly fading", not just "technically past some invisible line".
    const EXIT_ZONE_RATIO = 0.16;
    const isExiting = (card) => {
      const viewportBounds = viewport.getBoundingClientRect();
      const cardBounds = card.getBoundingClientRect();
      const cardCenter = cardBounds.left + cardBounds.width / 2 - viewportBounds.left;
      return cardCenter < viewportBounds.width * EXIT_ZONE_RATIO;
    };

    const handleEnter = (event) => {
      if (isExiting(event.currentTarget)) {
        resume();
      } else {
        stop();
      }
    };
    const handleLeave = () => resume();

    // Manual control: step exactly one card back/forward by nudging the
    // tween's own playhead, instead of re-triggering it from scratch —
    // this keeps whatever card is mid-transition smooth rather than
    // snapping.
    //
    // Uses totalTime() rather than time(): time() only reports the
    // position within the CURRENT repeat cycle and resets to 0 at the
    // start of every loop, so subtracting a step near the start of a
    // cycle could go negative — GSAP then clamps that to 0 instead of
    // wrapping into the previous lap, which is why clicking "back" did
    // nothing whenever the loop happened to be near its seam.
    // totalTime() counts continuously across repeats, so it can be
    // nudged in either direction without ever hitting that clamp.
    const stepCarousel = (direction) => {
      gsap.to(tween, {
        totalTime: tween.totalTime() + direction * CARD_STEP_DURATION,
        duration: 0.5,
        ease: "power2.inOut",
        overwrite: true,
      });
    };

    const handleClick = (event) => {
      if (event.target.closest(`.${styles.storyPhotoTrigger}`)) return;
      const bounds = viewport.getBoundingClientRect();
      const clickedLeftHalf = event.clientX - bounds.left < bounds.width / 2;
      stepCarousel(clickedLeftHalf ? -1 : 1);
    };
    viewport.addEventListener("click", handleClick);

    const cards = Array.from(track.querySelectorAll(`.${styles.storyCard}`));
    cards.forEach((card) => {
      card.addEventListener("mouseenter", handleEnter);
      card.addEventListener("mouseleave", handleLeave);
      card.addEventListener("focusin", handleEnter);
      card.addEventListener("focusout", handleLeave);
    });

    // Exposed on the ref so the header's prev/next/pause buttons (real
    // JSX elements, not part of this effect's closure) can drive the
    // same tween.
    tween.stepCarousel = stepCarousel;

    return () => {
      viewport.removeEventListener("click", handleClick);
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", handleEnter);
        card.removeEventListener("mouseleave", handleLeave);
        card.removeEventListener("focusin", handleEnter);
        card.removeEventListener("focusout", handleLeave);
      });
      tween.kill();
      carouselTweenRef.current = null;
    };
  }, []);

  // ---------------------------------------------------------------
  // Round "Back / Next" cursor that follows the pointer over the
  // carousel — a visual hint that the viewport is click-to-navigate
  // (see the click-to-step handler above). Mouse-only.
  //
  // The position update is throttled to one write per animation frame
  // with requestAnimationFrame instead of running getBoundingClientRect
  // + a style write on every single "pointermove" (which can fire far
  // more often than the screen actually repaints) — same end result,
  // less main-thread work per frame.
  // ---------------------------------------------------------------
  useEffect(() => {
    const viewport = storiesViewportRef.current;
    const cursor = storiesCursorRef.current;
    if (!viewport || !cursor) return;

    let rafId = null;
    let lastEvent = null;

    const setCursorPosition = (event) => {
      const bounds = viewport.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      cursor.textContent = x < bounds.width / 2 ? "Back" : "Next";
    };

    const handlePointerEnter = (event) => {
      if (event.pointerType !== "mouse") return;
      cursor.style.opacity = "1";
      setCursorPosition(event);
    };

    const handlePointerLeave = (event) => {
      if (event.pointerType !== "mouse") return;
      cursor.style.opacity = "0";
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const handlePointerMove = (event) => {
      if (event.pointerType !== "mouse") return;
      lastEvent = event;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (lastEvent) setCursorPosition(lastEvent);
      });
    };

    viewport.addEventListener("pointerenter", handlePointerEnter);
    viewport.addEventListener("pointerleave", handlePointerLeave);
    viewport.addEventListener("pointermove", handlePointerMove);

    return () => {
      viewport.removeEventListener("pointerenter", handlePointerEnter);
      viewport.removeEventListener("pointerleave", handlePointerLeave);
      viewport.removeEventListener("pointermove", handlePointerMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Header controls: same stepCarousel used by click-to-navigate, plus a
  // real pause toggle (separate from the hover-stop) so the auto-scroll
  // is fully under someone's control, not just paused as a side effect
  // of where their mouse happens to be — matters for anyone relying on
  // switch access, screen magnification, or just wanting it to stop.
  const handleStep = (direction) => {
    const tween = carouselTweenRef.current;
    if (!tween || tween.paused()) return;
    tween.stepCarousel?.(direction);
  };

  const handleTogglePause = () => {
    const tween = carouselTweenRef.current;
    if (!tween) return;
    const nextPaused = !tween.paused();
    tween.paused(nextPaused);
    setIsPaused(nextPaused);
  };

  // JSON-LD mirrors the four disciplines named in the statement above.
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Web development and digital marketing",
    provider: { "@type": "Organization", name: "ZARRAR" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Our approach",
      itemListElement: APPROACH_ITEMS.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item.title,
          description: item.desc,
        },
      })),
    },
  };

  // Renders one full set of story cards. `duplicate` marks the
  // loop-filler copy: hidden from assistive tech and pulled out of tab
  // order so a screen reader / keyboard user only ever encounters each
  // testimonial once, even though it's visually painted twice for the
  // seamless loop.
  const renderStoryGroup = (duplicate) => (
    <div
      className={styles.storiesTrackGroup}
      aria-hidden={duplicate ? "true" : undefined}
    >
      {STORIES.map((story, i) => (
        <article
          key={story.handle}
          ref={duplicate ? undefined : (el) => (storyItemRefs.current[i] = el)}
          className={styles.storyCard}
        >
          <div className={styles.storyCardText}>
            <svg
              className={styles.storyQuoteMark}
              viewBox="0 0 32 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M4 24V15.2C4 8.4 8 3.2 14.8 0l2 4C12.4 6.8 10.4 10 10 13.6h6V24H4zm16 0V15.2C20 8.4 24 3.2 30.8 0l2 4c-4.4 2.8-6.4 6-6.8 9.6h6V24H20z" />
            </svg>

            {/* Client name is real content but not a document heading —
                it's metadata about a testimonial, not a section of the
                page, so it's a plain paragraph (styled the same as
                before) rather than an <h3>. Keeps the page's heading
                outline to h2 (this section) and h3 (the CTA heading
                below) instead of five extra h3s for names, which is
                what search engines and screen-reader "jump by heading"
                navigation actually read as the page's structure. */}
            <div className={styles.storyCardHeading}>
              <p className={styles.storyHandle}>{story.handle}</p>
              <p className={styles.storyRole}>{story.role}</p>
            </div>

            <p className={styles.storyQuote}>{story.quote}</p>

            <div className={styles.storyMeta}>
              <span
                className={styles.storyStars}
                aria-label={`${story.rating} out of 5 stars`}
              >
                <StarRating rating={story.rating} />
              </span>

              {/* The ONLY thing that triggers the photo reveal — see
                  :has() in the stylesheet. Focusing/hovering it also
                  pauses the auto-scroll (see the effect above). */}
              <button
                type="button"
                className={styles.storyPhotoTrigger}
                aria-label={`View photo shared by ${story.handle}`}
                tabIndex={duplicate ? -1 : undefined}
              >
                View photo
                <span className={styles.storyPhotoTriggerIcon} aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <div
            className={styles.storyCardPhoto}
            role="img"
            aria-label={`Photo shared by ${story.handle}`}
          >
            <div className={styles.storyCardPhotoMask} />
            {/* next/image instead of a CSS background-image: lazy-loads
                below the fold, serves a right-sized/right-format image
                per device, and avoids shipping the full-resolution photo
                to everyone regardless of viewport. The reveal animation
                itself is untouched — .storyCardPhotoImage still owns the
                scale/translate transform, this element just fills it.
                alt="" because the parent already carries the accessible
                name via role="img" + aria-label above; a second alt here
                would just repeat it for screen readers. */}
            <div className={styles.storyCardPhotoImage}>
              <Image
                src={story.photo}
                alt=""
                fill
                sizes="(max-width: 860px) 80vw, 380px"
              />
            </div>
            {/* Keeps the name + rating visible once the photo covers the
                card, so hovering doesn't strip away whose story this
                is — the text underneath fades out at the same time. */}
            <div className={styles.storyCardPhotoCaption} aria-hidden="true">
              <p className={styles.storyCardPhotoCaptionName}>{story.handle}</p>
              <StarRating
                rating={story.rating}
                className={styles.storyCardPhotoCaptionStars}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="why-choose-us"
      className={`${styles.section} ${bricolageGrotesque.variable} ${plusJakartaSans.variable}`}
      aria-labelledby="why-choose-us-heading"
    >
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Stage 1 — statement + client stories. Resting state is light;
          it snaps to dark once it crosses the fixed scroll point above
          (see the color-choreography effect). */}
      <div ref={stage1Ref} className={styles.stage1}>
        <div className={styles.stage1Content}>
          <div ref={heroRef} className={styles.hero}>
            <p ref={kickerRef} className={styles.kicker}>
              {KICKER_TEXT}
            </p>

            <h2
              id="why-choose-us-heading"
              ref={statementRef}
              className={styles.statement}
            >
              {STATEMENT_TOKENS.map((tok, i) => (
                // Each token is its own mask+word unit (real space text
                // node after it, not just CSS margin) so the browser
                // still has a genuine line-break opportunity between
                // adjacent inline-block spans — without it, words would
                // never wrap and could overflow the line on narrow
                // screens.
                <span key={i}>
                  <span className={styles.wordMask}>
                    <span className={styles.word}>
                      {tok.chip ? (
                        <span className={styles.chipGroup}>
                          {tok.text}
                          <Chip id={tok.chip} />
                        </span>
                      ) : (
                        tok.text
                      )}
                    </span>
                  </span>{" "}
                </span>
              ))}
            </h2>
          </div>

          <div className={styles.storiesSection}>
            <div className={styles.storiesHeader}>
              <span ref={storiesLabelRef} className={styles.storiesLabel}>
                Client stories
              </span>

              <div className={styles.storiesControls}>
                <button
                  type="button"
                  className={styles.storiesControlButton}
                  onClick={() => handleStep(-1)}
                  aria-label="Show previous client story"
                >
                  <ChevronIcon direction="left" />
                </button>
                <button
                  type="button"
                  className={styles.storiesControlButton}
                  onClick={handleTogglePause}
                  aria-pressed={isPaused}
                  aria-label={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
                >
                  {isPaused ? <PlayIcon /> : <PauseIcon />}
                </button>
                <button
                  type="button"
                  className={styles.storiesControlButton}
                  onClick={() => handleStep(1)}
                  aria-label="Show next client story"
                >
                  <ChevronIcon direction="right" />
                </button>
              </div>
            </div>

            {/* The track drifts on its own and comes to a full stop when
                a card itself (not the gaps or faded edges) is hovered or
                focused, or when the pause button above is toggled on —
                see the effects above. Click the left/right half to step
                manually; the round cursor is the visual hint for that.
                The mask-image fade on .storiesViewport is what keeps the
                leading/trailing card from ever looking "chopped". */}
            <div
              className={styles.storiesCarousel}
              role="region"
              aria-label="Client stories"
            >
              <div className={styles.storiesViewport} ref={storiesViewportRef}>
                <div className={styles.storiesTrack} ref={storiesTrackRef}>
                  {renderStoryGroup(false)}
                  {renderStoryGroup(true)}
                </div>
              </div>

              <div
                ref={storiesCursorRef}
                className={styles.storiesCursor}
                aria-hidden="true"
              >
                Next
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage 2 — philosophy / pull-quote panel, black -> accent (snap) */}
      <div ref={quoteRef} className={styles.quoteStage}>
        <div className={styles.quoteInner}>
          <span className={styles.quoteLabel}>Our philosophy</span>

          <p ref={quoteTextRef} className={styles.quoteText}>
            {QUOTE_TEXT.split(" ").map((word, i) => (
              <span className={styles.wordMask} key={`${word}-${i}`}>
                <span className={styles.word}>{word}</span>
              </span>
            ))}
          </p>

          <div ref={ctaRef}>
            <button
              type="button"
              className={styles.processButton}
              onClick={() =>
                marqueeSectionRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
            >
              <span className={styles.processButtonIcon} aria-hidden="true">
                <ArrowIcon />
              </span>
              Let&rsquo;s Talk
            </button>
          </div>
        </div>
      </div>

      {/* Stage 3 — marquee banner (unchanged), then the closing CTA
          panel, accent -> black (snap) */}
      <div ref={marqueeSectionRef} className={styles.marqueeSection}>
        <div className={styles.marqueeViewport}>
          <div
            ref={marqueeTrackRef}
            className={styles.marqueeTrack}
            aria-hidden="true"
          >
            {Array.from({ length: 2 }).map((_, groupIndex) => (
              <div className={styles.marqueeGroup} key={groupIndex}>
                {Array.from({ length: MARQUEE_REPEAT }).map((_, i) => (
                  <span className={styles.marqueeItem} key={i}>
                    {MARQUEE_PHRASE}
                    <span className={styles.marqueeDot}>●</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Redesigned closing panel: a soft accent glow behind the
            heading, the same four discipline icons used in the Stage 1
            statement (so the page's opening and closing echo each
            other), and a primary + secondary call to action instead of
            a single button on its own. The outer .marqueeCtaContent
            div keeps its original class name, since that's what the
            GSAP entrance animation above selects by — only what's
            inside it changed. */}
        <div className={styles.marqueeCtaContent}>
          <div className={styles.marqueeCtaGlow} aria-hidden="true" />

          <h3 className={styles.marqueeHeading}>
            Got an idea? Let&rsquo;s build the system behind it.
          </h3>
          <p className={styles.marqueeSub}>
            Website, funnel, email, and brand — designed and built
            together, not as four separate vendors.
          </p>

          <ul className={styles.marqueeServices}>
            {CTA_SERVICES.map((service) => (
              <li key={service.id} className={styles.marqueeServiceItem}>
                <span
                  className={styles.marqueeServiceIcon}
                  style={{ backgroundColor: CHIP_DEFS[service.id].bg }}
                  aria-hidden="true"
                >
                  {CHIP_DEFS[service.id].icon}
                </span>
                {service.label}
              </li>
            ))}
          </ul>

          <div className={styles.marqueeCtaActions}>
            {/* Swap the href for your actual contact route */}
            <button
              type="button"
              className={styles.ctaButton}
              onClick={() => setIsContactOpen(true)}
            >
              Start a Project
              <span className={styles.ctaButtonIcon} aria-hidden="true">
                <ArrowIcon />
              </span>
            </button>
            {/* Swap for your real inbox — a quiet second path for anyone
                who'd rather email than fill out a form. */}
            <a href="mailto:hello@zarrar.studio" className={styles.marqueeContactLink}>
              Or email isabella.web.devs@gmail.com
            </a>
          </div>
        </div>
      </div>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
}
