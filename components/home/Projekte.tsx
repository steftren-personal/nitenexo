import React from "react";
import Link from "next/link";
import { PROJECTS, CATEGORY_LABEL } from "@/lib/projects";
import { ImageStream } from "@/components/ui/image-stream";

/**
 * Was durch den Korridor faehrt, sind gebaute Bildschirme — vier Ansichten von
 * teenclubbing.at und vier Seiten dieser Werkstatt. Keine Platzhalter, keine
 * generierten Bilder: Wenn der Abschnitt "Umgesetzt für" heisst, muss auch
 * Umgesetztes darin fliegen.
 */
const BILDSCHIRME = [
  { src: "/projekte/stream/tc-hero.webp" },
  { src: "/projekte/stream/nx-leistungen.webp" },
  { src: "/projekte/stream/tc-eltern.webp" },
  { src: "/projekte/stream/nx-preise.webp" },
  { src: "/projekte/stream/tc-ablauf.webp" },
  { src: "/projekte/stream/nx-projekte.webp" },
  { src: "/projekte/stream/tc-faq.webp" },
  { src: "/projekte/stream/nx-werkstatt.webp" },
];

/**
 * Projekte als gefuehrte Zeilen — benannte Referenzen statt anonymer Mockups.
 *
 * Die Recherche ist hier eindeutig: Betreiber vertrauen benannten Projekten mit
 * Link und messbarem Ergebnis deutlich mehr als jeder Selbstbeschreibung, und
 * vergleichbare Betriebe schlagen prominente Namen.
 */
export function Projekte() {
  return (
    <section className="nx-section nx-projekte" id="projekte">
      <ImageStream images={BILDSCHIRME} className="nx-proj__stream" axis={46}>
        <div className="nx-wrap nx-proj__over">
          <p className="nx-mono">Gebaute Bildschirme</p>
          <h2 className="nx-display nx-d2" data-nx-rise>
            Umgesetzt für
          </h2>
          <p className="nx-body nx-projekte__intro">
            Echte Projekte mit Namen und Zahlen. Das dritte sind wir selbst.
          </p>
        </div>
      </ImageStream>

      <div className="nx-wrap">

        <div className="nx-rows" data-nx-stagger>
          {PROJECTS.map((p, i) => (
            <Link
              key={p.slug}
              href={`/projekte#${p.slug}`}
              className="nx-row nx-row--link nx-proj__row"
              data-nx-reveal
            >
              <span className="nx-row__idx">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="nx-proj__meta nx-mono">
                  {CATEGORY_LABEL[p.category]} · {p.kind}
                </span>
                <span className="nx-row__title">{p.name}</span>
                <span className="nx-body nx-proj__result">{p.result}</span>
                <span className="nx-proj__chips">
                  {p.chips.map((c) => (
                    <span className="nx-tag" key={c}>
                      {c}
                    </span>
                  ))}
                </span>
              </span>
              <span className="nx-row__val nx-proj__go" aria-hidden="true">
                ansehen →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
