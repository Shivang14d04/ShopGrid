import React from "react";
import { cn } from "@/lib/utils";

const Marquee = ({ className, reverse = false, children }) => {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className={cn("flex w-max gap-4 animate-marquee", reverse && "motion-reduce:animate-none")}
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {children}
        {children}
      </div>
    </div>
  );
};

export default Marquee;
