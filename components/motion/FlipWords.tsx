"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KeywordHighlight } from "@/components/ui/KeywordHighlight";
import { prefersReducedMotion } from "@/components/motion/gsap";

/**
 * Rotating "flip words" — cycles a lime keyword chip through a list (3D flip).
 * Pauses on reduced motion (shows the first word). A call-to-action text accent.
 */
export function FlipWords({ words, interval = 2200 }: { words: string[]; interval?: number }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setI((p) => (p + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span style={{ display: "inline-block", position: "relative", perspective: 600 }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          initial={{ y: 16, opacity: 0, rotateX: -50 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={{ y: -16, opacity: 0, rotateX: 50 }}
          transition={{ duration: 0.42, ease: [0.16, 0.84, 0.44, 1] }}
          style={{ display: "inline-block", transformOrigin: "50% 100%" }}
        >
          <KeywordHighlight>{words[i]}</KeywordHighlight>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
