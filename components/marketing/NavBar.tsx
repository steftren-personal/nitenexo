"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { NAV_ITEMS, CTA_HREF } from "@/lib/site";

/**
 * NiteNexo NavBar — sticky, polarity-aware. Blurs + shrinks once scrolled,
 * hides on scroll-down and re-appears on scroll-up, and collapses to a burger
 * menu on tablet/mobile. Active link is derived from the current route.
 */
export function NavBar({ polarity = "dark" }: { polarity?: "dark" | "light" }) {
  const pathname = usePathname();
  const dark = polarity === "dark";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  const linkColor = dark ? "var(--on-dark-muted)" : "var(--color-ink-deep)";
  const activeColor = dark ? "var(--on-primary)" : "var(--color-accent-violet)";

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled(y > 24);
      const goingDown = y > lastY.current + 4;
      const goingUp = y < lastY.current - 4;
      if (goingDown && y > 160 && !open) setHidden(true);
      else if (goingUp || y < 80) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: dark
          ? scrolled
            ? "rgba(18,12,30,0.55)"
            : "rgba(31,22,51,0.86)"
          : scrolled
            ? "rgba(255,255,255,0.62)"
            : "rgba(255,255,255,0.9)",
        backdropFilter: scrolled ? "saturate(170%) blur(20px)" : "saturate(140%) blur(10px)",
        WebkitBackdropFilter: scrolled ? "saturate(170%) blur(20px)" : "saturate(140%) blur(10px)",
        borderBottom: scrolled
          ? dark
            ? "1px solid var(--hairline-violet)"
            : "1px solid var(--hairline-cloud)"
          : "1px solid transparent",
        boxShadow: scrolled ? (dark ? "0 10px 34px rgba(0,0,0,0.38)" : "0 10px 34px rgba(31,22,51,0.12)") : "none",
        transform: hidden ? "translateY(-110%)" : "translateY(0)",
        transition:
          "transform 0.5s cubic-bezier(0.16,0.84,0.3,1), background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
        willChange: "transform",
      }}
    >
      <nav
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-xl)",
          padding: `${scrolled ? "var(--space-sm)" : "var(--space-md)"} var(--space-xl)`,
          transition: "padding 0.35s ease",
        }}
      >
        <Link href="/" aria-label="NiteNexo — Startseite" style={{ textDecoration: "none" }}>
          <Logo polarity={polarity} />
        </Link>

        <div className="bw-nav-links" style={{ display: "flex", alignItems: "center", gap: "var(--space-xl)" }}>
          {NAV_ITEMS.map((it) => {
            const active = isActive(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className="bw-navlink"
                style={{
                  font: "var(--type-body-md)",
                  color: active ? activeColor : linkColor,
                  fontWeight: active ? 600 : 500,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {it.label}
              </Link>
            );
          })}
        </div>

        <div className="bw-nav-cta" style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <Button variant={dark ? "ghost-on-dark" : "primary"} href={CTA_HREF}>
            Demo
          </Button>
          <Button variant={dark ? "inverted" : "primary"} href={CTA_HREF}>
            Projekt starten
          </Button>
        </div>

        <button
          className="bw-nav-burger"
          aria-label="Menü"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: dark ? "var(--on-primary)" : "var(--color-ink-deep)",
            padding: 8,
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div
          className="bw-nav-mobile"
          style={{
            flexDirection: "column",
            gap: "var(--space-xs)",
            padding: "var(--space-sm) var(--space-xl) var(--space-lg)",
            background: dark ? "var(--surface-canvas-dark)" : "var(--surface-canvas-light)",
            borderBottom: dark ? "1px solid var(--hairline-violet)" : "1px solid var(--hairline-cloud)",
          }}
        >
          {NAV_ITEMS.concat([{ label: "Projekt starten", href: CTA_HREF }]).map((it, i) => (
            <Link
              key={i}
              href={it.href}
              onClick={() => setOpen(false)}
              style={{
                font: "var(--type-heading-sm)",
                color: dark ? "var(--on-primary)" : "var(--color-ink-deep)",
                textDecoration: "none",
                padding: "var(--space-md) 0",
                borderBottom: dark ? "1px solid var(--hairline-violet)" : "1px solid var(--hairline-cloud)",
              }}
            >
              {it.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
