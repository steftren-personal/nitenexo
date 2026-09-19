"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/components/motion/gsap";

/**
 * Bewegungs-Regie der Startseite. Eine Instanz, ganz oben gemountet — jede
 * Sektion markiert nur noch mit Attributen, was passieren soll.
 *
 *   [data-nx-rise]          Wort-Maske: jedes Wort faehrt aus seiner eigenen
 *                           Blende hoch (Mechanik aus »Text Reveal (Mask)«,
 *                           21st.dev/soralabs — hier auf GSAP portiert, damit
 *                           die Startseite ohne framer-motion auskommt).
 *   [data-nx-after=".sel"]  Alles darin bewegt sich erst, wenn .sel durch ist.
 *                           Ohne das laufen die Reveals hinter dem Film ab und
 *                           stehen fertig da, sobald er weggeblendet hat.
 *   [data-nx-reveal]        clip-path-Reveal von unten, Stagger 0.05, expo.out
 *   [data-nx-stagger]       Container: seine [data-nx-reveal]-Kinder laufen als Gruppe
 *   [data-count="41"]       zaehlt hoch, sobald sichtbar (tabular, kein Layout-Sprung)
 *   [data-tilt]             Zeiger-Neigung kommt aus CinematicLayer (pointer: fine).
 *                           HIER: das Touch-Aequivalent — auf groben Zeigern neigt
 *                           sich dasselbe Element beim Scroll-Eintritt, damit die
 *                           Interaktion am Handy nicht ersatzlos wegfaellt.
 *
 * Regel aus DESIGN.md: Text bewegt sich nie, waehrend er gelesen werden soll.
 * Deshalb faehrt der Reveal nur einmal, kurz, und wird danach abgeraeumt.
 */
export function HomeMotion() {
  useEffect(() => {
    const reduced = prefersReducedMotion();

    // Reduced Motion ist ein gestalteter Pfad: alles sofort im Endzustand.
    if (reduced) {
      document.querySelectorAll<HTMLElement>("[data-nx-reveal]").forEach((el) => {
        el.style.clipPath = "none";
        el.style.opacity = "1";
      });
      document.querySelectorAll<HTMLElement>("[data-nx-rise]").forEach((el) => {
        el.style.opacity = "1";
      });
      document.querySelectorAll<HTMLElement>("[data-nx-run]").forEach((el) => el.classList.add("nx-run"));
      document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        el.textContent = el.dataset.count ?? el.textContent;
      });
      return;
    }

    /**
     * Woran haengt die Bewegung?
     *
     * Die Sektion hinter dem Film liegt bereits fertig unter ihm, waehrend er
     * darueber wegblendet. Ein Trigger auf die Sektion selbst feuert deshalb,
     * solange sie noch verdeckt ist — die Bewegung ist vorbei, bevor man sie
     * sehen kann, und der Text steht einfach da. `data-nx-after` haengt sie
     * stattdessen ans Ende des Films.
     */
    const startFor = (el: HTMLElement) => {
      const host = el.closest<HTMLElement>("[data-nx-after]");
      const sel = host?.dataset.nxAfter;
      const gate = sel ? document.querySelector<HTMLElement>(sel) : null;
      // 60 px frueher als das exakte Ende: Die Bewegung setzt ein, waehrend der
      // Film die letzten Prozent wegblendet, statt danach aus dem Stand.
      return gate ? { trigger: gate, start: "bottom bottom+=60" } : null;
    };

    /** Zerlegt reinen Text in Woerter, jedes in seiner eigenen Blende. */
    const splitWords = (el: HTMLElement): HTMLElement[] => {
      const text = el.textContent ?? "";
      if (el.children.length || !text.trim()) return [];
      const frag = document.createDocumentFragment();
      const inner: HTMLElement[] = [];
      for (const part of text.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          continue;
        }
        const mask = document.createElement("span");
        mask.className = "nx-rise__mask";
        const word = document.createElement("span");
        word.className = "nx-rise__w";
        word.textContent = part;
        mask.appendChild(word);
        frag.appendChild(mask);
        inner.push(word);
      }
      el.textContent = "";
      el.appendChild(frag);
      return inner;
    };

    const ctx = gsap.context(() => {
      // ── Wort-Masken ────────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-nx-rise]").forEach((el) => {
        const words = splitWords(el);
        if (!words.length) {
          el.style.opacity = "1";
          return;
        }
        el.style.opacity = "1";
        gsap.from(words, {
          yPercent: 115,
          duration: 0.85,
          ease: "expo.out",
          stagger: 0.045,
          scrollTrigger: { ...(startFor(el) ?? { trigger: el, start: "top 85%" }), once: true },
          onComplete: () => words.forEach((w) => w.style.removeProperty("will-change")),
        });
      });

      // ── Reveals ────────────────────────────────────────────────────────
      const groups = gsap.utils.toArray<HTMLElement>("[data-nx-stagger]");
      groups.forEach((group) => {
        const kids = gsap.utils.toArray<HTMLElement>("[data-nx-reveal]", group);
        if (!kids.length) return;
        gsap.to(kids, {
          clipPath: "inset(0 0 0% 0)",
          opacity: 1,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.05,
          scrollTrigger: { ...(startFor(group) ?? { trigger: group, start: "top 82%" }), once: true },
          onComplete: () => kids.forEach((k) => k.style.removeProperty("will-change")),
        });
      });

      // Einzelne Reveals ausserhalb einer Gruppe
      const singles = gsap.utils
        .toArray<HTMLElement>("[data-nx-reveal]")
        .filter((el) => !el.closest("[data-nx-stagger]"));
      singles.forEach((el) => {
        gsap.to(el, {
          clipPath: "inset(0 0 0% 0)",
          opacity: 1,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { ...(startFor(el) ?? { trigger: el, start: "top 86%" }), once: true },
          onComplete: () => el.style.removeProperty("will-change"),
        });
      });

      // ── Zaehler ────────────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count || "0");
        const state = { v: 0 };
        gsap.to(state, {
          v: target,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { ...(startFor(el) ?? { trigger: el, start: "top 88%" }), once: true },
          onUpdate: () => {
            const next = String(Math.round(state.v));
            if (el.textContent !== next) el.textContent = next;
          },
        });
      });

      // ── Lauf-Gate: Sektionen, die ihre CSS-Choreografie erst beim
      //    Eintritt starten duerfen (sonst ist sie vorbei, bevor man da ist).
      gsap.utils.toArray<HTMLElement>("[data-nx-run]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 78%",
          once: true,
          onEnter: () => el.classList.add("nx-run"),
        });
      });

      // ── Touch-Aequivalent fuer die Neigung ─────────────────────────────
      // Auf groben Zeigern gibt es keinen Cursor. Statt die Interaktion zu
      // streichen, neigt sich dieselbe Flaeche beim Eintritt ins Bild.
      if (!window.matchMedia("(pointer: fine)").matches) {
        gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((el) => {
          gsap.fromTo(
            el,
            { rotateX: 7, rotateY: -5, transformPerspective: 900 },
            {
              rotateX: 0,
              rotateY: 0,
              duration: 1.2,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }
          );
        });
      }
    });

    // Schriften veraendern Masse — erst messen, wenn sie stehen.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {});
    else refresh();

    return () => ctx.revert();
  }, []);

  return null;
}
