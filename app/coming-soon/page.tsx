"use client";

import { BackgroundGradientAnimation } from "@/components/ui/BackgroundGradientAnimation";
import { Logo } from "@/components/marketing/Logo";
import { useEffect, useState } from "react";

export default function ComingSoonPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}
      >
        <BackgroundGradientAnimation interactive={false} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(15,11,26,0.55)",
            pointerEvents: "none",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(32px, 8vw, 80px) clamp(24px, 6vw, 80px)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <Logo polarity="dark" />
        </div>

        <div
          style={{
            width: "1px",
            height: "clamp(40px, 8vh, 72px)",
            background:
              "linear-gradient(to bottom, transparent, var(--hairline-violet), transparent)",
            margin: "clamp(24px, 5vh, 48px) auto",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.7s ease 0.15s",
          }}
        />

        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontWeight: 600,
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-accent-lime)",
            margin: "0 0 clamp(16px, 3vh, 28px)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
          }}
        >
          Wir bauen gerade
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(42px, 8vw, 96px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--on-primary)",
            margin: "0 0 clamp(20px, 3vh, 32px)",
            maxWidth: "780px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.75s ease 0.3s, transform 0.75s ease 0.3s",
          }}
        >
          Etwas{" "}
          <span style={{ color: "var(--color-accent-lime)" }}>Neues</span>{" "}
          kommt bald.
        </h1>

        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontWeight: 400,
            fontSize: "clamp(16px, 2vw, 19px)",
            lineHeight: 1.75,
            color: "var(--on-dark-muted)",
            maxWidth: "520px",
            margin: "0 0 clamp(32px, 6vh, 56px)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.75s ease 0.4s, transform 0.75s ease 0.4s",
          }}
        >
          NiteNexo Solutions baut WhatsApp-Chatbots, Websites und digitale
          Assistenten für Gastronomie, Bars und Clubs.
        </p>

        <p
          style={{
            position: "absolute",
            bottom: "clamp(24px, 4vh, 40px)",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-ui)",
            fontSize: "13px",
            color: "var(--on-dark-faint)",
            whiteSpace: "nowrap",
            opacity: mounted ? 1 : 0,
            transition: "opacity 1s ease 0.7s",
          }}
        >
          © {new Date().getFullYear()} NiteNexo Solutions · Wien
          {" · "}
          <a href="/impressum" style={{ color: "var(--on-dark-muted)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Impressum
          </a>
          {" · "}
          <a href="/datenschutz" style={{ color: "var(--on-dark-muted)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Datenschutz
          </a>
        </p>
      </div>
    </>
  );
}
