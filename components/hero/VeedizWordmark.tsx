"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { veedizSvg } from "./veedizSvg";

// Why: tilt/highlight constants ported from the reference effect (script.js).
const TILT_MAX = 5.5;
const TILT_FACTOR = 0.009;
const TILT_DAMPING = 0.12;
const HIGHLIGHT_FILL = "hsl(170, 80%, 50%)";
const HIGHLIGHT_FILTER = "brightness(1.4) drop-shadow(0 0 8px hsl(170, 80%, 50%))";

/** Low-poly VEEDIZ wordmark with per-facet hover glow and damped 3D tilt. */
export function VeedizWordmark() {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    if (!stage || !tilt) return;
    // Why: copy to non-nullable locals so nested rAF/handlers keep narrowing.
    const stageEl: HTMLDivElement = stage;
    const tiltEl: HTMLDivElement = tilt;

    // Keep the injected facets out of the tab order / a11y tree (decorative).
    const svg = tiltEl.querySelector("svg");
    svg?.setAttribute("aria-hidden", "true");
    svg?.setAttribute("focusable", "false");

    // Per-facet highlight via delegation — avoids re-rendering ~110 paths.
    function onOver(e: PointerEvent): void {
      if (e.pointerType === "touch") return;
      const path = e.target;
      if (!(path instanceof SVGPathElement)) return;
      path.style.transition = "none";
      path.style.fill = HIGHLIGHT_FILL;
      path.style.filter = HIGHLIGHT_FILTER;
    }

    function onOut(e: PointerEvent): void {
      const path = e.target;
      if (!(path instanceof SVGPathElement)) return;
      // Clear inline styles so the delayed CSS transition eases back.
      path.style.transition = "";
      path.style.fill = "";
      path.style.filter = "";
    }

    tiltEl.addEventListener("pointerover", onOver);
    tiltEl.addEventListener("pointerout", onOut);

    // Damped 3D tilt state; a frame runs only while settling toward target.
    let frame = 0;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const clampTilt = (v: number): number => Math.max(-TILT_MAX, Math.min(TILT_MAX, v));

    function schedule(): void {
      if (!frame) frame = requestAnimationFrame(render);
    }

    function render(): void {
      frame = 0;
      current.x += (target.x - current.x) * TILT_DAMPING;
      current.y += (target.y - current.y) * TILT_DAMPING;
      // Note: target.x drives rotateY and target.y drives rotateX (reference mapping).
      tiltEl.style.transform = `rotateX(${current.y.toFixed(3)}deg) rotateY(${current.x.toFixed(3)}deg)`;
      if (Math.abs(target.x - current.x) > 0.01 || Math.abs(target.y - current.y) > 0.01) {
        schedule();
      }
    }

    function onMove(e: PointerEvent): void {
      if (e.pointerType === "touch") return;
      const rect = stageEl.getBoundingClientRect();
      target.x = clampTilt((e.clientX - (rect.left + rect.width / 2)) * TILT_FACTOR);
      target.y = clampTilt(-(e.clientY - (rect.top + rect.height / 2)) * TILT_FACTOR);
      schedule();
    }

    function onLeave(): void {
      target.x = 0;
      target.y = 0;
      schedule();
    }

    // Tilt is motion; skip it entirely when reduced motion is preferred.
    if (!reduceMotion) {
      stageEl.addEventListener("pointermove", onMove);
      stageEl.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      frame = 0;
      tiltEl.style.transform = "";
      tiltEl.removeEventListener("pointerover", onOver);
      tiltEl.removeEventListener("pointerout", onOut);
      stageEl.removeEventListener("pointermove", onMove);
      stageEl.removeEventListener("pointerleave", onLeave);
    };
  }, [reduceMotion]);

  return (
    <>
      <div
        ref={stageRef}
        role="img"
        aria-label="VEEDIZ"
        className="veediz-stage mx-auto w-full max-w-4xl"
      >
        <div
          ref={tiltRef}
          className="veediz-tilt"
          dangerouslySetInnerHTML={{ __html: veedizSvg }}
        />
      </div>
      <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-paper-dim/60">
        Hover a facet · move to tilt
      </p>
    </>
  );
}
