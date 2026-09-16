"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PricingModel } from "@/components/marketing/PricingModel";
import { ArticleCard } from "@/components/marketing/ArticleCard";
import { ARTICLES } from "@/lib/werkstatt";
import { StatStrip } from "./StatStrip";
import { WhyAccordion } from "./WhyAccordion";
import { ServicesBento, ServicesBentoCta } from "./ServicesBento";
import { RobotPresenter } from "./RobotPresenter";
import { Hero } from "./Hero";
import { StoryBeat } from "./StoryBeat";
import { BookingBoard } from "./BookingBoard";
import { StoryThread } from "@/components/motion/StoryThread";
import { HomeMotion } from "@/components/motion/HomeMotion";
import { IntegrationsStrip } from "@/components/marketing/IntegrationsStrip";
import { ProjectsSection } from "./ProjectsSection";
import { UseCaseTabs } from "./UseCaseTabs";

const sectionStyle: React.CSSProperties = {
  maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-section) var(--space-xl)",
};
const centerHead: React.CSSProperties = { textAlign: "center", maxWidth: 640, margin: "0 auto var(--space-xxl)" };
const h2Style: React.CSSProperties = { font: "var(--type-display-large)", fontSize: "clamp(28px, 4vw, 44px)", margin: "var(--space-md) 0 0" };

export function HomeScreen() {
  return (
    <div>
      <HomeMotion />
      <Hero />
      <div className="nn-story">
        <StoryThread />
        <StoryBeat id="kapitel-1" kicker="Kapitel 1 · Der Morgen danach" line="So sieht eine Nacht aus, in der nichts verglüht ist." image />
        <section id="morgen" style={{ ...sectionStyle, paddingTop: 0 }}>
          <div className="nn-booking" data-reveal><BookingBoard /></div>
          <StatStrip />
        </section>

        <div className="nn-statement">
          <p className="bw-container" data-reveal>
            NiteNexo baut dir die Website, die KI-Abläufe, den Chatbot, die Gästeliste und die Buchhaltung.
          </p>
        </div>

        <StoryBeat id="kapitel-2" kicker="Kapitel 2 · Über NiteNexo" line="Der Faden kommt aus Wien." />
        <section id="ueber" style={{ ...sectionStyle, paddingTop: 0 }}>
          <div className="bw-about-grid" style={{ display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: "var(--space-section)", alignItems: "center" }}>
            <Card variant="spotlight-violet" reveal style={{ width: "100%", maxWidth: 420 }}>
              <CodeBlock>
                <span style={{ color: "var(--color-accent-pink)" }}>$</span> nitenexo init <strong>--branche event</strong>{"\n"}
                <span style={{ color: "var(--on-dark-muted)" }}>✓ Website gebaut, Tickets verlinkt</span>{"\n"}
                <span style={{ color: "var(--on-dark-muted)" }}>✓ Gästelisten-Chatbot verbunden</span>{"\n"}
                <span style={{ color: "var(--on-dark-muted)" }}>✓ Hosting und Wartung aktiv</span>{"\n"}
                <span style={{ color: "var(--color-accent-lime)" }}>→ live in 4 Tagen</span>
              </CodeBlock>
            </Card>
            <div data-reveal>
              <h2 style={{ ...h2Style, margin: "0 0 var(--space-lg)", maxWidth: 520 }}>Websites, die verkaufen. KI, die mitarbeitet.</h2>
              <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", maxWidth: 520 }}>
                NiteNexo Solutions ist eine kleine Digital-Werkstatt aus Wien. Wir bauen Websites für
                Gastro, Events und Nachtleben, und wir bringen KI in deine Abläufe: vom Chatbot auf
                WhatsApp bis zur Buchhaltung, die sich selbst vorbereitet.
              </p>
              <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", marginTop: "var(--space-lg)", maxWidth: 520 }}>
                Kein Agentur-Sprech, keine Monatsprojekte. Du erklärst uns deinen Ablauf, wir bauen
                den Rest. In Tagen live, nicht in Monaten.
              </p>
              <div style={{ marginTop: "var(--space-xl)" }}><Button variant="inverted" href="/leistungen">Mehr erfahren</Button></div>
            </div>
          </div>
        </section>

        <StoryBeat id="kapitel-3" kicker="Kapitel 3 · Für deine Art von Laden" line="Jeder Laden flimmert anders." />
        <UseCaseTabs />
        <StoryBeat id="kapitel-4" kicker="Kapitel 4 · Was wir bauen" line="Mehr als ein Chatbot." />
        <section id="leistungen" style={{ ...sectionStyle, paddingTop: 0 }}>
          <div style={centerHead} data-reveal><h2 style={h2Style}>Website, KI-Integration und Wartung für deinen Laden.</h2></div>
          <ServicesBento /><ServicesBentoCta />
        </section>
        <IntegrationsStrip />
        <StoryBeat id="kapitel-5" kicker="Kapitel 5 · So arbeitet dein Assistent" line="So sammelt er ein." />
        <RobotPresenter />

        <section id="preise" style={sectionStyle}>
          <div style={centerHead} data-reveal>
            <Eyebrow polarity="dark">Preise</Eyebrow>
            <h2 style={{ ...h2Style, marginBottom: "var(--space-md)" }}>Jeder Betrieb ist anders. Der Preis auch.</h2>
            <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)" }}>
              Keine Pakete von der Stange. Festpreis für Website oder KI-Integration, dazu eine
              monatliche Pauschale für Hosting und Wartung.
            </p>
          </div>
          <PricingModel polarity="dark" />
          <div style={{ textAlign: "center", marginTop: "var(--space-lg)" }}><Button variant="ghost-on-dark" href="/preise">Alle Details ansehen</Button></div>
        </section>

        <section id="warum" style={sectionStyle}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div data-reveal>
              <Eyebrow polarity="dark">Warum NiteNexo</Eyebrow>
              <h2 style={{ ...h2Style, margin: "var(--space-md) 0 var(--space-xl)" }}>Stark genug für Andrang. Einfach genug für dein Team.</h2>
            </div>
            <WhyAccordion />
          </div>
        </section>
        <ProjectsSection />

        <section id="blog" style={sectionStyle}>
          <div style={{ marginBottom: "var(--space-xxl)" }} data-reveal>
            <Eyebrow polarity="dark">Aus der Werkstatt</Eyebrow><h2 style={h2Style}>Kurz erklärt.</h2>
          </div>
          <div className="bw-blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg)" }}>
            {ARTICLES.map(a => <ArticleCard key={a.slug} article={a} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: "var(--space-xxl)" }}><Button variant="ghost-on-dark" href="/werkstatt">Mehr aus der Werkstatt</Button></div>
        </section>

        <StoryBeat id="kapitel-6" kicker="Kapitel 6 · Dein Zug" line="Der Faden endet bei dir." />
        <section id="cta" style={{ ...sectionStyle, textAlign: "center", paddingTop: 0 }}>
          <div data-reveal>
            <h2 style={{ font: "var(--type-display-hero)", fontSize: "clamp(34px, 5.5vw, 64px)", lineHeight: 1.08, margin: "0 auto", maxWidth: 720 }}>
              Hast du was vor?<br />Lass uns <span className="bw-keyword">loslegen</span>.
            </h2>
            <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", margin: "var(--space-lg) auto 0", maxWidth: 480 }}>
              Erzähl uns von deinem Laden oder deinem Event. Wir melden uns innerhalb eines Werktags
              mit einem Vorschlag und einer kurzen Demo.
            </p>
            <div className="nn-cta-actions">
              <Button variant="inverted" href="/kontakt">Projekt starten</Button>
              <Button variant="ghost-on-dark" href="/preise">Preise ansehen</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
