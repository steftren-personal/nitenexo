"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "./gsap";

/** Once-only entrances. Content is visible before JS and after teardown. */
export function HomeMotion() {
  useGSAP(() => {
    const host = document.querySelector<HTMLElement>(".nn-home");
    if (!host) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const later = Array.from(host.querySelectorAll<HTMLElement>("[data-reveal]"))
        .filter(el => el.getBoundingClientRect().top >= window.innerHeight * .96);
      gsap.set(later, { opacity: 0, y: 16 });
      const triggers = ScrollTrigger.batch(later, {
        start: "top 94%", once: true, batchMax: 5, interval: .08,
        onEnter: elements => {
          gsap.to(elements, {
            opacity: 1, y: 0, duration: .6, stagger: .08, ease: "power2.out", overwrite: true,
            clearProps: "opacity,transform",
          });
          elements.forEach(el => {
            const line = el.querySelector(".ck-line");
            if (line) gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: .6, ease: "power2.out", clearProps: "transform" });
          });
        },
      });
      // Keyboard navigation must never land on an invisible link/card.
      const revealFocus = (event: FocusEvent) => {
        const element = (event.target as HTMLElement).closest<HTMLElement>("[data-reveal]");
        if (!element) return;
        gsap.killTweensOf(element);
        gsap.set(element, { clearProps: "opacity,transform" });
        triggers.filter(trigger => trigger.trigger === element).forEach(trigger => trigger.kill());
      };
      host.addEventListener("focusin", revealFocus);
      return () => {
        host.removeEventListener("focusin", revealFocus);
        gsap.killTweensOf(later);
        gsap.set(later, { clearProps: "opacity,transform" });
      };
    }, host);
    return () => mm.revert();
  });
  return null;
}
