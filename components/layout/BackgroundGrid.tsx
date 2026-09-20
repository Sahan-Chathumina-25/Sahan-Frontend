"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  pulse: number;
}

/** Subtle animated backdrop: drifting network nodes, link lines, grid + noise overlays. */
export function BackgroundGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let nodes: Node[] = [];
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seed = () => {
      const area = width * height;
      const count = Math.min(90, Math.max(28, Math.floor(area / 26000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const LINK_DIST = 140;

    const draw = (staticFrame: boolean) => {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        for (const m of nodes) {
          if (m === n) continue;
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / LINK_DIST) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const glow = 0.35 + 0.25 * Math.sin(n.pulse);
        ctx.fillStyle = `rgba(56, 189, 248, ${staticFrame ? 0.5 : glow})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
        if (!staticFrame) {
          n.pulse += 0.02;
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        }
      }

      if (!staticFrame) raf = requestAnimationFrame(() => draw(false));
    };

    resize();
    if (reduceMotion) {
      draw(true);
    } else {
      raf = requestAnimationFrame(() => draw(false));
      const onVisibility = () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else raf = requestAnimationFrame(() => draw(false));
      };
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("resize", resize);
      return () => {
        cancelAnimationFrame(raf);
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("resize", resize);
      };
    }
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [reduceMotion]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-grid opacity-100" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" />
      <div className="absolute inset-0 bg-noise opacity-[0.05]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_40%,rgba(7,9,13,0.9)_100%)]" />
    </div>
  );
}
