"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

/**
 * Page transition — a curtain of vertical panels sweeps UP to cover the
 * screen, the route swaps underneath while it's fully covered, then the
 * same curtain sweeps OFF the top to reveal the new page. A brief light
 * sheen catches the curtain right as it finishes covering, then the
 * "ZARRAR" mark pops in with a tiny overshoot — the same mono-stamp
 * device already used on the nav mark and the headline's boxed words,
 * so this reads as part of the same brand instead of a generic spinner.
 *
 * Deliberately does NOT touch {children} in any way — no transform, no
 * filter, no wrapping div with will-change. Any of those force a new
 * containing block for `position: fixed` descendants (a full-screen
 * Preloader, a pinned ScrollTrigger element, a fixed header) and
 * silently break them the moment the page mounts. Everything animated
 * here lives on the overlay layer only, which sits as a sibling of
 * {children}, never a wrapper around it.
 *
 * Usage:
 *   1. Wrap the root layout's children in <PageTransition>.
 *   2. Use <TransitionLink href="/services"> (see TransitionLink.jsx)
 *      instead of next/link's <Link> for any internal nav that should
 *      play this animation. TransitionLink also prefetches on
 *      hover/focus so the route swap underneath the curtain doesn't lag.
 *
 * prefers-reduced-motion: skips straight to router.push, no animation,
 * on both the outgoing click and the incoming route-change reveal.
 */

const TransitionContext = createContext(null);
const BAR_COUNT = 5;

export function useTransitionNavigate() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error("useTransitionNavigate must be used inside <PageTransition>");
  }
  return ctx.navigate;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function lockScroll(lock) {
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

export default function PageTransition({ children, mark = "ZARRAR" }) {
  const overlayRef = useRef(null);
  const sheenRef = useRef(null);
  const markRef = useRef(null);
  const isAnimating = useRef(false);
  const prevPathname = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  if (prevPathname.current === null) prevPathname.current = pathname;

  // Fires once the route has actually changed underneath the (currently
  // fully-covering) curtain — sweep it off the top to reveal the new
  // page. Skipped on first mount, since prevPathname starts equal to
  // pathname there.
  useLayoutEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    window.scrollTo(0, 0);

    if (prefersReducedMotion()) {
      lockScroll(false);
      return;
    }

    const bars = overlayRef.current.querySelectorAll(".page-transition-bar");

    gsap
      .timeline({ onComplete: () => lockScroll(false) })
      .to(markRef.current, { autoAlpha: 0, y: -8, duration: 0.2, ease: "power2.in" })
      .set(bars, { transformOrigin: "top" })
      .to(bars, { scaleY: 0, duration: 0.7, ease: "power4.inOut", stagger: 0.05 }, 0)
      .set(overlayRef.current, { pointerEvents: "none" });
  }, [pathname]);

  const navigate = useCallback(
    (href) => {
      if (isAnimating.current || href === pathname) return;

      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }

      isAnimating.current = true;
      lockScroll(true);
      const bars = overlayRef.current.querySelectorAll(".page-transition-bar");

      gsap
        .timeline({
          onComplete: () => {
            router.push(href);
            isAnimating.current = false;
          },
        })
        .set(overlayRef.current, { pointerEvents: "auto" })
        .set(bars, { scaleY: 0, transformOrigin: "bottom" })
        .set(sheenRef.current, { xPercent: -120 })
        .to(bars, { scaleY: 1, duration: 0.7, ease: "power4.inOut", stagger: 0.05 }, 0)
        .to(
          sheenRef.current,
          { xPercent: 220, duration: 0.5, ease: "power2.inOut" },
          "-=0.35"
        )
        .fromTo(
          markRef.current,
          { autoAlpha: 0, y: 10, scale: 0.9 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.6)" },
          "-=0.3"
        );
    },
    [router, pathname]
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div ref={overlayRef} className="page-transition-overlay" aria-hidden="true">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div key={i} className="page-transition-bar" />
        ))}
        <div ref={sheenRef} className="page-transition-sheen" />
        <span ref={markRef} className="page-transition-mark">
          {mark}
        </span>
      </div>
      <style>{`
        .page-transition-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          overflow: hidden;
          pointer-events: none;
        }
        .page-transition-bar {
          /* flex: 1 1 0 splits the viewport into fractional widths that
             don't always round to a whole pixel, leaving a hairline gap
             between adjacent bars where the page underneath shows
             through. Overlapping each bar 1px onto the next one hides
             that seam regardless of how the browser rounds it; the
             overlay's overflow: hidden above keeps the last bar's 1px
             overlap from peeking past the right edge of the screen. */
          flex: 1 1 0;
          height: 100%;
          margin-right: -1px;
          background: #0B0B0C;
          background-image: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.04),
            rgba(255, 255, 255, 0) 40%
          );
          transform: scaleY(0);
          transform-origin: bottom;
          will-change: transform;
        }
        .page-transition-sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 42%,
            rgba(255, 255, 255, 0.16) 50%,
            transparent 58%
          );
          transform: translateX(-120%);
          pointer-events: none;
        }
        .page-transition-mark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          visibility: hidden;
          color: #FFFFFF;
          font-family: var(--font-mono-stamp, "Space Mono", monospace);
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: 0.08em;
        }
      `}</style>
    </TransitionContext.Provider>
  );
}
