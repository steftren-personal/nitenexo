"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/components/motion/gsap";

/**
 * RobotGuide — the realistic transparent robot as a single, scroll-bound guide.
 *
 * NOT a looping video: the clip is pre-split into transparent frames drawn to a
 * <canvas>, so the robot only "moves" when you scroll (forward = gesture
 * forward, back = reverse, idle = frozen). Its position glides continuously
 * between per-section waypoints, eased so jerky wheel/trackpad input stays
 * fluid.
 *
 * It must NEVER cover text or components — so every frame it measures its own
 * visible silhouette and fades fully out the instant that box would touch any
 * content (headings, copy, cards, buttons, images, the footer …), fading back
 * in only in genuinely empty space between blocks.
 *
 * Desktop + motion only (CSS gates `.robot-guide`); phones / reduced-motion keep
 * the inline hero robot instead.
 */
const FRAME_COUNT = 60;
const framePath = (i: number) => `/assets/robot-frames/f${String(i + 1).padStart(3, "0")}.webp`;
// Elements the robot must not overlap (text + interactive + cards + media).
const AVOID_SEL =
  "h1,h2,h3,h4,h5,h6,p,li,button,a[href],img,svg,table,input,textarea,label,.bw-testi-card,.bw-bento-tile";

type WP = { x: number; y: number; scale: number; rot: number; flip: number };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

export function RobotGuide() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (prefersReducedMotion() || window.innerWidth < 1024) return;

      const travel = el.querySelector<HTMLElement>(".rg-travel");
      const flipEl = el.querySelector<HTMLElement>(".rg-flip");
      const canvas = el.querySelector<HTMLCanvasElement>(".rg-canvas");
      const ctx = canvas?.getContext("2d");
      if (!travel || !flipEl || !canvas || !ctx) return;

      // ── Frame sequence + the robot's actual silhouette within each frame ──
      const frames: HTMLImageElement[] = [];
      // Fraction of the frame the robot art actually fills (transparent padding
      // is excluded so overlap tests use the real silhouette, not the box).
      let artFrac = { x0: 0.16, y0: 0.04, x1: 0.84, y1: 0.98 };
      const ab = { minX: Infinity, minY: Infinity, maxX: 0, maxY: 0 };
      const scanInto = (img: HTMLImageElement) => {
        try {
          const w = img.naturalWidth;
          const h = img.naturalHeight;
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h;
          const cc = c.getContext("2d");
          if (!cc) return;
          cc.drawImage(img, 0, 0);
          const d = cc.getImageData(0, 0, w, h).data;
          for (let y = 0; y < h; y += 2)
            for (let x = 0; x < w; x += 2)
              if (d[(y * w + x) * 4 + 3] > 30) {
                if (x < ab.minX) ab.minX = x;
                if (x > ab.maxX) ab.maxX = x;
                if (y < ab.minY) ab.minY = y;
                if (y > ab.maxY) ab.maxY = y;
              }
          if (ab.maxX > ab.minX) artFrac = { x0: ab.minX / w, y0: ab.minY / h, x1: ab.maxX / w, y1: ab.maxY / h };
        } catch {
          /* tainted canvas etc. — keep the fallback fractions */
        }
      };
      const drawFrame = (idx: number) => {
        const img = frames[idx];
        if (!img || !img.complete || !img.naturalWidth) return;
        if (canvas.width !== img.naturalWidth) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.onload = () => {
          if (i === 0) drawFrame(0);
          if (i % 12 === 0) scanInto(img); // union silhouette over a few poses
        };
        img.src = framePath(i);
        frames[i] = img;
      }

      // ── Waypoints (which side the robot drifts along per section) ───────
      // Smaller box so the travelling robot fits the side gutters beside the
      // content (→ visible more often) while still never covering it.
      const boxW = () => Math.min(Math.max(window.innerWidth * 0.2, 190), 290);
      const waypoint = (side: string, vy: number, scale: number): WP => {
        const w = boxW();
        const m = window.innerWidth * 0.02;
        const right = window.innerWidth - w - m;
        if (side === "left") return { x: m, y: vy, scale, rot: 4, flip: 1 };
        if (side === "hide") return { x: right, y: vy, scale: scale * 0.85, rot: 0, flip: -1 };
        return { x: right, y: vy, scale, rot: -4, flip: -1 }; // right (default)
      };

      type Stop = { pos: number; wp: WP };
      let stops: Stop[] = [];
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-guide]"));
      const computeStops = () => {
        const vh = window.innerHeight;
        const arr: Stop[] = [{ pos: 0, wp: waypoint("right", vh * 0.18, 1.2) }]; // hero
        sections.forEach((sec, i) => {
          const side = sec.dataset.guide || (i % 2 === 0 ? "right" : "left");
          const vy = (i % 2 === 0 ? 0.2 : 0.42) * vh;
          const top = sec.getBoundingClientRect().top + window.scrollY;
          arr.push({ pos: Math.max(0, top - vh * 0.5), wp: waypoint(side, vy, 0.58) });
        });
        arr.sort((a, b) => a.pos - b.pos);
        stops = arr;
      };

      // Content boxes to dodge (recomputed on layout changes).
      let avoiders: Element[] = [];
      const collectAvoiders = () => {
        // Measure with getBoundingClientRect (works for SVG too — SVG elements
        // have no offsetWidth, so the mascot/stickers were slipping through).
        avoiders = Array.from(document.querySelectorAll(AVOID_SEL)).filter((e) => {
          if (e.closest(".robot-guide")) return false;
          const r = e.getBoundingClientRect();
          return r.width > 36 && r.height > 12;
        });
      };
      computeStops();
      collectAvoiders();

      // Would the robot's silhouette (at this transform) touch any content?
      // Generous padding so it starts dodging slightly *before* it would touch.
      const PAD = 26;
      const blocked = (x: number, y: number, sc: number) => {
        const W = travel.offsetWidth;
        const H = travel.offsetHeight;
        if (!W || !H) return false;
        const sw = sc * W;
        const sh = sc * H;
        const left = x + W / 2 - sw / 2; // scale is about the element centre
        const top = y + H / 2 - sh / 2;
        const aL = left + artFrac.x0 * sw;
        const aR = left + artFrac.x1 * sw;
        const aT = top + artFrac.y0 * sh;
        const aB = top + artFrac.y1 * sh;
        const vh = window.innerHeight;
        for (const e of avoiders) {
          const r = e.getBoundingClientRect();
          if (r.width === 0 || r.bottom < 0 || r.top > vh) continue;
          if (aR > r.left - PAD && aL < r.right + PAD && aB > r.top - PAD && aT < r.bottom + PAD) return true;
        }
        return false;
      };

      // Flip (mirror) snaps with a quick tween so it never squashes through 0.
      let curFlip = -1;
      gsap.set(flipEl, { scaleX: curFlip });
      const setFlip = (f: number) => {
        if (f === curFlip) return;
        curFlip = f;
        gsap.to(flipEl, { scaleX: f, duration: 0.4, ease: "power2.out", overwrite: true });
      };

      // Gesture frame from scroll distance — ping-pong so it's seamless and
      // never "restarts" like a loop. Idle scroll = frozen frame.
      const ppf = () => Math.max(14, (window.innerHeight * 1.25) / FRAME_COUNT);
      const frameFor = (scrollY: number) => {
        const N = FRAME_COUNT;
        const period = 2 * N - 2;
        let ph = (scrollY / ppf()) % period;
        if (ph < 0) ph += period;
        return ph < N ? Math.floor(ph) : Math.floor(period - ph);
      };

      let introDone = false;
      let curAlpha = 1; // eased visibility
      let targetA = 1;
      let lastY = Number.NaN;
      const render = (scrollY: number, dt = 16) => {
        const moved = scrollY !== lastY;
        if (!moved && Math.abs(curAlpha - targetA) < 0.004) return; // fully idle → skip
        lastY = scrollY;

        let i = 0;
        while (i < stops.length - 1 && scrollY >= stops[i + 1].pos) i++;
        const a = stops[i];
        const b = stops[Math.min(i + 1, stops.length - 1)];
        const seg = b.pos - a.pos;
        const t = seg > 0 ? smooth(gsap.utils.clamp(0, 1, (scrollY - a.pos) / seg)) : 0;
        const x = lerp(a.wp.x, b.wp.x, t);
        const y = lerp(a.wp.y, b.wp.y, t);
        const scl = lerp(a.wp.scale, b.wp.scale, t);
        const rot = lerp(a.wp.rot, b.wp.rot, t);

        if (moved) targetA = blocked(x, y, scl) ? 0 : 1;
        // Vanish fast when approaching content, return gently in clear space.
        const tau = targetA < curAlpha ? 70 : 170;
        curAlpha += (targetA - curAlpha) * (1 - Math.exp(-dt / tau));
        if (Math.abs(targetA - curAlpha) < 0.004) curAlpha = targetA;

        if (introDone) gsap.set(travel, { x, y, scale: scl, rotation: rot, autoAlpha: curAlpha });
        setFlip(t < 0.5 ? a.wp.flip : b.wp.flip);
        drawFrame(frameFor(scrollY));
      };

      // ── Intro fly-in, then scroll takes over ────────────────────────────
      const heroWP = stops[0].wp;
      gsap.set(travel, { x: heroWP.x + 340, y: heroWP.y, scale: 0.78, rotation: heroWP.rot, autoAlpha: 0, transformOrigin: "50% 50%" });
      const intro = gsap.to(travel, {
        x: heroWP.x,
        scale: heroWP.scale,
        autoAlpha: 1,
        duration: 1.15,
        ease: "power3.out",
        delay: 0.25,
        onComplete: () => {
          introDone = true;
        },
      });

      // Ease a "display" scroll value toward the real one every frame (frame-rate
      // independent) so stepped scrolling still glides; TAU ≈ how floaty.
      const TAU = 150;
      let smoothY = window.scrollY;
      const tick = (_t: number, dt: number) => {
        const sc = window.scrollY;
        if (!introDone && sc > 4) {
          intro.progress(1); // skip the intro if they scroll right away
          introDone = true;
        }
        smoothY += (sc - smoothY) * (1 - Math.exp(-dt / TAU));
        if (Math.abs(sc - smoothY) < 0.4) smoothY = sc;
        render(smoothY, dt);
      };
      gsap.ticker.add(tick);

      const master = ScrollTrigger.create({
        start: 0,
        end: "max",
        onRefresh: () => {
          computeStops();
          collectAvoiders();
          lastY = Number.NaN; // force a recompute at the new layout
        },
      });

      return () => {
        gsap.ticker.remove(tick);
        master.kill();
        intro.kill();
      };
    },
    { scope: root }
  );

  return (
    <div ref={root} className="robot-guide" aria-hidden="true">
      <div className="rg-travel">
        <div className="rg-flip">
          <div className="rg-bob bw-float">
            <div className="rg-pop">
              <span className="rg-glow" aria-hidden="true" />
              <canvas className="rg-canvas" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
