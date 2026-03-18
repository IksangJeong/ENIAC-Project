"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface DashboardGridProps {
  children: ReactNode;
  className?: string;
}

export function DashboardGrid({ children, className }: DashboardGridProps) {
  return (
    <div
      className={clsx(
        "grid gap-3 p-3 h-full",
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-12",
        "grid-rows-[auto_1fr_1fr_auto] lg:grid-rows-[1fr_1fr_1fr]",
        className
      )}
    >
      {children}
    </div>
  );
}

// Grid Area Components for specific layouts
interface GridAreaProps {
  children: ReactNode;
  className?: string;
  area?: string;
  delay?: number;
}

export function GridArea({
  children,
  className,
  area,
  delay = 0,
}: GridAreaProps) {
  return (
    <motion.div
      className={clsx("overflow-hidden", className)}
      style={area ? { gridArea: area } : undefined}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

// Left Sidebar Area (Server Status, Online Users, Crowd Level)
export function LeftColumn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-3",
        "lg:col-span-3 lg:row-span-3",
        className
      )}
    >
      {children}
    </div>
  );
}

// Center Area (Quote, Challenge, Schedule)
export function CenterColumn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-3",
        "lg:col-span-6 lg:row-span-3",
        className
      )}
    >
      {children}
    </div>
  );
}

// Right Sidebar Area (Commit Ranking, Algorithm Challenge)
export function RightColumn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-3",
        "lg:col-span-3 lg:row-span-3",
        className
      )}
    >
      {children}
    </div>
  );
}
