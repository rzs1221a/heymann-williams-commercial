import { useEffect, useRef, type RefObject } from "react";

/**
 * Reveal-on-scroll, the quiet kind. Sets data-reveal="" on mount and flips it
 * to "in" the first time the element crosses 8% above the viewport bottom.
 * Reduced motion, no IntersectionObserver, or a 3s failsafe all short-circuit
 * to "in" — nothing can stay invisible. The attribute is client-only, so the
 * prerendered HTML is never hidden from crawlers or no-JS readers.
 */
export function useReveal<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.setAttribute("data-reveal", "in");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      show();
      return;
    }
    el.setAttribute("data-reveal", "");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          show();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );
    io.observe(el);
    const failsafe = window.setTimeout(show, 3000);
    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);
  return ref;
}
