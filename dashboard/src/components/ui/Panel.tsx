"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface PanelProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  delay?: number;
  noPadding?: boolean;
  glowOnHover?: boolean;
}

export function Panel({
  title,
  subtitle,
  children,
  className,
  contentClassName,
  delay = 0,
  noPadding = false,
  glowOnHover = false,
}: PanelProps) {
  return (
    <motion.div
      className={clsx(
        "panel relative",
        glowOnHover && "hover:glow-box transition-shadow duration-300",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-[var(--color-primary)] opacity-60" />
      <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-[var(--color-primary)] opacity-60" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-[var(--color-primary)] opacity-60" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-[var(--color-primary)] opacity-60" />

      {/* Title Bar */}
      {title && (
        <div className="panel-title">
          <span className="font-medium tracking-wider">{title}</span>
          {subtitle && (
            <span className="text-[10px] opacity-50">{subtitle}</span>
          )}
        </div>
      )}

      {/* Content */}
      <div
        className={clsx(
          !noPadding && "panel-content",
          contentClassName
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}
