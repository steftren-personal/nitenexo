"use client";

import * as React from "react";

/* ── Der Korridor ────────────────────────────────────────────────
 * Zwei Schienen mit Karten fahren aus der Tiefe auf den Betrachter zu.
 * Die Perspektive allein macht, was wie zwei Animationen aussieht: Waechst
 * die Tiefe einer Karte, wird sie groesser UND ihre Position auf dem Schirm
 * wandert vom Fluchtpunkt nach aussen — die Projektion skaliert beides mit
 * demselben Faktor.
 *
 * Drei Dinge formen ihn, und jedes behebt einen bestimmten Fehler:
 *
 * 1. Die Tiefe ist als SCHEINBARE GROESSE geschrieben, geometrisch — jede
 *    Karte ist um ein festes Verhaeltnis groesser als die dahinter. Eine
 *    gleichmaessig verteilte z-Reihe laesst die nahen Karten auseinander-
 *    reissen, sobald die Projektion sie aufblaest.
 * 2. Die Schienen oeffnen hart im ersten Stueck und halten dann (`fan` > 1).
 *    Das gleicht das dort noch langsame Wachstum aus: Das Band verlaesst die
 *    Mitte flach, knickt einmal und laeuft erst dann auf der Diagonale aus.
 * 3. Kein Ende der Schleife ist je im Bild. Eine Karte stirbt jenseits des
 *    Rands, und sie wird QUER zur Achse geboren (`railBirth` ist negativ),
 *    faehrt also von der Gegenseite durch die Mitte. Das stopft den Schlund:
 *    Die Achse bleibt in jedem Moment verdeckt.
 *
 * Alle Laengen in `cqw` — Prozent der Containerbreite —, damit der Korridor
 * in jeder Groesse seine Proportionen haelt.
 *
 * Herkunft: »Image Stream Hero« von 21st.dev. Angepasst fuer NiteNexo:
 * QUERFORMAT-Karten (wir zeigen Bildschirme, keine Portraits), die Ausmasse
 * an unseren Screenshots ausgerichtet, und die Animation laeuft nur, solange
 * der Abschnitt sichtbar ist — 18 gleichzeitig bewegte Ebenen ausserhalb des
 * Bildes waeren reine Verschwendung.
 * ─────────────────────────────────────────────────────────────── */

export type CorridorPath = {
  /** Staerke der Projektion. Kleiner ist weitwinkliger und dramatischer. */
  perspective?: number;
  cardWidth?: number;
  cardHeight?: number;
  cardRadius?: number;
  /** Kartenhoehe auf dem Schirm bei der Geburt. */
  birthHeight?: number;
  /** Kartenhoehe, wenn die Karte das Bild verlaesst. */
  exitHeight?: number;
  /** Seitlicher Versatz bei der Geburt. Negativ startet quer zur Achse. */
  railBirth?: number;
  /** Seitlicher Versatz, wenn die Schienen fertig geoeffnet sind. */
  railExit?: number;
  /** Wie frueh die Oeffnung passiert. >1 oeffnet frueh und haelt. */
  fan?: number;
  turnBirth?: number;
  turnExit?: number;
  /** Stuetzstellen der Kurve. Nur erhoehen, wenn die Bewegung eckig wirkt. */
  stops?: number;
};

/**
 * Querformat statt Hochformat: Unsere Karten sind gebaute Bildschirme im
 * Verhaeltnis 16:10. Mit den Hochformat-Standardwerten wuerde der Screenshot
 * auf einen Streifen beschnitten, in dem nichts mehr zu erkennen ist.
 */
const PATH: Required<CorridorPath> = {
  perspective: 30,
  cardWidth: 27,
  cardHeight: 17,
  cardRadius: 0.5,
  birthHeight: 2.1,
  exitHeight: 42,
  railBirth: -13,
  railExit: 46,
  fan: 3.3,
  turnBirth: 6,
  turnExit: 26,
  stops: 24,
};

/** Den Pfad einmal abtasten, damit die CSS-Keyframes die echte Kurve zeichnen. */
function keyframes(dir: 1 | -1, name: string, p: Required<CorridorPath>) {
  const steps: string[] = [];
  for (let s = 0; s <= p.stops; s++) {
    const u = s / p.stops;
    // Geometrisch in der scheinbaren Groesse: aufeinanderfolgende Karten
    // behalten ein festes Groessenverhaeltnis, das Band bleibt geschlossen.
    const scale = (p.birthHeight / p.cardHeight) * Math.pow(p.exitHeight / p.birthHeight, u);
    const z = p.perspective * (1 - 1 / scale);
    const rail = p.railExit - (p.railExit - p.railBirth) * Math.pow(1 - u, p.fan);
    const turn = p.turnBirth + (p.turnExit - p.turnBirth) * u;
    steps.push(
      `${(u * 100).toFixed(2)}%{transform:translate3d(${(dir * rail).toFixed(2)}cqw,0,${z.toFixed(
        2
      )}cqw) rotateY(${(-dir * turn).toFixed(2)}deg)}`
    );
  }
  return `@keyframes ${name}{${steps.join("")}}`;
}

export type StreamImage = { src: string; alt?: string };

export type ImageStreamProps = {
  images: StreamImage[];
  /** Karten je Schiene. Mehr heisst dichter, nicht schneller. */
  cards?: number;
  /** Sekunden fuer eine volle Fahrt durch den Korridor. */
  speed?: number;
  /** Hoehe der Achse in Prozent der Hoehe. */
  axis?: number;
  path?: CorridorPath;
  children?: React.ReactNode;
  className?: string;
};

export function ImageStream({
  images,
  cards = 8,
  speed = 20,
  axis = 52,
  path,
  children,
  className = "",
}: ImageStreamProps) {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const right = `nxs-r-${id}`;
  const left = `nxs-l-${id}`;
  const card = `nxs-c-${id}`;
  const root = React.useRef<HTMLDivElement>(null);
  const [laeuft, setLaeuft] = React.useState(false);
  const [reduziert, setReduziert] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduziert(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const p = React.useMemo(() => ({ ...PATH, ...path }), [path]);

  // Achtzehn bewegte Ebenen ausserhalb des Bildes kosten Bildrate, ohne dass
  // jemand etwas davon hat. Der Korridor faehrt nur, solange er zu sehen ist.
  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setLaeuft(entries.some((e) => e.isIntersecting)), {
      rootMargin: "20% 0px",
    });
    io.observe(el);
    const onVis = () => {
      if (document.hidden) setLaeuft(false);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Nur die Keyframes ins Stylesheet. Das Anhalten MUSS inline passieren:
  // Die Karte traegt `animation` als Kurzform im style-Attribut, und die
  // setzt `animation-play-state` auf `running` zurueck — eine Regel aus dem
  // Stylesheet kaeme dagegen nie an. Genau daran lief der Korridor vorher
  // trotz `prefers-reduced-motion` weiter.
  const css = React.useMemo(
    () => `${keyframes(1, right, p)}${keyframes(-1, left, p)}`,
    [right, left, p]
  );

  // Anhalten statt abschalten: Jede Karte haengt per negativer Verzoegerung
  // schon mitten im Flug, sie friert also als fertiges Standbild ein, statt
  // auf die Achse zurueckzufallen.
  const zustand: React.CSSProperties["animationPlayState"] =
    laeuft && !reduziert ? "running" : "paused";

  return (
    <div className={`nxs${laeuft ? " is-running" : ""} ${className}`.trim()} ref={root}>
      <style>{css}</style>

      <div
        aria-hidden="true"
        className="nxs__space"
        style={{ perspective: `${p.perspective}cqw`, perspectiveOrigin: `50% ${axis}%` }}
      >
        <div className="nxs__world">
          {[right, left].map((name) =>
            Array.from({ length: cards }, (_, i) => {
              const img = images[i % Math.max(images.length, 1)];
              return (
                <div
                  key={`${name}-${i}`}
                  className={`${card} nxs__card`}
                  style={{
                    top: `${axis}%`,
                    width: `${p.cardWidth}cqw`,
                    height: `${p.cardHeight}cqw`,
                    marginLeft: `${-p.cardWidth / 2}cqw`,
                    marginTop: `${-p.cardHeight / 2}cqw`,
                    borderRadius: `${p.cardRadius}cqw`,
                    animation: `${name} ${speed}s linear infinite`,
                    // Negative Verzoegerung setzt jede Karte mitten in den
                    // Flug, der Korridor ist schon im ersten Bild voll.
                    animationDelay: `${-(i * speed) / cards}s`,
                    animationPlayState: zustand,
                  }}
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.src} alt="" loading="lazy" decoding="async" draggable={false} />
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>

      {children}
    </div>
  );
}

export default ImageStream;
