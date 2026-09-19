"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/**
 * Das Tor vor dem Kontakt.
 *
 * Eine Anfrage soll aus einem Konto kommen. Deshalb faengt diese Komponente
 * JEDEN Klick auf einen /kontakt-Link ab — in der Navigation, im Footer, in den
 * Buttons der Startseite — und oeffnet ein Fenster, statt die Seite zu laden.
 * Sie haengt einmal im Layout, damit kein Link vergessen werden kann; der
 * direkte Aufruf der URL ist zusaetzlich in middleware.ts abgesichert.
 *
 * Angemeldete Besucher merken nichts davon: Der Klick laeuft durch.
 */
type Mode = "anmelden" | "registrieren" | "bestaetigen";

const FOKUSSIERBAR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function KontaktGate() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("anmelden");
  const [busy, setBusy] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  // Anmeldestatus kommt vom Server, nicht aus dem Browser-Zustand.
  useEffect(() => {
    let alive = true;
    const lies = () =>
      fetch("/api/me")
        .then((r) => r.json())
        .then((b) => {
          if (alive) setLoggedIn(!!b.loggedIn);
        })
        .catch(() => {
          if (alive) setLoggedIn(false);
        });
    lies();
    const supabase = createClient();
    const { data: listener } = supabase.auth.onAuthStateChange(() => lies());
    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Klicks abfangen, bevor Next die Navigation uebernimmt (Capture-Phase).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const ziel = e.target as HTMLElement | null;
      const link = ziel?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const istKontakt =
        href === "/kontakt" || href.startsWith("/kontakt?") || href.startsWith("/kontakt#");
      if (!istKontakt) return;
      // Unbekannter Status: durchlassen. Lieber einmal die Seite laden, als
      // einen angemeldeten Besucher grundlos aufzuhalten.
      if (loggedIn !== false) return;
      e.preventDefault();
      e.stopPropagation();
      opener.current = link;
      setMode("anmelden");
      setFehler(null);
      setOpen(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [loggedIn]);

  const schliessen = useCallback(() => {
    setOpen(false);
    opener.current?.focus?.();
  }, []);

  // Escape, Fokusfalle und Scroll-Sperre — ein Fenster, das man nicht
  // verlassen kann, ist kein Fenster, sondern eine Falle.
  useEffect(() => {
    if (!open) return;
    const zuvor = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    first.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        schliessen();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const felder = panel.current.querySelectorAll<HTMLElement>(FOKUSSIERBAR);
      if (!felder.length) return;
      const erste = felder[0];
      const letzte = felder[felder.length - 1];
      if (e.shiftKey && document.activeElement === erste) {
        e.preventDefault();
        letzte.focus();
      } else if (!e.shiftKey && document.activeElement === letzte) {
        e.preventDefault();
        erste.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = zuvor;
    };
  }, [open, schliessen]);

  const absenden = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setBusy(true);
    setFehler(null);
    const supabase = createClient();

    if (mode === "anmelden") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) {
        // Keine Auskunft darueber, ob die Adresse existiert.
        setFehler("E-Mail oder Passwort stimmt nicht.");
        return;
      }
      setOpen(false);
      router.push("/kontakt");
      router.refresh();
      return;
    }

    const fullName = String(form.get("fullName") ?? "").trim();
    if (!fullName) {
      setBusy(false);
      setFehler("Bitte gib deinen Namen an.");
      return;
    }
    if (password.length < 8) {
      setBusy(false);
      setFehler("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setBusy(false);
    if (error) {
      const m = error.message.toLowerCase();
      if (m.includes("email") && m.includes("valid")) {
        setFehler("Bitte gib eine gültige E-Mail-Adresse an.");
        return;
      }
      if (m.includes("password")) {
        setFehler("Das Passwort erfüllt die Anforderungen nicht.");
        return;
      }
      // Alles andere endet wie ein Erfolg — sonst liesse sich abfragen,
      // welche Adressen ein Konto haben.
    }
    setMode("bestaetigen");
  };

  if (!open) return null;

  const anmelden = mode === "anmelden";

  return (
    <div
      className="nxg"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nxg-titel"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) schliessen();
      }}
    >
      <div className="nxg__panel" ref={panel}>
        <button
          className="nxg__x"
          type="button"
          onClick={schliessen}
          aria-label="Fenster schließen"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        {mode === "bestaetigen" ? (
          <>
            <p className="nxg__eyebrow">Fast geschafft</p>
            <h2 className="nxg__h" id="nxg-titel">
              Schau in dein Postfach.
            </h2>
            <p className="nxg__lead">
              Wir haben dir einen Bestätigungs-Link geschickt. Klick ihn an, dann bist du
              angemeldet und das Kontaktformular ist schon mit deinen Daten ausgefüllt.
            </p>
            <button className="nxg__btn" type="button" onClick={schliessen}>
              Alles klar
            </button>
          </>
        ) : (
          <>
            <p className="nxg__eyebrow">Kontakt</p>
            <h2 className="nxg__h" id="nxg-titel">
              {anmelden ? "Kurz anmelden, dann schreiben." : "Konto anlegen, dann schreiben."}
            </h2>
            <p className="nxg__lead">
              Deine Anfrage läuft über ein Konto: Du siehst deinen eigenen Verlauf, und das
              Formular füllt sich mit deinen Daten von selbst aus.
            </p>

            <div className="nxg__tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={anmelden}
                className={anmelden ? "nxg__tab is-on" : "nxg__tab"}
                onClick={() => {
                  setMode("anmelden");
                  setFehler(null);
                }}
              >
                Anmelden
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={!anmelden}
                className={!anmelden ? "nxg__tab is-on" : "nxg__tab"}
                onClick={() => {
                  setMode("registrieren");
                  setFehler(null);
                }}
              >
                Registrieren
              </button>
            </div>

            <form className="nxg__form" onSubmit={absenden}>
              {anmelden ? null : (
                <label className="nxg__field">
                  <span>Name</span>
                  <input name="fullName" autoComplete="name" required ref={first} />
                </label>
              )}
              <label className="nxg__field">
                <span>E-Mail</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  ref={anmelden ? first : undefined}
                />
              </label>
              <label className="nxg__field">
                <span>Passwort</span>
                <input
                  name="password"
                  type="password"
                  autoComplete={anmelden ? "current-password" : "new-password"}
                  required
                  minLength={anmelden ? undefined : 8}
                />
              </label>

              {fehler ? (
                <p className="nxg__fehler" role="alert">
                  {fehler}
                </p>
              ) : null}

              <button className="nxg__btn" type="submit" disabled={busy}>
                {busy ? "Einen Moment …" : anmelden ? "Anmelden und weiter" : "Konto anlegen"}
              </button>
            </form>

            <p className="nxg__fuss">
              {anmelden ? (
                <>
                  Passwort vergessen?{" "}
                  <Link href="/passwort-vergessen" onClick={schliessen}>
                    Neues setzen
                  </Link>
                </>
              ) : (
                <>
                  Lieber ohne Konto? Ruf an: <a href="tel:+436609390787">+43 660 9390787</a>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
