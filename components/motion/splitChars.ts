// Shared text choreography: split a headline into word/char spans with
// seeded jitter, driven purely by the element's --k custom property (0..1).
// Used by the ThreadFilm caption bands and the StoryBeat interstitials.

export type EntranceFx = "scatter" | "grid" | "weave" | "rise";

// Seeded PRNG so the "random" offsets are identical on every load.
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** Split once into .tf-sr (screen readers) + .tf-vis word/char spans. */
export function splitChars(el: HTMLElement, seed: number, mode: EntranceFx) {
  const text = el.textContent ?? "";
  const r = rng(seed);
  el.textContent = "";

  const sr = document.createElement("span");
  sr.className = "tf-sr";
  sr.textContent = text;
  el.appendChild(sr);

  const vis = document.createElement("span");
  vis.className = "tf-vis";
  vis.setAttribute("aria-hidden", "true");

  const words = text.split(" ");
  const total = text.length;
  let charIndex = 0;
  words.forEach((word, wi) => {
    const w = document.createElement("span");
    w.className = "tf-w";
    if (mode === "rise") {
      w.style.setProperty("--th", ((wi / Math.max(1, words.length)) * 0.5).toFixed(3));
    }
    for (const ch of word) {
      const c = document.createElement("span");
      c.className = "tf-c";
      if (mode === "scatter") {
        c.style.setProperty("--th", (r() * 0.55).toFixed(3));
        c.style.setProperty("--jx", `${((r() - 0.5) * 60).toFixed(1)}px`);
        c.style.setProperty("--jy", `${((r() - 0.5) * 46).toFixed(1)}px`);
        c.style.setProperty("--jr", `${((r() - 0.5) * 24).toFixed(1)}deg`);
      } else if (mode === "grid") {
        c.style.setProperty("--th", ((charIndex / Math.max(1, total)) * 0.42 + r() * 0.06).toFixed(3));
        c.style.setProperty("--jx", `${(26 + r() * 30).toFixed(1)}px`);
        c.style.setProperty("--jy", "0px");
        c.style.setProperty("--jr", "0deg");
      } else if (mode === "weave") {
        c.style.setProperty("--th", (r() * 0.5).toFixed(3));
        c.style.setProperty("--jx", "0px");
        c.style.setProperty("--jy", `${((charIndex % 2 === 0 ? -1 : 1) * (18 + r() * 22)).toFixed(1)}px`);
        c.style.setProperty("--jr", "0deg");
      }
      c.textContent = ch;
      w.appendChild(c);
      charIndex++;
    }
    vis.appendChild(w);
    if (wi < words.length - 1) vis.appendChild(document.createTextNode(" "));
    charIndex++; // the space
  });
  el.appendChild(vis);
}
