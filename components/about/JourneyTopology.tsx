"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { AppWindow, Shield, Globe, HardDrive, Router, Smartphone, SwitchCamera } from "lucide-react";

interface Hop {
  readonly id: string;
  readonly label: string;
  readonly tooltip: string;
  readonly Icon: typeof Globe;
}

const HOPS: readonly Hop[] = [
  { id: "internet", label: "Internet", tooltip: "Everything starts outside my control — assume hostile.", Icon: Globe },
  { id: "firewall", label: "Firewall", tooltip: "Filter first: deny by default, allow by exception.", Icon: Shield },
  { id: "router", label: "Router", tooltip: "Decide paths deliberately — addressing is documentation.", Icon: Router },
  { id: "switch", label: "Switch", tooltip: "Segment ruthlessly — VLANs contain blast radius.", Icon: SwitchCamera },
  { id: "servers", label: "Servers", tooltip: "Harden and patch — least privilege everywhere.", Icon: HardDrive },
  { id: "apps", label: "Apps", tooltip: "Validate at the boundary — never trust input.", Icon: AppWindow },
  { id: "users", label: "Users", tooltip: "Design for humans — secure must also be usable.", Icon: Smartphone },
];

/** "How I Think" packet journey: Internet → Firewall → Router → Switch → Servers → Apps → Users. */
export function JourneyTopology() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>("firewall");
  const active = HOPS.find((h) => h.id === activeId);

  return (
    <figure aria-label="How I think: packet journey from internet to users">
      <div className="relative rounded-xl border border-white/10 bg-ink-900/70 p-4 backdrop-blur sm:p-6">
        {!reduceMotion && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-1/2 hidden h-px -translate-y-8 bg-white/10 md:block md:top-[52px]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="packet-dot absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary"
                style={{ animationDelay: `${i * 1.3}s` }}
              />
            ))}
          </div>
        )}
        <ol className="relative grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
          {HOPS.map((hop) => {
            const isActive = hop.id === activeId;
            return (
              <li key={hop.id}>
                <button
                  type="button"
                  data-hover
                  onMouseEnter={() => setActiveId(hop.id)}
                  onFocus={() => setActiveId(hop.id)}
                  onClick={() => setActiveId(hop.id)}
                  aria-pressed={isActive}
                  className={`flex w-full flex-col items-center gap-2 rounded-lg border p-3 text-center transition-colors ${
                    isActive
                      ? "border-primary/60 bg-primary/10 text-paper"
                      : "border-white/10 bg-ink-800/60 text-paper-dim hover:border-primary/30 hover:text-paper"
                  }`}
                >
                  <hop.Icon size={20} className={isActive ? "text-primary" : ""} aria-hidden="true" />
                  <span className="text-xs font-semibold">{hop.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <figcaption className="mt-4 min-h-[3rem] rounded-lg border border-white/10 bg-ink-950/60 p-3 text-center text-sm text-paper-dim" aria-live="polite">
          {active ? (
            <>
              <span className="font-semibold text-primary">{active.label}:</span> {active.tooltip}
            </>
          ) : null}
        </figcaption>
      </div>
    </figure>
  );
}
