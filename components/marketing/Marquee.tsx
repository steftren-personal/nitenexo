import React from "react";

const MQ_WORDS = [
  "Reservierungen",
  "Bestellungen",
  "Gästelisten",
  "Einlass-Check",
  "FAQ",
  "Erinnerungen",
  "Bewertungen",
  "Newsletter",
];

/**
 * Infinite-scrolling word marquee (ambient, CSS-driven). The track holds two
 * identical groups so the loop is seamless.
 */
export function Marquee() {
  return (
    <div className="bw-marquee" aria-hidden="true">
      <div className="bw-marquee-track">
        {[0, 1].map((k) => (
          <span className="bw-mq-group" key={k}>
            {MQ_WORDS.map((w, i) => (
              <span className="bw-mq-item" key={i}>
                <span className="bw-mq-dot">✱</span>
                {w}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
