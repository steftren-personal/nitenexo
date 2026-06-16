"use client";

import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/components/motion/gsap";

/**
 * Global GSAP driver, mounted once in the layout and re-scanned on every route
 * change. Handles:
 *   • the top scroll-progress bar,
 *   • staggered scroll reveals for any `[data-reveal]` element,
 *   • gentle parallax for any `[data-parallax]` element.
 * Does nothing when the visitor prefers reduced motion (content just shows).
 */
export function MotionRoot() {
  const pathname = usePathname();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // ── Scroll progress bar ──
      let bar = document.querySelector<HTMLDivElement>(".bw-progress");
      if (!bar) {
        bar = document.createElement("div");
        bar.className = "bw-progress";
        document.body.appendChild(bar);
      }
      const progress = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => gsap.set(bar!, { scaleX: self.progress }),
      });

      // ── Scroll reveals ──
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (reveals.length) {
        gsap.set(reveals, { autoAlpha: 0, y: 24 });
        ScrollTrigger.batch(reveals, {
          start: "top 88%",
          onEnter: (els) =>
            gsap.to(els, {
              autoAlpha: 1,
              y: 0,
              duration: 0.62,
              ease: "power3.out",
              stagger: 0.09,
              overwrite: true,
              onComplete: () =>
                els.forEach((el) => {
                  // Drop the marker + inline styles so CSS hover-lift can take over.
                  (el as HTMLElement).removeAttribute("data-reveal");
                  gsap.set(el, { clearProps: "opacity,transform,visibility" });
                }),
            }),
        });
      }

      // ── Parallax ──
      const parallax = gsap.utils.toArray<HTMLElement>("[data-parallax]");
      parallax.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || "0");
        gsap.to(el, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      ScrollTrigger.refresh();
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);
      return () => {
        window.removeEventListener("load", onLoad);
        progress.kill();
      };
    },
    { dependencies: [pathname] }
  );

  return null;
}
