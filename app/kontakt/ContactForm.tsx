"use client";

import React, { useEffect, useRef, useState } from "react";
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
 *
 * Die Seite ist angemeldeten Besuchern vorbehalten (middleware.ts), deshalb
 * werden Name und E-Mail aus dem eigenen Konto vorbelegt — abtippen, was das
 * Konto schon weiss, ist verlorene Zeit. Die Felder bleiben aenderbar: Wer im
 * Namen eines Betriebs schreibt, hat oft eine andere Adresse als im Konto.
 */
type Konto = { fullName?: string; email?: string };

/** "Maria Keller" → ["Maria", "Keller"]; alles ab dem zweiten Wort ist Nachname. */
function teileNamen(voll: string): [string, string] {
  const teile = voll.trim().split(/\s+/).filter(Boolean);
  if (teile.length === 0) return ["", ""];
  if (teile.length === 1) return [teile[0], ""];
  return [teile[0], teile.slice(1).join(" ")];
}
export function ContactForm() {
  const root = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [tried, setTried] = useState(false);
  const [konto, setKonto] = useState<Konto | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/me")
      .then((r) => r.json())
      .then((b) => {
        if (alive && b?.loggedIn) setKonto({ fullName: b.fullName, email: b.email });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const [vorname, nachname] = teileNamen(konto?.fullName ?? "");

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
    background: "var(--surface-canvas-dark)",
    color: "var(--on-primary)",
    font: "var(--type-body-md)",
    padding: "var(--space-sm) var(--space-md)",
    borderRadius: "var(--rounded-sm)",
    border: "1px solid var(--hairline-violet)",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
  };

  return (
    <div
      ref={root}
      style={{ background: "var(--surface-night)", border: "1px solid var(--hairline-violet)", borderRadius: "var(--rounded-xl)", padding: "var(--space-xxl)", boxShadow: "var(--shadow-2)" }}
    >
      {sent ? (
        <div className="kt-success" style={{ textAlign: "center", padding: "var(--space-xl) 0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/sticker-bot.svg" alt="" width={72} height={72} style={{ margin: "0 auto var(--space-md)" }} />
          <div style={{ font: "var(--type-heading-md)", marginBottom: "var(--space-sm)" }}>Danke — deine Anfrage ist raus.</div>
          <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: "0 auto var(--space-lg)", maxWidth: 380 }}>
            Wir melden uns bei dir. Bald musst du deutlich weniger tippen.
          </p>
          <Button variant="inverted" href="/">
            Zurück zur Startseite
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          <div className="kt-field anim-fade-up bw-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-lg)" }}>
            <Field label="Vorname" polarity="dark">
              <Input
                key={"v" + vorname}
                polarity="dark"
                name="firstName"
                placeholder="Maria"
                defaultValue={vorname}
                required
              />
            </Field>
            <Field label="Nachname" polarity="dark">
              <Input
                key={"n" + nachname}
                polarity="dark"
                name="lastName"
                placeholder="Keller"
                defaultValue={nachname}
                required
              />
            </Field>
          </div>
          <Field className="kt-field anim-fade-up" label="E-Mail" polarity="dark">
            <Input
              key={"e" + (konto?.email ?? "")}
              polarity="dark"
              name="email"
              type="email"
              placeholder="maria@club.at"
              defaultValue={konto?.email ?? ""}
              required
            />
          </Field>
          <Field className="kt-field anim-fade-up" label="Betrieb" polarity="dark">
            <Input polarity="dark" name="company" placeholder="Club Nachtschicht, Wien" />
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
              <Select name="service" defaultValue="Website-Creation">
                <option>Website-Creation</option>
                <option>KI-Integration: Chatbot (WhatsApp)</option>
                <option>KI-Integration: Automatisierung</option>
                <option>Hosting &amp; Wartung</option>
                <option>Noch unklar, bitte beraten</option>
              </Select>
            </Field>
          </div>
          <Field className="kt-field anim-fade-up" label="Nachricht" polarity="dark">
            <textarea name="message" rows={4} placeholder="Wie läuft dein Laden? Was kostet dich Zeit?" className="bw-input bw-input-dark" style={textareaStyle} />
          </Field>

          <label className="kt-field anim-fade-up" style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ marginTop: 3, width: 18, height: 18, accentColor: "var(--color-accent-lime)", flex: "0 0 auto" }}
            />
            <span style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)" }}>
              Ich habe die{" "}
              <Link href="/datenschutz" style={{ color: "var(--color-accent-lime)" }}>
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

          <Button className="kt-field anim-fade-up" variant="inverted" type="submit" disabled={sending}>
            {sending ? "Wird gesendet…" : "Anfrage senden"}
          </Button>
        </form>
      )}
    </div>
  );
}
