import React from "react";

/**
 * »Dir gehört alles« — die Lock-in-Zusagen.
 *
 * Laut Zielgruppen-Recherche ist die eigentliche Angst der Branche nicht der
 * Preis, sondern Abhaengigkeit: Agenturen, die die Domain auf sich registrieren,
 * und Vertraege, die nicht regeln, wann der Code uebergeht. Genau deshalb steht
 * das hier gross und nicht im Kleingedruckten.
 *
 * ACHTUNG: Hier darf ausschliesslich stehen, was der Betreiber bestaetigt hat.
 * "Inhaltsaenderungen kosten nichts" wurde NICHT bestaetigt und fehlt deshalb.
 */
const ZUSAGEN = [
  {
    idx: "01",
    titel: "Die Domain läuft auf dich",
    text: "Domain, Code und Rechte gehören dir, nicht uns. Mit der Abnahme gehen sie über. Du kannst jederzeit woanders hin und nimmst alles mit.",
  },
  {
    idx: "02",
    titel: "Monatlich kündbar",
    text: "Keine Mindestlaufzeit, keine Kündigungsfrist über den Monat hinaus. Wir halten dich mit Arbeit, nicht mit Vertrag.",
  },
  {
    idx: "03",
    titel: "Antwort in einem Werktag",
    text: "Kein Ticket-System, kein Call-Center. Du schreibst der Person, die deine Seite gebaut hat, und bekommst innerhalb eines Werktags eine Antwort.",
  },
];

export function Zusagen() {
  return (
    <section className="nx-section nx-zusagen" id="zusagen">
      <div className="nx-wrap">
        <div className="nx-head" data-nx-reveal>
          <h2 className="nx-display nx-d2" data-nx-rise>Dir gehört alles.</h2>
          <p className="nx-body nx-zusagen__intro">
            Das Unangenehmste an Agenturen ist nicht der Preis, sondern das Danach. Deshalb steht
            es hier und nicht im Kleingedruckten.
          </p>
        </div>

        <div className="nx-rows" data-nx-stagger>
          {ZUSAGEN.map((z) => (
            <div className="nx-row" key={z.idx} data-nx-reveal>
              <span className="nx-row__idx">{z.idx}</span>
              <span>
                <span className="nx-row__title">{z.titel}</span>
                <span className="nx-body">{z.text}</span>
              </span>
              <span className="nx-row__val" aria-hidden="true">
                ✓
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
