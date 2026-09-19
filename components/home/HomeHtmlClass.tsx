"use client";

import { useEffect } from "react";

/** Markiert <html> fuer die Startseite (Querscroll-Sperre in globals.css). */
export function HomeHtmlClass() {
  useEffect(() => {
    document.documentElement.classList.add("nx-home");
    return () => document.documentElement.classList.remove("nx-home");
  }, []);
  return null;
}
