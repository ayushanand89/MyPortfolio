"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Kolkata",
});

/**
 * Live Delhi clock - the "a real person is here" signal. Renders a fixed-width
 * placeholder on the server so hydration never shifts layout.
 */
export function LocalTime({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={cn("tabular-nums", className)}>
      {time ?? "--:--"}&nbsp;IST
    </span>
  );
}
