"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/components/motion/gsap";

/**
 * PinnedVideoHero — a scroll-DRIVEN camera journey through an upscale cocktail
 * bar. A tall `.pvh` section drives the scroll; `.pvh-stage` sticks full-screen
 * inside it and scrolling moves the camera forward (clip pre-split into frames
 * drawn to a <canvas> with eased frame-walk → smooth on stepped input). Benefit
 * statements fly toward you out of the depth; at the end the scene zooms +
 * dissolves to reveal the page hero, which sits directly behind (the section's
 * negative bottom margin pulls it up) → a seamless crossfade in the same colour.
 *
 * Desktop + motion only; phones / reduced-motion play the clip natively.
 */
const FRAME_COUNT = 60;
// Phones get a 720px frame set (~1MB) so the journey works there too without
// blowing the data budget; desktop keeps the sharp 1100px set.
const framePath = (i: number) =>
  `/assets/${typeof window !== "undefined" && window.innerWidth < 768 ? "club-frames-sm" : "club-frames"}/c${String(i + 1).padStart(3, "0")}.webp`;
const VIDEO = "/assets/club-hero.mp4";
const POSTER = "/assets/club-hero-poster.jpg";

const FLY = [
  { text: "Antwortet in Sekunden.", s: 0.08, e: 0.42 },
  { text: "Rund um die Uhr.", s: 0.38, e: 0.66 },
  { text: "Ohne dass dein Team tippt.", s: 0.6, e: 0.9 },
];

// The robot travels WITH you through the bar: keyframes over journey progress
// (x/y as fractions of the stage, s = scale, a = opacity). He enters from the
// right, glides across, then leads the final zoom-through and fades out.
const BOT_COUNT = 60;
const botPath = (i: number) => `/assets/robot-frames/f${String(i + 1).padStart(3, "0")}.webp`;
const BOT_WPS = [
  { p: 0.05, x: 1.15, y: 0.6, s: 0.75, a: 0 },
  { p: 0.16, x: 0.8, y: 0.58, s: 0.9, a: 1 },
  { p: 0.4, x: 0.18, y: 0.66, s: 1.0, a: 1 },
  { p: 0.64, x: 0.78, y: 0.68, s: 1.1, a: 1 },
  { p: 0.82, x: 0.5, y: 0.56, s: 1.45, a: 1 },
  { p: 0.92, x: 0.5, y: 0.46, s: 1.9, a: 0 },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function PinnedVideoHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const stage = el.querySelector<HTMLElement>(".pvh-stage");
      const canvas = el.querySelector<HTMLCanvasElement>(".pvh-canvas");
      const ctx = canvas?.getContext("2d");
      const opener = el.querySelector<HTMLElement>(".pvh-copy");
      const scrim = el.querySelector<HTMLElement>(".pvh-scrim");
      const hint = el.querySelector<HTMLElement>(".pvh-hint");
      const flyEls = gsap.utils.toArray<HTMLElement>(".pvh-fly", el);
      const video = el.querySelector<HTMLVideoElement>(".pvh-video");

      // Scroll-driven journey on ALL sizes now (phones included); only
      // reduced-motion visitors get the plain playing video instead.
      if (!stage || !canvas || !ctx || !opener || prefersReducedMotion()) {
        video?.play?.().catch(() => {});
        return;
      }
      video?.pause?.();

      // ── Frame preload + cover-fit draw (sized to the stage, not the tall section) ──
      const frames: HTMLImageElement[] = [];
      const sizeCanvas = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.round(stage.clientWidth * dpr);
        const h = Math.round(stage.clientHeight * dpr);
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
      };
      const drawFrame = (idx: number) => {
        const img = frames[idx];
        if (!img || !img.complete || !img.naturalWidth) return;
        const cw = canvas.width;
        const ch = canvas.height;
        const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight); // cover
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      };
      sizeCanvas();
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        // Redraw when a frame arrives late and it's the one currently needed —
        // otherwise slow connections leave the canvas transparent (page content
        // behind would peek into the journey).
        img.onload = () => {
          if (i === Math.round(gsap.utils.clamp(0, 1, dispP) * (FRAME_COUNT - 1))) drawFrame(i);
        };
        img.src = framePath(i);
        frames[i] = img;
      }

      // ── Journey robot: frames + draw ────────────────────────────────────
      const botEl = el.querySelector<HTMLElement>(".pvh-bot");
      const botFlip = el.querySelector<HTMLElement>(".pvh-bot-flip");
      const botCanvas = el.querySelector<HTMLCanvasElement>(".pvh-bot-canvas");
      const botCtx = botCanvas?.getContext("2d");
      const botFrames: HTMLImageElement[] = [];
      let botDrawn = -1;
      const drawBot = (idx: number) => {
        if (!botCanvas || !botCtx) return;
        const img = botFrames[idx];
        if (!img || !img.complete || !img.naturalWidth) return;
        if (botCanvas.width !== img.naturalWidth) {
          botCanvas.width = img.naturalWidth;
          botCanvas.height = img.naturalHeight;
        }
        botCtx.clearRect(0, 0, botCanvas.width, botCanvas.height);
        botCtx.drawImage(img, 0, 0);
        botDrawn = idx;
      };
      if (botCanvas && botCtx) {
        for (let i = 0; i < BOT_COUNT; i++) {
          const img = new Image();
          if (i === 0) img.onload = () => drawBot(0);
          img.src = botPath(i);
          botFrames[i] = img;
        }
      }

      // ── Scroll → camera position + flying text + end zoom-through dissolve ──
      let targetP = 0;
      let dispP = 0;
      const clamp01 = (v: number) => gsap.utils.clamp(0, 1, v);
      const render = (p: number) => {
        drawFrame(Math.round(clamp01(p) * (FRAME_COUNT - 1)));

        const oOp = clamp01(1 - p / 0.14);
        opener.style.opacity = oOp.toFixed(3);
        opener.style.transform = `translateY(${(-p * 40).toFixed(1)}px)`;
        if (hint) hint.style.opacity = p < 0.05 ? "1" : "0";

        // Phones: cap the fly-through growth so the text never leaves the screen.
        const maxScl = window.innerWidth < 768 ? 1.28 : 1.9;
        flyEls.forEach((fl, i) => {
          const { s, e } = FLY[i];
          const local = (p - s) / (e - s);
          if (local <= 0 || local >= 1) {
            fl.style.opacity = "0";
            return;
          }
          const scl = lerp(0.62, maxScl, local);
          const fadeIn = clamp01(local / 0.3);
          const fadeOut = 1 - clamp01((local - 0.6) / 0.4);
          const op = Math.min(fadeIn, fadeOut);
          const blur = (local < 0.18 ? (0.18 - local) * 34 : 0) + (local > 0.82 ? (local - 0.82) * 46 : 0);
          fl.style.opacity = op.toFixed(3);
          fl.style.filter = `blur(${blur.toFixed(1)}px)`;
          fl.style.transform = `translate(-50%, -50%) scale(${scl.toFixed(3)})`;
        });

        // Journey robot: glide along his waypoints, gesture with the scroll,
        // face the direction he's moving.
        if (botEl && botFlip) {
          let bi = 0;
          while (bi < BOT_WPS.length - 1 && p >= BOT_WPS[bi + 1].p) bi++;
          const wa = BOT_WPS[bi];
          const wb = BOT_WPS[Math.min(bi + 1, BOT_WPS.length - 1)];
          const seg = wb.p - wa.p;
          const bt = seg > 0 ? clamp01((p - wa.p) / seg) : 0;
          const bx = lerp(wa.x, wb.x, bt) * stage.clientWidth;
          const by = lerp(wa.y, wb.y, bt) * stage.clientHeight;
          const bs = lerp(wa.s, wb.s, bt);
          const ba = p < BOT_WPS[0].p ? 0 : lerp(wa.a, wb.a, bt);
          botEl.style.opacity = ba.toFixed(3);
          botEl.style.transform = `translate(calc(${bx.toFixed(1)}px - 50%), calc(${by.toFixed(1)}px - 50%)) scale(${bs.toFixed(3)})`;
          botFlip.style.transform = wb.x > wa.x ? "scaleX(-1)" : "none"; // face travel direction
          const period = 2 * BOT_COUNT - 2;
          let ph = (p * 2.2 * period) % period;
          if (ph < 0) ph += period;
          const bIdx = Math.floor(ph < BOT_COUNT ? ph : period - ph);
          if (bIdx !== botDrawn) drawBot(bIdx);
        }

        // End: scene rushes forward and dissolves (canvas + scrim fade) → the
        // page gradient + hero behind show through in the same colour.
        const endT = clamp01((p - 0.8) / 0.2);
        const fade = clamp01((p - 0.88) / 0.12); // crossfade to the hero a bit later
        canvas.style.transform = `scale(${(1 + endT * 0.6).toFixed(4)})`;
        canvas.style.opacity = (1 - fade).toFixed(3);
        if (scrim) scrim.style.opacity = (1 - fade).toFixed(3);
      };

      const tick = (_t: number, dt: number) => {
        dispP += (targetP - dispP) * (1 - Math.exp(-dt / 110));
        if (Math.abs(targetP - dispP) < 0.0004) dispP = targetP;
        render(dispP);
      };
      gsap.ticker.add(tick);

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          targetP = self.progress;
        },
        onLeave: () => {
          stage.style.visibility = "hidden"; // past the journey → don't sit over the hero
        },
        onEnterBack: () => {
          stage.style.visibility = "visible";
        },
        onRefresh: () => {
          sizeCanvas();
          render(dispP);
        },
      });
      render(0);

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} className="pvh" aria-label="NiteNexo — Komm rein">
      <div className="pvh-stage">
        <video className="pvh-video" loop muted playsInline preload="none" poster={POSTER}>
          <source src={VIDEO} type="video/mp4" />
        </video>
        <canvas className="pvh-canvas" aria-hidden="true" />
        <div className="pvh-scrim" aria-hidden="true" />

        {/* Reise-Roboter — begleitet die Kamerafahrt */}
        <div className="pvh-bot" aria-hidden="true">
          <div className="pvh-bot-flip">
            <canvas className="pvh-bot-canvas" />
          </div>
        </div>

        <div className="pvh-copy">
          <span className="pvh-tag">WhatsApp-Assistent für Gastro &amp; Clubs</span>
          <h2 className="pvh-title">Komm rein.</h2>
        </div>

        {FLY.map((f, i) => (
          <div className="pvh-fly" key={i}>
            {f.text}
          </div>
        ))}

        <div className="pvh-hint" aria-hidden="true">
          <span>Scrollen</span>
          <span className="pvh-hint-line" />
        </div>
      </div>
    </section>
  );
}
