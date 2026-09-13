"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./WhyChooseUs.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Small lead-in line that sits above the big statement.
const KICKER_TEXT =
  "Every project starts with one question — how does this get you more customers?";

// The pull-quote for the philosophy stage (Stage 2, unchanged). Split
// into words below for a masked line-reveal (each word slides up from
// underneath a mask).
const QUOTE_TEXT =
  "A beautiful website that doesn't bring you customers is just an " +
  "expensive brochure.";

// The big statement, now tokenized word-by-word (instead of a handful
// of multi-word segments) so every word — plain or chip-bearing — gets
// its own mask and can be revealed individually on scroll (see the
// GSAP block below). A token with a `chip` id renders as a glued
// word+icon unit via .chipGroup, same as before; a plain token is just
// a word. Keeping the four-discipline copy here (instead of a separate
// capability list) means the visible text and the Service schema at
// the bottom of this file stay in sync automatically.
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
// same reasoning as the reference: a photo doesn't change with the
// section's color state, so these shouldn't either. Every icon now
// shares the same stroke weight (1.6) so the set reads as one
// deliberate family instead of four icons picked up from different
// places.
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
      // Funnel — reads more directly as "lead generation" than the
      // previous bullseye did.
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

// Inline chip used inside the statement — purely decorative, so it's
// hidden from assistive tech; the discipline name is already present
// as real text right before it.
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
// client/project photo; swap each one out before shipping.
const STORIES = [
  {
    handle: "@Sarah Bennett",
    quote:
      "Working with ZARRAR changed how we think about our website. It's " +
      "not just prettier now — it actually brings in leads every week.",
    rating: 5,
    photo: "https://picsum.photos/seed/zarrar-story-1/640/480",
  },
  {
    handle: "@Marcus Webb",
    quote:
      "The email flows they built paid for the whole project twice over " +
      "inside the first quarter. Open rates have never been this consistent.",
    rating: 5,
    photo: "https://picsum.photos/seed/zarrar-story-2/640/480",
  },
  {
    handle: "@Priya Raman",
    quote:
      "Finally a team that gets design and marketing together. Our brand " +
      "feels the same everywhere now — site, ads, and every email.",
    rating: 5,
    photo: "https://picsum.photos/seed/zarrar-story-3/640/480",
  },
  {
    handle: "@Daniel Osei",
    quote:
      "They didn't hand us a site and disappear. Six months in and we're " +
      "still getting new lead-generation ideas from this team.",
    rating: 4,
    photo: "https://picsum.photos/seed/zarrar-story-4/640/480",
  },
  {
    handle: "@Elena Kowalski",
    quote:
      "Clean, fast, and it actually converts — that's rare. I'd recommend " +
      "ZARRAR to any small business tired of pretty-but-useless websites.",
    rating: 5,
    photo: "https://picsum.photos/seed/zarrar-story-5/640/480",
  },
];

function StarRating({ rating }) {
  return (
    <span className={styles.storyStars} aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
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
  const storyItemRefs = useRef([]);

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
    // defaults), each later stage's final resting color, and a static
    // marquee clipped to one line. Nothing to wire up in that case.
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Stage 1 starts light. It only snaps dark once the heading block
      // is actually centered on screen (see heroRef below) — deliberately
      // NOT tied to the whole (now much taller, statement + carousel)
      // section, since a "top X%" point on that full tall box would fire
      // as soon as its top edge passed that line, well before the
      // heading is visually centered. Note also: this section is no
      // longer pinned — pinning content taller than one viewport would
      // just clip the carousel off the bottom of the screen while
      // pinned. The color snap itself still fires at a fixed scroll
      // point, same as before.
      gsap.set(stage1Ref.current, STAGE1_LIGHT_VARS);

      const snapStage1 = (toDark) => {
        gsap.to(stage1Ref.current, {
          ...(toDark ? STAGE1_DARK_VARS : STAGE1_LIGHT_VARS),
          duration: SNAP_DURATION,
          ease: SNAP_EASE,
        });
      };

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "center center",
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

      // Story cards — small blur-in added on top of the previous
      // fade/rise/stagger for a softer, more deliberate arrival.
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
        start: "top 10%",
        onEnter: () =>
          gsap.to(quoteRef.current, {
            backgroundColor: "var(--color-accent)",
            color: "var(--color-ink)",
            duration: SNAP_DURATION,
            ease: SNAP_EASE,
          }),
        onLeaveBack: () =>
          gsap.to(quoteRef.current, {
            backgroundColor: "#0a0a0a",
            color: "#ffffff",
            duration: SNAP_DURATION,
            ease: SNAP_EASE,
          }),
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
        start: "top 10%",
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
  // Client-stories carousel: drag-to-scroll + a custom "Back / Next"
  // cursor that follows the pointer and flips label depending on which
  // half of the track it's over. Mouse-only — touch devices keep plain
  // native swipe scrolling (see the pointerType checks below). The
  // photo reveal on hover is handled entirely in CSS via :has() on the
  // "View photo" trigger (see .storyPhotoTrigger in the stylesheet).
  // ---------------------------------------------------------------
  useEffect(() => {
    const viewport = storiesViewportRef.current;
    const track = storiesTrackRef.current;
    const cursor = storiesCursorRef.current;
    if (!viewport || !track || !cursor) return;

    let isPointerDown = false;
    let didDrag = false;
    let startX = 0;
    let startScrollLeft = 0;

    const setCursorPosition = (event) => {
      const bounds = viewport.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      cursor.textContent = x < bounds.width / 2 ? "Back" : "Next";
    };

    const cardStep = () => {
      const firstCard = storyItemRefs.current.find(Boolean);
      const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
      if (!firstCard) return viewport.clientWidth * 0.8;
      return firstCard.getBoundingClientRect().width + gap;
    };

    const handlePointerEnter = (event) => {
      if (event.pointerType !== "mouse") return;
      cursor.style.opacity = "1";
      setCursorPosition(event);
    };

    const handlePointerLeave = (event) => {
      if (event.pointerType !== "mouse") return;
      cursor.style.opacity = "0";
      isPointerDown = false;
    };

    const handlePointerMove = (event) => {
      if (event.pointerType !== "mouse") return;
      setCursorPosition(event);
      if (!isPointerDown) return;
      if (Math.abs(event.clientX - startX) > 4) didDrag = true;
      viewport.scrollLeft = startScrollLeft - (event.clientX - startX);
    };

    const handlePointerDown = (event) => {
      if (event.pointerType !== "mouse") return;
      isPointerDown = true;
      didDrag = false;
      startX = event.clientX;
      startScrollLeft = viewport.scrollLeft;
    };

    const handlePointerUp = (event) => {
      if (event.pointerType !== "mouse" || !isPointerDown) return;
      isPointerDown = false;
      if (didDrag) return;
      const bounds = viewport.getBoundingClientRect();
      const goBack = event.clientX - bounds.left < bounds.width / 2;
      viewport.scrollBy({
        left: goBack ? -cardStep() : cardStep(),
        behavior: "smooth",
      });
    };

    viewport.addEventListener("pointerenter", handlePointerEnter);
    viewport.addEventListener("pointerleave", handlePointerLeave);
    viewport.addEventListener("pointermove", handlePointerMove);
    viewport.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      viewport.removeEventListener("pointerenter", handlePointerEnter);
      viewport.removeEventListener("pointerleave", handlePointerLeave);
      viewport.removeEventListener("pointermove", handlePointerMove);
      viewport.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

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

  return (
    <section
      ref={sectionRef}
      id="why-choose-us"
      className={styles.section}
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
            <span ref={storiesLabelRef} className={styles.storiesLabel}>
              Client stories
            </span>

            <div className={styles.storiesCarousel}>
              <div className={styles.storiesViewport} ref={storiesViewportRef}>
                <div className={styles.storiesTrack} ref={storiesTrackRef}>
                  {STORIES.map((story, i) => (
                    <article
                      key={story.handle}
                      ref={(el) => (storyItemRefs.current[i] = el)}
                      className={styles.storyCard}
                    >
                      <div className={styles.storyCardText}>
                        <h3 className={styles.storyHandle}>{story.handle}</h3>
                        <p className={styles.storyQuote}>{story.quote}</p>
                        <div className={styles.storyMeta}>
                          <StarRating rating={story.rating} />
                          {/* Button (not a plain span) so the photo
                              reveal is reachable by keyboard too — see
                              :focus-visible in the stylesheet. This is
                              the ONLY thing that triggers the photo now;
                              hovering the rest of the card no longer
                              does. */}
                          <button
                            type="button"
                            className={styles.storyPhotoTrigger}
                            aria-label={`View photo shared by ${story.handle}`}
                          >
                            View photo
                            <span
                              className={styles.storyPhotoTriggerIcon}
                              aria-hidden="true"
                            >
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
                      {/* Two-layer reveal, now keyed off the trigger
                          button above via :has() in the stylesheet
                          rather than :hover on this whole card. */}
                      <div
                        className={styles.storyCardPhoto}
                        role="img"
                        aria-label={`Photo shared by ${story.handle}`}
                      >
                        <div className={styles.storyCardPhotoMask} />
                        <div
                          className={styles.storyCardPhotoImage}
                          style={{ backgroundImage: `url(${story.photo})` }}
                        />
                      </div>
                    </article>
                  ))}
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
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </span>
              Let&rsquo;s Talk
            </button>
          </div>
        </div>
      </div>

      {/* Stage 3 — marquee CTA, accent -> black (snap) */}
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

        <div className={styles.marqueeCtaContent}>
          <h3 className={styles.marqueeHeading}>
            Got an idea? Let&rsquo;s build the system behind it.
          </h3>
          <p className={styles.marqueeSub}>
            Website, funnel, email, and brand — designed and built
            together, not as four separate vendors.
          </p>
          {/* Swap the href for your actual contact route */}
          <Link href="/contact" className={styles.ctaButton}>
            Start a Project
          </Link>
        </div>
      </div>
    </section>
  );
}
