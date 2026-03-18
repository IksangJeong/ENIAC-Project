"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type StatusType = "online" | "offline" | "warning" | "info";

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

export function StatusIndicator({
  status,
  label,
  size = "md",
  pulse = true,
  className,
}: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const statusClasses = {
    online: "bg-[var(--color-success)] shadow-[0_0_8px_var(--color-success)]",
    offline: "bg-[var(--color-error)] shadow-[0_0_8px_var(--color-error)]",
    warning: "bg-[var(--color-warning)] shadow-[0_0_8px_var(--color-warning)]",
    info: "bg-[var(--color-info)] shadow-[0_0_8px_var(--color-info)]",
  };

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <motion.div
        className={clsx(
          "rounded-full",
          sizeClasses[size],
          statusClasses[status]
        )}
        animate={
          pulse
            ? {
                opacity: [1, 0.5, 1],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {label && (
        <span className="text-xs uppercase tracking-wider">{label}</span>
      )}
    </div>
  );
}

// Connection Status Component
interface ConnectionStatusProps {
  isConnected: boolean;
  className?: string;
}

export function ConnectionStatus({ isConnected, className }: ConnectionStatusProps) {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <StatusIndicator
        status={isConnected ? "online" : "offline"}
        size="sm"
      />
      <span className="text-[10px] uppercase tracking-wider opacity-70">
        {isConnected ? "CONNECTED" : "DISCONNECTED"}
      </span>
    </div>
  );
}

// Crowd Level Indicator
interface CrowdLevelProps {
  level: "low" | "medium" | "high";
  className?: string;
}

export function CrowdLevel({ level, className }: CrowdLevelProps) {
  const levelConfig = {
    low: {
      color: "var(--color-success)",
      bars: 1,
      label: "LOW",
    },
    medium: {
      color: "var(--color-warning)",
      bars: 2,
      label: "MEDIUM",
    },
    high: {
      color: "var(--color-error)",
      bars: 3,
      label: "HIGH",
    },
  };

  const config = levelConfig[level];

  return (
    <div className={clsx("flex items-center gap-3", className)}>
      <div className="flex items-end gap-1 h-4">
        {[1, 2, 3].map((bar) => (
          <motion.div
            key={bar}
            className="w-1.5"
            style={{
              height: `${bar * 5}px`,
              background:
                bar <= config.bars
                  ? config.color
                  : "var(--color-accent-dim)",
              boxShadow:
                bar <= config.bars
                  ? `0 0 4px ${config.color}`
                  : "none",
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: bar * 0.1 }}
          />
        ))}
      </div>
      <span className="text-[10px] uppercase tracking-wider">
        {config.label}
      </span>
    </div>
  );
}
