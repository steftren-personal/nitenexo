import React from "react";
import { HomeMotion } from "./HomeMotion";
import { Hero } from "./Hero";
import { Samstag } from "./Samstag";
import { Beweis } from "./Beweis";
import { Leistungen } from "./Leistungen";
import { Assistent } from "./Assistent";
import { Preise } from "./Preise";
import { Zusagen } from "./Zusagen";
import { Projekte } from "./Projekte";
import { Person } from "./Person";
import { Schluss } from "./Schluss";
import { HomeHtmlClass } from "./HomeHtmlClass";

/**
 * Die Startseite »Dein Samstag«.
 *
 * Dramaturgie: Problem → Wendepunkt → Beweis → Angebot → Preis → Sicherheit →
 * Referenzen → Mensch → Handlung. Der Besucher ist durchgehend die Hauptfigur;
 * die Werkstatt zeigt sich erst, wenn sie etwas belegt hat.
 *
 * Helle Kapitel (Beweis, Projekte) unterbrechen den dunklen Lauf zweimal —
 * echte Screenshots lesen sich auf Papier als das, was sie sind: Bildschirme.
 *
 * Eine gescrubbte Film-Tafel stand hier einmal zwischen Samstag und Beweis.
 * Sie ist entfernt: Das generierte Material hat die Qualitaet der Seite nicht
 * getragen. Der Wendepunkt laeuft jetzt ueber die Wort-Maske im Beweis-Kapitel.
 */
export function Werkbank() {
  return (
    <div className="nx">
      <HomeHtmlClass />
      <HomeMotion />
      <Hero />
      <Samstag />
      <Beweis />
      <Leistungen />
      <Assistent />
      <Preise />
      <Zusagen />
      <Projekte />
      <Person />
      <Schluss />
    </div>
  );
}
