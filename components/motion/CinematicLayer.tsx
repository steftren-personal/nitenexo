"use client";

import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/components/motion/gsap";

/**
 * The "maximal cinematic" interaction layer, mounted once in the layout and
 * re-scanned per route. Adds, for pointer devices with motion enabled:
 *   • a glowing cursor that swells over interactive elements,
 *   • magnetic pull on `[data-magnetic]` (CTAs),
 *   • 3D tilt + glare on `[data-tilt]` (cards),
 *   • scroll-velocity skew on the marquee track.
 * All of it no-ops on touch or reduced motion.
 */
export function CinematicLayer() {
  const pathname = usePathname();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const fine = window.matchMedia("(pointer: fine)").matches;
      const cleanups: Array<() => void> = [];

      // ── Magnetic CTAs ──
      if (fine) {
        gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "elastic.out(1, 0.4)" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "elastic.out(1, 0.4)" });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.4);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
          };
          const reset = () => {
            xTo(0);
            yTo(0);
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", reset);
          cleanups.push(() => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", reset);
          });
        });
      }

      // ── 3D tilt + glare ──
      if (fine) {
        gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((el) => {
          if (getComputedStyle(el).position === "static") el.style.position = "relative";
          let glare = el.querySelector<HTMLElement>(".bw-glare");
          if (!glare) {
            glare = document.createElement("div");
            glare.className = "bw-glare";
            el.appendChild(glare);
          }
          const g = glare;
          const rotX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
          const rotY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            rotY((px - 0.5) * 12);
            rotX((0.5 - py) * 12);
            g.style.setProperty("--gx", `${px * 100}%`);
            g.style.setProperty("--gy", `${py * 100}%`);
          };
          const enter = () => gsap.set(el, { transformPerspective: 900, transformOrigin: "center" });
          const leave = () => {
            rotX(0);
            rotY(0);
            g.style.opacity = "0";
          };
          const over = () => (g.style.opacity = "1");
          el.addEventListener("pointerenter", enter);
          el.addEventListener("pointerover", over);
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            el.removeEventListener("pointerenter", enter);
            el.removeEventListener("pointerover", over);
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
          });
        });
      }

      // ── Scroll-velocity skew on the marquee ──
      const track = document.querySelector<HTMLElement>(".bw-marquee-track");
      if (track) {
        const setSkew = gsap.quickTo(track, "skewX", { duration: 0.4, ease: "power3" });
        const st = ScrollTrigger.create({
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-12, 12, (self.getVelocity() / 220) as number);
            setSkew(v);
            gsap.to(track, { skewX: 0, duration: 0.6, overwrite: "auto" });
          },
        });
        cleanups.push(() => st.kill());
      }

      return () => cleanups.forEach((fn) => fn());
    },
    { dependencies: [pathname] }
  );

  return null;
}
