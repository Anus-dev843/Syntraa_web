"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const INTRO_KEY = "syntraa:intro-seen";

const introLines = [
  "Engineered for quiet luxury.",
  "Texture, rhythm, ritual.",
  "Your experience is loading.",
] as const;

export function IntroCurtain() {
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  const shouldPlayIntro = useMemo(() => {
    if (reduceMotion || typeof window === "undefined") return false;
    try {
      return window.sessionStorage.getItem(INTRO_KEY) !== "1";
    } catch {
      return true;
    }
  }, [reduceMotion]);

  useEffect(() => {
    if (!shouldPlayIntro) return;
    const activateTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, 0);

    const timer = window.setTimeout(() => {
      setIsVisible(false);
      try {
        window.sessionStorage.setItem(INTRO_KEY, "1");
      } catch {
        // no-op when session storage is unavailable
      }
    }, 1700);

    return () => {
      window.clearTimeout(activateTimer);
      window.clearTimeout(timer);
    };
  }, [shouldPlayIntro]);

  useEffect(() => {
    if (!isVisible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
          aria-hidden
        >
          <div className="relative flex w-full max-w-4xl flex-col items-center justify-center gap-3 px-6 text-center">
            <motion.div
              className="absolute inset-x-16 top-1/2 h-28 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"
              initial={{ opacity: 0.18, scale: 0.88 }}
              animate={{ opacity: 0.34, scale: 1.08 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            />
            {introLines.map((line, index) => (
              <motion.p
                key={line}
                className="relative text-[0.62rem] uppercase tracking-[0.35em] text-white/70 sm:text-[0.7rem]"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + index * 0.15,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
