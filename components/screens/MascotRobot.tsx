"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/components/motion/gsap";

/**
 * The NiteNexo mascot — a rigged SVG robot that's genuinely interactive (no
 * Spline, no watermark, truly transparent). Eyes/pupils track the cursor, the
 * head tilts toward it, the antenna sways, it blinks on a loop and waves when
 * you hover. With `autoWave`, it also waves a greeting when it scrolls into view
 * and a goodbye when it scrolls back out. Degrades to a static robot under
 * reduced motion.
 */
export function MascotRobot({ autoWave = false }: { autoWave?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = wrap.current;
      if (!el || prefersReducedMotion()) return;
      const fine = window.matchMedia("(pointer: fine)").matches;

      gsap.set(".mr-bot", { transformOrigin: "50% 60%" });
      gsap.set(".mr-eyes", { transformOrigin: "50% 50%" });

      // Blink loop
      const blink = gsap.timeline({ repeat: -1, repeatDelay: 2.6 });
      blink.to(".mr-eyes", { scaleY: 0.12, duration: 0.09 }).to(".mr-eyes", { scaleY: 1, duration: 0.09 });

      // Antenna sway (ambient)
      gsap.to(".mr-antenna", { rotation: 7, transformOrigin: "50% 100%", duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });

      let onMove: ((e: PointerEvent) => void) | null = null;
      if (fine) {
        const rotTo = gsap.quickTo(".mr-bot", "rotation", { duration: 0.6, ease: "power3" });
        const bxTo = gsap.quickTo(".mr-bot", "x", { duration: 0.6, ease: "power3" });
        const byTo = gsap.quickTo(".mr-bot", "y", { duration: 0.6, ease: "power3" });
        const pxTo = gsap.quickTo(".mr-pupil", "x", { duration: 0.35, ease: "power3" });
        const pyTo = gsap.quickTo(".mr-pupil", "y", { duration: 0.35, ease: "power3" });
        onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const nx = gsap.utils.clamp(-1, 1, (e.clientX - (r.left + r.width / 2)) / (r.width / 1.4));
          const ny = gsap.utils.clamp(-1, 1, (e.clientY - (r.top + r.height / 2)) / (r.height / 1.4));
          rotTo(nx * 7);
          bxTo(nx * 12);
          byTo(ny * 9);
          pxTo(nx * 7);
          pyTo(ny * 6);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
      }

      // Wave (hover + optional scroll-driven greeting/goodbye)
      const doWave = () => {
        gsap.to(".mr-arm-r", { rotation: -28, transformOrigin: "50% 12%", duration: 0.16, yoyo: true, repeat: 3, ease: "sine.inOut", overwrite: true });
        gsap.fromTo(".mr-bot", { y: "+=0" }, { y: "-=10", duration: 0.2, yoyo: true, repeat: 1, ease: "sine.inOut" });
      };
      el.addEventListener("pointerenter", doWave);

      let st: ScrollTrigger | null = null;
      if (autoWave) {
        st = ScrollTrigger.create({
          trigger: el,
          start: "top 70%",
          end: "bottom 35%",
          onEnter: () => gsap.delayedCall(0.4, doWave), // greeting
          onLeave: doWave, // goodbye when scrolled past
          onEnterBack: () => gsap.delayedCall(0.2, doWave),
        });
      }

      return () => {
        if (onMove) window.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerenter", doWave);
        blink.kill();
        st?.kill();
      };
    },
    { scope: wrap, dependencies: [autoWave] }
  );

  return (
    <div ref={wrap} className="bw-float" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
      <svg viewBox="0 0 360 430" style={{ width: "min(440px, 92%)", height: "auto", overflow: "visible" }} role="img" aria-label="Interaktiver NiteNexo-Roboter">
        {/* glow */}
        <ellipse cx={180} cy={215} rx={150} ry={150} fill="url(#mr-glow)" opacity={0.5} />
        <g className="mr-bot">
          <ellipse className="mr-shadow" cx={180} cy={372} rx={104} ry={16} fill="rgba(0,0,0,0.4)" />
          {/* arms */}
          <rect className="mr-arm-l" x={42} y={208} width={32} height={86} rx={16} fill="#ffffff" stroke="#1f1633" strokeWidth={4} />
          <rect className="mr-arm-r" x={286} y={208} width={32} height={86} rx={16} fill="#ffffff" stroke="#1f1633" strokeWidth={4} />
          {/* antenna */}
          <g className="mr-antenna">
            <line x1={180} y1={120} x2={180} y2={82} stroke="#1f1633" strokeWidth={5} strokeLinecap="round" />
            <circle cx={180} cy={68} r={15} fill="#fa7faa" stroke="#1f1633" strokeWidth={4} />
          </g>
          {/* body + face */}
          <rect x={70} y={120} width={220} height={200} rx={54} fill="#ffffff" />
          <rect x={96} y={150} width={168} height={140} rx={38} fill="#c2ef4e" stroke="#1f1633" strokeWidth={6} />
          {/* eyes (with pupils) */}
          <g className="mr-eyes">
            <rect x={135} y={196} width={36} height={52} rx={18} fill="#1f1633" />
            <rect x={189} y={196} width={36} height={52} rx={18} fill="#1f1633" />
            <circle className="mr-pupil" cx={153} cy={222} r={6} fill="#eafff0" />
            <circle className="mr-pupil" cx={207} cy={222} r={6} fill="#eafff0" />
          </g>
          {/* mouth */}
          <path d="M150 266 Q 180 290 210 266" stroke="#1f1633" strokeWidth={6} strokeLinecap="round" fill="none" />
          {/* cheeks */}
          <circle cx={120} cy={252} r={9} fill="#fa7faa" />
          <circle cx={240} cy={252} r={9} fill="#fa7faa" />
        </g>
        <defs>
          <radialGradient id="mr-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(194,239,78,0.45)" />
            <stop offset="55%" stopColor="rgba(122,63,240,0.28)" />
            <stop offset="100%" stopColor="rgba(122,63,240,0)" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
