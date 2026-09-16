import React from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/marketing/ProjectCard";
import { PROJECTS } from "@/lib/projects";

/**
 * "Umgesetzt für" — three real reference projects as a grid (stacked on
 * mobile). Replaces the old testimonial marquee: facts instead of quotes.
 */
export function ProjectsSection() {
  return (
    <section id="projekte" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-section) var(--space-xl)" }}>
      <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto var(--space-xxl)" }} data-reveal>
        {/* Knoten für den Seiten-Faden (StoryThread), wie bei den Nachbar-Sections. */}
        <span className="thread-pulse" data-thread-pulse aria-hidden="true" style={{ display: "block", margin: "0 auto var(--space-sm)" }} />
        <Eyebrow polarity="dark">Projekte</Eyebrow>
        <h2 style={{ font: "var(--type-display-large)", fontSize: "clamp(28px, 4vw, 44px)", margin: "var(--space-md) 0 var(--space-md)" }}>Umgesetzt für</h2>
        <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: 0 }}>Echte Projekte, echte Zahlen.</p>
      </div>
      <div className="bw-projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg)", alignItems: "stretch" }}>
        {PROJECTS.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "var(--space-xxl)" }}>
        <Button variant="ghost-on-dark" href="/projekte">
          Alle Projekte ansehen
        </Button>
      </div>
    </section>
  );
}
