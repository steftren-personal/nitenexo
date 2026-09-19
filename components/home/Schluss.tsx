import React from "react";
import Link from "next/link";
import { CONTACT } from "@/lib/site";

/**
 * Der Schluss. Ein Ziel, drei Wege dorthin — und der erste ist der Kanal, um
 * den sich die ganze Seite gedreht hat.
 */
export function Schluss() {
  return (
    <section className="nx-section nx-schluss" id="kontakt">
      <div className="nx-wrap">
        <div className="nx-schluss__inner" data-nx-stagger>
          <h2 className="nx-display nx-d1 nx-schluss__h2" data-nx-rise>
          Erzähl uns von deinem Laden.
        </h2>
          <p className="nx-body nx-lead nx-schluss__lead" data-nx-reveal>
          Ein kurzes Gespräch reicht, damit wir sagen können, was es kostet und wie lange es
          dauert. Antwort innerhalb eines Werktags, von der Person, die es dann auch baut.
        </p>
          <div className="nx-schluss__cta" data-nx-reveal>
          <Link className="nx-btn nx-btn--primary" href="/kontakt" data-magnetic>
            Projekt starten
          </Link>
          <a className="nx-btn nx-btn--ghost" href={CONTACT.phoneHref} data-magnetic>
            {CONTACT.phone}
          </a>
          <a className="nx-btn nx-btn--ghost" href={`mailto:${CONTACT.email}`} data-magnetic>
            {CONTACT.email}
          </a>
          </div>
        </div>
      </div>
    </section>
  );
}
