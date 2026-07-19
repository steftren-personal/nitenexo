"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/components/motion/gsap";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Button } from "@/components/ui/Button";

/**
 * Contact form panel — client-side only (a demo: no data is sent or stored).
 * Requires DSGVO consent before "sending". Fields stagger in on mount and the
 * success state crossfades.
 */
export function ContactForm() {
  const root = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);
  const [consent, setConsent] = useState(false);
  const [tried, setTried] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion() || sent) return;
      gsap.to(".kt-field", { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power3.out" });
    },
    { scope: root, dependencies: [] }
  );

  useGSAP(
    () => {
      if (!sent || prefersReducedMotion()) return;
      gsap.from(".kt-success", { autoAlpha: 0, y: 12, duration: 0.5, ease: "power3.out" });
    },
    { scope: root, dependencies: [sent] }
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!consent) return;
    setSent(true);
  };

  const textareaStyle: React.CSSProperties = {
    background: "var(--surface-canvas-light)",
    color: "var(--color-ink-deep)",
    font: "var(--type-body-md)",
    padding: "var(--space-sm) var(--space-md)",
    borderRadius: "var(--rounded-sm)",
    border: "1px solid var(--hairline-cool)",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
  };

  return (
    <div
      ref={root}
      style={{ border: "1px solid var(--hairline-cloud)", borderRadius: "var(--rounded-xl)", padding: "var(--space-xxl)", boxShadow: "var(--shadow-2)" }}
    >
      {sent ? (
        <div className="kt-success" style={{ textAlign: "center", padding: "var(--space-xl) 0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/sticker-bot.svg" alt="" width={72} height={72} style={{ margin: "0 auto var(--space-md)" }} />
          <div style={{ font: "var(--type-heading-md)", marginBottom: "var(--space-sm)" }}>Danke — deine Anfrage ist raus.</div>
          <p style={{ font: "var(--type-body-md)", color: "var(--color-accent-violet-mid)", margin: "0 auto var(--space-lg)", maxWidth: 380 }}>
            Wir melden uns bei dir. Bald musst du deutlich weniger tippen.
          </p>
          <Button variant="primary" href="/">
            Zurück zur Startseite
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          <div className="kt-field anim-fade-up bw-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-lg)" }}>
            <Field label="Vorname">
              <Input placeholder="Maria" required />
            </Field>
            <Field label="Nachname">
              <Input placeholder="Keller" required />
            </Field>
          </div>
          <Field className="kt-field anim-fade-up" label="E-Mail">
            <Input type="email" placeholder="maria@club.at" required />
          </Field>
          <Field className="kt-field anim-fade-up" label="Betrieb">
            <Input placeholder="Club Nachtschicht, Wien" />
          </Field>
          <div className="kt-field anim-fade-up" style={{ background: "var(--surface-canvas-dark)", padding: "var(--space-lg)", borderRadius: "var(--rounded-md)" }}>
            <Field label="Welche Leistung interessiert dich?" polarity="dark">
              <Select defaultValue="Digitales Gäste-Tool">
                <option>Digitales Gäste-Tool</option>
                <option>Website-Design</option>
                <option>Digitaler Assistent</option>
                <option>Beratung &amp; Setup</option>
                <option>Noch unklar — beraten</option>
              </Select>
            </Field>
          </div>
          <Field className="kt-field anim-fade-up" label="Nachricht">
            <textarea rows={4} placeholder="Wie läuft dein Laden? Was kostet dich Zeit?" style={textareaStyle} />
          </Field>

          <label className="kt-field anim-fade-up" style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ marginTop: 3, width: 18, height: 18, accentColor: "var(--color-accent-violet-deep)", flex: "0 0 auto" }}
            />
            <span style={{ font: "var(--type-caption)", color: "var(--color-ink-deep)" }}>
              Ich habe die{" "}
              <Link href="/datenschutz" style={{ color: "var(--color-accent-violet)" }}>
                Datenschutzerklärung
              </Link>{" "}
              gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung der Anfrage zu.
            </span>
          </label>
          {tried && !consent && (
            <div style={{ font: "var(--type-caption)", color: "var(--color-accent-pink)" }}>
              Bitte stimme der Datenschutzerklärung zu, um fortzufahren.
            </div>
          )}

          <Button className="kt-field anim-fade-up" variant="primary" type="submit">
            Anfrage senden
          </Button>
          <p className="kt-field anim-fade-up" style={{ font: "var(--type-caption)", color: "var(--color-accent-violet-mid)", margin: 0 }}>
            Dies ist ein Demo-Formular — es werden keine Daten übertragen oder gespeichert.
          </p>
        </form>
      )}
    </div>
  );
}
