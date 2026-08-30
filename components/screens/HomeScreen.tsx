"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Sticker } from "@/components/marketing/Sticker";
import { PricingModel } from "@/components/marketing/PricingModel";
import { ArticleCard } from "@/components/marketing/ArticleCard";
import { ARTICLES } from "@/lib/werkstatt";
import { KineticHeading } from "@/components/motion/KineticHeading";
import { FlipWords } from "@/components/motion/FlipWords";
import { StatStrip } from "./StatStrip";
import { WhyAccordion } from "./WhyAccordion";
import { ServicesBento, ServicesBentoCta } from "./ServicesBento";
import { RobotPresenter } from "./RobotPresenter";
import { MascotRobot } from "./MascotRobot";
import { ThreadFilm } from "./ThreadFilm";
import { StoryBeat } from "./StoryBeat";
import { BookingBoard } from "./BookingBoard";
import { StoryThread } from "@/components/motion/StoryThread";
import { IntegrationsStrip } from "@/components/marketing/IntegrationsStrip";
import { TestimonialsMarquee } from "./TestimonialsMarquee";
import { UseCaseTabs } from "./UseCaseTabs";

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
      {/* »Der Faden« — ein durchgehender 15s-Take, frei gescrubbt; das Settle-Band ist der Hero. */}
      <ThreadFilm />

      {/* Alles darunter teilt sich eine relative Ebene mit dem Seiten-Faden. */}
      <div style={{ position: "relative" }}>
      <StoryThread />

      {/* ── Kapitel 1 · Der Morgen danach ─────────────────────── */}
      <StoryBeat
        kicker="Kapitel 1 · Der Morgen danach"
        line="So sieht eine Nacht aus, in der nichts verglüht ist."
        fx="rise"
        seed={11}
      />
      <section style={{ ...sectionStyle, paddingTop: 0 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-section)" }} data-reveal>
          <BookingBoard />
        </div>
        <StatStrip />
      </section>

      {/* ── Flip-words Statement-Band (animierte CTA-Text-Komponente) ── */}
      <div style={{ borderTop: "1px solid var(--hairline-violet)", borderBottom: "1px solid var(--hairline-violet)", background: "rgba(21,15,35,0.5)", backdropFilter: "blur(6px)" }}>
        <div className="bw-container" style={{ padding: "var(--space-xxl) var(--space-xl)", textAlign: "center" }}>
          <span className="thread-pulse" data-thread-pulse aria-hidden="true" style={{ display: "block", margin: "0 auto var(--space-md)" }} />
          <p style={{ font: "var(--type-display-large)", fontSize: "clamp(22px, 3.2vw, 38px)", margin: 0, color: "var(--on-primary)", lineHeight: 1.3 }}>
            NiteNexo baut dir <FlipWords words={["den Chatbot", "die Website", "die KI-Abläufe", "die Gästeliste", "den Newsletter"]} />.
          </p>
        </div>
      </div>

      {/* ── Kapitel 2 · Über NiteNexo ───────────────────────── */}
      <StoryBeat
        kicker="Kapitel 2 · Über NiteNexo"
        line="Der Faden kommt aus Wien."
        fx="grid"
        seed={23}
      />
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
                <span className="bw-caret" aria-hidden="true" />
              </CodeBlock>
            </Card>
            <span className="bw-float bw-float-slow bw-hide-mobile" style={{ position: "absolute", bottom: -48, right: -8 }}>
              <Sticker name="plug" size={104} tilt={12} />
            </span>
          </div>
          <div data-reveal>
            <h2 style={{ font: "var(--type-display-large)", fontSize: "clamp(30px, 4vw, 48px)", margin: "0 0 var(--space-lg)", maxWidth: 520 }}>
              Ein digitaler Mitarbeiter, der nie Pause macht.
            </h2>
            <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", margin: 0, maxWidth: 520 }}>
              NiteNexo Solutions ist eine kleine Digital-Werkstatt aus Wien. Wir bauen Chatbots,
              Websites und maßgeschneiderte Automatisierungen für Gastronomie, Bars und Clubs — für
              Betriebe mit wenig Zeit und viel Andrang über WhatsApp und Instagram. Unsere
              Spezialität ist WhatsApp, weil dort die meisten Anfragen landen.
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

      {/* ── Kapitel 3 · Use-Case-Tabs ────────────────────────── */}
      <StoryBeat
        kicker="Kapitel 3 · Für deine Art von Laden"
        line="Jeder Laden flimmert anders."
        fx="scatter"
        seed={37}
      />
      <UseCaseTabs />

      {/* ── Kapitel 4 · Leistungen: mehr als ein Chatbot ─────── */}
      <StoryBeat
        kicker="Kapitel 4 · Was wir bauen"
        line="Mehr als ein Chatbot."
        fx="grid"
        seed={41}
      />
      <section style={{ ...sectionStyle, paddingTop: 0 }}>
        <div style={centerHead} data-reveal>
          <h2 style={{ ...h2Style, fontSize: "clamp(28px, 4vw, 44px)" }}>Chatbot, Website und KI-Integration für deinen Laden.</h2>
        </div>
        <ServicesBento />
        <ServicesBentoCta />
      </section>

      {/* ── Funktioniert mit (Logo-Marquee, 21st.dev) ────────── */}
      <IntegrationsStrip />

      {/* ── Kapitel 5 · So arbeitet dein Assistent ───────────── */}
      <StoryBeat
        kicker="Kapitel 5 · So arbeitet dein Assistent"
        line="So sammelt er ein."
        fx="weave"
        seed={53}
      />
      <div>
        <RobotPresenter />
      </div>

      {/* ── Preise ──────────────────────────────────────────── */}
      <div>
        <div style={sectionStyle}>
          <div style={centerHead} data-reveal>
            <span className="thread-pulse" data-thread-pulse aria-hidden="true" style={{ display: "block", margin: "0 auto var(--space-sm)" }} />
            <Eyebrow polarity="dark">Preise</Eyebrow>
            <h2 style={{ ...h2Style, fontSize: "clamp(28px, 4vw, 44px)", marginBottom: "var(--space-md)" }}>Jeder Betrieb ist anders — der Preis auch.</h2>
            <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: 0 }}>
              Keine Pakete von der Stange. Ob Chatbot, Website oder KI-Integration: Festpreis für
              die Einrichtung, dazu eine monatliche Pauschale, die zu deinem Projekt passt.
            </p>
          </div>
          <PricingModel polarity="dark" />
          <div style={{ textAlign: "center", marginTop: "var(--space-lg)" }}>
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
            <span className="thread-pulse" data-thread-pulse aria-hidden="true" style={{ display: "inline-block", marginBottom: "var(--space-sm)" }} />
            <br aria-hidden="true" />
            <Eyebrow polarity="dark">Warum NiteNexo</Eyebrow>
            <h2 style={{ font: "var(--type-display-large)", fontSize: "clamp(28px, 4vw, 44px)", margin: "var(--space-md) 0 var(--space-xl)", maxWidth: 460 }}>
              Stark genug für Andrang. Einfach genug für dein Team.
            </h2>
            <WhyAccordion />
          </div>
          <div data-reveal style={{ minHeight: 400, display: "flex", alignItems: "center" }}>
            {/* Das Maskottchen folgt der Maus und winkt — der einzige Roboter
                außerhalb des Intro-Films (bewusst behalten). */}
            <MascotRobot autoWave />
          </div>
        </div>
      </section>

      {/* ── Testimonials (full-bleed marquee) ────────────────── */}
      <div style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}>
        <div className="bw-container" style={{ padding: "0 var(--space-xl)" }}>
          <div style={centerHead} data-reveal>
            <span className="thread-pulse" data-thread-pulse aria-hidden="true" style={{ display: "block", margin: "0 auto var(--space-sm)" }} />
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
            <span className="thread-pulse" data-thread-pulse aria-hidden="true" style={{ display: "inline-block", marginBottom: "var(--space-sm)" }} />
            <br aria-hidden="true" />
            <Eyebrow polarity="dark">Aus der Werkstatt</Eyebrow>
            <h2 style={{ ...h2Style, fontSize: "clamp(28px, 4vw, 44px)" }}>Kurz erklärt.</h2>
          </div>
        </div>
        <div className="bw-blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg)" }}>
          {ARTICLES.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "var(--space-xxl)" }}>
          <Button variant="ghost-on-dark" href="/werkstatt">
            Mehr aus der Werkstatt
          </Button>
        </div>
      </section>

      {/* ── Kapitel 6 · Großer CTA — der Faden dockt an ──────── */}
      <StoryBeat
        kicker="Kapitel 6 · Dein Zug"
        line="Der Faden endet bei dir."
        fx="rise"
        seed={67}
      />
      <div>
        <div style={{ ...sectionStyle, textAlign: "center", position: "relative", paddingTop: 0 }}>
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
            <span data-thread-end style={{ display: "inline-flex" }}>
              <Button variant="inverted" glow magnetic href="/kontakt">
                Projekt starten
              </Button>
            </span>
            <Button variant="ghost-on-dark" magnetic href="/preise">
              Preise ansehen
            </Button>
          </div>
        </div>
      </div>

      {/* Ende der Faden-Ebene */}
      </div>
    </div>
  );
}
