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
        // Entrance choreography is only for content the visitor scrolls
        // TOWARD. Anything already at/above the viewport when we hydrate
        // (restored scroll after a refresh, deep links) shows immediately —
        // otherwise the page sits blank until the JS catches up.
        const vh = window.innerHeight;
        const instant: HTMLElement[] = [];
        const later: HTMLElement[] = [];
        reveals.forEach((el) => {
          (el.getBoundingClientRect().top < vh * 0.96 ? instant : later).push(el);
        });
        instant.forEach((el) => {
          // The CSS hide targets the attribute — dropping it un-hides with
          // zero animation and zero inline styles.
          el.removeAttribute("data-reveal");
          gsap.set(el, { clearProps: "opacity,transform,visibility" });
        });
        if (later.length) {
          gsap.set(later, { autoAlpha: 0, y: 24 });
          ScrollTrigger.batch(later, {
            start: "top 92%",
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
      // Late layout shifts (fonts, images, the intro overlay collapsing the
      // document by 100vh) invalidate trigger positions. The load event may
      // ALREADY have fired by the time we get here — re-measure either way.
      const onLoad = () => ScrollTrigger.refresh();
      if (document.readyState === "complete") {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      } else {
        window.addEventListener("load", onLoad);
      }
      return () => {
        window.removeEventListener("load", onLoad);
        progress.kill();
      };
    },
    { dependencies: [pathname] }
  );

  return null;
}
