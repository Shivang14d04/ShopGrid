import React from "react";
import { cn } from "@/lib/utils";

const AuroraBackground = ({ className }) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 -z-10 overflow-hidden bg-slate-950",
        className
      )}
    >
      <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(120deg,rgba(37,99,235,0.22),transparent_42%),linear-gradient(240deg,rgba(20,184,166,0.14),transparent_38%),radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_40%)]" />
      <div className="absolute inset-0 hero-grid opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(2,6,23,0.55)_100%)]" />
    </div>
  );
};

export default AuroraBackground;
