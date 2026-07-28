"use client";

import React, { useEffect, useRef, useState } from "react";

function useCountUp(target: number, dur = 1500) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setV(target);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            const t0 = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - t0) / dur);
              setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, dur]);

  return { v, ref };
}

function StatNumber({ prefix = "", target, suffix = "", label }: { prefix?: string; target: number; suffix?: string; label: string }) {
  const { v, ref } = useCountUp(target);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ font: "var(--type-display-large)", fontSize: 46, lineHeight: 1 }}>
        {prefix}
        {v}
        {suffix}
      </div>
      <div style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)", marginTop: 8 }}>{label}</div>
    </div>
  );
}

function StatText({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ font: "var(--type-display-large)", fontSize: 46, lineHeight: 1 }}>{value}</div>
      <div style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)", marginTop: 8 }}>{label}</div>
    </div>
  );
}

/** Hero stat strip with count-up numbers triggered on scroll into view. */
export function StatStrip() {
  return (
    <div
      className="bw-stat-strip"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "var(--space-xl)",
        marginTop: "var(--space-section)",
        padding: "var(--space-xl)",
        border: "1px solid var(--hairline-violet)",
        borderRadius: "var(--rounded-xl)",
        background: "rgba(21,15,35,0.5)",
      }}
    >
      <StatNumber prefix="<" target={30} suffix="s" label="bis zur ersten Antwort" />
      <StatText value="24/7" label="erreichbar, auch nachts" />
      <StatText value="EU" label="Daten in Frankfurt" />
    </div>
  );
}
