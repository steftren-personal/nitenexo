import React from "react";
import Link from "next/link";

/**
 * Hero — liefert in zehn Sekunden, was die Zielgruppen-Recherche verlangt:
 * was, fuer wen, wie schnell, was es kostet, wer, wie erreichbar, plus einen
 * Beleg mit Link. Kein Bild, keine Mitte, kein Badge ueber der H1.
 *
 * Rechts steht das Datenblatt der Werkstatt — dieselbe gefuehrte Zeile, die die
 * ganze Seite traegt, und sie beantwortet gleich im Hero die eigentliche Angst
 * der Branche: Bindung und Eigentum.
 */
const DATENBLATT: [string, string][] = [
  ["Standort", "Wien"],
  ["Team", "Ein Mensch, fünf KI-Agenten"],
  ["Antwort", "in einem Werktag"],
  ["Bindung", "keine, monatlich kündbar"],
  ["Rechte", "Domain und Code gehören dir"],
];

export function Hero() {
  return (
    <header className="nx-hero">
      <div className="nx-wrap nx-hero__grid">
        <div className="nx-hero__main" data-nx-stagger>
          <p className="nx-mono nx-hero__eyebrow" data-nx-reveal>
            NiteNexo Solutions · Wien
          </p>

          <h1 className="nx-display nx-d1 nx-hero__h1" data-nx-reveal>
            In Tagen live.
            <br />
            Nicht in Monaten.
          </h1>

          <p className="nx-body nx-lead nx-hero__lead" data-nx-reveal>
            Websites, KI-Abläufe und Wartung für Gastro, Events und Nachtleben. Gebaut von einem
            Menschen aus Wien, Festpreis vor dem Start, und die Domain läuft auf dich.
          </p>

          <div className="nx-hero__prices nx-mono" data-nx-reveal>
            <span>Website ab €500</span>
            <span className="nx-hero__sep" aria-hidden="true" />
            <span>KI ab €300</span>
            <span className="nx-hero__sep" aria-hidden="true" />
            <span>Hosting monatlich</span>
          </div>

          <div className="nx-hero__cta" data-nx-reveal>
            <Link className="nx-btn nx-btn--primary" href="/kontakt" data-magnetic>
              Projekt starten
            </Link>
          </div>

          <p className="nx-hero__proof" data-nx-reveal>
            <span className="nx-mono">Zuletzt gebaut</span>{" "}
            <a
              className="nx-hero__proof-link"
              href="https://teenclubbing.at"
              target="_blank"
              rel="noreferrer noopener"
            >
              teenclubbing.at
            </a>{" "}
            <span className="nx-hero__proof-note">Brief bis live in 4 Tagen.</span>
          </p>
        </div>

        <aside className="nx-hero__sheet" aria-label="Datenblatt" data-nx-stagger>
          {DATENBLATT.map(([k, v]) => (
            <div className="nx-sheet__row" key={k} data-nx-reveal>
              <span className="nx-mono nx-sheet__k">{k}</span>
              <span className="nx-sheet__v">{v}</span>
            </div>
          ))}
        </aside>
      </div>
    </header>
  );
}
