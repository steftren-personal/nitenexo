"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/components/motion/gsap";

/**
 * NightFilm — „EINE NACHT": the intro is one night at the corner of a bar,
 * told as a chaptered timelapse (Seedance 2.0 footage, 5 chained clips,
 * AI-upscaled to 1080p). The camera barely moves; TIME moves.
 *
 * One scroll gesture advances one chapter (21:00 → 23:00 → 01:00 → 03:00 →
 * 05:00 → 09:00). The footage is NOT frame-scrubbed: each gesture PLAYS the
 * video's chapter segment natively (hardware-decoded, every source frame, so
 * dancers and light move fluidly) at a playback rate that fits the travel
 * duration, then pauses exactly on the station frame. A big clock rolls and
 * a counter of answered messages ticks up in sync. Chapter cuts sit exactly
 * on clip boundaries and are marked by a deliberate exposure-step flash — a
 * time jump, not a hidden seam. Stepping back is a hard time-rewind cut
 * (video can't play backwards), masked by the same flash. After the last
 * chapter the morning scene dissolves onto the page hero beneath the overlay.
 *
 * Reduced-motion visitors get the plain in-flow section playing the film —
 * no overlay, no scroll lock.
 */
const VIDEO_LG = "/assets/night-hero.mp4";
const VIDEO_SM = "/assets/night-hero-sm.mp4"; // phones: 768px encode (~1.4MB)
const POSTER = "/assets/night-poster.jpg";

// Station timestamps in the concatenated film (measured clip boundaries;
// the last one sits just before the end so the pause lands on a real frame).
const STATION_T = [0, 5.04, 10.08, 15.12, 20.16, 25.16];
const LAST = STATION_T.length - 1;
// Clock value at each station, in minutes since midnight (monotonic → mod 24h).
const STATION_MIN = [1260, 1380, 1500, 1620, 1740, 1980]; // 21:00 23:00 01:00 03:00 05:00 09:00
// Answered-messages counter at each station.
const STATION_MSG = [0, 14, 61, 89, 102, 117];
// Chapter label per SEGMENT (shown under the clock, switches at each cut).
const SEG_LABEL = ["Der Abend beginnt", "Es füllt sich", "Hochbetrieb", "Späte Stunde", "Der Morgen"];
// Caption shown while resting at stations 1–4 (0 has the opener, 5 releases).
const CAPTIONS = [
  "Die ersten Anfragen — beantwortet, bevor du hinschaust.",
  "Volles Haus. Kein Handy in der Hand.",
  "Letzte Runde. Er antwortet weiter.",
  "Alle sind weg. Er nicht.",
];

const TRAVEL_S = 2.4; // seconds per chapter — the segment plays at ~2.1× speed
const BACK_S = 0.6; // chrome rewind duration for a backward time-jump
const SWIPE_MIN = 24; // px of touch travel that counts as one gesture

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Dev-only hook so automated tests can assert station arrivals.
type NfWindow = Window & { __nfStation?: number };

export function NightFilm() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const stage = el.querySelector<HTMLElement>(".nf-stage");
      const video = el.querySelector<HTMLVideoElement>(".nf-video");
      const opener = el.querySelector<HTMLElement>(".nf-copy");
      const scrim = el.querySelector<HTMLElement>(".nf-scrim");
      const hint = el.querySelector<HTMLElement>(".nf-hint");
      const flash = el.querySelector<HTMLElement>(".nf-flash");
      const clockEl = el.querySelector<HTMLElement>(".nf-clock-time");
      const clockCap = el.querySelector<HTMLElement>(".nf-clock-cap");
      const clockWrap = el.querySelector<HTMLElement>(".nf-clock");
      const countWrap = el.querySelector<HTMLElement>(".nf-count");
      const countEl = el.querySelector<HTMLElement>(".nf-count-num");
      const captionEls = gsap.utils.toArray<HTMLElement>(".nf-caption", el);
      if (!stage || !video || !opener) return;

      // Phones get the small encode; either way we want it buffered early so
      // the first gesture plays instantly.
      if (window.innerWidth < 768) video.src = VIDEO_SM;
      video.preload = "auto";
      video.load();

      if (prefersReducedMotion()) {
        video.play?.().catch(() => {});
        return;
      }
      video.pause();

      // Presentation mode: the section collapses (height 0) and the stage
      // becomes a fixed full-viewport overlay — the page hero sits at the top
      // of the document beneath it, ready for the end crossfade. Collapsing
      // moves EVERY section up by ~100vh, so any scroll-triggered animation
      // computed against the old layout must be re-measured right away.
      el.classList.add("nf--overlay");
      ScrollTrigger.refresh();

      // Continuous station position (0..5) — the single source of truth for
      // the chrome (clock, counter, opener, end dissolve). The video itself
      // plays natively alongside and is snapped at every arrival.
      const state = { pos: 0 };

      const clamp01 = (v: number) => gsap.utils.clamp(0, 1, v);
      const fmtClock = (min: number) => {
        const m = ((Math.round(min) % 1440) + 1440) % 1440;
        return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
      };
      const atStations = (pos: number, values: number[]) => {
        const s = Math.min(LAST - 1, Math.max(0, Math.floor(pos)));
        return lerp(values[s], values[s + 1], clamp01(pos - s));
      };

      const renderChrome = (pos: number) => {
        if (clockEl) clockEl.textContent = fmtClock(atStations(pos, STATION_MIN));
        if (countEl) countEl.textContent = String(Math.round(atStations(pos, STATION_MSG)));

        const oOp = clamp01(1 - pos / 0.55);
        opener.style.opacity = oOp.toFixed(3);
        opener.style.transform = `translateY(${(-pos * 60).toFixed(1)}px)`;
        if (hint) hint.style.opacity = pos < 0.2 ? "1" : "0";

        // End: the morning scene rushes gently forward and dissolves (video +
        // scrim fade) → the page gradient + hero behind show through. The
        // clock + counter leave FIRST, early in the final travel, so the
        // handoff frame is clean.
        const chrome = 1 - clamp01((pos - 4.15) / 0.5);
        if (clockWrap) {
          clockWrap.style.opacity = chrome.toFixed(3);
          clockWrap.style.transform = `translateY(${((1 - chrome) * 18).toFixed(1)}px)`;
        }
        if (countWrap) {
          countWrap.style.opacity = chrome.toFixed(3);
          countWrap.style.transform = `translateY(${((1 - chrome) * 18).toFixed(1)}px)`;
        }
        const endT = clamp01((pos - 4.3) / 0.7);
        const fade = clamp01((pos - 4.5) / 0.5);
        video.style.transform = `scale(${(1 + endT * 0.45).toFixed(4)})`;
        video.style.opacity = (1 - fade).toFixed(3);
        if (scrim) scrim.style.opacity = (1 - fade).toFixed(3);
      };

      const fireFlash = (segLabel: string) => {
        if (flash) gsap.fromTo(flash, { opacity: 0.38 }, { opacity: 0, duration: 0.45, ease: "power2.out", overwrite: true });
        if (clockCap) clockCap.textContent = segLabel;
      };

      // ── Stepped driver: one gesture = one chapter ────────────────────────
      let station = 0;
      let travel: gsap.core.Tween | null = null;
      let active = false;

      const flagStation = () => {
        if (process.env.NODE_ENV !== "production") (window as NfWindow).__nfStation = station;
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

      const engage = () => {
        active = true;
        lock();
        stage.style.visibility = "visible";
        stage.style.pointerEvents = "auto";
      };
      const release = () => {
        active = false;
        unlock();
        video.pause();
        stage.style.visibility = "hidden";
        stage.style.pointerEvents = "";
      };

      const hideCaptions = () => {
        captionEls.forEach((c) => gsap.to(c, { autoAlpha: 0, y: -14, duration: 0.25, ease: "power2.in", overwrite: true }));
      };
      const showCaption = (st: number) => {
        const c = captionEls[st - 1];
        if (!c) return;
        gsap.fromTo(c, { autoAlpha: 0, y: 26, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out", overwrite: true });
      };

      // A gesture landing in the LATER part of a travel is remembered and runs
      // right after arrival; events in the early part are the same physical
      // flick's inertia and are dropped so one swipe never jumps two chapters.
      let queued: 1 | -1 | null = null;
      let watchRaf = 0;

      // The VIDEO is the master clock: it simply plays until the chapter
      // boundary and pauses on whatever frame it is showing — never snapped,
      // so there is no visible jump at arrival. The chrome tween runs
      // alongside and merely settles first.
      const arrive = () => {
        cancelAnimationFrame(watchRaf);
        travel?.kill();
        travel = null;
        video.pause();
        state.pos = station;
        renderChrome(station);
        flagStation();
        if (station === LAST) {
          queued = null;
          release(); // the night is over → page scrolls on
          return;
        }
        if (queued !== null) {
          const dir = queued;
          queued = null;
          step(dir);
          return;
        }
        if (station >= 1 && station <= CAPTIONS.length) showCaption(station);
      };

      const watchBoundary = (target: number) => {
        const tick = () => {
          // Within ~one source frame of the boundary → rest right here.
          if (video.currentTime >= target - 0.05 || video.ended) arrive();
          else watchRaf = requestAnimationFrame(tick);
        };
        watchRaf = requestAnimationFrame(tick);
      };

      const goTo = (idx: number) => {
        const from = station;
        station = idx;
        hideCaptions();
        if (idx > from) {
          // Forward: play the chapter segment natively, rate-fitted to the
          // travel — every source frame shows, so motion stays fluid.
          fireFlash(SEG_LABEL[from]);
          video.playbackRate = (STATION_T[idx] - STATION_T[from]) / TRAVEL_S;
          video.play().catch(() => {});
          travel = gsap.to(state, {
            pos: idx,
            duration: TRAVEL_S,
            ease: "none", // linear — locked to the constant playback rate
            onUpdate: () => renderChrome(state.pos),
            // no onComplete: the video's own arrival (watcher) ends the travel
          });
          watchBoundary(STATION_T[idx]);
        } else {
          // Backward: video can't play in reverse — a hard time-rewind cut
          // under the flash (the same time-jump grammar), clock rolls back.
          fireFlash(SEG_LABEL[Math.max(0, idx === 0 ? 0 : idx - 1)]);
          video.pause();
          video.currentTime = STATION_T[idx];
          travel = gsap.to(state, {
            pos: idx,
            duration: BACK_S,
            ease: "power2.out",
            onUpdate: () => renderChrome(state.pos),
            onComplete: arrive,
          });
        }
      };

      const step = (dir: 1 | -1) => {
        if (travel) {
          if (travel.progress() > 0.45) queued = dir; // deliberate follow-up → chain it
          return;
        }
        const next = station + dir;
        if (next < 0 || next > LAST) return;
        goTo(next);
      };

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
          e.preventDefault();
          if (Math.abs(dy) < SWIPE_MIN) return;
          touchY = e.touches[0].clientY;
          step(dy > 0 ? 1 : -1);
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

      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: false });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd);
      window.addEventListener("keydown", onKey);

      // ── Kick-off ──────────────────────────────────────────────────────────
      if (window.scrollY > 1) {
        // Page restored mid-scroll (reload) → don't trap the visitor.
        state.pos = LAST;
        station = LAST;
        renderChrome(LAST);
        stage.style.visibility = "hidden";
      } else {
        engage();
        renderChrome(0);
      }
      flagStation();

      return () => {
        cancelAnimationFrame(watchRaf);
        travel?.kill();
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("keydown", onKey);
        unlock();
        video.pause();
        stage.style.visibility = "";
        stage.style.pointerEvents = "";
        el.classList.remove("nf--overlay");
        ScrollTrigger.refresh();
        if (process.env.NODE_ENV !== "production") delete (window as NfWindow).__nfStation;
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} className="nf" aria-label="NiteNexo — Eine Nacht mit deinem Assistenten">
      <div className="nf-stage">
        <video className="nf-video" muted playsInline preload="none" poster={POSTER}>
          <source src={VIDEO_LG} type="video/mp4" />
        </video>
        <div className="nf-scrim" aria-hidden="true" />
        <div className="nf-flash" aria-hidden="true" />

        <div className="nf-copy">
          <span className="nf-tag">WhatsApp-Assistent für Gastro &amp; Clubs</span>
          <h2 className="nf-title">
            Eine Nacht.
            <br />
            <span className="nf-kw">Null verpasste Anfragen.</span>
          </h2>
        </div>

        {CAPTIONS.map((c, i) => (
          <div className="nf-caption" key={i}>
            {c}
          </div>
        ))}

        <div className="nf-clock" aria-hidden="true">
          <span className="nf-clock-time">21:00</span>
          <span className="nf-clock-cap">Der Abend beginnt</span>
        </div>

        <div className="nf-count" aria-hidden="true">
          <span className="nf-count-num">0</span>
          <span className="nf-count-cap">Nachrichten beantwortet</span>
        </div>

        <div className="nf-hint" aria-hidden="true">
          <span>Scrollen</span>
          <span className="nf-hint-line" />
        </div>
      </div>
    </section>
  );
}
