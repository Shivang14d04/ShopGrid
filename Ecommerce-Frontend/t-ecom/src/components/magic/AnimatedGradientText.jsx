import React from "react";
import { cn } from "@/lib/utils";

const AnimatedGradientText = ({ className, children }) => {
  return (
    <span
      className={cn(
        "bg-[linear-gradient(90deg,#2563eb,#14b8a6,#8b5cf6,#2563eb)] bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer",
        className
      )}
    >
      {children}
    </span>
  );
};

export default AnimatedGradientText;
