"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { splitChars } from "@/components/motion/splitChars";
import { ScrollTrigger } from "@/components/motion/gsap";

/**
 * ThreadFilm — »Der Faden«: ONE continuous 15-second shot carries the whole
 * page. The video sits FIXED behind everything; the first 800vh (the hero
 * region) scrub its main journey (0 → T_SETTLE) with free scrolling, caption
 * bands and the settle hero. Below that the film never cuts away: its calm
 * final seconds keep scrubbing ultra-slowly behind every chapter down to the
 * CTA — the whole page is one take. Copy, band map, pacing and every
 * engineering rule come from .story-work/DESIGN-PACKAGE.md (lines verbatim).
 *
 * Static-image hero (same copy, ending frame) for phones, portrait tablets,
 * coarse-pointer portrait, short landscape phones and reduced motion — the
 * five gates live in CSS AND here, character-identical, re-evaluated live.
 */

const VIDEO_URL = "/assets/thread-film.mp4";
const POSTER_URL = "/assets/thread-poster.jpg"; // start frame (scrub poster)
const ENDING_URL = "/assets/thread-ending.jpg"; // ending frame (static hero)
// Real byte size of the encoded video — fallback when Content-Length is
// missing. Updated after the final encode.
const VIDEO_BYTES = 6873187;

// The hero region ends here in video time; the remaining tail (T_SETTLE →
// duration) is spread across the rest of the page as a breathing background.
const T_SETTLE = 13.0;
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

// The five static-hero gates — MUST stay character-identical to the CSS
// media queries in globals.css (.tf gate block).
const GATES = [
  "(max-width: 720px)",
  "(orientation: portrait) and (max-width: 1024px)",
  "(orientation: portrait) and (pointer: coarse)",
  "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
  "(prefers-reduced-motion: reduce)",
];

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
    // scrollY → video time: hero region plays 0..T_SETTLE, the rest of the
    // page spreads the calm tail T_SETTLE..duration. One take, no cut.
    const timeFor = (y: number, dur: number) => {
      const hr = heroRange();
      if (y <= hr) return (y / hr) * Math.min(T_SETTLE, dur);
      const rest = Math.max(1, pageMax() - hr);
      return Math.min(dur, Math.min(T_SETTLE, dur) + ((y - hr) / rest) * (dur - Math.min(T_SETTLE, dur)));
    };

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
    let started = false;
    let initDone = false;
    const failVideo = () => {
      if (ringWrap) ringWrap.classList.add("tf-ring--done");
      stg.classList.add("tf--video-failed");
      film.classList.add("tf--video-failed");
    };
    async function loadHeroBlob() {
      const ctrl = new AbortController();
      let watchdog = window.setTimeout(() => ctrl.abort(), 20000);
      try {
        const res = await fetch(VIDEO_URL, { priority: "low", signal: ctrl.signal } as RequestInit);
        if (!res.ok || !res.body) throw new Error(`http ${res.status}`);
        const total = Number(res.headers.get("Content-Length")) || VIDEO_BYTES;
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
        if (ring) ring.style.strokeDashoffset = "0";
        if (ringWrap) ringWrap.classList.add("tf-ring--done");
        vid.src = URL.createObjectURL(new Blob(chunks as BlobPart[], { type: "video/mp4" }));
        vid.load();
        vid.addEventListener(
          "canplay",
          () => {
            requestSeek(timeFor(window.scrollY, vid.duration || 0));
            stg.classList.add("tf--video-ready");
            flm.classList.add("tf--video-ready");
          },
          { once: true }
        );
      } catch {
        window.clearTimeout(watchdog);
        failVideo();
      }
    }
    const initHeroOnce = () => {
      if (initDone) return;
      initDone = true;
      posterLayer.style.backgroundImage = `url('${POSTER_URL}')`;
      const startBlobFetch = () => {
        if (started) return;
        started = true;
        void loadHeroBlob();
      };
      const posterImg = new Image();
      posterImg.onload = startBlobFetch;
      posterImg.onerror = startBlobFetch;
      posterImg.src = POSTER_URL;
      window.setTimeout(startBlobFetch, 4000);
    };

    // ── the live gate: arm/disarm the scrub on every query flip ───────────
    let scrubOn = false;
    const enableScrub = () => {
      if (scrubOn) return;
      scrubOn = true;
      el.classList.add("tf--scrub");
      initHeroOnce();
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
      // arming grows .tf from ~100vh to 600vh — every ScrollTrigger below
      // (reveals, the CTA KineticHeading) must re-measure or it fires ~500vh
      // early and the visitor arrives at an already-finished animation
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const disableScrub = () => {
      if (!scrubOn) return;
      scrubOn = false;
      el.classList.remove("tf--scrub");
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const applyHeroMode = () => {
      if (GATES.some((q) => window.matchMedia(q).matches)) disableScrub();
      else enableScrub();
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

        {/* Band 2 — Chatbot (Grid-Snap, rechts) */}
        <div className="tf-band tf-band--right tf-band--grid">
          <p className="tf-h" role="presentation">Der Chatbot antwortet.</p>
          <p className="tf-s">Aufgenommen, bestätigt, eingetragen. Um 23:40.</p>
        </div>

        {/* Band 3 — Website (Rise, links) */}
        <div className="tf-band tf-band--left tf-band--rise">
          <p className="tf-h" role="presentation">Die Website verkauft.</p>
          <p className="tf-s">Speisekarte, Termine, Buchung. Rund um die Uhr.</p>
        </div>

        {/* Band 4 — KI-Integration (Weave, rechts) */}
        <div className="tf-band tf-band--right tf-band--weave">
          <p className="tf-h" role="presentation">Die KI verbindet alles.</p>
          <p className="tf-s">Kasse, Kalender, Abläufe. Läuft von allein.</p>
        </div>

        {/* Band 5 — Settle: der Hero */}
        <div className="tf-band tf-band--settle tf-band--rise">
          <h1 className="tf-h1">Digitale Assistenten, die mitarbeiten.</h1>
          <p className="tf-s tf-s--settle">
            Chatbot, Website und KI-Integration aus einer Hand. Dein Gast schreibt um 23:40, und
            dahinter läuft alles von allein.
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

      {/* ── static hero (phones, portrait, reduced motion, no-JS) ── */}
      <div className="tf-static" style={{ backgroundImage: `url('${ENDING_URL}')` }}>
        <div className="tf-static-scrim" aria-hidden="true" />
        <div className="tf-static-inner">
          <span className="tf-chip tf-chip--static">Chatbots für Gastro &amp; Clubs · WhatsApp</span>
          <h1 className="tf-h1">Digitale Assistenten, die mitarbeiten.</h1>
          <p className="tf-s tf-s--settle">
            Chatbot, Website und KI-Integration aus einer Hand. Im Dienst, auch um 23:40.
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
