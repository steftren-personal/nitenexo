"use client";

import React, { useEffect, useRef } from "react";
import { splitChars, type EntranceFx } from "@/components/motion/splitChars";

/**
 * StoryBeat — a full-viewport narrative moment between chapters, in the same
 * grammar as the intro bands: the chapter kicker plus one big line over the
 * live film, characters choreographed by scroll (reversible), and while the
 * beat is on screen the film breathes back in (--tf-undim on <html>, read by
 * ThreadFilm's dim layer). This is what makes the WHOLE page one story.
 *
 * Reduced motion: the line renders settled (--k stays 1), no drives.
 */
export function StoryBeat({
  kicker,
  line,
  fx,
  seed,
}: {
  kicker: string;
  line: string;
  fx: EntranceFx;
  seed: number;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const stage = el.querySelector<HTMLElement>(".sb-stage");
    const lineEl = el.querySelector<HTMLElement>(".sb-line");
    if (!stage || !lineEl) return;

    if (!lineEl.querySelector(".tf-vis")) splitChars(lineEl, seed, fx);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lastU = -1;
    let inView = false;
    let ticking = false;
    let played = false;
    let rampId: number | null = null;

    // The entrance plays ONCE, complete, when the beat enters the viewport
    // (time-based, ~1.1s) — never piecewise with each scroll step. Leaving
    // the viewport entirely resets it, so it replays on the way back.
    const playEntrance = () => {
      if (played || mq.matches) return;
      played = true;
      const t0 = performance.now();
      // deliberately slow and even, so every character's journey is visible
      const D = 2100;
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / D);
        const e = t * t * (3 - 2 * t);
        stage.style.setProperty("--k", e.toFixed(3));
        if (t < 1 && played) rampId = requestAnimationFrame(step);
        else rampId = null;
      };
      rampId = requestAnimationFrame(step);
    };
    const resetEntrance = () => {
      if (!played || mq.matches) return;
      played = false;
      if (rampId !== null) {
        cancelAnimationFrame(rampId);
        rampId = null;
      }
      stage.style.setProperty("--k", "0");
    };

    const render = () => {
      ticking = false;
      if (mq.matches) {
        stage.style.setProperty("--k", "1");
        return;
      }
      // the film breathes back in while the beat owns the viewport
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = r.top + r.height / 2 - vh / 2;
      const u = Math.min(1, Math.max(0, 1 - Math.abs(center) / (r.height * 0.75)));
      if (Math.abs(u - lastU) > 0.02) {
        lastU = u;
        document.documentElement.style.setProperty("--tf-undim", u.toFixed(2));
      }
    };

    const onScroll = () => {
      if (!inView || ticking) return;
      ticking = true;
      requestAnimationFrame(render);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const was = inView;
        inView = entries[0]?.isIntersecting ?? false;
        if (inView) {
          playEntrance();
          render();
        } else if (was) {
          resetEntrance();
          if (lastU > 0) {
            // hand the dim back when the beat leaves
            lastU = 0;
            document.documentElement.style.setProperty("--tf-undim", "0");
          }
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    const onMq = () => render();
    mq.addEventListener("change", onMq);
    if (mq.matches) stage.style.setProperty("--k", "1");
    else stage.style.setProperty("--k", "0");
    render();

    return () => {
      if (rampId !== null) cancelAnimationFrame(rampId);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onMq);
    };
  }, [seed, fx]);

  return (
    <section ref={root} className={`sb sb--${fx}`} aria-label={line}>
      <div className="sb-stage">
        <span className="chapter-kicker" data-thread-node>
          <span className="ck-dot" aria-hidden="true" />
          {kicker}
        </span>
        <p className="sb-line" role="presentation">{line}</p>
      </div>
    </section>
  );
}
