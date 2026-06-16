"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const KEY = "nitenexo-cookie-consent";

/**
 * Cookie consent banner — remembers the choice in localStorage. Only technically
 * necessary cookies are used; optional ones would require this opt-in.
 */
export function CookieBanner() {
  const [show, setShow] = useState(false);

  // Read stored choice after mount (avoids SSR/localStorage mismatch + flash).
  useEffect(() => {
    try {
      setShow(!localStorage.getItem(KEY));
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const decide = (val: "accepted" | "rejected") => {
    try {
      localStorage.setItem(KEY, val);
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie-Hinweis"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 16,
        transform: "translateX(-50%)",
        width: "min(680px, calc(100vw - 32px))",
        zIndex: 60,
        background: "var(--surface-night)",
        color: "var(--on-primary)",
        border: "1px solid var(--hairline-violet)",
        borderRadius: "var(--rounded-xl)",
        boxShadow: "var(--shadow-2)",
        padding: "var(--space-xl)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--space-lg)",
      }}
    >
      <div style={{ flex: "1 1 320px", minWidth: 0 }}>
        <div style={{ font: "var(--type-body-strong)", marginBottom: 4 }}>Cookies &amp; Datenschutz</div>
        <p style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)", margin: 0 }}>
          Diese Seite nutzt nur technisch notwendige Cookies. Optionale Cookies setzen wir erst nach
          deiner Zustimmung.{" "}
          <Link href="/datenschutz" style={{ color: "var(--on-primary)", textDecoration: "underline" }}>
            Mehr erfahren
          </Link>
        </p>
      </div>
      <div style={{ display: "flex", gap: "var(--space-md)", flex: "0 0 auto" }}>
        <Button variant="ghost-on-dark" onClick={() => decide("rejected")}>
          Ablehnen
        </Button>
        <Button variant="inverted" onClick={() => decide("accepted")}>
          Akzeptieren
        </Button>
      </div>
    </div>
  );
}
