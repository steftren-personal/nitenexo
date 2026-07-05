"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Sticker } from "@/components/marketing/Sticker";
import { PricingTiers } from "@/components/marketing/PricingTiers";
import { KineticHeading } from "@/components/motion/KineticHeading";
import { FlipWords } from "@/components/motion/FlipWords";
import { StatStrip } from "./StatStrip";
import { WhyAccordion } from "./WhyAccordion";
import { ServicesBento } from "./ServicesBento";
import { RobotPresenter } from "./RobotPresenter";
import { HeroSpline } from "./HeroSpline";
import { MascotRobot } from "./MascotRobot";
import { RobotGuide } from "./RobotGuide";
import { PinnedVideoHero } from "./PinnedVideoHero";
import { IntegrationsStrip } from "@/components/marketing/IntegrationsStrip";
import { TestimonialsMarquee } from "./TestimonialsMarquee";
import { UseCaseTabs } from "./UseCaseTabs";

const BLOG_POSTS = [
  {
    tag: "Guide",
    title: "Warum ein WhatsApp-Bot mehr Reservierungen bringt",
    excerpt: "Gäste fragen dann, wenn sie Lust haben — nicht zu Bürozeiten. Wer sofort antwortet, gewinnt den Tisch.",
    read: "5 Min",
    hue: "linear-gradient(135deg, #422082, #7a3ff0)",
  },
  {
    tag: "Praxis",
    title: "Gästeliste am Einlass: vom Klemmbrett zum Chat",
    excerpt: "Wie ein Club die komplette Gästeliste auf WhatsApp umgestellt hat — inkl. QR-Code am Einlass.",
    read: "4 Min",
    hue: "linear-gradient(135deg, #150f23, #422082)",
  },
  {
    tag: "Setup",
    title: "In Tagen live: so läuft ein Bot-Projekt ab",
    excerpt: "Von der ersten Nachricht bis zur Live-Schaltung — was wir von dir brauchen und was wir übernehmen.",
    read: "3 Min",
    hue: "linear-gradient(135deg, #5a2db0, #fa7faa)",
  },
];

const sectionStyle: React.CSSProperties = {
  maxWidth: "var(--container-max)",
  margin: "0 auto",
  padding: "var(--space-section) var(--space-xl)",
};

const centerHead: React.CSSProperties = { textAlign: "center", maxWidth: 640, margin: "0 auto var(--space-xxl)" };
const h2Style: React.CSSProperties = { font: "var(--type-display-large)", fontSize: "clamp(28px, 4vw, 44px)", margin: "var(--space-md) 0 0" };

export function HomeScreen() {
  return (
    <div style={{ color: "var(--on-primary)" }}>
      {/* Gepinnter cineastischer Video-Hero (Scroll-Scrub + Text-Kapitel). */}
      <PinnedVideoHero />

      {/* Mitreisender Roboter — fliegt rein, gleitet durch die Seite und zeigt
          abwechselnd auf die Textblöcke (nur Desktop + Bewegung erlaubt). */}
      <RobotGuide />

      {/* ── Hero — interaktiver 3D-Roboter (Spline) ──────────── */}
      <HeroSpline />

      {/* ── Stats ────────────────────────────────────────────── */}
      <div className="bw-container" style={{ padding: "0 var(--space-xl) var(--space-section)" }}>
        <StatStrip />
      </div>

      {/* ── Flip-words Statement-Band (animierte CTA-Text-Komponente) ── */}
      <div style={{ borderTop: "1px solid var(--hairline-violet)", borderBottom: "1px solid var(--hairline-violet)", background: "rgba(21,15,35,0.5)", backdropFilter: "blur(6px)" }}>
        <div className="bw-container" style={{ padding: "var(--space-xxl) var(--space-xl)", textAlign: "center" }}>
          <p style={{ font: "var(--type-display-large)", fontSize: "clamp(22px, 3.2vw, 38px)", margin: 0, color: "var(--on-primary)", lineHeight: 1.3 }}>
            Dein Assistent übernimmt <FlipWords words={["Reservierungen", "Bestellungen", "Gästelisten", "den Einlass", "die FAQ"]} />.
          </p>
        </div>
      </div>

      {/* ── Über NiteNexo ───────────────────────────────────── */}
      <section style={sectionStyle} data-guide="right">
        <div className="bw-about-grid" style={{ display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: "var(--space-section)", alignItems: "center" }}>
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }} data-reveal>
            <Card variant="spotlight-violet" style={{ width: "100%", maxWidth: 420 }}>
              <CodeBlock>
                <span style={{ color: "var(--color-accent-pink)" }}>$</span> nitenexo init <strong>--branche gastro</strong>{"\n"}
                <span style={{ color: "var(--on-dark-muted)" }}>✓ Speisekarte verknüpft</span>{"\n"}
                <span style={{ color: "var(--on-dark-muted)" }}>✓ Reservierungen aktiv</span>{"\n"}
                <span style={{ color: "var(--on-dark-muted)" }}>✓ Gästeliste verbunden</span>{"\n"}
                <span style={{ color: "var(--color-accent-violet-mid)" }}>→ live auf +43…</span>
                <span className="bw-caret" aria-hidden="true" />
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

      {/* ── Use-Case-Tabs (21st.dev, animiert) ───────────────── */}
      <UseCaseTabs />

      {/* ── Leistungen-Grid ─────────────────────────────────── */}
      <section style={{ ...sectionStyle, paddingTop: 0 }} data-guide="left">
        <div style={centerHead} data-reveal>
          <Eyebrow polarity="dark">Leistungen</Eyebrow>
          <h2 style={{ ...h2Style, fontSize: "clamp(28px, 4vw, 44px)" }}>Was wir für deinen Laden bauen.</h2>
        </div>
        <ServicesBento />
      </section>

      {/* ── Funktioniert mit (Logo-Marquee, 21st.dev) ────────── */}
      <IntegrationsStrip />

      {/* ── Roboter-Presenter (Vordergrund, zeigt Schritte) ──── */}
      <div data-guide="right">
        <RobotPresenter />
      </div>

      {/* ── Preise ──────────────────────────────────────────── */}
      <div data-guide="left">
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

      {/* ── Warum NiteNexo (SVG-Maskottchen → Reise-Roboter blendet aus) ── */}
      <section style={sectionStyle} data-guide="hide">
        <div className="bw-why-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-section)", alignItems: "center" }}>
          <div data-reveal>
            <Eyebrow polarity="dark">Warum NiteNexo</Eyebrow>
            <h2 style={{ font: "var(--type-display-large)", fontSize: "clamp(28px, 4vw, 44px)", margin: "var(--space-md) 0 var(--space-xl)", maxWidth: 460 }}>
              Stark genug für Andrang. Einfach genug für dein Team.
            </h2>
            <WhyAccordion />
          </div>
          <div data-reveal style={{ minHeight: 400, display: "flex", alignItems: "center" }}>
            <MascotRobot autoWave />
          </div>
        </div>
      </section>

      {/* ── Testimonials (full-bleed marquee) ────────────────── */}
      <div style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }} data-guide="right">
        <div className="bw-container" style={{ padding: "0 var(--space-xl)" }}>
          <div style={centerHead} data-reveal>
            <Eyebrow polarity="dark">Stimmen aus dem Betrieb</Eyebrow>
            <h2 style={{ ...h2Style, fontSize: "clamp(28px, 4vw, 44px)" }}>Was Betreiber:innen sagen.</h2>
          </div>
        </div>
        <TestimonialsMarquee />
        <div className="bw-container" style={{ padding: "var(--space-xl) var(--space-xl) 0" }}>
          <p style={{ textAlign: "center", font: "var(--type-caption)", color: "var(--on-dark-faint)", margin: 0 }}>
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
          </div>
        </div>
        <div className="bw-blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg)" }}>
          {BLOG_POSTS.map((p, i) => (
            <Card key={i} reveal tilt polarity="dark" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: 170, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: "var(--space-lg)" }}>
                <span className="bw-blog-media" style={{ position: "absolute", inset: 0, background: p.hue }} />
                <span className="bw-blog-media" style={{ position: "absolute", inset: 0, background: "url(/assets/starfield.png)", backgroundSize: "cover", opacity: 0.45 }} />
                <Badge variant="violet-tag" style={{ position: "relative" }}>
                  {p.tag}
                </Badge>
              </div>
              <div style={{ padding: "var(--space-xl)", display: "flex", flexDirection: "column", gap: "var(--space-sm)", flex: 1 }}>
                <h3 style={{ font: "var(--type-heading-md)", margin: 0 }}>{p.title}</h3>
                <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: 0, flex: 1 }}>{p.excerpt}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "var(--space-sm)", paddingTop: "var(--space-md)", borderTop: "1px solid var(--hairline-violet)" }}>
                  <span style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)" }}>{p.read} Lesezeit</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "var(--type-button-cap-light)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--color-accent-lime)" }}>
                    Lesen <span className="bw-blog-arrow" aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "var(--space-xxl)" }}>
          <Button variant="ghost-on-dark" href="/kontakt">
            Mehr aus der Werkstatt
          </Button>
        </div>
      </section>

      {/* ── Großer CTA ──────────────────────────────────────── */}
      <div data-guide="left">
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
