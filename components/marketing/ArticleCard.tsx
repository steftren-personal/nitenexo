import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Article } from "@/lib/werkstatt";

/**
 * Teaser card for a Werkstatt article — used on the homepage and on the
 * /werkstatt overview, so both always show the same thing. The whole card is
 * the link; the header image is a still from the intro film.
 */
export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/werkstatt/${article.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <Card reveal tilt polarity="dark" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ height: 170, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: "var(--space-lg)" }}>
          {/* Stills aus dem Intro-Film — die ganze Seite spielt in derselben Nacht. */}
          <span className="bw-blog-media" style={{ position: "absolute", inset: 0, background: `url(${article.img}) center / cover no-repeat` }} />
          <span className="bw-blog-media" style={{ position: "absolute", inset: 0, background: article.hue }} />
          <span style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(10,7,18,0.55), transparent 55%)" }} />
          <Badge variant="violet-tag" style={{ position: "relative" }}>
            {article.tag}
          </Badge>
        </div>
        <div style={{ padding: "var(--space-xl)", display: "flex", flexDirection: "column", gap: "var(--space-sm)", flex: 1 }}>
          <h3 style={{ font: "var(--type-heading-md)", margin: 0 }}>{article.title}</h3>
          <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: 0, flex: 1 }}>{article.excerpt}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "var(--space-sm)", paddingTop: "var(--space-md)", borderTop: "1px solid var(--hairline-violet)" }}>
            <span style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)" }}>{article.read} Lesezeit</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "var(--type-button-cap-light)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--color-accent-lime)" }}>
              Lesen <span className="bw-blog-arrow" aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
