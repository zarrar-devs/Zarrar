"use client";

import { useEffect, useRef, useState } from "react";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./WhyChooseUs.module.css";
import ContactModal from "../ContactModal/ContactModal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

const KICKER_TEXT =
  "Every project starts with one question — how does this get you more customers?";

const QUOTE_TEXT =
  "A beautiful website that doesn't bring you customers is just an " +
  "expensive brochure.";

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

const CTA_SERVICES = [
  { id: "web", label: "Web development" },
  { id: "leads", label: "Lead generation" },
  { id: "email", label: "Email marketing" },
  { id: "design", label: "Graphic design" },
];

function Chip({ id }) {
  const def = CHIP_DEFS[id];
  if (!def) return null;
  return (
    <span className={styles.chip} style={{ backgroundColor: def.bg }} aria-hidden="true">
      {def.icon}
    </span>
  );
}

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

// Replaces the old STORIES (testimonial) data. Nothing here is a claim
// about a third party — it's how the studio itself works — so there is
// nothing to fake and nothing that needs a review/rating schema.
//
// IMPORTANT: edit this copy so it matches how you REALLY run projects.
// This is the one place to keep it honest and specific (add timelines,
// deliverables, tools, etc. only if they're true).
const PROCESS_STEPS = [
  {
    title: "Discover",
    desc:
      "We start with your customers, your offer, and what a new lead is " +
      "actually worth to your business.",
    outcome: "A clear goal",
    tint: "#CFE3FF",
  },
  {
    title: "Plan",
    desc:
      "The site, the lead funnel, and the email flow are mapped together, " +
      "so nothing gets built in isolation.",
    outcome: "One shared roadmap",
    tint: "#FFDCA8",
  },
  {
    title: "Design",
    desc:
      "Layouts and brand assets that look premium and point every " +
      "visitor toward one clear next action.",
    outcome: "A consistent brand",
    tint: "#D6F3D0",
  },
  {
    title: "Build",
    desc:
      "A custom Next.js site that loads fast on every device, with lead " +
      "capture wired in from day one.",
    outcome: "A fast, working site",
    tint: "#F5D3E6",
  },
  {
    title: "Grow",
    desc:
      "Email sequences and ongoing tuning so new contacts are nurtured " +
      "and results keep improving.",
    outcome: "Steady improvement",
    tint: "#E1D9FF",
  },
];

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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

const MARQUEE_PHRASE = "Let's build your next website";
const MARQUEE_REPEAT = 6;

// Single source of truth for the secondary contact path — previously
// the mailto: href (hello@zarrar.studio) and the visible link text
// (isabella.web.devs@gmail.com) were two different addresses. Update
// this one constant and both stay in sync.
const CONTACT_EMAIL = "isabella.web.devs@gmail.com";

const SNAP_DURATION = 0.5;
const SNAP_EASE = "power2.out";

// Slightly slower than the old testimonial loop — these cards carry a
// bit more to read (title + sentence + outcome).
const STEPS_LOOP_DURATION = 20;

const CARD_STEP_DURATION = STEPS_LOOP_DURATION / PROCESS_STEPS.length;

const STEPS_HOVER_TIMESCALE = 0;

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

  const stage1Ref = useRef(null);
  const heroRef = useRef(null);
  const kickerRef = useRef(null);
  const statementRef = useRef(null);
  const stepsLabelRef = useRef(null);
  const stepsViewportRef = useRef(null);
  const stepsTrackRef = useRef(null);
  const stepsCursorRef = useRef(null);
  const stepItemRefs = useRef([]);
  const carouselTweenRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const quoteRef = useRef(null);
  const quoteTextRef = useRef(null);
  const ctaRef = useRef(null);

  const marqueeSectionRef = useRef(null);
  const marqueeTrackRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
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

      gsap.from(stepsLabelRef.current, {
        opacity: 0,
        y: 12,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: { trigger: stepsLabelRef.current, start: "top 92%" },
      });

      gsap.fromTo(
        stepItemRefs.current,
        { opacity: 0, y: 36, scale: 0.97, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: stepsTrackRef.current, start: "top 92%" },
        }
      );

      gsap.set([quoteRef.current, marqueeSectionRef.current], {
        backgroundColor: "#0a0a0a",
        color: "#ffffff",
      });

      ScrollTrigger.create({
        trigger: quoteRef.current,
        start: isMobile ? "top -10%" : "top 10%",
        onEnter: () =>
          gsap.to([quoteRef.current, marqueeSectionRef.current], {
            backgroundColor: "var(--color-accent)",
            color: "var(--color-ink)",
            duration: SNAP_DURATION,
            ease: SNAP_EASE,
          }),
        onLeaveBack: () =>
          gsap.to([quoteRef.current, marqueeSectionRef.current], {
            backgroundColor: "#0a0a0a",
            color: "#ffffff",
            duration: SNAP_DURATION,
            ease: SNAP_EASE,
          }),
      });

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

      gsap.from(
        [
          `.${styles.marqueeHeading}`,
          `.${styles.marqueeSub}`,
          `.${styles.marqueeServices}`,
          `.${styles.marqueeCtaActions}`,
        ],
        {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: marqueeSectionRef.current,
            start: "top 65%",
          },
        }
      );

      const marqueeTween = gsap.to(marqueeTrackRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 22,
        repeat: -1,
      });

      let lastBoost = 1;
      let idleTimeout;
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
          // Only spin up a new tween when the boost actually moved —
          // onUpdate can fire many times per scroll tick, and without
          // this guard every tick was creating a fresh gsap.to() call.
          if (Math.abs(boost - lastBoost) > 0.03) {
            lastBoost = boost;
            gsap.to(marqueeTween, {
              timeScale: boost,
              duration: 0.3,
              overwrite: true,
            });
          }
          // getVelocity() reports 0 almost immediately after scrolling
          // stops, but that 0 only reaches here on the NEXT scroll
          // event — so without this timeout, the marquee stayed sped up
          // (or slowed down) indefinitely once someone stopped
          // scrolling mid-tick, instead of settling back to its normal
          // pace.
          clearTimeout(idleTimeout);
          idleTimeout = setTimeout(() => {
            lastBoost = 1;
            gsap.to(marqueeTween, { timeScale: 1, duration: 0.6, overwrite: true });
          }, 120);
        },
      });
    }, sectionRef);

    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", handleLoad);

    // Resize/orientation-change safety net, debounced so a drag-resize
    // doesn't fire dozens of refreshes in a row. This only re-measures
    // where each existing trigger's start/end points now fall — it does
    // not change what triggers them or what they animate, so the
    // color-snap behavior itself is untouched.
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const track = stepsTrackRef.current;
    const viewport = stepsViewportRef.current;
    if (!track || !viewport) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const tween = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: STEPS_LOOP_DURATION,
      repeat: -1,
    });
    carouselTweenRef.current = tween;

    const stop = () => {
      if (tween.paused()) return;
      gsap.to(tween, { timeScale: STEPS_HOVER_TIMESCALE, duration: 0.25, overwrite: true });
    };
    const resume = () => {
      if (tween.paused()) return;
      gsap.to(tween, { timeScale: 1, duration: 0.4, overwrite: true });
    };

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

    const stepCarousel = (direction) => {
      gsap.to(tween, {
        totalTime: tween.totalTime() + direction * CARD_STEP_DURATION,
        duration: 0.5,
        ease: "power2.inOut",
        overwrite: true,
      });
    };

    // Click the left/right half of the carousel to step back/forward.
    // (The old "View photo" button guard is gone — cards no longer
    // contain any interactive elements.)
    const handleClick = (event) => {
      const bounds = viewport.getBoundingClientRect();
      const clickedLeftHalf = event.clientX - bounds.left < bounds.width / 2;
      stepCarousel(clickedLeftHalf ? -1 : 1);
    };
    viewport.addEventListener("click", handleClick);

    const cards = Array.from(track.querySelectorAll(`.${styles.stepCard}`));
    cards.forEach((card) => {
      card.addEventListener("mouseenter", handleEnter);
      card.addEventListener("mouseleave", handleLeave);
    });

    tween.stepCarousel = stepCarousel;

    return () => {
      viewport.removeEventListener("click", handleClick);
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", handleEnter);
        card.removeEventListener("mouseleave", handleLeave);
      });
      tween.kill();
      carouselTweenRef.current = null;
    };
  }, []);

  useEffect(() => {
    const viewport = stepsViewportRef.current;
    const cursor = stepsCursorRef.current;
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

  // Service structured data only. The old Organization schema with
  // aggregateRating + Review[] was generated from the placeholder
  // testimonials, i.e. fabricated reviews — that's against Google's
  // review-snippet guidelines and can trigger a manual action. It has
  // been removed on purpose. Only add Review / AggregateRating markup
  // back once it's built from REAL, verifiable reviews (and note Google
  // ignores self-served reviews for an organization's own site anyway).
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

  const renderStepGroup = (duplicate) => (
    <div
      className={styles.stepsTrackGroup}
      aria-hidden={duplicate ? "true" : undefined}
    >
      {PROCESS_STEPS.map((step, i) => {
        // The duplicated group exists only for the seamless loop, so it
        // must not add a second set of headings to the page outline.
        const Title = duplicate ? "p" : "h3";
        return (
          <article
            key={step.title}
            ref={duplicate ? undefined : (el) => (stepItemRefs.current[i] = el)}
            className={styles.stepCard}
          >
            <span
              className={styles.stepNumber}
              style={{ backgroundColor: step.tint }}
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <Title className={styles.stepTitle}>{step.title}</Title>

            <p className={styles.stepDesc}>{step.desc}</p>

            <div className={styles.stepOutcome}>
              <span className={styles.stepOutcomeLabel}>You get</span>
              <span className={styles.stepOutcomeValue}>{step.outcome}</span>
            </div>
          </article>
        );
      })}
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

          <div className={styles.stepsSection}>
            <div className={styles.stepsHeader}>
              <span ref={stepsLabelRef} className={styles.stepsLabel}>
                How we work
              </span>

              <div className={styles.stepsControls}>
                <button
                  type="button"
                  className={styles.stepsControlButton}
                  onClick={() => handleStep(-1)}
                  aria-label="Show previous step"
                >
                  <ChevronIcon direction="left" />
                </button>
                <button
                  type="button"
                  className={styles.stepsControlButton}
                  onClick={handleTogglePause}
                  aria-pressed={isPaused}
                  aria-label={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
                >
                  {isPaused ? <PlayIcon /> : <PauseIcon />}
                </button>
                <button
                  type="button"
                  className={styles.stepsControlButton}
                  onClick={() => handleStep(1)}
                  aria-label="Show next step"
                >
                  <ChevronIcon direction="right" />
                </button>
              </div>
            </div>

            <div
              className={styles.stepsCarousel}
              role="region"
              aria-label="How we work"
            >
              <div className={styles.stepsViewport} ref={stepsViewportRef}>
                <div className={styles.stepsTrack} ref={stepsTrackRef}>
                  {renderStepGroup(false)}
                  {renderStepGroup(true)}
                </div>
              </div>

              <div
                ref={stepsCursorRef}
                className={styles.stepsCursor}
                aria-hidden="true"
              >
                Next
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <button
              type="button"
              className={styles.ctaButton}
              onClick={() => setIsContactOpen(true)}
            >
              <span className={styles.ctaButtonFill} aria-hidden="true" />
              <span className={styles.ctaButtonLabel}>Start a Project</span>
              <span className={styles.ctaButtonIcon} aria-hidden="true">
                <ArrowIcon />
              </span>
            </button>
            <a href={`mailto:${CONTACT_EMAIL}`} className={styles.marqueeContactLink}>
              Or email {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
}