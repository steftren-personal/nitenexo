"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/components/motion/gsap";

/**
 * PinnedVideoHero — a stepped, presentation-style camera journey through an
 * upscale cocktail bar. With motion allowed the stage becomes a fixed
 * full-viewport overlay (the `.pvh` section collapses out of the flow) and
 * page scrolling locks: ONE gesture (wheel / swipe / key) advances ONE
 * station and the camera travels there on its own (clip pre-split into
 * frames drawn to a <canvas>, ~1.4s eased tween per hop). Benefit statements
 * fly toward you out of the depth; after the last station the scene zooms +
 * dissolves onto the page hero — which sits at the very top of the document
 * beneath the overlay — and scrolling unlocks with zero dead space. Wheeling
 * up at the very top steps back into the journey.
 *
 * Reduced-motion visitors get the plain in-flow 100vh section playing the
 * clip natively — no overlay, no scroll lock.
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

// Camera stations, one gesture apart: opener, the three benefit texts at
// full readability, and the end zoom-through onto the hero.
const STATIONS = [0, 0.26, 0.52, 0.76, 1];
const TRAVEL_S = 0.9; // seconds the camera takes to reach the next station
const SWIPE_MIN = 24; // px of touch travel that counts as one gesture

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

// Dev-only hook so automated tests can assert station arrivals.
type PvhWindow = Window & { __pvhStation?: number };

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

      // Stepped journey on ALL sizes (phones included); only reduced-motion
      // visitors get the plain playing video instead.
      if (!stage || !canvas || !ctx || !opener || prefersReducedMotion()) {
        video?.play?.().catch(() => {});
        return;
      }
      video?.pause?.();

      // Presentation mode: the section collapses (height 0) and the stage
      // becomes a fixed full-viewport overlay — the page hero sits at the top
      // of the document beneath it, ready for the end crossfade.
      el.classList.add("pvh--overlay");

      // Camera position along the journey. A gesture tweens it to the next
      // station, so `state.p` is the single source of truth for render().
      const state = { p: 0 };

      // ── Frame preload + cover-fit draw (sized to the overlay stage) ──────
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
          if (i === Math.round(gsap.utils.clamp(0, 1, state.p) * (FRAME_COUNT - 1))) drawFrame(i);
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

      // ── Camera position → frames + flying text + end zoom-through ────────
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

        // Journey robot: glide along his waypoints, gesture with the travel,
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

      // ── Stepped driver: one gesture = one station, travelled on its own ──
      let station = 0;
      let travel: gsap.core.Tween | null = null;
      let active = false;

      const flagStation = () => {
        if (process.env.NODE_ENV !== "production") (window as PvhWindow).__pvhStation = station;
      };

      const lock = () => {
        document.documentElement.style.overflow = "hidden";
        document.documentElement.style.overscrollBehavior = "none";
        document.body.style.overscrollBehavior = "none";
      };
      const unlock = () => {
        document.documentElement.style.overflow = "";
        document.documentElement.style.overscrollBehavior = "";
        document.body.style.overscrollBehavior = "";
      };

      // While presenting, the stage swallows clicks so the hidden hero behind
      // can't be hit by accident; released again the moment the intro ends.
      const engage = () => {
        active = true;
        lock();
        stage.style.visibility = "visible";
        stage.style.pointerEvents = "auto";
      };
      const release = () => {
        active = false;
        unlock();
        stage.style.visibility = "hidden"; // already alpha-0 — free the viewport
        stage.style.pointerEvents = "";
      };

      // A gesture landing in the LATER part of a travel is remembered and runs
      // right after arrival (feels responsive, chains stations fluidly); events
      // in the early part are the same physical flick's inertia and are dropped
      // so one swipe never jumps two stations.
      let queued: 1 | -1 | null = null;

      const goTo = (idx: number) => {
        station = idx;
        travel = gsap.to(state, {
          p: STATIONS[idx],
          duration: TRAVEL_S,
          ease: "power2.inOut",
          onUpdate: () => render(state.p),
          onComplete: () => {
            travel = null;
            flagStation();
            if (station === STATIONS.length - 1) {
              queued = null;
              release(); // journey done → page scrolls on
              return;
            }
            if (queued !== null) {
              const dir = queued;
              queued = null;
              step(dir);
            }
          },
        });
      };

      const step = (dir: 1 | -1) => {
        if (travel) {
          if (travel.progress() > 0.45) queued = dir; // deliberate follow-up → chain it
          return;
        }
        const next = station + dir;
        if (next < 0 || next > STATIONS.length - 1) return;
        goTo(next);
      };

      // Back at the very top and scrolling up → re-enter the journey at the
      // last station and step backwards from there.
      const reenter = () => {
        engage();
        step(-1);
      };

      // ── Input while locked: wheel / swipe / keys, page scroll suppressed ──
      const onWheel = (e: WheelEvent) => {
        if (active) {
          e.preventDefault();
          step(e.deltaY > 0 ? 1 : -1);
        } else if (e.deltaY < 0 && window.scrollY <= 1 && !travel) {
          e.preventDefault();
          reenter();
        }
      };

      let touchY: number | null = null;
      const onTouchStart = (e: TouchEvent) => {
        touchY = e.touches[0].clientY;
      };
      const onTouchMove = (e: TouchEvent) => {
        if (touchY === null) return;
        const dy = touchY - e.touches[0].clientY; // >0 = finger up = advance
        if (active) {
          e.preventDefault(); // the page must not scroll while presenting
          if (Math.abs(dy) < SWIPE_MIN) return;
          touchY = e.touches[0].clientY; // one long swipe still means one step
          step(dy > 0 ? 1 : -1); // step() itself queues follow-ups mid-travel
        } else if (dy < -SWIPE_MIN && window.scrollY <= 1 && !travel) {
          e.preventDefault();
          touchY = e.touches[0].clientY;
          reenter();
        }
      };
      const onTouchEnd = () => {
        touchY = null;
      };

      const onKey = (e: KeyboardEvent) => {
        if (!active || e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
          e.preventDefault();
          step(1);
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          step(-1);
        }
      };

      const onResize = () => {
        sizeCanvas();
        render(state.p);
      };

      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: false });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd);
      window.addEventListener("keydown", onKey);
      window.addEventListener("resize", onResize);

      // ── Kick-off ──────────────────────────────────────────────────────────
      if (window.scrollY > 1) {
        // Page restored mid-scroll (reload) → don't trap the visitor; the
        // intro counts as seen and re-entry from the top still works.
        state.p = 1;
        station = STATIONS.length - 1;
        render(1);
        stage.style.visibility = "hidden";
      } else {
        engage();
        render(0);
      }
      flagStation();

      return () => {
        travel?.kill();
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", onResize);
        unlock();
        stage.style.visibility = "";
        stage.style.pointerEvents = "";
        el.classList.remove("pvh--overlay");
        if (process.env.NODE_ENV !== "production") delete (window as PvhWindow).__pvhStation;
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
