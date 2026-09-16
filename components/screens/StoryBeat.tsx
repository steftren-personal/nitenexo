import React from "react";

/** A content-sized chapter heading, not a scroll stage. */
export function StoryBeat({ id, kicker, line, image = false }: {
  id: string; kicker: string; line: string; image?: boolean;
}) {
  return (
    <section id={id} className={`sb${image ? " sb--image" : ""}`} aria-label={kicker}>
      {image && <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sb-image" src="/assets/hero/bar-night-1920.webp"
          srcSet="/assets/hero/bar-night-960.webp 960w, /assets/hero/bar-night-1920.webp 1920w"
          sizes="100vw" width={1920} height={1080} alt="" loading="lazy" decoding="async" />
        <div className="sb-shade" aria-hidden="true" />
      </>}
      <div className="sb-content" data-reveal>
        <span className="chapter-kicker"><span className="ck-line" aria-hidden="true" />{kicker}</span>
        <p className="sb-line">{line}</p>
      </div>
    </section>
  );
}
