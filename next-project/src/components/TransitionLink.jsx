"use client";

import { forwardRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTransitionNavigate } from "./PageTransition";

/**
 * Drop-in replacement for next/link's <Link> for internal navigation
 * that should play the PageTransition curtain (see PageTransition.jsx).
 *
 * Prefetches the target route on hover/focus so the RSC payload is
 * already warm by the time the curtain finishes covering the screen —
 * without this, the route swap underneath the curtain can lag and the
 * reveal stutters, which is the fastest way to make an otherwise smooth
 * transition feel cheap.
 *
 * Falls back to a normal click for modifier-key clicks (open in new
 * tab, middle-click, etc.) and for hash/external links, which pass
 * straight through untouched.
 *
 * Wrapped in forwardRef so pages can animate the link itself (e.g. the
 * Services page's "← Home" button fades/slides in on mount) — a plain
 * function component would have silently dropped that ref.
 */
const TransitionLink = forwardRef(function TransitionLink(
  { href, children, onClick, onMouseEnter, onFocus, ...props },
  ref
) {
  const navigate = useTransitionNavigate();
  const router = useRouter();
  const isPageRoute = href.startsWith("/") && !href.startsWith("//");

  const prefetch = useCallback(() => {
    if (isPageRoute) router.prefetch(href);
  }, [isPageRoute, router, href]);

  return (
    <a
      ref={ref}
      href={href}
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        prefetch();
      }}
      onFocus={(e) => {
        onFocus?.(e);
        prefetch();
      }}
      onClick={(e) => {
        onClick?.(e);
        if (
          !isPageRoute ||
          e.defaultPrevented ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0
        ) {
          return;
        }
        e.preventDefault();
        navigate(href);
      }}
      {...props}
    >
      {children}
    </a>
  );
});

export default TransitionLink;
