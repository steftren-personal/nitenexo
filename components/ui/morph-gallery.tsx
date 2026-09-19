"use client";

import * as React from "react";

/**
 * Morph-Galerie — Bilder loesen sich ineinander auf, statt zu schneiden oder
 * gleichmaessig zu ueberblenden.
 *
 * Der Uebergang ist ein einziger Shader-Durchlauf ueber zwei Texturen. Ein
 * fbm-Rauschfeld gibt jedem Bildpunkt eine eigene Schwelle, und der Fortschritt
 * wandert an diesen Schwellen vorbei — das alte Bild reisst also in treibenden
 * Fetzen weg. Die Schwelle wird zusaetzlich von der Helligkeit des NEUEN Bildes
 * verschoben: Seine hellen Stellen brennen zuerst durch. Genau dieses Detail
 * unterscheidet den Effekt von einem beliebigen Ueberblend-Filter.
 *
 * Herkunft: »Morph Gallery« von 21st.dev. Angepasst fuer NiteNexo — eigene
 * Bedienelemente in der Seitenfarbe, Start erst beim Hineinscrollen (ein
 * WebGL-Kontext, der ausserhalb des Bildes laeuft, kostet nur Strom), und
 * die Bilder liegen auf derselben Domain, weshalb der CORS-Pfad hier nie
 * greift — der Rueckfall bleibt trotzdem drin.
 *
 * Eigenstaendig: rohes WebGL, React ist der einzige Import.
 */

export type MorphItem = {
  src: string;
  alt?: string;
  /** Kurzes Etikett unter der Galerie — was man gerade sieht. */
  label?: string;
};

export type MorphGalleryProps = {
  items: MorphItem[];
  /** Muss eine feste Laenge sein. Das Canvas fuellt diese Box. */
  height?: string;
  /** Millisekunden Aufloesung. */
  duration?: number;
  /** fbm-Frequenz. Hoeher reisst in feinere Fetzen. */
  noiseScale?: number;
  /** Breite der Aufloesungskante, in Schwellen-Einheiten. 0 ist eine harte Kante. */
  edge?: number;
  /** Wie weit die Bilder waehrend der Aufloesung gegeneinander driften. */
  drift?: number;
  /** Millisekunden zwischen automatischen Wechseln. 0 schaltet ab. */
  autoplay?: number;
  className?: string;
};

/** Ueber die Enden hinaus umbrechen. */
const wrapIndex = (i: number, n: number): number => (n <= 0 ? 0 : ((i % n) + n) % n);

/** Quintisch ein/aus: Die Aufloesung startet und endet ruhig, die Mitte eilt. */
const easeInOutQuint = (t: number): number => {
  const x = Math.min(Math.max(t, 0), 1);
  return x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2;
};

const VERT = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform vec2 u_resolution;
uniform float u_fromAspect;
uniform float u_toAspect;
uniform float u_scale;
uniform float u_direction;
uniform float u_edge;
uniform float u_drift;

varying vec2 v_uv;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
   -0.577350269189626,
    0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0)
  );
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 v) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(v);
    v *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// Der Drift schiebt UVs ueber den Bildrand hinaus, und CLAMP_TO_EDGE
// beantwortet das mit langen senkrechten Schlieren aus der letzten
// Pixelreihe. Spiegeln laesst dort echtes Bild stehen. Im Shader, weil
// MIRRORED_REPEAT auf Texturen ohne Zweierpotenz unzulaessig ist.
vec2 mirror(vec2 uv) {
  return 1.0 - abs(1.0 - mod(uv, 2.0));
}

vec2 coverUV(vec2 uv, float imgAspect) {
  float canvasAspect = u_resolution.x / u_resolution.y;
  vec2 scale = (canvasAspect > imgAspect)
    ? vec2(1.0, imgAspect / canvasAspect)
    : vec2(canvasAspect / imgAspect, 1.0);
  return mirror((uv - 0.5) * scale + 0.5);
}

void main() {
  // Den Verlauf an beiden Enden um eine Kantenbreite weiten, damit
  // Fortschritt 0 und 1 wirklich das eine oder andere Bild sind.
  float adjusted = u_progress * (1.0 + 2.0 * u_edge) - u_edge;

  float noise = fbm(v_uv * u_scale + vec2(0.0, u_progress * u_direction)) * 0.5 + 0.5;
  noise = smoothstep(
    0.0,
    2.0,
    length(texture2D(u_to, coverUV(v_uv, u_toAspect)).rgb) + noise
  );

  float mixFactor = 1.0 - smoothstep(adjusted - u_edge, adjusted + u_edge, noise);

  vec2 fromUV = coverUV(
    v_uv + vec2(0.0, noise * u_progress * u_drift * u_direction),
    u_fromAspect
  );
  vec2 toUV = coverUV(
    v_uv + vec2(0.0, noise * (1.0 - u_progress) * -0.5 * u_drift * u_direction),
    u_toAspect
  );

  gl_FragColor = mix(texture2D(u_from, fromUV), texture2D(u_to, toUV), mixFactor);
}
`;

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("could not create shader");
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error("shader compile failed: " + log);
  }
  return shader;
};

const link = (gl: WebGLRenderingContext, vertSrc: string, fragSrc: string) => {
  const vert = compile(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
  const program = gl.createProgram();
  if (!program) throw new Error("could not create program");
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  // Die Shader gehoeren nach dem Anhaengen dem Programm; die eigenen
  // Referenzen jetzt loslassen, sonst leckt jede Montierung.
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error("program link failed: " + log);
  }
  return program;
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("could not load " + src));
    img.src = src;
  });

export default function MorphGallery({
  items,
  height = "min(62vw, 690px)",
  duration = 1500,
  noiseScale = 3.5,
  edge = 0.15,
  drift = 0.5,
  autoplay = 0,
  className = "",
}: MorphGalleryProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = React.useState(0);
  const [failed, setFailed] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [generation, setGeneration] = React.useState(0);
  const [reduced, setReduced] = React.useState(false);
  // Die Galerie laeuft durchgehend — sie haelt NICHT an, wenn der Zeiger
  // darueber steht. Nur ein Tab im Hintergrund pausiert: Das sieht niemand,
  // und es spart Akku.
  const [paused, setPaused] = React.useState(false);
  // Ein WebGL-Kontext, der weit ausserhalb des Bildes laeuft, kostet nur
  // Strom. Die Galerie startet erst, wenn sie in Reichweite kommt.
  const [armed, setArmed] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = React.useCallback(
    (next: number) => setActive(wrapIndex(next, items.length)),
    [items.length]
  );

  // Die Zeichenschleife liest ueber Refs, damit ein neues Tempo nie den
  // GL-Kontext abreisst.
  const tuning = React.useRef({ duration, noiseScale, edge, drift, reduced });
  tuning.current = { duration, noiseScale, edge, drift, reduced };

  const request = React.useRef<{ from: number; to: number } | null>(null);
  const previous = React.useRef(active);
  React.useEffect(() => {
    if (previous.current === active) return;
    request.current = { from: previous.current, to: active };
    previous.current = active;
  }, [active]);

  const sources = items.map((i) => i.src).join("|");

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!armed || !canvas || items.length === 0) return;

    const gl =
      canvas.getContext("webgl", { alpha: false, antialias: false }) ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) {
      setFailed(true);
      return;
    }

    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    const textures: (WebGLTexture | null)[] = items.map(() => null);
    const aspects: number[] = items.map(() => 1);
    let raf = 0;
    let disposed = false;

    let from = 0;
    let to = 0;
    let progress = 1;
    let startedAt = 0;
    let direction = 1;

    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
    };
    const onRestored = () => setGeneration((g) => g + 1);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (w === 0 || h === 0 || (canvas.width === w && canvas.height === h)) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const uniforms: Record<string, WebGLUniformLocation | null> = {};

    const pick = (i: number) => textures[i] ?? textures.find((t) => t) ?? null;

    const draw = () => {
      if (disposed) return;
      const t = tuning.current;

      const pending = request.current;
      if (pending) {
        request.current = null;
        if (pending.from !== pending.to) {
          from = pending.from;
          to = pending.to;
          progress = 0;
          startedAt = performance.now();
          const n = items.length;
          direction = ((pending.to - pending.from + n) % n) * 2 <= n ? 1 : -1;
        }
      }

      if (progress < 1) {
        const span = t.reduced ? 0 : Math.max(t.duration, 1);
        const elapsed = performance.now() - startedAt;
        progress = span === 0 ? 1 : easeInOutQuint(Math.min(elapsed / span, 1));
      }

      const fromTex = pick(from);
      const toTex = pick(to);
      if (!fromTex || !toTex) return;

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fromTex);
      gl.uniform1i(uniforms.from, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, toTex);
      gl.uniform1i(uniforms.to, 1);

      gl.uniform1f(uniforms.progress, progress);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.fromAspect, aspects[from] ?? 1);
      gl.uniform1f(uniforms.toAspect, aspects[to] ?? 1);
      gl.uniform1f(uniforms.scale, t.noiseScale);
      gl.uniform1f(uniforms.direction, direction);
      gl.uniform1f(uniforms.edge, Math.max(t.edge, 0.001));
      gl.uniform1f(uniforms.drift, t.drift);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    // Steht das Bild still und ist nichts angefordert, muss auch nichts
    // gezeichnet werden. Eine ruhende Galerie kostet dann keine Bildrate.
    const frame = () => {
      if (progress < 1 || request.current) draw();
      raf = requestAnimationFrame(frame);
    };

    const start = async () => {
      try {
        program = link(gl, VERT, FRAG);
        gl.useProgram(program);

        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
          gl.STATIC_DRAW
        );
        const loc = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        for (const name of [
          "from",
          "to",
          "progress",
          "resolution",
          "fromAspect",
          "toAspect",
          "scale",
          "direction",
          "edge",
          "drift",
        ]) {
          uniforms[name] = gl.getUniformLocation(program, "u_" + name);
        }

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        let running = false;
        let refused = 0;
        await Promise.all(
          items.map((item, i) =>
            loadImage(item.src).then(
              (img) => {
                if (disposed) return;
                const tex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                // Screenshots sind keine Zweierpotenzen — Mipmaps und Repeat
                // sind damit in WebGL1 ausgeschlossen; Clamp und Linear sind
                // das einzige zulaessige Paar, das falsche zeichnet Schwarz.
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                textures[i] = tex;
                aspects[i] = img.naturalWidth / Math.max(img.naturalHeight, 1);
                if (!running) {
                  running = true;
                  resize();
                  setReady(true);
                  draw();
                  raf = requestAnimationFrame(frame);
                }
              },
              () => {
                // Eine kaputte Adresse kostet ein Bild, nicht den Effekt.
                refused += 1;
                if (refused === items.length && !disposed) setFailed(true);
              }
            )
          )
        );
      } catch {
        if (!disposed) setFailed(true);
      }
    };
    void start();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      for (const tex of textures) if (tex) gl.deleteTexture(tex);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      textures.fill(null);
    };
    // `items` bewusst NICHT in den Abhaengigkeiten: Eine im Aufruf gebaute
    // Liste hat bei jedem Rendern eine neue Identitaet und wuerde den
    // GL-Kontext samt Texturen jedes Mal neu aufbauen. Was sich wirklich
    // aendern kann, steht in `sources`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed, sources, generation, items.length]);

  React.useEffect(() => {
    if (!autoplay || !armed || reduced || paused || items.length < 2) return;
    const id = window.setInterval(() => go(active + 1), Math.max(autoplay, 900));
    return () => window.clearInterval(id);
  }, [autoplay, armed, reduced, paused, active, go, items.length]);

  React.useEffect(() => {
    const sync = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  const swipe = React.useRef<number | null>(null);
  const current = items[active];

  return (
    <div className={"nxm " + className} ref={rootRef}>
      <div
        className="nxm__stage"
        style={{ height }}
        role="group"
        aria-roledescription="Galerie"
        aria-label="Seiten, die wir gebaut haben"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(active - 1);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            go(active + 1);
          }
        }}
        onPointerDown={(e) => {
          swipe.current = e.clientX;
        }}
        onPointerUp={(e) => {
          const startX = swipe.current;
          swipe.current = null;
          if (startX === null) return;
          const dx = e.clientX - startX;
          if (Math.abs(dx) > 48) go(active + (dx < 0 ? 1 : -1));
        }}
      >
        {failed || !armed ? (
          // Dieselbe Galerie ohne Shader: gestapelte Bilder, nur Deckkraft.
          items.map((item, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.src}
              src={item.src}
              alt={item.alt ?? ""}
              className="nxm__fallback"
              style={{ opacity: i === active ? 1 : 0 }}
              aria-hidden={i !== active}
              loading="lazy"
              decoding="async"
            />
          ))
        ) : (
          <canvas
            ref={canvasRef}
            className="nxm__canvas"
            style={{ opacity: ready ? 1 : 0 }}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="nxm__bar">
        <p className="nxm__label nx-mono">{current?.label ?? current?.alt ?? ""}</p>
        <div className="nxm__dots" role="tablist" aria-label="Ansicht wählen">
          {items.map((item, i) => (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={item.label ?? item.alt ?? "Ansicht " + (i + 1)}
              className={i === active ? "nxm__dot is-on" : "nxm__dot"}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>

      <span className="nxm__sr" aria-live="polite">
        {current ? current.label ?? current.alt ?? "" : ""} — {active + 1} von {items.length}
      </span>
    </div>
  );
}
