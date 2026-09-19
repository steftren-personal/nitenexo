import React from "react";
import { ChatPreview } from "@/components/screens/ChatPreview";
import { Kanaele } from "./Kanaele";

/**
 * »So arbeitet der Assistent« — das Chat-Fenster, das der Nutzer behalten
 * wollte. Es spielt sich beim Hineinscrollen von selbst ab (eigener
 * IntersectionObserver in ChatPreview) und zeigt konkret, was die
 * KI-Integration im Alltag tut.
 *
 * Bewusst ohne Maskottchen und ohne Halte-Interaktion: Die Sektion beweist,
 * sie unterhaelt nicht.
 */
const SCHRITTE: [string, string, string][] = [
  ["01", "Dein Gast schreibt", "Auf WhatsApp, jederzeit. Auch um 23:40, wenn niemand ans Telefon geht."],
  ["02", "Der Assistent antwortet", "Prüft Verfügbarkeit, schlägt Zeiten vor, bestätigt. In Sekunden, ohne dass dein Team tippt."],
  ["03", "Automatisch eingetragen", "Die Reservierung landet im System, die Bestätigung geht raus. Du schläfst weiter."],
];

export function Assistent() {
  return (
    <section className="nx-section nx-assistent" id="assistent">
      <div className="nx-wrap nx-assistent__grid">
        <div className="nx-assistent__chat" data-nx-reveal>
          <ChatPreview />
        </div>

        <div data-nx-stagger>
          <p className="nx-mono" data-nx-reveal>
            KI-Integration im Alltag
          </p>
          <h2 className="nx-display nx-d2 nx-assistent__h2" data-nx-rise>
            Er macht die Arbeit. Du siehst das Ergebnis.
          </h2>

          <div className="nx-assistent__schritte">
            {SCHRITTE.map(([idx, titel, text]) => (
              <div className="nx-assistent__schritt" key={idx} data-nx-reveal>
                <span className="nx-mono nx-assistent__idx">{idx}</span>
                <span>
                  <span className="nx-assistent__titel">{titel}</span>
                  <span className="nx-body">{text}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Kanaele />
    </section>
  );
}
