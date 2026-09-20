"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface TopoNode {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly x: number;
  readonly y: number;
}

const NODES: readonly TopoNode[] = [
  { id: "core", label: "Core", detail: "You are here — networks, security, software.", x: 200, y: 130 },
  { id: "net", label: "Networking", detail: "Routing, switching, VLANs, subnetting.", x: 70, y: 60 },
  { id: "sec", label: "Security", detail: "Ethical hacking study, hardening, hygiene.", x: 330, y: 60 },
  { id: "dev", label: "Software", detail: "TypeScript, Next.js, Python automation.", x: 70, y: 205 },
  { id: "lab", label: "Home Lab", detail: "Where theory meets blinking LEDs.", x: 330, y: 205 },
];

/** Interactive hero topology: hover-reactive SVG nodes with travelling pulses. */
export function NetworkVisualization() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>("core");
  const active = NODES.find((n) => n.id === activeId) ?? NODES[0];

  const links: Array<[TopoNode, TopoNode]> = NODES.filter((n) => n.id !== "core").map((n) => {
    const core = NODES.find((c) => c.id === "core");
    return [core ?? NODES[0], n] as [TopoNode, TopoNode];
  });

  return (
    <figure
      className="relative overflow-hidden rounded-xl border border-white/10 bg-ink-900/70 p-4 backdrop-blur"
      aria-label="Interactive network diagram of my focus areas"
    >
      <svg viewBox="0 0 400 265" className="h-auto w-full" role="img" aria-hidden="false">
        <title>Focus-area network diagram</title>
        {links.map(([a, b]) => (
          <g key={`${a.id}-${b.id}`}>
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(56,189,248,0.25)"
              strokeWidth={1.5}
            />
            {!reduceMotion && (
              <circle r={3} fill="#38bdf8" opacity={0.9}>
                <animateMotion dur="3s" repeatCount="indefinite" path={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} />
              </circle>
            )}
          </g>
        ))}
        {NODES.map((n) => {
          const isActive = n.id === activeId;
          return (
            <g
              key={n.id}
              data-hover
              onMouseEnter={() => setActiveId(n.id)}
              onFocus={() => setActiveId(n.id)}
              tabIndex={0}
              role="button"
              aria-label={`${n.label}: ${n.detail}`}
              className="cursor-pointer outline-none"
            >
              {isActive && !reduceMotion && (
                <circle cx={n.x} cy={n.y} r={10} fill="none" stroke="#38bdf8" strokeWidth={1} opacity={0.6}>
                  <animate attributeName="r" values="10;22" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={n.x}
                cy={n.y}
                r={n.id === "core" ? 9 : 7}
                fill={isActive ? "#38bdf8" : "#10141b"}
                stroke="#38bdf8"
                strokeWidth={1.5}
              />
              <text
                x={n.x}
                y={n.y + (n.y < 130 ? -16 : 24)}
                textAnchor="middle"
                fill={isActive ? "#f4f2ec" : "#cfccc2"}
                fontSize={11}
                fontFamily="monospace"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 min-h-[2.5rem] text-center text-sm text-paper-dim" aria-live="polite">
        {active && (
          <motion.span key={active.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="text-primary">{active.label}</span> — {active.detail}
          </motion.span>
        )}
      </figcaption>
    </figure>
  );
}
