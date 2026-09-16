import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_LABEL, type Project } from "@/lib/projects";

const chipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: "var(--rounded-full)",
  background: "rgba(194, 239, 78, 0.08)",
  border: "1px solid rgba(194, 239, 78, 0.28)",
  color: "var(--color-accent-lime)",
  font: "var(--type-caption)",
  fontSize: 12,
  whiteSpace: "nowrap",
};

/** Round client avatar; the NiteNexo entry uses the robot mark instead of a photo. */
export function ProjectAvatar({ project, size = 56 }: { project: Project; size?: number }) {
  const src = project.avatar === "mascot" ? "/assets/sticker-bot.svg" : project.avatar;
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flex: "0 0 auto",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-accent-violet-deep)",
        border: "1px solid var(--hairline-violet)",
      }}
    >
      {/* Local files only, fixed size; next/image would add nothing here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={size} height={size} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </span>
  );
}

/** Small outbound/inbound link with the arrow used across the site. */
export function ProjectLink({ project }: { project: Project }) {
  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    font: "var(--type-button-cap-light)",
    letterSpacing: "var(--tracking-caps)",
    textTransform: "uppercase",
    color: "var(--color-accent-lime)",
    textDecoration: "none",
  };
  const inner = (
    <>
      {project.link.label} <span className="bw-blog-arrow" aria-hidden="true">→</span>
    </>
  );
  return project.link.external ? (
    <a href={project.link.href} target="_blank" rel="noopener noreferrer" style={style}>
      {inner}
    </a>
  ) : (
    <Link href={project.link.href} style={style}>
      {inner}
    </Link>
  );
}

/**
 * Reference card — avatar, client name, category badge, one result sentence,
 * three fact chips and the link. Used in the homepage grid and as the header
 * of each block on /projekte, so both always show the same facts.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card reveal polarity="dark" style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)", padding: "var(--space-xl)", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <ProjectAvatar project={project} />
        <div style={{ minWidth: 0 }}>
          <div style={{ font: "var(--type-heading-sm)", color: "var(--on-primary)" }}>{project.name}</div>
          <div style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)" }}>{project.kind}</div>
        </div>
      </div>
      <div>
        <Badge variant="violet-tag">{CATEGORY_LABEL[project.category]}</Badge>
      </div>
      <p style={{ font: "var(--type-body-md)", color: "var(--on-primary)", margin: 0, flex: 1, lineHeight: 1.55 }}>{project.result}</p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "var(--space-xs)" }}>
        {project.chips.map((c) => (
          <li key={c} style={chipStyle}>
            {c}
          </li>
        ))}
      </ul>
      <div style={{ paddingTop: "var(--space-md)", borderTop: "1px solid var(--hairline-violet)" }}>
        <ProjectLink project={project} />
      </div>
    </Card>
  );
}
