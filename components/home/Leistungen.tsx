import React from "react";
import Link from "next/link";

/**
 * Drei Leistungen als gefuehrte Zeilen — bewusst KEINE drei gleichen runden
 * Karten mit Thin-Line-Icon. Das ist laut Recherche das meistgenannte Muster,
 * an dem man eine generierte Seite 2026 sofort erkennt.
 *
 * Jede Zeile traegt links ihren Index, in der Mitte die Sache und rechts den
 * Preis. Gleiche Form, gleiches Gewicht: keine Leistung ist Unterpunkt einer
 * anderen.
 */
const LEISTUNGEN = [
  {
    idx: "01",
    titel: "Website-Creation",
    text: "Event-Seite, Landing-Page oder die ganze Bar- und Club-Website. Mobil zuerst, ohne Cookie-Banner, mit Ticket-Shop oder Reservierung direkt eingebunden.",
    punkte: ["Speisekarte als echter Text, nicht als PDF", "Reservierung und Tickets in einem Klick", "Öffnungszeiten und Lineup selbst pflegbar"],
    preis: "ab €500",
    href: "/leistungen#website-creation",
  },
  {
    idx: "02",
    titel: "KI-Integration",
    text: "Der Chatbot auf WhatsApp nimmt Reservierungen und Gästelisten auf. Dahinter laufen Abläufe weiter: Buchhaltung vorbereiten, Newsletter, Erinnerungen.",
    punkte: ["Antwortet, während du im Service stehst", "Kasse, Kalender und Tischplan angebunden", "Gästedaten bleiben deine, keine Dritt-KI"],
    preis: "ab €300",
    href: "/leistungen#ki-integration",
  },
  {
    idx: "03",
    titel: "Hosting & Wartung",
    text: "Damit es im Betrieb bleibt und mitwächst. Updates, Sicherheit und Erreichbarkeit im Hintergrund, ein fester Ansprechpartner davor.",
    punkte: ["Antwort in einem Werktag", "Bugfixes ohne Extrarechnung", "Monatlich kündbar, keine Bindung"],
    preis: "monatlich",
    href: "/leistungen#hosting-wartung",
  },
];

export function Leistungen() {
  return (
    <section className="nx-section" id="leistungen">
      <div className="nx-wrap">
        <div className="nx-head" data-nx-reveal>
          <h2 className="nx-display nx-d2" data-nx-rise>Drei Gewerke, eine Werkstatt.</h2>
          <p className="nx-body nx-leist__intro">
            Du kannst eines davon buchen oder alle drei. Den Festpreis bekommst du vor dem Start.
          </p>
        </div>

        <div className="nx-rows" data-nx-stagger>
          {LEISTUNGEN.map((l) => (
            <Link key={l.idx} href={l.href} className="nx-row nx-row--link nx-leist__row" data-nx-reveal>
              <span className="nx-row__idx">{l.idx}</span>
              <span className="nx-leist__body">
                <span className="nx-row__title">{l.titel}</span>
                <span className="nx-body nx-leist__text">{l.text}</span>
                <span className="nx-leist__punkte">
                  {l.punkte.map((p) => (
                    <span className="nx-leist__punkt" key={p}>
                      {p}
                    </span>
                  ))}
                </span>
              </span>
              <span className="nx-row__val nx-leist__preis">{l.preis}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
