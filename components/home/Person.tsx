import React from "react";
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import { CONTACT } from "@/lib/site";

/**
 * Wer das baut.
 *
 * Laut Recherche verkauft ein Zwei-Personen-Betrieb ueber Gesicht und
 * Erreichbarkeit — ein Inhaberfoto und eine sichtbare Nummer stehen in der
 * Vertrauens-Rangliste dieser Zielgruppe ganz oben, deutlich vor jeder
 * Selbstbeschreibung.
 *
 * Das Foto wird zur Bauzeit gesucht. Liegt keines da, bleibt die Sektion
 * vollstaendig und ruhig — kein leerer Rahmen, kein Platzhalter-Avatar.
 */
function findePortrait(): string | null {
  const kandidaten = ["stefan.webp", "stefan.jpg", "stefan.jpeg", "stefan.png"];
  for (const name of kandidaten) {
    if (fs.existsSync(path.join(process.cwd(), "public", "team", name))) {
      return `/team/${name}`;
    }
  }
  return null;
}

export function Person() {
  const portrait = findePortrait();

  return (
    <section className="nx-section nx-person" id="person">
      <div className="nx-wrap nx-person__grid">
        <div data-nx-stagger>
          <p className="nx-mono" data-nx-reveal>
            Wer das baut
          </p>
          <h2 className="nx-display nx-d2 nx-person__h2" data-nx-rise>
            Du redest mit dem, der es gebaut hat.
          </h2>
          <p className="nx-body nx-person__text" data-nx-reveal>
            NiteNexo ist eine kleine Werkstatt in Wien: ein Mensch und fünf KI-Agenten, die bauen,
            prüfen, buchen und texten. Jede Freigabe bleibt beim Menschen. Kein Ticket-System,
            kein wechselnder Ansprechpartner.
          </p>
          <div className="nx-person__kontakt" data-nx-reveal>
            <a className="nx-btn nx-btn--primary" href={CONTACT.phoneHref} data-magnetic>
              {CONTACT.phone}
            </a>
            <a className="nx-btn nx-btn--ghost" href={`mailto:${CONTACT.email}`} data-magnetic>
              {CONTACT.email}
            </a>
          </div>
        </div>

        <figure className="nx-person__figure" data-nx-reveal>
          {portrait ? (
            <Image
              src={portrait}
              alt={`${CONTACT.name}, NiteNexo Solutions`}
              width={760}
              height={1046}
              className="nx-person__img"
              sizes="(max-width: 900px) 60vw, 380px"
            />
          ) : null}
          <figcaption className="nx-person__cap">
            <span className="nx-person__name">{CONTACT.name}</span>
            <span className="nx-mono">Gründer · Wien</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
