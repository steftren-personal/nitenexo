"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/components/motion/gsap";

/**
 * RobotStop — the phone version of the traveling robot. On small screens the
 * fixed desktop guide would overlap the full-width text, so instead the robot
 * makes small IN-FLOW appearances along the page: at each stop he flies in
 * from the screen edge, gestures in sync with your scrolling (same frame set
 * as the guide, eased — frozen when you stop), and flies back out when you
 * scroll up past him. Alternating sides; never covers content.
 *
 * Rendered only on <1024px with motion allowed (CSS gates `.robot-stop`);
 * the JS also bails on desktop so phones-only pay the asset cost.
 */
const FRAME_COUNT = 60;
const framePath = (i: number) => `/assets/robot-frames/f${String(i + 1).padStart(3, "0")}.webp`;

// One shared frame cache for all stops on the page.
let sharedFrames: HTMLImageElement[] | null = null;
const getFrames = (onFirst: () => void) => {
  if (sharedFrames) {
    onFirst();
    return sharedFrames;
  }
  sharedFrames = [];
  for (let i = 0; i < FRAME_COUNT; i++) {
    const img = new Image();
    if (i === 0) img.onload = onFirst;
    img.src = framePath(i);
    sharedFrames.push(img);
  }
  return sharedFrames;
};

export function RobotStop({ side = "right" }: { side?: "left" | "right" }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (prefersReducedMotion() || window.innerWidth >= 1024) return;

      const bot = el.querySelector<HTMLElement>(".rs-bot");
      const canvas = el.querySelector<HTMLCanvasElement>(".rs-canvas");
      const ctx = canvas?.getContext("2d");
      if (!bot || !canvas || !ctx) return;

      // Declared before drawFrame and assigned after, so the synchronous
      // onFirst callback from a warm cache can't hit a TDZ error.
      let frames: HTMLImageElement[] = [];
      const drawFrame = (idx: number) => {
        const img = frames[idx];
        if (!img || !img.complete || !img.naturalWidth) return;
        if (canvas.width !== img.naturalWidth) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      frames = getFrames(() => drawFrame(0));
      if (frames[0]?.complete) drawFrame(0); // warm cache → draw the idle pose now

      gsap.set(bot, { xPercent: side === "right" ? 130 : -130, autoAlpha: 0, rotation: side === "right" ? 10 : -10 });

      const flyIn = () =>
        gsap.to(bot, { xPercent: 0, autoAlpha: 1, rotation: 0, duration: 0.7, ease: "back.out(1.4)", overwrite: "auto" });
      const flyOut = () =>
        gsap.to(bot, {
          xPercent: side === "right" ? 130 : -130,
          autoAlpha: 0,
          rotation: side === "right" ? 10 : -10,
          duration: 0.45,
          ease: "power2.in",
          overwrite: "auto",
        });

      // Gesture frames eased against scroll — moves while you scroll past,
      // freezes when you stop (same feel as the desktop guide).
      let targetP = 0;
      let dispP = 0;
      let lastDrawn = -1;
      const tick = (_t: number, dt: number) => {
        dispP += (targetP - dispP) * (1 - Math.exp(-dt / 130));
        const idx = Math.round(gsap.utils.clamp(0, 1, dispP) * (FRAME_COUNT - 1));
        if (idx !== lastDrawn) {
          lastDrawn = idx;
          drawFrame(idx);
        }
      };

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        end: "bottom 8%",
        onEnter: flyIn,
        onEnterBack: flyIn,
        onLeaveBack: flyOut, // scrolled back above → wave off
        onToggle: (self) => {
          if (self.isActive) gsap.ticker.add(tick);
          else gsap.ticker.remove(tick);
        },
        onUpdate: (self) => {
          targetP = self.progress;
        },
      });

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    },
    { scope: root, dependencies: [side] }
  );

  return (
    <div ref={root} className="robot-stop" data-side={side} aria-hidden="true">
      <div className="rs-bot">
        <div className="rs-flip">
          <canvas className="rs-canvas" />
        </div>
      </div>
    </div>
  );
}
