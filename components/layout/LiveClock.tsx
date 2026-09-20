"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

/** Live clock for Asia/Colombo. SSR-safe: renders a placeholder until client hydration ticks. */
export function LiveClock({ className }: { readonly className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) {
    return (
      <span className={className} suppressHydrationWarning>
        --:--:-- · -- --- ----
      </span>
    );
  }

  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: siteConfig.timeZone,
  }).format(now);
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: siteConfig.timeZone,
  }).format(now);

  return (
    <time dateTime={now.toISOString()} className={className} suppressHydrationWarning>
      {time} · {date}
    </time>
  );
}
