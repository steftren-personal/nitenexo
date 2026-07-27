"use client";

import React, { useEffect, useRef, useState } from "react";

type Row = { who: "gast" | "bot"; text: string; t: string };

const CHAT_ROWS: Row[] = [
  { who: "gast", text: "Habt ihr morgen 20 Uhr noch einen Tisch für 4?", t: "23:39" },
  { who: "bot", text: "Klar! Tisch für 4 um 20:00 ist frei. Soll ich reservieren?", t: "23:39" },
  { who: "gast", text: "Ja bitte, auf Stefan.", t: "23:40" },
  { who: "bot", text: "Erledigt. Bestätigung kommt sofort aufs Handy. Bis morgen!", t: "23:40" },
];

function Bubble({ r }: { r: Row }) {
  const bot = r.who === "bot";
  return (
    <div className="bw-msg" style={{ display: "flex", justifyContent: bot ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "82%",
          padding: "var(--space-sm) var(--space-md)",
          borderRadius: bot ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
          font: "var(--type-caption)",
          lineHeight: 1.5,
          background: bot ? "var(--on-primary)" : "var(--color-accent-violet-deep)",
          color: bot ? "var(--color-ink-deep)" : "var(--on-primary)",
          display: "flex",
          alignItems: "flex-end",
          gap: "var(--space-sm)",
        }}
      >
        <span>{r.text}</span>
        <span style={{ font: "var(--type-code)", fontSize: 10, opacity: 0.55, whiteSpace: "nowrap", transform: "translateY(1px)" }}>
          {r.t}
        </span>
      </div>
    </div>
  );
}

function TypingBubble({ bot }: { bot: boolean }) {
  return (
    <div className="bw-msg" style={{ display: "flex", justifyContent: bot ? "flex-end" : "flex-start" }}>
      <div
        className="bw-typing"
        style={{
          padding: "10px var(--space-md)",
          borderRadius: bot ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
          background: bot ? "var(--on-primary)" : "var(--color-accent-violet-deep)",
          display: "inline-flex",
          gap: 4,
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: bot ? "var(--color-accent-violet-mid)" : "var(--on-dark-muted)",
              display: "inline-block",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Animated chat mockup. Messages play in sequence (with typing indicators)
 * the first time the card scrolls into view. Micro-motion is CSS-driven.
 */
export function ChatPreview() {
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timerStore = timers.current;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(CHAT_ROWS.length);
      return;
    }

    const run = () => {
      let i = 0;
      const step = () => {
        if (i >= CHAT_ROWS.length) {
          setTyping(false);
          return;
        }
        setTyping(true);
        const thinkMs = CHAT_ROWS[i].who === "bot" ? 980 : 620;
        timerStore.push(
          setTimeout(() => {
            setTyping(false);
            setShown(i + 1);
            i += 1;
            timerStore.push(setTimeout(step, 560));
          }, thinkMs)
        );
      };
      timerStore.push(setTimeout(step, 500));
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timerStore.forEach(clearTimeout);
    };
  }, []);

  const nextWho = shown < CHAT_ROWS.length ? CHAT_ROWS[shown].who : "bot";

  return (
    <div
      ref={ref}
      style={{
        background: "rgba(21,15,35,0.72)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid var(--hairline-violet)",
        borderRadius: "var(--rounded-xxl)",
        padding: "var(--space-lg)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-md)",
        width: "100%",
        maxWidth: 380,
        minHeight: 360,
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-md)",
          paddingBottom: "var(--space-md)",
          borderBottom: "1px solid var(--hairline-violet)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/sticker-bot.svg" alt="" width={38} height={38} />
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ font: "var(--type-body-strong)", color: "var(--on-primary)" }}>NiteNexo-Assistent</div>
          <div style={{ font: "var(--type-caption)", color: "var(--color-accent-pink)", display: "flex", alignItems: "center", gap: 6 }}>
            <span className="bw-pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-accent-pink)", display: "inline-block" }} />
            online · antwortet sofort
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", flex: 1 }}>
        {CHAT_ROWS.slice(0, shown).map((r, i) => (
          <Bubble key={i} r={r} />
        ))}
        {typing && <TypingBubble bot={nextWho === "bot"} />}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-sm)",
          marginTop: 2,
          padding: "var(--space-sm) var(--space-md)",
          borderRadius: "var(--rounded-full)",
          border: "1px solid var(--hairline-violet)",
        }}
      >
        <span style={{ font: "var(--type-caption)", color: "var(--on-dark-faint)", flex: 1 }}>Nachricht schreiben…</span>
        <span style={{ font: "var(--type-code)", fontSize: 13, color: "var(--color-accent-violet-mid)" }}>23:41</span>
      </div>
    </div>
  );
}
