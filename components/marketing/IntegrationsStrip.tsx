import React from "react";

const LOGOS = [
  { src: "/assets/logos/whatsapp.svg", name: "WhatsApp" },
  { src: "/assets/logos/instagram.svg", name: "Instagram" },
  { src: "/assets/logos/telegram.svg", name: "Telegram" },
  { src: "/assets/logos/stripe.svg", name: "Stripe" },
];
const TEXT = ["Google Kalender", "Kassensysteme", "Tischplan", "Newsletter"];

/**
 * "Funktioniert mit" — an infinite logo/word marquee (logos via 21st.dev),
 * greyscale that colours on hover, pauses when hovered.
 */
export function IntegrationsStrip() {
  return (
    <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--space-xl) var(--space-section)", textAlign: "center" }}>
      <p style={{ font: "var(--type-micro-cap)", textTransform: "uppercase", letterSpacing: "var(--tracking-micro)", color: "var(--color-accent-violet-mid)", margin: "0 0 var(--space-lg)" }}>
        Funktioniert mit deinen Kanälen &amp; Tools
      </p>
      <div className="bw-marquee bw-logos" aria-label="Integrationen">
        <div className="bw-marquee-track">
          {[0, 1].map((k) => (
            <span className="bw-mq-group" key={k} aria-hidden={k === 1}>
              {LOGOS.map((l, i) => (
                <span className="bw-logo-item" key={`l${i}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.src} alt={l.name} height={30} />
                  <span>{l.name}</span>
                </span>
              ))}
              {TEXT.map((t, i) => (
                <span className="bw-logo-item bw-logo-text" key={`t${i}`}>
                  {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
