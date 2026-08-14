import React from "react";
import { cn } from "@/lib/utils";

const BentoGrid = ({ className, children }) => (
  <div className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-4", className)}>{children}</div>
);

const BentoCard = ({ className, children }) => (
  <div className={cn("surface surface-hover p-5", className)}>{children}</div>
);

export { BentoGrid, BentoCard };
