"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/components/motion/gsap";
import { Button } from "@/components/ui/Button";

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };
const PORTRAIT = "(max-width: 720px) and (orientation: portrait)";
const ASSETS = "/assets/hero/";

/** The picture paints first; video has no source until the poster has loaded. */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const poster = useRef<HTMLImageElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [posterReady, setPosterReady] = useState(false);
  const [media, setMedia] = useState({ enabled: false, portrait: false, small: false });
  const [playing, setPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [failed, setFailed] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    if (poster.current?.complete && poster.current.naturalWidth) setPosterReady(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const portrait = window.matchMedia(PORTRAIT);
    const small = window.matchMedia("(max-width: 1024px)");
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    const update = () => {
      const next = {
        enabled: !reduced.matches && !connection?.saveData,
        portrait: portrait.matches,
        small: small.matches || /^(slow-2g|2g|3g)$/.test(connection?.effectiveType ?? ""),
      };
      setMedia(current => current.enabled === next.enabled && current.portrait === next.portrait && current.small === next.small ? current : next);
    };
    update();
    const queries = [reduced, portrait, small];
    queries.forEach(q => q.addEventListener("change", update));
    connection?.addEventListener("change", update);
    return () => {
      queries.forEach(q => q.removeEventListener("change", update));
      connection?.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    setHasFrame(false);
    setCanPlay(false);
    setFailed(false);
    setPlaying(false);
  }, [media]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".nn-hero-line", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out",
        clearProps: "opacity,transform",
      });
    }, root);
    return () => mm.revert();
  }, { scope: root });

  const play = () => {
    const element = video.current;
    if (element) void element.play().catch(() => setPlaying(false));
  };
  const selectedPoster = `${ASSETS}hero-poster${media.portrait ? "-portrait" : ""}.webp`;

  return (
    <section ref={root} className="nn-hero" id="hero" aria-labelledby="hero-title">
      <picture className="nn-hero-poster">
        <source media={PORTRAIT} srcSet={`${ASSETS}hero-poster-portrait.webp`} sizes="100vw" />
        {/* Native picture keeps art direction and the LCP request in the initial HTML. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={poster} src={`${ASSETS}hero-poster.webp`} alt="" width={1920} height={1080}
          sizes="100vw" fetchPriority="high" decoding="async" onLoad={() => setPosterReady(true)} />
      </picture>
      {posterReady && media.enabled && !failed && (
        <video ref={video} key={`${media.portrait}-${media.small}`} className={`nn-hero-video${hasFrame ? " is-playing" : ""}`}
          aria-hidden="true" tabIndex={-1} autoPlay={canPlay} muted loop playsInline preload="metadata" poster={selectedPoster}
          onCanPlay={() => { setCanPlay(true); play(); }}
          onPlaying={() => { setHasFrame(true); setPlaying(true); }}
          onPause={() => setPlaying(false)}
          onError={event => {
            // Chromium also fires `error` on <source> elements it skipped for a media mismatch.
            // Only a decode error or an exhausted source list ends the loop.
            const element = event.currentTarget;
            if (element.error || element.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) { setFailed(true); setPlaying(false); }
          }}>
          <source media={PORTRAIT} src={`${ASSETS}hero-loop-portrait.mp4`} type="video/mp4" />
          <source media="(max-width: 1024px)" src={`${ASSETS}hero-loop-540.mp4`} type="video/mp4" />
          <source src={`${ASSETS}hero-loop-${media.small ? "540" : "1080"}.mp4`} type="video/mp4" />
        </video>
      )}
      <div className="nn-hero-shade" aria-hidden="true" />
      <div className="nn-hero-content">
        <h1 id="hero-title" className="nn-hero-title">
          <span className="nn-hero-line">Websites, die <span className="nn-hero-phrase">um 23:40</span> verkaufen.</span>
          <span className="nn-hero-line nn-hero-line-ki">KI, die mitarbeitet.</span>
        </h1>
        <p className="nn-hero-tagline">Websites &amp; KI-Integration für Gastro, Events und Nachtleben</p>
        <div className="nn-hero-actions">
          <Button variant="inverted" href="/kontakt">Projekt starten</Button>
          <Button variant="ghost-on-dark" href="#projekte">Projekte ansehen</Button>
        </div>
        <ul className="nn-hero-chips" aria-label="Darauf kannst du zählen" tabIndex={0}>
          <li>Wien</li><li>DSGVO ohne Cookie-Banner</li><li>in Tagen live</li>
        </ul>
      </div>
      {posterReady && media.enabled && !failed && (
        <button className="nn-hero-pause" type="button" onClick={() => playing ? video.current?.pause() : play()}
          aria-label={playing ? "Hintergrund pausieren" : "Hintergrund abspielen"}>
          <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span> {playing ? "Pause" : "Abspielen"}
        </button>
      )}
    </section>
  );
}
