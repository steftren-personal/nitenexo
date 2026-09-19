import React from "react";
import Image from "next/image";
import MorphGallery from "@/components/ui/morph-gallery";

/**
 * Der Beweis — das eine helle Kapitel der Seite.
 *
 * Hier liegt das einzige echte Bildmaterial: der Screenshot einer wirklich
 * gebauten Seite, gross und scharf. Auf Papier statt auf Graphit, weil ein
 * dunkler Screenshot auf dunklem Grund verschwimmt und auf hellem Grund als
 * das gelesen wird, was er ist: ein Bildschirm.
 *
 * Zahlen: alle drei gehoeren nachweislich zu teenclubbing.at (lib/projects.ts)
 * und sind hier auch als Projektzahlen beschriftet. Keine Selbstmessung.
 */
/**
 * Vier echte Ansichten derselben gebauten Seite. Sie loesen sich ineinander
 * auf, statt zu schneiden — man sieht dadurch nicht nur EIN Bild der Arbeit,
 * sondern die Seite als Ganzes, ohne dass jemand klicken muss.
 */
const ANSICHTEN = [
  { src: "/projekte/galerie/tc-hero.webp", alt: "Startseite mit Ticket-Vorverkauf und Countdown", label: "Start · Tickets und Countdown" },
  { src: "/projekte/galerie/tc-ablauf.webp", alt: "Der Ablauf des Abends", label: "Ablauf · Was wann passiert" },
  { src: "/projekte/galerie/tc-eltern.webp", alt: "Location und Anfahrt für Eltern", label: "Eltern · Location und Anfahrt" },
  { src: "/projekte/galerie/tc-faq.webp", alt: "Häufige Fragen", label: "FAQ · Die Fragen davor" },
];

const FAKTEN: [string, string][] = [
  ["Brief bis live", "4 Tage"],
  ["Cookie-Banner", "keiner nötig"],
  ["First Load", "129 kB"],
];

export function Beweis() {
  return (
    <section className="nx-section nx-paper nx-beweis" id="beweis">
      <div className="nx-wrap">
        <div className="nx-head">
          <div>
            <p className="nx-mono" data-nx-rise>Gebaut für Teen Clubbing Wien</p>
            <h2 className="nx-display nx-d2 nx-beweis__h2" data-nx-rise>Vom Brief zur Seite, in vier Tagen.</h2>
          </div>
          <p className="nx-body nx-beweis__intro" data-nx-rise>
            Ein Clubbing für 12- bis 15-Jährige braucht zwei Zielgruppen auf einer Seite: die
            Kids, die Tickets wollen, und die Eltern, die wissen wollen, was da läuft.
          </p>
        </div>

        <figure className="nx-beweis__figure" data-nx-reveal>
          <MorphGallery items={ANSICHTEN} autoplay={4200} className="nx-beweis__shot" />
          <Image
            src="/projekte/teenclubbing-mobile.webp"
            alt="Dieselbe Seite am Handy"
            width={560}
            height={1212}
            className="nx-beweis__phone"
            quality={92}
            sizes="220px"
          />
        </figure>

        <div className="nx-beweis__facts nx-rows" data-nx-stagger>
          {FAKTEN.map(([k, v]) => (
            <div className="nx-beweis__fact" key={k} data-nx-reveal>
              <span className="nx-mono">{k}</span>
              <span className="nx-display nx-beweis__val">{v}</span>
            </div>
          ))}
          <a
            className="nx-btn nx-btn--ghost nx-beweis__link"
            href="https://teenclubbing.at"
            target="_blank"
            rel="noreferrer noopener"
            data-nx-reveal
            data-magnetic
          >
            teenclubbing.at ansehen
          </a>
        </div>
      </div>
    </section>
  );
}
