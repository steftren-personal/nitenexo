import React from "react";
import Link from "next/link";
import { PRICING } from "@/lib/content";

/**
 * Preise als gefuehrte Zeilen.
 *
 * Die Zeilen erklaeren hier bewusst NICHT noch einmal, was die Leistung ist —
 * das steht zwei Sektionen darueber. Sie beantworten die einzige Frage, die
 * eine Spanne offen laesst: wovon haengt ab, wo ich darin lande.
 *
 * Steht bewusst weit oben auf der Seite statt ganz hinten: Der Preis ist laut
 * Recherche einer der staerksten Vertrauensbauer dieser Zielgruppe — und die
 * Wiener Mitbewerber werben offensiv mit Festpreisen.
 *
 * Alle Zahlen kommen aus lib/content.ts, nichts wird hier erfunden.
 */
/** Was den Preis nach oben treibt — ohne die Leistungsbeschreibung zu wiederholen. */
const SPANNE: Record<string, string> = {
  website:
    "Eine Landing-Page liegt am unteren Ende. Nach oben treiben Seitenzahl, Ticket-Shop, Reservierung und ob wir Texte und Fotos mit aufbereiten.",
  ki: "Ein Chatbot nur für FAQ und Öffnungszeiten liegt am unteren Ende. Nach oben treiben angebundene Systeme — Kasse, Tischplan, Kalender — und zusätzliche Kanäle.",
  hosting:
    "Der Betrag richtet sich nach dem Umfang von Website und KI. Er steht im selben Angebot wie der Festpreis, nicht in einer Rechnung danach.",
};

const HINWEIS: Record<string, string> = {
  website: "In Tagen live, nicht in Monaten.",
  ki: "Die Spanne gilt für die Chatbot-Einrichtung. Andere Automatisierungen bekommen einen eigenen Festpreis nach Umfang.",
  hosting: "Monatlich kündbar.",
};

export function Preise() {
  return (
    <section className="nx-section" id="preise">
      <div className="nx-wrap">
        <div className="nx-head" data-nx-reveal>
          <h2 className="nx-display nx-d2" data-nx-rise>Was es kostet.</h2>
          <p className="nx-body nx-preise__intro">
            Keine Pakete von der Stange. Den Festpreis bekommst du nach einem kurzen Gespräch und
            vor dem Start, nicht nach der Arbeit.
          </p>
        </div>

        <div className="nx-rows" data-nx-stagger>
          {PRICING.map((p, i) => (
            <div className="nx-row nx-preis__row" key={p.id} data-nx-reveal>
              <span className="nx-row__idx">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="nx-row__title">{p.label}</span>
                <span className="nx-body nx-preis__lead">{SPANNE[p.id] ?? p.lead}</span>
                {HINWEIS[p.id] ? <span className="nx-preis__note nx-mono">{HINWEIS[p.id]}</span> : null}
              </span>
              <span className="nx-preis__amount">
                <span className="nx-display nx-preis__zahl">{p.amount}</span>
                <span className="nx-mono nx-preis__cap">{p.caption}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="nx-preise__foot" data-nx-reveal>
          <Link className="nx-btn nx-btn--ghost" href="/preise" data-magnetic>
            Alle Details und häufige Fragen
          </Link>
          <p className="nx-mono nx-preise__ust">
            Kleinunternehmer gem. § 6 Abs 1 Z 27 UStG — keine Umsatzsteuer ausgewiesen.
          </p>
        </div>
      </div>
    </section>
  );
}
