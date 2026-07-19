"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/components/motion/gsap";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Sticker } from "@/components/marketing/Sticker";
import { Marquee } from "@/components/marketing/Marquee";
import { PricingTiers } from "@/components/marketing/PricingTiers";
import { KineticHeading } from "@/components/motion/KineticHeading";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { StatStrip } from "./StatStrip";
import { WhyAccordion } from "./WhyAccordion";
import { ChatPreview } from "./ChatPreview";

const SERVICES = [
  { tag: "WhatsApp", title: "WhatsApp-Chatbots", desc: "Reservierungen, Bestellungen, Gästelisten und FAQ — direkt im Chat, rund um die Uhr.", featured: true },
  { tag: "Web", title: "Website-Design", desc: "Schnelle, klare Seiten für deinen Betrieb: Speisekarte, Öffnungszeiten, Buchung." },
  { tag: "Bots", title: "Digitale Assistenten", desc: "Maßgeschneiderte Automatisierungen — vom Türsteher-Check bis zum Newsletter." },
  { tag: "Setup", title: "Beratung & Setup", desc: "Wir analysieren deinen Ablauf und verdrahten alles mit deiner WhatsApp-Nummer." },
  { tag: "Support", title: "Wartung & Support", desc: "Updates, Monitoring und schnelle Hilfe, wenn der Laden voll ist." },
  { tag: "Schnittstellen", title: "Integrationen", desc: "Kasse, Tischplan, Kalender und Newsletter sauber miteinander verbunden." },
];

const TESTIMONIALS = [
  { quote: "Seit dem Bot verpassen wir keine Tisch-Anfrage mehr — auch nicht um Mitternacht. Mein Team tippt deutlich weniger.", name: "Marko R.", role: "Inhaber, Trattoria" },
  { quote: "Die Gästeliste am Einlass läuft jetzt komplett über WhatsApp. Türsteher happy, Gäste happy.", name: "Lena S.", role: "Booking, Club" },
  { quote: "Schnell aufgesetzt, klar erklärt, und wenn was ist, ist Stefan sofort erreichbar.", name: "Daniel K.", role: "Barbetrieb" },
];

const BLOG_POSTS = [
  { tag: "Guide", title: "Warum ein WhatsApp-Bot mehr Reservierungen bringt", read: "5 Min", hue: "var(--color-accent-violet-deep)" },
  { tag: "Praxis", title: "Gästeliste am Einlass: vom Klemmbrett zum Chat", read: "4 Min", hue: "var(--surface-night)" },
];

const INDUSTRIES = ["Restaurants", "Bars", "Clubs", "Cafés", "Events", "Foodtrucks", "Pop-ups"];

function Stars() {
  return (
    <div style={{ display: "flex", gap: 2, color: "var(--color-accent-pink)", fontSize: 15 }} aria-hidden="true">
      {"★★★★★".split("").map((s, i) => (
        <span key={i}>{s}</span>
      ))}
    </div>
  );
}

const sectionStyle: React.CSSProperties = {
  maxWidth: "var(--container-max)",
  margin: "0 auto",
  padding: "var(--space-section) var(--space-xl)",
};

const centerHead: React.CSSProperties = { textAlign: "center", maxWidth: 640, margin: "0 auto var(--space-xxl)" };
const h2Style: React.CSSProperties = { font: "var(--type-display-large)", fontSize: "clamp(28px, 4vw, 44px)", margin: "var(--space-md) 0 0" };

export function HomeScreen() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(".hero-sub", { autoAlpha: 1, y: 0, duration: 0.5 }, 0.5)
        .to(".hero-cta", { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.25")
        .to(".hero-art", { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.55");
    },
    { scope: root }
  );

  return (
    <div ref={root} style={{ color: "var(--on-primary)" }}>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="bw-container bw-section" style={{ padding: "64px var(--space-xl) var(--space-section)", position: "relative" }}>
        <div className="bw-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "var(--space-section)", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Eyebrow polarity="dark">
              <ScrambleText text="WhatsApp-Chatbots für Gastro & Clubs" />
            </Eyebrow>
            <KineticHeading
              trigger="load"
              style={{ font: "var(--type-display-hero)", fontSize: "clamp(40px, 6.4vw, 76px)", lineHeight: 1.05, margin: "16px 0 0", maxWidth: 620 }}
              tokens={[{ w: "Digitale" }, { w: "Assistenten," }, { w: "die" }, { w: "mitarbeiten", kw: true, after: "." }]}
            />
            <p
              className="hero-sub anim-fade-up"
              style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", maxWidth: 480, margin: "var(--space-xl) 0 0", textShadow: "0 2px 22px rgba(0,0,0,0.6)" }}
            >
              Dein Gast schreibt um 23:40 „Habt ihr morgen noch einen Tisch?&quot; — der
              NiteNexo-Assistent antwortet, nimmt die Reservierung auf und trägt sie ein, bevor du
              das Handy gesehen hast.
            </p>
            <div className="hero-cta anim-fade-up" style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-xl)", flexWrap: "wrap" }}>
              <Button variant="inverted" glow magnetic href="/kontakt">
                Projekt starten
              </Button>
              <Button variant="ghost-on-dark" magnetic href="/leistungen">
                Leistungen ansehen
              </Button>
            </div>
          </div>
          <div className="hero-art anim-fade" style={{ display: "flex", justifyContent: "center" }}>
            <ChatPreview />
          </div>
        </div>

        <StatStrip />
      </div>

      {/* ── Marquee ──────────────────────────────────────────── */}
      <Marquee />

      {/* ── Über NiteNexo ───────────────────────────────────── */}
      <section style={sectionStyle}>
        <div className="bw-about-grid" style={{ display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: "var(--space-section)", alignItems: "center" }}>
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }} data-reveal>
            <Card variant="spotlight-violet" style={{ width: "100%", maxWidth: 420 }}>
              <CodeBlock>
                <span style={{ color: "var(--color-accent-pink)" }}>$</span> nitenexo init <strong>--branche gastro</strong>{"\n"}
                <span style={{ color: "var(--on-dark-muted)" }}>✓ Speisekarte verknüpft</span>{"\n"}
                <span style={{ color: "var(--on-dark-muted)" }}>✓ Reservierungen aktiv</span>{"\n"}
                <span style={{ color: "var(--on-dark-muted)" }}>✓ Gästeliste verbunden</span>{"\n"}
                <span style={{ color: "var(--color-accent-violet-mid)" }}>→ live auf +43…</span>
              </CodeBlock>
            </Card>
            <span className="bw-float bw-float-slow bw-hide-mobile" style={{ position: "absolute", bottom: -48, right: -8 }}>
              <Sticker name="plug" size={104} tilt={12} />
            </span>
          </div>
          <div data-reveal>
            <Eyebrow polarity="dark">Über NiteNexo</Eyebrow>
            <h2 style={{ font: "var(--type-display-large)", fontSize: "clamp(30px, 4vw, 48px)", margin: "var(--space-md) 0 var(--space-lg)", maxWidth: 520 }}>
              Ein digitaler Mitarbeiter, der nie Pause macht.
            </h2>
            <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", margin: 0, maxWidth: 520 }}>
              NiteNexo Solutions ist eine kleine Digital-Werkstatt aus Wien. Wir bauen
              WhatsApp-Chatbots, Websites und maßgeschneiderte Automatisierungen für Gastronomie, Bars
              und Clubs — für Betriebe mit wenig Zeit und viel Andrang über WhatsApp und Instagram.
            </p>
            <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", margin: "var(--space-lg) 0 0", maxWidth: 520 }}>
              Kein Agentur-Sprech, keine Monatsprojekte. Du erklärst uns deinen Ablauf, wir verdrahten
              den Rest.
            </p>
            <div style={{ marginTop: "var(--space-xl)" }}>
              <Button variant="inverted" href="/leistungen">
                Mehr erfahren
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Branchen-Strip ──────────────────────────────────── */}
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--space-xl) var(--space-section)", textAlign: "center" }}>
        <Eyebrow polarity="dark" style={{ marginBottom: "var(--space-lg)" }}>
          Gebaut für den Betrieb vor Ort
        </Eyebrow>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "var(--space-md)" }}>
          {INDUSTRIES.map((b) => (
            <span key={b} style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", padding: "var(--space-sm) var(--space-lg)", border: "1px solid var(--hairline-violet)", borderRadius: "var(--rounded-full)" }}>
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* ── Leistungen-Grid ─────────────────────────────────── */}
      <section style={{ ...sectionStyle, paddingTop: 0 }}>
        <div style={centerHead} data-reveal>
          <Eyebrow polarity="dark">Leistungen</Eyebrow>
          <h2 style={{ ...h2Style, fontSize: "clamp(28px, 4vw, 44px)" }}>Was wir für deinen Laden bauen.</h2>
        </div>
        <div className="bw-services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg)" }}>
          {SERVICES.map((s) => (
            <Card key={s.title} reveal tilt variant={s.featured ? "spotlight-violet" : "default"} polarity="dark" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div>
                <Badge variant="violet-tag">{s.tag}</Badge>
              </div>
              <h3 style={{ font: "var(--type-heading-md)", margin: 0 }}>{s.title}</h3>
              <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: 0, flex: 1 }}>{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Preise ──────────────────────────────────────────── */}
      <div>
        <div style={sectionStyle}>
          <div style={centerHead} data-reveal>
            <Eyebrow polarity="dark">Preise</Eyebrow>
            <h2 style={{ ...h2Style, fontSize: "clamp(28px, 4vw, 44px)", marginBottom: "var(--space-md)" }}>Faire Pakete für jede Größe.</h2>
            <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: 0 }}>
              Einmalige Einrichtung, danach monatlich. Keine versteckten Kosten, jederzeit kündbar.
            </p>
          </div>
          <PricingTiers />
          <div style={{ textAlign: "center", marginTop: "var(--space-xxl)" }}>
            <Button variant="ghost-on-dark" href="/preise">
              Alle Details ansehen
            </Button>
          </div>
        </div>
      </div>

      {/* ── Warum NiteNexo ──────────────────────────────────── */}
      <section style={sectionStyle}>
        <div className="bw-why-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-section)", alignItems: "center" }}>
          <div data-reveal>
            <Eyebrow polarity="dark">Warum NiteNexo</Eyebrow>
            <h2 style={{ font: "var(--type-display-large)", fontSize: "clamp(28px, 4vw, 44px)", margin: "var(--space-md) 0 var(--space-xl)", maxWidth: 460 }}>
              Stark genug für Andrang. Einfach genug für dein Team.
            </h2>
            <WhyAccordion />
          </div>
          <div data-reveal>
            <CodeBlock style={{ padding: "var(--space-xl)" }}>
              <span style={{ color: "var(--on-dark-muted)" }}>{"// dein Ablauf, automatisiert"}</span>{"\n"}
              <span style={{ color: "var(--color-accent-pink)" }}>on</span> nachricht(gast) {"{"}{"\n"}
              {"  "}wenn (frage == <strong>&quot;tisch frei?&quot;</strong>) {"{"}{"\n"}
              {"    "}pruefe(verfügbarkeit){"\n"}
              {"    "}antworte.<strong>sofort</strong>(){"\n"}
              {"  "}{"}"}{"\n"}
              {"}"}{"\n"}
              <span style={{ color: "var(--color-accent-violet-mid)" }}>→ läuft, während du arbeitest</span>
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────── */}
      <div>
        <div style={sectionStyle}>
          <div style={centerHead} data-reveal>
            <Eyebrow polarity="dark">Stimmen aus dem Betrieb</Eyebrow>
            <h2 style={{ ...h2Style, fontSize: "clamp(28px, 4vw, 44px)" }}>Was Betreiber:innen sagen.</h2>
          </div>
          <div className="bw-testi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg)" }}>
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} reveal tilt polarity="dark" style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
                <Stars />
                <p style={{ font: "var(--type-body-md)", color: "var(--on-primary)", margin: 0, flex: 1, lineHeight: 1.6 }}>„{t.quote}&ldquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", paddingTop: "var(--space-md)", borderTop: "1px solid var(--hairline-violet)" }}>
                  <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-accent-violet-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center", font: "var(--type-body-strong)", color: "var(--on-primary)" }}>
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <div style={{ font: "var(--type-body-strong)" }}>{t.name}</div>
                    <div style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)" }}>{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <p style={{ textAlign: "center", font: "var(--type-caption)", color: "var(--on-dark-faint)", marginTop: "var(--space-xl)" }}>
            Beispielstimmen — echte Referenzen geben wir dir gern im Gespräch.
          </p>
        </div>
      </div>

      {/* ── Blog ────────────────────────────────────────────── */}
      <section style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-lg)", marginBottom: "var(--space-xxl)" }} data-reveal>
          <div>
            <Eyebrow polarity="dark">Aus der Werkstatt</Eyebrow>
            <h2 style={{ ...h2Style, fontSize: "clamp(28px, 4vw, 44px)" }}>Kurz erklärt.</h2>
            <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: "var(--space-md) 0 0", maxWidth: 520 }}>
              Kurze Guides aus der Praxis — die ersten Artikel erscheinen bald.
            </p>
          </div>
        </div>
        <div className="bw-blog-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-lg)" }}>
          {BLOG_POSTS.map((p, i) => (
            <Card key={i} reveal polarity="dark" aria-disabled="true" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", opacity: 0.85 }}>
              <div style={{ height: 180, background: p.hue, position: "relative", display: "flex", alignItems: "flex-end", gap: "var(--space-sm)", padding: "var(--space-lg)" }}>
                <span style={{ position: "absolute", inset: 0, background: "url(/assets/starfield.png)", backgroundSize: "cover", opacity: 0.5 }} />
                <Badge variant="violet-tag" style={{ position: "relative" }}>
                  {p.tag}
                </Badge>
                <Badge variant="violet-tag" style={{ position: "relative" }}>
                  Bald verfügbar
                </Badge>
              </div>
              <div style={{ padding: "var(--space-xl)", display: "flex", flexDirection: "column", gap: "var(--space-md)", flex: 1 }}>
                <h3 style={{ font: "var(--type-heading-md)", margin: 0 }}>{p.title}</h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                  <span style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)" }}>{p.read} Lesezeit · in Arbeit</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Großer CTA ──────────────────────────────────────── */}
      <div>
        <div style={{ ...sectionStyle, textAlign: "center", position: "relative" }}>
          <span className="bw-float" style={{ display: "inline-block", marginBottom: "var(--space-lg)" }}>
            <Sticker name="bot" size={96} tilt={-8} />
          </span>
          <KineticHeading
            as="h2"
            trigger="scroll"
            style={{ font: "var(--type-display-hero)", fontSize: "clamp(34px, 5.5vw, 64px)", lineHeight: 1.08, margin: "0 auto", maxWidth: 720 }}
            tokens={[
              { w: "Hast" },
              { w: "du" },
              { w: "was" },
              { w: "vor?" },
              { w: "Lass", br: true },
              { w: "uns" },
              { w: "loslegen", kw: true, after: "." },
            ]}
          />
          <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", margin: "var(--space-lg) auto 0", maxWidth: 480 }}>
            Erzähl uns von deinem Laden. Wir melden uns innerhalb eines Werktags mit einem Vorschlag
            und einer kurzen Demo.
          </p>
          <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "center", marginTop: "var(--space-xl)", flexWrap: "wrap" }}>
            <Button variant="inverted" glow magnetic href="/kontakt">
              Projekt starten
            </Button>
            <Button variant="ghost-on-dark" magnetic href="/preise">
              Preise ansehen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
