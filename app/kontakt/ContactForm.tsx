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
 * Contact form panel — posts to /api/contact which sends the enquiry via SMTP.
 * Requires DSGVO consent before sending. Fields stagger in on mount and the
 * success state crossfades.
 */
export function ContactForm() {
  const root = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTried(true);
    setError(null);
    if (!consent || sending) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          email: data.get("email"),
          company: data.get("company"),
          service: data.get("service"),
          message: data.get("message"),
          website: data.get("website"), // honeypot
          consent,
        }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Etwas ist schiefgelaufen. Bitte versuch es später erneut.");
      }
    } catch {
      setError("Keine Verbindung möglich. Bitte prüf dein Internet und versuch es erneut.");
    } finally {
      setSending(false);
    }
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
              <Input name="firstName" placeholder="Maria" required />
            </Field>
            <Field label="Nachname">
              <Input name="lastName" placeholder="Keller" required />
            </Field>
          </div>
          <Field className="kt-field anim-fade-up" label="E-Mail">
            <Input name="email" type="email" placeholder="maria@club.at" required />
          </Field>
          <Field className="kt-field anim-fade-up" label="Betrieb">
            <Input name="company" placeholder="Club Nachtschicht, Wien" />
          </Field>
          {/* Honeypot: invisible to humans, bots fill it and get silently dropped. */}
          <div style={{ position: "absolute", left: "-9999px", top: "auto" }} aria-hidden="true">
            <label>
              Website
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="kt-field anim-fade-up" style={{ background: "var(--surface-canvas-dark)", padding: "var(--space-lg)", borderRadius: "var(--rounded-md)" }}>
            <Field label="Welche Leistung interessiert dich?" polarity="dark">
              <Select name="service" defaultValue="Chatbot (WhatsApp)">
                <option>Chatbot (WhatsApp)</option>
                <option>Chatbot (anderer Kanal)</option>
                <option>Website-Design</option>
                <option>Digitaler Assistent</option>
                <option>Beratung &amp; Setup</option>
                <option>Noch unklar — beraten</option>
              </Select>
            </Field>
          </div>
          <Field className="kt-field anim-fade-up" label="Nachricht">
            <textarea name="message" rows={4} placeholder="Wie läuft dein Laden? Was kostet dich Zeit?" style={textareaStyle} />
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
          {error && (
            <div role="alert" style={{ font: "var(--type-caption)", color: "var(--color-accent-pink)" }}>
              {error}
            </div>
          )}

          <Button className="kt-field anim-fade-up" variant="primary" type="submit" disabled={sending}>
            {sending ? "Wird gesendet…" : "Anfrage senden"}
          </Button>
        </form>
      )}
    </div>
  );
}
