"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { splitChars } from "@/components/motion/splitChars";
import { ScrollTrigger } from "@/components/motion/gsap";
import { buildKeyframes, timeAt, type BeatRange, type Keyframe, type SceneMap } from "@/lib/film-timeline";
import sceneMapJson from "@/public/assets/film/scene-map.json";

/**
 * ThreadFilm — »Eine Nacht, ein Take«: ONE continuous 27-second take carries
 * the whole page. The video sits FIXED behind everything; the first 800vh (the
 * hero region) scrub scene 1 (the bar from outside, door open) with free
 * scrolling, caption bands and the settle hero. Below that every chapter is
 * bound to its own scene: while a StoryBeat scrolls in, the film scrubs the
 * 0.6 s crossfade, then the scene's stable frames are spread across the
 * chapter (lib/film-timeline.ts, fed by scene-map.json). The last scene (the
 * counter at 23:40, the phone lighting up) stands almost still to the CTA.
 * Copy, band map and pacing come from .story-work/DESIGN-PACKAGE.md.
 *
 * Phones, portrait tablets, coarse-pointer portrait and short landscape
 * phones scrub the portrait cut (film-mobile.mp4, same timeline). The static
 * hero (same copy) remains for reduced motion, Save-Data and no-JS; a video
 * that fails to load keeps the poster behind the scrub (tf--video-failed).
 */

type Variant = "desktop" | "mobile";
const SOURCES: Record<Variant, { video: string; poster: string; bytes: number }> = {
  // byte sizes are the real encoded sizes (stat) — fallback when
  // Content-Length is missing, so the loading ring stays honest
  desktop: { video: "/assets/film/film-desktop.mp4", poster: "/assets/film/film-poster.webp", bytes: 7603370 },
  mobile: { video: "/assets/film/film-mobile.mp4", poster: "/assets/film/film-poster-mobile.webp", bytes: 2343855 },
};
const SCENE_MAP = sceneMapJson as SceneMap;

// Below-page dim over the film so chapter content reads (delta-gated write).
const DIM_MAX = 0.58;

// Band map (hero-scroll-progress ranges; starting points, validated by the
// flick test). Five beats: the hook, then one band per Gewerk — Chatbot,
// Website, KI-Integration — equally weighted, then the settle hero.
type BandDef = { a: number; b: number; entrance: "scatter" | "grid" | "weave" | "rise" };
const BANDS: BandDef[] = [
  { a: 0.0, b: 0.14, entrance: "scatter" },
  { a: 0.18, b: 0.32, entrance: "grid" },
  { a: 0.36, b: 0.5, entrance: "rise" },
  { a: 0.54, b: 0.68, entrance: "weave" },
  { a: 0.74, b: 1.0, entrance: "rise" },
];

// The four layout gates pick the portrait cut (they used to force the static
// hero). Keep them character-identical to the poster media query in
// globals.css (.tf gate block).
const MOBILE_GATES = [
  "(max-width: 720px)",
  "(orientation: portrait) and (max-width: 1024px)",
  "(orientation: portrait) and (pointer: coarse)",
  "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
];
// Static hero, no film at all — CSS mirrors this one (.tf gate block).
const STATIC_GATES = ["(prefers-reduced-motion: reduce)"];
const GATES = [...MOBILE_GATES, ...STATIC_GATES];

const saveData = () =>
  Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (p: number, e0: number, e1: number) => {
  const t = clamp01((p - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

export function ThreadFilm() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const film = el.querySelector<HTMLElement>(".tf-film");
    const stage = el.querySelector<HTMLElement>(".tf-stage");
    const video = el.querySelector<HTMLVideoElement>(".tf-video");
    const posterLayer = el.querySelector<HTMLElement>(".tf-poster");
    const dim = el.querySelector<HTMLElement>(".tf-dim");
    const ring = el.querySelector<SVGCircleElement>(".tf-ring circle");
    const ringWrap = el.querySelector<HTMLElement>(".tf-ringwrap");
    const hint = el.querySelector<HTMLElement>(".tf-hint");
    const scrim = el.querySelector<HTMLElement>(".tf-scrim");
    const bandEls = Array.from(el.querySelectorAll<HTMLElement>(".tf-band"));
    if (!film || !stage || !video || !posterLayer || bandEls.length !== BANDS.length) return;
    const vid = video;
    const stg = stage;
    const flm = film;

    // ── one-time character split per band headline ────────────────────────
    bandEls.forEach((b, i) => {
      const h = b.querySelector<HTMLElement>(".tf-h");
      if (h && !h.querySelector(".tf-vis")) splitChars(h, 7 + i * 131, BANDS[i].entrance);
    });

    // ── render state (all writes delta-gated) ─────────────────────────────
    const bandState = BANDS.map(() => ({ op: -1, k: -1 }));
    let loadK = 0; // band 1's one-time load ramp
    let loadRampStart = 0;
    let lastDim = -1;
    let lastScrim = -1;
    let hintOn = true;

    const heroRange = () => Math.max(1, el.offsetHeight - window.innerHeight);
    const pageMax = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    // ── scrollY → film time: the scene map spread over the whole page ─────
    // One ScrollTrigger per StoryBeat measures where the beat starts entering
    // (start) and where it is settled (end); the keyframes are rebuilt after
    // every ScrollTrigger refresh, so layout changes never desync the film.
    const beatEls = Array.from(document.querySelectorAll<HTMLElement>(".sb"));
    let beatTriggers: ScrollTrigger[] = [];
    let beatsArmed = false;
    let frames: Keyframe[] = buildKeyframes(SCENE_MAP, { heroRange: heroRange(), pageMax: pageMax(), beats: [] });
    const rebuildFrames = () => {
      const beats: BeatRange[] = beatTriggers.map((st) => ({ start: st.start, end: st.end }));
      frames = buildKeyframes(SCENE_MAP, { heroRange: heroRange(), pageMax: pageMax(), beats });
    };
    const armBeats = () => {
      if (beatsArmed) return;
      beatsArmed = true;
      beatTriggers = beatEls.map((sb) => ScrollTrigger.create({ trigger: sb, start: "top bottom", end: "top 20%" }));
      ScrollTrigger.addEventListener("refresh", rebuildFrames);
      rebuildFrames();
    };
    const disarmBeats = () => {
      if (!beatsArmed) return;
      beatsArmed = false;
      ScrollTrigger.removeEventListener("refresh", rebuildFrames);
      beatTriggers.forEach((st) => st.kill());
      beatTriggers = [];
    };
    const timeFor = (y: number, dur: number) => Math.min(dur, timeAt(frames, y));

    // ── seek gating (deadlock-safe) ───────────────────────────────────────
    let seekBusy = false;
    let pendingTime: number | null = null;
    const requestSeek = (t: number) => {
      if (!vid.duration || !isFinite(vid.duration)) return;
      if (seekBusy) {
        pendingTime = t;
        return;
      }
      seekBusy = true;
      vid.currentTime = t;
    };
    const onSeeked = () => {
      seekBusy = false;
      if (pendingTime !== null) {
        const t = pendingTime;
        pendingTime = null;
        requestSeek(t);
      }
    };
    const onVideoError = () => {
      seekBusy = false;
      pendingTime = null;
      stg.classList.add("tf--video-failed");
      film.classList.add("tf--video-failed");
    };
    vid.addEventListener("seeked", onSeeked);
    vid.addEventListener("error", onVideoError);

    // ── captions + chrome, written only on change ─────────────────────────
    const updateCaptions = (y: number, now: number) => {
      const p = clamp01(y / heroRange());
      BANDS.forEach((band, i) => {
        const bEl = bandEls[i];
        const st = bandState[i];
        const f = Math.min(0.02, (band.b - band.a) / 3);
        let op =
          smoothstep(p, band.a, band.a + f) * (1 - smoothstep(p, band.b - f, band.b));
        if (i === 0) op = 1 - smoothstep(p, band.b - f, band.b); // no ease-in on band 1
        if (i === BANDS.length - 1) op = smoothstep(p, band.a, band.a + f); // no ease-out on settle

        if (op < 0.004) op = 0; // snap the tail so no band idles at 0.002
        // deliberately slow assembly (~25vh of scroll) so the choreography reads
        const ramp = Math.min(0.05, (band.b - band.a) * 0.5);
        let k = clamp01((p - band.a) / ramp);
        if (i === 0) k = Math.max(k, loadK);

        if (Math.abs(op - st.op) > 0.004) {
          st.op = op;
          bEl.style.opacity = op.toFixed(3);
          bEl.style.visibility = op <= 0.001 ? "hidden" : "visible";
        }
        if (Math.abs(k - st.k) > 0.008) {
          st.k = k;
          bEl.style.setProperty("--k", k.toFixed(3));
        }
      });

      // hint: band 1 only
      const wantHint = p < 0.18;
      if (wantHint !== hintOn && hint) {
        hintOn = wantHint;
        hint.style.opacity = wantHint ? "1" : "0";
      }
      // the hero's base scrim releases over the last stretch, so the sticky
      // stage's bottom edge never shows as a brightness seam when it unpins
      if (scrim) {
        const so = 1 - smoothstep(p, 0.88, 1);
        if (Math.abs(so - lastScrim) > 0.01) {
          lastScrim = so;
          scrim.style.opacity = so.toFixed(3);
        }
      }
      // section dim: fades in right after the settle so chapters read. Story
      // beats lower it via --tf-undim on <html> so the film breathes back in.
      if (dim) {
        const undim = clamp01(parseFloat(document.documentElement.style.getPropertyValue("--tf-undim")) || 0);
        const d = smoothstep(y, heroRange(), heroRange() + window.innerHeight * 0.7) * DIM_MAX * (1 - 0.8 * undim);
        if (Math.abs(d - lastDim) > 0.01) {
          lastDim = d;
          dim.style.opacity = d.toFixed(3);
        }
      }
    };

    // ── the rAF drive: dt-normalized lerp on scrollY that rests ───────────
    let target = 0;
    let shown = 0;
    let rafId: number | null = null;
    let lastTick = 0;

    const tick = (now: number) => {
      const dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      const k = 0.16;
      shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
      if (Math.abs(target - shown) < 0.5) {
        shown = target;
        rafId = null;
        lastTick = 0;
      } else {
        rafId = requestAnimationFrame(tick);
      }
      if (vid.duration) requestSeek(timeFor(shown, vid.duration));
      updateCaptions(shown, now);
    };

    const onScroll = () => {
      target = window.scrollY;
      if (rafId === null) rafId = requestAnimationFrame(tick);
    };

    // ── blob loader: poster wins the bandwidth race, ring is honest ───────
    // Keyed by variant: flipping a gate (rotating a tablet) swaps the cut and
    // reloads; a stale fetch is aborted and its result dropped (generation).
    let loadedVariant: Variant | null = null;
    let generation = 0;
    let inflight: AbortController | null = null;
    let objectUrl: string | null = null;
    let posterTimer: number | null = null;
    const failVideo = () => {
      if (ringWrap) ringWrap.classList.add("tf-ring--done");
      stg.classList.add("tf--video-failed");
      film.classList.add("tf--video-failed");
    };
    const resetVideo = () => {
      if (inflight) inflight.abort();
      inflight = null;
      if (posterTimer !== null) window.clearTimeout(posterTimer);
      posterTimer = null;
      seekBusy = false;
      pendingTime = null;
      stg.classList.remove("tf--video-ready", "tf--video-failed");
      flm.classList.remove("tf--video-ready", "tf--video-failed");
      if (ringWrap) ringWrap.classList.remove("tf-ring--done");
      if (ring) ring.style.strokeDashoffset = "126";
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = null;
      vid.removeAttribute("src");
    };
    async function loadFilmBlob(src: (typeof SOURCES)[Variant], gen: number) {
      const ctrl = new AbortController();
      inflight = ctrl;
      let watchdog = window.setTimeout(() => ctrl.abort(), 20000);
      try {
        const res = await fetch(src.video, { priority: "low", signal: ctrl.signal } as RequestInit);
        if (!res.ok || !res.body) throw new Error(`http ${res.status}`);
        const total = Number(res.headers.get("Content-Length")) || src.bytes;
        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let got = 0;
        let lastRing = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          window.clearTimeout(watchdog);
          watchdog = window.setTimeout(() => ctrl.abort(), 20000);
          chunks.push(value);
          got += value.length;
          const frac = Math.min(1, got / total);
          const now = performance.now();
          if (ring && (now - lastRing > 100 || frac === 1)) {
            lastRing = now;
            ring.style.strokeDashoffset = String(Math.round(126 * (1 - frac)));
          }
        }
        window.clearTimeout(watchdog);
        if (gen !== generation) return; // the cut changed meanwhile
        inflight = null;
        if (ring) ring.style.strokeDashoffset = "0";
        if (ringWrap) ringWrap.classList.add("tf-ring--done");
        objectUrl = URL.createObjectURL(new Blob(chunks as BlobPart[], { type: "video/mp4" }));
        vid.src = objectUrl;
        vid.load();
        vid.addEventListener(
          "canplay",
          () => {
            if (gen !== generation) return;
            requestSeek(timeFor(window.scrollY, vid.duration || 0));
            stg.classList.add("tf--video-ready");
            flm.classList.add("tf--video-ready");
          },
          { once: true }
        );
      } catch {
        window.clearTimeout(watchdog);
        if (gen !== generation) return;
        inflight = null;
        failVideo();
      }
    }
    const initFilm = (variant: Variant) => {
      if (loadedVariant === variant) return;
      loadedVariant = variant;
      generation += 1;
      const gen = generation;
      const src = SOURCES[variant];
      resetVideo();
      posterLayer.style.backgroundImage = `url('${src.poster}')`;
      let started = false;
      const startBlobFetch = () => {
        if (started || gen !== generation) return;
        started = true;
        void loadFilmBlob(src, gen);
      };
      const posterImg = new Image();
      posterImg.onload = startBlobFetch;
      posterImg.onerror = startBlobFetch;
      posterImg.src = src.poster;
      posterTimer = window.setTimeout(startBlobFetch, 4000);
    };

    // ── the live gate: arm/disarm the scrub on every query flip ───────────
    let scrubOn = false;
    const enableScrub = (variant: Variant) => {
      if (scrubOn) {
        initFilm(variant); // gate flipped between the two cuts
        return;
      }
      scrubOn = true;
      el.classList.add("tf--scrub");
      el.classList.remove("tf--static");
      initFilm(variant);
      armBeats();
      window.addEventListener("scroll", onScroll, { passive: true });
      bandState.forEach((s) => {
        s.op = -1;
        s.k = -1;
      });
      lastDim = -1;
      loadRampStart = performance.now();
      const ramp = (now: number) => {
        const t = clamp01((now - loadRampStart) / 1800);
        loadK = 1 - Math.pow(1 - t, 3);
        updateCaptions(shown, now);
        if (t < 1 && scrubOn) requestAnimationFrame(ramp);
      };
      requestAnimationFrame(ramp);
      updateCaptions(window.scrollY, performance.now());
      onScroll();
      // arming grows .tf from ~100vh to 800vh — every ScrollTrigger below
      // (reveals, the CTA KineticHeading, the beat anchors of the time map)
      // must re-measure or it fires ~700vh early
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const disableScrub = () => {
      if (!scrubOn) return;
      scrubOn = false;
      el.classList.remove("tf--scrub");
      el.classList.add("tf--static");
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      disarmBeats();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const applyHeroMode = () => {
      if (STATIC_GATES.some((q) => window.matchMedia(q).matches) || saveData()) disableScrub();
      else enableScrub(MOBILE_GATES.some((q) => window.matchMedia(q).matches) ? "mobile" : "desktop");
    };
    const MQLS = GATES.map((q) => window.matchMedia(q));
    const onMqChange = () => applyHeroMode();
    MQLS.forEach((m) => m.addEventListener("change", onMqChange));
    // belt and braces: some embedded/emulated environments miss MQL change
    // events on viewport flips; applyHeroMode is idempotent, resize is cheap
    window.addEventListener("resize", onMqChange);
    applyHeroMode();

    return () => {
      disableScrub();
      generation += 1;
      resetVideo();
      MQLS.forEach((m) => m.removeEventListener("change", onMqChange));
      window.removeEventListener("resize", onMqChange);
      vid.removeEventListener("seeked", onSeeked);
      vid.removeEventListener("error", onVideoError);
    };
  }, []);

  return (
    <section ref={root} className="tf" aria-label="NiteNexo. Jedes Licht ist eine Anfrage.">
      {/* ── the film: fixed behind the ENTIRE page, one continuous take ── */}
      <div className="tf-film" aria-hidden="true">
        <div className="tf-poster" />
        <video className="tf-video" muted playsInline preload="none" tabIndex={-1} />
        <div className="tf-dim" />
      </div>

      {/* ── hero region: sticky caption stage over the film ── */}
      <div className="tf-stage">
        <div className="tf-scrim" aria-hidden="true" />

        <div className="tf-ringwrap" aria-hidden="true">
          <svg className="tf-ring" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="126" style={{ strokeDashoffset: 126 }} />
          </svg>
        </div>

        {/* Band 1 — Scatter (links) */}
        <div className="tf-band tf-band--left tf-band--scatter">
          <p className="tf-h" role="presentation">Jedes Licht ist eine Anfrage.</p>
          <p className="tf-s">Freitagabend. Sie hören nicht auf.</p>
        </div>

        {/* Band 2 — Website (Grid-Snap, rechts): das erste Versprechen */}
        <div className="tf-band tf-band--right tf-band--grid">
          <p className="tf-h" role="presentation">Die Website verkauft.</p>
          <p className="tf-s">Tickets, Reservierungen, Anfragen. Um 23:40.</p>
        </div>

        {/* Band 3 — KI (Rise, links): das zweite Versprechen, Chatbot als Beispiel */}
        <div className="tf-band tf-band--left tf-band--rise">
          <p className="tf-h" role="presentation">Die KI übernimmt.</p>
          <p className="tf-s">Der Chatbot nimmt auf, bestätigt, trägt ein.</p>
        </div>

        {/* Band 4 — Abläufe (Weave, rechts) */}
        <div className="tf-band tf-band--right tf-band--weave">
          <p className="tf-h" role="presentation">Alles läuft weiter.</p>
          <p className="tf-s">Gästeliste, Buchhaltung, Hosting. Auch wenn du schläfst.</p>
        </div>

        {/* Band 5 — Settle: der Hero */}
        <div className="tf-band tf-band--settle tf-band--rise">
          <h1 className="tf-h1">Websites, die verkaufen. KI, die mitarbeitet.</h1>
          <p className="tf-s tf-s--settle">
            Um 23:40 kauft jemand ein Ticket auf deiner Seite. Um 23:41 trägt dein Chatbot die
            Reservierung ein. Website und KI, die deine Abläufe übernehmen.
          </p>
          <div className="tf-cta">
            <Button variant="inverted" glow magnetic href="/kontakt">
              Projekt starten
            </Button>
            <Button variant="ghost-on-dark" magnetic href="/leistungen">
              Leistungen ansehen
            </Button>
          </div>
        </div>

        <span className="tf-hint" aria-hidden="true">Scrollen</span>
      </div>

      {/* ── static hero (reduced motion, Save-Data, no-JS) — sits
           transparently on the page-wide thread-env world, so it never shows
           a cropped image edge against the rest of the page ── */}
      <div className="tf-static">
        <div className="tf-static-scrim" aria-hidden="true" />
        <div className="tf-static-inner">
          <h1 className="tf-h1">Websites, die verkaufen. KI, die mitarbeitet.</h1>
          <p className="tf-s tf-s--settle">
            Websites &amp; KI-Integration für Gastro, Events und Nachtleben. Im Dienst, auch um 23:40.
          </p>
          <div className="tf-cta">
            <Button variant="inverted" glow href="/kontakt">
              Projekt starten
            </Button>
            <Button variant="ghost-on-dark" href="/leistungen">
              Leistungen ansehen
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
