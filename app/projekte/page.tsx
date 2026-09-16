import type { Metadata } from "next";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KeywordHighlight } from "@/components/ui/KeywordHighlight";
import { ProjectAvatar, ProjectLink } from "@/components/marketing/ProjectCard";
import { CATEGORY_LABEL, PROJECTS, type Project } from "@/lib/projects";
import { ChatMock } from "./ChatMock";
import { AgentsGraphic } from "./AgentsGraphic";

export const metadata: Metadata = {
  title: "Projekte | NiteNexo Solutions",
  description:
    "Umgesetzt für Teen Clubbing Wien, Sorry Not Sorry Event und uns selbst: Event-Website in 4 Tagen live, Gästelisten-Chatbot auf WhatsApp, fünf KI-Agenten im eigenen Betrieb. Echte Projekte, echte Zahlen.",
};

function Screenshots({ desktop, mobile, alt }: { desktop: string; mobile: string; alt: string }) {
  return (
    <div data-reveal style={{ position: "relative", paddingBottom: 40, paddingRight: 32 }}>
      {/* Local WebP captures of the live site; plain <img> keeps it free of any image service. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={desktop}
        alt={alt}
        width={1440}
        height={900}
        style={{ width: "100%", height: "auto", display: "block", borderRadius: "var(--rounded-xl)", border: "1px solid var(--hairline-violet)", boxShadow: "0 24px 60px rgba(0,0,0,0.45)" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mobile}
        alt=""
        width={390}
        height={844}
        style={{ position: "absolute", right: 0, bottom: 0, width: "26%", height: "auto", borderRadius: "var(--rounded-lg)", border: "1px solid var(--hairline-violet)", boxShadow: "0 18px 40px rgba(0,0,0,0.5)" }}
      />
    </div>
  );
}

function Visual({ project }: { project: Project }) {
  const v = project.visual;
  if (v.kind === "screenshots") return <Screenshots desktop={v.desktop} mobile={v.mobile} alt={v.alt} />;
  if (v.kind === "chat") return <ChatMock />;
  return <AgentsGraphic />;
}

export default function ProjektePage() {
  return (
    <>
      <NavBar polarity="dark" />
      <div style={{ background: "var(--surface-canvas-dark)", color: "var(--on-primary)" }}>
        {/* Header */}
        <div style={{ background: "var(--surface-canvas-dark) url(/assets/starfield.png)", backgroundSize: "cover" }}>
          <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-section) var(--space-xl)" }}>
            <Eyebrow polarity="dark">Projekte</Eyebrow>
            <h1 style={{ font: "var(--type-display-hero)", fontSize: "clamp(38px, 6vw, 72px)", lineHeight: 1.06, margin: "var(--space-md) 0 0", maxWidth: 760 }}>
              Umgesetzt für <KeywordHighlight>echte Läden</KeywordHighlight>.
            </h1>
            <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", maxWidth: 560, margin: "var(--space-lg) 0 0" }}>
              Echte Projekte, echte Zahlen. Keine Zitate, keine Sterne, nur was wir gebaut haben und was es gebracht hat.
            </p>
          </div>
        </div>

        {/* Ein Block pro Projekt */}
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-section) var(--space-xl)", display: "flex", flexDirection: "column", gap: "var(--space-section)" }}>
          {PROJECTS.map((p, i) => {
            const flip = i % 2 === 1;
            const text = (
              <div key="t" data-reveal>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
                  <ProjectAvatar project={p} size={64} />
                  <div>
                    <h2 id={p.slug} style={{ font: "var(--type-display-large)", fontSize: "clamp(24px, 3.2vw, 36px)", margin: 0 }}>
                      {p.name}
                    </h2>
                    <div style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)", marginTop: 2 }}>{p.kind}</div>
                  </div>
                </div>
                <Badge variant="violet-tag">{CATEGORY_LABEL[p.category]}</Badge>
                <p style={{ font: "var(--type-body-lg)", color: "var(--on-primary)", margin: "var(--space-lg) 0 0", maxWidth: 520 }}>{p.result}</p>
                <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: "var(--space-md) 0 0", maxWidth: 520 }}>{p.intro}</p>
                <ul style={{ listStyle: "none", margin: "var(--space-xl) 0 0", padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-sm)", maxWidth: 520 }}>
                  {p.facts.map((f) => (
                    <li key={f} style={{ display: "flex", gap: "var(--space-md)", font: "var(--type-body-md)", color: "var(--on-primary)" }}>
                      <span aria-hidden="true" style={{ color: "var(--color-accent-pink)", flexShrink: 0 }}>→</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: "var(--space-xl)" }}>
                  <ProjectLink project={p} />
                </div>
              </div>
            );
            const visual = (
              <div key="v" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Visual project={p} />
              </div>
            );
            return (
              <div key={p.slug} className="bw-leistung-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-section)", alignItems: "center" }}>
                {flip ? [visual, text] : [text, visual]}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ background: "var(--surface-night)" }}>
          <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-section) var(--space-xl)", textAlign: "center" }}>
            <h2 style={{ font: "var(--type-display-large)", fontSize: "clamp(26px, 4vw, 40px)", margin: "0 auto var(--space-md)", maxWidth: 620 }}>
              Dein Laden als nächstes Projekt?
            </h2>
            <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", margin: "0 auto var(--space-xl)", maxWidth: 480 }}>
              Erzähl uns, was bei dir jede Nacht Zeit frisst. Wir sagen dir, ob eine Website, ein Chatbot oder beides am meisten bringt.
            </p>
            <Button variant="inverted" glow href="/kontakt">
              Projekt starten
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
