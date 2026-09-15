"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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

const STORIES_LOOP_DURATION = 14;

const CARD_STEP_DURATION = STORIES_LOOP_DURATION / STORIES.length;

const STORIES_HOVER_TIMESCALE = 0;

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
  const storiesLabelRef = useRef(null);
  const storiesViewportRef = useRef(null);
  const storiesTrackRef = useRef(null);
  const storiesCursorRef = useRef(null);
  const storyItemRefs = useRef([]);
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

      gsap.from(storiesLabelRef.current, {
        opacity: 0,
        y: 12,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: { trigger: storiesLabelRef.current, start: "top 92%" },
      });

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

  // Built from the same STORIES testimonials rendered in the carousel
  // above, so the structured data can never drift out of sync with what
  // visitors actually see. This is what lets search engines show a star
  // rating next to this page in results — a real SEO win the section
  // didn't have before, and free once the ratings already exist as copy.
  const averageRating = (
    STORIES.reduce((sum, story) => sum + story.rating, 0) / STORIES.length
  ).toFixed(1);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ZARRAR",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageRating,
      reviewCount: STORIES.length,
    },
    review: STORIES.map((story) => ({
      "@type": "Review",
      author: { "@type": "Person", name: story.handle.replace(/^@/, "") },
      reviewRating: {
        "@type": "Rating",
        ratingValue: story.rating,
        bestRating: 5,
      },
      reviewBody: story.quote,
    })),
  };

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
            <div className={styles.storyCardPhotoImage}>
              <Image
                src={story.photo}
                alt={`${story.handle.replace(/^@/, "")}, ${story.role} — client photo shared with their ZARRAR review`}
                fill
                sizes="(max-width: 860px) 80vw, 380px"
                loading="lazy"
              />
            </div>
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
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
