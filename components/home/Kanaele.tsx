"use client";

import React, { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/components/motion/gsap";

/**
 * Das Kanal-Laufband — gehoert zum Assistenten, nicht auf eine eigene Buehne.
 * Es beantwortet die eine Frage, die nach dem Chat-Fenster kommt: "Und wo
 * laeuft das?" Deshalb steht es direkt darunter statt als freischwebender
 * Logo-Streifen in der Seitenmitte.
 *
 * Marken mit echtem Logo sind die Kanaele (dort schreibt der Gast). Systeme
 * stehen als Wort da — ein nachgezeichnetes Logo waere eine Erfindung.
 *
 * Das Band reagiert auf die Scroll-Geschwindigkeit: schneller scrollen laesst
 * es schneller laufen, Richtungswechsel dreht es um. Mechanik uebernommen aus
 * »Scroll Velocity Text« (21st.dev/cnippet-dev) und auf GSAP portiert.
 */
const KANAELE = [
  { src: "/assets/logos/whatsapp.svg", name: "WhatsApp" },
  { src: "/assets/logos/instagram.svg", name: "Instagram" },
  { src: "/assets/logos/telegram.svg", name: "Telegram" },
];
const SYSTEME = ["Website-Chat", "Google Kalender", "Kassensystem", "Tischplan", "Stripe", "Newsletter"];

/** Grundtempo in Pixeln pro Sekunde, bevor die Scroll-Geschwindigkeit dazukommt. */
const BASE_PPS = 34;

function Gruppe({ hidden }: { hidden: boolean }) {
  return (
    <span className="nx-kan__group" aria-hidden={hidden || undefined}>
      {KANAELE.map((k) => (
        <span className="nx-kan__item nx-kan__item--logo" key={k.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={k.src} alt="" width={22} height={22} aria-hidden="true" />
          {k.name}
        </span>
      ))}
      {SYSTEME.map((s) => (
        <span className="nx-kan__item" key={s}>
          {s}
        </span>
      ))}
    </span>
  );
}

export function Kanaele() {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vp = viewport.current;
    const tr = track.current;
    if (!vp || !tr || prefersReducedMotion()) return;

    const group = tr.querySelector<HTMLElement>(".nx-kan__group");
    if (!group) return;

    let width = group.offsetWidth;
    let x = 0;
    let dir = -1;
    let boost = 0; // geglaettete Scroll-Geschwindigkeit, 0 … 4
    let lastY = window.scrollY;
    let visible = false;
    let running = false;

    const tick = (_t: number, dt: number) => {
      // Scroll-Geschwindigkeit messen und weich nachziehen — ein roher Wert
      // laesst das Band bei jedem Rad-Klick springen.
      const y = window.scrollY;
      const v = (y - lastY) / Math.max(dt, 1);
      lastY = y;
      const target = Math.min(4, Math.abs(v) * 2.2);
      boost += (target - boost) * (1 - Math.exp(-dt / 110));
      if (Math.abs(v) > 0.05) dir = v > 0 ? -1 : 1;

      x += dir * BASE_PPS * (1 + boost) * (dt / 1000);
      if (width > 0) x = ((x % width) + width) % width; // 0 … width
      tr.style.transform = `translate3d(${(x - width).toFixed(2)}px, 0, 0)`;
    };

    const start = () => {
      if (running) return;
      running = true;
      lastY = window.scrollY;
      gsap.ticker.add(tick);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      gsap.ticker.remove(tick);
    };

    // Nur laufen, wenn es jemand sehen kann.
    const io = new IntersectionObserver((e) => {
      visible = e.some((x_) => x_.isIntersecting);
      if (visible && !document.hidden) start();
      else stop();
    });
    io.observe(vp);

    const onVis = () => (document.hidden || !visible ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    const ro = new ResizeObserver(() => {
      width = group.offsetWidth;
    });
    ro.observe(group);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="nx-kan">
      <p className="nx-mono nx-kan__label">Kanäle und Systeme, die wir anbinden</p>
      <div className="nx-kan__viewport" ref={viewport}>
        <div className="nx-kan__track" ref={track}>
          <Gruppe hidden={false} />
          <Gruppe hidden />
          <Gruppe hidden />
        </div>
      </div>
    </div>
  );
}
