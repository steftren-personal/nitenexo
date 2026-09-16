"use client";

import React, { useEffect, useRef } from "react";

/**
 * StoryThread — the signature element: the film's lime filament continues as
 * one self-drawing SVG line through every homepage section down to the big
 * CTA, where it docks onto the "Projekt starten" button. Drawn by scroll
 * (stroke-dashoffset, delta-gated); chapter nodes light up as the thread
 * reaches them, in-between sections get a small violet pulse node.
 *
 * Mount it INSIDE a position:relative wrapper that spans everything below the
 * film. Sections opt in via [data-thread-node] (chapter) and
 * [data-thread-pulse] (in-between pulse); the dock target is [data-thread-end].
 */
export function StoryThread() {
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const host = svg.parentElement;
    if (!host) return;
    const path = svg.querySelector<SVGPathElement>(".st-path");
    const glow = svg.querySelector<SVGPathElement>(".st-glow");
    if (!path || !glow) return;

    const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Node = { el: HTMLElement; y: number; x: number; kind: "chapter" | "pulse" | "end" };
    let nodes: Node[] = [];
    let total = 0;
    let hostTop = 0;
    let hostH = 1;
    let lastOffset = -1;
    let ticking = false;

    const measure = () => {
      const hostRect = host.getBoundingClientRect();
      hostTop = hostRect.top + window.scrollY;
      hostH = Math.max(1, host.offsetHeight);
      const W = Math.max(1, host.offsetWidth);
      svg.setAttribute("viewBox", `0 0 ${W} ${hostH}`);
      svg.setAttribute("width", String(W));
      svg.setAttribute("height", String(hostH));

      const pick = (sel: string, kind: Node["kind"]): Node[] =>
        Array.from(document.querySelectorAll<HTMLElement>(sel)).map((el) => {
          const r = el.getBoundingClientRect();
          return {
            el,
            kind,
            y: r.top + window.scrollY - hostTop + r.height / 2,
            x: r.left + window.scrollX + r.width / 2 - hostRect.left,
          };
        });

      nodes = [...pick("[data-thread-node]", "chapter"), ...pick("[data-thread-pulse]", "pulse"), ...pick("[data-thread-end]", "end")]
        .filter((n) => n.y > 0)
        .sort((a, b) => a.y - b.y);

      // Path: starts where the film's filament tail hands over (center-x of
      // the viewport-wide video, i.e. the host's horizontal center), then
      // curves through each node.
      let d = `M ${(W / 2).toFixed(1)} 0`;
      let prevX = W / 2;
      let prevY = 0;
      for (const n of nodes) {
        if (n.kind === "end") {
          // sweep around the centered CTA headline instead of striking
          // through it: arc out to the right, then dock into the button
          const outX = Math.min(W - 24, Math.max(n.x, prevX) + W * 0.24);
          const arcY = prevY + (n.y - prevY) * 0.55;
          d += ` C ${prevX.toFixed(1)} ${(prevY + (arcY - prevY) / 2).toFixed(1)}, ${outX.toFixed(1)} ${(prevY + (arcY - prevY) / 2).toFixed(1)}, ${outX.toFixed(1)} ${arcY.toFixed(1)}`;
          d += ` C ${outX.toFixed(1)} ${(arcY + (n.y - arcY) * 0.7).toFixed(1)}, ${n.x.toFixed(1)} ${n.y.toFixed(1)}, ${n.x.toFixed(1)} ${n.y.toFixed(1)}`;
          prevX = n.x;
          prevY = n.y;
          continue;
        }
        const midY = prevY + (n.y - prevY) / 2;
        d += ` C ${prevX.toFixed(1)} ${midY.toFixed(1)}, ${n.x.toFixed(1)} ${midY.toFixed(1)}, ${n.x.toFixed(1)} ${n.y.toFixed(1)}`;
        prevX = n.x;
        prevY = n.y;
      }
      path.setAttribute("d", d);
      glow.setAttribute("d", d);
      total = path.getTotalLength();
      path.style.strokeDasharray = `${total}`;
      glow.style.strokeDasharray = `${total}`;
      lastOffset = -1;
      render();
    };

    const render = () => {
      ticking = false;
      // draw up to just below the viewport's visual center
      const reach = window.scrollY + window.innerHeight * 0.62 - hostTop;
      const progress = reduced() ? 1 : Math.min(1, Math.max(0, reach / hostH));
      const offset = Math.round(total * (1 - progress));
      if (offset !== lastOffset) {
        lastOffset = offset;
        path.style.strokeDashoffset = `${offset}`;
        glow.style.strokeDashoffset = `${offset}`;
      }
      const reachedY = progress * hostH;
      for (const n of nodes) {
        const on = reduced() || n.y <= reachedY;
        if (on !== n.el.classList.contains("st-on")) n.el.classList.toggle("st-on", on);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(render);
      }
    };

    const ro = new ResizeObserver(() => measure());
    ro.observe(host);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => {
      lastOffset = -1;
      render();
    };
    mq.addEventListener("change", onMq);
    if (document.readyState === "complete") measure();
    else window.addEventListener("load", measure, { once: true });
    measure();

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  return (
    <svg ref={root} className="story-thread" aria-hidden="true" focusable="false">
      <path className="st-glow" d="M 0 0" fill="none" />
      <path className="st-path" d="M 0 0" fill="none" />
    </svg>
  );
}
