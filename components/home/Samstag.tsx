"use client";

import React, { useEffect, useRef, useState } from "react";
import { BETRIEBE, KANAL_LABEL, type Kanal } from "@/lib/samstag";

/**
 * »Dein Samstag« — die Signatur-Sektion. Der Besucher ist die Hauptfigur.
 *
 * Links kommt sein Abend an, wie er ankommt: ungeordnet, versetzt, dicht.
 * Rechts dieselben Zeilen, abgearbeitet und durchgestrichen, jede mit dem
 * Kanal, der sie erledigt hat. Website, KI und Hosting tun darin exakt
 * dasselbe — sie nehmen Zeilen weg — und sind damit strukturell gleichrangig.
 *
 * Ehrlichkeit: Das ist ausdruecklich ein Beispielabend, kein Live-Protokoll und
 * kein Fake-Dashboard. Der Zaehler zaehlt genau die Zeilen, die zu sehen sind,
 * und zwei bleiben bewusst offen — es wird nicht behauptet, dass alles
 * automatisch laeuft.
 *
 * Die gleitende Pille ist ohne framer-motion gebaut: gemessene Position, eine
 * transform-Transition. Das spart der Startseite eine ganze Bibliothek.
 */
export function Samstag() {
  const [aktiv, setAktiv] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const betrieb = BETRIEBE[aktiv];

  // Pille exakt auf den aktiven Tab legen (auch nach Font-Load und Resize).
  useEffect(() => {
    const place = () => {
      const wrap = tabsRef.current;
      const pill = pillRef.current;
      if (!wrap || !pill) return;
      const btn = wrap.querySelectorAll<HTMLButtonElement>("button")[aktiv];
      if (!btn) return;
      pill.style.width = `${btn.offsetWidth}px`;
      pill.style.transform = `translateX(${btn.offsetLeft}px)`;
    };
    place();
    const ro = new ResizeObserver(place);
    if (tabsRef.current) ro.observe(tabsRef.current);
    document.fonts?.ready?.then(place).catch(() => {});
    return () => ro.disconnect();
  }, [aktiv]);

  const offen = betrieb.zeilen.filter((z) => z.von === "du").length;
  const gesamt = betrieb.zeilen.length;

  return (
    <section className="nx-section nx-samstag" id="samstag" data-nx-run>
      <div className="nx-wrap">
        <div className="nx-head" data-nx-reveal>
          <div>
            <p className="nx-mono">Ein Beispielabend</p>
            <h2 className="nx-display nx-d2 nx-samstag__h2">{betrieb.abend}</h2>
          </div>
          <p className="nx-body nx-samstag__intro">
            So kommt ein Samstag auf deinem Handy an. Und so sieht er aus, wenn Website, KI und
            Wartung ihren Teil übernehmen.
          </p>
        </div>

        {/* Die einzige Interaktion, die die Seite verlangt: ein Tipp. */}
        <div className="nx-tabs" ref={tabsRef} role="tablist" aria-label="Art des Betriebs">
          <span className="nx-tabs__pill" ref={pillRef} aria-hidden="true" />
          {BETRIEBE.map((b, i) => (
            <button
              key={b.id}
              role="tab"
              aria-selected={i === aktiv}
              className={`nx-tabs__btn${i === aktiv ? " is-on" : ""}`}
              onClick={() => setAktiv(i)}
              type="button"
            >
              {b.label}
            </button>
          ))}
        </div>

        <div className="nx-sams__grid">
          {/* ── Links: wie es ankommt ─────────────────────────────────── */}
          <div className="nx-sams__col nx-sams__col--roh">
            <div className="nx-sams__colhead">
              <span className="nx-mono">Ohne uns</span>
              <span className="nx-sams__count nx-mono">
                <b data-count={String(gesamt)} key={`a-${betrieb.id}`}>0</b> offen
              </span>
            </div>
            <ul className="nx-sams__list" key={`roh-${betrieb.id}`}>
              {betrieb.zeilen.map((z, i) => (
                <li
                  className="nx-sams__msg"
                  key={z.text}
                  style={{ "--i": i, "--drift": `${(i % 3) - 1}` } as React.CSSProperties}
                >
                  {z.text}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Rechts: wie er ausgeht ────────────────────────────────── */}
          <div className="nx-sams__col nx-sams__col--klar">
            <div className="nx-sams__colhead">
              <span className="nx-mono">Mit uns</span>
              <span className="nx-sams__count nx-mono">
                <b data-count={String(offen)} key={`b-${betrieb.id}`}>0</b> offen
              </span>
            </div>
            <ul className="nx-sams__list" key={`klar-${betrieb.id}`}>
              {betrieb.zeilen.map((z, i) => (
                <li
                  className={`nx-sams__msg nx-sams__msg--done${z.von === "du" ? " is-mine" : ""}`}
                  key={z.text}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <span className="nx-sams__txt">{z.text}</span>
                  <span className={`nx-sams__by nx-sams__by--${z.von}`}>{KANAL_LABEL[z.von]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="nx-sams__fazit nx-display nx-d3" data-nx-reveal>
          {gesamt} Nachrichten. {offen} davon musst du selbst beantworten.
        </p>
      </div>
    </section>
  );
}
