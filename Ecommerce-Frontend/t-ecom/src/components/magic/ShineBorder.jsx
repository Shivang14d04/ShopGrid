import React from "react";
import { cn } from "@/lib/utils";

const ShineBorder = ({ className, children }) => {
  return (
    <div className={cn("rounded-2xl border border-transparent bg-[linear-gradient(var(--card),var(--card))] relative", className)}>
      <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(120deg,rgba(255,255,255,0.14),transparent_35%,rgba(59,130,246,0.12),transparent_65%,rgba(255,255,255,0.12))] opacity-40" />
      <div className="relative rounded-2xl border border-border bg-card">{children}</div>
    </div>
  );
};

export default ShineBorder;
