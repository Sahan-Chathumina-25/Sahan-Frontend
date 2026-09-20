"use client";

import { useCallback, useEffect, useRef } from "react";

/** Traps Tab focus inside a dialog + closes on Escape. Returns a ref for the dialog element. */
export function useFocusTrap<T extends HTMLElement>(active: boolean, onClose: () => void) {
  const ref = useRef<T | null>(null);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const focusables = ref.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!active) return;
    document.addEventListener("keydown", handleKey);
    const previous = document.activeElement as HTMLElement | null;
    // Focus the dialog itself first; it has tabIndex={-1}.
    ref.current?.focus({ preventScroll: true });
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      previous?.focus({ preventScroll: true });
    };
  }, [active, handleKey]);

  return ref;
}
