"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error";
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  size = "md",
  variant = "default",
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colorClasses = {
    default: "bg-[var(--color-primary)]",
    success: "bg-[var(--color-success)]",
    warning: "bg-[var(--color-warning)]",
    error: "bg-[var(--color-error)]",
  };

  const glowColors = {
    default: "shadow-[0_0_8px_var(--color-primary)]",
    success: "shadow-[0_0_8px_var(--color-success)]",
    warning: "shadow-[0_0_8px_var(--color-warning)]",
    error: "shadow-[0_0_8px_var(--color-error)]",
  };

  return (
    <div className={clsx("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1 text-[10px] uppercase tracking-wider">
          {label && <span className="opacity-70">{label}</span>}
          {showValue && (
            <span className="font-mono">{percentage.toFixed(1)}%</span>
          )}
        </div>
      )}
      <div
        className={clsx(
          "w-full bg-[var(--color-accent-dim)] overflow-hidden",
          sizeClasses[size]
        )}
      >
        <motion.div
          className={clsx(
            "h-full",
            colorClasses[variant],
            glowColors[variant]
          )}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Point Map (RAM visualization like edex-ui)
interface PointMapProps {
  value: number;
  max?: number;
  rows?: number;
  cols?: number;
  className?: string;
}

export function PointMap({
  value,
  max = 100,
  rows = 8,
  cols = 32,
  className,
}: PointMapProps) {
  const totalPoints = rows * cols;
  const activePoints = Math.floor((value / max) * totalPoints);

  return (
    <div
      className={clsx("grid gap-[2px]", className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: totalPoints }).map((_, index) => {
        const isActive = index < activePoints;
        const isMid = index >= activePoints && index < activePoints + totalPoints * 0.1;

        return (
          <motion.div
            key={index}
            className={clsx(
              "w-1 h-1.5 rounded-[1px]",
              isActive
                ? "bg-[var(--color-primary)]"
                : isMid
                ? "bg-[var(--color-primary)] opacity-30"
                : "bg-[var(--color-primary)] opacity-10"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : isMid ? 0.3 : 0.1 }}
            transition={{ delay: index * 0.001 }}
          />
        );
      })}
    </div>
  );
}

// Circular Progress
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showValue?: boolean;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 4,
  label,
  showValue = true,
  variant = "default",
  className,
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    default: "var(--color-primary)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    error: "var(--color-error)",
  };

  return (
    <div className={clsx("relative inline-flex flex-col items-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent-dim)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[variant]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 4px ${colors[variant]})`,
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-mono">{Math.round(percentage)}%</span>
        </div>
      )}
      {label && (
        <span className="mt-2 text-[10px] uppercase tracking-wider opacity-70">
          {label}
        </span>
      )}
    </div>
  );
}
