"use client";

/* =============================================================
   Zarrar — /for-coaches  ·  motion layer
   -------------------------------------------------------------
   Renders nothing. It only animates the server-rendered markup
   inside `.coaches-page`, so all content stays in the HTML.

   SEO/perf decisions vs. the old version:
   - The hero sub-copy is never masked or faded (it's the text
     that paints first), only nudged up 22px.
   - Splitting waits for fonts (max 1.5s) so line breaks are
     measured with the real font, not the fallback.
   - Lenis removed: it was never destroyed on route change
     (ticker leak) and it fights native #anchor jumps. If you
     want smooth scroll site-wide, mount it once in the root
     layout instead of once per page.
   ============================================================= */

import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const fontsSettled = () => {
  const ready = document.fonts?.ready ?? Promise.resolve();
  const timeout = new Promise((resolve) => setTimeout(resolve, 1500));
  return Promise.race([ready, timeout]);
};

export default function CoachesMotion({ scope = ".coaches-page" }) {
  useIsoLayoutEffect(() => {
    const root = document.querySelector(scope);
    if (!root) return undefined;

    const splits = [];
    let ctx;
    let cancelled = false;

    const init = () => {
      if (cancelled) return;

      ctx = gsap.context((self) => {
        const q = self.selector;

        const flipIn = (el, opts = {}) => {
          if (!el) return gsap.timeline();

          const split = SplitText.create(el, {
            type: "chars,words",
            charsClass: "char",
            wordsClass: "word",
            aria: "auto",
          });
          splits.push(split);
          gsap.set(el, { perspective: 620 });

          return gsap.from(split.chars, {
            rotateX: -96,
            rotateY: (i) => (i % 2 ? 8 : -5),
            z: -70,
            yPercent: 36,
            scaleY: 0.4,
            transformOrigin: "50% 100% -0.42em",
            duration: 1.05,
            ease: "expo.out",
            stagger: { each: 0.02 },
            onComplete: () => gsap.set(split.chars, { clearProps: "willChange" }),
            scrollTrigger: opts.trigger
              ? { trigger: opts.trigger, start: opts.start || "top 80%", once: true }
              : undefined,
          });
        };

        const linesIn = (el, opts = {}) => {
          if (!el) return gsap.timeline();

          const split = SplitText.create(el, {
            type: "lines",
            linesClass: "line",
            mask: "lines",
            aria: "auto",
          });
          splits.push(split);

          return gsap.from(split.lines, {
            yPercent: 110,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.07,
            scrollTrigger: opts.trigger
              ? { trigger: opts.trigger, start: opts.start || "top 85%", once: true }
              : undefined,
          });
        };

        const drawIcon = (svg, trigger) => {
          if (!svg) return;
          const strokes = svg.querySelectorAll(".draw");
          strokes.forEach((s) => {
            const len = s.getTotalLength ? s.getTotalLength() : 200;
            gsap.set(s, { strokeDasharray: len, strokeDashoffset: len });
          });
          gsap.to(strokes, {
            strokeDashoffset: 0,
            duration: 1,
            ease: "power2.out",
            stagger: 0.06,
            scrollTrigger: { trigger, start: "top 80%", once: true },
          });
        };

        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: reduce)", () => {
          gsap.set(q(".hero-rule, .problem-rule"), { scaleX: 1 });
        });

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          /* ---- load sequence (hero text stays visible: transform-only) ---- */
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .from(q(".logo, .nav-links a, .nav-cta"), {
              yPercent: -160, opacity: 0, duration: 0.75, stagger: 0.05,
            })
            .add(flipIn(q(".hero-l1")[0]), 0.06)
            .add(flipIn(q(".hero-l2")[0]), 0.2)
            .from(q(".hero-sub"), { y: 22, duration: 0.8 }, 0.42)
            .from(q(".hero-actions > *"), { y: 24, opacity: 0, duration: 0.75, stagger: 0.08 }, 0.55)
            .to(q(".hero-rule"), { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0.35);

          /* ---- scroll progress ---- */
          gsap.to(q(".nav-progress span"), {
            scaleX: 1, ease: "none",
            scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.3 },
          });

          /* ---- hero drifts away as you leave it ---- */
          gsap.to(q(".hero-heading"), {
            yPercent: -14, opacity: 0.25, ease: "none",
            scrollTrigger: { trigger: q(".hero")[0], start: "top top", end: "bottom top", scrub: 0.6 },
          });

          /* ---- section heads (reused for every section) ---- */
          q(".section-head").forEach((head) => {
            flipIn(head.querySelector("h2"), { trigger: head, start: "top 82%" });
            linesIn(head.querySelector("p"), { trigger: head, start: "top 80%" });
          });

          /* ---- pain points ---- */
          q(".problem-item").forEach((item) => {
            flipIn(item.querySelector("h3"), { trigger: item, start: "top 85%" });
            linesIn(item.querySelector("p"), { trigger: item, start: "top 83%" });
          });
          gsap.from(q(".problem-rule"), {
            scaleX: 0, transformOrigin: "left center", ease: "none", stagger: 0.35,
            scrollTrigger: { trigger: q(".problem-list")[0], start: "top 82%", end: "bottom 65%", scrub: 0.5 },
          });

          /* ---- service cards ---- */
          const cards = q(".service-card");
          gsap.from(cards, {
            y: 60, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.09,
            scrollTrigger: { trigger: q(".services-grid")[0], start: "top 80%", once: true },
          });
          cards.forEach((card) => {
            flipIn(card.querySelector("h3"), { trigger: card, start: "top 82%" });
            drawIcon(card.querySelector("svg"), card);
          });

          /* ---- timeline steps ---- */
          gsap.from(q(".case-step"), {
            y: 50, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.1,
            scrollTrigger: { trigger: q(".case-steps")[0], start: "top 80%", once: true },
          });
          q(".case-step").forEach((step) => {
            flipIn(step.querySelector("h3"), { trigger: step, start: "top 84%" });
          });

          /* ---- plans land tilted in 3D, then settle ---- */
          gsap.set(q(".plans-grid"), { perspective: 1400 });
          gsap.from(q(".plan"), {
            y: 88, rotateX: -13, opacity: 0, transformOrigin: "50% 0%",
            duration: 1.1, ease: "expo.out", stagger: 0.09,
            scrollTrigger: { trigger: q(".plans-grid")[0], start: "top 78%", once: true },
          });
          q(".plan").forEach((plan) => {
            gsap.from(plan.querySelectorAll(".plan-includes li"), {
              y: 14, opacity: 0, duration: 0.55, ease: "power3.out", stagger: 0.05,
              scrollTrigger: { trigger: plan, start: "top 72%", once: true },
            });
          });

          /* ---- FAQ rows ---- */
          gsap.from(q(".faq-item"), {
            y: 26, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.06,
            scrollTrigger: { trigger: q(".faq-list")[0], start: "top 82%", once: true },
          });

          /* ---- closing ---- */
          const close = q(".closing")[0];
          if (close) {
            gsap
              .timeline({ scrollTrigger: { trigger: close, start: "top 82%", once: true } })
              .add(flipIn(close.querySelector("h2")))
              .from(close.querySelector(".btn"), { y: 28, opacity: 0, duration: 0.65, ease: "back.out(1.6)" }, "-=0.45")
              .from(close.querySelector(".closing-alt"), { opacity: 0, duration: 0.5 }, "-=0.2");
          }
        });

        /* ---- magnetic buttons ---- */
        mm.add("(hover: hover) and (pointer: fine)", () => {
          const cleanups = [];
          q(".magnetic").forEach((el) => {
            const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
            const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
            const move = (e) => {
              const r = el.getBoundingClientRect();
              xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
              yTo((e.clientY - (r.top + r.height / 2)) * 0.42);
            };
            const leave = () => { xTo(0); yTo(0); };
            el.addEventListener("pointermove", move);
            el.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              el.removeEventListener("pointermove", move);
              el.removeEventListener("pointerleave", leave);
            });
          });
          return () => cleanups.forEach((fn) => fn());
        });

        return () => mm.revert();
      }, root);
    };

    fontsSettled().then(init);

    return () => {
      cancelled = true;
      ctx?.revert();
      splits.forEach((s) => s.revert());
    };
  }, [scope]);

  return null;
}
